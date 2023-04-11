import {
  GET_INVESTORS,
  GET_INVESTORS_DROPDOWN,
  INVESTOR_BEGIN_DROPDOWN_LOADING,
  INVESTOR_BEGIN_LOADING,
  INVESTOR_END_DROPDOWN_LOADING,
  INVESTOR_END_LOADING,
} from "../../../redux/actionTypes";
const initial_state = {
  investors_data: [],
  investors_dropdown: [],
  investors_data_loading: false,
  investors_dropdown_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_INVESTORS:
      return { ...state, investors_data: action.payload };
    case GET_INVESTORS_DROPDOWN:
      return { ...state, investors_dropdown: action.payload };
    case INVESTOR_BEGIN_LOADING:
      return { ...state, investors_data_loading: true };
    case INVESTOR_END_LOADING:
      return { ...state, investors_data_loading: false };
    case INVESTOR_BEGIN_DROPDOWN_LOADING:
      return { ...state, investors_dropdown_loading: true };
    case INVESTOR_END_DROPDOWN_LOADING:
      return { ...state, investors_dropdown_loading: false };

    default:
      return state;
  }
};
