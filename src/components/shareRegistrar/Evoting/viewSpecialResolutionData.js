import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getAllEventData, getCompanies } from "store/services/company.service";
import { addDirectorSchema } from "store/validations/votingValidations";
import { errorStyles } from "components/defaultStyles";
import { getInvestors } from "store/services/investor.service";
import { getShareHoldersByCompany } from "store/services/shareholder.service";
import { getPaginatedEventData } from "store/services/company.service";
import { EditSpecialVotingSchema } from "store/validations/votingValidations";
import { UncontrolledTooltip } from "reactstrap";
import styled from "styled-components";
export const ViewSpecialResolutionData = ({
  setViewAddRequirment,
  getPaginatedRequirment,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedDependendent, setSelectedDependent] = useState("");
  const specialVoting = JSON.parse(
    sessionStorage.getItem("selectedSpecialVoting")
  );
  const email = sessionStorage.getItem("email");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
  const [sharehoerData, setShareholderData] = useState("");
  const [shareholderName, setShareholderName] = useState("");
  const [folioNumber, setFolioNumber] = useState("");
  const [selectedshareHolder, setSelectedShareholder] = useState("");
  const [defaultMeeting, setDefaultEvent] = useState("");
  const [defaultCompany, setDefaultCompany] = useState("");
  const [allAgenda, setAllAgenda] = useState(specialVoting.agendas&& specialVoting.agendas!= ''? JSON.parse(specialVoting.agendas):[]);

  
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    watch,
  } = useForm({
    defaultValues: EditSpecialVotingSchema(specialVoting).cast(),
    resolver: yupResolver(EditSpecialVotingSchema(specialVoting)),
  });
  const getPaginatedEvent = async (pagenum) => {
    // setIsLoadingCompany(true);
    try {
      const response = await getAllEventData(
        email
        // "1",
        // "10",
        // search
      );
      if (response.status === 200) {
        const findEvent = response.data.data?.find(
          (item) => item?.statutory_event_id == specialVoting?.meeting_id
        );
        let findLabel = `${findEvent?.statutory_event_id} - ${findEvent?.title}`;
        setDefaultEvent(findLabel);
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
          const findCompany = companies_dropdowns?.find(
            (item) => item?.value == specialVoting?.company_code
          );
          setDefaultCompany(findCompany?.label);
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
  const getShareholderByCompany = async () => {
    try {
      //   setShareholderLoading(true);
      const response = await getShareHoldersByCompany(email, selectedCompany);
      if (response.status == 200) {
        const options = response.data.data?.map((item) => {
          const shareholder_id =
            item?.shareholder_id || item?.cnic_copy || item?.ntn;

          let label = `${shareholder_id} - ${item?.shareholder_name}`;
          return { label: label, value: shareholder_id };
        });
        setshareholder_dropDown(options);
        setShareholderData(response.data.data);
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
    if (selectedCompany) getShareholderByCompany();
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedshareHolder) {
      const obj = sharehoerData.find(
        (investor) =>
          selectedshareHolder === investor?.shareholder_id ||
          selectedshareHolder === investor?.cnic ||
          selectedshareHolder === investor?.ntn
      );

      setFolioNumber(obj?.folio_number);
      setShareholderName(
        sharehoerData.find(
          (investor) =>
            selectedshareHolder === investor?.shareholder_id ||
            selectedshareHolder === investor?.cnic ||
            selectedshareHolder === investor?.ntn
        )?.investor_name
      );
    }
  }, [selectedshareHolder]);

  const handleAlertMessage = async (data) => {
    // try {
    //     setLoading(true);
    //     // let response;
    //     const response = await addStatuaryRequirmentData(
    //         email,
    //         data?.form_code,
    //         data?.company_type,
    //         data?.title,
    //         data?.regulations,
    //         data?.regulations,
    //         data?.frequency,
    //         data?.level_ddl,
    //         selectedDependendent,
    //         data?.days_dependent,
    //         data?.notify_days,
    //         data?.notify_via,
    //         data?.active
    //     );
    //     if (response.data.status === 200) {
    //         setTimeout(() => {
    //             setLoading(false);
    //             // window.location.reload();
    //             getPaginatedRequirment("1")
    //             // getAllCompanies();
    //             toast.success(`${response.data.message}`);
    //             setViewAddRequirment(false);
    //         }, 2000);
    //     } else {
    //         setLoading(false);
    //         toast.error(`${response.data.message}`);
    //     }
    // } catch (error) {
    //     setLoading(false);
    //     !!error?.response?.data?.message
    //         ? toast.error(error?.response?.data?.message)
    //         : toast.error("Event Not Added");
    // }
  };

  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };
  return (
    <div>
      <form onSubmit={handleSubmit(handleAlertMessage)}>
        <div
          className="row b-t-primary"
          style={{ margin: "0px 8px", borderRadius: " 10px" }}
        >
          {/* <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="item_id">Item ID</label>

              <input
                name="item_id"
                className={`form-control ${
                  errors.item_id && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Item ID"
                {...register("item_id")}
              />

              <small className="text-danger">{errors.item_id?.message}</small>
            </div>
          </div> */}
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="company_code">Company</label>
              <input
                name="company_code"
                className={`form-control ${
                  errors.agenda_title && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Company Code"
                value={defaultCompany}
                readOnly
                // {...register("meeting_id")}
              />
              {/* <Controller
                                name="company_code"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={companies_dropdown}
                                        isLoading={!companies_dropdown?.length}
                                        id="company_code"
                                        placeholder={defaultCompany||'Enter Company Code'}
                                        onChange={(selected) => {
                                            if (selected?.value) setSelectedCompany(selected?.value);
                                            else setSelectedCompany("");
                                        }}
                                        isClearable={true}
                                        styles={errors.company_code && appliedStyles}
                                    />
                                )}
                                control={control}
                            /> */}

              <small className="text-danger">
                {errors.company_code?.message}
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="meeting_id">Meeting ID</label>
              <input
                name="meeting_id"
                className={`form-control ${
                  errors.agenda_title && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Meeting ID"
                value={defaultMeeting}
                readOnly
                // {...register("meeting_id")}
              />
              {/* <Controller
                                name="meeting_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={meetingDropDown}
                                        isLoading={!meetingDropDown?.length}
                                        id="meeting_id"
                                        placeholder={defaultMeeting||'Enter Meeting ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) setSelectedMeetingid(selected?.value);
                                            else setSelectedMeetingid("");
                                        }}
                                        isClearable={true}
                                        styles={errors.meeting_id && appliedStyles}
                                    />
                                )}
                                control={control}
                            /> */}

              <small className="text-danger">
                {errors.meeting_id?.message}
              </small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="item_no">Item No</label>

              <Controller
                name="item_no"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.item_no && "border border-danger"
                    }`}
                    id="item_no"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
              />
              <small className="text-danger">{errors.item_no?.message}</small>
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
                readOnly
              />
            </div>
            <small className="text-danger">
              {errors.agenda_title?.message}
            </small>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="agenda_item">Agenda Item</label>

              <input
                name="agenda_item"
                className={`form-control ${
                  errors.agenda_item && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Agenda Item"
                {...register("agenda_item")}
                readOnly
              />
              <small className="text-danger">
                {errors.agenda_item?.message}
              </small>
            </div>
          </div> */}
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="attachment">Attachment</label>
              <input
                name="attachment"
                className="form-control"
                type="file"
                placeholder="Upload File"
                // onChange={(e) => {
                //   if (e.target.files) {
                //     setFile(e.target.files[0]);
                //     let reader = new FileReader();
                //     reader.readAsDataURL(e.target.files[0]);
                //     reader.onload = function () {
                //       setFile64(reader.result)

                //     };
                //     reader.onerror = function (error) {
                //       console.log("Error: ", error);
                //     };
                //   }
                // }}
                readOnly
              />
              <small className="text-danger">
                {errors.attachment?.message}
              </small>
            </div>
          </div>

          {/* <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="term"> Term</label>

              <input
                name="term"
                className={`form-control ${
                  errors.term && "border border-danger"
                }`}
                type="text"
                placeholder="Enter term"
                {...register("term")}
              />
              <small className="text-danger">{errors.term?.message}</small>
            </div>
          </div> */}

          <div className="col-md-4">
            <div className="form-group mt-3  ">
              <label htmlFor="voting_required">Voting Required</label>
              <input
                name="voting_required"
                className={`form-control ${
                  errors.voting_required && "border border-danger"
                }`}
                type="text"
                placeholder="Voting Required"
                {...register("voting_required")}
                readOnly
              />
              {/* <select
                name="voting_required"
                className={`form-control ${
                  errors.voting_required && "border border-danger"
                }`}
                {...register("voting_required")}
                readOnly
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select> */}
              <small className="text-danger">
                {errors.voting_required?.message}
              </small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="shareholder">ShareHolders</label>

              <Controller
                name="shareholder"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.shareholder && "border border-danger"
                    }`}
                    id="shareholder"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
              />
              <small className="text-danger">
                {errors.shareholder?.message}
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="voting">Votings</label>

              <Controller
                name="voting"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.voting && "border border-danger"
                    }`}
                    id="voting"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
              />
              <small className="text-danger">{errors.voting?.message}</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="voters"> Voters</label>
              <Controller
                name="voters"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.voters && "border border-danger"
                    }`}
                    id="voters"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
              />
              {/* <input
                name="voters"
                className={`form-control ${
                  errors.voters && "border border-danger"
                }`}
                type="number"
                placeholder="Enter Voter"
                {...register("voters")}
              /> */}
              <small className="text-danger">{errors.voters?.message}</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="approvals">Approvals</label>
              <Controller
                name="approvals"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.approvals && "border border-danger"
                    }`}
                    id="approvals"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
              />
              {/* <input
                name="approvals"
                className={`form-control ${
                  errors.approvals && "border border-danger"
                }`}
                type="number"
                placeholder="Enter approvals"
                {...register("approvals")}
              /> */}

              <small className="text-danger">{errors.approvals?.message}</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="disapprovals">Disapprovals </label>
              <Controller
                name="disapprovals"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.disapprovals && "border border-danger"
                    }`}
                    id="disapprovals"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {errors.disapprovals?.message}
              </small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3  ">
              <label htmlFor="vote_Expired">Vote Expired</label>
              <Controller
                name="vote_Expired"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.vote_Expired && "border border-danger"
                    }`}
                    id="vote_Expired"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {errors.vote_Expired?.message}
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3  ">
              <label htmlFor="agenda_approved">Agenda Approved</label>
              <input
                name="agenda_approved"
                className={`form-control ${
                  errors.agenda_approved && "border border-danger"
                }`}
                type="text"
                placeholder="Enter agenda_approved"
                {...register("agenda_approved")}
                readOnly
              />

              <small className="text-danger">
                {errors.agenda_approved?.message}
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3  ">
              <label htmlFor="comment">Comment</label>
              <input
                name="comment"
                className={`form-control ${
                  errors.comment && "border border-danger"
                }`}
                type="text"
                placeholder="Enter comment"
                {...register("comment")}
                readOnly
              />
              <small className="text-danger">{errors.comment?.message}</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="agenda_from">Agenda From </label>

              <input
                className={`form-control ${
                  errors.agenda_from && "border border-danger"
                }`}
                name="agenda_from"
                type="datetime-local"
                {...register("agenda_from")}
                readOnly
              />
              <small className="text-danger">
                {errors.agenda_from?.message}
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="agenda_to">Agenda To </label>

              <input
                className={`form-control ${
                  errors.agenda_to && "border border-danger"
                }`}
                name="agenda_to"
                type="datetime-local"
                {...register("agenda_to")}
                readOnly
              />
              <small className="text-danger">{errors.agenda_to?.message}</small>
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
              {/* <div>
                   
                          <button className="btn-sm btn-primary rounded-circle"   id = 'addAgenda' style={{width: '35px', height: '35px'}}>+</button>
                   <UncontrolledTooltip placement="top" target="addAgenda">
            {"Add Agenda"}
          </UncontrolledTooltip>
                                     </div>   */}
            </div>
            <div></div>
            <div className="card-body">
              {allAgenda.length > 0 && allAgenda.find(x=>x.status=='active') ? (
                <TableWrapper className="table table-responsive" style={{width:'100%'}}>
                  <thead>
                    <tr>
                      <th className="text-nowrap" style={{ width: "0%" }}>
                        S No.
                      </th>
                      <th className="text-nowrap" style={{ width: "350px" }}>
                        Agenda Title
                      </th>
                      <th className="text-nowrap" style={{ width: "350px" }}>
                        Agenda Item
                      </th>
                      {/* <th className="text-nowrap" style={{width: '300px'}}>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {allAgenda.map((item, key) => (
                      item?.status == "active" && <tr key={key}>
                        <td scope="col">
                          <b>{item.item_no}</b>
                        </td>
                        <td style={{ width: "350px" }}>
                          <div
                            style={{
                              display: "block",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              width: "350px",
                            }}
                          >
                            
                            {item?.agenda_title}
                          </div>
                        </td>
                        <td style={{ width: "350px" }}>
                          <div
                            style={{
                              display: "block",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              width: "350px",
                            }}
                          >
                            
                            {item?.agenda_item}
                          </div>
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
