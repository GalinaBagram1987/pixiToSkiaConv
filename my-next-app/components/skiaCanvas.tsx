'use client';

import { useEffect, useRef, useState } from 'react';
import { useSkiaStore } from '@/store/skiaStore';

const SkiaCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('Загрузка Skia...');
  const { setSkiaContainer } = useSkiaStore();

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
          
      //     // Рисуем красный квадрат
      //     paint.setColor(CanvasKit.Color(0xFF0000));
      //     canvas.drawRect(CanvasKit.XYWHRect(50, 50, 100, 100), paint);
          
      //     // Рисуем синий круг
      //     paint.setColor(CanvasKit.Color(0, 0, 1, 1));
      //     canvas.drawCircle(300, 300, 50, paint);
          
      //     // Рисуем зелёную линию
      //     paint.setColor(CanvasKit.Color(0, 1, 0, 1));
      //     paint.setStrokeWidth(4);
      //     canvas.drawLine(200, 500, 400, 500, paint);
          
          surface.flush();
          setStatus('Готово (CPU mode)');
          
      //     // Сохраняем в store
          if (setSkiaContainer) setSkiaContainer(surface);
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