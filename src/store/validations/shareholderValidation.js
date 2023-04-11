// import * as yup from "yup";
// import { IsJsonString } from "../../utilities/utilityFunctions";

// export const addShareHolderSchema = yup.object().shape({
//   folio_number: yup.string().required("Enter Folio Number"),
//   company_code: yup.object().required("Select Company"),
//   // shareholder_name: yup.string().required("Enter Share Holder Name"),
//   company_type: yup.string(),
//   shareholder_id: yup.object().required("Select Investor"),
//   poc_detail: yup.string(),
//   nationality: yup.string(),
//   shareholder_mobile: yup.string(),
//   shareholder_email: yup.string(),
//   shareholder_phone: yup.string(),
//   resident_status: yup.string(),
//   street_address: yup.string(),
//   city: yup.string(),
//   country: yup.string(),
//   // SHARES DETAILS
//   shareholder_percent: yup.string(),
//   electronic_shares: yup.string().when("company_type", {
//     is: "Private",
//     then: yup.string().required("Enter Electronic Shares"),
//     otherwise: yup.string(),
//   }),
//   physical_shares: yup.string(),
//   blocked_shares: yup.string(),
//   freeze_shares: yup.string(),
//   pledged_shares: yup.string(),
//   pending_in: yup.string(),
//   pending_out: yup.string(),
//   available_shares: yup.string(),
//   total_holding: yup.string(),
//   no_joint_holders: yup.string(),
//   right_shares: yup.string(),
//   // CDC ACCOUNT DETAILS
//   cdc_account_no: yup.string(),
//   cdc_participant_id: yup.string(),
//   cdc_account_type: yup.string(),

//   passport_no: yup.string(),
//   passport_expiry: yup.string(),
//   passport_country: yup.string(),

//   // Nominee Details
//   nominee_name: yup.string(),
//   nominee_cnic: yup.string(),
//   nominee_relation: yup.string(),
//   // Bank Details
//   account_title: yup.string(),
//   account_no: yup.string(),
//   bank_name: yup.string(),
//   baranch_address: yup.string(),
//   baranch_city: yup.string(),
//   // Attachments
//   picture: yup
//     .mixed()
//     .test("fileSize", "Image Size Should be less than 1MB", (value) => {
//       return value.length !== 0 ? value[0]?.size <= 1000000 : true;
//     })
//     .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
//       value.length !== 0
//         ? value[0]?.type === "image/jpeg" ||
//           value[0]?.type === "image/jpg" ||
//           value[0]?.type === "image/png"
//         : true
//     ),

//   signature_specimen: yup
//     .mixed()
//     .test("fileSize", "Image Size Should be less than 1MB", (value) => {
//       return value.length !== 0 ? value[0]?.size <= 1000000 : true;
//     })
//     .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
//       value.length !== 0
//         ? value[0]?.type === "image/jpeg" ||
//           value[0]?.type === "image/jpg" ||
//           value[0]?.type === "image/png"
//         : true
//     ),

//   cnic_copy: yup
//     .mixed()
//     .test("fileSize", "Image Size Should be less than 1MB", (value) => {
//       return value.length !== 0 ? value[0]?.size <= 1000000 : true;
//     })
//     .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
//       value.length !== 0
//         ? value[0]?.type === "image/jpeg" ||
//           value[0]?.type === "image/jpg" ||
//           value[0]?.type === "image/png"
//         : true
//     ),

//   nominee_cnic_copy: yup
//     .mixed()
//     .test("fileSize", "Image Size Should be less than 1MB", (value) => {
//       return value.length !== 0 ? value[0]?.size <= 1000000 : true;
//     })
//     .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
//       value.length !== 0
//         ? value[0]?.type === "image/jpeg" ||
//           value[0]?.type === "image/jpg" ||
//           value[0]?.type === "image/png"
//         : true
//     ),

//   zakat_declaration: yup
//     .mixed()
//     .test("fileSize", "Image Size Should be less than 1MB", (value) => {
//       return value.length !== 0 ? value[0]?.size <= 1000000 : true;
//     })
//     .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
//       value.length !== 0
//         ? value[0]?.type === "image/jpeg" ||
//           value[0]?.type === "image/jpg" ||
//           value[0]?.type === "image/png"
//         : true
//     ),
// });

