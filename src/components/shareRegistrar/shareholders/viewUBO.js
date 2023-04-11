import React, { Fragment, useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import { useSelector } from "react-redux";
import { editUBOSchema } from "../../../store/validations/ubovalidations";
import { ToastContainer, toast } from "react-toastify";
// Input Mask
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editUBO } from "../../../store/services/shareholder.service";
import { numberWithCommas } from "utilities/utilityFunctions";

 // Validation Declarations
export default function ViewUBO({setViewPage}) {
  const allUBO = JSON.parse(sessionStorage.getItem("singleUBO"));
    // holder
    let holder =
    JSON.parse(sessionStorage.getItem("selectedShareholder")) || "";
     // states
     const [loading, setLoading] = useState(false);
     const [category, setCategory] = useState("")
     const [cnic, setCNIC] = useState("")
     const [mobile_no, setMobile_no] = useState("")
     const [name, setName] = useState("")
     const [no_of_shares, setNo_of_shares] = useState("")
     const [total_shares, setTotal_shares] = useState("")
     const [percent_shares, setPercent_shares] = useState("")
     const [ntn, setNtn] = useState("")
     const [folio_number, setFolio_number] = useState("")
     const [ubo_id, setUbo_id] = useState("")

    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
      } = useForm({ resolver: yupResolver(editUBOSchema) });
      useEffect(() => {
        setCategory(allUBO.category)
        setCNIC(allUBO.cnic)
        setMobile_no(allUBO.mobile)
         setName(allUBO.name)
         setNo_of_shares(allUBO.no_of_shares)
         setTotal_shares(allUBO.total_shares)
         setPercent_shares(allUBO.percentage_shares)
         setFolio_number(allUBO.folio_number)
         setUbo_id(allUBO.ubo_id)
      }, [])
      const handleEditUBO = async (data) => {
        const email = sessionStorage.getItem("email");
        try {
          setLoading(true);
          const response = await editUBO(
            email,
            folio_number,
            ubo_id,
            name,
            cnic,
            mobile_no,
            ntn,
            data.phone_no,
            no_of_shares,
            total_shares,
            percent_shares,
            category
            );
          if (response.data.status === 200) {
            setTimeout(() => {
              setLoading(false);
              toast.success(`${response.data.message}`);
              setViewPage(false);
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
  return (
    <div>
    <Fragment>
    <form onSubmit={handleSubmit(handleEditUBO)}>
        <div className="row">
          <div
            className={
              category === INDIVIDUALS ||
              category === DIRECTORS ||
              category === EXECUTIVES ||
              category === EMPLOYEE ||
              category === PUBLIC_SECTOR ||
              category === JOINT_STOCK_COMPANIES ||
              category === MUTITAL_FUND_TRUSTEE ||
              category === INSURANCE_COMPANIES ||
              category === INVESTMENT_COMPANIES ||
              category === ASSOCIATED_COMPANIES ||
              category === LEASING_COMPANIES ||
              category === TRUSTS ||
              category === NIT_AND_ICP ||
              category === MODARBA ||
              category === MODARBA_MANAGEMENT ||
              category === CORPORATE_ORGANIZATIONS ||
              category === CHARITABLE_INSTITUTES ||
              category === CDC ||
              category === FINANCIAL_INSTITUTIONS ||
              category === OTHERS 
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
                  <input
                    className={`form-control ${
                      errors.category && "border border-danger"
                    }`}
                    name="category"
                    type="text"
                    {...register("category")}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled
                  />
                  <small className="text-danger">
                    {errors.category?.message}
                  </small>
                </div>
                <div
                  className="form-group my-2"
                  style={
                    category === INDIVIDUALS ||
                    category === DIRECTORS ||
                    category === EXECUTIVES ||
                    category === EMPLOYEE
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
                        value={cnic}
                        onChange={(e) => 
                        setCNIC(e.target.value) 
                        }
                        readOnly
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
                  <div className="form-group my-2">
                  <input
                    name="ubo_id"
                    type="hidden"
                    placeholder="UBO id"
                    {...register("ubo_id")}
                    value={ubo_id}
                    readOnly
                  />
                  </div>
                  <div className="form-group my-2">
                  <input
                    className={`form-control ${
                      errors.folio_number && "border border-danger"
                    }`}
                    name="folio_number"
                    type="hidden"
                    placeholder="Folio Number"
                    {...register("folio_number")}
                    value={folio_number}
                    onChange={(e) => 
                      setFolio_number(e.target.value) 
                    }
                    readOnly
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
                          value={mobile_no}
                          onChange={(e) => 
                            setMobile_no(e.target.value) 
                          }
                        ></InputMask>
                      )}
                      control={control}
                    />
                  <small className="text-danger">
                    {errors.mobile?.message}
                  </small>
                  </div>  
                </div>
                <div
                  className="form-group my-2"
                  style={
                    category !== INDIVIDUALS && category !== "" &&
                    category !== DIRECTORS && category !== "" &&
                    category !== EXECUTIVES && category !== "" &&
                    category !== EMPLOYEE && category !== ""
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
                    value={ntn}
                    onChange={(e) => 
                      setNtn(e.target.value) 
                    }
                          
                  />
                  <small className="text-danger">
                    {errors.ntn?.message}
                  </small>
                  </div>
                </div>
                <label htmlFor="name">Name</label>
                      <input
                        className={`form-control ${
                          errors.name && "border border-danger"
                        }`}
                        name="name"
                        type="text"
                        placeholder="UBO Name"
                        {...register("name")}
                        value={name}
                        onChange={(e) => 
                          setName(e.target.value)
                        }
                        readOnly
                      />
                      <small className="text-danger">
                        {errors.name?.message}
                      </small>
              </div>
              </div>
            </div> 
            
            {(category === 'INDIVIDUALS' ||
             category === 'DIRECTORS' ||
             category === 'EXECUTIVES' ||
             category === 'EMPLOYEE'
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
                      value={numberWithCommas(no_of_shares)}
                      onChange={(e) => 
                        setNo_of_shares(e.target.value) 
                      }
                      name="no_of_shares"
                      className={`form-control text-right ${
                        errors.no_of_shares && "border border-danger"
                      }`}
                      id="no_of_shares"
                      type="text"
                      placeholder="No of Shares"
                      readOnly
                      // {...register("no_of_shares")}
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
                      value={numberWithCommas(total_shares)}
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
                      value={numberWithCommas(percent_shares)} 
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
      </form>
    </Fragment>
  </div>
  );
}
