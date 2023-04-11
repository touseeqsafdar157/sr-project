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
import { EditSpecialResolutionSchema } from 'store/validations/votingValidations';
import { getAllAgendaData } from 'store/services/evoting.service';
import moment from 'moment';
import { getAllAuthorization } from 'store/services/evoting.service';
import { getAllEventData } from 'store/services/company.service';
import { updateSpecialResolution } from 'store/services/evoting.service';
import styled from 'styled-components';
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";

export const EditSpecialVotingData = ({ setEditSpecialResolution, getPaginatedRequirment }) => {
    const specialResolution = JSON.parse(sessionStorage.getItem("selectedResolution")) || "";
    const baseEmail = sessionStorage.getItem("email") || "";
    const [loading, setLoading] = useState(false)
    const [ mettingid, setMeetingid] = useState('')
  const [defaultAuthid, setDefaultAuthId] = useState('')
  const [defaultAuthLabel, setDefaultAuthLabel] = useState('')
    const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
    const [sharehoerData, setShareholderData] = useState('')
    const [selectedshareHolder, setSelectedShareholder] = useState(specialResolution?.voter_id||'');
    const [agendaOptions, setAgendaOptions] = useState([])
    const [selectedAgenda, setSelectedAgenda] = useState(specialResolution?.agenda_id||'')
    const [selectedCompanyCode, setSelectedCompanyCode] = useState('')
    const [defaultValue, setDefaultValue] = useState(null);
    const [defaultId, setDefaultId] = useState(null);
    const [folioNumber, setFolioNumber] = useState(specialResolution?.folio_number || '')
    const [title, setTitle] = useState(specialResolution?.agenda_title || '');
    const [defaultShareholderId, setDefaultSharholderId] = useState(null)
    const [shareHolderDefaultID, setShareholderDefaultId] = useState(null);
    const [allEvent, setAllEvent] = useState([])
    const [authorizationOptions, setAuthorizationOptions] = useState([])
    const [selectedAuthorizationId, setSelectedAuthorizationId] = useState(specialResolution?.authorization_id||'')
    const [defaultMettingID, setDefaultMeetingId] = useState('')
    const [votecasted, setVoteCasted] = useState(specialResolution?.votable_shares|| '')
    const [AgendaIdError, setAgendaIdError] =  useState(false)
    const [voterIdError, setVoterIdError] =  useState(false)
    const [authError, setAuthError] = useState(false)
    const [voteError, setVoteError] =  useState(false)
    const [defaultVoterLabel] =  useState({label: specialResolution?.voter_id, value: specialResolution?.voter_id})
    const [defaultAgendaLabel] = useState({label: specialResolution?.agenda_id, value: specialResolution?.agenda_id})
    const [viewFlag, setViewFlag] = useState(false);
    const [companies_dropdown, setCompanies_dropdown] = useState([]);
    const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const [defaultCompany, setDefaultCompany] = useState('');

    const [defaultAuthLabelid] = useState({label: specialResolution?.authorization_id, value: specialResolution?.authorization_id})
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
        getValues,
        watch,
    } = useForm({
        defaultValues: EditSpecialResolutionSchema(specialResolution).cast(),
        resolver: yupResolver(EditSpecialResolutionSchema(specialResolution)),
    });
    const getAllAuthorizationData = async () => {
        try {
            const response = await getAllAuthorization(baseEmail);
            if (response.status === 200) {
                const parents = response.data.data;
                const options = response.data.data.map((item) => {
                    let label = `${item.auth_id} - ${item.authorized_name}`;
                    return { label: label, value: item.auth_id };
                });
                setAuthorizationOptions(options);
                const findID= options.find((item)=>item?.value==specialResolution?.authorization_id)
                setDefaultAuthId(findID?.value);
                setDefaultAuthLabel(findID?.label)
                
            }
        } catch (error) {
        }
    }
    const getAllEvent = async () => {
        try {
          const response = await getAllEventData(
            baseEmail,
           
          );
          if (response.status === 200) {

            setAllEvent(response.data.data)
          }
        } catch (error) {
        }
      };
    const getShareholderByCompany = async (code) => {
        try {
            const response = await getShareHoldersByCompany(baseEmail, code);
            if (response.status == 200) {
                    const options = response.data.data?.map((item) => {
                        const physicalShare= Number(item?.physical_shares)? Number(item?.physical_shares) : 0
                        const electronicShare =Number(item?.electronic_shares) ? Number(item?.electronic_shares): 0
                    const physical_electroninc_shares = (physicalShare + electronicShare)?.toString();
                    const shareholder_id = item?.shareholder_id || item?.cnic_copy || item?.ntn;
                    let label = `${ item?.folio_number} - ${item?.shareholder_name}`;
                    return { label: label, value: shareholder_id, folio_number: item?.folio_number, castedVote: physical_electroninc_shares };
                })
                const findId = options?.find((item) => item?.value == specialResolution?.voter_id)
                setshareholder_dropDown(options)
               
                if(!mettingid){
                    setDefaultSharholderId(findId?.label);
                    setShareholderDefaultId(findId?.value)
                }
                
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

    const getAllSpecialAgandaData = async () => {
        try {
            const response = await getAllAgendaData(
                baseEmail,

            );
            if (response.status === 200) {
                const options = response.data.data.map((item) => {
                    let label = `${item.item_id} - ${item.agenda_title}`;
                    return { label: label, value: item.item_id, companyCode: item?.company_code, title: item.agenda_title, meetingId: item?.meeting_id };
                });
                const defaultvalue = options.find((item) => item?.value == specialResolution?.agenda_id)
                setDefaultMeetingId(defaultvalue?.meetingId)
               const responseEvent = await getAllEventData(
                baseEmail,
               
              );
                const findMeetingID =  responseEvent.data.data.find((item)=>item?.statutory_event_id == defaultvalue?.meetingId);
                setDefaultValue(defaultvalue?.label)
                setDefaultId(defaultvalue?.item_id)
                setAgendaOptions(options)
             
                getShareholderByCompany(findMeetingID?.company_code)



            }
        } catch (error) {
        }
    };

    useEffect(() => {
        const getAllCompanies = async () => {
            setCompanies_data_loading(true);
            try {
              const response = await getCompanies(baseEmail);
              if (response.status === 200) {
                const parents = response.data.data;
                const findCompany = parents?.find(item => item?.code == specialResolution?.company_code)
                let findLabel = `${findCompany?.code} - ${findCompany?.company_name}`;
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
        getAllEvent();
        getAllAuthorizationData();
        getAllSpecialAgandaData();
    }, []);
    

    const appliedStyles = {
        control: (base, state) => ({
            ...base,
            border: "1px solid red",
        }),
    };
    const handleEditSpecialResolution = async (data) => {
        const date = new Date();
        const createAt = moment(date)?.format('YYYY-MM-DD')
        if(!selectedAgenda){
            setAgendaIdError(true)
             
         }else{
             setAgendaIdError(false)
         }
         if(!selectedshareHolder){
            setVoterIdError(true)
             
         }else{
             setVoterIdError(false)
         }
         if(!selectedAuthorizationId)setAuthError(true)
         else setAuthError(false)
        
         if(!selectedAuthorizationId || !selectedshareHolder || !selectedAgenda ) return;
        try {
            setLoading(true);
            const response = await updateSpecialResolution(
                baseEmail,
                specialResolution?.voting_id,
                selectedAgenda || defaultId || '',
                title,
                data?.cast_type,
                data?.cast_through,
                selectedshareHolder || shareHolderDefaultID || '',
                folioNumber,
                selectedAuthorizationId|| defaultAuthid ||'',
                votecasted,
                votecasted,
                data?.vote,
                data?.vote_casted,
                '100',
                data?.votes_accepted,
                data?.votes_rejected,
                data?.remarks,
                createAt
            );

            if (response.data.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload();
                    // getPaginatedRequirment("1")
                    // getAllCompanies();
                    toast.success(`${response.data.message}`);
                    setEditSpecialResolution(false);
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
    useEffect(()=>{
       
        if(mettingid)
        {
          const findMeetingID =  allEvent?.find((item)=>item?.statutory_event_id == mettingid);
        // const getShareholderByCompany = async (code) => {
            getShareholderByCompany(findMeetingID?.company_code)
        }
    }, [mettingid])
    return (
        <div>
            <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xs">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Agenda Details
        </ModalHeader>
        <ModalBody>
          <p
            style={{
              color: "rgb(152, 161, 181)",
              textAlign: "center",
            }}
          >
            Agenda Title
          </p>
          <div
            style={{
              border: "1px solid rgb(152, 161, 181)",
              margin: "auto",
              margin: "3px",
            }}
          >
            <p
              style={{
                color: "#000000",
                textAlign: "center",
              }}
            >
              {"Special Resolution"}
            </p>
          </div>
          <p
            style={{
              color: "rgb(152, 161, 181)",
              textAlign: "center",
            }}
          >
            Agendaa Item
          </p>
          <div
            style={{
              border: "1px solid rgb(152, 161, 181)",
              margin: "auto",
              margin: "3px",
            }}
          >
            <p
              style={{
                color: "#000000",
                textAlign: "center",
              }}
            >
              {"testing"}
            </p>
          </div>
        </ModalBody>
      </Modal>
            <form onSubmit={handleSubmit(handleEditSpecialResolution)}>
                <div className="row b-t-primary" style={{ margin: '0px 8px', borderRadius: ' 10px' }}>
                {/* <div className='col-md-4'>
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
                        </div> */}
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="agenda_id">Agenda ID</label>
                            <input
                                name="agenda_id"
                                className={`form-control ${errors.agenda_id && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Agenda Title"
                                value={defaultAgendaLabel?.label}
                                readOnly
                                {...register("agenda_id")}
                            />
                            {/* <Controller
                                name="agenda_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={agendaOptions}
                                        isLoading={!agendaOptions?.length}
                                        id="agenda_id"
                                        defaultValue={defaultAgendaLabel}
                                        placeholder={'Enter Agenda ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                setSelectedCompanyCode(selected?.companyCode);
                                                setSelectedAgenda(selected.value)
                                                setTitle(selected?.title)
                                                setMeetingid(selected?.meetingId)
                                                // setshareholder_dropDown([])
                                            }
                                            else {
                                                setSelectedCompanyCode("");
                                                setSelectedAgenda(selected.value)
                                                setTitle('');
                                                setshareholder_dropDown([])
                                                setMeetingid('')
                                            }
                                        }}
                                        isClearable={true}
                                        styles={AgendaIdError && appliedStyles}
                                    />
                                )}
                                control={control}
                            /> */}
                            <small className="text-danger">
                                {AgendaIdError ? 'Enter Agenda Id' : ''}
                            </small>
                        </div>
                    </div>

                    {/* <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="agenda_title">Agenda Title</label>

                            <input
                                name="agenda_title"
                                className={`form-control ${errors.agenda_title && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Agenda Title"
                                value={title}
                                readOnly
                                {...register("agenda_title")}
                            />
                            <small className="text-danger">
                                {errors.agenda_title?.message}
                            </small>
                        </div>
                    </div> */}
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
                                <option value="Post"> Post</option>
                                {/* <option value="Mobile App"> Mobile App</option> */}
                            </select>
                            <small className="text-danger">
                                {errors.cast_through?.message}
                            </small>
                        </div>

                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="voter_id">Folio Number</label>
                            <input
                                name="voter_id"
                                className={`form-control ${errors.voter_id && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Folio Number"
                                value={folioNumber || specialResolution?.voter_id}
                                readOnly
                                {...register("voter_id")}
                            />
                           
                            <small className="text-danger">
                                {voterIdError ? 'Enter Folio Number' : ''}
                            </small>
                        </div>
                    </div>
                    {/* <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="folio_No">Folio Number</label>

                            <input
                                name="folio_No"
                                className={`form-control ${errors.voter_id && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Folio Number"
                                value={folioNumber}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.folio_No?.message}
                            </small>
                        </div>
                    </div> */}
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="authorzation_id">Proxy/Authorization ID</label>

                            <Controller
                                name="authorzation_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={authorizationOptions}
                                        isLoading={!authorizationOptions?.length}
                                        id="authorzation_id"
                                        placeholder={specialResolution?.authorization_id||'Enter Authorzation ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                setSelectedAuthorizationId(selected.value)
                                            }
                                            else {
                                                setSelectedAuthorizationId('')
                                            }
                                        }}
                                        isClearable={true}
                                        styles={authError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />
                            <small className="text-danger">
                                {authError ? 'Enter Authorization Id' : ''}
                            </small>
                        </div>
                    </div>






                   
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="votable_shares">Votable Shares    </label>


                            <Controller
                                name="votable_shares"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.votable_share && "border border-danger"
                                            }`}
                                        id="votable_shares"
                                        value={votecasted}
                                        onChange={(e)=>{
                                            setVoteCasted(e?.target?.value)
                                        }}
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.votable_shares?.message}
                            </small>
                        </div>
                    </div>
                    {/* <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="castable_vote">Castable Votes    </label>


                            <Controller
                                name="castable_vote"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.castable_vote && "border border-danger"
                                            }`}
                                        id="castable_vote"
                                        value={votecasted}
                                        onChange={(e)=>{
                                            setVoteCasted(e?.target?.value)
                                        }}
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                    />
                                )}
                                control={control}
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
                                className={`form-control ${voteError && "border border-danger"
                                    }`}
                                {...register("vote")}
                            >
                                <option value="">Select</option>
                                <option value="Approved">Approved </option>
                                <option value="Disapproved">Disapproved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Post"> Post</option>
                            </select>
                            <small className="text-danger">
                                {voteError ? 'Select Vote' :''}
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
                                        // value={votecasted}
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
                                // value={folioNumber}
                                // readOnly
                                {...register("remarks")}
                            />
                            <small className="text-danger">
                                {errors.remarks?.message}
                            </small>
                        </div>
                    </div> */}


<div className="row mt-4">
            <div className="card w-100 mx-4">
              <div
                className="card-header b-t-success"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div>
                  <b>Agendas</b>
                </div>
              </div>
              <div></div>
              <div className="card-body">
              <div class="table-responsive">
                {[{ agenda_title: "Special Resolution " }]?.length > 0 ? (
               <TableWrapper className="table">
                    <thead>
                      <tr>
                        <th className="text-nowrap" >
                          S No.
                        </th>
                        <th className="text-nowrap" >
                          Title
                        </th>
                        <th className="text-nowrap" >
                          Vote
                        </th>
                        <th className="text-nowrap" >
                          Votes Rejected
                        </th>
                       
                        <th className="text-nowrap" >
                          Voting Percentage
                        </th>
                        <th className="text-nowrap" >
                          Remarks
                        </th>
                        <th
                          className="text-nowrap text-right"
                        //   style={{ width: "300px" }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[{ agenda_title: "Special Resolution " }]?.length > 0 &&
                        [{ agenda_title: "Special Resolution " }]?.map(
                          (item, key) => (
                            <tr key={key}>
                              <td scope="col">
                                <b>{key + 1}</b>
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "block",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    width: "200px",
                                  }}
                                >
                                  {item?.agenda_title}
                                </div>
                              </td>
                              <td >
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <div>
                                    <label
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "5px",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          marginRight: "5px",
                                        }}
                                        name={`group${key}`}
                                        value={`${key}-Approved`}
                                      />{" "}
                                      Favour
                                    </label>
                                  </div>

                                  <div>
                                    <label
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "5px",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        name={`group${key}`}
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          marginRight: "5px",
                                        }}
                                        value={`${key}-Disapproved`}
                                      />{" "}
                                      Against
                                    </label>
                                  </div>
                                </div>
                              </td>
                              <td>
                                                <input
                                                    type="number"
                                                    name="votes_rejected"
                                                    id="votes_rejected"
                                                    placeholder="Votes Rejected"
                                                    className="form-control"
                                                    value={'0'}
                                                    style={{ maxWidth: '170px', minWidth: "170px" }}
                                                    onChange={(e)=>{
                                                    console.log('e.target.value', e.target.value) 
                                                   }}
                                                />
                                            </td>
                              
                              <td>
                                    <input
                                        type="text"
                                        name="voting_percentage"
                                        id="voting_percentage"
                                        style={{ maxWidth: '170px', minWidth: "170px" }}
                                        placeholder="Voting Percentage"
                                        className="form-control"
                                        value={item?.voting_percentage}
                                        readOnly
                                        
                                    />
                            
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="remarks"
                                                    id="remarks"
                                                    placeholder="Enter Remarks"
                                                    style={{ maxWidth: '170px', minWidth: "170px" }}
                                                    className="form-control"
                                                    value={item?.remarks}
                                                    onChange={(e)=>{
                                                        console.log('e.target.value', e.target.value)
                                                    }}
                                                />
                                            </td>
                              <td className="text-right">
                                <>
                                  <i
                                    className="fa fa-eye"
                                    style={{
                                      width: 35,
                                      fontSize: 18,
                                      padding: 11,
                                      color: "#4466F2",
                                      cursor: "pointer",
                                    }}
                                    id="viewAgendas"
                                    data-placement="top"
                                    onClick={() => setViewFlag(true)}
                                  ></i>
                                  <UncontrolledTooltip
                                    placement="top"
                                    target="viewAgendas"
                                  >
                                    {"View Vote's Detail"}
                                  </UncontrolledTooltip>
                                </>
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </TableWrapper>
                 
                ) : (
                  <div>Special Voting Data Not Available</div>
                )}
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













        </div>)
}
const TableWrapper = styled.table`
  padding-bottom: 30px;
  width: 100%;
  overflow-x: scroll !important;
//   overflow-x: scroll;
  ::-webkit-scrollbar {
    height: 5px;
    width: 3px;
  }

  ::-webkit-scrollbar-track {
    background: #f9f9fb;
  }
  ::-webkit-scrollbar-thumb {
    background: #4e515680;
    border-radius: 5px;
  }
`;
