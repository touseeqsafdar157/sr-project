import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import {
  addNewTransaction,
  getTransactionTypes,
  updateTransactionStatus,
} from "../../../store/services/transaction.service";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { toast } from "react-toastify";
import { darkStyle } from "../../defaultStyles";
import Select from "react-select";
import LoadableButton from "../../common/loadables";
import {
  txn_type_setter,
  request_id_setter,
  folio_setter,
  symbol_setter,
  announcement_id_setter,
  entitlement_id_setter,
  company_code_setter,
} from "../../../store/services/dropdown.service";

export default function ViewTxnHistory({ setViewFlag }) {
  const baseEmail = sessionStorage.getItem("email") || "";
  const txn_history = JSON.parse(sessionStorage.getItem("selectedTxnHistory"));
  const [checkList, setCheckList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckList, setShowCheckList] = useState(false);
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedTxnHistory", JSON.stringify({}));
    };
  }, []);

  return (
    <div>
      <Fragment>
        <div className="row">
          {txn_history.map((txn, i) => (
            <div className="col-md-3" key={i}>
              <div className="card trans-req-card ">
                <div className="card-header font-primary b-t-primary">
                  <h6>
                    <i className="fa fa-history mr-3"></i>
                    {txn.action}
                  </h6>
                </div>

                <div className="card-body text-center">
                  <p className="card-text">At</p>
                  <p className="font-primary">{txn.at}</p>

                  <p className="mb-0 text-capitalize">
                    <i className="fa fa-user"></i> {txn.by_role}
                  </p>
                  <small className="text-muted font-primary">{txn.by}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    </div>
  );
}
