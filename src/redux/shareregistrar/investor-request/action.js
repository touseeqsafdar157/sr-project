import {
  GET_INVESTORS_REQUEST,
  GET_INVESTORS_REQUEST_DROPDOWN,
  GET_INVESTORS_REQUEST_TYPES,
  WATCH_INVESTORS_REQUEST,
  WATCH_INVESTORS_REQUEST_DROPDOWN,
  WATCH_INVESTORS_REQUEST_TYPES,
} from "../../../redux/actionTypes";

export const watchInvestorsRequest = () => 
({ type: WATCH_INVESTORS_REQUEST });

export const watchInvestorsRequestDropdown = () => ({
  type: WATCH_INVESTORS_REQUEST_DROPDOWN,
});

export const watchInvestorsRequestTypes = () => ({
  type: WATCH_INVESTORS_REQUEST_TYPES,
});

export const fetchInvestorsRequest = (investors) => ({
  type: GET_INVESTORS_REQUEST,
  payload: investors,
});
export const fetchInvestorsRequestDropdown = (dropdown) => ({
  type: GET_INVESTORS_REQUEST_DROPDOWN,
  payload: dropdown,
});

export const fetchInvestorsRequestTypes = (dropdown) => ({
  type: GET_INVESTORS_REQUEST_TYPES,
  payload: dropdown,
});
