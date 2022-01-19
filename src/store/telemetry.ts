import { createAction } from "@reduxjs/toolkit";
import { TelemetryEventName } from "./types";

export interface SendEventPayload {
  name: TelemetryEventName;
  message: string;
}

const namespace = "telemetry";

const sendEvent = createAction<SendEventPayload>(`${namespace}/sendEvent`);

export const actions = {
  sendEvent,
};
