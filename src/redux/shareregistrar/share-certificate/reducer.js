import {
  GET_SHARE_CERTIFICATES,
  GET_SHARE_CERTIFICATES_DROPDOWN,
  SHARE_CERTIFICATES_BEGIN_DROPDOWN_LOADING,
  SHARE_CERTIFICATES_BEGIN_LOADING,
  SHARE_CERTIFICATES_END_DROPDOWN_LOADING,
  SHARE_CERTIFICATES_END_LOADING,
} from "../../../redux/actionTypes";
const initial_state = {
  share_certificates_data: [],
  share_certificates_dropdown: [],
  share_certificates_loading: false,
  share_certificates_dropdown_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_SHARE_CERTIFICATES:
      return { ...state, share_certificates_data: action.payload };
    case SHARE_CERTIFICATES_BEGIN_LOADING:
      return { ...state, share_certificates_loading: true };
    case SHARE_CERTIFICATES_END_LOADING:
      return { ...state, share_certificates_loading: false };
    case SHARE_CERTIFICATES_BEGIN_DROPDOWN_LOADING:
      return { ...state, share_certificates_dropdown_loading: true };
    case SHARE_CERTIFICATES_END_DROPDOWN_LOADING:
      return { ...state, share_certificates_dropdown_loading: false };

    case GET_SHARE_CERTIFICATES_DROPDOWN:
      return { ...state, share_certificates_dropdown: action.payload };
    default:
      return state;
  }
};
