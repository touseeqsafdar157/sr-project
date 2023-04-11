import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import ToggleButton from "react-toggle-button";
import { addDisburse } from "../../../store/services/disburse.service";
import { ToastContainer, toast } from "react-toastify";
import { updateDisburse } from "../../../store/services/disburse.service";
import LoadableButton, { LoadableInput } from "../../common/loadables";
import { darkStyle } from "../../defaultStyles";
import { folio_setter } from "../../../store/services/dropdown.service";
import Select from "react-select";

export default function EditDisbursement() {
  const data = JSON.parse(sessionStorage.getItem("selectedDisbursement")) || "";
  useEffect(async () => {
    try {
      setFolio_options(await folio_setter());
    } catch (err) {
      toast.error(`${err.response.data.message}`);
    }
    return () => {
      sessionStorage.setItem("selectedDisbursement", JSON.stringify({}));
    };
  }, []);
  const [disburse_id, setDisburse_id] = useState(data.disburse_id);
  const [disburse_date, setDisburse_date] = useState(data.disburse_date);
  const [folio_number, setFolio_number] = useState(data.folio_no);
  const [amount_disbursed, setAmount_disbursed] = useState(
    data.amount_disbursed
  );
  const [status, setStatus] = useState(data.status == "true" ? true : false);
  const [loading, setLoading] = useState(false);

  //options
  const [folio_options, setFolio_options] = useState([]);

  //   errors
  const [disburse_idError, setDisburse_idError] = useState(false);
  const [disburse_dateError, setDisburse_dateError] = useState(false);
  const [folio_noError, setFolio_noError] = useState(false);
  const [amount_disbursedError, setAmount_disbursedError] = useState(false);

  const handleUpdateDisburse = async () => {
    // if (disburse_id == "") {
    //   setDisburse_idError(true);
    // } else {
    //   setDisburse_idError(false);
    // }
    if (disburse_date == "") {
      setDisburse_dateError(true);
    } else {
      setDisburse_dateError(false);
    }
    if (folio_number == "") {
      setFolio_noError(true);
    } else {
      setFolio_noError(false);
    }
    if (amount_disbursed == "") {
      setAmount_disbursedError(true);
    } else {
      setAmount_disbursedError(false);
    }

    if (
      disburse_date !== "" &&
      folio_number !== "" &&
      amount_disbursed !== ""
    ) {
      const email = sessionStorage.getItem("email");
      try {
        setLoading(true);
        const response = await updateDisburse(
          email,
          disburse_id,
          disburse_date,
          folio_number,
          amount_disbursed,
          status.toString()
        );

        if (response.data.status == 200) {
          setLoading(false);
          toast.success(`${response.data.message}`);

          setDisburse_date("");
          setFolio_number("");
          setAmount_disbursed("");
          setStatus(false);
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
                <h5>Edit Disbursement </h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="email">Disburse Id </label>
                  <input
                    className="form-control"
                    type="text"
                    readOnly
                    placeholder="Enter Disburse Id"
                    value={disburse_id}
                    onChange={(e) => setDisburse_id(e.target.value)}
                  />
                  {disburse_idError && (
                    <p className="error-color">* Disburse id is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Disburse date </label>
                  <input
                    className="form-control"
                    type="date"
                    placeholder="Enter Disburse date"
                    value={disburse_date}
                    onChange={(e) => setDisburse_date(e.target.value)}
                  />
                  {disburse_dateError && (
                    <p className="error-color">* Disburse date is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Folio no </label>
                  {folio_options.length > 0 ? (
                    <Select
                      options={folio_options}
                      onChange={(selected) => {
                        setFolio_number(selected.value);
                      }}
                      styles={darkStyle}
                      defaultInputValue={() => {
                        return folio_options.find(
                          (item) => item.value == folio_number
                        ).label;
                      }}
                    />
                  ) : (
                    <LoadableInput />
                  )}
                  {folio_noError && (
                    <p className="error-color">* Folio no is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Amount disbursed </label>
                  <input
                    className="form-control text-right "
                    type="text"
                    placeholder="Enter Amount disbursed "
                    value={amount_disbursed}
                    onChange={(e) => setAmount_disbursed(e.target.value)}
                  />
                  {amount_disbursedError && (
                    <p className="error-color">
                      * Amount Disbursed is required
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Status </label>
                  <ToggleButton
                    value={status}
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    onToggle={() => {
                      if (status) {
                        setStatus(false);
                      } else {
                        setStatus(true);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <LoadableButton
              loading={loading}
              title="Update"
              methodToExecute={handleUpdateDisburse}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
