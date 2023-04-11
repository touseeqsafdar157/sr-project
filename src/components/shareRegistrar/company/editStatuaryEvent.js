import { Controller, useForm } from "react-hook-form";
import { EditEventScema } from 'store/validations/alertValidation';
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import { ToastContainer, toast } from "react-toastify";
import { updateEvent } from "store/services/company.service";

import React, { useState, useEffect } from 'react'
// import { addAlertValidationSchema } from 'store/validations/alertValidation';
import { addEventValidationSchema } from "store/validations/alertValidation";
import Select from "react-select";
import { getCompanies } from 'store/services/company.service';
import { getAllRequirmentData } from "store/services/company.service";
export const EditStatuaryEvent = ({setEditEvent, showID, getPaginatedEvent}) => {
    const event = JSON.parse(sessionStorage.getItem("selectedEvent")) || "";
    const [selectedCompany, setSelectedCompany] = useState("");
    const [companies_dropdown, setCompanies_dropdown] = useState([]);
    const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const [defaultCompany, setDefaultCompany] = useState(event?.com);
    const [requirment, setRequirment] = useState('')
    const [defaultRequirment, setDefaultRequirmentCode] = useState( event?.req_code || '')
    const [defaultCode, setDefaultCompanyCode]=  useState('');
    const [loading, setLoading] = useState(false)
    // const [manualStatuaryData] = useState([
    //   { label: 'After AGM meeting - Form A', forms: 'Form A' },
    //   { label: 'End of calander year but no AGM - Form A', forms: 'Form A' },
    //   { label: 'Details of 25 percent or more holding - Form 45', forms: 'Form 45' },
    //   { label: 'Increase in Paid Up Capital- Form 3' , forms: 'Form 3'},
    //   { label: 'Increase in Paid Up Captial due to Bonus - Form 3' , forms: 'Form 3'},
    //   { label: 'Increase in Paid Up Capital due to Right - Form 3', forms: 'Form 3' },
    //   { label: 'Decrease in Paid Up Capital - Form 3 ' , forms: 'Form 3'},
    //   { label: 'Decrease in Paid Up Capital due to Buy Back of shares - Form 3' , forms: 'Form 3'},
    //   { label: 'Major Shareholder holding changed - Form 3A', forms: 'Form 3A' },
    //   { label: 'Change of Principle Line of Business - Form 4', forms: 'Form 4' },
    //   { label: 'Change of Province of company - Form 5', forms: 'Form 5' },
    //   { label: 'Increase in Authorised Capital - Form 7', forms: 'Form 7' },
    //   { label: 'Decrease in Authorised Capital - Form 7', forms: 'Form 7' },
    //   { label: 'Company Name Change - Form 8', forms: 'Form 8' },
    //   { label: 'Appointment of New Director - Form 28', forms: 'Form 28' },
    //   { label: 'Change in Director -Form 29', forms: 'Form 29' },
    //   { label: 'Change in CEO - Form 29', forms: 'Form 29' },
    //   { label: 'Change in CFO - Form 29', forms: 'Form 29' },
    //   { label: 'Change in CS - Form 29', forms: 'Form 29' },
    //   { label: 'Change in Auditor - Form 29', forms: 'Form 29' },
    //   { label: 'Change in Ledgal Advisor - Form 29', forms: 'Form 29' },
    // ])
    const [manualStatuaryData, setManualStatutoryData] = useState([])
    const baseEmail = sessionStorage.getItem("email") || "";
    const getaALLRequirment = async (pagenum) => {
      // setLoadingRequirment(true);
      try {
        const response = await getAllRequirmentData(
          baseEmail,
        );
        if (response.status === 200) {
          const options = response?.data?.data?.map((item) => {
            let label = `${item?.code} - ${item?.title}`;
            return { label: label};
          });
          setManualStatutoryData(options)
        }
      } catch (error) {
      }
    };
    useEffect(()=>{
      getaALLRequirment();
    }, [])
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
      const handleAlertMessage = async(data)=>{
        const defaultCompanycode = defaultCompany?.split('-')[0]?.trim()
        try {
          setLoading(true);
          // let response;
          const response = await updateEvent(
            baseEmail,
            event?.statutory_event_id || '',
            selectedCompany|| defaultCode || '',
            requirment|| defaultRequirment  ||'',
            data?.title || '',
            data?.start_date || '',
            data?.deadline_date || '',
            data?.reminder_days || '',
            data?.action_date || '',
            data?.action_by_text || '',
            data?.previous_action_date || '',
            data?.status || '',
            data?.comment || '',
            data?.closed || ''
          );
    
          if (response.data.status === 200) {
            setTimeout(() => {
              setLoading(false);
              getPaginatedEvent("1");
              toast.success(`${response.data.message}`);
              setEditEvent(false);
            }, 2000);
          } else {
            setLoading(false);
            toast.error(`${response.data.message}`);
          }
        } catch (error) {
          setLoading(false);
          !!error?.response?.data?.message
            ? toast.error(error?.response?.data?.message)
            : toast.error("Event Not Added");
        }
      }
      const appliedStyles = {
        control: (base, state) => ({
          ...base,
          border: "1px solid red",
        }),
      };
      useEffect(() => {
        const getAllCompanies = async () => {
          setCompanies_data_loading(true);
          try {
            const response = await getCompanies(baseEmail);
            if (response.status === 200) {
              const parents = response.data.data;
              const findCompany =  parents?.find(item=> item?.code == event?.company_code)
              let findLabel = `${findCompany?.code} - ${findCompany?.company_name}`;
            setDefaultCompanyCode(findCompany?.code)
              setDefaultCompany(findLabel);
              const companies_dropdowns = response.data.data.map((item) => {
                let label = `${item.code} - ${item.company_name}`;
                return { label: label, value: item.code };
              });
              setCompanies_dropdown(companies_dropdowns);
              setCompanies_data_loading(false);
            }
          } catch (error) {
            setCompanies_data_loading(false);
          }
        };
        getAllCompanies();
      }, []);
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

                <Controller
                  name="company_code"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={companies_dropdown}
                      isLoading={companies_data_loading === true}
                      id="company_code"
                      placeholder =  {defaultCompany || 'Enter Company'}
                      onChange={(selected) => {
                        if (selected?.value) setSelectedCompany(selected.value);
                        else setSelectedCompany("");
                      }}
                      isClearable={true}
                      styles={errors.company_code && appliedStyles}
                    />
                  )}
                  control={control}
                />

                <small className="text-danger">
                  {errors.company_code?.message}
                </small>
              </div>
                <div className="form-group mt-3">
                <label>Requirement</label>
                <Controller
                    name="request_code"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={manualStatuaryData}
                        // isLoading={true}
                        id="request_code"
                        placeholder={ defaultRequirment || 'Enter Requirement'}
                        onChange={(selected) => {
                          if(selected.label){
                            setRequirment(selected.label)
                          } else{
                            setRequirment('')
                          }
                        }}
                        isClearable={true}
                        // styles={requirment && appliedStyles}
                      />
                    )}
                    control={control}
                  />
                {/* <Controller
                    name="request_code"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[]}
                        isLoading={true}
                        id="request_code"
                        placeholder={ event?.request_code || 'Enter Requirement'}
                        onChange={(selected) => {
                         console.log('selected')
                        }}
                        isClearable={true}
                        styles={errors.request_code && appliedStyles}
                      />
                    )}
                    control={control}
                  /> */}
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
                      />
                    )}
                    control={control}
                  />

                  <small className="text-danger">
                    {errors.reminder_days?.message}
                  </small>
                </div>
                <div className="form-group mt-3  ">
                  <label htmlFor="closed">Closed</label>
                  <select
                    name="closed"
                    className={`form-control ${errors.closed && "border border-danger"
                      }`}
                    {...register("closed")}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
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
                  />
                  <small className="text-danger">
                    {errors.previous_action_date?.message}
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

  </div>  )
}
