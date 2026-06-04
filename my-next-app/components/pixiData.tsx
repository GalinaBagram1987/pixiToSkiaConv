'use client'

import * as PIXI from 'pixi.js';
import { usePixiStore } from '@/store/pixiStore';

export interface Figures {
  type: 'circle' | 'square' | 'triangle' | 'png' | 'line' | 'text',
  // Позиция и трансформации
  x: number,
  y: number,
  angle?: number; // градусы для поворота
  scaleX?: number; // ширина для масштабирования
  scaleY?: number; // высота для масштабирования
  color?: number; // цвет в формате 0xRRGGBB
  size?: number; // для круга, квадрата, треугольника
  // Параметры движения (уже есть)
  vx?: number;   // скорость по X
  vy?: number;   // скорость по Y
  // Для линии 
  toX?: number;       // конечная точка линии по X
  toY?: number;       // конечная точка линии по Y
  lineWidth?: number; // толщина линии
  // Для треугольника
  xl?: number;     // левая нижняя точка X
  yl?: number;     // левая нижняя точка Y
  xr?: number;     // правая нижняя точка X
  yr?: number;     // правая нижняя точка Y
  // Для PNG
  imageUrl?: string;  // откуда брать картинку
  width?: number;     // ширина PNG
  height?: number;    // высота PNG
  // Для текста
  text?: string;
  fontSize?: number;
  fill?: number;
  fontWeight?: string;
  fontFamily?: string;
}

export const FiguresArray: Figures[] = [
  { type: 'circle', x: 200, y: 200, color: 0xf9bebe, size: 50, vx: 0.6 },
  { type: 'square', x: 120, y: 520, color: 0xb9a3f5, size: 50, vy: 0.6},
  { type: 'triangle', x: 500, y: 550, xl:490, yl: 500, xr: 520, yr: 520, color: 0xa788ce, scaleX: 3.5,scaleY: 3.5},
  { type: 'line', x: 100, y: 100, color:  0xa3f5ad, toX: 50, toY: 150, lineWidth: 8, angle: 360 },
  { type: 'png', x: 500, y: 300, imageUrl: '/1.png', width: 80, height: 80, angle: 45 },
  { type: 'png', x: 100, y: 300, imageUrl: '/2.png', width: 80, height: 80, scaleX: 1.5,scaleY: 1.5 },
  { type: 'png', x: 300, y: 300, imageUrl: '/3.png', width: 80, height: 80, angle: 45, scaleX: 1.5,scaleY: 1.5 },
  { type: 'text', x: 200, y:550, text: 'Привет', fontSize: 32, fill: 0x000000, fontWeight: 'bold', fontFamily: 'Arial', angle: 15, }
]

// получаем рандомную фигуру
const usedIndex: number[] = [];

export const getRandomFigure = (arr: Figures[]):Figures => {
    // Находим ещё не использованные индексы
  const notUseIndex = arr.reduce<number[]>((acc, _, index) => {
    if (!usedIndex.includes(index)) {
      acc.push(index);
    }
    return acc;
  }, []);

  // Выбираем случайный из доступных
  const randomIndex = notUseIndex[Math.floor(Math.random() * notUseIndex.length)];
  
  // Сохраняем использованный индекс
  usedIndex.push(randomIndex);

  // Если все индексы уже использованы, сбрасываем историю
  if (usedIndex.length === arr.length) {
    usedIndex.length = 0; // очищаем массив
  }
  
  return arr[randomIndex];

};

