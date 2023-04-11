import {
  ROLES_BEGIN_DROPDOWN_LOADING,
  ROLES_BEGIN_LOADING,
  ROLES_END_DROPDOWN_LOADING,
  ROLES_END_LOADING,
  GET_ROLES,
  GET_ROLES_DROPDOWN,
} from "../../../redux/actionTypes";
const initial_state = {
  roles_data: [],
  roles_dropdown: [],
  roles_data_loading: false,
  roles_dropdown_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_ROLES:
      return { ...state, roles_data: action.payload };
    case GET_ROLES_DROPDOWN:
      return { ...state, roles_dropdown: action.payload };
    case ROLES_BEGIN_LOADING:
      return { ...state, roles_data_loading: true };
    case ROLES_BEGIN_DROPDOWN_LOADING:
      return { ...state, roles_dropdown_loading: true };
    case ROLES_END_LOADING:
      return { ...state, roles_data_loading: false };
    case ROLES_END_DROPDOWN_LOADING:
      return { ...state, roles_dropdown_loading: false };
    default:
      return state;
  }
};
