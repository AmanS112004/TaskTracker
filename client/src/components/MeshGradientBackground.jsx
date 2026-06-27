import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const MeshGradientBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xece7d8);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.45);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const paperGroup = new THREE.Group();
    scene.add(paperGroup);

    const count = 7;
    const papers = [];
    
    for (let i = 0; i < count; i++) {
      const w = 6 + Math.random() * 8;
      const h = w * (1.2 + Math.random() * 0.4);
      const geometry = new THREE.PlaneGeometry(w, h);
      const material = new THREE.MeshLambertMaterial({
        color: 0xefe5c8,
        transparent: true,
        opacity: 0.35 + Math.random() * 0.25,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15
      );
      
      mesh.rotation.set(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        Math.random() * Math.PI
      );

      paperGroup.add(mesh);

      papers.push({
        mesh,
        vx: (Math.random() - 0.5) * 0.005,
        vy: (Math.random() - 0.5) * 0.005,
        vr: (Math.random() - 0.5) * 0.002
      });
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      papers.forEach((p) => {
        p.mesh.position.x += p.vx;
        p.mesh.position.y += p.vy;
        p.mesh.rotation.z += p.vr;

        if (p.mesh.position.x > 35) p.mesh.position.x = -35;
        if (p.mesh.position.x < -35) p.mesh.position.x = 35;
        if (p.mesh.position.y > 25) p.mesh.position.y = -25;
        if (p.mesh.position.y < -25) p.mesh.position.y = 25;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      papers.forEach((p) => {
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
      });
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-20 bg-[#ece7d8] overflow-hidden" />;
};

export default MeshGradientBackground;
