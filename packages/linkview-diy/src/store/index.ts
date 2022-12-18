import { createContext, useContext } from "react";
import alignmentsStore from "./alignmentsStore";
import fileStore from "./fileStore";
import contigStore from "./contigStore";
import styleStore from "./styleStore";
const store = {
  alignmentsStore,
  fileStore,
  contigStore,
  styleStore,
};

const storeContext = createContext(store);

export const useStores = () => useContext(storeContext);

export default store;
