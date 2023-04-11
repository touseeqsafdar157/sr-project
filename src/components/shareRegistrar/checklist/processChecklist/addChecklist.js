import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import LoadableButton from "../../../common/loadables";
import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";
import { addProcessChecklist } from "../../../../store/services/checklist.service";
import { getTransactionTypes } from "../../../../store/services/transaction.service";
import { darkStyle } from "../../../defaultStyles";
import { txn_type_setter } from "../../../../store/services/dropdown.service";
import Select from "react-select";

export default function AddChecklist() {
  const [checklist_id, setChecklist_id] = useState("");
  const [txn_type, setTxn_type] = useState("");
  const [check_list_title, setCheck_list_title] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  //Options
  const [txn_type_options, setTxn_type_options] = useState([]);

  // errors

  const [checklist_idError, setChecklist_idError] = useState(false);
  const [txn_typeError, setTxn_typeError] = useState(false);
  const [check_list_titleError, setCheck_list_titleError] = useState(false);

  useEffect(async () => {
    try {
      setTxn_type_options(await txn_type_setter());
    } catch (err) {
      toast.error(`${err.response.data.message}`);
    }
  }, []);

  const handleAddChecklist = async () => {
    // if (checklist_id == "") {
    //   setChecklist_idError(true);
    // } else {
    //   setChecklist_idError(false);
    // }
    if (txn_type == "") {
      setTxn_typeError(true);
    } else {
      setTxn_typeError(false);
    }
    if (check_list_title == "") {
      setCheck_list_titleError(true);
    } else {
      setCheck_list_titleError(false);
    }

    if (txn_type !== "" && check_list_title !== "") {
      const email = sessionStorage.getItem("email");
      try {
        setLoading(true);
        const response = await addProcessChecklist(
          email,
          // checklist_id,
          txn_type,
          check_list_title,
          active.toString()
        );

        if (response.data.status == 200) {
          setLoading(false);
          toast.success(`${response.data.message}`);
          // setChecklist_id("");
          setTxn_type("");
          setCheck_list_title("");
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
                <h5>Add checklist</h5>
              </div>
              <div className="card-body">
                {/* <div className="mb-3">
                  <label htmlFor="companySecretary">Checklist ID</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Checklist ID"
                    value={checklist_id}
                    onChange={(e) => setChecklist_id(e.target.value)}
                  />
                  {checklist_idError && (
                    <p className="error-color">* Checklist id is required</p>
                  )}
                </div> */}
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
                  <label htmlFor="companySecretary">Checklist title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Checklist title"
                    value={check_list_title}
                    onChange={(e) => setCheck_list_title(e.target.value)}
                  />
                  {check_list_titleError && (
                    <p className="error-color">* Checklist Title is required</p>
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
              methodToExecute={handleAddChecklist}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
