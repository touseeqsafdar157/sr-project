import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useForm } from "react-hook-form";
import { addCompliance } from "../../../store/services/compliance.service";
import { ToastContainer, toast } from "react-toastify";
import { getTransactions } from "../../../store/services/transaction.service";
import { darkStyle } from "../../defaultStyles";
import LoadableButton from "../../common/loadables";
import Select from "react-select";
import {
  txn_setter,
  checklist_items_setter,
} from "../../../store/services/dropdown.service";

import ToggleButton from "react-toggle-button";

export default function AddCompliance() {
  const [compliance_id, setCompliance_id] = useState("");
  const [action_date, setAction_date] = useState("");
  const [txn_id, setTxn_id] = useState("");
  const [role_id, setRole_id] = useState("");
  const [serial_no, setSerial_no] = useState("");
  const [item, setItem] = useState("");
  const [compliant, setCompliant] = useState(false);
  const [not_compliant, setNot_compliant] = useState(false);
  const [partially_compliant, setPartially_compliant] = useState(false);
  const [not_applicable, setNot_applicable] = useState(false);
  const [compliance, setCompliance] = useState("");
  const [comments, setComments] = useState("");
  const [created_at, setCreated_at] = useState("");
  const [loading, setLoading] = useState(false);

  //options
  const [txn_options, setTxn_options] = useState([]);
  const [checklist_items_options, setChecklist_items_options] = useState([]);

  // errors
  const [compliance_idError, setCompliance_idError] = useState(false);
  const [action_dateError, setAction_dateError] = useState(false);
  const [txn_idError, setTxn_idError] = useState(false);
  const [role_idError, setRole_idError] = useState(false);
  const [serial_noError, setSerial_noError] = useState(false);
  const [itemError, setItemError] = useState(false);
  const [compliantError, setCompliantError] = useState(false);
  const [not_compliantError, setNot_compliantError] = useState(false);
  const [partially_compliantError, setPartially_compliantError] =
    useState(false);
  const [not_applicableError, setNot_applicableError] = useState(false);
  const [complianceError, setComplianceError] = useState(false);
  const [commentsError, setCommentsError] = useState(false);
  const [created_atError, setCreated_atError] = useState(false);

  useEffect(async () => {
    //calling option setter
    try {
      setTxn_options(await txn_setter());
      setChecklist_items_options(await checklist_items_setter());
    } catch (err) {
      // toast.error(`${err.response.data.message}`);
    }
  }, []);

  const handleAddCompliance = async () => {
    if (action_date == "") {
      setAction_dateError(true);
    } else {
      setAction_dateError(false);
    }
    if (txn_id == "") {
      setTxn_idError(true);
    } else {
      setTxn_idError(false);
    }
    if (role_id == "") {
      setRole_idError(true);
    } else {
      setRole_idError(false);
    }
    if (serial_no == "") {
      setSerial_noError(true);
    } else {
      setSerial_noError(false);
    }
    if (item == "") {
      setItemError(true);
    } else {
      setItemError(false);
    }
    if (compliance == "") {
      setComplianceError(true);
    } else {
      setComplianceError(false);
    }
    if (comments == "") {
      setCommentsError(true);
    } else {
      setCommentsError(false);
    }
    if (created_at == "") {
      setCreated_atError(true);
    } else {
      setCreated_atError(false);
    }
    if (
      action_date !== "" &&
      txn_id !== "" &&
      role_id !== "" &&
      serial_no !== "" &&
      item !== "" &&
      compliance !== "" &&
      comments !== "" &&
      created_at !== ""
    ) {
      const email = sessionStorage.getItem("email");
      try {
        setLoading(true);
        const response = await addCompliance(
          email,

          action_date,
          txn_id,
          role_id,
          serial_no,
          item,
          compliant.toString(),
          not_compliant.toString(),
          partially_compliant.toString(),
          not_applicable.toString(),
          compliance,
          comments,
          created_at
        );

        if (response.data.status == 200) {
          setLoading(false);
          toast.success(`${response.data.message}`);
          setCompliance_id("");
          setAction_date("");
          setTxn_id("");
          setRole_id("");
          setSerial_no("");
          setItem("");
          setCompliant(false);
          setNot_compliant(false);
          setPartially_compliant(false);
          setNot_applicable(false);
          setCompliance("");
          setComments("");
          setCreated_at("");
        } else {
          setLoading(false);
          toast.error(`${response.data.message}`);
        }
      } catch (error) {
        setLoading(false);
        toast.error(`${error.response.data.message}`);
      }
    }
  };
  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment>
        {/* row starts */}
        <div className="row">
          {/* col one starts */}
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Compliance checklists</h5>
              </div>
              <div className="card-body">
                {/* <div className="mb-3">
                  <label htmlFor="companySecretary">Compliance ID</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Compliance ID"
                    value={compliance_id}
                    onChange={(e) => setCompliance_id(e.target.value)}
                  />
                  {compliance_idError && (
                    <p className="error-color">* Compliance id is required</p>
                  )}
                </div> */}
                <div className="mb-3">
                  <label htmlFor="companySecretary">Action Date</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="date"
                    placeholder="Enter Action Date"
                    value={action_date}
                    onChange={(e) => setAction_date(e.target.value)}
                  />
                  {action_dateError && (
                    <p className="error-color">* Action date is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Txn ID</label>
                  {/* <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Txn ID"
                    value={txn_id}
                    onChange={(e) => setTxn_id(e.target.value)}
                  /> */}
                  <Select
                    options={txn_options}
                    onChange={(selected) => {
                      setTxn_id(selected.value);
                    }}
                    styles={darkStyle}
                  />
                  {txn_idError && (
                    <p className="error-color">* Txn id is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Role ID</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Role ID"
                    value={role_id}
                    onChange={(e) => setRole_id(e.target.value)}
                  />
                  {role_idError && (
                    <p className="error-color">* Role id is required</p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Serial No</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Serial No"
                    value={serial_no}
                    onChange={(e) => setSerial_no(e.target.value)}
                  />
                  {serial_noError && (
                    <p className="error-color">* Serial no is required</p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Item</label>
                  {/* <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Item"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                  /> */}
                  <Select
                    options={checklist_items_options}
                    onChange={(selected) => {
                      setItem(selected.value);
                    }}
                    styles={darkStyle}
                  />
                  {itemError && (
                    <p className="error-color">* Item is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* second col start */}
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Compliance checklists</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="companySecretary">Compliance By</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Compliance"
                    value={compliance}
                    onChange={(e) => setCompliance(e.target.value)}
                  />
                  {complianceError && (
                    <p className="error-color">* Compliance is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Comments</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                  {commentsError && (
                    <p className="error-color">* comments is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Created At</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="date"
                    placeholder="Enter Created at"
                    value={created_at}
                    onChange={(e) => setCreated_at(e.target.value)}
                  />
                  {created_atError && (
                    <p className="error-color">* Created at is required</p>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email">Compliant </label>
                      <ToggleButton
                        value={compliant}
                        thumbStyle={borderRadiusStyle}
                        trackStyle={borderRadiusStyle}
                        onToggle={() => {
                          if (compliant) {
                            setCompliant(false);
                          } else {
                            setCompliant(true);
                          }
                        }}
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
                        onToggle={() => {
                          if (not_compliant) {
                            setNot_compliant(false);
                          } else {
                            setNot_compliant(true);
                          }
                        }}
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
                        onToggle={() => {
                          if (partially_compliant) {
                            setPartially_compliant(false);
                          } else {
                            setPartially_compliant(true);
                          }
                        }}
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
                        onToggle={() => {
                          if (not_applicable) {
                            setNot_applicable(false);
                          } else {
                            setNot_applicable(true);
                          }
                        }}
                      />
                    </div>
                  </div>
                  {/*  */}
                </div>
              </div>
            </div>
          </div>

          {/* second col ends */}
        </div>
        {/* row eneds */}

        <div className="row">
          <div className="col-md-12">
            <LoadableButton
              loading={loading}
              title="Submit"
              methodToExecute={handleAddCompliance}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
