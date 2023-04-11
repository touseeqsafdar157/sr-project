import {
  GET_SHAREHOLDERS,
  GET_SHAREHOLDERS_DROPDOWN,
  GET_ELECTRONIC_SHAREHOLDERS,
  GET_ELECTRONIC_SHAREHOLDERS_DROPDOWN,
  GET_PHYSICAL_SHAREHOLDERS,
  GET_PHYSICAL_SHAREHOLDERS_DROPDOWN,
  GET_INACTIVE_SHAREHOLDERS_DROPDOWN,
  SHAREHOLDERS_BEGIN_LOADING,
  SHAREHOLDERS_END_LOADING,
  SHAREHOLDERS_BEGIN_DROPDOWN_LOADING,
  SHAREHOLDERS_END_DROPDOWN_LOADING,
  GET_INACTIVE_SHAREHOLDERS,
  INACTIVE_SHAREHOLDERS_END_LOADING,
  INACTIVE_SHAREHOLDERS_BEGIN_LOADING,
  UBO_LOADING
} from "../../../redux/actionTypes";
const initial_state = {
  shareholders_data: [],
  inactive_shareholders_data: [],
  inactive_shareholders_dropdown: [],
  shareholders_dropdown: [],
  physical_shareholders_data: [],
  physical_shareholders_dropdown: [],
  electronic_shareholders_data: [],
  electronic_shareholders_dropdown: [],
  shareholders_data_loading: false,
  shareholders_dropdown_loading: false,
  inactive_shareholders_data_loading: false,
  ubo_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_SHAREHOLDERS:
      return { ...state, shareholders_data: action.payload };
    case GET_INACTIVE_SHAREHOLDERS:
      return { ...state, inactive_shareholders_data: action.payload };
    case GET_INACTIVE_SHAREHOLDERS_DROPDOWN:
      return { ...state, inactive_shareholders_dropdown: action.payload };
    case GET_SHAREHOLDERS_DROPDOWN:
      return { ...state, shareholders_dropdown: action.payload };
    // PHYSICAL
    case GET_PHYSICAL_SHAREHOLDERS:
      return { ...state, physical_shareholders_data: action.payload };
    case GET_PHYSICAL_SHAREHOLDERS_DROPDOWN:
      return { ...state, physical_shareholders_dropdown: action.payload };
    case SHAREHOLDERS_BEGIN_LOADING:
      return { ...state, shareholders_data_loading: true };
    case INACTIVE_SHAREHOLDERS_END_LOADING:
      return { ...state, inactive_shareholders_data_loading: false };
    case INACTIVE_SHAREHOLDERS_BEGIN_LOADING:
      return { ...state, inactive_shareholders_data_loading: true };

    case SHAREHOLDERS_END_LOADING:
      return { ...state, shareholders_data_loading: false };
    case SHAREHOLDERS_BEGIN_DROPDOWN_LOADING:
      return { ...state, shareholders_dropdown_loading: true };
    case SHAREHOLDERS_END_DROPDOWN_LOADING:
      return { ...state, shareholders_dropdown_loading: false };
    // ELECTRONIC
    case GET_ELECTRONIC_SHAREHOLDERS:
      return { ...state, electronic_shareholders_data: action.payload };
    case GET_ELECTRONIC_SHAREHOLDERS_DROPDOWN:
      return { ...state, electronic_shareholders_dropdown: action.payload };
      case UBO_LOADING:
        return { ...state, ubo_loading: action.payload };
    default:
      return state;
  }
};
