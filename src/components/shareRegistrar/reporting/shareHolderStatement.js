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
import Select from "react-select";
import { toast } from "react-toastify";
import * as _ from "lodash";

import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";
import { numberWithCommas } from "utilities/utilityFunctions";
import ReportHeader from "./report-header";
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "./page-template";
import moment from "moment";
import { getTransactionTypes } from "store/services/transaction.service";

export default function ShareholdingStatement() {
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
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState("");
  const [shareholderLoading, setShareholderLoading] = useState(false);
  const [serachedShareholders, setSerachedShareholders] = useState([]);
  const [companies, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [investors_data, setInvestors_data] = useState([]);
  const [shareholders_data, setShareholders_data] = useState([]);
  const [shareholders_data_loading, setShareholders_data_loading] =
    useState(false);
  const [txnData, setTxnData] = useState([]);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [selectedCompanDetail, setSelectedCompanDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txnTypes, setTxnTypes] = useState([]);
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);

  let closing_balance = 0;
  
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
    const getAllTxnTypes = async () => {
      try {
        const response = await getTransactionTypes(baseEmail);
        setTxnTypes(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllCompanies();
    getAllTxnTypes();
  }, []);
  useEffect(() => {
    if (!!selectedCompany) {
      getShareHoldersByCompanyCode();
    }
  }, [selectedCompany]);
  const handleShareHolderStatementSearch = () => {
    const getShareholderStatement = async () => {
      try {
        setLoading(true);
        setShareholderLoading(true);
        const folioCheck = await getShareHolderByFolioNo(baseEmail, folioNo);
        if (folioCheck.data.status == 200) {
         
          let previous_date = new Date(fromDate);
          previous_date.setDate(previous_date.getDate() - 1);
          const response = await getShareHolderHistoryByCompanyandDate(
            baseEmail,
            selectedCompany,
            moment(previous_date).format("YYYY-MM-DD")
          );
          if (response.data.status === 200) {
            console.log(response.data.data);
            let shareHoldersData = JSON.parse(
              response.data.data[response.data.data.length - 1].shareholders
            );
            let findIndex = shareHoldersData.findIndex(
              (x) => x.folio_number == folioNo
            );
            if (findIndex > -1) {
              setOpeningBalance(
                parseFloat(shareHoldersData[findIndex].physical_shares) +
                  parseFloat(shareHoldersData[findIndex].electronic_shares)
              );
            }

            if (folioCheck.data.data.cdc_key.toLowerCase() == "no") {
              const txn_response = await getShareHolderTransactionsbyDate(
                baseEmail,
                selectedCompany,
                fromDate,
                toDate,
                folioNo
              );
              if (txn_response.data.data.length > 0) {
                setTxnData(txn_response.data.data);
              } else {
                txnData.length=0
                setTxnData([])
                toast.error("Data not Found");
              }
            } else {
              const txn_response = await getShareHolderTransactionsbyDate(
                baseEmail,
                selectedCompany,
                fromDate,
                toDate,
                folioNo
              );
              if (txn_response.data.data.length > 0) {
                setTxnData(txn_response.data.data);
              } else {
                txnData.length=0
                setTxnData([])
                toast.error("Data not Found");
              }
            }

            setShareholderLoading(false);
            setLoading(false);
          }
        } else {
          toast.error("Folio Record not found");
          setLoading(false);
          setShareholderLoading(false);
        }
      } catch (error) {
        console.log(error);
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Shareholder Statement Data Not Found");
        setUnderSearch("");
        setShareholderLoading(false);
        setLoading(false);
      }
    };
    if (fromDate && toDate && folioNo && selectedCompany) {
      getShareholderStatement();
    }
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Shareholder Statement</h6>
        <Breadcrumb title="Shareholder Statement" parent="Shareholdings" />
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
                          setTxnData([])

                          !!selected?.value &&
                            setSelectedCompany(selected.value);
                          !selected && setSelectedCompany("");
                          !selected?.value && setUnderSearch("");
                          const filter = companies.find((item) => {
                            return item.code === selected.value;
                          });
                          setSelectedCompanDetail(filter);
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Company And Date to Check shareholder Statement
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="histyro">Folio No</label>
                      <input
                        className="form-control"
                        type="text"
                        name="history"
                        id="history"
                        placeholder="Folio No"
                        onChange={(e) => {
                          setSerachedShareholders([]);
                          setTxnData([])
                          setFolioNo(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="histyro">Select From Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="history"
                        id="history"
                        defaultValue={getvalidDateDMY(new Date())}
                        onChange={(e) => {
                          setSerachedShareholders([]);
                          setTxnData([])
                          setFromDate(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="histyro">Select To Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="history"
                        id="history"
                        defaultValue={getvalidDateDMY(new Date())}
                        onChange={(e) => {
                          setSerachedShareholders([]);
                          setTxnData([])
                          setToDate(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <button
                      className="btn btn-success ml-3 mt-4"
                      onClick={(e) => {
                        handleShareHolderStatementSearch();
                      }}
                      disabled={
                        !fromDate || !toDate || !selectedCompany || !folioNo
                      }
                    >
                      {companies && companies.length !== 0
                        ? "Generate"
                        : "Loading Data..."}
                    </button>
                  </div>
                  {txnData.length > 0 && (
                    <div className="col-md-4">
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
                    </div>
                  )}
                </div>
                {loading == true && <Spinner />}
                {loading == false && txnData.length > 0 && (
                  <PDFExport
                    paperSize="A4"
                    margin="1.5cm"
                    scale={0.6}
                    fileName={`Shareholder Statement of  (${selectedCompanDetail?.company_name || ""})`}
                    pageTemplate={PageTemplate}
                    ref={pdfExportComponent}
                  >
                    <ReportHeader
                      title="Shareholder Details"
                      logo={selectedCompanDetail?.logo || "****"}
                    />
                    <div className="row mb-2">
                    <div className="col-md-1"></div>
                      <div className="col-md-7">
                       Company Name: <b>
                      {selectedCompanDetail?.company_name || ""} </b>
                    
                      </div>
                      <div>
                      
                       Folio No: <b>
                      {folioNo} </b>
                    
                      </div>
                      </div>
                      <div className="row mb-2">
                    <div className="col-md-1"></div>
                      <div className="col-md-7">
                       From Date: <b>
                      {fromDate} </b>
                    
                      </div>
                      <div>
                      
                       To Date: <b>
                      {toDate} </b>
                    
                      </div>
                      </div>
                      <div className="row mb-2">
                      <div className="col-md-1"></div>
                      <div className="col-md-7">
                       Report Date: <b>
                      {moment(new Date()).format('YYYY-MM-DD')} </b>
                    
                      </div>
                      </div>

                    {txnData.length > 0 && (
                      <>
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <th>No</th>
                              <th>Date</th>
                              <th>ID</th>
                              <th>Description</th>
                              
                              <th className="text-right">Balance</th>
                            </thead>
                            </table>
                           
                           
                              <div className="d-flex justify-content-end">
                                 
                                  <b>Opening Balance</b> :
                                  {numberWithCommas(
                                    parseFloat(openingBalance).toFixed(2)
                                  )}
                                
                              </div>
                              <table className="table">
                              
                              <tbody>

                              {txnData.map((item, i) => {
                                let txn_index = txnTypes.findIndex(
                                  (x) => x.transactionCode == item.txn_type
                                );
                                if (item.from_folio && item.from_folio != "") {
                                  closing_balance =
                                    closing_balance - parseFloat(item.quantity);
                                } else {
                                  closing_balance =
                                    closing_balance + parseFloat(item.quantity);
                                }

                                return (
                                  <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{item.txn_execution_date}</td>
                                    <td>{item.txn_id}</td>
                                    <td>
                                      {txnTypes[txn_index].transactionName}
                                    </td>
                                    
                                    <td className="text-right">
                                      {numberWithCommas(parseFloat(item.quantity).toFixed(2))}
                                    </td>
                                  </tr>
                                );
                              })}
                              </tbody>
                              </table>
                              <div className="d-flex justify-content-end">
                                  
                                  <b>Closing Balance</b> :
                                  {numberWithCommas(
                                    parseFloat(
                                      openingBalance + closing_balance
                                    ).toFixed(2)
                                  )}
                                </div>
                            
                            {/* <tfoot>
                            <tr>
                              <td colSpan={2}></td>
                              <td colSpan={4}>Total</td>
                              <td className="text-right">
                                {numberWithCommas(totalShareholding)}
                              </td>
                              <td className="text-right">
                                {totalShareholdingPercentage}
                              </td>
                            </tr>
                          </tfoot> */}
                          {/* </table> */}
                          <hr />
                        </div>
                      </>
                    )}
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
