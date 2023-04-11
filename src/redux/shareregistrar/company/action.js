import {
  COMPANIES_BEGIN_DROPDOWN_LOADING,
  COMPANIES_BEGIN_LOADING,
  COMPANIES_END_DROPDOWN_LOADING,
  COMPANIES_END_LOADING,
  GET_COMPANIES,
  GET_COMPANIES_DROPDOWN,
  GET_COMPANIES_SYMBOLS,
  WATCH_COMPANIES,
  WATCH_COMPANIES_DROPDOWN,
} from "../../../redux/actionTypes";

export const watchCompanies = () => ({ type: WATCH_COMPANIES });

export const watchCompaniesDropDown = () => ({
  type: WATCH_COMPANIES_DROPDOWN,
});

export const beginCompanyLoading = () => ({
  type: COMPANIES_BEGIN_LOADING,
});

export const beginCompanyDropdownLoading = () => ({
  type: COMPANIES_BEGIN_DROPDOWN_LOADING,
});

export const endCompanyLoading = () => ({
  type: COMPANIES_END_LOADING,
});

export const endCompanyDropdownLoading = () => ({
  type: COMPANIES_END_DROPDOWN_LOADING,
});

export const fetchCompanies = (companies) => ({
  type: GET_COMPANIES,
  payload: companies,
});
export const fetchCompaniesDropDown = (dropdown) => ({
  type: GET_COMPANIES_DROPDOWN,
  payload: dropdown,
});
export const fetchCompaniesSymbolDropDown = (dropdown) => ({
  type: GET_COMPANIES_SYMBOLS,
  payload: dropdown,
});
