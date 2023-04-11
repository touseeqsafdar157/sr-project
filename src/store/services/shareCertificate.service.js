import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

const getShareCounter = async (email, companyCode) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/companies/share-counter?email=${email}&company_code=${companyCode}`;
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
     return await getShareCounter(email, companyCode)
    }else {
      throw err;
    }
  }else {
        throw err
  }
}
};

const uploadShareCertificate = async (email, company_code, data) => {
  try{
  const url = `${Config.baseUrl}/sharecertificates/upload-certificates`;

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
  }catch(err) {
    if(err.response.data.status == 401) { 
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if(result.status) {
       return await uploadShareCertificate(email, company_code, data)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const getShareCertificates = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/sharecertificates?email=${email}`;
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
     return await getShareCertificates(email)
    }else {
      throw err;
    }
  }else {
        throw err
  }
}
};

const getShareCertificatesByNumber = async (email, certificate_no) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/sharecertificates/by-certificate-no?email=${email}&certificate_no=${certificate_no}`;
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
       return await getShareCertificatesByNumber(email, certificate_no)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const getShareCertificatesByFolio = async (email, folio_number) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/sharecertificates/by-folio?email=${email}&folio_number=${folio_number}`;
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
     return await getShareCertificatesByFolio(email, folio_number)
    }else {
      throw err;
    }
  }else {
        throw err
  }
}
};

const getShareCertificatesByCompany = async (email, company_code) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/sharecertificates/by-company?email=${email}&company_code=${company_code}`;
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
     return await getShareCertificatesByCompany(email, company_code)
    }else {
      throw err;
    }
  }else {
        throw err
  }
}
};

const getShareCertificatesByTxnAcceptDateService = async (email, txn_date) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/sharecertificates/by-txn-accept-date?email=${email}&txn_date=${txn_date}`;
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
     return await getShareCertificatesByTxnAcceptDateService(email, txn_date)
    }else {
      throw err;
    }
  }else {
        throw err
  }
}
};

const sendIssuanceCertificate = async (
  email,
  certificate_no_from,
  certificate_no_to,
  type,
  issue_date,
  total_shares_count,
  certificates,
  allotted_to,
  company_code
) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/sharecertificates/issue?email=${email}`;
  const result = await axios.post(
    url,
    {
      email,
      certificate_no_from,
      certificate_no_to,
      type,
      issue_date,
      total_shares_count,
      certificates,
      allotted_to,
      company_code,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return result;
  }catch(err) {
    if(err.response.data.status == 401) { 
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if(result.status) {
       return await sendIssuanceCertificate(
        email,
        certificate_no_from,
        certificate_no_to,
        type,
        issue_date,
        total_shares_count,
        certificates,
        allotted_to,
        company_code
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};
const updateIssuanceCertificate = async (
  email,
  type,
  issue_date,
  certificate_no,
  distinctive_no,
  allotted_to,
  company_code
) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/sharecertificates/update`;
  const result = await axios.post(
    url,
    {
      email,
      type,
      issue_date,
      certificate_no,
      distinctive_no,
      allotted_to,
      company_code,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return result;
  }catch(err) {
    if(err.response.data.status == 401) { 
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if(result.status) {
       return await updateIssuanceCertificate(
        email,
        type,
        issue_date,
        certificate_no,
        distinctive_no,
        allotted_to,
        company_code
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const addCertificate = async (
  email,
  certificate_no_from,
  certificate_no_to,
  type,
  issue_date,
  shares_count,
  certificates,
  allotted_to,
  company_code
) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/sharecertificates/add?email=${email}`;
  const result = await axios.post(
    url,
    {
      email,
      certificate_no_from,
      certificate_no_to,
      type,
      issue_date,
      shares_count,
      certificates,
      allotted_to,
      company_code,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return result;
  }catch(err) {
    if(err.response.data.status == 401) { 
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if(result.status) {
       return await addCertificate(
        email,
        certificate_no_from,
        certificate_no_to,
        type,
        issue_date,
        shares_count,
        certificates,
        allotted_to,
        company_code)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

export {
  getShareCounter,
  getShareCertificates,
  sendIssuanceCertificate,
  getShareCertificatesByFolio,
  getShareCertificatesByNumber,
  uploadShareCertificate,
  getShareCertificatesByCompany,
  addCertificate,
  getShareCertificatesByTxnAcceptDateService,
  updateIssuanceCertificate
};
