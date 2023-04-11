import React, { useEffect, useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { getCompanies } from 'store/services/company.service';
import { addManualStatuaryAlert } from 'store/services/company.service';
import { ToastContainer, toast } from "react-toastify";
export const ManualAlertModel = ({setManualalert, data}) => {
    const [selectedCompany, setSelectedCompany] = useState("");
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [loading, setLoading] = useState(false);
  const baseEmail = sessionStorage.getItem("email") || "";
  const token = sessionStorage.getItem("token")
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();
  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try {
        const response = await getCompanies(baseEmail);
        if (response.status === 200) {
          const parents = response.data.data;
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
  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };
  const handleManualStatuaryAlert = async()=>{
    if(!baseEmail || !selectedCompany || !data?.event || !data?.forms){
        toast.error("company code, event and form required");
        return
    }
    try {
        setLoading(true);
        const response = await addManualStatuaryAlert(
            baseEmail,
            selectedCompany,
            data?.event,
            data?.forms
          );
          if (response.data.status === 200) {
            setTimeout(() => {
                setLoading(false);
                toast.success(`${response.data.message}`);
                setManualalert(false);
              }, 2000);
          }else {
            setLoading(false);
            toast.error(`${response.data.message}`);
          }
      } catch (error) {
        setLoading(false);
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Alerts Not Added");
      }
  }
  return (
    <>    <div className='row'>
<div className="form-group mt-3 col-md-6">
                  <label htmlFor="company_code">Company</label>

                  <Controller
                    name="company_code"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={companies_dropdown}
                        isLoading={companies_data_loading === true}
                        id="company_code"
                        placeholder={'Enter Company'}
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

                  <small >
                   select company for manual add alert
                  </small>
                </div>
             
    </div>

    {/* {loading ? (
                  <>
                    <span className="fa fa-spinner fa-spin"></span>
                    <span>{"Loading..."}</span>
                  </>
                ) : (
                  <span>{"Submit"}</span>
                )} */}
    {selectedCompany && <button
     className="btn btn-secondary btn-sm "
     disabled={Boolean(loading)}
   onClick={()=>  {
handleManualStatuaryAlert()
}}
   >
     {loading ? (
                  <>
                    <span className="fa fa-spinner fa-spin"></span>
                    <span>{"Loading..."}</span>
                  </>
                ) : (
                  <span>{"Send Alert"}</span>
                )}
     
   </button>}
   </>

  )
}
