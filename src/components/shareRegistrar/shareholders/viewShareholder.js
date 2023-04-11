import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  addShareholder,
  updateShareholder,
} from "../../../store/services/shareholder.service";
import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";
import { getShares } from "../../../store/services/shareholder.service";
import {
  getvalidDateYMD,
  IsJsonString,
} from "../../../utilities/utilityFunctions";
import JointHoldersItem from "./jointHolderItem";
import { darkStyle, errorStyles } from "../../defaultStyles";
import LoadableButton from "../../common/loadables";
import InputMask from "react-input-mask";
import NumberFormat from "react-number-format";
import Select from "react-select";

import {
  company_setter,
  folio_setter,
  investor_setter,
  symbol_setter,
} from "../../../store/services/dropdown.service";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addShareHolderSchema,
  updateShareholderSchema,
} from "../../../store/validations/shareholderValidation";

export default function AddShareholders() {
  // holder
  const holder =
    JSON.parse(sessionStorage.getItem("selectedShareholder")) || "";
  // joint holders
  const joint_holders = IsJsonString(holder.joint_holders)
    ? JSON.parse(holder.joint_holders)
    : [];
console.log('holderholderholder', holder)
    const [type, setType] = useState(holder.category && holder?.category.toUpperCase());
    const checkIndividuals = () =>
    holder.category && holder?.category.toUpperCase() === "INDIVIDUALS";
    const checkDirectors = () =>
    holder.category && holder?.category.toUpperCase() === "DIRECTORS";
    const checkExecutives = () =>
    holder.category && holder?.category.toUpperCase() === "EXECUTIVES";
    const checkEmployee = () =>
    holder.category && holder?.category.toUpperCase() === "EMPLOYEE";
      const INDIVIDUALS = "INDIVIDUALS";
      const DIRECTORS = "DIRECTORS";
      const EXECUTIVES = "EXECUTIVES";
      const EMPLOYEE = "EMPLOYEE";

  // Selector STARTS
  const companies_data = useSelector((data) => data.Companies.companies_data);
  // Selector ENDS
  // States
  const [loading, setLoading] = useState(false);
  //options
  const [symbol_options, setSymbol_options] = useState([]);
  const [company_options, setCompany_options] = useState([]);
  const [investor_options, setInvestor_options] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  // Toggle States
  const [filer, setFiler] = useState(holder.filer === "Y");
  const [zakat_status, setZakat_status] = useState(holder.zakat_status === "Y");
  const [roshan_account, setRoshan_account] = useState(
    holder.roshan_account === "Y"
  );
  // IMages
  const [cnic_copy, setCnic_copy] = useState(holder.cnic_copy);
  const [nominee_cnic_copy, setNominee_cnic_copy] = useState(
    holder.nominee_cnic_copy
  );
  const [zakat_declaration, setZakat_declaration] = useState(
    holder.zakat_declaration
  );
  const [signature_specimen, setSignature_specimen] = useState(
    holder.signature_specimen
  );
  const [picture, setPicture] = useState(holder.picture);
  const [startcalculation, setStartcalculation] = useState(false);
  const [jointHolderObjects, setJointHolderObjects] = useState([]);
  // Validation Decalration
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    defaultValues: updateShareholderSchema(holder).cast(),
    resolver: yupResolver(updateShareholderSchema(holder), {
      stripUnknown: true,
      abortEarly: false,
    }),
  });
  useEffect(async () => {
    try {
      setCompany_options(await company_setter());
      setInvestor_options(await investor_setter());
    } catch (err) {
      toast.error(`${err.response.data.message}`);
    }
  }, []);
  const startCalculation = (holders) => {
    const newArray = jointHolderObjects;
    newArray.push(holders);
    setJointHolderObjects(newArray);
  };

  const handleUpdateShareholder = async (data) => {
  };
  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleUpdateShareholder)}>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Shareholder Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="folio_no">Folio No</label>
                    <input
                      className="form-control"
                      type="text"
                      name="folio_no"
                      id="folio_no"
                      value={holder.folio_number}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="company_code">Company</label>
                    <input
                      className="form-control"
                      type="text"
                      name="company_code"
                      id="company_code"
                      value={holder.company_code?.label}
                      readOnly
                    />
                    {/* <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={company_options.length === 0}
                          options={company_options}
                          defaultValue={holder.company_code}
                          id="company_code"
                          placeholder="Select Company"
                          styles={errors.company_code && errorStyles}
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    /> */}

                    <small className="text-danger">
                      {errors.company_code?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shareholder_name">Shareholder Name</label>
                    <input
                      name="shareholder_name"
                      className="form-control"
                      type="text"
                      value={holder.shareholder_name}
                      placeholder="Select Investor"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shareholder_id">Shareholder ID</label>
                    <input
                      name="shareholder_id"
                      className="form-control"
                      type="text"
                      value={holder?.shareholder_id || ''}
                      placeholder="Select ShareHolder Id"
                      readOnly
                    />

                    {/* <Controller
                      name="shareholder_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={investor_options.length === 0}
                          options={investor_options}
                          defaultValue={holder.shareholder_id}
                          id="shareholder_id"
                          placeholder="Select Investor"
                          styles={errors.shareholder_id && errorStyles}
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    /> */}

                    <small className="text-danger">
                      {errors.shareholder_id?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shareholder_mobile">Mobile</label>
                    <Controller
                      name="shareholder_mobile"
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          className={`form-control ${
                            errors.shareholder_mobile && "border border-danger"
                          }`}
                          placeholder="Enter Mobile No."
                          mask="+\92-999-9999999"
                          readOnly
                        ></InputMask>
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.shareholder_mobile?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shareholder_email">Email</label>
                    <input
                      name="shareholder_email"
                      className={`form-control ${
                        errors.shareholder_email && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Enter Email"
                      {...register("shareholder_email")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.shareholder_email?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shareholder_phone">Phone</label>
                    <Controller
                      name="shareholder_phone"
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          className={`form-control ${
                            errors.shareholder_phone && "border border-danger"
                          }`}
                          placeholder="Enter Phone No."
                          mask="+\92-99-9999999"
                          readOnly
                        ></InputMask>
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.shareholder_phone?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="resident_status">Resident Status</label>
                    <input
                      name="resident_status"
                      className={`form-control ${
                        errors.resident_status && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Enter Status"
                      {...register("resident_status")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.resident_status?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="poc_detail">POC Detail</label>
                    <input
                      name="poc_detail"
                      className={`form-control ${
                        errors.poc_detail && "border border-danger"
                      }`}
                      type="text"
                      placeholder="POC Detail"
                      {...register("poc_detail")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.poc_detail?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="street_address">Street Address</label>
                    <textarea
                      name="street_address"
                      className={`form-control ${
                        errors.street_address && "border border-danger"
                      }`}
                      type="text"
                      id="street_address"
                      placeholder="Street Address"
                      {...register("street_address")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.street_address?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="city">City</label>
                    <input
                      name="city"
                      className={`form-control ${
                        errors.city && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Enter City"
                      {...register("city")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.city?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="country">Country</label>
                    <input
                      name="country"
                      className={`form-control ${
                        errors.country && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Enter Country"
                      {...register("country")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.country?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="nationality">Nationality</label>
                    <input
                      name="nationality"
                      className={`form-control ${
                        errors.nationality && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Enter Nationality"
                      {...register("nationality")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.nationality?.message}
                    </small>
                  </div>
                </div>
              </div>

              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>CDC Account Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="cdc_account_no">CDC Account Number</label>
                    <input
                      className={`form-control ${
                        errors.cdc_account_no && "border border-danger"
                      }`}
                      name="cdc_account_no"
                      type="text"
                      placeholder="Enter Number"
                      {...register("cdc_account_no")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.cdc_account_no?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="cdc_participant_id">
                      CDC Participant ID
                    </label>
                    <input
                      className={`form-control ${
                        errors.cdc_participant_id && "border border-danger"
                      }`}
                      name="cdc_participant_id"
                      type="text"
                      placeholder="Enter Number"
                      {...register("cdc_participant_id")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.cdc_participant_id?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="cdc_account_type">CDC Account Type</label>
                    <input
                      className={`form-control ${
                        errors.cdc_account_type && "border border-danger"
                      }`}
                      name="cdc_account_type"
                      type="text"
                      placeholder="Enter Type"
                      {...register("cdc_account_type")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.cdc_account_type?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="cdc_key">CDC Key</label>
                    <input
                      className={`form-control ${
                        errors.cdc_key && "border border-danger"
                      }`}
                      name="cdc_key"
                      type="text"
                      placeholder="Enter Key"
                      {...register("cdc_key")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.cdc_key?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-xl-4">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Passport Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="passport_no">Passport</label>
                    <input
                      name="passport_no"
                      className={`form-control ${
                        errors.passport_no && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Enter Passport Number"
                      {...register("passport_no")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.passport_no?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="passport_expiry">Passport Expiry</label>
                    <input
                      name="passport_expiry"
                      className={`form-control ${
                        errors.passport_expiry && "border border-danger"
                      }`}
                      type="date"
                      placeholder="Enter Date"
                      {...register("passport_expiry")}
                      defaultValue={getvalidDateYMD(new Date())}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.passport_expiry?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="passport_country">Passport Country</label>
                    <input
                      name="passport_country"
                      className={`form-control ${
                        errors.passport_country && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Passport Country"
                      {...register("passport_country")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.passport_country?.message}
                    </small>
                  </div>
                </div>
              </div>
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Shares Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Shareholder Percent</label>
                    <div className="input-group mb-3">
                      <Controller
                        name="shareholder_percent"
                        render={({ field }) => (
                          <NumberFormat
                            {...field}
                            className={`form-control text-right ${
                              errors.shareholder_percent &&
                              "border border-danger"
                            }`}
                            id="shareholder_percent"
                            allowNegative={false}
                            thousandSeparator={true}
                            placeholder="Enter Number"
                            readOnly
                          />
                        )}
                        control={control}
                        readOnly
                      />
                      <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon2">
                          %
                        </span>
                      </div>
                    </div>
                    <small className="text-danger">
                      {errors.shareholder_percent?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Electronic Shares</label>
                    <Controller
                      name="electronic_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.electronic_shares && "border-danger"
                          }`}
                          id="electronic_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.electronic_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Physical Shares</label>
                    <Controller
                      name="physical_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.physical_shares && "border-danger"
                          }`}
                          id="physical_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.physical_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Right Shares</label>
                    <Controller
                      name="right_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.right_shares && "border-danger"
                          }`}
                          id="right_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.right_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Blocked Shares</label>
                    <Controller
                      name="blocked_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.blocked_shares && "border-danger"
                          }`}
                          id="blocked_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.blocked_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Freeze Shares</label>
                    <Controller
                      name="freeze_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.freeze_shares && "border-danger"
                          }`}
                          id="freeze_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.freeze_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Pledged Shares</label>
                    <Controller
                      name="pledged_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.pledged_shares && "border-danger"
                          }`}
                          id="pledged_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.pledged_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Pending In</label>
                    <Controller
                      name="pending_in"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.pending_in && "border-danger"
                          }`}
                          id="pending_in"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.pending_in?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Pending Out</label>
                    <Controller
                      name="pending_out"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.pending_out && "border-danger"
                          }`}
                          id="pending_out"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.pending_out?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Available Shares</label>
                    <Controller
                      name="available_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.available_shares && "border-danger"
                          }`}
                          id="available_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.available_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Total Holding</label>
                    <Controller
                      name="total_holding"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.total_holding && "border-danger"
                          }`}
                          id="total_holding"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.total_holding?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>No of Joint Holders</label>
                    <Controller
                      name="no_joint_holders"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_joint_holders && "border-danger"
                          }`}
                          id="no_joint_holders"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.no_joint_holders?.message}
                    </small>
                  </div>
                </div>
              </div>
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Nominee Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="nominee_name">Nominee Name</label>
                    <input
                      className={`form-control ${
                        errors.nominee_name && "border border-danger"
                      }`}
                      name="nominee_name"
                      type="text"
                      placeholder="Enter Name"
                      {...register("nominee_name")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.nominee_name?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="nominee_cnic">Nominee CNIC</label>
                    <Controller
                      name="nominee_cnic"
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          className={`form-control ${
                            errors.nominee_cnic && "border border-danger"
                          }`}
                          placeholder="Enter CNIC"
                          mask="99999-9999999-9"
                          readOnly
                        ></InputMask>
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.nominee_cnic?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="nominee_relation">Nominee Relation</label>
                    <input
                      className={`form-control ${
                        errors.nominee_relation && "border border-danger"
                      }`}
                      name="nominee_relation"
                      type="text"
                      placeholder="Enter Relation"
                      {...register("nominee_relation")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.nominee_relation?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-xl-4">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Bank Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="account_title">Account Title</label>
                    <input
                      className={`form-control ${
                        errors.account_title && "border border-danger"
                      }`}
                      name="account_title"
                      type="text"
                      placeholder="Account Title"
                      {...register("account_title")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.account_title?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="account_no">Account No.</label>
                    <input
                      name="account_no"
                      className={`form-control ${
                        errors.account_no && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Account Number"
                      {...register("account_no")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.account_no?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="bank_name">Bank Name</label>
                    <input
                      className={`form-control ${
                        errors.bank_name && "border border-danger"
                      }`}
                      name="bank_name"
                      type="text"
                      placeholder="Bank Name"
                      {...register("bank_name")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.bank_name?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="baranch_address">Branch Address</label>
                    <textarea
                      className={`form-control ${
                        errors.baranch_address && "border border-danger"
                      }`}
                      type="text"
                      name="baranch_address"
                      id="baranch_address"
                      placeholder="Enter Branch Address"
                      {...register("baranch_address")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.baranch_address?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="baranch_city">Branch City</label>
                    <input
                      name="baranch_city"
                      className={`form-control ${
                        errors.baranch_city && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Enter City"
                      {...register("baranch_city")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.baranch_city?.message}
                    </small>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-lg-4 col-md-4">
                      <div className="form-group">
                        <br />
                        <label>Filer </label>
                        <br />
                        <ToggleButton
                          value={filer}
                          thumbStyle={borderRadiusStyle}
                          trackStyle={borderRadiusStyle}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-lg-4 col-md-4">
                      <div className="form-group">
                        <label>Zakat Exempted </label>
                        <ToggleButton
                          value={zakat_status}
                          thumbStyle={borderRadiusStyle}
                          trackStyle={borderRadiusStyle}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-lg-4 col-md-4">
                      <div className="form-group">
                        <label>Roshan Account </label>
                        <ToggleButton
                          value={roshan_account}
                          thumbStyle={borderRadiusStyle}
                          trackStyle={borderRadiusStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header b-t-primary">
                  <h5>Attachments</h5>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="picture">Picture</label>
                    {/* <input
                      className={`form-control ${
                        errors.picture && "border border-danger"
                      }`}
                      name="picture"
                      type="file"
                      {...register("picture")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          let img = e.target.files[0];
                          const reader = new FileReader();
                          reader.readAsDataURL(img);
                          reader.onload = function () {
                            setPicture(reader.result);
                          };
                        }
                      }}
                      readOnly
                    /> */}
                    <small className="text-danger d-block">
                      {errors.picture?.message}
                    </small>
                    {picture && (
                      <img
                        width="200"
                        src={picture}
                        alt="image_of_shareholder"
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="signature_specimen">
                      Signature Specimen
                    </label>
                    {/* <input
                      className={`form-control ${
                        errors.signature_specimen && "border border-danger"
                      }`}
                      name="signature_specimen"
                      type="file"
                      {...register("signature_specimen")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          let img = e.target.files[0];
                          const reader = new FileReader();
                          reader.readAsDataURL(img);
                          reader.onload = function () {
                            setSignature_specimen(reader.result);
                          };
                        }
                      }}
                      readOnly
                    /> */}
                    <small className="text-danger d-block">
                      {errors.signature_specimen?.message}
                    </small>
                    {signature_specimen && (
                      <img
                        width="200"
                        src={signature_specimen}
                        alt="signature_specimen"
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cnic_copy">CNIC Copy</label>
                    {/* <input
                      className={`form-control ${
                        errors.cnic_copy && "border border-danger"
                      }`}
                      name="cnic_copy"
                      type="file"
                      {...register("cnic_copy")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          let img = e.target.files[0];
                          const reader = new FileReader();
                          reader.readAsDataURL(img);
                          reader.onload = function () {
                            setCnic_copy(reader.result);
                          };
                        }
                      }}
                      readOnly
                    /> */}
                    <small className="text-danger d-block">
                      {errors.cnic_copy?.message}
                    </small>
                    {cnic_copy && (
                      <img width="200" src={cnic_copy} alt="cnic_copy" />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="nominee_cnic_copy">Nominee CNIC Copy</label>
                    {/* <input
                      className={`form-control ${
                        errors.nominee_cnic_copy && "border border-danger"
                      }`}
                      name="nominee_cnic_copy"
                      type="file"
                      {...register("nominee_cnic_copy")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          let img = e.target.files[0];
                          const reader = new FileReader();
                          reader.readAsDataURL(img);
                          reader.onload = function () {
                            setNominee_cnic_copy(reader.result);
                          };
                        }
                      }}
                      readOnly
                    /> */}
                    <small className="text-danger d-block">
                      {errors.nominee_cnic_copy?.message}
                    </small>
                    {nominee_cnic_copy && (
                      <img
                        width="200"
                        src={nominee_cnic_copy}
                        alt="nominee_cnic_copy"
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="zakat_declaration">Zakat Declaration</label>
                    {/* <input
                      className={`form-control ${
                        errors.zakat_declaration && "border border-danger"
                      }`}
                      name="zakat_declaration"
                      type="file"
                      {...register("zakat_declaration")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          let img = e.target.files[0];
                          const reader = new FileReader();
                          reader.readAsDataURL(img);
                          reader.onload = function () {
                            setZakat_declaration(reader.result);
                          };
                        }
                      }}
                      readOnly
                    /> */}
                    <small className="text-danger d-block">
                      {errors.zakat_declaration?.message}
                    </small>
                    {zakat_declaration && (
                      <img
                        width="200"
                        src={zakat_declaration}
                        alt="zakat_declaration"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="card w-100 mx-4">
              <div className="card-header b-t-success">
                <b>JOINT HOLDERS</b>
              </div>
              <div className="card-body">
                {watch("no_joint_holders") && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="text-nowrap">S No.</th>
                        <th className="text-nowrap">Joint Holder Name</th>
                        <th className="text-nowrap">Joint Holder CNIC</th>
                        <th className="text-nowrap">
                          Joint Holder CNIC Expiry
                        </th>
                        <th className="text-nowrap">Joint Holder Percent</th>
                        <th className="text-nowrap">Filer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(Math.abs(parseInt(watch("no_joint_holders"))))]
                        .length > 0 &&
                        [...Array(parseInt(watch("no_joint_holders")))].map(
                          (jholders, index) => (
                            <JointHoldersItem
                              key={index}
                              num={index + 1}
                              startCalculation={startCalculation}
                              calculated={true}
                              jh_name={joint_holders[index]?.jointHolderName}
                              jh_cnic={joint_holders[index]?.jointHolderCNIC}
                              jh_cnic_expiry={
                                joint_holders[index]?.jointHolderCNICExp
                              }
                              jh_percent={
                                joint_holders[index]?.jointHolderPercent
                              }
                              jh_filer={joint_holders[index]?.filer}
                            />
                          )
                        )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="row">
          <div
            className={(checkIndividuals() ||
              checkDirectors() ||
              checkExecutives() ||
              checkEmployee())
                ? "col-sm-12 col-md-6 col-lg-6"
                : "col-sm-12 col-md-12 col-lg-12"
            }
          >
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Investor Details</h5>
              </div>
              <div className="card-body">
        
                <div className="my-2">
                  <label>Category</label>
                  <input
                    className={`form-control ${
                      errors.category && "border border-danger"
                    }`}
                    name="category"
                    {...register("category")}
                    onChange={(e) => setType(e.target.value)}
                    disabled
                  />
                  <small className="text-danger">
                    {errors.category?.message}
                  </small>
                </div>
                <div
                  className="form-group my-2"
                  style={
                    type === "INDIVIDUALS" ||
                    type === "DIRECTORS" ||
                    type === "EXECUTIVES" ||
                    type === "EMPLOYEE"
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  <label htmlFor="investor_cnic">CNIC</label>
                  <Controller
                    name="investor_cnic"
                    render={({ field }) => (
                      <InputMask
                        {...field}
                        className={`form-control ${
                          errors.investor_cnic && "border border-danger"
                        }`}
                        placeholder="CNIC"
                        mask="99999-9999999-9"
                        readOnly
                      ></InputMask>
                    )}
                    control={control}
                  />
                  <small className="text-danger">
                    {errors.investor_cnic?.message}
                  </small>
                </div>
                <div
                  className="form-group my-2"
                  style={
                    type === "INDIVIDUALS" ||
                    type === "DIRECTORS" ||
                    type === "EXECUTIVES" ||
                    type === "EMPLOYEE"
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  <label htmlFor="cnic_expiry">CNIC Expiry</label>
                  <input
                    className={`form-control ${
                      errors.cnic_expiry && "border border-danger"
                    }`}
                    name="cnic_expiry"
                    type="date"
                    placeholder="placeholder"
                    {...register("cnic_expiry")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.cnic_expiry?.message}
                  </small>
                </div>
                <div
                  className="form-group my-2"
                  style={
                    type !== INDIVIDUALS && type !== "" &&
                    type !== DIRECTORS && type !== "" &&
                    type !== EXECUTIVES && type !== "" &&
                    type !== EMPLOYEE && type !== ""
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  <label htmlFor="investor_ntn">NTN</label>
                  <input
                    name="investor_ntn"
                    className={`form-control ${
                      errors.investor_ntn && "border border-danger"
                    }`}
                    type="text"
                    placeholder="Enter NTN"
                    {...register("investor_ntn")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.investor_ntn?.message}
                  </small>
                </div>

                <div className="row">
                  {(checkIndividuals() ||
                  checkDirectors() ||
                  checkExecutives() ||
                  checkEmployee())
                   && (
                    <div className="col-md-4">
                      <div className="form-group my-2">
                        <label htmlFor="salutation">Salutation</label>
                        <input
                          name="salutation"
                          className={`form-control ${
                            errors.salutation && "border border-danger"
                          }`}
                          {...register("salutation")}
                          readOnly
                        >
                        </input>
                        <small className="text-danger">
                          {errors.salutation?.message}
                        </small>
                      </div>
                    </div>
                  )}
                  <div className={(checkIndividuals() ||
                          checkDirectors() ||
                          checkExecutives() ||
                          checkEmployee())
                     ? "col-12" : "col-12"}>
                    <div className="form-group my-2">
                      <label htmlFor="investor_name">Investor Name</label>
                      <input
                        className={`form-control ${
                          errors.investor_name && "border border-danger"
                        }`}
                        name="investor_name"
                        type="text"
                        placeholder="Enter Name"
                        {...register("investor_name")}
                        readOnly
                      />
                      <small className="text-danger">
                        {errors.investor_name?.message}
                      </small>
                    </div>
                  </div>
                </div>

                {(checkIndividuals() ||
                checkDirectors() ||
                checkExecutives() ||
                checkEmployee())
                 && (
                  <>
                    <div className="form-group my-2">
                      <label htmlFor="date_of_birth">Date of Birth</label>
                      <input
                        className={`form-control ${
                          errors.date_of_birth && "border border-danger"
                        }`}
                        name="date_of_birth"
                        type="date"
                        placeholder="DOB"
                        {...register("date_of_birth")}
                        readOnly
                      />
                      <small className="text-danger">
                        {errors.date_of_birth?.message}
                      </small>
                    </div>
                    <div className="form-group my-2">
                      <label htmlFor="gender">Gender</label>
                      <input
                        name="gender"
                        className={`form-control ${
                          errors.gender && "border border-danger"
                        }`}
                        {...register("gender")}
                        readOnly
                      >
                      </input>
                      <small className="text-danger">
                        {errors.gender?.message}
                      </small>
                    </div>

                    <div className="form-group my-2">
                      <label htmlFor="occupation"> Occupation </label>
                      <input
                        name="occupation"
                        className={`form-control ${
                          errors.occupation && "border border-danger"
                        }`}
                        id="occupation"
                        type="text"
                        placeholder="Enter Occupation"
                        {...register("occupation")}
                        readOnly
                      />
                      <small className="text-danger">
                        {errors.occupation?.message}
                      </small>
                    </div>

                    <div className="form-group my-2">
                      <label htmlFor="religion">Religion</label>
                      <input
                        className={`form-control ${
                          errors.religion && "border border-danger"
                        }`}
                        name="religion"
                        type="text"
                        placeholder="Enter Religion"
                        {...register("religion")}
                        readOnly
                      />
                      <small className="text-danger">
                        {errors.religion?.message}
                      </small>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {(checkIndividuals() ||
          checkDirectors() ||
          checkExecutives() ||
          checkEmployee())
           && (
            <div className="col-sm-12 col-md-6">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Relatives Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="father_name">Father Name </label>
                    <input
                      name="father_name"
                      className={`form-control ${
                        errors.father_name && "border border-danger"
                      }`}
                      id="father_name"
                      type="text"
                      placeholder="Enter Father Name"
                      {...register("father_name")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.father_name?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label htmlFor="spouse_name">Spouse Name </label>
                    <input
                      name="spouse_name"
                      className={`form-control ${
                        errors.spouse_name && "border border-danger"
                      }`}
                      id="spouse_name"
                      type="text"
                      placeholder="Enter Spouse Name"
                      {...register("spouse_name")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.spouse_name?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        </form>
      </Fragment>
    </div>
  );
}
