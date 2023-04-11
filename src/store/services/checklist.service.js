import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from './refresh-token';

const getChecklistItems = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/processchecklistitems?email=${email}`;
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
       return await getChecklistItems(email)
      }else {
        throw err;
        // return result
      }
    }else {
          throw err
    }
  }
};

const addNewChecklistItem = async (
  email,
  checklist_id,
  txn_type,
  role_id,
  type,
  verification_type,
  group_title,
  serial_no,
  item,
  compliant_title,
  not_compliant_title,
  partially_compliant_title,
  not_applicable_title,
  comments_title,
  compliant_mandatory,
  reference,
  created_date,
  active
) => {
  try{
  const url = `${Config.baseUrl}/processchecklistitems/`;

  const result = await axios.post(
    url,
    {
      email,
      checklist_id,
      txn_type,
      role_id,
      type,
      verification_type,
      group_title,
      serial_no,
      item,
      compliant_title,
      not_compliant_title,
      partially_compliant_title,
      not_applicable_title,
      comments_title,
      compliant_mandatory,
      reference,
      created_date,

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
       return await addNewChecklistItem(
        email,
        checklist_id,
        txn_type,
        role_id,
        type,
        verification_type,
        group_title,
        serial_no,
        item,
        compliant_title,
        not_compliant_title,
        partially_compliant_title,
        not_applicable_title,
        comments_title,
        compliant_mandatory,
        reference,
        created_date,
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

const updateNewChecklistItem = async (
  email,
  item_id,
  checklist_id,
  txn_type,
  role_id,
  type,
  verification_type,
  group_title,
  serial_no,
  item,
  compliant_title,
  not_compliant_title,
  partially_compliant_title,
  not_applicable_title,
  comments_title,
  compliant_mandatory,
  reference,
  created_date,

  active
) => {
  try{
  const url = `${Config.baseUrl}/processchecklistitems/`;

  const result = await axios.post(
    url,
    {
      email,
     item_id,
      checklist_id,
      txn_type,
      role_id,
      type,
      verification_type,
      group_title,
      serial_no,
      item,
      compliant_title,
      not_compliant_title,
      partially_compliant_title,
      not_applicable_title,
      comments_title,
      compliant_mandatory,
      reference,
      created_date,

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
       return await updateNewChecklistItem(
        email,
        item_id,
        checklist_id,
        txn_type,
        role_id,
        type,
        verification_type,
        group_title,
        serial_no,
        item,
        compliant_title,
        not_compliant_title,
        partially_compliant_title,
        not_applicable_title,
        comments_title,
        compliant_mandatory,
        reference,
        created_date,
        active
       )
      }else {
        throw err;
        // return result
      }
    }else {
          throw err
    }
  }
};


const getProcessChecklist = async (email) => {
  try{
  const token = sessionStorage.getItem("token") || "";
  const url = `${Config.baseUrl}/processchecklists?email=${email}`;
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
     return await getProcessChecklist(email)
    }else {
      throw err;
      // return result
    }
  }else {
        throw err
  }
}
};

const addProcessChecklist = async (
  email,
  // checklist_id,
  txn_type,
  check_list_title,
  active
) => {
  try{
  const url = `${Config.baseUrl}/processchecklists/`;
  
  const result = await axios.post(
    url,
    {
      email,
      // checklist_id,
      txn_type,
      check_list_title,
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
       return await addProcessChecklist(
        email,
        txn_type,
        check_list_title,
        active)
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

const updateProcessChecklist = async (
  email,
  checklist_id,
  txn_type,
  check_list_title,
  active
) => {
  try{
  const url = `${Config.baseUrl}/processchecklists/update`;
  

  const result = await axios.post(
    url,
    {
      email,
      checklist_id,
      txn_type,
      check_list_title,
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
       return await updateProcessChecklist(
        email,
        checklist_id,
        txn_type,
        check_list_title,
        active
       )
      }else {
        throw err;
      }
    }else {
          throw err
    }
  }
};

export {
  getChecklistItems,
  addNewChecklistItem,
  getProcessChecklist,
  addProcessChecklist,
  updateProcessChecklist,
  updateNewChecklistItem
};
