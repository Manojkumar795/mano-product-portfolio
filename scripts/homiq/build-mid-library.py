"""Build flat, code-native HOMIQ digital wireframes and their library overview."""
from pathlib import Path
from html import escape

OUT = Path(__file__).resolve().parents[2] / 'public/homiq/fidelity'
MID = OUT / 'mid'
MID.mkdir(parents=True, exist_ok=True)
INK, MUTED, LINE, GRAY, PALE, AQUA = '#202020', '#606060', '#b9b9b9', '#d8d8d8', '#eee', '#b9efeb'

class Screen:
 def __init__(self, title):
  self.title, self.p = title, []
  self.rect(0,0,390,844,'#fff')
 def rect(self,x,y,w,h,fill=GRAY,r=0,stroke='none'):
  self.p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}"/>')
 def line(self,x,y,xx,yy,c=LINE,width=1):
  self.p.append(f'<path d="M{x} {y}L{xx} {yy}" fill="none" stroke="{c}" stroke-width="{width}"/>')
 def text(self,x,y,t,size=18,c=INK,weight=400,anchor='start'):
  self.p.append(f'<text x="{x}" y="{y}" fill="{c}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{escape(str(t))}</text>')
 def circle(self,x,y,r,fill=GRAY,stroke='none'):
  self.p.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}"/>')
 def placeholder(self,x,y,w,h,label=''):
  self.rect(x,y,w,h);self.line(x,y,x+w,y+h,'#999');self.line(x+w,y,x,y+h,'#999')
  if label:
   self.rect(x+12,y+h-36,w-24,28,'#f4f4f4');self.text(x+22,y+h-16,label,16,INK,600)
 def icon(self,name,x,y,size=24):
  paths={'home':'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9','rooms':'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z','profile':'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 22v-3a8 8 0 0 1 16 0v3','lamp':'M7 4h10l4 10H3L7 4M12 14v7M6 21h12','tv':'M2 5h20v14H2zM8 22h8M12 19v3','air':'M2 4h20v10H2zM5 10h14M6 17v4M12 17v4M18 17v4','plus':'M12 3v18M3 12h18','back':'m14 4-8 8 8 8M6 12h16','check':'m4 12 5 5L20 5'}
  self.p.append(f'<g transform="translate({x} {y}) scale({size/24})" fill="none" stroke="{MUTED}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="{paths[name]}"/></g>')
 def header(self,back=False,progress=False):
  self.text(195,42,'HOMIQ',22,INK,500,'middle');self.icon('back' if back else 'home',22,22)
  self.circle(354,34,15,PALE);self.icon('plus',344,24,20);self.line(0,64,390,64)
  if progress:
   for i in range(3):self.rect(24+i*116,82,110,4,'#777' if i==0 else GRAY)
   self.text(24,130,self.title,26,INK,600)
  else:
   self.rect(0,65,390,48,AQUA);self.text(24,96,self.title,24,INK,600)
 def nav(self,selected='home'):
  self.rect(0,764,390,80)
  for i,(key,label) in enumerate([('home','Home'),('rooms','Rooms'),('profile','Profile')]):
   x=i*130
   if selected==key:self.rect(x,764,130,80,'#bcbcbc')
   self.icon(key,x+53,777);self.text(x+65,827,label,15,INK,500,'middle')
   if i:self.line(x,764,x,844,'#aaa')
 def field(self,label,y,value='',locked=False):
  self.text(24,y,label,17,INK,600);self.rect(24,y+14,342,52,PALE if locked else '#f5f5f5',2,LINE);self.text(40,y+47,value or label,18,MUTED)
 def button(self,label,y=728):
  self.rect(24,y,342,52,'#646464',22);self.text(195,y+33,label,18,'#fff',600,'middle')
 def toggle(self,x,y,on=True):
  self.rect(x,y,48,26,'#777' if on else '#c7c7c7',13);self.circle(x+(35 if on else 13),y+13,10,'#fff','#777')
 def device(self,label,y,detail='1 device',icon='lamp',on=None,selected=None,height=80):
  self.rect(24,y,342,height,PALE,3);self.icon(icon,38,y+25,27);self.text(80,y+32,label,18,INK,500);self.text(80,y+57,detail,14,MUTED)
  if on is not None:self.toggle(302,y+27,on)
  if selected is not None:
   self.rect(322,y+28,22,22,'#777' if selected else '#fff',2,'#777')
   if selected:self.p.append(f'<path d="m326 {y+39} 5 5 9-11" stroke="#fff" stroke-width="2" fill="none"/>')
 def content(self):return '<g font-family="Arial,sans-serif">'+''.join(self.p)+'</g>'
 def save(self,name):
  (MID/f'{name}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844" role="img"><title>{escape(self.title)} — HOMIQ mid-fidelity wireframe</title>{self.content()}</svg>')

