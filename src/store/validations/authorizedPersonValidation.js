import * as yup from "yup";

export const addAuthorizedPersonSchema = yup.object().shape({
  name: yup.string().required("Enter Name"),
  email: yup.string().required("Enter Email"),
  contact: yup.string().required("Enter Contact"),
  role: yup.string().required("Enter Role"),
});
