import React, { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { getCompanies } from 'store/services/company.service';
import { errorStyles } from 'components/defaultStyles';
import { getShareHoldersByCompany } from 'store/services/shareholder.service';
import { getAllElections } from 'store/services/evoting.service';
import { ToastContainer, toast } from "react-toastify";

import { addElectionCandidates } from 'store/services/evoting.service';
import { CanidateVotingSchema } from 'store/validations/votingValidations';
import moment from 'moment';
export const AddCanidateVoting = ({ setcanidateVoting }) => {
    const [loading, setLoading] = useState(false)
    const email = sessionStorage.getItem("email");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [companies_dropdown, setCompanies_dropdown] = useState([]);
    const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
    const [sharehoerData, setShareholderData] = useState('')
    const [shareholderName, setShareholderName] = useState("");
    const [folioNumber, setFolioNumber] = useState('')
    const [selectedshareHolder, setSelectedShareholder] = useState('');
    const [ElectionIdDropdown, setElectionsDropDown] = useState([])
    const [allCompanies, setAllCompanies] = useState([])
    const [selectedElectionId, setSelectedElectionId] = useState('')
    const [selectedCompaniesbyId, SetSelectedCompanycode] = useState(null)
    const [selectedCompanyByID , setSelectedCompanyByID] = useState(null)
    const [symbol, setSymbol] = useState(null);
    const [term, setterm] = useState('')
    const [electionError, setElectionError] = useState(false);
    const [shareholderError, setShareholderError] = useState(false);
    // const [positionError, setPositionError] = useState(false)
    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
        control,
    } = useForm({ resolver: yupResolver(CanidateVotingSchema) });
   const getAllElection =async ()=>{
    try {
        const response = await getAllElections(email);
        if (response.status === 200) {
            const parents = response.data.data;
            const options = response.data.data.map((item) => {
                let label = `${item.election_id} - ${item.symbol}`;
                return { label: label, value: item.election_id, companyCode: item?.company_code, term:item?.term };
            });
            setElectionsDropDown(options);
        }
    } catch (error) {
    }
   }

    useEffect(() => {
        const getAllCompanies = async () => {
            setCompanies_data_loading(true);
            try {
                const response = await getCompanies(email);
                if (response.status === 200) {
                    const parents = response.data.data;
                    const companies_dropdowns = response.data.data.map((item) => {
                        let label = `${item.code} - ${item.company_name}`;
                        return { label: label, value: item.code };
                    });
                    setCompanies_dropdown(companies_dropdowns);
                    setAllCompanies(parents)
                    setCompanies_data_loading(false);
                }
            } catch (error) {
                setCompanies_data_loading(false);
            }
        };
        getAllCompanies();
        getAllElection();
    }, []);
    const getShareholderByCompany = async (companycode) => {
        try {
          const response = await getShareHoldersByCompany(email, companycode);
          if (response.status == 200) {
           
   
     const options = response.data.data?.map((item)=>{
        const shareholder_id =   item?.shareholder_id || item?.cnic_copy || item?.ntn;
        let label = `${shareholder_id} - ${item?.shareholder_name}`;
        return { label: label, value: shareholder_id };
     })
     setshareholder_dropDown(options)
    setShareholderData(response.data.data)
        }
     } catch (error) {
          if (error.response != undefined) {
            toast.error(error.response.data.message);
          } else {
            toast.error(error.message);
          }
        }
      }
useEffect(()=>{
if(selectedCompaniesbyId){getShareholderByCompany(selectedCompaniesbyId)
 const filterCompanies = allCompanies?.find((item)=>item?.code ==selectedCompaniesbyId);
 let label = `${filterCompanies?.code} - ${filterCompanies?.company_name}`;
               setSelectedCompanyByID(label)
               setSymbol(filterCompanies?.symbol)

} else { 
    setSelectedCompanyByID('')
    setSymbol('');
    setshareholder_dropDown([])
}
}, [selectedCompaniesbyId])


    useEffect(()=>{
        if(selectedCompany) getShareholderByCompany()
    }, [selectedCompany])

    useEffect(() => {
        if (selectedshareHolder) {
          const obj = sharehoerData.find(
            (investor) => selectedshareHolder=== investor?.shareholder_id || selectedshareHolder=== investor?.cnic || selectedshareHolder=== investor?.ntn
          );
          setFolioNumber(obj?.folio_number)
            setShareholderName(
                sharehoerData.find(
                (investor) => selectedshareHolder=== investor?.shareholder_id || selectedshareHolder=== investor?.cnic || selectedshareHolder=== investor?.ntn
              )?.investor_name)
         
        }
      }, [selectedshareHolder]);

    const handleAlertMessage = async (data) => {
        if(!selectedElectionId){
            setElectionError(true)
        }
        else{
setElectionError(false)
        }
        if(!selectedshareHolder){
            setShareholderError(true)
        }
        else{
            setShareholderError(false)
        }
        // if( !data?.position){
        //     setPositionError(true)
        // }else{
        //     setPositionError(false)
        // }
        const date = new Date();
        const createdAt  = moment(date)?.format('YYYY-MM-DD')
        if(!selectedElectionId ||!selectedshareHolder) return
        try {
            setLoading(true);
            const response = await addElectionCandidates(
                email,
                selectedElectionId,
                selectedCompaniesbyId,
                symbol,
                selectedshareHolder,
                folioNumber,
                shareholderName,
                term,
                data?.eligible,
                data?.revoked,
                data?.revoked_date,
                data?.comment,
                data?.no_votes,
                data?.position,
                data?.elected,
                createdAt
            );

            if (response.data.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload();
                    toast.success(`${response.data.message}`);
                    setcanidateVoting(false);
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
    return (
        <div>
            <form onSubmit={handleSubmit(handleAlertMessage)}>
                <div className="row b-t-primary" style={{margin: '0px 8px', borderRadius:' 10px'}}>
                  
                <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="election_id">Election ID</label>

                            <Controller
                                name="election_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={ElectionIdDropdown}
                                        isLoading={!ElectionIdDropdown?.length}
                                        id="election_id"
                                        placeholder={'Enter Election ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {setSelectedElectionId(selected?.value);
                                                SetSelectedCompanycode(selected?.companyCode);
                                                setSelectedShareholder('')
                                                setterm(selected?.term)
                                            }
                                            else {setSelectedElectionId("");
                                            SetSelectedCompanycode('');
                                            setSelectedShareholder('')
                                            setterm('')
                                        }
                                        }}
                                        isClearable={true}
                                        styles={electionError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {electionError? 'Enter Election Id' : ''}
                            </small>
                        </div>
                    </div>
                  
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="company_code">Company</label>
                            <input
                                name="company_code"
                                className={`form-control ${errors.symbol && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Company Code"
                                {...register("company_code")}
                                readOnly
                                value={selectedCompanyByID|| ''}
                            />
                          
                            <small className="text-danger">
                                {errors.company_code?.message}
                            </small>
                        </div>
                    </div>


                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="symbol">Symbol</label>

                            <input
                                name="symbol"
                                className={`form-control ${errors.symbol && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Symbol"
                                {...register("symbol")}
                                readOnly
                                value={symbol || ''}
                            />
                            <small className="text-danger">
                                {errors.symbol?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                    <div className="form-group mt-3">
                    <label htmlFor="canidate_id">Shareholder ID</label>
                    <Controller
                      name="canidate_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={!shareholder_dropDown?.length}
                          options={shareholder_dropDown}
                          id="canidate_id"
                          placeholder="Select Investor"
                          styles={shareholderError&& errorStyles}
                          value={shareholder_dropDown?.filter(
                            (option) => option.value === selectedshareHolder
                          )}

                          onChange={(selected)=>{
                            if(selected?.value) setSelectedShareholder(selected?.value)
                            else setSelectedShareholder('')
                          }}
                        />
                      )}
                      control={control}
                    />
                    
                  </div>





                            <small className="text-danger">
                                {shareholderError ? 'Enter Candidate Id' : '' }
                            </small>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="folio_no"> Folio Number</label>

                            <input
                                name="folio_no"
                                className={`form-control ${errors.folio_no && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Folio No"
                                value={folioNumber}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.folio_no?.message}
                            </small>
                        </div>
                    </div>









                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="canidate_name">Candidate Name</label>
                            <input
                      name="shareholder_name"
                      className="form-control"
                      type="text"
                      value={shareholderName}
                      placeholder="Select Investor"
                      readOnly
                    />
                           
                            <small className="text-danger">
                                {errors.canidate_name?.message}
                            </small>
                        </div>
                    </div>


                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="term"> Term</label>

                            <input
                                name="term"
                                className={`form-control ${errors.term && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter term"
                                value={term}
                                readOnly
                                {...register("term")}
                            />
                            <small className="text-danger">
                                {errors.term?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                    <div className="form-group mt-3  ">
                  <label htmlFor="eligible">Eligible</label>
                  <select
                    name="eligible"
                    className={`form-control ${errors.eligible && "border border-danger"
                      }`}
                    {...register("eligible")}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <small className="text-danger">
                    {errors.eligible?.message}
                  </small>
                </div>

                    </div>



                    <div className='col-md-4'>
                    <div className="form-group mt-3  ">
                  <label htmlFor="revoked">Revoked</label>
                  <select
                    name="revoked"
                    className={`form-control ${errors.revoked && "border border-danger"
                      }`}
                    {...register("revoked")}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <small className="text-danger">
                    {errors.revoked?.message}
                  </small>
                </div>

                    </div>


                  









                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="revoked_date">Revoked Date</label>

                            <input
                                className={`form-control ${errors.revoked_date && "border border-danger"
                                    }`}
                                name="revoked_date"
                                type="date"
                                {...register("revoked_date")}
                            />
                            <small className="text-danger">
                                {errors.revoked_date?.message}
                            </small>
                        </div>
                    </div>



                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="comment"> Revoked Comment</label>

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


                    {/* <div className='col-md-4'>
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
                        <div className="form-group mt-3">
                            <label htmlFor="position">Position   </label>

                           
                  <Controller
                    name="position"
                    render={({ field }) => (
                      <NumberFormat
                        {...field}
                        className={`form-control ${positionError && "border border-danger"
                          }`}
                        id="position"
                        allowNegative={false}
                        placeholder="Enter Number"
                      />
                    )}
                    control={control}
                  />

                  <small className="text-danger">
                    {positionError ? 'Enter Number' : ''}
                  </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                    <div className="form-group mt-3  ">
                  <label htmlFor="elected">Elected</label>
                  <select
                    name="elected"
                    className={`form-control ${errors.elected && "border border-danger"
                      }`}
                    {...register("elected")}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <small className="text-danger">
                    {errors.elected?.message}
                  </small>
                </div>

                    </div> */}




                    

            
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













        </div>)
}
