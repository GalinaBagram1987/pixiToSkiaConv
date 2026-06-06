'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { usePixiStore } from '@/store/pixiStore';
import { renderPixiFigure, Figures } from './pixiData';



interface PixiState {
  // Разрешаем типам быть null
  app: PIXI.Application | null;
  container: PIXI.Container | null;
  figures: Figures[];
  usedIndex: number[];
  
  // Экшены тоже должны принимать null
  setApp: (app: PIXI.Application | null) => void;
  setContainer: (container: PIXI.Container | null) => void;
  addFigure: (figure: Figures) => void;
  addUsedIndex: (index: number) => void;
  resetUsedIndex: () => void;
}

const CanvasPixi = (): React.JSX.Element => {
  const setContainer = usePixiStore((state) => state.setContainer);
  const setApp = usePixiStore((state) => state.setApp);
  
  const figures = usePixiStore((state) => state.figures);
  const container = usePixiStore((state) => state.container);

  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const isInitializingRef = useRef<boolean>(false);

  // ЭФФЕКТ 1: Инициализация приложения PixiJS (Один раз при старте)
  useEffect(() => {
    if (isInitializingRef.current || appRef.current) return;
    isInitializingRef.current = true;

    const initPixi = async (): Promise<void> => {
      if (!containerRef.current) return;
      
      const app = new PIXI.Application();
      await app.init({
        width: 600,
        height: 600,
        backgroundColor: 0xffffff,
        preference: 'canvas', 
        resizeTo: containerRef.current, 
        resolution: window.devicePixelRatio || 1, 
        autoDensity: true, 
      });
      
      if (!containerRef.current) {
        app.destroy(true, { children: true, texture: true });
        return;
      }

      containerRef.current.appendChild(app.canvas);
      appRef.current = app;
      
      setContainer(app.stage);  
      setApp(app); 
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      // Убрали setContainer(null), так как контейнер обязателен и не сбрасывается
      isInitializingRef.current = false;
    };
  }, [setContainer, setApp]);


  // ЭФФЕКТ 2: Идемпотентная отрисовка по уникальным ID фигур
  useEffect(() => {
    if (!container) return;

    // Кейс 1: Стор очищен полностью
    if (figures.length === 0) {
      container.removeChildren().forEach(child => child.destroy({ children: true }));
      return;
    }

    // Кейс 2: Проверяем, какие ID уже физически существуют на холсте Pixi
    const existingIds = container.children
      .map(child => child.label)
      .filter(Boolean) as string[];

    // Отбираем только те фигуры из Zustand, которых еще нет на экране
    const newFigures = figures.filter(figure => !existingIds.includes(figure.id));

    // Отрисовываем строго новые элементы
    newFigures.forEach((figure) => {
      renderPixiFigure(container, figure);
    });

  }, [figures, container]);

  return <div ref={containerRef} className="w-full h-full min-h-[600px] shadow-lg rounded" />;
};

export default CanvasPixi;