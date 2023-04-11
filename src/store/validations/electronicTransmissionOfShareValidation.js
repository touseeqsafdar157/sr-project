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

export const addElectronicTransmissionOfSharesSchema = yup.object().shape({
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

  transferees: yup
    .string()
    .test(
      "check-val",
      "Ther should be atleast one transferee",
      (val) => parseInt(val) >= 1
    )
    .required("Enter no of Transferees "),
  input_certificates: yup
    .array()
    .of(
      yup.object().shape({
        folio_number: yup.object().nullable().required("Select Folio"),
        shares_count: yup
          .string()
          .test(
            "check-val",
            "Enter atleaset one share",
            (val) => parseInt(val) >= 1
          )
          .required("Enter Shares Count"),
      })
    )
    .uniqueProperty("certificate_no", "Certificate No must be unique"),
  remarks: yup.string(),
});

export const updateElectronicTransmissionOfSharesSchema = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    execution_date: yup.string().default(form.txn_execution_date),
    company_code: yup
      .object()
      .nullable()
      .required("Select Company")
      .default(form?.company_code),
    name: yup.string(),
    folio_no: yup
      .object()
      .nullable()
      .required("Select Folio Number")
      .default(form?.folio_number),
    transferees: yup
      .string()
      .test(
        "check-val",
        "Thre should be atleast one transferee",
        (val) => parseInt(val) >= 1
      )
      .required("Enter no of Transferees")
      .default(JSON.parse(form?.input_certificates).length),
    remarks: yup.string().default(form?.remarks),
    transfer_no: yup.string().default(form?.transfer_no),
  });
