
const CreatePixiBut = () => {
  //const handleClick = () => {
    // тут что-то создается в пикси
  //}
  return(
    <button 
      //onclick={handleClick}
      className="bg-button-dark text-white font-bold rounded-md shadow-xl hover:scale-110 transition-transform px-2 py-2 mx-4 my-4">
      Создать произвольную фигуру Pixi.js
    </button>
  )
}

export default CreatePixiBut;