import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useSelector } from "react-redux";

import { filterData, SearchType } from "filter-data";

import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import { getPaginatedSpecialVotingAgenda } from "store/services/evoting.service";

import Spinner from "components/common/spinner";

import { getPaginatedRequirmentData } from "../../../store/services/company.service";
import { ViewDirectorVoting } from "./viewDirectorVoting";
import styled from "styled-components";
import Dropdown from "components/common/dropdown";
import { AddSpecialVoting } from "./addSpecialResolutionData";
import { EditCanidateVoting } from "./editCanidateVoting";
// import { ViewSpecialVoting } from "./viewSpecialResolutionData";
import { ViewSpecialResolutionData } from "./viewSpecialResolutionData";
import { EditSpecialResolutionData } from "./editSpecialResolutionData";
import { getCompanies } from "../../../store/services/company.service";
import EvotingListing from "./evotingListing";
import { EvotingResult } from "./eVotingResult";
import { getAllAgendaData } from "store/services/evoting.service";
import { getAllSpecialResolutionData } from "store/services/evoting.service";
import { updateSpecialVoting } from "store/services/evoting.service";
import { getAllSpecialVotingByAgendaId } from "store/services/evoting.service";
import moment from "moment";
export default function CompileSpecialResolutionResult() {
  const baseEmail = sessionStorage.getItem("email") || "";



  // new pagination server side

const [loadingListing, setLoadingListing] = useState(false)
const [editSpecialvoting, setEditSpecialVoting] = useState(false)

const [allCompanies, setAllCompanies] = useState([])
const [eVotingResult, setEvotingResult]  =useState(false)
const [compileLoading, setCompileLoading] = useState(null)
const [data, setData] = useState(null)


  const [directorVotin, setdirectorVotins] = useState([])
 
  const getAgendaData = async () => {
    try {
      setLoadingListing(true);
      const response = await getAllAgendaData(
        baseEmail,
        // pagenum,
        // search
      );
      if (response.status === 200) {
      
        const date = new Date();
        const currentDate = moment(date)?.format("YYYY-MM-DD")
        const parents = response.data.data ? response.data.data : [];
const filterData=parents?.filter((item)=>moment(item?.agenda_to)?.format("YYYY-MM-DD")<currentDate)
console.log('filterData', filterData)
        setdirectorVotins(filterData);
        setLoadingListing(false);
      }
    } catch (error) {
      setLoadingListing(false);
    }
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
      }
    } catch (error) {
      // setCompanies_data_loading(false);
    }
  };
  useEffect(() => {
    
    getAllCompanies()
    getAgendaData();
  }, []);
