import { renderPixiFigure, getRandomFigure, FiguresArray } from "./pixiData";
import { usePixiStore } from "@/store/pixiStore";


const CreatePixiBut = (): React.JSX.Element => { // ← тип для компонента
  const { container, addFigure, figures } = usePixiStore();
  const handleClick = async (): Promise<void> => {
    if (!container) return;
    const randomFigure = getRandomFigure(FiguresArray);
    await renderPixiFigure(container, randomFigure);
    addFigure(randomFigure);  // сохраняем фигуру для Skia
    console.log('Всего фигур:', figures.length + 1);
  }
  return(
    <button 
      onClick={handleClick}
      className="bg-button-dark text-white font-bold rounded-md shadow-xl hover:scale-110 transition-transform px-2 py-2 mx-4 my-4">
      Создать произвольную фигуру Pixi.js
    </button>
  )
}

export default CreatePixiBut;