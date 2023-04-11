import * as yup from "yup";
import { IsJsonString } from "../../utilities/utilityFunctions";

export const addElectronicTransferOfShareSchema = yup.object().shape({
  request_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  execution_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  // company_code: yup.object().nullable().required("Select Company"),
  // Transfer Details
  transferee_folio_no: yup.object().nullable().required("Select Transfree"),
  transferor_folio_no: yup.object().nullable().required("Select Transferor"),
  transfer_no: yup.string(),
  // TRansfer Details
  quantity: yup.string().required("Enter Shares"),
  // price: yup.string(),
  // amount: yup.string(),
});

export const updateElectronicTransferOfShareSchema = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    execution_date: yup.string().default(form.txn_execution_date),
    company_code: yup
      .object()
      .nullable()
      .required("Select Company")
      .default(form.company_code),
    // Transfer Details
    transferee_folio_no: yup
      .object()
      .nullable()
      .required("Select Transfree")
      .default(form.to_folio_number),
    transferor_folio_no: yup
      .object()
      .nullable()
      .required("Select Transferor")
      .default(form.folio_number),
    // Transfer Details
    quantity: yup.string().required("Enter Shares").default(form.quantity),
    transfer_no: yup.string().default(form?.transfer_no),

    remarks: yup.string().default(form?.remarks),
  });
