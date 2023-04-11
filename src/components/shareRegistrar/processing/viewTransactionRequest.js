import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import {
  addNewTransaction,
  getTransactionTypes,
  updateTransactionStatus,
} from "../../../store/services/transaction.service";
import {
  WATCH_SHARE_CERTIFICATES_DROPDOWN,
  WATCH_SHARE_CERTIFICATES,
  WATCH_SHAREHOLDERS,
  WATCH_SHAREHOLDERS_DROPDOWN,
  WATCH_TRANSACTION_LISTING,
} from "../../../redux/actionTypes";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { darkStyle, disabledStyles } from "../../defaultStyles";
import Select from "react-select";
import LoadableButton from "../../common/loadables";
import { WATCH_TRANSACTION_REQUEST } from "../../../redux/actionTypes";
import CheckListContent from "./checkListContent";
import { numberWithCommas } from "utilities/utilityFunctions";

export default function ViewTransactionRequest({ setViewFlag }) {
  const baseEmail = sessionStorage.getItem("email") || "";
  const dispatch = useDispatch();
  const transactionRequest = JSON.parse(
    sessionStorage.getItem("selectedTransactionRequest")
  );
  console.log("🚀 ~ file: viewTransactionRequest.js:31 ~ ViewTransactionRequest ~ transactionRequest:", transactionRequest)
  const [checkList, setCheckList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckList, setShowCheckList] = useState(false);
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedTransactionRequest", JSON.stringify({}));
    };
  }, []);

  useEffect(() => {
    if (showCheckList === true) {
      const getAllTransactionRequest = async () => {
        try {
          const response = await getTransactionTypes(baseEmail);
          if (response.status === 200) {
            setCheckList(
              response.data.data.find(
                (type) =>
                  type.transactionCode === transactionRequest.txn_type.value
              ).checklist
            );
          }
        } catch (error) {
          !!error?.response?.data?.message
            ? toast.error(error?.response?.data?.message)
            : toast.error("Transaction Types Not Found");
        }
      };
      getAllTransactionRequest();
    }
  }, [showCheckList]);

  return (
    <div>
      {/* Add Modal */}

      <Fragment>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>View Transaction</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="email">Transaction ID </label>
                  <input
                    type="text"
                    className="form-control"
                    value={transactionRequest.txn_id}
                    readOnly
                  />
                </div>
                {!!transactionRequest.request_id && (
                  <div className="form-group">
                    <label htmlFor="email">Transaction Request ID </label>
                    <input
                      type="text"
                      className="form-control"
                      value={transactionRequest.request_id}
                      readOnly
                    />
                  </div>
                )}
                {!!transactionRequest.transfer_no && (
                  <div className="form-group">
                    <label htmlFor="email">Transfer Number </label>
                    <input
                      type="text"
                      className="form-control"
                      value={transactionRequest.transfer_no}
                      readOnly
                    />
                  </div>
                )}
                {!!transactionRequest.execution_date && (
                  <div className="form-group">
                    <label htmlFor="email">Execution Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={transactionRequest.execution_date}
                      readOnly
                    />
                  </div>
                )}
                {!!transactionRequest.announcement_id.label && (
                  <div className="form-group">
                    <label htmlFor="email">Announcement ID </label>
                    <input
                      value={transactionRequest.announcement_id?.label || ''}
                      styles={disabledStyles}
                      type="text"
                      className="form-control"
                      disabled={true}
                    />
                  </div>
                )}

                {!!transactionRequest.entitlement_id.label && (
                  <div className="form-group">
                    <label htmlFor="email">Entitlement ID </label>
                    <input
                     value={transactionRequest.entitlement_id?.label|| ''}
                      styles={disabledStyles}
                      type="text"
                      className="form-control"
                      disabled={true}
                    />
                  </div>
                )}

                {!!transactionRequest.txn_type && (
                  <div className="form-group">
                    <label htmlFor="email">Txn Type </label>
                    <input
                      type="text"
                      className="form-control"
                      value={transactionRequest.txn_type}
                      readOnly
                    />
                  </div>
                )}
                {!!transactionRequest.symbol.label && (
                  <div className="form-group">
                    <label htmlFor="email">Symbol</label>
                    <input
                      value={transactionRequest.symbol?.label || ''}
                      styles={disabledStyles}
                      type="text"
                      className="form-control"
                     disabled={true}
                    />
                  </div>
                )}
                {!!transactionRequest.company_code.label && (
                  <div className="form-group">
                    <label htmlFor="email">Company Code</label>
                    <input
                      value={transactionRequest.company_code?.label || ''}
                      styles={disabledStyles}
                      type="text"
                      className="form-control"
                      disabled={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary"></div>
              <div className="card-body">
                {!!transactionRequest?.quantity && (
                  <div className="form-group">
                    <label htmlFor="email">Quantity</label>
                    <input
                      className="form-control text-right"
                      id="companyEmail"
                      type="text"
                      placeholder="Enter Quantity"
                      value={numberWithCommas(transactionRequest.quantity)}
                      readOnly
                    />
                  </div>
                )}
                {!!transactionRequest.from_folio.label && (
                  <div className="form-group">
                    <label htmlFor="email">From Folio Number </label>
                    <input
                      value={transactionRequest.from_folio?.label}
                      styles={disabledStyles}
                      type="text"
                      className="form-control"
                      disabled={true}
                    />
                  </div>
                )}
                {!!transactionRequest.folio_number.label && (
                  <div className="form-group">
                    <label htmlFor="email">To Folio</label>
                    <input
                      value={transactionRequest.folio_number?.label || ''}
                      styles={disabledStyles}
                      type="text"
                      className="form-control"
                     disabled={true}
                    />
                  </div>
                )}
                {!!transactionRequest.txn_date && (
                  <div className="form-group">
                    <label htmlFor="email">Txn Date</label>
                    <input
                      className="form-control"
                      id="companyEmail"
                      type="date"
                      placeholder="Enter Txn Date"
                      value={transactionRequest.txn_date}
                      readOnly
                    />
                  </div>
                )}
                {!!transactionRequest.settlement_date && (
                  <div className="form-group">
                    <label htmlFor="email">Settlement Date </label>
                    <input
                      className="form-control"
                      id="companyEmail"
                      type="date"
                      placeholder="Enter Settlement Date "
                      value={transactionRequest.settlement_date}
                      readOnly
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <div className="card-header b-t-primary"></div>
              <div className="card-body">
                {!!transactionRequest.price && (
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      className="form-control text-right"
                      id="price"
                      type="number"
                      min="0"
                      placeholder="Enter Price"
                      value={numberWithCommas(transactionRequest.price)}
                      readOnly
                    />
                  </div>
                )}

                {transactionRequest?.amount && (
                  <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                      className="form-control text-right"
                      min="0"
                      id="amount"
                      type="number"
                      placeholder="Enter Amount"
                      value={numberWithCommas(transactionRequest.amount)}
                      readOnly
                    />
                  </div>
                )}
                {!!transactionRequest.associated_txn && (
                  <div className="form-group">
                    <label htmlFor="processing_status">
                      Associated Transaction
                    </label>
                    <input
                      className="form-control"
                      id="processing_status"
                      type="text"
                      placeholder="Status"
                      value={transactionRequest.associated_txn}
                      readOnly
                    />
                  </div>
                )}
                {!!transactionRequest?.processing_status && (
                  <div className="form-group">
                    <label htmlFor="processing_status">Processing Status</label>
                    <input
                      className="form-control"
                      id="processing_status"
                      type="text"
                      placeholder="Status"
                      value={transactionRequest.processing_status}
                      readOnly
                    />
                  </div>
                )}

                {!!transactionRequest?.reference && (
                  <div className="form-group">
                    <label htmlFor="reference">Reference</label>
                    <input
                      className="form-control"
                      id="reference"
                      type="text"
                      placeholder="Enter Reference"
                      value={transactionRequest?.reference}
                      readOnly
                    />
                  </div>
                )}
                {!!transactionRequest.remarks && (
                  <div className="form-group">
                    <label htmlFor="reference">Remarks</label>
                    <input
                      className="form-control"
                      id="reference"
                      type="text"
                      placeholder="Enter Reference"
                      value={transactionRequest?.remarks}
                      readOnly
                    />
                  </div>
                )}

                {/* <div className="form-group">
                  <label htmlFor="associative">Associative Transaction</label>
                  <input
                    className="form-control"
                    id="associative"
                    type="text"
                    placeholder="Enter Associative Transaction" 
                    onChange={(e) => setAssociative_transaction(e.target.value)}
                  />
                  {associative_transactionError && (
                    <p className="error-color">* Associative Transaction is required</p>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="row mx-3">
          <div className="form-group">
            {transactionRequest.processing_status === "DISAPPROVED" ? (
              <button
                disabled
                style={{ cursor: "not-allowed" }}
                className="btn btn-danger"
              >
                Disapproved
              </button>
            ) : transactionRequest.processing_status === "APPROVED" ? (
              <button
                className="btn btn-success"
                style={{ cursor: "not-allowed" }}
              >
                Approved
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={(e) => setShowCheckList(true)}
              >
                Action
              </button>
            )}
          </div>
        </div> */}
      </Fragment>
    </div>
  );
}
