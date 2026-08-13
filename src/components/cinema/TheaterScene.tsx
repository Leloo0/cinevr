import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ROWS, COLS, type FormatId } from "@/lib/cinema";

type Props = {
  format: FormatId;
  focusSeat: string | null;
};

const seatWorldPos = (seat: string) => {
  const row = seat[0];
  const num = parseInt(seat.slice(1), 10);
  const r = ROWS.indexOf(row as (typeof ROWS)[number]);
  const x = (num - (COLS + 1) / 2) * 1.1;
  const z = 4 + r * 1.6;
  const y = 1.15 + r * 0.28;
  return new THREE.Vector3(x, y, z);
};

export default function TheaterScene({ format, focusSeat }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<{
    target: THREE.Vector3;
    camPos: THREE.Vector3;
    sideOpacity: number;
  }>({
    target: new THREE.Vector3(0, 1.6, -6),
    camPos: new THREE.Vector3(0, 6.5, 16),
    sideOpacity: 0,
  });

  // keep latest props for the animation loop
  const propsRef = useRef<Props>({ format, focusSeat });
  propsRef.current = { format, focusSeat };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0000ff");
    

    const camera = new THREE.PerspectiveCamera(
      58,
      mount.clientWidth / mount.clientHeight,
      0.1,
      200,
    );
    camera.position.copy(stateRef.current.camPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0x331014, 1.4));
    const screenLight = new THREE.PointLight(0xff4455, 40, 60, 2);
    screenLight.position.set(0, 5, -3);
    scene.add(screenLight);
    const aisle = new THREE.PointLight(0xe50914, 12, 30, 2);
    aisle.position.set(0, 1, 15);
    scene.add(aisle);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 60),
      new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.9, metalness: 0.1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = 6;
    scene.add(floor);

    // Curved main screen
    const screenGeo = new THREE.CylinderGeometry(16, 16, 8, 64, 1, true, Math.PI - 0.55, 1.1);
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 4.2, 10);
    scene.add(screen);

    const screenGlow = new THREE.Mesh(
      screenGeo.clone(),
      new THREE.MeshBasicMaterial({
        color: 0xff2e3b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.28,
      }),
    );
    screenGlow.scale.setScalar(1.03);
    screenGlow.position.copy(screen.position);
    screenGlow.visible = false;
    scene.add(screenGlow);

    // Side projection walls (ScreenX)
    const sideMatL = new THREE.MeshBasicMaterial({
      color: 0xff2e3b,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const sideMatR = sideMatL.clone();
    const sideGeo = new THREE.PlaneGeometry(26, 6.5);
    const leftWall = new THREE.Mesh(sideGeo, sideMatL);
    leftWall.position.set(-8.2, 3.6, 3);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);
    const rightWall = new THREE.Mesh(sideGeo, sideMatR);
    rightWall.position.set(8.2, 3.6, 3);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Structural side panels
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
    });
    for (const sx of [-9.2, 9.2]) {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(28, 8), panelMat);
      panel.position.set(sx, 4, 4);
      panel.rotation.y = sx < 0 ? Math.PI / 2 : -Math.PI / 2;
      scene.add(panel);
    }


    // Seats
    const seatGeo = new THREE.BoxGeometry(0.8, 0.55, 0.7);
    const backGeo = new THREE.BoxGeometry(0.8, 0.8, 0.18);
    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x241012,
      roughness: 0.75,
    });
    const seatMeshes = new Map<string, THREE.Mesh>();
    ROWS.forEach((row, r) => {
      for (let c = 1; c <= COLS; c++) {
        const id = `${row}${c}`;
        const p = seatWorldPos(id);
        const base = new THREE.Mesh(seatGeo, seatMat.clone());
        base.position.set(p.x, p.y - 0.55, p.z);
        scene.add(base);
        const back = new THREE.Mesh(backGeo, base.material as THREE.Material);
        back.position.set(p.x, p.y - 0.15, p.z + 0.35);
        scene.add(back);
        seatMeshes.set(id, back);
      }
    });

    // Riser steps
    ROWS.forEach((_, r) => {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(13, 0.28 * (r + 1), 1.6),
        new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 1 }),
      );
      step.position.set(0, (0.28 * (r + 1)) / 2, 4 + r * 1.6);
      scene.add(step);
    });

    console.log("DBG screen", screen.position.toArray(), screenGeo.attributes.position.count);
    {
      const box = new THREE.Box3().setFromObject(screen);
      console.log("DBG bbox", box.min.toArray(), box.max.toArray());
    }
    let raf = 0;
    let flicker = 0;
    const desiredPos = new THREE.Vector3();
    const desiredTarget = new THREE.Vector3();
    const currentTarget = stateRef.current.target.clone();

    const onResize = () => {
      if (!mount.clientWidth) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const { focusSeat: seat, format: fmt } = propsRef.current;

      if (seat) {
        const p = seatWorldPos(seat);
        desiredPos.set(p.x, p.y + 0.45, p.z + 0.1);
        desiredTarget.set(p.x * 0.25, 4, -8);
      } else {
        desiredPos.set(0, 8.5, 18);
        desiredTarget.set(0, 3.6, -6);
      }

      camera.position.lerp(desiredPos, 0.045);
      currentTarget.lerp(desiredTarget, 0.06);
      camera.lookAt(currentTarget);

      // Screen flicker / projection life
      flicker += 0.03;
      const pulse = 0.22 + Math.sin(flicker) * 0.06;
      (screenGlow.material as THREE.MeshBasicMaterial).opacity = pulse;
      screenLight.intensity = 34 + Math.sin(flicker * 1.7) * 8;

      // ScreenX side walls
      const targetSide = fmt === "screenx" ? 0.5 + Math.sin(flicker * 2) * 0.08 : 0;
      sideMatL.opacity += (targetSide - sideMatL.opacity) * 0.06;
      sideMatR.opacity = sideMatL.opacity;

      // Curvature emphasis for IMAX
      const targetScale = fmt === "standard" ? 1.35 : 1;
      screen.scale.z += (targetScale - screen.scale.z) * 0.06;
      screenGlow.scale.z = screen.scale.z * 1.03;

      // Highlight the focused seat
      seatMeshes.forEach((mesh, id) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const on = id === seat;
        mat.emissive.setHex(0xe50914);
        mat.emissiveIntensity += ((on ? 1.1 : 0.06) - mat.emissiveIntensity) * 0.08;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
}
