import React, { useState, useEffect } from 'react'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getCompanies } from 'store/services/company.service';
import { EditAuthorizedSchema } from 'store/validations/votingValidations';
import { getShareHoldersByCompany } from 'store/services/shareholder.service';
import { errorStyles } from 'components/defaultStyles';
import InputMask from "react-input-mask";
import { getAllElections } from 'store/services/evoting.service';
import moment from 'moment';
import { updateAuthorization } from 'store/services/evoting.service';
export const EditAuthorization = ({ setEditAtuthorizedVoting, getPaginatedAuthorizedListing }) => {
  const authorized = JSON.parse(sessionStorage.getItem("selectedAuthorized")) || "";
  const baseEmail = sessionStorage.getItem("email") || "";
  const [loading, setLoading] = useState(false)
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [defaultCompany, setDefaultCompany] = useState('');
  const [selectedCompany, setSelectedCompany] = useState("");
  const [defaultCode, setDefaultCompanyCode] = useState('');
  const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
  const [sharehoerData, setShareholderData] = useState('')
  const [selectedshareHolder, setSelectedShareholder] = useState('');
  const [electionIDValue, setElectionIdValue] = useState(null)
  const [isError, setIsError] = useState(false)
  const [contact, setContact] = useState(authorized?.auth_mobile || '')
  const [companyCode, setCompanyCode] = useState('')
  const [file, setFile] = useState(null);
  const [file64, setFile64] = useState(null);
  const [shareholderID, setShareHolderId] = useState(null);
  const [electionID, setElectionID] = useState(null)
  const [noOFShare, setNoOfShare] = useState(authorized?.number_of_shares||'')
  const [authNameError, setAuthNameError] = useState(false)
const [ authDateError, setAuthDateError] = useState(false)
const [cnicError, setCnicError] = useState(false)
const [emailError, setEmailError] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    watch,
  } = useForm({
    defaultValues: EditAuthorizedSchema(authorized).cast(),
    resolver: yupResolver(EditAuthorizedSchema(authorized)),
  });
  const getAllElection = async () => {
    try {
      const response = await getAllElections(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
       
        const findElection = response.data.data.find((item) => item.election_id == authorized?.election_id)
        let label = `${findElection?.election_id} - ${findElection?.symbol}`;
        setElectionIdValue(label);
        setElectionID(findElection?.election_id)
        setCompanyCode(findElection?.company_code)
       
      }
    } catch (error) {
    }
  }
  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try {
        const response = await getCompanies(baseEmail);
        if (response.status === 200) {
          const parents = response.data.data;
          const findCompany = parents?.find(item => item?.code == authorized?.company_code)
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
    getAllElection()
  }, []);

  const getShareholderByCompany = async (code) => {
    try {
      const response = await getShareHoldersByCompany(baseEmail, code);
      if (response.status == 200) {


        const options = response.data.data?.map((item) => {
          const shareholder_id = item?.shareholder_id || item?.cnic_copy ||item?.ntn||''
          const physicalShare= Number(item?.physical_shares)? Number(item?.physical_shares) : 0
          const electronicShare =Number(item?.electronic_shares) ? Number(item?.electronic_shares): 0
      const physical_electroninc_shares = (physicalShare + electronicShare)?.toString();
          let label = `${shareholder_id} - ${item?.shareholder_name}`;
          return { label: label, value: shareholder_id, NoofShare: physical_electroninc_shares };
        })
        const findId = options?.find((item) => item?.value == authorized?.investor_id)
        setShareHolderId(findId?.value)
        setShareholderData(findId?.label)
      }
    } catch (error) {
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }



  useEffect(() => {
    if (companyCode) {
      getShareholderByCompany(companyCode)
    }


  }, [companyCode])
  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };
  const handleAuthorizedVoting = async(data) => {
    const date = new Date();
    const createdAt  = moment(date)?.format('YYYY-MM-DD')
    if(!data?.authorized_name){
      setAuthNameError(true);
  }else{
      setAuthNameError(false)
  }
  if(!data?.authorized_date){
      setAuthDateError(true)
  }else{
      setAuthDateError(false)
  }
//   if(!selectedCompany){
//     setCompannyError(true)
   
// } else{
//     setCompannyError(false)
// }
if (!data?.cnic) {
  setCnicError(true)
} else {
  setCnicError(false)
}
if (!data?.auth_email) {
  setEmailError(true)
} else {
  setEmailError(false)
}
  if(!data?.authorized_date||!data?.authorized_name||!data?.auth_email||!data?.cnic) return;
    try {
      setLoading(true);
      // let response;
      const response = await updateAuthorization(
        baseEmail,
        authorized?.auth_id,
        authorized?.company_code,
        authorized?.election_id,
        "authorized_vote",
        data?.authorized_date,
        // shareholderID,
        authorized?.investor_id,
        data?.cnic,
        data?.authorized_name,
        contact,
        data?.auth_email,
       noOFShare,
        data?.no_votes,
        data?.method,
        file64 || authorized?.attachments ||'',
        data?.auth_cancel,
        data?.cancel_date,
        data?.cancel_through,
        createdAt,
        ""
      );

      if (response.data.status === 200) {
          setTimeout(() => {
              setLoading(false);
              window.location.reload();
              // getPaginatedRequirment("1")
              // getAllCompanies();
              toast.success(`${response.data.message}`);
              setEditAtuthorizedVoting(false);
          }, 2000);
      } else {
          setLoading(false);
          toast.error(`${response.data.message}`);
      }
  } catch (error) {
      setLoading(false);
      !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Authorized Not Updated");
  }
  }
  return (
    <div>

<form onSubmit={handleSubmit(handleAuthorizedVoting)}>
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-4">
                        <div className="card ">
                            <div className="card-header b-t-primary">
                                <h5>Authorizer</h5>
                            </div>
                            <div className="card-body">
                            <div className="form-group mt-3">
                            <label htmlFor="company_code">Company</label>
                            <input
                name="company_code"
                className={`form-control ${errors.company_code && "border border-danger"
                  }`}
                type="text"
                value={defaultCompany}
                readOnly
                placeholder="Enter Company Code"
                {...register("company_code")}
                
              />
                            {/* <Controller
                                name="company_code"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={companies_dropdown}
                                        isLoading={companies_data_loading === true}
                                        id="company_code"
                                        placeholder={'Enter Company'}
                                        onChange={(selected) => {
                                            if (selected?.value) {setSelectedCompany(selected?.value);
                                            }
                                            else {setSelectedCompany("")
                                           
                                        }
                                        }}
                                        isClearable={true}
                                        styles={errors?.company_code && appliedStyles}
                                    />
                                )}
                                control={control}
                            /> */}

                            <small className="text-danger">
                                {errors?.company_code?.message}
                            </small>
                        </div>
                        <div className="form-group mt-3">
              <label htmlFor="election_id">Election ID</label>
              <input
                name="election_id"
                className={`form-control ${errors.election_id && "border border-danger"
                  }`}
                type="text"
                value={authorized?.election_id}
                readOnly
                placeholder="Enter election_id"
                {...register("election_id")}
              />
           

              <small className="text-danger">
                {errors.election_id?.message}
              </small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="authorized_date">Authorized Date </label>

              <input
                className={`form-control ${authDateError && "border border-danger"
                  }`}
                name="authorized_date"
                type="date"
                {...register("authorized_date")}
              />
              <small className="text-danger">
                {authDateError? 'Enter Date' : ''}
              </small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="canidate_id">INVESTOR ID</label>
              <input
                className={`form-control ${errors.canidate_id && "border border-danger"
                  }`}
                name="canidate_id"
                type="text"
                readOnly
                value={authorized?.investor_id}
              />
             
            </div>
            <div className="form-group mt-3  ">
              <label htmlFor="method">Method</label>
              <select
                name="method"
                className={`form-control ${errors.method && "border border-danger"
                  }`}
                {...register("method")}
              >
                <option value="">Select</option>
                <option value="Written Request">Written Request</option>
                <option value="Email">Email</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Web App">Web App</option>
              </select>
              <small className="text-danger">
                {errors.method?.message}
              </small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="attachments"> Attachments </label>

              <input
                className={`form-control ${errors.attachments && "border border-danger"
                  }`}
                name="attachments"
                type="file"
                {...register("attachments")}
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                    let reader = new FileReader();
                    reader.readAsDataURL(e.target.files[0]);
                    reader.onload = function () {
                      setFile64(reader.result)
                    };
                    reader.onerror = function (error) {
                    };
                  }
                }}
              />
              <small className="text-danger">
                {errors.attachments?.message}
              </small>
            </div>        
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-6 col-xl-4">
                        <div className="card ">
                            <div className="card-header b-t-success">
                                <h5>Authorized To</h5>
                            </div>
                            <div className="card-body">
                            <div className="form-group mt-3">
              <label htmlFor="symbol">Proxy/Authorization Cnic</label>
              <Controller
                      name="cnic"
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          className={`form-control ${
                            cnicError && "border border-danger"
                          }`}
                          placeholder="Enter CNIC"
                          mask="99999-9999999-9"
                        ></InputMask>
                      )}
                      control={control}
                    />
            
              <small className="text-danger">
                {cnicError ? 'Enter Cnic' : ''}
              </small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="effct_date">Proxy/Authorization  Mobile</label>

              <input
                type="text"
                name="contact"
                id="contact"
                placeholder="Enter Contact"
                className="form-control"
                value={contact}
                maxLength={16}
                onChange={(e) => {
                  if (!e.target.value.length) setContact('')
                  if (e.target.value.match(/^\d+$/)) {
                    setContact(e.target.value)
                    setIsError(false)
                  }
                  else { setIsError(true) }
                }}
              />
              <small className="text-danger">
                {isError ? 'Enter Number in Correct Format' : ''}
              </small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="auth_email">Proxy/Authorization Email </label>

              <input
                className={`form-control ${emailError && "border border-danger"
                  }`}
                name="auth_email"
                placeholder='Enter Email'
                type="email"
                {...register("auth_email")}
              />
              <small className="text-danger">
                {emailError ? 'Enter Email': ''}
              </small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="authorized_name">Proxy/Authorization Name</label>

              <input
                name="authorized_name"
                className={`form-control ${authNameError && "border border-danger"
                  }`}
                type="text"
                placeholder="Enter Authorized Name"
                {...register("authorized_name")}
              />
              <small className="text-danger">
                {authNameError ? 'Enter Name' : ''}
              </small>
            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-xl-4">

                        <div className="card ">
                            <div className="card-header b-t-success">
                                <h5>Votes</h5>
                            </div>
                            <div className="card-body">
                            <div className="form-group mt-3">
              <label htmlFor="no_shares">Number of Shares   </label>
              <input
                className={`form-control ${errors.no_shares && "border border-danger"
                  }`}
                name="no_shares"
                placeholder='Enter Number'
                type="number"
                value={noOFShare}
                onChange={(e)=>setNoOfShare(e?.target?.value)}
                readOnly
              />

              
              <small className="text-danger">
                {errors.no_shares?.message}
              </small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="no_votes">Number of Votes   </label>


              <Controller
                name="no_votes"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${errors.no_votes && "border border-danger"
                      }`}
                    id="no_votes"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {errors.no_votes?.message}
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
















      {/* <form onSubmit={handleSubmit(handleAuthorizedVoting)}>
        <div className="row b-t-primary" style={{ margin: '0px 8px', borderRadius: ' 10px' }}>
          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="election_id">Election ID</label>
              <input
                name="election_id"
                className={`form-control ${errors.election_id && "border border-danger"
                  }`}
                type="text"
                value={authorized?.election_id}
                readOnly
                placeholder="Enter election_id"
                {...register("election_id")}
              />
           

              <small className="text-danger">
                {errors.election_id?.message}
              </small>
            </div>
          </div>

          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="authorized_date">Authorized Date </label>

              <input
                className={`form-control ${authDateError && "border border-danger"
                  }`}
                name="authorized_date"
                type="date"
                {...register("authorized_date")}
              />
              <small className="text-danger">
                {authDateError? 'Enter Date' : ''}
              </small>
            </div>
          </div>
          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="canidate_id">INVESTOR ID</label>
              <input
                className={`form-control ${errors.canidate_id && "border border-danger"
                  }`}
                name="canidate_id"
                type="text"
                readOnly
                value={authorized?.investor_id}
              />
             
            </div>





          
            <small className="text-danger">
              {errors.canidate_id?.message}
            </small>
          </div>

          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="symbol">Auth Cnic</label>
              <Controller
                      name="cnic"
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          className={`form-control ${
                            errors.cnic && "border border-danger"
                          }`}
                          placeholder="Enter CNIC"
                          mask="99999-9999999-9"
                        ></InputMask>
                      )}
                      control={control}
                    />
            
              <small className="text-danger">
                {errors.symbol?.message}
              </small>
            </div>
          </div>

          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="authorized_name">Authorized Name</label>

              <input
                name="authorized_name"
                className={`form-control ${authNameError && "border border-danger"
                  }`}
                type="text"
                placeholder="Enter Authorized Name"
                {...register("authorized_name")}
              />
              <small className="text-danger">
                {authNameError ? 'Enter Name' : ''}
              </small>
            </div>
          </div>

          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="effct_date">Auth Mobile</label>

              <input
                type="text"
                name="contact"
                id="contact"
                placeholder="Enter Contact"
                className="form-control"
                value={contact}
                maxLength={16}
                onChange={(e) => {
                  if (!e.target.value.length) setContact('')
                  if (e.target.value.match(/^\d+$/)) {
                    setContact(e.target.value)
                    setIsError(false)
                  }
                  else { setIsError(true) }
                }}
              />
              <small className="text-danger">
                {isError ? 'Enter Number in Correct Format' : ''}
              </small>
            </div>
          </div>
         

          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="auth_email">Auth Email </label>

              <input
                className={`form-control ${errors.auth_email && "border border-danger"
                  }`}
                name="auth_email"
                placeholder='Enter Email'
                type="email"
                {...register("auth_email")}
              />
              <small className="text-danger">
                {errors.auth_email?.message}
              </small>
            </div>
          </div>
          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="no_shares">Number of Shares   </label>
              <input
                className={`form-control ${errors.no_shares && "border border-danger"
                  }`}
                name="no_shares"
                placeholder='Enter Number'
                type="number"
                value={noOFShare}
                onChange={(e)=>setNoOfShare(e?.target?.value)}
              />

              
              <small className="text-danger">
                {errors.no_shares?.message}
              </small>
            </div>
            
          </div>
          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="no_votes">Number of Votes   </label>


              <Controller
                name="no_votes"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${errors.no_votes && "border border-danger"
                      }`}
                    id="no_votes"
                    allowNegative={false}
                    placeholder="Enter Number"
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {errors.no_votes?.message}
              </small>
            </div>
          </div>
          <div className='col-md-4'>
            <div className="form-group mt-3  ">
              <label htmlFor="method">Method</label>
              <select
                name="method"
                className={`form-control ${errors.method && "border border-danger"
                  }`}
                {...register("method")}
              >
                <option value="">Select</option>
                <option value="Written Request">Written Request</option>
                <option value="Email">Email</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Web App">Web App</option>
              </select>
              <small className="text-danger">
                {errors.method?.message}
              </small>
            </div>
            
          </div>


          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="attachments"> Attachments </label>

              <input
                className={`form-control ${errors.attachments && "border border-danger"
                  }`}
                name="attachments"
                type="file"
                {...register("attachments")}
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                    let reader = new FileReader();
                    reader.readAsDataURL(e.target.files[0]);
                    reader.onload = function () {
                      setFile64(reader.result)
                    };
                    reader.onerror = function (error) {
                    };
                  }
                }}
              />
              <small className="text-danger">
                {errors.attachments?.message}
              </small>
            </div>
          </div>

          <div className='col-md-4'>
            <div className="form-group mt-3  ">
              <label htmlFor="auth_cancel">Auth Cancelled</label>
              <select
                name="auth_cancel"
                className={`form-control ${errors.auth_cancel && "border border-danger"
                  }`}
                {...register("auth_cancel")}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <small className="text-danger">
                {errors.auth_cancel?.message}
              </small>
            </div>

          </div>


          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="cancel_date">Cancellation Date   </label>

              <input
                className={`form-control ${errors.cancel_date && "border border-danger"
                  }`}
                name="cancel_date"
                type="date"
                {...register("cancel_date")}
              />
              <small className="text-danger">
                {errors.cancel_date?.message}
              </small>
            </div>
          </div>
          <div className='col-md-4'>
            <div className="form-group mt-3  ">
              <label htmlFor="cancel_through">Canceled Through</label>
              <select
                name="cancel_through"
                className={`form-control ${errors.cancel_through && "border border-danger"
                  }`}
                {...register("cancel_through")}
              >
                <option value="">Select</option>
                <option value="Written Request">Written Request</option>
                <option value="Email">Email</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Web App">Web App</option>
              </select>
              <small className="text-danger">
                {errors.cancel_through?.message}
              </small>
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
      </form> */}













    </div>)
}
