function ScreenCrop({ file, viewBox, label, className = "", fit = "slice" }: { file: string; viewBox: string; label: string; className?: string; fit?: "slice" | "meet" }) {
  const [x, y, width, height] = viewBox.split(" ").map(Number);
  const clipId = `homiq-direction-${file}`;
  return <svg className={className} viewBox={viewBox} preserveAspectRatio={`xMidYMid ${fit}`} role="img" aria-label={label}>
    <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
    <image href={`/homiq/screens/${file}.png`} x="0" y="0" width="390" height="844" clipPath={`url(#${clipId})`} />
  </svg>;
}

export function VisualDirectionBoard() {
  return <figure className="homiq-craft-panel homiq-direction-board" aria-label="HOMIQ visual direction: warm interiors, quiet controls and a restrained palette">
    <figcaption><h3>Visual direction</h3></figcaption>
    <div className="homiq-direction-composition">
      <div className="homiq-direction-rooms">
        <ScreenCrop file="welcome" viewBox="0 140 390 300" label="Warm timber, soft seating and natural light in the HOMIQ living-room photograph" />
        <ScreenCrop file="scene-name" viewBox="24 242 342 244" label="Warm bedside lighting against a blue evening sky in the HOMIQ scene photograph" />
      </div>
      <div className="homiq-direction-control"><ScreenCrop file="lamp" viewBox="16 290 358 395" fit="meet" label="Enlarged HOMIQ light-control detail showing a warm lamp and a readable brightness value" /></div>
      <div className="homiq-direction-palette" aria-label="Charcoal, sand and off-white">
        <div><span>Charcoal</span></div><div><span>Sand</span></div><div><span>Off-white</span></div>
      </div>
    </div>
    <p className="homiq-direction-line">Warm spaces. Quiet controls.</p>
  </figure>;
}

const clusters = [
  { title: "Room recognition", tone: "green", observations: ["Three rooms have distinct names.", "Each room pairs its name with a photo.", "Room cards show device counts.", "Appliance icons add context to each room.", "A dedicated Rooms tab preserves location.", "Room names carry into appliance controls."], decision: "Lead with recognizable places." },
  { title: "Setup", tone: "peach", observations: ["Light setup spans five screens.", "Discovery offers QR and NFC guidance.", "A found-light screen confirms discovery.", "Room selection comes before naming.", "One field names the light.", "Back and close controls stay visible."], decision: "Keep one clear choice at each step." },
  { title: "State clarity", tone: "blue", observations: ["Three appliance control models are shown.", "Power state is written as ON / OFF.", "The AC shows a 24° temperature.", "The lamp shows 40% brightness.", "The AC dial marks 18°–30° bounds.", "No AC stepper is visible beside the dial."], decision: "Keep room, power and value together." },
  { title: "Scenes", tone: "yellow", observations: ["Name the routine before choosing devices.", "Six devices appear in membership selection.", "Checkmarks show which devices belong.", "Four switches set desired ON / OFF states.", "Create scene names the final action.", "A named result confirms the scene."], decision: "Choose membership before desired states." },
  { title: "Recovery", tone: "pink", observations: ["Device confirmation names the light and room.", "Room creation ends with a named result.", "Scene creation has a confirmation screen.", "Account recovery uses email, code and password.", "No connection-retry screen is supplied.", "No offline screen is supplied."], decision: "Preserve input and provide a safe retry." },
];

export function AffinityThemeBoard() {
  return <section className="homiq-craft-panel homiq-affinity-map" aria-label="Affinity map of HOMIQ screen-audit observations and design priorities">
    <h3>Affinity mapping</h3>
    <p className="homiq-affinity-basis">Observations from the HOMIQ screen audit, grouped into recurring themes.</p>
    <div className="homiq-affinity-wall">{clusters.map(cluster =>
      <section className={`homiq-affinity-cluster homiq-affinity-${cluster.tone}`} key={cluster.title}>
        <h4>{cluster.title}</h4>
        <ul>{cluster.observations.map(observation => <li key={observation}>{observation}</li>)}</ul>
      </section>
    )}</div>
    <div className="homiq-affinity-priorities"><h4>Design priorities</h4><div>{clusters.map(cluster => <p className={`homiq-affinity-${cluster.tone}`} key={cluster.title}><span>{cluster.title}</span>{cluster.decision}</p>)}</div></div>
  </section>;
}
