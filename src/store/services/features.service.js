import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

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

export { getRoles };
