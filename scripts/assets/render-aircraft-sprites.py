"""Render 720 actual viewing angles of the existing FlightGear-derived exterior.
No new model or browser dependency. Output is a single optimized WebP atlas.
"""
import json, struct, pathlib, subprocess, tempfile
import numpy as np
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parents[2]
b = (ROOT/'public/altitude/boeing-777-300er.glb').read_bytes()
n = struct.unpack_from('<I', b, 12)[0]; j = json.loads(b[20:20+n]); data = b[28+n:]
def accessor(i):
 a=j['accessors'][i]; v=j['bufferViews'][a['bufferView']]; size={'SCALAR':1,'VEC3':3}[a['type']]
 dtype={5126:'<f4',5123:'<u2',5125:'<u4'}[a['componentType']]
 return np.frombuffer(data,dtype=dtype,count=a['count']*size,offset=v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(-1,size)
parts=[]
for mesh in j['meshes']:
 p=mesh['primitives'][0]; vertices=accessor(p['attributes']['POSITION']); faces=accessor(p['indices']).reshape(-1,3)
 normal=np.cross(vertices[faces[:,1]]-vertices[faces[:,0]],vertices[faces[:,2]]-vertices[faces[:,0]])
 norms=np.zeros_like(vertices)
 for k in range(3): np.add.at(norms,faces[:,k],normal)
 norms/=np.maximum(np.linalg.norm(norms,axis=1,keepdims=True),1e-9)
 color=np.array(j['materials'][p['material']]['pbrMetallicRoughness']['baseColorFactor'][:3])
 parts.append((vertices[faces],norms[faces],color))
allv=np.concatenate([p[0] for p in parts]); center=(allv.min(axis=(0,1))+allv.max(axis=(0,1)))/2
scale=2.0/np.ptp(allv,axis=(0,1)).max()
records=[]
for v,n,c in parts:
 rows=np.concatenate([((v-center)*scale).reshape(-1,9),n.reshape(-1,9),np.broadcast_to(c,(len(v),3))],axis=1).astype('float32');records.append(rows)
rows=np.concatenate(records)
cpp=r'''
#include <cmath>
#include <fstream>
#include <vector>
#include <algorithm>
#include <string>
struct V{float x,y,z; V operator+(V b){return{x+b.x,y+b.y,z+b.z};} V operator*(float a){return{x*a,y*a,z*a};}};
float dot(V a,V b){return a.x*b.x+a.y*b.y+a.z*b.z;} V unit(V a){return a*(1/std::sqrt(dot(a,a)));}
int main(int argc,char**argv){int W=800,H=520;std::ifstream in(argv[1],std::ios::binary);int N;in.read((char*)&N,4);std::vector<float> a(N*21);in.read((char*)a.data(),a.size()*4);
for(int frame=0;frame<720;frame++){float yaw=(frame*.5+45)*M_PI/180, el=19*M_PI/180;
V right={std::cos(yaw),0,-std::sin(yaw)},up={-std::sin(yaw)*std::sin(el),std::cos(el),-std::cos(yaw)*std::sin(el)},eye={std::sin(yaw)*std::cos(el),std::sin(el),std::cos(yaw)*std::cos(el)};
V light=unit({-.4,.8,.65}); std::vector<float> z(W*H,-1e6); std::vector<unsigned char> out(W*H*3,0);
for(int i=0;i<N;i++){auto f=&a[i*21];float px[3],py[3],pz[3];V normals[3];for(int k=0;k<3;k++){V p={f[k*3],f[k*3+1],f[k*3+2]},n={f[9+k*3],f[10+k*3],f[11+k*3]};px[k]=W/2+dot(p,right)*W*.46;py[k]=H*.52-dot(p,up)*W*.46;pz[k]=dot(p,eye);normals[k]={dot(n,right),dot(n,up),dot(n,eye)};}
float den=(py[1]-py[2])*(px[0]-px[2])+(px[2]-px[1])*(py[0]-py[2]);if(std::abs(den)<.001)continue;
int x0=std::max(0,(int)std::floor(std::min({px[0],px[1],px[2]}))),x1=std::min(W-1,(int)std::ceil(std::max({px[0],px[1],px[2]}))),y0=std::max(0,(int)std::floor(std::min({py[0],py[1],py[2]}))),y1=std::min(H-1,(int)std::ceil(std::max({py[0],py[1],py[2]})));
for(int y=y0;y<=y1;y++)for(int x=x0;x<=x1;x++){float aa=((py[1]-py[2])*(x+.5-px[2])+(px[2]-px[1])*(y+.5-py[2]))/den,bb=((py[2]-py[0])*(x+.5-px[2])+(px[0]-px[2])*(y+.5-py[2]))/den,cc=1-aa-bb;if(aa<0||bb<0||cc<0)continue;float depth=aa*pz[0]+bb*pz[1]+cc*pz[2];int idx=y*W+x;if(depth<z[idx])continue;z[idx]=depth;V n=unit(normals[0]*aa+normals[1]*bb+normals[2]*cc);if(n.z<0)n=n*-1;float diffuse=std::max(0.f,dot(n,light));float spec=std::pow(std::max(0.f,dot(n,unit(light+V{0,0,1}))),48)*.2;float shade=.38+.55*diffuse+.12*std::max(0.f,-n.x);for(int c=0;c<3;c++)out[idx*3+c]=std::min(255,(int)(255*(f[18+c]*shade+spec)));}}
std::string p=std::string(argv[2])+"/frame-"+std::to_string(frame)+".ppm";std::ofstream os(p,std::ios::binary);os<<"P6\n"<<W<<" "<<H<<"\n255\n";os.write((char*)out.data(),out.size());
std::ofstream mask(p+".mask",std::ios::binary);for(auto d:z){unsigned char v=d>-1e5?255:0;mask.write((char*)&v,1);}
}}
'''
with tempfile.TemporaryDirectory() as temp:
 t=pathlib.Path(temp);(t/'render.cpp').write_text(cpp)
 with (t/'geometry.bin').open('wb') as out:out.write(struct.pack('<i',len(rows)));out.write(rows.tobytes())
 subprocess.run(['g++','-O3','-o',str(t/'render'),str(t/'render.cpp')],check=True)
 subprocess.run([str(t/'render'),str(t/'geometry.bin'),str(t)],check=True)
 atlas=Image.new('RGBA',(240*30,156*24))
 for i in range(720):
  p=t/f'frame-{i}.ppm';im=Image.open(p).convert('RGBA');im.putalpha(Image.frombytes('L',(800,520),pathlib.Path(str(p)+'.mask').read_bytes()));im=im.resize((240,156),Image.Resampling.LANCZOS);atlas.paste(im,((i%30)*240,(i//30)*156))
 atlas.save(ROOT/'public/altitude/boeing-777-smooth.webp',quality=88,method=6)
 atlas.crop((0,0,240,156)).save(ROOT/'public/altitude/boeing-777-front.webp',quality=90)
print('Rendered',len(rows),'triangles into 720 distinct angles')
