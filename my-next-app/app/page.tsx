'use client';

import CreatePixiBut from "@/components/createPixiBut";
import ConvertSkiaBut from "@/components/convertSkiaBut";
import ResertBut from "@/components/clearBut";
import ExpPdfBut from "@/components/exportPdfBut";
import PixiComp from "@/components/pixiComp";
import SkiaComp from "@/components/skiaComp";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col w-full py-32 px-16 bg-[image:var(--my-gradient)] sm:items-start">
      <h1 className="flex justify-center text-center text-4xl font-bold mb-6 shadow">Конвектор из Pixi.js в Skia</h1>
      <div className="flex flex-row flex-1 justify-between">
        <div className="flex flex-col btn btn-group">
          <CreatePixiBut />
          <ConvertSkiaBut />
          <ResertBut />
          <ExpPdfBut />
        </div>
        <PixiComp />
        <SkiaComp />
      </div>
      
      
    </main>

  );
}
