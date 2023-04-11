import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { AddSpecialResolutionSchema } from "store/validations/votingValidations";
import NumberFormat from "react-number-format";
import { getAllAgendaData } from "store/services/evoting.service";
import { getAllEventData } from "store/services/company.service"
import { getCompanies } from "store/services/company.service";
import { addSpecialResolutionData } from "store/services/evoting.service";
import { getAllAuthorization } from "store/services/evoting.service";
import { getShareHoldersByCompany } from "store/services/shareholder.service";
import { darkStyle } from "components/defaultStyles";
import {  getSpecialAgandabyCompanyCode } from "store/services/evoting.service";

// import { getAllEventData } from "store/services/company.service";

export default function SpecialVoteCastData() {
    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
        control,
    } = useForm({ resolver: yupResolver(AddSpecialResolutionSchema) });
const [companies_dropdown, setCompanies_dropdown] = useState([]);
const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const [selectedCompanyCode, setSelectedCompanyCode] = useState('')
    const [title, setTitle] = useState('')
    const [authorizationOptions, setAuthorizationOptions] = useState([])
    const [mettingid, setMeetingid] = useState('')
    const [allEvent, setAllEvent] = useState([])
    const [votecasted, setVoteCasted] = useState('')
    const [selectedshareHolder, setSelectedShareholder] = useState('');
    const [agendaOptions, setAgendaOptions] = useState([])
    const [selectedAgenda, setSelectedAgenda] = useState('')
    const [loading, setLoading] = useState(false)
    const [folioNumber, setFolioNumber] = useState('')
    const email = sessionStorage.getItem("email");
    const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
    const [selectedAuthorizationId, setSelectedAuthorizationId] = useState('')
    const [compnyDropDownOptions, setCompanyDropDownOptions] = useState([])
    const [selectedCompany, setSelectedCompanny] = useState('')
    const getAllAuthorizationData = async () => {
        try {
            const response = await getAllAuthorization(email);
            if (response.status === 200) {
                const parents = response.data.data;
                // console.log('=====fdfdfdfdsfds', parents)
                const options = response.data.data.map((item) => {
                    let label = `${item.auth_id} - ${item.authorized_name}`;
                    return { label: label, value: item.auth_id };
                });
                setAuthorizationOptions(options);
                // setCompanies_data_loading(false);
            }
        } catch (error) {
            // setCompanies_data_loading(false);
        }
    }
    // const getAllSpecialAgandaData = async () => {
    //     try {
    //         const response = await getAllAgendaData(
    //             email,

    //         );
    //         if (response.status === 200) {
    //             const options = response.data.data.map((item) => {
    //                 let label = `${item.item_id} - ${item.agenda_title}`;
    //                 return { label: label, value: item.item_id, companyCode: item?.company_code, title: item?.agenda_title, meetingID: item?.meeting_id };
    //             });
    //             setAgendaOptions(options)



    //         }
    //     } catch (error) {
    //     }
    // };
    const getAllEvent = async () => {
        try {
            const response = await getAllEventData(
                email,

            );
            if (response.status === 200) {

                // const options = response.data.data.map((item) => {
                //     let label = `${item.statutory_event_id} - ${item.title}`;
                //     return { label: label, value: item?.statutory_event_id };
                // });
                setAllEvent(response.data.data)

            }
        } catch (error) {
        }
    };
    const handleFilterData =  async(code)=>{
        const response = await getSpecialAgandabyCompanyCode(email, selectedCompany);
      //       const filterData =   response?.data?.data?.filter((item)=>item?.agenda_id?.split('-')[1]==selectedCompany);
         const optons = response?.data?.data.map((item) => {
          let label = `${item?.item_id} - ${item. agenda_title}`;
          return { label: label , value: item?.item_id,  };
         
      });
     
      setAgendaOptions(optons)
      }
      useEffect(()=>{
        if(selectedCompany){
          handleFilterData(selectedCompany)
        }
      }, [selectedCompany])
    const getShareholderByCompany = async (code) => {
        try {
            //   setShareholderLoading(true);
            const response = await getShareHoldersByCompany(email, code);
            if (response.status == 200) {


                const options = response.data.data?.map((item) => {
                    const physicalShare= Number(item?.physical_shares)? Number(item?.physical_shares) : 0
                        const electronicShare =Number(item?.electronic_shares) ? Number(item?.electronic_shares): 0
                    const physical_electroninc_shares = (physicalShare + electronicShare)?.toString();
                    const shareholder_id = item?.shareholder_id || item?.cnic_copy || item?.ntn;
                    let label = `${item?.folio_number} - ${item?.shareholder_name}`;
                    return { label: label, value: shareholder_id, folio_number: item?.folio_number, castedVote: physical_electroninc_shares };
                })
                // const findId = options?.find((item) => item?.value == specialResolution?.voter_id)
                setshareholder_dropDown(options)
                // setShareholderDefaultId(findId?.value)
                // setDefaultSharholderId(findId?.label);
                // setShareholderData(response.data.data)
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
        if (mettingid) {
            const findMeetingID = allEvent?.find((item) => item?.statutory_event_id == mettingid);
            // const getShareholderByCompany = async (code) => {
            getShareholderByCompany(findMeetingID?.company_code)
        }
    }, [mettingid])
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
                    setCompanyDropDownOptions(companies_dropdowns)
                    setCompanies_dropdown(companies_dropdowns);
                    setCompanies_data_loading(false);
                }
            } catch (error) {
                setCompanies_data_loading(false);
            }
        };
        getAllCompanies();
        // getAllSpecialAgandaData()
        getAllAuthorizationData()
        getAllEvent()
    }, []);















    const appliedStyles = {
        control: (base, state) => ({
            ...base,
            border: "1px solid red",
        }),
    };
    const handleAlertMessage = async (data) => {
        const date = new Date();
        // setVoteCastCalculation(true)
        const createdAt = moment(date)?.format('yyyy-mm-DD')
        if(!selectedAgenda){
            toast.error(`Agenda Id Required`);
            return
        }
        if(!selectedshareHolder){
            toast.error(`Voter Id Required`);
            return;
        }
        try {
            setLoading(true);
            // let response;
            const response = await addSpecialResolutionData(
                email,
                selectedAgenda,
                title,
                data?.cast_type,
                data?.cast_through,
                selectedshareHolder,
                folioNumber,
                selectedAuthorizationId,
                votecasted,
                votecasted,
                data?.vote,

                data?.vote_casted,
                "100",
                data?.votes_accepted,
                data?.votes_rejected,
                data?.remarks,
                createdAt
            );

            if (response.data.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload();
                    // getPaginatedRequirment("1")
                    // getAllCompanies();
                    toast.success(`${response.data.message}`);
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
    return (
        <Fragment>
            <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Special Vote Cast</h6>
        <Breadcrumb title="Special Vote Cast" parent="Special Voting" />
      </div>
      <div className="container-fluid ">
     <div className="col-md-4 mb-5" >
                  <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={compnyDropDownOptions}
                        isLoading={!compnyDropDownOptions?.length}
                        onChange={(selected) => {
                         if(selected?.value){
                          setSelectedCompanny(selected?.value)
                         } 
                         else{
                          setSelectedCompanny('')
                         }
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                         Select Company  For Getting  Agenda Id Data 
                        </small>
                      )}
                      
                    </div>
                    
                    </div>
                    {selectedCompany?   <form onSubmit={handleSubmit(handleAlertMessage)}>
                <div className="row b-t-primary" style={{ margin: '0px 8px', borderRadius: ' 10px' }}>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="agenda_id">Agenda ID</label>
                            <Controller
                                name="agenda_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={agendaOptions}
                                        isLoading={!agendaOptions?.length}
                                        id="agenda_id"
                                        placeholder={'Enter Agenda ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                setSelectedCompanyCode(selected?.companyCode);
                                                setSelectedAgenda(selected.value)
                                                setTitle(selected?.title)
                                                setMeetingid(selected?.meetingID)
                                            }
                                            else {
                                                setSelectedCompanyCode("");
                                                setSelectedAgenda(selected.value)
                                                setTitle("")
                                                setMeetingid(selected?.meetingID)
                                            }
                                        }}
                                        isClearable={true}
                                        styles={errors.agenda_id && appliedStyles}
                                    />
                                )}
                                control={control}
                            />
                            <small className="text-danger">
                                {errors.agenda_id?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="agenda_title">Agenda Title</label>

                            <input
                                name="agenda_title"
                                className={`form-control ${errors.agenda_title && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Agenda Title"
                                {...register("agenda_title")}
                                value={title}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.agenda_title?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3  ">
                            <label htmlFor="cast_type">Cast Type</label>
                            <select
                                name="cast_type"
                                className={`form-control ${errors.cast_type && "border border-danger"
                                    }`}
                                {...register("cast_type")}
                            >
                                <option value="">Select</option>
                                <option value="Physical ">Physical </option>
                                <option value="Electronic">Electronic</option>
                            </select>
                            <small className="text-danger">
                                {errors.cast_type?.message}
                            </small>
                        </div>

                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3  ">
                            <label htmlFor="cast_through">Cast Through</label>
                            <select
                                name="cast_through"
                                className={`form-control ${errors.cast_through && "border border-danger"
                                    }`}
                                {...register("cast_through")}
                            >
                                <option value="">Select</option>
                                <option value="Ballot Paper ">Ballot Paper </option>
                                <option value="Web App">Web App</option>
                                <option value="Mobile App"> Mobile App</option>
                                <option value="Post"> Post</option>
                            </select>
                            <small className="text-danger">
                                {errors.cast_through?.message}
                            </small>
                        </div>

                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="voter_id">Voter ID</label>

                            <Controller
                                name="voter_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={shareholder_dropDown}
                                        isLoading={!shareholder_dropDown?.length}
                                        id="voter_id"
                                        placeholder={'Enter Voter ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                setSelectedShareholder(selected.value)
                                                setFolioNumber(selected.folio_number)
                                                setVoteCasted(selected?.castedVote)
                                            }
                                            else {
                                                setSelectedShareholder('')
                                                setFolioNumber('')
                                                setVoteCasted('')
                                            }
                                        }}
                                        isClearable={true}
                                        styles={errors.agenda_id && appliedStyles}
                                    />
                                )}
                                control={control}
                            />
                            <small className="text-danger">
                                {errors.voter_id?.message}
                            </small>
                        </div>
                    </div>
                     <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="folio_No">Folio Number</label>

                            <input
                                name="folio_No"
                                className={`form-control ${errors.voter_id && "border border-danger"
                                    }`}
                                type="text"
                                value={folioNumber}
                                placeholder="Enter Folio Number"
                                readOnly
                                {...register("folio_No")}
                            />
                            <small className="text-danger">
                                {errors.folio_No?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="authorzation_id">Authorization ID</label>

                            <Controller
                                name="authorzation_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={authorizationOptions}
                                        isLoading={!authorizationOptions?.length}
                                        id="authorzation_id"
                                        placeholder={'Enter Authorzation ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                setSelectedAuthorizationId(selected.value)
                                            }
                                            else {
                                                setSelectedAuthorizationId('')
                                            }
                                        }}
                                        isClearable={true}
                                        styles={errors.authorzation_id && appliedStyles}
                                    />
                                )}
                                control={control}
                            />
                            <small className="text-danger">
                                {errors.voter_id?.message}
                            </small>
                        </div>
                    </div> 




                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="votable_share">Votable Shares    </label>


                           
                            <input
                                name="votable_share"
                                className={`form-control ${errors.votable_share && "border border-danger"
                                    }`}
                                type="number"
                                placeholder="Enter Number"
                                value={votecasted}
                                onChange={(e) => {
                                    setVoteCasted(e.target.value)
                                }}
                                {...register("votable_share")}
                            />
                            <small className="text-danger">
                                {errors.votable_share?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="castable_vote">Castable Votes    </label>
                            <input
                                name="castable_vote"
                                className={`form-control ${errors.castable_vote && "border border-danger"
                                    }`}
                                type="number"
                                placeholder="Enter Number"
                                value={votecasted}
                                {...register("castable_vote")}
                            />
                           

                            <small className="text-danger">
                                {errors.castable_vote?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3  ">
                            <label htmlFor="vote">Vote</label>
                            <select
                                name="vote"
                                className={`form-control ${errors.vote && "border border-danger"
                                    }`}
                                {...register("vote")}
                            >
                                <option value="">Select</option>
                                <option value="Approved">Approved </option>
                                <option value="Disapproved">Disapproved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <small className="text-danger">
                                {errors.vote?.message}
                            </small>
                        </div>

                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="vote_casted">Votes Casted    </label>


                            <Controller
                                name="vote_casted"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.vote_casted && "border border-danger"
                                            }`}
                                        id="vote_casted"
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.vote_casted?.message}
                            </small>
                        </div>
                    </div>
                  
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="votes_accepted">Votes Accepted    </label>


                            <Controller
                                name="votes_accepted"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.votes_accepted && "border border-danger"
                                            }`}
                                        id="votes_accepted"
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.votes_accepted?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="votes_rejected">Votes Rejected    </label>


                            <Controller
                                name="votes_rejected"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.votes_rejected && "border border-danger"
                                            }`}
                                        id="votes_rejected"
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.votes_rejected?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="remarks"> Remarks</label>

                            <input
                                name="remarks"
                                className={`form-control ${errors.remarks && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Remarks"
                                
                                {...register("remarks")}
                            />
                            <small className="text-danger">
                                {errors.remarks?.message}
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
            </form>: ''}








      </div>
            </Fragment>
    );
  }