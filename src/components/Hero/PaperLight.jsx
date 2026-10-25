import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

// Paper relief lit by a lamp that follows the pointer. Fibre height comes from
// value noise; its gradient gives a normal, so the light rakes across the sheet.
const FRAGMENT = `
precision highp float;
uniform vec2 u_res;
uniform vec2 u_light;
uniform float u_dark;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fibre(vec2 p) {
  float h = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { h += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; }
  return h + 0.35 * noise(p * vec2(0.6, 5.0));
}
void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 p = px / 3.0;
  float e = 1.0;
  float h = fibre(p);
  vec3 n = normalize(vec3(fibre(p - vec2(e, 0)) - fibre(p + vec2(e, 0)), fibre(p - vec2(0, e)) - fibre(p + vec2(0, e)), 0.35));
  vec2 lp = u_light * u_res;
  vec3 l = normalize(vec3(lp - px, 0.55 * u_res.y));
  float diffuse = dot(n, l);
  float spot = smoothstep(0.75 * u_res.y, 0.0, distance(px, lp));
  float shade = (diffuse - 0.93) * 2.4 + spot * 0.16 - (1.0 - spot) * 0.03 + (h - 0.5) * 0.04;
  float alpha = abs(shade) * mix(1.0, 1.7, u_dark);
  gl_FragColor = vec4(vec3(shade > 0.0 ? 1.0 : 0.0), clamp(alpha, 0.0, mix(0.5, 0.62, u_dark)));
}`;

const VERTEX = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

export default function PaperLight({ sceneRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    const gl = canvas?.getContext('webgl', { premultipliedAlpha: false, antialias: false });
    if (!gl || !scene) return undefined;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uLight = gl.getUniformLocation(program, 'u_light');
    const uDark = gl.getUniformLocation(program, 'u_dark');
    let light = [0.62, 0.62];
    let raf = 0;

    const draw = () => {
      raf = 0;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(canvas.clientWidth * ratio);
      const height = Math.round(canvas.clientHeight * ratio);
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, width, height);
      gl.uniform2f(uLight, light[0], light[1]);
      gl.uniform1f(uDark, document.documentElement.dataset.theme === 'dark' ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(draw); };

    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      || !window.matchMedia?.('(pointer: fine)').matches;
    const move = (event) => {
      const box = canvas.getBoundingClientRect();
      light = [(event.clientX - box.left) / box.width, 1 - (event.clientY - box.top) / box.height];
      request();
    };
    if (!still) scene.addEventListener('pointermove', move);
    const resize = new ResizeObserver(request);
    resize.observe(canvas);
    const theme = new MutationObserver(request);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    scene.dataset.gl = 'on';
    request();

    return () => {
      scene.removeEventListener('pointermove', move);
      resize.disconnect();
      theme.disconnect();
      cancelAnimationFrame(raf);
      delete scene.dataset.gl;
    };
  }, [sceneRef]);

  return <canvas ref={canvasRef} className={styles.paperLight} aria-hidden="true" />;
}
