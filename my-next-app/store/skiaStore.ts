import { create } from 'zustand';
import Figures from '@/type/figureInterf';

interface SkiaStore {
  // Состояние
  canvasKit: any | null;
  surface: any | null; 
  skiaContainer: HTMLCanvasElement | null;
  skiaFigures: Figures[];
  isRendered: boolean;
  skiaNodes: any[];
  
  // Действия (только для изменения состояния)
  setCanvasKit: (kit: any) => void;
  setSurface: (surface: any) => void;
  setSkiaContainer: (container: HTMLCanvasElement | null) => void;
  setSkiaFigures: (figures: Figures[]) => void;
  addSkiaFigure: (figure: Figures) => void;
  clearSkiaFigures: () => void;
  resetSkia: () => void;
}

export const useSkiaStore = create<SkiaStore>((set, get) => ({
  canvasKit: null,
  surface: null,
  skiaContainer: null,
  skiaFigures: [],
  isRendered: false,
  skiaNodes: [],

  setSkiaContainer: (container) => set({ skiaContainer: container }),
  
  setCanvasKit: (kit) => set({canvasKit: kit}),
  setSurface: (surfase) => set({surface: surfase}),

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
}));