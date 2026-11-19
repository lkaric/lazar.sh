import * as THREE from 'three';

export interface ParticleFieldOptions {
  canvas: HTMLCanvasElement;
  /** The word the particles spell at rest. */
  text: string;
  /** CSS font-family used to draw the word, already loaded in the document. */
  fontFamily: string;
  fontWeight?: number;
  colors: {
    /** Background. */
    field: string;
    /** Particles at rest. */
    grain: string;
    /** Particles in motion. */
    heat: string;
  };
  /** Called for a short click or tap on the field (not a drag or a hold). */
  onTap?: () => void;
}

const FOV = 45;
const CAM_Z = 10;
const VIEW_H = 2 * CAM_Z * Math.tan(((FOV / 2) * Math.PI) / 180);
const HOLD_MS = 320;

const VERTEX = /* glsl */ `
  attribute float aSpeed;
  attribute float aSeed;
  uniform float uSize;
  uniform float uPr;
  varying float vSpeed;
  varying float vSeed;
  void main() {
    vSpeed = aSpeed;
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPr * (0.75 + 0.5 * aSeed) * (1.0 + aSpeed * 0.9) * (10.0 / -mv.z);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uHot;
  uniform float uAlpha;
  varying float vSpeed;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.38, 0.5, d);
    if (a < 0.01) discard;
    vec3 col = mix(uBase, uHot, smoothstep(0.05, 0.75, vSpeed));
    gl_FragColor = vec4(col, a * uAlpha * (0.82 + 0.18 * vSeed));
  }
`;

/** Shader colours are written straight to the screen, so keep them in sRGB. */
function rgb(hex: string): THREE.Vector3 {
  const n = parseInt(hex.replace('#', ''), 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255
  );
}

/**
 * Draws a word as a field of particles. Each particle is pulled to its place
 * in the word by a spring and pushed around by the pointer:
 * moving pushes particles away, holding pulls them into a vortex.
 */
export class ParticleField {
  private readonly opts: ParticleFieldOptions;
  private readonly reduce: boolean;
  private readonly count: number;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  private readonly scene = new THREE.Scene();
  private readonly group = new THREE.Group();
  private readonly geometry = new THREE.BufferGeometry();
  private readonly material: THREE.ShaderMaterial;
  private readonly dust: THREE.Points;
  private readonly dustMaterial: THREE.ShaderMaterial;

  private readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly tgt: Float32Array;
  private readonly speed: Float32Array;
  private readonly seed: Float32Array;
  private restTargets: Float32Array = new Float32Array(0);

  private readonly scratch = document.createElement('canvas');
  private readonly local = new THREE.Vector3();
  private readonly ptr = {
    nx: 0,
    ny: 0,
    active: false,
    down: false,
    downAt: 0,
    moved: 0,
    sx: 0,
    sy: 0
  };

  private width = 1;
  private height = 1;
  private viewW = 1;
  private word: string | null = null;
  private lastHold = 0;
  private last = 0;
  private time = 0;
  private rotX = 0;
  private rotY = 0;
  private raf = 0;
  private resizeTimer = 0;
  private wordTimer = 0;
  private disposed = false;

