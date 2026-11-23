import { CraftIcon } from "./CraftedPanels";

type StoreSymbol = "back" | "share" | "today" | "games" | "apps" | "arcade" | "search";
const paths: Record<StoreSymbol,string> = {
  back:"m15 4-8 8 8 8",
  share:"M12 15V3m-4 4 4-4 4 4M7 10H4v11h16V10h-3",
  today:"M4 3h16v18H4zM7 7h10M7 11h4v5H7zM14 11h3M14 14h3M7 18h10",
  games:"M7 7h10c3 0 5 8 4 11-1 2-4-1-6-3H9c-2 2-5 5-6 3C2 15 4 7 7 7ZM7 10v5m-2.5-2.5h5M16 11h.1M18 14h.1",
  apps:"m12 3-9 4.5 9 4.5 9-4.5-9-4.5ZM3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5",
  arcade:"M3 16h18l-2 5H5l-2-5ZM12 15V8m0 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 12h3m-1.5-1.5v3",
  search:"M16.5 16.5 22 22M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
};
function StoreGlyph({name}: {name:StoreSymbol}) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>; }

/** Store presentation concept; no invented ratings, release history or download claims. */
export default function StoreConcept() {
  return <figure className="homiq-store-concept" aria-label="HOMIQ App Store presentation concept">
    <div className="homiq-store-device">
      <div className="homiq-store-status" aria-hidden="true"><span>9:41</span><svg viewBox="0 0 58 14"><g fill="currentColor"><rect x="0" y="9" width="3" height="4" rx=".5"/><rect x="5" y="6" width="3" height="7" rx=".5"/><rect x="10" y="3" width="3" height="10" rx=".5"/><rect x="15" y="0" width="3" height="13" rx=".5"/></g><g fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 4q6-6 12 0M25 7q4-4 8 0M28 10q1-1 2 0"/><rect x="40" y="2" width="15" height="10" rx="2"/></g><rect x="42" y="4" width="11" height="6" rx="1" fill="currentColor"/><path d="M57 5v4" stroke="currentColor" strokeWidth="1.5"/></svg></div>
      <div className="homiq-store-island" aria-hidden="true" />
      <div className="homiq-store-back" aria-hidden="true"><StoreGlyph name="back"/><span>Search</span></div>
      <div className="homiq-store-app"><div className="homiq-store-icon"><CraftIcon name="home" /></div><div><h3>HOMIQ: Smart Home</h3><p>Rooms, devices & routines</p><a href="#product" aria-label="View HOMIQ product screens">OPEN</a></div><span className="homiq-store-share" aria-hidden="true"><StoreGlyph name="share"/></span></div>
      <div className="homiq-store-details" aria-label="Concept metadata; ratings and age classification are not assigned">
        <div><span>RATINGS</span><strong>—</strong><i className="homiq-store-stars" aria-hidden="true">★★★★★</i></div>
        <div><span>AGE</span><strong>—</strong><small>Not rated</small></div>
        <div><span>CATEGORY</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="10" r="7"/><circle cx="16" cy="15" r="6"/></svg><small>Lifestyle</small></div>
        <div><span>LANGUAGE</span><strong>EN</strong><small>English</small></div>
      </div>
      <div className="homiq-store-preview"><h4>Preview</h4><div><div className="homiq-store-preview-card"><p>Your home.<br />One place.</p><img src="/homiq/screens/my-home.png" width="390" height="844" alt="HOMIQ Home preview" loading="lazy" decoding="async" /></div><div className="homiq-store-preview-card"><p>Start with<br />a familiar room.</p><img src="/homiq/screens/my-rooms.png" width="390" height="844" alt="HOMIQ Rooms preview" loading="lazy" decoding="async" /></div></div></div>
      <div className="homiq-store-bottom" aria-hidden="true">{([['today','Today'],['games','Games'],['apps','Apps'],['arcade','Arcade'],['search','Search']] as const).map(([name,title])=><span key={name}><StoreGlyph name={name}/>{title}</span>)}</div>
      <div className="homiq-store-home-indicator" aria-hidden="true" />
    </div>
    <figcaption>App Store concept</figcaption>
  </figure>;
}
