import {
  ELECTIONS_BEGIN_DROPDOWN_LOADING,
  ELECTIONS_BEGIN_LOADING,
  ELECTIONS_END_DROPDOWN_LOADING,
  ELECTIONS_END_LOADING,
  GET_ELECTIONS_DROPDOWN,
  WATCH_ELECTIONS,
  GET_ELECTIONS,
  WATCH_ELECTIONS_DROPDOWN,
} from "../../../redux/actionTypes";

export const watchElections = () => ({ type: WATCH_ELECTIONS });

export const watchElectionsDropDown = () => ({
  type: WATCH_ELECTIONS_DROPDOWN,
});

export const beginCompanyLoading = () => ({
  type: ELECTIONS_BEGIN_LOADING,
});

export const beginCompanyDropdownLoading = () => ({
  type: ELECTIONS_BEGIN_DROPDOWN_LOADING,
});

export const endCompanyLoading = () => ({
  type: ELECTIONS_END_LOADING,
});

export const endCompanyDropdownLoading = () => ({
  type: ELECTIONS_END_DROPDOWN_LOADING,
});

export const fetchElections = (elections) => ({
  type: GET_ELECTIONS,
  payload: elections,
});
export const fetchElectionsDropDown = (dropdown) => ({
  type: GET_ELECTIONS_DROPDOWN,
  payload: dropdown,
});
