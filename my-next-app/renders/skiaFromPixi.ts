import Figures from "@/type/figureInterf";

export const renderSkiaFromPixi = (
  surface: any,
  figures: Figures[],
  CanvasKit: any,
) => {
  // создаем холст для всех
  const canvas = surface.getCanvas();  // холст
    canvas.clear(CanvasKit.WHITE); // чистим, заливаем белым
   
  // настраиваем кисть для всех
  const fillPaint = new CanvasKit.Paint(); // создаем кисть с правилами
  fillPaint.setAntiAlias(true); // режим сглаживания
  fillPaint.setStyle(CanvasKit.PaintStyle.Fill); //  Заливка
  
  figures.forEach((figure) => {
    fillPaint.setColor(figure.color ?? CanvasKit.BLUE) // добавляем в нашу кисть цвет из фигуры
      switch (figure.type) {
        case 'circle': {
          // рисуем на нашем пустом канвасе нашей кистью
          // то есть берем параметры точки: x,y, размер, и все параметры нашей кисти
          canvas.drawCircle(figure.x, figure.y, figure.size, fillPaint);       
        break;
        }
      
        case 'square': {
          const pathSquare = new CanvasKit.Path();
          const size = figure.size ?? 30; 
          // Начинаем с левого верхнего угла
          pathSquare.moveTo(figure.x, figure.y);
          // Рисуем верхнюю сторону (вправо)
          pathSquare.lineTo(figure.x + size || 30, figure.y);
          // Рисуем правую сторону (вниз)
          pathSquare.lineTo(figure.x + size, figure.y + size);    
          // Рисуем нижнюю сторону (влево)
          pathSquare.lineTo(figure.x, figure.y + size);
          // Замыкаем фигуру (линия вверх к начальной точке)
          pathSquare.close(); 
    
          canvas.drawPath(pathSquare, fillPaint);
          pathSquare.delete();
        }
      
        case 'triangle': {
          // создаем новый путь
          const pathTriangle = new CanvasKit.Path();        
          // Начинаем путь из первой вершины
          pathTriangle.moveTo(figure.x, figure.y);
          // Проводим линию ко второй вершине
          pathTriangle.lineTo(figure.xl, figure.yl);
          // Проводим линию к третьей вершине
          pathTriangle.lineTo(figure.xr, figure.yr);
          // Замыкаем фигуру (проводит линию от третьей точки обратно к первой)
          pathTriangle.close(); 
          // рисуем весь путь
          canvas.drawPath(pathTriangle, fillPaint);
          // чистим
          pathTriangle.delete();
          break;
        }
      
        case 'line': {
    
        break;

       }
      
        case 'text': {
   
        }
      
        case 'png': {
       // Для PNG нужно загрузить изображение
  
       break;
        }
      }
    fillPaint.delete();
  });
};