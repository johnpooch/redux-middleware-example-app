import { Middleware } from "redux";
import {
  actions as uiActions,
  ChangePasswordFormValues,
  FormName,
  LoginFormValues,
  PageName,
  RegisterFormValues,
  SubmitFormPayload,
} from "./ui";
import { actions as feedbackActions } from "./feedback";
import { actions as gaActions } from "./ga";
import { actions as localStorageActions } from "./localStorage";
import { actions as loggingActions } from "./logging";
import { actions as telemetryActions } from "./telemetry";
import { Action, PayloadAction } from "@reduxjs/toolkit";
import {
  logEvent,
  registerGAEvent,
  registerGAPageview,
  sendTelemetryEvent,
} from "../utils";
import { CreateLogPayload } from "./logging";
import { LogLevel, Severity, TelemetryEventName } from "./types";
import { SendEventPayload } from "./telemetry";
import { authService } from "./service";
import { SetItemPayload } from "./localStorage";
import { push } from "redux-first-history";
import { RootState } from ".";
import { selectEmail } from "./selectors";

export const pageLoadMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action: PayloadAction<PageName>) => {
    next(action);
    if (action.type === uiActions.loadPage.type) {
      dispatch(gaActions.registerPageview(action.payload));
      dispatch(
        loggingActions.createLog({
          level: LogLevel.Info,
          message: action.payload,
        })
      );
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.PageLoad,
          message: action.payload,
        })
      );
    }
  };

export const submitFormMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action: PayloadAction<SubmitFormPayload>) => {
    if (action.type === uiActions.submitForm.type) {
      const message = `${action.payload.name} form submitted`;
      dispatch(gaActions.registerEvent(message));
      dispatch(
        loggingActions.createLog({
          level: LogLevel.Info,
          message,
        })
      );
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.FormInteraction,
          message,
        })
      );
    }
    next(action);
  };

export const submitLoginFormMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action: PayloadAction<SubmitFormPayload>) => {
    next(action);
    if (
      action.type === uiActions.submitForm.type &&
      action.payload.name === FormName.Login
    ) {
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.ApiStart,
          message: action.payload.name,
        })
      );
      dispatch(
        authService.endpoints.login.initiate(
          action.payload.values as LoginFormValues
        ) as unknown as Action
      );
    }
  };

export const submitRegisterFormMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action: PayloadAction<SubmitFormPayload>) => {
    next(action);
    if (
      action.type === uiActions.submitForm.type &&
      action.payload.name === FormName.Register
    ) {
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.ApiStart,
          message: action.payload.name,
        })
      );
      dispatch(
        authService.endpoints.register.initiate(
          action.payload.values as RegisterFormValues
        ) as unknown as Action
      );
    }
  };

export const submitChangePasswordFormMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action: PayloadAction<SubmitFormPayload>) => {
    next(action);
    if (
      action.type === uiActions.submitForm.type &&
      action.payload.name === FormName.ChangePassword
    ) {
      const state = getState() as RootState;
      const email = selectEmail(state) as string;
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.ApiStart,
          message: action.payload.name,
        })
      );
      dispatch(
        authService.endpoints.changePassword.initiate({
          ...(action.payload.values as ChangePasswordFormValues),
          email,
        }) as unknown as Action
      );
    }
  };

export const registerPageviewMiddleware: Middleware =
  () => (next) => (action: PayloadAction<PageName>) => {
    if (action.type === gaActions.registerPageview.type) {
      registerGAPageview(action.payload);
    }
    next(action);
  };

export const registerEventMiddleware: Middleware =
  () => (next) => (action: PayloadAction<PageName>) => {
    if (action.type === gaActions.registerEvent.type) {
      registerGAEvent(action.payload);
    }
    next(action);
  };

export const createLogMiddleware: Middleware =
  () => (next) => (action: PayloadAction<CreateLogPayload>) => {
    if (action.type === loggingActions.createLog.type) {
      logEvent(action.payload.level, action.payload.message);
    }
    next(action);
  };

