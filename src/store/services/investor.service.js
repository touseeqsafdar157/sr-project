import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from "./refresh-token";

const getInvestors = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/investors?email=${email}`;
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
        return await getInvestors(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getPaginatedInvestorsService = async (
  email,
  page_number,
  value,
  search_criteria
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/investors/paginate?page_size=10&email=${email}&page_number=${page_number}&value=${value}&search_criteria=${search_criteria}`;
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
        return await getPaginatedInvestorsService(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addInvestor = async (
  email,
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
    const url = `${Config.baseUrl}/investors/`;

    const result = await axios.post(
      url,
      {
        email,
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
        return await addInvestor(
          email,
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

const updateInvestor = async (
  email,
  investor_id,
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
    const url = `${Config.baseUrl}/investors/update`;

    const result = await axios.post(
      url,
      {
        email,
        investor_id,
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
        return await updateInvestor(
          email,
          investor_id,
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

const getInvestorRequest = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/investorrequests?email=${email}`;
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
        return await getInvestorRequest(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getInvestorRequestByCompanyCodeService = async (email, company_code) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/investorrequests/by-company?email=${email}&company_code=${company_code}`;
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
        return await getInvestorRequest(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};


const getInvestorRequestByCompanyCodePaginatedService = async (email, company_code, page_number, value, search_criteria, type) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/investorrequests/paginate-by-company?email=${email}&company_code=${company_code}&search_criteria=${search_criteria}&value=${value}&type=${type}&page_number=${page_number}`;
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
        return await getInvestorRequest(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};


const getInvestorRequestByCompanyCodeAndTypeService = async (
  email,
  company_code,
  type,
  approved = "",
  fromDate = "",
  toDate = ""
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/investorrequests/by-company-and-type?email=${email}&company_code=${company_code}&type=${type}&approved=${approved}&fromDate=${fromDate}&toDate=${toDate}`;
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
        return await getInvestorRequest(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getInvestorRequestByTypeService = async (
  email,
  type,
  approved = "",
  fromDate = "",
  toDate = ""
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/investorrequests/by-type?email=${email}&type=${type}&approved=${approved}&fromDate=${fromDate}&toDate=${toDate}`;
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
        return await getInvestorRequest(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getInvestorRequestService = async (
  email,
  page_number,
  value,
  search_criteria
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/investorrequests/paginate?page_size=10&email=${email}&page_number=${page_number}&value=${value}&search_criteria=${search_criteria}`;
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
        return await getInvestorRequest(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addInvestorRequest = async (
  email,
  // request_id,
  request_date,
  folio_number,
  request_type,
  announcement_id,
  entitlement_id,
  symbol,
  company_code,
  quantity,
  price,
  amount,
  amount_payable,
  amount_paid,
  to_folio_number,
  to_investor_id,
  input_certificates,
  output_certificate
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        // request_id,
        request_date,
        folio_number,
        request_type,
        announcement_id,
        entitlement_id,
        symbol,
        company_code,
        quantity,
        price,
        amount,
        amount_payable,
        amount_paid,
        to_folio_number,
        to_investor_id,
        input_certificates,
        output_certificate,
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
        return await addInvestorRequest(
          email,
          request_date,
          folio_number,
          request_type,
          announcement_id,
          entitlement_id,
          symbol,
          company_code,
          quantity,
          price,
          amount,
          amount_payable,
          amount_paid,
          to_folio_number,
          to_investor_id,
          input_certificates
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const updateInvestorRequest = async (
  email,
  request_id,
  request_date,
  folio_number,
  request_type,
  announcement_id,
  entitlement_id,
  symbol,
  company_code,
  quantity,
  price,
  amount,
  amount_payable,
  amount_paid,
  to_folio_number,
  to_investor_id
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/update`;

    const result = await axios.post(
      url,
      {
        email,
        request_id,
        request_date,
        folio_number,
        request_type,
        announcement_id,
        entitlement_id,
        symbol,
        company_code,
        quantity,
        price,
        amount,
        amount_payable,
        amount_paid,
        to_folio_number,
        to_investor_id,
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
        return await updateInvestorRequest(
          email,
          request_id,
          request_date,
          folio_number,
          request_type,
          announcement_id,
          entitlement_id,
          symbol,
          company_code,
          quantity,
          price,
          amount,
          amount_payable,
          amount_paid,
          to_folio_number,
          to_investor_id
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

// ADD INVESTOR REQUEST
const addInvestorRequestDUP = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  amount,
  input_certificates,
  output_certificates,
  remarks,
  request_date,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        amount,
        input_certificates,
        output_certificates,
        remarks,
        request_date,
        txn_execution_date,
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
        return await addInvestorRequestDUP(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          amount,
          input_certificates,
          output_certificates,
          remarks,
          request_date,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const addInvestorRequestTOS = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  to_folio_number,
  quantity,
  request_date,
  input_certificates,
  remarks,
  transfer_no,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        to_folio_number,
        quantity,
        request_date,
        input_certificates,
        remarks,
        transfer_no,
        txn_execution_date,
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
        return await addInvestorRequestTOS(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          to_folio_number,
          quantity,
          request_date,
          input_certificates,
          remarks,
          transfer_no,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addInvestorRequestVTD = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  quantity,
  request_date,
  attachments,
  input_certificates,
  remarks,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        quantity,
        request_date,
        attachments,
        input_certificates,
        remarks,
        txn_execution_date,
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
        return await addInvestorRequestVTD(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          quantity,
          request_date,
          attachments,
          input_certificates,
          remarks,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const addInvestorRequestTOR = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  to_folio_number,
  quantity,
  remarks,
  request_date,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        to_folio_number,
        quantity,
        input_certificates: [],
        output_certificates: [],
        remarks,
        request_date,
        txn_execution_date,
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
        return await addInvestorRequestTOR(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          to_folio_number,
          quantity,
          remarks,
          request_date,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addInvestorRequestSPL = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  quantity,
  amount,
  input_certificates,
  output_certificates,
  remarks,
  request_date,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        quantity,
        amount,
        input_certificates,
        output_certificates,
        remarks,
        request_date,
        txn_execution_date,
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
        return await addInvestorRequestSPL(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          quantity,
          amount,
          input_certificates,
          output_certificates,
          remarks,
          request_date,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addInvestorRequestTRS = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  quantity,
  amount,
  input_certificates,
  output_certificates,
  remarks,
  transfer_no,
  request_date,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        quantity,
        amount,
        input_certificates,
        output_certificates,
        remarks,
        transfer_no,
        request_date,
        txn_execution_date,
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
        return await addInvestorRequestTRS(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          quantity,
          amount,
          input_certificates,
          output_certificates,
          remarks,
          transfer_no,
          request_date,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addInvestorRequestCON = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  input_certificates,
  output_certificates,
  remarks,
  request_date,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        input_certificates,
        output_certificates,
        remarks,
        request_date,
        txn_execution_date,
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
        return await addInvestorRequestCON(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          input_certificates,
          output_certificates,
          remarks,
          request_date,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const addInvestorRequestRSUB = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  entitlement_id,
  announcement_id,
  amount,
  price,
  quantity,
  deposited_date,
  output_certificates,
  remarks,
  request_date,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        entitlement_id,
        announcement_id,
        amount,
        price,
        quantity,
        deposited_date,
        output_certificates,
        remarks,
        request_date,
        txn_execution_date,
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
        return await addInvestorRequestRSUB(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          entitlement_id,
          announcement_id,
          amount,
          price,
          quantity,
          deposited_date,
          output_certificates,
          remarks,
          request_date,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addInvestorRequestCEL = async (
  email,
  request_type,
  folio_number,
  to_folio_number,
  company_code,
  symbol,
  quantity,
  input_certificates,
  remarks,
  reference,
  transfer_no,
  request_date,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        to_folio_number,
        company_code,
        symbol,
        quantity,
        input_certificates,
        remarks,
        reference,
        transfer_no,
        request_date,
        txn_execution_date,
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
        return await addInvestorRequestCEL(
          email,
          request_type,
          folio_number,
          to_folio_number,
          company_code,
          symbol,
          quantity,
          input_certificates,
          remarks,
          reference,
          transfer_no,
          request_date,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const addInvestorRequestCPH = async (
  email,
  request_type,
  folio_number,
  to_folio_number,
  company_code,
  symbol,
  quantity,
  output_certificates,
  remarks,
  reference,
  transfer_no,
  input_certificates,
  request_date,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        to_folio_number,
        company_code,
        symbol,
        quantity,
        output_certificates,
        remarks,
        reference,
        transfer_no,
        input_certificates,
        request_date,
        txn_execution_date,
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
        return await addInvestorRequestCPH(
          email,
          request_type,
          folio_number,
          to_folio_number,
          company_code,
          symbol,
          quantity,
          output_certificates,
          remarks,
          reference,
          transfer_no,
          input_certificates,
          request_date,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

// Edit INVESTOR REQUEST
const editInvestorRequestDUP = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  amount,
  input_certificates,
  output_certificates,
  remarks,
  request_id
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/generate-txn/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        amount,
        input_certificates,
        output_certificates,
        remarks,
        request_id,
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
        return await editInvestorRequestDUP(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          amount,
          input_certificates,
          output_certificates,
          remarks,
          request_id
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const editInvestorRequestTOS = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  to_folio_number,
  quantity,
  request_date,
  input_certificates,
  remarks,
  transfer_no,
  request_id,
  txn_execution_date
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/generate-txn/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        to_folio_number,
        quantity,
        request_date,
        input_certificates,
        remarks,
        transfer_no,
        request_id,
        txn_execution_date,
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
        return await editInvestorRequestTOS(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          to_folio_number,
          quantity,
          request_date,
          input_certificates,
          remarks,
          transfer_no,
          request_id,
          txn_execution_date
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const editInvestorRequestVTD = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  quantity,
  request_date,
  attachments,
  input_certificates,
  remarks,
  request_id
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/generate-txn/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        quantity,
        request_date,
        attachments,
        input_certificates,
        remarks,
        request_id,
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
        return await editInvestorRequestVTD(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          quantity,
          request_date,
          attachments,
          input_certificates,
          remarks,
          request_id
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const editInvestorRequestTOR = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  to_folio_number,
  quantity,
  remarks,
  request_id
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/generate-txn/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        to_folio_number,
        quantity,
        input_certificates: [],
        output_certificates: [],
        remarks,
        request_id,
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
        return await editInvestorRequestTOR(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          to_folio_number,
          quantity,
          remarks,
          request_id
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const editInvestorRequestSPL = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  quantity,
  amount,
  input_certificates,
  output_certificates,
  remarks,
  request_id
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/generate-txn/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        quantity,
        amount,
        input_certificates,
        output_certificates,
        remarks,
        request_id,
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
        return await editInvestorRequestSPL(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          quantity,
          amount,
          input_certificates,
          output_certificates,
          remarks,
          request_id
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const editInvestorRequestTRS = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  quantity,
  amount,
  input_certificates,
  output_certificates,
  remarks,
  transfer_no,
  request_id
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/generate-txn/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        quantity,
        amount,
        input_certificates,
        output_certificates,
        remarks,
        transfer_no,
        request_id,
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
        return await editInvestorRequestTRS(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          quantity,
          amount,
          input_certificates,
          output_certificates,
          remarks,
          transfer_no,
          request_id
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const editInvestorRequestCON = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  input_certificates,
  output_certificates,
  remarks,
  request_id
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/generate-txn/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        input_certificates,
        output_certificates,
        remarks,
        request_id,
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
        return await editInvestorRequestCON(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          input_certificates,
          output_certificates,
          remarks,
          request_id
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const editInvestorRequestRSUB = async (
  email,
  request_type,
  folio_number,
  company_code,
  symbol,
  entitlement_id,
  announcement_id,
  amount,
  price,
  quantity,
  deposited_date,
  output_certificates,
  remarks,
  request_id
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/generate-txn/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        company_code,
        symbol,
        entitlement_id,
        announcement_id,
        amount,
        price,
        quantity,
        deposited_date,
        output_certificates,
        remarks,
        request_id,
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
        return await editInvestorRequestRSUB(
          email,
          request_type,
          folio_number,
          company_code,
          symbol,
          entitlement_id,
          announcement_id,
          amount,
          price,
          quantity,
          deposited_date,
          output_certificates,
          remarks,
          request_id
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const editInvestorRequestCEL = async (
  email,
  request_type,
  folio_number,
  to_folio_number,
  company_code,
  symbol,
  quantity,
  input_certificates,
  remarks,
  reference,
  transfer_no,
  request_id
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/generate-txn/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        to_folio_number,
        company_code,
        symbol,
        quantity,
        input_certificates,
        remarks,
        reference,
        transfer_no,
        request_id,
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
        return await editInvestorRequestCEL(
          email,
          request_type,
          folio_number,
          to_folio_number,
          company_code,
          symbol,
          quantity,
          input_certificates,
          remarks,
          reference,
          transfer_no,
          request_id
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const editInvestorRequestCPH = async (
  email,
  request_type,
  folio_number,
  to_folio_number,
  company_code,
  symbol,
  quantity,
  input_certificates,
  output_certificates,
  remarks,
  reference,
  transfer_no,
  request_id,
  amount
) => {
  try {
    const url = `${Config.baseUrl}/investorrequests/generate-txn/`;

    const result = await axios.post(
      url,
      {
        email,
        request_type,
        folio_number,
        to_folio_number,
        company_code,
        symbol,
        quantity,
        input_certificates,
        output_certificates,
        remarks,
        reference,
        transfer_no,
        request_id,
        amount,
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
        return await editInvestorRequestCPH(
          email,
          request_type,
          folio_number,
          to_folio_number,
          company_code,
          symbol,
          quantity,
          input_certificates,
          output_certificates,
          remarks,
          reference,
          transfer_no,
          request_id,
          amount
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getInvestorsCount = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/dashboard/investors-counter?email=${email}`;
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
        return await getInvestors(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

export {
  getInvestors,
  addInvestor,
  addInvestorRequest,
  getInvestorRequest,
  updateInvestor,
  updateInvestorRequest,
  addInvestorRequestTOS,
  addInvestorRequestSPL,
  addInvestorRequestCEL,
  addInvestorRequestCPH,
  addInvestorRequestDUP,
  addInvestorRequestRSUB,
  addInvestorRequestCON,
  addInvestorRequestTOR,
  addInvestorRequestVTD,
  addInvestorRequestTRS,
  // EDIT
  editInvestorRequestTOS,
  editInvestorRequestSPL,
  editInvestorRequestCEL,
  editInvestorRequestCPH,
  editInvestorRequestDUP,
  editInvestorRequestRSUB,
  editInvestorRequestCON,
  editInvestorRequestTOR,
  editInvestorRequestVTD,
  editInvestorRequestTRS,
  getInvestorsCount,
  getPaginatedInvestorsService,
  getInvestorRequestService,
  getInvestorRequestByCompanyCodeService,
  getInvestorRequestByCompanyCodeAndTypeService,
  getInvestorRequestByTypeService,
  getInvestorRequestByCompanyCodePaginatedService
};
