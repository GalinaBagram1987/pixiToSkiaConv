'use client'

import { usePixiStore } from '@/store/pixiStore';
import Figures from '@/type/figureInterf';

export const FiguresArray: Figures[] = [
  { id: 'f-circle', type: 'circle', x: 200, y: 200, color: 0xf9bebe, size: 50,
    animation: {
      type: 'move', vx: 3, vy: 0, bounce: true }
    },
  { id: 'f-square', type: 'square', x: 120, y: 520, color: 0xb9a3f5, size: 50,
     animation: {
      type: 'move', vx: 0, vy: 3, bounce: true }
    },
  { id: 'f-triangle', type: 'triangle', x: 500, y: 550, xl:490, yl: 500, xr: 520, yr: 520, color: 0xa788ce, 
    animation: {
      type: 'colorChange', toColor: 0xFF0000, speed: 0.02} 
    },
  { id: 'f-line', type: 'line', x: 100, y: 100, color:  0xa3f5ad, toX: 50, toY: 150, lineWidth: 5, 
    animation: {
      type: 'colorChange', toColor: 0xFF0000 , speed: 0.02},
   },
  { id: 'f-png1', type: 'png', x: 500, y: 300, imageUrl: '/1.png', width: 80, height: 80, 
    animation: {
      type: 'pulse', speed: 0.15, amplitude: 0.3, minScale: 0.7 },
    },
  { id: 'f-png2', type: 'png', x: 100, y: 300, imageUrl: '/2.png', width: 80, height: 80, 
    animation: {
      type: 'pulse', speed: 0.15, amplitude: 0.3, minScale: 0.7 },
    },
  { id: 'f-png3', type: 'png', x: 300, y: 300, imageUrl: '/3.png', width: 80, height: 80, 
    animation: {
      type: 'pulse', speed: 0.15, amplitude: 0.3, minScale: 0.7 },
    },
  { id: 'f-text', type: 'text', x: 200, y:450, text: 'Hello', fontSize: 32, fill: 0x000000, fontWeight: 'bold', fontFamily: 'Arial',
    animation: {
      type: 'hover', hoverScaleX: 1.2, hoverScaleY: 1.2},
   }
]

export const getRandomFigure = (arr: Figures[]): Figures | null=> {
   // Получаем актуальное состояние из store
  let currentUsedIds = usePixiStore.getState().usedIndexIds || [];
  const { addUsedIndex, resetUsedIndex } = usePixiStore.getState();
  
  console.log('usedIndexIds ДО:', [...currentUsedIds]);
  
  // Если все фигуры уже были показаны — сбрасываем
  if (currentUsedIds.length >= arr.length) {
    console.log('СБРОС: все фигуры использованы');
    resetUsedIndex();
    currentUsedIds = [];
  }
  
  // Фильтруем: оставляем только те фигуры, чьих ID ещё нет в usedIndexIds
  const availableFigures = arr.filter(figure => !currentUsedIds.includes(figure.id));
  
  console.log('Доступных фигур:', availableFigures.length);
  
  // Если нет доступных (защита)
  if (availableFigures.length === 0) {
    console.log('Нет доступных фигур, сбрасываю');
    resetUsedIndex();
    // Рекурсивно вызываем снова после сброса
    return getRandomFigure(arr);
  }
  
  // Выбираем случайную фигуру из доступных
  const randomIndex = Math.floor(Math.random() * availableFigures.length);
  const chosenFigure = availableFigures[randomIndex];
  
  console.log('Выбрана фигура с ID:', chosenFigure.id);
  
  // Сохраняем ID в список использованных
  addUsedIndex(chosenFigure.id);
  
  console.log('usedIndexIds ПОСЛЕ:', usePixiStore.getState().usedIndexIds);
  
  // Возвращаем копию
  return { ...chosenFigure };
};

