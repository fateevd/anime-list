"use client";
import {create} from 'zustand'
import {Media} from "@/generated/graphql";

type State = {
  trending: Partial<Media>[];
}

type Action = {
  add: (data: Partial<Media>[]) => void;
  replace: () => void;
}

const store = create<State & Action>((set) => ({
  trending: [],
  add: (data) => set(() => ({trending: data})),
  replace: () => set(() => ({trending: []}))
}));


export default store;