import { usePixiStore } from "@/store/pixiStore";
import { useSkiaStore } from "@/store/skiaStore";
import { renderSkiaFromPixi } from "@/renders/skiaFromPixi";

const ConvertSkiaBut = (): React.JSX.Element => {
   const pixiFigures = usePixiStore((state) => state.figures);
  const { surface, canvasKit, skiaContainer, setSkiaFigures } = useSkiaStore();

  const handleConvert = async () => {
    if (!surface || !canvasKit) {
      console.error('Surface или CanvasKit не инициализированы');
      return;
    }

    if (!skiaContainer) {
      console.error('skiaContainer не инициализирован');
      return;
    }

    // Сохраняем фигуры для PDF
    setSkiaFigures(pixiFigures);
    
    // Рендерим в Skia
    await renderSkiaFromPixi(surface, pixiFigures, canvasKit, skiaContainer);
  };

  return(
    <button 
      onClick={handleConvert}
      className="bg-button-dark backdrop-blur-md text-white font-bold rounded-md shadow-xl hover:scale-110 transition-transform px-2 py-2 mx-4 my-4">
      Конвертировать фигуру в Skia
    </button>
  )
}

export default ConvertSkiaBut;