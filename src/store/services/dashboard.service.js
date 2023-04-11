import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

const getCompaniesCount = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/dashboard/companies-counter?email=${email}`;
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
        return await getCompaniesCount(email)
      } else {
        throw err;
      }
    } else {
      throw err
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
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if (result.status) {
        return await getInvestorsCount(email)
      } else {
        throw err;
      }
    } else {
      throw err
    }
  }
};

const getShareholdersCount = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/dashboard/shareholders-counter?email=${email}`;
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
        return await getShareholdersCount(email)
      } else {
        throw err;
      }
    } else {
      throw err
    }
  }
};

const getTransactionsCount = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/dashboard/transactions-counter?email=${email}`;
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
        return await getTransactionsCount(email)
      } else {
        throw err;
      }
    } else {
      throw err
    }
  }
};

const getDividendDisbursmentsCount = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/dashboard/dividenddisbursement-counter?email=${email}`;
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
        return await getDividendDisbursmentsCount(email)
      } else {
        throw err;
      }
    } else {
      throw err
    }
  }
};

const getRegisteredCompany = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/companies/created-at?email=${email}`;
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
        return await getRegisteredCompany(email)
      } else {
        throw err;
      }
    } else {
      throw err
    }
  }
};

export {
  getCompaniesCount,
  getInvestorsCount,
  getShareholdersCount,
  getTransactionsCount,
  getDividendDisbursmentsCount,
  getRegisteredCompany
}