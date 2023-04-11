import { Controller, useForm } from "react-hook-form";
import { EditEventScema } from 'store/validations/alertValidation';
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";


import React, { useState, useEffect } from 'react'
// import { addAlertValidationSchema } from 'store/validations/alertValidation';
import { addEventValidationSchema } from "store/validations/alertValidation";
import Select from "react-select";
import { getCompanies } from 'store/services/company.service';
export const ViewEvent = ({showID}) => {
  const event = JSON.parse(sessionStorage.getItem("selectedEvent")) || "";
  const baseEmail = sessionStorage.getItem("email") || "";

      const [defaultCountry, setDefaultCountry] = useState('');
    const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
      reset,
      getValues,
      watch,
    } = useForm({
      defaultValues: EditEventScema(event).cast(),
      resolver: yupResolver(EditEventScema(event)),
    });
    useEffect(() => {
      const getAllCompanies = async () => {
        setCompanies_data_loading(true);
        try {
          const response = await getCompanies(baseEmail);
          if (response.status === 200) {
            const parents = response.data.data;
            console.log('this event', parents)
            const findCompany =  parents?.find(item=> item?.code == event?.company_code)
            let findLabel = `${findCompany?.code} - ${findCompany?.company_name}`;
            setDefaultCountry(findLabel);
            const companies_dropdowns = response.data.data.map((item) => {
              let label = `${item.code} - ${item.company_name}`;
              return { label: label, value: item.code };
            });
            // setCompanies_dropdown(companies_dropdowns);
            setCompanies_data_loading(false);
          }
        } catch (error) {
          setCompanies_data_loading(false);
        }
      };
      getAllCompanies();
    }, []);
    const handleAlertMessage = async (data) => {};
  return (
    <div>
<form onSubmit={handleSubmit(handleAlertMessage)}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Event</h5>
                </div>
                <div className="card-body">
                <div className="form-group mt-3  ">
                <label htmlFor="company_code">Company</label>

                <input
                  name="company_code"
                  className={`form-control ${errors.company_code && "border border-danger"
                    }`}
                  type="text"
                  placeholder="Enter Company"
                  value={defaultCountry}
                  {...register("company_code")}
                  readOnly
                />

                <small className="text-danger">
                  {errors.company_code?.message}
                </small>
              </div>
                <div className="form-group mt-3">
                <label>Requirement</label>
                <input
                  name="request_code"
                  className={`form-control ${errors.request_code && "border border-danger"
                    }`}
                  type="text"
                  placeholder="Enter Requirement"
                  value={event?.req_code || ''}
                  {...register("request_code")}
                  readOnly
                />
                <small className="text-danger">
                  {errors.request_code?.message}
                </small>
              </div>
              <div className="form-group mt-3">
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
                <div className="form-group mt-3">
                  <label>Comment </label>
                  <input
                    name="comment"
                    className={`form-control ${errors.comment && "border border-danger"
                      }`}
                    type="text"
                    placeholder="Enter Comment"
                    {...register("comment")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.comment?.message}
                  </small>
                </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-xl-4">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Dates</h5>
                </div>
                <div className="card-body">
                <div className="form-group mt-3 ">
                  <label>Start Date</label>
                  <input
                    className={`form-control ${errors.start_date && "border border-danger"
                      }`}
                    name="start_date"
                    type="date"
                    {...register("start_date")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.start_date?.message}
                  </small>
                </div>
                <div className="form-group mt-3  ">
                  <label>Deadline Date</label>
                  <input
                    className={`form-control ${errors.deadline_date && "border border-danger"
                      }`}
                    name="deadline_date"
                    type="date"
                    {...register("deadline_date")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.deadline_date?.message}
                  </small>
                </div>
                <div className="form-group mt-3">
                  <label>Reminde Before</label>

                  <Controller
                    name="reminder_days"
                    render={({ field }) => (
                      <NumberFormat
                        {...field}
                        className={`form-control ${errors.reminder_days && "border border-danger"
                          }`}
                        id="reminder_days"
                        allowNegative={false}
                        placeholder="Enter Days To Dependent No."
                        readOnly
                      />
                    )}
                    control={control}
                    readOnly
                  />

                  <small className="text-danger">
                    {errors.reminder_days?.message}
                  </small>
                </div>
                <div className="form-group mt-3  ">
                  <label htmlFor="closed">Closed</label>
                  <input
                  name="closed"
                  className={`form-control ${errors.closed && "border border-danger"
                    }`}
                  {...register("closed")}
                  readOnly
                />
                  <small className="text-danger">
                    {errors.closed?.message}
                  </small>
                </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-xl-4">
  
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Action</h5>
                </div>
                <div className="card-body">
                <div className="form-group mt-3 ">
                  <label>Status </label>
                  <input
                    name="status"
                    className={`form-control ${errors.status && "border border-danger"
                      }`}
                    type="text"
                    placeholder="Enter Status"
                    {...register("status")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.status?.message}
                  </small>
                </div>
                <div className="form-group mt-3 ">
                  <label>Action Date</label>
                  <input
                    className={`form-control ${errors.action_date && "border border-danger"
                      }`}
                    name="action_date"
                    type="date"
                    {...register("action_date")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.action_date?.message}
                  </small>
                </div>
                <div className="form-group mt-3 ">
                  <label>Action By </label>
                  <input
                    name="action_by_text"
                    className={`form-control ${errors.action_by_text && "border border-danger"
                      }`}
                    type="text"
                    placeholder="Enter Action Text"
                    {...register("action_by_text")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.action_by_text?.message}
                  </small>
                </div>
                <div className="form-group mt-3 ">
                  <label>Previous Action Date</label>
                  <input
                    className={`form-control ${errors.previous_action_date && "border border-danger"
                      }`}
                    name="previous_action_date"
                    type="date"
                    {...register("previous_action_date")}
                    readOnly
                  />
                  <small className="text-danger">
                    {errors.previous_action_date?.message}
                  </small>
                </div>
                </div>
              </div>
            
            </div>
          </div>
        </form>


  </div> )
}
