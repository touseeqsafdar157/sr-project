import * as yup from "yup";
import { IsJsonString } from "../../utilities/utilityFunctions";
export const addElectronicToPhysicalValidation = yup.object().shape({
  request_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  execution_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  requester_folio: yup.object().nullable().required("Select Folio"),
  // company_code: yup.object().nullable().required("Select Company"),
  to_folio: yup.object().nullable().required("Select Folio"),
  no_of_certificates: yup.string().required("Enter Number of Certificate"),
  no_of_shares: yup.string().required("Enter Number of Shares"),
  remarks: yup.string(),
  reference: yup.string(),
  transfer_no: yup.string(),
  cdc_certificates: yup.array(),

  // price: yup.string(),
  // amount: yup.string(),
});

export const updateElectronicToPhysicalValidation = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    execution_date: yup.string().default(form.txn_execution_date),
    requester_folio: yup
      .object()
      .required("Select Folio")
      .default(form.folio_number),
    to_folio: yup
      .object()
      .required("Select Folio")
      .default(form.to_folio_number),
    company_code: yup
      .object()
      .required("Select Company")
      .default(form.company_code),

    no_of_certificates: yup
      .string()
      .required("Enter Number of Certificate")
      .default(form.amount),
    no_of_shares: yup
      .string()
      .required("Enter Number of Shares")
      .default(form.quantity),
    remarks: yup.string().default(form?.remarks),
    reference: yup.string().default(form?.reference),
    transfer_no: yup.string().default(form?.transfer_no),

    // price: yup.string(),
    // amount: yup.string(),
  });