// export const updateShareholderSchema = (holder) => {
//   return yup.object().shape({
//     company_code: yup.object().nullable().default(holder.company_code),
//     // shareholder_name: yup.string().required("Enter Share Holder Name").default(holder.shareholder_name),
//     company_type: yup.string(),
//     shareholder_id: yup.object().nullable().default(holder.shareholder_id),
//     poc_detail: yup.string().default(holder.poc_detail),
//     nationality: yup.string().default(holder.nationality),
//     shareholder_mobile: yup.string().default(holder.shareholder_mobile),
//     shareholder_email: yup.string().default(holder.shareholder_email),
//     shareholder_phone: yup.string().default(holder.shareholder_phone),
//     resident_status: yup.string().default(holder.resident_status),
//     street_address: yup.string().default(holder.street_address),
//     city: yup.string().default(holder.city),
//     country: yup.string().default(holder.country),
//     // SHARES DETAILS
//     shareholder_percent: yup.string().default(holder.shareholder_percent),
//     electronic_shares: yup
//       .string()
//       .when("company_type", {
//         is: "Private",
//         then: yup.string().required("Enter Electronic Shares"),
//         otherwise: yup.string(),
//       })
//       .default(holder.electronic_shares),
//     physical_shares: yup.string().default(holder.physical_shares),
//     blocked_shares: yup.string().default(holder.blocked_shares),
//     freeze_shares: yup.string().default(holder.freeze_shares),
//     pledged_shares: yup.string().default(holder.pledged_shares),
//     pending_in: yup.string().default(holder.pending_in),
//     pending_out: yup.string().default(holder.pending_out),
//     available_shares: yup.string().default(holder.available_shares),
//     total_holding: yup.string().default(holder.total_holding),
//     no_joint_holders: yup
//       .string()
//       .default(
//         IsJsonString(holder.joint_holders)
//           ? JSON.parse(holder.joint_holders).length.toString()
//           : "0"
//       ),
//     right_shares: yup.string().default(holder.right_shares),

//     // CDC ACCOUNT DETAILS
//     cdc_account_no: yup.string().default(holder.cdc_account_no),
//     cdc_participant_id: yup.string().default(holder.cdc_participant_id),
//     cdc_account_type: yup.string().default(holder.cdc_account_type),
//     cdc_key: yup.string().default(holder.cdc_key),

//     passport_no: yup.string().default(holder.passport_no),
//     passport_expiry: yup.string().default(holder.passport_expiry),
//     passport_country: yup.string().default(holder.passport_country),

//     // Nominee Details
//     nominee_name: yup.string().default(holder.nominee_name),
//     nominee_cnic: yup.string().default(holder.nominee_cnic),
//     nominee_relation: yup.string().default(holder.nominee_relation),
//     // Bank Details
//     account_title: yup.string().default(holder.account_title),
//     account_no: yup.string().default(holder.account_no),
//     bank_name: yup.string().default(holder.bank_name),
//     baranch_address: yup.string().default(holder.baranch_address),
//     baranch_city: yup.string().default(holder.baranch_city),
//     // Attachments
//     picture: yup
//       .mixed()
//       .test("fileSize", "Image Size Should be less than 1MB", (value) => {
//         return value.length !== 0 ? value[0]?.size <= 1000000 : true;
//       })
//       .test(
//         "fileType",
//         "We Only accept Image type of PNG, JPG, JPEG",
//         (value) =>
//           value.length !== 0
//             ? value[0]?.type === "image/jpeg" ||
//               value[0]?.type === "image/jpg" ||
//               value[0]?.type === "image/png"
//             : true
//       ),

//     signature_specimen: yup
//       .mixed()
//       .test("fileSize", "Image Size Should be less than 1MB", (value) => {
//         return value.length !== 0 ? value[0]?.size <= 1000000 : true;
//       })
//       .test(
//         "fileType",
//         "We Only accept Image type of PNG, JPG, JPEG",
//         (value) =>
//           value.length !== 0
//             ? value[0]?.type === "image/jpeg" ||
//               value[0]?.type === "image/jpg" ||
//               value[0]?.type === "image/png"
//             : true
//       ),