const handleCompileResult = async(item)=>{
    let sumAcceptedVote=0;
    let sumRejectedVote = 0;
    setCompileLoading(item?._id)
    const response = await getAllSpecialVotingByAgendaId(
        baseEmail,
        item?.item_id
        );
        // const filterData= response.data.data?.filter((z)=>z?.agenda_id==item?.item_id)
        console.log('=', response?.data?.data)
      //  const data= filterData?.map((item)=>{
        // if(item?.vote?.toLowerCase() != 'rejected'){
        //     const acceptedvote = Number(item?.votes_accepted) ? Number(item?.votes_accepted) : 0
        //     const RejectedVote = Number(item?.votes_rejected) ? Number(item?.votes_rejected) : 0
        //     sumAcceptedVote=sumAcceptedVote+acceptedvote;
        //     sumRejectedVote = sumRejectedVote + RejectedVote;
        // }
        // })
        // let approved_unapprove='';
        // let TotalVotes=0;
        // if(sumAcceptedVote>0 || sumRejectedVote>0){
        //    TotalVotes = sumAcceptedVote+sumRejectedVote;
        // const percentage =  (sumAcceptedVote/TotalVotes)*100
       
        // if(percentage>50) approved_unapprove = 'Yes'
        // else approved_unapprove = 'No'
        // }
        // try {
           
        //     const response = await updateSpecialVoting(
        //       baseEmail,
        //       item?.item_id,
        //       item?.company_code || '',
        //       item?.meeting_id ||'',
        //       item?.item_no||'',
        //       item?.agenda_title||'',
        //       item?.agenda_item||'',
        //       item?.attachments,
        //       item?.voting||'',
        //       item?.shareholders||'',
        //       TotalVotes?.toString()||'',
        //       sumAcceptedVote?.toString()||'',
        //       sumRejectedVote?.toString()||'',
        //       item?.votes_expired||'',
        //       approved_unapprove||'',
        //       item?.comments||'',
        //      item?.created_at||'',
        //       item?.agenda_from,
        //       item?.agenda_to
        //         );
      
        //     if (response.data.status === 200) {
        //         setTimeout(() => {
        //             setCompileLoading(false);
        //             window.location.reload();
        //             toast.success(`${response.data.message}`);
        //             setEditSpecialVoting(false);
        //         }, 2000);
        //     } else {
        //         setCompileLoading(false);
        //         toast.error(`${response.data.message}`);
        //     }
        // } catch (error) {
        //     setCompileLoading(false);
        //     !!error?.response?.data?.message
        //         ? toast.error(error?.response?.data?.message)
        //         : toast.error("Result Not Compile");
        // }


       await getAgendaData()
        setCompileLoading(false)

}

  const displaydirectorVotinPerPage = directorVotin.map((item, i) => (
    <tr key={i}>
      <td >{item.meeting_id || ''}</td>
      <td >{ allCompanies?.find(ite => ite?.value == item?.company_code)?.label || ''}</td>
      <td>{item?.agenda_title || ''}</td>
      <td >{moment(item?.agenda_from )?.format("YYYY-MM-DD")|| ''}</td>
      <td>{moment(item?.agenda_to)?.format("YYYY-MM-DD") || ''}</td>
      <td >
    { !item?.agenda_approved ?   <> <button
                      className="btn btn-primary btn-sm ml-2"
                      id="viewrTemplate"
                      onClick={async() => {
                        console.log('======item', item)
                        handleCompileResult(item)
                        }}
                    >{compileLoading ==item?._id? '...Loading' : 
                     'Compile Result'}
                    </button> 
              
              <UncontrolledTooltip
                placement="top"
                target={`viewrTemplate`}
              >
                {"Compile Result"}
              </UncontrolledTooltip>
            </> :  
            <>
              <i
                className="fa fa-paperclip"
                id={`viewresult`}
                style={{
                  //  width: 25,
                  fontSize: 16,
                  padding: 11,
                  color: "rgb(68, 102, 12)",
                  cursor: "pointer",
                }}
                onClick={() => {
                    setData(item)
                  setEvotingResult(true)
                }}
              ></i>
              <UncontrolledTooltip
                placement="top"
                target={`viewresult`}
              >
                {"View Result"}
              </UncontrolledTooltip>
            </> 
            }

      </td>

    </tr>
  ));
 
 
  


  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Special Resolution Result Listing</h6>
        <Breadcrumb title="Special Resolution Result Listing" parent="Election" />
      </div>
     
       <Modal isOpen={eVotingResult} show={eVotingResult.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setEvotingResult(false);
          }}
        >

        </ModalHeader>
        <ModalBody>
          <EvotingResult allCompanies={allCompanies} showData={true} data={data} setEvotingResult={setEvotingResult} />
        </ModalBody>
      </Modal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">

                  <div className="col-md-8" />
                  <div className="btn-group">
                
                  </div>


                  <div>
                  <button
                      className="btn btn-primary btn-sm ml-2"
                      onClick={() => {
                        setEvotingResult(true)
                      }}
                    >
                      View Template
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
                        {/* <th>TYPE</th> */}
                        <th> Meeting Id </th>
                        <th>Company </th>
                        <th>Agenda Title</th>
                        {/* <th>Agenda Item</th> */}
                        <th>Agenda From</th>
                        <th>Agenda To </th>
                        {/* <th>DISAPPROVALS </th> */}
                        {/* <th>Notify Days </th> */}
                        <th style={{ maxWidth: '80px' }}>Action</th>

                      </tr>
                    </thead>

                    <tbody>{displaydirectorVotinPerPage}</tbody>
                  </TableWrapper>
                  {/* <center className="d-flex justify-content-center py-3">
                    <nav className="pagination">
                      {hasPrevPage && (
                        <button
                          className="btn btn-primary btn-sm mx-1"
                          onClick={() => getPaginatedSpecialVotingAgendaData(prevPage)}
                        >
                          <span>{"Prev"}</span>
                        </button>
                      )}
                      {hasNextPage && (
                        <button
                          className="btn btn-secondary btn-sm mx-1"
                          onClick={() => getPaginatedSpecialVotingAgendaData(nextPage)}
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