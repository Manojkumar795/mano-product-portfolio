"""Code-native grayscale interface studies; existing media-slot dimensions are unchanged."""
from pathlib import Path
from html import escape
import textwrap
OUT=Path(__file__).resolve().parents[2]/'public/homiq/fidelity'
OUT.mkdir(exist_ok=True)
class Board:
 def __init__(self,w,h,title,note):
  self.w=w;self.h=h;self.p=[];self.rect(0,0,w,h,'#fff',10);self.text(24,32,title,20,'#505a63')
 def rect(self,x,y,w,h,fill='#f4f5f4',r=4,stroke='none'):
  self.p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}"/>')
 def text(self,x,y,t,size=10,color='#59605b',anchor='start'):
  self.p.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" text-anchor="{anchor}">{escape(t)}</text>')
 def line(self,x,y,x2,y2,c='#cdd1cd'):
  self.p.append(f'<path d="M{x} {y}L{x2} {y2}" stroke="{c}" fill="none"/>')
 def circle(self,x,y,r,fill='#e8ebe8',stroke='none'):
  self.p.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}"/>')
 def imagebox(self,x,y,w,h,label):
  self.rect(x,y,w,h,'#f1f3f1',3,'#d8dcd8');self.line(x,y,x+w,y+h,'#e0e4e0');self.line(x+w,y,x,y+h,'#e0e4e0');self.rect(x+5,y+h/2-9,w-10,18,'#f1f3f1',0);self.text(x+w/2,y+h/2+3,label,9,anchor='middle')
 def arrow(self,x,y,x2):
  self.line(x,y,x2,y);self.line(x2-4,y-3,x2,y);self.line(x2-4,y+3,x2,y)
 def save(self,name,title):
  (OUT/name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" role="img"><title>{escape(title)}</title><g font-family="Arial,sans-serif">'+''.join(self.p)+'</g></svg>')

def phone(b,x,y,w,h,title,kind):
 b.rect(x,y,w,h,'#fbfcfb',16,'#aab1ab');b.text(x+12,y+17,'9:41',7);b.rect(x+w/2-17,y+10,34,4,'#ced4ce',2);b.text(x+w-12,y+17,'•••',7,anchor='end');b.line(x+11,y+30,x+w-11,y+30)
 b.text(x+12,y+52,title,12,'#303832');inner=w-24
 def field(label,yy,value=''):
  b.text(x+12,y+yy,label,8,'#7a827b');b.rect(x+12,y+yy+7,inner,27,'#f1f3f1',4,'#d4dad4');b.text(x+20,y+yy+24,value or label,9)
 def button(label):
  b.rect(x+12,y+h-45,inner,25,'#e0e5e0',5,'#bac4ba');b.text(x+w/2,y+h-29,label,9,'#3e4840','middle')
 def row(label,yy,detail=''):
  b.rect(x+12,y+yy,inner,31,'#f1f3f1',4,'#d9dfd9');b.text(x+20,y+yy+14,label,9)
  if detail:b.text(x+20,y+yy+25,detail,7,'#838b83')
  else:b.text(x+w-20,y+yy+19,'›',12,anchor='end')
 if kind=='welcome':
  b.imagebox(x+12,y+69,inner,135,'Image placeholder');b.text(x+12,y+230,'HOMIQ',14,'#303832');b.text(x+12,y+250,'Smart-home control',9);button('Get started')
 elif kind in ['signin','create','recover','change','details']:
  fields={'signin':['Email','Password'],'create':['Name','Email','Password'],'recover':['Email'],'change':['New password','Confirm password'],'details':['Name','Email address']}[kind]
  for i,label in enumerate(fields):field(label,83+i*56,'••••••••' if 'assword' in label else '')
  if kind=='signin':b.text(x+12,y+221,'Forgot password?',8)
  if kind=='details':b.text(x+12,y+216,'Email is locked',8)
  if kind=='recover':b.text(x+12,y+153,'Send a verification code',8)
  button({'signin':'Sign in','create':'Create account','recover':'Send code','change':'Save password','details':'Save changes'}[kind])
 elif kind=='verify':
  b.text(x+12,y+86,'Verification code',9)
  for i in range(6):
   ww=(inner-20)/6;b.rect(x+12+i*(ww+4),y+100,ww,27,'#f1f3f1',3,'#cdd4cd');b.text(x+12+i*(ww+4)+ww/2,y+118,'–',9,anchor='middle')
  b.text(x+12,y+151,'Resend code',8);button('Verify code')
 elif kind=='profile':
  b.circle(x+w/2,y+100,25);b.text(x+w/2,y+104,'Profile',9,anchor='middle');row('Profile details',149);row('Settings',191);row('Notifications',233);button('Sign out')
 elif kind=='notifications':
  for i,label in enumerate(['Device updates','Scene activity','Home alerts']):
   yy=86+i*47;b.text(x+12,y+yy+11,label,9);b.rect(x+w-40,y+yy,25,13,'#d7dfd7',7);b.circle(x+w-22,y+yy+6.5,5,'#fff');b.line(x+12,y+yy+28,x+w-12,y+yy+28)
  button('Done')
 elif kind=='home':
  b.text(x+12,y+80,'Device categories',9);cw=(inner-8)/3
  for i,l in enumerate(['TV','Light','AC']):b.rect(x+12+i*(cw+4),y+90,cw,37,'#edf1ed',4,'#d8ded8');b.text(x+12+i*(cw+4)+cw/2,y+112,l,8,anchor='middle')
  b.text(x+12,y+151,'Scenes',9);row('Morning',163);row('Goodnight',204);nav(b,x,y,w,h)
 elif kind=='rooms':
  for i,l in enumerate(['Living room','Lounge','TV lounge']):
   yy=y+72+i*66;b.imagebox(x+12,yy,inner,53,'Room image');b.rect(x+16,yy+31,inner-8,17,'#f8f9f8',2);b.text(x+20,yy+43,l,8)
  nav(b,x,y,w,h)
 elif kind=='room':
  field('Room name',78);b.text(x+12,y+137,'Room photo',8);b.imagebox(x+12,y+147,inner,65,'Choose photo');row('Select devices',226);button('Add room')
 elif kind=='light':
  b.imagebox(x+28,y+87,w-56,91,'Scan / NFC');row('Light found',194);b.text(x+12,y+244,'Room → Name → Added',8);button('Continue')
 elif kind=='scene':
  field('Scene name',78)
  for i,l in enumerate(['Bedroom light','TV','Air conditioner']):
   yy=141+i*31;b.rect(x+12,y+yy,10,10,'#e2e8e2',2,'#aeb9ae');b.text(x+29,y+yy+9,l,8);b.text(x+w-15,y+yy+9,'ON / OFF',7,anchor='end')
  button('Create scene')
 elif kind=='control':
  b.text(x+12,y+77,'Living room',8);b.text(x+w/2,y+109,'Temperature',9,anchor='middle');b.circle(x+w/2,y+160,38,'#f1f4f1','#c2cbc2');b.text(x+w/2,y+166,'24°C',20,'#48534a','middle');b.text(x+w/2,y+224,'Power ON',9,anchor='middle');b.text(x+w/2,y+246,'Swing controls',9,anchor='middle')
 b.rect(x+w*.34,y+h-10,w*.32,2,'#bbc4bb',1)

def nav(b,x,y,w,h):
 b.line(x+12,y+h-42,x+w-12,y+h-42)
 for i,l in enumerate(['Home','Rooms','Profile']):b.text(x+12+(w-24)*(i+.5)/3,y+h-25,l,7,anchor='middle')

b=Board(1002,1294.969,'Entry, recovery & account structure','Mid-fidelity · grayscale components, hierarchy and screen relationships')
rows=[ [('Welcome','welcome'),('Sign in','signin'),('Create account','create')], [('Recover password','recover'),('Verify code','verify'),('Change password','change')], [('Profile','profile'),('Profile details','details'),('Notifications','notifications')] ]
for j,row in enumerate(rows):
 yy=110+j*394
 for i,(title,kind) in enumerate(row):
  xx=55+i*363;phone(b,xx,yy,166,340,title,kind)
  if i<2:b.arrow(xx+182,yy+170,xx+330)
b.save('mid-entry.svg','Mid-fidelity entry and account wireframes')

b=Board(896,883.789,'Rooms, devices & scene structure','Mid-fidelity · content blocks and states without final branding or photography')
for j,row in enumerate([[('My Home','home'),('My Rooms','rooms'),('Create room','room')],[('Add a light','light'),('Scene setup','scene'),('Air conditioner','control')]]):
 for i,(title,kind) in enumerate(row):
  xx=58+i*316;yy=100+j*340;phone(b,xx,yy,148,320,title,kind)
  if i<2:b.arrow(xx+166,yy+160,xx+294)
# Preserve the existing white two-line caption in its original overlay position.
b.save('mid-structure.svg','Mid-fidelity room, device and scene wireframes')