export const sendEventMiddleware: Middleware =
  () => (next) => (action: PayloadAction<SendEventPayload>) => {
    if (action.type === telemetryActions.sendEvent.type) {
      sendTelemetryEvent(action.payload.name, action.payload.message);
    }
    next(action);
  };

export const setItemMiddleware: Middleware =
  () => (next) => (action: PayloadAction<SetItemPayload>) => {
    if (action.type === localStorageActions.setItem.type) {
      localStorage.setItem(action.payload.key, action.payload.value);
    }
    next(action);
  };

export const loginRequestMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action: Action) => {
    next(action);
    if (authService.endpoints.login.matchFulfilled(action)) {
      const { token } = action.payload;
      const message = "Login successful";
      dispatch(gaActions.registerEvent(message));
      dispatch(loggingActions.createLog({ level: LogLevel.Success, message }));
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.ApiStop,
          message,
        })
      );
      dispatch(push("/"));
      dispatch(
        feedbackActions.add({
          severity: Severity.Success,
          message: "Logged in!",
        })
      );
      dispatch(localStorageActions.setItem({ key: "token", value: token }));
    }
    if (authService.endpoints.login.matchRejected(action)) {
      const message = "Login failed";
      dispatch(gaActions.registerEvent(message));
      dispatch(loggingActions.createLog({ level: LogLevel.Success, message }));
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.ApiStop,
          message,
        })
      );
      dispatch(
        feedbackActions.add({
          severity: Severity.Error,
          message: "Login failed",
        })
      );
    }
  };

export const registerRequestMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action: Action) => {
    next(action);
    if (authService.endpoints.register.matchFulfilled(action)) {
      const { token } = action.payload;
      const message = "Register successful";
      dispatch(gaActions.registerEvent(message));
      dispatch(loggingActions.createLog({ level: LogLevel.Success, message }));
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.ApiStop,
          message,
        })
      );
      dispatch(push("/"));
      dispatch(
        feedbackActions.add({
          severity: Severity.Success,
          message: "Registered!",
        })
      );
      dispatch(localStorageActions.setItem({ key: "token", value: token }));
    }
    if (authService.endpoints.register.matchRejected(action)) {
      const message = "Register failed";
      dispatch(gaActions.registerEvent(message));
      dispatch(loggingActions.createLog({ level: LogLevel.Success, message }));
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.ApiStop,
          message,
        })
      );
      dispatch(
        feedbackActions.add({
          severity: Severity.Error,
          message: "Register failed",
        })
      );
    }
  };

export const changePasswordRequestMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action: Action) => {
    next(action);
    if (authService.endpoints.changePassword.matchFulfilled(action)) {
      const message = "Change password successful";
      dispatch(gaActions.registerEvent(message));
      dispatch(loggingActions.createLog({ level: LogLevel.Success, message }));
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.ApiStop,
          message,
        })
      );
      dispatch(push("/"));
      dispatch(
        feedbackActions.add({
          severity: Severity.Success,
          message: "Password updated!",
        })
      );
    }
    if (authService.endpoints.changePassword.matchRejected(action)) {
      const message = "Change password failed";
      dispatch(gaActions.registerEvent(message));
      dispatch(loggingActions.createLog({ level: LogLevel.Success, message }));
      dispatch(
        telemetryActions.sendEvent({
          name: TelemetryEventName.ApiStop,
          message,
        })
      );
      dispatch(
        feedbackActions.add({
          severity: Severity.Error,
          message: "Change password failed",
        })
      );
    }
  };

const middleware = [
  pageLoadMiddleware,
  submitFormMiddleware,
  submitLoginFormMiddleware,
  submitRegisterFormMiddleware,
  submitChangePasswordFormMiddleware,
  registerPageviewMiddleware,
  registerEventMiddleware,
  createLogMiddleware,
  sendEventMiddleware,
  setItemMiddleware,
  loginRequestMiddleware,
  registerRequestMiddleware,
  changePasswordRequestMiddleware,
];

export default middleware;
