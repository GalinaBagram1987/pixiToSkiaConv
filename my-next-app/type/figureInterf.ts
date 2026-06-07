import { AnimationData } from "./animatoinInterf";

/**
 * Создаем интерфейс для типов фигур
 * для отрисовки каждой фигуры нужны свои свойства
 * прописываем типы для этих свойств
 */

export default interface Figures {
  id: string;
  type: 'circle' | 'square' | 'triangle' | 'png' | 'line' | 'text',
  
  // Позиция и трансформации
  x: number,
  y: number,
  animation?: AnimationData,
  color?: number, // цвет в формате 0xRRGGBB
  size?: number, // для круга, квадрата, треугольника

  // Для линии 
  toX?: number,      // конечная точка линии по X
  toY?: number,       // конечная точка линии по Y
  lineWidth?: number, // толщина линии
  
  // Для треугольника
  xl?: number,     // левая нижняя точка X
  yl?: number,     // левая нижняя точка Y
  xr?: number,     // правая нижняя точка X
  yr?: number,     // правая нижняя точка Y
  
  // Для PNG
  imageUrl?: string,  // откуда брать картинку
  width?: number,  // ширина PNG
  height?: number,    // высота PNG
  
  // Для текста
  text?: string,
  fontSize?: number,
  fill?: number,
  fontWeight?: string,
  fontFamily?: string,
  scaleX?: number,
  scaleY?: null,
}