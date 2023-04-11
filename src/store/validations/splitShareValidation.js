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

export const addSplitShareSchema = yup.object().shape({
  request_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  execution_date: yup.string(),
  // company_code: yup.object().nullable().required("Select Company"),
  company_code: yup.string(),
  name: yup.string(),
  folio_no: yup.object().nullable().required("Select Folio Number"),
  certificate_no: yup.object().nullable().required("Select Certificate"),
  split_parts: yup
    .string()
    .test("check-val", "Split into at least two", (val) => parseInt(val) >= 2)
    .required("Enter Split Parts"),
  output_certificates: yup
    .array()
    .of(
      yup.object().shape({
        certificate_no: yup.string().required("Enter Certificate"),
        from: yup.string().required("Enter From"),
        to: yup.string().required("Enter To"),
        shares_count: yup.string().required("Enter Shares Count"),
      })
    )
    .uniqueProperty("certificate_no", "Certificate No must be unique"),
  remarks: yup.string(),
});

export const updateSplitShareSchema = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    execution_date: yup.string().default(form.txn_execution_date),
    company_code: yup
      .object()
      .required("Select Company")
      .default(form.company_code),
    name: yup.string(),
    folio_no: yup
      .object()
      .required("Select Folio Number")
      .default(form.folio_number),
    certificate_no: yup
      .object()
      .required("Select Certificate")
      .default({
        value: JSON.parse(form.input_certificates)[0] != undefined ? JSON.parse(form.input_certificates)[0].certificate_no : [],
        label: JSON.parse(form.input_certificates)[0] != undefined ? JSON.parse(form.input_certificates)[0].certificate_no : [],
      }),
    split_parts: yup
      .string()
      .test("check-val", "Split into at least two", (val) => parseInt(val) >= 2)
      .required("Enter Split Parts")
      .default(form?.quantity),
    // input_certificates: yup
    //   .array()
    //   .of(
    //     yup.object().shape({
    //       certificate_no: yup.object().required("Select Certificate"),
    //       // from: yup.object().required("Select Distinctive No. From"),
    //       // to: yup.object().required("Select Distinctive No. To"),
    //       folio_number: yup.object().nullable().required("Select Folio Number"),
    //     })
    //   ).default(JSON.parse(form.input_certificates)),
    output_certificates: yup
      .array()
      .of(
        yup.object().shape({
          certificate_no: yup.string().required("Select Certificate"),
          from: yup.string().required("Enter From"),
          to: yup.string().required("Enter To"),
          folio_number: yup.string().required("Select Folio Number"),
        })
      ).default(form.output_certificates),
    remarks: yup.string().default(form?.remarks),
  });
