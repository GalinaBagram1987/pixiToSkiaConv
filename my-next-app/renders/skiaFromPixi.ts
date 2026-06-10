import Figures from "@/type/figureInterf";

export const renderSkiaFromPixi = async (
  surface: any,
  figures: Figures[],
  CanvasKit: any,
  skiaContainer: HTMLCanvasElement | null,
) => {
  if (!surface || !CanvasKit) return;

  const canvas = surface.getCanvas();
  canvas.clear(CanvasKit.WHITE);

  // Кисть для заливки
  const fillPaint = new CanvasKit.Paint();
  fillPaint.setAntiAlias(true);
  fillPaint.setStyle(CanvasKit.PaintStyle.Fill);

  // Рисуем все векторные фигуры через CanvasKit
  for (const figure of figures) {
     const rawColor = figure.color ?? 0x0000FF;
    const r = (rawColor >> 16) & 0xFF;
    const g = (rawColor >> 8) & 0xFF;
    const b = rawColor & 0xFF;
    fillPaint.setColor(CanvasKit.Color(r, g, b, 1.0));
    switch (figure.type) {
      case 'circle':
        canvas.drawCircle(figure.x ?? 0, figure.y ?? 0, figure.size ?? 30, fillPaint);
        break;

      case 'square': {
        const size = figure.size ?? 50;
        const x = figure.x ?? 0;
        const y = figure.y ?? 0;
        const rect = CanvasKit.XYWHRect(x - size/2, y - size/2, size, size);
        canvas.drawRect(rect, fillPaint);
        break;
      }

      case 'triangle': {
        const path = new CanvasKit.Path();
        path.moveTo(figure.x ?? 0, figure.y ?? 0);
        path.lineTo(figure.xl ?? 0, figure.yl ?? 0);
        path.lineTo(figure.xr ?? 0, figure.yr ?? 0);
        path.close();
        canvas.drawPath(path, fillPaint);
        path.delete();
        break;
      }

      case 'line': {
        const linePaint = new CanvasKit.Paint();
        linePaint.setAntiAlias(true);
        linePaint.setStyle(CanvasKit.PaintStyle.Stroke);
        linePaint.setStrokeWidth(figure.lineWidth ?? 3);
        linePaint.setColor(CanvasKit.Color(figure.color ?? 0x0000FF));
        canvas.drawLine(
          figure.x ?? 0, figure.y ?? 0,
          figure.toX ?? 0, figure.toY ?? 0,
          linePaint
        );
        linePaint.delete();
        break;
      }
    }
  }

  fillPaint.delete();
  
  // ✅ Векторные фигуры отрисованы, применяем
  surface.flush();

  // ✅ Теперь текст и PNG через Canvas 2D поверх
  const canvas2d = skiaContainer?.getContext('2d');
  if (canvas2d) {
    for (const figure of figures) {
      if (figure.type === 'text') {
        const fontSize = figure.fontSize ?? 20;
        const fontFamily = figure.fontFamily ?? 'Arial';
        const fontWeight = figure.fontWeight ?? 'normal';
        const textColor = figure.fill ?? figure.color ?? 0x000000;
        
        canvas2d.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        canvas2d.fillStyle = `#${textColor.toString(16).padStart(6, '0')}`;
        canvas2d.fillText(figure.text ?? '', figure.x ?? 0, figure.y ?? 0);
      }

      if (figure.type === 'png' && figure.imageUrl) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => {
            const w = figure.width ?? img.width;
            const h = figure.height ?? img.height;
            canvas2d.drawImage(img, figure.x ?? 0, figure.y ?? 0, w, h);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = figure.imageUrl!;
        });
      }
    }
  }
};

// export const renderSkiaFromPixi = async (
//   surface: any,
//   figures: Figures[],
//   CanvasKit: any,
// ) => {
//   if (!surface || !CanvasKit) {
//     console.error('Surface или CanvasKit не инициализированы');
//     return;
//   }

//   const canvas = surface.getCanvas();
//   if (!canvas) {
//     console.error('Не удалось получить canvas из surface');
//     return;
//   }

//   // Очищаем холст белым цветом
//   canvas.clear(CanvasKit.WHITE);

