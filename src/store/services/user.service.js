import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

const addUser = async (
  email,
  name,
  user_email,
  role,
  user_type,
  cnic,
  company_code,
  public_key
) => {
  try{
  const admin_url = `${Config.baseUrl}/user/add`;
  const company_url = `${Config.baseUrl}/companies/adduser`;
  const final_url = (user_type) => {
    switch (user_type) {
      case "ADMIN":
        return admin_url;
      case "COMPANYUSER":
        return company_url;
      default:
        return admin_url;
    }
  };
  const result = await axios.post(
    final_url(user_type),
    {
      email,
      name,
      user_email,
      role,
      user_type,
      cnic,
      company_code,
      public_key
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
       return await addUser(
        email,
        name,
        user_email,
        role,
        user_type,
        cnic,
        company_code,
        public_key)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const registerUserInAuth = async (
  email,
  user_email
) => {
  const url = `${Config.authBaseUrl}user/register`;

  const result = await axios.post(
    url,
    {
      email,
      user_email
    },
    {
      headers: {
        Authorization: sessionStorage.getItem("token") || "",
      },
    }
  );
  return result;
};

const updateUser = async (
  email,
  name,
  user_email,
  role,
  user_type,
  cnic,
  company_code
) => {
  try{
  const url = `${Config.baseUrl}/user/update-info`;

  const result = await axios.post(
    url,
    {
      email,
      name,
      user_email,
      role,
      user_type,
      cnic,
      company_code,
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
       return await updateUser(
        email,
        name,
        user_email,
        role,
        user_type,
        cnic,
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

const getUsers = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/user/get-all?email=${email}`;
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
       return await getUsers(email)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const updateUserStatus = async (
  email,
  user_email,
  status
) => {
  try{
  const url = `${Config.baseUrl}/user/update-status`;
    let result = await axios.post(
      url,
      { email, user_email, status },
      {
        headers: {
          Authorization: sessionStorage.getItem('token') || '',
        },
      }
    );
    return result;
  }catch(err) {
    if(err.response.data.status == 401) { 
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if(result.status) {
       return await updateUserStatus(email, user_email, status)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
  }

  const RefreshTransactionLimit = async (
    email,
    public_key
  ) => {
    try{
    const url = `${Config.baseUrl}/user/add-eth-balance`;

      let result = await axios.post(
        url,
        { email, public_key},
        {
          headers: {
            Authorization: sessionStorage.getItem('token') || '',
          },
        }
      );
      return result;
    }catch(err) {
      if(err.response.data.status == 401) { 
        let responseToHandle = err.response.data
        let result = await RefreshTokenHandler.handleIt(responseToHandle)
        if(result.status) {
         return await RefreshTransactionLimit(email, public_key)
        }else {
          throw err;
        }
      }else {
            throw err
      }
    }
  };

  const searchTransactionLimitData = async (email, public_key ) => {
    try{
    const url = `${Config.baseUrl}/user/eth-balance?email=${email}&public_key=${public_key}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: sessionStorage.getItem('token') || '',
        },
      });
      return result;
    }catch(err) {
      if(err.response.data.status == 401) { 
        let responseToHandle = err.response.data
        let result = await RefreshTokenHandler.handleIt(responseToHandle)
        if(result.status) {
         return await searchTransactionLimitData(email,public_key)
        }else {
          throw err;
        }
      }else {
            throw err
      }
    }
  };
  const getPublicKey = async (email, user_email) => {
    try{
    const url = `${Config.authBaseUrl}user/get-public-key?email=${email}&user_email=${user_email}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: sessionStorage.getItem('token') || '',
        },
      });
      return result;
    }catch(err) {
      if(err.response.data.status == 401) { 
        let responseToHandle = err.response.data
        let result = await RefreshTokenHandler.handleIt(responseToHandle)
        if(result.status) {
         return await getPublicKey(email, user_email)
        }else {
          throw err;
        }
      }else {
            throw err
      }
    }
  };

export { addUser, getUsers, updateUser, registerUserInAuth, updateUserStatus, searchTransactionLimitData, RefreshTransactionLimit,
  getPublicKey };
