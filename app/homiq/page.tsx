import type { Metadata } from "next";
import { Inter } from "next/font/google";
import CaseCanvas from "./CaseCanvas";
import "./homiq.css";
import Section75 from "./sections/Section75";
import Section145 from "./sections/Section145";
import Section141 from "./sections/Section141";
import Section149 from "./sections/Section149";
import Section161 from "./sections/Section161";
import Section884 from "./sections/Section884";
import DiscoveryQuestions from "./components/DiscoveryQuestions";
import Section899 from "./sections/Section899";
import Section251 from "./sections/Section251";
import Section328 from "./sections/Section328";
import Section342 from "./sections/Section342";
import Section435 from "./sections/Section435";
import Section367 from "./sections/Section367";
import Section470 from "./sections/Section470";
import Section530 from "./sections/Section530";
import Section565 from "./sections/Section565";
import Section639 from "./sections/Section639";
import Section657 from "./sections/Section657";
import Section720 from "./sections/Section720";
import Section733 from "./sections/Section733";
import Section774 from "./sections/Section774";
import Section807 from "./sections/Section807";
import Section823 from "./sections/Section823";
import Section833 from "./sections/Section833";
import Section876 from "./sections/Section876";
import Hero from "./sections/Section919";
import ReferenceFooter from "./sections/Section7";

const inter = Inter({subsets:["latin"], variable:"--font-homiq"});
export const metadata: Metadata = {
 title: "HOMIQ — Smart Home Control & Automation | Manoj Kumar N",
 description: "HOMIQ smart-home design by Manoj Kumar N: room and device flows, a shared control model, interface decisions and a focused validation plan.",
};
export default function HomiqPage() {
 return <main className={`homiq-page ${inter.variable}`}>
  <header className="homiq-toolbar">
   <a className="homiq-toolbar-brand" href="/#work" aria-label="Manoj Kumar N, selected work"><span>MK</span><strong>Manoj Kumar N</strong></a>
   <nav aria-label="Homiq case study navigation"><a href="#overview">Overview</a><a href="#discovery">Discovery</a><a href="#research">Research</a><a href="#product">Product</a><a href="#design-system">Design system</a></nav>
   <a className="homiq-toolbar-projects" href="/#work">All projects <span aria-hidden="true">↗</span></a>
  </header>
  <header className="homiq-hero"><Hero /></header>
  <CaseCanvas>
   <article className="homiq-body" aria-label="HOMIQ Smart Home Control & Automation case study by Manoj Kumar N">
<section className="homiq-section" id="overview" aria-label="Overview" style={{ height: 408.0, marginTop: 0.0 }}><div style={{ position: "absolute", left: 255.0, top: 0.0, width: 1002.0, height: 408.0 }}><Section75 /></div>
<div style={{ position: "absolute", left: 254.0, top: 79.0, width: 1004.0, height: 3.0 }}><Section145 /></div>
<div style={{ position: "absolute", left: 254.0, top: 216.0, width: 1004.0, height: 3.0 }}><Section141 /></div></section><section className="homiq-section" aria-label="Our Vision" style={{ height: 195.0, marginTop: 100.0 }}><div style={{ position: "absolute", left: 255.0, top: 0.0, width: 1002.0, height: 195.0 }}><Section149 /></div></section><section className="homiq-section" aria-label="The Process" style={{ height: 381.0, marginTop: 100.0 }}><div style={{ position: "absolute", left: 247.0, top: 0.0, width: 1052.0, height: 381.0 }}><Section161 /></div></section><section className="homiq-section" id="discovery" aria-label="Initial Problem Discovery" style={{ height: 342.0, marginTop: 100.0 }}><div style={{ position: "absolute", left: 255.0, top: 0.0, width: 1002.0, height: 342.0 }}><Section884 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="Research illustrations" style={{ marginTop: 60 }}><div className="homiq-fluid-column homiq-crafted-section"><DiscoveryQuestions /></div></section><section className="homiq-section" aria-label="Problem statement" style={{ height: 42.0, marginTop: 60.0 }}><div style={{ position: "absolute", left: 255.0, top: 0.0, width: 1002.0, height: 42.0 }}><Section899 /></div></section><section className="homiq-section" aria-label="Desk Research" style={{ height: 725.0, marginTop: 100.0 }}><div style={{ position: "absolute", left: 245.5, top: 0.0, width: 1011.0, height: 725.0 }}><Section251 /></div></section><section className="homiq-section" aria-label="Competitor Analysis" style={{ height: 635.0, marginTop: 100.0 }}><div style={{ position: "absolute", left: 247.0, top: 0.0, width: 1002.0, height: 635.0 }}><Section328 /></div></section><section className="homiq-section" id="research" aria-label="User Research Framework" style={{ height: 1906.0, marginTop: 100.0 }}><div style={{ position: "absolute", left: 254.0, top: 0.0, width: 1004.0, height: 1906.0 }}><Section342 /></div></section><section className="homiq-section" aria-label="User Pain Points" style={{ height: 707.0, marginTop: 59.0 }}><div style={{ position: "absolute", left: 246.5, top: 0.0, width: 1001.0, height: 707.0 }}><Section435 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="User Personas" style={{ marginTop: 100 }}><div style={{ position: "relative", left: 246, width: 1004, height: 566 }}><Section367 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="User Journey" style={{ marginTop: 100 }}><div className="homiq-fluid-column"><Section470 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="Developing a Solution" style={{ marginTop: 100 }}><div className="homiq-fluid-column"><Section530 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="Moodboard & Affinity" style={{ marginTop: 100 }}><div className="homiq-fluid-column"><Section565 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="Low-Fidelity" style={{ marginTop: 99 }}><div className="homiq-fluid-column"><Section639 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="Mid-Fidelity" style={{ marginTop: 100 }}><div className="homiq-fluid-column"><Section657 /></div></section><section className="homiq-section homiq-section-fluid" id="product" aria-label="High-Fidelity" style={{ marginTop: 100 }}><div className="homiq-fluid-column"><Section720 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="Design Decisions" style={{ marginTop: 80 }}><div className="homiq-fluid-column"><Section733 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="Empty States & Recovery" style={{ marginTop: 60 }}><div className="homiq-fluid-column"><Section774 /></div></section><section className="homiq-section homiq-section-fluid" id="design-system" aria-label="Design System" style={{ marginTop: 100 }}><div className="homiq-fluid-column"><Section807 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="Product Sequences" style={{ marginTop: 99 }}><div className="homiq-fluid-column"><Section823 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="Product Outcomes" style={{ marginTop: 80 }}><div className="homiq-fluid-column"><Section833 /></div></section><section className="homiq-section homiq-section-fluid" aria-label="Reflection by Manoj" style={{ marginTop: 80 }}><div className="homiq-fluid-column"><Section876 /></div></section>
   </article>
   <footer className="homiq-footer"><ReferenceFooter /></footer>
  </CaseCanvas>
 </main>;
}
