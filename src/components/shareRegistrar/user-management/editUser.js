import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import CheckboxTree from "react-checkbox-tree";
import { ToastContainer, toast } from "react-toastify";
import { getFeatures, getRoles } from "../../../store/services/role.service";
import InputMask from "react-input-mask";
import { errorStyles } from "../../defaultStyles";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { addUser, updateUser } from "../../../store/services/user.service";
// Validation Packages
import {
  addUserSchema,
  updateUserSchema,
} from "../../../store/validations/userValidation";
// React SELECT
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { getCompanies } from "../../../store/services/company.service";

const EditUser = ({ setViewEditPage }) => {
  const user = JSON.parse(sessionStorage.getItem("selectedUser"));
  const roles = useSelector((data) => data.Roles);
  // const companies = useSelector((data) => data.Companies);
  const [usertType, setUsertType] = useState(user.user_type);
  const [additional, setAdditional] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [checked, setChecked] = useState([]);
  let [expanded, setExpanded] = useState([
    "features",
    "dashboard",
    "options",
    "employee",
    "company",
    "user",
  ]);
  const [rolesList, setRolesList] = useState([]);
  const [Loading, setLoading] = useState(false);
  const email = sessionStorage.getItem("email");
  const [defaultFeatures, setDefaultFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [featureList, setFeatureList] = useState([]);
  const [features, setFeatures] = useState([]);
  const deniedFeaturesArray = [];
  const [deniedFeaturesState, setDeniedFeaturesState] = useState([]);
  const additionalFeaturesArray = [];
  const [additionalFeaturesState, setAdditionalFeaturesState] = useState([]);
  const [checkedFeatues, setCheckedFeatues] = useState([]);
  const [selectedTmpFeature, setSelectedTmpFeature] = useState({});
  const [tmpFeatures, setTmpFeatures] = useState([]);
  const tmpArray = [];
  const selectedtmpFeatures = [];
  const [crudFeatures, setCrudFeatures] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: updateUserSchema(user).cast(),
    resolver: yupResolver(updateUserSchema(user)),
  });
  const user_types = [
    { label: "COMPANYUSER", value: "COMPANYUSER" },
    { label: "ADMIN", value: "ADMIN" },
    { label: "SHAREHOLDER", value: "SHAREHOLDER" },
  ];

  const getAllCompanies = async () => {
    setIsLoadingCompany(true);
    try{
    const response = await getCompanies(email)
    if (response.status===200) {
          const parents = response.data.data
          const companies_dropdowns = response.data.data.map((item) => {
            let label = `${item.code} - ${item.company_name}`;
            return { label: label, value: item.code };
          });
        setCompanies_dropdown(companies_dropdowns);
          // setCompanies(parents)
          setIsLoadingCompany(false)
    } }catch(error) {
      setIsLoadingCompany(false);
    }
    };

  useEffect(() => {
      getAllCompanies();
  }, [])

  const handleEditUser = async (data) => {
    setLoading(true);
    const email = sessionStorage.getItem("email");
    const response = await updateUser(
      email,
      data.name.toString(),
      data.user_email.toString().toLowerCase(),
      data.role.value,
      data.user_type,
      data.cnic,
      data.company?.value
    );
    if (response?.status === 200) {
      toast.success(`User Added Succsssfuly`);
      setAdditional(false);
      setFeatures([]);
      reset();
      setViewEditPage(false);
    } else {
      toast.error(`${response.data.message}`);
    }

    setLoading(false);
  };

  return (
    <>
      <Fragment>
        <form onSubmit={handleSubmit(handleEditUser)}>
          <div className="row">
            <div className="col-sm-12 col-md-12">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>User Detail</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label>Name</label>
                    <input
                      className="form-control"
                      name="name"
                      type="text"
                      placeholder="Name"
                      {...register("name")}
                      style={{
                        border: errors.name ? "1px solid red" : "",
                      }}
                    />
                    <small className="text-danger">
                      {errors.name?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="user_type">User Type</label>
                    <select
                      name="user_type"
                      className={`form-control ${
                        errors.user_type && "border border-danger"
                      }`}
                      {...register("user_type")}
                      onChange={(e) => setUsertType(e.target.value)}
                    >
                      <option value="ADMIN" selected>
                        ADMIN
                      </option>
                      <option value="SHAREHOLDER">SHAREHOLDER</option>
                      <option value="COMPANYUSER">COMPANYUSER</option>
                    </select>
                    <small className="text-danger">
                      {errors.user_type?.message}
                    </small>
                  </div>
                  <div
                    className={`form-group my-2 ${
                      usertType === "SHAREHOLDER" ? "d-none" : ""
                    }`}
                  >
                    <label htmlFor="email">Email</label>
                    <input
                      className="form-control"
                      name="user_email"
                      type="text"
                      placeholder="Email"
                      {...register("user_email")}
                      style={{
                        border: errors.user_email ? "1px solid red" : "",
                      }}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.user_email?.message}
                    </small>
                  </div>
                  <div
                    className={`form-group my-2 ${
                      usertType === "SHAREHOLDER" ? "" : "d-none"
                    }`}
                  >
                    <label htmlFor="cnic">CNIC</label>
                    <Controller
                      name="cnic"
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          className={`form-control ${
                            errors.cnic && "border border-danger"
                          }`}
                          placeholder={`Enter CNIC`}
                          mask={"99999-9999999-9"}
                        ></InputMask>
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.cnic?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label htmlFor="role">Role</label>
                    <Controller
                      name="role"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={roles.roles_dropdown_loading}
                          options={roles.roles_dropdown}
                          id="role"
                          placeholder="Select Role"
                          styles={errors.role && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.role?.message}
                    </small>
                  </div>

                  <div
                    className={`form-group my-2 ${
                      usertType === "ADMIN" ? "d-none" : ""
                    }`}
                  >
                    <label htmlFor="company">Company</label>
                    <Controller
                      name="company"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={isLoadingCompany}
                          options={companies_dropdown}
                          id="company"
                          placeholder="Select Company"
                          styles={errors.company && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.company?.message}
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
                className="btn btn-primary "
                disabled={Boolean(Loading)}
              >
                {Loading ? (
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
    </>
  );
};

export default EditUser;
