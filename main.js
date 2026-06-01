import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, spring } from 'motion';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  initHeader();

  // 2. Three.js Hero Particles
  initThreeJS();

  // 3. GSAP Scroll Animations
  initGSAP();

  // 4. Motion Spring Interactions
  initMotion();
});

function initHeader() {
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initThreeJS() {
  const canvas = document.querySelector('#hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles (Gold dust / Saffron strands)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 400;
  
  const posArray = new Float32Array(particlesCount * 3);
  const colorsArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i+=3) {
    // Spread them across a wide area
    posArray[i] = (Math.random() - 0.5) * 15;
    posArray[i+1] = (Math.random() - 0.5) * 15;
    posArray[i+2] = (Math.random() - 0.5) * 15;

    // Color (mix of gold and saffron)
    const isGold = Math.random() > 0.6;
    if (isGold) {
       colorsArray[i] = 1.0; // R
       colorsArray[i+1] = 0.84; // G
       colorsArray[i+2] = 0.0; // B
    } else {
       colorsArray[i] = 1.0; // R
       colorsArray[i+1] = 0.4; // G
       colorsArray[i+2] = 0.0; // B
    }
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

  const material = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  const particlesMesh = new THREE.Points(particlesGeometry, material);
  scene.add(particlesMesh);

  camera.position.z = 4;

  // Mouse interactivity
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
  });

  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Rotate slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Gentle parallax based on mouse
    particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
    particlesMesh.position.y += (-mouseY * 0.5 - particlesMesh.position.y) * 0.05;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function initGSAP() {
  // Parallax Hero text
  gsap.to(".hero-content", {
    y: 150,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Staggered reveals
  const revealSections = document.querySelectorAll('.section');
  revealSections.forEach(section => {
    const elements = section.querySelectorAll('.reveal');
    if(elements.length > 0) {
      gsap.fromTo(elements, 
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          }
        }
      );
    }
  });

  // Remove the old CSS class so GSAP can take over smoothly
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('reveal');
  });
}

function initMotion() {
  // Spring hover on primary buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      animate(btn, { scale: 1.05 }, { easing: spring({ stiffness: 300, damping: 15 }) });
    });
    btn.addEventListener('mouseleave', () => {
      animate(btn, { scale: 1 }, { easing: spring({ stiffness: 300, damping: 15 }) });
    });
  });

  // Spring hover on trust badges
  const badges = document.querySelectorAll('.gold-icon');
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      animate(badge, { scale: 1.15, rotate: 5 }, { easing: spring({ stiffness: 400, damping: 10 }) });
    });
    badge.addEventListener('mouseleave', () => {
      animate(badge, { scale: 1, rotate: 0 }, { easing: spring({ stiffness: 300, damping: 15 }) });
    });
  });
}
