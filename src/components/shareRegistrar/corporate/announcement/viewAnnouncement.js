import React, { Fragment, useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editAnnouncmentSchema } from "../../../../store/validations/announcementValidation";
import NumberFormat from "react-number-format";
import { disabledStyles } from "../../../defaultStyles";

export default function EditAnnouncement() {
  const announcement =
    JSON.parse(sessionStorage.getItem("selectedCorporateAnnouncement")) || "";
  // Yup Validations
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: editAnnouncmentSchema(announcement).cast(),
    resolver: yupResolver(editAnnouncmentSchema(announcement)),
  });

  // options
  const [symbol_options, setSymbol_options] = useState([]);
  const [company_code_options, setCompany_code_options] = useState([]);
  const [period_options, setPeriod_options] = useState([
    {
      label: "Q1",
      value: "Q1",
    },
    {
      label: "Q2",
      value: "Q2",
    },
    {
      label: "Q3",
      value: "Q3",
    },
    {
      label: "Q4",
      value: "Q4",
    },
  ]);

  const handleUpdateAnnouncement = async (data) => {
  };

  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleUpdateAnnouncement)}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Corporate Announcement</h5>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label>Company Code </label>
                    <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={company_code_options}
                          id="company_code"
                          placeholder="Select Company"
                          styles={disabledStyles}
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.company_code?.message}
                    </small>
                  </div>
                  {/* <div className="form-group">
                    <label>Symbol </label>
                    <Controller
                      name="symbol"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={symbol_options}
                          id="symbol"
                          placeholder="Select Symbol"
                          styles={disabledStyles}
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.symbol?.message}
                    </small>
                  </div> */}
                  <div className="form-group">
                    <label htmlFor="symbol">Symbol</label>
                    <input
                      className={`form-control ${errors.symbol && "border border-danger"
                        }`}
                      name="symbol"
                      type="text"
                      placeholder="Enter Symbol"
                      // {...register("symbol")}
                      value={announcement.symbol}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.symbol?.message}
                    </small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="companySecretary">Announcement Date</label>
                    <input
                      className={`form-control ${errors.announcement_date && "border border-danger"
                        }`}
                      name="companySecretary"
                      type="date"
                      placeholder="Enter Announcement Date"
                      {...register("announcement_date")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.announcement_date?.message}
                    </small>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="period">Period</label>
                        <Controller
                          name="period"
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={period_options}
                              styles={disabledStyles}
                              isDisabled={true}
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.period?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="period_ended">Period Ended</label>
                        <input
                          className={`form-control ${errors.period_ended && "border border-danger"
                            }`}
                          name="period_ended"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("period_ended")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.period_ended?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="provisional_from">
                          Provisional From
                        </label>
                        <input
                          className={`form-control ${errors.provisional_from && "border border-danger"
                            }`}
                          name="provisional_from"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("provisional_from")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.provisional_from?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="provisional_to">Provisional To</label>
                        <input
                          className={`form-control ${errors.provisional_to && "border border-danger"
                            }`}
                          name="provisional_to"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("provisional_to")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.provisional_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Book Closer */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="book_closure_from">
                          Book Closure From
                        </label>
                        <input
                          className={`form-control ${errors.book_closure_from && "border border-danger"
                            }`}
                          name="book_closure_from"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("book_closure_from")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.book_closure_from?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="book_closure_to">Book Closure To</label>
                        <input
                          className={`form-control ${errors.book_closure_to && "border border-danger"
                            }`}
                          name="book_closure_to"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("book_closure_to")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.book_closure_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              {/* Dividend  */}
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Dividend Announcement</h5>
                </div>
                <div className="card-body">
                  {/* Dividend Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Dividend Issue Number </label>
                        <Controller
                          name="dividend_number"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${errors.dividend_number && "border border-danger"
                                }`}
                              id="dividend_number"
                              allowNegative={false}
                              placeholder="Enter Number"
                              readOnly
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.dividend_number?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Dividend Percentage</label>
                        <div className="input-group">
                          <Controller
                            name="dividend_percent"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className={`form-control text-right ${errors.dividend_percent &&
                                  "border border-danger"
                                  }`}
                                id="dividend_percent"
                                allowNegative={false}
                                placeholder="Enter Number"
                                readOnly
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
                          {errors.dividend_percent?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-danger">
                  <h5>Right Announcement</h5>
                </div>
                <div className="card-body">
                  {/* Right Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label>Right Number </label>
                        <Controller
                          name="right_number"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${errors.right_number && "border border-danger"
                                }`}
                              id="right_number"
                              allowNegative={false}
                              placeholder="Enter Number"
                              readOnly
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.right_number?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label>Right Percentage</label>
                        <div className="input-group ">
                          <Controller
                            name="right_percent"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className={`form-control text-right ${errors.right_percent && "border border-danger"
                                  }`}
                                id="right_percent"
                                allowNegative={false}
                                placeholder="Enter Number"
                                readOnly
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
                          {errors.right_percent?.message}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Right Rate */}
                  <div className="row">
                    <div className="col-sm-6 col-md-6">
                      <div className="form-group my-2">
                        <label>Right Rate</label>
                        <Controller
                          name="right_rate"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${errors.right_rate && "border-danger"
                                }`}
                              id="right_rate"
                              allowNegative={false}
                              placeholder="Right Rate"
                              readOnly
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.right_rate?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div className="form-group my-2">
                        <label htmlFor="right_allotment_date">
                          Right Allotment Date
                        </label>
                        <input
                          className={`form-control ${errors.right_allotment_date &&
                            "border border-danger"
                            }`}
                          name="right_allotment_date"
                          type="date"
                          {...register("right_allotment_date")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.right_allotment_date?.message}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="right_subs_from">Right Subs From</label>
                        <input
                          className={`form-control ${errors.right_subs_from && "border border-danger"
                            }`}
                          name="right_subs_from"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("right_subs_from")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.right_subs_from?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="right_subs_to">Right Subs To</label>
                        <input
                          className={`form-control ${errors.right_subs_to && "border border-danger"
                            }`}
                          name="right_subs_to"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("right_subs_to")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.right_subs_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="right_credit_from">
                          Right Credit From
                        </label>
                        <input
                          className={`form-control ${errors.right_credit_from && "border border-danger"
                            }`}
                          name="right_credit_from"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("right_credit_from")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.right_credit_from?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="right_credit_to">Right Credit To</label>
                        <input
                          className={`form-control ${errors.right_credit_to && "border border-danger"
                            }`}
                          name="right_credit_to"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("right_credit_to")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.right_credit_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Bonus Announcement */}
              <div className="card">
                <div className="card-header b-t-warning">
                  <h5>Bonus Announcement</h5>
                </div>
                <div className="card-body">
                  {/* Bonus Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label>Bonus Number </label>
                        <Controller
                          name="bonus_number"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${errors.bonus_number && "border border-danger"
                                }`}
                              id="bonus_number"
                              allowNegative={false}
                              placeholder="Enter Number"
                              readOnly
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.bonus_number?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label>Bonus Percentage</label>
                        <div className="input-group ">
                          <Controller
                            name="bonus_percent"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className={`form-control text-right ${errors.bonus_percent && "border border-danger"
                                  }`}
                                id="bonus_percent"
                                allowNegative={false}
                                placeholder="Enter Number"
                                readOnly
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
                          {errors.bonus_percent?.message}
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12 col-md-12">
                      <div className="form-group my-2">
                        <label htmlFor="bonus_allotment_date">
                          Bonus Allotment Date
                        </label>
                        <input
                          className={`form-control ${errors.bonus_allotment_date &&
                            "border border-danger"
                            }`}
                          name="bonus_allotment_date"
                          type="date"
                          {...register("bonus_allotment_date")}
                          readOnly
                        />
                        <small className="text-danger">
                          {errors.bonus_allotment_date?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Fragment>
    </div>
  );
}
