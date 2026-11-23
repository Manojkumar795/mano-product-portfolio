const competitors = [
  {
    name: "Apple Home",
    image: "apple-home.png",
    alt: "Apple Home overview with rooms, cameras, scenes and accessory controls",
    source: "https://support.apple.com/en-us/102313",
    takeaway: "Groups accessories into scenes, with automations for time, location and sensors.",
    className: "homiq-competitor-apple",
  },
  {
    name: "Google Home",
    image: "google-home.webp",
    alt: "Google Home app showing favorite devices, activity and automations",
    source: "https://blog.google/products-and-platforms/devices/google-nest/google-home-app-gemini-redesign/",
    takeaway: "Puts favorite devices up front, with activity and automations in separate tabs.",
    className: "homiq-competitor-google",
  },
  {
    name: "SmartThings",
    image: "smartthings.jpg",
    alt: "SmartThings routine setup on a phone beside a connected lamp",
    source: "https://www.samsung.com/us/support/answer/ANS10002640/",
    takeaway: "Builds routines from explicit “If” conditions and “Then” actions.",
    className: "homiq-competitor-samsung",
  },
];

export function CompetitorComparison() {
  return <div className="homiq-competitors">{competitors.map(competitor =>
    <figure key={competitor.name}>
      <div className={`homiq-competitor-visual ${competitor.className}`}><img src={`/homiq/competitors/${competitor.image}`} alt={competitor.alt} loading="lazy" decoding="async" /></div>
      <figcaption><a href={competitor.source} target="_blank" rel="noreferrer">{competitor.name}</a><p>{competitor.takeaway}</p></figcaption>
    </figure>
  )}</div>;
}
