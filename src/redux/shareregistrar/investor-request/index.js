import { call, put, takeEvery, select } from "redux-saga/effects";

import { txn_type_setter } from "../../../store/services/dropdown.service";

import { fetchInvestorsRequestTypes, fetchInvestorsRequest } from "./action";
import { toast } from "react-toastify";
import {
  INVESTOR_REQUEST_BEGIN_DROPDOWN_LOADING,
  INVESTOR_REQUEST_BEGIN_LOADING,
  INVESTOR_REQUEST_END_DROPDOWN_LOADING,
  INVESTOR_REQUEST_END_LOADING,
  WATCH_INVESTORS_REQUEST,
  WATCH_INVESTORS_REQUEST_TYPES,
} from "../../actionTypes";
import { getInvestorRequest } from "../../../store/services/investor.service";
const getAllInvestorsRequest = async () => {
  const email = sessionStorage.getItem("email");
  try {
    const response = await getInvestorRequest(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(error?.response?.data?.message)
      : console.log("Investors Requests Not Found");
    return [];
  }
};
function* fetchInvestorsRequestAPI() {
  yield put({ type: INVESTOR_REQUEST_BEGIN_LOADING });
  const investors = yield call(getAllInvestorsRequest);
  yield put(fetchInvestorsRequest(investors.data.data));
  yield put({ type: INVESTOR_REQUEST_END_LOADING });
}
function* fetchInvestorsRequestTypesAPI() {
  yield put({ type: INVESTOR_REQUEST_BEGIN_DROPDOWN_LOADING });
  const request_types = yield call(txn_type_setter);
  yield put(fetchInvestorsRequestTypes(request_types));
  yield put({ type: INVESTOR_REQUEST_END_DROPDOWN_LOADING });
}
export function* watcherInvestorsRequests() {
  yield takeEvery(WATCH_INVESTORS_REQUEST, fetchInvestorsRequestAPI);
  yield takeEvery(WATCH_INVESTORS_REQUEST_TYPES, fetchInvestorsRequestTypesAPI);
}
