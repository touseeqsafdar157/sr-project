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

export const addPhysicalToElectronicSchema = yup.object().shape({
  request_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  execution_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  requester_folio: yup.object().nullable().required("Select Folio"),
  // company_code: yup.object().nullable().required("Select Company"),
  // Transfer Details
  no_of_certificates: yup.string().required("Enter Number of Certificate"),
  remarks: yup.string(),
  transfer_no: yup.string(),
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
export const updatePhysicalToElectronicSchema = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    execution_date: yup.string().default(form.txn_execution_date),
    requester_folio: yup
      .object()
      .nullable()
      .required("Select Folio")
      .default(form.from_folio),
    to_folio: yup
      .object()
      .nullable()
      .required("Select Folio")
      .default(form?.folio_number),
    company_code: yup
      .object()
      .required("Select Company")
      .default(form.company_code),
    transfer_no: yup.string().default(form?.transfer_no),
    // Transfer Details
    no_of_certificates: yup
      .string()
      .required("Enter Number of Certificate")
      .default(form.input_certificates.length.toString()),
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
    reference: yup.string().default(form?.reference),

    // price: yup.string(),
    // amount: yup.string(),
  });
