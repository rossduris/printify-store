import { useState, useEffect, useRef } from "react";

type Position = {
  x: number;
  y: number;
};

type BoundingRect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

type DivPositionHookResult = {
  divRef: React.MutableRefObject<HTMLDivElement | null>;
  boundingRect: BoundingRect | null;
};

export default function useDivPosition(): DivPositionHookResult {
  const [boundingRect, setBoundingRect] = useState<BoundingRect | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    const div = divRef.current;
    if (!div) return;
    setBoundingRect(div.getBoundingClientRect());
  };

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    setBoundingRect(div.getBoundingClientRect());
  }, []);

  return { divRef, boundingRect };
}
