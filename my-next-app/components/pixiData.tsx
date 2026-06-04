'use client'

import * as PIXI from 'pixi.js';
import { usePixiStore } from '@/store/pixiStore';

export interface Figures {
  id: string;
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
  { id: 'f-circle', type: 'circle', x: 200, y: 200, color: 0xf9bebe, size: 50, vx: 3 },
  { id: 'f-square', type: 'square', x: 120, y: 520, color: 0xb9a3f5, size: 50, vy: 3},
  { id: 'f-triangle', type: 'triangle', x: 500, y: 550, xl:490, yl: 500, xr: 520, yr: 520, color: 0xa788ce },
  { id: 'f-line', type: 'line', x: 100, y: 100, color:  0xa3f5ad, toX: 50, toY: 150, lineWidth: 5, angle: 90 },
  { id: 'f-png1', type: 'png', x: 500, y: 300, imageUrl: '/1.png', width: 80, height: 80, angle: 45 },
  { id: 'f-png2', type: 'png', x: 100, y: 300, imageUrl: '/2.png', width: 80, height: 80, angle: 45 },
  { id: 'f-png3', type: 'png', x: 300, y: 300, imageUrl: '/3.png', width: 80, height: 80, angle: 45 },
  { id: 'f-text', type: 'text', x: 200, y:450, text: 'Привет', fontSize: 32, fill: 0x000000, fontWeight: 'bold', fontFamily: 'Arial', angle: 15, }
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

export const renderPixiFigure = async (container: PIXI.Container, figure: Figures): Promise<void> => {
  const app = usePixiStore.getState().app;
  
  let vx = figure.vx || 0;
  let vy = figure.vy || 0;

  switch(figure.type) {
    case 'circle': {
      const circle = new PIXI.Graphics();
      const radius = figure.size || 30;
      
      circle.circle(0, 0, radius).fill({ color: figure.color });
      circle.x = figure.x;
      circle.y = figure.y;
     
      if (app && (vx !== 0 || vy !== 0)) {
        // Создаем именованную функцию, чтобы иметь возможность контролировать её жизненный цикл
        const updateCircle = (time: PIXI.Ticker) => {
          circle.x += vx * time.deltaTime;
          circle.y += vy * time.deltaTime;
          
          if (circle.x + radius > app.screen.width || circle.x - radius < 0) {
            vx *= -1;
            circle.x = Math.min(Math.max(circle.x, radius), app.screen.width - radius);
          }
          if (circle.y + radius > app.screen.height || circle.y - radius < 0) {
            vy *= -1;
            circle.y = Math.min(Math.max(circle.y, radius), app.screen.height - radius);
          }
        };

        app.ticker.add(updateCircle);
        // ЗАЩИТА: При удалении круга со сцены, убираем функцию из тикера
        circle.once('destroyed', () => app.ticker.remove(updateCircle));
      }
      container.addChild(circle);
      break;
    }

    case 'square': {
      const square = new PIXI.Graphics();
      const size = figure.size || 30;
      const halfSize = size / 2;
      
      square.rect(-halfSize, -halfSize, size, size).fill({ color: figure.color });
      square.x = figure.x;
      square.y = figure.y;

      if (app && (vx !== 0 || vy !== 0)) {
        const updateSquare = (time: PIXI.Ticker) => {
          square.x += vx * time.deltaTime;
          square.y += vy * time.deltaTime;
          
          if (square.x + halfSize > app.screen.width || square.x - halfSize < 0) {
            vx *= -1;
            square.x = Math.min(Math.max(square.x, halfSize), app.screen.width - halfSize);
          }
          if (square.y + halfSize > app.screen.height || square.y - halfSize < 0) {
            vy *= -1;
            square.y = Math.min(Math.max(square.y, halfSize), app.screen.height - halfSize);
          }
        };

        app.ticker.add(updateSquare);
        square.once('destroyed', () => app.ticker.remove(updateSquare));
      }
      container.addChild(square);
      break;
    }

    case 'triangle': {
      const triangle = new PIXI.Graphics();
      // Безопасные дефолты через оператор ?? на случай отсутствия точек
      const x = figure.x ?? 0;
      const y = figure.y ?? 0;
      const xl = figure.xl ?? 0;
      const yl = figure.yl ?? 0;
      const xr = figure.xr ?? 0;
      const yr = figure.yr ?? 0;

      triangle.poly([x, y, xr, yr, xl, yl]).fill({ color: figure.color });
      triangle.scale.set(figure.scaleX || 1, figure.scaleY || 1);
      
      // Геометрический центр
      const centerX = (x + xl + xr) / 3;
      const centerY = (y + yl + yr) / 3;
      
      triangle.pivot.set(centerX, centerY);
      triangle.position.set(centerX, centerY);
      container.addChild(triangle);
      break;
    }

    case 'line': {
      const line = new PIXI.Graphics();
      // Лучше рисовать линию от центра (0,0)
      const startX = 0;
      const startY = 0;
      const endX = (figure.toX ?? 50) - (figure.x ?? 0);
      const endY = (figure.toY ?? 50) - (figure.y ?? 0);
  
      line.moveTo(startX, startY)
        .lineTo(endX, endY)
        .stroke({ 
          color: figure.color ?? 0x000000, 
          width: figure.lineWidth ?? 2 
        });
  
      // Позиционируем линию
      line.x = figure.x ?? 0;
      line.y = figure.y ?? 0;
      line.angle = figure.angle || 0;
  
      container.addChild(line);
      break;
    }

    case 'png': {
      if (!figure.imageUrl) {
        console.error('PNG: imageUrl не указан');
        break;
      }
      try {
        const texture = await PIXI.Assets.load(figure.imageUrl);
        const sprite = new PIXI.Sprite(texture);
       
        // Задаем базовые размеры через ширину/высоту
        sprite.width = figure.width || 30;
        sprite.height = figure.height || 30;

        // В PixiJS ПРАВИЛЬНО использовать anchor(0.5) для спрайтов вместо pivot.
        // Он автоматически держит центр, даже если размеры меняются.
        sprite.anchor.set(0.5);
        sprite.x = figure.x ?? 0;
        sprite.y = figure.y ?? 0;    
        sprite.angle = figure.angle || 0;

        if (app) {
          let time = 0;
          // Запоминаем изначальный масштаб, выставленный через width/height
          const baseScaleX = sprite.scale.x;
          const baseScaleY = sprite.scale.y;

          const updatePng = (ticker: PIXI.Ticker) => {
            // Используем deltaTime, чтобы скорость пульсации не зависела от лагов FPS
            time += 0.1 * ticker.deltaTime;
            const pulse = 0.8 + Math.sin(time) * 0.2;
            
            // Меняем scale, anchor сам скорректирует центр без прыжков!
            sprite.scale.set(baseScaleX * pulse, baseScaleY * pulse);
          };

          app.ticker.add(updatePng);
          sprite.once('destroyed', () => app.ticker.remove(updatePng));
        }     
        container.addChild(sprite);
      } catch (error) {
        console.error('Ошибка загрузки PNG:', figure.imageUrl, error);
      }
      break;
    }

    case 'text': {
      const text = new PIXI.Text({
        text: figure.text || '',
        style: {
          fontSize: figure.fontSize || 24,
          fill: figure.fill || figure.color || 0x000000,
          fontWeight: (figure.fontWeight as any) || 'normal',
          fontFamily: figure.fontFamily || 'Arial',
        }
      });
      
      text.x = figure.x;
      text.y = figure.y;
      text.angle = figure.angle || 0;

      // Сохраняем базовый переданный масштаб
      const defaultScaleX = figure.scaleX || 1;
      const defaultScaleY = figure.scaleY || 1;
      text.scale.set(defaultScaleX, defaultScaleY);
      
      text.eventMode = 'static';
      text.cursor = 'pointer';
  
      // Увеличиваем относительно БАЗОВОГО масштаба фигуры
      text.on('pointerover', () => { text.scale.set(defaultScaleX * 1.2, defaultScaleY * 1.2); });
      text.on('pointerout',  () => { text.scale.set(defaultScaleX, defaultScaleY); });
      text.on('pointerdown', () => { text.alpha = 0.6; });
      text.on('pointerup',   () => { text.alpha = 1.0; });
      
      container.addChild(text);
      break;
    }
  }
};


// export const renderPixiFigure = async (container: PIXI.Container, figure: Figures): Promise<void> => {
//   const app = usePixiStore.getState().app;
//   // Локальные переменные для скорости
//   let vx = figure.vx || 0;
//   let vy = figure.vy || 0;

//   switch(figure.type) {
//     case 'circle':
//       const circle = new PIXI.Graphics();
//       const radius = figure.size || 30;
//       circle.circle(0, 0, radius)
//       .fill({ color: figure.color });
      
//       circle.x = figure.x;
//       circle.y = figure.y;
     
//       // Проверяем локальные переменные
//       if (app && (vx !== 0 || vy !== 0)) {
//       app.ticker.add((time) => {
//       circle.x += vx * time.deltaTime;
//       circle.y += vy * time.deltaTime;
      
//       // Отскок по краям (учитываем половину размера)
//       if (circle.x + radius > app.screen.width || circle.x - radius < 0) {
//         vx *= -1;  // меняем направление
//         circle.x = Math.min(Math.max(circle.x, radius), app.screen.width - radius);
//       }
      
//       if (circle.y + radius > app.screen.height || circle.y - radius < 0) {
//         vy *= -1;  // меняем направление
//         circle.y = Math.min(Math.max(circle.y, radius), app.screen.height - radius);
//       }
//     });
//   }
//       container.addChild(circle);
//       break;

//     case 'square':
//       const square = new PIXI.Graphics();
//       const size = figure.size || 30;
//       const halfSize = size / 2;
//       square.rect(-halfSize, -halfSize, size, size)
//       .fill({ color: figure.color });
//       square.x = figure.x;
//       square.y = figure.y;

//       // Проверяем локальные переменные
//       if (app && (vx !== 0 || vy !== 0)) {
//       app.ticker.add((time) => {
//       square.x += vx * time.deltaTime;
//       square.y += vy * time.deltaTime;
      
//       // Отскок по краям (учитываем половину размера)
//       if (square.x + halfSize > app.screen.width || square.x - halfSize < 0) {
//         vx *= -1;  // меняем направление
//         square.x = Math.min(Math.max(square.x, halfSize), app.screen.width - halfSize);
//       }
      
//       if (square.y + halfSize > app.screen.height || square.y - halfSize < 0) {
//         vy *= -1;  // меняем направление
//         square.y = Math.min(Math.max(square.y, halfSize), app.screen.height - halfSize);
//       }
//     });
//   }
//       container.addChild(square);
//       break;

//     case 'triangle':
//       const triangle = new PIXI.Graphics();
//       if (figure.x && figure.y && figure.xr && figure.yr && figure.xl && figure.yl) {
//         triangle.poly([figure.x, figure.y, figure.xr, figure.yr, figure.xl, figure.yl])
//         .fill({ color: figure.color });
//         // добавляем масштабирование
//         triangle.scale.set(figure.scaleX || 1, figure.scaleY || 1);
//         // 1. Находим геометрический центр треугольника (масштабирование от центра)
//         const centerX = (figure.x + figure.xl + figure.xr) / 3;
//         const centerY = (figure.y + figure.yl + figure.yr) / 3;
//         // 2. Устанавливаем pivot (точка от кот масштабируем) в центр
//         triangle.pivot.set(centerX, centerY);
//         // 3. Устанавливаем позицию фигуры в ту же точку
//         triangle.position.set(centerX, centerY);
//         container.addChild(triangle);
//       } else {
//         console.error('Недостаточно точек для треугольника');
//       } // poly нужна проверка на существование. или так ?? 0 (базовое значение)
//       break;

//     case 'line':
//       const line = new PIXI.Graphics();
//       line.moveTo(figure.x ?? 0, figure.y ?? 0)
//       .lineTo(figure.toX ?? 0, figure.toY ?? 0)
//       .stroke({ 
//         color: figure.color ?? 0x000000, 
//         width: figure.lineWidth ?? 2 
//       });
//        // Поворот линии (в градусах)
//       line.angle = figure.angle || 0;
      
//       container.addChild(line);
//       break;

//     case 'png':
//        if (!figure.imageUrl) {
//         console.error('PNG: imageUrl не указан');
//         break;
//       }
//       try {
//         const texture = await PIXI.Assets.load(figure.imageUrl);
//         const sprite = new PIXI.Sprite(texture);
       
//         // Базовый размер
//         const baseWidth = figure.width || 30;
//         const baseHeight = figure.height || 30;

//         // Сначала устанавливаем размер
//         sprite.width = baseWidth;
//         sprite.height = baseHeight;

//         // центр
//         sprite.pivot.set(baseWidth / 2, baseHeight / 2);
//         // центр картинки будет в этой точке
//         sprite.x = figure.x ?? 0;
//         sprite.y = figure.y ?? 0;    

//         // поворот в градусах
//         sprite.angle = figure.angle || 0;

//         if (app) {
//           let time = 0;
//           app.ticker.add(() => {
//             time += 0.1;
//             // Пульсация от 0.8 до 1.2 от базового размера
//             const scale = 0.8 + Math.sin(time) * 0.2;
//             sprite.width = baseWidth * scale;
//             sprite.height = baseHeight * scale;
//             // Обновляем pivot при изменении размера
//             sprite.pivot.set(sprite.width / 2, sprite.height / 2);
//           });
//         }     
//         container.addChild(sprite);
//       } catch (error) {
//         console.error('Ошибка загрузки PNG:', figure.imageUrl, error);
//       }
//       break;

//     case 'text':
//       const text = new PIXI.Text(
//         figure.text || '',
//         {
//           fontSize: figure.fontSize || 24,
//           fill: figure.fill || figure.color || 0x000000,
//           fontWeight: (figure.fontWeight as any) || 'normal',
//           fontFamily: figure.fontFamily || 'Arial',
//           },
//         );
//       text.x = figure.x;
//       text.y = figure.y;
//       text.angle = figure.angle || 0;
//       text.scale.set(figure.scaleX || 1, figure.scaleY || 1);
//       // Интерактивность
//       text.eventMode = 'static'; // Включаем обработку событий для этого объекта
//       text.cursor = 'pointer'; // Меняем курсор при наведении — как у обычной кнопки
  
//       // Наводим — увеличиваем
//       text.on('pointerover', () => { text.scale.set(1.2); });
//       // Уводим — возвращаем размер
//       text.on('pointerout',  () => { text.scale.set(1.0); });
//       // Нажимаем — делаем полупрозрачным
//       text.on('pointerdown', () => { text.alpha = 0.6; });
//       // Отпускаем — возвращаем непрозрачность
//       text.on('pointerup',   () => { text.alpha = 1.0; });
//     container.addChild(text);
//   break;
//   };
// };




