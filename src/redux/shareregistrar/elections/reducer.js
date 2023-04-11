import {
  ELECTIONS_BEGIN_DROPDOWN_LOADING,
  ELECTIONS_BEGIN_LOADING,
  ELECTIONS_END_DROPDOWN_LOADING,
  ELECTIONS_END_LOADING,
  GET_ELECTIONS,
  GET_ELECTIONS_DROPDOWN,
} from "../../../redux/actionTypes";
const initial_state = {
  elections_data: [],
  elections_dropdown: [],
  elections_data_loading: false,
  elections_dropdown_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_ELECTIONS:
      return { ...state, elections_data: action.payload };
    case GET_ELECTIONS_DROPDOWN:
      return { ...state, elections_dropdown: action.payload };
    case ELECTIONS_BEGIN_LOADING:
      return { ...state, elections_data_loading: true };
    case ELECTIONS_BEGIN_DROPDOWN_LOADING:
      return { ...state, elections_dropdown_loading: true };
    case ELECTIONS_END_LOADING:
      return { ...state, elections_data_loading: false };
    case ELECTIONS_END_DROPDOWN_LOADING:
      return { ...state, elections_dropdown_loading: false };
    default:
      return state;
  }
};