titles={'welcome':'Welcome','sign-in':'Sign in','create-account':'Create account','recover-password':'Recover password','verify-code':'Verify code','change-password':'New password','my-home':'My home','my-rooms':'My rooms','room-name':'Name your room','room-choose-photo':'Choose a room photo','room-select-devices':'Select room devices','room-added':'Room added','room-appliances':'Living room','device-scan-or-nfc':'Add a light','device-light-found':'Light found','device-select-location':'Choose a room','device-name':'Name your light','device-added':'Device added','air-conditioner':'Air conditioner','lamp':'Lamp','tv-remote':'Smart TV','scene-choose':'Create a scene','scene-name':'Name your scene','scene-select-devices':'Choose devices','scene-set-device-states':'Set device states','scene-added':'Scene added','profile':'Profile','profile-details':'Profile details','push-notifications':'Notifications'}
screens={}
for name,title in titles.items():
 s=Screen(title)
 if name=='welcome':
  s.placeholder(0,0,390,844);s.rect(56,300,278,178,'#efefef');s.text(195,352,'HOMIQ',36,INK,600,'middle');s.text(195,399,'Your home,',28,INK,500,'middle');s.text(195,436,'harmonized.',28,INK,500,'middle');s.button('Get started')
 else:
  setup=name.startswith(('device-','scene-','room-')) and name!='room-appliances'
  s.header(back=setup or name not in ['my-home','my-rooms','profile'],progress=setup)
  if name=='my-home':
   s.text(24,151,'Device categories',18,INK,600)
   for i,(label,icon,detail) in enumerate([('Smart TV','tv','1 on'),('Lights','lamp','4 on'),('Air purifier','air','0 on')]):
    x=24+i*118;s.rect(x,168,106,100,GRAY,3);s.icon(icon,x+12,182);s.text(x+12,228,label,15,INK,600);s.text(x+12,251,detail,13,MUTED)
   for i,label in enumerate(['Morning scene','Night scene']):
    x=24+i*177;s.rect(x,284,165,73,PALE,3);s.text(x+12,315,label,16,INK,500);s.text(x+12,340,'ON',13,MUTED)
   s.text(24,399,'Frequently used',19,INK,600)
   for i,(label,detail,state,icon) in enumerate([('Smart TV','1 device','ON','tv'),('Air purifier','4 devices','OFF','air'),('Fans','2 devices','OFF','air'),('Air conditioner','1 device','ON','air'),('Smart lights','4 devices','ON','lamp')]):
    y=420+i*61;s.icon(icon,24,y+6);s.text(66,y+19,label,17);s.text(66,y+41,detail,13,MUTED);s.text(364,y+26,state,14,MUTED,anchor='end');s.line(24,y+52,366,y+52,'#ddd')
   s.nav()
  elif name=='my-rooms':
   for i,(label,detail) in enumerate([('Living room','6 of 12 devices on'),('Lounge','3 of 3 devices on'),('TV lounge','4 devices')]):
    y=136+i*199;s.placeholder(24,y,342,179);s.rect(24,y+105,342,74,'#f3f3f3');s.text(40,y+134,label,23,INK,600);s.text(40,y+161,detail,15,MUTED);s.text(344,y+146,'›',28,MUTED,anchor='end')
   s.nav('rooms')
  elif name=='room-appliances':
   s.text(24,151,'12 devices · 6 on',17,MUTED)
   for i,(label,icon,state) in enumerate([('Air conditioner','air',True),('Smart TV','tv',True),('Lamp','lamp',True),('Air purifier','air',False),('Smart light 1','lamp',False)]):s.device(label,176+i*105,icon=icon,on=state)
   s.nav('rooms')
  elif name in ['lamp','air-conditioner','tv-remote']:
   s.text(24,152,'Living room',17,MUTED);s.text(24,193,'POWER ON',14,MUTED,600);s.toggle(318,172)
   if name=='lamp':
    s.icon('lamp',133,260,124);s.p.append('<path d="M58 460Q195 590 332 460" fill="none" stroke="#aaa" stroke-width="3"/>');s.circle(140,516,8,'#666');s.text(24,613,'Brightness',20,INK,600);s.text(366,613,'40%',34,INK,400,'end');s.rect(24,647,342,7,GRAY,3);s.rect(24,647,137,7,'#777',3);s.circle(161,650,12,'#777')
   elif name=='air-conditioner':
    s.text(195,281,'Temperature',19,MUTED,anchor='middle');s.circle(195,398,92,PALE,'#aaa');s.text(195,420,'24°',64,INK,400,'middle')
    for i,label in enumerate(['Mode','Fan speed','Swing']):s.rect(24+i*118,556,106,80,PALE,3);s.text(77+i*118,602,label,15,INK,anchor='middle')
   else:
    s.circle(195,345,103,PALE,'#aaa');s.circle(195,345,42,'#c1c1c1');s.text(195,352,'OK',22,INK,600,'middle')
    for x,y,t in [(195,279,'↑'),(195,424,'↓'),(120,353,'‹'),(270,353,'›')]:s.text(x,y,t,26,INK,anchor='middle')
    for i,label in enumerate(['Volume − / +','Channel − / +']):s.rect(24+i*177,530,165,90,GRAY,4);s.text(106+i*177,580,label,17,INK,anchor='middle')
   s.nav('rooms')
  elif name in ['sign-in','create-account','recover-password','change-password','profile-details']:
   fields={'sign-in':[('Email','Email address'),('Password','••••••••')],'create-account':[('Name','Full name'),('Email','Email address'),('Password','••••••••')],'recover-password':[('Email','Email address')],'change-password':[('New password','••••••••'),('Confirm password','••••••••')],'profile-details':[('Name','Manoj Kumar'),('Email','Email address')]}[name]
   for i,(label,value) in enumerate(fields):s.field(label,174+i*106,value,name=='profile-details' and i==1)
   if name=='sign-in':
    s.text(366,392,'Forgot password?',16,MUTED,anchor='end');s.text(195,490,'or continue with',15,MUTED,anchor='middle');s.rect(24,514,165,46,PALE,2,LINE);s.text(106,543,'Google',17,anchor='middle');s.rect(201,514,165,46,PALE,2,LINE);s.text(283,543,'Apple',17,anchor='middle')
   if name=='create-account':s.text(24,527,'Agree to Terms & Privacy Policy',15,MUTED)
   if name=='recover-password':s.text(24,298,'Receive a code to reset your password.',17,MUTED)
   if name=='profile-details':s.text(24,398,'Email address cannot be edited.',16,MUTED)
   s.button({'sign-in':'Sign in','create-account':'Create account','recover-password':'Send code','change-password':'Save password','profile-details':'Save changes'}[name])
  elif name=='verify-code':
   s.text(24,180,'Enter your verification code',21,INK,600);s.text(24,220,'We sent a code to your email.',17,MUTED)
   for i in range(6):s.rect(24+i*58,270,48,58,PALE,2,LINE);s.text(48+i*58,306,'—',17,MUTED,anchor='middle')
   s.text(24,384,'Resend code',17,MUTED);s.button('Verify code')
  elif name in ['room-added','device-added','scene-added']:
   s.circle(195,295,55,PALE);s.icon('check',165,265,60);s.text(195,405,title,29,INK,600,'middle');s.text(195,450,{'room-added':'Bedroom','device-added':'Bedroom light · Living room','scene-added':'Goodnight'}[name],20,MUTED,anchor='middle');s.button('Done')
  elif name=='device-scan-or-nfc':
   s.placeholder(96,214,198,198,'Scan QR code');s.text(195,465,'Scan a code on your device',20,INK,500,'middle');s.text(195,505,'or',17,MUTED,anchor='middle');s.rect(24,545,342,66,PALE,3,LINE);s.text(195,586,'Use NFC',20,INK,500,'middle');s.button('Continue')
  elif name=='device-light-found':
   s.icon('lamp',139,227,112);s.text(195,415,'Light found',29,INK,600,'middle');s.text(195,458,'Connect this device to your home.',18,MUTED,anchor='middle');s.button('Continue')
  elif name=='device-select-location':
   for i,label in enumerate(['Living room','Lounge','TV lounge']):
    y=178+i*164;s.placeholder(24,y,342,142,label);s.circle(338,y+25,11,'#777' if i==0 else '#fff','#777')
   s.button('Continue')
  elif name in ['device-name','room-name','scene-name']:
   label={'device-name':'Device name','room-name':'Room name','scene-name':'Scene name'}[name];value={'device-name':'Bedroom light','room-name':'Bedroom','scene-name':'Goodnight'}[name]
   s.placeholder(24,169,342,256,'Device image' if name=='device-name' else 'Room image');s.field(label,484,value);s.button('Continue')
  elif name=='room-choose-photo':
   s.text(24,179,'Bedroom',20,INK,600)
   for i in range(6):
    x=24+(i%2)*177;y=214+(i//2)*149;s.placeholder(x,y,165,130)
    if i==0:s.circle(x+141,y+22,13,'#777');s.p.append(f'<path d="m{x+134} {y+22} 5 5 9-10" stroke="#fff" stroke-width="2" fill="none"/>')
   s.button('Continue')
  elif name in ['room-select-devices','scene-select-devices','scene-set-device-states']:
   s.text(24,180,'Goodnight' if name.startswith('scene') else 'Bedroom',20,INK,600)
   if name=='scene-set-device-states':
    for i,(label,icon) in enumerate([('Air purifier','air'),('Fan','air'),('Air conditioner','air'),('Smart light 1','lamp')]):s.device(label,210+i*106,icon=icon,on=i in [1,2],detail='1 device · '+('ON' if i in [1,2] else 'OFF'))
   else:
    for i,(label,icon) in enumerate([('Smart TV','tv'),('Air purifier','air'),('Fan','air'),('Air conditioner','air'),('Smart light 1','lamp'),('Smart light 2','lamp')]):s.device(label,200+i*82,icon=icon,selected=i in [1,2,3,4],height=68)
   s.button('Create scene' if name=='scene-set-device-states' else 'Add room' if name=='room-select-devices' else 'Set device states')
  elif name=='scene-choose':
   s.text(24,184,'Make everyday routines easier',21,INK,600);s.placeholder(24,223,342,240,'Scene image');s.rect(24,494,342,88,PALE,3);s.text(42,530,'Manual scene',21,INK,600);s.text(42,558,'Run a group of device actions.',17,MUTED);s.button('Create a scene')
  elif name=='profile':
   s.circle(195,226,66);s.icon('profile',157,188,76);s.text(195,329,'Manoj Kumar',24,INK,600,'middle')
   for i,label in enumerate(['Profile details','Settings','Push notifications']):
    y=378+i*88;s.rect(0,y,390,76,PALE);s.text(24,y+46,label,20,INK,500);s.text(366,y+46,'›',26,MUTED,anchor='end')
   s.text(24,705,'Sign out',18,MUTED);s.nav('profile')
  elif name=='push-notifications':
   for i,label in enumerate(['Device updates','Scene activity','Home alerts']):
    y=166+i*112;s.text(24,y+28,label,20,INK,500);s.toggle(318,y+5,i!=1);s.line(24,y+67,366,y+67,'#ddd')
   s.button('Done')
 s.save(name);screens[name]=s

groups=[('Entry & recovery',['welcome','sign-in','create-account','recover-password','verify-code','change-password']),('Home & rooms',['my-home','my-rooms','room-appliances','room-name','room-choose-photo','room-select-devices','room-added']),('Device setup & controls',['device-scan-or-nfc','device-light-found','device-select-location','device-name','device-added','air-conditioner','lamp','tv-remote']),('Scenes & account',['scene-choose','scene-name','scene-select-devices','scene-set-device-states','scene-added','profile','profile-details','push-notifications'])]
p=['<rect width="1004" height="1174" rx="10" fill="#222"/>','<text x="32" y="48" font-family="Arial,sans-serif" fill="#fff" font-size="20">Wireframe library</text>']
for row,(label,names) in enumerate(groups):
 y=85+row*267;p.append(f'<text x="32" y="{y+17}" font-family="Arial,sans-serif" fill="#ddd" font-size="14">{escape(label)}</text>')
 for i,name in enumerate(names):p.append(f'<svg x="{32+i*119}" y="{y+36}" width="107" height="231.56" viewBox="0 0 390 844">{screens[name].content()}</svg>')
(OUT/'mid-library.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="1004" height="1174" viewBox="0 0 1004 1174" role="img"><title>HOMIQ wireframe library — 29 screens grouped by journey</title>'+''.join(p)+'</svg>')
print(f'Built {len(screens)} flat wireframes and one complete library overview.')
