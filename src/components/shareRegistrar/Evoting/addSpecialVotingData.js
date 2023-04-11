import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getCompanies } from "store/services/company.service";
import { addDirectorSchema } from "store/validations/votingValidations";
import { errorStyles } from "components/defaultStyles";
import { getInvestors } from "store/services/investor.service";
import { getShareHoldersByCompany } from "store/services/shareholder.service";
import { getAllAgendaData, getAllSpecialVotingByAgendaId } from "store/services/evoting.service";
import { getAllAuthorization } from "store/services/evoting.service";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import { getAllEventData } from "store/services/company.service";
import { AddSpecialResolutionSchema } from "store/validations/votingValidations";
import { addSpecialResolutionData } from "store/services/evoting.service";
import styled from "styled-components";
import moment from "moment";
export const AddSpecialResolution = ({
  setAddSpecialResolution,
  getPaginatedRequirment,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedDependendent, setSelectedDependent] = useState("");
  const email = sessionStorage.getItem("email");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
  const [selectedAuthorizationId, setSelectedAuthorizationId] = useState("");

  const [folioNumber, setFolioNumber] = useState("");
  const [selectedshareHolder, setSelectedShareholder] = useState("");
  const [agendaOptions, setAgendaOptions] = useState([]);
  const [selectedAgenda, setSelectedAgenda] = useState("");
  const [selectedCompanyCode, setSelectedCompanyCode] = useState("");
  const [title, setTitle] = useState("");
  const [authorizationOptions, setAuthorizationOptions] = useState([]);
  const [meetingid, setMeetingid] = useState("");
  const [allEvent, setAllEvent] = useState([]);
  const [votecasted, setVoteCasted] = useState("");
  const [AgendaIdError, setAgendaIdError] = useState(false);
  const [voterIdError, setVoterIdError] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [voteError, setVoteError] = useState(false);
  const [companyError, setCompannyError] = useState(false);
  const [allAgendaOption, setAllAgendaOption] = useState([]);
  const [viewFlag, setViewFlag] = useState(false);
  const [selectedAgendaDetails, setSelectedAgendaDetails] = useState({});
  const [agendaItemDetail, setAgendaItemDetail] = useState({});
  const [votesRejected, setVotesRejected] = useState([]);
  const [votesRemarks, setVotesRemarks] = useState([]);
  const [votesCast, setVotesCast] = useState([]);
  const [votesPercentage, setVotesPercentage] = useState([]);
  const [allVotesAgendaID,setAllVotesAgendaID]=useState([])
  const [showAgendas,setShowAgendas]=useState(false)
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({ resolver: yupResolver(AddSpecialResolutionSchema) });
  // const getAllInvestors = async () => {

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
  };
  const getAllSpecialAgandaData = async () => {
    try {
      const response = await getAllAgendaData(email);
      if (response.status === 200) {
        let options = response.data.data.filter((item) => {
          if (item.agendas && item.agendas != "") {
            return {
              item,
            };
          }
        });
        setAllAgendaOption(options);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (selectedCompany) {
      let filterAgenda = allAgendaOption?.filter(
        (item) => item?.company_code == selectedCompany
      );
      filterAgenda = filterAgenda.map((item) => {
        return { label: item.item_id, value: item.item_id };
      });
      setAgendaOptions(filterAgenda);
    }
    getShareholderByCompany(selectedCompany);
  }, [selectedCompany]);
  const getAllEvent = async () => {
    try {
      const response = await getAllEventData(email);
      if (response.status === 200) {
        // const options = response.data.data.map((item) => {
        //     let label = `${item.statutory_event_id} - ${item.title}`;
        //     return { label: label, value: item?.statutory_event_id };
        // });
        setAllEvent(response.data.data);
      }
    } catch (error) {}
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
    getAllSpecialAgandaData();
    getAllAuthorizationData();
    getAllEvent();
  }, []);

  const getShareholderByCompany = async (code) => {
    try {
      const response = await getShareHoldersByCompany(email, code);
      if (response.status == 200) {
        const options = response.data.data?.map((item) => {
          const physicalShare = Number(item?.physical_shares)
            ? Number(item?.physical_shares)
            : 0;
          const electronicShare = Number(item?.electronic_shares)
            ? Number(item?.electronic_shares)
            : 0;
          const physical_electroninc_shares = (
            physicalShare + electronicShare
          )?.toString();
          const shareholder_id =
            item?.shareholder_id || item?.cnic_copy || item?.ntn;
          let label = `${item?.folio_number} - ${item?.shareholder_name}`;
          return {
            label: label,
            value: shareholder_id,
            folio_number: item?.folio_number,
            castedVote: physical_electroninc_shares,
          };
        });
        // const findId = options?.find((item) => item?.value == specialResolution?.voter_id)
        setshareholder_dropDown(options);
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
  };

  const handleAlertMessage = async (data) => {
    const date = new Date();
    const createdAt = moment(date)?.format("YYYY-MM-DD");
    if (!selectedAgenda) {
      setAgendaIdError(true);
    } else {
      setAgendaIdError(false);
    }
    if (!selectedshareHolder) {
      setVoterIdError(true);
    } else {
      setVoterIdError(false);
    }
    // if (!selectedAuthorizationId) setAuthError(true);
    // else setAuthError(false);
    
    if (!selectedCompany) setCompannyError(true);
    else setCompannyError(false);
    if (
      // !selectedAuthorizationId ||
      !selectedshareHolder ||
      !selectedAgenda ||
      !selectedCompany
    )
      return;
      let temp= selectedAgendaDetails.agendas ? JSON.parse(selectedAgendaDetails.agendas) :[]
      for (let i = 0; i < temp.length; i++) {
        if (typeof votesCast[i] === "undefined") {
          toast.error("Please cast all vote ")
          return
        }
      }
    try {
      setLoading(true);
      let vote=[]
      for (let j = 0; j < temp.length; j++) {
        vote.push({
          item_no: temp[j].item_no,
          votes_casted: votecasted,
          voting_percentage:votesPercentage[j] ? votesPercentage[j] :"100%",
          votes_favour: votesCast[j] == "Approved" ? "1" : "0",
          votes_against: votesCast[j] == "Disapproved" ? "1" : "0",
          votes_accepted:votesRejected[j] ? parseFloat(votecasted)-parseFloat(votesRejected[j]) :votecasted,
          votes_rejected:votesRejected[j] ?votesRejected[j] : "0",
          remarks:votesRemarks[j] ? votesRemarks[j]:  "",
          vote_cast_date_time: new Date().toString().substring(0, 24),
          agenda_title: temp[j].agenda_title,
          agenda_item: temp[j].agenda_item,
        });
      }

      const response = await addSpecialResolutionData(
        email,
        "",
        selectedAgenda,
        data?.cast_type,
        data?.cast_through,
        selectedshareHolder,
        folioNumber,
        selectedAuthorizationId,
        votecasted,
        votecasted,
        vote,
        data?.vote_casted,
        meetingid,
        selectedCompany
      );

      if (response.data.status === 200) {
        setTimeout(() => {
          setLoading(false);
          window.location.reload();

          toast.success(`${response.data.message}`);
          setAddSpecialResolution(false);
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
  };

  const getVotesByAgendaID =async(agenda_id)=>{
    const response=await getAllSpecialVotingByAgendaId(email, agenda_id)
    if(response.data.status == 200)
    {
      setAllVotesAgendaID(response.data.data)

    }else{
      allVotesAgendaID.length=0
      setAllVotesAgendaID([])

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
              {agendaItemDetail?.agenda_title}
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
              {agendaItemDetail?.agenda_item}
            </p>
          </div>
        </ModalBody>
      </Modal>
      <form onSubmit={handleSubmit(handleAlertMessage)}>
        <div
          className="row b-t-primary"
          style={{ margin: "0px 8px", borderRadius: " 10px" }}
        >
          <div className="col-md-4">
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
                    placeholder={"Enter Company"}
                    onChange={(selected) => {
                      if (selected?.value) {
                        setSelectedCompany(selected?.value);
                        setSelectedAgenda("");
                      } else {
                        setSelectedCompany("");
                        setSelectedAgenda("");
                      }
                    }}
                    isClearable={true}
                    styles={companyError && appliedStyles}
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {companyError ? "Enter Company" : ""}
              </small>
            </div>
          </div>
          <div className="col-md-4">
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
                    placeholder={"Enter Agenda ID"}
                    isDisabled={!selectedCompany}
                    value={agendaOptions.filter(
                      (option) => option.value === selectedAgenda
                    )}
                    onChange={(selected) => {
                      if (selected?.value) {
                        setSelectedCompanyCode(selected?.companyCode);
                        setSelectedAgenda(selected.value);
                        setTitle(selected?.title);
                        setMeetingid(selected?.meetingID);
                        let temp = allAgendaOption.find(
                          (x) => x.item_id == selected?.value
                        );
                        let agenda = JSON.parse(temp.agendas).filter((item) => {
                          return item.status && item.status == "active";
                        });
                        temp.agendas = JSON.stringify(agenda);
                        setSelectedAgendaDetails(temp);
                        getVotesByAgendaID(selected?.value)
                      } else {
                        setSelectedCompanyCode("");
                        setSelectedAgenda("");
                        setTitle("");
                        setMeetingid("");
                      }
                    }}
                    isClearable={true}
                    styles={AgendaIdError && appliedStyles}
                  />
                )}
                control={control}
              />
              <small className="text-danger">
                {AgendaIdError ? "Enter Agenda Id" : ""}
              </small>
            </div>
          </div>

          {/* <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="agenda_title">Agenda Title</label>

              <input
                name="agenda_title"
                className={`form-control ${
                  errors.agenda_title && "border border-danger"
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
          </div> */}
          <div className="col-md-4">
            <div className="form-group mt-3  ">
              <label htmlFor="cast_type">Cast Type</label>
              <select
                name="cast_type"
                className={`form-control ${
                  errors.cast_type && "border border-danger"
                }`}
                {...register("cast_type")}
              >
                <option value="">Select</option>
                <option value="Physical ">Physical </option>
                <option value="Electronic">Electronic</option>
              </select>
              <small className="text-danger">{errors.cast_type?.message}</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3  ">
              <label htmlFor="cast_through">Cast Through</label>
              <select
                name="cast_through"
                className={`form-control ${
                  errors.cast_through && "border border-danger"
                }`}
                {...register("cast_through")}
              >
                <option value="">Select</option>
                <option value="Ballot Paper ">Ballot Paper </option>
                <option value="Web App">Web App</option>
                {/* <option value="Mobile App"> Mobile App</option> */}
                <option value="Post"> Post</option>
              </select>
              <small className="text-danger">
                {errors.cast_through?.message}
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="voter_id">Folio Number</label>

              <Controller
                name="voter_id"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={shareholder_dropDown}
                    isLoading={!shareholder_dropDown?.length}
                    id="voter_id"
                    placeholder={"Enter Folio Number"}
                    value={shareholder_dropDown?.filter(
                      (option) => option.value === selectedshareHolder
                    )}
                    onChange={(selected) => {
                      if (selected?.value) {
                        let index = allVotesAgendaID.findIndex(x=>x.folio_number ==selected.folio_number )
                        if(index > -1)
                        {
                          setShowAgendas(false)
                          toast.error("already vote casted")
                          setSelectedShareholder("");
                          setFolioNumber("");
                          setVoteCasted("");

                        }else{
                          setShowAgendas(true)
                          setSelectedShareholder(selected.value);
                          setFolioNumber(selected.folio_number);
                          setVoteCasted(selected?.castedVote);

                        }
                        
                        
                      } else {
                        setSelectedShareholder("");
                        setFolioNumber("");
                        setVoteCasted("");
                      }
                    }}
                    isClearable={true}
                    styles={voterIdError && appliedStyles}
                  />
                )}
                control={control}
              />
              <small className="text-danger">
                {voterIdError ? "Enter Folio Number" : ""}
              </small>
            </div>
          </div>
          {/* <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="folio_No">Folio Number</label>

              <input
                name="folio_No"
                className={`form-control ${
                  errors.voter_id && "border border-danger"
                }`}
                type="text"
                value={folioNumber}
                placeholder="Enter Folio Number"
                readOnly
                {...register("folio_No")}
              />
              <small className="text-danger">{errors.folio_No?.message}</small>
            </div>
          </div> */}
          <div className="col-md-4">
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
                    placeholder={"Enter Authorzation ID"}
                    onChange={(selected) => {
                      if (selected?.value) {
                        setSelectedAuthorizationId(selected.value);
                      } else {
                        setSelectedAuthorizationId("");
                      }
                    }}
                    isClearable={true}
                    styles={authError && appliedStyles}
                  />
                )}
                control={control}
              />
              <small className="text-danger">
                {authError ? "Enter Authorization Id" : ""}
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="votable_share">Votable Shares </label>

              <input
                name="votable_share"
                className={`form-control ${
                  errors.votable_share && "border border-danger"
                }`}
                type="number"
                placeholder="Enter Number"
                value={votecasted}
                onChange={(e) => {
                  setVoteCasted(e.target.value);
                }}
                {...register("votable_share")}
              />
              <small className="text-danger">
                {errors.votable_share?.message}
              </small>
            </div>
          </div>
          {/* <div className='col-md-4'>
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
                    </div> */}
          {/* <div className='col-md-4'>
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
                            </select>
                            <small className="text-danger">
                                {voteError ? 'Select Vote' : ''}
                            </small>
                        </div>

                    </div> */}
          {/* <div className='col-md-4'>
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
                   */}
          {/* <div className='col-md-4'>
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
                    </div> */}
          {/* <div className='col-md-4'>
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
                    </div> */}
          {/* <div className='col-md-4'>
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
                    </div> */}

          {showAgendas && <div className="row col-md-12 mt-4">
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
                  {selectedAgendaDetails &&
                  selectedAgendaDetails.agendas &&
                  JSON.parse(selectedAgendaDetails.agendas)?.length > 0 ? (
                    <TableWrapper className="table">
                      <thead>
                        <tr>
                          <th className="text-nowrap">S No.</th>
                          <th className="text-nowrap">Title</th>
                          <th
                            className="text-nowrap"
                            style={{ textAlign: "center" }}
                          >
                            Vote
                          </th>
                          <th className="text-nowrap">Votes Rejected</th>

                          <th className="text-nowrap">Voting Percentage</th>
                          <th className="text-nowrap">Remarks</th>
                          <th className="text-nowrap text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSON.parse(selectedAgendaDetails.agendas)?.length >
                          0 &&
                          JSON.parse(selectedAgendaDetails.agendas)?.map(
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
                                <td>
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
                                          onClick={(e) => {
                                            let temp = votesCast;
                                            // let index = e.target.value.split("-")[0];
                                            // index = parseInt(index);

                                            temp[key] =
                                              e.target.value.split("-")[1];
                                            setVotesCast([...temp]);
                                            const checkboxes =
                                              document.getElementsByName(
                                                `group${key}`
                                              );
                                            checkboxes.forEach((checkbox) => {
                                              checkbox.addEventListener(
                                                "click",
                                                () => {
                                                  checkboxes.forEach((cb) => {
                                                    if (cb !== checkbox) {
                                                      cb.checked = false;
                                                    }
                                                  });
                                                }
                                              );
                                            });
                                          }}
                                          name={`group${key}`}
                                          value={`${key}-Approved`}
                                        />
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
                                          onClick={(e) => {
                                            let temp = votesCast;
                                            // let index = e.target.value.split("-")[0];
                                            // index = parseInt(index);
                                            temp[key] =
                                              e.target.value.split("-")[1];
                                            setVotesCast([...temp]);
                                            const checkboxes =
                                              document.getElementsByName(
                                                `group${key}`
                                              );
                                            checkboxes.forEach((checkbox) => {
                                              checkbox.addEventListener(
                                                "click",
                                                () => {
                                                  checkboxes.forEach((cb) => {
                                                    if (cb !== checkbox) {
                                                      cb.checked = false;
                                                    }
                                                  });
                                                }
                                              );
                                            });
                                          }}
                                          value={`${key}-Disapproved`}
                                        />
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
                                    value={
                                      votesRejected[key]
                                        ? votesRejected[key]
                                        : "0"
                                    }
                                    style={{
                                      maxWidth: "170px",
                                      minWidth: "170px",
                                    }}
                                    onChange={(e) => {
                                      let temp = votesRejected;
                                      temp[key] = e.target.value;
                                      setVotesRejected([...temp]);
                                      let per = parseFloat(
                                        ((parseFloat(votecasted) -
                                          parseFloat(e.target.value)) /
                                          parseFloat(votecasted)) *
                                          100
                                      ).toFixed(2);
                                      let temp_per = votesPercentage;
                                      temp_per[key] = per;
                                      setVotesPercentage([...temp_per]);
                                    }}
                                  />
                                </td>

                                <td>
                                  <input
                                    type="text"
                                    name="voting_percentage"
                                    id="voting_percentage"
                                    style={{
                                      maxWidth: "170px",
                                      minWidth: "170px",
                                    }}
                                    placeholder="Voting Percentage"
                                    className="form-control"
                                    value={
                                      votesPercentage[key]
                                        ? votesPercentage[key] + "%"
                                        : "100.00%"
                                    }
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name="remarks"
                                    id="remarks"
                                    placeholder="Enter Remarks"
                                    style={{
                                      maxWidth: "170px",
                                      minWidth: "170px",
                                    }}
                                    className="form-control"
                                    value={
                                      votesRemarks[key] ? votesRemarks[key] : ""
                                    }
                                    onChange={(e) => {
                                      let temp = votesRemarks;
                                      temp[key] = e.target.value;
                                      setVotesRemarks([...temp]);
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
                                      onClick={() => {
                                        let temp = {
                                          agenda_title: item?.agenda_title,
                                          agenda_item: item?.agenda_item,
                                        };
                                        setAgendaItemDetail(temp);
                                        setViewFlag(true);
                                      }}
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
                    <div className="col-md-12">
                      Special Voting Data Not Available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>}
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
    </div>
  );
};
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
