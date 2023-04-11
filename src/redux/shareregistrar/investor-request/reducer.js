import {
  GET_INVESTORS_REQUEST,
  GET_INVESTORS_REQUEST_TYPES,
  INVESTOR_REQUEST_BEGIN_LOADING,
  INVESTOR_REQUEST_END_LOADING,
  INVESTOR_REQUEST_BEGIN_DROPDOWN_LOADING,
  INVESTOR_REQUEST_END_DROPDOWN_LOADING,
} from "../../../redux/actionTypes";
const initial_state = {
  investor_request_data: [],
  investor_request_types: [],
  investor_request_loading: false,
  investor_request_types_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_INVESTORS_REQUEST:
      return { ...state, investor_request_data: action.payload };
    case INVESTOR_REQUEST_BEGIN_LOADING:
      return { ...state, investor_request_loading: true };
    case INVESTOR_REQUEST_END_LOADING:
      return { ...state, investor_request_loading: false };
    case INVESTOR_REQUEST_BEGIN_DROPDOWN_LOADING:
      return { ...state, investor_request_types_loading: true };
    case INVESTOR_REQUEST_END_DROPDOWN_LOADING:
      return { ...state, investor_request_types_loading: false };
    case GET_INVESTORS_REQUEST_TYPES:
      return { ...state, investor_request_types: action.payload };
    default:
      return state;
  }
};
