import { usePixiStore } from "@/store/pixiStore";
import { useSkiaStore } from "@/store/skiaStore";
import { renderSkiaFromPixi } from "@/renders/skiaFromPixi";

const ConvertSkiaBut = (): React.JSX.Element => {
  const figures = usePixiStore((state) => state.figures);
  const { skiaContainer, setSkiaFigures } = useSkiaStore();
   const handleConvert = ():void => {
    if (!skiaContainer) return;
    
    // 1. Сохраняем фигуры в store
    setSkiaFigures(figures);
    
    // 2. Рисуем на canvas
    renderSkiaFromPixi(skiaContainer, figures);
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