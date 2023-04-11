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

export default function ViewCertificateHistory({ setViewFlag }) {
  const baseEmail = sessionStorage.getItem("email") || "";
  const cert_history = JSON.parse(
    sessionStorage.getItem("selectedCertificateHistory")
  );
  const [checkList, setCheckList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckList, setShowCheckList] = useState(false);
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedCertificateHistory", JSON.stringify({}));
    };
  }, []);

  return (
    <div>
      <Fragment>
        <div className="row">
          {cert_history.map((cert) => (
            <div className="col-md-3">
              <div className="card trans-req-card">
                <div className="card-header font-primary b-t-primary">
                  <h6>
                    <i className="fa fa-history mr-2"></i>
                    {cert.action}
                  </h6>
                </div>
                <div className="card-body text-center">
                  {!!cert.from_folio && (
                    <>
                      <p className="f-w-600">From Shareholder</p>
                      <p className="font-success">{cert.from_folio}</p>
                    </>
                  )}
                  {!!cert.folio_number && (
                    <>
                      <p className="f-w-600">To Shareholder</p>
                      <p className="font-success">{cert.folio_number}</p>
                    </>
                  )}
                  {!!cert.by_email && (
                    <p className="font-primary">
                      <i className="fa fa-user"></i> {cert.by_email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    </div>
  );
}
