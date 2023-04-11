import React, { Fragment, useState, useEffect } from "react";
import {
  getCDCDate,
  getShareHolderPatternByCompanyandDate,
} from "../../../store/services/shareholder.service";
import Dropdown from "../../common/dropdown";
import { darkStyle } from "../../defaultStyles";
import Breadcrumb from "../../common/breadcrumb";
import { usePattern } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCompanies } from "../../../store/services/company.service";
import {
  generateExcel,
  getvalidDateDMonthY,
  getvalidDateDMY,
  IsJsonString,
  listCrud,
} from "../../../utilities/utilityFunctions";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import * as _ from "lodash";
// import AddShareholder from "./addShareholders";
// import EditShareholder from "./editShareholder";
// import ViewShareholder from "./viewShareholder";
import {
  company_setter,
  investor_setter,
} from "../../../store/services/dropdown.service";
import {
  generateRegex,
  getFoundObject,
} from "../../../utilities/utilityFunctions";
import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";
import { numberWithCommas } from "../../../utilities/utilityFunctions";
import ReportHeader from "./report-header";
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "./page-template";
import { searchTransactionLimitData } from "store/services/user.service";

export default function ShareholdingPattern() {
  const pdfExportComponent = React.useRef(null);
  const baseEmail = sessionStorage.getItem("email") || "";
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [cdcDates, setCdcDates] = useState([]);
  const [cdcDatesLoading, setCdcDatesLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [search, setSearch] = useState("");
  const [underSearch, setUnderSearch] = useState("");
  const [companyNameSearch, setCompanyNameSearch] = useState(false);
  const [folioNoSearch, setFolioNoSearch] = useState(false);
  const [createdAtSearch, setCreatedAtSearch] = useState(false);
  const [patternDate, setPatternDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [shareholdingPattern, setShareholdingPattern] = useState([]);
  const [patternLoading, setPatternLoading] = useState(false);
  const [shareho, setshareho] = useState();
  const [shareholderNameSearch, setShareholderNameSearch] = useState(true);
  const [serachedShareholders, setSerachedShareholders] = useState([]);
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [company_options, setCompany_options] = useState([]);
  const [investor_options, setInvestor_options] = useState([]);
  const [companies, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [selectedCompanDetail, setSelectedCompanDetail] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [viewExcel, setViewExel] = useState(false);
  const [viewPDF, setViewPDF] = useState(false);
  const [gerateFlag, setGerateFlag] = useState(false);

  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);
  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try {
        const response = await getCompanies(baseEmail)
        if (response.status === 200) {
          const parents = response.data.data
          const companies_dropdowns = response.data.data.map((item) => {
            let label = `${item.code} - ${item.company_name}`;
            return { label: label, value: item.code };
          });
          setCompanies_dropdown(companies_dropdowns);
          setCompanies_data(parents)
          setCompanies_data_loading(false);
        }
      } catch (error) {
        setCompanies_data_loading(false);
      }
    };
    getAllCompanies();

  }, [])

  // useEffect(async () => {
  //   document.title = "Share Holders";
  //   try {
  //     setCompany_options(await company_setter());
  //     setInvestor_options(await investor_setter());
  //   } catch (err) {
  //     toast.error(`${err.response.data.message}`);
  //   }
  // }, []);

  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const shareholderPerPage = 10;
  const pagesVisited = pageNumber * shareholderPerPage;
  const totalnumberofPages = 100;
  const displayShareholdersPerPage = serachedShareholders
    .sort((a, b) => {
      if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
        return -1;
      if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
        return 1;
      return 0;
    })
    .slice(pagesVisited, pagesVisited + shareholderPerPage)
    .map((pattern, i) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{pattern.from}</td>
        <td>{pattern.to}</td>
        <td>{pattern.no_of_shareholders}</td>
        <td className="text-right">{numberWithCommas(pattern.total_holding)}</td>
      </tr>
    ));
  const pageCount = Math.ceil(serachedShareholders.length / shareholderPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */

  const handlePatternSearch = () => {
    const getShareholdingPattern = async () => {
      try {
        setPatternLoading(true);
        const response = await getShareHolderPatternByCompanyandDate(
          baseEmail,
          selectedCompany,
          patternDate
        );
        if (response.status === 200) {
          const modified_data = response.data.data.Pattern.map((item) => ({
            no_of_shareholders: item.noOfShareholder,
            total_holding: item.totalholding,
            ...item,
          }));
          setSerachedShareholders(modified_data);
          setUnderSearch("searched");
          setPatternLoading(false);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error(error?.message);
        setUnderSearch("");
        setPatternLoading(false);
      }
    };
    if (patternDate && selectedCompany) {
      getShareholdingPattern();
    }
  };
  const headings = [["Holding as on:", getvalidDateDMonthY(patternDate)]];
  const columns_array = ["from", "to", "no_of_shareholders", "total_holding"];
  const generateCompleteShareHoldingPattern = () => {
    const data_array = serachedShareholders
      .filter((data) => data.folio_number !== `${selectedCompany}-0`)
      .map((data) => ({
        ..._.pick(data, columns_array),
      }));
    const headings = [
      ["Pattern As On:", getvalidDateDMonthY(patternDate)],
      ["Company:", selectedCompanDetail?.company_name]
  
  ];
    const columns =
      serachedShareholders.length &&
      _.keys(
        _.pick(
          {
            ...data_array[data_array.length - 1],
          },
          columns_array
        )
      ).map((e) => e.toUpperCase().replaceAll("_", " "));
    generateExcel(
      `Shareholding Pattern ${getvalidDateDMY(new Date())}`,
      "Shareholding Pattern",
      "Report",
      "Report",
      "DCCL",
      headings,
      columns,
      data_array
    );
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Shareholdings Pattern</h6>
        <Breadcrumb title="Shareholdings Pattern" parent="Shareholdings" />
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header ">
                <div className="d-flex justify-content-end">
                  {
                    viewPDF === true && (
                      <div>
                        <h5></h5>
                        <button
                          className="btn btn-danger"
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
                  {
                    viewExcel === true && (
                      <div>
                        <h5></h5>
                        <button
                          className="btn btn-success"
                          disabled={!serachedShareholders.length}
                          onClick={generateCompleteShareHoldingPattern}
                        >
                          <i className="fa fa-file-excel-o mr-1"></i>Generate Report
                        </button>
                      </div>
                    )
                  }
                </div>

                <div className="row mt-2">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={companies_dropdown}
                        isLoading={companies_data_loading === true}
                        onChange={(selected) => {
                          const filter = companies.filter((item) => {
                            return item.code === selected.value;
                          });
                          setViewExel(false);
                          setViewPDF(false);
                          setSelectedCompanDetail(filter[0]);
                          !!selected?.value &&
                            setSelectedCompany(selected.value);
                          !selected && setSelectedCompany("");
                          !selected?.value && setUnderSearch("");
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Company And Date to Check shareholding pattern
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="history">Select Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="pattern"
                        id="pattern"
                        onChange={(e) => {
                          setPatternDate(e.target.value);
                          setViewExel(false);
                          setViewPDF(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-start">
                  {/* <div className="row mt-2">
                    <button
                      className="btn btn-success ml-3"
                      onClick={(e) => {
                        setGerateFlag(!gerateFlag);
                      }}
                      disabled={!patternDate || !selectedCompany}
                    >
                      Generate
                    </button>
                  </div> */}
                  {
                    // gerateFlag && (
                      <>
                        <div className="row mt-2 ml-3">
                          <button
                            className="btn btn-success ml-3"
                            onClick={(e) => {
                              setViewExel(true);
                              setViewPDF(false);
                              handlePatternSearch();
                            }}
                            disabled={!patternDate || !selectedCompany}
                          >
                            View Excel Report
                          </button>
                        </div>
                        <div className="row mt-2 ml-3">
                          <button
                            className="btn btn-danger ml-3"
                            onClick={(e) => {
                              setViewPDF(true);
                              setViewExel(false);
                              handlePatternSearch();
                            }}
                            disabled={!patternDate || !selectedCompany}
                          >
                            View PDF Report
                          </button>
                        </div>
                      </>
                    }
                </div>
                {/* <div className="row mt-2">
                  <button
                    className="btn btn-success ml-3"
                    onClick={(e) => handlePatternSearch()}
                    disabled={!patternDate || !selectedCompany}
                  >
                    Generate
                  </button> 
                </div>*/}
              </div>

              {(viewExcel === true &&patternLoading === true) && <Spinner />}
              {(viewExcel === true && patternLoading === false && !!serachedShareholders.length) && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>From</th>
                        <th>To</th>
                        <th>No of Shareholders</th>
                        <th className="text-right">Total Holding</th>
                      </tr>
                    </thead>

                    <tbody>{displayShareholdersPerPage}</tbody>
                  </table>
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
              {/* PDF CODE */}
              {(viewPDF === true && patternLoading === true) && <Spinner />}
              {(viewPDF === true && patternLoading === false && !!serachedShareholders.length) && (
                  <PDFExport
                    paperSize="A4"
                    margin="1.5cm"
                    scale={0.6}
                    fileName={`List of Shareholders (${selectedCompany})`}
                    pageTemplate={PageTemplate}
                    ref={pdfExportComponent}
                  >
                    <ReportHeader
                      title="Shareholder Details"
                      logo={selectedCompanDetail.logo}
                    />
                    <h5
                      className="text-center"
                      style={{ fontSize: "10px", fontFamily: "Palatino" }}
                    >
                     Pattern of Shareholding Report 
                    </h5>
                    <div
                      className="text-center"
                      style={{ fontSize: "10px", fontFamily: "Palatino" }}
                    >
                      Company:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {selectedCompanDetail.company_name}
                      </span>
                    </div>
                    {(viewPDF === true && serachedShareholders.length > 0) && (
                      <>
                        <div className="table-responsive">
                          <table
                            className="table"
                            style={{ fontSize: "10px", fontFamily: "Palatino" }}
                          >
                            <thead
                              style={{
                                backgroundColor: "#2E75B5",
                              }}
                            >
                              <th style={{ color: "white" }} className="text-nowrap">
                                No
                              </th>
                              <th style={{ color: "white" }} className="text-nowrap">
                                From
                              </th>
                              <th style={{ color: "white" }} className="text-nowrap">
                                To
                              </th>
                              <th style={{ color: "white" }} className="text-nowrap">
                                No of Shareholders
                              </th>
                              <th style={{ color: "white" }} className="text-nowrap text-right">
                                Total Holding
                              </th>
                            </thead>
                            <tbody>
                              {serachedShareholders.map((pattern, i) => {

                                return (
                                  <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{pattern.from}</td>
                                    <td>{pattern.to}</td>
                                    <td>{pattern.no_of_shareholders}</td>
                                    <td className="text-right">{numberWithCommas(pattern.total_holding)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
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
                          </table>
                          <hr />
                        </div>
                      </>
                    )}
                  </PDFExport>
              )}

              {(!serachedShareholders.length && !patternLoading) && (
                <p className="text-center">
                  <b>
                    Shareholders Data not available. Select Date and Company to
                    generate Record
                  </b>
                </p>
              )}

            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
