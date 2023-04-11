import React, { useState, useEffect } from 'react'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import { ToastContainer, toast } from "react-toastify";
import { getCompanies } from 'store/services/company.service';
import { EditAuthorizedSchema } from 'store/validations/votingValidations';
import { getShareHoldersByCompany } from 'store/services/shareholder.service';
import { getAllElections } from 'store/services/evoting.service';
export const ViewAuthorized = ({ setEditRequirment, getPaginatedRequirment }) => {
  const authorized = JSON.parse(sessionStorage.getItem("selectedAuthorized")) || "";
  const baseEmail = sessionStorage.getItem("email") || "";
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [defaultCompany, setDefaultCompany] = useState('');
  const [defaultCode, setDefaultCompanyCode] = useState('');
  const [sharehoerData, setShareholderData] = useState('')
  const [companyCode, setCompanyCode] = useState('')
  const [electionIDValue, setElectionIdValue] = useState(null)
  const [isError, setIsError] = useState(false)
  const [contact, setContact] = useState(authorized?.auth_mobile || '')
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
   
  } = useForm({
    defaultValues: EditAuthorizedSchema(authorized).cast(),
    resolver: yupResolver(EditAuthorizedSchema(authorized)),
  });
  const getAllElection = async () => {
    try {
      const response = await getAllElections(baseEmail);
      if (response.status === 200) {

        const findElection = response.data.data.find((item) => item?.election_id == authorized?.election_id)
        let label = `${findElection?.election_id} - ${findElection?.symbol}`;
        setElectionIdValue(label);
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
          const shareholder_id = item?.shareholder_id || item?.cnic_copy || item?.ntn;
          let label = `${shareholder_id} - ${item?.shareholder_name}`;
          return { label: label, value: shareholder_id };
        })
        const findId = options?.find((item) => item?.value == authorized?.investor_id)?.label
        setShareholderData(findId)
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
 
  const handleAuthorizedVoting = (data) => {
    console.log('===data', data)
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
                           

                            <small className="text-danger">
                                {errors?.company_code?.message}
                            </small>
                        </div>
                        <div className="form-group mt-3">
              <label htmlFor="election_id">Election ID</label>
              <input
                className={`form-control ${errors.authorized_date && "border border-danger"
                  }`}
                name="election_id"
                type="text"
                value={authorized?.election_id}
                readOnly
              />


              <small className="text-danger">
                {errors.election_id?.message}
              </small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="authorized_date">Authorized Date </label>

              <input
                className={`form-control ${errors.authorized_date && "border border-danger"
                  }`}
                name="authorized_date"
                type="date"
                {...register("authorized_date")}
                readOnly
              />
              <small className="text-danger">
                {errors.authorized_date?.message}
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
              <input
                className={`form-control ${errors.method && "border border-danger"
                  }`}
                name="method"
                type="text"
                {...register("method")}
                readOnly
              />

             
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
                readOnly
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
             
              <input
                type="text"
                name="cnic"
                id="cnic"
                placeholder="Enter CNIC"
                className="form-control"
                readOnly
                maxLength={16}
                {...register("cnic")}
              />
              <small className="text-danger">
                {errors.cnic?.message}
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
                readOnly
              />
              <small className="text-danger">
                {isError ? 'Enter Number in Correct Format' : ''}
              </small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="auth_email">Proxy/Authorization Email </label>

              <input
                className={`form-control ${errors.auth_email && "border border-danger"
                  }`}
                name="auth_email"
                placeholder='Enter Email'
                type="email"
                {...register("auth_email")}
                readOnly
              />
              <small className="text-danger">
                {errors.auth_email?.message}
              </small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="authorized_name">Proxy/Authorization Name</label>

              <input
                name="authorized_name"
                className={`form-control ${errors.authorized_name && "border border-danger"
                  }`}
                type="text"
                placeholder="Enter Authorized Name"
                {...register("authorized_name")}
                readOnly
              />
              <small className="text-danger">
                {errors.authorized_name?.message}
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


              <Controller
                name="no_shares"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${errors.no_shares && "border border-danger"
                      }`}
                    id="no_shares"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
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



            </form>













      {/* <form onSubmit={handleSubmit(handleAuthorizedVoting)}>
        <div className="row b-t-primary" style={{ margin: '0px 8px', borderRadius: ' 10px' }}>
          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="election_id">Election ID</label>
              <input
                className={`form-control ${errors.authorized_date && "border border-danger"
                  }`}
                name="election_id"
                type="text"
                value={authorized?.election_id}
                readOnly
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
                className={`form-control ${errors.authorized_date && "border border-danger"
                  }`}
                name="authorized_date"
                type="date"
                {...register("authorized_date")}
                readOnly
              />
              <small className="text-danger">
                {errors.authorized_date?.message}
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
              <label htmlFor="symbol">Auth CNIC</label>

              <input
                type="text"
                name="cnic"
                id="cnic"
                placeholder="Enter CNIC"
                className="form-control"
                readOnly
                maxLength={16}
                {...register("cnic")}
              />
              <small className="text-danger">
                {errors.cnic?.message}
              </small>
            </div>
          </div>

          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="authorized_name">Authorized Name</label>

              <input
                name="authorized_name"
                className={`form-control ${errors.authorized_name && "border border-danger"
                  }`}
                type="text"
                placeholder="Enter Authorized Name"
                {...register("authorized_name")}
                readOnly
              />
              <small className="text-danger">
                {errors.authorized_name?.message}
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
                readOnly
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
                readOnly
              />
              <small className="text-danger">
                {errors.auth_email?.message}
              </small>
            </div>
          </div>
          <div className='col-md-4'>
            <div className="form-group mt-3">
              <label htmlFor="no_shares">Number of Shares   </label>


              <Controller
                name="no_shares"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${errors.no_shares && "border border-danger"
                      }`}
                    id="no_shares"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
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
          <div className='col-md-4'>
            <div className="form-group mt-3  ">
              <label htmlFor="method">Method</label>
              <input
                className={`form-control ${errors.method && "border border-danger"
                  }`}
                name="method"
                type="text"
                {...register("method")}
                readOnly
              />

             
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
                readOnly
              />
              <small className="text-danger">
                {errors.attachments?.message}
              </small>
            </div>
          </div>

          <div className='col-md-4'>
            <div className="form-group mt-3  ">
              <label htmlFor="auth_cancel">Auth Cancelled</label>
              <input
                className={`form-control ${errors.auth_cancel && "border border-danger"
                  }`}
                name="auth_cancel"
                type="text"
                {...register("auth_cancel")}
                readOnly
              />

             
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
                readOnly
              />
              <small className="text-danger">
                {errors.cancel_date?.message}
              </small>
            </div>
          </div>
          <div className='col-md-4'>
            <div className="form-group mt-3  ">
              <label htmlFor="cancel_through">Canceled Through</label>

              <input
                className={`form-control ${errors.cancel_through && "border border-danger"
                  }`}
                name="cancel_through"
                type="text"
                {...register("cancel_through")}
                readOnly
              />
             
              <small className="text-danger">
                {errors.cancel_through?.message}
              </small>
            </div>

          </div>








        </div>



      
      </form> */}













    </div>)
}
