'use client';

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import CanvasPixi from "./pixiCanvas";


const PixiComp = () => {
  
  return(
    <Card className="flex bg-button-dark shadow mx-4">
      <CardHeader>
        <CardTitle className="text-white font-bold text-center">
          Pixi.js
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[200px] w-full px-2 py-2" style={{ width: 608 }}>
        {/* Здесь canvas для Pixi */}
        <CanvasPixi />
      </CardContent>
    </Card>
  )
}

export default PixiComp;