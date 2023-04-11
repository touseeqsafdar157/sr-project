import {
  GET_TRANSACTION_REQUEST,
  GET_TRANSACTION_REQUEST_DROPDOWN,
  GET_TRANSACTION_REQUEST_TYPES,
  GET_TRANSACTION_LISTING,
  WATCH_TRANSACTION_LISTING,
  WATCH_TRANSACTION_REQUEST,
  WATCH_TRANSACTION_REQUEST_DROPDOWN,
  WATCH_TRANSACTION_REQUEST_TYPES,
} from "../../../redux/actionTypes";

export const watchTransactionRequest = () => ({
  type: WATCH_TRANSACTION_REQUEST,
});

export const watchTransactionListing = () => ({
  type: WATCH_TRANSACTION_LISTING,
});

export const watchTransactionRequestDropdown = () => ({
  type: WATCH_TRANSACTION_REQUEST_DROPDOWN,
});

export const watchTransactionRequestTypes = () => ({
  type: WATCH_TRANSACTION_REQUEST_TYPES,
});

export const fetchTransactionRequest = (transaction_requests) => ({
  type: GET_TRANSACTION_REQUEST,
  payload: transaction_requests,
});
export const fetchTransactionListing = (transaction_listing) => ({
  type: GET_TRANSACTION_LISTING,
  payload: transaction_listing,
});
export const fetchTransactionRequestDropdown = (dropdown) => ({
  type: GET_TRANSACTION_REQUEST_DROPDOWN,
  payload: dropdown,
});

export const fetchTransactionRequestTypes = (dropdown) => ({
  type: GET_TRANSACTION_REQUEST_TYPES,
  payload: dropdown,
});
