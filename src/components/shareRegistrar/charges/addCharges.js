import React, { Fragment, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import ToggleButton from "react-toggle-button";
import { addCharges } from "../../../store/services/charges.service";
import { ToastContainer, toast } from "react-toastify";
import LoadableButton from "../../common/loadables";

export default function AddCharges() {
  const [title, setTitle] = useState("");
  const [percentage, setPercentage] = useState("");
  const [applicable_on, setApplicable_on] = useState("");
  const [reference, setReference] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  //   errors
  const [titleError, setTitleError] = useState(false);
  const [percentageError, setPercentageError] = useState(false);
  const [applicable_onError, setApplicable_onError] = useState(false);
  const [referenceError, setReferenceError] = useState(false);

  const handleAddCharges = async () => {
    if (title == "") {
      setTitleError(true);
    } else {
      setTitleError(false);
    }
    if (percentage == "") {
      setPercentageError(true);
    } else {
      setPercentageError(false);
    }
    if (applicable_on == "") {
      setApplicable_onError(true);
    } else {
      setApplicable_onError(false);
    }
    if (reference == "") {
      setReferenceError(true);
    } else {
      setReferenceError(false);
    }

    if (
      title !== "" &&
      percentage !== "" &&
      applicable_on !== "" &&
      reference !== ""
    ) {
      const email = sessionStorage.getItem("email");
      try {
        setLoading(true);
        const response = await addCharges(
          email,
          title,
          percentage,
          applicable_on,
          reference,
          active.toString()
        );

        if (response.data.status == 200) {
          setLoading(false);
          toast.success(`${response.data.message}`);
          setTitle("");
          setPercentage("");
          setApplicable_on("");
          setReference("");
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
                <h5>Add charges</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="email">Title </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {titleError && (
                    <p className="error-color">* Title is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Percentage </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Percentage "
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                  />
                  {percentageError && (
                    <p className="error-color">* Percentage is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Applicable On </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Applicable On"
                    value={applicable_on}
                    onChange={(e) => setApplicable_on(e.target.value)}
                  />
                  {applicable_onError && (
                    <p className="error-color">* Applicable on is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Reference</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                  {referenceError && (
                    <p className="error-color">* Reference is required</p>
                  )}
                </div>

                <div className="form-group">
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

        <div className="row">
          <div className="col-md-12">
            <LoadableButton
              loading={loading}
              title="Submit"
              methodToExecute={handleAddCharges}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
