import { usePixiStore } from "@/store/pixiStore";
import { useSkiaStore } from "@/store/skiaStore";

const ClearBut = (): React.JSX.Element => {
  const { container, clearFigures } = usePixiStore();
  const { clearSkiaFigures, skiaContainer } = useSkiaStore();


  const handleClick = (): void => {
    // 1. Очищаем Pixi контейнер
    if (container) {
      container.removeChildren();
      clearFigures();
      console.log('фигуры удалены')
    }
      
    // 2. Очищаем Skia canvas
    if (skiaContainer) {
      const ctx = skiaContainer.getContext('2d'); // Получает доступ к рисованию
      if (ctx) {
        ctx.clearRect(0, 0, skiaContainer.width, skiaContainer.height); // Стирает всё нарисованное
        // Заливаем белым (опционально)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, skiaContainer.width, skiaContainer.height); // Заливает canvas белым (опционально
      }
    }
    // 3. Очищаем Skia store
    clearSkiaFigures();
    
    console.log('Pixi и Skia очищены');
  };

  return(
    <button 
      onClick={handleClick}
      className="bg-button-dark text-white font-bold rounded-md shadow-xl hover:scale-110 transition-transform px-2 py-2 mx-4 my-4">
      Очистить поля
    </button>
  )
}

export default ClearBut;