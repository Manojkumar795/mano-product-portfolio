"""Build original code-native Homiq artifacts inside the retained media boxes.
Authentic PNGs are embedded unchanged with preserveAspectRatio='xMidYMid meet'.
"""
from pathlib import Path
import base64, re, json, math, html, shutil, textwrap
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/homiq/artifacts';OUT.mkdir(exist_ok=True)
GREEN='#56b975';BLUE='#587eaf';GOLD='#f0c342';INK='#505a63';MUTED='#7a7a7a';DARK='#141817';SAND='#efcc9b'
COLORS=[GREEN,BLUE,GOLD,'#83c2c8','#ec955d','#795d8c','#bd628d','#c3b984','#c95861','#7b8186']
def esc(v):return html.escape(str(v),quote=True)
class Board:
 def __init__(self,w,h,title='',note='',bg='white'):
  self.w=w;self.h=h;self.title=title;self.note=note;self.parts=[]
  if bg!='none':self.rect(0,0,w,h,bg,10)
  if title:self.text(24,32,title,min(20,w/24),INK,weight=500,width=w-48)
  if note:self.text(24,58,note,min(12,w/36),MUTED,width=w-48)
 def rect(self,x,y,w,h,fill='white',r=8,stroke='none'):
  self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}"/>')
 def line(self,x,y,x2,y2,c='#d9ddde',dash=''):
  self.parts.append(f'<path d="M{x} {y}L{x2} {y2}" fill="none" stroke="{c}" stroke-width="1.5"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
 def circle(self,x,y,r,fill,stroke='none',sw=1):
  self.parts.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
 def text(self,x,y,value,size=14,color=INK,weight=400,width=None,anchor='start',lh=None):
  lines=[]
  for part in str(value).split('\n'):
   lines+=textwrap.wrap(part,max(1,int(width/(size*.51)))) if width else [part]
  lh=lh or size*1.4
  self.parts.append(f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">'+''.join(f'<tspan x="{x}" dy="{0 if i==0 else lh}">{esc(v)}</tspan>' for i,v in enumerate(lines))+'</text>')
  return len(lines)*lh
 def image(self,name,x,y,w,h,folder="screens"):
  data=base64.b64encode((ROOT/'public/homiq'/folder/f'{name}.png').read_bytes()).decode()
  self.parts.append(f'<image x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{data}"/>')
 def save(self,name):
  (OUT/name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" role="img"><title>{esc(self.title)}</title><desc>{esc(self.note)}</desc><g font-family="Arial, sans-serif">'+''.join(self.parts)+'</g></svg>')

ART={}
def register(sec,var,kind,title,note='',data=None):ART[(sec,var)]=(kind,title,note,data)

def chart(b,labels,values,unit='visible controls / frame',maximum=12):
 # Retain the reference's horizontal bars, white ground and muted grid.
 left=b.w*.32;right=b.w-35;top=88;bottom=b.h-42
 for i in range(7):
  x=left+(right-left)*i/6;b.line(x,top,x,bottom,'#eceff0');b.text(x,bottom+18,f'{maximum*i/6:.1f}'.rstrip('0').rstrip('.'),10,anchor='middle')
 step=(bottom-top)/len(labels)
 for i,(label,value) in enumerate(zip(labels,values)):
  y=top+step*i+step*.15;b.text(left-12,y+step*.35,label,min(13,b.w/38),width=left-34,anchor='end')
  b.rect(left,y,(right-left)*value/maximum,step*.57,COLORS[i%len(COLORS)],0)
  b.text(left+(right-left)*value/maximum+5,y+step*.4,str(value),11,INK)
 b.text(right,b.h-8,unit,10,MUTED,anchor='end')

def cards(b,items,cols=2,top=90,bottom=25):
 gap=16;cw=(b.w-48-gap*(cols-1))/cols;rows=math.ceil(len(items)/cols);ch=(b.h-top-bottom-gap*(rows-1))/rows
 for i,(title,body) in enumerate(items):
  x=24+(i%cols)*(cw+gap);y=top+(i//cols)*(ch+gap)
  b.rect(x,y,cw,ch,'#f3f6f3',8,'#dce5dd');b.text(x+16,y+26,title,min(17,cw/15),'#266641',500,width=cw-32);b.text(x+16,y+55,body,min(14,cw/20),INK,width=cw-32)

def gallery(b,names,cols=3,top=95,bottom=22,caption=True):
 rows=math.ceil(len(names)/cols);gap=20;cw=(b.w-40-gap*(cols-1))/cols;rh=(b.h-top-bottom-gap*(rows-1))/rows
 for i,name in enumerate(names):
  x=20+(i%cols)*(cw+gap);y=top+(i//cols)*(rh+gap);label=name.replace('-',' ').title()
  ph=min(rh-(30 if caption else 0),cw*844/390);pw=ph*390/844; y+=(rh-ph-(30 if caption else 0))/2
  b.image(name,x+(cw-pw)/2,y,pw,ph)
  if caption:b.text(x+cw/2,y+ph+19,label,min(13,cw/14),INK,anchor='middle')

def wirephone(b,x,y,w,h,title,items,mode='list'):
 b.rect(x,y,w,h,'#fcfcfc',22,'#969c99');b.rect(x+w*.35,y+9,w*.3,5,'#b4bab6',3)
 fs=min(13,w/13);b.text(x+12,y+37,title,fs,'#333',500,width=w-24)
 yy=y+55
 if mode=='dial':
  items=['Power ON','Swing controls'];r=min(w*.24,max(10,(h-177)/2));b.circle(x+w/2,yy+r+12,r,'#f4f4f4','#969c99',2);b.text(x+w/2,yy+r+17,'24°C',fs*1.6,anchor='middle');yy+=r*2+28
 for i,label in enumerate(items):
  hh=min(39,(h-(yy-y)-55)/max(1,len(items)-i));b.rect(x+10,yy,w-20,hh-6,'#ebedeb',6);b.text(x+18,yy+hh*.55,label,fs*.82,'#555',width=w-36);yy+=hh
 b.rect(x+12,y+h-39,w-24,25,'#d9dedb',12);b.text(x+w/2,y+h-22,'Continue',fs*.85,anchor='middle')

def wireboard(b,data):
 names=data or [('Home',['Categories','Scenes','Frequently used']),('Rooms',['Living room','Lounge','Add room'])]
 n=len(names);gap=18;top=88;avail=b.h-top-34;w=min((b.w-44-gap*(n-1))/n,avail*390/780);h=min(avail,w*2)
 start=(b.w-(n*w+(n-1)*gap))/2
 for i,(title,items) in enumerate(names):wirephone(b,start+i*(w+gap),top,w,h,title,items,'dial' if 'AC' in title else 'list')

def arrow(b,x,y,x2,y2,c='#91a798',dash=''):
 b.line(x,y,x2,y2,c,dash)
 if x==x2:
  d=1 if y2>y else -1;b.line(x2-3,y2-4*d,x2,y2,c);b.line(x2+3,y2-4*d,x2,y2,c)
 else:
  d=1 if x2>x else -1;b.line(x2-4*d,y2-3,x2,y2,c);b.line(x2-4*d,y2+3,x2,y2,c)

def flowmap(b):
 # Three distinct destinations, with children branching from a shared spine.
 cols=[('HOME',['Device categories','Morning / Night','Frequently used']),('ROOMS',['Photo-led room list','Room → appliances','Add → room setup']),('PROFILE',['Profile details','Settings entry','Push notifications'])]
 cw=(b.w-96)/3
 for i,(title,items) in enumerate(cols):
  x=28+i*(cw+20)
  b.text(x,100,f'0{i+1}',11,'#28663f',500)
  b.text(x+30,101,title,19,DARK,500)
  b.line(x,115,x+cw,115,'#dce5dd')
  b.line(x+7,132,x+7,218,'#9eafa0')
  for j,label in enumerate(items):
   y=138+j*40;b.line(x+7,y-5,x+23,y-5,'#9eafa0');b.circle(x+7,y-5,2.5,'#28663f');b.text(x+32,y,label,14,INK)
 b.line(28,250,b.w-28,250,'#dce5dd')
 b.text(28,275,'SETUP PATHS',10,'#28663f',500)
 flows=[('DEVICE',['Scan / NFC','Light found','Room','Name','Added']),('ROOM',['Name','Photo','Devices','Added']),('SCENE',['Choose','Name','Devices','States','Added'])]
 for i,(title,steps) in enumerate(flows):
  y=298+i*37;b.text(28,y+17,title,11,'#28663f',500)
  width=(b.w-175)/5
  for j,label in enumerate(steps):
   x=126+j*(width+5);last=j==len(steps)-1
   b.rect(x,y,width-12,27,'#f0f5ef' if last else '#f6f7f5',4)
   b.text(x+(width-12)/2,y+18,label,12,'#28663f' if last else INK,anchor='middle')
   if not last:arrow(b,x+width-10,y+13,x+width,y+13)
 b.text(28,b.h-13,'Structural depth: Rooms 0 → appliance list 1 → control 2. Routing needs verification.',11,MUTED)

# Each declaration corresponds to an existing image variable and media rectangle.
register(919,'imgImage','hero','HOMIQ — intelligent living','Actual supplied welcome screen. Designer: Manoj Kumar N. No product UI altered.')
register(902,'imgImage','cards','A household, several mental models','Published research + HOMIQ audit implications',[
 ('Manageability','Brush et al., CHI 2011: managing a home system is an adoption barrier.'),('Shared understanding','Zeng & Roesner, USENIX 2019: make controls intelligible to multiple inhabitants.'),('Predictability','UChicago CS, Feb 2019: interacting rules can produce unexpected behavior.'),('Setup uncertainty','Permissions, discovery and pairing may fail; no failure UI supplied.')])
register(904,'imgImage','blank','','')
register(904,'imgImage1','context','Room context as the anchor','Experience principle: room → device → state → action')
register(328,'imgImage','competitors','Smart-home patterns, documented','Official product documentation · reviewed 21 Oct 2026')
audit=json.loads((ROOT/'docs/homiq/audit-data.json').read_text())
byid={row['id']:row for row in audit['screens']}
flow=audit['flows']
charts=[
 ('Journey length',[f['name'] for f in flow],[f['screen_count'] for f in flow],'frames incl. supplied result',6),
 ('Editable fields by task',[f['name'] for f in flow],[f['field_count'] for f in flow],'fields / flow; requiredness unverified',6),
 ('Repeated components',['Bottom navigation','Progress indicator','Named confirmation'],[len(audit['patterns'][k]) for k in ['bottom_navigation','segmented_progress','named_confirmation']],'screens showing component / 29',12),
 ('Product coverage',['Entry','Rooms','Setup','Controls','Scenes','Account'],[6,7,5,3,5,3],'screens / family; total 29',12),
 ('Control evidence score',['AC','Lamp','TV'],[r['total'] for r in audit['heuristic']['scores']],'points / 8; rubric below',8),
 ('Visible controls by screen',['Home','Rooms','Choose room','Room devices','Scene devices','Scene states','AC','Lamp','TV','Profile','Light name','Light added'],[byid[i]['action_count'] for i in ['my-home','my-rooms','device-select-location','room-select-devices','scene-select-devices','scene-set-device-states','air-conditioner','lamp','tv-remote','profile','device-name','device-added']],'controls / frame; fields excluded',18)]
for i,(title,labels,vals,unit,maximum) in enumerate(charts):register(342,'imgImage'+(str(i) if i else ''),'chart',title,'HOMIQ screen audit · 21 Oct 2026', (labels,vals,unit,maximum))
register(342,'imgImage6','mini','AUDIT / COVERAGE','29 original screens',('6 product families','Entry 6 · Rooms 7 · Setup 5 · Controls 3 · Scenes 5 · Account 3.'))
register(342,'imgImage7','mini','AUDIT / NAVIGATION','Structural depth, not tested taps',('Three root destinations','Rooms → list → control: depth 2. Verify Home access against the 1–2 tap target.'))
register(342,'imgImage8','mini','AUDIT / FEEDBACK','Supplied frame inventory',('3 named confirmations','Device, room and scene results. No error, offline or permission-denial frame supplied.'))
register(342,'imgImage9','research','How the audit becomes a product decision','Manual counts · original PNGs · rubric and proposed targets',None)
register(342,'imgImage10','donut','Screen coverage by family','Audit distribution · not respondents')
register(367,'imgImage','avatar','Everyday controller','Problem-space archetype')
register(470,'imgImage','avatar','Household organizer','Task responsibility archetype')
register(470,'imgIcon','journey','Visible controls at setup checkpoints','Audit counts · discovery 3, location 12, naming 3, confirmation 2')
register(530,'imgImage','ia','HOMIQ information architecture & task paths','Screenshot-derived structure · inferred navigation is qualified below')
register(565,'imgImage','mini','Setup confidence','Audit synthesis · product implication',('Setup confidence', 'Five setup frames; one text field. Keep the next step explicit and preserve input on retry.'))
register(565,'imgImage1','mini','Daily control','Audit synthesis · product implication',('Daily control', 'Three appliance types share room, identity, power and numeric state. Test precision across input models.'))
register(565,'imgImage2','identity','HOMIQ identity','Sampled from the supplied application')
register(565,'imgImage3','wordmark','','')
register(565,'imgImage4','mini','Room recognition','Audit synthesis · product implication',('Room recognition', 'Three photo cards have distinct names. Compare location-based finding with category-based finding.'))
register(565,'imgImage5','mini','Scene intent','Audit synthesis · product implication',('Scene intent', 'Six device choices precede four ON/OFF switches. Verify membership and final state separately.'))
register(565,'imgImage6','mini','Recovery & trust','Audit synthesis · product implication',('Recovery & trust', 'Three named results; no error frames supplied. Add retry, offline and permission guidance.'))
register(565,'imgImage7','matrix','Access model decision matrix','Criteria: recognition, access depth, density, recovery')
register(565,'imgImage8','actual','Room-first hierarchy','Actual UI',['my-rooms'])
register(565,'imgImage9','actual','Category-first access','Actual UI',['my-home'])
register(565,'imgImage10','actual','','',['scene-select-devices'])
register(565,'imgImage11','actual','','',['scene-set-device-states'])
register(565,'imgImage12','actual','','',['scene-name'])
register(565,'imgImage13','mini','Account audit','Observation → question',('Visible recovery path','Email → code → new password. Validate errors, expiry and resend expectations.'))
register(565,'imgImage14','mini','Profile audit','Observation → question',('Control & limits','Details editable; email locked. Explain policy and test comprehension.'))
register(565,'imgImage15','principles','Room → Device → State → Action','A shared context model for control')
register(565,'imgImage16','state','Prioritize confidence before complexity','Decision framework · validate with tasks')
wiredata=[('Add a light',['Scan / NFC','Light found','Choose room','Name → Added']),('Create room',['Name','Choose photo','Select devices','Add room']),('Create scene',['Name scene','Choose devices','Set ON / OFF','Create scene']),('Daily AC',['Living room','Power ON','Temperature','Swing'])]
register(639,'imgImage','wire','Discover','Task-structure exploration',wiredata[:1])
register(639,'imgImage1','wire','Organize','Task-structure exploration',wiredata[1:3])
register(639,'imgImage2','wire','Control','Task-structure exploration',wiredata[3:])
register(639,'imgImage3','flow','Device onboarding','5 supplied frames · 4 decision stages',['Scan / NFC', 'Light found', 'Select room', 'Name light', 'Added'])
register(639,'imgImage4','flow','Scene creation','5 supplied frames · 4 decision stages',['Choose', 'Name', 'Select devices', 'Set states', 'Added'])
register(657,'imgImage','roomboard','Rooms: hierarchy & personalization','Hierarchy exploration above; original room sequence below')
register(657,'imgImage1','accountboard','Entry, recovery & account management','9 original screens · profile data is a sample account')
register(720,'imgImage','gallery','One navigation shell. Appliance-specific controls.','Original HOMIQ screens · identity, power and value visible',['my-home', 'my-rooms', 'air-conditioner', 'lamp', 'tv-remote'])
register(733,'imgImage','beforeafter','Room identity','HOMIQ / 01',('rooms-before', 'my-rooms', 'Distinct names · explicit device counts'))
register(733,'discovery','beforeafter','Device discovery','HOMIQ / 02',('discovery-before', 'device-scan-or-nfc', 'Dedicated setup · focused instructions'))
register(733,'climate','beforeafter','Appliance control','HOMIQ / 03',('climate-before', 'air-conditioner', 'Visible bounds · named swing directions'))
register(733,'scenes','beforeafter','Scene intent','HOMIQ / 04',('scenes-before', 'scene-set-device-states', 'Explicit states · a specific committing action'))
register(798,'imgImage','palette','HOMIQ application palette','Screenshot-derived samples · distinct from the website editorial colors')
register(774,'imgImage','recovery','A recoverable path, beyond success','Proposed state framework · not implemented UI')
register(807,'imgImage','components','Components & state grammar','Observed consistency across 29 screens')
register(807,'imgImage1','type','Type, spacing & accessibility','Raster estimates · W3C WCAG 2.2, Dec 2024')
register(807,'imgImage2','foundation','Foundations & hierarchy','Observed patterns · implementation checks below')
register(823,'imgImage','sequences','Device setup & multi-device scenes','5 frames each · manual scenes; trigger editing outside supplied scope')
register(833,'imgImage','actual','','',['device-added'])
register(833,'imgImage1','frame','','')

# Infer exact existing media dimensions and generate the replacement in the same box.
slots={}
for p in (ROOT/'app/homiq/sections').glob('*.tsx'):
 sec=int(re.search(r'\d+',p.name)[0]);s=p.read_text()
 for m in re.finditer(r'<div([^>]*)>\s*<img([^>]*)',s):
  var=re.search(r'src=\{([^}]+)\}',m[2])[1];cls=m[1]
  wm=re.search(r'w-\[([\d.]+)px\]',cls);hm=re.search(r'h-\[([\d.]+)px\]',cls);sm=re.search(r'size-\[([\d.]+)px\]',cls)
  if wm and hm:slots[(sec,var)]=(float(wm[1]),float(hm[1]))
  elif sm:slots[(sec,var)]=(float(sm[1]),float(sm[1]))

for pair in ['imgImage','discovery','climate','scenes']:slots[(733,pair)]=(544,441)
slots[(798,'imgImage')]=(1001,245);slots[(470,'imgIcon')]=(874,215)
# Retain reproducible legacy artwork in the source catalog. These slots now
# have live HTML counterparts, so their old dimensions are no longer in JSX.
legacy_slots={
 (530,'imgImage'):(1002.0,450.0),
 (565,'imgImage12'):(140.0,302.906),(565,'imgImage13'):(260.0,186.313),
 (565,'imgImage14'):(242.0,203.922),(565,'imgImage15'):(629.0,112.195),
 (639,'imgImage'):(230.0,329.18),(639,'imgImage1'):(473.0,329.297),
 (639,'imgImage2'):(230.0,329.18),(639,'imgImage3'):(472.0,330.055),
 (639,'imgImage4'):(473.0,330.156),
}
for key,value in legacy_slots.items():slots.setdefault(key,value)
alt={}
for (sec,var),(kind,title,note,data) in ART.items():
 w,h=slots[(sec,var)];b=Board(w,h,title if kind not in ['actual','hero','blank','avatar','frame','wordmark'] else '',note if kind not in ['actual','hero','blank','avatar','frame','wordmark'] else '',bg='none' if kind in ['hero','actual','frame','blank','wordmark','avatar','journey'] else 'white')
 if kind=='hero':b.image('welcome',92.87,55,277.26,600)
 elif kind=='actual':
  if title: b.text(w/2,19,title,12,anchor='middle')
  ph=h-(35 if title else 0);pw=ph*390/844;b.image(data[0],(w-pw)/2,h-ph,pw,ph)
 elif kind=='cards':
  # A research note, rather than four identical presentation cards.
  for i,(heading,body) in enumerate(data):
   y=92+i*72
   b.text(24,y+12,f'0{i+1}',11,'#28663f',500)
   b.text(58,y+12,heading,16,DARK,500)
   b.text(58,y+34,body,12,INK,width=w-86,lh=16)
   if i<3:b.line(58,y+58,w-28,y+58,'#e1e7e1')
 elif kind=='context':
  # The original sequence now has an explicit direction and a complete end.
  labels=[('HOME','Home'),('ROOM','Living room'),('DEVICE','Bedroom light'),('STATE','ON · 40%'),('ACTION','Adjust brightness')]
  for i,(level,label) in enumerate(labels):
   y=90+i*55
   if i<4:arrow(b,36,y+25,36,y+51)
   b.circle(36,y+11,11,'#eef3e9');b.text(36,y+15,str(i+1),11,'#28663f',500,anchor='middle')
   b.text(63,y+15,level,10,MUTED,500)
   b.text(154,y+16,label,16,DARK,500)
   if i<4:b.line(154,y+30,w-28,y+30,'#e6ebe5')
 elif kind=='competitors':
  cols=[24,160,364,568,772];cw=[136,204,204,204,206]
  headers=['PATTERN','APPLE HOME','GOOGLE HOME','SMARTTHINGS','HOMIQ OPPORTUNITY']
  content=[['Organize','Rooms / accessories','Homes / room placement','Rooms / devices','Keep room context visible'],['Discovery','Accessory setup code','Device setup guidance','QR / nearby / model','Explain scan & NFC choices'],['Scenes','States; separate triggers','Room grouping documented','IF / THEN routines','Separate membership / state'],['Control','Accessory-specific','Device settings by type','Capabilities vary','Shared shell, tailored input'],['Evaluate','Direct testing needed','Direct testing needed','Direct testing needed','Targets, feedback, clarity']]
  for i,(x,c) in enumerate(zip(cols,cw)):b.rect(x,82,c-2,40,'#edf3ee',0);b.text(x+9,106,headers[i],11,'#346442',500,width=c-16)
  for j,row in enumerate(content):
   y=129+j*46
   for i,cell in enumerate(row):b.text(cols[i]+9,y+13,cell,12,INK,width=cw[i]-17)
   b.line(24,y+38,w-24,y+38,'#e8ece9')
  b.text(24,h-13,'Apple Home (22 Sep 2025); Google Home and SmartThings (undated). Links in case-study text. No usability ranking.',11,MUTED)
 elif kind=='chart':chart(b,*data)
 elif kind=='mini':
  t,body=data
  if sec==342:
   b.parts=[];b.rect(0,0,w,h,'white',10)
   b.text(24,25,title.replace('AUDIT / ','')+' / SCREEN AUDIT',10,'#28663f',500)
   if var=='imgImage6':
    b.text(24,60,'6',31,DARK,500);b.text(51,58,'product families',17,DARK,500)
    groups=[('Entry',6),('Rooms',7),('Setup',5),('Controls',3),('Scenes',5),('Account',3)]
    x=24
    for i,(label,count) in enumerate(groups):
     width=(w-48)*count/29;b.rect(x,77,width-2,5,['#266641','#6c8b70','#9eafa0','#b5c9b2','#d0dace','#e6ebe1'][i],1);x+=width
     xx=24+(i%3)*(w-48)/3;yy=105+(i//3)*23;b.text(xx,yy,f'{label} {count}',11,INK)
    b.text(24,h-15,'29 original screens',10,MUTED)
   elif var=='imgImage7':
    b.text(24,60,'3',31,DARK,500);b.text(52,58,'root destinations',17,DARK,500)
    for i,label in enumerate(['Home','Rooms','Profile']):
     x=24+i*(w-48)/3;b.circle(x+3,83,2.5,'#28663f');b.text(x+12,87,label,12,INK)
    b.line(24,103,w-24,103,'#e1e7e1')
    b.text(24,125,'Rooms → appliances → control',13,DARK)
    b.text(24,h-15,'Depth 2 · verify the 1–2 tap target',10,MUTED)
   else:
    b.text(24,60,'3',31,DARK,500);b.text(52,58,'named confirmations',17,DARK,500)
    for i,label in enumerate(['Device','Room','Scene']):
     x=24+i*(w-48)/3;b.circle(x+5,86,5,'#eef3e9');b.text(x+5,90,'✓',10,'#28663f',anchor='middle');b.text(x+16,90,label,11,INK)
    b.line(24,106,w-24,106,'#e1e7e1')
    b.text(24,126,'No error, offline or permission-denial',11,INK,width=w-48)
    b.text(24,143,'frame supplied.',11,INK)
    b.text(24,h-12,'Supplied frame inventory',10,MUTED)
  elif sec==565 and var in ['imgImage','imgImage1','imgImage4','imgImage5','imgImage6']:
   b.parts=[];b.rect(0,0,w,h,'white',10)
   index={'imgImage4':'01','imgImage5':'02','imgImage':'03','imgImage6':'04','imgImage1':'05'}[var]
   b.text(24,27,index+' / DESIGN PRINCIPLE',10,'#28663f',500)
   b.text(24,60,t,21,DARK,500)
   b.line(24,76,w-24,76,'#dce5dd')
   b.text(24,101,body,13,INK,width=w-48,lh=19)
  elif (sec,var)==(565,'imgImage14'):
   b.text(24,89,'Editable name; email locked.',12,width=w-48)
  elif (sec,var)==(565,'imgImage13'):
   b.parts=[];b.rect(0,0,w,h,'white',10)
   b.text(24,120,'Account recovery',15,'#28663f',500)
   b.text(24,146,'Email → code → password',12)
   b.text(24,169,'Validate expiry and errors.',12)
  else:
   b.text(24,88,t,min(19,w/18),'#28663f',500,width=w-48);b.text(24,118,body,min(14,w/22),INK,width=w-48)
 elif kind=='research':
  # Keep the existing four-card composition and its measurement captions.
  cards(b,[('COUNTING RULES','One control per visible option, switch, button or continuous input. Row + checkbox counts once. Fields and OS chrome are separate. 176 controls and 15 editable fields across 29 frames.'),('FLOW COMPLEXITY','Decision stages: device 4, room 3, scene 4, recovery 3. Count one non-result stage that asks for a method, confirmation, selection or data entry; options do not add stages.'),('CONTROL RUBRIC / 0–8','Four criteria, 0 absent / 1 partial / 2 explicit: room + appliance identity; power text + switch; numeric value + unit + bounds; non-drag value alternative. AC 6, lamp 5, TV 5. Visible evidence, not usability.'),('PRIORITY / NEXT CHECK','First: setup recovery, because 3 results have no error counterpart. Next: precise appliance inputs and scene-state comprehension. Validate independently; frequency and outcome data require observation.')],2,90,32)
 elif kind=='donut':
  cx=w/2;cy=h*.45;r=min(w*.28,h*.23);circumference=2*math.pi*r;offset=0
  groups=[('Entry',6),('Rooms',7),('Setup',5),('Control',3),('Scenes',5),('Account',3)]
  for i,(label,count) in enumerate(groups):
   length=circumference*count/29
   b.parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{COLORS[i]}" stroke-width="{r*.32}" stroke-dasharray="{length} {circumference-length}" stroke-dashoffset="{-offset}" transform="rotate(-90 {cx} {cy})"/>');offset+=length
  b.text(cx,cy+7,'29',28,INK,500,anchor='middle')
  for i,(label,count) in enumerate(groups):
   x=20+(i%2)*w*.48;y=h-72+(i//2)*21;b.circle(x+4,y-4,4,COLORS[i]);b.text(x+15,y,f'{label} {count}',12,INK)
 elif kind=='avatar':
  b.circle(w/2,h/2,min(w,h)/2-2,'#e5eee2');b.text(w/2,h*.62,'H',w*.48,'#275f39',500,anchor='middle')
 elif kind=='journey':
  b.parts=[];b.text(0,24,title,20,'#f7f5ee',500);b.text(0,51,note,12,'#b7bdb7')
  points=[(x,h-25-v/12*(h-25-108)) for x,v in zip([6,240,560,w-6],[3,12,3,2])]
  b.line(0,h-15,w,h-15,'#454545')
  # Curve composition retained; positions encode actual visible control counts.
  path='M'+str(points[0][0])+' '+str(points[0][1])
  for (x,y),(nx,ny) in zip(points,points[1:]):path+=f' C{x+(nx-x)/2} {y} {x+(nx-x)/2} {ny} {nx} {ny}'
  b.parts.append(f'<path d="{path}" fill="none" stroke="#75fb4c" stroke-width="3"/>')
  for (x,y),v in zip(points,[3,12,3,2]):
   b.circle(x,y,5,'#75fb4c');b.text(max(5,min(w-5,x)),y-12,str(v),12,'#b7bdb7',anchor='start' if x==6 else 'end' if x==w-6 else 'middle')
 elif kind=='ia':flowmap(b)
 elif kind=='identity':
  b.parts=[];b.rect(0,0,w,h,'white',10)
  b.text(24,31,'Sampled application palette',16,DARK,500)
  samples=[(DARK,'Surface'),(SAND,'Action'),('#f3f2ec','Text')]
  cw=(w-72)/3
  for i,(color,label) in enumerate(samples):
   x=24+i*(cw+12);b.rect(x,56,cw,76,color,5,'#dce2da');b.text(x,155,label,13,DARK,500);b.text(x,177,color.upper(),11,MUTED)
  b.line(24,198,w-24,198,'#dce5dd');b.text(24,238,'Aa',30,DARK,500);b.text(86,227,'Your home, harmonized.',16,DARK);b.text(86,249,'Observed identity · original app screens',11,MUTED)
 elif kind=='wordmark':b.text(w/2,h*.78,'HOMIQ',min(29,h*.7),'#111',600,anchor='middle')
 elif kind=='matrix':
  for i,(t,body) in enumerate([('Room-first','Familiar location; photo cards use space.'),('Category-first','Quick type access; weaker room context.'),('Chosen combination','Home categories + dedicated Rooms tab.'),('Validation','Compare finding a similarly named light.')]):
   y=90+i*67;b.text(24,y,t,15,'#28663f',500,width=w-48);b.text(24,y+24,body,13,width=w-48)
 elif kind=='principles':b.text(24,h-15,'Context makes the next action easier to interpret.',15,INK)
 elif kind=='state':
  for i,(t,body) in enumerate([('Guided setup','Uncertainty → staged steps + named result. Expect confidence; test interrupted pairing.'),('Explicit scene states','Ambiguous intent → membership then ON/OFF. Expect fewer state errors; test Goodnight.')]):
   y=91+i*104;b.text(24,y,t,16,'#28663f',500,width=w-48);b.text(24,y+27,body,13,width=w-48)
 elif kind=='wire':wireboard(b,data)
 elif kind=='flow':
  # Preserve wide gallery rectangle: two rows of code-native wireframes + connecting labels.
  gap=10;cw=(w-42)/len(data)
  for i,t in enumerate(data):
   x=18+i*cw;b.rect(x,100,cw-10,62,'#f0f4ef',6,'#b4c4b8');b.text(x+(cw-10)/2,122,t,12,anchor='middle',width=cw-20)
   if i<len(data)-1:b.line(x+cw-10,131,x+cw,131,'#587d60','3 3')
  b.text(24,208,'One clear decision per stage',17,'#28663f',500);b.text(24,240,'Back paths preserve context. Connection and save behavior require testing.',14,width=w-48)
 elif kind=='accountboard':
  # All nine account screens remain authentic, full aspect ratio.
  gallery(b,['welcome','sign-in','create-account','recover-password','verify-code','change-password','profile','profile-details','push-notifications'],3,112,22)
 elif kind=='roomboard':
  # Small original mid-fidelity comparison above the authentic room sequence.
  wirephone(b,46,90,140,240,'Room-first',['Photo cards','Device counts','Named context'])
  wirephone(b,205,90,140,240,'Type-first',['Lights','TVs','AC'])
  b.text(390,119,'Access model tradeoff',20,'#27663b',500,width=w-420);b.text(390,159,'Room-first helps location recognition. Type-first shortens access to a device category. HOMIQ combines both; compare wrong-room errors in future tests.',16,width=w-420)
  gallery(b,['my-rooms','room-name','room-choose-photo','room-select-devices','room-added','room-appliances'],6,380,28)
 elif kind=='gallery':gallery(b,data,len(data),105,35)
 elif kind=='beforeafter':
  b.parts=[];b.rect(0,0,w,h,'white',10)
  b.text(24,31,note+' / DESIGN REVIEW',11,'#28663f',500)
  b.text(24,65,title,25,'#242b27',500)
  b.image(data[0],80,92,117,253.2,folder='earlier')
  b.image(data[1],347,92,117,253.2)
  b.text(138.5,367,'Before',13,INK,anchor='middle');b.text(405.5,367,'After',13,INK,anchor='middle')
  b.line(235,214,305,214,'#8ca386');b.line(296,206,305,214,'#8ca386');b.line(296,222,305,214,'#8ca386')
  b.text(w/2,413,data[2],13,'#28663f',500,anchor='middle')
 elif kind=='palette':
  sw=[('#141817','BACKGROUND'),('#242a28','SURFACE'),('#efcc9b','PRIMARY ACTION'),('#f7f5ee','PRIMARY TEXT'),('#b7bdb7','SECONDARY TEXT')]
  gap=14;cw=(w-48-gap*4)/5
  for i,(c,label) in enumerate(sw):
   x=24+i*(cw+gap);b.rect(x,88,cw,85,c,8,'#d6dcd6');b.text(x,198,label,11,INK,500);b.text(x,221,c.upper(),14,INK)
 elif kind=='recovery':
  # Happy path, failure branch and retry are visually different paths.
  x=[24,202,380];cw=140
  for i,(heading,detail) in enumerate([('Unknown device','Discovery / permissions'),('Connecting','Keep room + name'),('Connected','Named device + room')]):
   b.text(x[i],100,f'0{i+1}',10,'#28663f',500)
   b.rect(x[i],113,cw,65,'#f0f5ef',6,'#c9d6c8')
   b.text(x[i]+12,138,heading,14,'#28663f',500)
   b.text(x[i]+12,160,detail,10,INK)
   if i<2:arrow(b,x[i]+cw+4,145,x[i+1]-6,145)
  arrow(b,272,179,272,244)
  b.text(286,216,'If connection fails',11,MUTED)
  b.rect(202,251,318,79,'#f7f8f5',6,'#c9d6c8')
  b.text(218,277,'Connection failed',16,DARK,500)
  b.text(218,301,'Safe retry + contextual guidance',12,INK)
  b.parts.append('<path d="M202 291 H181 V198 H252 V179" fill="none" stroke="#91a798" stroke-width="1.5" stroke-dasharray="4 4"/>')
  b.line(249,184,252,179,'#91a798');b.line(255,184,252,179,'#91a798')
  b.text(24,268,'RETRY',10,'#28663f',500)
  b.text(24,289,'Retain room and',11,INK);b.text(24,306,'naming input.',11,INK)
  b.line(24,358,w-24,358,'#dce5dd')
  b.text(24,384,'Confirmation is the happy path.',14,DARK,500)
  b.text(24,407,'Failure and retry are proposed state logic, not implemented UI.',11,MUTED)
 elif kind=='foundation':
  cards(b,[('DARK LAYERED SURFACES','Near-black base, green-gray cards and sand primary actions. Text and ON/OFF labels supplement color.'),('HIERARCHY & NAVIGATION','Room photos, device counts and visible values. Home / Rooms / Profile stays consistent across daily controls.'),('PROGRESS & LIMITS','Setup uses staged progress and named results. No modal, offline or failure design is supplied; exact tokens need source files.')],1,86,22)
 elif kind=='components':
  items=[('Primary action','Sand pill, one clear next action.'),('Inputs','Rounded surface; label and current value.'),('Room card','Photo context, room name and device count.'),('Selection','Checkbox: membership. Switch: desired state.'),('Bottom navigation','Home / Rooms / Profile; a stable shell.'),('Device shell','Room, name, power and specific control.'),('Confirmation','Named result and clear next action.'),('Feedback gap','Offline and retry states need exploration.')]
  for i,(t,body) in enumerate(items):
   y=98+i*105;x=w-143
   b.text(24,y,t,17,'#28663f',500,width=w-184);b.text(24,y+27,body,13,width=w-184)
   if i==0:
    b.rect(x,y+10,118,34,SAND,18);b.text(x+59,y+32,'Continue',12,DARK,500,anchor='middle')
   elif i==1:
    b.rect(x,y,118,55,'#242a28',12);b.text(x+12,y+17,'Light name',10,'#b7bdb7');b.text(x+12,y+39,'Bedroom light',12,'#f7f5ee')
   elif i==2:
    b.rect(x,y-2,118,66,'#242a28',10);b.rect(x+6,y+4,106,18,'#6b765e',6);b.text(x+10,y+39,'Living room',12,'#f7f5ee');b.text(x+10,y+55,'6 of 12 on',10,'#b7bdb7')
   elif i==3:
    b.rect(x,y+3,20,20,SAND,5);b.text(x+10,y+18,'✓',14,DARK,anchor='middle');b.rect(x+44,y+2,46,25,'#32bd62',13);b.circle(x+76,y+14,10,'white');b.text(x+54,y+49,'ON / OFF',10,INK)
   elif i==4:
    b.rect(x,y,118,57,'#242a28',18)
    for j,lab in enumerate(['Home','Rooms','Profile']):
     b.circle(x+20+j*39,y+17,5,SAND if j==1 else '#b7bdb7');b.text(x+20+j*39,y+40,lab,9,'#f7f5ee',anchor='middle')
   elif i==5:
    b.circle(x+58,y+28,25,'#242a28',SAND,2);b.text(x+58,y+32,'24°C',13,'#f7f5ee',anchor='middle')
   elif i==6:
    b.circle(x+59,y+17,18,'#eef3e9','#a0b396');b.text(x+59,y+23,'✓',18,'#28663f',anchor='middle');b.text(x+59,y+54,'Bedroom light added',10,INK,anchor='middle')
   else:
    b.line(x,y+22,x+116,y+22,'#8d9f8d','4 4');b.text(x+58,y+12,'PROPOSED',10,INK,anchor='middle');b.text(x+58,y+46,'Explain → retry',12,'#28663f',anchor='middle')
 elif kind=='type':
  b.text(24,100,'Aa  ·  Clear hierarchy',27,DARK,500);b.text(24,140,'Display / title ≈ 28–34 px; labels ≈ 13–16 px.',14,width=w-48)
  b.text(24,191,'Estimated spacing rhythm',17,'#28663f',500)
  for i,v in enumerate([8,12,16,24,32]):
   x=24+i*85;b.rect(x,215,v,35,'#b5c9b2',2);b.text(x,274,str(v),13)
  b.text(24,315,'Sample contrast: #F7F5EE / #141817 = 16.4:1 (sRGB). Verify overlays, disabled labels, target sizes, focus order and non-drag inputs. Raster typography is an estimate.',14,width=w-48)
 elif kind=='sequences':
  names=['device-scan-or-nfc','device-light-found','device-select-location','device-name','device-added','scene-choose','scene-name','scene-select-devices','scene-set-device-states','scene-added']
  gallery(b,names,5,108,30)
 elif kind=='frame':
  # Same retained outer frame slot; screen below stays unobscured.
  b.rect(15,1,w-30,h-2,'none',39,'#777b77')
 b.title=title;b.note=note
 name=f'{sec}-{var}.svg';b.save(name)
 alt[(sec,var)]=title+('. '+note if note else '')
 if data and kind in ['chart','mini']:alt[(sec,var)]+='. '+str(data)

# Redirect every reference artwork import; reuse only neutral editorial dividers/icons.
for p in (ROOT/'app/homiq/sections').glob('*.tsx'):
 sec=int(re.search(r'\d+',p.name)[0]);s=p.read_text()
 def repl(m):
  var,old=m[1],m[2]
  if (sec,var) in ART:return f'const {var} = "/homiq/artifacts/{sec}-{var}.svg";'
  oldfile=ROOT/'public'/old.lstrip('/')
  name=f'{sec}-{var}.svg';target=ROOT/'public/homiq/editorial'/name
  # These are generic rules, arrows and small neutral icons, never project artwork.
  if oldfile.exists():shutil.copyfile(oldfile,target)
  else:raise RuntimeError(old)
  return f'const {var} = "/homiq/editorial/{name}";'
 s=re.sub(r'const (\w+) = "(/homiq/figma/[^"]+)";',repl,s)
 def image_alt(m):
  tag=m[0];source=re.search(r'src=\{([^}]+)\}',tag)
  if not source:return tag
  var=source[1]
  value=alt.get((sec,var),'')
  if (sec,var) in ART and ART[(sec,var)][0]=='actual':value='HOMIQ actual supplied screen: '+ART[(sec,var)][3][0].replace('-',' ')+'. Full source UI shown unchanged.'
  if (sec,var) in ART and ART[(sec,var)][0]=='gallery':value=ART[(sec,var)][1]+'. Actual screens: '+', '.join(ART[(sec,var)][3])+'.'
  tag=re.sub(r'alt="[^"]*"','alt="'+esc(value)+'"',tag)
  return tag
 s=re.sub(r'<img\b[^>]*?/>',image_alt,s)
 p.write_text(s)
# Source preview URLs are stable, while their content becomes authentic Homiq.
shutil.copyfile(OUT/'919-imgImage.svg',ROOT/'public/homiq/preview.svg')
shutil.copyfile(OUT/'823-imgImage.svg',ROOT/'public/homiq/launch-preview.svg')
(ROOT/'docs/homiq/artifact-catalog.json').write_text(json.dumps([dict(section=k[0],slot=k[1],kind=v[0],title=v[1],qualification=v[2],asset=f'/homiq/artifacts/{k[0]}-{k[1]}.svg') for k,v in ART.items()],indent=2,ensure_ascii=False)+'\n')
print(f'Generated {len(ART)} original artifact slots; all original product PNGs embedded unchanged.')
