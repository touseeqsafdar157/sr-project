import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { addShareholder } from "../../../store/services/shareholder.service";
import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";
import { getShares } from "../../../store/services/shareholder.service";
import { getvalidDateYMD } from "../../../utilities/utilityFunctions";
import JointHoldersItem from "./jointHolderItem";
import { darkStyle, errorStyles } from "../../defaultStyles";
import LoadableButton from "../../common/loadables";
import InputMask from "react-input-mask";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { getCompanies } from "../../../store/services/company.service";
import { getInvestors } from "store/services/investor.service"

import {
  company_setter,
  folio_setter,
  investor_setter,
  symbol_setter,
} from "../../../store/services/dropdown.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { addShareHolderSchema } from "../../../store/validations/shareholderValidation";
import { getFolioByCounter } from "../../../store/services/company.service";
import {
  WATCH_INACTIVE_SHAREHOLDERS,
  WATCH_SHAREHOLDERS,
  WATCH_SHAREHOLDERS_DROPDOWN,
} from "redux/actionTypes";

export default function AddShareholders({ setViewAddPage }) {
  const baseEmail = sessionStorage.getItem("email") || "";
  const [selectedFolioNo, setSelectedFolioNo] = useState(null);
  const [shareholderName, setShareholderName] = useState("");
  // States
  const [loading, setLoading] = useState(false);
  // options
  const [symbol_options, setSymbol_options] = useState([]);
  const [company_options, setCompany_options] = useState([]);
  const [investor_options, setInvestor_options] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  // Toggle States
  const [filer, setFiler] = useState(false);
  const [zakat_status, setZakat_status] = useState(false);
  const [roshan_account, setRoshan_account] = useState(false);
  // IMages
  const [cnic_copy, setCnic_copy] = useState("");
  const [nominee_cnic_copy, setNominee_cnic_copy] = useState("");
  const [zakat_declaration, setZakat_declaration] = useState("");
  const [signature_specimen, setSignature_specimen] = useState("");
  const [total_holdings, setTotal_holdings] = useState("");
  const [picture, setPicture] = useState("");
  const [startcalculation, setStartcalculation] = useState(false);
  const [jointHolderObjects, setJointHolderObjects] = useState([]);
  const [companies_data, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [investors_data, setInvestors_data] = useState([]);
  const [investors_dropdown, setInvestors_dropdown] = useState([]);
  const [investors_data_loading, setInvestors_data_loading] = useState(false);
  const [sponserNTN, setSponserNTN] = useState('NTN')
  const [type, setType] = useState("");

  const INDIVIDUALS = "INDIVIDUALS";
  const DIRECTORS = "DIRECTORS";
  const EXECUTIVES = "EXECUTIVES";
  const EMPLOYEE = "EMPLOYEE";

  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try{
      const response = await getCompanies(baseEmail)
      if (response.status===200) {
            const parents = response.data.data
            const companies_dropdowns = response.data.data.map((item) => {
              let label = `${item.code} - ${item.company_name}`;
              return { label: label, value: item.code };
            });
          setCompanies_dropdown(companies_dropdowns);
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
          const investors_dropdowns = response.data.data.map((item) => {
            const shareholder_id = item.investor_id && item.investor_id.trim() !== "" ? item.investor_id : item.cnic && item.cnic.trim() !== "" ? item.cnic : item.ntn;
            return {
              label: `${item.investor_name} - ${shareholder_id}`,
              value: shareholder_id,
            };
          });
          setInvestors_dropdown(investors_dropdowns)

              setInvestors_data_loading(false)
        } }catch(error) {
          setInvestors_data_loading(false);
        }
        };
        getAllInvestors();
      getAllCompanies();

  }, [])
  const startCalculation = (holders) => {
    const newArray = jointHolderObjects;
    newArray.push(holders);
    setJointHolderObjects(newArray);
  };

  const handleAddShareholder = async (data) => {
    setStartcalculation(true);
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addShareholder(
        email,
        data.folio_number,
        data.company_code?.value,
        companies_data.find((comp) => comp.code === data.company_code.value)
          ?.symbol,
        data.shareholder_id?.value,
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
        data.right_shares,
        // investors fields
        data.category,
        data.occupation,
        data.salutation,
        data.investor_name,
        data.investor_cnic,
        data.investor_ntn,
        data.date_of_birth,
        data.gender,
        data.religion,
        data.father_name,
        data.spouse_name,
        data.cnic_expiry
      );

      if (response.data.status === 200) {
        setTimeout(() => {
          setLoading(false);
          toast.success(`${response.data.message}`);
          setViewAddPage(false);
        }, 2000);
      } else {
        setLoading(false);
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      !!error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : toast.error("Shareholders Not Submitted");
    }
  };
  // Validation Declarations
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(addShareHolderSchema) });
  useEffect(() => {
    if (!!watch("company_code")?.value) {
      setValue(
        "company_type",
        companies_data.find(
          (comp) => comp.code === watch("company_code")?.value
        )?.company_type
      );
      const getFolioCounter = async () => {
        try {
          const response = await getFolioByCounter(
            baseEmail,
            watch("company_code")?.value
          );
          if (response.status === 200) {
            setSelectedFolioNo(response.data.data);
          }
        } catch (error) {
          !!error?.response?.data?.message
            ? toast.error(error?.response?.data?.message)
            : toast.error("Folios Not Found");
        }
      };
      getFolioCounter();
    }
  }, [watch("company_code")]);
  useEffect(() => {
    selectedFolioNo !== null &&
      setValue("folio_number", parseInt(selectedFolioNo.folio_counter) + 1);
  }, [selectedFolioNo]);
  useEffect(() => {
    if (watch("shareholder_id")?.value) {
      const obj = investors_data.find(
        (investor) => watch("shareholder_id")?.value === investor.investor_id || watch("shareholder_id")?.value === investor.cnic || watch("shareholder_id")?.value === investor.ntn
      );
      // const obj = investors_data.find(
      //   (investor) => watch("shareholder_id")?.value === investor.investor_id
      // );
      setValue('category',obj.category)
      setValue('date_of_birth',obj.birth_date)
      setValue('investor_cnic',obj.cnic)
      setValue('cnic_expiry',obj.cnic_expiry)
      setValue('father_name',obj.father_name)
      setValue('gender',obj.gender)
      setValue('investor_name',obj.investor_name)
      setValue('mobile_no',obj.mobile_no)
      setValue('investor_ntn',obj.ntn)
      setValue('occupation',obj.occupation)
      setValue('religion',obj.religion)
      setValue('salutation',obj.salutation)
      setValue('spouse_name',obj.spouse_name)
      setType(obj.category)
      // setShareholderName(
      //   investors_data.find(
      //     (investor) => watch("shareholder_id")?.value === investor.investor_id || watch("shareholder_id")?.value === investor.cnic || watch("shareholder_id")?.value === investor.ntn
      //   ))

        setShareholderName(
          investors_data.find(
            (investor) => watch("shareholder_id")?.value === investor.investor_id || watch("shareholder_id")?.value === investor.cnic || watch("shareholder_id")?.value === investor.ntn
          )?.investor_name)
      //   investors_data.find(
      //     (investor) => watch("shareholder_id")?.value === investor.investor_id
      //   )?.investor_name
      // );
    }
  }, [watch("shareholder_id")]);

  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleAddShareholder)}>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Shareholder Details</h5>
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
                    <label htmlFor="folio_number">Folio No</label>
                    <input
                      name="folio_number"
                      className={`form-control ${
                        errors.folio_number && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Enter Folio Number"
                      {...register("folio_number")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.folio_number?.message}
                    </small>
                  </div> 
                  <div className="form-group my-2">
                    <label htmlFor="shareholder_id">Shareholder ID</label>
                    <Controller
                      name="shareholder_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={investors_data_loading}
                          options={investors_dropdown}
                          id="shareholder_id"
                          placeholder="Select Investor"
                          styles={errors.shareholder_id && errorStyles}
                        />
                      )}
                      control={control}
                    />
                    {/* <small className="text-danger">
                      {errors.shareholder_id?.message}
                    </small> */}
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
                  {/* <div className="form-group my-2">
                    <label htmlFor="cdc_key">CDC Key</label>
                    <input
                      className={`form-control ${
                        errors.cdc_key && "border border-danger"
                      }`}
                      name="cdc_key"
                      type="text"
                      placeholder="Enter Key"
                      {...register("cdc_key")}
                    />
                    <small className="text-danger">
                      {errors.cdc_key?.message}
                    </small>
                  </div> */}
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
                      // defaultValue={getvalidDateYMD(new Date())}
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
                        thousandSeparator={true}
                        inputMode="numeric"
                        value={total_holdings}
                          {...field}
                          className={`form-control text-right ${
                            errors.total_holding && "border-danger"
                          }`}
                          id="total_holding"
                          allowNegative={false}
                          placeholder="Enter Number"
                          onValueChange={(e) => {
                            let value = e.value;
                            setTotal_holdings(value) ;
                          }}
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
                          (joint_holders, index) => (
                            <JointHoldersItem
                              key={index}
                              num={index + 1}
                              startCalculation={startCalculation}
                              calculated={startcalculation}
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
              className={
                type === INDIVIDUALS ||
                type === DIRECTORS ||
                type === EXECUTIVES ||
                type === EMPLOYEE||
                 sponserNTN=='CNIC'
                  ? "col-sm-12 col-md-6 col-lg-6"
                  : "col-sm-12 col-md-12 col-lg-12"
              }
            >
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Investor Details</h5>
                </div>
                <div className="card-body">

                {/* <div className="form-group my-2">
                    <label htmlFor="investor_id">Investor ID</label>
                    <Controller
                      name="investor_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={investors_data_loading}
                          options={investors_dropdown}
                          id="investor_id"
                          placeholder="Select Investor ID"
                          styles={errors.investor_id && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.investor_id?.message}
                    </small>
                  </div> */}

                  <div className="my-2">
                    <label>Category</label>
                    <select
                      className={`form-control ${
                        errors.category && "border border-danger"
                      }`}
                      name="category"
                      {...register("category")}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="INDIVIDUALS">INDIVIDUALS</option>
                      <option value="PUBLIC SECTOR">PUBLIC SECTOR</option>
                      <option value="JOINT STOCK COMPANIES">
                        JOINT STOCK COMPANIES
                      </option>
                      <option value="FINANCIAL INSTITUTIONS">
                        FINANCIAL INSTITUTIONS
                      </option>
                      <option value="MUTITAL FUND/TRUSTEE">
                        MUTITAL FUND/TRUSTEE
                      </option>
                      <option value="INSURANCE COMPANIES">
                        INSURANCE COMPANIES
                      </option>
                      <option value="INVESTMENT COMPANIES">
                        INVESTMENT COMPANIES
                      </option>
                      <option value="DIRECTORS">DIRECTORS</option>
                      <option value="EXECUTIVES">EXECUTIVES</option>
                      <option value="ASSOCIATED COMPANIES">
                        ASSOCIATED COMPANIES
                      </option>
                      <option value="INVESTMENT COMPANIES">
                        INVESTMENT COMPANIES
                      </option>
                      <option value="LEASING COMPANIES">
                        LEASING COMPANIES
                      </option>
                      <option value="TRUSTS">TRUSTS</option>
                      <option value="NIT AND ICP">NIT AND ICP</option>
                      <option value="MODARBA">MODARBA</option>
                      <option value="MODARBA MANAGEMENT">
                        MODARBA MANAGEMENT
                      </option>
                      <option value="CORPORATE ORGANIZATIONS">
                        CORPORATE ORGANIZATIONS
                      </option>
                      <option value="CHARITABLE INSTITUTES">
                        CHARITABLE INSTITUTES
                      </option>
                      <option value="EMPLOYEE">EMPLOYEE</option>
                      <option value="CDC">CDC</option>
                      <option value="OTHERS">OTHERS</option>
                      <option value="SPONSORS">SPONSORS</option>
                    </select>
                    <small className="text-danger">
                      {errors.category?.message}
                    </small>
                  </div>
                  {type=='SPONSORS'&&
                 <div className="my-2">
                 <label>Sponsors Type</label>
                 <select
                   className={`form-control ${
                     errors.category && "border border-danger"
                   }`}
                   name="sponser"
                   value={sponserNTN}
                  //  {...register("category")}
                  onChange={(e)=>{
                    setSponserNTN(e.target.value)
                  }}
                 >
                   <option value="">Select</option>
                      <option value="CNIC">CNIC</option>
                      <option value="NTN">NTN</option>
                
                 </select>
                 <small className="text-danger">
                   {errors.sponser?.message}
                 </small>
               </div>

                  
                  
                  }


                  <div
                    className="form-group my-2"
                    style={
                      type === INDIVIDUALS ||
                      type === DIRECTORS ||
                      type === EXECUTIVES ||
                      type === EMPLOYEE||
                      sponserNTN=='CNIC'
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
                      type === INDIVIDUALS ||
                      type === DIRECTORS ||
                      type === EXECUTIVES ||
                      type === EMPLOYEE||
                      sponserNTN=='CNIC'
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
                      type !== EMPLOYEE && type !== ""&&
                      sponserNTN=='NTN'
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
                    />
                    <small className="text-danger">
                      {errors.investor_ntn?.message}
                    </small>
                  </div>

                  <div className="row">
                  {(type === 'INDIVIDUALS' ||
               type === 'DIRECTORS' ||
               type === 'EXECUTIVES' ||
               type === 'EMPLOYEE'||
               sponserNTN=='CNIC'
               ) && (
                      <div className="col-md-6">
                        <div className="form-group my-2">
                          <label htmlFor="salutation">Salutation</label>
                          <select
                            name="salutation"
                            className={`form-control ${
                              errors.salutation && "border border-danger"
                            }`}
                            {...register("salutation")}
                          >
                            <option value="">Select</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Dr">Dr</option>
                            <option value="M/s">M/s</option>
                          </select>
                          <small className="text-danger">
                            {errors.salutation?.message}
                          </small>
                        </div>
                      </div>
                    )}
                    <div className={                  
                      type !== INDIVIDUALS && type !== "" &&
                      type !== DIRECTORS && type !== "" &&
                      type !== EXECUTIVES && type !== "" &&
                      type !== EMPLOYEE && type !== ""
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
                        />
                        <small className="text-danger">
                          {errors.investor_name?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  {(type === 'INDIVIDUALS' ||
               type === 'DIRECTORS' ||
               type === 'EXECUTIVES' ||
               type === 'EMPLOYEE'||
               sponserNTN=='CNIC'
               ) && ( 
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
                        />
                        <small className="text-danger">
                          {errors.date_of_birth?.message}
                        </small>
                      </div>
                      <div className="form-group my-2">
                        <label htmlFor="gender">Gender</label>
                        <select
                          name="gender"
                          className={`form-control ${
                            errors.gender && "border border-danger"
                          }`}
                          {...register("gender")}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
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
            {(type === 'INDIVIDUALS' ||
               type === 'DIRECTORS' ||
               type === 'EXECUTIVES' ||
               type === 'EMPLOYEE'||
               sponserNTN=='CNIC'
               ) && ( 
              <div className="col-sm-12 col-md-6 col-xl-6">
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
