import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { MouseEvent } from "react";

type Props = {
  position: {
    x: number;
    y: number;
  };
};

const ResizableDiv = ({ position }: Props) => {
  const [canvasPosition, setCanvasPosition] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [divSize, setDivSize] = useState({
    width: 100,
    height: 100,
  });
  const [divPosition, setDivPosition] = useState({
    x: 0,
    y: 0,
  });

  const resizableDivRef = useRef<HTMLDivElement>(null);
  const resizerTopLeftRef = useRef<HTMLDivElement>(null);
  const resizerTopRightRef = useRef<HTMLDivElement>(null);
  const resizerBottomLeftRef = useRef<HTMLDivElement>(null);
  const resizerBottomRightRef = useRef<HTMLDivElement>(null);
  const resizableDiv = resizableDivRef.current as HTMLDivElement;
  const onMouseDownDiv = (e: MouseEvent) => {
    setIsDragging(true);
  };

  const onMouseUpDiv = (e: MouseEvent) => {
    setIsDragging(false);
  };

  const onMouseMoveDiv = (e: MouseEvent) => {
    if (isDragging) {
      console.log(e.pageY + resizableDiv.getBoundingClientRect().top);
      console.log(e.pageX + resizableDiv.getBoundingClientRect().left);
      setDivPosition({
        x:
          e.pageX -
          resizableDiv.getBoundingClientRect().left -
          divSize.width / 2,
        y:
          e.pageY -
          resizableDiv.getBoundingClientRect().top -
          divSize.height / 2,
      });
    }
  };

  const onMouseMoveBottomRight = (e: MouseEvent) => {
    if (isDragging) {
      setDivSize({
        width: e.pageX - resizableDiv.getBoundingClientRect().left,
        height: e.pageY - resizableDiv.getBoundingClientRect().top,
      });
    }
  };

  useEffect(() => {
    // console.log(window.screenX, window.screenY);
    const canvasWrapper = document.querySelector(".designer");
    // console.log(canvasWrapper?.scrollHeight, canvasWrapper?.scrollLeft);
  }, []);

  return (
    <div
      ref={resizableDivRef}
      onMouseDown={onMouseDownDiv}
      onMouseUp={onMouseUpDiv}
      onMouseMove={onMouseMoveDiv}
      className="resizable"
      style={{
        width: divSize.width,
        height: divSize.height,
        left: position.x,
        top: position.y,
      }}
    >
      <div className="resizers">
        <div ref={resizerTopLeftRef} className="resizer top-left"></div>
        <div ref={resizerTopRightRef} className="resizer top-right"></div>
        <div ref={resizerBottomLeftRef} className="resizer bottom-left"></div>
        <div
          ref={resizerBottomRightRef}
          className="resizer bottom-right"
          onMouseDown={onMouseDownDiv}
          onMouseUp={onMouseUpDiv}
          onMouseMove={onMouseMoveBottomRight}
        ></div>
      </div>
    </div>
  );
};

export default ResizableDiv;
