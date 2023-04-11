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

const AddIPOAnnouncement = ({ setViewAddPage }) => {
  const [loading, setLoading] = useState(false);
  const [bookBuilding, setBookBuilding] = useState(false);
  // Border Style
  const borderRadiusStyle = { borderRadius: 2 };
  // Selectors
  const { companies_data_loading, companies_dropdown } = useSelector(
    (data) => data.Companies
  );
  // Options
  const offer_types = [
    { label: "IPO", value: "IPO" },
    { label: "SPO", value: "SPO" },
  ];
  // Yup Validation
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    watch,
  } = useForm({ resolver: yupResolver(addIPOAnnouncementSchema) });
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
                  <h5>Offering</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="offer_date">Offer Date</label>
                    <input
                      className={`form-control ${
                        errors.offer_date && "border border-danger"
                      }`}
                      name="offer_date"
                      type="date"
                      {...register("offer_date")}
                      defaultValue={getvalidDateYMD(new Date())}
                    />
                    <small className="text-danger">
                      {errors.offer_date?.message}
                    </small>
                  </div>
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
                    <label htmlFor="offer_type">Offer Type</label>
                    <Controller
                      name="offer_type"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={offer_types}
                          id="offer_type"
                          placeholder="Select Offer Type"
                          styles={errors.offer_type && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.offer_type?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Offer Volume</label>
                    <Controller
                      name="offer_volume"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.offer_volume && "border-danger"
                          }`}
                          id="offer_volume"
                          allowNegative={false}
                          placeholder="Enter Offer Volume"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.offer_volume?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Face Value</label>
                    <Controller
                      name="face_value"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.face_value && "border-danger"
                          }`}
                          id="face_value"
                          allowNegative={false}
                          placeholder="Enter Face Value"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.face_value?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Offer Price</label>
                    <Controller
                      name="offer_price"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.offer_price && "border-danger"
                          }`}
                          id="offer_price"
                          allowNegative={false}
                          placeholder="Enter Offer Price"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.offer_price?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Final Offer Price</label>
                    <Controller
                      name="final_offer_price"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.final_offer_price && "border-danger"
                          }`}
                          id="final_offer_price"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.final_offer_price?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="card">
                <div className="card-header b-t-info">
                  <h5>Book Building</h5>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label>Book Building </label>
                    <ToggleButton
                      value={watch("book_building")}
                      thumbStyle={borderRadiusStyle}
                      trackStyle={borderRadiusStyle}
                      onToggle={() => {
                        setValue("book_building", !watch("book_building"));
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <div className="form-group my-2">
                        <label>Shares</label>
                        <Controller
                          name="book_building_shares"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${
                                errors.book_building_shares && "border-danger"
                              }`}
                              disabled={!watch("book_building")}
                              id="book_building_shares"
                              allowNegative={false}
                              placeholder="Enter Number"
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.book_building_shares?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div className="form-group my-2">
                        <label>Percentage</label>
                        <div className="input-group">
                          <Controller
                            name="book_building_percent"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className={`form-control ${
                                  errors.book_building_percent &&
                                  "border border-danger"
                                }`}
                                disabled={!watch("book_building")}
                                id="book_building_percent"
                                allowNegative={false}
                                placeholder="Enter Precentage"
                              />
                            )}
                            control={control}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              id="basic-addon2"
                            >
                              %
                            </span>
                          </div>
                        </div>
                        <small className="text-danger">
                          {errors.book_building_percent?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <div className="form-group my-2">
                        <label htmlFor="book_building_from">From</label>
                        <input
                          className={`form-control ${
                            errors.book_building_from && "border border-danger"
                          }`}
                          name="book_building_from"
                          type="date"
                          disabled={!watch("book_building")}
                          {...register("book_building_from")}
                          defaultValue={getvalidDateYMD(new Date())}
                        />
                        <small className="text-danger">
                          {errors.book_building_from?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div className="form-group my-2">
                        <label htmlFor="book_building_to">To</label>
                        <input
                          className={`form-control ${
                            errors.book_building_to && "border border-danger"
                          }`}
                          name="book_building_to"
                          type="date"
                          disabled={!watch("book_building")}
                          {...register("book_building_to")}
                          defaultValue={getvalidDateYMD(new Date())}
                        />
                        <small className="text-danger">
                          {errors.book_building_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="form-group my-2">
                    <label>Strike Price</label>
                    <Controller
                      name="strike_price"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.strike_price && "border-danger"
                          }`}
                          disabled={!watch("book_building")}
                          decimalScale={2}
                          id="strike_price"
                          allowNegative={false}
                          placeholder="Enter Price"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.strike_price?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Bid Volume</label>
                    <Controller
                      name="bid_volume"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.bid_volume && "border-danger"
                          }`}
                          disabled={!watch("book_building")}
                          id="bid_volume"
                          allowNegative={false}
                          placeholder="Enter Volume"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.bid_volume?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="book_building_credit_date">
                      Credit Date
                    </label>
                    <input
                      className={`form-control ${
                        errors.book_building_credit_date &&
                        "border border-danger"
                      }`}
                      name="book_building_credit_date"
                      type="date"
                      disabled={!watch("book_building")}
                      {...register("book_building_credit_date")}
                      defaultValue={getvalidDateYMD(new Date())}
                    />
                    <small className="text-danger">
                      {errors.book_building_credit_date?.message}
                    </small>
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
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <div className="form-group my-2">
                        <label>Shares</label>
                        <Controller
                          name="ipo_shares"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${
                                errors.ipo_shares && "border-danger"
                              }`}
                              id="ipo_shares"
                              allowNegative={false}
                              placeholder="Enter Shares"
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.ipo_shares?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div className="form-group my-2">
                        <label>Percent</label>
                        <div className="input-group">
                          <Controller
                            name="ipo_percent"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className={`form-control ${
                                  errors.ipo_percent && "border border-danger"
                                }`}
                                id="ipo_percent"
                                allowNegative={false}
                                placeholder="Enter Percentage"
                              />
                            )}
                            control={control}
                          />
                          <div className="input-group-append">
                            <span
                              className="input-group-text"
                              id="basic-addon2"
                            >
                              %
                            </span>
                          </div>
                        </div>
                        <small className="text-danger">
                          {errors.ipo_percent?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <div className="form-group my-2">
                        <label htmlFor="ipo_from">From</label>
                        <input
                          className={`form-control ${
                            errors.ipo_from && "border border-danger"
                          }`}
                          name="ipo_from"
                          type="date"
                          {...register("ipo_from")}
                          defaultValue={getvalidDateYMD(new Date())}
                        />
                        <small className="text-danger">
                          {errors.ipo_from?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div className="form-group my-2">
                        <label htmlFor="ipo_to">To</label>
                        <input
                          className={`form-control ${
                            errors.ipo_to && "border border-danger"
                          }`}
                          name="ipo_to"
                          type="date"
                          {...register("ipo_to")}
                          defaultValue={getvalidDateYMD(new Date())}
                        />
                        <small className="text-danger">
                          {errors.ipo_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="ipo_credit_date">Credit Date</label>
                    <input
                      className={`form-control ${
                        errors.ipo_credit_date && "border border-danger"
                      }`}
                      name="ipo_credit_date"
                      type="date"
                      {...register("ipo_credit_date")}
                      defaultValue={getvalidDateYMD(new Date())}
                    />
                    <small className="text-danger">
                      {errors.ipo_credit_date?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Sub Volume</label>
                    <Controller
                      name="ipo_sub_volume"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.ipo_sub_volume && "border-danger"
                          }`}
                          id="ipo_sub_volume"
                          allowNegative={false}
                          placeholder="Enter Volume"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.ipo_sub_volume?.message}
                    </small>
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

export default AddIPOAnnouncement;
