import * as yup from "yup";
const signupSchema = yup.object().shape({
  name: yup.string().required("required"),
  email: yup
    .string()
    .email("invalid email")
    .required("required"),
  password: yup.string().required("required"),
});

export default signupSchema;
