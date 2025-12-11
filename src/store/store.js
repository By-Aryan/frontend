import { create } from "zustand";

const useUserStore = create((set) => ({
  user: {},
  setUser: (newUser) => set({ user: newUser }),
}));

const usePropertyStore = create((set) => ({
  properties: [],
  setProperties: (newProperty) => set({ properties: newProperty }),
}));

export  {useUserStore, usePropertyStore};