import exportToPdf  from "@/exportToPdf/exportToPdf";
import { useSkiaStore } from "@/store/skiaStore";

const ExpPdfBut = (): React.JSX.Element => {
   const skiaFigures = useSkiaStore((state) => state.skiaFigures);
  const handleClick = async () => {
    await exportToPdf(skiaFigures);
   }
  return(
    <button 
        onClick={handleClick}
      className="bg-button-dark text-white font-bold rounded-md shadow-xl hover:scale-110 transition-transform px-2 py-2 mx-4 my-4">
      Экспорт в PDF
    </button>
  )
}

export default ExpPdfBut;