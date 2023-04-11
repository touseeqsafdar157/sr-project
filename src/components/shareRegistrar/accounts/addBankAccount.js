import React, { Fragment, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import ToggleButton from "react-toggle-button";
import Loader from "react-loader-spinner";

export default function AddBankAccount() {
  const [closed, setClosed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddCompany = () => {};
  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment>
        <div className="mt-5" style={{ height: 30 }}></div>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Bank Account Details</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="email">Account Title </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter Account Title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Account No </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter Account No "
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Bank Code </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter Bank Code"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Branch Name</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter Branch Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Branch Address </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter Branch Address "
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Branch City </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter Branch City "
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Symbol </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter Symbol "
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Open Date </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="date"
                    placeholder="Enter Open Date"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Close </label>
                  <ToggleButton
                    value={closed}
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    onToggle={() => {
                      if (closed) {
                        setClosed(false);
                      } else {
                        setClosed(true);
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
            <button
              className="btn btn-primary"
              onClick={handleAddCompany}
              disabled={Boolean(loading)}
            >
              {loading ? (
                <Loader
                  type="BallTriangle"
                  color="#ffffff"
                  height={16}
                  width={45}
                />
              ) : (
                <span>Submit</span>
              )}
            </button>
          </div>
        </div>
      </Fragment>
    </div>
  );
}