export const renderPixiFigure = async (container: PIXI.Container, figure: Figures): Promise<void> => {
  const app = usePixiStore.getState().app;
  switch(figure.type) {
    case 'circle':
      const circle = new PIXI.Graphics();
      circle.circle(figure.x, figure.y, figure.size || 30)
      .fill({ color: figure.color });

      // двигаем
      if (app && (figure.vx || figure.vy)) {
      app.ticker.add((time) => {
        circle.x += (figure.vx || 0) * time.deltaTime;
        circle.y += (figure.vy || 0) * time.deltaTime;   
        // Когда круг уходит за край — возвращаем его
        if (circle.x > app.screen.width) circle.x = 0;
        if (circle.x < 0) circle.x = app.screen.width;
        if (circle.y > app.screen.height) circle.y = 0;
        if (circle.y < 0) circle.y = app.screen.height;
        });
      }
      container.addChild(circle);
      break;

    case 'square':
      const square = new PIXI.Graphics();
      square.rect(figure.x, figure.y, figure.size || 30, figure.size || 50)
      .fill({ color: figure.color });
      // двигаем
      if (app && (figure.vx || figure.vy)) {
      app.ticker.add((time) => {
        square.x += (figure.vx || 0) * time.deltaTime;
        square.y += (figure.vy || 0) * time.deltaTime;   
        // Когда  уходит за край — возвращаем его
        if (square.x > app.screen.width) square.x = 0;
        if (square.x < 0) square.x = app.screen.width;
        if (square.y > app.screen.height) square.y = 0;
        if (square.y < 0) square.y = app.screen.height;
        });
      }
      container.addChild(square);
      break;

    case 'triangle':
      const triangle = new PIXI.Graphics();
      if (figure.x && figure.y && figure.xr && figure.yr && figure.xl && figure.yl) {
        triangle.poly([figure.x, figure.y, figure.xr, figure.yr, figure.xl, figure.yl])
        .fill({ color: figure.color });
        container.addChild(triangle);
      } else {
        console.error('Недостаточно точек для треугольника');
      } // poly нужна проверка на существование. или так ?? 0 (базовое значение)
      break;

    case 'line':
      const line = new PIXI.Graphics();
      line.moveTo(figure.x ?? 0, figure.y ?? 0)
      .lineTo(figure.toX ?? 0, figure.toY ?? 0)
      .stroke({ 
        color: figure.color ?? 0x000000, 
        width: figure.lineWidth ?? 2 
      });
      container.addChild(line);
      break;
    case 'png':
       if (!figure.imageUrl) {
        console.error('PNG: imageUrl не указан');
        break;
      }
      try {
        const texture = await PIXI.Assets.load(figure.imageUrl);
        const sprite = new PIXI.Sprite(texture);
        sprite.x = figure.x ?? 0;
        sprite.y = figure.y ?? 0;
        if (figure.width) sprite.width = figure.width;
        if (figure.height) sprite.height = figure.height;
        container.addChild(sprite);
      } catch (error) {
        console.error('Ошибка загрузки PNG:', figure.imageUrl, error);
      }
      break;

    case 'text':
      const text = new PIXI.Text(
        figure.text || '',
        {
          fontSize: figure.fontSize || 24,
          fill: figure.fill || figure.color || 0x000000,
          fontWeight: (figure.fontWeight as any) || 'normal',
          fontFamily: figure.fontFamily || 'Arial',
          },
        );
      text.x = figure.x;
      text.y = figure.y;
      text.angle = figure.angle || 0;
      text.scale.set(figure.scaleX || 1, figure.scaleY || 1);
      // Интерактивность
      text.eventMode = 'static'; // Включаем обработку событий для этого объекта
      text.cursor = 'pointer'; // Меняем курсор при наведении — как у обычной кнопки
  
      // Наводим — увеличиваем
      text.on('pointerover', () => { text.scale.set(1.2); });
      // Уводим — возвращаем размер
      text.on('pointerout',  () => { text.scale.set(1.0); });
      // Нажимаем — делаем полупрозрачным
      text.on('pointerdown', () => { text.alpha = 0.6; });
      // Отпускаем — возвращаем непрозрачность
      text.on('pointerup',   () => { text.alpha = 1.0; });
    container.addChild(text);
  break;
  };
};




