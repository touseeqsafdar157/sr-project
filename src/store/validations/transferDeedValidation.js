import * as yup from "yup";
import * as _ from "lodash";
import { IsJsonString } from "../../utilities/utilityFunctions";

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

export const addTransferDeedVerificationSchema = yup.object().shape({
  request_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  execution_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  // company_code: yup.object().nullable().required("Select Company"),
  // Transfer Details
  transferor_folio_no: yup.object().nullable().required("Select Transferor"),
  // TRansfer Details

  no_of_certificates: yup
    .string()
    .test(
      "check-val",

      "Transfer At least One Certificate",
      (val) => parseInt(val) > 0
    )
    .required("Enter Number of Certificate"),
  attachment: yup
    .mixed()
    .test("fileSize", "Image Size Should be less than 1MB", (value) => {
      return value.length !== 0 ? value[0]?.size <= 1000000 : true;
    })
    .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
      value.length !== 0
        ? value[0]?.type === "image/jpeg" ||
        value[0]?.type === "image/jpg" ||
        value[0]?.type === "image/png"
        : true
    ),
  remarks: yup.string(),
  input_certificates: yup
    .array()
    .of(
      yup.object().shape({
        certificate_no: yup.object().nullable().required("Select Certificate"),
      })
    )
    .uniqueProperty("certificate_no", "Certificate No must be unique"),
});

export const updateTransferDeedVerificationSchema = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    execution_date: yup.string().default(form.txn_execution_date),
    company_code: yup.object().nullable().default(form.company_code),
    // Transfer Details
    transferor_folio_no: yup.object().nullable().default(form.folio_number),
    // Transfer Details
    no_of_certificates: yup
      .string()
      .default(form.input_certificates.length),
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
    remarks: yup.string().default(form?.remarks),
  });
