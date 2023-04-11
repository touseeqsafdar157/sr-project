import { call, put, takeEvery, select } from "redux-saga/effects";

import { getRoles } from "../../../store/services/role.service";

import {
  beginCompanyLoading,
  endCompanyLoading,
  fetchRoles,
  fetchRolesDropDown,
  fetchRolesSymbolDropDown,
} from "./action";
import { toast } from "react-toastify";
import {
  WATCH_ROLES_DROPDOWN,
  WATCH_ROLES,
  ROLES_BEGIN_LOADING,
  ROLES_END_LOADING,
  ROLES_BEGIN_DROPDOWN_LOADING,
  ROLES_END_DROPDOWN_LOADING,
} from "../../actionTypes";

const email = sessionStorage.getItem("email") || "";
const getAllRoles = async () => {
  try {
    const response = await getRoles(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(error?.response?.data?.message)
      : console.log("Roles Not Found");
    return [];
  }
};
function* fetchRolesAPI() {
  yield put({ type: ROLES_BEGIN_LOADING });
  const roles = yield call(getAllRoles);
  yield put(fetchRoles(roles.data.data));
  const roles_dropdown = roles.data.data.map((item) => {
    let label = `${item.role_name}`;
    return { label: label, value: item.role_name };
  });
  yield put(fetchRolesDropDown(roles_dropdown));
  yield put({ type: ROLES_END_LOADING });
}

export function* watcherRoles() {
  yield takeEvery(WATCH_ROLES, fetchRolesAPI);
}
