import { useEffect, useState } from "react";

type Rect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

export default function useCanvasBoundingRect() {
  const [canvasRect, setRect] = useState<Rect>();

  useEffect(() => {
    const canvasContainer = document.querySelector(
      ".canvas-container"
    ) as HTMLDivElement;

    setRect(canvasContainer.getBoundingClientRect());
  }, []);

  return { canvasRect };
}
