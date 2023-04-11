import {
  GET_TRANSACTION_LISTING,
  GET_TRANSACTION_REQUEST,
  GET_TRANSACTION_REQUEST_TYPES,
  TRANSACTION_LISTING_BEGIN_LOADING,
  TRANSACTION_LISTING_END_LOADING,
  TRANSACTION_REQUEST_BEGIN_DROPDOWN_LOADING,
  TRANSACTION_REQUEST_BEGIN_LOADING,
  TRANSACTION_REQUEST_END_DROPDOWN_LOADING,
  TRANSACTION_REQUEST_END_LOADING,
} from "../../../redux/actionTypes";
const initial_state = {
  transaction_request_data: [],
  transaction_request_types: [],
  transaction_listing_data: [],
  transaction_request_data_loading: false,
  transaction_request_types_loading: false,
  transaction_listing_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_TRANSACTION_REQUEST:
      return { ...state, transaction_request_data: action.payload };
    case GET_TRANSACTION_REQUEST_TYPES:
      return { ...state, transaction_request_types: action.payload };
    case GET_TRANSACTION_LISTING:
      return { ...state, transaction_listing_data: action.payload };
    case TRANSACTION_LISTING_BEGIN_LOADING:
      return { ...state, transaction_listing_loading: true };
    case TRANSACTION_LISTING_END_LOADING:
      return { ...state, transaction_listing_loading: false };
    case TRANSACTION_REQUEST_BEGIN_LOADING:
      return { ...state, transaction_request_data_loading: true };
    case TRANSACTION_REQUEST_END_LOADING:
      return { ...state, transaction_request_data_loading: false };
    case TRANSACTION_REQUEST_BEGIN_DROPDOWN_LOADING:
      return { ...state, transaction_request_types_loading: true };
    case TRANSACTION_REQUEST_END_DROPDOWN_LOADING:
      return { ...state, transaction_request_types_loading: false };
    default:
      return state;
  }
};
