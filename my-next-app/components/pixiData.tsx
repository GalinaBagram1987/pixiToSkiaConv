'use client'

import * as PIXI from 'pixi.js';

export interface Figures {
  type: 'circle' | 'square' | 'triangle' | 'png' | 'line',
  x: number,
  y: number,
  color?: number;      // цвет в формате 0xRRGGBB
  size?: number;      // для круга, квадрата, треугольника
  // Для линии нужны дополнительные поля
  toX?: number;       // конечная точка линии по X
  toY?: number;       // конечная точка линии по Y
  lineWidth?: number; // толщина линии
  // Для PNG
  imageUrl?: string;  // откуда брать картинку
  width?: number;     // ширина PNG
  height?: number;    // высота PNG
}

export const FiguresArray: Figures[] = [
  { type: 'circle', x: 200, y: 200, color: 0xf9bebe, size: 50 },
  { type: 'square', x: 320, y: 320, color: 0xb9a3f5, size: 50 },
  { type:  'triangle', x: 500, y: 550, color:  0xa788ce, size: 30},
  { type: 'line', x: 100, y: 100, color:  0xa3f5ad, toX: 50, toY: 150, lineWidth: 5 },
  { type: 'png', x: 500, y: 300, imageUrl: '../public/1.png', width: 80, height: 80 },
  { type: 'png', x: 100, y: 300, imageUrl: '../public/2.png', width: 80, height: 80 },
  { type: 'png', x: 300, y: 300, imageUrl: '../public/3.png', width: 80, height: 80 },
]


export const getRandonFigire = (arr: Figures[]):Figures => {
  const randomIndex = Math.floor(Math.random()*FiguresArray.length);
  return FiguresArray[randomIndex];
};

export const renderPixiFigure = (container: PIXI.Container, figure: Figures): void => {
 
  switch(figure.type) {
    case 'circle':
      const circle = new PIXI.Graphics();
      circle.circle(figure.x, figure.y, figure.size || 30)
      .fill({ color: figure.color });
       container.addChild(circle);
       break;
       
  }
}




