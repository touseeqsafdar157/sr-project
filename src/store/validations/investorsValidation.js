import * as yup from "yup";
import {
  getvalidDateDMY,
  getvalidDateYMD,
} from "../../utilities/utilityFunctions";
export const addInvestorSchema = yup.object().shape({
  category: yup.string().required("Select Investor Category"),
  investor_cnic: yup
    .string()
    .when("category", {
      is: (category) => categories.find((cat) => cat === category),
      then: yup
        .string()
        // .test(
        //   "len",
        //   "Enter Complete CNIC",
        //   (val) => val.replaceAll("_", "").replaceAll("-", "").length === 13
        // ),
    })
    .default(""),
  investor_ntn: yup
    .string()
    .when("category", {
      is: (category) => investor_categories.find((cat) => cat === category),
      then: yup.string().required("Enter Investor NTN"),
    })
    .default(""),
  cnic_expiry: yup.string().when("category", {
    is: (category) => categories.find((cat) => cat === category),
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
  salutation: yup.string().when("category", {
    is: (category) => categories.find((cat) => cat === category),
    then: yup.string().required("Select Salutation"),
  }),
  investor_name: yup.string().required("Enter Investor Name"),
  date_of_birth: yup.string().when("category", {
    is: (category) => categories.find((cat) => cat === category),
    then: yup.string().test("test-date", "Enter Date", (value) => {
      return value;
    }),
  }),
  gender: yup.string().when("category", {
    is: (category) => categories.find((cat) => cat === category),
    then: yup.string().required("Select Gender"),
  }),
  religion: yup.string().notRequired(),
  occupation: yup.string().notRequired(),
  // Relatives Details
  father_name: yup.string().notRequired(),
  spouse_name: yup.string().notRequired(),
});
const investor_categories = [
  "PUBLIC SECTOR",
  "JOINT STOCK COMPANIES",
  "FINANCIAL INSTITUTIONS",
  "MUTITAL FUND/TRUSTEE",
  "INSURANCE COMPANIES",
  "INVESTMENT COMPANIES",

  "ASSOCIATED COMPANIES",
  "INVESTMENT COMPANIES",
  "LEASING COMPANIES",
  "TRUSTS",
  "NIT AND ICP",
  "MODARBA",
  "MODARBA MANAGEMENT",
  "CORPORATE ORGANIZATIONS",
  "CHARITABLE INSTITUTES",
  "CDC",
  "OTHERS",
];
const categories = [
  "INDIVIDUALS",
  "DIRECTORS",
  "EXECUTIVES",
  "EMPLOYEE"
];
export const editInvestorSchema = (data) =>
  yup.object().shape({
    
    category: yup
      .string()
      .required("Select Investor Category")
      .default(data.category.toUpperCase()),
    investor_cnic: yup
      .string()
      .when("category", {
        is: (category) => categories.find((cat) => cat === category),
        then: yup
          .string()
          .test(
            "len",
            "Enter Complete CNIC",
            (val) => val.replaceAll("_", "").replaceAll("-", "").length === 13
          ),
      })
      .default(data?.cnic),
    cnic_expiry: yup
      .string()
      .when("category", {
        is: (category) => categories.find((cat) => cat === category),
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(
        new Date(data.cnic_expiry) !== "Invalid Date"
          ? getvalidDateYMD(data.cnic_expiry)
          : ""
      ),
    investor_ntn: yup
      .string()
      .when("category", {
        is: (category) =>
          investor_categories.find((cat) => cat === category?.toUpperCase()),
        then: yup.string().required("Enter Investor NTN"),
      })
      .default(data?.ntn),
    salutation: yup
      .string()
      .when("category", {
        is: (category) => categories.find((cat) => cat === category),
        then: yup.string().required("Select Salutation"),
      })
      .default(data.salutation),
    investor_name: yup
      .string()
      .required("Enter Investor Name")
      .default(data.investor_name),
    date_of_birth: yup
      .string()
      .when("category", {
        is: (category) => categories.find((cat) => cat === category),
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(
        new Date(data.birth_date) !== "Invalid Date"
          ? getvalidDateYMD(data.birth_date)
          : ""
      ),
    gender: yup
      .string()
      .when("category", {
        is: (category) => categories.find((cat) => cat === category),
        then: yup.string().required("Select Gender"),
      })
      .default(data.gender),
    religion: yup.string().default(data.religion),
    occupation: yup.string().default(data.occupation),
    // Relatives Details
    father_name: yup.string().default(data.father_name),
    spouse_name: yup.string().default(data.spouse_name),
  });
