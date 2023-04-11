import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from "./refresh-token";

const getTransactionTypes = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactiontypes/config?email=${email}`;
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
        return await getTransactionTypes(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const updateTransactionStatus = async (
  email,
  txn_id,
  processing_status,
  check_list
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactions/update-status?email=${email}`;
    const result = await axios.post(
      url,
      {
        email,
        txn_id,
        processing_status,
        check_list,
      },
      {
        headers: { Authorization: token },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await updateTransactionStatus(
          email,
          txn_id,
          processing_status,
          check_list
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getTransactionRequestByStatus = async (email, status) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactions/by-status?email=${email}&processing_status=${status}`;
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
        return await getTransactionRequestByStatus(email, status);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getTransactionRequestByType = async (
  email,
  type,
  approved = "",
  fromDate = "",
  toDate = ""
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactions/by-type?email=${email}&txn_type=${type}&approved=${approved}&fromDate=${fromDate}&toDate=${toDate}`;
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
        return await getTransactionRequestByType(email, type);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getTransactionsByCompanyCodeAndTypeService = async (
  email,
  company_code,
  type,
  approved = "",
  fromDate = "",
  toDate = ""
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactions/by-company-and-type?email=${email}&company_code=${company_code}&txn_type=${type}&approved=${approved}&fromDate=${fromDate}&toDate=${toDate}`;
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
        return await getTransactionRequestByType(email, type);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addNewTransactionType = async (
  email,
  txn_type,
  transaction_type,
  active
) => {
  try {
    const url = `${Config.baseUrl}/transactiontypes/`;
    const result = await axios.post(
      url,
      {
        email,
        txn_type,
        transaction_type,
        active,
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
        return await addNewTransactionType(
          email,
          txn_type,
          transaction_type,
          active
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const updateNewTransactionType = async (
  email,
  txn_type_id,
  txn_type,
  transaction_type,
  active
) => {
  try {
    const url = `${Config.baseUrl}/transactiontypes/update`;

    const result = await axios.post(
      url,
      {
        email,
        txn_type_id,
        txn_type,
        transaction_type,
        active,
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
        return await updateNewTransactionType(
          email,
          txn_type_id,
          txn_type,
          transaction_type,
          active
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getTransactions = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactions?email=${email}`;
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
        return await getTransactions(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getTransactionsListing = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactions/get-all?email=${email}`;
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
        return await getTransactionsListing(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getPaginatedTransactions = async (email, company_code, page_number, value, search_criteria) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactions/paginate?email=${email}&company_code=${company_code}&page_number=${page_number}&value=${value}&search_criteria=${search_criteria}`;
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
        return await getTransactionsListing(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getPaginatedInProcessTransactions = async (email, company_code, page_number, value, search_criteria) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactions/inprocess-paginate?email=${email}&company_code=${company_code}&page_number=${page_number}&value=${value}&search_criteria=${search_criteria}`;
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
        return await getTransactionsListing(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getTransactionsByAnnouncementIdService = async (email, announcement_id) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/transactions/by-announcement-id?email=${email}&announcement_id=${announcement_id}`;
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
        return await getTransactionsByAnnouncementIdService(email, announcement_id);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addNewTransaction = async (
  email,
  request_id,
  announcement_id,
  entitlement_id,
  folio_number,
  txn_type,
  symbol,
  quantity,
  from_folio,
  to_folio,
  txn_date,
  settlement_date,
  company_code,
  price,
  amount,
  reference
) => {
  try {
    const url = `${Config.baseUrl}/transactions/`;

    const result = await axios.post(
      url,
      {
        email,
        request_id,
        announcement_id,
        entitlement_id,
        folio_number,
        txn_type,
        symbol,
        quantity,
        from_folio,
        to_folio,
        txn_date,
        settlement_date,
        company_code,
        price,
        amount,
        reference,
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
        return await addNewTransaction(
          email,
          request_id,
          announcement_id,
          entitlement_id,
          folio_number,
          txn_type,
          symbol,
          quantity,
          from_folio,
          to_folio,
          txn_date,
          settlement_date,
          company_code,
          price,
          amount,
          reference
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const updateNewTransaction = async (
  email,
  txn_id,
  request_id,
  announcement_id,
  entitlement_id,
  folio_number,
  txn_type,
  symbol,
  quantity,
  from_folio,
  to_folio,
  txn_date,
  settlement_date,
  company_code,
  price,
  amount,
  reference
) => {
  try {
    const url = `${Config.baseUrl}/transactions/update`;

    const result = await axios.post(
      url,
      {
        email,
        txn_id,
        request_id,
        announcement_id,
        entitlement_id,
        folio_number,
        txn_type,
        symbol,
        quantity,
        from_folio,
        to_folio,
        txn_date,
        settlement_date,
        company_code,
        price,
        amount,
        reference,
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
        return await updateNewTransaction(
          email,
          txn_id,
          request_id,
          announcement_id,
          entitlement_id,
          folio_number,
          txn_type,
          symbol,
          quantity,
          from_folio,
          to_folio,
          txn_date,
          settlement_date,
          company_code,
          price,
          amount,
          reference
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getBonusEntitlementsByTransactionId = async (email, txn_id) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateentitlements/bonus-txn-id?email=a${email}&bonus_txn_id=${txn_id}`;
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
        return await getBonusEntitlementsByTransactionId(email, txn_id);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getRightEntitlementsByTransactionId = async (email, txn_id) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateentitlements/right-txn-id?email=a${email}&right_txn_id=${txn_id}`;
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
        return await getRightEntitlementsByTransactionId(email, txn_id);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getDividendEntitlementsByTransactionId = async (email, txn_id) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/corporateentitlements/dividend-txn-id?email=a${email}&dividend_txn_id=${txn_id}`;
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
        return await getDividendEntitlementsByTransactionId(email, txn_id);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getTransactionsCounter = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/dashboard/transactions-counter?email=${email}`;
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
        return await getTransactions(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getTransactionsAllRequests = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const company_code = sessionStorage.getItem("company_code");
  const url = `${Config.baseUrl}/dashboard/issuer-txns?email=${email}&company_code=${company_code}`;
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
       return await getTransactionsAllRequests(email)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

export {
  getTransactionTypes,
  addNewTransactionType,
  getTransactions,
  addNewTransaction,
  updateNewTransactionType,
  updateNewTransaction,
  getTransactionRequestByStatus,
  updateTransactionStatus,
  getTransactionsListing,
  getTransactionRequestByType,
  getBonusEntitlementsByTransactionId,
  getRightEntitlementsByTransactionId,
  getDividendEntitlementsByTransactionId,
  getTransactionsCounter,
  getTransactionsByCompanyCodeAndTypeService,
  getPaginatedTransactions,
  getPaginatedInProcessTransactions,
  getTransactionsByAnnouncementIdService,
  getTransactionsAllRequests
};
