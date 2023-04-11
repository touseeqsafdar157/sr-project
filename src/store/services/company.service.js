import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from "./refresh-token";

const getCompanies = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/companies?email=${email}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getCompanies(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getFolioByCounter = async (email, company_code) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/companies/folio-counter?email=${email}&company_code=${company_code}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getFolioByCounter(email, company_code);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCertificateNo = async (email, company_code) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${
      Config.baseUrl
    }/companies/share-counter?email=${email}&company_code=${company_code.toString()}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getCertificateNo(email, company_code);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCompanyById = async (email, id) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/companies/by-id?email=${email}&code=${id}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getCompanyById(email, id);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addCompany = async (
  email,
  code,
  company_name,
  isin,
  registered_name,
  symbol,
  company_secretary,
  parent_code,
  active,
  ntn,
  incorporation_no,
  sector_code,
  website,
  contact_person_name,
  contact_person_phone,
  contact_person_exchange_no,
  contact_person_email,
  ceo_name,
  ceo_phone,
  ceo_mobile,
  ceo_email,
  head_office_address,
  head_office_city,
  head_office_country,
  province,
  outstanding_shares,
  face_value,
  total_shares,
  free_float,
  treasury_shares,
  preference_shares,
  ordinary_shares,
  non_voting_shares,
  redeemable_shares,
  // authorized_capital,
  // paid_up_capital,
  management_shares,
  company_type,
  authorized_persons,
  governance,
  // serviceObjects,
  allot_size,
  logo,
  number_of_directors,
  shareholder_directors,
  independent_directors,
  board_election_date,
  // next_board_election_date,
  // agm_date,
  // next_agm_date,
  company_auditor,
  company_registrar,
  fiscal_year,
   authorized_capital,
  paid_up_capital,
  service_providers,
  next_board_election_date,
  agm_date,
  next_agm_date,
  bussines_service,
) => {
  try {
    const url = `${Config.baseUrl}/companies/`;

    const result = await axios.post(
      url,
      {
        email,
        code,
        company_name,
        isin,
        registered_name,
        symbol,
        company_secretary,
        parent_code,
        active,
        ntn,
        incorporation_no,
        sector_code,
        website,
        contact_person_name,
        contact_person_phone,
        contact_person_exchange_no,
        contact_person_email,
        ceo_name,
        ceo_phone,
        ceo_mobile,
        ceo_email,
        head_office_address,
        head_office_city,
        head_office_country,
        province,
        outstanding_shares,
        face_value,
        total_shares,
        free_float,
        treasury_shares,
        preference_shares,
        ordinary_shares,
        non_voting_shares,
        redeemable_shares,
        management_shares,
        company_type,
        authorized_persons,
        governance,
        allot_size,
        logo,
        number_of_directors,
        shareholder_directors,
        independent_directors,
        board_election_date,
        company_auditor,
        company_registrar,
        fiscal_year,
        authorized_capital,
        paid_up_capital,
        service_providers,
        next_board_election_date,
        agm_date,
        next_agm_date,
        bussines_service,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await addCompany(
          email,
          code,
          company_name,
          isin,
          registered_name,
          symbol,
          company_secretary,
          parent_code,
          active,
          ntn,
          incorporation_no,
          sector_code,
          website,
          company_auditor,
          company_registrar,
          fiscal_year,
          contact_person_name,
          contact_person_phone,
          contact_person_exchange_no,
          contact_person_email,
          ceo_name,
          ceo_phone,
          ceo_mobile,
          ceo_email,
          head_office_address,
          head_office_city,
          head_office_country,
          outstanding_shares,
          face_value,
          total_shares,
          free_float,
          treasury_shares,
          preference_shares,
          ordinary_shares,
          non_voting_shares,
          redeemable_shares,
          management_shares,
          company_type,
          authorized_persons,
          governance,
          allot_size,
          logo,
          number_of_directors,
          shareholder_directors,
          independent_directors,
          board_election_date,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};


const addStatuaryEvent = async (
  email,
  company_code,
  req_code,
  title,
  start_date,
  deadline_date,
  reminder_days,
  action_date,
  action_by,
  previous_action_date,
  status,
  comments,
  closed
) => {
  try {
    const url = `${Config.baseUrl}/statutoryevents/`;

    const result = await axios.post(
      url,
      {
        email,
        company_code,
        req_code,
        title,
        start_date,
        deadline_date,
        reminder_days,
        action_date,
        action_by,
        previous_action_date,
        status,
        comments,
        closed
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await addStatuaryEvent(
          email,
          company_code,
          req_code,
          title,
          start_date,
          deadline_date,
          reminder_days,
          action_date,
          action_by,
          previous_action_date,
          status,
          comments,
          closed
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addStatuaryRequirmentData = async (
  email,
  code,
  company_type,
  title,
  sections,
  regulations,
  frequency,
  level,
  dependent_on,
  days_to_dependent,
  notify_days,
  notify_via,
  active  
) => {
  try {
    const url = `${Config.baseUrl}/statutoryrequirements/`;

    const result = await axios.post(
      url,
      {
        email,
        code,
        company_type,
        title,
        sections,
        regulations,
        frequency,
        level,
        dependent_on,
        days_to_dependent,
        notify_days,
        notify_via,
        active
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await addStatuaryEvent(
          email,
          code,
          company_type,
          title,
          sections,
          regulations,
          frequency,
          level,
          dependent_on,
          days_to_dependent,
          notify_days,
          notify_via,
          active
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};




const addManualStatuaryAlert = async (
  email,
  code,
  requirement,
  form
) => {
  try {
       
       const url = `${Config.baseUrl}/companies/manual-statutory-alert?email=${email}&code=${code}&requirement=${requirement}&form=${form}`;
    const result = await axios.get(
      url,
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || ""
        },
      }
    );
    return result;
  } catch (err) {
    if(err.response.data.status === 401) { 
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if(result.status) {
       return await addManualStatuaryAlert(
        email,
                code,
                requirement,
                form
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
  //   if (err.response.data.status == 401) {
  //     let responseToHandle = err.response.data;
  //     let result = await RefreshTokenHandler.handleIt(responseToHandle);
  //     if (result.status) {
  //       return await addManualStatuaryAlert(
  //         email,
  //         code,
  //         requirement,
  //         form,
  //         token
  //       );
  //     } else {
  //       throw err;
  //     }
  //   } else {
  //     throw err;
  //   }
  // }
};

const sendEmail = async (
  email,
  code,
  to,
  cc,
  subject,
  template
) => {
  try {
       const url = `${Config.baseUrl}/companies/manual-statutory-alert-template?email=${email}&code=${code}&to[]=${to}&cc[]=${cc}&subject=${subject}&template=${template}`;
    const result = await axios.get(
      url,
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || ""
        },
      }
    );
    return result;
  } catch (err) {
    if(err.response.data.status === 401) { 
      let responseToHandle = err.response.data
      let result = await RefreshTokenHandler.handleIt(responseToHandle)
      if(result.status) {
       return await sendEmail(
        email,
        code,
        to,
        cc,
        subject,
        template
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
 
};




const updateCompany = async (
  email,
  code,
  company_name,
  isin,
  registered_name,
  symbol,
  company_secretary,
  parent_code,
  active,
  ntn,
  incorporation_no,
  sector_code,
  website,
  contact_person_name,
  contact_person_phone,
  contact_person_exchange_no,
  contact_person_email,
  ceo_name,
  ceo_phone,
  ceo_mobile,
  ceo_email,
  head_office_address,
  head_office_city,
  head_office_country,
  province,
  outstanding_shares,
  face_value,
  total_shares,
  free_float,
  treasury_shares,
  preference_shares,
  ordinary_shares,
  non_voting_shares,
  redeemable_shares,
  management_shares,
  company_type,
  authorized_persons,
  governance,
  allot_size,
  logo,
  number_of_directors,
  shareholder_directors,
  independent_directors,
  board_election_date,
  company_auditor,
  company_registrar,
  fiscal_year,
  authorized_capital,
  paid_up_capital,
  service_providers,
  next_board_election_date,
  agm_date,
  next_agm_date,
  bussines_service,
) => {
  try {
    const url = `${Config.baseUrl}/companies/update`;

    const result = await axios.post(
      url,
      {
        email,
        code,
        company_name,
        isin,
        registered_name,
        symbol,
        company_secretary,
        parent_code,
        active,
        ntn,
        incorporation_no,
        sector_code,
        website,
        contact_person_name,
        contact_person_phone,
        contact_person_exchange_no,
        contact_person_email,
        ceo_name,
        ceo_phone,
        ceo_mobile,
        ceo_email,
        head_office_address,
        head_office_city,
        head_office_country,
        province,
        outstanding_shares,
        face_value,
        total_shares,
        treasury_shares,
        free_float,
        preference_shares,
        ordinary_shares,
        non_voting_shares,
        redeemable_shares,
        management_shares,
        company_type,
        authorized_persons,
        governance,
        allot_size,
        logo,
        number_of_directors,
        shareholder_directors,
        independent_directors,
        board_election_date,
        company_auditor,
        company_registrar,
        fiscal_year,
        authorized_capital,
        paid_up_capital,
        service_providers,
        next_board_election_date,
        agm_date,
        next_agm_date,
        bussines_service,
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await updateCompany(
          email,
          code,
          company_name,
          isin,
          registered_name,
          symbol,
          company_secretary,
          parent_code,
          active,
          ntn,
          incorporation_no,
          sector_code,
          website,
          contact_person_name,
          contact_person_phone,
          contact_person_exchange_no,
          contact_person_email,
          ceo_name,
          ceo_phone,
          ceo_mobile,
          ceo_email,
          head_office_address,
          head_office_city,
          head_office_country,
          outstanding_shares,
          face_value,
          total_shares,
          free_float,
          treasury_shares,
          preference_shares,
          ordinary_shares,
          non_voting_shares,
          redeemable_shares,
          management_shares,
          company_type,
          authorized_persons,
          governance,
          allot_size,
          logo,
          number_of_directors,
          shareholder_directors,
          independent_directors,
          board_election_date,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const updateEvent = async (
  email,
  statutory_event_id,
  company_code,
  req_code,
  title,
  start_date,
  deadline_date,
  reminder_days,
  action_date,
  action_by,
  previous_action_date,
  status,
  comments,
  closed
) => {
  try {
    const url = `${Config.baseUrl}/statutoryevents/update`;

    const result = await axios.post(
      url,
      {
        email,
        statutory_event_id,
        company_code,
        req_code,
        title,
        start_date,
        deadline_date,
        reminder_days,
        action_date,
        action_by,
        previous_action_date,
        status,
        comments,
        closed
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await updateEvent(
          email,
          statutory_event_id,
          company_code,
          req_code,
          title,
          start_date,
          deadline_date,
          reminder_days,
          action_date,
          action_by,
          previous_action_date,
          status,
          comments,
          closed
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const updateRequirment = async (
  email,
  code,
  company_type,
  title,
  sections,
  regulations,
  frequency,
  level,
  dependent_on,
  days_to_dependent,
  notify_days,
  notify_via,
  active  
 
) => {
  try {
    const url = `${Config.baseUrl}/statutoryrequirements/update`;

    const result = await axios.post(
      url,
      {
        email,
        code,
        company_type,
        title,
        sections,
        regulations,
        frequency,
        level,
        dependent_on,
        days_to_dependent,
        notify_days,
        notify_via,
        active  
     
      },
      {
        headers: {
          Authorization: sessionStorage.getItem("token") || "",
        },
      }
    );
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await updateEvent(
          email,
          code,
          company_type,
          title,
          sections,
          regulations,
          frequency,
          level,
          dependent_on,
          days_to_dependent,
          notify_days,
          notify_via,
          active  
       
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};


const getCompaniesCounter = async (email) => {
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
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getCompanies(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getPaginatedCompaniesService = async (
  email,
  page_number,
  value,
  search_criteria
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/companies/paginate?page_size=10&email=${email}&page_number=${page_number}&value=${value}&search_criteria=${search_criteria}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getPaginatedCompaniesService(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getPaginatedEventData = async (
  email,
  page_number,
  page_size,
  // company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/statutoryevents/paginate?page_size=10&email=${email}&page_number=${page_number}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getPaginatedEventData(email,
          page_number,
          page_size,
          );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getPaginatedRequirmentData = async (
  email,
  page_number,
  // page_size,
  // company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/statutoryrequirements/paginate?page_size=10&email=${email}&page_number=${page_number}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getPaginatedRequirmentData(email,
          page_number,
          // page_size,
          );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getAllRequirmentData = async (
  email,
  // page_number,
  // page_size,
  // company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/statutoryrequirements?email=${email}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getPaginatedRequirmentData(email,
          // page_number,
          // page_size,
          );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getPaginatedEventDataByCompanyy = async (
  email,
  page_number,
  page_size,
  company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/statutoryevents/paginate-by-company?page_size=10&email=${email}&page_number=${page_number}&company_code=${company_code}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getPaginatedEventData(email,
          page_number,
          page_size,
          company_code
          );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

// const addManualStatuaryAlert = async (
//   email,
//   code,
//   requirement,
//   form
// ) => {
//   try {
       
//        const url = `${Config.baseUrl}/companies/manual-statutory-alert?email=${email}&code=${code}&requirement=${requirement}&form=${form}`;
//     const result = await axios.get(
//       url,
//       {
//         headers: {
//           Authorization: sessionStorage.getItem("token") || ""
//         },
//       }
//     );
//     return result;
//   } catch (err) {
//     if(err.response.data.status === 401) { 
//       let responseToHandle = err.response.data
//       let result = await RefreshTokenHandler.handleIt(responseToHandle)
//       if(result.status) {
//        return await addManualStatuaryAlert(
//         email,
//                 code,
//                 requirement,
//                 form
//        )
//       }else {
//         throw err;
//       }
//     }else {
//           throw err
//     }
//   }
//   //   if (err.response.data.status == 401) {
//   //     let responseToHandle = err.response.data;
//   //     let result = await RefreshTokenHandler.handleIt(responseToHandle);
//   //     if (result.status) {
//   //       return await addManualStatuaryAlert(
//   //         email,
//   //         code,
//   //         requirement,
//   //         form,
//   //         token
//   //       );
//   //     } else {
//   //       throw err;
//   //     }
//   //   } else {
//   //     throw err;
//   //   }
//   // }
// };

const getAllEventData = async (
  email,
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/statutoryevents/?email=${email}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return result;
  } catch (err) {
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await getAllEventData(email,
         
          );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const companySerachService = async (search_criteria, value, page_number) => {};

export {
  getCompanies,
  getCertificateNo,
  addCompany,
  updateCompany,
  getCompanyById,
  getFolioByCounter,
  getCompaniesCounter,
  getPaginatedCompaniesService,
  addManualStatuaryAlert,
  addStatuaryEvent,
  updateEvent,
  getPaginatedEventData,
  getPaginatedEventDataByCompanyy,
  addStatuaryRequirmentData,
  getPaginatedRequirmentData, 
  updateRequirment,
  getAllRequirmentData,
  sendEmail,
  getAllEventData
};
