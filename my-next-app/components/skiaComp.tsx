'use client';

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import SkiaCanvas from "./skiaCanvas";

const SkiaComp = () => {
  
  return(
    <Card className="flex flex-1 bg-button-dark shadow mx-4">
      <CardHeader>
        <CardTitle className="text-white font-bold text-center">
          Skia
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[200px] w-full px-2 py-2">
        {/* canvas для Skia */}
        <SkiaCanvas />
      </CardContent>
    </Card>
  )
}

export default SkiaComp;