//   // Общая кисть для фигур с заливкой
//   const fillPaint = new CanvasKit.Paint();
//   fillPaint.setAntiAlias(true);
//   fillPaint.setStyle(CanvasKit.PaintStyle.Fill);

//   // Получаем Canvas 2D контекст для текста и PNG (как fallback)
//   const canvas2d = surface.getCanvas().getCanvas2D?.();

//   const pngDrawingPromises: Promise<void>[] = [];

//   for (const figure of figures) {
//     // Устанавливаем цвет кисти
//     const colorValue = figure.color ?? 0x0000FF;
//     fillPaint.setColor(CanvasKit.Color(
//       (colorValue >> 16) & 0xFF,
//       (colorValue >> 8) & 0xFF,
//       colorValue & 0xFF,
//       1.0
//     ));

//     switch (figure.type) {
//       case 'circle': {
//         canvas.drawCircle(
//           figure.x ?? 0,
//           figure.y ?? 0,
//           figure.size ?? 30,
//           fillPaint
//         );
//         break;
//       }

//       case 'square': {
//         const path = new CanvasKit.Path();
//         const size = figure.size ?? 50;
//         const x = figure.x ?? 0;
//         const y = figure.y ?? 0;
//         const halfSize = size / 2;
        
//         path.moveTo(x - halfSize, y - halfSize);
//         path.lineTo(x + halfSize, y - halfSize);
//         path.lineTo(x + halfSize, y + halfSize);
//         path.lineTo(x - halfSize, y + halfSize);
//         path.close();
        
//         canvas.drawPath(path, fillPaint);
//         path.delete();
//         break;
//       }

//       case 'triangle': {
//         const path = new CanvasKit.Path();
//         path.moveTo(figure.x ?? 0, figure.y ?? 0);
//         path.lineTo(figure.xl ?? 0, figure.yl ?? 0);
//         path.lineTo(figure.xr ?? 0, figure.yr ?? 0);
//         path.close();
        
//         canvas.drawPath(path, fillPaint);
//         path.delete();
//         break;
//       }

//       case 'line': {
//         const linePaint = new CanvasKit.Paint();
//         linePaint.setAntiAlias(true);
//         linePaint.setStyle(CanvasKit.PaintStyle.Stroke);
//         linePaint.setStrokeWidth(figure.lineWidth ?? 3);
//         linePaint.setColor(CanvasKit.Color(
//           (colorValue >> 16) & 0xFF,
//           (colorValue >> 8) & 0xFF,
//           colorValue & 0xFF,
//           1.0
//         ));
        
//         canvas.drawLine(
//           figure.x ?? 0, figure.y ?? 0,
//           figure.toX ?? 0, figure.toY ?? 0,
//           linePaint
//         );
//         linePaint.delete();
//         break;
//       }

//       case 'text': {
//         // Рисуем текст через Canvas 2D (гарантированно работает)
//         if (canvas2d) {
//           try {
//             const fontSize = figure.fontSize ?? 20;
//             const fontFamily = figure.fontFamily ?? 'Arial';
//             const fontWeight = figure.fontWeight ?? 'normal';
//             const textColor = figure.fill ?? figure.color ?? 0x000000;
            
//             canvas2d.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
//             canvas2d.fillStyle = `#${((textColor) >>> 0).toString(16).padStart(6, '0')}`;
//             canvas2d.fillText(figure.text ?? '', figure.x ?? 0, figure.y ?? 0);
//           } catch (err) {
//             console.error('Ошибка отрисовки текста через Canvas 2D:', err);
//           }
//         } else {
//           console.warn('Canvas 2D контекст недоступен, текст пропущен');
//         }
//         break;
//       }

//       case 'png': {
//         const imageUrl = figure.imageUrl;
//         if (!imageUrl) break;

//         // Для PNG используем Canvas 2D (гарантированно работает)
//         const drawPngPromise = new Promise<void>((resolve) => {
//           const imgElement = new Image();
//           imgElement.crossOrigin = 'Anonymous';
          
