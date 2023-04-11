import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

export const loginService = async (email, password) => {
  const url = `${Config.authBaseUrl}user/login`;
  const result = await axios.post(url, {
    email,
    password,
    // user_type: "ADMIN",
  });
  return result;
};

export const getLoggedinUserInfo = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/user/get-logged-in-user-info?email=${email}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if (result.status) {
        return await getLoggedinUserInfo(email);
      } else {
        throw err;
        // return result
      }
    } else {
      throw err
    }
  }
};

export const logoutCentral = async (email) => {
  let token = sessionStorage.getItem('token')
  const url = `${Config.authBaseUrl}user/logout`;
  const result = await axios.post(url, {
    email,
    token,
    // user_type: "ADMIN",
  },
    {
      headers: {
        Authorization: sessionStorage.getItem("token") || "",
      },
    });
  return result;
};
export const forgotPassword = async (email) => {
  try {
    const url = `${Config.authBaseUrl}user/forget-password`;
    const result = await axios.post(url, {
      email,
    },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if (result.status) {
        return await forgotPassword(email);
      } else {
        throw err;
        // return result
      }
    } else {
      throw err
    }
  }
};

export const forgotPasswordOtp = async (email, otp, new_password, confirm_new_password) => {
  const url = `${Config.authBaseUrl}user/verify-otp`;
  try {
    const result = await axios.post(url, { email, otp, new_password, confirm_new_password });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if (result.status) {
        return await forgotPasswordOtp(email, otp, new_password, confirm_new_password)
      } else {
        return result
      }
    } else {
      throw err
    }

  }
};

export const logoutMain = async (email) => {
  let token = sessionStorage.getItem('token')
  const url = `${Config.baseUrl}/user/logout`;
  const result = await axios.post(url, {
    email,
    token,
    // user_type: "ADMIN",
  },
    {
      headers: {
        Authorization: sessionStorage.getItem("token") || "",
      },
    });
  return result;
};

