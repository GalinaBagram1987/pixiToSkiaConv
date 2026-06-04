
const ExpPdfBut = (): React.JSX.Element => {
  //const handleClick = () => {
    // экспорт пдф
  //}
  return(
    <button 
      //onclick={handleClick}
      className="bg-button-dark text-white font-bold rounded-md shadow-xl hover:scale-110 transition-transform px-2 py-2 mx-4 my-4">
      Экспорт в PDF
    </button>
  )
}

export default ExpPdfBut;