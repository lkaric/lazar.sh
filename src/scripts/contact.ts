import { ParticleField } from './particle-field';

const root = document.documentElement;
const canvas = document.querySelector<HTMLCanvasElement>('#field');
const copyButton = document.querySelector<HTMLButtonElement>('#copy');
const address = document.querySelector<HTMLElement>('#address');
const status = document.querySelector<HTMLElement>('#status');
const hint = document.querySelector<HTMLElement>('#hint');
const clock = document.querySelector<HTMLElement>('#clock');

const email = copyButton?.dataset.email ?? 'hi@lazar.sh';
const token = (name: string) =>
  getComputedStyle(root).getPropertyValue(name).trim();

let field: ParticleField | undefined;

// Belgrade local time, next to the place name.
const time = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Belgrade'
});
const tick = () => {
  if (clock) clock.textContent = time.format(new Date());
};
tick();
window.setInterval(tick, 10_000);

if (hint && window.matchMedia('(pointer: coarse)').matches) {
  hint.textContent = 'Drag to push. Hold to swirl. Tap to copy.';
}

// Copying the address.
let resetTimer = 0;
const say = (label: string, message: string, done: boolean, ms: number) => {
  if (!copyButton || !status) return;
  copyButton.textContent = label;
  copyButton.classList.toggle('done', done);
  status.textContent = message;
  window.clearTimeout(resetTimer);
  resetTimer = window.setTimeout(() => {
    copyButton.textContent = 'Copy';
    copyButton.classList.remove('done');
    status.textContent = '';
  }, ms);
};

const copied = () => {
  say('Copied', `Copied ${email}`, true, 1800);
  field?.flash('copied');
};

/** When the clipboard is not available, select the address so it can be copied by hand. */
const copyFailed = () => {
  if (address) {
    const range = document.createRange();
    range.selectNodeContents(address);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
  say('Selected', 'Address selected. Copy it with your keyboard.', false, 2400);
};

const copy = () => {
  if (!navigator.clipboard?.writeText) return copyFailed();
  navigator.clipboard.writeText(email).then(copied, copyFailed);
};

copyButton?.addEventListener('click', copy);

// The particle field. It needs the display face before it can draw the word.
const start = () => {
  if (!canvas || field) return;
  try {
    field = new ParticleField({
      canvas,
      text: email,
      fontFamily: 'Syne',
      fontWeight: 800,
      colors: {
        field: token('--field'),
        grain: token('--grain'),
        heat: token('--heat')
      },
      onTap: copy
    });
    field.start();
  } catch {
    root.classList.add('no-webgl');
  }
};

if (document.fonts?.load) {
  document.fonts.load('800 120px Syne').then(start, start);
  window.setTimeout(start, 1800);
} else {
  start();
}
