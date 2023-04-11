import React, { Fragment, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import LoadableButton from "../../common/loadables";
import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";
import { addInvestor } from "../../../store/services/investor.service";
// Redux
import { useDispatch } from "react-redux";
// Validation Packages Imports
import { addInvestorSchema } from "../../../store/validations/investorsValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
// Input Mask
import InputMask from "react-input-mask";
import NumberFormat from "react-number-format";

import Select from "react-select";
import {
  WATCH_INVESTORS,
  WATCH_INVESTORS_DROPDOWN,
} from "../../../redux/actionTypes";
export default function AddInvestors({ setViewAddPage }) {
  const dispatch = useDispatch();
  const [zakat_exempted, setZakat_exempted] = useState(false);
  const [attachment_picture, setAttachment_picture] = useState("");
  const [cnic_copy, setCnic_copy] = useState("");
  const [nominee_cnic_copy, setNominee_cnic_copy] = useState("");
  const [zakat_declaration, setZakat_declaration] = useState("");
  const [picture, setPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [filer, setFiler] = useState("");
  const [type, setType] = useState("");
  const [cnic, setCnic] = useState('')
  const [sponserNTN, setSponserNTN] = useState('NTN')
  const [error, setError] =useState(false);
  console.log('=====sponserNTN', sponserNTN)
  // Validation Declarations
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
    watch,
    control,
  } = useForm({ resolver: yupResolver(addInvestorSchema) });
  const handleAddInvestorForm = async (data) => {
    const isCnic = cnic;
if(isCnic){
  if(isCnic.replaceAll("_", "").replaceAll("-", "").length < 13) {
    setError(true)
    return
  }
  else{
    setError(false)
  
    }
}
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addInvestor(
        email,
        data.category,
        data.occupation,
        data.salutation,
        data.investor_name,
        cnic,
        // data.investor_cnic,
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
        : toast.error("Investors Requests Not Submitted");
    }
  };
  const borderRadiusStyle = { borderRadius: 2 };
  const INDIVIDUALS = "INDIVIDUALS";
  const DIRECTORS = "DIRECTORS";
  const EXECUTIVES = "EXECUTIVES";
  const EMPLOYEE = "EMPLOYEE";
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleAddInvestorForm)}>
          <div className="row">
            <div
              className={
                type === INDIVIDUALS ||
                type === DIRECTORS ||
                type === EXECUTIVES ||
                type === EMPLOYEE || 
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
                  <div className="my-2">
                    <label>Category</label>
                    <select
                      className={`form-control ${
                        errors.category && "border border-danger"
                      }`}
                      name="category"
                      {...register("category")}
                      onChange={(e) => {
                        setCnic('');
                        setError(false);
                        // resetField("investor_cnic");
                        resetField("cnic_expiry");
                        resetField("investor_ntn");
                        resetField("salutation");
                        resetField("investor_name");
                        resetField("date_of_birth");
                        resetField("gender");
                        resetField("occupation");
                        resetField("religion");
                        resetField("father_name");
                        resetField("spouse_name");
                        setType(e.target.value)}}
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
                        MUTUTAL FUND/TRUSTEE
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
                      {/* <option value="INVESTMENT COMPANIES">
                        INVESTMENT COMPANIES
                      </option> */}
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
                          value={cnic}
                          onChange={(e)=> setCnic(e.target.value)}
                        ></InputMask>
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {error ? 'Enter Complete CNIC' : ''}
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
