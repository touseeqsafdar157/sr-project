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
import { getAllElectionVotingData, getpaginatedElectionOfBoardData } from "store/services/evoting.service";
import { getPaginatedElectionsData } from "store/services/evoting.service";
import { AddElectionVoting } from "./AddElectionVoting";
import { EditElectionVoting } from "./EditElectionVoting";
import { ViewElectionVoting } from "./ViewElectionVoting";
import { getCompanies } from "../../../store/services/company.service";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { darkStyle } from "components/defaultStyles";
import { getAllElections } from "store/services/evoting.service";
export default function ListingofElection() {
  const baseEmail = sessionStorage.getItem("email") || "";



  // new pagination server side
  const [currentPage, setCurrentPage] = useState();
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState();
  const [hasNextPage, setHasNextPage] = useState();
  const [hasPrevPage, setHasPrevPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
const [loadingListing, setLoadingListing] = useState(false)
const [addElection, setAddElection] = useState(false)
const [editDirectorvoting, setEditDirectorVoting] = useState(false)
const [setViewDirectorListing, setDirectorViewListing] = useState(false)
const [loadingDirector, setLoadingDirector] = useState(false);
const [directorVotin, setdirectorVotins] = useState([ ])
const [allCompanies, setAllCompanies] = useState([])
const [pageNumber, setPageNumber] = useState(0);
const [companyLabel, setCompanyLabel] = useState('')
const [companyCode, setCompanyCode] = useState('')
  const electionVotingPerPage = 10;
  const pagesVisited = pageNumber * electionVotingPerPage;
  const pageCount = Math.ceil(directorVotin.length / electionVotingPerPage);
  const [selectedCompany, setSelectedCompanny] = useState('');
  const [allData, setAllData]= useState([])
  const [compnyDropDownOptions, setCompanyDropDownOptions] = useState([])
  const [electionIdOptions, setElectionIdOptons] = useState([]);
  const [selectedElection, setSelectedElection] = useState();
  const [allElectionData, setAllElectionsData] = useState([])
    const changePage = ({ selected }) => {
      setPageNumber(selected);
    };
  // new pagination end

  let history = useHistory();
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const getAllElectionsData = async () => {
    // setCompanies_data_loading(true);
    try {
      const response = await getAllElections(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
const options = response.data.data.map((item) => {
  let label = `${item.election_id} - ${item.symbol}`;
  return { label: label, value: item.election_id, companyCode: item?.company_code };
});
        setAllElectionsData(options)
        // setCompanyData(optons)  
      }
    } catch (error) {
    }
  };
  const getAllData = async () => {
    setLoadingDirector(true);
    try {
      const response = await getAllElectionVotingData(
        baseEmail,
        // "",
        // ""
      );
      if (response.status === 200) {
        // setHasNextPage(response.data.data.hasNextPage);
        // setHasPrevPage(response.data.data.hasPrevPage);
        // setNextPage(response.data.data.nextPage);
        // setPrevPage(response.data.data.prevPage);
        // setCurrentPage(response.data.data.page);
        // setTotalPages(response.data.data.totalPages);
        // setTotalRecords(response.data.data.totalDocs);

        const parents = response.data.data ? response.data.data : [];

        setAllData(parents);
        setLoadingDirector(false);
      }
    } catch (error) {
      setLoadingDirector(false);
    }
  };
  const getAllCompanies = async () => {
    // setCompanies_data_loading(true);
    try {
        const response = await getCompanies(baseEmail);
        if (response.status === 200) {
            const options = response.data.data.map((item) => {
                let label = `${item.code} - ${item.company_name}`;
                return { label: label, value: item.code };
            });
            setAllCompanies(options);
            setCompanyDropDownOptions(options)
        }
    } catch (error) {
    }
};
  useEffect(() => {
    getAllElectionsData()
    getAllCompanies();
    getAllData();
  }, []);

  const displaydirectorVotinPerPage = directorVotin.slice(pagesVisited, pagesVisited + electionVotingPerPage).map((item, i) => (
    <tr key={i}>
      <td>{item?.voting_id || ''}</td>
      <td>{ allCompanies?.find(ite => ite?.value == item?.company_code)?.label || ''}</td>
      <td>{item?.election_id || ''}</td>
      <td>{item?.voter_id || ''}</td>
      <td>{item?.folio_number || ''}</td>
     {/* <td>{item?.number_of_directors|| ''}</td> */}

      <td style={{ maxWidth: '80px' }}>

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
              setCompanyLabel(allCompanies?.find(ite => ite?.value == item?.company_code)?.label || '')
              const obj = JSON.parse(JSON.stringify(item));
              sessionStorage.setItem(
                "selectedElection",
                JSON.stringify(obj)
              );
              
              setDirectorViewListing(true)
            }}
          ></i>
          <UncontrolledTooltip placement="top" target="RequirmentView">
            {"View Election of Voting Detail"}
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
                "selectedElection",
                JSON.stringify(obj)
              );
              setEditDirectorVoting(true)
            }}
          ></i>
          <UncontrolledTooltip placement="top" target="directorEdit">
            {"Edit Election of Voting Detail"}
          </UncontrolledTooltip>
        </>

      </td>

    </tr>
  ));
 
  const handleGenerateData = async()=>{
    setLoadingListing(true);
    try {
      
     const filterData =  allData?.filter((item)=>item?.folio_number.split('-')[0]==selectedCompany && item?.election_id==selectedElection )
     setdirectorVotins(filterData)
     setLoadingListing(false);
    } catch (error) {
      setLoadingListing(false);
    }
  
  }
