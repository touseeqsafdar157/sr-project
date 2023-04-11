import { call, put, takeEvery, select } from "redux-saga/effects";

import { getInvestors } from "../../../store/services/investor.service";

import { fetchInvestors, fetchInvestorsDropdown } from "./action";
import { toast } from "react-toastify";
import {
  WATCH_INVESTORS_DROPDOWN,
  WATCH_INVESTORS,
  INVESTOR_BEGIN_LOADING,
  INVESTOR_END_LOADING,
  INVESTOR_BEGIN_DROPDOWN_LOADING,
  INVESTOR_END_DROPDOWN_LOADING,
} from "../../actionTypes";

const email = sessionStorage.getItem("email") || "";
const getAllInvestors = async () => {
  try {
    const response = await getInvestors(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(`${error?.response?.data?.message}`)
      : console.log("Investors Not Found");
    return [];
  }
};
function* fetchInvestorsAPI() {
  yield put({ type: INVESTOR_BEGIN_LOADING });
  const investors = yield call(getAllInvestors);
  yield put(fetchInvestors(investors.data.data));
  const investors_dropdown = investors.data.data.map((item) => {
    const shareholder_id = !!item.cnic ? item.cnic : item.ntn;
    return {
      label: `${item.investor_name} - ${shareholder_id}`,
      value: shareholder_id,
    };
  });
  yield put(fetchInvestorsDropdown(investors_dropdown));
  yield put({ type: INVESTOR_END_LOADING });
}

export function* watcherInvestors() {
  yield takeEvery(WATCH_INVESTORS, fetchInvestorsAPI);
}
