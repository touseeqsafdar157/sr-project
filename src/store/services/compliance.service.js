import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

const getCompliance = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/compliances?email=${email}`;
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
       return await getCompliance(email)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const addCompliance = async (
  email,
  action_date,
  txn_id,
  role_id,
  serial_no,
  item,
  compliant,
  not_compliant,
  partially_compliant,
  not_applicable,
  compliance,
  comments,
  created_at
) => {
  try{
  const url = `${Config.baseUrl}/compliances/`;

  const result = await axios.post(
    url,
    {
      email,

      action_date,
      txn_id,
      role_id,
      serial_no,
      item,
      compliant,
      not_compliant,
      partially_compliant,
      not_applicable,
      compliance_by: compliance,
      comments,
      created_at,
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
       return await addCompliance(
        email,
        action_date,
        txn_id,
        role_id,
        serial_no,
        item,
        compliant,
        not_compliant,
        partially_compliant,
        not_applicable,
        compliance,
        comments,
        created_at
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const updateCompliance = async (
  email,
  compliance_id,
  action_date,
  txn_id,
  role_id,
  serial_no,
  item,
  compliant,
  not_compliant,
  partially_compliant,
  not_applicable,
  compliance,
  comments,
  created_at
) => {
  try{
  const url = `${Config.baseUrl}/compliances/update`;

  const result = await axios.post(
    url,
    {
      email,
      compliance_id,
      action_date,
      txn_id,
      role_id,
      serial_no,
      item,
      compliant,
      not_compliant,
      partially_compliant,
      not_applicable,
      compliance_by: compliance,
      comments,
      created_at,
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
       return await updateCompliance(
        email,
        compliance_id,
        action_date,
        txn_id,
        role_id,
        serial_no,
        item,
        compliant,
        not_compliant,
        partially_compliant,
        not_applicable,
        compliance,
        comments,
        created_at
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

export { getCompliance, addCompliance, updateCompliance };
