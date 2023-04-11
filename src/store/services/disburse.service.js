import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

const getDisburse = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/dividenddisbursements?email=${email}`;
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
       return await getDisburse(email)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const getPaginatedDisbursementsByCompanyCode = async (email, company_code, page_number, value, search_criteria) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/dividenddisbursements/paginate?email=${email}&company_code=${company_code}&page_number=${page_number}&value=${value}&search_criteria=${search_criteria}`;
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
       return await getDisburse(email)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const addDisburse = async (
  email,
  disburse_date,
  folio_no,
  amount_disbursed,
  status
) => {
  try{
  const url = `${Config.baseUrl}/dividenddisbursements/`;

  const result = await axios.post(
    url,
    {
      email,
      // disburse_id,
      disburse_date,
      folio_no,
      amount_disbursed,
      status,
    },
    {
      headers: {
        Authorization: sessionStorage.getItem("token") || "",
      },
    }
  );

  return result;
  }catch(err) {
    if(err.response.data.status == 401) { 
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if(result.status) {
       return await addDisburse(
        email,
        disburse_date,
        folio_no,
        amount_disbursed,
        status
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const updateDisburse = async (
  email,
  disburse_id,
  disburse_date,
  folio_no,
  amount_disbursed,
  status
) => {
  try{
  const url = `${Config.baseUrl}/dividenddisbursements/update`;

  const result = await axios.post(
    url,
    {
      email,
      disburse_id,
      disburse_date,
      folio_no,
      amount_disbursed,
      status,
    },
    {
      headers: {
        Authorization: sessionStorage.getItem("token") || "",
      },
    }
  );
  return result;
  }catch(err) {
    if(err.response.data.status == 401) { 
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if(result.status) {
       return await updateDisburse(
        email,
        disburse_id,
        disburse_date,
        folio_no,
        amount_disbursed,
        status
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const getDisburseCount = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/dashboard/dividenddisbursement-counter?email=${email}`;
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
       return await getDisburse(email)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

export { getDisburse, addDisburse, updateDisburse, getDisburseCount, getPaginatedDisbursementsByCompanyCode };
