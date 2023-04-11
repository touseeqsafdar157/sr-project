import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useSelector, useDispatch } from "react-redux";
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
import { darkStyle, disabledStyles, errorStyles } from "../../defaultStyles";
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
import {
  WATCH_INACTIVE_SHAREHOLDERS,
  WATCH_SHAREHOLDERS,
} from "redux/actionTypes";
import { getCompanies } from "../../../store/services/company.service";
import { getInvestors } from "store/services/investor.service"

export default function EditShareholder({ setViewEditPage }) {
  const baseEmail = sessionStorage.getItem("email") || "";
  // holder
  const holder =
    JSON.parse(sessionStorage.getItem("selectedShareholder")) || "";
  // joint holders
  const joint_holders = IsJsonString(holder.joint_holders)
    ? JSON.parse(holder.joint_holders)
    : [];
  // States
  const [loading, setLoading] = useState(false);
  const [shareholderName, setShareholderName] = useState("");
  //options
  const [symbol_options, setSymbol_options] = useState([]);
  const [company_options, setCompany_options] = useState([]);
  const [investor_options, setInvestor_options] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [investors_data, setInvestors_data] = useState([]);
  const [companies_data, setCompanies_data] = useState([]);
  const [investors_data_loading, setInvestors_data_loading] = useState(false);
  // Toggle States
  const [filer, setFiler] = useState(holder?.filer === "Y");
  const [zakat_status, setZakat_status] = useState(
    holder?.zakat_status === "Y"
  );
  const [roshan_account, setRoshan_account] = useState(
    holder?.roshan_account === "Y"
  );
  // IMages
  const [cnic_copy, setCnic_copy] = useState(holder?.cnic_copy || "");
  const [nominee_cnic_copy, setNominee_cnic_copy] = useState(
    holder?.nominee_cnic_copy || ""
  );
  const [zakat_declaration, setZakat_declaration] = useState(
    holder?.zakat_declaration || ""
  );
  const [signature_specimen, setSignature_specimen] = useState(
    holder?.signature_specimen || ""
  );
  const [picture, setPicture] = useState(holder?.picture || "");
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
  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try{
      const response = await getCompanies(baseEmail)
      if (response.status===200) {
            const parents = response.data.data
            setCompanies_data(parents)
            setCompanies_data_loading(false)
      } }catch(error) {
        setCompanies_data_loading(false);
      }
      };
      const getAllInvestors = async () => {
        setInvestors_data_loading(true);
        try{
        const response = await getInvestors(baseEmail)
        if (response.status===200) {
          setInvestors_data(response.data.data);
              setInvestors_data_loading(false)
        } }catch(error) {
          setInvestors_data_loading(false);
        }
        };
        getAllInvestors();
      getAllCompanies();

  }, [])

  const handleUpdateShareholder = async (data) => {
    setStartcalculation(true);
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await updateShareholder(
        email,
        holder.folio_number,
        watch("company_code").value,
        companies_data.find((comp) => comp.code === watch("company_code").value)
          ?.symbol,
        watch("shareholder_id")?.value,
        shareholderName,
        data.shareholder_percent,
        jointHolderObjects,
        data.electronic_shares,
        data.physical_shares,
        data.blocked_shares,
        data.freeze_shares,
        data.pledged_shares,
        data.pending_in,
        data.pending_out,
        data.available_shares,
        data.cdc_account_no,
        data.cdc_participant_id,
        data.cdc_account_type,
        data.total_holding,
        data.cdc_key,
        data.shareholder_mobile,
        data.shareholder_email,
        data.shareholder_phone,
        data.resident_status,
        data.street_address,
        data.city,
        data.country,
        data.passport_no,
        data.passport_expiry,
        data.passport_country,
        data.nominee_name,
        data.nominee_cnic,
        data.nominee_relation,
        data.account_title,
        data.account_no,
        data.bank_name,
        data.baranch_address,
        data.baranch_city,
        filer ? "Y" : "N",
        zakat_status ? "Y" : "N",
        picture,
        signature_specimen,
        cnic_copy,
        nominee_cnic_copy,
        zakat_declaration,
        data.poc_detail,
        data.nationality,
        roshan_account ? "Y" : "N",
        data.right_shares
      );

      if (response.data.status === 200) {
        setTimeout(() => {
          setLoading(false);
          toast.success(`${response.data.message}`);
          setViewEditPage(false);
        }, 2000);
      } else {
        setLoading(false);
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      !!error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : toast.error("Shareholders Not Updated");
    }
  };
  useEffect(() => {
    if (watch("shareholder_id")?.value) {
      setShareholderName(
        investors_data.find(
          (investor) => watch("shareholder_id")?.value === investor.investor_id
        )?.investor_name
      );
    }
  }, [watch("shareholder_id")]);
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
                    <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={company_options.length === 0}
                          options={company_options}
                          id="company_code"
                          placeholder="Select Company"
                          styles={
                            errors.company_code ? errorStyles : disabledStyles
                          }
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    />

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
                      value={shareholderName}
                      placeholder="Select Investor"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shareholder_id">Shareholder ID</label>
                    <Controller
                      name="shareholder_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={investor_options.length === 0}
                          options={investor_options}
                          id="shareholder_id"
                          placeholder="Select Investor"
                          styles={
                            errors.shareholder_id ? errorStyles : disabledStyles
                          }
                        />
                      )}
                      control={control}
                    />

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
                            placeholder="Enter Number"
                          />
                        )}
                        control={control}
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
                          placeholder="Enter Number"
                          readOnly={
                            !companies_data.find(
                              (comp) =>
                                comp.code === watch("company_code")?.value &&
                                comp.company_type === "Private"
                            )
                          }
                        />
                      )}
                      control={control}
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
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
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
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
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
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
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
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
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
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
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
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
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
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
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
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
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
                        />
                      )}
                      control={control}
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
                          onToggle={() => {
                            setFiler(!filer);
                          }}
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
                          onToggle={() => {
                            setZakat_status(!zakat_status);
                          }}
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
                          onToggle={() => {
                            setRoshan_account(!roshan_account);
                          }}
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
                    <input
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
                    />
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
                    <input
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
                    />
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
                    <input
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
                    />
                    <small className="text-danger d-block">
                      {errors.cnic_copy?.message}
                    </small>
                    {cnic_copy && (
                      <img width="200" src={cnic_copy} alt="cnic_copy" />
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="nominee_cnic_copy">Nominee CNIC Copy</label>
                    <input
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
                    />
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
                    <input
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
                    />
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
                          (jh, index) => (
                            <JointHoldersItem
                              key={index}
                              num={index + 1}
                              startCalculation={startCalculation}
                              calculated={startcalculation}
                              jh_name={joint_holders[index]?.jointHolderName}
                              jh_cnic={joint_holders[index]?.jointHolderCNIC}
                              jh_percent={
                                joint_holders[index]?.jointHolderPercent
                              }
                              jh_cnic_expiry={
                                joint_holders[index]?.jointHolderCNICExp
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
