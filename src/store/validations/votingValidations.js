import * as yup from "yup";
import { IsJsonString } from "../../utilities/utilityFunctions";

export const addDirectorSchema = yup.object().shape({

  // Company Details
  company_code: yup.string(),
  symbol: yup.string(),
  term: yup.string(),
  effct_date: yup.string(),
  last_date: yup.string(),
  agm_date: yup.string(),
  app_form_date: yup.string(),
  app_to_date: yup.string(),
  authorzation_from: yup.string(),
  authorzation_to: yup.string(),
  election_from: yup.string(),
  election_to: yup.string(),


  no_director: yup.string(),
  no_candidate: yup.string(),
  pol_date: yup.string(),
  postal_last_date: yup.string(),
  expire_date: yup.string(),
  

});
export const EditDirectorSchema = (directr) =>
  yup.object().shape({
    // company_code: yup.string().default(directr?.company_code),
    symbol: yup.string().default(directr?.symbol),
    term: yup.string().default(directr?.term),
    effct_date: yup.string().default(directr?.effect_from),
    last_date: yup.string().default(directr?.last_date),
    agm_date: yup.string().default(directr?.agm_date),
    app_form_date: yup.string().default(directr?.application_from),
    app_to_date: yup.string().default(directr?.application_to),
    authorzation_from: yup.string().default(directr?.authorization_from),
    authorzation_to: yup.string().default(directr?.authorization_to),
    election_from: yup.string().default(directr?.election_from),
    election_to: yup.string().default(directr?.election_to),
  
  
    no_director: yup.string().default(directr?.number_of_directors),
    no_candidate: yup.string().default(directr?.number_of_candidates),
    pol_date: yup.string().default(directr?.pol_date),
    expire_date: yup.string().default(directr?.is_expired),
    postal_last_date: yup.string().default(directr?.postal_ballot_last_date),
    election_result:yup.string().default(directr?.election_result)
    
  });

  export const CanidateVotingSchema = yup.object().shape({

    // Company Details
    company_code: yup.string(),
    election_id: yup.string(),
    symbol: yup.string(),
    canidate_id:  yup.string(),
    folio_no: yup.string(),
    canidate_name: yup.string(),
    term: yup.string(),
    eligible: yup.string(),
    revoked: yup.string(),
    revoked_date: yup.string(),
    comment: yup.string(),
    no_votes: yup.string(),
    position: yup.string(),
      elected: yup.string(),
    // no_candidate: yup.string()
  
  });

  
  export const EditCanidateSchema = (canidate) =>
  yup.object().shape({

    // Company Details
    company_code: yup.string().default(canidate?.company_code),
    election_id: yup.string().default(canidate?.election_id),
    symbol: yup.string().default(canidate?.symbol),
    canidate_id: yup.string().default(canidate?.canidate_id),
    folio_no: yup.string().default(canidate?.folio_no),
    canidate_name: yup.string().default(canidate?.canidate_name),
    term: yup.string().default(canidate?.term),
    eligible: yup.string().default(canidate?.eligible),
    revoked: yup.string().default(canidate?.revoked),
    revoked_date: yup.string().default(canidate?.revoke_date),
    comment: yup.string().default(canidate?.revoke_comments),
    no_votes: yup.string().default(canidate?.number_of_votes),
    position: yup.string().default(canidate?.position),
      elected: yup.string().default(canidate?.elected),
    // no_candidate: yup.string()
  
  });


  export const AddAuthorizedScema = yup.object().shape({
    election_id: yup.string(),
    authorized_date: yup.string(),
    cnic: yup.string(),
    authorized_name: yup.string(),
    last_date: yup.string(),
    agm_date: yup.string(),
    auth_email: yup.string(),
    no_shares: yup.string(),
    no_votes: yup.string(),
    method: yup.string(),
    attachments: yup.string(),
    auth_cancel: yup.string(),
    cancel_date: yup.string(),
    no_candidate: yup.string(),
    cancel_through: yup.string()
  
  });
  export const EditAuthorizedSchema = (authorized) =>
  yup.object().shape({
    election_id: yup.string().default(authorized?.election_id),
    authorized_date: yup.string().default(authorized?.authorized_date),
    cnic: yup.string().default(authorized?.auth_cnic),
    authorized_name: yup.string().default(authorized?.authorized_name),
    last_date: yup.string().default(authorized?.last_date),
    agm_date: yup.string().default(authorized?.agm_date),
    auth_email: yup.string().default(authorized?.auth_email),
    no_shares: yup.string().default(authorized?.number_of_shares),
    no_votes: yup.string().default(authorized?.number_of_votes),
    method: yup.string().default(authorized?.method),
    attachments: yup.string().default(authorized?.attachments),
    auth_cancel: yup.string().default(authorized?.auth_cancelled),
    cancel_date: yup.string().default(authorized?.cancellation_date),
    no_candidate: yup.string().default(authorized?.no_candidate),
    cancel_through: yup.string().default(authorized?.canceled_through)
  
  });
  export const AddSpecialResolutionSchema = yup.object().shape({
   
   
    agenda_id: yup.string(),
    agenda_title: yup.string(),
    cast_type: yup.string(),
    cast_through: yup.string(),
    voter_id: yup.string(),
    folio_No: yup.string(),
    votable_share: yup.string(),
    authorization_id: yup.string(),
    castable_vote: yup.string(),
    vote: yup.string(),
    vote_casted: yup.string(),
    votes_accepted: yup.string(),
    votes_rejected: yup.string(),
    remarks: yup.string(),


   
  
  });
  export const EditSpecialResolutionSchema = (specialResolution) =>
  yup.object().shape({
    // agenda_id: yup.string().default(specialResolution?.agenda_id),
    agenda_title: yup.string().default(specialResolution?.agenda_title),
    cast_type: yup.string().default(specialResolution?.cast_type),
    cast_through: yup.string().default(specialResolution?.cast_through),
    // voter_id: yup.string().default(specialResolution?.voter_id),
    folio_No: yup.string().default(specialResolution?.folio_No),
    votable_share: yup.string().default(specialResolution?.votable_shares),
    authorization_id: yup.string().default(specialResolution?.authorization_id),
    castable_vote: yup.string().default(specialResolution?.castable_votes),
    vote: yup.string().default(specialResolution?.vote),
    vote_casted: yup.string().default(specialResolution?.votes_casted),
    votes_accepted: yup.string().default(specialResolution?.votes_accepted),
    votes_rejected: yup.string().default(specialResolution?.votes_rejected),
    remarks: yup.string().default(specialResolution?.remarks),
  
  });
  export const addSpecialVotingSchema = yup.object().shape({
    item_id: yup.string(),
    meeting_id: yup.string(),
    item_no: yup.string(),
    agenda_title: yup.string(),
    agenda_item: yup.string(),
    attachment: yup.string(),
    term: yup.string(),
    voting_required: yup.string(),
    shareholder: yup.string(),
    voters: yup.string(),
    approvals: yup.string(),
    disapprovals: yup.string(),
    vote_Expired: yup.string(),
    agenda_approved: yup.string(),
    comment: yup.string(),
    voting:yup.string(),
    agenda_from: yup.string(),
    agenda_to: yup.string(),
    
  
  });
  export const EditSpecialVotingSchema = (directr) =>
  yup.object().shape({
    // item_id: yup.string().default(directr?.item_id),
    // meeting_id: yup.string().default(directr?.meeting_id),
    item_no: yup.string().default(directr?.item_no),
    agenda_title: yup.string().default(directr?.agenda_title),
    agenda_item: yup.string().default(directr?.agenda_item),
    attachment: yup.string().default(directr?.attachments),
    term: yup.string().default(directr?.term),
    voting_required: yup.string().default(directr?.voting_required),
    shareholder: yup.string().default(directr?.shareholders),
    voters: yup.string().default(directr?.voters_number),
    approvals: yup.string().default(directr?.approvals),
    disapprovals: yup.string().default(directr?.disapprovals),
    vote_Expired: yup.string().default(directr?.votes_expired),
    agenda_approved: yup.string().default(directr?.agenda_approved),
    comment: yup.string().default(directr?.comments),
    voting: yup.string().default(directr?.voting),
    agenda_from: yup.string().default(directr?.agenda_from),
    agenda_to: yup.string().default(directr?.agenda_to),
    
    
  });

  export const AddElectionSchema = yup.object().shape({
    cast_type: yup.string(),
    cast_through: yup.string(),
    castable_vote: yup.string(),
    votable_share: yup.string(),
    remarks:yup.string(),
   
  
  });
  export const EditElectionVotingSchema = (directr) =>
  yup.object().shape({
    cast_type: yup.string().default(directr?.cast_type),
    cast_through: yup.string().default(directr?.cast_through),
    castable_vote: yup.string().default(directr?.castable_votes),
    votable_share: yup.string().default(directr?.votable_shares),
    remarks:yup.string().default(directr?.remarks),
   
  
  });