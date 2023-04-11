import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

const getElection = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/election?email=${email}`;
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
       return await getElection(email)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const addElection = async (
  email,
  company_code,
  term,
  election_from,
  election_to,
  number_of_directors,
  effect_from,
  last_date,
  agm_date,
  application_from,
  application_to,
  election_candidates
) => {
  try{
  const url = `${Config.baseUrl}/election/`;

  const result = await axios.post(
    url,
    {
      email,
      company_code,
      term,
      election_from,
      election_to,
      number_of_directors,
      effect_from,
      last_date,
      agm_date,
      application_from,
      application_to,
      election_candidates,
    },
    {
      headers: {
        "Content-Type": "application/json",
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
       return await addElection(
        email,
        company_code,
        term,
        election_from,
        election_to,
        number_of_directors,
        effect_from,
        last_date,
        agm_date,
        application_from,
        application_to,
        election_candidates
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const updateElection = async (
  email,
  election_id,
  company_code,
  term,
  election_from,
  election_to,
  number_of_directors,
  effect_from,
  last_date,
  agm_date,
  application_from,
  application_to
) => {
  try{
  const url = `${Config.baseUrl}/election/update`;

  const result = await axios.post(
    url,
    {
      email,
      election_id,
      company_code,
      term,
      election_from,
      election_to,
      number_of_directors,
      effect_from,
      last_date,
      agm_date,
      application_from,
      application_to,
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
       return await updateElection(
        email,
        election_id,
        company_code,
        term,
        election_from,
        election_to,
        number_of_directors,
        effect_from,
        last_date,
        agm_date,
        application_from,
        application_to
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

export { getElection, addElection, updateElection };
