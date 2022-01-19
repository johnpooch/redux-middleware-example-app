import { createAction } from "@reduxjs/toolkit";

export interface SetItemPayload {
  key: string;
  value: string;
}

const namespace = "localStorage";

const setItem = createAction<SetItemPayload>(`${namespace}/setItem`);

export const actions = {
  setItem,
};
