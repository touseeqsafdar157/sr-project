import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useSelector } from "react-redux";

import { filterData, SearchType } from "filter-data";

import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";

import Spinner from "components/common/spinner";

import { getPaginatedRequirmentData } from "../../../store/services/company.service";
import { ViewDirectorVoting } from "./viewDirectorVoting";
import styled from "styled-components";
import Dropdown from "components/common/dropdown";
import { AddDirectorVoting } from "./addDirectorVoting";
import { AddSpecialVoting } from "./addSpecialResolutionData";
import { EditDirectorVoting } from "./editDirectorVoting";
import { AddCanidateVoting } from "./addCanidateVoting";
import { EditCanidateVoting } from "./editCanidateVoting";
import { ViewCanidateVoting } from "./viewCanidatevoting";
import { AddSpecialResolution } from "./addSpecialVotingData";
// import { EditSpecialResolution } from "./EditSpecialVotingData";
import { EditSpecialVotingData } from "./EditSpecialVotingData";
import ReactPaginate from "react-paginate";

import { ViewSpecialResolutions } from "./ViewSpecialVotingData";
import {
  getPaginatedSepecialResolutionData,
  getSpecialAgandabyCompanyCode,
} from "store/services/evoting.service";
import { EvotingResult } from "./eVotingResult";
import { ViewSpecialVotingData } from "./ViewSpecialVotingData";
import { getAllAgendaData } from "store/services/evoting.service";
import Select from "react-select";
import { darkStyle } from "components/defaultStyles";
import { getCompanies } from "../../../store/services/company.service";
import { getAllSpecialResolutionData } from "store/services/evoting.service";
import { getSpecialResolutionByAgendaId } from "store/services/evoting.service";
import { getShareHoldersByCompany } from "store/services/shareholder.service";
export default function SpecialResolutionListing() {
  const baseEmail = sessionStorage.getItem("email") || "";

  // new pagination server side
  const [currentPage, setCurrentPage] = useState();
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState();
  const [hasNextPage, setHasNextPage] = useState();
  const [hasPrevPage, setHasPrevPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [loadingListing, setLoadingListing] = useState(false);
  const [addSpecialResolution, setAddSpecialResolution] = useState(false);
  const [editSpecialResolution, setEditSpecialResolution] = useState(false);
  const [viewResolution, setViewResolution] = useState(false);
  const [eVotingResult, setEvotingResult] = useState(false);
  const [allShareHolder,setAllShareHolder]=useState([])

  // const [getAllAgandaOptions, setAllAgandaOptions] = ([])
  const [filterAgandaOptions, setFilterAgandaOptions] = useState([]);
  const [selectedAganda, setSelectedAganda] = useState("");
  const [selectedCompany, setSelectedCompanny] = useState("");
  const [compnyDropDownOptions, setCompanyDropDownOptions] = useState([]);
  const [directorVotin, setdirectorVotins] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const ResolutionPerPage = 10;
  const pagesVisited = pageNumber * ResolutionPerPage;
  const pageCount = Math.ceil(directorVotin.length / ResolutionPerPage);
  // new pagination end

  let history = useHistory();
  /*  Pagination Code Start  */
  /*  ---------------------  */

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  // const getPaginatedResolutionData = async (pagenum) => {
  //   try {
  //     setLoadingListing(true)
  //     const response = await getPaginatedSepecialResolutionData(
  //       baseEmail,
  //       pagenum,
  //       "",
  //       ""
  //       // "10",
  //       // search
  //     );
  //     if (response.status === 200) {
  //       setHasNextPage(response.data.data.hasNextPage);
  //       setHasPrevPage(response.data.data.hasPrevPage);
  //       setNextPage(response.data.data.nextPage);
  //       setPrevPage(response.data.data.prevPage);
  //       setCurrentPage(response.data.data.page);
  //       setTotalPages(response.data.data.totalPages);
  //       setTotalRecords(response.data.data.totalDocs);

  //       const parents = response.data.data.docs ? response.data.data.docs : [];

  //       setdirectorVotins(parents);
  //       setLoadingListing(false)
  //     }
  //   } catch (error) {
  //     setLoadingListing(false)
  //   }

  // };
  const getAllCompanies = async () => {
    // setCompanies_data_loading(true);
    try {
      const response = await getCompanies(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
        const companiesDatas = response.data.data.map((item) => {
          let label = `${item.code} - ${item.company_name}`;
          return { label: label, value: item.code };
        });
        setCompanyDropDownOptions(companiesDatas);
      }
    } catch (error) {}
  };
  // const getAllAgandaRecord = async () => {
  //   try {
  //     const response = await getAllSpecialResolutionData(baseEmail);
  //     if (response.status === 200) {
  //       const parents = response.data.data;
  //      console.log('response.data.data', response.data.data)
  //       setAllAgandaOptions(parents)
  //     }
  //   } catch (error) {
  //   }
  // };
  useEffect(() => {
    // getAllAgandaRecord();
    getAllCompanies();
    // getPaginatedResolutionData(nextPage);
  }, []);

  const displaydirectorVotinPerPage = directorVotin
    .slice(pagesVisited, pagesVisited + ResolutionPerPage)
    .map((item, i) =>
    
     (
      <tr key={i}>
       

        <td>{allShareHolder.find(x=>x.folio_number ==item?.folio_number )?.shareholder_name ||""}</td>
        
        <td>{item?.folio_number || ""}</td>
        <td>{item?.cast_type || ""}</td>
        <td>{item?.cast_through || ""}</td>
        
        

        <td style={{ maxWidth: "80px" }}>
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
                  "selectedResolution",
                  JSON.stringify(obj)
                );
                setViewResolution(true);
              }}
            ></i>
            <UncontrolledTooltip placement="top" target="RequirmentView">
              {"View Special Voting's Detail"}
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
                  "selectedResolution",
                  JSON.stringify(obj)
                );
                setEditSpecialResolution(true);
              }}
            ></i>
            <UncontrolledTooltip placement="top" target="directorEdit">
              {"Edit Special Voting's Detail"}
            </UncontrolledTooltip>
          </>
        </td>
      </tr>
    ));

  const handleGenerateData = async () => {
    // getDirectorsDataByCompanyCode(nextPage);
    setLoadingListing(true);
    try {
      const response = await getSpecialResolutionByAgendaId(
        baseEmail,
        selectedAganda
      );
      if (response.status === 200) {
        const parents = response.data.data ? response.data.data : [];
        const temp=parents.filter(item=>{
          return item.vote && item.vote !="Approved" && item.vote!="Disapproved"
        })
        const filterArray = temp?.filter(
          (item) => item?.agenda_id?.split("-")[1] == selectedCompany
        );
        setdirectorVotins(filterArray);
        setLoadingListing(false);
      }
    } catch (error) {
      setLoadingListing(false);
    }
  };
  const handleFilterData = async (code) => {
    const share_holder_response = await getShareHoldersByCompany(baseEmail, selectedCompany)
    if(share_holder_response.data.status ==200)
    {
      setAllShareHolder(share_holder_response.data.data)
    }
    const response = await getSpecialAgandabyCompanyCode(
      baseEmail,
      selectedCompany
    );
    const optons = response?.data?.data.map((item) => {
      let label = `${item?.item_id}`;
      return { label: label, value: item?.item_id };
    });

    setFilterAgandaOptions(optons);
  };
  useEffect(() => {
    if (selectedCompany) {
      handleFilterData(selectedCompany);
    }
  }, [selectedCompany]);

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Special Voting Listing</h6>
        <Breadcrumb title="Special Voting Listing" parent="Election" />
      </div>
      {/* Add Modal */}
      <Modal
        isOpen={addSpecialResolution}
        show={addSpecialResolution.toString()}
        size="xl"
      >
        <ModalHeader
          toggle={() => {
            setAddSpecialResolution(false);
          }}
        >
          Special Voting
        </ModalHeader>
        <ModalBody>
          <AddSpecialResolution
            setAddSpecialResolution={setAddSpecialResolution}
          />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={editSpecialResolution}
        show={editSpecialResolution.toString()}
        size="xl"
      >
        <ModalHeader
          toggle={() => {
            setEditSpecialResolution(false);
          }}
        >
          Voting Edit
        </ModalHeader>
        <ModalBody>
          <EditSpecialVotingData
            setEditSpecialResolution={setEditSpecialResolution}
          />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewResolution} show={viewResolution.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewResolution(false);
          }}
        >
          Voting View
        </ModalHeader>
        <ModalBody>
          <ViewSpecialVotingData />
        </ModalBody>
      </Modal>

      <Modal isOpen={eVotingResult} show={eVotingResult.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setEvotingResult(false);
          }}
        ></ModalHeader>
        <ModalBody>
          <EvotingResult setEvotingResult={setEvotingResult} />
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
                    // style={{marginTop: '30px'}}
                    onClick={() => {
                      setAddSpecialResolution(true);
                    }}
                  >
                    Add Special Voting
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
                            setSelectedAganda("");
                          } else {
                            setSelectedCompanny("");
                            setSelectedAganda("");
                          }
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Company And Agenda Id For Getting Data
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
                            !selectedAganda
                          }
                        >
                          {loadingListing ? "...Loading" : "Generate Data"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Agenda Id</label>
                      <Select
                        options={filterAgandaOptions}
                        isLoading={!filterAgandaOptions?.length}
                        value={filterAgandaOptions?.filter(
                          (option) => option.value === selectedAganda
                        )}
                        onChange={(selected) => {
                          if (selected?.value) {
                            setSelectedAganda(selected?.value);
                          } else {
                            setSelectedAganda("");
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
                        
                        <th>VOTER Name</th>
                        <th>FOLIO NUMBER</th>
                        <th>CAST TYPE</th>
                        <th>CAST THROUGH</th>  
                        <th>ACTIONS</th>
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
                  {/* <center className="d-flex justify-content-center py-3">
                    <nav className="pagination">
                      {hasPrevPage && (
                        <button
                          className="btn btn-primary btn-sm mx-1"
                          onClick={() => getPaginatedResolutionData(prevPage)}
                        >
                          <span>{"Prev"}</span>
                        </button>
                      )}
                      {hasNextPage && (
                        <button
                          className="btn btn-secondary btn-sm mx-1"
                          onClick={() => getPaginatedResolutionData(nextPage)}
                        >
                          <span>{"Next"}</span>
                        </button>
                      )}
                    </nav>
                  </center>
                  <p className="align-content-cente r text-center mx-2">
                    Page {currentPage} of {totalPages}
                  </p>
                  <p className="text-right mx-2">{totalRecords} Records</p> */}
                </div>
              )}
              {loadingListing === false && directorVotin.length === 0 && (
                <p className="text-center">
                  <b> Data not available</b>
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
