import { getRandomFigure, FiguresArray } from "./pixiData";
import renderPixiFigure from "@/renders/renderPixi";
import { usePixiStore } from "@/store/pixiStore";


const CreatePixiBut = (): React.JSX.Element => { // ← тип для компонента
  const handleClick = async (): Promise<void> => {
  const { addFigure, container } = usePixiStore.getState();
  
  const randomFigure = getRandomFigure(FiguresArray);
  if (!randomFigure || !container) return;
  
  // Очищаем ВСЁ перед добавлением новой фигуры
  // так как мы работаем с состоянием и там плюсуется фигура и
  // рендерится весь новый объект надо старое удалить, очистить контейнер
  container.removeChildren();
  
  await renderPixiFigure(container, randomFigure);
  addFigure(randomFigure);
  };
  
  return(
    <button 
      onClick={handleClick}
      className="bg-button-dark text-white font-bold rounded-md shadow-xl hover:scale-110 transition-transform px-2 py-2 mx-4 my-4">
      Создать произвольную фигуру Pixi.js
    </button>
  )
}

export default CreatePixiBut;