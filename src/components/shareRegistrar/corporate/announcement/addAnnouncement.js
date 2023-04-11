import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addCorporateAnnouncement } from "../../../../store/services/corporate.service";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import {
  WATCH_ANNOUNCEMENTS,
  WATCH_ANNOUNCEMENTS_DROPDOWN,
} from "../../../../redux/actionTypes";
import { addAnnouncmentSchema } from "../../../../store/validations/announcementValidation";
import NumberFormat from "react-number-format";
import { darkStyle, errorStyles } from "../../../defaultStyles";
import {
  company_setter,
  symbol_setter,
} from "../../../../store/services/dropdown.service";
import { getCompanyById } from "../../../../store/services/company.service";

export default function AddAnnouncement({ setViewAddPage }) {

  const email = sessionStorage.getItem("email") || "";
  const dispatch = useDispatch();
  // Yup Validation
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({ resolver: yupResolver(addAnnouncmentSchema) });
  const [loading, setLoading] = useState(false);

  const [symbol, setSymbol] = useState('');
  const [rightRate, setRightRate] = useState('');
  const [rightNumber, setRightNumber] = useState('');
  const [bonusNumber, setBonusNumber] = useState('');
  const [dividendNumber, setDividendNumber] = useState('');
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

  useEffect(async () => {
    try {
      setSymbol_options(await symbol_setter());
      setCompany_code_options(await company_setter());

    } catch (err) {
      toast.error(`${err.response.data.message}`);
    }

  }, []);

  const handleAddAnnouncement = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addCorporateAnnouncement(
        email,
        data.company_code?.value,
        // data.symbol?.value,
        symbol,
        data.announcement_date,
        data.dividend_number || "0",
        data.dividend_percent || "0",
        data.bonus_number || "0",
        data.bonus_percent || "0",
        data.right_number || "0",
        data.right_percent || "0",
        data.period?.value,
        data.period_ended,
        data.book_closure_from,
        data.book_closure_to,
        data.right_subs_from,
        data.right_subs_to,
        data.provisional_from,
        data.provisional_to,
        data.right_credit_from,
        data.right_credit_to,
        data.right_rate,
        data.right_allotment_date,
        data.bonus_allotment_date
      );

      if (response.data.status === 200) {
        setTimeout(() => {
          setLoading(false);
          toast.success(`${response.data.message}`);
          setViewAddPage(false);
        }, 4000);
      } else {
        setLoading(false);
        !!response?.data?.message
          ? toast.error(`${response.data.message}`)
          : toast.error("Announcement Not Submitted");
      }
    } catch (error) {
      setLoading(false);
      !!error.response?.data?.message
        ? toast.error(`${error.response.data.message}`)
        : toast.error("Announcement Not Submitted");
    }
  };

  useEffect(async () => {
    if (watch('company_code')?.value !== undefined) {
      try {
        const response = await getCompanyById(email, watch('company_code')?.value);
        if (response.status === 200) {
          setSymbol(response?.data?.data?.symbol)
        } else {
          setSymbol('')
        }
      } catch (error) {
        if (error.response !== undefined) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    }
  }, [watch('company_code')])

  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleAddAnnouncement)}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Announcement</h5>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label>Company Code </label>
                    <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={company_code_options.length === 0}
                          options={company_code_options}
                          id="company_code"
                          placeholder="Select Company"
                          styles={errors.company_code ? errorStyles : darkStyle}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.company_code?.message ? "Enter Company Code" : ""}

                    </small>
                  </div>
                  {/* <div className="form-group">
                    <label>Symbol </label>
                    <Controller
                      name="symbol"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={symbol_options.length === 0}
                          options={symbol_options}
                          id="symbol"
                          placeholder="Select Symbol"
                          styles={errors.symbol ? errorStyles : darkStyle}
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
                      value={symbol}
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
                    />
                    <small className="text-danger">
                      {errors.announcement_date?.message}
                    </small>
                  </div>
                  {/* Provisional Trading Date */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="period">Period</label>
                        <Controller
                          name="period"
                          render={({ field }) => (
                            <Select
                              {...field}
                              placeholder="Select Period"
                              options={period_options}
                              styles={errors.period ? errorStyles : darkStyle}
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
                        />
                        <small className="text-danger">
                          {errors.period_ended?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="provisional_from">
                          Provisional Trading From
                        </label>
                        <input
                          className={`form-control ${errors.provisional_from && "border border-danger"
                            }`}
                          name="provisional_from"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("provisional_from")}
                        />
                        <small className="text-danger">
                          {errors.provisional_from?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="provisional_to">
                          Provisional Trading To
                        </label>
                        <input
                          className={`form-control ${errors.provisional_to && "border border-danger"
                            }`}
                          name="provisional_to"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("provisional_to")}
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
                        />
                        <small className="text-danger">
                          {errors.book_closure_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  {
                    (rightRate ==='' && dividendNumber ==='' && rightNumber ==='' && bonusNumber ==='') && (
                      <div className="row">
                        <div className="col-12">
                          <small className="text-danger">
                            {errors.check_any?.message}
                          </small>
                        </div>
                      </div>
                    )

                  }

                </div>
              </div>

              <div className="card ">
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
                                value={dividendNumber}
                                onValueChange={(e)=>{
                                  setDividendNumber(e.value)
                                }}
                              id="dividend_number"
                              allowNegative={false}
                              placeholder="Enter Number"
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
                        <div className="input-group mb-3">
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

                  <div className="row">
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
                      <div className="form-group">
                        <label>Right Number </label>
                        <Controller
                          name="right_number"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${errors.right_number && "border border-danger"
                                }`}
                                value={rightNumber}
                                onValueChange={(e)=>{
                                  setRightNumber(e.value)
                                }}
                              id="right_number"
                              allowNegative={false}
                              placeholder="Enter Number"
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
                      <div className="form-group">
                        <label>Right Percentage</label>
                        <div className="input-group">
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
                                value={rightRate}
                                onValueChange={(e)=>{
                                  setRightRate(e.value)
                                }}
                              id="right_rate"
                              allowNegative={false}
                              placeholder="Right Rate"
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
                        />
                        <small className="text-danger">
                          {errors.right_allotment_date?.message}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Right Subs Date */}
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
                        />
                        <small className="text-danger">
                          {errors.right_subs_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  {/* Right Credit Dates */}
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
                        />
                        <small className="text-danger">
                          {errors.right_credit_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Bonus Card */}
              <div className="card ">
                <div className="card-header b-t-warning">
                  <h5>Bonus Announcement</h5>
                </div>
                <div className="card-body">
                  {/* Bonus Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Bonus Number </label>
                        <Controller
                          name="bonus_number"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${errors.bonus_number && "border border-danger"
                                }`}
                                value={bonusNumber}
                                onValueChange={(e)=>{
                                  setBonusNumber(e.value)
                                }}
                              id="bonus_number"
                              allowNegative={false}
                              placeholder="Enter Number"
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
                      <div className="form-group">
                        <label>Bonus Percentage</label>
                        <div className="input-group mb-3">
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
                  {/* Book Closer */}
                  {/* <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="book_closure_from">
                          Book Closure From
                        </label>
                        <input
                          className={`form-control ${
                            errors.book_closure_from && "border border-danger"
                          }`}
                          name="book_closure_from"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("book_closure_from")}
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
                          className={`form-control ${
                            errors.book_closure_to && "border border-danger"
                          }`}
                          name="book_closure_to"
                          type="date"
                          placeholder="Enter Period Ended"
                          {...register("book_closure_to")}
                        />
                        <small className="text-danger">
                          {errors.book_closure_to?.message}
                        </small>
                      </div>
                    </div>
                  </div> */}
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
}
