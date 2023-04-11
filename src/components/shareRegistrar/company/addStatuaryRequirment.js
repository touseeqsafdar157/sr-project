import React, { useEffect, useState} from 'react'
// import { addAlertValidationSchema } from 'store/validations/alertValidation';
import { useForm, Controller } from "react-hook-form";
import { addAlertValidationSchema } from "store/validations/alertValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { addStatuaryRequirmentData } from 'store/services/company.service';
import { ToastContainer, toast } from "react-toastify";
import { getAllRequirmentData } from 'store/services/company.service';
// import { AddStatuaryRequirment } from "./addStatuaryRequirment";
export const AddStatuaryRequirment = ({setViewAddRequirment, getPaginatedRequirment}) => {
const [loading, setLoading] = useState(false)
const [selectedDependendent, setSelectedDependent] = useState('')
const email = sessionStorage.getItem("email");
const [dependentOption, setDependentOptins] = useState([]);
    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
        control,
      } = useForm({ resolver: yupResolver(addAlertValidationSchema) });
      const getaALLRequirment = async (pagenum) => {
        // setLoadingRequirment(true);
        try {
          const response = await getAllRequirmentData(
            email,
          );
          if (response.status === 200) {
            const parents = response.data.data;
            const companies_dropdowns = response.data.data.map((item) => {
              let label = `${item.code} - ${item.title}`;
              return { label: label};
            });
            setDependentOptins(companies_dropdowns)
          }
        } catch (error) {
        }
      };
    useEffect(()=>{
      getaALLRequirment()
    },[])
    
      const handleAlertMessage = async(data)=>{
        try {
          setLoading(true);
          // let response;
          const response = await addStatuaryRequirmentData(
            email,
           data?.form_code,
           data?.company_type,
           data?.title,
           data?.regulations,
           data?.regulations,
           data?.frequency,
           data?.level_ddl,
           selectedDependendent,
           data?.days_dependent,
           data?.notify_days,
           data?.notify_via,
           data?.active
          );
    
          if (response.data.status === 200) {
            setTimeout(() => {
              setLoading(false);
              // window.location.reload();
              getPaginatedRequirment("1")
              // getAllCompanies();
              toast.success(`${response.data.message}`);
              setViewAddRequirment(false);
            }, 2000);
          } else {
            setLoading(false);
            toast.error(`${response.data.message}`);
          }
        } catch (error) {
          setLoading(false);
          !!error?.response?.data?.message
            ? toast.error(error?.response?.data?.message)
            : toast.error("Requirment Not Added");
        }
      }
    
      const appliedStyles = {
        control: (base, state) => ({
          ...base,
          border: "1px solid red",
        }),
      };
  return (
    <div>
<form onSubmit={handleSubmit(handleAlertMessage)}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Requirement</h5>
                </div>
                <div className="card-body">
                <div className="form-group mt-3 ">
              <label htmlFor="company_type">Company Type</label>
              <select
                name="company_type"
                className={`form-control ${
                  errors.company_type && "border border-danger"
                }`}
                {...register("company_type")}
              >
                <option value="">Select</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Public Listed">Public Listed</option>
                <option value="Modaraba">Modaraba </option>
              </select>
              <small className="text-danger">
                {errors.company_type?.message}
              </small>
            </div>
            <div className="form-group mt-3 ">
              <label htmlFor="form_code">Code</label>
              <input
                name="form_code"
                className={`form-control ${
                  errors.form_code && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Code"
                {...register("form_code")}
              />
              <small className="text-danger">
                {errors.form_code?.message}
              </small>
            </div>
            <div className="form-group mt-3 ">
              <label>Title</label>
              <input
                name="title"
                className={`form-control ${
                  errors.title && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Title"
                {...register("title")}
              />
              <small className="text-danger">
                {errors.title?.message}
              </small>
            </div>
            <div className="form-group mt-3 ">
              <label>Regulations/Section </label>
              <input
                name="regulations"
                className={`form-control ${
                  errors.regulations && "border border-danger"
                }`}
                type="regulations"
                placeholder="Enter Regulations Or Section"
                {...register("regulations")}
              />
              <small className="text-danger">
                {errors.regulations?.message}
              </small>
            </div>
          
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-xl-4">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Compliance</h5>
                </div>
                <div className="card-body">
                <div className="form-group mt-3 ">
              <label>Frequency </label>
<select
                name="frequency"
                className={`form-control ${
                  errors.frequency && "border border-danger"
                }`}
                {...register("frequency")}
              >
                <option value="">Select</option>
                <option value="Variable">Variable</option>
                <option value="Annual">Annual</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Fortnightly">Fortnightly</option>
                <option value="Monthly">Monthly</option>
             
              </select>


              <small className="text-danger">
                {errors.frequency?.message}
              </small>
            </div> 
            <div className="form-group mt-3 ">
              <label htmlFor="level_ddl">Level</label>
              <select
                name="level_ddl"
                className={`form-control ${
                  errors.level_ddl && "border border-danger"
                }`}
                {...register("level_ddl")}
              >
                <option value="">Select</option>
                <option value="Critical">Critical</option>
                <option value="Normal">Normal</option>
                <option value="Information">Information</option>
              </select>
              <small className="text-danger">
                {errors.level_ddl?.message}
              </small>
            </div>
            <div className="form-group mt-3 ">
              <label>Dependent On </label>
              <Controller
                    name="dependent"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={dependentOption}
                        isLoading={!dependentOption?.length}
                        id="dependent"
                        onChange={(selected) => {
                          if(selected?.label){
                            setSelectedDependent(selected?.label)
                          } else {
                            setSelectedDependent('')
                          }
                        }}
                        isClearable={true}
                        styles={errors.dependent && appliedStyles}
                      />
                    )}
                    control={control}
                  />


              {/* <input
                name="dependent "
                className={`form-control ${
                  errors.dependent && "border border-danger"
                }`}
                type="dependent"
                placeholder="Enter Dependent"
                {...register("dependent")}
              /> */}
              <small className="text-danger">
                {errors.dependent?.message}
              </small>
            </div>
             <div className="form-group mt-3 ">
              <label>Days To Dependent</label>

              <Controller
                name="days_dependent"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.days_dependent && "border border-danger"
                    }`}
                    id="days_dependent"
                    allowNegative={false}
                    placeholder="Enter Days To Dependent"
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {errors.days_dependent?.message}
              </small>
            </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-xl-4">
  
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Notification</h5>
                </div>
                <div className="card-body">
                <div className="form-group mt-3 ">
              <label htmlFor="notify_via">Notify Via</label>
              <select
                name="notify_via"
                className={`form-control ${
                  errors.notify_via && "border border-danger"
                }`}
                {...register("notify_via")}
              >
                <option value="">Select</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
              <small className="text-danger">
                {errors.notify_via?.message}
              </small>
            </div>
            <div className="form-group mt-3 ">
              <label>Notify Days</label>

              <Controller
                name="notify_days"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.notify_days && "border border-danger"
                    }`}
                    id="notify_days"
                    allowNegative={false}
                    placeholder="Enter Notify Days"
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {errors.notify_days?.message}
              </small>
            </div>
            <div className="form-group mt-3 ">
              <label htmlFor="active">Active</label>
              <select
                name="active"
                className={`form-control ${
                  errors.active && "border border-danger"
                }`}
                {...register("active")}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <small className="text-danger">
                {errors.active?.message}
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












    {/* <form onSubmit={handleSubmit(handleAlertMessage)}>
      <div className="row">
        <div className="col-md-12">
      <div className="card ">
          <div className="card-header b-t-primary">
           <h5> Add Statuary Requeriment</h5>
            </div>
            <div className="row">
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label htmlFor="form_code">Code</label>
              <input
                name="form_code"
                className={`form-control ${
                  errors.form_code && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Code"
                {...register("form_code")}
              />
              <small className="text-danger">
                {errors.form_code?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label htmlFor="company_type">Company Type</label>
              <select
                name="company_type"
                className={`form-control ${
                  errors.company_type && "border border-danger"
                }`}
                {...register("company_type")}
              >
                <option value="">Select</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <small className="text-danger">
                {errors.company_type?.message}
              </small>
            </div>

            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label>Title</label>
              <input
                name="title"
                className={`form-control ${
                  errors.title && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Title"
                {...register("title")}
              />
              <small className="text-danger">
                {errors.title?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label>Section</label>
              <input
                name="section"
                className={`form-control ${
                  errors.section && "border border-danger"
                }`}
                type="section"
                placeholder="Enter Section"
                {...register("section")}
              />
              <small className="text-danger">
                {errors.section?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label>Regulations </label>
              <input
                name="regulations"
                className={`form-control ${
                  errors.regulations && "border border-danger"
                }`}
                type="regulations"
                placeholder="Enter Regulations"
                {...register("regulations")}
              />
              <small className="text-danger">
                {errors.regulations?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label>Frequency </label>
<select
                name="frequency"
                className={`form-control ${
                  errors.frequency && "border border-danger"
                }`}
                {...register("frequency")}
              >
                <option value="">Select</option>
                <option value="Variable">Variable</option>
                <option value="Annual">Annual</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Fortnightly">Fortnightly</option>
                <option value="Monthly">Monthly</option>
             
              </select>


              <small className="text-danger">
                {errors.frequency?.message}
              </small>
            </div>  
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label htmlFor="level_ddl">Level</label>
              <select
                name="level_ddl"
                className={`form-control ${
                  errors.level_ddl && "border border-danger"
                }`}
                {...register("level_ddl")}
              >
                <option value="">Select</option>
                <option value="Critical">Critical</option>
                <option value="Normal">Normal</option>
                <option value="Information">Information</option>
              </select>
              <small className="text-danger">
                {errors.level_ddl?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label>Dependent On Req </label>
              <input
                name="dependent "
                className={`form-control ${
                  errors.dependent && "border border-danger"
                }`}
                type="dependent"
                placeholder="Enter Dependent"
                {...register("dependent")}
              />
              <small className="text-danger">
                {errors.dependent?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label>Days To Dependent No.</label>

              <Controller
                name="days_dependent"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.days_dependent && "border border-danger"
                    }`}
                    id="days_dependent"
                    allowNegative={false}
                    placeholder="Enter Days To Dependent No."
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {errors.days_dependent?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label>Notify Days</label>

              <Controller
                name="notify_days"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.notify_days && "border border-danger"
                    }`}
                    id="notify_days"
                    allowNegative={false}
                    placeholder="Enter Notify Days"
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {errors.notify_days?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label htmlFor="notify_via">Notify Via</label>
              <select
                name="notify_via"
                className={`form-control ${
                  errors.notify_via && "border border-danger"
                }`}
                {...register("notify_via")}
              >
                <option value="">Select</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
              <small className="text-danger">
                {errors.notify_via?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label htmlFor="active">Active</label>
              <select
                name="active"
                className={`form-control ${
                  errors.active && "border border-danger"
                }`}
                {...register("active")}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <small className="text-danger">
                {errors.active?.message}
              </small>
            </div>




         

            </div>



            </div>
            </div>
      </div>
      <div className="row">
      <div className="col-md-12" style={{paddingLeft: '35px', paddingRight: '35px'}}>
        <button
          type="submit"
          className="btn btn-primary"
        
        >
          {false ? (
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
      </form> */}
    </div>  )
}
