import { call, put, takeEvery, select } from "redux-saga/effects";
import { getvalidDateDMonthY } from "../../../utilities/utilityFunctions";
import { getElection } from "../../../store/services/election.service";

import { fetchElections, fetchElectionsDropDown } from "./action";
import { toast } from "react-toastify";
import {
  WATCH_ELECTIONS_DROPDOWN,
  WATCH_ELECTIONS,
  ELECTIONS_BEGIN_LOADING,
  ELECTIONS_END_LOADING,
  ELECTIONS_BEGIN_DROPDOWN_LOADING,
  ELECTIONS_END_DROPDOWN_LOADING,
} from "../../actionTypes";

const email = sessionStorage.getItem("email") || "";
const getAllElections = async () => {
  try {
    const response = await getElection(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(error?.response?.data?.message)
      : console.log("Elections Not Found");
    return [];
  }
};
function* fetchElectionsAPI() {
  yield put({ type: ELECTIONS_BEGIN_LOADING });
  const elections = yield call(getAllElections);
  yield put(fetchElections(elections.data.data));
  yield put({ type: ELECTIONS_END_LOADING });
}
function* fetchElectionsDropDownAPI() {
  yield put({ type: ELECTIONS_BEGIN_DROPDOWN_LOADING });

  const elections = yield call(getAllElections);
  let options = elections.data.data.map((item) => {
    let label = `${item.company_code} - ${getvalidDateDMonthY(
      item.application_from
    )}`;
    return { label: label, value: item.election_id };
  });
  yield put(fetchElectionsDropDown(options));
  yield put({ type: ELECTIONS_END_DROPDOWN_LOADING });
}

export function* watcherElections() {
  yield takeEvery(WATCH_ELECTIONS, fetchElectionsAPI);
  yield takeEvery(WATCH_ELECTIONS_DROPDOWN, fetchElectionsDropDownAPI);
}
