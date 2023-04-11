import {
  GET_ANNOUNCEMENTS,
  GET_ANNOUNCEMENTS_DROPDOWN,
  WATCH_ANNOUNCEMENTS,
  WATCH_ANNOUNCEMENTS_DROPDOWN,
} from "../../../redux/actionTypes";

export const watchAnnouncements = () => ({ type: WATCH_ANNOUNCEMENTS });

export const watchAnnouncementsDropDown = () => ({
  type: WATCH_ANNOUNCEMENTS_DROPDOWN,
});

export const fetchAnnouncements = (entitlements) => ({
  type: GET_ANNOUNCEMENTS,
  payload: entitlements,
});
export const fetchAnnouncementsDropDown = (dropdown) => ({
  type: GET_ANNOUNCEMENTS_DROPDOWN,
  payload: dropdown,
});
