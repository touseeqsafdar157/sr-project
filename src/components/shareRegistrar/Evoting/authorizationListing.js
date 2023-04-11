import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";

import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";

import Spinner from "components/common/spinner";
import { EditAuthorization } from "./editAuthorization";

import styled from "styled-components";

import { AddAuthorization } from "./AddAuthorization";
import { ViewAuthorized } from "./viewAuthorized";
import Select from "react-select";
import { darkStyle } from "components/defaultStyles";
import ReactPaginate from "react-paginate";

import {
  getAllElections,
  getAuthorizedByElectionId,
  getPaginatedAuthorizedListingData,
  updateAuthorization,
} from "store/services/evoting.service";
import { getCompanies } from "../../../store/services/company.service";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineSend } from "react-icons/ai";
import { StatutoryAlertTemplate } from "../company/statutoryAlertTemplate";
import { BsEnvelope } from "react-icons/bs";
import { getvalidDateDMY } from "utilities/utilityFunctions";
import moment from "moment";

export default function AuthorizationListing() {
  const baseEmail = sessionStorage.getItem("email") || "";

  // new pagination server side

  const [loadingListing, setLoadingListing] = useState(false);
  const [addAuthorization, setAddAuthorization] = useState(false);
  const [editAuthorized, setEditAtuthorizedVoting] = useState(false);
  const [viewAuthorizedData, setViewAuthorized] = useState(false);
  const [electionIdOptions, setElectionIdOptons] = useState([]);
  const [selectedElection, setSelectedElection] = useState();
  const [selectedCompany, setSelectedCompanny] = useState("");
  const [compnyDropDownOptions, setCompanyDropDownOptions] = useState([]);
  const [allElectionsData, setAllElectionsDAta] = useState([]);
  const [cancelAuthorization, setcancelAuthorization] = useState(false);
  const [sendTemplate, setSendTemplate] = useState(false);
  const [cancelledDate,setCancelledDate]=useState(moment(new Date()).format("YYYY-MM-DD"))
  const [cancelledReason,setCancelledReason]=useState("")
  const [cancelledAuthData,setCancelledAuthData]=useState({})
  const [cancelledThrough,setCancelledThrough]=useState("")

  // new pagination end

  let history = useHistory();
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [directorVotin, setdirectorVotins] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const autorizationListingPerPage = 10;
  const pagesVisited = pageNumber * autorizationListingPerPage;
  const pageCount = Math.ceil(
    directorVotin.length / autorizationListingPerPage
  );
  const [loading, setLoading] = useState(false);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  const getAllCompanies = async () => {
    try {
      const response = await getCompanies(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
        const optons = response.data.data.map((item) => {
          let label = `${item.code} - ${item.company_name}`;
          return { label: label, value: item.code, symbol: item?.symbol };
        });
        setCompanyDropDownOptions(optons);
      }
    } catch (error) {}
  };
  const getAllElectionsData = async () => {
    // setCompanies_data_loading(true);
    try {
      const response = await getAllElections(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;

        setAllElectionsDAta(parents);
        // setCompanyData(optons)
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllCompanies();
    getAllElectionsData();
  }, []);
  useEffect(() => {
    if (selectedCompany) {
      const filterData = allElectionsData?.filter(
        (item) => item?.company_code == selectedCompany
      );
      const options = filterData.map((item) => {
        let label = `${item.election_id} - ${item.symbol}`;
        return {
          label: label,
          value: item.election_id,
          companyCode: item?.company_code,
        };
      });
      // const optons = filterData.map((item) => {
      //   return { label: item?.election_id, value: item?.election_id, };

      // });
      setElectionIdOptons(options);
    }
  }, [selectedCompany]);

  const displaydirectorVotinPerPage = directorVotin
    .slice(pagesVisited, pagesVisited + autorizationListingPerPage)
    .map((item, i) => (
      <tr key={i}>
        <td>{item?.election_id || ""}</td>
        <td>{item.auth_id || ""}</td>
        <td>{item.authorized_name || ""}</td>
        <td>{item?.method || ""}</td>
        <td>{item?.number_of_shares || ""}</td>
        <td>{item?.type?.replaceAll("_", " ")?.toUpperCase() || ""}</td>

        <td style={{ maxWidth: "120px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <>
              <i
                className="fa fa-eye"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "#4466F2",
                  cursor: "pointer",
                }}
                id="RequirmentView"
                data-placement="top"
                onClick={() => {
                  const obj = JSON.parse(JSON.stringify(item));
                  sessionStorage.setItem(
                    "selectedAuthorized",
                    JSON.stringify(obj)
                  );
                  setViewAuthorized(true);
                }}
              ></i>
              <UncontrolledTooltip placement="top" target="RequirmentView">
                {"View Authorized Detail"}
              </UncontrolledTooltip>
            </>

            <>
              <i
                className="fa fa-pencil"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "#FF9F40",
                  cursor: "pointer",
                }}
                id="directorEdit"
                data-placement="top"
                onClick={() => {
                  const obj = JSON.parse(JSON.stringify(item));
                  sessionStorage.setItem(
                    "selectedAuthorized",
                    JSON.stringify(obj)
                  );
                  setEditAtuthorizedVoting(true);
                }}
              ></i>
              <UncontrolledTooltip placement="top" target="directorEdit">
                {"Edit Authorized Detail"}
              </UncontrolledTooltip>
            </>
            <>
              <AiOutlineClose
                id="cancelauthorized"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  
                  setCancelledAuthData(item)
                  setcancelAuthorization(true)
                }}
              />
              <UncontrolledTooltip placement="top" target="cancelauthorized">
                {"Cancel Authorized Detail"}
              </UncontrolledTooltip>
            </>
            <>
              <AiOutlineSendWraper
                id="sendAlert"
                style={{
                  color: "#1ea6ec",
                  cursor: "pointer",
                  paddingLeft: "10px",
                }}
                size={25}
                onClick={() => {
                  // setEmailData(item)
                  // setCode(item?.company_code)
                  // const data = allCompanyData?.find(ite => ite?.code == item?.company_code)
                  // const CEOEmail = data?.ceo_email;
                  // const parseGovernance = JSON.parse(data?.governance)
                  // const ceoEmail = parseGovernance?.find(item => item?.role == 'CEO')?.email || CEOEmail || '';
                  // const sectoryEmail = parseGovernance?.find(item => item?.role == 'Company Secretary')?.email;
                  // const concateEmail = `${ceoEmail && sectoryEmail ? ceoEmail + ' , ' + sectoryEmail : ceoEmail ? ceoEmail : sectoryEmail}`
                  // setToMail(concateEmail)
                  // if (item?.req_code) {
                  //   let str = 'Event: ' + item?.req_code;
                  //   setWriteText(str?.replace(' - ', '\nRequirement: '))
                  //   setTextForTemplate(str?.replace(' - ', 'Requirement: ')?.split('Requirement:'))
                  // }
                  setSendTemplate(true);
                }}
              />
              <UncontrolledTooltip placement="top" target="sendAlert">
                {"Sent Alert"}
              </UncontrolledTooltip>
            </>
          </div>
        </td>
      </tr>
    ));

  const handleGenerateData = async () => {
    // getDirectorsDataByCompanyCode(nextPage);
    setLoadingListing(true);
    try {
      const response = await getAuthorizedByElectionId(
        baseEmail,
        selectedElection
      );
      if (response.status === 200) {
        const parents = response.data.data ? response.data.data : [];
        const filterData = parents?.filter((item) =>
          item?.election_id?.includes("_")
            ? item?.election_id?.split("_")[0] == selectedCompany
            : item?.election_id?.split("-")[0] == selectedCompany
        );
        setdirectorVotins(filterData);
        setLoadingListing(false);
      }
    } catch (error) {
      setLoadingListing(false);
    }
  };
  const handleCancelAuthorized = async () => {
    setLoading(true);
    console.log(cancelledAuthData)
    const response=await updateAuthorization(baseEmail,cancelledAuthData.auth_id,selectedCompany,"","","","","","","","","","","","","yes",cancelledDate,cancelledThrough,"",cancelledReason)
    if(response.data.status == 200)
    {
      toast.success(response.data.message)
      setcancelAuthorization(false)
      setLoading(false)

    }else{
      toast.error(response.data.message)
      setLoading(false);

    }
    
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Authorization Listing</h6>
        <Breadcrumb title="Authorization Listing" parent="Election" />
      </div>
      <Modal isOpen={sendTemplate} show={sendTemplate.toString()} size="lg">
        <ModalHeader
          toggle={() => {
            setSendTemplate(false);
            // setPreView(true)
          }}
          // style={{borderBottom: 'red', color }}
        >
          <div className="d-flex" style={{ alignItems: "center", gap: "15px" }}>
            <BsEnvelope size={20} />
            <div>Send Alert</div>
          </div>
        </ModalHeader>
        <ModalBody style={{ margin: "-2px 8px 8px 8px" }}>
          {/* <AlertEmailModal/> */}
          <StatutoryAlertTemplate
            setSendTemplate={setSendTemplate}
            authorizationData={true}
          />
        </ModalBody>
      </Modal>
      {/* Add Modal */}
      <Modal
        isOpen={addAuthorization}
        show={addAuthorization.toString()}
        size="xl"
      >
        <ModalHeader
          toggle={() => {
            setAddAuthorization(false);
          }}
        >
          Add Authorization
        </ModalHeader>
        <ModalBody>
          <AddAuthorization setAddAuthorization={setAddAuthorization} />
        </ModalBody>
      </Modal>
      <Modal
        isOpen={cancelAuthorization}
        show={cancelAuthorization.toString()}
        size="lg"
      >
        <ModalHeader
          toggle={() => {
            setcancelAuthorization(false);
          }}
        >
          Cancel Authorization
        </ModalHeader>
        <ModalBody>
          <form>
            <div
              className="row b-t-primary"
              style={{ margin: "0px 8px", borderRadius: " 10px" }}
            >
              <div className="col-md-8">
                <div className="form-group mt-3  ">
                  <label htmlFor="auth_cancel">Auth Cancelled</label>
                  <input
                    name="auth_cancel"
                    className={`form-control`}
                    type="text"
                    value={"Yes"}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-8">
                <div className="form-group mt-3">
                  <label htmlFor="cancel_date">Cancellation Date </label>

                  <input
                    className={`form-control `}
                    name="cancel_date"
                    type="date"
                    value={cancelledDate}
                    onChange={(e)=>{
                      setCancelledDate(e.target.value)
                    }}

                  />
                </div>
              </div>
              <div className="col-md-8">
                <div className="form-group mt-3  ">
                  <label htmlFor="cancel_through">Cancelled Through</label>
                  <select name="cancel_through" className={`form-control `} onChange={(e)=>{
                    setCancelledThrough(e.target.value)
                    

                  }}>
                    <option value="">Select</option>
                    <option value="Written Request">Written Request</option>
                    <option value="Email">Email</option>
                    {/* <option value="Mobile App">Mobile App</option> */}
                    <option value="Web App">Web App</option>
                  </select>
                </div>
              </div>

              <div className="col-md-8">
                <div className="form-group mt-3  ">
                  <label htmlFor="cancel_reason">Cancellation Reason</label>
                  <input
                    name="cancel_reason"
                    className={`form-control`}
                    type="text"
                    value={cancelledReason}
                    onChange={(e)=>{
                      setCancelledReason(e.target.value)
                    }}

                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={Boolean(loading)}
                  onClick={() => {
                  
                    handleCancelAuthorized();
                  }}
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
        </ModalBody>
      </Modal>
      <Modal isOpen={editAuthorized} show={editAuthorized.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setEditAtuthorizedVoting(false);
          }}
        >
          Edit Authorization
        </ModalHeader>
        <ModalBody>
          <EditAuthorization
            setEditAtuthorizedVoting={setEditAtuthorizedVoting}
          />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal
        isOpen={viewAuthorizedData}
        show={viewAuthorizedData.toString()}
        size="xl"
      >
        <ModalHeader
          toggle={() => {
            setViewAuthorized(false);
          }}
        >
          View Authorization
        </ModalHeader>
        <ModalBody>
          <ViewAuthorized />
        </ModalBody>
      </Modal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="btn btn-primary btn-sm ml-2"
                    // style={{ marginTop: ' 30px' }}
                    onClick={() => {
                      setAddAuthorization(true);
                    }}
                  >
                    Add Authorized
                  </button>
                </div>
                <div className="d-flex ">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={compnyDropDownOptions}
                        isLoading={!compnyDropDownOptions?.length}
                        onChange={(selected) => {
                          if (selected?.value) {
                            setSelectedCompanny(selected?.value);
                            setSelectedElection("");
                          } else {
                            setSelectedCompanny("");
                            setSelectedElection("");
                          }
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Company And Election Id For Getting Data
                        </small>
                      )}
                      <div>
                        <button
                          className="btn btn-primary btn-sm ml-2 mt-4"
                          onClick={() => {
                            handleGenerateData();
                          }}
                          disabled={
                            !selectedCompany ||
                            loadingListing ||
                            !selectedElection
                          }
                        >
                          {loadingListing ? "...Loading" : "Generate Data"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Election id</label>
                      <Select
                        options={electionIdOptions}
                        isLoading={!electionIdOptions?.length}
                        value={electionIdOptions?.filter(
                          (option) => option.value === selectedElection
                        )}
                        onChange={(selected) => {
                          if (selected?.value) {
                            setSelectedElection(selected?.value);
                          } else {
                            setSelectedElection("");
                          }
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />

                      <div></div>
                    </div>
                  </div>

                  <div className="btn-group"></div>
                </div>
              </div>
              {loadingListing === true && <Spinner />}
              {loadingListing === false && directorVotin.length !== 0 && (
                <div className="table-responsive">
                  <TableWrapper className="table  ">
                    <thead>
                      <tr>
                        <th>ELECTION ID</th>
                        <th>AUTHORIZED ID </th>
                        <th>AUTHORIZED NAME </th>
                        <th>METHOD</th>
                        <th>NO OF SHARES</th>
                        <th>TYPES </th>

                        <th style={{ maxWidth: "80px" }}>Action</th>
                      </tr>
                    </thead>

                    <tbody>{displaydirectorVotinPerPage}</tbody>
                  </TableWrapper>
                  <center className="d-flex justify-content-center py-3">
                    <nav className="pagination">
                      <ReactPaginate
                        previousLabel="Previous"
                        nextLabel="Next"
                        pageCount={pageCount}
                        onPageChange={changePage}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                        containerClassName={"pagination"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        disabledClassName={"disabled"}
                        pageLinkClassName={"page-link"}
                        pageClassName={"page-item"}
                        activeClassName={"page-item active"}
                        activeLinkClassName={"page-link"}
                      />
                    </nav>
                  </center>
                </div>
              )}
              {loadingListing === false && directorVotin.length === 0 && (
                <p className="text-center">
                  <b> Authorization Data not available</b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
const TableWrapper = styled.table`
  .table td::nth-last-child(8) {
    max-width: 80px !important;
  }
`;
const AiOutlineSendWraper = styled(AiOutlineSend)`
  &:active {
    outline: none;
  }
  &:focus {
    outline: none;
  }
`;
