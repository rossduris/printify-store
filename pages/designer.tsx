import React, { useEffect, useState } from "react";
import useDivPosition from "./hooks/useDivPosition";
import useMousePosition from "./hooks/useMousePosition";
import Layer from "./components/Layer";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export type LayerProps = {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  bg: string;
  isHovering: boolean;
  isDraggin: boolean;
};

const dataLayers = [
  {
    id: 1,
    name: `layer1`,
    x: 0,
    y: 100,
    width: 100,
    height: 100,
    bg: "blue",
    isHovering: false,
    isDraggin: false,
  },
  {
    id: 2,
    name: `layer2`,
    x: 300,
    y: 200,
    width: 100,
    height: 100,
    bg: "red",
    isHovering: false,
    isDraggin: false,
  },
  {
    id: 3,
    name: `layer3`,
    x: 20,
    y: 100,
    width: 200,
    height: 10,
    bg: "green",
    isHovering: false,
    isDraggin: false,
  },
];

const Designer = () => {
  const { divRef, boundingRect } = useDivPosition();
  const { mousePosition } = useMousePosition();
  const [layers, setLayers] = useState<Array<LayerProps>>();

  useEffect(() => {
    console.log(mousePosition);
  }, [mousePosition]);

  useEffect(() => {
    setLayers(dataLayers);
  }, []);

  const addNewLayer = () => {};
  return (
    <div className=" flex justify-center items-center min-h-screen">
      <div className=" designer bg-white text-black p-1 w-[900px]  rounded-lg relative overflow-hidden">
        <h2 className=" designer-title w-full text-center border-b p-2 pb-3 font-thin text-[#a4a4a4] bg-[#f1f1f1] shadow-lg shadow-white rounded-t-md">
          Product Designer
        </h2>
        <div className="flex flex-row">
          <div className=" bg-[#eeeeee] w-full flex-1 p-1">
            <div
              ref={divRef}
              className=" bg-white h-[800px] relative canvas-container"
            >
              {layers
                ? layers.map((layer) => {
                    return <Layer key={layer.id} data={layer} />;
                  })
                : "Loading..."}
            </div>
          </div>
          <div className=" layer-panel w-[200px] right-0 border-l h-[100% h-[800px]] relative">
            <h2 className="  text-gray-400 font-thin p-4 text-sm">Layers</h2>
            <PlusCircleIcon
              onClick={addNewLayer}
              className=" h-6 w-6 text-blue-300 absolute top-4 right-4 hover:text-blue-200 hover:cursor-pointer transition-all duration-1"
            />
            <div
              ref={divRef}
              className=" bg-white h-[800px] relative canvas-container"
            >
              {layers
                ? layers.map((layer) => {
                    return <div key={layer.id}>{layer.name}</div>;
                  })
                : "Loading..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Designer;
