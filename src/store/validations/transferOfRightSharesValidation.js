import * as yup from "yup";

export const addTransferOfRightShareSchema = yup.object().shape({
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
  remarks: yup.string(),

  // TRansfer Details

  quantity: yup
    .string()
    .test(
      "check-val",

      "Transfer At least One Right Share",
      (val) => parseInt(val) > 0
    )
    .required("Enter No of Right Share"),
});

export const updateTransferOfRightShareSchema = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    execution_date: yup.string().default(form.txn_execution_date),
    company_code: yup
      .object()
      .required("Select Company")
      .default(form.company_code),
    // Transfer Details
    transferee_folio_no: yup
      .object()
      .required("Select Transfree")
      .default(form.to_folio_number),
    transferor_folio_no: yup
      .object()
      .required("Select Transferor")
      .default(form.folio_number),
    // TRansfer Details

    quantity: yup
      .string()
      .test(
        "check-val",

        "Transfer At least One Right Share",
        (val) => parseInt(val) > 0
      )
      .required("Enter No of Right Share")
      .default(form.quantity),
    remarks: yup.string().default(form?.remarks),
  });
