import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";

import { getShareHoldersByCompany } from "store/services/shareholder.service";
import { errorStyles } from "components/defaultStyles";
import { EditSpecialResolutionSchema } from "store/validations/votingValidations";
import { getAllAgendaData } from "store/services/evoting.service";
import { getAllAuthorization } from "store/services/evoting.service";
import styled from "styled-components";
import { getCompanies } from "store/services/company.service";

import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";

export const ViewSpecialVotingData = ({
  setEditRequirment,
  getPaginatedRequirment,
}) => {
  const specialResolution =
    JSON.parse(sessionStorage.getItem("selectedResolution")) || "";
  const baseEmail = sessionStorage.getItem("email") || "";
  const [viewFlag, setViewFlag] = useState(false);

  const [defaultValue, setDefaultValue] = useState(null);

  const [defaultAuthLabel, setDefaultAuthLabel] = useState("");
  const [defaultShareholderId, setDefaultSharholderId] = useState(null);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [defaultCompany, setDefaultCompany] = useState("");
  const [viewAgendaItem,setViewAgendaItem]=useState({})
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: EditSpecialResolutionSchema(specialResolution).cast(),
    resolver: yupResolver(EditSpecialResolutionSchema(specialResolution)),
  });
  const getAllAuthorizationData = async () => {
    try {
      const response = await getAllAuthorization(baseEmail);
      if (response.status === 200) {
        const options = response.data.data.map((item) => {
          let label = `${item.auth_id} - ${item.authorized_name}`;
          return { label: label, value: item.auth_id };
        });
        const findID = options.find(
          (item) => item?.value == specialResolution?.authorization_id
        );

        setDefaultAuthLabel(`${findID.auth_id} - ${findID.authorized_name}`);
      }
    } catch (error) {}
  };
  const getShareholderByCompany = async (code) => {
    try {
      //   setShareholderLoading(true);
      const response = await getShareHoldersByCompany(baseEmail, code);
      if (response.status == 200) {
        const options = response.data.data?.map((item) => {
          const shareholder_id =
            item?.shareholder_id || item?.cnic_copy || item?.ntn;
          let label = `${shareholder_id} - ${item?.shareholder_name}`;
          return {
            label: label,
            value: shareholder_id,
            folio_number: item?.folio_number,
          };
        });
        const findId = options?.find(
          (item) => item?.value == specialResolution?.voter_id
        );
        // setshareholder_dropDown(options)
        // setShareholderDefaultId(findId?.value)
        setDefaultSharholderId(findId?.label);
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
  const getAllSpecialAgandaData = async () => {
    try {
      const response = await getAllAgendaData(baseEmail);
      if (response.status === 200) {
        const options = response.data.data.map((item) => {
          let label = `${item.item_id} - ${item.agenda_title}`;
          return {
            label: label,
            value: item.item_id,
            companyCode: item?.company_code,
            title: item.agenda_title,
          };
        });
        const defaultvalue = options?.find(
          (item) => item?.value == specialResolution?.agenda_id
        );

        setDefaultValue(defaultvalue?.label);

        getShareholderByCompany(defaultvalue?.companyCode);
      }
    } catch (error) {}
  };
  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try {
        const response = await getCompanies(baseEmail);
        if (response.status === 200) {
          const parents = response.data.data;
          const findCompany = parents?.find(
            (item) => item?.code == specialResolution?.company_code
          );
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
    // getAllCompanies();
    getAllAuthorizationData();
    getAllSpecialAgandaData();
  }, []);

  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };
  const handleEditSpecialResolution = (data) => {};
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
              {viewAgendaItem?.agenda_title}
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
              {viewAgendaItem?.agenda_item}
            </p>
          </div>
        </ModalBody>
      </Modal>
      <form onSubmit={handleSubmit(handleEditSpecialResolution)}>
        <div
          className="row b-t-primary"
          style={{ margin: "0px 8px", borderRadius: " 10px" }}
        >
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
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="agenda_id">Agenda ID</label>

              <input
                name="agenda_id"
                className={`form-control ${
                  errors.agenda_id && "border border-danger"
                }`}
                type="text"
                value={specialResolution?.agenda_id}
                placeholder="Enter Agenda Id"
                // {...register("agenda_id")}
                readOnly
              />
              <small className="text-danger">{errors.agenda_id?.message}</small>
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
                                value={specialResolution?.agenda_title}
                                // {...register("agenda_title")}
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

              <input
                name="cast_type"
                className={`form-control ${
                  errors.cast_type && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Cast Type"
                value={specialResolution?.cast_type}
                {...register("cast_type")}
                readOnly
              />

              <small className="text-danger">{errors.cast_type?.message}</small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3  ">
              <label htmlFor="cast_through">Cast Through</label>
              <input
                name="cast_through"
                className={`form-control ${
                  errors.cast_through && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Cast Through"
                value={specialResolution?.cast_through}
                {...register("cast_through")}
                readOnly
              />

              <small className="text-danger">
                {errors.cast_through?.message}
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="voter_id">Folio Number</label>

              <input
                name="voter_id"
                className={`form-control ${
                  errors.voter_id && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Folio Number"
                value={
                  specialResolution?.folio_number
                    ? specialResolution?.folio_number
                    : ""
                }
                // {...register("voter_id")}
                readOnly
              />
              <small className="text-danger">{errors.voter_id?.message}</small>
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
                placeholder="Enter Folio Number"
                value={specialResolution?.folio_number}
                // {...register("folio_No")}
                readOnly
              />
              <small className="text-danger">{errors.folio_No?.message}</small>
            </div>
          </div> */}
          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="authorization_id">Proxy/Authorization ID </label>

              <input
                name="authorization_id"
                className={`form-control ${
                  errors.authorization_id && "border border-danger"
                }`}
                type="text"
                placeholder="Enter Authorization ID"
                value={specialResolution?.authorization_id}
                {...register("authorization_id")}
                readOnly
              />
              <small className="text-danger">
                {errors.authorization_id?.message}
              </small>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group mt-3">
              <label htmlFor="votable_share">Votable Shares </label>

              <Controller
                name="votable_share"
                render={({ field }) => (
                  <NumberFormat
                    {...field}
                    className={`form-control ${
                      errors.votable_share && "border border-danger"
                    }`}
                    id="votable_share"
                    allowNegative={false}
                    value={specialResolution?.votable_shares}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {errors.votable_share?.message}
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
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                        readOnly
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
                            <input
                                name="vote"
                                className={`form-control ${errors.vote && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Vote"
                                // value={specialResolution?.vote}
                                {...register("vote")}
                                readOnly
                            />
                            
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
                                        readOnly
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
                                        readOnly
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
                                        readOnly
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
                                readOnly
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
                  {specialResolution.vote &&
                  JSON.parse(specialResolution.vote)?.length > 0 ? (
                    <TableWrapper className="table">
                      <thead>
                        <tr>
                          <th className="text-nowrap">S No.</th>
                          <th className="text-nowrap">Title</th>
                          <th
                            className="text-nowrap"
                            style={{ width: "200px" }}
                          >
                            Vote
                          </th>
                          <th
                            className="text-nowrap"
                            style={{ width: "200px" }}
                          >
                            Votes Rejected
                          </th>

                          <th
                            className="text-nowrap"
                            style={{ width: "200px" }}
                          >
                            Voting Percentage
                          </th>
                          <th
                            className="text-nowrap"
                            style={{ width: "200px" }}
                          >
                            Remarks
                          </th>
                          <th className="text-nowrap text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSON.parse(specialResolution.vote)?.length > 0 &&
                          JSON.parse(specialResolution.vote)?.map(
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
                                      width: "180px",
                                    }}
                                  >
                                    {item?.agenda_title}
                                  </div>
                                </td>
                                <td>
                                  {item?.votes_favour == "1"
                                    ? "Favor"
                                    : "Against"}
                                </td>
                                <td style={{ width: "200px" }}>
                                  <div
                                    style={{
                                      display: "block",
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      width: "180px",
                                    }}
                                  >
                                    {" "}
                                    {item?.votes_rejected
                                      ? item?.votes_rejected
                                      : "0"}
                                  </div>
                                  {/* <input
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
                                                /> */}
                                </td>

                                <td style={{ width: "200px" }}>
                                  <div
                                    style={{
                                      display: "block",
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      width: "180px",
                                    }}
                                  >
                                    {item?.voting_percentage}
                                  </div>
                                </td>
                                <td style={{ width: "200px" }}>
                                  <div
                                    style={{
                                      display: "block",
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      width: "180px",
                                    }}
                                  >
                                    {item?.remarks}
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
                                        let temp={agenda_title:item.agenda_title, agenda_item:item.agenda_item}
                                        setViewAgendaItem(temp)
                                        setViewFlag(true)
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
                    <div>Special Voting Data Not Available</div>
                  )}
                </div>
              </div>
            </div>
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
