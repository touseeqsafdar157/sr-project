import { Director } from "constant";
import * as yup from "yup";
const INDIVIDUALS = "INDIVIDUALS";
const DIRECTORS = "DIRECTORS";
export const addUBOSchema = yup.object().shape({
  category: yup.string().required("Select Category"),
  cnic: yup.string().when("category" , {
      is:  (category) => categories.find((cat) => cat === category),
      then: yup
        .string()
        .test(
          "len",
          "Enter Complete CNIC",
          (val) => val.replaceAll("_", "").replaceAll("-", "").length === 13
        ),
    })
    .default(""),
    
  ntn: yup
    .string()
    .when("category", {
      is: (category) => investor_categories.find((cat) => cat === category),
      then: yup.string().required("Enter NTN"),
    })
    .default(""),
  mobile: yup.string().when("category", {
    is:  (category) => categories.find((cat) => cat === category),
    then: yup.string().required("Enter Mobile Number"),
  }),
  folio_number: yup.string().when("category", {
    is:  (category) => categories.find((cat) => cat === category),
    then: yup.string().required(""),
  }),
  //  ubo_id: yup.string().when("category", {
  //   is: INDIVIDUALS,
  //   then: yup.string().required(""),
  // }),
 no_of_shares: yup.string().when("category", {
  is:  (category) => categories.find((cat) => cat === category),
    then: yup.string().required("Enter Number of Shares"),
  }),
total_shares: yup.string().when("category", {
  is:  (category) => categories.find((cat) => cat === category),
    then: yup.string().required("Enter Total Shares"),
  }),
  percentage_shares: yup.string().when("category", {
    is:  (category) => categories.find((cat) => cat === category),
    then: yup.string().required("Enter Percent Shares"),
  }),
  name: yup.string().required("Enter Name")
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
export const editUBOSchema = (data) =>
  yup.object().shape({
    category: yup.string().required("Select Category"),
    cnic: yup
      .string()
      .when("category" , {
        is:  (category) => categories.find((cat) => cat === category),
        then: yup
          .string()
          .test(
            "len",
            "Enter Complete CNIC",
            (val) => val.replaceAll("_", "").replaceAll("-", "").length === 13
          ),
      })
      .default(""),
    ntn: yup
      .string()
      .when("category", {
        is: (category) => investor_categories.find((cat) => cat === category),
        then: yup.string().required("Enter NTN"),
      })
      .default(""),
    mobile: yup.string().when("category", {
      is:  (category) => categories.find((cat) => cat === category),
      then: yup.string().required("Enter Mobile Number"),
    }),
    name: yup.string().when("category", {
      is:  (category) => categories.find((cat) => cat === category),
      then:yup.string().required("Enter Name"),
    }),
    folio_number: yup.string().when("category", {
      is:  (category) => categories.find((cat) => cat === category),
      then: yup.string().required(""),
    }),
    //  ubo_id: yup.string().when("category", {
    //   is: INDIVIDUALS,
    //   then: yup.string().required(""),
    // }),
   no_of_shares: yup.string().when("category", {
    is:  (category) => categories.find((cat) => cat === category),
      then: yup.string().required("Enter Number of Shares"),
    }),
  total_shares: yup.string().when("category", {
    is:  (category) => categories.find((cat) => cat === category),
      then: yup.string().required("Enter Total Shares"),
    }),
    percentage_shares: yup.string().when("category", {
      is:  (category) => categories.find((cat) => cat === category),
      then: yup.string().required("Enter Percent Shares"),
    }),
  });