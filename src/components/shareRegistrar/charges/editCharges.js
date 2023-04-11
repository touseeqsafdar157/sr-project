import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import ToggleButton from "react-toggle-button";
import { updateCharges } from "../../../store/services/charges.service";
import { ToastContainer, toast } from "react-toastify";
import LoadableButton from "../../common/loadables";

export default function EditCharges() {
  const data = JSON.parse(sessionStorage.getItem("selectedCharges")) || "";
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedCharges", JSON.stringify({}));
    };
  }, []);
  const [title, setTitle] = useState(data.title);
  const [charges_id, setCharges_id] = useState(data.code);
  const [percentage, setPercentage] = useState(data.percentage);
  const [applicable_on, setApplicable_on] = useState(data.applicable_on);
  const [reference, setReference] = useState(data.reference);
  const [active, setActive] = useState(data.active == "true" ? true : false);

  const [loading, setLoading] = useState(false);

  //   errors
  const [titleError, setTitleError] = useState(false);
  const [percentageError, setPercentageError] = useState(false);
  const [applicable_onError, setApplicable_onError] = useState(false);
  const [referenceError, setReferenceError] = useState(false);

  const handleUpdateCharges = async () => {
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
        const response = await updateCharges(
          email,
          charges_id,
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
                <h5>Edit charges</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="email">Title</label>
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
                  <label htmlFor="email">Active</label>
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
              title="Update"
              methodToExecute={handleUpdateCharges}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
