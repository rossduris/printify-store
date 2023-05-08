import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { MouseEvent } from "react";

import { LayerProps } from "../designer";

type Props = {
  data: LayerProps;
};

const Layer = ({ data }: Props) => {
  return (
    <>
      {data ? (
        <canvas
          className="layer"
          style={{
            left: data.x,
            top: data.y,
            width: data.width,
            height: data.height,
            background: data.bg,
          }}
        ></canvas>
      ) : (
        "loading..."
      )}
    </>
  );
};

export default Layer;
