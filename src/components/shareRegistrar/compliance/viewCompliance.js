import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";

import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";

export default function ViewCompliance() {
  const data = JSON.parse(sessionStorage.getItem("selectedCompliance")) || "";
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedCompliance", JSON.stringify({}));
    };
  }, []);
  const [compliance_id, setCompliance_id] = useState(data.compliance_id);
  const [action_date, setAction_date] = useState(data.action_date);
  const [txn_id, setTxn_id] = useState(data.txn_id);
  const [role_id, setRole_id] = useState(data.role_id);
  const [serial_no, setSerial_no] = useState(data.serial_no);
  const [item, setItem] = useState(data.item);
  const [compliant, setCompliant] = useState(
    data.compliant == "true" ? true : false
  );
  const [not_compliant, setNot_compliant] = useState(
    data.not_compliant == "true" ? true : false
  );
  const [partially_compliant, setPartially_compliant] = useState(
    data.partially_compliant == "true" ? true : false
  );
  const [not_applicable, setNot_applicable] = useState(
    data.not_applicable == "true" ? true : false
  );
  const [compliance, setCompliance] = useState(data.compliance_by);
  const [comments, setComments] = useState(data.comments);
  const [created_at, setCreated_at] = useState(data.created_at);

  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment> 
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>View Compliance</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="companySecretary">Compliance ID</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="number"
                    placeholder="Enter Compliance ID"
                    value={compliance_id}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Action Date</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="date"
                    placeholder="Enter Action Date"
                    value={action_date}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Txn ID</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="number"
                    placeholder="Enter Txn ID"
                    value={txn_id}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Role ID</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="number"
                    placeholder="Enter Role ID"
                    value={role_id}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Serial No</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="number"
                    placeholder="Enter Serial No"
                    value={serial_no}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Item</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Item"
                    value={item}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Compliance</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Compliance"
                    value={compliance}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Comments</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Comments"
                    value={comments}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Created At</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="date"
                    placeholder="Enter Created at"
                    value={created_at}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email">Compliant </label>
                      <ToggleButton
                        value={compliant}
                        thumbStyle={borderRadiusStyle}
                        trackStyle={borderRadiusStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email">Not Compliant </label>
                      <ToggleButton
                        value={not_compliant}
                        thumbStyle={borderRadiusStyle}
                        trackStyle={borderRadiusStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email">Partially Compliant </label>
                      <ToggleButton
                        value={partially_compliant}
                        thumbStyle={borderRadiusStyle}
                        trackStyle={borderRadiusStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email">Not Applicable </label>
                      <ToggleButton
                        value={not_applicable}
                        thumbStyle={borderRadiusStyle}
                        trackStyle={borderRadiusStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </div>
  );
}