//     cnic_copy: yup
//       .mixed()
//       .test("fileSize", "Image Size Should be less than 1MB", (value) => {
//         return value.length !== 0 ? value[0]?.size <= 1000000 : true;
//       })
//       .test(
//         "fileType",
//         "We Only accept Image type of PNG, JPG, JPEG",
//         (value) =>
//           value.length !== 0
//             ? value[0]?.type === "image/jpeg" ||
//               value[0]?.type === "image/jpg" ||
//               value[0]?.type === "image/png"
//             : true
//       ),

//     nominee_cnic_copy: yup
//       .mixed()
//       .test("fileSize", "Image Size Should be less than 1MB", (value) => {
//         return value.length !== 0 ? value[0]?.size <= 1000000 : true;
//       })
//       .test(
//         "fileType",
//         "We Only accept Image type of PNG, JPG, JPEG",
//         (value) =>
//           value.length !== 0
//             ? value[0]?.type === "image/jpeg" ||
//               value[0]?.type === "image/jpg" ||
//               value[0]?.type === "image/png"
//             : true
//       ),

//     zakat_declaration: yup
//       .mixed()
//       .test("fileSize", "Image Size Should be less than 1MB", (value) => {
//         return value.length !== 0 ? value[0]?.size <= 1000000 : true;
//       })
//       .test(
//         "fileType",
//         "We Only accept Image type of PNG, JPG, JPEG",
//         (value) =>
//           value.length !== 0
//             ? value[0]?.type === "image/jpeg" ||
//               value[0]?.type === "image/jpg" ||
//               value[0]?.type === "image/png"
//             : true
//       ),
//   });
// };


import * as yup from "yup";
import { IsJsonString, getvalidDateYMD } from "../../utilities/utilityFunctions";

export const addShareHolderSchema = yup.object().shape({
  folio_number: yup.string().required("Enter Folio Number"),
  company_code: yup.object().required("Select Company"),
  // shareholder_name: yup.string().required("Enter Share Holder Name"),
  company_type: yup.string(),
  shareholder_id: yup.object().required("Select Investor"),
  poc_detail: yup.string(),
  nationality: yup.string(),
  shareholder_mobile: yup.string(),
  shareholder_email: yup.string(),
  shareholder_phone: yup.string(),
  resident_status: yup.string(),
  street_address: yup.string(),
  city: yup.string(),
  country: yup.string(),
  // SHARES DETAILS
  shareholder_percent: yup.string(),
  electronic_shares: yup.string().when("company_type", {
    is: "Private",
    then: yup.string().required("Enter Electronic Shares"),
    otherwise: yup.string(),
  }),
  physical_shares: yup.string(),
  blocked_shares: yup.string(),
  freeze_shares: yup.string(),
  pledged_shares: yup.string(),
  pending_in: yup.string(),
  pending_out: yup.string(),
  available_shares: yup.string(),
  total_holding: yup.string(),
  no_joint_holders: yup.string(),
  right_shares: yup.string(),
  // CDC ACCOUNT DETAILS
  cdc_account_no: yup.string(),
  cdc_participant_id: yup.string(),
  cdc_account_type: yup.string(),

  passport_no: yup.string(),
  passport_expiry: yup.string(),
  passport_country: yup.string(),

  // Nominee Details
  nominee_name: yup.string(),
  nominee_cnic: yup.string(),
  nominee_relation: yup.string(),
  // Bank Details
  account_title: yup.string(),
  account_no: yup.string(),
  bank_name: yup.string(),
  baranch_address: yup.string(),
  baranch_city: yup.string(),
  // Attachments
  picture: yup
    .mixed()
    .test("fileSize", "Image Size Should be less than 1MB", (value) => {
      return value.length !== 0 ? value[0]?.size <= 1000000 : true;
    })
    .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
      value.length !== 0
        ? value[0]?.type === "image/jpeg" ||
          value[0]?.type === "image/jpg" ||
          value[0]?.type === "image/png"
        : true
    ),

  signature_specimen: yup
    .mixed()
    .test("fileSize", "Image Size Should be less than 1MB", (value) => {
      return value.length !== 0 ? value[0]?.size <= 1000000 : true;
    })
    .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
      value.length !== 0
        ? value[0]?.type === "image/jpeg" ||
          value[0]?.type === "image/jpg" ||
          value[0]?.type === "image/png"
        : true
    ),

  cnic_copy: yup
    .mixed()
    .test("fileSize", "Image Size Should be less than 1MB", (value) => {
      return value.length !== 0 ? value[0]?.size <= 1000000 : true;
    })
    .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
      value.length !== 0
        ? value[0]?.type === "image/jpeg" ||
          value[0]?.type === "image/jpg" ||
          value[0]?.type === "image/png"
        : true
    ),

  nominee_cnic_copy: yup
    .mixed()
    .test("fileSize", "Image Size Should be less than 1MB", (value) => {
      return value.length !== 0 ? value[0]?.size <= 1000000 : true;
    })
    .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
      value.length !== 0
        ? value[0]?.type === "image/jpeg" ||
          value[0]?.type === "image/jpg" ||
          value[0]?.type === "image/png"
        : true
    ),

  zakat_declaration: yup
    .mixed()
    .test("fileSize", "Image Size Should be less than 1MB", (value) => {
      return value.length !== 0 ? value[0]?.size <= 1000000 : true;
    })
    .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
      value.length !== 0
        ? value[0]?.type === "image/jpeg" ||
          value[0]?.type === "image/jpg" ||
          value[0]?.type === "image/png"
        : true
    ),

    category: yup.string().required("Select Investor Category"),
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

