import * as yup from "yup";
const eventSchema = yup.object().shape({
  name: yup.string().required("required"),
  price: yup.number().required("required"),
  location: yup.string().required("required"),
});

export default eventSchema;
