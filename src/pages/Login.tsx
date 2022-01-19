import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import {
  actions as uiActions,
  FormName,
  LoginFormValues,
  PageName,
} from "../store/ui";
import { useDispatch } from "react-redux";

const initialFormValues: LoginFormValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login = (): React.ReactElement => {
  const dispatch = useDispatch();

  // Could be nicely refactored into a custom hook.
  useEffect(() => {
    dispatch(uiActions.loadPage(PageName.Login));
  }, []);

  const submit = (values: LoginFormValues) => {
    dispatch(uiActions.submitForm({ name: FormName.Login, values }));
  };

  // Formik config to reduce form boilerplate
  const { errors, values, handleChange, handleSubmit } = useFormik({
    initialValues: initialFormValues,
    validationSchema,
    onSubmit: submit,
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4">Log in</Typography>
        <TextField
          label="Email"
          name="email"
          error={Boolean(errors.email)}
          helperText={errors.email}
          onChange={handleChange}
          fullWidth
          value={values.email}
        />
        <TextField
          label="Password"
          name="password"
          error={Boolean(errors.password)}
          helperText={errors.password}
          onChange={handleChange}
          type="password"
          fullWidth
          value={values.password}
        />
        <Button variant="contained" type="submit" color="primary">
          Log in
        </Button>
      </form>
    </div>
  );
};

export default Login;
