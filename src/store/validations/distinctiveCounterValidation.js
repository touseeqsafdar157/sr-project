import * as yup from "yup";

export const setCertificateCounterSchema = yup.object().shape({
  company_code: yup.object().nullable().required("Select Company"),
  certificate_no_counter: yup
    .string()
    .test("check-val", "Enter Number", (val) => parseInt(val) >= 0)
    .required("Enter Enter Number"),
  distinctive_no_counter: yup
    .string()
    .test("check-val", "Enter Number", (val) => parseInt(val) >= 0)
    .required("Enter Enter Number"),
});
export const setFolioCounterSchema = yup.object().shape({
  company_code: yup.object().nullable().required("Select Company"),
  folio_counter: yup
    .string()
    .test("check-val", "Enter Number", (val) => parseInt(val) >= 0)
    .required("Enter Enter Number"),
});
