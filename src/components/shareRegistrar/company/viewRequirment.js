import React, { useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import { EditRequirmentScema } from 'store/validations/alertValidation';
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
export const ViewRequirment = () => {
  const [loading, setLoading] = useState(false)

  const requirment = JSON.parse(sessionStorage.getItem("selectedrequirment")) || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    watch,
  } = useForm({
    defaultValues: EditRequirmentScema(requirment).cast(),
    resolver: yupResolver(EditRequirmentScema(requirment)),
  });
  const handleUpdateCompany = async (data) => { };
  return (
    <div>
      <form onSubmit={handleSubmit(handleUpdateCompany)}>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Requirement</h5>
              </div>
              <div className="card-body">
                <div className="form-group mt-3 ">
                  <label htmlFor="company_type">Company Type</label>
                  <input
                    name="company_type"
                    className={`form-control ${errors.company_type && "border border-danger"
                      }`}
                    {...register("company_type")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.company_type?.message}
                  </small>
                </div>
                <div className="form-group mt-3 ">
                  <label htmlFor="form_code">Code</label>
                  <input
                    name="form_code"
                    className={`form-control ${errors.form_code && "border border-danger"
                      }`}
                    type="text"
                    placeholder="Enter Code"
                    {...register("form_code")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.form_code?.message}
                  </small>
                </div>
                <div className="form-group mt-3 ">
                  <label>Title</label>
                  <input
                    name="title"
                    className={`form-control ${errors.title && "border border-danger"
                      }`}
                    type="text"
                    placeholder="Enter Title"
                    {...register("title")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.title?.message}
                  </small>
                </div>
                <div className="form-group mt-3 ">
                  <label>Regulations/Section </label>
                  <input
                    name="regulations"
                    className={`form-control ${errors.regulations && "border border-danger"
                      }`}
                    type="regulations"
                    placeholder="Enter Regulations Or Section"
                    {...register("regulations")}
                    readOnly
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
                  <input
                    name="frequency"
                    className={`form-control ${errors.frequency && "border border-danger"
                      }`}
                    type="frequency"
                    placeholder="Enter Frequency"
                    {...register("frequency")}
                    readOnly
                  />


                  <small className="text-danger">
                    {errors.frequency?.message}
                  </small>
                </div>
                <div className="form-group mt-3 ">
                  <label htmlFor="level_ddl">Level</label>
                  <input
                    name="level_ddl"
                    className={`form-control ${errors.level_ddl && "border border-danger"
                      }`}
                    {...register("level_ddl")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.level_ddl?.message}
                  </small>
                </div>
                <div className="form-group mt-3 ">
                  <label>Dependent On </label>
                  <input
                    name="dependent "
                    className={`form-control ${errors.dependent && "border border-danger"
                      }`}
                    type="dependent"
                    placeholder="Enter Dependent"
                    value={requirment?.dependent_on || ''}
                    {...register("dependent")}
                    readOnly
                  />



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
                        className={`form-control ${errors.days_dependent && "border border-danger"
                          }`}
                        id="days_dependent"
                        allowNegative={false}
                        placeholder="Enter Days To Dependent"
                        readOnly
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
                  <input
                    name="notify_via"
                    className={`form-control ${errors.notify_via && "border border-danger"
                      }`}
                    {...register("notify_via")}
                    readOnly
                  />
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
                        className={`form-control ${errors.notify_days && "border border-danger"
                          }`}
                        id="notify_days"
                        allowNegative={false}
                        placeholder="Enter Notify Days"
                        readOnly
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
                  <input
                    name="active"
                    className={`form-control ${errors.active && "border border-danger"
                      }`}
                    {...register("active")}
                    readOnly
                  >

                  </input>
                  <small className="text-danger">
                    {errors.active?.message}
                  </small>
                </div>
              </div>
            </div>

          </div>
        </div>



        {/* <div className="row">
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
          </div> */}
      </form>




      {/* <form onSubmit={handleSubmit(handleUpdateCompany)}>
      <div className="row">
        <div className="col-md-12">
      <div className="card ">
          <div className="card-header b-t-primary">
           <h5> View Statuary Requeriment</h5>
            </div>
            <div className="row">
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label htmlFor="form_code">Code</label>
              <input
                name="form_code"
                className={`form-control ${
                  errors.form_code && "border border-danger"
                }`}
                {...register("form_code")}
                readOnly
              >
               
              </input>
              <small className="text-danger">
                {errors.form_code?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label htmlFor="company_type">Company Type</label>
              <input
                name="company_type"
                className={`form-control ${
                  errors.company_type && "border border-danger"
                }`}
                {...register("company_type")}
                readOnly
              />
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
                readOnly
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
                readOnly
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
                readOnly
              />
              <small className="text-danger">
                {errors.regulations?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label>Frequency </label>
              <input
                name="frequency"
                className={`form-control ${
                  errors.frequency && "border border-danger"
                }`}
                type="frequency"
                placeholder="Enter Frequency"
                {...register("frequency")}
                readOnly
              />
              <small className="text-danger">
                {errors.frequency?.message}
              </small>
            </div>  
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label htmlFor="level_ddl">Level</label>
              <input
                name="level_ddl"
                className={`form-control ${
                  errors.level_ddl && "border border-danger"
                }`}
                {...register("level_ddl")}
                readOnly
              >
               
              </input>
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
                readOnly
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
                    readOnly
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
                    readOnly
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
              <input
                name="notify_via"
                className={`form-control ${
                  errors.notify_via && "border border-danger"
                }`}
                {...register("notify_via")}
                readOnly
              >
              
              </input>
              <small className="text-danger">
                {errors.notify_via?.message}
              </small>
            </div>
            <div className="form-group mt-3 col-md-4" style={{paddingLeft: '35px', paddingRight: '35px'}}>
              <label htmlFor="active">Active</label>
              <input
                name="active"
                className={`form-control ${
                  errors.active && "border border-danger"
                }`}
                {...register("active")}
                readOnly
              >
             
              </input>
              <small className="text-danger">
                {errors.active?.message}
              </small>
            </div>




         

            </div>



            </div>
            </div>
      </div>
      </form> */}
    </div>)
}
