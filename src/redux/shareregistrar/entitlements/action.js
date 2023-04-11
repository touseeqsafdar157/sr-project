import {
  GET_ENTITLEMENTS,
  GET_ENTITLEMENTS_DROPDOWN,
  WATCH_ENTITLEMENTS,
  WATCH_ENTITLEMENTS_DROPDOWN,
} from "../../../redux/actionTypes";

export const watchEntitlements = () => ({ type: WATCH_ENTITLEMENTS });

export const watchEntitlementsDropDown = () => ({
  type: WATCH_ENTITLEMENTS_DROPDOWN,
});

export const fetchEntitlements = (entitlements) => ({
  type: GET_ENTITLEMENTS,
  payload: entitlements,
});
export const fetchEntitlementsDropDown = (dropdown) => ({
  type: GET_ENTITLEMENTS_DROPDOWN,
  payload: dropdown,
});
