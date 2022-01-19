import { createAction } from "@reduxjs/toolkit";
import { PageName } from "./ui";

const namespace = "ga";

const registerEvent = createAction<string>(`${namespace}/registerEvent`);
const registerPageview = createAction<PageName>(
  `${namespace}/registerPageview`
);

export const actions = {
  registerEvent,
  registerPageview,
};
