import { createAction } from "@reduxjs/toolkit";

export enum PageName {
  Login = "Login",
  Register = "Register",
  ChangePassword = "ChangePassword",
}

export enum FormName {
  Login = "Login",
  Register = "Register",
  ChangePassword = "ChangePassword",
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface ChangePasswordFormValues {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

export interface SubmitFormPayload {
  name: FormName;
  values: unknown;
}

const namespace = "ui";

const loadPage = createAction<PageName>(`${namespace}/loadPage`);
const submitForm = createAction<SubmitFormPayload>(`${namespace}/submitForm`);

export const actions = {
  loadPage,
  submitForm,
};
