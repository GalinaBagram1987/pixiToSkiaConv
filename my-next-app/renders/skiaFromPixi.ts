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
  
  // Векторные фигуры отрисованы, применяем
  surface.flush();

  // Теперь текст и PNG через Canvas 2D поверх
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
