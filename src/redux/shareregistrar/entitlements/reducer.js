import {
  GET_ENTITLEMENTS,
  GET_ENTITLEMENTS_DROPDOWN,
  ENTITLEMENTS_BEGIN_LOADING,
  ENTITLEMENTS_END_LOADING,
  ENTITLEMENTS_BEGIN_DROPDOWN_LOADING,
  ENTITLEMENTS_END_DROPDOWN_LOADING,
} from "../../../redux/actionTypes";
const initial_state = {
  entitlement_data: [],
  entitlement_dropdown: [],
  entitlement_data_loading: false,
  entitlement_dropdown_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_ENTITLEMENTS:
      return { ...state, entitlement_data: action.payload };
    case GET_ENTITLEMENTS_DROPDOWN:
      return { ...state, entitlement_dropdown: action.payload };
    case ENTITLEMENTS_BEGIN_LOADING:
      return { ...state, entitlement_data_loading: true };
    case ENTITLEMENTS_END_LOADING:
      return { ...state, entitlement_data_loading: false };
    case ENTITLEMENTS_BEGIN_DROPDOWN_LOADING:
      return { ...state, entitlement_dropdown_loading: true };
    case ENTITLEMENTS_END_DROPDOWN_LOADING:
      return { ...state, entitlement_dropdown_loading: false };
    default:
      return state;
  }
};
