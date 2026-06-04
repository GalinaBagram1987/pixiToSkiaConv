import { usePixiStore } from "@/store/pixiStore";
import { useSkiaStore } from "@/store/skiaStore";

const ClearBut = (): React.JSX.Element => {
  const { container, clearFigures } = usePixiStore();
  const { clearSkiaFigures } = useSkiaStore();
  const handleClick = (): void => {
    if (!container) return;
    container.removeChildren();
    clearFigures();
    clearSkiaFigures();
    console.log('фигуры удалены')
  }
  return(
    <button 
      onClick={handleClick}
      className="bg-button-dark text-white font-bold rounded-md shadow-xl hover:scale-110 transition-transform px-2 py-2 mx-4 my-4">
      Очистить поля
    </button>
  )
}

export default ClearBut;