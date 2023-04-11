import {
  GET_INVESTORS,
  GET_INVESTORS_DROPDOWN,
  WATCH_INVESTORS,
  WATCH_INVESTORS_DROPDOWN,
} from "../../../redux/actionTypes";

export const watchInvestors = () => ({ type: WATCH_INVESTORS });

export const watchInvestorsDropdown = () => ({
  type: WATCH_INVESTORS_DROPDOWN,
});

export const fetchInvestors = (investors) => ({
  type: GET_INVESTORS,
  payload: investors,
});
export const fetchInvestorsDropdown = (dropdown) => ({
  type: GET_INVESTORS_DROPDOWN,
  payload: dropdown,
});
