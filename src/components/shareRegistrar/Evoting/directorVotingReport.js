import React, { Fragment, useState, useEffect } from "react";
import {
  getCDCDate,
  getShareHolderByFolioNo,
  getShareHolderHistoryByCompanyandDate,
  getShareHoldersByCompany,
  getShareHolderTransactionsbyDate,
} from "store/services/shareholder.service";
import Dropdown from "components/common/dropdown";
import { darkStyle } from "components/defaultStyles";
import Breadcrumb from "components/common/breadcrumb";
import { useSelector } from "react-redux";
import { getCompanies } from "../../../store/services/company.service";
import { getInvestors } from "store/services/investor.service";
import { getShareholders } from "store/services/shareholder.service";
import {
  generateExcel,
  getvalidDateDMonthY,
  getvalidDateDMY,
  IsJsonString,
  listCrud,
  isValidDate,
} from "utilities/utilityFunctions";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import * as _ from "lodash";

import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";
import { numberWithCommas } from "utilities/utilityFunctions";
import ReportHeader from "../reporting/report-header";
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "../reporting/page-template";
import moment from "moment";

import {
    getAllElectionVoting,
  getAllElections,
  getSpecialResolutionByAgendaId,
  getStatutoryEventByEventID,
} from "store/services/evoting.service";
import { X } from "react-feather";

