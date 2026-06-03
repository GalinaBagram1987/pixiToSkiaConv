import { create } from 'zustand';
import * as PIXI from 'pixi.js';
import { Figures, FiguresArray } from '@/components/pixiData';

interface PixiStore {
  container: PIXI.Container | null;
  figures: Figures[];           // массив нарисованных фигур
  isInitialized: boolean;       // инициализирован ли контейнер
  
  // Actions
  setContainer: (container: PIXI.Container) => void;
  addFigure: (figure: Figures) => void;
  clearFigures: () => void;
  resetContainer: () => void;
  getFiguresForSkia: () => Figures[];  // для экспорта в Skia
}

export const usePixiStore = create<PixiStore>((set, get) => ({
  container: null,
  figures: [],
  isInitialized: false,
  
  setContainer: (container) => set({ 
    container, 
    isInitialized: true,
    figures: []  // сбрасываем фигуры при новом контейнере
  }),
  
  addFigure: (figure) => set((state) => ({ 
    figures: [...state.figures, figure] 
  })),
  
  clearFigures: () => set({ figures: [] }),
  
  resetContainer: () => set({ 
    container: null, 
    figures: [], 
    isInitialized: false 
  }),
  
  getFiguresForSkia: () => get().figures,
}));
