import { makeAutoObservable } from "mobx";

type Cursor = "default" | "grab" | "grabbing" | "pointer" | "move";

class Style {
  cursor: Cursor = "default";

  constructor() {
    makeAutoObservable(this);
  }

  setCursor = (cursor: Cursor) => {
    this.cursor = cursor;
  };
}

const styleStore = new Style();
export default styleStore;
