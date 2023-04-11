import * as yup from "yup";
import { IsJsonString } from "../../utilities/utilityFunctions";

export const addCompanySchema = yup.object().shape({
  // Company Details
  company_name: yup.string(),
  isin: yup.string(),
  registered_name: yup.string(),
  code: yup.string(),
  symbol: yup.string(),
  // company_secretary: yup.string().required("Enter Company Secretary"),
  ntn: yup.string(),
  parent: yup.object().nullable(),
  incorporation_no: yup.string(),
  // sector_code: yup.string(),
  sector_code: yup.object(),
  bussines_service:yup.string(),
  website: yup.string(),
  company_auditor:yup.string(),
  company_registrar: yup.string(),
  fiscal_year: yup.string(),
  // Contact Person Details
  contact_person_name: yup.string(),
  contact_person_phone: yup.string(),
  exchange_no: yup.string(),
  contact_person_email: yup.string().email(),
  // Head Office Address
  ho_address: yup.string(),
  ho_city: yup.object().nullable(),
  ho_country: yup.object().nullable(),
  ho_province: yup.object().nullable(),
  // CEO Details
  ceo_name: yup.string(),
  ceo_phone: yup.string(),
  ceo_mobile: yup.string(),
  ceo_email: yup.string(),
  // Shareholding Details
  outstanding_shares: yup.string(),
  face_value: yup.string(),
  total_shares: yup.string(),
  allot_size: yup.string(),
  // New Added
  shares_counter: yup.string(),
  treasury_shares: yup.string(),
  free_float: yup.string(),
  preference_shares: yup.string(),
  ordinary_shares: yup.string(),
  non_voting_shares: yup.string(),
  redeemable_shares: yup.string(),
  authorized_capital: yup.string(),
  paid_up_capital: yup.string(),
 
  management_shares: yup.string(),
  company_type: yup.string(),
  no_authorized_persons: yup.string(),
  no_governance: yup.string(),
  service_provider:yup.string(),
  // logo
  logo: yup
    .mixed(),
    // .test("fileSize", "Image Size Should be less than 1MB", (value) => {
    //   return value.length !== 0 ? value[0]?.size <= 1000000 : true;
    // })
    // .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
    //   value.length !== 0
    //     ? value[0]?.type === "image/jpeg" ||
    //       value[0]?.type === "image/jpg" ||
    //       value[0]?.type === "image/png"
    //     : true
    // ),
  // new added fields
  number_of_directors: yup.string(),
  shareholder_directors: yup.string(),
  independent_directors: yup.string(),
  board_election_date: yup.string(),
  next_board_election_date: yup.string(),
});

export const editCompanySchema = (company) =>
  yup.object().shape({
    // Company Details
    company_name: yup
      .string()
     
      .default(company.company_name),
    isin: yup.string().default(company.isin),
    registered_name: yup.string().default(company.registered_name),
    code: yup.string().default(company.code),
    symbol: yup
      .string()
      
      .default(company.symbol),
    company_secretary: yup
      .string()
      // .required("Enter Company Secretary")
      .default(company?.company_secretary),
    ntn: yup.string().default(company.ntn),
    parent: yup.object().nullable().default(company.parent_code),
    incorporation_no: yup.string().default(company.incorporation_no),
    // sector_code: yup.string().default(company.sector_code),
    sector_code:yup.object().nullable().default(company.sector_code),
    bussines_service: yup?.string().default(company?.bussines_service),
    // sector_code:yup.object().default(company.sector_code).required("Select Sector"),
    website: yup.string().default(company.website),
    company_auditor:yup.string().default(company.company_auditor),
    company_registrar: yup.string().default(company.company_registrar),
    fiscal_year: yup.string().default(company.fiscal_year),
    next_agm_date: yup.string().default(company.next_agm_date),
    agm_date: yup.string().default(company.agm_date),
    // Contact Person Details
    contact_person_name: yup.string().default(company.contact_person_name),
    contact_person_phone: yup.string().default(company.contact_person_phone),
    exchange_no: yup.string().default(company.contact_person_exchange_no),
    contact_person_email: yup
      .string()
      .email()
      .default(company.contact_person_email),
    // Head Office Address
    ho_address: yup.string().default(company.head_office_address),
    ho_city: yup.object().nullable(),
    ho_country: yup.object().nullable(),
    ho_province: yup.object().nullable(),
    // CEO Details
    ceo_name: yup.string().default(company.ceo_name),
    ceo_phone: yup.string().default(company.ceo_phone),
    ceo_mobile: yup.string().default(company.ceo_mobile),
    ceo_email: yup.string().default(company.ceo_email),
    // Shareholding Details
    outstanding_shares: yup.string().default(company.outstanding_shares),
    face_value: yup.string().default(company.face_value),
    total_shares: yup.string().default(company.total_shares),
    allot_size: yup
      .string()
     
      .default(company.allot_size),

    // New Added
    treasury_shares: yup.string().default(company.treasury_shares),
    free_float: yup.string().default(company.free_float),
    preference_shares: yup.string().default(company.preference_shares),
    ordinary_shares: yup.string().default(company.ordinary_shares),
    non_voting_shares: yup.string().default(company.non_voting_shares),
    redeemable_shares: yup.string().default(company.redeemable_shares),
    authorized_capital: yup.string().default(company.authorized_capital),
    paid_up_capital: yup.string().default(company.paid_up_capital),
 
    management_shares: yup.string().default(company.management_shares),
    company_type: yup
      .string()
     
      .default(company.company_type),
    no_authorized_persons: yup
      .string()
      .default(
        IsJsonString(company.authorized_persons)
          ? JSON.parse(company.authorized_persons).length.toString()
          : 0
      ),
    no_governance: yup
      .string()
      .default(
        IsJsonString(company.governance)
          ? JSON.parse(company.governance).length.toString()
          : 0
      ),
      service_provider: yup
      .string()
      .default(
        IsJsonString(company?.service_providers)
          ? JSON.parse(company?.service_providers)?.length.toString()
          : 0
      ),
    // logo
    logo: yup
      .mixed(),
      // .test("fileSize", "Image Size Should be less than 1MB", (value) => {
      //   return value.length !== 0 ? value[0]?.size <= 1000000 : true;
      // })
      // .test(
      //   "fileType",
      //   "We Only accept Image type of PNG, JPG, JPEG",
      //   (value) =>
      //     value.length !== 0
      //       ? value[0]?.type === "image/jpeg" ||
      //         value[0]?.type === "image/jpg" ||
      //         value[0]?.type === "image/png"
      //       : true
      // ),
    // new added fields
    number_of_directors: yup.string().default(company.number_of_directors),
    shareholder_directors: yup.string().default(company.shareholder_directors),
    independent_directors: yup.string().default(company.independent_directors),
    board_election_date: yup.string().default(company.board_election_date),
    next_board_election_date: yup.string().default(company.next_board_election_date),
  });
