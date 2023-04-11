import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { Controller, useForm } from "react-hook-form";
import { updateInvestor } from "../../../store/services/investor.service";
import { useDispatch } from "react-redux";
import Select from "react-select";
import InputMask from "react-input-mask";
import NumberFormat from "react-number-format";
import LoadableButton from "../../common/loadables";
import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";
import { editInvestorSchema } from "../../../store/validations/investorsValidation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getvalidDateYMD } from "../../../utilities/utilityFunctions";
import {
  WATCH_INVESTORS,
  WATCH_INVESTORS_DROPDOWN,
} from "../../../redux/actionTypes";

export default function EditInvestor({ setViewEditPage }) {
  const investor = JSON.parse(sessionStorage.getItem("selectedInvestor")) || "";
  const checkIndividuals = () =>
    investor.category.toUpperCase() === "INDIVIDUALS";
    const checkDirectors = () =>
    investor.category.toUpperCase() === "DIRECTORS";
    const checkExecutives = () =>
    investor.category.toUpperCase() === "EXECUTIVES";
    const checkEmployee = () =>
    investor.category.toUpperCase() === "EMPLOYEE";
    const checkSponser = () =>
    investor.category.toUpperCase() === "SPONSORS";
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedInvestor", JSON.stringify({}));
    };
  }, []);
  // Investor Catergories

  // React Select Styles
  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };
  // Yup Validations
  // Validation Decalration
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: editInvestorSchema(investor).cast(),
    resolver: yupResolver(editInvestorSchema(investor), {
      stripUnknown: true,
      abortEarly: false,
    }),
  });
  // Investor Type
  console.log('investor', investor)
  const [type, setType] = useState(investor.category.toUpperCase());
  const [loading, setLoading] = useState(false);
  const [sponserNTN, setSponserNTN] = useState(investor?.cnic ? 'CNIC' : 'NTN')
  const handleUpdateInvestor = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await updateInvestor(
        email,
        investor.investor_id,
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
          setViewEditPage(false);
        }, 2000);
      } else {
        setLoading(false);
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error(`${error.response.data.message}`);
    }
  };
  const INDIVIDUALS = "INDIVIDUALS";
  const DIRECTORS = "DIRECTORS";
  const EXECUTIVES = "EXECUTIVES";
  const EMPLOYEE = "EMPLOYEE";
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleUpdateInvestor)}>
          <div className="row">
            <div
              className={(checkIndividuals() ||
                checkDirectors() ||
                checkExecutives() ||
                checkEmployee()||
                checkSponser()) 
                  ? "col-sm-12 col-md-6 col-lg-6"
                  : "col-sm-12 col-md-12 col-lg-12"
              }
            >
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Investor Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="investor_id">Investor ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="investor_id"
                      id="investor_id"
                      value={investor.investor_id}
                      readOnly
                    />
                  </div>
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

                  {checkSponser()&&
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
                      type === "INDIVIDUALS" ||
                      type === "DIRECTORS" ||
                      type === "EXECUTIVES" ||
                      type === "EMPLOYEE" ||
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
                      type === "INDIVIDUALS" ||
                      type === "DIRECTORS" ||
                      type === "EXECUTIVES" ||
                      type === "EMPLOYEE" ||
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
                    {(checkIndividuals() ||
                    checkDirectors() ||
                    checkExecutives() ||
                    checkEmployee())||
                    sponserNTN=='CNIC'
                     && (
                      <div className="col-md-4">
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
                    <div className={(checkIndividuals() ||
                            checkDirectors() ||
                            checkExecutives() ||
                            checkEmployee())||
                            sponserNTN=='CNIC'
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

                  {(checkIndividuals() ||
                  checkDirectors() ||
                  checkExecutives() ||
                  checkEmployee())||
                  sponserNTN=='CNIC'
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
            {(checkIndividuals() ||
            checkDirectors() ||
            checkExecutives() ||
            checkEmployee())||
            sponserNTN=='CNIC'
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
