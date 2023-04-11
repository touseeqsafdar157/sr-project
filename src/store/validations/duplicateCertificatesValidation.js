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

export const addDuplicateCertificatesSchema = yup.object().shape({
  request_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  execution_date: yup.string(),
  requester_folio: yup.object().nullable().required("Select Folio"),
  // company_code: yup.object().nullable().required("Select Company"),
  company_code: yup.string(),
  // folio_number: yup.object().nullable().required("Select Folio Number"),
  no_of_certificates: yup.string().required("Enter Certificate Number"),
  remarks: yup.string(),
  input_certificates: yup
    .array()
    .of(
      yup.object().shape({
        certificate_no: yup.object().nullable().required("Select Certificate"),
      })
    )
    .uniqueProperty("certificate_no", "Certificate No must be unique"),
  output_certificates: yup
    .array()
    .of(
      yup.object().shape({
        certificate_no: yup.string().required("Enter Certificate No"),
      })
    )
    .uniqueProperty("certificate_no", "Certificate No must be unique"),
});

export const updateDuplicateCertificatesSchema = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    execution_date: yup.string().default(form.txn_execution_date),
    requester_folio: yup
      .object()
      .required("Select Folio")
      .default(form.folio_number),
    company_code: yup
      .object()
      .required("Select Company")
      .default(form.company_code),
    // folio_number: yup.object().required("Select Folio Number"),
    no_of_certificates: yup
      .string()
      .required("Enter Certificate Number")
      .default(
        IsJsonString(form.input_certificates)
          ? JSON.parse(form.input_certificates).length
          : 0
      ),
    remarks: yup.string().default(form?.remarks),
  });
