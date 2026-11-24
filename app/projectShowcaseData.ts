export type ShowcaseScreen = { src: string; label: string; width: number; height: number };
export type ShowcaseProject = {
  id: string;
  title: string;
  description: string;
  href: string;
  color: string;
  backdrop?: string;
  screens: ShowcaseScreen[];
};

export const showcaseGroups: { title: string; projects: ShowcaseProject[] }[] = [
  {
    title: "Enterprise SaaS",
    projects: [
      {
        id: "program", title: "Program+", href: "/program-plus", color: "#ff914a",
        description: "Manage program timing, work queues, issues, and phase gates in one connected workspace.",
        screens: [{ src: "/program-plus/issue-tracker-inline.png", label: "Open Issue Tracker with issue summary, inline status, and progress", width: 2048, height: 1515 }],
      },
      {
        id: "quote", title: "Quote+", href: "/quote-plus", color: "#79a7db",
        description: "Guide teams from RFQ intake and Go/No-Go qualification through quoting and award handoff.",
        screens: [{ src: "/quote-plus/attachments-overview.webp", label: "Quote attachments workspace and review status", width: 1486, height: 1288 }],
      },
      {
        id: "sustain", title: "Sustain+", href: "/sustain-plus", color: "#24cfca",
        description: "Connect ESG frameworks, ownership, and evidence to prepare sustainability reports.",
        screens: [{ src: "/project-showcase/sustain-summary.webp", label: "Sustainability report summary", width: 800, height: 450 }],
      },
    ],
  },
  {
    title: "Mobile Apps",
    projects: [
      {
        id: "homiq", title: "HOMIQ", href: "/homiq", color: "#f19e43",
        backdrop: "/homiq/editorial/solution-home-evening-v2.png",
        description: "Give people room-by-room control of smart devices, lighting, and scenes.",
        screens: [
          { src: "/homiq/screens/my-home.png", label: "Smart home dashboard", width: 390, height: 844 },
          { src: "/homiq/screens/my-rooms.png", label: "My Rooms screen for choosing a room", width: 390, height: 844 },
          { src: "/homiq/screens/lamp.png", label: "Lamp brightness and power controls", width: 390, height: 844 },
        ],
      },
      {
        id: "slotgo", title: "SlotGo", href: "/slotgo", color: "#20d4c3",
        backdrop: "/project-showcase/slotgo-turf.webp",
        description: "Help players discover and book courts, and give venues a calendar to manage reservations.",
        screens: [
          { src: "/slotgo/customer-home.png", label: "Player home and court discovery", width: 806, height: 1746 },
          { src: "/slotgo/venue-calendar.png", label: "Venue booking calendar", width: 806, height: 1746 },
          { src: "/slotgo/customer-book-time.png", label: "Player booking time slots", width: 806, height: 1746 },
        ],
      },
      {
        id: "ticket9", title: "Ticket9", href: "/ticket9", color: "#ff6577",
        backdrop: "/ticket9/event-backdrop.webp",
        description: "Help attendees discover events, compare ticket tiers, and review their booking before payment.",
        screens: [
          { src: "/ticket9/3433.webp", label: "City discovery and recommendations", width: 1206, height: 2622 },
          { src: "/ticket9/3415.webp", label: "Event overview and booking action", width: 1206, height: 2622 },
          { src: "/ticket9/3419.webp", label: "Booking price and fees", width: 1206, height: 2622 },
        ],
      },
    ],
  },
  {
    title: "Design Systems & Research",
    projects: [
      {
        id: "delivery", title: "Design System to Product", href: "/modern-product-delivery", color: "#9169ff",
        description: "Follow an enterprise interface from Figma components through React implementation and validation.",
        screens: [{ src: "/project-showcase/delivery-interface.webp", label: "Task Automate product interface", width: 800, height: 493 }],
      },
      {
        id: "research", title: "Helmet Interface Research", href: "/f35-helmet-ux", color: "#488dff",
        description: "Explore how a helmet-mounted display can preserve context and reduce visual complexity in flight.",
        screens: [{ src: "/project-showcase/f35-targeting.webp", label: "Cockpit and aircraft tracking visual", width: 800, height: 450 }],
      },
    ],
  },
];
