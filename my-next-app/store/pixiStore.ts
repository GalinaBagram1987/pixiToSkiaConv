import { create } from 'zustand';
import * as PIXI from 'pixi.js';
import { Figures, FiguresArray } from '@/components/pixiData';

interface PixiStore {
  container: PIXI.Container | null;
  app: PIXI.Application | null; 
  figures: Figures[];           
  isInitialized: boolean;       
  usedIndexIds: string[]; // ИСПРАВЛЕНО: переименовали и сделали массивом строк
  
  // Actions
  setContainer: (container: PIXI.Container | null) => void;
  setApp: (app: PIXI.Application | null) => void;
  addFigure: (figure: Figures) => void;
  clearFigures: () => void;
  resetContainer: () => void;
  getFiguresForSkia: () => Figures[];  
  addUsedIndex: (id: string) => void; // ИСПРАВЛЕНО: принимает string вместо number
  resetUsedIndex: () => void;
}

export const usePixiStore = create<PixiStore>((set, get) => ({
  container: null,
  app: null,
  figures: [],
  isInitialized: false,
  usedIndexIds: [], // ИСПРАВЛЕНО
  
  setContainer: (container) => set({ 
    container,
    isInitialized: container !== null,
    figures: []  
  }),

  setApp: (app) => set({ app }),
  
  addFigure: (figure) => set((state) => ({ 
    figures: [...state.figures, figure] 
  })),
  
  clearFigures: () => set({ figures: [], usedIndexIds: [] }),
  
  resetContainer: () => set({ 
    container: null, 
    app: null,
    figures: [], 
    isInitialized: false 
  }),
  
  getFiguresForSkia: () => get().figures,

  addUsedIndex: (id) => set((state) => ({
    // ИСПРАВЛЕНО
    usedIndexIds: [...state.usedIndexIds, id]
  })),
  
  resetUsedIndex: () => set({ usedIndexIds: [] }),
}));

// interface PixiStore {
//   container: PIXI.Container | null;
//   app: PIXI.Application | null; // для анимации (так как у нас живет внутри useEffect)
//   figures: Figures[];           // массив нарисованных фигур
//   isInitialized: boolean;       // инициализирован ли контейнер
//   usedIndex: number[];
  
//   // Actions
//   setContainer: (container: PIXI.Container) => void;
//   setApp: (app: PIXI.Application) => void;
//   addFigure: (figure: Figures) => void;
//   clearFigures: () => void;
//   resetContainer: () => void;
//   getFiguresForSkia: () => Figures[];  // для экспорта в Skia
//   addUsedIndex: (index: number) => void;
//   resetUsedIndex: () => void;
// }

// export const usePixiStore = create<PixiStore>((set, get) => ({
//   container: null,
//   app: null,
//   figures: [],
//   isInitialized: false,
//   usedIndex: [],
  
//   setContainer: (container) => set({ 
//     container,
//     isInitialized: true,
//     figures: []  // сбрасываем фигуры при новом контейнере
//   }),

//   setApp: (app) => set({ app }),
  
//   addFigure: (figure) => set((state) => ({ 
//     figures: [...state.figures, figure] 
//   })),
  
//   clearFigures: () => set({ figures: [] }),
  
//   resetContainer: () => set({ 
//     container: null, 
//     figures: [], 
//     isInitialized: false 
//   }),
  
//   getFiguresForSkia: () => get().figures,

//   addUsedIndex: (index) => set((state) => ({
//     usedIndex: [...state.usedIndex, index]
//   })),
  
//   resetUsedIndex: () => set({ usedIndex: [] }),
// }));
