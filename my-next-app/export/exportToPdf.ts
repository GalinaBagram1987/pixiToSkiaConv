import { jsPDF } from 'jspdf';
import Figures from '@/type/figureInterf';

export const exportToPdf = async (figures: Figures[]) => {
  if (!figures.length) {
    console.warn('Нет фигур для экспорта');
    return;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [600, 600],
  });

  const hexToRgb = (hex: number) => {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return { r, g, b };
  };

  for (const figure of figures) {
    switch (figure.type) {
      case 'circle': {
        const color = hexToRgb(figure.color ?? 0x000000);
        pdf.setFillColor(color.r, color.g, color.b);
        pdf.circle(figure.x, figure.y, figure.size ?? 30, 'F');
        break;
      }

      case 'square': {
        const color = hexToRgb(figure.color ?? 0x000000);
        const size = figure.size ?? 50;
        pdf.setFillColor(color.r, color.g, color.b);
        pdf.rect(figure.x - size / 2, figure.y - size / 2, size, size, 'F');
        break;
      }

      case 'triangle': {
        const color = hexToRgb(figure.color ?? 0x000000);
        pdf.setFillColor(color.r, color.g, color.b);
        pdf.triangle(
          figure.x ?? 0, figure.y ?? 0,
          figure.xl ?? 0, figure.yl ?? 0,
          figure.xr ?? 0, figure.yr ?? 0,
          'F'
        );
        break;
      }

      case 'line': {
        const color = hexToRgb(figure.color ?? 0x000000);
        pdf.setDrawColor(color.r, color.g, color.b);
        pdf.setLineWidth(figure.lineWidth ?? 2);
        pdf.line(
          figure.x ?? 0, figure.y ?? 0,
          figure.toX ?? 0, figure.toY ?? 0
        );
        break;
      }

      case 'text': {
        const color = hexToRgb(figure.fill ?? figure.color ?? 0x000000);
        pdf.setTextColor(color.r, color.g, color.b);
        pdf.setFontSize(figure.fontSize ?? 24);
        pdf.setFont('helvetica', figure.fontWeight === 'bold' ? 'bold' : 'normal');
        pdf.text(figure.text ?? '', figure.x, figure.y);
        break;
      }

      case 'png': {
        // PNG вставляется как растровое изображение поверх векторных фигур
        if (!figure.imageUrl) continue;
        
        try {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = figure.imageUrl;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          
          const width = figure.width ?? 80;
          const height = figure.height ?? 80;
          
          // Добавляем PNG как растровое изображение
          pdf.addImage(img, 'PNG', figure.x, figure.y, width, height);
        } catch (error) {
          console.error('Ошибка загрузки PNG:', figure.imageUrl, error);
        }
        break;
      }
    }
  }

  pdf.save('export.pdf');
};

export default exportToPdf;
