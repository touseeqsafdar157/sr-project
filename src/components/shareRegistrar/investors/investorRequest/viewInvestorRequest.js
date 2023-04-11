import React, { Fragment, useState , useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import ToggleButton from "react-toggle-button";
import { updateInvestorRequest } from "../../../../store/services/investor.service";

import { ToastContainer, toast } from "react-toastify";

export default function ViewInvestorRequests() {

    const data = JSON.parse(sessionStorage.getItem("selectedInvestorRequest")) || "";
    useEffect(() => {
      return () => {
        sessionStorage.setItem("selectedInvestorRequest", JSON.stringify({}));
      }; 
    }, []); 

  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment> 
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Investor Request Details</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label>Request ID</label>
                  <input
                    className="form-control"
                    name="Name"
                    type="text"
                    placeholder="Enter Id"
                    value={data.request_id}
                   
                  />
                 
                </div>
                <div className="mb-3">
                  <label>Request Date</label>
                  <input
                    className="form-control"
                    name="Name"
                    type="date"
                    placeholder="Enter Date"
                    value={data.request_date}
                  />
                
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Folio Number </label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Folio Number "
                    value={data.folio_number}        
                  />
                  
                </div>

                <div className="mb-3">
                  <label>Request Type</label>
                  <select
                    className="form-control"
                    value={data.request_type}
                   
                  >
                    <option value="">Select</option>
                    <option value="Transfer_Of_Shares">
                      Transfer of Shares
                    </option>
                    <option value="IPO_Subscription">IPO Subscription</option>
                    <option value="Right_Subscription">
                      Right Subscription
                    </option>
                  </select>
                 
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Announcement ID </label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Announcement ID "
                    value={data.announcement_id}
                 
                  />
                
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Entitlement ID </label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Entitlement ID "
                    value={data.entitlement_id}
                 
                  />
              
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Symbol</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Symbol"
                    value={data.symbol}
                  />
                
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Quantity</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Quantity"
                    value={data.quantity}
                  />
                 
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Price</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Price"
                    value={data.price}
                  />
                  
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-xl-4">
            <div className="card ">
              <div className="card-header b-t-success">
                <h5>Investor Request Details</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="companySecretary">Amount</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Amount"
                    value={data.amount}
                  />
                
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Amount Payable</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Amount Payable"
                    value={data.amount_payable}
                  />
                 
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Amount Paid </label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Amount Paid "
                    value={data.amount_paid}
                  />


                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Approved Date </label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="datetime-local"
                    placeholder="Enter Approved Date"
                    value={data.approved_date}

                  />
           
                </div>

                <div className="mb-3">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={data.status}
                  
                  >
                    <option value="">Select</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="Pending">Pending</option>
                    <option value="Closed">Closed</option>
                  </select>
                 
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Closed Date </label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="datetime-local"
                    placeholder="Enter Closed Date"
                    value={data.closed_date}
                   
                  />
                 
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email">Final Approval </label>
                      <ToggleButton
                        value={data.final_approval == 'true' ? true : false}
                        thumbStyle={borderRadiusStyle}
                        trackStyle={borderRadiusStyle}
                 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email">Closed </label>
                      <ToggleButton
                        value={data.closed == 'true' ? true : false}
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

        {/* <div className="row">
          <div className="col-md-12">
            <button
              className="btn btn-primary"
      
            >
              Submit{" "}
            </button>
          </div>
        </div> */}
      </Fragment>
    </div>
  );
}
