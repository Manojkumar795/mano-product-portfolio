import flow from "../../../docs/homiq/information-architecture-flow.json";

const fills: Record<string,string> = {main:"#273c2f",done:"#f5ebd9",screen:"#fbfcfa"};

export function NavigationArchitecture({
  diagram = flow,
  project = "HOMIQ",
  description = "Connected HOMIQ flowchart: entry and account recovery lead to Home, Rooms and Profile. Home connects to device setup, scenes and appliance controls. Rooms connects to room creation and the same controls. Profile connects to details and notifications.",
  detailUrl = "/homiq/editorial/information-architecture-flow.svg",
}: { diagram?: typeof flow; project?: string; description?: string; detailUrl?: string | null } = {}) {
  return <figure className="homiq-craft-panel homiq-connected-flow">
    <figcaption><h3>Information architecture</h3>{detailUrl && <a href={detailUrl} target="_blank" rel="noreferrer" aria-label="Open the full information architecture flowchart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M14 3h7v7m0-7L10 14M10 4H4v16h16v-6"/></svg></a>}</figcaption>
    <div className="homiq-flow-scroll" tabIndex={0} role="region" aria-label={`${project} flowchart. Scroll horizontally to explore on smaller screens.`}>
      <svg className="homiq-flowchart" viewBox={`0 0 ${diagram.width} ${diagram.height}`} role="img" aria-label={description}>
        <defs><marker id="homiq-flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L9 5 1 9Z" fill="#819485"/></marker></defs>
        <g fill="none" stroke="#819485" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {diagram.rails.map(path=><path key={path} d={path}/>)}
          {diagram.edges.map(edge=><path key={`${edge.source}-${edge.target}`} d={edge.path} markerEnd={edge.arrow?"url(#homiq-flow-arrow)":undefined} markerStart={edge.bidirectional?"url(#homiq-flow-arrow)":undefined}/>)}
        </g>
        {diagram.nodes.map(node=><g key={node.id} data-screen={node.id}>
          <rect x={node.x} y={node.y} width={node.width} height={node.height} rx="7" fill={fills[node.kind]} stroke={node.kind==="main"?"#273c2f":"#b9c8bb"} strokeWidth="1.2"/>
          <text x={node.x+node.width/2} y={node.y+node.height/2} dominantBaseline="central" textAnchor="middle" fill={node.kind==="main"?"#fff":"#26332a"} fontFamily="Inter, Arial, sans-serif" fontSize="18" fontWeight="400">{node.label}</text>
        </g>)}
      </svg>
    </div>
  </figure>;
}
