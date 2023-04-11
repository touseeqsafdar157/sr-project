import { call, put, takeEvery, select } from "redux-saga/effects";

import { getCompanies } from "../../../store/services/company.service";

import {
  beginCompanyLoading,
  endCompanyLoading,
  fetchCompanies,
  fetchCompaniesDropDown,
  fetchCompaniesSymbolDropDown,
} from "./action";
import { toast } from "react-toastify";
import {
  WATCH_COMPANIES_DROPDOWN,
  WATCH_COMPANIES,
  COMPANIES_BEGIN_LOADING,
  COMPANIES_END_LOADING,
  COMPANIES_BEGIN_DROPDOWN_LOADING,
  COMPANIES_END_DROPDOWN_LOADING,
  COMPANIES_SYMBOL_BEGIN_LOADING,
  COMPANIES_SYMBOL_END_LOADING,
  WATCH_COMPANIES_SYMBOLS,
} from "../../actionTypes";

const email = sessionStorage.getItem("email") || "";
const getAllCompanies = async () => {
  try {
    const response = await getCompanies(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(error?.response?.data?.message)
      : console.log("Companies Not Found");
    return [];
  }
};
function* fetchCompaniesAPI() {
  yield put({ type: COMPANIES_BEGIN_LOADING });
  const companies = yield call(getAllCompanies);

  // SET COMPANIES DATA
  yield put(fetchCompanies(companies.data.data));
  // SET COMPANIES DROPDOWN DATA
  const companies_dropdown = companies.data.data.map((item) => {
    let label = `${item.code} - ${item.company_name}`;
    return { label: label, value: item.code };
  });
  yield put(fetchCompaniesDropDown(companies_dropdown));
  // SET COMPANIES SYMBOL DATA
  const companies_symbol_dropdown = companies.data.data.map((item) => {
    let label = `${item.symbol} (${item.code}) (${item.company_name})`;
    return { label: label, value: item.symbol };
  });
  yield put(fetchCompaniesSymbolDropDown(companies_symbol_dropdown));

  yield put({ type: COMPANIES_END_LOADING });
}
export function* watcherCompanies() {
  yield takeEvery(WATCH_COMPANIES, fetchCompaniesAPI);
}
