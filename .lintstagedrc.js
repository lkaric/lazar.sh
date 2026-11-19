export default {
  // Type check Astro and TypeScript files
  '**/*.(ts|astro)': () => 'pnpm check',

  // Prettify source, Markdown and JSON files
  '**/*.(ts|js|mjs|astro|css|md|json)': filenames =>
    `prettier --write ${filenames.join(' ')}`
};
