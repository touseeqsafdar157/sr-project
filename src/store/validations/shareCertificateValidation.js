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

export const addShareCertificateSchema = yup.object().shape({
  certificate_from: yup.string().required("Enter From"),
  certificate_to: yup.string().required("Enter To"),
  type: yup.string().required("Select Type"),
  issue_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  allotted_to: yup.object().required("Select Folio Number"),
  company_code: yup.object().required("Select Company"),
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
});


export const editShareCertificateSchema = (data) =>
  yup.object().shape({
    company_code: yup.object().required("Select Code").default(data.company_code),
    from: yup.string().required("Enter From").default(data.certificate_from),
    to: yup.string().required("Enter To").default(data.certificate_to),
    count: yup.string().required("Enter Share Count").default(data.shares_count),
    certificate_no: yup.string().required("Certificate No. Should not be empty").default(data.certificate_no),
    type: yup.string().required("Select Type").default(data.type && data.type),
    allotted_to: yup.object().required("Select Folio Number").default(data.allotted_to),
    issue_date: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }).default(data.issue_date.toUpperCase()),
  });