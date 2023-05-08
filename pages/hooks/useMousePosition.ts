import { useEffect, useState } from "react";
import useCanvasPosition from "./useCanvasPosition";

type Position = {
  x: number;
  y: number;
  quadrant: string;
};

type Dimension = {
  width: number;
  height: number;
};

export default function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<Position>();
  const [boundingRect, setBoundingRect] = useState<Dimension>();
  const { canvasRect } = useCanvasPosition();

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        console.log("resizing");
        setBoundingRect({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      console.log("clicked!");
    };

    const handleMouseMovement = (e: MouseEvent) => {
      setMousePosition({
        x: e.pageX,
        y: e.pageY,
        quadrant: "",
      });

      if (canvasRect) {
        const moveX = e.pageX - canvasRect.left;
        const moveY = e.pageY - canvasRect.top;

        console.log(moveX, moveY);

        if (moveX > canvasRect.width / 2 && moveY < canvasRect.height / 2) {
          setMousePosition({
            ...mousePosition,
            quadrant: `topRight`,
          } as Position);
        }
        if (moveX > canvasRect.width / 2 && moveY > canvasRect.height / 2) {
          setMousePosition({
            ...mousePosition,
            quadrant: `bottomRight`,
          } as Position);
        }
        if (moveX < canvasRect.width / 2 && moveY > canvasRect.height / 2) {
          setMousePosition({
            ...mousePosition,
            quadrant: `bottomLeft`,
          } as Position);
        }
        if (moveX < canvasRect.width / 2 && moveY < canvasRect.height / 2) {
          setMousePosition({
            ...mousePosition,
            quadrant: `topLeft`,
          } as Position);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", (e) => handleMouseMovement(e));
    window.addEventListener("mousedown", (e) => handleMouseDown(e));

    return () => {
      window.removeEventListener("resize", handleResize);

      window.removeEventListener("mousemove", (e) => handleMouseMovement(e));
      window.addEventListener("mousedown", (e) => handleMouseDown(e));
    };
  }, []);

  return { boundingRect, mousePosition };
}
