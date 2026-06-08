'use client';

import { useEffect, useRef, useState } from 'react';
import { useSkiaStore } from '@/store/skiaStore';

const SkiaCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('Загрузка Skia...');
  // ДОБАВЛЯЕМ setSurface и setCanvasKit
  const { setSkiaContainer, setSurface, setCanvasKit } = useSkiaStore();


  useEffect(() => {
    // Флаг для предотвращения обновления после размонтирования.
    let disposed = false;

    const initSkia = async () => {
      if (!canvasRef.current) {
        setStatus('Ошибка: canvas не найден');
        return;
      }

      try {
        // Загружаем скрипт
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/canvaskit-wasm@0.39.1/bin/canvaskit.js';
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        
        if (disposed) return;
        setStatus('Инициализация CanvasKit...');
        
        // Инициализируем CanvasKit
        // @ts-ignore
        const CanvasKit = await window.CanvasKitInit({
          locateFile: (file: string) => `https://unpkg.com/canvaskit-wasm@0.39.1/bin/${file}`,
        });
        
        if (disposed) return;
        setStatus('Создание поверхности (CPU mode)...');
        
        // Используем CPU-рендеринг
        // Делаем canvas видимым для Skia через CPU
        const surface = CanvasKit.MakeSWCanvasSurface(canvasRef.current);
        
        if (surface) {
          const canvas = surface.getCanvas();
          // const paint = new CanvasKit.Paint();
          
          // Очищаем белым
          canvas.clear(CanvasKit.WHITE);
          surface.flush();
          setStatus('Готово (CPU mode)');
          
       // Сохраняем в store
       // сохраняем HTMLCanvasElement, а не surface
          // skiaContainer нужен для Canvas 2D API (renderSkiaFromPixi)
          if (setSkiaContainer) setSkiaContainer(canvasRef.current);
          
          // Сохраняем surface и CanvasKit для продвинутого рендера (если понадобится)
          if (setSurface) setSurface(surface);
          if (setCanvasKit) setCanvasKit(CanvasKit);
        } else {
           setStatus('Ошибка создания поверхности');
         }
      } catch (err) {
       console.error(err);
         setStatus('Ошибка: ' + (err instanceof Error ? err.message : String(err)));
      }
    };
    
    initSkia();
    
    return () => {
      disposed = true;
    };
  }, [setSkiaContainer]);

  return (
    <div>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={600} 
        style={{ display: 'block', margin: '0 auto', border: '1px solid #ccc' }}
      />
      <div style={{ textAlign: 'center', marginTop: 10, padding: 8, background: '#f0f0f0', borderRadius: 4 }}>
        Status: {status}
      </div>
    </div>
  );
};

export default SkiaCanvas;