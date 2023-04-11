import React, { useState, useEffect, Fragment } from "react";
import ToggleButton from "react-toggle-button";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorStyles } from "components/defaultStyles";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { addIPOAnnouncementSchema } from "store/validations/ipoAnnouncementValidation";
import { getvalidDateYMD } from "utilities/utilityFunctions";
import { useSelector } from "react-redux";
import NumberFormat from "react-number-format";
import { addIPOSubscriptionSchema } from "store/validations/ipoSubscriptionsvalidation";
import { addIpoPaymentValidation } from "store/validations/ipoPaymentValidation";

const AddIPOPayment = ({ setViewAddPage }) => {
  const [loading, setLoading] = useState(false);
  const [bookBuilding, setBookBuilding] = useState(false);
  const [paymentEvidence, setPaymentEvidence] = useState("");
  // Border Style
  const borderRadiusStyle = { borderRadius: 2 };
  // Selectors
  const { companies_data_loading, companies_dropdown } = useSelector(
    (data) => data.Companies
  );
  const { shareholders_data_loading, shareholders_dropdown } = useSelector(
    (data) => data.Shareholders
  );
  // Options
  const instrument_types = [
    { label: "Cheque", value: "Checque" },
    { label: "Online", value: "Online" },
  ];
  const offer_types = [
    { label: "IPO", value: "IPO" },
    { label: "SPO", value: "SPO" },
  ];
  const subscription_options = [
    { label: "Mobile App", value: "Mobile App" },
    { label: "Web App", value: "Web App" },
    { label: "Application Form", value: "Application Form" },
  ];
  // Yup Validation
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    watch,
  } = useForm({ resolver: yupResolver(addIpoPaymentValidation) });
  const handleIPOpayment = async (data) => {
  };
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleIPOpayment)}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6">
              <div className="card">
                <div className="card-header b-t-primary">
                  <h5>IPO</h5>
                </div>

                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="subscription_id">Select Subscription</label>
                    <Controller
                      name="subscription_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="subscription_id"
                          placeholder="Select Subscription"
                          styles={errors.subscription_id && errorStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.subscription_id?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="company">Company</label>
                    <input
                      className="form-control"
                      name="company"
                      type="text"
                      placeholder="Company"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="folio_number">Folio Number</label>
                    <input
                      className="form-control"
                      name="folio_number"
                      type="text"
                      placeholder="Folio Number"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="name">Investor Name</label>
                    <input
                      className="form-control"
                      name="name"
                      type="text"
                      placeholder="Investor Name"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="investor">Investor Name</label>
                    <input
                      className="form-control"
                      name="investor"
                      type="text"
                      placeholder="Investor Name"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shares">Shares Subscribed</label>
                    <input
                      className="form-control"
                      name="shares"
                      type="text"
                      placeholder="Shares Subscribed"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shares_alloted">Shares Alloted</label>
                    <input
                      className="form-control"
                      name="shares_alloted"
                      type="type"
                      placeholder="Shares Alloted"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="amount_payable">Amount Payable</label>
                    <input
                      className="form-control"
                      name="amount_payable"
                      type="text"
                      placeholder="Amount"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6">
              <div className="card">
                <div className="card-header b-t-info">
                  <h5>Subscription Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Amount Paid</label>
                    <Controller
                      name="amount_paid"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.amount_paid && "border-danger"
                          }`}
                          id="amount_paid"
                          allowNegative={false}
                          allowedDecimalSeparators={false}
                          decimalScale={0}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.amount_paid?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="instrument_type">Instrument Type</label>
                    <Controller
                      name="instrument_type"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={instrument_types}
                          id="instrument_type"
                          placeholder="Selected Type"
                          styles={errors.instrument_type && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.instrument_type?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Instrument Number</label>
                    <Controller
                      name="instrument_number"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.instrument_number && "border-danger"
                          }`}
                          id="instrument_number"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.instrument_number?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="bank">Bank</label>
                    <input
                      className={`form-control ${
                        errors.bank && "border border-danger"
                      }`}
                      name="bank"
                      type="text"
                      placeholder="Enter Bank"
                      {...register("bank")}
                    />
                    <small className="text-danger">
                      {errors.bank?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="branch">Branch</label>
                    <input
                      className={`form-control ${
                        errors.branch && "border border-danger"
                      }`}
                      name="branch"
                      type="text"
                      placeholder="Branch"
                      {...register("branch")}
                    />
                    <small className="text-danger">
                      {errors.branch?.message}
                    </small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="payment_evidence">Payment Evidence</label>
                    <input
                      className={`form-control ${
                        errors.payment_evidence && "border border-danger"
                      }`}
                      name="payment_evidence"
                      type="file"
                      {...register("payment_evidence")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          let img = e.target.files[0];
                          const reader = new FileReader();
                          reader.readAsDataURL(img);
                          reader.onload = function () {
                            setPaymentEvidence(reader.result);
                          };
                        }
                      }}
                    />
                    <small className="text-danger d-block">
                      {errors.payment_evidence?.message}
                    </small>
                    {paymentEvidence && (
                      <img width="200" src={paymentEvidence} alt="alte" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={Boolean(loading)}
              >
                {loading ? (
                  <>
                    <span className="fa fa-spinner fa-spin"></span>
                    <span>{"Loading..."}</span>
                  </>
                ) : (
                  <span>{"Submit"}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </Fragment>
    </div>
  );
};

export default AddIPOPayment;
