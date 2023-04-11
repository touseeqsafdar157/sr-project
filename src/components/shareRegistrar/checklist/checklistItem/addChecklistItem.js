import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";
import LoadableButton from "../../../common/loadables";
import { addNewChecklistItem } from "../../../../store/services/checklist.service";
import { darkStyle } from "../../../defaultStyles";
import Select from "react-select";

import {
  txn_type_setter,
  checklist_setter,
} from "../../../../store/services/dropdown.service";

export default function AddChecklistItem() {
  const [item_id, setItem_id] = useState("");
  const [checklist_id, setChecklist_id] = useState("");
  const [txn_type, setTxn_type] = useState("");
  const [role_id, setRole_id] = useState("");
  const [type, setType] = useState("");
  const [verification_type, setVerification_type] = useState("");
  const [group_title, setGroup_title] = useState("");
  const [serial_no, setSerial_no] = useState("");
  const [item, setItem] = useState("");
  const [compliant_title, setCompliant_title] = useState("");
  const [not_compliant_title, setNot_compliant_title] = useState("");
  const [partially_compliant_title, setPartially_compliant_title] =
    useState("");
  const [not_applicable_title, setNot_applicable_title] = useState("");
  const [comments_title, setComments_title] = useState("");
  const [compliant_mandatory, setCompliant_mandatory] = useState("");
  const [reference, setReference] = useState("");
  const [created_date, setCreated_date] = useState("");

  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [txn_type_options, setTxn_type_options] = useState([]);
  const [checklist_options, setChecklist_options] = useState([]);

  // errors
  const [item_idError, setItem_idError] = useState(false);
  const [checklist_idError, setChecklist_idError] = useState(false);
  const [txn_typeError, setTxn_typeError] = useState(false);
  const [role_idError, setRole_idError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [verification_typeError, setVerification_typeError] = useState(false);
  const [group_titleError, setGroup_titleError] = useState(false);
  const [serial_noError, setSerial_noError] = useState(false);
  const [itemError, setItemError] = useState(false);
  const [compliant_titleError, setCompliant_titleError] = useState(false);
  const [not_compliant_titleError, setNot_compliant_titleError] =
    useState(false);
  const [partially_compliant_titleError, setPartially_compliant_titleError] =
    useState(false);
  const [not_applicable_titleError, setNot_applicable_titleError] =
    useState(false);
  const [comments_titleError, setComments_titleError] = useState(false);
  const [compliant_mandatoryError, setCompliant_mandatoryError] =
    useState(false);
  const [referenceError, setReferenceError] = useState(false);
  const [created_dateError, setCreated_dateError] = useState(false);

  useEffect(async () => {
    try {
      setTxn_type_options(await txn_type_setter());
      setChecklist_options(await checklist_setter());
    } catch (err) {
      toast.error(`${err.response.data.message}`);
    }
  }, []);

  const handleAddChecklistItem = async () => {
    if (checklist_id == "") {
      setChecklist_idError(true);
    } else {
      setChecklist_idError(false);
    }
    if (txn_type == "") {
      setTxn_typeError(true);
    } else {
      setTxn_typeError(false);
    }
    if (role_id == "") {
      setRole_idError(true);
    } else {
      setRole_idError(false);
    }
    if (type == "") {
      setTypeError(true);
    } else {
      setTypeError(false);
    }
    if (verification_type == "") {
      setVerification_typeError(true);
    } else {
      setVerification_typeError(false);
    }
    if (group_title == "") {
      setGroup_titleError(true);
    } else {
      setGroup_titleError(false);
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
    if (compliant_title == "") {
      setCompliant_titleError(true);
    } else {
      setCompliant_titleError(false);
    }
    if (not_compliant_title == "") {
      setNot_compliant_titleError(true);
    } else {
      setNot_compliant_titleError(false);
    }
    if (partially_compliant_title == "") {
      setPartially_compliant_titleError(true);
    } else {
      setPartially_compliant_titleError(false);
    }
    if (not_applicable_title == "") {
      setNot_applicable_titleError(true);
    } else {
      setNot_applicable_titleError(false);
    }
    if (comments_title == "") {
      setComments_titleError(true);
    } else {
      setComments_titleError(false);
    }
    if (compliant_mandatory == "") {
      setCompliant_mandatoryError(true);
    } else {
      setCompliant_mandatoryError(false);
    }
    if (reference == "") {
      setReferenceError(true);
    } else {
      setReferenceError(false);
    }
    if (created_date == "") {
      setCreated_dateError(true);
    } else {
      setCreated_dateError(false);
    }
    if (
      checklist_id !== "" &&
      txn_type !== "" &&
      role_id !== "" &&
      type !== "" &&
      verification_type !== "" &&
      group_title !== "" &&
      serial_no !== "" &&
      item !== "" &&
      compliant_title !== "" &&
      not_compliant_title !== "" &&
      partially_compliant_title !== "" &&
      not_applicable_title !== "" &&
      comments_title !== "" &&
      compliant_mandatory !== "" &&
      reference !== "" &&
      created_date !== ""
    ) {
      const email = sessionStorage.getItem("email");
      try {
        setLoading(true);
        const response = await addNewChecklistItem(
          email,

          checklist_id,
          txn_type,
          role_id,
          type,
          verification_type,
          group_title,
          serial_no,
          item,
          compliant_title,
          not_compliant_title,
          partially_compliant_title,
          not_applicable_title,
          comments_title,
          compliant_mandatory,
          reference,
          created_date,
          active.toString()
        );

        if (response.data.status == 200) {
          setLoading(false);
          toast.success(`${response.data.message}`);
          setItem_id("");
          setChecklist_id("");
          setTxn_type("");
          setRole_id("");
          setType("");
          setVerification_type("");
          setGroup_title("");
          setSerial_no("");
          setItem("");
          setCompliant_title("");
          setNot_compliant_title("");
          setPartially_compliant_title("");
          setNot_applicable_title("");
          setComments_title("");
          setCompliant_mandatory("");
          setReference("");
          setCreated_date("");
          setActive(false);
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
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>checklist Items</h5>
              </div>
              <div className="card-body">
                {/* <div className="mb-3">
                  <label htmlFor="companySecretary">Item id</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Item id"
                    value={item_id}
                    onChange={(e) => setItem_id(e.target.value)}
                  />
                  {item_idError && (
                    <p className="error-color">* Item id is required</p>
                  )}
                </div> */}
                <div className="mb-3">
                  <label htmlFor="companySecretary">Checklist ID</label>
                  {/* <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Checklist ID"
                    value={checklist_id}
                    onChange={(e) => setChecklist_id(e.target.value)}
                  /> */}
                  <Select
                    options={checklist_options}
                    onChange={(selected) => {
                      setChecklist_id(selected.value);
                    }}
                    styles={darkStyle}
                  />
                  {checklist_idError && (
                    <p className="error-color">* Checklist id is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Txn Type</label>
                  <Select
                    options={txn_type_options}
                    onChange={(selected) => {
                      setTxn_type(selected.value);
                    }}
                    styles={darkStyle}
                  />
                  {txn_typeError && (
                    <p className="error-color">* Txn Type is required</p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Role id</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Role id"
                    value={role_id}
                    onChange={(e) => setRole_id(e.target.value)}
                  />
                  {role_idError && (
                    <p className="error-color">* Role id is required</p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Type</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                  {typeError && (
                    <p className="error-color">* Type is required</p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Verification Type</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Verification Type"
                    value={verification_type}
                    onChange={(e) => setVerification_type(e.target.value)}
                  />
                  {verification_typeError && (
                    <p className="error-color">
                      * Verification Type is required
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Group title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Group title"
                    value={group_title}
                    onChange={(e) => setGroup_title(e.target.value)}
                  />
                  {group_titleError && (
                    <p className="error-color">* Group title is required</p>
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
                  <label htmlFor="companySecretary">item</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter item"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                  />
                  {itemError && (
                    <p className="error-color">* Item is required</p>
                  )}
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
                    onChange={(e) => setCompliant_title(e.target.value)}
                  />
                  {compliant_titleError && (
                    <p className="error-color">* Compliant title is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Not Compliant Title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Not Compliant Title"
                    value={not_compliant_title}
                    onChange={(e) => setNot_compliant_title(e.target.value)}
                  />
                  {not_compliant_titleError && (
                    <p className="error-color">
                      * Not Compliant title is required
                    </p>
                  )}
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
                    onChange={(e) =>
                      setPartially_compliant_title(e.target.value)
                    }
                  />
                  {partially_compliant_titleError && (
                    <p className="error-color">
                      * Partially Compliant title is required
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Not Applicable Title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Not Applicable Title"
                    value={not_applicable_title}
                    onChange={(e) => setNot_applicable_title(e.target.value)}
                  />
                  {not_applicable_titleError && (
                    <p className="error-color">
                      * Not Applicable title is required
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Comments Title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter comments title"
                    value={comments_title}
                    onChange={(e) => setComments_title(e.target.value)}
                  />
                  {comments_titleError && (
                    <p className="error-color">* Comments title is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Compliant Mandatory</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Compliant Mandatory"
                    value={compliant_mandatory}
                    onChange={(e) => setCompliant_mandatory(e.target.value)}
                  />
                  {compliant_mandatoryError && (
                    <p className="error-color">
                      * Compliant mandatory is required
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Reference</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                  {referenceError && (
                    <p className="error-color">* Reference is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Created Date</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="date"
                    placeholder="Enter Created Date"
                    value={created_date}
                    onChange={(e) => setCreated_date(e.target.value)}
                  />
                  {created_dateError && (
                    <p className="error-color">* Created date is required</p>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email">Active </label>
                      <ToggleButton
                        value={active}
                        thumbStyle={borderRadiusStyle}
                        trackStyle={borderRadiusStyle}
                        onToggle={() => {
                          if (active) {
                            setActive(false);
                          } else {
                            setActive(true);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <LoadableButton
              loading={loading}
              title="Submit"
              methodToExecute={handleAddChecklistItem}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
