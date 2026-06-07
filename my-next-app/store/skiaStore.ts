import { create } from 'zustand';
import Figures from '@/type/figureInterf';

interface SkiaStore {
  // Состояние
  skiaContainer: HTMLCanvasElement | null;
  skiaFigures: Figures[];        // фигуры для отрисовки в Skia
  isRendered: boolean;           // отрисована ли Skia сцена
  skiaNodes: any[];              // готовые Skia-компоненты (опционально)
  
  // Действия
  setSkiaContainer: (container: HTMLCanvasElement | null) => void;
  setSkiaFigures: (figures: Figures[]) => void;
  addSkiaFigure: (figure: Figures) => void;
  clearSkiaFigures: () => void;
  resetSkia: () => void;
  renderSkiaFromPixi: (pixiFigures: Figures[]) => void; // конвертация из Pixi
}

export const useSkiaStore = create<SkiaStore>((set, get) => ({
  skiaContainer: null,
  skiaFigures: [],
  isRendered: false,
  skiaNodes: [],

  setSkiaContainer: (container) => set({ skiaContainer: container }),
  
  setSkiaFigures: (figures) => set({ 
    skiaFigures: figures, 
    isRendered: true 
  }),
  
  addSkiaFigure: (figure) => set((state) => ({ 
    skiaFigures: [...state.skiaFigures, figure] 
  })),
  
  clearSkiaFigures: () => set({ 
    skiaFigures: [], 
    isRendered: false 
  }),
  
  resetSkia: () => set({ 
    skiaFigures: [], 
    isRendered: false, 
    skiaNodes: [] 
  }),
  
  // Конвертация фигур из Pixi в Skia
  renderSkiaFromPixi: (pixiFigures) => {
    const convertedFigures = pixiFigures.map(figure => ({
      ...figure,  // данные фигур те же, а отрисовка разная
      // можно добавить специфичные для Skia поля ??
    }));
    set({ 
      skiaFigures: convertedFigures, 
      isRendered: true 
    });
  },
}));