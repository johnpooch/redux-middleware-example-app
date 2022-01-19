import React from "react";
import { Route, Routes } from "react-router-dom";
import { HistoryRouter as Router } from "redux-first-history/rr6";

import "./main.css";
import FeedbackWrapper from "./components/FeedbackWrapper";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import { history } from "./store/store";

const App = (): React.ReactElement => {
  return (
    <FeedbackWrapper>
      <Router history={history}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Routes>
      </Router>
    </FeedbackWrapper>
  );
};

export default App;
