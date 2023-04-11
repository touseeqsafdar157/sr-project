import {
  COMPANIES_BEGIN_DROPDOWN_LOADING,
  COMPANIES_BEGIN_LOADING,
  COMPANIES_END_DROPDOWN_LOADING,
  COMPANIES_END_LOADING,
  GET_COMPANIES,
  GET_COMPANIES_DROPDOWN,
  GET_COMPANIES_SYMBOLS,
} from "../../../redux/actionTypes";
const initial_state = {
  companies_data: [],
  companies_dropdown: [],
  companies_symbol_dropdown: [],
  companies_data_loading: false,
  companies_data_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_COMPANIES:
      return { ...state, companies_data: action.payload };
    case GET_COMPANIES_DROPDOWN:
      return { ...state, companies_dropdown: action.payload };
    case COMPANIES_BEGIN_LOADING:
      return { ...state, companies_data_loading: true };
    case COMPANIES_BEGIN_DROPDOWN_LOADING:
      return { ...state, companies_data_loading: true };

    case COMPANIES_END_LOADING:
      return { ...state, companies_data_loading: false };
    case COMPANIES_END_DROPDOWN_LOADING:
      return { ...state, companies_data_loading: false };
    case GET_COMPANIES_SYMBOLS:
      return { ...state, companies_symbol_dropdown: action.payload };
    default:
      return state;
  }
};
