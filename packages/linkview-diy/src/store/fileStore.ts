import { makeAutoObservable } from "mobx";

class Alignments {
  alignFileNames: Set<string> = new Set();
  gffFileNames: Set<string> = new Set();

  constructor() {
    makeAutoObservable(this);
  }

  addAlignFileName = (fileName: string) => {
    this.alignFileNames.add(fileName);
  };

  setAlignFileNames = (fileNames: Set<string>) => {
    this.alignFileNames = fileNames;
  };

  addGffFileName = (fileName: string) => {
    this.gffFileNames.add(fileName);
  };

  setGffFileNames = (fileNames: Set<string>) => {
    this.gffFileNames = fileNames;
  };
}

const alignmentsStore = new Alignments();
export default alignmentsStore;
