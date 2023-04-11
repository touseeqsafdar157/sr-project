import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";

import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import Select from "react-select";
import { darkStyle } from "components/defaultStyles";

import Spinner from "components/common/spinner";

import { ViewDirectorVoting } from "./viewDirectorVoting";
import styled from "styled-components";
import { AddDirectorVoting } from "./addDirectorVoting";
import { EditDirectorVoting } from "./editDirectorVoting";
import { getCompanies } from "../../../store/services/company.service";
import { getDirectorsDataByCompanyCode } from "store/services/evoting.service";
import ReactPaginate from "react-paginate";
import moment from "moment";

export default function EvotingListing() {
  const baseEmail = sessionStorage.getItem("email") || "";



  // new pagination server side
 
const [loadingListing, setLoadingListing] = useState(false)
const [addDirectorVoting, setAddDirectorVoting] = useState(false)
const [editDirectorvoting, setEditDirectorVoting] = useState(false)
const [setViewDirectorListing, setDirectorViewListing] = useState(false)
const [loadingDirector, setLoadingDirector] = useState(false);
const [companyData, setCompanyData] = useState([])
const [selectedCompany, setSelectedCompanny] = useState('')
const [compnyDropDownOptions, setCompanyDropDownOptions] = useState([])
  // new pagination end

  const [directorVotin, setdirectorVotins] = useState([])
  const [pageNumber, setPageNumber] = useState(0);
  const electionVotingPerPage = 10;
  const pagesVisited = pageNumber * electionVotingPerPage;
  const pageCount = Math.ceil(directorVotin.length / electionVotingPerPage);
 const [companyLabel, setCompanyLabel] = useState('')
 const [companyCode, setCompanyCode] = useState('')
    const changePage = ({ selected }) => {
      setPageNumber(selected);
    };
  /*  Pagination Code Start  */
  /*  ---------------------  */

  const getAllCompanies = async () => {
    // setCompanies_data_loading(true);
    try {
        const response = await getCompanies(baseEmail);
        if (response.status === 200) {
            const parents = response.data.data;
            const optons = response.data.data.map((item) => {
                let label = `${item.code} - ${item.company_name}`;
                return { label: label, value: item.code, symbol: item?.symbol };
            });
            setCompanyDropDownOptions(optons)
            setCompanyData(optons)        }
    } catch (error) {
    }
};

  useEffect(() => {
    getAllCompanies()
  }, []);


  const displaydirectorVotinPerPage = directorVotin.slice(pagesVisited, pagesVisited + electionVotingPerPage).map((item, i) => (
    <tr key={i}>
      {/* <td>{item?.Type || ''}</td> */}
      <td>{item?.election_id || ''}</td>
      <td>{ companyData?.find(ite => ite?.value == item?.company_code)?.label || ''}</td>
      <td>{moment(item?.election_from).format("DD-MMM-YYYY h:mmA") || ''}</td>
      <td>{moment(item?.election_to).format("DD-MMM-YYYY h:mmA") || ''}</td>
     <td >{item?.number_of_directors|| ''}</td>
     <td >{item?.number_of_candidates}</td>

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
                "selectedDirector",
                JSON.stringify(obj)
              );
              setCompanyLabel(companyData?.find(ite => ite?.value == item?.company_code)?.label || '')
              setDirectorViewListing(true)
            }}
          ></i>
          <UncontrolledTooltip placement="top" target="RequirmentView">
            {"View Election of Director's Detail"}
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
                "selectedDirector",
                JSON.stringify(obj)
              );
              setCompanyLabel(companyData?.find(ite => ite?.value == item?.company_code)?.label || '')
              setCompanyCode(item?.company_code)
              setEditDirectorVoting(true)
            }}
          ></i>
          <UncontrolledTooltip placement="top" target="directorEdit">
            {"Edit Election Of Director's Detail"}
          </UncontrolledTooltip>
        </>

      </td>

    </tr>
  ));
 
 
  const handleGenerateData = async()=>{
    setLoadingListing(true);
    try {
      const response = await getDirectorsDataByCompanyCode(
        baseEmail,
       selectedCompany
      );
      if (response.status === 200) {
       
        const parents = response.data.data ? response.data.data : [];

        setdirectorVotins(parents);
        setLoadingListing(false);
      }
    } catch (error) {
      setLoadingListing(false);
    }
  
  }


  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Election of Director Listing</h6>
        <Breadcrumb title="Election of Director Listing" parent="Election" />
      </div>
      {/* Add Modal */}
      <Modal isOpen={addDirectorVoting} show={addDirectorVoting.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setAddDirectorVoting(false);
          }}
        >
         Add Election of Director
        </ModalHeader>
        <ModalBody>
          <AddDirectorVoting  setAddDirectorVoting={setAddDirectorVoting} />
        </ModalBody>
      </Modal>
    
      <Modal isOpen={editDirectorvoting} show={editDirectorvoting.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setEditDirectorVoting(false);
          }}
        >
          Edit Election of Director
        </ModalHeader>
        <ModalBody>
          <EditDirectorVoting companyCode={companyCode} companyLabel={companyLabel}  setEditDirectorVoting={setEditDirectorVoting} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={setViewDirectorListing} show={setViewDirectorListing.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setDirectorViewListing(false);
          }}
        >
          View Election of Director
        </ModalHeader>
        <ModalBody>
          <ViewDirectorVoting companyLabel={companyLabel}/>
        </ModalBody>
      </Modal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">

                  <div className="col-md-5" >
                  <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={compnyDropDownOptions}
                        isLoading={!compnyDropDownOptions?.length}
                        onChange={(selected) => {
                         if(selected?.value){
                          setSelectedCompanny(selected?.value)
                         } 
                         else{
                          setSelectedCompanny('')
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
                   
                  <div className="btn-group">
                
                  </div>


                  <div>
                  <button
                      className="btn btn-primary btn-sm ml-2"
                      // style={{marginTop: '30px'}}
                      onClick={() => {
                        setAddDirectorVoting(true)
                      }}
                    >
                      Add Election
                    </button> 
                   
                  </div>
                </div>

              </div>
              {loadingListing === true && <Spinner />}
              {loadingListing === false && directorVotin.length !== 0 && (
                <div className="table-responsive">
                  <TableWrapper className="table  ">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>COMPNAY CODE</th>
                        <th>ELECTION FROM</th>
                        <th>ELECTION TO </th>
                        <th>NUMBER OF DIRECTORS</th>
                        <th>NUMBER OF CANDIDATES</th>
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
              {loadingListing === false && directorVotin.length === 0 && (
                <p className="text-center">
                  <b>Director Voting Data not available</b>
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