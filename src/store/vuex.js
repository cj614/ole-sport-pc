import { storageSave } from "@/libs/util";

export const set = (property) => (state, payload) =>
  (state[property] = payload);

export const toggle = (property) => (state) =>
  (state[property] = !state[property]);

export const storage = (property) => (state, payload) => {
  state[property] = payload;
  storageSave(property, payload);
};
