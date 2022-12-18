import { makeAutoObservable } from "mobx";

interface ContigInfo {
  length?: number;
  releatedAlignFiles?: string[];
  isCusTomer?: boolean;
}

interface ContigMap {
  [contigName: string]: ContigInfo;
}

class Contig {
  contigMap: ContigMap = {};

  constructor() {
    makeAutoObservable(this);
  }

  addContig = (contigName: string, contigInfo: ContigInfo) => {
    if (!this.contigMap[contigName]) this.contigMap[contigName] = {};
    this.contigMap[contigName] = {
      ...this.contigMap[contigName],
      ...contigInfo,
    };
  };

  addLen = (contigName: string, length: number) => {
    const tmp = this.contigMap[contigName];
    this.contigMap[contigName] = { ...this.contigMap[contigName], length };
    // console.log('ok', this.contigMap[contigName]);
    // this.contigMap = {...this.contigMap};
  };

  addReleatedAlignFile = (contigName: string, releatedAlignFile: string) => {
    if (!this.contigMap[contigName]) this.contigMap[contigName] = {};
    if (!this.contigMap[contigName].releatedAlignFiles)
      this.contigMap[contigName].releatedAlignFiles = [];
    this.contigMap[contigName].releatedAlignFiles = [
      ...this.contigMap[contigName].releatedAlignFiles!,
      releatedAlignFile,
    ];
  };
}

const contigStore = new Contig();
export default contigStore;
