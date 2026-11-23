const pages = [["Home", "/"], ["About me", "/#about"], ["Play", "/#component-playground-title"]];
const projects = [["Program+", "/program-plus"], ["Quote+", "/quote-plus"], ["Sustain+", "/sustain-plus"], ["SlotGo", "/slotgo"], ["Profit+", "/profit-plus"], ["Design System", "/modern-product-delivery"], ["Helmet Research", "/f35-helmet-ux"]];
const connect = [["Contact", "/#contact"], ["CV", "/Manojkumar_N_Premium_Product_Designer_CV.pdf"]];

export default function Section7() {
  return <div className="homiq-footer-inner">
    <div className="homiq-footer-heading">
      <h2>Thanks for stopping by.</h2>
      <a className="homiq-footer-projects" href="/#work">All projects <span aria-hidden="true">↗</span></a>
    </div>
    <div className="homiq-footer-groups">
      <nav aria-label="Footer pages"><h3>Pages</h3><ul>{pages.map(([label,href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul></nav>
      <nav aria-label="Footer selected work"><h3>Selected work</h3><ul className="homiq-footer-work">{projects.map(([label,href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul></nav>
      <nav aria-label="Footer connections"><h3>Connect</h3><ul>{connect.map(([label,href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul></nav>
    </div>
  </div>;
}
