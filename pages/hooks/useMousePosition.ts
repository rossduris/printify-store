import { useEffect, useState } from "react";
import useCanvasPosition from "./useCanvasPosition";

type Position = {
  x: number;
  y: number;
};

type Dimension = {
  width: number;
  height: number;
};

export default function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<Position>();
  const [boundingRect, setBoundingRect] = useState<Dimension>();
  const { canvasRect } = useCanvasPosition();
  const [quadrant, setQuadrant] = useState("");

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
      console.log(e.pageX, e.pageY);
    };

    const handleMouseMovement = (e: MouseEvent) => {
      setMousePosition({
        x: e.pageX,
        y: e.pageY,
      });

      if (!canvasRect) return;
      const moveX = e.pageX - canvasRect.left;
      const moveY = e.pageY - canvasRect.top;

      if (moveX > canvasRect.width / 2 && moveY < canvasRect.height / 2) {
        if (quadrant != "topRight") {
          console.log("set quadrant to topRight");
          setQuadrant(`topRight`);
        }
      }
      if (moveX > canvasRect.width / 2 && moveY > canvasRect.height / 2) {
        if (quadrant != "bottomRight") {
          console.log("set quadrant to bottomRight");
          setQuadrant(`bottomRight`);
        }
      }
      if (moveX < canvasRect.width / 2 && moveY > canvasRect.height / 2) {
        if (quadrant != "bottomLeft") {
          console.log("set quadrant to bottomLeft");
          setQuadrant(`bottomLeft`);
        }
      }
      if (moveX < canvasRect.width / 2 && moveY < canvasRect.height / 2) {
        if (quadrant != "topLeft") {
          console.log("set quadrant to topLeft");
          setQuadrant(`topLeft`);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", (e) => handleMouseMovement(e));
    window.addEventListener("mousedown", (e) => handleMouseDown(e));

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", (e) => handleMouseMovement(e));
      window.removeEventListener("mousedown", (e) => handleMouseDown(e));
    };
  }, [canvasRect]);

  return { boundingRect, mousePosition, quadrant };
}
