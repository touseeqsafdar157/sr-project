import { call, put, takeEvery, select } from "redux-saga/effects";

import { getCompanies } from "../../../store/services/company.service";

import { fetchAnnouncements, fetchAnnouncementsDropDown } from "./action";
import { toast } from "react-toastify";
import {
  WATCH_ANNOUNCEMENTS,
  WATCH_ANNOUNCEMENTS_DROPDOWN,
  ANNOUNCEMENTS_BEGIN_DROPDOWN_LOADING,
  ANNOUNCEMENTS_BEGIN_LOADING,
  ANNOUNCEMENTS_END_DROPDOWN_LOADING,
  ANNOUNCEMENTS_END_LOADING,
} from "../../actionTypes";
import { getCorporateAnnouncement } from "../../../store/services/corporate.service";
import { announcement_id_setter } from "../../../store/services/dropdown.service";

const email = sessionStorage.getItem("email") || "";
const getAllAnnouncement = async () => {
  try {
    const response = await getCorporateAnnouncement(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(error?.response?.data?.message)
      : console.log("Announcements Not Found");
    return [];
  }
};
function* fetchAnnouncementsAPI() {
  // SET ANNOUNCEMENTS DATA
  yield put({ type: ANNOUNCEMENTS_BEGIN_LOADING });
  const announcements = yield call(getAllAnnouncement);
  yield put(fetchAnnouncements(announcements.data.data));
  // SET ANNOUNCEMENTS DROPDOWN
  const announcement_dropdown = announcements.data.data.map((item) => {
    let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
    return { label: label, value: item.announcement_id };
  });
  yield put(fetchAnnouncementsDropDown(announcement_dropdown));
  yield put({ type: ANNOUNCEMENTS_END_LOADING });
}

export function* watcherAnnouncements() {
  yield takeEvery(WATCH_ANNOUNCEMENTS, fetchAnnouncementsAPI);
}
