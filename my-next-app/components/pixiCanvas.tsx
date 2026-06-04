'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { usePixiStore } from '@/store/pixiStore';

const CanvasPixi = (): React.JSX.Element => {
  const setContainer = usePixiStore((state) => state.setContainer);
  const setApp = usePixiStore((state) => state.setApp);
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
        resolution:  window.devicePixelRatio || 1, //четкость изображения
        autoDensity: true, // автоматически масштабирует стили холста
      });
      
      if (containerRef.current && app.canvas) {
        containerRef.current.appendChild(app.canvas);
        appRef.current = app;
        setContainer(app.stage);  // сохраняем в store
        setApp(app); 
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