import { GET_DIVIDEND, WATCH_DIVIDEND } from "../../../redux/actionTypes";

export const watchDividendDisbursed = () => ({ type: WATCH_DIVIDEND });

export const fetchDividendDisbursed = (dividend_disbursed) => ({
  type: GET_DIVIDEND,
  payload: dividend_disbursed,
});
