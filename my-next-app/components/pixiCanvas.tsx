'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const CanvasPixi = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    const initPixi = async () => {
      if (!containerRef.current) return;
      
      const app = new PIXI.Application();
      await app.init({
        width: 600,
        height: 600,
        backgroundColor: 0xffffff,
        preference: 'canvas', // ← принудительно используем 2D canvas
        resizeTo: containerRef.current, //  Привязываем размер канваса к div-контейнеру
      });
      
      if (containerRef.current && app.canvas) {
        containerRef.current.appendChild(app.canvas);
        appRef.current = app;
      }
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, true);
        appRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} />;
};

export default CanvasPixi;