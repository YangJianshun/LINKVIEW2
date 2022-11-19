import { useState } from "react";
import { Stage, Layer } from "react-konva";
import style from "./App.module.scss";
import Console from './components/Console';

function App() {
  return (
    <>
      <Stage className={style.container}>
        <Layer></Layer>
      </Stage>

      <Console />
    </>
  );
}

export default App;
