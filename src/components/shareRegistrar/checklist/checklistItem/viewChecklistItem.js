import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";

export default function ViewChecklistItem() {
  const data =
    JSON.parse(sessionStorage.getItem("selectedChecklistItem")) || "";
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedChecklistItem", JSON.stringify({}));
    };
  }, []);
  const [item_id, setItem_id] = useState(data.item_id);
  const [checklist_id, setChecklist_id] = useState(data.checklist_id);
  const [txn_type, setTxn_type] = useState(data.txn_type);
  const [role_id, setRole_id] = useState(data.role_id);
  const [type, setType] = useState(data.type);
  const [verification_type, setVerification_type] = useState(
    data.verification_type
  );
  const [group_title, setGroup_title] = useState(data.group_title);
  const [serial_no, setSerial_no] = useState(data.serial_no);
  const [item, setItem] = useState(data.item);
  const [compliant_title, setCompliant_title] = useState(data.compliant_title);
  const [not_compliant_title, setNot_compliant_title] = useState(
    data.not_compliant_title
  );
  const [partially_compliant_title, setPartially_compliant_title] = useState(
    data.partially_compliant_title
  );
  const [not_applicable_title, setNot_applicable_title] = useState(
    data.not_applicable_title
  );
  const [comments_title, setComments_title] = useState(data.comments_title);
  const [compliant_mandatory, setCompliant_mandatory] = useState(
    data.compliant_mandatory
  );
  const [reference, setReference] = useState(data.reference);
  const [created_date, setCreated_date] = useState(data.created_date);

  const [active, setActive] = useState(data.active == "true" ? true : false);

  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment> 
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>checklist Items</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="companySecretary">Item id</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Item id"
                    value={item_id}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Checklist ID</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Checklist ID"
                    value={checklist_id}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Txn Type</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Txn Type"
                    value={txn_type}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Role id</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Role id"
                    value={role_id}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Type</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Type"
                    value={type}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Verification Type</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Verification Type"
                    value={verification_type}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Group title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Group title"
                    value={group_title}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Serial No</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Serial No"
                    value={serial_no}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">item</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter item"
                    value={item}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                {/* <h5>checklist Items</h5> */}
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="companySecretary">Compliant Title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Compliant Title"
                    value={compliant_title}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Not Compliant Title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Not Compliant Title"
                    value={not_compliant_title}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">
                    Partially Compliant Title
                  </label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Partially Compliant Title"
                    value={partially_compliant_title}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Not Applicable Title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Not Applicable Title"
                    value={not_applicable_title}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Comments Title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter comments title"
                    value={comments_title}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Compliant Mandatory</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Compliant Mandatory"
                    value={compliant_mandatory}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Reference</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Reference"
                    value={reference}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Created Date</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Created Date"
                    value={created_date}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email">Active </label>
                      <ToggleButton
                        value={active}
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
