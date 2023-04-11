import { call, put, takeEvery, select } from "redux-saga/effects";

import { getShareholders } from "../../../store/services/shareholder.service";

import {
  fetchShareholders,
  fetchShareholdersDropdown,
  fetchPhysicalShareholders,
  fetchPhysicalShareholdersDropdown,
  fetchElectronicShareholders,
  fetchElectronicShareholdersDropdown,
  fetchInactiveShareholders,
  fetchInactiveShareholdersDropdown,
} from "./action";
import { toast } from "react-toastify";
import {
  WATCH_SHAREHOLDERS_DROPDOWN,
  WATCH_SHAREHOLDERS,
  // PHYSICAL
  WATCH_PHYSICAL_SHAREHOLDERS,
  WATCH_PHYSICAL_SHAREHOLDERS_DROPDOWN,
  // ELECTRONIC
  WATCH_ELECTRONIC_SHAREHOLDERS,
  WATCH_ELECTRONIC_SHAREHOLDERS_DROPDOWN,
  SHAREHOLDERS_BEGIN_LOADING,
  SHAREHOLDERS_END_LOADING,
  SHAREHOLDERS_BEGIN_DROPDOWN_LOADING,
  SHAREHOLDERS_END_DROPDOWN_LOADING,
  GET_INACTIVE_SHAREHOLDERS,
  INACTIVE_SHAREHOLDERS_END_LOADING,
  INACTIVE_SHAREHOLDERS_BEGIN_LOADING,
  WATCH_INACTIVE_SHAREHOLDERS,
} from "../../actionTypes";

const email = sessionStorage.getItem("email") || "";
const getAllShareholders = async (pram = "") => {
  try {
    const response = await getShareholders(email, pram);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(`${error?.response?.data?.message}`)
      : console.log("Shareholders Not Found");
    return [];
  }
};
function* fetchShareholdersAPI() {
  yield put({ type: SHAREHOLDERS_BEGIN_LOADING });
  // SET SHAREHOLDERS STATE
  const shareholders = yield call(getAllShareholders, "/active");
  yield put(fetchShareholders(shareholders.data.data));
  // SET SHAREHOLDERS DROPDOWN STATE
  const shareholders_dropdown = shareholders.data.data.map((item) => {
    let label = `${item.folio_number} (${item.shareholder_name})`;
    return { label: label, value: item.folio_number };
  });
  yield put(fetchShareholdersDropdown(shareholders_dropdown));
  // SET PHYSICAL SHAREHOLDERS
  yield put(
    fetchPhysicalShareholders(
      shareholders.data.data.filter((item) => item.cdc_key === "NO")
    )
  );

  // SET SHAREHOLDERS PHYSICAL DROPDOWN STATE
  const physical_shareholders_dropdown = shareholders.data.data
    .filter((item) => item.cdc_key === "NO")
    .map((item) => {
      let label = `${item.folio_number} (${item.shareholder_name}) `;
      return { label: label, value: item.folio_number };
    });
  yield put(fetchPhysicalShareholdersDropdown(physical_shareholders_dropdown));
  // SET ELECTRONIC SHAREHOLDERS
  yield put(
    fetchElectronicShareholders(
      shareholders.data.data.filter((item) => item.cdc_key === "YES")
    )
  );
  // SET SHAREHOLDERS ELECTRONIC DROPDOWN STATE
  const electronic_shareholders_dropdown = shareholders.data.data
    .filter((item) => item.cdc_key === "YES")
    .map((item) => {
      let label = `${item.folio_number} (${item.shareholder_name}) `;
      return { label: label, value: item.folio_number };
    });
  yield put(
    fetchElectronicShareholdersDropdown(electronic_shareholders_dropdown)
  );
  yield put({ type: SHAREHOLDERS_END_LOADING });
}
function* fetchInactiveShareholdersAPI() {
  yield put({ type: INACTIVE_SHAREHOLDERS_BEGIN_LOADING });
  const shareholders = yield call(getAllShareholders);
  yield put(fetchInactiveShareholders(shareholders.data.data));
  const shareholders_dropdown = shareholders.data.data.map((item) => {
    let label = `${item.folio_number} (${item.shareholder_name}) `;
    return { label: label, value: item.folio_number };
  });
  yield put(fetchInactiveShareholdersDropdown(shareholders_dropdown));
  yield put({ type: INACTIVE_SHAREHOLDERS_END_LOADING });
}

// WATCHER
export function* watcherShareholders() {
  yield takeEvery(WATCH_SHAREHOLDERS, fetchShareholdersAPI);
  // INACTIVE
  yield takeEvery(WATCH_INACTIVE_SHAREHOLDERS, fetchInactiveShareholdersAPI);
}
