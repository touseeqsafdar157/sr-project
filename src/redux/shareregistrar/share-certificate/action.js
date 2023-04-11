import {
  GET_SHARE_CERTIFICATES,
  GET_SHARE_CERTIFICATES_DROPDOWN,
  WATCH_SHARE_CERTIFICATES_DROPDOWN,
  WATCH_SHARE_CERTIFICATES,
} from "../../../redux/actionTypes";

export const watchShareCertificates = () => ({
  type: WATCH_SHARE_CERTIFICATES,
});

export const watchShareCertificatesDropdown = () => ({
  type: WATCH_SHARE_CERTIFICATES_DROPDOWN,
});

export const fetchShareCertificates = (certificates) => ({
  type: GET_SHARE_CERTIFICATES,
  payload: certificates,
});
export const fetchShareCertificatesDropdown = (dropdown) => ({
  type: GET_SHARE_CERTIFICATES_DROPDOWN,
  payload: dropdown,
});
