import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";
import GovernanceItem from "./addGovernance";
import { AuthorizedPersonItem } from "./addAuthorizedPerson";
import { useDispatch } from "react-redux";
import {
  getCompanies,
  updateCompany,
} from "../../../store/services/company.service";
import { getShares } from "../../../store/services/shareholder.service";
import { darkStyle } from "../../defaultStyles";
import LoadableButton from "../../common/loadables";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { updateInvestor } from "../../../store/services/investor.service";
import InputMask from "react-input-mask";
import NumberFormat from "react-number-format";
import { editCompanySchema } from "../../../store/validations/companyValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { getRoles } from "../../../store/services/features.service";
import {
  WATCH_COMPANIES,
  WATCH_COMPANIES_DROPDOWN,
} from "../../../redux/actionTypes";
import SectorsData from "../Sectors.json";
import Spinner from "components/common/spinner";
import moment from "moment";
import { Country, State, City }  from 'country-state-city';
import ServiceProvider from "./ServiceProvider";
import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from "styled-components";
export default function EditCompany({ setViewEditPage, getPaginatedCompanies }) {
  // Email
  const baseEmail = sessionStorage.getItem("email") || "";
  // States
  const company = JSON.parse(sessionStorage.getItem("selectedCompany")) || "";
  const [startcalculation, setStartcalculation] = useState(false);
  const [logo, setLogo] = useState(company.logo);
  const [authPersonObjects, setAuthPersonObjects] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [active, setActive] = useState(company.active === "Y");
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState({});
  const [sectors, setSectors] = useState([]);
  const [getAllcountries, SetAllCountries] = useState();
  const [country, setCountry] = useState(company?.head_office_country);
  const [province, setProvince] = useState(company?.province);
  const [city, setCity] = useState(company?.head_office_city);
  const [selectedCountry, setselectedCountry] = useState(null);
  const authorized_person = JSON.parse(company.authorized_persons) || "";
  const governance = JSON.parse(company.governance) || "";
  const [governanceObjects, setGovernanceObjects] = useState([]);
  // const serviceObject = JSON.parse(company.service_providers) || ""
  const [citiesOption, setCityOption] = useState(null)
  const [selectCity, setSelectcity]  = useState(null);
  const [provinceOptions, setProvinceOptions] = useState(null);
const [selectProvince, setSelectProvince] = useState(null);
const [serviceObjects, setServicesObjects] = useState([]);
const [serviceObject, setserviceObject] = useState( company?.service_providers ? JSON.parse(company.service_providers) : "");
const [next_board_election_date, setNext_Board_Election_Date] = useState(company?.next_board_election_date || '');
const [next_agm_date, set_next_agm_date] = useState(company?.next_agm_date || '');
const [startAuthcalculation, setStartAuthcalculation] = useState(false);
const [serviceObjectsCalculation, setServicesObjectsCalculations] = useState(false);
const [startgovernanceObjectsCalculation, setStartGovernanceObjectsCalculation] = useState(false);
const [count, setCount] = useState(1)
const [presNext, setPresNext] = useState(false)
const [pressBack, setPressBack] = useState(false)
const [dataLoading, setdumyLoading] = useState(false);
const [CompanyNameError, setCompanyNameError] = useState(false)
const [CompanyTypeError, setCompanyTypeError] = useState(false)
const [companyCodeError, setCompanyCodeError] = useState(false)
const [symbolError, setSymbolError] = useState(false)
const [alotSizeError, setAlotSizeError] = useState(false)
const [sectorValueError,setSectorValueError] = useState(false)
const [governanceError, setGovernanceError] = useState(false)
const [paidUpCapitalError, setPaidUpCapitalError] = useState(false)
const [ficalYearError, setFicalYearError] = useState(false)
const [goStep, setGoStep] = useState([{
  showStep: '0'
},
{
  showStep: '4'
}
])
console.log('gostepp', goStep)
const [step, setStep] = useState(0);

  // REACT SELECT STYLES
  // React Select Styles
  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };
  // Yup Validations
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    watch,
  } = useForm({
    defaultValues: editCompanySchema(company).cast(),
    resolver: yupResolver(editCompanySchema(company)),
  });
  const handleCountries =()=>{
    const countries = Country.getAllCountries()
    const countryData = countries.map((item) => {
      return { label: item.name, value: item.isoCode };
    });
    SetAllCountries(countryData)
  }
  // useEffect(()=>{
    
  //   if(company?.service_providers){
  //     // console.log('comap')
  //     const serviceObj = JSON.parse(company.service_providers) || ""
  //     setserviceObject(serviceObj)
  //   }
  //   else{
  //     setserviceObject("")
  //   }

  // },[JSON.stringify(company)])
  console.log('governanceObjects', governanceObjects)
  useEffect(()=>{
    setStartAuthcalculation(false)
    // setAuthPersonObjects([])
  }, [JSON.stringify(authPersonObjects), watch("no_authorized_persons")])
  useEffect(()=>{
    setStartAuthcalculation(false)
    setAuthPersonObjects([])
  }, [watch("no_authorized_persons")])
  useEffect(()=>{
    setStartGovernanceObjectsCalculation(false)
    // setGovernanceObjects([])
  }, [JSON.stringify(governanceObjects), watch("no_governance")])
  useEffect(()=>{
    setStartGovernanceObjectsCalculation(false)
    setGovernanceObjects([])
  }, [watch("no_governance")])
  useEffect(()=>{
    setServicesObjectsCalculations(false)
    // setServicesObjects([])
  }, [JSON.stringify(serviceObjects), watch("service_provider")])
  useEffect(()=>{
    setServicesObjectsCalculations(false)
    setServicesObjects([])
  }, [watch("service_provider")])
  useEffect(()=>{
    setServicesObjectsCalculations(false)
    setStartGovernanceObjectsCalculation(false)
    setStartAuthcalculation(false)
  }, [step])
  useEffect(() => {
    if(step>4){
    if (authPersonObjects?.length > Number(watch("no_authorized_persons"))) {
      for (let i = authPersonObjects?.length; i > Number(watch("no_authorized_persons")); i--) {
        authPersonObjects.shift();
      }
    }
    if (governanceObjects?.length > Number(watch("no_governance"))) {
      for (let i = governanceObjects?.length; i > Number(watch("no_governance")); i--) {
        governanceObjects.shift();
      }
    }
    if (serviceObjects?.length > Number(watch("service_provider"))) {
      for (let i = serviceObjects?.length; i > Number(watch("service_provider")); i--) {
        serviceObjects.shift();
      }
    }
  }
  }, [step])
  useEffect(() => {
    const checkStep1 = goStep?.find(item => item?.showStep == '1')?.showStep
    const checkStep2 = goStep?.find(item => item?.showStep == '2')?.showStep
    const checkStep3 = goStep?.find(item => item?.showStep == '3')?.showStep
    if (!checkStep1) {
      console.log('11111111')
      if (Number(watch("no_authorized_persons"))>0) goStep.push({ showStep: '1' })
    }
    else {
      const index = goStep?.findIndex(item => item?.showStep == '1')
      if (index > -1) {
        if (!watch("no_authorized_persons")||Number(watch("no_authorized_persons"))<=0) {

          const temp = goStep?.filter(item => item?.showStep != goStep[index]?.showStep)
          setGoStep([...temp])
        }

      }
    }
    if (!checkStep2) {
      console.log('222222222', Number(watch("no_governance"))>0)
      if (Number(watch("no_governance"))>0)  goStep.push({ showStep: '2' })
    } else {
      const index = goStep?.findIndex(item => item?.showStep == '2')
      if (index > -1) {
        if (!watch("no_governance") || Number(watch("no_governance"))<=0) {
          const temp = goStep?.filter(item => item?.showStep != goStep[index]?.showStep)
          setGoStep([...temp])
        }

      }
    }
    if (!checkStep3) {
      console.log('333333333')
      if (Number(watch("service_provider"))>0) goStep.push({ showStep: '3' }) 
    } else {
      const index = goStep?.findIndex(item => item?.showStep == '3')
      if (index > -1) {
        if (!watch("service_provider")||Number(watch("service_provider"))<=0) {
          const temp = goStep?.filter(item => item?.showStep != goStep[index]?.showStep)
          setGoStep([...temp])
        }

      }
    }
  }, [watch("no_authorized_persons"), watch("service_provider"), watch("no_governance")])
  useEffect(() => {
    setSectors(SectorsData.sectors.map((item)=>{
      return {
        label: item.sector_name + " - " + item.sector_code,
        value: item.sector_code
      }
    }))
    const getAllRoles = async () => {
      const response = await getRoles(baseEmail);
      if (response.status === 200) {
        const newroles = response.data.data.map((role) => ({
          label: role.role_name,
          value: role.role_name,
        }));
        setRoles(newroles);
      }
    };
    getAllRoles();
    getAllCompanies();
    handleCountries();
    return () => {
      sessionStorage.setItem("selectedCompany", JSON.stringify({}));
    };
  }, []);
  useEffect(()=>{
    if(country){
      const countries = Country.getAllCountries();
     const StateCountry = countries.find(item=>item?.name == country);
     const getProvince = State.getStatesOfCountry(StateCountry?.isoCode);
     const getProvincecode =  getProvince?.find(ite=>ite?.name == province)
     const provinces = getProvince.map(item=>{
      return {label: item?.name, value: item?.isoCode}
    })
    setProvinceOptions(provinces);
    const getCities =  City.getCitiesOfState(StateCountry?.isoCode, getProvincecode?.isoCode)
    const cityOptions = getCities?.map((item) => {
      return { label: item.name, value: item.countryCode };
    });
    setCityOption(cityOptions)
    }
  }, [country])
  useEffect(()=>{
if(selectedCountry?.label){
  const countries = Country.getAllCountries();
  const StateCountry = countries.find(item=>item?.name == country);
  const getProvince = State.getStatesOfCountry(selectedCountry?.value|| StateCountry?.isoCode);
  const provinces = getProvince.map(item=>{
    return {label: item?.name, value: item?.isoCode}
  })
  setProvinceOptions(provinces);
}
  }, [selectedCountry?.label])
  useEffect(()=>{
    if(selectProvince?.label){
      const countries = Country.getAllCountries();
      const StateCountry = countries.find(item=>item?.name == country);
      const getProvince = State.getStatesOfCountry(StateCountry?.isoCode);
      const getProvincecode =  getProvince?.find(ite=>ite?.name == province)
      const getCities =  City.getCitiesOfState(selectedCountry?.value || StateCountry?.isoCode, selectProvince?.value ||  getProvincecode?.isoCode)
  const cityOptions = getCities?.map((item) => {
    return { label: item.name, value: item.countryCode };
  });
  setCityOption(cityOptions)
    }
  }, [selectProvince?.label]);
  const getAllCompanies = async () => {
    const response = await getCompanies(baseEmail);
    if (response.status === 200) {
      const parents = response.data.data.map((comp) => ({
        label: comp.company_name + " - " + comp.symbol,
        value: comp.code,
      }));
      const obj = {label: 'Not Applicable', value:'N/A'};
      parents.push(obj)
      setParents(parents);
    }
  };

  // Functions
  const startSerCalculation = (gov_person) => {
    const newArray = serviceObjects;
    newArray.push(gov_person);
    setServicesObjects(newArray);   
    if (serviceObjects?.length > Number(watch("service_provider"))) {
      for (let i = serviceObjects?.length; i > Number(watch("service_provider")); i--) {
        serviceObjects.shift();
      }
    } 
  };
  const startAuthCalculation = (auth_person) => {
    const newArray = authPersonObjects;
    newArray.push(auth_person);
    setAuthPersonObjects(newArray);
  };
  const startGovCalculation = (gov_person) => {
    const newArray = governanceObjects;
    newArray.push(gov_person);
    setGovernanceObjects(newArray);
  };
  const borderRadiusStyle = { borderRadius: 2 };
  const updateCompanyFunction = async (email, data, company_sectory)=>{
    try {
      setLoading(true);
      const response = await updateCompany(
        email,
        company.code,
        data.company_name,
        data.isin,
        data.registered_name,
        data.symbol,
        data.company_secretary,
        data.parent.value,
        active ? "Y" : "N",
        data.ntn,
        data.incorporation_no,
        // data.sector_code,
        data.sector_code.value,
        data.website,
        data.contact_person_name,
        data.contact_person_phone,
        data.exchange_no,
        data.contact_person_email,
        data.ceo_name,
        data.ceo_phone,
        data.ceo_mobile,
        data.ceo_email,
        data.ho_address,
        // data.ho_city,
        selectCity?.label || city, // country city
        // data.ho_country,
      selectedCountry?.label || country , // country
      selectProvince?.label || province,
        data.outstanding_shares,
        data.face_value,
        data.total_shares,
        data.free_float,
        data.treasury_shares,
        data.preference_shares,
        data.ordinary_shares,
        data.non_voting_shares,
        data.redeemable_shares,
        data.management_shares,
        data.company_type,
        authPersonObjects,
        governanceObjects,
        data.allot_size,
        logo,
        data.number_of_directors,
        data.shareholder_directors,
        data.independent_directors,
        data.board_election_date,
        data.company_auditor,
        data.company_registrar,
        data.fiscal_year,

        data?.authorized_capital,
        data?.paid_up_capital,
        serviceObjects,
        next_board_election_date|| '',
        // data?.next_board_election_date,
        data?.agm_date,
        next_agm_date || '',
        data?.bussines_service,
      );

      if (response.data.status === 200) {
        setTimeout(() => {
          setLoading(false);
          getAllCompanies();
          toast.success(`${response.data.message}`);
          setViewEditPage(false);
          getPaginatedCompanies()
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      !!error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : toast.error("Company Not Edited");
    }
  }
  const handleUpdateCompany = async (data) => {
    if(data.sector_code.value===""){
      toast.error('Please Select Sector')
      return;
    }
    const email = sessionStorage.getItem("email");
    setStartcalculation(true);
    if((Number(data?.paid_up_capital) > Number(data?.authorized_capital)) || (data?.paid_up_capital && data?.authorized_capital==undefined)){
      toast.error("Paid Up Capital can't be greater then Authorized Capital")
      return 
    }
    if(data?.fiscal_year){
      if(moment(data.fiscal_year).format('MMMM')=='June' || moment(data.fiscal_year).format('MMMM')=='December'){}
       else{
        toast.error('Please Select Month Only June or December')
        return
      }
    }
    setTimeout(() => {
      let company_sectory, companyCeo, cfo_company_secretary;
      if(governanceObjects?.length){
        company_sectory = governanceObjects?.find(item=>item?.role=='Company Secretary')?.name
        cfo_company_secretary = governanceObjects?.find(item=>item?.role=='CFO/Company Secretary')?.name
        const checkCfoCompanySectory = governanceObjects?.filter(item=>item?.role=='CFO/Company Secretary');
        const checkCFO = governanceObjects?.filter(item=>item?.role=='CFO');
        companyCeo = governanceObjects?.find(item=>item?.role=='CEO')?.name
        if(checkCfoCompanySectory?.length > 1  || checkCFO?.length> 1) {
          toast.error('CFO/Company Secretary Must be one');
          setStartcalculation(false);
          // setGovernanceObjects([])
          // setServicesObjects([])
          return ;
        }
        if(!company_sectory){
          company_sectory = governanceObjects?.find(item=>item?.role == 'CFO/Company Secretary')?.name;
        }    
        if(!company_sectory   || !companyCeo){
          toast.error('Company CEO and Company Secretary Required');
          setStartcalculation(false);
          // setServicesObjects([])
          // setGovernanceObjects([])
          return ;
        }
      } else{
        toast.error('Add Goverance because company CEO and Secretary Recquired');
        // setServicesObjects([])
        // setGovernanceObjects([])
        setStartcalculation(false);
        return ;
      }
     if(serviceObjects?.length){
        const auditor =  serviceObjects?.filter(item=>item?.type?.toLowerCase()=='auditor') 
        const internalAuditor =  serviceObjects?.filter(item=>item?.type?.toLowerCase()=='internal auditoruditor') 
        const legaladvisor =  serviceObjects?.filter(item=>item?.type?.toLowerCase()=='legal advisor') 
        const shariah =  serviceObjects?.filter(item=>item?.type?.toLowerCase()=='shariah advisor') 
        if(auditor?.length>1 ||internalAuditor?.length>1 ||legaladvisor?.length>1 ||shariah?.length>1  ) {
          toast.error('Service Provider type should be Unique')
          // setServicesObjects([])
          // setGovernanceObjects([])
          setStartcalculation(false)
          return
        } 
      }
    updateCompanyFunction(email, data, company_sectory)
    }, 500);
  };

  useEffect(()=>{
    let date = new Date(watch('board_election_date'));
    if(moment(date.getFullYear() + 3).format('DD-MM-YYYY')!=='Invalid date'){
      setNext_Board_Election_Date(moment(date.setFullYear(date.getFullYear() + 3)).format('yyyy-MM-DD'));
    }else{
      setNext_Board_Election_Date('');
    }

  },[watch('board_election_date')])
  useEffect(()=>{
    
    let date = new Date(watch('agm_date'));
    if(moment(date.getFullYear() + 3).format('DD-MM-YYYY')!=='Invalid date'){
      set_next_agm_date(moment(date.setFullYear(date.getFullYear()+1)).format('yyyy-MM-DD'));
    }else{
      set_next_agm_date('');
    }

  },[watch('agm_date')])
  return (
    <div>
      <Fragment>
      {
          step<4&&
        
        <div className="mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
               Steps {count} Of {goStep?.length-1}
         
        </div>}
     <form onSubmit={handleSubmit(handleUpdateCompany)}>
     {(step<=0 ) && <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Company Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group mb-3">
                    <label>Company Name</label>
                    <input
                      name="company_name"
                      className={`form-control ${
                        CompanyNameError && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Company Name"
                      {...register("company_name")}
                    />
                    <small className="text-danger">
                      {CompanyNameError ? 'Enter Company Name' : ''}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="company_type">Company Type</label>
                    <select
                      name="company_type"
                      className={`form-control ${
                       CompanyTypeError && "border border-danger"
                      }`}
                      {...register("company_type")}
                    >
                      <option value="">Select</option>
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                    <small className="text-danger">
                      {CompanyTypeError ? 'Enter Company Type' : ''}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label>ISIN</label>
                    <input
                      name="isin"
                      className={`form-control ${
                        errors.isin && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Company Name"
                      {...register("isin")}
                    />
                    <small className="text-danger">
                      {errors.isin?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label>Registered Name</label>
                    <input
                      name="registered_name"
                      className={`form-control ${
                        errors.registered_name && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Company Name"
                      {...register("registered_name")}
                    />
                    <small className="text-danger">
                      {errors.registered_name?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label>Company Code</label>

                    <Controller
                      name="code"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                           companyCodeError && "border border-danger"
                          }`}
                          id="code"
                          allowNegative={false}
                          placeholder="Enter Company Code"
                          readOnly
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {companyCodeError ? 'Enter Company Code': ''}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="symbol">Symbol</label>
                    <input
                      className={`form-control ${
                        symbolError && "border border-danger"
                      }`}
                      name="symbol"
                      type="text"
                      placeholder="Symbol"
                      {...register("symbol")}
                    />
                    <small className="text-danger">
                      {symbolError ? 'Enter symobl' : ''}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="company_secretary">Company Secretary</label>
                    <input
                      className="form-control"
                      name="company_secretary"
                      type="text"
                      placeholder="Company Secretary"
                      {...register("company_secretary")}
                    />
                    <small className="text-danger">
                      {errors.company_secretary?.message}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="ntn">NTN</label>
                    <input
                      className="form-control"
                      name="ntn"
                      type="text"
                      placeholder="NTN"
                      {...register("ntn")}
                    />
                    <small className="text-danger">{errors.ntn?.message}</small>
                  </div>

                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="parent">
                      Parent Company
                    </label>
                    <Controller
                      name="parent"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={parents}
                          id="parent"
                          placeholder="Select parent"
                          styles={errors.parent && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.parent?.message}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="incorporation_no">Incorporation No</label>
                    <input
                      className="form-control"
                      name="incorporation_no"
                      type="text"
                      placeholder="Incorporation No"
                      {...register("incorporation_no")}
                    />
                    <small className="text-danger">
                      {errors.incorporation_no?.message}
                    </small>
                  </div>

                  {/* <div className="form-group mb-3">
                    <label htmlFor="sector_code">Sector Code</label>
                    <input
                      className="form-control"
                      name="sector_code"
                      type="text"
                      placeholder="Sector Code"
                      {...register("sector_code")}
                    />
                    <small className="text-danger">
                      {errors.sector_code?.message}
                    </small>
                  </div> */}

                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="sector_code">
                      Sector
                    </label>
                    <Controller
                      name="sector_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={sectors}
                          id="sector_code"
                          placeholder="Select Sector"
                          styles={sectorValueError && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {sectorValueError ? 'Kindly Select Sector' : ''}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="bussines_service">Bussines service</label>
                    <input
                      className="form-control"
                      name="bussines_service"
                      type="text"
                      placeholder="Bussines Service"
                      {...register("bussines_service")}
                    />
                    <small className="text-danger">
                      {errors.bussines_service?.message}
                    </small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="logo">Company Logo</label>
                    <input
                      className={`form-control ${
                        errors.logo && "border border-danger"
                      }`}
                      accept=".jpg,.png,.jpeg"
                      name="logo"
                      type="file"
                      {...register("logo")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          let img = e.target.files[0];
                          const reader = new FileReader();
                          reader.readAsDataURL(img);
                          reader.onload = function () {
                            setLogo(reader.result);
                          };
                        }
                      }}
                    />
                    <small className="text-danger d-block">
                      {errors.logo?.message}
                    </small>
                    {logo && (
                      <img width="200" src={logo} alt="logo_of_company" />
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="website">Website</label>
                    <input
                      className="form-control"
                      name="website"
                      type="text"
                      placeholder="Company Website"
                      {...register("website")}
                    />
                    <small className="text-danger">
                      {errors.website?.message}
                    </small>
                  </div>
                  {/* <div className="form-group mb-3">
                    <label htmlFor="auditor">Auditor</label>
                    <input
                      className="form-control"
                      name="company_auditor"
                      type="text"
                      placeholder="Auditor"
                      {...register("company_auditor")}
                    />
                    <small className="text-danger">
                      {errors.company_auditor?.message}
                    </small>
                  </div> */}
                  <div className="form-group mb-3">
                    <label htmlFor="Registrar"> Registrar</label>
                    <input
                      className="form-control"
                      name=" company_registrar"
                      type="text"
                      placeholder="Registrar"
                      {...register("company_registrar")}
                    />
                    <small className="text-danger">
                      {errors.company_registrar?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="fiscal year">Fiscal Year</label>
                    <input
                      className={`form-control ${
                        ficalYearError && "border border-danger"
                      }`}
                      name="fiscal_year"
                      type="month"
                      placeholder="MMMM-YYYY"
                      {...register("fiscal_year")}
                    />
                    <small className="text-danger">
                    {ficalYearError ? 'Fiscal Year Month Should Be June or December': ''}

                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label htmlFor="agm_date">
                     AGM DATE
                    </label>
                    <input
                      className={`form-control ${
                        errors.agm_date && "border border-danger"
                      }`}
                      name="agm_date"
                      type="date"
                      {...register("agm_date")}
                    />
                    <small className="text-danger">
                      {errors.agm_date?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label>
                    Next AGM Date
                    </label>
                    <input
                    name='next_agm_date'
                   className={`form-control ${
                    errors.next_agm_date && "border border-danger"
                  }`}
                      type="date"
                      value={next_agm_date}
                      disabled={!watch('agm_date')}
                      onChange={e=>{
                        set_next_agm_date(e.target.value)
                      }}
                      // {...register("next_agm_date")}
                      // value={next_agm_date}
                      // readOnly
                    />
                    <small className="text-danger">
                      {errors.next_agm_date?.message}
                    </small>

                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="active">Active </label>
                    <ToggleButton
                      name="active"
                      value={active}
                      thumbStyle={borderRadiusStyle}
                      trackStyle={borderRadiusStyle}
                      onToggle={() => setActive(!active)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-xl-4">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Contact Person</h5>
                </div>
                <div className="card-body">
                  <div className="form-group mb-3">
                    <label htmlFor="contact_person_name">Name</label>
                    <input
                      className="form-control"
                      name="contact_person_name"
                      type="text"
                      placeholder="Company Person Name"
                      {...register("contact_person_name")}
                    />
                    <small className="text-danger">
                      {errors.contact_person_name?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Phone</label>
                    <Controller
                      name="contact_person_phone"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.contact_person_phone && "border-danger"
                          }`}
                          maxLength={16}
                          id="contact_person_phone"
                          allowNegative={false}
                          placeholder="Enter Phone Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.contact_person_phone?.message}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="exchange_no">Exchange No</label>
                    <input
                      className="form-control"
                      name="exchange_no"
                      type="text"
                      placeholder="Exchange No"
                      {...register("exchange_no")}
                    />
                    <small className="text-danger">
                      {errors.exchange_no?.message}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="contact_person_email">Email</label>
                    <input
                      className="form-control"
                      name="contact_person_email"
                      type="email"
                      placeholder="Email"
                      {...register("contact_person_email")}
                    />
                    <small className="text-danger">
                      {errors.contact_person_email?.message}
                    </small>
                  </div>
                </div>
              </div>

              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Head Office Address</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-3">
                    <label className="my-1" htmlFor="ho_address">
                      Address
                    </label>
                    <textarea
                      className={`form-control ${
                        errors.ho_address && "border border-danger"
                      }`}
                      type="text"
                      name="ho_address"
                      id="ho_address"
                      placeholder="Enter Address"
                      {...register("ho_address")}
                    />
                    <small className="text-danger">
                      {errors.ho_address?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="ho_country">Country</label>
                    <Controller
                      name="ho_country"
                      render={({ field }) => (
                        <Select
                          {...field}
                          // defaultInputValue ={company?.head_office_country || ''}
                          isLoading={getAllcountries?.length === 0}
                          options={getAllcountries}
                          id="ho_country"
                          placeholder={country|| "Select Country"}
                          styles={errors.ho_country && appliedStyles}
                          onChange={(selected)=>{
                            if(selected.value) setselectedCountry(selected)
                            else setselectedCountry(null)
                          }}
                        />
                      )}
                      control={control}
                    />
                    {/* <input
                      className="form-control"
                      name="ho_country"
                      type="text"
                      placeholder="Country"
                      {...register("ho_country")}
                    /> */}
                    <small className="text-danger">
                      {errors.ho_country?.message}
                    </small>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="ho_province">Province</label>
                    <Controller
                      name="ho_province"
                      render={({ field }) => (
                        <Select
                          {...field}
                          // defaultInputValue ={company?.head_office_country || ''}
                          isLoading={provinceOptions?.length === 0}
                          options={provinceOptions}
                          id="ho_province"
                          placeholder={province|| "Select Province"}
                          styles={errors.ho_province && appliedStyles}
                          isDisabled = {!provinceOptions?.length}
                          onChange={(selected)=>{
                            if(selected.value) setSelectProvince(selected)
                            else setSelectProvince(null)
                          }}
                        />
                      )}
                      control={control}
                    />
                    {/* <input
                      className="form-control"
                      name="ho_country"
                      type="text"
                      placeholder="Country"
                      {...register("ho_country")}
                    /> */}
                    <small className="text-danger">
                      {errors.ho_province?.message}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="ho_city">City</label>
                    <Controller
                      name="ho_city"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={citiesOption?.length === 0}
                          options={citiesOption}
                          id="ho_city"
                          isDisabled = {!citiesOption?.length}
                          placeholder={city ||"Select City"}
                          onChange={(selected)=>{
                            if(selected.value) setSelectcity(selected)
                            else setSelectcity(null)
                          }}
                          // onChange={(selected)=> {
                          //   if(selected.value){
                          //     setCountry(selected)
                          //   }
                          //   else{
                          //     setCountry(null)
                          //   }
                          // }}
                          styles={errors.ho_city && appliedStyles}
                        />
                      )}
                      control={control}
                    />
                    {/* <input
                      className="form-control"
                      name="ho_city"
                      type="text"
                      placeholder="City"
                      {...register("ho_city")}
                    /> */}
                    <small className="text-danger">
                      {errors.ho_city?.message}
                    </small>
                  </div>

                  
                </div>
              </div>
              {/* <div className="card">
                <div className="card-header b-t-primary">
                  <h5>Board Memebers</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Authorized Persons</label>
                    <Controller
                      name="no_authorized_persons"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_authorized_persons && "border-danger"
                          }`}
                          id="no_authorized_persons"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_authorized_persons?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Governance</label>
                    <Controller
                      name="no_governance"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_governance && "border-danger"
                          }`}
                          id="no_governance"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_governance?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Service Providers</label>
                    <Controller
                      name="service_provider"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.service_provider && "border-danger"
                          }`}
                          id="service_provider"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.service_provider?.message}
                    </small>
                  </div>
                </div>
              </div> */}
              <div className="card">
                <div className="card-header b-t-primary">
                  <h5>Election Information</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Number of Directors</label>
                    <Controller
                      name="number_of_directors"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.number_of_directors && "border-danger"
                          }`}
                          id="number_of_directors"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.number_of_directors?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shareholder_directors">
                      No of Shareholder Directors
                    </label>
                    <input
                      className={`form-control ${
                        errors.shareholder_directors && "border border-danger"
                      }`}
                      name="Enter Number"
                      type="text"
                      placeholder="shareholder_directors"
                      {...register("shareholder_directors")}
                    />
                    <small className="text-danger">
                      {errors.shareholder_directors?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="independent_directors">
                      No of Independent Directors
                    </label>
                    <input
                      className={`form-control ${
                        errors.independent_directors && "border border-danger"
                      }`}
                      name="independent_directors"
                      type="text"
                      placeholder="Enter Number"
                      {...register("independent_directors")}
                    />
                    <small className="text-danger">
                      {errors.independent_directors?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="board_election_date">
                      Board Election Date
                    </label>
                    <input
                      className={`form-control ${
                        errors.board_election_date && "border border-danger"
                      }`}
                      name="board_election_date"
                      type="date"
                      {...register("board_election_date")}
                    />
                    <small className="text-danger">
                      {errors.board_election_date?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label>
                    Next Board Election Date
                    </label>
                    <input
                      className={`form-control`}
                      type="date"
                      name="next_board_election_date"
                      value={next_board_election_date}
                      disabled={!watch('board_election_date')}
                      onChange={e=>{
                        setNext_Board_Election_Date(e.target.value)
                      }}
                      // value={next_board_election_date}
                      // {...register('next_board_election_date')}
                      // readOnly
                    />
                    <small className="text-danger">
                      {errors?.next_board_election_date?.message}
                    </small>
                  </div>
                  {/* <div className="form-group my-2">
                    <label>
                    Next Board Election Date
                    </label>
                    <input
                      className={`form-control`}
                      type="text"
                      value={next_board_election_date}
                      readOnly
                    />

                  </div> */}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-xl-4">
              {/* <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>CEO</h5>
                </div>
                <div className="card-body">
                  <div className="form-group mb-3">
                    <label htmlFor="ceo_name">Name</label>
                    <input
                      className="form-control"
                      name="ceo_name"
                      type="text"
                      placeholder="Name"
                      {...register("ceo_name")}
                    />
                    <small className="text-danger">
                      {errors.ceo_name?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label>Phone</label>
                    <Controller
                      name="ceo_phone"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.ceo_phone && "border-danger"
                          }`}
                          maxLength={16}
                          id="ceo_phone"
                          allowNegative={false}
                          placeholder="Enter Phone Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.ceo_phone?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label>Mobile No.</label>
                    <Controller
                      name="ceo_mobile"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.ceo_mobile && "border-danger"
                          }`}
                          maxLength={16}
                          id="ceo_mobile"
                          allowNegative={false}
                          placeholder="Enter Mobile Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.ceo_mobile?.message}
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="ceo_email">Email</label>
                    <input
                      className="form-control"
                      name="ceo_email"
                      type="email"
                      placeholder="Email"
                      {...register("ceo_email")}
                    />
                    <small className="text-danger">
                      {errors.ceo_email?.message}
                    </small>
                  </div>
                </div>
              </div> */}

              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Shareholding Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="outstanding_shares">
                      Outstanding Shares
                    </label>
                    <Controller
                      name="outstanding_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.outstanding_shares && "border border-danger"
                          }`}
                          id="outstanding_shares"
                          allowNegative={false}
                          placeholder="Enter Outstanding Shares"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.outstanding_shares?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="face_value">
                      Face Value
                    </label>
                    <Controller
                      name="face_value"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.face_value && "border border-danger"
                          }`}
                          id="face_value"
                          allowNegative={false}
                          placeholder="Enter Face Value"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.face_value?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="total_shares">
                      Total Shares
                    </label>
                    <Controller
                      name="total_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.total_shares && "border border-danger"
                          }`}
                          id="total_assets"
                          allowNegative={false}
                          placeholder="Enter Total Assets"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.total_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="allot_size">
                      Lot Size
                    </label>
                    <Controller
                      name="allot_size"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            alotSizeError && "border border-danger"
                          }`}
                          id="allot_size"
                          allowNegative={false}
                          placeholder="Enter Total Assets"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {alotSizeError ? 'Enter Number' : ''}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="treasury_shares">
                      Treasury Shares
                    </label>
                    <Controller
                      name="treasury_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.treasury_shares && "border border-danger"
                          }`}
                          id="treasury_shares"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.treasury_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="free_float">
                      Free Float
                    </label>
                    <Controller
                      name="free_float"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.free_float && "border border-danger"
                          }`}
                          id="free_float"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.free_float?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="preference_shares">
                      Preference Shares
                    </label>
                    <Controller
                      name="preference_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.preference_shares && "border border-danger"
                          }`}
                          id="preference_shares"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.preference_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="ordinary_shares">
                      Ordinary Shares
                    </label>
                    <Controller
                      name="ordinary_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.ordinary_shares && "border border-danger"
                          }`}
                          id="ordinary_shares"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.ordinary_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="non_voting_shares">
                      Non Voting Shares
                    </label>
                    <Controller
                      name="non_voting_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.non_voting_shares && "border border-danger"
                          }`}
                          id="non_voting_shares"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.non_voting_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="redeemable_shares">
                      Redeemable Shares
                    </label>
                    <Controller
                      name="redeemable_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.redeemable_shares && "border border-danger"
                          }`}
                          id="redeemable_shares"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.redeemable_shares?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="management_shares">
                      Management Shares
                    </label>
                    <Controller
                      name="management_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.management_shares && "border border-danger"
                          }`}
                          id="management_shares"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.management_shares?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="authorized_capital">
                            Authorized Capital
                    </label>
                    <Controller
                      name="authorized_capital"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.authorized_capital && "border border-danger"
                          }`}
                          id="authorized_capital"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small type="text-danger">
                      {errors.authorized_capital?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label className="my-1" htmlFor="paid_up_capital">
                     Paid Up Capital
                    </label>
                    <Controller
                      name="paid_up_capital"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            paidUpCapitalError && "border border-danger"
                          }`}
                          id="paid_up_capital"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                    {paidUpCapitalError ? 'Paid Up Capital Can Not be greater then Authorized Capital' : ''}
                      {/* {isError? <span className="text-danger">Paid Up Capital can not Greather the Authorized Capital </span>:''} */}
                    </small>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header b-t-primary">
                  <h5>Board Memebers</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Authorized Persons</label>
                    <Controller
                      name="no_authorized_persons"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_authorized_persons && "border-danger"
                          }`}
                          id="no_authorized_persons"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_authorized_persons?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Governance</label>
                    <Controller
                      name="no_governance"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            governanceError && "border-danger"
                          }`}
                          id="no_governance"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                    {governanceError ? ' Governance Number Should be Greater then one' : ''}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Service Providers</label>
                    <Controller
                      name="service_provider"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.service_provider && "border-danger"
                          }`}
                          id="service_provider"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.service_provider?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div> }
          {/* Authorized Persons */}
          {step==1 &&
            <div className="row">
            <div className="card w-100 mx-4">
              <div className="card-header b-t-success">
                <b>Authorized Persons</b>
              </div>
              {authPersonObjects?.length ? <div className="card-body">
                {watch("no_authorized_persons") && (
                  <TableWrapper className="table table-responsive">
                    <thead>
                      <tr>
                      <th className="text-nowrap">S No.</th>
                          <th className="text-nowrap"> Name</th>
                          <th className="text-nowrap">Email</th>
                          <th className="text-nowrap">
                             Contact
                          </th>
                          <th className="text-nowrap">Reason</th>
                          <th className="text-nowrap">Date</th>
                          <th className="text-nowrap">Active</th>
                        {/* <th className="text-nowrap">Authorized Person Role</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {authPersonObjects?.map((ap, index) => (
                          <AuthorizedPersonItem
                            key={index}
                            num={index + 1}
                            startCalculation={startAuthCalculation}
                            calculated={startAuthcalculation}
                            roles={roles}
                            editPerson={true}
                            ap_name={ap?.name}
                            ap_contact={ap?.contact}
                            ap_email={ap?.email}
                            activeuser={ap?.active}
                            dates={ap?.date}
                            reasons={ap?.reason}
                          />
                        ))}
                    </tbody>
                  </TableWrapper>
                )}
              </div>:
              <div className="card-body">
                {watch("no_authorized_persons") && (
                  <TableWrapper className="table table-responsive">
                    <thead>
                      <tr>
                      <th className="text-nowrap">S No.</th>
                          <th className="text-nowrap"> Name</th>
                          <th className="text-nowrap">Email</th>
                          <th className="text-nowrap">
                             Contact
                          </th>
                          <th className="text-nowrap">Reason</th>
                          <th className="text-nowrap">Date</th>
                          <th className="text-nowrap">Active</th>
                        {/* <th className="text-nowrap">Authorized Person Role</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ...Array(
                          Math.abs(parseInt(watch("no_authorized_persons")))
                        ),
                      ].length > 0 &&
                        [
                          ...Array(
                            Math.abs(parseInt(watch("no_authorized_persons")))
                          ),
                        ].length <= 5 &&
                        roles.length !== 0 &&
                        [
                          ...Array(parseInt(watch("no_authorized_persons"))),
                        ].map((ap, index) => (
                          <AuthorizedPersonItem
                            key={index}
                            num={index + 1}
                            startCalculation={startAuthCalculation}
                            calculated={startAuthcalculation}
                            roles={roles}
                            editPerson={true}
                            ap_name={authorized_person[index]?.name}
                            ap_contact={authorized_person[index]?.contact}
                            ap_email={authorized_person[index]?.email}
                            // ap_role={authorized_person[index]?.role}
                            activeuser={authorized_person[index]?.active}
                            dates={authorized_person[index]?.date}
                            reasons={authorized_person[index]?.reason}
                          />
                        ))}
                    </tbody>
                  </TableWrapper>
                )}
              </div>}
            </div>
          </div>} 
          {/* Governance */}
          {step ==2 && 

          <div className="row">
            <div className="card w-100 mx-4">
              <div className="card-header b-t-success">
                <b>Governance</b>
              </div>
              <div className="card-body">
 { governanceObjects?.length ? <div className="card-body">
                { watch("no_governance") && (
                  <TableWrapper className="table table-responsive">
                    <thead>
                      <tr>
                      <th className="text-nowrap">S No.</th>
                          <th className="text-nowrap"> Name</th>
                          <th className="text-nowrap">Father/Husband Name</th>
                          <th className="text-nowrap">Address</th>
                          <th className="text-nowrap">Nationality</th>
                          <th className="text-nowrap"> Email</th>
                          <th className="text-nowrap"> Contact</th>
                          <th className="text-nowrap"> Business Occupation</th>
                          <th className="text-nowrap"> CNIC/Passport</th>
                          <th className="text-nowrap"> Role</th>
                          <th className="text-nowrap">Reason</th>
                          <th className="text-nowrap">Date</th>
                          <th className="text-nowrap">Active</th>
                          <th className="text-nowrap">Nature Directorship</th>
                      </tr>
                    </thead>
                    <tbody>
                     {governanceObjects?.map(
                          (ap, index) => (
                            <GovernanceItem
                              key={index}
                              num={index + 1}
                              startCalculation={startGovCalculation}
                              calculated={startgovernanceObjectsCalculation}
                              roles={roles}
                              editGover={true}
                              gov_name={ap?.name}
                              gov_email={ap?.email}
                              gov_role={ap?.role}
                              gov_contact={ap?.contact}
                              gov_cnic={ap?.cnic_passport}
                              reasons={ap?.reason}
                              dates={ap?.date}
                              activeGov={ap?.active}
                              gov_father_husband_name={ap?.father_husband_name}
                              gov_nationality={ap?.nationality}
                              gov_business={ap?.business}
                              gov_directorship={ap?.directorship}
                              gov_address={ap?.address}
                            />
                          )
                        )}
                    </tbody>
                  </TableWrapper>
                )}
              </div>:
                 watch("no_governance") && (
                  <TableWrapper className="table table-responsive">
                    <thead>
                      <tr>
                      <th className="text-nowrap">S No.</th>
                          <th className="text-nowrap"> Name</th>
                          <th className="text-nowrap">Father/Husband Name</th>
                          <th className="text-nowrap">Address</th>
                          <th className="text-nowrap">Nationality</th>
                          <th className="text-nowrap"> Email</th>
                          <th className="text-nowrap"> Contact</th>
                          <th className="text-nowrap"> Business Occupation</th>
                          <th className="text-nowrap"> CNIC/Passport</th>
                          <th className="text-nowrap"> Role</th>
                          <th className="text-nowrap">Reason</th>
                          <th className="text-nowrap">Date</th>
                          <th className="text-nowrap">Active</th>
                          <th className="text-nowrap">Nature Directorship</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(Math.abs(parseInt(watch("no_governance"))))]
                        .length > 0 &&
                        [...Array(Math.abs(parseInt(watch("no_governance"))))]
                          .length <= 20 &&
                        roles.length !== 0 &&
                        [...Array(parseInt(watch("no_governance")))].map(
                          (ap, index) => (
                            <GovernanceItem
                              key={index}
                              num={index + 1}
                              startCalculation={startGovCalculation}
                              calculated={startgovernanceObjectsCalculation}
                              roles={roles}
                              gov_name={governance[index]?.name}
                              gov_email={governance[index]?.email}
                              gov_role={governance[index]?.role}
                              gov_contact={governance[index]?.contact}
                              gov_cnic={governance[index]?.cnic_passport}
                              reasons={governance[index]?.reason}
                              dates={governance[index]?.date}
                              activeGov={governance[index]?.active}
                              gov_father_husband_name={governance[index]?.father_husband_name}
                              gov_nationality={governance[index]?.nationality}
                              gov_business={governance[index]?.business}
                              gov_directorship={governance[index]?.directorship}
                              gov_address={governance[index]?.address}
                              editGover={true}
                            />
                          )
                        )}
                    </tbody>
                  </TableWrapper>
                )}
              </div>
            </div>
          </div>}
          {step ==3 &&
          <div className="row">
            <div className="card w-100 mx-4">
              <div className="card-header b-t-success">
                <b>Service Provider</b>
              </div>
              {serviceObjects?.length ?  <div className="card-body">
                {watch("service_provider") && (
                  <TableWrapper className="table table-responsive">
                    <thead>
                      <tr>
                        <th className="text-nowrap">S No.</th>
                        <th className="text-nowrap"> Name</th>
                        <th className="text-nowrap"> Type </th>
                        <th className="text-nowrap">Phone</th>
                        <th className="text-nowrap">CNIC</th>
                        <th className="text-nowrap">Contact</th>
                        <th className="text-nowrap">Email</th>
                        <th className="text-nowrap">Address</th>
                        
                      </tr>
                    </thead>
                    {console.log('===serviceObjects', serviceObjects)}
                    <tbody>
                      
                      {
                      serviceObjects?.
                          length <=4 ?
                          serviceObjects?.map(
                          (ap, index) => (
                            <ServiceProvider
                              key={index}
                              num={index + 1}
                              startCalculation={startSerCalculation}
                              calculated={serviceObjectsCalculation}
                              editService={true}
                              ser_auditor={ap?.auditor}
                              ser_email={ap?.email}
                              ser_type = {ap?.type}
                              ser_address = {ap?.address}
                              ser_contact={ap?.contact}
                              ser_phone = {ap?.phone }
                              ser_cnic={ap?.cnic}
                            />
                          )
                        ) :serviceObjects?.length ? <> <td/>
                        <td/>
                        <td/>
                        <td><center className='text-danger text-center mt-2'>Service Provider can't be more than 4</center></td>
                        <td/>
                        <td/></> : ''}
                    </tbody>
                  </TableWrapper>
                )}
              </div>: 
              
              <div className="card-body">
                {watch("service_provider") && (
                  <TableWrapper className="table table-responsive">
                    <thead>
                      <tr>
                        <th className="text-nowrap">S No.</th>
                        <th className="text-nowrap"> Name</th>
                        <th className="text-nowrap"> Type </th>
                        <th className="text-nowrap">Phone</th>
                        <th className="text-nowrap">CNIC</th>
                        <th className="text-nowrap">Contact</th>
                        <th className="text-nowrap">Email</th>
                        <th className="text-nowrap">Address</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      
                      {[...Array(Math.abs(parseInt(watch("service_provider"))))]?.length > 0 &&
                        [...Array(Math.abs(parseInt(watch("service_provider"))))]?.
                          length <=4 ?
                        [...Array(parseInt(watch("service_provider")))]?.map(
                          (ap, index) => (
                            <ServiceProvider
                              key={index}
                              num={index + 1}
                              startCalculation={startSerCalculation}
                              calculated={serviceObjectsCalculation}
                              editService={true}
                              ser_auditor={serviceObject[index]?.auditor}
                              ser_email={serviceObject[index]?.email}
                              ser_type = {serviceObject[index]?.type}
                              ser_address = {serviceObject[index]?.address}
                              ser_contact={serviceObject[index]?.contact}
                              ser_phone = {serviceObject[index]?.phone }
                              ser_cnic={serviceObject[index]?.cnic}
                            />
                          )
                        ) : [...Array(Math.abs(parseInt(watch("service_provider"))))]?.length ? <> <td/>
                        <td/>
                        <td/>
                        <td><center className='text-danger text-center mt-2'>Service Provider can't be more than 4</center></td>
                        <td/>
                        <td/></> : ''}
                    </tbody>
                  </TableWrapper>
                )}
              </div>}
            </div>
          </div>}
          {step>3&&dataLoading&&<Spinner/>}
          {step > 3&&!dataLoading && <><div className="card b-t-success">
      
      <div  style={{ justifyContent: 'center', display: 'flex' }}>
      <AiOutlineInfoCircle className="mt-4 mb-4" style={{ color: '#fac020' }} size={50} />

    </div>
    <div className="mb-2" style={{ justifyContent: 'center', display: 'flex', fontSize: '20px', fontWeight :'bold' }}> Are You Sure ?</div>
      <div className="mb-5" style={{ justifyContent: 'center', display: 'flex' }}> If you want To Change Your Data Click On Previous Button, otherwise Submit Your Data.</div>
      {/* </div> */}
      <div className="row">
      <div className="col-sm-12 col-md-6 col-lg-4">
        <div className="card ">
          <div className="card-header b-t-primary">
            <h5>Company Details</h5>
          </div>
          <div className="card-body">
            <div className="form-group mb-3">
              <label>Company Name : {watch('company_name') || ''}</label>
            </div>
            <div className="form-group my-2">
              <label htmlFor="company_type">Company Type : {watch('company_type') || ''}</label>
           
            </div>
            <div className="form-group mb-3">
              <label>ISIN : {watch('isin') || ''}</label>
            </div>
            <div className="form-group mb-3">
              <label>Registered Name : {watch('registered_name') || ''}</label>
             
            </div>
            <div className="form-group mb-3">
              <label>Company Code : {watch('code') || ''}</label>

            </div>

            <div className="form-group mb-3">
              <label htmlFor="symbol">Symbol : {watch('symbol') || ''}</label>
            
            </div>


            <div className="form-group mb-3">
              <label htmlFor="ntn">NTN : {watch('ntn') || ''}</label>
        
            </div>

            <div className="form-group my-2">
              <label className="my-1" htmlFor="parent">
                Parent Company: {watch('parent')?.label || ''}
              </label>
            
            </div>

            <div className="form-group mb-3">
              <label htmlFor="incorporation_no">Incorporation No : {watch('incorporation_no') || ''} </label>
             
            </div>

         
            <div className="form-group my-2">
              <label className="my-1" htmlFor="sector_code">
                Sector : {watch('sector_code')?.label || ''}
              </label>
              
            </div>
            <div className="form-group mb-3">
              <label htmlFor="bussines_service">Bussines service: {watch('bussines_service') || ''}</label>
            </div>


            {logo && ( <div className="form-group">
              <label htmlFor="logo">Company Logo: <img width="200" src={logo} alt="logo_of_company" /> </label>
              </div>
)}
            
            <div className="form-group mb-3">
              <label htmlFor="website">Website: {watch('website') || ''}</label>
             
            </div>
         
            <div className="form-group mb-3">
              <label htmlFor="Registrar"> Registrar: {watch('company_registrar') || ''}</label>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="fiscal year">Fiscal Year: {watch('fiscal_year') || ''}</label>
             
            </div>
            <div className="form-group my-2">
              <label htmlFor="agm_date">
                AGM DATE: {watch('agm_date') || ''}
             </label>
            </div>

            <div className="form-group my-2">
              <label>
                Next AGM Date : {next_agm_date}
              </label>


            </div>

            <div className="form-group mb-3">
              <label htmlFor="active">Active: {active} </label>
            </div>
          </div>
        </div>
      </div>

      <div className="col-sm-12 col-md-6 col-xl-4">
        <div className="card ">
          <div className="card-header b-t-success">
            <h5>Contact Person</h5>
          </div>
          <div className="card-body">
            <div className="form-group mb-3">
              <label htmlFor="contact_person_name">Name: {watch('contact_person_name') || ''}</label>
          
            </div>
            <div className="form-group my-2">
              <label>Phone: {watch('contact_person_phone') || ''}</label>
              
            </div>

            <div className="form-group mb-3">
              <label htmlFor="exchange_no">Exchange No : {watch('exchange_no') || ''}</label>
            
            </div>

            <div className="form-group mb-3">
              <label htmlFor="contact_person_email">Email: {watch('contact_person_email') || ''}</label>
             
            </div>
          </div>
        </div>

        <div className="card ">
          <div className="card-header b-t-success">
            <h5>Head Office Address</h5>
          </div>
          <div className="card-body">
            <div className="form-group my-3">
              <label className="my-1" htmlFor="ho_address">
                Address: {watch('ho_address') || ''}
              </label>
            
            </div>
            <div className="form-group mb-3">
              <label htmlFor="ho_country">Country:  { selectedCountry?.label  ||country ||  ''}</label>
              
            </div>
            <div className="form-group mb-3">
              <label htmlFor="ho_province">Province:  {selectProvince?.label ||province ||  ''}</label>
             
            </div>
            <div className="form-group mb-3">
              <label htmlFor="ho_city">City: {selectCity?.label ||city ||  ''}</label>
            </div>


          </div>
        </div>
       
        <div className="card">
          <div className="card-header b-t-primary">
            <h5>Election Information</h5>
          </div>
          <div className="card-body">
            <div className="form-group my-2">
              <label>Number of Directors:  {watch('number_of_directors') || ''} </label>
             
            </div>
            <div className="form-group my-2">
              <label htmlFor="shareholder_directors">
                No of Shareholder Directors: {watch('shareholder_directors') || ''}
              </label>
             
            </div>
            <div className="form-group my-2">
              <label htmlFor="independent_directors">
                No of Independent Directors: {watch('independent_directors') || ''}
              </label>
             
            </div>
            <div className="form-group my-2">
              <label htmlFor="board_election_date">
                Board Election Date :  {watch('board_election_date') || ''}
              </label>
             
            </div>

            <div className="form-group my-2">
              <label>
                Next Board Election Date : {next_board_election_date || ''}
              </label>
             
            </div>
          </div>
        </div>
      </div>

      <div className="col-sm-12 col-md-6 col-xl-4">

        <div className="card ">
          <div className="card-header b-t-success">
            <h5>Shareholding Details</h5>
          </div>
          <div className="card-body">
            <div className="form-group my-2">
              <label className="my-1" htmlFor="outstanding_shares">
                Outstanding Shares:  {watch('outstanding_shares') || ''}
              </label>
             
            </div>

            <div className="form-group my-2">
              <label className="my-1" htmlFor="face_value">
                Face Value: {watch('face_value') || ''}
              </label>
            
            </div>

            <div className="form-group my-2">
              <label className="my-1" htmlFor="total_shares">
                Total Shares:  {watch('total_shares') || ''}
              </label>
          
            </div>
            <div className="form-group my-2">
              <label className="my-1" htmlFor="allot_size">
                Lot Size: {watch('allot_size') || ''}
              </label>
             
            </div>
            <div className="form-group my-2">
              <label className="my-1" htmlFor="treasury_shares">
                Treasury Shares: {watch('treasury_shares') || ''}
              </label>
             
            </div>
            <div className="form-group my-2">
              <label className="my-1" htmlFor="free_float">
                Free Float: {watch('free_float') || ''}
              </label>
             
            </div>
            <div className="form-group my-2">
              <label className="my-1" htmlFor="preference_shares">
                Preference Shares: {watch('preference_shares') || ''}
              </label>
             
            </div>
            <div className="form-group my-2">
              <label className="my-1" htmlFor="ordinary_shares">
                Ordinary Shares: {watch('ordinary_shares') || ''}
              </label>
             
            </div>
            <div className="form-group my-2">
              <label className="my-1" htmlFor="non_voting_shares">
                Non Voting Shares: {watch('non_voting_shares') || ''}
              </label>
            
            </div>
            <div className="form-group my-2">
              <label className="my-1" htmlFor="redeemable_shares">
                Redeemable Shares: {watch('redeemable_shares') || ''}
              </label>
            
            </div>
            <div className="form-group my-2">
              <label className="my-1" htmlFor="management_shares">
                Management Shares: {watch('management_shares') || ''}
              </label>
             
            </div>
            <div className="form-group my-2">
              <label className="my-1" htmlFor="authorized_capital">
                Authorized Capital: {watch('authorized_capital') || ''}
              </label>
           
            </div>
            <div className="form-group my-2">
              <label className="my-1" htmlFor="paid_up_capital">
                Paid Up Capital: {watch('paid_up_capital') || ''}
              </label>
           
            </div>

          </div>
        </div>
        <div className="card">
          <div className="card-header b-t-primary">
            <h5>Authorized Users</h5>
          </div>
          <div className="card-body">
            <div className="form-group my-2">
              <label>Authorized Persons: {watch('no_authorized_persons') || ''}</label>
              
            </div>
            <div className="form-group my-2">
              <label>Governance: {watch('no_governance') || ''}  </label>
              
            </div>
            <div className="form-group my-2">
              <label>Service Providers: {watch('service_provider') || ''}</label>
            
            </div>
          </div>
        </div>
      </div>
    </div>
   
    {authPersonObjects?.length ?  <div className="row">
        <div className="card w-100 mx-4">
          <div className="card-header b-t-success">
            <b>Authorized Persons</b>
          </div>

          <div className="card-body">
            {watch("no_authorized_persons") && (
              <TableWrapper className="table table-responsive">
                <thead>
                  <tr>
                  <th className="text-nowrap">S No.</th>
                          <th className="text-nowrap"> Name</th>
                          <th className="text-nowrap"> Email</th>
                          <th className="text-nowrap">
                             Contact
                          </th>
                          <th className="text-nowrap">Reason</th>
                          <th className="text-nowrap">Date</th>
                          <th className="text-nowrap">Active</th>
                    {/* <th className="text-nowrap">Authorized Person Role</th> */}
                  </tr>
                </thead>
                <tbody>


                  {authPersonObjects.map((ap, index) => (
                    <tr>
                      <td> <div style={{maxWidth: '140px', minWidth: "140px"}}>{index+1}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.name}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.email}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.contact}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.reason}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.date}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.active}</div></td>
                    </tr>
                   
                  ))}
                </tbody>
              </TableWrapper>
            )}
          </div> 
        </div>
      </div>: ''}


      {governanceObjects?.length ?
      <div className="row">
        <div className="card w-100 mx-4">
          <div className="card-header b-t-success">
            <b>Governance</b>
          </div>
           <div className="card-body">
            {watch("no_governance") && (
              <TableWrapper className="table table-responsive">
                <thead>
                  <tr>
                  {/* <th className="text-nowrap">S No.</th> */}
                  {/* <th className="text-nowrap">S No.</th> */}
                  <th className="text-nowrap">S No.</th>
                          <th className="text-nowrap"> Name</th>
                          <th className="text-nowrap">Father/Husband Name</th>
                          <th className="text-nowrap">Address</th>
                          <th className="text-nowrap">Nationality</th>
                          <th className="text-nowrap"> Email</th>
                          <th className="text-nowrap"> Contact</th>
                          <th className="text-nowrap"> Business Occupation</th>
                          <th className="text-nowrap"> CNIC/Passport</th>
                         
                          <th className="text-nowrap"> Role</th>
                          <th className="text-nowrap">Reason</th>
                          <th className="text-nowrap">Date</th>
                          <th className="text-nowrap">Active</th>
                          <th className="text-nowrap">Nature Directorship</th>
                  </tr>
                </thead>
                <tbody>
                  {governanceObjects?.map(
                    (ap, index) => (
                      <tr>
                     <td> <div style={{maxWidth: '140px', minWidth: "140px"}}>{index+1}</div></td>
                            <td> <div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.name}</div></td>
                            <td> <div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.father_husband_name}</div></td>
                            <td> <div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.address}</div></td>
                            <td> <div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.nationality}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.email}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.contact}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.business}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.cnic_passport}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.role}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.reason}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.date}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.active}</div></td>
                            <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.directorship}</div></td>
                    </tr>
                     
                    )
                  )}
                </tbody>
              </TableWrapper>
            )}
          </div> 

          
        </div>
      </div>: ''}



      {serviceObjects?.length ?
      <div className="row">
        <div className="card w-100 mx-4">
          <div className="card-header b-t-success">
            <b>Service Provider</b>
          </div>
           <div className="card-body">
            {watch("service_provider") && (
              <TableWrapper className="table table-responsive">
                <thead>
                  <tr>
                    <th className="text-nowrap">S No.</th>
                    <th className="text-nowrap"> Name</th>
                    <th className="text-nowrap"> Type </th>
                    <th className="text-nowrap">Phone</th>
                    <th className="text-nowrap">CNIC</th>
                    <th className="text-nowrap">Contact</th>
                    <th className="text-nowrap">Email</th>
                    <th className="text-nowrap">Address</th>

                  </tr>
                </thead>
                <tbody>
                  {serviceObjects?.map(
                    (ap, index) => (
                      <tr>
                      <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{index+1}</div></td>
                      <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.auditor}</div></td>
                      <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.type}</div></td>
                      <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.phone}</div></td>
                      <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.cnic}</div></td>
                      <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.contact}</div></td>
                      <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.email}</div></td>
                      <td><div style={{maxWidth: '140px', minWidth: "140px"}}>{ap?.address}</div></td>
                    </tr>
                    
                    )
                  )}
                </tbody>
              </TableWrapper>
            )}
          </div> 
           
        </div>
      </div>: ''}







    </div>
     </>
    }
          {console.log('authPersonObjects=====', authPersonObjects)}
          {console.log('goverwewrweresrewr=====', governanceObjects)}
          <div className="row">
            <div className="col-md-12">
            {step>0&&  <div style={{pointerEvents: pressBack ? 'none' : '', opacity : pressBack ? '0.4' : ''}}   className=" btn btn-secondary mr-3" onClick={()=>{
              if(!pressBack){
               setPressBack(true)
  setStartAuthcalculation(false)
  setAuthPersonObjects(authPersonObjects=>authPersonObjects)
  setStartGovernanceObjectsCalculation(false)
  setGovernanceObjects(governanceObjects=>governanceObjects)
  setServicesObjectsCalculations(false)
  setServicesObjects(serviceObjects=>serviceObjects)
  setTimeout(() => {
    setCount(count => count - 1)
if(Number(watch("service_provider"))> 0 && step>3){
  setStep(3)  
} else{
  if(Number(watch("no_governance"))>0 && step> 2){
    setStep(2)
  } else{
    if(Number(watch("no_authorized_persons"))>0 && step>1){
      setStep(1)
     } else{
      setStep(0)
     }
  }
}
setPressBack(false)    
  
  }, 1000);
              }
              }}>Previous</div>}
              {step<4?
              <div  style={{pointerEvents: (presNext||dataLoading) ? 'none' : '', opacity : (presNext||dataLoading) ? '0.4' : ''}}  className="btn btn-success" onClick={()=>{
                if(!presNext){
                  setPresNext(true)
                  if(!watch('company_name')?.length ){
                    setCompanyNameError(true)
                   
                  }
                  else{
                    setCompanyNameError(false)
                  }
                  if(!watch('company_type')?.length ){ 
                   setCompanyTypeError(true)
                  }else{
                    setCompanyTypeError(false)
                  }
                  if(!watch('code')?.length ){
                  setCompanyCodeError(true)
                  } else{
                    setCompanyCodeError(false)
                  }
                  if(!watch('symbol')?.length ){
                   setSymbolError(true)
                  } else{
                    setSymbolError(false)
                  }
                  if(!watch('sector_code')?.value?.length ){
                    setSectorValueError(true)
                  } else{
                    setSectorValueError(false)
                  }
                  if(!watch('allot_size')?.length ){
                  setAlotSizeError(true)
                  }  else{
                    setAlotSizeError(false)
                  }
                  if(Number(watch('no_governance'))<2 || !watch('no_governance')?.length){
                    setGovernanceError(true)
                  } else{
                    setGovernanceError(false)
                  }
                  if (watch('fiscal_year')) {
                    if (moment(watch('fiscal_year')).format('MMMM') == 'June' || moment(watch('fiscal_year')).format('MMMM') == 'December') {setFicalYearError(false) }
                    else {
                      setFicalYearError(true)
                    }
                  }
                          

                  if ((Number(watch('paid_up_capital')) > Number(watch('authorized_capital'))) || (watch('paid_up_capital') && watch('authorized_capital') == undefined)) {
                    setPaidUpCapitalError(true)
                    setPresNext(false)
                    return
                  }
                  else{setPaidUpCapitalError(false)}
                  if (watch('fiscal_year')) {
                    if (moment(watch('fiscal_year')).format('MMMM') == 'June' || moment(watch('fiscal_year')).format('MMMM') == 'December') { }
                    else {
                      setPresNext(false)
                      return
                    }
                  }
                  if(!watch('company_name')?.length|| !watch('company_type')?.length ||!watch('code')?.length ||!watch('symbol')?.length  || !watch('sector_code')?.value?.length  ||!watch('allot_size')?.length || !watch('no_governance')?.length || Number(watch('no_governance'))<2  ) {
                    setPresNext(false)
                    return;
                  };
                  if(watch('company_name')?.length&& watch('company_type')?.length&& watch('code')?.length && watch('symbol')?.length  && watch('sector_code')?.value?.length   &&watch('allot_size')?.length && watch('no_governance')?.length ){
              // const authorizedPerson = sessionStorage.getItem('authorized')
              setdumyLoading(true)
              if((step==1 )) setStartAuthcalculation(true);
             
                if(step==2 )setStartGovernanceObjectsCalculation(true)
                if(step==3)setServicesObjectsCalculations(true)
             
                setTimeout(() => {
                  setTimeout(() => {
                    if(authPersonObjects?.length >Number(watch("no_authorized_persons")) ){
                      for(let i=authPersonObjects?.length; i> Number(watch("no_authorized_persons")); i--){
                      authPersonObjects.shift();
                      }
                    }
                    if(governanceObjects?.length >Number(watch("no_governance")) ){
                      for(let i=governanceObjects?.length; i> Number(watch("no_governance")); i--){
                        governanceObjects.shift();
                      }
                    }
                    if(serviceObjects?.length >Number(watch("service_provider")) ){
                      for(let i=serviceObjects?.length; i> Number(watch("service_provider")); i--){
                        serviceObjects.shift();
                      }
                    }
                    
                    if(step==2){
                      let company_sectory, companyCeo, cfo_company_secretary;
                      console.log('governanceObjects', governanceObjects)
                      if (governanceObjects?.length) {
                        company_sectory = governanceObjects?.find(item => item?.role == 'Company Secretary')?.name
                        cfo_company_secretary = governanceObjects?.find(item => item?.role == 'CFO/Company Secretary')?.name
                        const checkCfoCompanySectory = governanceObjects?.filter(item => item?.role == 'CFO/Company Secretary');
                        const checkCFO = governanceObjects?.filter(item => item?.role == 'CFO');
                        companyCeo = governanceObjects?.find(item => item?.role == 'CEO')?.name
                        if (checkCfoCompanySectory?.length > 1 || checkCFO?.length > 1) {
                          toast.error('CFO/Company Secretary Must be one');
                          setStartGovernanceObjectsCalculation(false);
                          // setGovernanceObjects([])
                          // setServicesObjects([])
                          setdumyLoading(false)
                          setPresNext(false);
                          return;
                        }
                        if (!company_sectory) {
                          company_sectory = governanceObjects?.find(item => item?.role == 'CFO/Company Secretary')?.name;
                        }
                        if (!company_sectory || !companyCeo) {
                          toast.error('Kindly Enter CEO And Company Secretary Role in Governance');
                          setStartGovernanceObjectsCalculation(false);
                          setdumyLoading(false)
                          setPresNext(false);
                          return;
                        }
                      } 
                    }
                    if(step==3){
                      if (serviceObjects?.length) {
                        const auditor = serviceObjects?.filter(item => item?.type?.toLowerCase() == 'auditor')
                        const internalAuditor = serviceObjects?.filter(item => item?.type?.toLowerCase() == 'internal auditoruditor')
                        const legaladvisor = serviceObjects?.filter(item => item?.type?.toLowerCase() == 'legal advisor')
                        const shariah = serviceObjects?.filter(item => item?.type?.toLowerCase() == 'shariah advisor')
                        if (auditor?.length > 1 || internalAuditor?.length > 1 || legaladvisor?.length > 1 || shariah?.length > 1) {
                          toast.error('Service Provider type should be Unique')
                          setPresNext(false);
                          setdumyLoading(false)
                          setServicesObjectsCalculations(false)
                          return
                        }
                      }
                    }
                    setCount(count => count + 1)
                    // setTimeout(() => {
                   
                   if(Number(watch("no_authorized_persons"))>0 && step<1){
                    setStep(1)
                   }
                   else{
                    if(Number(watch("no_governance"))>0 && step< 2  ){
                      setStep(2)
                    } else{
                if(Number(watch("service_provider"))> 0 && step<3){
                  setStep(3)
                } else{
                  setStep(4)
                }
                    }
                   }
                   setdumyLoading(false)
                   setPresNext(false)
                    
                  }, 1800);


              //     setCount(count => count + 1)
              //     // setTimeout(() => {
                 
              //    if(Number(watch("no_authorized_persons"))>0 && step<1){
              //     setStep(1)
              //    }
              //    else{
              //     if(Number(watch("no_governance"))>0 && step< 2  ){
              //       setStep(2)
              //     } else{
              // if(Number(watch("service_provider"))> 0 && step<3){
              //   setStep(3)
              // } else{
              //   setStep(4)
              // }
              //     }
              //    }
              //    setPresNext(false)
                }, 1800);
              }
            }
              }}>
                Next
              </div> :
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
              </button>}
            </div>
          </div>
        </form>
      </Fragment>
    </div>
  );
}
const TableWrapper = styled.table`
padding-bottom: 100px;
overflow-x: scroll;
overflow-x: scroll;
::-webkit-scrollbar{
  height: 5px;
  width: 3px;
}

::-webkit-scrollbar-track{
  background: #F9F9FB;
}
::-webkit-scrollbar-thumb{
  background: #4E515680;
  border-radius: 5px;

}

`;