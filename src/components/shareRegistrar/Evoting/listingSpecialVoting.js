import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";

import Select from "react-select";
import { getAllEventData } from "../../../store/services/company.service";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import {  getPaginatedSepecialResolutionData, getPaginatedSepecialResolutionListing, getSpecialAgandabyEventid } from "store/services/evoting.service";

import Spinner from "components/common/spinner";

import styled from "styled-components";
import Dropdown from "components/common/dropdown";
import { AddSpecialVoting } from "./addSpecialResolutionData";
import { EditCanidateVoting } from "./editCanidateVoting";
import { ViewSpecialResolutionData } from "./viewSpecialResolutionData";
import { EditSpecialResolutionData } from "./editSpecialResolutionData";
import { getCompanies } from "../../../store/services/company.service";
import { darkStyle } from "components/defaultStyles";
import ReactPaginate from "react-paginate";

import moment from "moment";
export default function ListingSpecialVoting() {
  const baseEmail = sessionStorage.getItem("email") || "";




const [loadingListing, setLoadingListing] = useState(false)
const [specialVoting, setSpecialVoting] = useState(false)
const [editSpecialvoting, setEditSpecialVoting] = useState(false)
const [viewSpecialVotingListing, setViewSpecialVotingListing] = useState(false)
const [allCompanies, setAllCompanies] = useState([])
const [EventIdOptions, setEventIdOptions] = useState([])
const [AllEventData, setAllEventData]= useState([])
const [selectedEventId, setSelectedEventId]= useState('');
const [selectedCompany, setSelectedCompanny] = useState('')
const [compnyDropDownOptions, setCompanyDropDownOptions] = useState([])
  // new pagination end

  let history = useHistory();
  /*  Pagination Code Start  */
  const [currentPage, setCurrentPage] = useState();
  const [nextPage, setNextPage] = useState();
  const [prevPage, setPrevPage] = useState();
  const [hasNextPage, setHasNextPage] = useState();
  const [hasPrevPage, setHasPrevPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [criteria, setCriteria] = useState();
  const [totalRecords, setTotalRecords] = useState();
  /*  ---------------------  */
  const [directorVotin, setdirectorVotins] = useState([])
  const [pageNumber, setPageNumber] = useState(0);
  
  const specialVotingPerPage = 10;
  const pagesVisited = pageNumber * specialVotingPerPage;
  const pageCount = Math.ceil(directorVotin.length / specialVotingPerPage);
 
  const changePage = ({ selected }) => {
      setPageNumber(selected);
    };
 
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
        setAllCompanies(companiesDatas);
        setCompanyDropDownOptions(companiesDatas)
      }
    } catch (error) {
      // setCompanies_data_loading(false);
    }
  };
  const getMeetingData = async () => {
    try {
      const response = await getAllEventData(
        baseEmail,
      );
      if (response.status === 200) {

        const options = response.data.data.map((item) => {
            let label = `${item.statutory_event_id} - ${item.title}`;
            return { label: label, value: item?.statutory_event_id, companyCode: item?.company_code };
        });
        setAllEventData(options)
    
      }
    } catch (error) {
    //   setIsLoadingCompany(false);
    }
  };
  useEffect(() => {
    getMeetingData();
    getAllCompanies()
  
  }, []);


  const displaydirectorVotinPerPage = directorVotin.slice(pagesVisited, pagesVisited + specialVotingPerPage).map((item, i) => (
    <tr key={i}>
      {/* <td>{item?.Type || ''}</td> */}
      <td>{item.meeting_id || ''}</td>
      <td>{item?.item_id}</td>
      <td>{ allCompanies?.find(ite => ite?.value == item?.company_code)?.label || ''}</td>
      <td>{item?.agenda_title || ''}</td>
      {/* <td>{item?.agenda_item || ''}</td> */}
      <td >{moment(item?.agenda_from )?.format("YYYY-MM-DD")|| ''}</td>
      <td>{moment(item?.agenda_to)?.format("YYYY-MM-DD") || ''}</td>
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
              const obj = JSON.parse(JSON.stringify(item));
              sessionStorage.setItem(
                "selectedSpecialVoting",
                JSON.stringify(obj)
              );
              setViewSpecialVotingListing(true)
            }}
          ></i>
          <UncontrolledTooltip placement="top" target="RequirmentView">
            {"View Special Resolution Detail"}
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
                "selectedSpecialVoting",
                JSON.stringify(obj)
              );
              setEditSpecialVoting(true)
            }}
          ></i>
          <UncontrolledTooltip placement="top" target="directorEdit">
            {"Edit Special Resolution Detail"}
          </UncontrolledTooltip>
        </>

      </td>

    </tr>
  ));
 
  const handleGenerateData = async()=>{
    setLoadingListing(true);
    try {
      const response = await getPaginatedSepecialResolutionListing(
        baseEmail,
        "1",
        "code",
        selectedCompany
        
      );
      if (response.status === 200) {
       
        const parents = response.data.data.docs ? response.data.data.docs : [];
        //const filterData = parents?.filter((item)=>item?.company_code==selectedCompany)
        setdirectorVotins(parents);
        setLoadingListing(false);
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);
      }
    } catch (error) {
      setLoadingListing(false);
    }
  
  }
  const handleNextPage = async () => {
    setLoadingListing(true);
    try {
      //for paginated companies
      const response = await getPaginatedSepecialResolutionListing(
        baseEmail,
        nextPage,
        "code",
        selectedCompany,
      );
      // console.log("Paginated Response => ", response.data.data);
      if (response.status === 200) {
        // console.log("Paginated Companies? => ", response)
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);

        const parents = response.data.data.docs ? response.data.data.docs : [];

        setdirectorVotins(parents);
        setLoadingListing(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setLoadingListing(false);
    }
  };

  const handlePrevPage = async () => {
    setLoadingListing(true);
    try {
      //for paginated companies
      const response = await getPaginatedSepecialResolutionListing(
        baseEmail,
        prevPage,
        "code",
        selectedCompany
      );
      // console.log("Paginated Response => ", response.data.data);
      if (response.status === 200) {
        // console.log("Paginated Companies? => ", response)
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);

        // const parents = response.data.data.docs;
        const parents = response.data.data.docs ? response.data.data.docs : [];

        //   const companies_dropdowns = response.data.data.docs.map((item) => {
        //     let label = `${item.code} - ${item.company_name}`;
        //     return { label: label, value: item.code };
        //   });
        //   const obj = {label: 'Not Applicable', value:'N/A'};
        //   companies_dropdowns.push(obj)
        // setCompanies_dropdown(companies_dropdowns);
        setdirectorVotins(parents);
        setLoadingListing(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setLoadingListing(false);
    }
  };
  
  useEffect(()=>{
    if(selectedCompany){
     const filterData =   AllEventData?.filter((item)=>item?.companyCode==selectedCompany);
 
  setEventIdOptions(filterData)
    }
  }, [selectedCompany])  
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Special Resolution Listing</h6>
        <Breadcrumb title="Special Resolution Listing" parent="Election" />
      </div>
      {/* Add Modal */}
      <Modal isOpen={specialVoting} show={specialVoting.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setSpecialVoting(false);
          }}
        >
         Add Sepecial Resolution
        </ModalHeader>
        <ModalBody>
          <AddSpecialVoting setSpecialVoting={setSpecialVoting} />
        </ModalBody>
      </Modal>
    
      <Modal isOpen={editSpecialvoting} show={editSpecialvoting.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setEditSpecialVoting(false);
          }}
        >
         Edit Special Resolution
        </ModalHeader>
        <ModalBody>
          <EditSpecialResolutionData allCompanies={allCompanies}  setEditSpecialVoting={setEditSpecialVoting} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewSpecialVotingListing} show={viewSpecialVotingListing.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewSpecialVotingListing(false);
          }}
        >
       View Special Resolution
        </ModalHeader>
        <ModalBody>
          <ViewSpecialResolutionData />
        </ModalBody>
      </Modal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
              <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <button
                  // style={{marginTop: '30px'}}
                      className="btn btn-primary btn-sm ml-2 "
                      onClick={() => {
                        setSpecialVoting(true)
                      }}
                    >
                      Add Special Resolution 
                    </button> 
                 
                  </div>
                <div className="d-flex">

                <div className="col-md-4" >
                  <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={compnyDropDownOptions}
                        isLoading={!compnyDropDownOptions?.length}
                        onChange={(selected) => {
                         if(selected?.value){
                          setSelectedCompanny(selected?.value)
                          setSelectedEventId('')
                         } 
                         else{
                          setSelectedCompanny('')
                          setSelectedEventId('')
                         }
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                         Select Company And Event Id For Getting Data
                        </small>
                      )}
                       <div>
                    
                    </div>
                    </div>
                    
                    </div>
                    <div className="col-md-4">
                    <div className="form-group">
                    <button
                      className="btn btn-primary btn-sm ml-2 mt-4"
                      onClick={() => {
                        handleGenerateData()
                      }}
                      disabled={!selectedCompany ||  loadingListing}
                    >

                    {loadingListing ? '...Loading' : 'Generate Data'} 
                    </button> 

                    </div>

                    </div>
                    {/* <div className="col-md-4" >
                  <div className="form-group">
                      <label htmlFor="searchTransaction">Meeting Id</label>
                      <Select
                        options={EventIdOptions}
                        isLoading={!EventIdOptions?.length}
                        value={EventIdOptions?.filter(
                          (option) => option.value === selectedEventId
                        )}
                        onChange={(selected) => {
                         if(selected?.value){
                          setSelectedEventId(selected?.value)
                         } 
                         else{
                          setSelectedEventId('')
                         }
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                    
                       <div>
                   
                    </div>
                    </div>
                    
                    </div> */}
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
                        <th> Meeting Id </th>
                        <th>Item Id</th>
                        <th>Company </th>
                        <th>Agenda Title</th>
                        <th>Agenda From</th>
                        <th>Agenda To </th>
                        <th style={{ maxWidth: '80px' }}>Action</th>

                      </tr>
                    </thead>

                    <tbody>{displaydirectorVotinPerPage}</tbody>
                  </TableWrapper>

                  <center className="d-flex justify-content-center py-3">
                    <nav className="pagination">
                      {/* <ReactPaginate
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
                      /> */}
                      {hasPrevPage && (
                          <button
                            className="btn btn-primary btn-sm mx-1"
                            onClick={() => handlePrevPage()}
                          >
                            <span>{"Prev"}</span>
                          </button>
                        )}
                        {hasNextPage && (
                          <button
                            className="btn btn-secondary btn-sm mx-1"
                            onClick={() => handleNextPage()}
                          >
                            <span>{"Next"}</span>
                          </button>
                        )}
                    </nav>
                  </center>
                  <p className="align-content-center text-center mx-2">
                      Page {currentPage} of {totalPages}
                    </p>
                    <p className="text-right mx-2">{totalRecords} Records</p>
                
                </div>
              )}
              {loadingListing === false && directorVotin.length === 0 && (
                <p className="text-center">
                  <b>Special Voting Data not available</b>
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