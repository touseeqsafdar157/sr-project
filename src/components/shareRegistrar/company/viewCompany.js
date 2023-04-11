import React, { Fragment, useState, useEffect } from "react";
import * as _ from "lodash";
import Breadcrumb from "../../common/breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";
import GovernanceItem from "./addGovernance";
import { AuthorizedPersonItem } from "./addAuthorizedPerson";
import { useSelector } from "react-redux";
import {
  getCompanies,
  updateCompany,
} from "../../../store/services/company.service";
import {
  getShareHoldersByCompany,
  getShares,
} from "../../../store/services/shareholder.service";
import { darkStyle, disabledStyles } from "../../defaultStyles";
import LoadableButton from "../../common/loadables";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { updateInvestor } from "../../../store/services/investor.service";
import InputMask from "react-input-mask";
import NumberFormat from "react-number-format";
import { editCompanySchema } from "../../../store/validations/companyValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { getRoles } from "../../../store/services/features.service";
import { getShareholders } from "store/services/shareholder.service";
import SectorsData from "../Sectors.json";
import moment from "moment";
import ServiceProvider from "./ServiceProvider";
import styled from "styled-components";
export default function ViewCompany() {
  // Email
  const baseEmail = sessionStorage.getItem("email") || "";
  // const shareholders = useSelector((data) => data.Shareholders);
  const [shareholders, setShareholders] = useState([]);
  const company = JSON.parse(sessionStorage.getItem("selectedCompany")) || "";
  const [logo, setLogo] = useState(company.logo);
  const authorized_person = JSON.parse(company.authorized_persons) || "";
  const governance = JSON.parse(company.governance) || "";
  // const serviceObject = JSON.parse(company.service_providers) || ""
  const [next_board_election_date, setNext_Board_Election_Date] = useState("");
  // States
  const [physicalShares, setPhysicalShares] = useState("");
  const [electronicShares, setElectronicShares] = useState("");
  const [physicalSharesPercentage, setPhysicalSharesPercentage] = useState("");
  const [electronicSharesPercentage, setElectronicSharesPercentage] =
    useState("");
  const [startcalculation, setStartcalculation] = useState(false);
  const [authPersonObjects, setAuthPersonObjects] = useState([]);
  const [governanceObjects, setGovernanceObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [active, setActive] = useState(company.active === "Y");
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState({});
  const [parent_company, setParentCompany] = useState("");
  const [serviceObjects, setServicesObjects] = useState([]);
  const [serviceObject, setserviceObject] = useState( company?.service_providers ? JSON.parse(company.service_providers) : "");
  const [next_agm_date, set_next_agm_date] = useState(company?.next_agm_date || '');
  // REACT SELECT STYLES
  // React Select Styles
  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };
  // Yup Validations
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    watch,
  } = useForm({
    defaultValues: editCompanySchema(company).cast(),
    resolver: yupResolver(editCompanySchema(company)),
  });
  // useEffect(()=>{
  //   if(company?.service_providers){
  //     const serviceObj = JSON.parse(company.service_providers) || ""
  //     setserviceObject(serviceObj)
  //   }
  //   else{
  //     setserviceObject("")
  //   }

  // },[JSON.stringify(company)])
  useEffect(() => {
    const getAllRoles = async () => {
      const response = await getRoles(baseEmail);
      if (response.status === 200) {
        const newroles = response.data.data.map((role) => ({
          label: role.role_name,
          value: role.role_name,
        }));
        setRoles(newroles);
      }
    };
    getAllRoles();
    getAllCompanies();
    // getAllShareHolders();
    getShareHoldersByCompanyCode();
    return () => {
      sessionStorage.setItem("selectedCompany", JSON.stringify({}));
    };
  }, []);

  const getAllCompanies = async () => {
    try {
      const response = await getCompanies(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data.map((comp) => ({
          label: comp.company_name + " - " + comp.symbol,
          value: comp.code,
        }));
        const obj = { label: "Not Applicable", value: "N/A" };
        parents.push(obj);
        setParents(parents);
        const parent_company = parents.filter(
          (item) => item.value == company.parent_code
        );
        setParentCompany(
          parent_company.length != 0 ? parent_company[0].label : ""
        );
      }
    } catch (error) {
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  // const getAllShareHolders = async()=>{
  //   try{
  //     const response = await getShareholders(baseEmail)
  //     if (response.status===200) {
  //           const parents = response.data.data
  //           setShareholders(parents)
  //     } }catch(error) {
  //     }
  // }

  const getShareHoldersByCompanyCode = async () => {
    try {
      let comp = JSON.parse(sessionStorage.getItem("selectedCompany"));

      const response = await getShareHoldersByCompany(baseEmail, comp.code, "");
      if (response.status === 200) {
        const parents = response.data.data;
        setShareholders(parents);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (shareholders && !!shareholders.length) {
      const physical_shares = _.sum(
        shareholders
          .filter(
            (comp) =>
              // comp.company_code === company.code &&
              // comp.cdc_key === "NO" &&
              // comp.folio_number !== company.code + "-0"
              comp.cdc_key == "NO" && comp.folio_number !== company.code + "-0"
          )
          .map((da) => parseInt(da.physical_shares))
      );

      setPhysicalShares(physical_shares);
      setPhysicalSharesPercentage(
        !isNaN(
          ((physical_shares / company.outstanding_shares) * 100).toFixed(2)
        )
          ? ((physical_shares / company.outstanding_shares) * 100).toFixed(2) +
              "%"
          : "0%"
      );

      const electronic_shares =
        company.company_type === "Private"
          ? _.sum(
              shareholders
                // .filter((item) => item.company_code === company.code)
                .filter(
                  (comp) =>
                    comp.cdc_key == "YES" &&
                    comp.folio_number !== company.code + "-0"
                )
                .map((item) =>
                  isNaN(parseInt(item.electronic_shares))
                    ? 0
                    : parseInt(item.electronic_shares)
                )
            )
          : shareholders.find(
              (hold) => hold.folio_number === company.code + "-0"
            )?.physical_shares;
      setElectronicShares(electronic_shares);
      setElectronicSharesPercentage(
        !isNaN(
          ((electronic_shares / company.outstanding_shares) * 100).toFixed(2)
        )
          ? ((electronic_shares / company.outstanding_shares) * 100).toFixed(
              2
            ) + "%"
          : "0%"
      );
    }
  }, [shareholders]);

  // Functions
  const startAuthCalculation = (auth_person) => {
    const newArray = authPersonObjects;
    newArray.push(auth_person);
    setAuthPersonObjects(newArray);
  };
  const startSerCalculation = (gov_person) => {
    const newArray = serviceObjects;
    newArray.push(gov_person);
    setServicesObjects(newArray);    
  };
  const startGovCalculation = (gov_person) => {
    const newArray = governanceObjects;
    newArray.push(gov_person);
    setGovernanceObjects(newArray);
  };
  const borderRadiusStyle = { borderRadius: 2 };
  const handleUpdateCompany = async (data) => {};

  useEffect(() => {
    let date = new Date(watch("board_election_date"));
    if (
      moment(date.getFullYear() + 3).format("DD-MM-YYYY") !== "Invalid date"
    ) {
      setNext_Board_Election_Date(
        moment(date.setFullYear(date.getFullYear() + 3)).format("DD-MM-YYYY")
      );
    } else {
      setNext_Board_Election_Date("");
    }
  }, [watch("board_election_date")]);

  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleUpdateCompany)}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Company Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group mb-3">
                    <label>Company Name</label>
                    <input
                      name="company_name"
                      className={`form-control ${
                        errors.company_name && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Company Name"
                      {...register("company_name")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.company_name?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="company_type">Company Type</label>
                    <input
                      name="company_type"
                      className={`form-control ${
                        errors.company_type && "border border-danger"
                      }`}
                      {...register("company_type")}
                      readOnly
                    ></input>
                    <small className="text-danger">
                      {errors.company_type?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label>ISIN</label>
                    <input
                      name="isin"
                      className={`form-control ${
                        errors.isin && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Company Name"
                      {...register("isin")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.isin?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label>Registered Name</label>
                    <input
                      name="registered_name"
                      className={`form-control ${
                        errors.registered_name && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Company Name"
                      {...register("registered_name")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.registered_name?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label>Company Code</label>

                    <Controller
                      name="code"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.code && "border border-danger"
                          }`}
                          id="code"
                          allowNegative={false}
                          placeholder="Enter Company Code"
                          readOnly
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.code?.message}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="symbol">Symbol</label>
                    <input
                      className={`form-control ${
                        errors.symbol && "border border-danger"
                      }`}
                      name="symbol"
                      type="text"
                      placeholder="Symbol"
                      {...register("symbol")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.symbol?.message}
                    </small>
                  </div>

                  {/* <div className="form-group mb-3">
                    <label htmlFor="company_secretary">Company Secretary</label>
                    <input
                      className="form-control"
                      name="company_secretary"
                      type="text"
                      placeholder="Company Secretary"
                      {...register("company_secretary")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.company_secretary?.message}
                    </small>
                  </div> */}

                  <div className="form-group mb-3">
                    <label htmlFor="ntn">NTN</label>
                    <input
                      className="form-control"
                      name="ntn"
                      type="text"
                      placeholder="NTN"
                      {...register("ntn")}
                      readOnly
                    />
                    <small className="text-danger">{errors.ntn?.message}</small>
                  </div>

                  <div className="form-group mb-3">
                    <label> Parent Company</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Parent Company"
                      value={parent_company}
                      readOnly
                    />
                    {/* <small className="text-danger">{errors.ntn?.message}</small> */}
                  </div>

                  {/* <div className="form-group my-2">
                    <label className="my-1" htmlFor="parent">
                      Parent Company
                    </label>
                    <Controller
                      name="parent"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={parents}
                          id="parent"
                          placeholder="Select parent"
                          styles={disabledStyles}
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.parent?.message}
                    </small>
                  </div> */}

                  <div className="form-group mb-3">
                    <label htmlFor="incorporation_no">Incorporation No</label>
                    <input
                      className="form-control"
                      name="incorporation_no"
                      type="text"
                      placeholder="Incorporation No"
                      {...register("incorporation_no")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.incorporation_no?.message}
                    </small>
                  </div>

                  {/* <div className="form-group mb-3">
                    <label htmlFor="sector_code">Sector Code</label>
                    <input
                      className="form-control"
                      name="sector_code"
                      type="text"
                      placeholder="Sector Code"
                      {...register("sector_code")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.sector_code?.message}
                    </small>
                  </div> */}

                  <div className="form-group mb-3">
                    <label htmlFor="sector_code">Sector Code</label>
                    <input
                      className="form-control"
                      name="sector_code"
                      type="text"
                      placeholder="Sector Code"
                      // {...register("sector_code")}
                      value={company.sector_code.label}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.sector_code?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="bussines_service">Bussines service</label>
                    <input
                      className="form-control"
                      name="bussines_service"
                      type="text"
                      placeholder="Bussines Service"
                      {...register("bussines_service")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.bussines_service?.message}
                    </small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="logo">Company Logo</label>
                    {/* <input
                      className={`form-control ${
                        errors.logo && "border border-danger"
                      }`}
                      name="logo"
                      type="file"
                      {...register("logo")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          let img = e.target.files[0];
                          const reader = new FileReader();
                          reader.readAsDataURL(img);
                          reader.onload = function () {
                            setLogo(reader.result);
                          };
                        }
                      }}
                    /> */}
                    <small className="text-danger d-block">
                      {errors.logo?.message}
                    </small>
                    {logo && (
                      <img width="200" src={logo} alt="logo_of_company" />
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="website">Website</label>
                    <input
                      className="form-control"
                      name="website"
                      type="text"
                      placeholder="Company Website"
                      {...register("website")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.website?.message}
                    </small>
                  </div>
                  {/* <div className="form-group mb-3">
                    <label htmlFor="auditor">Auditor</label>
                    <input
                      className="form-control"
                      name="company_auditor"
                      type="text"
                      placeholder="Auditor"
                      {...register("company_auditor")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.company_auditor?.message}
                    </small>
                  </div> */}
                  <div className="form-group mb-3">
                    <label htmlFor="Registrar"> Registrar</label>
                    <input
                      className="form-control"
                      name=" company_registrar"
                      type="text"
                      placeholder="Registrar"
                      {...register("company_registrar")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.company_registrar?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="fiscal year">Fiscal Year</label>
                    <input
                      className={`form-control ${
                        errors.fiscal_year && "border border-danger"
                      }`}
                      name="fiscal_year"
                      type="month"
                      placeholder="MMMM-YYYY"
                      {...register("fiscal_year")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.fiscal_year?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="agm_date">
                     AGM DATE
                    </label>
                    <input
                      className={`form-control ${
                        errors.agm_date && "border border-danger"
                      }`}
                      name="agm_date"
                      type="date"
                      {...register("agm_date")}
                      readOnly                    />
                    <small className="text-danger">
                      {errors.agm_date?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label>
                    Next AGM Date
                    </label>
                    <input
                    name='next_agm_date'
                   className={`form-control ${
                    errors.next_agm_date && "border border-danger"
                  }`}
                      type="date"
                      {...register("next_agm_date")}
                      value={next_agm_date}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.next_agm_date?.message}
                    </small>

                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="active">Active </label>
                    <ToggleButton
                      name="active"
                      value={active}
                      thumbStyle={borderRadiusStyle}
                      trackStyle={borderRadiusStyle}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-xl-4">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Contact Person</h5>
                </div>
                <div className="card-body">
                  <div className="form-group mb-3">
                    <label htmlFor="contact_person_name">Name</label>
                    <input
                      className="form-control"
                      name="contact_person_name"
                      type="text"
                      placeholder="Company Person Name"
                      {...register("contact_person_name")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.contact_person_name?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Phone</label>
                    <Controller
                      name="contact_person_phone"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.contact_person_phone && "border-danger"
                          }`}
                          id="contact_person_phone"
                          allowNegative={false}
                          placeholder="Enter Phone Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.contact_person_phone?.message}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="exchange_no">Exchange No</label>
                    <input
                      className="form-control"
                      name="exchange_no"
                      type="text"
                      placeholder="Exchange No"
                      {...register("exchange_no")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.exchange_no?.message}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="contact_person_email">Email</label>
                    <input
                      className="form-control"
                      name="contact_person_email"
                      type="email"
                      placeholder="Email"
                      {...register("contact_person_email")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.contact_person_email?.message}
                    </small>
                  </div>
                </div>
              </div>

              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Head Office Address</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-3">
                    <label className="my-1" htmlFor="ho_address">
                      Address
                    </label>
                    <textarea
                      className={`form-control ${
                        errors.ho_address && "border border-danger"
                      }`}
                      type="text"
                      name="ho_address"
                      id="ho_address"
                      placeholder="Enter Address"
                      {...register("ho_address")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.ho_address?.message}
                    </small>
                  </div>

               

                  <div className="form-group mb-3">
                    <label htmlFor="ho_country">Country</label>
                    <input
                      className="form-control"
                      name="ho_country"
                      type="text"
                      placeholder="Country"
                      defaultValue={company?.head_office_country|| ''}
                      {...register("ho_country")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.ho_country?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="ho_province">Province</label>
                    <input
                      className="form-control"
                      name="ho_province"
                      type="text"
                      placeholder="Province"
                      defaultValue={company?.province|| ''}
                      {...register("ho_province")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.ho_province?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="ho_city">City</label>
                    <input
                      className="form-control"
                      name="ho_city"
                      type="text"
                      placeholder="City"
                      defaultValue={company?.head_office_city || ''}
                      {...register("ho_city")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.ho_city?.message}
                    </small>
                  </div>
                </div>
              </div>
              {/* <div className="card">
                <div className="card-header b-t-primary">
                  <h5>Board Memebers</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Authorized Persons</label>
                    <Controller
                      name="no_authorized_persons"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_authorized_persons && "border-danger"
                          }`}
                          id="no_authorized_persons"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_authorized_persons?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Governance</label>
                    <Controller
                      name="no_governance"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_governance && "border-danger"
                          }`}
                          id="no_governance"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_governance?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Service Providers</label>
                    <Controller
                      name="service_provider"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.service_provider && "border-danger"
                          }`}
                          id="service_provider"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.service_provider?.message}
                    </small>
                  </div>
                </div>
              </div> */}
              <div className="card">
                <div className="card-header b-t-primary">
                  <h5>Election Information</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Number of Directors</label>
                    <Controller
                      name="number_of_directors"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.number_of_directors && "border-danger"
                          }`}
                          id="number_of_directors"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.number_of_directors?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shareholder_directors">
                      No of Shareholder Directors
                    </label>
                    <input
                      className={`form-control ${
                        errors.shareholder_directors && "border border-danger"
                      }`}
                      name="Enter Number"
                      type="text"
                      placeholder="shareholder_directors"
                      {...register("shareholder_directors")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.shareholder_directors?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="independent_directors">
                      No of Independent Directors
                    </label>
                    <input
                      className={`form-control ${
                        errors.independent_directors && "border border-danger"
                      }`}
                      name="independent_directors"
                      type="text"
                      placeholder="Enter Number"
                      {...register("independent_directors")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.independent_directors?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="board_election_date">
                      Board Election Date
                    </label>
                    <input
                      className={`form-control ${
                        errors.board_election_date && "border border-danger"
                      }`}
                      name="board_election_date"
                      type="date"
                      {...register("board_election_date")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.board_election_date?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>
                    Next Board Election Date
                    </label>
                    <input
                      className={`form-control`}
                      type="date"
                      name="next_board_election_date"
                      // value={next_board_election_date}
                      {...register('next_board_election_date')}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors?.next_board_election_date?.message}
                    </small>
                  </div>
                  {/* <div className="form-group my-2">
                    <label>Next Board Election Date</label>
                    <input
                      className={`form-control`}
                      type="text"
                      value={next_board_election_date}
                      readOnly
                    />
                  </div> */}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-xl-4">
              {/* <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>CEO</h5>
                </div>
                <div className="card-body">
                  <div className="form-group mb-3">
                    <label htmlFor="ceo_name">Name</label>
                    <input
                      className="form-control"
                      name="ceo_name"
                      type="text"
                      placeholder="Name"
                      {...register("ceo_name")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.ceo_name?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label>Phone</label>
                    <Controller
                      name="ceo_phone"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.ceo_phone && "border-danger"
                          }`}
                          id="ceo_phone"
                          allowNegative={false}
                          placeholder="Enter Phone Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.ceo_phone?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label>Mobile No.</label>
                    <Controller
                      name="ceo_mobile"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.ceo_mobile && "border-danger"
                          }`}
                          id="ceo_mobile"
                          allowNegative={false}
                          placeholder="Enter Mobile Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.ceo_mobile?.message}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="ceo_email">Email</label>
                    <input
                      className="form-control"
                      name="ceo_email"
                      type="email"
                      placeholder="Email"
                      {...register("ceo_email")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.ceo_email?.message}
                    </small>
                  </div>
                </div>
              </div> */}

              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Shareholding Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="outstanding_shares">
                      Outstanding Shares
                    </label>
                    <Controller
                      name="outstanding_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.outstanding_shares && "border border-danger"
                          }`}
                          id="outstanding_shares"
                          thousandSeparator={true}
                          allowNegative={false}
                          placeholder="Enter Outstanding Shares"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.outstanding_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="Electronic">Electronic Shares</label>
                    <NumberFormat
                      className={`form-control text-right`}
                      id="Electronic"
                      allowNegative={false}
                      placeholder="Enter Electronic Shares"
                      thousandSeparator={true}
                      value={electronicShares}
                      readOnly
                    />
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: `${electronicSharesPercentage}` }}
                      >
                        <b className="mx-1">{electronicSharesPercentage}</b>
                      </div>
                    </div>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="Physical">Physical Shares</label>
                    <NumberFormat
                      className={`form-control text-right`}
                      id="Physical"
                      allowNegative={false}
                      placeholder="Enter Physical Shares"
                      thousandSeparator={true}
                      value={physicalShares}
                      readOnly
                    />
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: `${physicalSharesPercentage}` }}
                      >
                        <b className="mx-1">{physicalSharesPercentage}</b>
                      </div>
                    </div>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="face_value">
                      Face Value
                    </label>
                    <Controller
                      name="face_value"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.face_value && "border border-danger"
                          }`}
                          id="face_value"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Face Value"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.face_value?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="total_shares">
                      Total Shares
                    </label>
                    <Controller
                      name="total_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.total_shares && "border border-danger"
                          }`}
                          id="total_assets"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Total Assets"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.total_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="allot_size">
                      Lot Size
                    </label>
                    <Controller
                      name="allot_size"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.allot_size && "border border-danger"
                          }`}
                          id="allot_size"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Total Assets"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.allot_size?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="treasury_shares">
                      Treasury Shares
                    </label>
                    <Controller
                      name="treasury_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.treasury_shares && "border border-danger"
                          }`}
                          id="treasury_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.treasury_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="free_float">
                      Free Float
                    </label>
                    <Controller
                      name="free_float"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.free_float && "border border-danger"
                          }`}
                          id="free_float"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.free_float?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="preference_shares">
                      Preference Shares
                    </label>
                    <Controller
                      name="preference_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.preference_shares && "border border-danger"
                          }`}
                          id="preference_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.preference_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="ordinary_shares">
                      Ordinary Shares
                    </label>
                    <Controller
                      name="ordinary_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.ordinary_shares && "border border-danger"
                          }`}
                          id="ordinary_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.ordinary_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="non_voting_shares">
                      Non Voting Shares
                    </label>
                    <Controller
                      name="non_voting_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.non_voting_shares && "border border-danger"
                          }`}
                          id="non_voting_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.non_voting_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="redeemable_shares">
                      Redeemable Shares
                    </label>
                    <Controller
                      name="redeemable_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.redeemable_shares && "border border-danger"
                          }`}
                          id="redeemable_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.redeemable_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="management_shares">
                      Management Shares
                    </label>
                    <Controller
                      name="management_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.management_shares && "border border-danger"
                          }`}
                          id="management_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.management_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="authorized_capital">
                            Authorized Capital
                    </label>
                    <Controller
                      name="authorized_capital"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.authorized_capital && "border border-danger"
                          }`}
                          id="authorized_capital"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.authorized_capital?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="paid_up_capital">
                     Paid Up Capital
                    </label>
                    <Controller
                      name="paid_up_capital"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.paid_up_capital && "border border-danger"
                          }`}
                          id="paid_up_capital"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                    {errors.paid_up_capital?.message}
                      {/* {isError? <span className="text-danger">Paid Up Capital can not Greather the Authorized Capital </span>:''} */}
                    </small>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header b-t-primary">
                  <h5>Board Memebers</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Authorized Persons</label>
                    <Controller
                      name="no_authorized_persons"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_authorized_persons && "border-danger"
                          }`}
                          id="no_authorized_persons"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_authorized_persons?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Governance</label>
                    <Controller
                      name="no_governance"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_governance && "border-danger"
                          }`}
                          id="no_governance"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_governance?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Service Providers</label>
                    <Controller
                      name="service_provider"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.service_provider && "border-danger"
                          }`}
                          id="service_provider"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.service_provider?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Authorized Persons */}
          <div className="row">
            <div className="card w-100 mx-4">
              <div className="card-header b-t-success">
                <b>Authorized Persons</b>
              </div>
              <div className="card-body">
                {parseInt(watch("no_authorized_persons"))>0 ? (
                  < TableWrapper className="table table-responsive">
                    <thead>
                      <tr>
                      <th className="text-nowrap">S No.</th>
                          <th className="text-nowrap"> Name</th>
                          <th className="text-nowrap">Email</th>
                          <th className="text-nowrap">
                             Contact
                          </th>
                          <th className="text-nowrap">Reason</th>
                          <th className="text-nowrap">Date</th>
                          <th className="text-nowrap">Active</th>
                        {/* <th className="text-nowrap">Authorized Person Role</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ...Array(
                          Math.abs(parseInt(watch("no_authorized_persons")))
                        ),
                      ].length > 0 &&
                        [
                          ...Array(
                            Math.abs(parseInt(watch("no_authorized_persons")))
                          ),
                        ].length < 5 &&
                        roles.length !== 0 &&
                        [
                          ...Array(parseInt(watch("no_authorized_persons"))),
                        ].map((ap, index) => (
                          <AuthorizedPersonItem
                            key={index}
                            num={index + 1}
                            startCalculation={startAuthCalculation}
                            calculated={true}
                            roles={roles}
                            ap_name={authorized_person[index]?.name}
                            ap_contact={authorized_person[index]?.contact}
                            ap_email={authorized_person[index]?.email}
                            ap_role={authorized_person[index]?.role}
                            activeuser={authorized_person[index]?.active}
                            dates={authorized_person[index]?.date}
                            reasons={authorized_person[index]?.reason}
                            editPerson={false}
                          />
                        ))}
                    </tbody>
                  </TableWrapper >
                ) : <center className='text-center mt-2'>Authorized Person Data Not Available </center>}
              </div>
            </div>
          </div>
          {/* Governance */}
          <div className="row">
            <div className="card w-100 mx-4">
              <div className="card-header b-t-success">
                <b>Governance</b>
              </div>
              <div className="card-body">
                {parseInt(watch("no_governance"))>0 ? (
                  <TableWrapper className="table table-responsive">
                    <thead>
                      <tr>
                      <th className="text-nowrap">S No.</th>
                          <th className="text-nowrap"> Name</th>
                          <th className="text-nowrap">Father/Husband Name</th>
                          <th className="text-nowrap">Address</th>
                          <th className="text-nowrap">Nationality</th>
                          <th className="text-nowrap"> Email</th>
                          <th className="text-nowrap"> Contact</th>
                          <th className="text-nowrap"> Business Occupation</th>
                          <th className="text-nowrap"> CNIC/Passport</th>
                          <th className="text-nowrap"> Role</th>
                          <th className="text-nowrap">Reason</th>
                          <th className="text-nowrap">Date</th>
                          <th className="text-nowrap">Active</th>
                          <th className="text-nowrap">Nature Directorship</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(Math.abs(parseInt(watch("no_governance"))))]
                        .length > 0 &&
                        // [...Array(Math.abs(parseInt(watch("no_governance"))))]
                        //   .length < 5 &&
                        roles.length !== 0 &&
                        [...Array(Math.abs(parseInt(watch("no_governance"))))]
                          .length <=20 ? 
                        [...Array(parseInt(watch("no_governance")))].map(
                          (ap, index) => (
                            <GovernanceItem
                              key={index}
                              num={index + 1}
                              startCalculation={startGovCalculation}
                              calculated={true}
                              roles={roles}
                              gov_name={governance[index]?.name}
                              gov_email={governance[index]?.email}
                              gov_role={governance[index]?.role}
                              gov_contact={governance[index]?.contact}
                              gov_cnic={governance[index]?.cnic_passport} 
                              reasons={governance[index]?.reason}
                              dates={governance[index]?.date}
                              activeGov={governance[index]?.active} 
                              gov_father_husband_name={governance[index]?.father_husband_name}
                              gov_nationality={governance[index]?.nationality}
                              gov_business={governance[index]?.business}
                              gov_directorship={governance[index]?.directorship}
                              gov_address={governance[index]?.address}
                              viewCompany = {true}
                              editGover={false}
                              />
                          )
                        ) :  [...Array(Math.abs(parseInt(watch("no_governance"))))]
                        .length ? <> <td/>
                        <td/>
                        <td/>
                        <td><center className='text-danger text-center mt-2'>Governance can't be more than 20</center></td>
                        <td/>
                        <td/></> : ''}
                    </tbody>
                  </TableWrapper>
                ): <center className='text-center mt-2'>Governance Data Not Available </center>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="card w-100 mx-4">
              <div className="card-header b-t-success">
                <b>Service Provider</b>
              </div>
              <div className="card-body">
                { parseInt(watch("service_provider"))>0 ?  (
                  <TableWrapper className="table table-responsive">
                    <thead>
                      <tr>
                        <th className="text-nowrap">S No.</th>
                        <th className="text-nowrap">Service Provider Name</th>
                        <th className="text-nowrap">Service Provider Type </th>
                        <th className="text-nowrap">Phone</th>
                        <th className="text-nowrap">CNIC</th>
                        <th className="text-nowrap">Contact</th>
                        <th className="text-nowrap">Email</th>
                        <th className="text-nowrap">Address</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(Math.abs(parseInt(watch("service_provider"))))]?.
                        length > 0 &&
                        [...Array(Math.abs(parseInt(watch("service_provider"))))]?.
                          length <=4 ?
                        [...Array(parseInt(watch("service_provider")))]?.map(
                          (ap, index) => (
                            <ServiceProvider
                              key={index}
                              num={index + 1}
                              startCalculation={startSerCalculation}
                              calculated={true}
                              editService={false}
                              ser_auditor={serviceObject[index]?.auditor}
                              ser_email={serviceObject[index]?.email}
                              ser_type = {serviceObject[index]?.type}
                              ser_address = {serviceObject[index]?.address}
                              ser_contact={serviceObject[index]?.contact}
                              ser_phone = {serviceObject[index]?.phone }
                              ser_cnic={serviceObject[index]?.cnic}
                              viewCompany = {true}
                            />
                          )
                        ) : [...Array(Math.abs(parseInt(watch("service_provider"))))]?.length ? <> <td/>
                        <td/>
                        <td/>
                        <td><center className='text-danger text-center mt-2'>Service Provider can't be more than 4</center></td>
                        <td/>
                        <td/></> : ''}
                    </tbody>
                  </TableWrapper>
                ): <center className='text-center mt-2'>Service Provider  Data Not Available </center>}
              </div>
            </div>
          </div>
        </form>
      </Fragment>
    </div>
  );
}
const TableWrapper = styled.table`
padding-bottom: 100px;
overflow-x: scroll;
overflow-x: scroll;
::-webkit-scrollbar{
  height: 5px;
  width: 3px;
}

::-webkit-scrollbar-track{
  background: #F9F9FB;
}
::-webkit-scrollbar-thumb{
  background: #4E515680;
  border-radius: 5px;

}

`;