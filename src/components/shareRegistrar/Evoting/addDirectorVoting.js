import React, { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { toast } from "react-toastify";
import { getCompanies } from 'store/services/company.service';
import { addDirectorSchema } from 'store/validations/votingValidations';
import { addBoardOfElection } from 'store/services/evoting.service';
import { getAllEventData } from 'store/services/company.service';
import moment from 'moment';
export const AddDirectorVoting = ({ setAddDirectorVoting, companyCode, companyLabel, getPaginatedRequirment }) => {
    const [loading, setLoading] = useState(false)
    const email = sessionStorage.getItem("email");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [companies_dropdown, setCompanies_dropdown] = useState([]);
    const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const [selectedMeeting, setSelectedMeetingid ] = useState('')
    const [meetingDropDown, setMeetingDropdown] = useState([])
    const [companyError, setCompannyError]= useState(false)
    const [meetingError, setMeetingError] = useState(false)
const [electionToError, setElectionToError]= useState(false);
const [electionFromError, setElectionFromError] = useState(false)
const[noOfDirectorError, setNoOfDirectorError] = useState(false)
const [noofCandidateErro, setNoCandidateError] = useState(false)
const [symbol, setSymbol] = useState('')
const [allMeetings, setAllMeetingns] = useState([])
const [lastDateError, setLastDateError] = useState(false)
    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
        control,
    } = useForm({ resolver: yupResolver(addDirectorSchema) });

    const getAllEvent = async () => {
        try {
          const response = await getAllEventData(
            email,
           
          );
          if (response.status === 200) {  
            const options = response.data.data.map((item) => {
                let label = `${item.statutory_event_id} - ${item.title}`;
                return { label: label, value: item?.statutory_event_id, company_code:item?.company_code };
            });
            setAllMeetingns(options)
          }
        } catch (error) {
        }
      };
    useEffect(() => {
        const getAllCompanies = async () => {
            setCompanies_data_loading(true);
            try {
                const response = await getCompanies(email);
                if (response.status === 200) {
                    const parents = response.data.data;
                    const companies_dropdowns = response.data.data.map((item) => {
                        let label = `${item.code} - ${item.company_name}`;
                        return { label: label, value: item.code, symbol: item?.symbol };
                    });
                    setCompanies_dropdown(companies_dropdowns);
                    setCompanies_data_loading(false);
                }
            } catch (error) {
                setCompanies_data_loading(false);
            }
        };
        getAllCompanies();
        getAllEvent();

    }, []);

useEffect(()=>{
    if(selectedCompany){
const filterMeeting = allMeetings?.filter((item)=>item?.company_code == selectedCompany)
setMeetingDropdown(filterMeeting)
    }
},[selectedCompany])

    const handleDirectorVoting = async (data) => {
       
        const date = new Date();
        const formatDate  = moment(date)?.format('YYYY-MM-DD')
        if(!selectedCompany){
            setCompannyError(true)
           
        } else{
            setCompannyError(false)
        }
        if(!selectedMeeting){
           setMeetingError(true)
           
        }
        else{
            setMeetingError(false)
        }
        if(!data?.election_from){
            setElectionFromError(true)
            
         }
         else{
            setElectionFromError(false)
         }
         if(!data?.election_to){
            setElectionToError(true)
            
         }
         else{
            setElectionToError(false)
         }
         if(!data?.no_director){
            setNoOfDirectorError(true)
            
         }
         else{
            setNoOfDirectorError(false)
         }
         
         if(!data?.last_date) setLastDateError(true)
         else setLastDateError(false)
        if(!selectedCompany || !selectedMeeting ||!data?.no_director||!data?.election_to||!data?.election_from || !data?.last_date) return;
        if ((Number(data?.no_director) > Number(data?.no_candidate)) ) {
            toast.error('Number of Candidate Should be greater then Number of Director')
            return
          }
        try {
            setLoading(true);
            const response = await addBoardOfElection(
                email,
                selectedCompany,
                symbol,
                data?.term,
                data?.effct_date,
                data?.last_date,
                data?.agm_date,
                data?.app_form_date,
                data?.app_to_date,
                data?.authorzation_from,
                data?.authorzation_to,
                data?.election_from,
                data?.election_to,
                data?.no_director,
                data?.no_candidate,
                data?.expire_date,
                formatDate,
                selectedMeeting,
                data?.pol_date,
                data?.postal_last_date,
                "Pending",
            );

            if (response.data.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload();
                    // getPaginatedRequirment("1")
                    // getAllCompanies();
                    toast.success(`${response.data.message}`);
                    setAddDirectorVoting(false);
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
            <form onSubmit={handleSubmit(handleDirectorVoting)}>
                <div className="row b-t-primary" style={{margin: '0px 8px', borderRadius:' 10px'}}>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
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
                                            if (selected?.value) {setSelectedCompany(selected?.value);
                                                setSelectedMeetingid('');
                                            setSymbol(selected?.symbol)}
                                            else {setSelectedCompany("")
                                            setSelectedMeetingid('');
                                            setSymbol('')
                                        }
                                        }}
                                        isClearable={true}
                                        styles={companyError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {companyError ? 'Enter Company': ''}
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
                                value={symbol}
                                readOnly
                                {...register("symbol")}
                            />
                            <small className="text-danger">
                                {errors.symbol?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="term">Term</label>

                            <input
                                name="term"
                                className={`form-control ${errors.term && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Term"
                                {...register("term")}
                            />
                            <small className="text-danger">
                                {errors.term?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="effct_date">Effect From</label>

                            <input
                                className={`form-control ${errors.effct_date && "border border-danger"
                                    }`}
                                name="effct_date"
                                type="date"
                                {...register("effct_date")}
                            />
                            <small className="text-danger">
                                {errors.effct_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="last_date">Last Date </label>

                            <input
                                className={`form-control ${lastDateError && "border border-danger"
                                    }`}
                                name="last_date"
                                type="date"
                                {...register("last_date")}
                            />
                            <small className="text-danger">
                                {lastDateError ? 'Enter Date' : ''}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="agm_date">AGM  Date </label>

                            <input
                                className={`form-control ${errors.agm_date && "border border-danger"
                                    }`}
                                name="agm_date"
                                type="date"
                                {...register("agm_date")}
                            />
                            <small className="text-danger">
                                {errors.agm_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="app_form_date">Application From </label>

                            <input
                                className={`form-control ${errors.app_form_date && "border border-danger"
                                    }`}
                                name="app_form_date"
                                type="date"
                                {...register("app_form_date")}
                            />
                            <small className="text-danger">
                                {errors.app_form_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="app_to_date">Application to  </label>

                            <input
                                className={`form-control ${errors.app_to_date && "border border-danger"
                                    }`}
                                name="app_to_date"
                                type="date"
                                {...register("app_to_date")}
                            />
                            <small className="text-danger">
                                {errors.app_to_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="authorzation_from">Authorization From  </label>

                            <input
                                className={`form-control ${errors.authorzation_from && "border border-danger"
                                    }`}
                                name="authorzation_from"
                                type="date"
                                {...register("authorzation_from")}
                            />
                            <small className="text-danger">
                                {errors.authorzation_from?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="authorzation_to">Authorization to  </label>

                            <input
                                className={`form-control ${errors.authorzation_to && "border border-danger"
                                    }`}
                                name="authorzation_to"
                                type="date"
                                {...register("authorzation_to")}
                            />
                            <small className="text-danger">
                                {errors.authorzation_to?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="election_from">Election From  </label>

                            <input
                                className={`form-control ${electionFromError && "border border-danger"
                                    }`}
                                name="election_from"
                                type="datetime-local"
                                {...register("election_from")}
                            />
                            <small className="text-danger">
                                {electionFromError? 'Enter Date': ''}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="election_to">Election To  </label>

                            <input
                                className={`form-control ${electionToError && "border border-danger"
                                    }`}
                                name="election_to"
                                type="datetime-local"
                                {...register("election_to")}
                            />
                            <small className="text-danger">
                                {electionToError? 'Enter Date':''}
                            </small>
                        </div>
                    </div>


                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="no_director">Number of Directors   </label>

                           
                  <Controller
                    name="no_director"
                    render={({ field }) => (
                      <NumberFormat
                        {...field}
                        className={`form-control ${noOfDirectorError && "border border-danger"
                          }`}
                        id="no_director"
                        allowNegative={false}
                        placeholder="Enter Number"
                      />
                    )}
                    control={control}
                  />

                  <small className="text-danger">
                    {noOfDirectorError? 'Enter Number': ''}
                  </small>
                        </div>
                    </div>


                    {/* <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="no_candidate">Number of Candidates   </label>

                           
                  <Controller
                    name="no_candidate"
                    render={({ field }) => (
                      <NumberFormat
                        {...field}
                        className={`form-control ${noofCandidateErro && "border border-danger"
                          }`}
                        id="no_candidate"
                        allowNegative={false}
                        placeholder="Enter Number "
                      />
                    )}
                    control={control}
                  />

                  <small className="text-danger">
                  {noofCandidateErro? 'Enter Number':''}
                  </small>
                        </div>
                    </div> */}


                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="meeting_id">Meeting ID</label>

                            <Controller
                                name="meeting_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={meetingDropDown}
                                        value={meetingDropDown.filter(
                                            (option) => option.value === selectedMeeting
                                          )}
                                        isLoading={!meetingDropDown?.length}
                                        id="meeting_id"
                                        placeholder={'Enter Meeting ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) setSelectedMeetingid(selected?.value);
                                            else setSelectedMeetingid("");
                                        }}
                                        isClearable={true}
                                        isDisabled={!selectedCompany}
                                        styles={meetingError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {meetingError? 'Enter Meeting Id' : ''}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="pol_date">Pol Date  </label>

                            <input
                                className={`form-control ${errors.pol_date && "border border-danger"
                                    }`}
                                name="pol_date"
                                type="date"
                                {...register("pol_date")}
                            />
                            <small className="text-danger">
                                {errors.pol_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="postal_last_date">Postal Ballot Last Date  </label>

                            <input
                                className={`form-control ${errors.postal_last_date && "border border-danger"
                                    }`}
                                name="postal_last_date"
                                type="date"
                                {...register("postal_last_date")}
                            />
                            <small className="text-danger">
                                {errors.postal_last_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="expire_date">Is Expire  </label>

                            <input
                                className={`form-control ${errors.expire_date && "border border-danger"
                                    }`}
                                name="expire_date"
                                type="date"
                                {...register("expire_date")}
                            />
                            <small className="text-danger">
                                {errors.expire_date?.message}
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
            </form>













        </div>)
}
