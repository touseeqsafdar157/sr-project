import axios from "axios";
import Config from "../../config";

const getCharges = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/charges?email=${email}`;
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
       return await getCharges(email)
      }else {
        throw err;
        // return result
      }
    }else {
          throw err
    }
  }
};

const addCharges = async (
  email,
  title,
  percentage,
  applicable_on,
  reference,
  active
) => {
  try{
  const url = `${Config.baseUrl}/charges/`;

  const result = await axios.post(
    url,
    {
      email,
      title,
      percentage,
      applicable_on,
      reference,
      active,
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
       return await addCharges(
        email,
        title,
        percentage,
        applicable_on,
        reference,
        active)
      }else {
        throw err;
        // return result
      }
    }else {
          throw err
    }
  }
};

const updateCharges = async (
  email,
  charges_id,
  title,
  percentage,
  applicable_on,
  reference,
  active
) => {
  try{
  const url = `${Config.baseUrl}/charges/update`;

  const result = await axios.post(
    url,
    {
      email,
      charges_id,
      title,
      percentage,
      applicable_on,
      reference,
      active,
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
       return await updateCharges(
        email,
        charges_id,
        title,
        percentage,
        applicable_on,
        reference,
        active)
      }else {
        throw err;
        // return result
      }
    }else {
          throw err
    }
  }
};

export { getCharges, addCharges, updateCharges };
