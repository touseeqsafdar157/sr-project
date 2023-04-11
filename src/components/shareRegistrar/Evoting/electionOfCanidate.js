import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";


import { useHistory } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";


import Spinner from "components/common/spinner";

import styled from "styled-components";

import { AddCanidateVoting } from "./addCanidateVoting";
import { EditCanidateVoting } from "./editCanidateVoting";
import { ViewCanidateVoting } from "./viewCanidatevoting";
import { getAllCandidateByElectionId, getAllElections, getCandidateByCompany, getPaginatedCanidateData } from "store/services/evoting.service";
import { getCompanies } from "../../../store/services/company.service";
import Select from "react-select";
import { darkStyle } from "components/defaultStyles";
import ReactPaginate from "react-paginate";

export default function ElectionOfCanidate() {
  const baseEmail = sessionStorage.getItem("email") || "";



  // new pagination server side

  const [canidateVoting, setcanidateVoting] = useState(false)
  const [editDirectorvoting, setEditDirectorVoting] = useState(false)
  const [setViewDirectorListing, setDirectorViewListing] = useState(false)
  const [loadingCanidate, setCanidteLoading] = useState(false)
  const [companyData, setCompanyData] = useState([])
  const [selectedCompany, setSelectedCompanny] = useState('')
  const [compnyDropDownOptions, setCompanyDropDownOptions] = useState([])
  const [companyLabel, setCompanyLabel] = useState('')
  const [ElectionIdDropdown, setElectionsDropDown] = useState([])
  const [selectedElectionId, setSelectedElectionId] = useState('')
  const [allElection, setAllelections] =  useState([])
  // new pagination end

  let history = useHistory();
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [directorVotin, setdirectorVotins] = useState([])
  const [pageNumber, setPageNumber] = useState(0);
  const electionOfCandidatePerPage = 10;
  const pagesVisited = pageNumber * electionOfCandidatePerPage;
  const pageCount = Math.ceil(directorVotin.length / electionOfCandidatePerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  const getAllCompanies = async () => {
    try {
      const response = await getCompanies(baseEmail);
      if (response.status === 200) {
        const optons = response.data.data.map((item) => {
          let label = `${item.code} - ${item.company_name}`;
          return { label: label, value: item.code, symbol: item?.symbol };
        });
        setCompanyData(optons);
        setCompanyDropDownOptions(optons)
      }
    } catch (error) {
    }
  };
  const getAllElectionData =async ()=>{
    try {
        const response = await getAllElections(baseEmail);
        if (response.status === 200) {
            const parents = response.data.data;
            const options = response.data.data.map((item) => {
                let label = `${item.election_id} - ${item.symbol}`;
                return { label: label, value: item.election_id, companyCode: item?.company_code, term:item?.term };
            });
            setAllelections(options);
        }
    } catch (error) {
    }
   }
  useEffect(() => {
    getAllElectionData()
    getAllCompanies()
  }, []);
useEffect(()=>{
  if(selectedCompany){
    const filterData = allElection?.filter((item)=>item?.companyCode == selectedCompany)
    setElectionsDropDown(filterData)
  }

}, [selectedCompany])

  const displaydirectorVotinPerPage = directorVotin.slice(pagesVisited, pagesVisited + electionOfCandidatePerPage).map((item, i) => (
    <tr key={i}>
      {/* <td>{item?.Type || ''}</td> */}
      <td>{item.election_id || ''}</td>
      <td>{item?.candidate_id || ''}</td>

      <td>{item?.candidate_name || ''}</td>

      <td>{companyData?.find(ite => ite?.value == item?.company_code)?.label || ''}</td>
      {/* <td>{item?.candidate_name || ''}</td> */}
      <td>{item?.term || ''}</td>
      <td>{item?.number_of_votes || ''}</td>

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
                "selectedCanidate",
                JSON.stringify(obj)
              );
              setCompanyLabel(companyData?.find(ite => ite?.value == item?.company_code)?.label || '')
              setDirectorViewListing(true)
            }}
          ></i>
          <UncontrolledTooltip placement="top" target="RequirmentView">
            {"View Canidate's Detail"}
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
                "selectedCanidate",
                JSON.stringify(obj)
              );
              setCompanyLabel(companyData?.find(ite => ite?.value == item?.company_code)?.label || '')
              setEditDirectorVoting(true)
            }}
          ></i>
          <UncontrolledTooltip placement="top" target="directorEdit">
            {"Edit Canidate's Detail"}
          </UncontrolledTooltip>
        </>

      </td>

    </tr>
  ));

  const handleGenerateData = async () => {
    setCanidteLoading(true);
    try {
if(selectedElectionId){
  const response = await getAllCandidateByElectionId(
      baseEmail,
      selectedElectionId,
      selectedCompany
    );
    if (response.status === 200) {

      const parents = response.data.data ? response.data.data : [];

    setdirectorVotins(parents);
    setCanidteLoading(false);
  }
}

else{
  const response = await getCandidateByCompany(
    baseEmail,
    selectedCompany
  );
  if (response.status === 200) {

    const parents = response.data.data ? response.data.data : [];

    setdirectorVotins(parents);
    setCanidteLoading(false);
  }
}
    


    } catch (error) {
      setCanidteLoading(false);
    }

  }




  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Candidates  Listing</h6>
        <Breadcrumb title="Candidates  Listing" parent="Election" />
      </div>
      {/* Add Modal */}
      <Modal isOpen={canidateVoting} show={canidateVoting.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setcanidateVoting(false);
          }}
        >
          Add Candidates 
        </ModalHeader>
        <ModalBody>
          <AddCanidateVoting setcanidateVoting={setcanidateVoting} />
        </ModalBody>
      </Modal>

      <Modal isOpen={editDirectorvoting} show={editDirectorvoting.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setEditDirectorVoting(false);
          }}
        >
          Candidate Edit
        </ModalHeader>
        <ModalBody>
          <EditCanidateVoting companyLabel={companyLabel} setEditDirectorVoting={setEditDirectorVoting} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={setViewDirectorListing} show={setViewDirectorListing.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setDirectorViewListing(false);
          }}
        >
          Candidate View
        </ModalHeader>
        <ModalBody>
          <ViewCanidateVoting companyLabel={companyLabel}/>
        </ModalBody>
      </Modal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button
                      className="btn btn-primary btn-sm mr-4 mt-3"
                      onClick={() => {
                        setcanidateVoting(true)
                      }}
                    >
                      Add Candidate
                    </button>

                  </div>
              <div className="card-header">
                <div className="d-flex">

                  <div className="col-md-5" >
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={compnyDropDownOptions}
                        isLoading={!compnyDropDownOptions?.length}
                        onChange={(selected) => {
                          if (selected?.value) {
                            setSelectedCompanny(selected?.value)
                            setSelectedElectionId('')
                          }
                          else {
                            setSelectedCompanny('')
                            setSelectedElectionId('')
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
                          className="btn btn-primary btn-sm ml-2 mt-4"
                          onClick={() => {
                            handleGenerateData()
                          }}
                          disabled={!selectedCompany || loadingCanidate}
                        >

                          {loadingCanidate ? '...Loading' : 'Generate Data'}
                        </button>
                      </div>
                    </div>

                  </div>
                  <div className="col-md-4" >
                  <div className="form-group">
                      <label htmlFor="searchTransaction">Election Id</label>
                      <Select
                        options={ElectionIdDropdown}
                        isLoading={!ElectionIdDropdown?.length}
                        value={ElectionIdDropdown?.filter(
                          (option) => option.value === selectedElectionId
                        )}
                        onChange={(selected) => {
                         if(selected?.value){
                          setSelectedElectionId(selected?.value)
                         } 
                         else{
                          setSelectedElectionId('')
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
              {loadingCanidate === true && <Spinner />}
              {loadingCanidate === false && directorVotin.length !== 0 && (
                <div className="table-responsive">
                  <TableWrapper className="table  ">
                    <thead>
                      <tr>
                        <th>ELECTION ID </th>
                        <th>CANIDATE ID</th>
                        <th>CANIDATE NAME</th>
                        <th>COMPNAY CODE</th>

                        <th>TERM </th>
                        <th>NUMBER OF VOTES</th>

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

                </div>
              )}
              {loadingCanidate === false && directorVotin.length === 0 && (
                <p className="text-center">
                  <b>Candidates Data not available</b>
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