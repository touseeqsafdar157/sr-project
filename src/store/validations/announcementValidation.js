import * as yup from "yup";

export const addAnnouncmentSchema = yup.object().shape({
  company_code: yup.object().required("Enter COMPANY_CODE "),
  // symbol: yup.object().required("Enter SYMBOL "),
  announcement_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  dividend_number: yup.string(),
  dividend_percent: yup.string().when("dividend_number", {
    is: (val) => val > 0,
    then: yup.string().required("Enter Dividend Percent"),
    otherwise: yup.string(),
  }),
  bonus_number: yup.string(),
  bonus_percent: yup.string().when("bonus_number", {
    is: (val) => val > 0,
    then: yup.string().required("Enter Bonus Percent"),
    otherwise: yup.string(),
  }),
  right_number: yup.string().when("right_rate", {
    is: (val) => val > 0,
    then: yup.string().required("Enter Right Number"),
    otherwise: yup.string(),
  }),
  right_percent: yup.string(),
  period: yup.object().when("dividend_number", {
    is: (val) => val > 0,
    then: yup.object().nullable().required("Enter PERIOD "),
  }),
  period_ended: yup.string().when("dividend_number", {
    is: (val) => val > 0,
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
  book_closure_from: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  book_closure_to: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  right_subs_from: yup.string().when("right_rate", {
    is: (val) => val > 0,
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
  right_subs_to: yup.string().when("right_rate", {
    is: (val) => val > 0,
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
  provisional_from: yup.string().when("dividend_number", {
    is: (val) => val > 0,
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
  provisional_to: yup.string().when("dividend_number", {
    is: (val) => val > 0,
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
  check_any: yup
    .string()
    .when(["right_number", "dividend_number", "bonus_number"], {
      is: (right_number, dividend_number, bonus_number) =>
       ( bonus_number || right_number || dividend_number),
      then: yup.string(),
      otherwise: yup
        .string()
        .required(
          "Enter any of value for fields among Right Rate, Bonus Number and Dividend Number"
        ),
    }),
  right_credit_from: yup.string().when("right_rate", {
    is: (val) => val > 0,
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
  right_credit_to: yup.string().when("right_rate", {
    is: (val) => val > 0,
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
  right_rate: yup.string(),
  right_allotment_date: yup.string().when("right_rate", {
    is: (val) => val > 0,
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
  bonus_allotment_date: yup.string().when("bonus_number", {
    is: (val) => val > 0,
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
});

export const editAnnouncmentSchema = (announcement) =>
  yup.object().shape({
    company_code: yup
      .object()
      .nullable()
      .required("Enter COMPANY_CODE ")
      .default(announcement.company_code),
    // symbol: yup
    //   // .object()
    //   .string()
    //   // .nullable()
    //   .required("Enter SYMBOL")
    //   .default(announcement.symbol),
    announcement_date: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(announcement.announcement_date),
    check_any: yup
      .string()
      .when(["right_number", "dividend_number", "bonus_number"], {
        is: (right_rate, dividend_number, bonus_number) =>
          (bonus_number || right_rate || dividend_number),
          then: yup.string(),
          otherwise: yup
          .string()
          .required(
            "Enter any of value for fields among Right Rate, Bonus Number and Dividend Number"
          ),
      }),
    dividend_number: yup.string().default(announcement.dividend_number),
    dividend_percent: yup.string().default(announcement.dividend_percent),
    bonus_number: yup.string().default(announcement.bonus_number),
    bonus_percent: yup.string().default(announcement.bonus_percent),
    right_number: yup.string().default(announcement.right_number),
    right_percent: yup
      .string()
      .default(announcement?.right_rercent || announcement?.right_percent),
    period: yup
      .object()
      .when("dividend_number", {
        is: (val) => val > 0,
        then: yup.object().nullable().required("Enter PERIOD "),
      })
      .default(announcement.period),
    period_ended: yup
      .string()
      .when("dividend_number", {
        is: (val) => val > 0,
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(announcement.period_ended),
    book_closure_from: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(announcement.book_closure_from),
    book_closure_to: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(announcement.book_closure_to),
    right_subs_from: yup
      .string()
      .when("right_rate", {
        is: (val) => val > 0,
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(announcement.right_subs_from),
    right_subs_to: yup
      .string()
      .when("right_rate", {
        is: (val) => val > 0,
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(announcement.right_subs_to),
    provisional_from: yup
      .string()
      .when("dividend_number", {
        is: (val) => val > 0,
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(announcement.provisional_from),
    provisional_to: yup
      .string()
      .when("dividend_number", {
        is: (val) => val > 0,
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(announcement.provisional_to),
    right_credit_from: yup
      .string()
      .when("right_rate", {
        is: (val) => val > 0,
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(
        announcement?.right_credit_trom || announcement?.right_credit_from
      ),
    right_credit_to: yup
      .string()
      .when("right_rate", {
        is: (val) => val > 0,
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(announcement.right_credit_to),
    right_rate: yup.string().default(announcement?.right_rate),
    right_allotment_date: yup
      .string()
      .when("right_rate", {
        is: (val) => val > 0,
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(announcement?.right_allotment_date),
    bonus_allotment_date: yup
      .string()
      .when("bonus_number", {
        is: (val) => val > 0,
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(announcement?.bonus_allotment_date),
  });
