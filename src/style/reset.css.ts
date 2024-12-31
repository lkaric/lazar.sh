import { globalStyle } from '@vanilla-extract/css';

// Reset box-sizing
globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

// HTML & Body reset
globalStyle('html', {
  fontSize: '62.5%',
  lineHeight: 1.2,
  WebkitTextSizeAdjust: '100%',
  minHeight: '100dvh',
});

globalStyle('body', {
  margin: 0,
  minHeight: '100dvh',
  minWidth: '100dvw',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textRendering: 'optimizeLegibility',
});

// Headings
globalStyle('h1, h2, h3, h4, h5, h6', {
  fontSize: 'inherit',
  fontWeight: 'inherit',
});

// Lists
globalStyle('ol, ul', {
  listStyle: 'none',
});

// Links
globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

// Images
globalStyle('img, picture, video, canvas, svg', {
  display: 'block',
  maxWidth: '100%',
});

// Forms
globalStyle('input, button, textarea, select', {
  font: 'inherit',
});

globalStyle('button', {
  backgroundColor: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
});

// Text overflow
globalStyle('p, h1, h2, h3, h4, h5, h6', {
  overflowWrap: 'break-word',
});

// Root stacking context
globalStyle('#root, #__next', {
  isolation: 'isolate',
});

// Remove default fieldset styles
globalStyle('fieldset', {
  margin: 0,
  padding: 0,
  border: 'none',
});

// Tables
globalStyle('table', {
  borderCollapse: 'collapse',
  borderSpacing: 0,
});

// Hidden attribute
globalStyle('[hidden]', {
  display: 'none',
});

// Fix mobile tap highlight
globalStyle('* ', {
  WebkitTapHighlightColor: 'transparent',
});

// Disable iOS text size adjust
globalStyle('body', {
  WebkitTextSizeAdjust: 'none',
});
