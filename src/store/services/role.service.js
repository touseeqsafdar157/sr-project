import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

const getFeatures = async (email) => {
  try{
  const url = `${Config.baseUrl}/features/default?email=${email}`;
  const result = await axios.get(url, {
    headers: {
      Authorization: sessionStorage.getItem("token") || "",
    },
  });
  return result;
}catch(err) {
  if(err.response.data.status == 401) { 
    let responseToHandle = err.response.data
    let result = await RefreshTokenHandler.handleIt(responseToHandle)
    if(result.status) {
     return await getFeatures(email)
    }else {
      throw err;
    }
  }else {
        throw err
  }
}
};

const getRoles = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/role?email=${email}`;
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
     return await getRoles(email)
    }else {
      throw err;
    }
  }else {
        throw err
  }
}
};

const addRole = async (email, description, features, role_name) => {
  try{
  const url = `${Config.baseUrl}/role`;

  const result = await axios.post(
    url,
    {
      email,
      description,
      features,
      role_name,
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
       return await addRole(email, description, features, role_name)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const updateRole = async (email, description, features, role_name) => {
  try{
  const url = `${Config.baseUrl}/role/`;

  const result = await axios.put(
    url,
    {
      email,
      description,
      features,
      role_name,
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
       return await updateRole(email, description, features, role_name)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

export { getRoles, addRole, getFeatures, updateRole };