  /** Throws when WebGL is not available. */
  constructor(opts: ParticleFieldOptions) {
    this.opts = opts;
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.count = window.matchMedia('(pointer: coarse)').matches ? 9000 : 20000;

    this.renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setClearColor(0x000000, 0);
    opts.canvas.style.backgroundColor = opts.colors.field;

    this.camera.position.set(0, 0, CAM_Z);
    this.scene.add(this.group);

    const n = this.count;
    this.pos = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.tgt = new Float32Array(n * 3);
    this.speed = new Float32Array(n);
    this.seed = new Float32Array(n);

    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.pos, 3)
    );
    this.geometry.setAttribute(
      'aSpeed',
      new THREE.BufferAttribute(this.speed, 1)
    );
    this.geometry.setAttribute(
      'aSeed',
      new THREE.BufferAttribute(this.seed, 1)
    );
    this.material = this.makeMaterial(1);
    const points = new THREE.Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.group.add(points);

    // A sparse layer of dust around the word, for depth.
    const dustCount = n < 10000 ? 140 : 320;
    const dustPos = new Float32Array(dustCount * 3);
    const dustSeed = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 26;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 9 - 1;
      dustSeed[i] = Math.random();
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(dustPos, 3)
    );
    dustGeometry.setAttribute(
      'aSpeed',
      new THREE.BufferAttribute(new Float32Array(dustCount), 1)
    );
    dustGeometry.setAttribute('aSeed', new THREE.BufferAttribute(dustSeed, 1));
    this.dustMaterial = this.makeMaterial(0.32);
    this.dust = new THREE.Points(dustGeometry, this.dustMaterial);
    this.dust.frustumCulled = false;
    this.scene.add(this.dust);
  }

  start(): void {
    this.layout();
    this.scatter();
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointercancel', this.onUp);
    window.addEventListener('click', this.onClick);
    window.addEventListener('resize', this.onResize);
    document.addEventListener('pointerleave', this.onLeave);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Spell another word for a moment, then return to the resting word. */
  flash(word: string, ms = 1500): void {
    this.word = word;
    this.tgt.set(this.sample([word], this.wide ? 0.7 : 0.8, 0.4).targets);
    if (!this.reduce) this.burst(3);
    window.clearTimeout(this.wordTimer);
    this.wordTimer = window.setTimeout(() => {
      this.word = null;
      this.tgt.set(this.restTargets);
    }, ms);
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.resizeTimer);
    window.clearTimeout(this.wordTimer);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointercancel', this.onUp);
    window.removeEventListener('click', this.onClick);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('pointerleave', this.onLeave);
    this.geometry.dispose();
    this.dust.geometry.dispose();
    this.material.dispose();
    this.dustMaterial.dispose();
    this.renderer.dispose();
  }

  private get wide(): boolean {
    return this.width / this.height > 1.15;
  }

  private makeMaterial(alpha: number): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uSize: { value: 3 },
        uPr: { value: 1 },
        uBase: { value: rgb(this.opts.colors.grain) },
        uHot: { value: rgb(this.opts.colors.heat) },
        uAlpha: { value: alpha }
      }
    });
  }

  /** Break the resting word over two lines on tall screens. */
  private restLines(): string[] {
    const text = this.opts.text;
    const at = text.indexOf('@');
    if (this.wide || at < 0) return [text];
    return [text.slice(0, at + 1), text.slice(at + 1)];
  }

  /** Turn lines of text into one target point per particle by drawing them and sampling the pixels. */
  private sample(
    lines: string[],
    fitW: number,
    fitH: number
  ): { targets: Float32Array; spacing: number } {
    const n = this.count;
    const out = new Float32Array(n * 3);
    const ctx = this.scratch.getContext('2d', { willReadFrequently: true });
    if (!ctx) return { targets: out, spacing: 0.05 };

    const cw = 1500;
    const weight = this.opts.fontWeight ?? 800;
    const font = (px: number) =>
      `${weight} ${px}px ${this.opts.fontFamily}, "Arial Black", sans-serif`;

    let fs = 300;
    ctx.font = font(fs);
    let widest = 1;
    for (const line of lines)
      widest = Math.max(widest, ctx.measureText(line).width);
    fs = (fs * (cw * 0.92)) / widest;
    const lh = fs * 0.92;
    const ch = Math.ceil(lh * lines.length + fs * 0.7);
    this.scratch.width = cw;
    this.scratch.height = ch;
    ctx.clearRect(0, 0, cw, ch);
    ctx.font = font(fs);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    for (const [j, line] of lines.entries()) {
      ctx.fillText(line, cw / 2, fs * 0.95 + j * lh);
    }
    const data = ctx.getImageData(0, 0, cw, ch).data;
    const inked = (x: number, y: number) => data[(y * cw + x) * 4 + 3] > 128;

    // Pick a sampling step that yields roughly one point per particle.
    let area = 0;
    for (let y = 0; y < ch; y += 3) {
      for (let x = 0; x < cw; x += 3) if (inked(x, y)) area += 9;
    }
    const step = Math.max(1.5, Math.sqrt(area / n));

    const pts: number[] = [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let fy = 0; fy < ch; fy += step) {
      for (let fx = 0; fx < cw; fx += step) {
        if (!inked(fx | 0, fy | 0)) continue;
        pts.push(fx, fy);
        if (fx < minX) minX = fx;
        if (fx > maxX) maxX = fx;
        if (fy < minY) minY = fy;
        if (fy > maxY) maxY = fy;
      }
    }
    const m = pts.length / 2;
    if (!m) return { targets: out, spacing: 0.05 };

    const scale = Math.min(
      (this.viewW * fitW) / (maxX - minX),
      (VIEW_H * fitH) / (maxY - minY)
    );
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const spacing = step * scale;

    // Shuffle so that neighbouring particles do not travel together.
    const order = new Uint32Array(m);
    for (let k = 0; k < m; k++) order[k] = k;
    for (let k = m - 1; k > 0; k--) {
      const r = (Math.random() * (k + 1)) | 0;
      const tmp = order[k];
      order[k] = order[r];
      order[r] = tmp;
    }
    for (let i = 0; i < n; i++) {
      const p = order[i % m];
      const jitter = i >= m ? spacing * 0.5 : 0;
      out[i * 3] = (pts[p * 2] - cx) * scale + (Math.random() - 0.5) * jitter;
      out[i * 3 + 1] =
        -(pts[p * 2 + 1] - cy) * scale + (Math.random() - 0.5) * jitter;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.22;
    }
    return { targets: out, spacing };
  }

  private layout(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.viewW = (VIEW_H * this.width) / this.height;

    const wide = this.wide;
    const rest = this.sample(
      this.restLines(),
      wide ? 0.86 : 0.8,
      wide ? 0.5 : 0.42
    );
    this.restTargets = rest.targets;
    this.tgt.set(
      this.word
        ? this.sample([this.word], wide ? 0.7 : 0.8, 0.4).targets
        : this.restTargets
    );

    const size = Math.max(1.6, rest.spacing * (this.height / VIEW_H) * 1.25);
    this.material.uniforms.uSize.value = size;
    this.material.uniforms.uPr.value = pr;
    this.dustMaterial.uniforms.uSize.value = size * 0.9;
    this.dustMaterial.uniforms.uPr.value = pr;
  }

  /** Start the particles spread out so that they assemble into the word. */
  private scatter(): void {
    const { pos, tgt, seed } = this;
    for (let i = 0; i < this.count; i++) {
      seed[i] = Math.random();
      if (this.reduce) {
        pos[i * 3] = tgt[i * 3];
        pos[i * 3 + 1] = tgt[i * 3 + 1];
        pos[i * 3 + 2] = tgt[i * 3 + 2];
      } else {
        const a = Math.random() * Math.PI * 2;
        const r = 4 + Math.random() * 9;
        pos[i * 3] = Math.cos(a) * r;
        pos[i * 3 + 1] = Math.sin(a) * r * 0.7;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      }
    }
    this.geometry.attributes.aSeed.needsUpdate = true;
  }

  /** Kick every particle away from the pointer. */
  private burst(power: number): void {
    const { pos, vel, local } = this;
    for (let i = 0; i < this.count; i++) {
      const dx = pos[i * 3] - local.x;
      const dy = pos[i * 3 + 1] - local.y;
      const dz = pos[i * 3 + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.25;
      const f = power / (d * d + 0.6);
      vel[i * 3] += (dx / d) * f + (Math.random() - 0.5) * 0.6;
      vel[i * 3 + 1] += (dy / d) * f + (Math.random() - 0.5) * 0.6;
      vel[i * 3 + 2] += (Math.random() - 0.5) * f * 1.4;
    }
  }

  private place(ev: PointerEvent): void {
    this.ptr.nx = (ev.clientX / this.width) * 2 - 1;
    this.ptr.ny = -((ev.clientY / this.height) * 2 - 1);
    this.ptr.active = true;
  }

  /** Links and buttons keep their own behaviour; the field ignores presses on them. */
  private onControl(target: EventTarget | null): boolean {
    return target instanceof Element && target.closest('a, button') !== null;
  }

  private onMove = (ev: PointerEvent): void => {
    this.place(ev);
    const p = this.ptr;
    if (p.down) {
      p.moved = Math.max(
        p.moved,
        Math.abs(ev.clientX - p.sx) + Math.abs(ev.clientY - p.sy)
      );
    }
  };

  private onDown = (ev: PointerEvent): void => {
    if (this.onControl(ev.target)) return;
    this.place(ev);
    const p = this.ptr;
    p.down = true;
    p.downAt = performance.now();
    p.moved = 0;
    p.sx = ev.clientX;
    p.sy = ev.clientY;
  };

  private onUp = (ev: PointerEvent): void => {
    const p = this.ptr;
    if (!p.down) return;
    p.down = false;
    this.lastHold = performance.now() - p.downAt;
    if (this.lastHold > HOLD_MS) this.burst(7);
    if (ev.pointerType !== 'mouse') p.active = false;
  };

  private onClick = (ev: MouseEvent): void => {
    if (this.onControl(ev.target)) return;
    if (this.lastHold < HOLD_MS && this.ptr.moved < 10) this.opts.onTap?.();
  };

  private onLeave = (): void => {
    this.ptr.active = false;
  };

  private onResize = (): void => {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => {
      if (!this.disposed) this.layout();
    }, 120);
  };

  private frame = (now: number): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
    if (document.hidden) {
      this.last = now;
      return;
    }
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;

    const { ptr, group, local, pos, vel, tgt, speed, seed } = this;
    const t = this.time;

    // The whole field leans a little toward the pointer.
    if (!this.reduce) {
      const ease = Math.min(1, dt * 3);
      this.rotY += ((ptr.active ? ptr.nx : 0) * 0.2 - this.rotY) * ease;
      this.rotX += ((ptr.active ? -ptr.ny : 0) * 0.13 - this.rotX) * ease;
      group.rotation.set(this.rotX, this.rotY, 0);
      this.dust.rotation.set(this.rotX * 0.5, this.rotY * 0.5 + t * 0.01, 0);
    }
    group.updateMatrixWorld();
    local.set((ptr.nx * this.viewW) / 2, (ptr.ny * VIEW_H) / 2, 0);
    group.worldToLocal(local);

    const hold = ptr.down && now - ptr.downAt > 180;
    const radius = hold ? 4.2 : 1.5;
    const radius2 = radius * radius;
    const spring = hold ? 5 : 34;
    const damp = Math.exp(-(hold ? 2.6 : 5.2) * dt);
    const px = local.x;
    const py = local.y;
    const wave = this.reduce ? 0 : 0.11;

    for (let i = 0; i < this.count; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;
      const x = pos[ix];
      const y = pos[iy];
      const z = pos[iz];
      const tx = tgt[ix];
      const ty = tgt[iy];
      const ripple = Math.sin(tx * 1.3 + t * 1.1 + ty * 0.6) * wave;

      let ax = (tx - x) * spring;
      let ay = (ty + ripple * 0.45 - y) * spring;
      let az = (tgt[iz] + ripple - z) * spring;

      if (ptr.active) {
        const dx = x - px;
        const dy = y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < radius2) {
          const d = Math.sqrt(d2) + 0.0001;
          const nx = dx / d;
          const ny = dy / d;
          const fall = 1 - d / radius;
          if (hold) {
            // Pull inward and around, with a small core that pushes back out.
            const pull = (26 * fall + 6) * (d < 0.35 ? -1.2 : 1);
            ax += -nx * pull - ny * 22 * fall;
            ay += -ny * pull + nx * 22 * fall;
            az += (seed[i] - 0.5) * 10 * fall - z * 3;
          } else {
            const push = fall * 30;
            ax += nx * push - ny * push * 0.22;
            ay += ny * push + nx * push * 0.22;
            az += (seed[i] - 0.5) * push * 0.7;
          }
        }
      }

      const vx = (vel[ix] + ax * dt) * damp;
      const vy = (vel[iy] + ay * dt) * damp;
      const vz = (vel[iz] + az * dt) * damp;
      vel[ix] = vx;
      vel[iy] = vy;
      vel[iz] = vz;
      pos[ix] = x + vx * dt;
      pos[iy] = y + vy * dt;
      pos[iz] = z + vz * dt;
      speed[i] = Math.min(1, Math.sqrt(vx * vx + vy * vy + vz * vz) * 0.16);
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.aSpeed.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  };
}
