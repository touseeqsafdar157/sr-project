import React, { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
const RightShareAllotmentTxn = () => {
  const transacitonRequest = JSON.parse(
    sessionStorage.getItem("selectedTransactionRequest")
  );
  const [associatedAnnouncement, setAssociatedAnnouncement] = useState({});
  const { announcement_data, announcement_data_loading } = useSelector(
    (data) => data.Announcements
  );
  useEffect(() => {
    if (announcement_data.length > 0) {
      setAssociatedAnnouncement(
        announcement_data.find(
          (item) =>
            item.announcement_id === transacitonRequest.announcement_id.value
        )
      );
    }
  }, [announcement_data]);
  return (
    <div className="row">
      <div className="col-md-4 col-lg-4 col-xl-4 col-sm-12">
        <div className="card">
          <div className="card-header b-t-success">
            <h5>Transaction Information</h5>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="txn_id">Transaction ID</label>
              <input
                type="text"
                className="form-control"
                name="txn_id"
                id="txn_id"
                value={transacitonRequest?.txn_id}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="txn_date">Transaction Date</label>
              <input
                type="date"
                className="form-control"
                name="txn_date"
                id="txn_date"
                value={transacitonRequest?.txn_date}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="txn_date">Company</label>
              <input
                type="text"
                className="form-control"
                name="company"
                id="company"
                value={transacitonRequest?.company_code?.label}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4 col-lg-4 col-xl-4 col-sm-12">
        <div className="card">
          <div className="card-header b-t-primary">
            <h5>Announcement Information</h5>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="txn_date">Announcement</label>
              <input
                type="text"
                className="form-control"
                name="company"
                id="company"
                value={transacitonRequest?.announcement_id?.label}
                readOnly
              />
            </div>
            <div className="row mt-1">
              <div className="col-md-12 col-sm-12 col-lg-12">
                <span>Book Closure</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-sm-12 col-lg-6">
                <div className="form-group my-2">
                  <label htmlFor="book_closure_from">From</label>
                  <input
                    className="form-control"
                    name="book_closure_from"
                    type="date"
                    value={associatedAnnouncement?.book_closure_from}
                    placeholder="Enter Period Ended"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12 col-lg-6">
                <div className="form-group my-2">
                  <label htmlFor="book_closure_to">To</label>
                  <input
                    className="form-control"
                    name="book_closure_to"
                    type="date"
                    value={associatedAnnouncement?.book_closure_to}
                    placeholder="Enter Period Ended"
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-md-12 col-sm-12 col-lg-12">
                <span>Provisional Trading</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-sm-12 col-lg-6">
                <div className="form-group my-2">
                  <label htmlFor="provisional_from">From</label>
                  <input
                    className="form-control"
                    name="provisional_from"
                    type="date"
                    value={associatedAnnouncement?.provisional_from}
                    placeholder="Enter Period Ended"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12 col-lg-6">
                <div className="form-group my-2">
                  <label htmlFor="provisional_to">To</label>
                  <input
                    className="form-control"
                    name="provisional_to"
                    type="date"
                    value={associatedAnnouncement?.provisional_to}
                    placeholder="Enter Period Ended"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4 col-lg-4 col-xl-4 col-sm-12">
        <div className="card">
          <div className="card-header b-t-secondary">
            <h5>Right Information</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group ">
                  <label>Right Number </label>
                  <NumberFormat
                    className={`form-control`}
                    id="right_number"
                    value={associatedAnnouncement?.right_number}
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group ">
                  <label>Right Percentage</label>
                  <div className="input-group ">
                    <NumberFormat
                      className={`form-control`}
                      id="right_percent"
                      value={associatedAnnouncement?.right_percent}
                      allowNegative={false}
                      placeholder="Enter Number"
                      readOnly
                    />
                    <div className="input-group-append">
                      <span className="input-group-text" id="basic-addon2">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6 col-md-6">
                <div className="form-group my-2">
                  <label>Right Rate</label>
                  <NumberFormat
                    className={`form-control`}
                    id="right_rate"
                    allowNegative={false}
                    placeholder="Right Rate"
                    value={associatedAnnouncement?.right_rate}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group my-2">
                  <label htmlFor="right_allotment_date">Allotment Date</label>
                  <input
                    className={`form-control`}
                    name="right_allotment_date"
                    type="date"
                    value={associatedAnnouncement?.right_allotment_date}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-md-12 col-sm-12 col-lg-12">
                <span>Right Subs</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="right_subs_from">From</label>
                  <input
                    className={`form-control`}
                    name="right_subs_from"
                    type="date"
                    value={associatedAnnouncement?.right_subs_from}
                    placeholder="Enter Period Ended"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="right_subs_to">To</label>
                  <input
                    className={`form-control`}
                    name="right_subs_to"
                    value={associatedAnnouncement?.right_subs_to}
                    type="date"
                    placeholder="Enter Period Ended"
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-md-12 col-sm-12 col-lg-12">
                <span>Right Credit</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="right_credit_from"> From</label>
                  <input
                    className={`form-control`}
                    name="right_credit_from"
                    type="date"
                    placeholder="Enter Period Ended"
                    value={associatedAnnouncement?.right_credit_from}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="right_credit_to"> To</label>
                  <input
                    className={`form-control`}
                    name="right_credit_to"
                    type="date"
                    placeholder="Enter Period Ended"
                    value={associatedAnnouncement?.right_credit_to}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightShareAllotmentTxn;
