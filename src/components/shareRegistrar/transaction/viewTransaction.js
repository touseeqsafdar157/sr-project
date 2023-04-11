import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { addNewTransaction } from "../../../store/services/transaction.service";
import { toast } from "react-toastify";
export default function ViewTransaction() {
  const data = JSON.parse(sessionStorage.getItem("selectedTransaction")) || "";
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedTransaction", JSON.stringify({}));
    };
  }, []);

  const [txn_id, setTxn_id] = useState(data.txn_id);
  const [request_id, setRequest_id] = useState(data.request_id);
  const [announcement_id, setAnnouncement_id] = useState(data.announcement_id);
  const [entitlement_id, setEntitlement_id] = useState(data.entitlement_id);
  const [folio_number, setFolio_number] = useState(data.folio_number);
  const [txn_type, setTxn_type] = useState(data.txn_type);
  const [symbol, setSymbol] = useState(data.symbol);
  const [quantity, setQuantity] = useState(data.quantity);
  const [from_folio, setFrom_folio] = useState(data.from_folio);
  const [to_folio, setTo_folio] = useState(data.to_folio);
  const [txn_date, setTxn_date] = useState(data.txn_date);
  const [settlement_date, setSettlement_date] = useState(data.settlement_date);

  return (
    <div>
      <Fragment> 
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>View Transaction</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="email">Txn ID </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="number"
                    placeholder="Enter Request ID"
                    value={txn_id}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Request ID </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="number"
                    placeholder="Enter Request ID"
                    value={request_id}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Announcement ID </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="number"
                    placeholder="Enter Announcement ID"
                    value={announcement_id}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Entitlement ID </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="number"
                    placeholder="Enter Entitlement ID"
                    value={entitlement_id}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Folio Number </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="number"
                    placeholder="Enter Folio Number"
                    value={folio_number}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Txn Type </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter Txn Type "
                    value={txn_type}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                {/* <h5>Add Transaction</h5> */}
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="email">Symbol</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter Symbol"
                    value={symbol}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Quantity</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="number"
                    placeholder="Enter Quantity"
                    value={quantity}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">From Folio</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="number"
                    placeholder="Enter From Folio"
                    value={from_folio}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">To Folio</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="number"
                    placeholder="Enter To Folio"
                    value={to_folio}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Txn Date</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="date"
                    placeholder="Enter Txn Date"
                    value={txn_date}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Settlement Date </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="date"
                    placeholder="Enter Settlement Date "
                    value={settlement_date}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </div>
  );
}
