'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import styles from './GradientCanvas.module.css';

const themeColors = {
 charcoal: [
    new THREE.Color('#313940'), // Przyciemnione o 5%
    new THREE.Color('#4f5559'), // Przyciemnione o 5%
    new THREE.Color('#6b6f72'), // Przyciemnione o 5%
  ],
  midnight: [
    new THREE.Color('#000000'),
    new THREE.Color('#1c1c1c'),
    new THREE.Color('#3c096c'),
  ],
  fairytale: [
    new THREE.Color('#e0eafc'),
    new THREE.Color('#cfdef3'),
    new THREE.Color('#cfdef3'),
  ],
};

const themeAngles = {
  charcoal: 45.0,
  midnight: 135.0,
  fairytale: 135.0,
};

type ThemeName = keyof typeof themeColors;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_angle;

  // Wysokiej jakości funkcja do generowania szumu (hash), która nie tworzy widocznych wzorów.
  float rand(vec2 p) {
      vec3 p3  = fract(vec3(p.xyx) * .1031);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
  }

  mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  }

  void main() {
    vec2 st = vUv;
    float angle_rad = u_angle * 3.14159 / 180.0;
    
    vec2 center = vec2(0.5, 0.5);
    st -= center;
    st = rotate2d(angle_rad) * st;
    st += center;

    float t = st.x;
    vec3 color;

    // *** PRZYWRÓCONA PROSTA, LINIOWA INTERPOLACJA ***
    if (t < 0.5) {
      // Przemapowujemy t z zakresu [0.0, 0.5] na [0.0, 1.0]
      float mix_factor = t * 2.0;
      color = mix(u_color1, u_color2, mix_factor);
    } else {
      // Przemapowujemy t z zakresu [0.5, 1.0] na [0.0, 1.0]
      float mix_factor = (t - 0.5) * 2.0;
      color = mix(u_color2, u_color3, mix_factor);
    }
    
    // Używamy delikatnego szumu, który wcześniej zaakceptowałeś
    float noise = (rand(gl_FragCoord.xy) - 0.5) * 0.01;
    color += noise;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const GradientCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_color1: { value: themeColors.charcoal[0] },
        u_color2: { value: themeColors.charcoal[1] },
        u_color3: { value: themeColors.charcoal[2] },
        u_angle: { value: themeAngles.charcoal },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.render(scene, camera);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    materialRef.current = material;

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  useEffect(() => {
    const currentTheme = (theme && theme in themeColors ? theme : 'charcoal') as ThemeName;
    const material = materialRef.current;
    
    if (material) {
      material.uniforms.u_color1.value = themeColors[currentTheme][0];
      material.uniforms.u_color2.value = themeColors[currentTheme][1];
      material.uniforms.u_color3.value = themeColors[currentTheme][2];
      material.uniforms.u_angle.value = themeAngles[currentTheme];
      
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
  }, [theme]);

  return <canvas ref={canvasRef} className={styles.gradientCanvas} />;
};