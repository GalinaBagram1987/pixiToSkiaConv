/**
 * Создаем для анимации тип и интерфейс понятный для Skia и Pixi
 * треугольник - изменение цвета colorChange
 * png - пульсация - pulse
 * круг, квадрат - движение с отскоком - move
 * png, text - поворот, rotate
 * линия - изменение цвета colorChange
 * текст - увеличение, hover (скиа не анимирует нажатие! только для pixi), 
 * и создаем интерфейс, где будут данные для анимации
 */

export type AnimationType = 'mirror' | 'pulse' | 'rotate' | 'move' | 'colorChange' | 'hover';

export interface AnimationData {
  type: AnimationType,
  duration?: number, // Длительность одного цикла анимации в миллисекундах (мс)
  repeat?: boolean, // бесконечное повторение (для пульсации, вращения)
  easing?: 'linear' | 'easeIn' | 'easeOut', //  скорость linear-постоянная, easeIn-ускорятеся к концу, easeOut - замедляется к концу
    
  // Для pulse
  amplitude?: number,
  speed?: number,
  minScale?: number,
  maxScale?: number,
  
  // Для rotate
  fromAngle?: number, // начальный угол поворота
  toAngle?: number, // конечный угол поворота
  
  // Для move
  vx?: number,   // скорость по X
  vy?: number,   // скорость по Y
  bounce?: boolean,   // отскок
  
  // Для colorChange
  toColor?: number,
  
  // Для hover
  hoverScaleX?: number,    // масштаб при наведении
  hoverScaleY?: number,
  hoverAlpha?: number,     // прозрачность при наведении
}
