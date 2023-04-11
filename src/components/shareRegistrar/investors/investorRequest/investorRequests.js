import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import ToggleButton from "react-toggle-button";
import Select from "react-select";
import LoadableButton from "../../../common/loadables";
import { darkStyle } from "../../../defaultStyles";

import {
  addInvestorRequest,
  getInvestors,
} from "../../../../store/services/investor.service";

import { ToastContainer, toast } from "react-toastify";

import {
  folio_setter,
  symbol_setter,
  txn_type_setter,
  announcement_id_setter,
  entitlement_id_setter,
} from "../../../../store/services/dropdown.service";
// Validation Packages Imports
import { addInvestorRequestSchema } from "../../../../store/validations/investorRequestValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
// Input Mask
import InputMask from "react-input-mask";
import NumberFormat from "react-number-format";
import { getShareholders } from "../../../../store/services/shareholder.service";
import { getCompanies } from "../../../../store/services/company.service";
export default function InvestorRequests({ setViewAddPage }) {
  // Email
  const baseEmail = sessionStorage.getItem("email") || "";
  // React Select Data
  const status_types = [
    { label: "Incomplete", value: "Incomplete" },
    { label: "Pending", value: "Pending" },
    { label: "Closed", value: "Closed" },
  ];
  // React Select Alert Styles
  // React Select Styles
  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({ resolver: yupResolver(addInvestorRequestSchema) });

  const [loading, setLoading] = useState(false);

  //options

  const investor_id = watch("to_investor_id")?.value;
  const [companies, setCompanies] = useState([]);
  const [announcement_id_options, setAnnoucement_id_options] = useState([]);
  const [entitlement_id_options, setEntitlement_id_options] = useState([]);
  const [symbol_options, setSymbol_options] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [shareHoldings, setShareHoldings] = useState([]);
  const [checkShareHoldings, setCheckShareHoldings] = useState([]);
  const [txn_types_options, setTxn_types_options] = useState([]);
  // errors

  useEffect(async () => {
    try {
      setAnnoucement_id_options(await announcement_id_setter());
      setEntitlement_id_options(await entitlement_id_setter());
      setSymbol_options(await symbol_setter());
      setFolio_options(await folio_setter());
      setTxn_types_options(await txn_type_setter());
    } catch (err) {
      !!err?.response?.data?.message
        ? toast.error(err?.response?.data?.message)
        : toast.error("Options Not Found");
    }
  }, []);
  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await getCompanies(baseEmail);
        setCompanies(
          response.data.data.map((comp) => ({
            label: comp.company_name + " - " + comp.code,
            value: comp.code,
          }))
        );
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Companies Not Found");
      }
    };
    getAllCompanies();
  }, []);
  useEffect(() => {
    const getAllShareholders = async () => {
      try {
        const response = await getShareholders(baseEmail);
        setCheckShareHoldings(response.data.data);
        setShareHoldings(
          response.data.data
            .filter((hold) => hold.shareholder_id === investor_id)
            .map((holding) => ({
              label: holding.folio_number + " - " + holding.shareholder_name,
              value: holding.folio_number,
            }))
        );
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(`${error?.response?.data?.message}`)
          : toast.error("Shareholdings Not Found");
      }
    };
    getAllShareholders();
  }, [watch("to_investor_id")]);
  useEffect(() => {
    const getAllInvestors = async () => {
      try {
        const response = await getInvestors(baseEmail);
        if (response?.status === 200) {
          setInvestors(
            response.data.data.map((investor) => ({
              label: investor.account_no + "-" + investor.investor_name,
              value: investor.investor_id,
            }))
          );
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(`${error?.response?.data?.message}`)
          : toast.error("Investors Not Found");
      }
    };
    // end amc dropdown
    getAllInvestors();
  }, []);

  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addInvestorRequest(
        email,
        // request_id,
        data.request_date,
        data.folio_number.value,
        data.request_type.value,
        data.announcement_id.value,
        data.entitlement_id.value,
        data.symbol.value,
        data.company_code.value,
        data.quantity.replaceAll(",", ""),
        data.price.replaceAll(",", ""),
        data.amount.replaceAll(",", ""),
        data.amount_payable.replaceAll(",", ""),
        data.amount_paid.replaceAll(",", ""),
        data.to_folio_number.value,
        data.to_investor_id.value
      );

      if (response.data.status === 200) {
        setLoading(false);
        toast.success(`${response.data.message}`);
        setViewAddPage(false);
      }
    } catch (error) {
      setLoading(false);
      !!error?.response?.data?.message
        ? toast.error(`${error?.response?.data?.message}`)
        : toast.error("Request Not Submitted");
    }
  };
  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleAddInvestorRequest)}>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Investor Request Details</h5>
                </div>
                <div className="card-body">
                  {/* <div className="mb-3">
                  <label>Request ID</label>
                  <input
                    className="form-control"
                    name="Name"
                    type="text"
                    placeholder="Enter Id"
                    value={request_id}
                    onChange={(e) => setRequest_id(e.target.value)}
                  />
                  {request_idError && (
                    <p className="error-color">* Request id is required</p>
                  )}
                </div> */}
                  <div className="form-group my-2">
                    <label>Request Date</label>
                    <input
                      name="request_date"
                      className={`form-control ${
                        errors.request_date && "border border-danger"
                      }`}
                      type="date"
                      placeholder="Enter Date"
                      {...register("request_date")}
                    />
                    <small className="text-danger">
                      {errors.request_date?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="folio_number">Folio Number </label>
                    <Controller
                      name="folio_number"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={folio_options.length === 0}
                          options={folio_options}
                          id="folio_number"
                          placeholder="Select Folio Number"
                          styles={errors.folio_number && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.folio_number?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label htmlFor="request_type">Request Type</label>
                    <Controller
                      name="request_type"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={txn_types_options.length === 0}
                          options={txn_types_options}
                          id="request_type"
                          placeholder="Select Request Type"
                          styles={errors.request_type && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.request_type?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label htmlFor="announcement_id">Announcement ID</label>
                    <Controller
                      name="announcement_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={announcement_id_options.length === 0}
                          options={announcement_id_options}
                          id="announcement_id"
                          placeholder="Select Announcement ID"
                          styles={errors.announcement_id && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.announcement_id?.message}
                    </small>
                  </div>

                  {/* <div className="form-group my-2">
                    <label htmlFor="entitlement_id">Entitlement ID </label>
                    <Controller
                      name="entitlement_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={entitlement_id_options.length === 0}
                          options={entitlement_id_options}
                          id="entitlement_id"
                          placeholder="Select Entitlement ID"
                          styles={errors.entitlement_id && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.entitlement_id?.message}
                    </small>
                  </div> */}
                  <div className="form-group my-2">
                    <label htmlFor="entitlement_id">Entitlement ID </label>
                    <Controller
                      name="entitlement_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={entitlement_id_options.length === 0}
                          options={entitlement_id_options}
                          id="entitlement_id"
                          placeholder="Select Entitlement ID"
                          styles={errors.entitlement_id && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.entitlement_id?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="symbol">Symbol </label>
                    <Controller
                      name="symbol"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={symbol_options.length === 0}
                          options={symbol_options}
                          id="symbol"
                          placeholder="Select Entitlement ID"
                          styles={errors.symbol && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.symbol?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="company_code">Company</label>
                    <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={companies.length === 0}
                          options={companies}
                          id="company_code"
                          placeholder="Select Company"
                          styles={errors.company_code && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.company_code?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Quantity</label>
                    <Controller
                      name="quantity"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.quantity && "border border-danger"
                          }`}
                          id="quantity"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Quantity"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.quantity?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Price</label>
                    <Controller
                      name="price"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.price && "border border-danger"
                          }`}
                          id="price"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Price"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.price?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-4 col-xl-4">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>AMOUNT DETAILS</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Amount</label>
                    <Controller
                      name="amount"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.amount && "border border-danger"
                          }`}
                          id="amount"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Amount"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.amount?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label>Amount Payable</label>
                    <Controller
                      name="amount_payable"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.amount_payable && "border border-danger"
                          }`}
                          id="amount_payable"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Amount Payable"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.amount_payable?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Amount Paid</label>
                    <Controller
                      name="amount_paid"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.amount_paid && "border border-danger"
                          }`}
                          id="amount_paid"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Amount Paid"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.amount_paid?.message}
                    </small>
                  </div>
                  {/* <div className="form-group my-2">
                    <label htmlFor="approved_date">Approved Date</label>
                    <input
                      className={`form-control ${
                        errors.approved_date && "border border-danger"
                      }`}
                      name="approved_date"
                      type="date"
                      {...register("approved_date")}
                    />
                    <small className="text-danger">
                      {errors.approved_date?.message}
                    </small>
                  </div> */}

                  {/* <div className="form-group my-2">
                    <label htmlFor="status">Status</label>
                    <Controller
                      name="status"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={request_type_options.length === 0}
                          options={request_type_options}
                          id="status"
                          placeholder="Select Status"
                          styles={errors.status && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.status?.message}
                    </small>
                  </div> */}

                  {/* <div className="form-group my-2">
                    <label htmlFor="closed_date">Closed Date</label>
                    <input
                      className={`form-control ${
                        errors.closed_date && "border border-danger"
                      }`}
                      name="closed_date"
                      type="date"
                      {...register("closed_date")}
                    />
                    <small className="text-danger">
                      {errors.closed_date?.message}
                    </small>
                  </div> */}

                  {/* <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="email" className="text-nowrap">
                          Final Approval
                        </label>
                        <ToggleButton
                          value={final_approval}
                          thumbStyle={borderRadiusStyle}
                          trackStyle={borderRadiusStyle}
                          onToggle={() => {
                            setFinal_approval(!final_approval);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="email">Closed </label>
                        <ToggleButton
                          value={closed}
                          thumbStyle={borderRadiusStyle}
                          trackStyle={borderRadiusStyle}
                          onToggle={() => {
                            setClosed(!closed);
                          }}
                        />
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-4 col-xl-4">
              <div className="card">
                <div className="card-header b-t-danger">
                  <h5>
                    <b>Transfer To</b>
                  </h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="to_investor_id">Transfer To </label>
                    <Controller
                      name="to_investor_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={investors.length === 0}
                          options={investors}
                          id="to_investor_id"
                          placeholder="Select Investor"
                          styles={errors.to_investor_id && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.to_investor_id?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="to_folio_number">Share Holding </label>
                    <Controller
                      name="to_folio_number"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={shareHoldings.length === 0}
                          options={shareHoldings}
                          id="to_folio_number"
                          placeholder="Select Share Holding"
                          styles={errors.to_folio_number && appliedStyles}
                          isDisabled={!investor_id}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.to_folio_number?.message}
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
}
