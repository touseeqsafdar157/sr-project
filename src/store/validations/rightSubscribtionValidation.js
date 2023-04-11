import * as yup from "yup";
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

export const addRightSubscribtionValidation = yup.object().shape({
  request_date: yup.string().required("Enter Date"),
  execution_date: yup.string().required("Emter Date"),
  // company_code: yup.object().nullable().required("Select Company"),
  announcement_no: yup.object().nullable().required("Select Announcement"),
  entitlements: yup.object().nullable().required("Select Entitlement"),

  sub_shares: yup.string().required("Enter Sub Shares"),
  instrument_type: yup.object().nullable().required("Select Instrument Type"),
  instrument_no: yup.string().required("Enter Instrument No"),
  remarks: yup.string(),
  cdc_key: yup.string(),
  certificates: yup.string().when("cdc_key", {
    is: "NO",
    then: yup.string().required("Enter Certificates"),
    otherwise: yup.string(),
  }),
  output_certificates: yup.array().when("cdc_key", {
    is: "NO",
    then: yup
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
    otherwise: yup.array(),
  }),
});

export const updateRightSubscribtionValidation = (form) =>
  yup.object().shape({
    request_date: yup.string().default(form.request_date),
    execution_date: yup.string().default(form.txn_execution_date),
    company_code: yup
      .object()
      .required("Select Company")
      .default(form.company_code),
    announcement_no: yup
      .object()
      .required("Select Announcement")
      .default(form.announcement_id),
    entitlements: yup
      .object()
      .required("Select Entitlement")
      .default(form.entitlement_id),

    sub_shares: yup
      .string()
      .required("Enter Sub Shares")
      .default(form.quantity),
    instrument_type: yup.object().nullable(),
    instrument_no: yup.string().default(form.instrument_no),
    remarks: yup.string().default(form?.remarks),
  });
