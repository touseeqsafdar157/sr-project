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

const AddIPOSubscription = ({ setViewAddPage }) => {
  const [loading, setLoading] = useState(false);
  const [bookBuilding, setBookBuilding] = useState(false);
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
  } = useForm({ resolver: yupResolver(addIPOSubscriptionSchema) });
  const handleAddIPOAnnouncement = async (data) => {
  };
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleAddIPOAnnouncement)}>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="card">
                <div className="card-header b-t-primary">
                  <h5>IPO</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="company_code">Company</label>
                    <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={companies_data_loading}
                          options={companies_dropdown}
                          id="company_code"
                          placeholder="Select Company"
                          styles={errors.company_code && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.company_code?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="offer_id">Offer ID</label>
                    <Controller
                      name="offer_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="offer_id"
                          placeholder="Select Offer"
                          styles={errors.offer_id && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.offer_id?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="card">
                <div className="card-header b-t-info">
                  <h5>Requester Info</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="folio_number">Folio No</label>
                    <Controller
                      name="folio_number"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={shareholders_data_loading}
                          options={shareholders_dropdown}
                          id="folio_number"
                          placeholder="Select Folio"
                          styles={errors.folio_number && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.folio_number?.message}
                    </small>
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
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>IPO</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="subscription_through">
                      Subscriptions Through
                    </label>
                    <Controller
                      name="subscription_through"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={subscription_options}
                          id="subscription_through"
                          placeholder="Select Subscription"
                          styles={errors.subscription_through && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.subscription_through?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Shares Subscribed</label>
                    <Controller
                      name="shares_subscribed"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.shares_subscribed && "border-danger"
                          }`}
                          id="shares_subscribed"
                          allowNegative={false}
                          placeholder="Enter  No of Shares"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.shares_subscribed?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="price">Price</label>
                    <input
                      className="form-control"
                      name="price"
                      type="text"
                      placeholder="Share Price"
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shares_alloted">Shares Alloted</label>
                    <input
                      className="form-control text-right"
                      name="shares_alloted"
                      type="text"
                      placeholder="Shares Alloted"
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="amount_payable">Amount Payable</label>
                    <input
                      className="form-control text-right"
                      name="amount_payable"
                      type="type"
                      placeholder="Amount Payable"
                    />
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

export default AddIPOSubscription;
