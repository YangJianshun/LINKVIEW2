import { useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { observer } from "mobx-react";
import style from "./App.module.scss";
import Console from "./components/Console";
import Main from "./components/Main";
import { useStores } from "@/store";

const App = observer(() => {
  const { styleStore } = useStores();
  const { cursor } = styleStore;

  return (
    <>
      <Stage
        className={style.container}
        style={{ cursor }}
        width={window.innerWidth * 0.98}
        height={window.innerHeight * 0.98}
      >
        <Layer>
          <Main />
        </Layer>
      </Stage>
      <Console />
    </>
  );
});

export default App;
