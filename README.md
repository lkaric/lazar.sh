# lazar.sh

A one-page contact site. The address `hi@lazar.sh` is drawn as a field of
particles with [Three.js](https://threejs.org): move to push them, hold to
swirl, click to copy the address.

Built with [Astro](https://astro.build) and TypeScript.

## Getting started

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` starts the development server.
- `pnpm build` type checks and builds the static site into `dist/`.
- `pnpm preview` serves the built site locally.
- `pnpm check` runs the Astro type checker.
- `pnpm lint` checks formatting and lint rules with Biome.
- `pnpm format` applies Biome's formatting and safe fixes.
- `pnpm deploy` builds the site and publishes it with Wrangler.

## Tooling

[Biome](https://biomejs.dev) formats and lints. [Lefthook](https://lefthook.dev)
runs Biome and the type checker before each commit, and commitlint on the
commit message. Hooks are installed by `pnpm install`.

## Deployment

The site is static and is served by Cloudflare from `dist/`, as described in
`wrangler.jsonc`. Connect the repository in the Cloudflare dashboard with the
build command `pnpm build` and the deploy command `npx wrangler deploy`, or
run `pnpm deploy` locally after `wrangler login`.

## Structure

- `src/pages/index.astro` is the page.
- `src/layouts/Base.astro` holds the document head, and fonts.
- `src/scripts/particle-field.ts` is the particle simulation.
- `src/scripts/contact.ts` wires the page: copy button, clock and the field.
