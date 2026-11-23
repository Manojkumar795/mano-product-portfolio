"""Refine the audit charts and unified coverage card; preserve colors and values."""
from pathlib import Path
import html, json, re, math
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public/homiq/artifacts'
audit = json.loads((ROOT / 'docs/homiq/audit-data.json').read_text())
flow = audit['flows']; screens = {s['id']: s for s in audit['screens']}
colors = ['#56b975','#587eaf','#f0c342','#83c2c8','#ec955d','#795d8c','#bd628d','#c3b984','#c95861','#7b8186']
charts = [
 ('Journey length', [f['name'] for f in flow], [f['screen_count'] for f in flow], 'screens, including confirmation', 6),
 ('Editable fields by task', [f['name'] for f in flow], [f['field_count'] for f in flow], 'visible fields per flow', 6),
 ('Repeated components', ['Bottom navigation','Progress indicator','Named confirmation'], [len(audit['patterns'][k]) for k in ['bottom_navigation','segmented_progress','named_confirmation']], 'screens showing each component', 12),
 ('Product coverage', ['Entry','Rooms','Setup','Controls','Scenes','Account'], [6,7,5,3,5,3], 'screens per family · 29 total', 12),
 ('Control evidence score', ['AC','Lamp','TV'], [r['total'] for r in audit['heuristic']['scores']], 'points out of 8 · rubric below', 8),
 ('Visible controls by screen', ['Home','Rooms','Choose room','Room devices','Scene devices','Scene states','AC','Lamp','TV','Profile','Light name','Light added'], [screens[i]['action_count'] for i in ['my-home','my-rooms','device-select-location','room-select-devices','scene-select-devices','scene-set-device-states','air-conditioner','lamp','tv-remote','profile','device-name','device-added']], 'controls per screen, excluding fields', 18),
]
for index,(title,labels,values,unit,maximum) in enumerate(charts):
 path = OUT / f'342-imgImage{index if index else ""}.svg'
 old=path.read_text(); w,h=map(float,re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"',old).groups())
 parts=[]
 def text(x,y,value,size=12,anchor='start',color='#505a63',center=False):
  parts.append(f'<text x="{x:.2f}" y="{y:.2f}" font-size="{size}" text-anchor="{anchor}" fill="{color}"'+(' dominant-baseline="central"' if center else '')+f'>{html.escape(str(value))}</text>')
 parts.append(f'<rect width="{w}" height="{h}" rx="10" fill="white"/>')
 text(24,32,title,20,color='#414b45')
 left=164; right=w-36; top=62; bottom=h-49
 ticks=4 if maximum == 8 else 6
 for i in range(ticks+1):
  x=left+(right-left)*i/ticks
  parts.append(f'<path d="M{x:.2f} {top}V{bottom}" stroke="#edf0ee" stroke-width="1"/>')
  text(x,bottom+18,f'{maximum*i/ticks:g}',10,'middle')
 step=(bottom-top)/len(labels)
 for i,(label,value) in enumerate(zip(labels,values)):
  cy=top+(i+.5)*step; bar=min(21,step*.58); width=(right-left)*value/maximum
  text(left-12,cy,label,12,'end',center=True)
  parts.append(f'<rect x="{left}" y="{cy-bar/2:.2f}" width="{width:.2f}" height="{bar:.2f}" rx="2" fill="{colors[i%len(colors)]}"/>')
  text(left+width+7,cy,value,11,center=True)
 text(right,h-12,unit,10,'end','#7a7a7a')
 path.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img"><title>{title}</title><desc>HOMIQ screen audit · 21 Oct 2026</desc><g font-family="Arial, sans-serif" font-weight="400" style="font-variant-numeric:tabular-nums">'+''.join(parts)+'</g></svg>')
# The coverage title, ring and legend share one card and one coordinate system.
def write_coverage():
 w,h=470,468
 groups=[('Entry',6),('Rooms',7),('Setup',5),('Controls',3),('Scenes',5),('Account',3)]
 parts=[f'<rect width="{w}" height="{h}" rx="10" fill="white"/>']
 def label(x,y,value,size=13,anchor='start',color='#505a63',weight=400,center=False):
  parts.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" fill="{color}"'+(' dominant-baseline="central"' if center else '')+f'>{html.escape(str(value))}</text>')
 label(24,32,'Product coverage',20,color='#414b45')
 label(24,56,'29 screens · six product areas',11,color='#7a7a7a')
 cx,cy,r=235,218,98
 circumference=2*math.pi*r
 offset=0
 for index,(_,count) in enumerate(groups):
  length=circumference*count/29
  parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{colors[index]}" stroke-width="28" stroke-dasharray="{length:.6f} {circumference-length:.6f}" stroke-dashoffset="{-offset:.6f}" transform="rotate(-90 {cx} {cy})"/>')
  offset+=length
 label(cx,211,'29',34,'middle',weight=500,center=True)
 label(cx,242,'screens',12,'middle',color='#7a7a7a')
 for index,(name,count) in enumerate(groups):
  x=38+(index%2)*214; y=365+(index//2)*31
  parts.append(f'<circle cx="{x+5}" cy="{y}" r="4" fill="{colors[index]}"/>')
  label(x+18,y,name,13,center=True)
  label(x+174,y,count,13,'end',center=True)
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img"><title>Product coverage</title><desc>Distribution of the 29 supplied screens: Entry 6, Rooms 7, Setup 5, Controls 3, Scenes 5, Account 3.</desc><g font-family="Arial, sans-serif" style="font-variant-numeric:tabular-nums">'+''.join(parts)+'</g></svg>'
 (OUT/'342-imgImage10.svg').write_text(svg)
write_coverage()
print('Refined six audit charts and one coverage card without changing data or color mapping.')
