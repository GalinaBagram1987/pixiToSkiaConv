import Figures from "@/type/figureInterf";

export const renderSkiaFromPixi = (
  canvas: HTMLCanvasElement,
  figures: Figures[]
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Очищаем canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  figures.forEach((figure) => {
    const color = `#${(figure.color ?? 0x000000).toString(16).padStart(6, '0')}`;
    
    switch (figure.type) {
      case 'circle': {
        ctx.beginPath();
        ctx.arc(figure.x, figure.y, figure.size ?? 30, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        break;
      }
      
      case 'square': {
        const size = figure.size ?? 50;
        ctx.fillStyle = color;
        ctx.fillRect(figure.x - size/2, figure.y - size/2, size, size);
        break;
      }
      
      case 'triangle': {
        const x = figure.x ?? 0;
        const y = figure.y ?? 0;
        const xl = figure.xl ?? 0;
        const yl = figure.yl ?? 0;
        const xr = figure.xr ?? 0;
        const yr = figure.yr ?? 0;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xl, yl);
        ctx.lineTo(xr, yr);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        break;
      }
      
      case 'line': {
        ctx.beginPath();
        ctx.moveTo(figure.x ?? 0, figure.y ?? 0);
        ctx.lineTo(figure.toX ?? 0, figure.toY ?? 0);
        ctx.strokeStyle = color;
        ctx.lineWidth = figure.lineWidth ?? 2;
        ctx.stroke();
        break;
      }
      
      case 'text': {
        const fontSize = figure.fontSize ?? 24;
        ctx.font = `${figure.fontWeight ?? 'normal'} ${fontSize}px ${figure.fontFamily ?? 'Arial'}`;
        ctx.fillStyle = color;
        ctx.fillText(figure.text ?? '', figure.x, figure.y);
        break;
      }
      
      case 'png': {
        // Для PNG нужно загрузить изображение
        if (figure.imageUrl) {
          const img = new Image();
          img.src = figure.imageUrl;
          img.onload = () => {
            ctx.drawImage(img, figure.x, figure.y, figure.width ?? 80, figure.height ?? 80);
          };
        }
        break;
      }
    }
  });
};