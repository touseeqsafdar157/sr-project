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

export const addConsolidateSharesSchema = yup.object().shape({
  request_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  execution_date: yup.string(),
  requester_folio: yup.object().nullable().required("Select Folio"),
  // company_code: yup.object().nullable().required("Select Company"),
  company_code: yup.string(),
  // folio_number: yup.object().nullable().required("Select Folio Number"),
  no_of_certificates: yup
    .string()
    .test(
      "check-val",
      "Enter At least two certificates to consolidate",
      (val) => parseInt(val) >= 2
    )
    .required("Enter No of Certificates"),
  new_certificate_no: yup.string().required("Enter Certificate Number"),
  input_certificates: yup
    .array()
    .of(
      yup.object().shape({
        certificate_no: yup.object().nullable().required("Select Certificate"),
      })
    )
    .uniqueProperty("certificate_no", "Certificate No must be unique"),
  remarks: yup.string(),
});

export const updateConsolidateSharesSchema = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    execution_date: yup.string().default(form.txn_execution_date),
    company_code: yup
      .object()
      .nullable()
      .required("Select Company")
      .default(form.company_code),
    requester_folio: yup
      .object()
      .nullable()
      .required("Select Folio Number")
      .default(form.folio_number),
    no_of_certificates: yup
      .string()
      .test(
        "check-val",
        "Enter At least two certificates to consolidate",
        (val) => parseInt(val) >= 2
      )
      .required("Enter No of Certificates")
      .default(form.input_certificates.length.toString()),
    new_certificate_no: yup
      .string()
      .required("Enter Certificate Number")
      .default(
        (IsJsonString(form.output_certificates) &&
          JSON.parse(form.output_certificates)[0]?.certificate_no) ||
        ""
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
    remarks: yup.string().default(form?.remarks),
  });
