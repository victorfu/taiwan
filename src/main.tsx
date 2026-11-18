import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

async function loadStreetMap() {
  const [library] = await Promise.all([
    import('maplibre-gl'), import('maplibre-gl/dist/maplibre-gl.css')
  ]);
  return library.default;
}

function Atlas() {
  const root = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    let dispose: (() => void) | undefined;
    const modulePath = new URL('./atlas/app.js', document.baseURI).href;
    async function start() {
      const { mount } = await import(/* @vite-ignore */ modulePath);
      if (!active || !root.current) return;
      const cleanup = await mount(root.current, loadStreetMap);
      if (active) dispose = cleanup;
      else cleanup();
    }
    start().catch(error => {
      console.error('地圖啟動失敗',error);
      if (active) setFailed(true);
    });
    return () => { active = false; dispose?.(); };
  }, []);
  if (failed) return <p role="alert">地圖介面載入失敗。<a href="./atlas/places.html">閱讀地方誌與事件</a></p>;
  return <div ref={root} />;
}
createRoot(document.getElementById('root')!).render(<Atlas />);
