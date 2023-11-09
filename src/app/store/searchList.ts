"use client";
import {create} from 'zustand'

type State = {
  isOpenList: boolean;
}

type Action = {
  open: () => void;
  close: () => void;
}

const storeList = create<State & Action>((set) => ({
  isOpenList: false,
  open: () => set(() => ({isOpenList: true})),
  close: () => set(() => ({isOpenList: false}))
}));

export default storeList;