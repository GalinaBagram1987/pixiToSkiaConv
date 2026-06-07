import * as PIXI from 'pixi.js';
import Figures from '@/type/figureInterf';
import { usePixiStore } from '@/store/pixiStore';


const renderPixiFigure = async (container: PIXI.Container, figure: Figures): Promise<void> => {
  const app = usePixiStore.getState().app;
  const animation = figure.animation;

  switch(figure.type) {
    case 'circle': {
      const circle = new PIXI.Graphics();
      const radius = figure.size || 30;
      
      circle.circle(0, 0, radius).fill({ color: figure.color });
      circle.x = figure.x;
      circle.y = figure.y;

      if (animation?.type === 'move') {
        let vx = animation?.vx || 0;
        let vy = animation?.vy || 0;
        const bounce = figure.animation?.bounce ?? true;
        
        if (app && (vx !== 0 || vy !== 0)) {
          // Создаем именованную функцию, чтобы иметь возможность контролировать её жизненный цикл
          const updateCircle = (time: PIXI.Ticker) => {
            circle.x += vx * time.deltaTime;
            circle.y += vy * time.deltaTime;
          
            if (bounce) {
              if (circle.x + radius > app.screen.width || circle.x - radius < 0) {
                vx *= -1;
                circle.x = Math.min(Math.max(circle.x, radius), app.screen.width - radius);
              }
              if (circle.y + radius > app.screen.height || circle.y - radius < 0) {
                vy *= -1;
                circle.y = Math.min(Math.max(circle.y, radius), app.screen.height - radius);
              }
            } else {
              // телепортация
              if (circle.x + radius > app.screen.width) circle.x = 0;
              if (circle.x - radius < 0) circle.x = app.screen.width;
              if (circle.y + radius > app.screen.height) circle.y = 0;
              if (circle.y - radius < 0) circle.y = app.screen.height;
            }
        };
        app.ticker.add(updateCircle);
        // ЗАЩИТА: При удалении круга со сцены, убираем функцию из тикера
        circle.once('destroyed', () => app.ticker.remove(updateCircle));
        }
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

      if (animation?.type === 'move') {
        let vx = animation?.vx || 0;
        let vy = animation?.vy || 0;
        const bounce = figure.animation?.bounce ?? true;
        
        if (app && (vx !== 0 || vy !== 0)) {
          const updateSquare = (time: PIXI.Ticker) => {
            square.x += vx * time.deltaTime;
            square.y += vy * time.deltaTime;

            if (bounce) {
              if (square.x + halfSize > app.screen.width || square.x - halfSize < 0) {
                vx *= -1;
                square.x = Math.min(Math.max(square.x, halfSize), app.screen.width - halfSize);
              }
              if (square.y + halfSize > app.screen.height || square.y - halfSize < 0) {
                vy *= -1;
                square.y = Math.min(Math.max(square.y, halfSize), app.screen.height - halfSize);
              }
            } else { // телепортация
              if (square.x + halfSize > app.screen.width) square.x = 0;
              if (square.x - halfSize < 0) square.x = app.screen.width;
              if (square.y + halfSize > app.screen.height) square.y = 0;
              if (square.y - halfSize < 0) square.y = app.screen.height;
            }
          };        
        app.ticker.add(updateSquare);
        square.once('destroyed', () => app.ticker.remove(updateSquare));
        }
      }  
      container.addChild(square);
      break;
    }

    case 'triangle': {
      const triangle = new PIXI.Graphics();
      const x = figure.x ?? 0;
      const y = figure.y ?? 0;
      const xl = figure.xl ?? 0;
      const yl = figure.yl ?? 0;
      const xr = figure.xr ?? 0;
      const yr = figure.yr ?? 0;

      const drawTriangle = (color: number) => {
        triangle.clear();
        triangle.poly([x, y, xl, yl, xr, yr]).fill({ color: color });
      };

      drawTriangle(figure.color ?? 0xa788ce);

      if (animation?.type === 'colorChange') {
        let isChanged = false;
        triangle.eventMode = 'static';
        triangle.cursor = 'pointer';
    
        const originalColor = figure.color ?? 0xa788ce;
        const targetColor = animation.toColor ?? 0xff0000;
    
      triangle.on('pointerdown', () => {
        console.log('Клик по треугольнику!');
        isChanged = !isChanged;
        drawTriangle(isChanged ? targetColor : originalColor);
        app?.renderer.render(app?.stage);
        });
      }
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
      
      const drawLine = (color: number) => {
        line.clear();
        line.moveTo(startX, startY)
        .lineTo(endX, endY)
        .stroke({ 
        color: color, 
        width: figure.lineWidth ?? 2 
        });
      };

      drawLine(figure.color ?? 0xa3f5ad);

      line.x = figure.x ?? 0;
      line.y = figure.y ?? 0;

      if (animation?.type === 'colorChange') {
        let isChanged = false;
        line.eventMode = 'static';
        line.cursor = 'pointer';
    
        const originalColor = figure.color ?? 0xa3f5ad;
        const targetColor = animation.toColor ?? 0xff0000;
    
        line.on('pointerdown', () => {
          console.log('Клик по линии!');
          isChanged = !isChanged;
          drawLine(isChanged ? targetColor : originalColor);
            // Принудительная перерисовка
        app?.renderer.render(app?.stage);
        });
      }
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
        
        if (animation?.type === 'pulse' && app) {
          let time = 0;
          const baseScaleX = sprite.scale.x;
          const baseScaleY = sprite.scale.y;
          const speed = animation.speed ?? 0.1;
          const amplitude = animation.amplitude ?? 0.2;
          const minScale = animation.minScale ?? 0.8;
      
          const updatePng = (ticker: PIXI.Ticker) => {
            time += speed * ticker.deltaTime;
            const pulse = minScale + Math.sin(time) * amplitude;
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

      // Сохраняем базовый переданный масштаб
      const defaultScaleX = figure.scaleX || 1;
      const defaultScaleY = figure.scaleY || 1;
      text.scale.set(defaultScaleX, defaultScaleY);

      if (animation?.type === 'hover') {
        text.eventMode = 'static';
        text.cursor = 'pointer';

        const toScaleX = animation.hoverScaleX || 1.5;
        const toScaleY = animation.hoverScaleY || 1.5;
  
        // Увеличиваем относительно БАЗОВОГО масштаба фигуры
        text.on('pointerover', () => { text.scale.set(defaultScaleX * toScaleX, defaultScaleY * toScaleY); });
        text.on('pointerout',  () => { text.scale.set(defaultScaleX, defaultScaleY); });
        text.on('pointerdown', () => { text.alpha = 0.6; });
        text.on('pointerup',   () => { text.alpha = 1.0; });
        } 
      
      container.addChild(text);
      break;
    }
  }
};

export default renderPixiFigure;