//           imgElement.onload = () => {
//             try {
//               if (canvas2d) {
//                 const width = figure.width ?? imgElement.width;
//                 const height = figure.height ?? imgElement.height;
//                 canvas2d.drawImage(imgElement, figure.x ?? 0, figure.y ?? 0, width, height);
//               } else {
//                 // Fallback: через CanvasKit
//                 const skiaImage = CanvasKit.MakeImageFromEncoded(imgElement);
//                 if (skiaImage && canvas) {
//                   const imgPaint = new CanvasKit.Paint();
//                   canvas.drawImageRect(
//                     skiaImage,
//                     CanvasKit.Rect.makeXYWH(
//                       figure.x ?? 0,
//                       figure.y ?? 0,
//                       figure.width ?? skiaImage.width(),
//                       figure.height ?? skiaImage.height()
//                     ),
//                     imgPaint
//                   );
//                   skiaImage.delete();
//                   imgPaint.delete();
//                 }
//               }
//             } catch (err) {
//               console.error('Ошибка отрисовки PNG:', err);
//             }
//             resolve();
//           };
          
//           imgElement.onerror = () => {
//             console.error(`Ошибка загрузки PNG: ${imageUrl}`);
//             resolve();
//           };
          
//           imgElement.src = imageUrl;
//         });
        
//         pngDrawingPromises.push(drawPngPromise);
//         break;
//       }
//     }
//   }

//   // Ждём загрузки всех PNG
//   if (pngDrawingPromises.length > 0) {
//     await Promise.all(pngDrawingPromises);
//   }

//   // Очищаем ресурсы
//   fillPaint.delete();
  
//   // Применяем все изменения
//   surface.flush();
// };




// export const renderSkiaFromPixi = async (
//   surface: any,
//   figures: Figures[],
//   CanvasKit: any,
// ) => {
//   if (!surface || !CanvasKit) {
//     console.error('Surface или CanvasKit не инициализированы');
//     return;
//   }

//   const canvas = surface.getCanvas();
//   if (!canvas) {
//     console.error('Не удалось получить canvas из surface');
//     return;
//   }

//   // Очищаем холст белым цветом
//   canvas.clear(CanvasKit.WHITE);

//   // Общая кисть для фигур с заливкой
//   const fillPaint = new CanvasKit.Paint();
//   fillPaint.setAntiAlias(true);
//   fillPaint.setStyle(CanvasKit.PaintStyle.Fill);

//   const pngDrawingPromises: Promise<void>[] = [];

//   for (const figure of figures) {
//     // Устанавливаем цвет кисти
//     const colorValue = figure.color ?? 0x0000FF;
//     fillPaint.setColor(CanvasKit.Color(
//       (colorValue >> 16) & 0xFF,
//       (colorValue >> 8) & 0xFF,
//       colorValue & 0xFF,
//       1.0
//     ));

//     switch (figure.type) {
//       case 'circle': {
//         canvas.drawCircle(
//           figure.x ?? 0,
//           figure.y ?? 0,
//           figure.size ?? 30,
//           fillPaint
//         );
//         break;
//       }

//       case 'square': {
//         const path = new CanvasKit.Path();
//         const size = figure.size ?? 50;
//         const x = figure.x ?? 0;
//         const y = figure.y ?? 0;
//         const halfSize = size / 2;
        
//         path.moveTo(x - halfSize, y - halfSize);
//         path.lineTo(x + halfSize, y - halfSize);
//         path.lineTo(x + halfSize, y + halfSize);
//         path.lineTo(x - halfSize, y + halfSize);
//         path.close();
        
//         canvas.drawPath(path, fillPaint);
//         path.delete();
//         break;
//       }

//       case 'triangle': {
//         const path = new CanvasKit.Path();
//         path.moveTo(figure.x ?? 0, figure.y ?? 0);
//         path.lineTo(figure.xl ?? 0, figure.yl ?? 0);
//         path.lineTo(figure.xr ?? 0, figure.yr ?? 0);
//         path.close();
        
//         canvas.drawPath(path, fillPaint);
//         path.delete();
//         break;
//       }

//       case 'line': {
//         const linePaint = new CanvasKit.Paint();
//         linePaint.setAntiAlias(true);
//         linePaint.setStyle(CanvasKit.PaintStyle.Stroke);
//         linePaint.setStrokeWidth(figure.lineWidth ?? 3);
//         linePaint.setColor(CanvasKit.Color(
//           (colorValue >> 16) & 0xFF,
//           (colorValue >> 8) & 0xFF,
//           colorValue & 0xFF,
//           1.0
//         ));
        
