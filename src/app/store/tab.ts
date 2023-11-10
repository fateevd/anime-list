import {create} from "zustand";


type State = {
  tabContainer: number;
}

type Action = {
  setTab: (tab: number) => void;
}

const storeTab = create<State & Action>((set) => ({
  tabContainer: 0,
  setTab: (tab) => set(() => ({tabContainer: tab}))
}));

export default storeTab;