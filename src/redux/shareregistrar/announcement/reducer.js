import {
  GET_ANNOUNCEMENTS,
  GET_ANNOUNCEMENTS_DROPDOWN,
  ANNOUNCEMENTS_BEGIN_LOADING,
  ANNOUNCEMENTS_END_LOADING,
  ANNOUNCEMENTS_BEGIN_DROPDOWN_LOADING,
  ANNOUNCEMENTS_END_DROPDOWN_LOADING,
} from "../../../redux/actionTypes";
const initial_state = {
  announcement_data: [],
  announcement_dropdown: [],
  announcement_data_loading: false,
  announcement_dropdown_loading: false,
};
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_ANNOUNCEMENTS:
      return { ...state, announcement_data: action.payload };
    case GET_ANNOUNCEMENTS_DROPDOWN:
      return { ...state, announcement_dropdown: action.payload };
    case ANNOUNCEMENTS_BEGIN_LOADING:
      return { ...state, announcement_data_loading: true };
    case ANNOUNCEMENTS_END_LOADING:
      return { ...state, announcement_data_loading: false };
    case ANNOUNCEMENTS_BEGIN_DROPDOWN_LOADING:
      return { ...state, announcement_dropdown_loading: true };
    case ANNOUNCEMENTS_END_DROPDOWN_LOADING:
      return { ...state, announcement_dropdown_loading: false };
    default:
      return state;
  }
};
