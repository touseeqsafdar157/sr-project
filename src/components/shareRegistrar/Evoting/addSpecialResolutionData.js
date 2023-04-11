import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getCompanies } from "store/services/company.service";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  addDirectorSchema,
  addSpecialVotingSchema,
} from "store/validations/votingValidations";
import { errorStyles } from "components/defaultStyles";
import { getInvestors } from "store/services/investor.service";
import { getShareHoldersByCompany } from "store/services/shareholder.service";
import { getPaginatedEventData } from "store/services/company.service";
import moment from "moment";
import { getAllEventData } from "store/services/company.service";
import { addSpecialVotingAgenda } from "store/services/evoting.service";
import { UncontrolledTooltip } from "reactstrap";
import { AiOutlineDelete } from "react-icons/ai";
import styled from "styled-components";
export const AddSpecialVoting = ({
  setSpecialVoting,
  getPaginatedRequirment,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedDependendent, setSelectedDependent] = useState("");
  const email = sessionStorage.getItem("email");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
  const [sharehoerData, setShareholderData] = useState("");
  const [investors_data, setInvestors_data] = useState([]);
  const [investors_data_loading, setInvestors_data_loading] = useState(false);
  const [shareholderName, setShareholderName] = useState("");
  const [folioNumber, setFolioNumber] = useState("");
  const [selectedshareHolder, setSelectedShareholder] = useState("");
  const [file, setFile] = useState();
  const [selectedMeeting, setSelectedMeetingid] = useState("");
  const [meetingDropDown, setMeetingDropdown] = useState([]);
  const [file64, setFile64] = useState("");
  const [shareholder, setShareHolder] = useState(null);
  const [companyError, setcompanyError] = useState(false);
  const [meetingError, setMeetingError] = useState(false);
  const [agendaTitleError, setAgendaTitleError] = useState(false);
  const [agendaFromError, setAgendaFromError] = useState(false);
  const [agendaToError, setAgendaToError] = useState(false);
  const [allMeetingsId, setAllMeetingsId] = useState([]);
  const [agendaModel, setAgendaModel] = useState(false);
  const [heading, setHeading] = useState("");
  const [allAgenda, setAllAgenda] = useState([]);
  const [addAgendaTitle,setAddAgendaTitle]=useState('')
  const [addAgendaItem,setAddAgendaItem]=useState('')
  const [editAgendaIndex,setEditAgendaIndex]=useState(-1)

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({ resolver: yupResolver(addSpecialVotingSchema) });
  const getPaginatedEvent = async (pagenum) => {
    // setIsLoadingCompany(true);
    try {
      const response = await getAllEventData(
        email
        // pagenum,
        // "10",
        // search
      );
      if (response.status === 200) {
        const options = response.data.data.map((item) => {
          let label = `${item.statutory_event_id} - ${item.title}`;
          return {
            label: label,
            value: item?.statutory_event_id,
            companyCode: item?.company_code,
          };
        });
        setAllMeetingsId(options);
        // setMeetingDropdown(options)
        // setStatuaryEvents(parents);
        // setIsLoadingCompany(false);
      }
    } catch (error) {
      //   setIsLoadingCompany(false);
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
    getPaginatedEvent(1);
  }, []);
  useEffect(() => {
    if (selectedCompany) {
      const filterMettings = allMeetingsId?.filter(
        (item) => item?.companyCode == selectedCompany
      );
      setMeetingDropdown(filterMettings);
    }
  }, [selectedCompany]);
  const getShareholderByCompany = async (selectedCompany) => {
    try {
      const response = await getShareHoldersByCompany(
        email,
        selectedCompany,
        "/active"
      );
      if (response.status == 200) {
        const options = response.data.data?.map((item) => {
          const shareholder_id =
            item?.shareholder_id || item?.cnic_copy || item?.ntn;

          let label = `${shareholder_id} - ${item?.shareholder_name}`;
          return { label: label, value: shareholder_id };
        });
        setshareholder_dropDown(options);
        setShareholderData(response.data.data);
        setShareHolder(response.data.data?.length?.toString());
      }
    } catch (error) {
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };
  useEffect(() => {
    if (selectedCompany) getShareholderByCompany(selectedCompany);
  }, [selectedCompany]);

  const handleAlertMessage = async (data) => {
    if (!selectedCompany) {
      setcompanyError(true);
    } else {
      setcompanyError(false);
    }
    if (!selectedMeeting) {
      setMeetingError(true);
    } else {
      setMeetingError(false);
    }
    
    if (!data?.agenda_from) {
      setAgendaFromError(true);
    } else {
      setAgendaFromError(false);
    }
    if (!data?.agenda_to) {
      setAgendaToError(true);
    } else {
      setAgendaToError(false);
    }
    if (
      !data?.agenda_to ||
      !data?.agenda_from ||
      !selectedMeeting ||
      !selectedCompany
    )
      return;
    const file_obj = { file_name: file?.name, data: file64 };
    const json_file = JSON.stringify(file_obj);
    const date = new Date();
    const createdAt = moment(date)?.format("YYYY-MM-DD");
    try {
      setLoading(true);
      const response = await addSpecialVotingAgenda(
        email,
        selectedCompany,
        selectedMeeting || "",
        allAgenda,
        json_file || "",
        // data?.voting_required,
        data?.voting || "",
        shareholder || "",

        data?.voters || "",
        data?.approvals || "",
        data?.disapprovals || "",
        data?.vote_Expired || "",
        data?.agenda_approved || "",
        data?.comment || "",
        createdAt || "",
        data?.agenda_from,
        data?.agenda_to
        // data?.cancel_through,
        // createdAt
      );

      if (response.data.status === 200) {
        setTimeout(() => {
          setLoading(false);
          window.location.reload();
          toast.success(`${response.data.message}`);
          setSpecialVoting(false);
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

  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };
  return (
    <div>
      <Modal isOpen={agendaModel} show={agendaModel.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setAddAgendaItem("")
            setAddAgendaTitle("")
            setAgendaModel(false);
          }}
        >
          {heading}
        </ModalHeader>
        <ModalBody>
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
                  <b>Agenda Detail</b>
                </div>
              </div>
              <div></div>
              <div className="card-body">
                <form >
                  <div className="col-md-9">
                    <div className="form-group mt-3">
                      <label htmlFor="company_code">Agenda Title</label>
                      <input
                        type="text"
                        name="agenda_title"
                        id="agenda_title"
                        disabled={heading == "View Agenda" ? true: false}
                        value={addAgendaTitle}
                        style={{ minWidth: "200px" }}
                        onChange={(e)=>{
                          setAddAgendaTitle(e.target.value)
                        }}
                        placeholder="Enter Agenda Title"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="form-group mt-3">
                      <label htmlFor="company_code">Agenda Item</label>
                      <textarea
                        name="agenda_item"
                        id="agenda_item"
                        rows={3}
                        disabled={heading == "View Agenda" ? true: false}
                        value={addAgendaItem}
                        style={{ minWidth: "200px" }}
                        onChange={(e)=>{
                          setAddAgendaItem(e.target.value)
                        }}
                        placeholder="Enter Agenda Details"
                        className="form-control"
                      />
                    </div>
                  </div>
                </form>
               { heading != "View Agenda" && <div style={{ marginTop: "20px" }}>
                  <button className="btn btn-primary " id="addAgenda" onClick={()=>{
                    if(heading == "Edit Agenda")
                    {
                      
                      let temp=allAgenda
                      if(editAgendaIndex>-1)
                      {
                        temp[editAgendaIndex].agenda_title=addAgendaTitle
                        temp[editAgendaIndex].agenda_item=addAgendaItem
                        setAllAgenda([...temp])
                        setAddAgendaItem("")
                        setAddAgendaTitle("")
                      }
                      
                      setAgendaModel(false);

                    }else{
                      let temp=allAgenda
                      temp.push({item_no:selectedMeeting+"-"+(temp.length+1),agenda_title:addAgendaTitle, agenda_item:addAgendaItem, status:"active"})
                      setAllAgenda([...temp])
                      setAddAgendaItem("")
                      setAddAgendaTitle("")
                      setAgendaModel(false);

                    }
                    

                  }}>
                    {heading == "Edit Agenda" ? "Update Agenda" : "Add Agenda"}
                  </button>
                  <UncontrolledTooltip placement="top" target="addAgenda">
                    {heading}
                  </UncontrolledTooltip>
                </div>}
              </div>
            </div>
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
                        setSelectedMeetingid("");
                      } else {
                        setSelectedCompany("");
                        setSelectedMeetingid("");
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
              <label htmlFor="meeting_id">Meeting ID</label>

              <Controller
                name="meeting_id"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={meetingDropDown}
                    isLoading={companies_data_loading}
                    value={meetingDropDown.filter(
                      (option) => option.value === selectedMeeting
                    )}
                    id="meeting_id"
                    placeholder={"Enter Meeting ID"}
                    onChange={(selected) => {
                      if (selected?.value)
                        setSelectedMeetingid(selected?.value);
                      else setSelectedMeetingid("");
                    }}
                    isClearable={true}
                    styles={meetingError && appliedStyles}
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {meetingError ? "Enter Meeting Id" : ""}
              </small>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="attachment">Attachment</label>
              <input
                name="attachment"
                className="form-control"
                type="file"
                placeholder="Upload File"
                multiple={true}
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                    let reader = new FileReader();
                    reader.readAsDataURL(e.target.files[0]);
                    reader.onload = function () {
                      setFile64(reader.result);
                    };
                    reader.onerror = function (error) {};
                  }
                }}
              />
              <small className="text-danger">
                {errors.attachment?.message}
              </small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3  ">
              <label htmlFor="voting_required">Voting Required</label>
              <select
                name="voting_required"
                className={`form-control ${
                  errors.voting_required && "border border-danger"
                }`}
                {...register("voting_required")}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <small className="text-danger">
                {errors.voting_required?.message}
              </small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="shareholder">ShareHolders</label>
              <input
                name="shareholder"
                className={`form-control ${
                  errors.shareholder && "border border-danger"
                }`}
                type="number"
                value={shareholder}
                onChange={(e) => setShareHolder(e.target.value)}
                placeholder="Enter shareholder"
                readOnly
                // {...register("shareholder")}
              />

              <small className="text-danger">
                {errors.shareholder?.message}
              </small>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="agenda_from">Evoting From </label>

              <input
                className={`form-control ${
                  agendaFromError && "border border-danger"
                }`}
                name="agenda_from"
                type="datetime-local"
                {...register("agenda_from")}
              />
              <small className="text-danger">
                {agendaFromError ? "Enter Date" : ""}
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="agenda_to">Evoting To </label>

              <input
                className={`form-control ${
                  agendaToError && "border border-danger"
                }`}
                name="agenda_to"
                type="datetime-local"
                {...register("agenda_to")}
              />
              <small className="text-danger">
                {agendaToError ? "Enter Date" : ""}
              </small>
            </div>
          </div>
        </div>

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
              <div>
                <div
                  onClick={() => {
                    setAgendaModel(true);
                    setHeading("Add Agenda");
                  }}
                  className="btn-sm btn-primary rounded-circle"
                  id="addAgenda"
                  style={{
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  +
                </div>
                <UncontrolledTooltip placement="top" target="addAgenda">
                  {"Add Agenda"}
                </UncontrolledTooltip>
              </div>
            </div>
            <div></div>
            <div className="card-body">
              {allAgenda && allAgenda.length > 0 ? (
                <TableWrapper className="table table-responsive">
                  <thead>
                    <tr>
                      <th className="text-nowrap" style={{ width: "0%" }}>
                        S No.
                      </th>
                      <th className="text-nowrap" style={{ width: "300px" }}>
                        Agenda Title
                      </th>
                      <th className="text-nowrap" style={{ width: "300px" }}>
                        Agenda Item
                      </th>
                      <th
                        className="text-nowrap text-right"
                        style={{ width: "300px" }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAgenda &&
                      allAgenda.length > 0 &&
                      allAgenda.map((item, key) => (
                        <tr key={key}>
                          <td scope="col">
                            <b>{item?.item_no}</b>
                          </td>
                          <td style={{ width: "300px" }}>
                            <div
                              style={{
                                display: "block",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                width: "300px",
                              }}
                            >
                              {item?.agenda_title}
                            </div>
                          </td>
                          <td style={{ width: "300px" }}>
                            <div
                              style={{
                                display: "block",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                width: "300px",
                              }}
                            >
                              {item?.agenda_item}
                            </div>
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
                                  setAddAgendaItem(item.agenda_item)
                                  setAddAgendaTitle(item.agenda_title)
                                  setAgendaModel(true);
                                  setHeading("View Agenda");
                                }}
                              ></i>
                              <UncontrolledTooltip
                                placement="top"
                                target="editAgendas"
                              >
                                {"Edit Agendas's Detail"}
                              </UncontrolledTooltip>
                            </>
                            
                            <>
                              <i
                                className="fa fa-pencil"
                                style={{
                                  width: 35,
                                  fontSize: 18,
                                  padding: 11,
                                  color: "#FF9F40",
                                  cursor: "pointer",
                                }}
                                id="editAgendas"
                                data-placement="top"
                                onClick={() => {
                                  setEditAgendaIndex(key)
                                  setAddAgendaItem(item.agenda_item)
                                  setAddAgendaTitle(item.agenda_title)
                                  setAgendaModel(true);
                                  setHeading("Edit Agenda");
                                }}
                              ></i>
                              <UncontrolledTooltip
                                placement="top"
                                target="editAgendas"
                              >
                                {"Edit Agendas's Detail"}
                              </UncontrolledTooltip>
                            </>
                            <>
                              <AiOutlineDelete
                                className="text-primary"
                                size={20}
                                id="deleteAgenda"
                                onClick={()=>{
                                  let temp=allAgenda
                                  temp.splice(key,1)
                                  for(let i=0;i<temp.length;i++)
                                  {
                                    temp[i].item_no=i+1
                                  }
                                  setAllAgenda([...temp])


                                }}
                              />
                              <UncontrolledTooltip
                                placement="top"
                                target="deleteAgenda"
                              >
                                {"Delete Agendas's Detail"}
                              </UncontrolledTooltip>
                            </>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </TableWrapper>
              ) : (
                <div>Agendas Data Not Available</div>
              )}
            </div>
          </div>
        </div>
        <div className="row mt-2">
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
  padding-bottom: 100px;
  overflow-x: scroll;
  overflow-x: scroll;
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