//         canvas.drawLine(
//           figure.x ?? 0, figure.y ?? 0,
//           figure.toX ?? 0, figure.toY ?? 0,
//           linePaint
//         );
//         linePaint.delete();
//         break;
//       }

//       case 'text': {
//         try {
//     // Создаём кисть для текста
//     const textPaint = new CanvasKit.Paint();
//     textPaint.setAntiAlias(true);
//     textPaint.setStyle(CanvasKit.PaintStyle.Fill);
    
//     const textColor = figure.fill ?? figure.color ?? 0x000000;
//     textPaint.setColor(CanvasKit.Color(
//       (textColor >> 16) & 0xFF,
//       (textColor >> 8) & 0xFF,
//       textColor & 0xFF,
//       1.0
//     ));

//     // Получаем размер шрифта (Skia использует px, но с другим масштабом)
//     const fontSize = figure.fontSize ?? 20;
    
//     // Простой способ: используем стандартный шрифт, который точно есть в CanvasKit
//     // В CanvasKit есть встроенный шрифт 'Arial' (или 'sans-serif')
//     const fontFamily = figure.fontFamily ?? 'Arial';
//     const fontWeight = figure.fontWeight?.toUpperCase() === 'BOLD' ? 'bold' : 'normal';
    
//     // Создаём строку стиля шрифта
//     const fontString = `${fontWeight} ${fontSize}px ${fontFamily}`;
    
//     // Рисуем текст через drawSimpleText (более стабильный метод)
//     // или используем canvas 2D как fallback
    
//     // Пробуем drawSimpleText (если есть в CanvasKit)
//     if (typeof canvas.drawSimpleText === 'function') {
//       const font = new CanvasKit.Font(null, fontSize);
//       canvas.drawSimpleText(
//         figure.text ?? '',
//         figure.x ?? 0,
//         figure.y ?? 0,
//         fontSize,
//         textPaint,
//         font
//       );
//       font.delete();
//     } else {
//       // Fallback: используем стандартный TextBlob
//       const textBlob = CanvasKit.TextBlob.MakeFromString(
//         figure.text ?? '',
//         new CanvasKit.Font(null, fontSize)
//       );
//       if (textBlob) {
//         canvas.drawTextBlob(textBlob, figure.x ?? 0, figure.y ?? 0, textPaint);
//         textBlob.delete();
//       } else {
//         console.warn('Не удалось создать TextBlob для текста');
//       }
//     }
    
//     textPaint.delete();
//   } catch (err) {
//     console.error('Ошибка отрисовки текста:', err);
//   }
//   break;
//       }

//       case 'png': {
//         const imageUrl = figure.imageUrl;
//         if (!imageUrl) break;

//         const drawPngPromise = new Promise<void>((resolve) => {
//           const imgElement = new Image();
//           imgElement.crossOrigin = 'Anonymous';
          
//           imgElement.onload = () => {
//             try {
//               // MakeImageFromEncoded для HTMLImageElement
//               const skiaImage = CanvasKit.MakeImageFromEncoded(imgElement);
              
//               if (skiaImage && canvas) {
//                 const imgPaint = new CanvasKit.Paint();
//                 imgPaint.setAntiAlias(true);
                
//                 canvas.drawImageRect(
//                   skiaImage,
//                   CanvasKit.Rect.makeXYWH(
//                     figure.x ?? 0,
//                     figure.y ?? 0,
//                     figure.width ?? skiaImage.width(),
//                     figure.height ?? skiaImage.height()
//                   ),
//                   imgPaint
//                 );
                
//                 skiaImage.delete();
//                 imgPaint.delete();
//               }
//             } catch (err) {
//               console.error('Ошибка отрисовки PNG:', err);
//             }
//             resolve();
//           };
          
//           imgElement.onerror = () => {
//             console.error(`Ошибка загрузки PNG: ${imageUrl}`);
//             resolve();
//           };
          
//           imgElement.src = imageUrl;
//         });
        
//         pngDrawingPromises.push(drawPngPromise);
//         break;
//       }
//     }
//   }

//   // Ждём загрузки всех PNG
//   if (pngDrawingPromises.length > 0) {
//     await Promise.all(pngDrawingPromises);
//   }

//   // Очищаем ресурсы
//   fillPaint.delete();
  
//   // Применяем все изменения
//   surface.flush();
// };