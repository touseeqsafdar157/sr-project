import axios from "axios";
import Config from "../../config";
import RefreshTokenHandler from "./refresh-token";
const getAllElections = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election?email=${email}`;
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
        return await getAllElections(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getStatutoryEventByEventID = async (email,event_id) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/statutoryevents/by-event-id?email=${email}&event_id=${event_id}`;
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
        return await getStatutoryEventByEventID(email,event_id);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const addBoardOfElection = async (
  email,
  company_code,
  symbol,
  term,
  effect_from,
  last_date,
  agm_date,
  application_from,
  application_to,
  authorization_from,
  authorization_to,
  election_from,
  election_to,
  number_of_directors,
  number_of_candidates,
  is_expired,
  created_at,
  meeting_id,
  pol_date,
  postal_ballot_last_date,
  election_result,
) => {
  try {
    const url = `${Config.baseUrl}/election/`;

    const result = await axios.post(
      url,
      {
        email,
        company_code,
        symbol,
        term,
        effect_from,
        last_date,
        agm_date,
        application_from,
        application_to,
        authorization_from,
        authorization_to,
        election_from,
        election_to,
        number_of_directors,
        number_of_candidates,
        is_expired,
        created_at,
        meeting_id,
        pol_date,
        postal_ballot_last_date,
        election_result,

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
        return await addBoardOfElection(
          email,
          company_code,
          symbol,
          term,
          effect_from,
          last_date,
          agm_date,
          application_from,
          application_to,
          authorization_from,
          authorization_to,
          election_from,
          election_to,
          number_of_directors,
          number_of_candidates,
          is_expired,
          created_at,
          meeting_id,
          pol_date,
          postal_ballot_last_date,
          election_result,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getpaginatedElectionOfBoardData = async (
  email,
  page_number,
  // page_size,
  search_criteria,
  value,
  // company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/paginate?page_size=10&email=${email}&page_number=${page_number}&search_criteria=${search_criteria}value=${value}`;
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
        return await getpaginatedElectionOfBoardData(email,
          page_number,
          // page_size,
          search_criteria,
          value,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const updateBoardElection = async (
  email,
  election_id,
  company_code,
  symbol,
  term,
  effect_from,
  last_date,
  agm_date,
  application_from,
  application_to,
  authorization_from,
  authorization_to,
  election_from,
  election_to,
  number_of_directors,
  number_of_candidates,
  is_expired,
  created_at,
  meeting_id,
  pol_date,
  postal_ballot_last_date,
  election_result
) => {
  try {
    const url = `${Config.baseUrl}/election/update`;

    const result = await axios.post(
      url,
      {
        email,
  election_id,
  company_code,
  symbol,
  term,
  effect_from,
  last_date,
  agm_date,
  application_from,
  application_to,
  authorization_from,
  authorization_to,
  election_from,
  election_to,
  number_of_directors,
  number_of_candidates,
  is_expired,
  created_at,
  meeting_id,
  pol_date,
  postal_ballot_last_date,
  election_result
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
        return await updateBoardElection(
          email,
          election_id,
          company_code,
          symbol,
          term,
          effect_from,
          last_date,
          agm_date,
          application_from,
          application_to,
          authorization_from,
          authorization_to,
          election_from,
          election_to,
          number_of_directors,
          number_of_candidates,
          is_expired,
          created_at,
          meeting_id,
          pol_date,
          postal_ballot_last_date,
          election_result
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const updateCanidateVoting = async (
  email,
  candidate_id,
  election_id,
  company_code,
  symbol,
  folio_number,
  candidate_name,
  term,
  eligible,
  revoked,
  revoke_date,
  revoke_comments,
  number_of_votes,
  position,
  elected,
  created_at,
) => {
  try {
    const url = `${Config.baseUrl}/election/candidate/update`;

    const result = await axios.post(
      url,
      {
        email,
        candidate_id,
        election_id,
        company_code,
        symbol,
        folio_number,
        candidate_name,
        term,
        eligible,
        revoked,
        revoke_date,
        revoke_comments,
        number_of_votes,
        position,
        elected,
        created_at,
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
        return await updateCanidateVoting(
          email,
          candidate_id,
          election_id,
          company_code,
          symbol,
          folio_number,
          candidate_name,
          term,
          eligible,
          revoked,
          revoke_date,
          revoke_comments,
          number_of_votes,
          position,
          elected,
          created_at,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getPaginatedElectionsData = async (
  email,
  page_number,
  // page_size,
  // search_criteria,
  // value,
  // // company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote/paginate?page_size=10&email=${email}&page_number=${page_number}`;
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
        return await getPaginatedElectionsData(email,
          page_number,
          // page_size,
          // search_criteria,
          // value,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addElectionCandidates = async (
  email,

  election_id,
  company_code,
  symbol,
  candidate_id,
  folio_number,
  candidate_name,
  term,
  eligible,
  revoked,
  revoke_date,
  revoke_comments,
  number_of_votes,
  position,
  elected,
  created_at,

) => {
  try {
    const url = `${Config.baseUrl}/election/candidate/`;

    const result = await axios.post(
      url,
      {
        email,
        election_id,
        company_code,
        symbol,
        candidate_id,
        folio_number,
        candidate_name,
        term,
        eligible,
        revoked,
        revoke_date,
        revoke_comments,
        number_of_votes,
        position,
        elected,
        created_at,
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
        return await addElectionCandidates(
          email,

          election_id,
          company_code,
          symbol,
          candidate_id,
          folio_number,
          candidate_name,
          term,
          eligible,
          revoked,
          revoke_date,
          revoke_comments,
          number_of_votes,
          position,
          elected,
          created_at,

        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getPaginatedCanidateData = async (
  email,
  page_number,
  // page_size,
  search_criteria,
  value,
  // company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/candidate/paginate?page_size=10&email=${email}&page_number=${page_number}&search_criteria=${search_criteria}value=${value}`;
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
        return await getPaginatedCanidateData(email,
          page_number,
          // page_size,
          search_criteria,
          value,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getCandidateByCompany = async (
  email,
  company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/candidate/by-company?email=${email}&company_code=${company_code}`;
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
        return await getCandidateByCompany(email,
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
const addAuthoriziedVoting = async (
  email,
  // auth_id
  company_code,
  election_id,
  type,
  authorized_date,
  investor_id,
  auth_cnic,
  authorized_name,
  auth_mobile,
  auth_email,
  number_of_shares,
  number_of_votes,
  method,
  attachment_files,
  auth_cancelled,
  cancellation_date,
  canceled_through,
  created_at,

) => {
  try {
    const url = `${Config.baseUrl}/vote/voting-authorization/`;

    const result = await axios.post(
      url,
      {
        email,
        // auth_id
        company_code,
        election_id,
        type,
        authorized_date,
        investor_id,
        auth_cnic,
        authorized_name,
        auth_mobile,
        auth_email,
        number_of_shares,
        number_of_votes,
        method,
        attachment_files,
        auth_cancelled,
        cancellation_date,
        canceled_through,
        created_at,
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
        return await addAuthoriziedVoting(
          email,
          // auth_id
          company_code,
          election_id,
          type,
          authorized_date,
          investor_id,
          auth_cnic,
          authorized_name,
          auth_mobile,
          auth_email,
          number_of_shares,
          number_of_votes,
          method,
          attachment_files,
          auth_cancelled,
          cancellation_date,
          canceled_through,
          created_at,

        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getPaginatedAuthorizedListingData = async (
  email,
  page_number,
  // page_size,
  // search_criteria,
  // value,
  // company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote/voting-authorization/paginate?page_size=10&email=${email}&page_number=${page_number}`;
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
        return await getPaginatedAuthorizedListingData(email,
          page_number,
          // page_size,
          // search_criteria,
          // value,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getPaginatedSepecialResolutionListing = async (
  email,
  page_number,
  search_criteria,
  value,

) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/special-agenda/paginate?page_size=10&email=${email}&page_number=${page_number}&search_criteria=${search_criteria}&value=${value}`;
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
        return await getPaginatedAuthorizedListingData(email,
          page_number,
           search_criteria,
          value,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addSpecialVotingAgenda = async (
  email,
  company_code,
  meeting_id,
  agendas,
  attachments,
  voting,
  shareholders,
  voters_number,
  approvals,
  disapprovals,
  votes_expired,
  agenda_approved,
  comments,
  created_at,
  agenda_from,
  agenda_to

) => {
  try {
    const url = `${Config.baseUrl}/election/special-agenda/`;

    const result = await axios.post(
      url,
      {
        email,
        company_code,
        meeting_id,
        agendas,
        attachments,
        voting,
        shareholders,
        voters_number,
        approvals,
        disapprovals,
        votes_expired,
        agenda_approved,
        comments,
        created_at,
        agenda_from,
      agenda_to
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
        return await addSpecialVotingAgenda(
          email,
          company_code,
          meeting_id,
          agendas,
          attachments,
          voting,
          shareholders,
          voters_number,
          approvals,
          disapprovals,
          votes_expired,
          agenda_approved,
          comments,
          created_at,
          agenda_from,
        agenda_to

        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getPaginatedSpecialVotingAgenda = async (
  email,
  page_number,
  // page_size,
  search_criteria,
  value,
  // company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/special-agenda/paginate?page_size=10&email=${email}&page_number=${page_number}&search_criteria=${search_criteria}&value=${value}`;
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
        return await getPaginatedSpecialVotingAgenda(email,
          page_number,
          // page_size,
          search_criteria,
          value,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const updateAuthorization = async (
  email,
  auth_id,
  company_code,
  election_id,
  type,
  authorized_date,
  investor_id,
  auth_cnic,
  authorized_name,
  auth_mobile,
  auth_email,
  number_of_shares,
  number_of_votes,
  method,
  attachment_files,
  auth_cancelled,
  cancellation_date,
  canceled_through,
  created_at,
  cancel_reason
) => {
  try {
    const url = `${Config.baseUrl}/vote/voting-authorization/update/`;

    const result = await axios.post(
      url,
      {
        email,
        auth_id,
        company_code,
        election_id,
        type,
        authorized_date,
        investor_id,
        auth_cnic,
        authorized_name,
        auth_mobile,
        auth_email,
        number_of_shares,
        number_of_votes,
        method,
        attachment_files,
        auth_cancelled,
        cancellation_date,
        canceled_through,
        created_at,
        cancel_reason

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
        return await updateAuthorization(
          email,
          auth_id,
          company_code,
          election_id,
          type,
          authorized_date,
          investor_id,
          auth_cnic,
          authorized_name,
          auth_mobile,
          auth_email,
          number_of_shares,
          number_of_votes,
          method,
          attachment_files,
          auth_cancelled,
          cancellation_date,
          canceled_through,
          created_at,
          cancel_reason
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const updateSpecialVoting = async (
  email,
  item_id,
  company_code,
  meeting_id,
  agendas,
  attachments,
  voting,
  shareholders,
  voters_number,
  approvals,
  disapprovals,
  votes_expired,
  agenda_approved,
  comments,
  created_at,

  agenda_from,
agenda_to
) => {
  try {
    const url = `${Config.baseUrl}/election/special-agenda/update/`;

    const result = await axios.post(
      url,
      {
        email,
        item_id,
        company_code,
        meeting_id,
        agendas,
        attachments,
        voting,
        shareholders,
        voters_number,
        approvals,
        disapprovals,
        votes_expired,
        agenda_approved,
        comments,
        created_at,
        agenda_from,
        agenda_to

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
        return await updateSpecialVoting(
          email,
          item_id,
          company_code,
          meeting_id,
          agendas,
          attachments,
          voting,
          shareholders,
          voters_number,
          approvals,
          disapprovals,
          votes_expired,
          agenda_approved,
          comments,
          created_at,
          agenda_from,
          agenda_to
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getAllAgendaData = async (
  email,

) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/special-agenda?email=${email}`;
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
        return await getAllAgendaData(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const addSpecialResolutionData = async (
  email,
  voting_id,
  agenda_id,
  cast_type,
  cast_through,
  voter_id,
  folio_number,
  authroization_id,
  votable_shares,
  castable_votes,
  vote,
  votes_casted,
  meeting_id,
  company_code

) => {
  try {
    const url = `${Config.baseUrl}/vote/special-resolution-voting/`;

    const result = await axios.post(
      url,
      {
        email,
      voting_id,
      cast_type,
      cast_through,
      voter_id,
      folio_number,
      authroization_id,
      votable_shares,
      castable_votes,
      meeting_id,
      agenda_id,
      vote,
      votable_shares,
      votes_casted,
      company_code
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
        return await addSpecialResolutionData(
          email,
          voting_id,
          cast_type,
          cast_through,
          voter_id,
          folio_number,
          authroization_id,
          votable_shares,
          castable_votes,
          meeting_id,
          agenda_id,
          vote,
          votable_shares,
          votes_casted,
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
const getPaginatedSepecialResolutionData = async (
  email,
  page_number,
  // page_size,
  search_criteria,
  value,
  // company_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote/special-resolution-voting/paginate?page_size=10&email=${email}&page_number=${page_number}&search_criteria=${search_criteria}&value=${value}`;
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
        return await getPaginatedSepecialResolutionData(email,
          page_number,
          // page_size,
          search_criteria,
          value,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const updateSpecialResolution = async (
  email,
  voting_id,
  agenda_id,
  agenda_title,
  cast_type,
  cast_through,
  voter_id,
  folio_number,
  authorization_id,
  votable_shares,
  castable_votes,
  vote,
  votes_casted,
  voting_percentage,
  votes_accepted,
  votes_rejected,
  remarks,
  created_at,
) => {
  try {
    const url = `${Config.baseUrl}/vote/special-resolution-voting/update/`;

    const result = await axios.post(
      url,
      {
        email,
        voting_id,
        agenda_id,
        agenda_title,
        cast_type,
        cast_through,
        voter_id,
        folio_number,
        authorization_id,
        votable_shares,
        castable_votes,
        vote,
        votes_casted,
        voting_percentage,
        votes_accepted,
        votes_rejected,
        remarks,
        created_at,

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
        return await updateSpecialResolution(
          email,
          voting_id,
          agenda_id,
          agenda_title,
          cast_type,
          cast_through,
          voter_id,
          folio_number,
          authorization_id,
          votable_shares,
          castable_votes,
          vote,
          votes_casted,
          voting_percentage,
          votes_accepted,
          votes_rejected,
          remarks,
          created_at,
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getAllAuthorization = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote/voting-authorization?email=${email}`;
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
        return await getAllAuthorization(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const addElectionVotingData = async (
  email,
        // voting_id,
        company_code,
        election_id,
    cast_type,
    cast_through,
    voter_id,
    folio_number,
    authroization_id,
    votable_shares,
    castable_votes,
    remarks,
    vote_casting

) => {
  try {
    const url = `${Config.baseUrl}/vote/`;

    const result = await axios.post(
      url,
      {
        email,
        // voting_id,
        company_code,
   election_id,
    cast_type,
    cast_through,
    voter_id,
    folio_number,
    authroization_id,
    votable_shares,
    castable_votes,
    remarks,
    vote_casting
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
    console.log('=====err', err)
    if (err.response.data.status == 401) {
      let responseToHandle = err.response.data;
      let result = await RefreshTokenHandler.handleIt(responseToHandle);
      if (result.status) {
        return await addElectionVotingData(
          email,
          // voting_id,
          company_code,
      election_id,
      cast_type,
      cast_through,
      voter_id,
      folio_number,
      authroization_id,
      votable_shares,
      castable_votes,
      remarks,
      vote_casting

        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getAllCandidateData = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/candidate?email=${email}`;
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
        return await getAllCandidateData(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getAllSpecialResolutionData = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote/special-resolution-voting?email=${email}`;
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
        return await getAllSpecialResolutionData(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getAllSpecialVotingByAgendaId = async (email, agenda_id) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote/special-resolution-voting/by-agenda-id?email=${email}&agenda_id=${agenda_id}`;
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
        return await getAllSpecialVotingByAgendaId(email, agenda_id);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getDirectorsDataByCompanyCode = async (
  email,
  comapny_code,
  
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/by-company?email=${email}&company_code=${comapny_code}`;
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
        return await getDirectorsDataByCompanyCode(email,
          comapny_code,
        
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getAuthorizedByElectionId = async (
  email,
  election_id,
  
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote/voting-authorization/by-election-id?email=${email}&election_id=${election_id}`;
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
        return await getAuthorizedByElectionId(email,
          election_id,
        
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getSpecialAgandabyEventid = async (
  email,
  event_id,
  
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/special-agenda/by-event-id?email=${email}&event_id=${event_id}`;
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
        return await getSpecialAgandabyEventid(email,
          event_id,
        
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getAllSpecialResolution = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote/special-resolution-voting?email=${email}`;
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
        return await getAllSpecialResolution(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getSpecialResolutionByAgendaId = async (
  email,
  agenda_id,
  
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote/special-resolution-voting/by-agenda-id?email=${email}&agenda_id=${agenda_id}`;
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
        return await getSpecialResolutionByAgendaId(email,
          agenda_id,
        
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const UpdateElectionVoting = async (
  email,
          
  voting_id,
  company_code,
election_id,

  cast_type,
  cast_through,
  voter_id,
  folio_number,
  authroization_id,
  votable_shares,
  castable_votes,
  remarks,
  vote_casting
) => {
  try {
    const url = `${Config.baseUrl}/vote/update`;

    const result = await axios.post(
      url,
      {
        email,
          
        voting_id,
        company_code,
      election_id,
    
        cast_type,
        cast_through,
        voter_id,
        folio_number,
        authroization_id,
        votable_shares,
        castable_votes,
        remarks,
        vote_casting

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
        return await UpdateElectionVoting(
          email,
          
    voting_id,
    company_code,
  election_id,

    cast_type,
    cast_through,
    voter_id,
    folio_number,
    authroization_id,
    votable_shares,
    castable_votes,
    remarks,
    vote_casting
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getAllElectionVotingData = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote/?email=${email}`;
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
        return await getAllElectionVotingData(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getSpecialAgandabyCompanyCode = async (
  email,
  company_code,
  
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/special-agenda/by-company?email=${email}&company_code=${company_code}`;
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
        return await getSpecialAgandabyCompanyCode(email,
          company_code,
        
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
const getAllSpecialVotingAgenda = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/special-agenda/?email=${email}`;
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
        return await getAllSpecialVotingAgenda(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};


const getAllCandidateByElectionId = async (
  email,
  election_id,
  comapny_code
) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/election/candidate/by-election-id?email=${email}&election_id=${election_id}&comapny_code=${comapny_code}`;
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
        return await getAllCandidateByElectionId(email,
          election_id,
  comapny_code
        
        );
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};

const getAllElectionVoting = async (email) => {
  try {
    const token = sessionStorage.getItem("token") || "";
    const url = `${Config.baseUrl}/vote?email=${email}`;
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
        return await getAllElectionVoting(email);
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }
};
export {

  addBoardOfElection,
  getpaginatedElectionOfBoardData,
  updateBoardElection,
  getAllElections,
  addElectionCandidates,
  getPaginatedCanidateData,
  updateCanidateVoting,
  addAuthoriziedVoting,
  getPaginatedAuthorizedListingData,
  addSpecialVotingAgenda,
  getPaginatedSpecialVotingAgenda,
  updateAuthorization,
  updateSpecialVoting,
  getAllAgendaData,
  addSpecialResolutionData,
  getPaginatedSepecialResolutionData,
  updateSpecialResolution,
  getPaginatedElectionsData,
  getAllAuthorization,
  addElectionVotingData,
  getAllCandidateData,
  getAllSpecialResolutionData,
  getAllSpecialVotingByAgendaId,
  getDirectorsDataByCompanyCode,
  getCandidateByCompany, 
  getAuthorizedByElectionId,
  getSpecialAgandabyEventid,
  getAllSpecialResolution,
  getSpecialResolutionByAgendaId,
  UpdateElectionVoting,
  getAllElectionVotingData,
  getSpecialAgandabyCompanyCode,
  getStatutoryEventByEventID,
  getAllSpecialVotingAgenda,
  getAllCandidateByElectionId,
  getPaginatedSepecialResolutionListing,
  getAllElectionVoting
};