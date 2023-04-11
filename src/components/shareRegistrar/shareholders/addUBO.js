import React, { Fragment, useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import { useSelector } from "react-redux";
import { addUBOSchema } from "../../../store/validations/ubovalidations";
import { ToastContainer, toast } from "react-toastify";
// Input Mask
import InputMask from "react-input-mask";
import {getUBO} from "../../../store/services/shareholder.service";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUBO } from "../../../store/services/shareholder.service";
 // Validation Declarations
export default function AddUBO({setViewAddPage}) {
    // holder
    let holder =
    JSON.parse(sessionStorage.getItem("selectedShareholder")) || "";
     // states
     const [type, setType] = useState("");
     const [loading, setLoading] = useState(false);
     const [no_of_share, setNo_of_share] = useState("") 
    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
      } = useForm({ resolver: yupResolver(addUBOSchema) });
      const handleAddUBO = async (data) => {
        const email = sessionStorage.getItem("email");
        data.percentage_shares = calculate;
        try {
          setLoading(true);
          const response = await addUBO(
            email,
            data.folio_number,
            data.ubo_id,
            data.name,
            data.cnic,
            data.mobile,
            data.ntn,
            data.phone_no,
            data.no_of_shares,
            data.total_shares,
            data.percentage_shares,
            data.category
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
            : toast.error("UBO Not Submitted");
        }
      };
    const borderRadiusStyle = { borderRadius: 2 };
    const INDIVIDUALS = "INDIVIDUALS";
    const DIRECTORS = "DIRECTORS";
    const EXECUTIVES = "EXECUTIVES";
    const EMPLOYEE = "EMPLOYEE";
    const PUBLIC_SECTOR = "PUBLIC SECTOR";
    const JOINT_STOCK_COMPANIES = "JOINT STOCK COMPANIES";
    const MUTITAL_FUND_TRUSTEE = "MUTITAL FUND/TRUSTEE";
    const INSURANCE_COMPANIES = "INSURANCE COMPANIES";  
    const INVESTMENT_COMPANIES = "INVESTMENT COMPANIES";  
    const ASSOCIATED_COMPANIES  = "ASSOCIATED COMPANIES";  
    const LEASING_COMPANIES = "LEASING COMPANIES";
    const TRUSTS = "TRUSTS";
    const NIT_AND_ICP= "NIT AND ICP";
    const MODARBA  = "MODARBA";
    const MODARBA_MANAGEMENT = "MODARBA MANAGEMENT";
    const  CORPORATE_ORGANIZATIONS = "CORPORATE ORGANIZATIONS";
    const CHARITABLE_INSTITUTES  = "CHARITABLE INSTITUTES";
    const CDC = "CDC";
    const FINANCIAL_INSTITUTIONS = "FINANCIAL INSTITUTIONS";
    const OTHERS  = "OTHERS";
      let calculate = ((no_of_share / holder.electronic_shares) * 100).toFixed(3);
      if(+calculate===0){
        calculate = ((no_of_share / holder.electronic_shares) * 100).toFixed(0);
      }
      if(holder.electronic_shares=='0') {
        calculate="0";
      }
    const handleChange =(e)=>{
      if(+e.target.value <= +holder.electronic_shares){
      setNo_of_share(e.target.value);
      }
    }
  return (
    <div>
      <Fragment>
      <form onSubmit={handleSubmit(handleAddUBO)}>
          <div className="row">
            <div
              className={
                type === INDIVIDUALS ||
                type === DIRECTORS ||
                type === EXECUTIVES ||
                type === EMPLOYEE || 
                type === PUBLIC_SECTOR ||
                type === JOINT_STOCK_COMPANIES ||
                type === FINANCIAL_INSTITUTIONS ||
                type === MUTITAL_FUND_TRUSTEE ||
                type === INSURANCE_COMPANIES ||
                type === INVESTMENT_COMPANIES ||
                type ===  ASSOCIATED_COMPANIES ||
                type ===  LEASING_COMPANIES ||
                type ===  TRUSTS ||
                type ===  NIT_AND_ICP ||
                type ===  MODARBA ||
                type ===  MODARBA_MANAGEMENT ||
                type ===  CORPORATE_ORGANIZATIONS ||
                type ===  CHARITABLE_INSTITUTES ||
                type ===  CDC ||
                type ===  OTHERS 
                  ? "col-sm-12 col-md-6 col-lg-6"
                  : "col-sm-12 col-md-12 col-lg-12"
              }
            >
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>UBO Details</h5>
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
                      onChange={(e) => 
                        setType(e.target.value)
                      }
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
                    </select>
                    <small className="text-danger">
                      {errors.category?.message}
                    </small>
                  </div>
                  <div
                    className="form-group my-2"
                    style={
                      type === INDIVIDUALS ||
                      type === DIRECTORS ||
                      type === EXECUTIVES ||
                      type === EMPLOYEE
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                       <div className="form-group my-2">
                    <label htmlFor="cnic">CNIC</label>
                    <Controller
                      name="cnic"
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          className={`form-control ${
                            errors.cnic && "border border-danger"
                          }`}
                          {...register("cnic")}
                          placeholder="CNIC"
                          mask="99999-9999999-9"
                        ></InputMask>
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.cnic?.message}
                    </small>
                    </div> 
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
                        <div className="form-group my-2">
                    <label htmlFor="ntn">NTN</label>
                    <input
                      name="ntn"
                      className={`form-control ${
                        errors.ntn && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Enter NTN"
                      {...register("ntn")}
                    />
                    <small className="text-danger">
                      {errors.ntn?.message}
                    </small>
                    </div>
                  </div>
                  <div
                    className="form-group my-2"
                    style={
                      type === INDIVIDUALS ||
                      type === DIRECTORS ||
                      type === EXECUTIVES ||
                      type === EMPLOYEE || 
                      type === PUBLIC_SECTOR ||
                      type === JOINT_STOCK_COMPANIES ||
                      type === FINANCIAL_INSTITUTIONS ||
                      type === MUTITAL_FUND_TRUSTEE ||
                      type === INSURANCE_COMPANIES ||
                      type === INVESTMENT_COMPANIES ||
                      type ===  ASSOCIATED_COMPANIES ||
                      type ===  LEASING_COMPANIES ||
                      type ===  TRUSTS ||
                      type ===  NIT_AND_ICP ||
                      type ===  MODARBA ||
                      type ===  MODARBA_MANAGEMENT ||
                      type ===  CORPORATE_ORGANIZATIONS ||
                      type ===  CHARITABLE_INSTITUTES ||
                      type ===  CDC ||
                      type ===  OTHERS 
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    <div className="form-group my-2">
                    <input
                      name="folio_number"
                      type="hidden"
                      value={holder.folio_number}
                      placeholder="Folio Number"
                      {...register("folio_number")}
                    />
                    </div>
                    <div className="form-group my-2">
                    <input
                      name="ubo_id"
                      type="hidden"
                      placeholder="UBO id"
                      {...register("ubo_id")}
                    />
                    </div>
                    <div className="form-group my-2">
                    <label htmlFor="mobile">Mobile Number</label>
                       <Controller
                      name="mobile"
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          className={`form-control ${
                            errors.mobile && "border border-danger"
                          }`}
                          placeholder="Enter Mobile No."
                          mask="+\92-999-9999999"
                        ></InputMask>
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.mobile?.message}
                    </small>
                    </div>  
                    <div className="form-group my-2">
                    <label htmlFor="name">Name</label>
                        <input
                          className={`form-control ${
                            errors.name && "border border-danger"
                          }`}
                          name="name"
                          type="text"
                          placeholder="UBO Name"
                          {...register("name")}
                        />
                        <small className="text-danger">
                          {errors.name?.message}
                        </small>
                        </div>
                  </div>
                </div>
                </div>
              </div>     
              {(type === 'INDIVIDUALS' ||
               type === 'DIRECTORS' ||
               type === 'EXECUTIVES' ||
               type === 'EMPLOYEE' ||
               type === 'PUBLIC SECTOR' ||
               type === 'JOINT STOCK COMPANIES' ||
               type === 'FINANCIAL INSTITUTIONS' ||
               type === 'MUTITAL FUND/TRUSTEE' ||
               type === 'INSURANCE COMPANIES' ||
               type === 'INVESTMENT COMPANIES' ||
               type === 'ASSOCIATED COMPANIES' ||
               type === 'INVESTMENT COMPANIES' ||
               type === 'LEASING COMPANIES' ||
               type === 'TRUSTS' ||
               type === 'NIT AND ICP' ||
               type === 'MODARBA' ||
               type === 'MODARBA MANAGEMENT' ||
               type === 'CORPORATE ORGANIZATIONS' ||
               type === 'CHARITABLE INSTITUTES' ||
               type === 'CDC' ||
               type === 'OTHERS'
               ) && ( 
              <div className="col-sm-12 col-md-6 col-xl-6">
                <div className="card ">
                  <div className="card-header b-t-primary">
                    <h5>Shares Details</h5>
                  </div>
                  <div className="card-body">
                    <div className="form-group my-2">
                      <label htmlFor="no_of_shares">No Of Shares</label>
                      <input
                        value={no_of_share}
                        name="no_of_shares"
                        className={`form-control text-right ${
                          errors.no_of_shares && "border border-danger"
                        }`}
                        id="no_of_shares"
                        type="text"
                        placeholder="No of Shares"
                        {...register("no_of_shares")}
                        onChange={(e) =>
                           handleChange(e)
                          }
                      />
                      <small className="text-danger">
                        {errors.no_of_shares?.message}
                      </small>
                    </div> 
                    <div className="form-group my-2">
                      <label htmlFor="total_shares">Total Shares</label>
                      <input
                        name="total_shares"
                        className={`form-control text-right ${
                          errors.total_shares && "border border-danger"
                        }`}
                        id="total_shares"
                        type="text"
                        value={holder.electronic_shares}
                        readOnly
                        placeholder="Total Shares"
                        {...register("total_shares")}
                      />
                      <small className="text-danger">
                        {errors.total_shares?.message}
                      </small>
                    </div>
                    <div className="form-group my-2">
                      <label htmlFor="percentage_shares">Percentage Shares</label>
                      <div className="input-group">
                      <input
                        name="percentage_shares"
                        className={`form-control text-right ${
                          errors.percentage_shares && "border border-danger"
                        }`}
                        id="percentage_shares"
                        type="text"
                        value={calculate} 
                        readOnly
                        placeholder="Percent Shares"
                        {...register("percentage_shares")}
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
                        {errors.percentage_shares?.message}
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
