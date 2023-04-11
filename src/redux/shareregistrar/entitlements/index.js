import { call, put, takeEvery, select } from "redux-saga/effects";

import { getCompanies } from "../../../store/services/company.service";

import { toast } from "react-toastify";
import {
  WATCH_ENTITLEMENTS,
  WATCH_ENTITLEMENTS_DROPDOWN,
  ENTITLEMENTS_BEGIN_DROPDOWN_LOADING,
  ENTITLEMENTS_BEGIN_LOADING,
  ENTITLEMENTS_END_DROPDOWN_LOADING,
  ENTITLEMENTS_END_LOADING,
} from "../../actionTypes";
import { getCorporateEntitlement } from "../../../store/services/corporate.service";
import { entitlement_id_setter } from "../../../store/services/dropdown.service";
import { fetchEntitlementsDropDown, fetchEntitlements } from "./action";

const email = sessionStorage.getItem("email") || "";
const getAllEntitlements = async () => {
  try {
    const response = await getCorporateEntitlement(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(error?.response?.data?.message)
      : console.log("Entitlements Not Found");
    return [];
  }
};
function* fetchEntitlementAPI() {
  yield put({ type: ENTITLEMENTS_BEGIN_LOADING });
  const entitlements = yield call(getAllEntitlements);
  yield put(fetchEntitlements(entitlements.data.data));
  const entitlments_dropdown = entitlements.data.data.map((item) => {
    return { label: item.entitlement_id, value: item.entitlement_id };
  });
  yield put(fetchEntitlementsDropDown(entitlments_dropdown));
  yield put({ type: ENTITLEMENTS_END_LOADING });
}
export function* watcherEntitlements() {
  yield takeEvery(WATCH_ENTITLEMENTS, fetchEntitlementAPI);
}
