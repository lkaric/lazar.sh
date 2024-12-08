/**
 * @see https://eslint.org/docs/v8.x/use/configure
 * @type {import("eslint").Linter.Config}
 */
const config = {
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'plugin:prettier/recommended',
  ],
};

module.exports = config;
