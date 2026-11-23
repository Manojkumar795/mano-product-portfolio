"""Export the same connected screen map used by the case-study component."""
from pathlib import Path
import json, html
root=Path(__file__).resolve().parents[2]
flow=json.loads((root/'docs/homiq/information-architecture-flow.json').read_text())
parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{flow["width"]}" height="{flow["height"]}" viewBox="0 0 {flow["width"]} {flow["height"]}" role="img"><title>HOMIQ information architecture</title><desc>Connected entry, navigation, setup, scenes, controls and account flows across 29 screens.</desc><rect width="100%" height="100%" fill="white"/><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L9 5 1 9Z" fill="#819485"/></marker></defs><g fill="none" stroke="#819485" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">']
for path in flow['rails']:parts.append(f'<path d="{path}"/>')
for edge in flow['edges']:
 end=' marker-end="url(#arrow)"' if edge['arrow'] else ''
 start=' marker-start="url(#arrow)"' if edge['bidirectional'] else ''
 parts.append(f'<path d="{edge["path"]}"{end}{start}/>')
parts.append('</g>')
for node in flow['nodes']:
 fill={'main':'#273c2f','done':'#f5ebd9','screen':'#fbfcfa'}[node['kind']]
 stroke='#273c2f' if node['kind']=='main' else '#b9c8bb'
 text='#fff' if node['kind']=='main' else '#26332a'
 parts.append(f'<rect x="{node["x"]}" y="{node["y"]}" width="{node["width"]}" height="{node["height"]}" rx="7" fill="{fill}" stroke="{stroke}" stroke-width="1.2"/><text x="{node["x"]+node["width"]/2}" y="{node["y"]+node["height"]/2}" dominant-baseline="central" text-anchor="middle" fill="{text}" font-family="Inter, Arial, sans-serif" font-size="18">{html.escape(node["label"])}</text>')
parts.append('</svg>')
(root/'public/homiq/editorial/information-architecture-flow.svg').write_text(''.join(parts))
print('Exported connected architecture: 29 screens.')
