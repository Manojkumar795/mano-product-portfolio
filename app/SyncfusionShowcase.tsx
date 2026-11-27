import ScreenshotTrigger from "./ScreenshotTrigger";
import styles from "./syncfusion-showcase.module.css";

const kit = "https://www.figma.com/design/wYEE45GvrHLskb3nxxe1Rp/Syncfusion-Web-UI-Kit---Tailwind-Theme--Community-?m=auto";

const projectNames = {
  program: "Program+",
  quote: "Quote+",
  sustain: "Sustain+",
};

const visuals = [
  {
    title: "Design foundations",
    file: "design-foundations",
    description: "Project accent swatch, Syncfusion Tailwind Day-mode color tokens, Inter type scale, and spacing and corner-radius samples.",
  },
  {
    title: "Component library",
    file: "component-library",
    description: "Syncfusion button states, text fields and dropdowns, checkboxes and switches, tabs, badges, and a confirmation dialog.",
  },
  {
    title: "Enterprise components",
    file: "enterprise-components",
    description: "A Syncfusion data grid with sorting, selection and paging, a Gantt schedule with task dependencies, and form and filter controls using synthetic program data.",
  },
];

export default function SyncfusionShowcase({ project }: { project: keyof typeof projectNames }) {
  const projectName = projectNames[project];

  return (
    <figure className={styles.showcase}>
      {visuals.map(({ title, file, description }) => {
        const src = `/design-system/${project}/${file}.webp`;
        return (
          <ScreenshotTrigger key={file} className={styles.visual} src={src} aria-label={`Open full-size ${title.toLowerCase()}`}>
            {/* The same high-resolution board serves as both the inline visual and its full-size view. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} width={2880} height={1800} alt={`${projectName}. ${description}`} loading="lazy" decoding="async" />
          </ScreenshotTrigger>
        );
      })}
      <figcaption className={styles.credit}>
        Component foundation by <a href={kit} target="_blank" rel="noreferrer">Syncfusion Web UI Kit — Tailwind Theme</a>. Illustrative reconstructions with {projectName} accents and synthetic data.
      </figcaption>
    </figure>
  );
}
