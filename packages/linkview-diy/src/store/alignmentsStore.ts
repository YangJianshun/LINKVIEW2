import { makeAutoObservable } from "mobx";
import { Alignment, AlignmentsByCtgs } from "@linkview/linkview-align-parser";
import {
  assignAlignmentsByCtgs,
  getAlignmentsByCtgs,
} from "../utils/alignments";
import { Custom } from "@/constants/sourceType";

class Alignments {
  source2alignments: Record<string | symbol, Alignment[]> = { Custom: [] };
  source2alignmentsByCtgs: Record<string | symbol, AlignmentsByCtgs> = {
    Custom: {},
  };

  constructor() {
    makeAutoObservable(this);
  }

  addAlignments = (alignments: Alignment[], source: string) => {
    this.source2alignments = {
      ...this.source2alignments,
      [source]: alignments,
    };
  };

  addCustomAlignments = (alignments: Alignment[]) => {
    this.source2alignments[Custom] = [
      ...this.source2alignments[Custom],
      ...alignments,
    ];
    const alignmentsByCtgsNew = getAlignmentsByCtgs(alignments);
    const alignmentsByCtgsOrigin = this.source2alignmentsByCtgs[Custom];
    assignAlignmentsByCtgs(alignmentsByCtgsOrigin, alignmentsByCtgsNew);
    this.source2alignmentsByCtgs = {
      ...this.source2alignmentsByCtgs,
      [Custom]: alignmentsByCtgsOrigin,
    };
  };

  addAlignmentsByCtgs = (
    alignmentsByCtgs: AlignmentsByCtgs,
    source: string
  ) => {
    this.source2alignmentsByCtgs = {
      ...this.source2alignmentsByCtgs,
      [source]: alignmentsByCtgs,
    };
  };
}

const alignmentsStore = new Alignments();
export default alignmentsStore;
