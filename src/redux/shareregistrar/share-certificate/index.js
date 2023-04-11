import { call, put, takeEvery, select } from "redux-saga/effects";

import {
  certificate_setter,
  txn_type_setter,
} from "../../../store/services/dropdown.service";

import {
  fetchShareCertificatesDropdown,
  fetchShareCertificates,
} from "./action";
import { toast } from "react-toastify";
import {
  SHARE_CERTIFICATES_BEGIN_DROPDOWN_LOADING,
  SHARE_CERTIFICATES_BEGIN_LOADING,
  SHARE_CERTIFICATES_END_DROPDOWN_LOADING,
  SHARE_CERTIFICATES_END_LOADING,
  WATCH_SHARE_CERTIFICATES,
  WATCH_SHARE_CERTIFICATES_DROPDOWN,
} from "../../actionTypes";
import { getShareCertificates } from "../../../store/services/shareCertificate.service";

const getAllShareCertificates = async () => {
  const email = sessionStorage.getItem("email");
  try {
    const response = await getShareCertificates(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(error?.response?.data?.message)
      : console.log("Certificates Requests Not Found");
    return [];
  }
};

function* fetchShareCertificatesAPI() {
  yield put({ type: SHARE_CERTIFICATES_BEGIN_LOADING });
  const certificates = yield call(getAllShareCertificates);
  yield put(fetchShareCertificates(certificates.data.data));
  const certificates_dropdown = certificates.data.data.map((item) => {
    let label = `${item.code} - ${item.company_code}`;
    return { label: label, value: item.code };
  });
  yield put(fetchShareCertificatesDropdown(certificates_dropdown));
  yield put({ type: SHARE_CERTIFICATES_END_LOADING });
}

export function* watcherShareCertificatess() {
  yield takeEvery(WATCH_SHARE_CERTIFICATES, fetchShareCertificatesAPI);
}
