import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Login from "../Login";
import {
  logEvent,
  registerGAEvent,
  registerGAPageview,
  sendTelemetryEvent,
} from "../../utils";
import { mockFunction } from "./utils";
import { LogLevel, TelemetryEventName } from "../../store/types";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

const mockRegisterGAEvent = mockFunction(registerGAEvent);
const mockRegisterGAPageview = mockFunction(registerGAPageview);
const mockSendTelemetryEvent = mockFunction(sendTelemetryEvent);
const mockLogEvent = mockFunction(logEvent);

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

jest.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../../utils", () => ({
  registerGAEvent: jest.fn(),
  registerGAPageview: jest.fn(),
  logEvent: jest.fn(),
  sendTelemetryEvent: jest.fn(),
}));

jest.mock("../../store/service", () => ({
  authService: {
    useLoginMutation: () => [jest.fn(), {}],
  },
}));

describe("<Login />", () => {
  const submitForm = () => {
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(emailInput, { target: { value: "email@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(screen.getByText("Log in"));
  };

  test("Renders correctly", () => {
    render(<Login />);
    screen.getByLabelText("Email");
    screen.getByLabelText("Password");
  });

  test("Page load causes GA pageview", () => {
    render(<Login />);
    expect(mockRegisterGAPageview).toBeCalledWith("Login");
  });

  test("Page load causes logEvent", () => {
    render(<Login />);
    expect(mockLogEvent).toBeCalledWith(LogLevel.Info, "Login page loaded");
  });

  test("Page load causes sendTelemetryEvent", () => {
    render(<Login />);
    expect(mockSendTelemetryEvent).toBeCalledWith(
      TelemetryEventName.PageLoad,
      "Login page loaded"
    );
  });

  test("Form submit causes GA event", () => {
    render(<Login />);
    submitForm();
    screen.debug();
    expect(mockRegisterGAEvent).toBeCalledWith("Login form submit");
  });
});
