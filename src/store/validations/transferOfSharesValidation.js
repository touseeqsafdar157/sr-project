import * as yup from "yup";
import { IsJsonString } from "../../utilities/utilityFunctions";
import * as _ from "lodash";

yup.addMethod(yup.array, "uniqueProperty", function (propertyPath, message) {
  return this.test("unique", "", function (list) {
    const errors = [];

    list.forEach((item, index) => {
      const propertyValue = _.get(item, propertyPath);

      if (
        propertyValue &&
        _.filter(list, [propertyPath, propertyValue]).length > 1
      ) {
        errors.push(
          this.createError({
            path: `${this.path}[${index}].${propertyPath}`,
            message,
          })
        );
      }
    });

    if (!_.isEmpty(errors)) {
      throw new yup.ValidationError(errors);
    }

    return true;
  });
});

export const addTransferOfShareSchema = yup.object().shape({
  request_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  execution_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  // company_code: yup.object().required("Select Company"),
  company_code: yup.string(),
  // Transfer Details
  transferee_folio_no: yup.object().nullable().required("Select Transfree"),
  transferor_folio_no: yup.object().nullable().required("Select Transferor"),
  transfer_no: yup.string(),
  // TRansfer Details

  no_of_certificates: yup
    .string()
    .test(
      "check-val",
      "Transfer At least One Certificate",
      (val) => parseInt(val) > 0
    )
    .required("Enter Number of Certificate"),
  remarks: yup.string(),
  input_certificates: yup
    .array()
    .of(
      yup.object().shape({
        certificate_no: yup.object().nullable().required("Select Certificate"),
      })
    )
    .uniqueProperty("certificate_no", "Certificate No must be unique"),
  // price: yup.string(),
  // amount: yup.string(),
});

export const updateTransferOfShareSchema = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    request_type: yup.string().default(form.txn_type),
    execution_date: yup.string().default(form.txn_execution_date),
    company_code: yup
      .object()
      .required("Select Company")
      .default(form.company_code),
    // Transfer Details

    transferor_folio_no: yup
      .object()
      .required("Select Transferor")
      .default(form.from_folio),
    transferee_folio_no: yup
      .object()
      .required("Select Transfree")
      .default(form.folio_number),
    // Transfer Details
    no_of_certificates: yup
      .string()
      .test(
        "check-val",
        "Transfer At least One Certificate",
        (val) => parseInt(val) > 0
      )
      .required("Enter Number of Certificate")
      .default(
        form.input_certificates.length.toString()
        // IsJsonString(form.input_certificates)
        //   ? JSON.parse(form.input_certificates).length.toString()
        //   : 0
      ),
    input_certificates: yup
      .array()
      .of(
        yup.object().shape({
          certificate_no: yup.object().required("Select Certificate"),
          // from: yup.object().required("Select Distinctive No. From"),
          // to: yup.object().required("Select Distinctive No. To"),
          folio_number: yup.object().nullable().required("Select Folio Number"),
        })
      ).default(form.input_certificates),
    transfer_no: yup.string().default(form?.transfer_no),

    remarks: yup.string().default(form?.remarks),
  });
