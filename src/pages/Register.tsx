import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import {
  actions as uiActions,
  FormName,
  RegisterFormValues,
  PageName,
} from "../store/ui";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

const initialFormValues: RegisterFormValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  passwordConfirmation: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const Register = (): React.ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiActions.loadPage(PageName.Register));
  }, []);

  const submit = (values: RegisterFormValues) => {
    dispatch(uiActions.submitForm({ name: FormName.Register, values }));
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
        <Typography variant="h4">Register</Typography>
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
        <TextField
          label="Password Confirmation"
          name="passwordConfirmation"
          error={Boolean(errors.passwordConfirmation)}
          helperText={errors.passwordConfirmation}
          onChange={handleChange}
          type="password"
          fullWidth
          value={values.passwordConfirmation}
        />
        <Button variant="contained" type="submit" color="primary">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
