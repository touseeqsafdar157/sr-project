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

export const addTransmissionOfSharesSchema = yup.object().shape({
  request_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  execution_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  // company_code: yup.object().nullable().required("Select Company"),
  name: yup.string(),
  folio_no: yup.object().nullable().required("Select Folio Number"),
  transfer_no: yup.string(),

  certificates: yup
    .string()
    .test(
      "check-val",
      "Certificates should be at least two",
      (val) => parseInt(val) >= 1
    )
    .required("Enter Certificates "),
  remarks: yup.string(),
  input_certificates: yup
    .array()
    .of(
      yup.object().shape({
        certificate_no: yup.object().nullable().required("Select Certificate"),
        folio_number: yup.object().nullable().required("Select Folio Number"),
      })
    )
    .uniqueProperty("certificate_no", "Certificate No must be unique"),
});

export const updateTransmissionOfSharesSchema = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form?.request_date),
    execution_date: yup.string().default(form?.txn_execution_date),
    company_code: yup
      .object()
      .required("Select Company")
      .default(form?.company_code),
    folio_number: yup
      .object()
      .required("Select Folio Number")
      .default(form?.folio_number),
    // name: yup.string().required("Name is required"),
    certificates: yup
      .string()
      .test("check-val", "Split into at least two", (val) => parseInt(val) >= 1)
      .required("Enter Split Parts")
      .default(form?.input_certificates.length),
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
    transfer_no: yup.string().default(form?.transfer_no),
  });