export const updateShareholderSchema = (holder) => {
  return yup.object().shape({
    company_code: yup.object().nullable().default(holder.company_code),
    // shareholder_name: yup.string().required("Enter Share Holder Name").default(holder.shareholder_name),
    company_type: yup.string(),
    shareholder_id: yup.object().nullable().default(holder.shareholder_id),
    poc_detail: yup.string().default(holder.poc_detail),
    nationality: yup.string().default(holder.nationality),
    shareholder_mobile: yup.string().default(holder.shareholder_mobile),
    shareholder_email: yup.string().default(holder.shareholder_email),
    shareholder_phone: yup.string().default(holder.shareholder_phone),
    resident_status: yup.string().default(holder.resident_status),
    street_address: yup.string().default(holder.street_address),
    city: yup.string().default(holder.city),
    country: yup.string().default(holder.country),
    // SHARES DETAILS
    shareholder_percent: yup.string().default(holder.shareholder_percent),
    electronic_shares: yup
      .string()
      .when("company_type", {
        is: "Private",
        then: yup.string().required("Enter Electronic Shares"),
        otherwise: yup.string(),
      })
      .default(holder.electronic_shares),
    physical_shares: yup.string().default(holder.physical_shares),
    blocked_shares: yup.string().default(holder.blocked_shares),
    freeze_shares: yup.string().default(holder.freeze_shares),
    pledged_shares: yup.string().default(holder.pledged_shares),
    pending_in: yup.string().default(holder.pending_in),
    pending_out: yup.string().default(holder.pending_out),
    available_shares: yup.string().default(holder.available_shares),
    total_holding: yup.string().default(holder.total_holding),
    no_joint_holders: yup
      .string()
      .default(
        IsJsonString(holder.joint_holders)
          ? JSON.parse(holder.joint_holders).length.toString()
          : "0"
      ),
    right_shares: yup.string().default(holder.right_shares),

    // CDC ACCOUNT DETAILS
    cdc_account_no: yup.string().default(holder.cdc_account_no),
    cdc_participant_id: yup.string().default(holder.cdc_participant_id),
    cdc_account_type: yup.string().default(holder.cdc_account_type),
    cdc_key: yup.string().default(holder.cdc_key),

    passport_no: yup.string().default(holder.passport_no),
    passport_expiry: yup.string().default(holder.passport_expiry),
    passport_country: yup.string().default(holder.passport_country),

    // Nominee Details
    nominee_name: yup.string().default(holder.nominee_name),
    nominee_cnic: yup.string().default(holder.nominee_cnic),
    nominee_relation: yup.string().default(holder.nominee_relation),
    // Bank Details
    account_title: yup.string().default(holder.account_title),
    account_no: yup.string().default(holder.account_no),
    bank_name: yup.string().default(holder.bank_name),
    baranch_address: yup.string().default(holder.baranch_address),
    baranch_city: yup.string().default(holder.baranch_city),
    // Attachments
    picture: yup
      .mixed()
      .test("fileSize", "Image Size Should be less than 1MB", (value) => {
        return value.length !== 0 ? value[0]?.size <= 1000000 : true;
      })
      .test(
        "fileType",
        "We Only accept Image type of PNG, JPG, JPEG",
        (value) =>
          value.length !== 0
            ? value[0]?.type === "image/jpeg" ||
              value[0]?.type === "image/jpg" ||
              value[0]?.type === "image/png"
            : true
      ),

    signature_specimen: yup
      .mixed()
      .test("fileSize", "Image Size Should be less than 1MB", (value) => {
        return value.length !== 0 ? value[0]?.size <= 1000000 : true;
      })
      .test(
        "fileType",
        "We Only accept Image type of PNG, JPG, JPEG",
        (value) =>
          value.length !== 0
            ? value[0]?.type === "image/jpeg" ||
              value[0]?.type === "image/jpg" ||
              value[0]?.type === "image/png"
            : true
      ),

    cnic_copy: yup
      .mixed()
      .test("fileSize", "Image Size Should be less than 1MB", (value) => {
        return value.length !== 0 ? value[0]?.size <= 1000000 : true;
      })
      .test(
        "fileType",
        "We Only accept Image type of PNG, JPG, JPEG",
        (value) =>
          value.length !== 0
            ? value[0]?.type === "image/jpeg" ||
              value[0]?.type === "image/jpg" ||
              value[0]?.type === "image/png"
            : true
      ),

    nominee_cnic_copy: yup
      .mixed()
      .test("fileSize", "Image Size Should be less than 1MB", (value) => {
        return value.length !== 0 ? value[0]?.size <= 1000000 : true;
      })
      .test(
        "fileType",
        "We Only accept Image type of PNG, JPG, JPEG",
        (value) =>
          value.length !== 0
            ? value[0]?.type === "image/jpeg" ||
              value[0]?.type === "image/jpg" ||
              value[0]?.type === "image/png"
            : true
      ),

    zakat_declaration: yup
      .mixed()
      .test("fileSize", "Image Size Should be less than 1MB", (value) => {
        return value.length !== 0 ? value[0]?.size <= 1000000 : true;
      })
      .test(
        "fileType",
        "We Only accept Image type of PNG, JPG, JPEG",
        (value) =>
          value.length !== 0
            ? value[0]?.type === "image/jpeg" ||
              value[0]?.type === "image/jpg" ||
              value[0]?.type === "image/png"
            : true
      ),
      // investor detail

      category: yup
      .string()
      .required("Select Investor Category")
      .default(holder.category && holder.category.toUpperCase()),
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
      .default(holder?.cnic),
    cnic_expiry: yup
      .string()
      .when("category", {
        is: (category) => categories.find((cat) => cat === category),
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(
        new Date(holder.cnic_expiry) !== "Invalid Date"
          ? getvalidDateYMD(holder.cnic_expiry)
          : ""
      ),
    investor_ntn: yup
      .string()
      .when("category", {
        is: (category) =>
          investor_categories.find((cat) => cat === category?.toUpperCase()),
        then: yup.string().required("Enter Investor NTN"),
      })
      .default(holder?.ntn),
    salutation: yup
      .string()
      .when("category", {
        is: (category) => categories.find((cat) => cat === category),
        then: yup.string().required("Select Salutation"),
      })
      .default(holder.salutation),
    investor_name: yup
      .string()
      .required("Enter Investor Name")
      .default(holder.investor_name),
    date_of_birth: yup
      .string()
      .when("category", {
        is: (category) => categories.find((cat) => cat === category),
        then: yup.string().test("test-date", "Enter Date", (value) => {
          return value;
        }),
      })
      .default(
        new Date(holder.birth_date) !== "Invalid Date"
          ? getvalidDateYMD(holder.birth_date)
          : ""
      ),
    gender: yup
      .string()
      .when("category", {
        is: (category) => categories.find((cat) => cat === category),
        then: yup.string().required("Select Gender"),
      })
      .default(holder.gender),
    religion: yup.string().default(holder.religion),
    occupation: yup.string().default(holder.occupation),
    // Relatives Details
    father_name: yup.string().default(holder.father_name),
    spouse_name: yup.string().default(holder.spouse_name),
  });
};


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
