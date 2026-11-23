# Mano — Senior Product Designer Portfolio

Full source export of published ChatGPT Sites version 303, commit
`865e6f208d8887fc448fc57242b16b930298d215`.
The export includes a Next.js build setup for Vercel and all original portfolio
routes, case studies, media, and playground source.

## Deploy from GitHub

1. Extract the ZIP. Put the extracted files in the root of your GitHub
   repository so that `package.json` is at the repo root.
2. In Vercel, import that repository as a Next.js project.
3. Use Node.js 24.x. Leave the output directory at its Next.js default.
   The included `vercel.json` sets the build command to `npm run build`.

`npm run build` generates the interactive playground bundle and then builds
the Next.js site. Dependencies are restored from `package-lock.json`.

## Run locally

```sh
npm ci
npm run dev
```

Open the local URL printed by Next.js. For the production version, use
`npm run build` followed by `npm start`.

The original Sites worker build is available as `npm run build:sites`.
