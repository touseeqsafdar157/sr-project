import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from "./refresh-token";

const getCorporateAnnouncement = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateannouncements?email=${email}`;
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
        return await getCorporateAnnouncement(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getPaginatedCorporateAnnouncementService = async (
  email,
  page_number,
  value,
  search_criteria
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateannouncements/paginate?page_size=10&email=${email}&page_number=${page_number}&value=${value}&search_criteria=${search_criteria}`;
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
        return await getCorporateAnnouncement(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCorporateAnnouncementByCompanyCode = async (email, company_code) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateannouncements/by-company?email=${email}&company_code=${company_code}`;
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
        return await getCorporateAnnouncementByCompanyCode(email, company_code);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCorporateAnnouncementById = async (email, id) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateannouncements/by-id?email=${email}&announcement_id=${id}`;
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
        return await getCorporateAnnouncementById(email, id);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCorporateEntitlementById = async (email, id) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateentitlements/by-id?email=${email}&entitlement_id=${id}`;
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
        return await getCorporateEntitlementById(email, id);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCorporateEntitlementByCompanyCodeService = async (email, company_code) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateentitlements/by-company?email=${email}&company_code=${company_code}`;
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
        return await getCorporateEntitlementById(email, company_code);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const sendBulkEntitlements = async (email, announcement_id, entitlements) => {
  try {
    const url = `${Config.baseUrl}/corporateentitlements/bulk`;

    const result = await axios.post(
      url,
      { email, announcement_id, entitlements },
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
        return await sendBulkEntitlements(email, announcement_id, entitlements);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const addCorporateAnnouncement = async (
  email,
  company_code,
  symbol,
  announcement_date,
  dividend_number,
  dividend_percent,
  bonus_number,
  bonus_percent,
  right_number,
  right_percent,
  period,
  period_ended,
  book_closure_from,
  book_closure_to,
  right_subs_from,
  right_subs_to,
  provisional_from,
  provisional_to,
  right_credit_from,
  right_credit_to,
  right_rate,
  right_allotment_date,
  bonus_allotment_date
) => {
  try {
    const url = `${Config.baseUrl}/corporateannouncements/`;

    const result = await axios.post(
      url,
      {
        email,
        company_code,
        symbol,
        announcement_date,
        dividend_number,
        dividend_percent,
        bonus_number,
        bonus_percent,
        right_number,
        right_percent,
        period,
        period_ended,
        book_closure_from,
        book_closure_to,
        right_subs_from,
        right_subs_to,
        provisional_from,
        provisional_to,
        right_credit_from,
        right_credit_to,
        right_rate,
        right_allotment_date,

        bonus_allotment_date,
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
        return await addCorporateAnnouncement(
          email,
          company_code,
          symbol,
          announcement_date,
          dividend_number,
          dividend_percent,
          bonus_number,
          bonus_percent,
          right_number,
          right_percent,
          period,
          period_ended,
          book_closure_from,
          book_closure_to,
          right_subs_from,
          right_subs_to,
          provisional_from,
          provisional_to,
          right_credit_from,
          right_credit_to,
          right_rate,
          right_allotment_date,
          bonus_allotment_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const updateCorporateAnnouncement = async (
  email,
  announcement_id,
  company_code,
  symbol,
  announcement_date,
  dividend_number,
  dividend_percent,
  bonus_number,
  bonus_percent,
  right_number,
  right_percent,
  period,
  period_ended,
  book_closure_from,
  book_closure_to,
  right_subs_from,
  right_subs_to,
  provisional_from,
  provisional_to,
  right_credit_from,
  right_credit_to,
  right_rate,
  right_allotment_date,
  bonus_allotment_date
) => {
  try {
    const url = `${Config.baseUrl}/corporateannouncements/update`;

    const result = await axios.post(
      url,
      {
        email,
        announcement_id,
        company_code,
        symbol,
        announcement_date,
        dividend_number,
        dividend_percent,
        bonus_number,
        bonus_percent,
        right_number,
        right_percent,
        period,
        period_ended,
        book_closure_from,
        book_closure_to,
        right_subs_from,
        right_subs_to,
        provisional_from,
        provisional_to,
        right_credit_from,
        right_credit_to,
        right_rate,
        right_allotment_date,
        bonus_allotment_date,
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
        return await updateCorporateAnnouncement(
          email,
          announcement_id,
          company_code,
          symbol,
          announcement_date,
          dividend_number,
          dividend_percent,
          bonus_number,
          bonus_percent,
          right_number,
          right_percent,
          period,
          period_ended,
          book_closure_from,
          book_closure_to,
          right_subs_from,
          right_subs_to,
          provisional_from,
          provisional_to,
          right_credit_from,
          right_credit_to,
          right_rate,
          right_allotment_date,
          bonus_allotment_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCorporateEntitlement = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateentitlements?email=${email}`;
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
        return await getCorporateEntitlement(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getCorporateEntitlementByAnnouncement = async (
  email,
  announcement_id
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateentitlements/by-annoucement?email=${email}&announcement_id=${announcement_id}`;
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
        return await getCorporateEntitlementByAnnouncement(
          email,
          announcement_id
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addCorporateEntitlement = async (
  email,
  announcement_id,
  folio_number,
  dividend_amount,
  bonus_shares,
  right_shares,
  dividend_credited,
  dividend_credit_date,
  bonus_credited,
  right_subscribed,
  right_subs_date,
  account_title,
  account_no,
  bank_code,
  branch,
  amount,
  gateway_code
) => {
  try {
    const url = `${Config.baseUrl}/corporateentitlements/`;

    const result = await axios.post(
      url,
      {
        email,

        announcement_id,
        folio_number,
        dividend_amount,
        bonus_shares,
        right_shares,
        dividend_credited,
        dividend_credit_date,
        bonus_credited,
        right_subscribed,
        right_subs_date,
        account_title,
        account_no,
        bank_code,
        branch,
        amount,
        gateway_code,
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
        return await addCorporateEntitlement(
          email,
          announcement_id,
          folio_number,
          dividend_amount,
          bonus_shares,
          right_shares,
          dividend_credited,
          dividend_credit_date,
          bonus_credited,
          right_subscribed,
          right_subs_date,
          account_title,
          account_no,
          bank_code,
          branch,
          amount,
          gateway_code
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const updateCorporateEntitlement = async (
  email,
  entitlement_id,
  announcement_id,
  folio_number,
  dividend_amount,
  bonus_shares,
  right_shares,
  dividend_credited,
  dividend_credit_date,
  bonus_credited,
  right_subscribed,
  right_subs_date,
  account_title,
  account_no,
  bank_code,
  branch,
  amount,
  gateway_code
) => {
  try {
    const url = `${Config.baseUrl}/corporateentitlements/update`;

    const result = await axios.post(
      url,
      {
        email,
        entitlement_id,
        announcement_id,
        folio_number,
        dividend_amount,
        bonus_shares,
        right_shares,
        dividend_credited,
        dividend_credit_date,
        bonus_credited,
        right_subscribed,
        right_subs_date,
        account_title,
        account_no,
        bank_code,
        branch,
        amount,
        gateway_code,
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
        return await updateCorporateEntitlement(
          email,
          entitlement_id,
          announcement_id,
          folio_number,
          dividend_amount,
          bonus_shares,
          right_shares,
          dividend_credited,
          dividend_credit_date,
          bonus_credited,
          right_subscribed,
          right_subs_date,
          account_title,
          account_no,
          bank_code,
          branch,
          amount,
          gateway_code
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const uploadEntitlement = async (
  email,
  announcement_id,
  company_code,
  as_per_date,
  data
) => {
  try {
    const url = `${Config.baseUrl}/corporateentitlements/cdc-entitlements-upload`;

    const result = await axios.post(
      url,
      {
        email,
        announcement_id,
        company_code,
        as_per_date,
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
        return await uploadEntitlement(
          email,
          announcement_id,
          company_code,
          as_per_date,
          data
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const sendIntimationLetter = async (email, announcement_id, company_code) => {
  try {
    const url = `${Config.baseUrl}/shareholders/send-intimation-letter`;

    const result = await axios.post(
      url,
      {
        email,
        announcement_id,
        company_code,
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
        return await sendIntimationLetter(email, announcement_id, company_code);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const bankDepositUpload = async (
  email,
  announcement_id,
  company_code,
  bank_deposit_date,
  data
) => {
  try {
    const url = `${Config.baseUrl}/bankdeposit/`;

    const result = await axios.post(
      url,
      {
        email,
        announcement_id,
        company_code,
        bank_deposit_date,
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
        return await bankDepositUpload(
          email,
          announcement_id,
          company_code,
          bank_deposit_date,
          data
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const bulkRightCredit = async (email, announcement_id, company_code) => {
  try {
    const url = `${Config.baseUrl}/transactions/credit-rights-bulk`;

    const result = await axios.post(
      url,
      {
        email,
        announcement_id,
        company_code,
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
        return await bulkRightCredit(email, announcement_id, company_code);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCorporateAnnouncementDashboard = async (email) => {
  try {
    //to get only 5 dividend announcements
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/dashboard/dashboard-announcements?email=${email}`;
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
        return await getCorporateAnnouncement(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCorporateActions = async (email, company_code) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  // const company_code = sessionStorage.getItem("company_code") || "";
  const url = `${Config.baseUrl}/dashboard/issuer-actions?email=${email}&company_code=${company_code}`;
  const result = await axios.get(url, {
    headers: {
      Authorization: token,
    },
  });
  return result;
}catch(err) {
  if(err.response.data.status == 401) { 
    let responseToHandle = err.response.data
    let result = await RefreshTokenHandler.handleIt(responseToHandle)
    if(result.status) {
     return await getCorporateActions(email, company_code)
    }else {
      throw err;
    }
  }else {
        throw err
  }
}
};

export {
  getCorporateAnnouncementById,
  getCorporateAnnouncement,
  addCorporateAnnouncement,
  getCorporateEntitlement,
  addCorporateEntitlement,
  updateCorporateAnnouncement,
  updateCorporateEntitlement,
  sendBulkEntitlements,
  getCorporateAnnouncementByCompanyCode,
  getCorporateEntitlementByAnnouncement,
  getCorporateEntitlementById,
  uploadEntitlement,
  bankDepositUpload,
  bulkRightCredit,
  sendIntimationLetter,
  getCorporateAnnouncementDashboard,
  getPaginatedCorporateAnnouncementService,
  getCorporateEntitlementByCompanyCodeService,
  getCorporateActions
};
