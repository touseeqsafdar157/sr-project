import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

export const getDashboardCounters = async (email, company_code) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/dashboard?email=${email}&company_code=${company_code}`;
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
       return await getDashboardCounters(email, company_code)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
 
};
export const getDashboardGraphData = async (email, company_code) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/dashboard/shareholder-types?email=${email}&company_code=${company_code}`;
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
       return await getDashboardGraphData(email, company_code)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
 
};

export const getDashboardInvestorRequests = async (email, company_code) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/investorrequests/by-company?email=${email}&company_code=${company_code}`;
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
       return await getDashboardInvestorRequests(email, company_code)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

export const getDashboardAnnouncements = async (email, company_code) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/corporateannouncements/by-company?email=${email}&company_code=${company_code}`;
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
       return await getDashboardAnnouncements(email, company_code)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};
