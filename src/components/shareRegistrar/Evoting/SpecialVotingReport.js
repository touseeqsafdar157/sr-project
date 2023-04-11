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
import { getTransactionTypes } from "store/services/transaction.service";
import {
  getAllAgendaByEventID,
  getAllAgendaData,
  getAllSpecialResolutionData,
  getSpecialResolutionByAgendaId,
  getStatutoryEventByEventID,
} from "store/services/evoting.service";
import { X } from "react-feather";

export default function SpecialVotingReport() {
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
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState("");
  const [shareholderLoading, setShareholderLoading] = useState(false);
  const [serachedShareholders, setSerachedShareholders] = useState([]);
  const [companies, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [allAgenda, setAllAgenda] = useState([]);
  const [meeting_dropdown, setMeeting_dropdown] = useState([]);
  const [meeting_data_loading, setMeeting_data_loading] = useState(false);
  const [filterAgenda, setFilterAgenda] = useState([]);
  const [filterResolution, setFilterResolution] = useState([]);
  const [totalResolution, setTotalResolution] = useState(0);
  const [resolutionWiseData, setResolutionWiseData] = useState([]);
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
        const agendas = await getAllAgendaData(baseEmail);
        setAllAgenda(agendas.data.data);

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
    if (selectedMeeting && selectedCompany) {
      if (folioWise.length > 0) {
        setShowData(true);
      } else {
        toast.error("No Data Found");
      }
    } else {
      toast.error("Please Select Both Fields");
    }
  };

  const getVotingByAgendaID = async (filterdAgenda, diff) => {
    if (filterdAgenda && filterdAgenda.length > 0) {
      setLoading(true);
      let temp = [];
      let resolutionwise = [];
      for (let i = 0; i < filterdAgenda.length; i++) {
        const response = await getSpecialResolutionByAgendaId(
          baseEmail,
          filterdAgenda[i].item_id
        );
        if (response?.data?.status == 200) {
          temp = [...temp, ...response?.data?.data];
          resolutionwise[filterdAgenda[i].item_id] = response?.data?.data;
        }
      }
      temp = temp.filter((item) => {
        return (
          item.vote != "Approved" &&
          item.vote != "Disapproved" &&
          item.vote != "Against" &&
          item.vote != "Favor"
        );
      });
      setResolutionWiseData(resolutionwise);
      setFilterAgenda(temp);
      let folio_wise = [];
      let keys = Object.keys(resolutionwise);
      for (let i = 0; i < temp.length; i++) {
        let flag = false;
        for (let j = 0; j < keys.length; j++) {
          if (
            resolutionwise[keys[j]].vote != "Approved" &&
            resolutionwise[keys[j]].vote != "Disapproved"
          ) {
            let index = resolutionwise[keys[j]].findIndex(
              (x) =>
                x.folio_number == temp[i].folio_number &&
                x.agenda_id == temp[i].agenda_id &&
                x.vote != "Approved" &&
                x.vote != "Disapproved" &&
                x.vote != "Against" &&
                x.vote != "Favor" &&
                x.vote != "Favour"
            );
            if (index > -1) {
              flag = true;
              let folio_check = folio_wise.findIndex(
                (x) =>
                  x.folio_number == resolutionwise[keys[j]][index].folio_number
              );
              if (folio_check > -1) {
                console.log("Found Folio Check");
                let votes_casted = JSON.parse(
                  resolutionwise[keys[j]][index].vote
                );
                let vote = folio_wise[folio_check].vote;
                for (let k = vote.length; k < votes_casted.length; k++) {
                  vote.push(
                    votes_casted[k].votes_favour == "1"
                      ? "Approved"
                      : "Disapproved"
                  );
                  folio_wise[folio_check].total_shares = (
                    parseFloat(folio_wise[folio_check].total_shares) +
                    parseFloat(resolutionwise[keys[j]][index].votable_shares)
                  ).toString();
                }
                folio_wise[folio_check].vote = vote;
              } else {
                if (
                  temp[i].folio_number.trim() != "" &&
                  temp[i].folio_number.trim() != ""
                ) {
                  
                  let allVote =
                    temp[i].vote != "" ? JSON.parse(temp[i].vote) : [];
                  let vote = [];
                  for (let i = 0; i < allVote.length; i++) {
                    let item_no = allVote[i].item_no.split("-")[2];

                    let index =
                      parseInt(item_no) - (parseInt(diff) + 1) > -1
                        ? parseInt(item_no) - (parseInt(diff) + 1)
                        : i - 1;

                    vote[index] =
                      allVote[i].votes_favour == "1"
                        ? "Approved"
                        : "Disapproved";
                  }

                  folio_wise.push({
                    folio_number: temp[i].folio_number,
                    total_shares: temp[i].votable_shares,
                    vote: vote,
                  });
                }
              }
            }
          }
        }
      }

      folio_wise = folio_wise.filter((item) => {
        if (
          item.folio_number.trim() != "" &&
          item.folio_number.trim() != "" &&
          item.folio_number.length > 0 &&
          item.folio_number.split("-")[0] == selectedCompany
        ) {
          return item;
        }
      });

      setFolioWise(folio_wise);

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
        <h6 className="text-nowrap mt-3 ml-3">Special Voting Report</h6>
        <Breadcrumb title="Special Voting Report" parent="Election" />
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
                          setMeeting_data_loading(true);

                          let selectedCompanyAgenda = allAgenda.filter(
                            (item) => {
                              return item.company_code == selected?.value;
                            }
                          );
                          !!selected?.value &&
                            setSelectedCompany(selected?.value);
                          !selected && setSelectedCompany("");
                          !selected?.value && setUnderSearch("");
                          setSelectedMeeting("");

                          selectedCompanyAgenda = selectedCompanyAgenda.filter(
                            (v, i, a) =>
                              a.findIndex(
                                (v2) => v2.meeting_id === v.meeting_id
                              ) === i
                          );
                          const meeting_dropdowns = selectedCompanyAgenda.map(
                            (item) => {
                              let label = moment(
                                parseInt(item.meeting_id.split("-")[1])
                              ).format("DD-MMM-YYYY h:mmA");
                              return { label: label, value: item.meeting_id };
                            }
                          );
                          const filter = companies.find((item) => {
                            return item.code === selected?.value;
                          });

                          setMeeting_dropdown(meeting_dropdowns);
                          setMeeting_data_loading(false);
                          setSelectedCompanDetail(filter);
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="histyro">Meeting ID</label>
                      <Select
                        options={meeting_dropdown}
                        isLoading={meeting_data_loading === true}
                        value={meeting_dropdown.filter(
                          (option) => option.value === selectedMeeting
                        )}
                        onChange={(selected) => {
                          !!selected?.value &&
                            setSelectedMeeting(selected?.value);
                          !selected && setSelectedMeeting("");
                          !selected?.value && setUnderSearch("");

                          const filter = allAgenda.filter((item) => {
                            return (
                              item.meeting_id == selected?.value &&
                              item.company_code == selectedCompany &&
                              item.vote != "Approved" &&
                              item.vote != "Disapproved" &&
                              item.vote != "Against" &&
                              item.vote != "Favor"
                            );
                          });

                          let agendas =
                            filter[0].agendas && 
                            JSON.parse(filter[0].agendas).filter((item) => {
                              return item.status && item.status == "active";
                            });
                          let diff =
                            JSON.parse(filter[0]?.agendas || "[]")?.length -
                            agendas?.length;
                            
                          filter[0].agendas =agendas ? JSON.stringify(agendas) :'[]';
                          setFilterResolution(filter);

                          getEventDetail(selected?.value);
                          getVotingByAgendaID(filter, diff);

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
                      disabled={!selectedCompany || !selectedMeeting || loading}
                    >
                      {companies && companies.length !== 0
                        ? "Preview"
                        : "Loading Data..."}
                    </button>
                    {showData && folioWise.length > 0 && (
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

                {loading == false && showData && filterAgenda.length > 0 && (
                  <PDFExport
                    paperSize="A4"
                    margin="1.5cm"
                    scale={0.6}
                    landscape={true}
                    fileName={`Special Voting Report of  (${
                      filterAgenda[0]?.agenda_id || ""
                    })`}
                    pageTemplate={PageTemplate}
                    ref={pdfExportComponent}
                  >
                    <ReportHeader
                      title="Special Voting Report"
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
                            {moment(filterResolution[0]?.agenda_from).format(
                              "DD-MMM-YYYY h:mmA"
                            )}
                            TO
                            {moment(filterResolution[0]?.agenda_to).format(
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
                      <b>Resolutions</b>
                    </div>
                    <div className="table-responsive">
                      <table className="table">
                        {filterResolution[0].agendas &&
                          JSON.parse(filterResolution[0].agendas).map(
                            (item, index) => {
                              return (
                                <tr>
                                  <td width={"10%"}>Resolution {index + 1}</td>
                                  {/* <td>{item?.agenda_title}</td> */}
                                  <td>{item?.agenda_item}</td>
                                </tr>
                              );
                            }
                          )}
                      </table>
                    </div>
                    <div style={{ marginTop: "20px", marginBottom: "10px" }}>
                      <b>Vote casted through e-voting:</b>
                    </div>

                    <div className="table-responsive">
                      <table
                        className="table"
                        style={{ borderBottom: "1px solid #eeeeee" }}
                      >
                        <thead style={{ borderTop: "1px solid #eeeeee" }}>
                          <th colSpan={2} style={{ textAlign: "center" }}>
                            Particulars
                          </th>
                          
                          <th
                            colSpan={
                              filterResolution[0].agendas && JSON.parse(filterResolution[0]?.agendas).length + 2
                            }
                            style={{ textAlign: "center" }}
                          >
                            Result of resolutions
                          </th>
                        </thead>
                        <tr style={{ backgroundColor: "#e8f4f8" }}>
                          <th>Name of member* / FolioNo.</th>
                          <th className="text-right">
                            Shares held or no. of votes
                          </th>
                          <th className="text-right">No. of votes casted</th>
                          <th className="text-right">No. of invalid votes</th>

                          {JSON.parse(filterResolution[0].agendas)?.map(
                            (item, index) => (
                              <th
                                key={index}
                                colSpan={2}
                                style={{ textAlign: "center" }}
                              >
                                Resolution No.{index + 1}
                              </th>
                            )
                          )}
                        </tr>
                        <tr style={{ borderBottom: "1px solid #eeeeee" }}>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          {filterResolution[0].agendas &&
                            JSON.parse(filterResolution[0].agendas)?.map(
                              (item, index) => [
                                <th
                                  key={index}
                                  style={{
                                    textAlign: "center",
                                    backgroundColor: "#e8f4f8",
                                  }}
                                >
                                  Favor
                                </th>,
                                <th style={{ textAlign: "center" }}>
                                  Against
                                </th>,
                              ]
                            )}
                        </tr>
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
                            filterResolution[0].agendas &&
                              JSON.parse(filterResolution[0].agendas).map(
                                (items, index) => {
                                  if (
                                    !item.vote[index] ||
                                    item.vote[index] == "" ||
                                    item.vote[index] == "" ||
                                    item.vote[index].length == 0
                                  ) {
                                    invalidVote = invalidVote + holding;
                                  }
                                }
                              );
                            totalshares =
                              totalshares +
                              holding *
                                JSON.parse(filterResolution[0].agendas).length -
                              invalidVote;
                            totalInvalidVote = totalInvalidVote + invalidVote;
                            return (
                              <tr style={{ borderBottom: "1px solid #eeeeee" }}>
                                <td>
                                  {item.folio_number.split("-")[1]
                                    ? item.folio_number
                                        .split("-")
                                        .slice(1)
                                        .join("-") +
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
                                    isNaN(
                                      holding *
                                        JSON.parse(filterResolution[0].agendas)
                                          .length
                                    )
                                      ? "0"
                                      : holding *
                                          JSON.parse(
                                            filterResolution[0].agendas
                                          ).length -
                                          invalidVote
                                  )}
                                </td>
                                <td className="text-right">
                                  {numberWithCommas(invalidVote)}
                                </td>
                                {JSON.parse(filterResolution[0].agendas).map(
                                  (items, index) => {
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
                                          against: isNaN(holding)
                                            ? "0"
                                            : holding,
                                        };
                                      }
                                    }

                                    return item.vote[index] == "Favour" ||
                                      item.vote[index] == "Approved"
                                      ? [
                                          <td
                                            className="text-right"
                                            style={{
                                              backgroundColor: "#e8f4f8",
                                            }}
                                          >
                                            {numberWithCommas(
                                              isNaN(holding) ? "0" : holding
                                            )}
                                          </td>,
                                          <td className="text-right">0</td>,
                                        ]
                                      : item.vote[index] == "Against" ||
                                        item.vote[index] == "Disapproved"
                                      ? [
                                          <td
                                            className="text-right"
                                            style={{
                                              backgroundColor: "#e8f4f8",
                                            }}
                                          >
                                            0
                                          </td>,
                                          <td className="text-right">
                                            {numberWithCommas(
                                              isNaN(holding) ? "0" : holding
                                            )}
                                          </td>,
                                        ]
                                      : [
                                          <td
                                            className="text-right"
                                            style={{
                                              backgroundColor: "#e8f4f8",
                                            }}
                                          >
                                            0
                                          </td>,
                                          <td className="text-right">0 </td>,
                                        ];
                                  }
                                )}
                              </tr>
                            );
                          })}
                        <tfoot style={{ backgroundColor: "#e8f4f8" }}>
                          <td>Total</td>
                          <td className="text-right">
                            {numberWithCommas(share_held)}
                          </td>
                          <td className="text-right">
                            {numberWithCommas(totalshares)}
                          </td>
                          <td className="text-right">
                            {numberWithCommas(totalInvalidVote)}
                          </td>
                          {JSON.parse(filterResolution[0].agendas)?.map(
                            (item, index) => [
                              <td className="text-right">
                                {numberWithCommas(
                                  res[index]?.favor ? res[index]?.favor : "0"
                                )}
                              </td>,
                              <td className="text-right">
                                {numberWithCommas(
                                  res[index]?.against
                                    ? res[index]?.against
                                    : "0"
                                )}
                              </td>,
                            ]
                          )}
                        </tfoot>
                      </table>
                    </div>
                    {/* <div style={{marginTop:"20px", marginBottom:'10px'}}><b>Consolidated result of voting</b> </div>
                      <div className="table-responsive">
                      <table className="table" style={{borderBottom:'1px solid #eeeeee'}}>
                        <thead>
                          <th>Sr No.</th>
                          <th>Resolutions </th>
                          <th>Total No. of Shares/Votes held</th>
                          <th>Total No. of votes Casted</th>
                          <th>Total No. of Invalid Votes</th>
                          <th>No. of Votes Casted in Favor</th>
                          <th>No. of Votes Casted Against</th>
                          <th>Percentage of Votes Castes in Favor</th>
                          <th>Resolution Passed/Not Passed</th>
                          <th>Remarks</th>
                        </thead>
                        {filterResolution?.map((item,index)=>{
                          let Percentage=parseFloat(res[index].favor ? parseFloat(res[index].favor/(parseFloat(res[index].against ? res[index].against : "0")+parseFloat(res[index].favor ? res[index].favor :'0'))*100).toFixed(2) :'0')
                          console.log(res)
                          return(
                            <tr>
                              <td>{index+1}</td>
                              <td>Resolution {index+1}</td>
                              <td>{parseFloat(res[index].against ? res[index].against : "0")+parseFloat(res[index].favor ? res[index].favor :'0')}</td>
                              <td>{parseFloat(res[index].against ? res[index].against : "0")+parseFloat(res[index].favor ? res[index].favor :'0')}</td>
                              <td></td>
                              <td>{parseFloat(res[index].favor ? res[index].favor :'0')}</td>
                              <td>{parseFloat(res[index].against ? res[index].against : "0")}</td>
                              <td>{Percentage}</td>
                              <td>{parseFloat(Percentage)>50?"Passed":"Not Passed"}</td>
                              <td></td>
                            </tr>
                          )
                        })}
                        {console.log(filterResolution)}
                      </table>
                      </div> */}
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