useEffect(()=>{
if(selectedCompany){
const filterOptions = allElectionData?.filter((item)=>item?.companyCode==selectedCompany)
setElectionIdOptons(filterOptions)
}
},[selectedCompany])

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Election Voting Listing</h6>
        <Breadcrumb title="Election Voting Listing" parent="Election" />
      </div>
      {/* Add Modal */}
      <Modal isOpen={addElection} show={addElection.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setAddElection(false);
          }}
        >
        Add  Election Voting
        </ModalHeader>
        <ModalBody>
          <AddElectionVoting setAddElection={setAddElection} />
        </ModalBody>
      </Modal>
    
      <Modal isOpen={editDirectorvoting} show={editDirectorvoting.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setEditDirectorVoting(false);
          }}
        >
           Edit Election Voting
        </ModalHeader>
        <ModalBody>
          <EditElectionVoting allCompanies={allCompanies} companyCode={companyCode} companyLabel={companyLabel}  setEditDirectorVoting={setEditDirectorVoting} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={setViewDirectorListing} show={setViewDirectorListing.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setDirectorViewListing(false);
          }}
        >
          View Election Voting
        </ModalHeader>
        <ModalBody>
          <ViewElectionVoting />
        </ModalBody>
      </Modal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <button
                      className="btn btn-primary btn-sm ml-2"
                      onClick={() => {
                        setAddElection(true)
                      }}
                    >
                      Add Election Voting
                    </button> 
                 
                  </div>
                <div className="d-flex ">

                <div className="col-md-5" >
                  <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={compnyDropDownOptions}
                        isLoading={!compnyDropDownOptions?.length}
                        onChange={(selected) => {
                         if(selected?.value){
                          setSelectedCompanny(selected?.value)
                          setSelectedElection('')
                         } 
                         else{
                          setSelectedCompanny('')
                          setSelectedElection('')
                         }
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Company For Getting Data
                        </small>
                      )}
                       <div>
                    <button
                      className="btn btn-primary btn-sm ml-2 mt-3"
                      onClick={() => {
                        handleGenerateData()
                      }}
                      disabled={!selectedCompany ||  loadingListing}
                    >

                    {loadingListing ? '...Loading' : 'Generate Data'} 
                    </button> 
                    </div>
                    </div>
                    
                    </div>
                    <div className="col-md-4" >
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
                            setSelectedElection(selected?.value)
                          }
                          else {
                            setSelectedElection('')
                          }
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                    
                      <div>

                      </div>
                    </div>

                  </div>
                  <div className="btn-group">
                
                  </div>


                 
                </div>

              </div>
              {loadingListing === true && <Spinner />}
              {loadingListing === false && directorVotin.length !== 0 && (
                <div className="table-responsive">
                  <TableWrapper className="table  ">
                    <thead>
                      <tr>
                        {/* <th>TYPE</th> */}
                        <th>ID </th>
                        <th>COMPNAY</th>
                        <th>ELECTION ID</th>
                        <th>VOTER ID </th>
                        <th>FOLIO NUMBER</th>
                        {/* <th>Notify Days </th> */}
                        <th style={{ maxWidth: '80px' }}>Action</th>

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
                          onClick={() => getPaginatedElectionData(prevPage)}
                        >
                          <span>{"Prev"}</span>
                        </button>
                      )}
                      {hasNextPage && (
                        <button
                          className="btn btn-secondary btn-sm mx-1"
                          onClick={() => getPaginatedElectionData(nextPage)}
                        >
                          <span>{"Next"}</span>
                        </button>
                      )}
                    </nav>
                  </center>
                  <p className="align-content-center text-center mx-2">
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

.table td::nth-last-child(8){
  max-width: 80px !important;
}
`;