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
- `pnpm format` formats the code with Prettier.

## Structure

- `src/pages/index.astro` is the page.
- `src/layouts/Base.astro` holds the document head, fonts and analytics.
- `src/scripts/particle-field.ts` is the particle simulation.
- `src/scripts/contact.ts` wires the page: copy button, clock and the field.
