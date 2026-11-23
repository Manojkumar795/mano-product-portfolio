import type { CSSProperties } from "react";
import { showcaseGroups, type ShowcaseProject } from "./projectShowcaseData";
import styles from "./project-showcase.module.css";

function ProjectCard({ project }: { project: ShowcaseProject }) {
  const desktopWindow = !project.backdrop;
  const screens = project.screens.map(screen => (
    <img key={screen.src} src={screen.src} alt={screen.label} width={screen.width}
      height={screen.height} loading="lazy" decoding="async" />
  ));

  return (
    <article className={styles.card} data-project-showcase={project.id}
      style={{ "--project-light": project.color } as CSSProperties}>
      <a className={styles.projectLink} href={project.href} aria-labelledby={`project-${project.id}-title`}>
        <div className={styles.caption}>
          <h4 id={`project-${project.id}-title`}>{project.title}</h4>
          <p>{project.description}</p>
        </div>
        <div className={styles.stage} data-scene={Boolean(project.backdrop)} data-window={desktopWindow}>
          {project.backdrop && <div className={styles.backdrop}
            style={{ backgroundImage: `url("${project.backdrop}")` }} aria-hidden="true" />}
          {desktopWindow ? (
            <div className={styles.window}>
              {screens}
            </div>
          ) : screens}
        </div>
        <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </article>
  );
}

export default function ProjectShowcaseGrid() {
  return (
    <div className={styles.showcase}>
      <h2 className={styles.sectionHeading} id="projects-title">Projects &amp; Research</h2>
      <div className={styles.groups} id="project-grid">
        {showcaseGroups.map(({ title, projects }, index) => (
          <section className={styles.group} key={title} aria-labelledby={`project-group-${index}`}>
            <h3 className={styles.groupHeading} id={`project-group-${index}`}>{title}</h3>
            <div className={styles.cards}>
              {projects.map(project => <ProjectCard key={project.id} project={project} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
