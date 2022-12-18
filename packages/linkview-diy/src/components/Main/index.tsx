import { Rect } from "react-konva";
import { useState, useEffect } from "react";
import Contig, { TickMode } from "@/components/CanvasElements/Contig/Contig";
import Tick, { TickDirection } from "@/components/CanvasElements/Tick/Tick";

const Main = () => {
  const [x, setX] = useState(300);
  const [interval, setInterval] = useState<[number, number]>([200, 800]);
  return (
    <>
      <Contig
        coor={[x, 100]}
        canCapture
        onCapture={(x, y) => {
          // console.log(x, y);
        }}
        length={1000}
        visibleInterval={interval}
        widthPerBp={0.5}
        alignToInitX={false}
        // alignToInitX={true}
        tick={TickMode.NotShow}
      />
      <Rect
        width={50}
        height={50}
        fill="red"
        onClick={() => {
          // setX(x + 100)
          setInterval([300, 800]);
        }}
      />
      <Tick
        x={200}
        y={50}
        start={105}
        end={900}
        tickUnit={10}
        widthPerBp={0.5}
        tickDirection={TickDirection.Down}
        showLabel
      />
    </>
  );
};

export default Main;
