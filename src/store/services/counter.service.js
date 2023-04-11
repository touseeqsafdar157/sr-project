import Config from "../../config/index";
import axios from "axios";
import RefreshTokenHandler from './refresh-token';

const getFolioCounter = async (email, company_code) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/companies/folio-counter?email=${email}&company_code=${company_code}`;
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
       return await getFolioCounter(email, company_code)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const getSharesCounter = async (email, company_code) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/companies/share-counter?email=${email}&company_code=${company_code}`;
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
     return await getSharesCounter(email, company_code)
    }else {
      throw err;
    }
  }else {
        throw err
  }
}
};

const updateSharesCounter = async (
  email,
  company_code,
  certificate_no_counter,
  distinctive_no_counter
) => {
  try{
  const url = `${Config.baseUrl}/companies/set-shares-counter`;
  const result = await axios.post(
    url,
    {
      email,
      company_code,
      certificate_no_counter,
      distinctive_no_counter,
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
       return await updateSharesCounter(
        email,
        company_code,
        certificate_no_counter,
        distinctive_no_counter)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const updateFolioCounter = async (email, company_code, folio_counter) => {
  try{
  const url = `${Config.baseUrl}/companies/set-folio-counter`;
  const result = await axios.post(
    url,
    {
      email,
      company_code,
      folio_counter,
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
       return await updateFolioCounter(email, company_code, folio_counter)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

export {
  getSharesCounter,
  getFolioCounter,
  updateSharesCounter,
  updateFolioCounter,
};
