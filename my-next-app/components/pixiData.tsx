'use client'

import * as PIXI from 'pixi.js';

export interface Figures {
  type: 'circle' | 'square' | 'triangle' | 'png' | 'line',
  x: number,
  y: number,
  color?: number;      // цвет в формате 0xRRGGBB
  size?: number;      // для круга, квадрата, треугольника
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
}

export const FiguresArray: Figures[] = [
  { type: 'circle', x: 200, y: 200, color: 0xf9bebe, size: 50 },
  { type: 'square', x: 120, y: 520, color: 0xb9a3f5, size: 50 },
  { type: 'triangle', x: 500, y: 550, xl:490, yl: 500, xr: 520, yr: 520, color: 0xa788ce},
  { type: 'line', x: 100, y: 100, color:  0xa3f5ad, toX: 50, toY: 150, lineWidth: 5 },
  { type: 'png', x: 500, y: 300, imageUrl: '/1.png', width: 80, height: 80 },
  { type: 'png', x: 100, y: 300, imageUrl: '/2.png', width: 80, height: 80 },
  { type: 'png', x: 300, y: 300, imageUrl: '/3.png', width: 80, height: 80 },
]


export const getRandomFigure = (arr: Figures[]):Figures => {
  const randomIndex = Math.floor(Math.random()*FiguresArray.length);
  return FiguresArray[randomIndex];
};

export const renderPixiFigure = async (container: PIXI.Container, figure: Figures): Promise<void> => {
 
  switch(figure.type) {
    case 'circle':
      const circle = new PIXI.Graphics();
      circle.circle(figure.x, figure.y, figure.size || 30)
      .fill({ color: figure.color });
      container.addChild(circle);
      break;

    case 'square':
      const square = new PIXI.Graphics();
      square.rect(figure.x, figure.y, figure.size || 30, figure.size || 50)
      .fill({ color: figure.color });
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
  };
};




