import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { Controller, useForm } from "react-hook-form";
import { updateInvestor } from "../../../store/services/investor.service";
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

export default function EditInvestor() {
  const investor = JSON.parse(sessionStorage.getItem("selectedInvestor")) || "";
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedInvestor", JSON.stringify({}));
    };
  }, []);
  // Investor Catergories
  const categories = [
    { label: "Individual", value: "Individual" },
    { label: "Joint Stock Companies", value: "Joint Stock Companies" },
    { label: "Financial Institutions", value: "Financial Institutions" },
    { label: "Mutual Funds", value: "Mutual Funds" },
    { label: "Insurance Companies", value: "Insurance Companies" },
    { label: "Investment Companies", value: "Investment Companies" },
    { label: "Provident Fund", value: "Provident Fund" },
    { label: "Pension Funds", value: "Pension Funds" },
  ];
  const investor_categories = [
    "Joint Stock Companies",
    "Financial Institutions",
    "Mutual Funds",
    "Insurance Companies",
    "Investment Companies",
    "Provident Fund",
    "Pension Funds",
  ];
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
  const [type, setType] = useState(investor.category.toUpperCase());
  const [loading, setLoading] = useState(false);
  // Images
  const [picture, setPicture] = useState(investor?.picture || "");
  const [attachment_picture, setAttachment_picture] = useState(
    investor?.picture || ""
  );
  const [cnic_copy, setCnic_copy] = useState(investor?.cnic_copy || "");
  const [nominee_cnic_copy, setNominee_cnic_copy] = useState(
    investor?.nominee_cnic_copy || ""
  );
  const [zakat_declaration, setZakat_declaration] = useState(
    investor?.zakat_declaration || ""
  );
  const [zakat_exempted, setZakat_exempted] = useState(
    investor.zakat_status === "Y"
  );
  const [sponserNTN, setSponserNTN] = useState(investor?.cnic ? 'CNIC' : 'NTN')
  const [filer, setFiler] = useState(investor.filer === "Y");
  //
  const handleViewInvestor = async (data) => {
  };
  const checkIndividuals = () =>
  investor.category.toUpperCase() === "INDIVIDUALS";
  const checkDirectors = () =>
  investor.category.toUpperCase() === "DIRECTORS";
  const checkExecutives = () =>
  investor.category.toUpperCase() === "EXECUTIVES";
  const checkEmployee = () =>
  investor.category.toUpperCase() === "EMPLOYEE";
  const borderRadiusStyle = { borderRadius: 2 };
    const INDIVIDUALS = "INDIVIDUALS";
    const DIRECTORS = "DIRECTORS";
    const EXECUTIVES = "EXECUTIVES";
    const EMPLOYEE = "EMPLOYEE";
  return (
    <div>
    <Fragment>
      <form>
        <div className="row">
          <div
            className={(checkIndividuals() ||
              checkDirectors() ||
              checkExecutives() ||
              checkEmployee()||
              sponserNTN=='CNIC'
              )
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
                  checkEmployee() ||
                  sponserNTN=='CNIC'
                  )
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
                          checkEmployee()||
                          sponserNTN=='CNIC'
                          
                          )
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
                checkEmployee()||
                sponserNTN=='CNIC'
                )
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
          checkEmployee()||
          sponserNTN=='CNIC'
          )
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
