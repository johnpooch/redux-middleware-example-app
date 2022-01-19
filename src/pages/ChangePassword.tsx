import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import {
  actions as uiActions,
  FormName,
  PageName,
  ChangePasswordFormValues,
} from "../store/ui";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

interface FormValues {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

const initialFormValues: FormValues = {
  oldPassword: "",
  password: "",
  passwordConfirmation: "",
};

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
  passwordConfirmation: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const Register = (): React.ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiActions.loadPage(PageName.ChangePassword));
  }, []);

  const submit = (values: ChangePasswordFormValues) => {
    dispatch(uiActions.submitForm({ name: FormName.ChangePassword, values }));
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
        <Typography variant="h4">Change password</Typography>
        <TextField
          label="Old password"
          name="oldPassword"
          error={Boolean(errors.oldPassword)}
          helperText={errors.oldPassword}
          onChange={handleChange}
          type="password"
          fullWidth
          value={values.oldPassword}
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
          Change password
        </Button>
      </form>
    </div>
  );
};

export default Register;