export default function DirectorVotingReport() {
  const pdfExportComponent = React.useRef(null);
  const baseEmail = sessionStorage.getItem("email") || "";
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [companyViseShareholders, setCompanyViseShareholders] = useState([]);
  const [cdcDates, setCdcDates] = useState([]);
  const [cdcDatesLoading, setCdcDatesLoading] = useState(false);
  const [underSearch, setUnderSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [folioNo, setFolioNo] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedElection, setSelectedElection] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState("");
  const [shareholderLoading, setShareholderLoading] = useState(false);
  const [serachedShareholders, setSerachedShareholders] = useState([]);
  const [companies, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [allElection, setAllElection] = useState([]);
  const [election_dropdown, setElection_dropdown] = useState([]);
  const [election_data_loading, setElection_data_loading] = useState(false);
  const [filterAgenda, setFilterAgenda] = useState([]);
  const [filterElection, setFilterElection] = useState([]);
  const [allVotes, setAllVote] = useState([]);
  const [candidateVotes,setCandidateVotes]=useState([])
  const [shareholders_data, setShareholders_data] = useState([]);
  const [shareholders_data_loading, setShareholders_data_loading] =
    useState(false);
  const [txnData, setTxnData] = useState([]);
  const [eventDetail, setEventDetail] = useState({});

  const [selectedCompanDetail, setSelectedCompanDetail] = useState([]);
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [txnTypes, setTxnTypes] = useState([]);
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);
  const [viewFlag, setViewFlag] = useState(false);
  const [viewAgendaData, setViewAgendaData] = useState({});
  const [folioWise, setFolioWise] = useState([]);
  let res = [];
  let totalshares = 0;
  let share_held = 0;
  let totalInvalidVote = 0;

  const getShareHoldersByCompanyCode = async () => {
    setShareholders_data_loading(true);
    try {
      const response = await getShareHoldersByCompany(
        baseEmail,
        selectedCompany,
        ""
      );
      if (response.status === 200) {
        const parents = response.data.data;
        setShareholders_data(parents);
        setShareholders_data_loading(false);
      }
    } catch (error) {
      setShareholders_data_loading(false);
      toast.error("Error fetching shareholders");
    }
  };
  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try {
        const elections = await getAllElections(baseEmail);
        setAllElection(elections.data.data);

        const response = await getCompanies(baseEmail);
        if (response.status === 200) {
          const parents = response.data.data;
          const companies_dropdowns = response.data.data.map((item) => {
            let label = `${item.code} - ${item.company_name}`;
            return { label: label, value: item.code };
          });
          setCompanies_dropdown(companies_dropdowns);
          setCompanies_data(parents);
          setCompanies_data_loading(false);
        }
      } catch (error) {
        setCompanies_data_loading(false);
      }
    };

    getAllCompanies();

  }, []);
  useEffect(() => {
    if (!!selectedCompany) {
      getShareHoldersByCompanyCode();
    }
  }, [selectedCompany]);
  const handleViewReport = () => {
    if (selectedElection && selectedCompany) {
      if (allVotes.length > 0) {
        setShowData(true);
      } else {
        toast.error("No Data Found");
      }
    } else {
      toast.error("Please Select Both Fields");
    }
  };

  const getVotingByElectionID = async (elections) => {
    
    if (elections && elections.length > 0) {
        const response=await getAllElectionVoting(baseEmail)
        const filter=response.data.data.filter(item=>{
            return item.election_id == elections[0].election_id
        })
        setAllVote(filter)
        let temp=[]
        for(let i=0;i<filter.length;i++)
        {
            let vote_casting=JSON.parse(filter[i].vote_casting)
            for(let j=0;j<vote_casting.length;j++)
            {
                let index=temp.findIndex(x=>x.candidate_id == vote_casting[j].candidate_id)
                if(index>-1)
                {
                    temp[index].votes_casted=parseFloat(temp[index].votes_casted)+parseFloat(vote_casting[j].votes_casted ? vote_casting[j].votes_casted : "0")

                }else{
                    temp.push({candidate_id:vote_casting[j].candidate_id, candidate_name:vote_casting[j].candidate_name, votes_casted:vote_casting[j].votes_casted ? parseFloat(vote_casting[j].votes_casted) :'0'})
                }
            }
        }
        setCandidateVotes([...temp])
        console.log(temp)
        console.log("votes---")
        console.log(filter)
      setLoading(true);
      
      

      setLoading(false);
    }
  };
  const getEventDetail = async (event_id) => {
    const response = await getStatutoryEventByEventID(baseEmail, event_id);
    if (response.data.status == 200) {
      setEventDetail(response.data.data);
    } else {
      setEventDetail({});
    }
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Election Voting Report</h6>
        <Breadcrumb title="Election Voting Report" parent="Election" />
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header ">
                <div className="row mt-2">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={companies_dropdown}
                        isLoading={companies_data_loading === true}
                        onChange={(selected) => {
                          setSerachedShareholders([]);
                          setTxnData([]);
                          setShowData(false);
                          setElection_data_loading(true);

                          let selectedelection = allElection.filter(
                            (item) => {
                              return item.company_code == selected?.value;
                            }
                          );
                          !!selected?.value &&
                            setSelectedCompany(selected?.value);
                          !selected && setSelectedCompany("");
                          !selected?.value && setUnderSearch("");
                          setSelectedElection("");

                          
                          const election_dropdowns = selectedelection.map(
                            (item) => {
                              let label = moment(parseInt(item.election_id.split("-")[1])).format("DD-MMM-YYYY h:mmA");
                              return { label: label, value: item.election_id };
                            }
                          );
                          
                          const filter = companies.find((item) => {
                            return item.code === selected?.value;
                          });

                          setElection_dropdown(election_dropdowns);
                          setElection_data_loading(false);
                          setSelectedCompanDetail(filter);
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="histyro">Election</label>
                      <Select
                        options={election_dropdown}
                        isLoading={election_data_loading === true}
                        value={election_dropdown.filter(
                          (option) => option.value === selectedElection
                        )}
                        onChange={(selected) => {
                          !!selected?.value &&
                            setSelectedElection(selected?.value);
                          !selected && setSelectedElection("");
                          !selected?.value && setUnderSearch("");

                          const filter = allElection.filter((item) => {
                            return (
                              item.election_id == selected?.value &&
                              item.company_code == selectedCompany 
                            );
                          });
                         
                          
                          
                          
                          
                          
                          setFilterElection(filter);
                         
                          getEventDetail(filter[0].meeting_id);
                          getVotingByElectionID(filter);

                          setShowData(false);
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 d-flex-row">
                    <button
                      className="btn btn-success ml-3 mt-4"
                      onClick={(e) => {
                        handleViewReport();
                      }}
                      disabled={!selectedCompany || !selectedElection || loading}
                    >
                      {companies && companies.length !== 0
                        ? "Preview"
                        : "Loading Data..."}
                    </button>
                    {showData && allVotes.length > 0 && (
                      <button
                        className="btn btn-danger ml-3 mt-4"
                        onClick={(e) => {
                          if (pdfExportComponent.current) {
                            pdfExportComponent.current.save();
                          }
                        }}
                      >
                        <i className="fa fa-file-pdf-o mr-1"></i>Print PDF
                      </button>
                    )}
                  </div>
                </div>

                {loading == true && <Spinner />}
                
                {loading == false && showData && allVotes.length > 0 && (
                  <PDFExport
                    paperSize="A4"
                    margin="1.5cm"
                    scale={0.6}
                    landscape={true}
                    fileName={`Election Voting Report of  (${
                      allVotes[0]?.election_id || ""
                    })`}
                    pageTemplate={PageTemplate}
                    ref={pdfExportComponent}
                  >
                    <ReportHeader
                      title="Election Voting Report"
                      logo={selectedCompanDetail?.logo || "****"}
                    />
                    <div style={{ textAlign: "center", marginBottom: "15px" }}>
                      <b>Results of Voting on Resolutions/Execution Report</b>
                    </div>
                    <div className="table-responsive">
                      <table className="table">
                        <tr>
                          <td>Name of the Company</td>
                          <td>{selectedCompanDetail?.company_name}</td>
                        </tr>
                        <tr>
                          <td>Date of Poll</td>
                          <td>
                            {moment(eventDetail?.deadline_date).format(
                              "DD-MMM-YYYY"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>Date for casting e-voting</td>
                          <td>
                            {moment(filterElection[0]?.election_from).format(
                              "DD-MMM-YYYY h:mmA"
                            ) } {" "}
                             TO {" "}
                            { moment(filterElection[0]?.election_to).format(
                              "DD-MMM-YYYY h:mmA"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>Last date of receiving ballot</td>

                          <td>
                            {moment(eventDetail?.deadline_date).format(
                              "DD-MMM-YYYY"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>Any other related information</td>
                          <td></td>
                        </tr>
                      </table>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <b>Candidates</b>
                    </div>
                    <div className="table-responsive">
                      <table className="table">
                      {allVotes[0].vote_casting &&
                          JSON.parse(allVotes[0].vote_casting).map(
                            (item, index) => {
                              return (
                                <tr>
                                  <td width={"10%"}>Candidate {index + 1}</td>
                                  {/* <td>{item?.agenda_title}</td> */}
                                  <td>{item?.candidate_name}</td>
                                </tr>
                              );
                            }
                          )}

                        
                      </table>
                    </div>
                    <div style={{ marginTop: "20px", marginBottom: "10px" }}>
                      <b>Vote casted through e-voting:</b>
                    </div>

                    <div className="table-responsive mt-5">
                      <table
                        className="table"
                        style={{ borderBottom: "1px solid #eeeeee" }}
                      >
                        <thead style={{ borderTop: "1px solid #eeeeee"}}>
                        {[{vote: 200},{vote: 300},{vote: 400},{vote: 300},{vote: 400}]?.map((item, index)=>{
                        return <th>Candidate {index+1}</th>
                       })} 
                        </thead>
                       
                       {[{name:  'INVESTOR 1', noofVotes: '1000', votescasted: '1000',vote: 200},{name:  'INVESTOR 2', noofVotes: '1000', votescasted: '1000',vote: 300},{name:  'INVESTOR 3', noofVotes: '1000', votescasted: '1000',vote: 400}]?.map((item,idx)=>{
                        return <>
                         <tr style={{ borderBottom: "1px solid #eeeeee", backgroundColor:"#e8f4f8" }}>
                          <td ><b style={{fontSize: '14px'}}>Name of member* / FolioNo:</b><span style={{paddingLeft: '7px'}}>{item?.name}</span></td>
                          
                          <td><b style={{fontSize: '14px'}}> Shares held or no. of votes:</b><span style={{paddingLeft: '7px'}}>{item?.noofVotes}</span></td>
                          <td><b style={{fontSize: '14px'}}>No. of votes casted:</b><span style={{paddingLeft: '7px'}}>{item?.votescasted}</span></td>
                          <td><b style={{fontSize: '14px'}}>No. of invalid votes:</b><span style={{paddingLeft: '7px'}}>0</span></td>
                          {[{vote: 200},{vote: 300},{vote: 400},{vote: 300},{vote: 400}]?.slice(0,[{vote: 200},{vote: 300},{vote: 400},{vote: 300},{vote: 400}]?.length-4)?.map((item, index)=>{
                        return <td></td>
                       })} 
                         
                        </tr>
                        <tr >
                        
                       {[{vote: 200},{vote: 300},{vote: 400},{vote: 300},{vote: 400}]?.map((item, index)=>{
                        return <td>{item?.vote}</td>
                       })} </tr>
                       
                        </>
                       })}
                       
                        {folioWise &&
                          folioWise.length > 0 &&
                          folioWise.map((item, index) => {
                            let shareholder_index = shareholders_data.findIndex(
                              (x) => x.folio_number == item.folio_number
                            );
                            let holding =
                              parseFloat(
                                shareholders_data[shareholder_index]
                                  ?.electronic_shares
                              ) +
                              parseFloat(
                                shareholders_data[shareholder_index]
                                  ?.physical_shares
                              );
                            share_held = share_held + holding;

                            let invalidVote = 0;
                            {/* filterResolution[0].agendas && JSON.parse(filterResolution[0].agendas).map((items,index) => {
                              if (
                                !item.vote[index] ||
                                item.vote[index] == "" ||
                                item.vote[index] == "" ||
                                item.vote[index].length == 0
                              ) {
                                invalidVote = invalidVote + holding;
                              }
                            }); */}
                            totalshares =
                              totalshares +
                              holding * parseInt(filterElection[0].number_of_candidates) -
                              invalidVote;
                            totalInvalidVote = totalInvalidVote + invalidVote;
                            return (
                              <tr style={{ borderBottom: "1px solid #eeeeee" }}>
                                <td>
                                  {item.folio_number.split("-")[1]
                                    ? item.folio_number.split('-').slice(1).join('-') +
                                      "-" +
                                      shareholders_data[shareholder_index]
                                        ?.shareholder_name
                                    : shareholders_data[shareholder_index]
                                        ?.shareholder_name}
                                </td>
                                <td className="text-right">
                                  {numberWithCommas(
                                    isNaN(holding) ? "0" : holding
                                  )}
                                </td>
                                <td className="text-right">
                                  {numberWithCommas(
                                    isNaN(holding * parseInt(filterElection[0].number_of_candidates))
                                      ? "0"
                                      : holding * parseInt(filterElection[0].number_of_candidates) -
                                          invalidVote
                                  )}
                                </td>
                                <td className="text-right">
                                  {numberWithCommas(invalidVote)}
                                </td>
                                {/* {JSON.parse(filterResolution[0].agendas).map((items, index) => {
                                  if (
                                    item.vote[index] == "Favour" ||
                                    item.vote[index] == "Approved"
                                  ) {
                                    if (res[index]) {
                                      res[index]["favor"] = (
                                        parseFloat(
                                          isNaN(holding) ? "0" : holding
                                        ) +
                                        parseFloat(
                                          isNaN(res[index].favor)
                                            ? "0"
                                            : res[index].favor
                                        )
                                      ).toString();
                                    } else {
                                      res[index] = {
                                        favor: isNaN(holding) ? "0" : holding,
                                      };
                                    }
                                  }

                                  if (
                                    item.vote[index] == "Against" ||
                                    item.vote[index] == "Disapproved"
                                  ) {
                                    if (res[index]) {
                                      res[index]["against"] = (
                                        parseFloat(
                                          isNaN(holding) ? "0" : holding
                                        ) +
                                        parseFloat(
                                          res[index].against
                                            ? res[index].against
                                            : "0"
                                        )
                                      ).toString();
                                    } else {
                                      res[index] = {
                                        against: isNaN(holding) ? "0" : holding,
                                      };
                                    }
                                  }

                                  return item.vote[index] == "Favour" ||
                                  item.vote[index] == "Approved"
                                    ? [
                                        <td className="text-right" style={{backgroundColor:"#e8f4f8"}}>
                                          {numberWithCommas(
                                            isNaN(holding) ? "0" : holding
                                          )}
                                        </td>,
                                        <td className="text-right">0</td>,
                                      ]
                                    : item.vote[index] == "Against" ||
                                    item.vote[index] == "Disapproved"
                                    ? [
                                        <td className="text-right" style={{backgroundColor:"#e8f4f8"}}>0</td>,
                                        <td className="text-right">
                                          {numberWithCommas(
                                            isNaN(holding) ? "0" : holding
                                          )}
                                        </td>,
                                      ]
                                    : [
                                        <td className="text-right" style={{backgroundColor:"#e8f4f8"}}>0</td>,
                                        <td className="text-right">0 </td>,
                                      ];
                                })} */}
                              </tr>
                            );
                          })}
                        <tfoot  style={{backgroundColor:"#e8f4f8"}}>
                        {/* Candidate total starting code */}
                       {[{vote: 200},{vote: 300},{vote: 400},{vote: 300},{vote: 400}]?.map((item)=>{
                        return<td style={{fontSize: '20px'}}>{item?.vote}</td>
                       })} 
                         
                         {/* Candidate total end code */}

                         
                         {/* previous report code start */}
                          {/* <td>Total</td>
                          <td className="text-right">
                            {numberWithCommas(share_held)}
                          </td>
                          <td className="text-right">
                            {numberWithCommas(totalshares)}
                          </td>
                          <td className="text-right">
                            {numberWithCommas(totalInvalidVote)}
                          </td> */}
                          {/* previous report code end */}
                          {/* {JSON.parse(filterResolution[0].agendas)?.map((item, index) => [
                            <td className="text-right">
                              {numberWithCommas(
                                res[index]?.favor ? res[index]?.favor : "0"
                              )}
                            </td>,
                            <td className="text-right">
                              {numberWithCommas(
                                res[index]?.against ? res[index]?.against : "0"
                              )}
                            </td>,
                          ])} */}
                        </tfoot>
                      </table>
                    </div>
                   
                  </PDFExport>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
