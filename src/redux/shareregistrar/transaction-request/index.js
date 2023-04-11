import { call, put, takeEvery, select } from "redux-saga/effects";

import { txn_type_setter } from "../../../store/services/dropdown.service";

import {
  fetchTransactionListing,
  fetchTransactionRequest,
  fetchTransactionRequestTypes,
} from "./action";
import { toast } from "react-toastify";
import {
  TRANSACTION_REQUEST_BEGIN_DROPDOWN_LOADING,
  TRANSACTION_REQUEST_BEGIN_LOADING,
  TRANSACTION_REQUEST_END_DROPDOWN_LOADING,
  TRANSACTION_REQUEST_END_LOADING,
  WATCH_TRANSACTION_REQUEST,
  WATCH_TRANSACTION_REQUEST_TYPES,
  WATCH_TRANSACTION_LISTING,
  TRANSACTION_LISTING_BEGIN_LOADING,
  TRANSACTION_LISTING_END_LOADING,
} from "../../actionTypes";
import {
  getTransactions,
  getTransactionsListing,
} from "../../../store/services/transaction.service";

const getAllTransactionRequests = async () => {
  const email = sessionStorage.getItem("email");
  try {
    const response = await getTransactions(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(error?.response?.data?.message)
      : console.log("Transaction Requests Requests Not Found");
    return [];
  }
};

const getAllTransactions = async () => {
  const email = sessionStorage.getItem("email");
  try {
    const response = await getTransactionsListing(email);
    if (response.status === 200) return response;
    else return [];
  } catch (error) {
    !!error?.response?.data?.message
      ? toast.error(error?.response?.data?.message)
      : console.log("Transactions Not Found");
    return [];
  }
};

function* fetchTransactionRequestAPI() {
  yield put({ type: TRANSACTION_REQUEST_BEGIN_LOADING });
  const investors = yield call(getAllTransactionRequests);
  yield put(fetchTransactionRequest(investors.data.data));
  yield put({ type: TRANSACTION_REQUEST_END_LOADING });
}

function* fetchTransactionListingtAPI() {
  yield put({ type: TRANSACTION_LISTING_BEGIN_LOADING });
  const transactions = yield call(getAllTransactions);
  yield put(fetchTransactionListing(transactions.data.data));
  yield put({ type: TRANSACTION_LISTING_END_LOADING });
}

export function* watcherTransactionRequests() {
  yield takeEvery(WATCH_TRANSACTION_REQUEST, fetchTransactionRequestAPI);
  yield takeEvery(WATCH_TRANSACTION_LISTING, fetchTransactionListingtAPI);
}
