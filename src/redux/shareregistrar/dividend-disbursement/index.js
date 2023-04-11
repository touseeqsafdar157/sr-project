import { call, put, takeEvery } from "redux-saga/effects";

import { fetchDividendDisbursed } from "./action";
import { toast } from "react-toastify";
import {
  WATCH_DIVIDEND,
  DIVIDEND_BEGIN_LOADING,
  DIVIDEND_END_LOADING,
} from "../../actionTypes";
import { getDisburse } from "../../../store/services/disburse.service";

const email = sessionStorage.getItem("email") || "";
const getAllDividendDisbursed = async () => {
  try {
    const response = await getDisburse(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(error?.response?.data?.message)
      : console.log("Dividends Not Found");
    return [];
  }
};
function* fetchDividendDisbursedAPI() {
  yield put({ type: DIVIDEND_BEGIN_LOADING });
  const dividends = yield call(getAllDividendDisbursed);
  yield put(fetchDividendDisbursed(dividends.data.data));
  yield put({ type: DIVIDEND_END_LOADING });
}
export function* watcherDividendDisbursement() {
  yield takeEvery(WATCH_DIVIDEND, fetchDividendDisbursedAPI);
}
