import { GET_FEATURES, WATCH_FEATURES } from "../../../redux/actionTypes";

export const watchFeatures = () => ({ type: WATCH_FEATURES });

export const fetchFeatures = (features) => ({
  type: GET_FEATURES,
  payload: features,
});
