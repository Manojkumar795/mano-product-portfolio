# Mano Portfolio — local editing

## Open in VS Code
1. Extract this ZIP into your chosen local folder.
2. In VS Code choose File > Open Folder and select Mano-Portfolio (the folder containing package.json).
3. Install Node.js 22.13 or newer if needed, then restart VS Code.
4. Open Terminal > New Terminal and run:

    npm ci
    npm run build:embeds
    npm run dev:local

5. Open the localhost address printed in the terminal.
6. Keep the terminal running while editing. Changes refresh automatically. Stop with Ctrl+C.

For the standalone production build used by Vercel, run:

    npm ci
    npm run build
    npm run start

The production build generates the six interactive Playground canvases in
`public/playground-embeds` before Next.js builds the site. Build from the
repository root. The generated files are recreated on every build. On Vercel,
use the Next.js framework preset and the repository's `npm run build` command
from `vercel.json`.

To edit with the Vinext development server, first build the canvases with
`npm run build:embeds`, then run `npm run dev:local`. Rebuild the canvases
after changing their source. Sites builds use `npm run build:sites`.

## Where to edit
- app/page.tsx: home page sections.
- app/ProjectShowcaseGrid.tsx and app/project-showcase.module.css: Work & Research grid and screen scrolling.
- app/projectShowcaseData.ts: project titles, links, and preview assets.
- app/ComponentPlayground.tsx and app/component-playground.css: component arrangement and spacing.
- app/components/mano-playground/: interactive components, including FirstPage.
- playground-embeds/embed.css: embedded component styling overrides.
- public/: images, book covers, 3D assets, and other local media.

This project uses React/TypeScript with Vinext/Vite. Run it with the development server, rather than opening a TSX or HTML file directly.
All tracked source and local assets are included. Dependencies and build output are intentionally excluded; npm ci recreates dependencies.
Local edits do not automatically update the live website. Publishing is a separate step.
