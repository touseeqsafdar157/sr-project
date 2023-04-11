import * as yup from "yup";

export const addProxySchema = yup.object().shape({
  shareholder: yup.object().nullable().required("Select Shareholder"),
  shreholder_name: yup.string().required("Enter Shareholer Name"),
  cnic: yup.string().required("Enter CNIC"),
  mobile: yup.string().required("Enter Mobile No."),
});
