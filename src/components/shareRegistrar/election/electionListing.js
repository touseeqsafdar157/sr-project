import React, { Fragment, useState } from "react";
import logo from "../../../assets/images/election-card-icon.svg";
import ReactPaginate from "react-paginate";
import Breadcrumb from "../../common/breadcrumb";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import AddElection from "./addElection";
import EditElection from "./editElection";
import {
  getFoundObject,
  getvalidDateDMMMY,
} from "../../../utilities/utilityFunctions";
import ViewElection from "./viewElection";
import Spinner from "components/common/spinner";
import AddProxy from "../proxy/addProxy";
import CastVote from "../voteCasting/castVote";

export default function ElectionListin() {
  const {
    elections_data_loading,
    elections_data,
    elections_dropdown,
    elections_dropdown_loading,
  } = useSelector((data) => data.Elections);
  const { companies_data_loading, companies_data, companies_dropdown } =
    useSelector((data) => data.Companies);
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [addProxy, setAddProxy] = useState(false);
  const [castVote, setCastVote] = useState(false);
  const [viewPage, setViewPage] = useState(false);
  const [searchedElections, setSearchedElections] = useState([]);

  const [search, setSearch] = useState("");
  let history = useHistory();
  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const electionsPerPage = 10;
  const pagesVisited = pageNumber * electionsPerPage;
  const totalnumberofPages = 100;
  const displayElectionsPerPage = !search
    ? elections_data
        .sort((a, b) => {
          if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
            return -1;
          if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
            return 1;
          return 0;
        })
        .slice(pagesVisited, pagesVisited + electionsPerPage)
        .map((item, i) => (
          <div key={i} className="col-md-3 col-sm-1">
            <div className="election-card card card-absolute bg-secondary border border-rounded">
              <div className="card-header bg-primary election-header">
                <h5>
                  {!companies_data_loading
                    ? companies_data.find(
                        (comp) => comp.code === item.company_code
                      )?.company_name
                    : "Loading..."}
                </h5>
              </div>
              <div className="card-body bg-secondary">
                <span className="m-2">
                  <ul style={{ listStyleType: "none" }}>
                    <li>
                      <small className="d-block">Election ID</small>
                      <strong>{item.election_id}</strong>
                    </li>
                    <li>
                      <small className="d-block">Directors</small>
                      <strong>{item.number_of_directors}</strong>
                    </li>
                    <li>
                      <small className="d-block">Candidates</small>
                      <strong>{item.number_of_candidates}</strong>
                    </li>
                    <li>
                      <small className="d-block">Election Period</small>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                          <small className="d-block">From</small>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6">
                          <small className="d-block">To</small>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                          <strong>
                            {getvalidDateDMMMY(item.election_from)}
                          </strong>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6">
                          <strong>{getvalidDateDMMMY(item.election_to)}</strong>
                        </div>
                      </div>
                    </li>
                    <li>
                      <small className="d-block">Application Period</small>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                          <small className="d-block">From</small>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6">
                          <small className="d-block">To</small>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-lg-6">
                          <strong>
                            {getvalidDateDMMMY(item.application_from)}
                          </strong>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6">
                          <strong>
                            {getvalidDateDMMMY(item.application_to)}
                          </strong>
                        </div>
                      </div>
                    </li>
                  </ul>
                </span>
                <img
                  src={logo}
                  className="election-image"
                  alt="election logo"
                  width={"130"}
                />
                <div className="d-flex justify-content-start">
                  <div className="mx-1">
                    <button
                      className="btn btn-primary p-0 rounded-circle"
                      id={`editElection${item.election_id}`}
                    >
                      <i
                        className="fa fa-pencil election-control-icons"
                        onClick={() => {
                          // for modal
                          setViewEditPage(true);
                          sessionStorage.setItem(
                            "selectedElection",
                            JSON.stringify({
                              ...item,
                              company_code: getFoundObject(
                                companies_dropdown,
                                item.company_code
                              ),
                            })
                          );
                        }}
                      ></i>
                      <UncontrolledTooltip
                        placement="top"
                        target={`editElection${item.election_id}`}
                      >
                        {"Edit Election"}
                      </UncontrolledTooltip>
                    </button>
                  </div>
                  <div className="mx-1">
                    <button
                      className="btn btn-success p-0 rounded-circle"
                      id={`viewElection${item.election_id}`}
                    >
                      <i
                        className="fa fa-eye election-control-icons"
                        onClick={() => {
                          // for modal
                          setViewPage(true);
                          sessionStorage.setItem(
                            "selectedElection",
                            JSON.stringify({
                              ...item,
                              company_code: getFoundObject(
                                companies_dropdown,
                                item.company_code
                              ),
                              election_option: getFoundObject(
                                elections_dropdown,
                                item.election_id
                              ),
                            })
                          );
                        }}
                      ></i>
                      <UncontrolledTooltip
                        placement="top"
                        target={`viewElection${item.election_id}`}
                      >
                        {"View Election's Detail"}
                      </UncontrolledTooltip>
                    </button>
                  </div>
                  <div className="mx-1">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={(e) => {
                        sessionStorage.setItem(
                          "selectedElection",
                          JSON.stringify({
                            ...item,
                            company_code: getFoundObject(
                              companies_dropdown,
                              item.company_code
                            ),
                            election_option: getFoundObject(
                              elections_dropdown,
                              item.election_id
                            ),
                          })
                        );
                        setCastVote(true);
                      }}
                    >
                      Cast Vote
                    </button>
                  </div>
                  <div className="mx-1">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={(e) => {
                        sessionStorage.setItem(
                          "selectedElection",
                          JSON.stringify({
                            ...item,
                            company_code: getFoundObject(
                              companies_dropdown,
                              item.company_code
                            ),
                          })
                        );
                        setAddProxy(true);
                      }}
                    >
                      Add Proxy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
    : searchedElections
        .sort((a, b) => {
          if (
            new Date(b.created_at).getTime() < new Date(a.created_at).getTime()
          )
            return -1;
          if (
            new Date(b.created_at).getTime() > new Date(a.created_at).getTime()
          )
            return 1;
          return 0;
        })
        .slice(pagesVisited, pagesVisited + electionsPerPage)
        .map((item, i) => (
          <tr key={i}>
            <td>{item.disburse_id}</td>
            <td>{item.disburse_date}</td>
            <td>{item.folio_no}</td>
            <td>{item.amount_disbursed}</td>
            <td>{item.status}</td>
            {/* <td>
              <i
                className="fa fa-pencil"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "#FF9F40",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // for modal
                  setViewEditPage(true);
                  sessionStorage.setItem(
                    "selectedDisbursement",
                    JSON.stringify(item)
                  );
                }}
              ></i>
            </td> */}
          </tr>
        ));
  const pageCount = !search
    ? Math.ceil(elections_data.length / electionsPerPage)
    : Math.ceil(searchedElections.length / electionsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  return (
    <Fragment>
      <Breadcrumb title="Election Listing" parent="Election" />

      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Election
        </ModalHeader>
        <ModalBody>
          <AddElection setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Election Edit
        </ModalHeader>
        <ModalBody>
          <EditElection setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewPage} show={viewPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewPage(false);
          }}
        >
          View Election Details
        </ModalHeader>
        <ModalBody>
          <ViewElection setViewPage={setViewPage} />
        </ModalBody>
      </Modal>

      {/* Add Proxy Modal */}
      <Modal isOpen={addProxy} show={addProxy.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setAddProxy(false);
          }}
        >
          Add Proxy
        </ModalHeader>
        <ModalBody>
          <AddProxy setViewAddPage={setAddProxy} />
        </ModalBody>
      </Modal>

      {/* Cast Vote */}
      <Modal isOpen={castVote} show={castVote.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setCastVote(false);
          }}
        >
          Cast Vote
        </ModalHeader>
        <ModalBody>
          <CastVote setViewAddPage={setCastVote} />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5>Election Listing</h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // for modal
                    setViewAddPage(true);
                  }}
                >
                  <i className="fa fa-plus mr-1"></i> Add Election
                </button>
              </div>
              {elections_data_loading === true && <Spinner />}
              {elections_data.length !== 0 && (
                <div>
                  <div className="row mx-2">{displayElectionsPerPage}</div>
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
              {elections_data_loading === false && elections_data.length === 0 && (
                <p className="text-center">
                  <b>Election Data not available</b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
