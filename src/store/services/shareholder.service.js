import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from "./refresh-token";

const getShareholders = async (email, pram = "") => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/shareholders${pram}?email=${email}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getShareholders(email, (pram = ""));
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getPaginatedShareholdersService = async (
  email,
  page_number,
  value,
  search_criteria,
  active
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${
      Config.baseUrl
    }/shareholders/paginate?page_size=10&email=${email}&page_number=${page_number}&value=${value}&search_criteria=${search_criteria}&active=${!active}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getPaginatedShareholdersService(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const shareHoldingBulkUpload = async (email, company_code, data) => {
  try {
    const url = `${Config.baseUrl}/shareholders/upload-physical`;

    const result = await axios.post(
      url,
      {
        email,
        company_code,
        data,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await shareHoldingBulkUpload(email, company_code, data);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getShareHoldersByCompany = async (email, company_code, param = "") => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/shareholders/by-company${param}?email=${email}&company_code=${company_code}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getShareHoldersByCompany(
          email,
          company_code,
          (param = "")
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getShareHolderHistoryByCompanyandDate = async (
  email,
  company_code,
  date
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/shareholdinghistory/get-by-companycode-date?email=${email}&company_code=${company_code}&date=${date}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getShareHolderHistoryByCompanyandDate(
          email,
          company_code,
          date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getShareHolderPatternByCompanyandDate = async (
  email,
  company_code,
  date
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/shareholdinghistory/holding-pattern?email=${email}&company_code=${company_code}&date=${date}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getShareHolderPatternByCompanyandDate(
          email,
          company_code,
          date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getShareHoldersByShareholderID = async (email, investor_key) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/shareholders/by-investor-id?email=${email}&investor_key=${investor_key}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getShareHoldersByShareholderID(email, investor_key);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getShareHolderByFolioNo = async (email, folio_no) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/shareholders/by-folioNo?email=${email}&folio_number=${folio_no}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getShareHolderByFolioNo(email, folio_no);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getShares = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/shares?email=${email}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getShares(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addShare = async (
  email,
  symbol,
  type,
  offer_volume,
  offer_price,
  final_offer_price,
  bb_percent,
  bb_from,
  bb_to,
  strike_price,
  bid_volume,
  ipo_percent,
  ipo_from,
  ipo_to,
  subscribed_volume
) => {
  try {
    const url = `${Config.baseUrl}/shares/`;

    const result = await axios.post(
      url,
      {
        email,
        symbol,
        type,
        offer_volume,
        offer_price,
        final_offer_price,
        bb_percent,
        bb_from,
        bb_to,
        strike_price,
        bid_volume,
        ipo_percent,
        ipo_from,
        ipo_to,
        subscribed_volume,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await addShare(
          email,
          symbol,
          type,
          offer_volume,
          offer_price,
          final_offer_price,
          bb_percent,
          bb_from,
          bb_to,
          strike_price,
          bid_volume,
          ipo_percent,
          ipo_from,
          ipo_to,
          subscribed_volume
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const updateShare = async (
  email,
  symbol,
  offer_id,
  type,
  offer_volume,
  offer_price,
  final_offer_price,
  bb_percent,
  bb_from,
  bb_to,
  strike_price,
  bid_volume,
  ipo_percent,
  ipo_from,
  ipo_to,
  subscribed_volume
) => {
  try {
    const url = `${Config.baseUrl}/shares/update`;
    const result = await axios.post(
      url,
      {
        email,
        symbol,
        offer_id,
        type,
        offer_volume,
        offer_price,
        final_offer_price,
        bb_percent,
        bb_from,
        bb_to,
        strike_price,
        bid_volume,
        ipo_percent,
        ipo_from,
        ipo_to,
        subscribed_volume,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await updateShare(
          email,
          symbol,
          offer_id,
          type,
          offer_volume,
          offer_price,
          final_offer_price,
          bb_percent,
          bb_from,
          bb_to,
          strike_price,
          bid_volume,
          ipo_percent,
          ipo_from,
          ipo_to,
          subscribed_volume
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addShareholder = async (
  email,
  folio_number,
  company_code,
  symbol,
  shareholder_id,
  shareholder_name,
  shareholder_percent,
  joint_holders,
  electronic_shares,
  physical_shares,
  blocked_shares,
  freeze_shares,
  pledged_shares,
  pending_in,
  pending_out,
  available_shares,
  cdc_account_no,
  cdc_participant_id,
  cdc_account_type,
  total_holding,
  shareholder_mobile,
  shareholder_email,
  shareholder_phone,
  resident_status,
  street_address,
  city,
  country,
  passport_no,
  passport_expiry,
  passport_country,
  nominee_name,
  nominee_cnic,
  nominee_relation,
  account_title,
  account_no,
  bank_name,
  baranch_address,
  baranch_city,
  filer,
  zakat_status,
  picture,
  signature_specimen,
  cnic_copy,
  nominee_cnic_copy,
  zakat_declaration,
  poc_detail,
  nationality,
  roshan_account,
  right_shares,
  // investors fields
  category,
  occupation,
  salutation,
  investor_name,
  cnic,
  ntn,
  birth_date,
  gender,
  religion,
  father_name,
  spouse_name,
  cnic_expiry
) => {
  try {
    const url = `${Config.baseUrl}/shareholders/`;
    const result = await axios.post(
      url,
      {
        email,
        folio_number,
        company_code,
        symbol,
        shareholder_id,
        shareholder_name,
        shareholder_percent,
        joint_holders,
        electronic_shares,
        physical_shares,
        blocked_shares,
        freeze_shares,
        pledged_shares,
        pending_in,
        pending_out,
        available_shares,
        cdc_account_no,
        cdc_participant_id,
        cdc_account_type,
        total_holding,
        shareholder_mobile,
        shareholder_email,
        shareholder_phone,
        resident_status,
        street_address,
        city,
        country,
        passport_no,
        passport_expiry,
        passport_country,
        nominee_name,
        nominee_cnic,
        nominee_relation,
        account_title,
        account_no,
        bank_name,
        baranch_address,
        baranch_city,
        filer,
        zakat_status,
        picture,
        signature_specimen,
        cnic_copy,
        nominee_cnic_copy,
        zakat_declaration,
        poc_detail,
        nationality,
        roshan_account,
        right_shares,
        // investors fields
        category,
        occupation,
        salutation,
        investor_name,
        cnic,
        ntn,
        birth_date,
        gender,
        religion,
        father_name,
        spouse_name,
        cnic_expiry,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await addShareholder(
          email,
          folio_number,
          company_code,
          symbol,
          shareholder_id,
          shareholder_name,
          shareholder_percent,
          joint_holders,
          electronic_shares,
          physical_shares,
          blocked_shares,
          freeze_shares,
          pledged_shares,
          pending_in,
          pending_out,
          available_shares,
          cdc_account_no,
          cdc_participant_id,
          cdc_account_type,
          total_holding,
          shareholder_mobile,
          shareholder_email,
          shareholder_phone,
          resident_status,
          street_address,
          city,
          country,
          passport_no,
          passport_expiry,
          passport_country,
          nominee_name,
          nominee_cnic,
          nominee_relation,
          account_title,
          account_no,
          bank_name,
          baranch_address,
          baranch_city,
          filer,
          zakat_status,
          picture,
          signature_specimen,
          cnic_copy,
          nominee_cnic_copy,
          zakat_declaration,
          poc_detail,
          nationality,
          roshan_account,
          right_shares,
          // investors fields
          category,
          occupation,
          salutation,
          investor_name,
          cnic,
          ntn,
          birth_date,
          gender,
          religion,
          father_name,
          spouse_name,
          cnic_expiry
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addUBO = async (
  email,
  folio_number,
  ubo_id,
  name,
  cnic,
  mobile,
  ntn,
  phone_no,
  no_of_shares,
  total_shares,
  percentage_shares,
  category
) => {
  try {
    const url = `${Config.baseUrl}/ubo`;
    const result = await axios.post(
      url,
      {
        email,
        folio_number,
        ubo_id,
        name,
        cnic,
        mobile,
        ntn,
        phone_no,
        no_of_shares,
        total_shares,
        percentage_shares,
        category,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await addUBO(
          email,
          folio_number,
          ubo_id,
          name,
          cnic,
          mobile,
          ntn,
          phone_no,
          no_of_shares,
          total_shares,
          percentage_shares,
          category
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const editUBO = async (
  email,
  folio_number,
  ubo_id,
  name,
  cnic,
  mobile,
  ntn,
  phone_no,
  no_of_shares,
  total_shares,
  percentage_shares,
  category
) => {
  try {
    const url = `${Config.baseUrl}/ubo/update`;
    const result = await axios.post(
      url,
      {
        email,
        folio_number,
        ubo_id,
        name,
        cnic,
        mobile,
        ntn,
        phone_no,
        no_of_shares,
        total_shares,
        percentage_shares,
        category,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await editUBO(
          email,
          folio_number,
          ubo_id,
          name,
          cnic,
          mobile,
          ntn,
          phone_no,
          no_of_shares,
          total_shares,
          percentage_shares,
          category
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getUBO = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/ubo?email=${email}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getUBO(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const updateShareholder = async (
  email,
  folio_number,
  company_code,
  symbol,
  shareholder_id,
  shareholder_name,
  shareholder_percent,
  joint_holders,
  electronic_shares,
  physical_shares,
  blocked_shares,
  freeze_shares,
  pledged_shares,
  pending_in,
  pending_out,
  available_shares,
  cdc_account_no,
  cdc_participant_id,
  cdc_account_type,
  total_holding,
  cdc_key,
  shareholder_mobile,
  shareholder_email,
  shareholder_phone,
  resident_status,
  street_address,
  city,
  country,
  passport_no,
  passport_expiry,
  passport_country,
  nominee_name,
  nominee_cnic,
  nominee_relation,
  account_title,
  account_no,
  bank_name,
  baranch_address,
  baranch_city,
  filer,
  zakat_status,
  picture,
  signature_specimen,
  cnic_copy,
  nominee_cnic_copy,
  zakat_declaration,
  poc_detail,
  nationality,
  roshan_account,
  right_shares,
  // investors fields
  category,
  occupation,
  salutation,
  investor_name,
  cnic,
  ntn,
  birth_date,
  gender,
  religion,
  father_name,
  spouse_name,
  cnic_expiry
) => {
  try {
    const url = `${Config.baseUrl}/shareholders/update`;

    const result = await axios.post(
      url,
      {
        email,
        folio_number,
        company_code,
        symbol,
        shareholder_id,
        shareholder_name,
        shareholder_percent,
        joint_holders,
        electronic_shares,
        physical_shares,
        blocked_shares,
        freeze_shares,
        pledged_shares,
        pending_in,
        pending_out,
        available_shares,
        cdc_account_no,
        cdc_participant_id,
        cdc_account_type,
        total_holding,
        cdc_key,
        shareholder_mobile,
        shareholder_email,
        shareholder_phone,
        resident_status,
        street_address,
        city,
        country,
        passport_no,
        passport_expiry,
        passport_country,
        nominee_name,
        nominee_cnic,
        nominee_relation,
        account_title,
        account_no,
        bank_name,
        baranch_address,
        baranch_city,
        filer,
        zakat_status,
        picture,
        signature_specimen,
        cnic_copy,
        nominee_cnic_copy,
        zakat_declaration,
        poc_detail,
        nationality,
        roshan_account,
        right_shares,
        // investors fields
        category,
        occupation,
        salutation,
        investor_name,
        cnic,
        ntn,
        birth_date,
        gender,
        religion,
        father_name,
        spouse_name,
        cnic_expiry,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await updateShareholder(
          email,
          folio_number,
          company_code,
          symbol,
          shareholder_id,
          shareholder_name,
          shareholder_percent,
          joint_holders,
          electronic_shares,
          physical_shares,
          blocked_shares,
          freeze_shares,
          pledged_shares,
          pending_in,
          pending_out,
          available_shares,
          cdc_account_no,
          cdc_participant_id,
          cdc_account_type,
          total_holding,
          cdc_key,
          shareholder_mobile,
          shareholder_email,
          shareholder_phone,
          resident_status,
          street_address,
          city,
          country,
          passport_no,
          passport_expiry,
          passport_country,
          nominee_name,
          nominee_cnic,
          nominee_relation,
          account_title,
          account_no,
          bank_name,
          baranch_address,
          baranch_city,
          filer,
          zakat_status,
          picture,
          signature_specimen,
          cnic_copy,
          nominee_cnic_copy,
          zakat_declaration,
          poc_detail,
          nationality,
          roshan_account,
          right_shares,
          // investors fields
          category,
          occupation,
          salutation,
          investor_name,
          cnic,
          ntn,
          birth_date,
          gender,
          religion,
          father_name,
          spouse_name,
          cnic_expiry
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const uploadCDCfile = async (
  email,
  company_symbol,
  company_code,
  header,
  data,
  footer
) => {
  try {
    const url = `${Config.baseUrl}/shareholders/upload-cdc`;

    const result = await axios.post(
      url,
      { email, company_symbol, company_code, header, data, footer },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await uploadCDCfile(
          email,
          company_symbol,
          company_code,
          header,
          data,
          footer
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCDCDate = async (email, company_code) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/shareholdinghistory/cdc-dates?email=${email}&company_code=${company_code}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getCDCDate(email, company_code);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getShareholdersCount = async (email, pram = "") => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/dashboard/shareholders-counter?email=${email}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getShareholders(email, (pram = ""));
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getShareHolderTransactionsbyDate = async (
  email,
  company_code,
  from_date,
  to_date,
  folio_number
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactions/for-folio-in-date-range?email=${email}&company_code=${company_code}&from_date=${from_date}&to_date=${to_date}&folio_number=${folio_number}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getShareHolderHistoryByCompanyandDate(
          email,
          company_code,
          from_date,
          to_date,
          folio_number
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

export {
  shareHoldingBulkUpload,
  getShareholders,
  addShareholder,
  addUBO,
  editUBO,
  getUBO,
  getShares,
  addShare,
  updateShare,
  updateShareholder,
  uploadCDCfile,
  getShareHoldersByCompany,
  getShareHolderByFolioNo,
  getShareHoldersByShareholderID,
  getShareHolderHistoryByCompanyandDate,
  getShareHolderPatternByCompanyandDate,
  getCDCDate,
  getShareholdersCount,
  getPaginatedShareholdersService,
  getShareHolderTransactionsbyDate
};
