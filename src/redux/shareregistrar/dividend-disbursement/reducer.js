import {
  GET_DIVIDEND,
  DIVIDEND_BEGIN_LOADING,
  DIVIDEND_END_LOADING,
} from "../../../redux/actionTypes";
const initial_state = {
  dividend_data: [],
  dividend_data_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_DIVIDEND:
      return { ...state, dividend_data: action.payload };
    case DIVIDEND_BEGIN_LOADING:
      return { ...state, dividend_data_loading: true };
    case DIVIDEND_END_LOADING:
      return { ...state, dividend_data_loading: false };
    default:
      return state;
  }
};
