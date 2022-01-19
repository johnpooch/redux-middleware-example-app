import { createAction } from "@reduxjs/toolkit";
import { LogLevel } from "./types";

export interface CreateLogPayload {
  level: LogLevel;
  message: string;
}

const namespace = "logging";

const createLog = createAction<CreateLogPayload>(`${namespace}/createLog`);

export const actions = {
  createLog,
};
