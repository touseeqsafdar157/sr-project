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

export const addElectionSchema = yup.object().shape({
  company_code: yup.object().nullable().required("Select Company"),
  term: yup.string().required("Enter Term"),
  election_from: yup.string().test("test-date", "Enter Date", (value) => value),
  election_to: yup.string().test("test-date", "Enter Date", (value) => value),
  number_of_directors: yup.string().required("Enter Number of Directors"),

  effect_from: yup.string().test("test-date", "Enter Date", (value) => value),
  last_date: yup.string().test("test-date", "Enter Date", (value) => value),
  agm_date: yup.string().test("test-date", "Enter Date", (value) => value),
  application_from: yup
    .string()
    .test("test-date", "Enter Date", (value) => value),
  application_to: yup
    .string()
    .test("test-date", "Enter Date", (value) => value),
  candidates: yup
    .array()
    .of(
      yup.object().shape({
        investor_id: yup.object().nullable().required("Select Investor"),
      })
    )
    .uniqueProperty("investor_id", "Investor must be unique"),
});
export const updateElectionSchema = (election) =>
  yup.object().shape({
    company_code: yup
      .object()
      .nullable()
      .required("Select Company")
      .default(election?.company_code),
    term: yup.string().required("Enter Term").default(election?.term),
    election_from: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(election?.election_from),
    election_to: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(election?.election_to),
    number_of_directors: yup.string().default(election?.number_of_directors),
    election_candidates: yup.string().default(election?.election_candidates),
    elected_candidates: yup.string().default(election?.elected_candidates),

    effect_from: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(election?.effect_from),
    last_date: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(election?.last_date),
    agm_date: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(election?.agm_date),
    application_from: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(election?.application_from),
    application_to: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(election?.application_to),
    candidates: yup
      .array()
      .of(
        yup.object().shape({
          investor_id: yup.object().nullable().required("Select Investor"),
        })
      )
      .uniqueProperty("investor_id", "Investor must be unique")
      .default(election?.election_candidates),
  });
