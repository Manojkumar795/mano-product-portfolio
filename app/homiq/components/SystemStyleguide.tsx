import { CraftIcon } from "./CraftedPanels";
import LayoutMeasurements from "./LayoutMeasurements";

/** Specimens use original screen pixels, so the application UI is unchanged. */
function Fragment({ id, file, box, label }: { id: string; file: string; box: [number, number, number, number]; label: string }) {
  const [x, y, width, height] = box;
  return <svg className="homiq-kit-fragment" style={{ width: `${width / 342 * 100}%` }} viewBox={box.join(" ")} role="img" aria-label={label}>
    <defs><clipPath id={`system-${id}`}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
    <image href={`/homiq/screens/${file}.png`} width="390" height="844" clipPath={`url(#system-${id})`} />
  </svg>;
}
const palette = [["Background", "#141817"], ["Surface", "#242A28"], ["Action", "#EFCC9B"], ["Text", "#F7F5EE"], ["Secondary", "#B7BDB7"]];

export function SystemStyleguide() {
  return <section className="homiq-kit-card homiq-kit-guide" aria-label="HOMIQ component style guide">
    <h3>HOMIQ Mobile App Styleguide</h3>
    <div className="homiq-kit-specimens">
      <figure><figcaption>Primary & secondary actions</figcaption><div className="homiq-kit-stage homiq-kit-actions"><Fragment id="primary" file="sign-in" box={[24,497,342,52]} label="Sand Sign in primary action" /><Fragment id="secondary" file="sign-in" box={[24,582,342,52]} label="Continue with Google secondary action" /></div></figure>
      <figure><figcaption>Text action</figcaption><div className="homiq-kit-stage"><Fragment id="text-action" file="sign-in" box={[245,449,121,25]} label="Forgot password text action" /></div></figure>
      <figure><figcaption>Labelled fields</figcaption><div className="homiq-kit-stage"><Fragment id="fields" file="sign-in" box={[24,254,342,168]} label="Email and password fields" /></div></figure>
      <figure><figcaption>Device selection</figcaption><div className="homiq-kit-stage"><Fragment id="selection" file="scene-select-devices" box={[24,255,342,148]} label="Original unselected Smart TV and selected Air purifier rows" /></div></figure>
      <figure><figcaption>Power switches</figcaption><div className="homiq-kit-stage"><Fragment id="switches" file="scene-set-device-states" box={[24,228,342,179]} label="Original OFF and ON switch states" /></div></figure>
      <figure><figcaption>Setup progress</figcaption><div className="homiq-kit-stage homiq-kit-progress"><Fragment id="progress-two" file="scene-select-devices" box={[24,128,342,12]} label="Two setup segments highlighted" /><Fragment id="progress-three" file="scene-set-device-states" box={[24,132,342,12]} label="Three setup segments highlighted" /></div></figure>
      <figure><figcaption>Bottom navigation</figcaption><div className="homiq-kit-stage"><Fragment id="nav" file="my-home" box={[63,727,264,63]} label="Home, Rooms and Profile navigation" /></div></figure>
      <figure><figcaption>Iconography</figcaption><div className="homiq-kit-stage homiq-kit-icons">{(["home","rooms","profile","light","power","plus"] as const).map(name => <CraftIcon key={name} name={name} />)}</div></figure>
      <figure><figcaption>Room card</figcaption><div className="homiq-kit-stage"><Fragment id="room" file="my-rooms" box={[24,191,342,158]} label="Living room photograph card" /></div></figure>
      <figure><figcaption>Device rows</figcaption><div className="homiq-kit-stage"><Fragment id="rows" file="my-home" box={[24,489,342,179]} label="Device identity, count and power state" /></div></figure>
    </div>
    <div className="homiq-kit-foundations">
      <section><h4>Colors</h4><div className="homiq-kit-colors">{palette.map(([name,color]) => <div key={name}><i style={{background:color}} /><div><strong>{color}</strong><span>{name}</span></div></div>)}</div></section>
      <section><h4>Text styles</h4><div className="homiq-kit-type"><div><span>Title</span><p>My home</p></div><div><span>Section heading</span><p>Frequently used</p></div><div><span>Body & controls</span><p>Your light is connected.</p></div><div><span>Supporting label</span><p>POWER ON</p></div></div></section>
    </div>
  </section>;
}

export function SystemMeasurements() {
  return <figure className="homiq-kit-card homiq-kit-general">
    <figcaption><h3>General anatomy</h3></figcaption>
    <div className="homiq-kit-general-grid"><LayoutMeasurements /></div>
  </figure>;
}
