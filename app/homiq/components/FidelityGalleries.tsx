import ScreenshotTrigger from "../../ScreenshotTrigger";
type Screen = { file: string; label: string };

const midStudies: Screen[][] = [
  [
    { file: "my-home", label: "Home" },
    { file: "my-rooms", label: "Rooms" },
    { file: "lamp", label: "Light control" },
  ],
  [
    { file: "room-choose-photo", label: "Room creation" },
    { file: "scene-select-devices", label: "Scene membership" },
    { file: "scene-set-device-states", label: "Scene states" },
  ],
];

export function MidFidelityGallery() {
  return <div className="homiq-mid-gallery">
    {midStudies.map((screens, index) => <div className="homiq-mid-board" key={screens[0].file} aria-label={index === 0 ? "Daily control wireframes" : "Room and scene wireframes"}>
      {screens.map(screen => <figure key={screen.file}>
        <ScreenshotTrigger src={`/homiq/fidelity/mid/${screen.file}.svg`} aria-label={`Open ${screen.label.toLowerCase()} wireframe at full size`}><img src={`/homiq/fidelity/mid/${screen.file}.svg`} width={390} height={844} alt={`Flat HOMIQ mid-fidelity wireframe: ${screen.label}, using grayscale content blocks and outlined controls`} loading="lazy" decoding="async" /></ScreenshotTrigger>
        <figcaption>{screen.label}</figcaption>
      </figure>)}
    </div>)}
    <figure className="homiq-mid-library"><ScreenshotTrigger src="/homiq/fidelity/mid-library.svg" aria-label="Open all 29 HOMIQ wireframes at full size"><img src="/homiq/fidelity/mid-library.svg" width={1004} height={1174} alt="HOMIQ wireframe library: 29 flat grayscale screens grouped into entry and recovery, home and rooms, device setup and controls, scenes and account" loading="lazy" decoding="async" /></ScreenshotTrigger></figure>
  </div>;
}

const productJourneys: { title: string; screens: Screen[] }[] = [
  { title: "Everyday control", screens: [
    { file: "my-home", label: "Home" },
    { file: "my-rooms", label: "Rooms" },
    { file: "room-appliances", label: "Room appliances" },
    { file: "air-conditioner", label: "Climate" },
    { file: "lamp", label: "Lighting" },
    { file: "tv-remote", label: "TV control" },
  ] },
  { title: "Adding a device", screens: [
    { file: "device-scan-or-nfc", label: "Scan or NFC" },
    { file: "device-light-found", label: "Light found" },
    { file: "device-select-location", label: "Choose a room" },
    { file: "device-name", label: "Name the light" },
    { file: "device-added", label: "Device added" },
  ] },
  { title: "Creating a room", screens: [
    { file: "room-name", label: "Name the room" },
    { file: "room-choose-photo", label: "Choose a photo" },
    { file: "room-select-devices", label: "Select devices" },
    { file: "room-added", label: "Room added" },
  ] },
  { title: "Creating a scene", screens: [
    { file: "scene-choose", label: "Choose a scene" },
    { file: "scene-name", label: "Name the routine" },
    { file: "scene-select-devices", label: "Select devices" },
    { file: "scene-set-device-states", label: "Set device states" },
    { file: "scene-added", label: "Scene added" },
  ] },
  { title: "Account & recovery", screens: [
    { file: "profile-details", label: "Profile details" },
    { file: "recover-password", label: "Recover access" },
    { file: "verify-code", label: "Verify code" },
    { file: "change-password", label: "New password" },
  ] },
  { title: "Entry & settings", screens: [
    { file: "welcome", label: "Welcome" }, { file: "sign-in", label: "Sign in" }, { file: "create-account", label: "Create account" }, { file: "profile", label: "Profile" }, { file: "push-notifications", label: "Notifications" },
  ] },
];

export function HighFidelityGallery() {
  return <><nav className="homiq-mobile-chapters" aria-label="Product experiences"><a href="#experience-discover">Discover</a><a href="#experience-control">Control</a><a href="#experience-automate">Automate</a></nav><div className="homiq-experience-gallery" role="region" tabIndex={0} aria-label="Three product experiences, scroll horizontally on a small screen">
    {experiences.map(experience => <section className={`homiq-experience homiq-experience-${experience.id}`} id={`experience-${experience.id}`} key={experience.id} aria-label={experience.name}>
      <div className="homiq-experience-copy"><h3>{experience.title}</h3><p>{experience.caption} {experience.response}</p></div>
      <div className="homiq-experience-visual">{experience.screens.map(screen => <ProductScreen key={screen.file} screen={screen} />)}</div>
    </section>)}
  </div><details className="homiq-editorial-details homiq-screen-library"><summary>Explore all 29 product screens <span>Complete screen library</span></summary><div className="homiq-library-groups">{productJourneys.map(journey => <section key={journey.title} aria-label={journey.title}><h4>{journey.title}</h4><div className="homiq-library-screens">{journey.screens.map(screen => <ProductScreen key={screen.file} screen={screen} />)}</div></section>)}</div></details></>;
}

const experiences = [
  { id: "discover", name: "Discover", title: "Finding the right control begins with the room.", caption: "Rooms gave device navigation a familiar starting point. Photographs, distinct names and device counts help someone recognize a space, open its appliances and reach the right control.", response: "Adding a device follows a separate QR or NFC path, keeping discovery out of daily control.", screens: [{ file: "my-rooms", label: "Recognize a room" }, { file: "room-appliances", label: "Find its devices" }, { file: "device-scan-or-nfc", label: "Add a device" }] },
  { id: "control", name: "Control", title: "Immediate actions, without unnecessary complexity.", caption: "Power and the current setting needed to be easy to read before an adjustment. I kept those details together across lighting, climate and TV control, while giving each appliance the controls it needs.", response: "The shared hierarchy makes all three device views feel related.", screens: [{ file: "air-conditioner", label: "Set the climate" }, { file: "lamp", label: "Adjust the light" }, { file: "tv-remote", label: "Control the TV" }] },
  { id: "automate", name: "Automate", title: "From individual controls to everyday routines.", caption: "Scenes turn individual actions into repeatable routines. Naming the scene, choosing its devices and setting their ON or OFF states are separate steps, so the intended result is clear before saving.", response: "Six device choices lead to four state switches.", screens: [{ file: "scene-select-devices", label: "Choose what belongs" }, { file: "scene-set-device-states", label: "Define the result" }, { file: "scene-name", label: "Name the routine" }] },
];

function ProductScreen({ screen }: { screen: Screen }) {
  return <figure><ScreenshotTrigger src={`/homiq/screens/${screen.file}.png`} aria-label={`Open ${screen.label.toLowerCase()} product screen at full size`}><img src={`/homiq/screens/${screen.file}.png`} width={390} height={844} alt={`Original HOMIQ product screen: ${screen.label}`} loading="lazy" decoding="async" /></ScreenshotTrigger><figcaption>{screen.label}</figcaption></figure>;
}
