import React, { Fragment, useState, useEffect } from "react";
import {
  getShareHolderPatternByCompanyandDate,
} from "../../../store/services/shareholder.service";
import { darkStyle } from "../../defaultStyles";
import Breadcrumb from "../../common/breadcrumb";
import { useSelector } from "react-redux";
import { getCompanies } from "../../../store/services/company.service";
import {
  generateExcel,
  getvalidDateDMonthY,
  getvalidDateDMY,
  isNumber,
  listCrud,
} from "../../../utilities/utilityFunctions";
import Select from "react-select";
import { toast } from "react-toastify";
import * as _ from "lodash";
import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";
import { numberWithCommas } from "../../../utilities/utilityFunctions";
import ReportHeader from "./report-header";
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "./page-template";
import { Chart } from "react-google-charts";
export default function CategoryOfShareholding() {
  const pdfExportComponent = React.useRef(null);
  const baseEmail = sessionStorage.getItem("email") || "";
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [underSearch, setUnderSearch] = useState("");
  const [patternDate, setPatternDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [patternLoading, setPatternLoading] = useState(false);
  const [serachedShareholders, setSerachedShareholders] = useState([]);
  const [companies, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [selectedCompanDetail, setSelectedCompanDetail] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [viewExcel, setViewExel] = useState(false);
  const [viewPDF, setViewPDF] = useState(false);
  const [gerateFlag, setGerateFlag] = useState(false);
  const [totalShareHeld, setTotalShareHeld] = useState('0');
  const [graphData, setGraphData] = useState(null);
  const options = {
    is3D: true,
    pieSliceText: 'none',
    width: 400,
    height: 300,
    tooltip: {
      isHtml: true,
      trigger: 'none'
    },
    chartArea: {
      left: 1,
      top: 25,
      right: 70,
      width: '80% ',
      height: '80%'
    },
    sliceVisibilityThreshold: 0,
    legend: {
      position: 'right',
      alignment: 'center',
      maxLines: 1,
      textStyle: {
        color: '#a5a5a5',
        fontSize: 12,
        width: '100%',
        bold: true,
      },
    }
  };
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

  //  Function First Letter Capital after space
  const titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }

  useEffect(() => {
    const dummyArray = [['City', '2010 Population']];

    serachedShareholders.map((item) => {

      if (item?.length) {
        const arr = [];
        if (((item[1] / totalShareHeld) * 100).toFixed(2) > 0.00) {
          arr.push(`${(titleCase(item[0]) && titleCase(item[0].replaceAll('_', ' ')).length === 3 && titleCase(item[0].replaceAll('_', ' ')).includes('Cdc')) ? titleCase(item[0].replaceAll('_', ' ')).toUpperCase() : titleCase(item[0].replaceAll('_', ' '))}`);
          arr.push(item[1])
          dummyArray.push(arr);
        }

      }

    });
    setGraphData(dummyArray)
  }, [JSON.stringify(serachedShareholders)])
  // console.log('=====', serachedShareholders)




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
    .map((category, i) => (
      <tr key={i}>
        <td>{(titleCase(category[0]) && titleCase(category[0].replaceAll('_', ' ')).length === 3 && titleCase(category[0].replaceAll('_', ' ')).includes('Cdc')) ? titleCase(category[0].replaceAll('_', ' ')).toUpperCase() : titleCase(category[0].replaceAll('_', ' '))}</td>
        <td className="text-nowrap text-right">{numberWithCommas(parseFloat(isNumber(category[1])))}</td>
        <td className="text-nowrap text-right">{((parseFloat(isNumber(category[1])) / parseFloat(isNumber(totalShareHeld))) * 100).toFixed(4)}%</td>
        {/* <td>{pattern.no_of_shareholders}</td>
        <td className="text-right">{numberWithCommas(pattern.total_holding)}</td> */}
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
          let total_shareheld = 0;
          console.log('response.data.data',response.data.data)
          const modified_data = response.data.data.Holding_report.map((item, index) => {
            Object.values(item).map((elem) => {
              total_shareheld = parseFloat(total_shareheld) + elem;
            })

            return Object.entries(item)
          });
          // console.log('eee',total_shareheld)
          setTotalShareHeld(total_shareheld);
          setSerachedShareholders(modified_data.flat());
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
  const columns_array = ["Categories of Shareholders", "Share Held", "percentage"];
  const generateCompleteShareHoldingPattern = () => {
    const data_array = serachedShareholders
      .filter((data) => data.folio_number !== `${selectedCompany}-0`)
      .map((data) => ({
        ..._.pick(data, columns_array),
      }));
    const headings = [["Pattern As On:", getvalidDateDMonthY(patternDate)]];
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
    console.log('heading', headings, 'columns', columns, 'data-array', data_array)
    generateExcel(
      `Category Of Shareholding ${getvalidDateDMY(new Date())}`,
      "Category Of Shareholding",
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
        <h6 className="text-nowrap mt-3 ml-3">Category of Shareholding</h6>
        <Breadcrumb title="Category of Shareholding" parent="Shareholdings" />
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header ">
                <div className="d-flex justify-content-end">

                  {/* {
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
                  } */}
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
                  {/* {
                    gerateFlag && ( */}
                  <>
                    {/* <div className="row mt-2 ml-3">
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
                        </div> */}
                    <div className="row mt-2">
                      <button
                        className="btn btn-danger ml-3"
                        onClick={(e) => {
                          setViewPDF(true);
                          setViewExel(false);
                          handlePatternSearch();
                        }}
                        disabled={!patternDate || !selectedCompany}
                      >
                        View
                      </button>
                    </div>
                    {
                      viewPDF === true && (
                        <div className="row mt-2  ml-4">
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
                  </>
                  {/* )} */}
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

              {/* {patternLoading === true && <Spinner />} */}
              {(viewExcel === true && patternLoading === false && !!serachedShareholders.length) && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>Categories of Shareholders</th>
                        <th className="text-nowrap text-right">Share Held</th>
                        <th className="text-nowrap text-right">Percentage</th>
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
              {(viewPDF === true && patternLoading === false && !!serachedShareholders.length > 0) ? (
                <PDFExport
                  paperSize="A4"
                  margin="1.5cm"
                  scale={0.6}
                  fileName={`Category of Shareholding (${selectedCompany})`}
                  pageTemplate={PageTemplate}
                  ref={pdfExportComponent}
                >
                  <ReportHeader
                    title="Shareholder Details"
                    logo={selectedCompanDetail.logo}
                  />
                  <h5
                    className="text-center"
                    style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                  >
                    Category of Shareholders
                  </h5>
                  <div
                    className="text-center"
                    style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                  >
                    Company:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {selectedCompanDetail.company_name}
                    </span>
                  </div>
                  {(viewPDF === true && serachedShareholders.length > 0) && (
                    <>
                      <div className='row'>
                        <div className="col-md-7">
                          <div className="table-responsive">
                            <table
                              className="table"
                              style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                            >
                              <thead
                                style={{
                                  backgroundColor: "#2E75B5",
                                }}
                              >
                                <th style={{ color: "white", width: '40%' }} className="text-nowrap">
                                  Categories
                                </th>
                                <th style={{ color: "white", width: '30%' }} className="text-nowrap text-right">
                                  Shares Held
                                </th>
                                <th style={{ color: "white", width: '30%' }} className="text-nowrap text-right">
                                  Percentage
                                </th>
                                {/* <th style={{ color: "white", width: '25%' }} className="text-nowrap text-center">Graph</th> */}
                              </thead>
                              <tbody>
                                {serachedShareholders.map((category, i) => {
                                  if (parseFloat(isNumber(category[1])) !== 0) {
                                    return (
                                      <tr key={i}>

                                        <td style={{ width: '40%' }}>{(titleCase(category[0]) && titleCase(category[0].replaceAll('_', ' ')).length === 3 && titleCase(category[0].replaceAll('_', ' ')).includes('Cdc')) ? titleCase(category[0].replaceAll('_', ' ')).toUpperCase() : titleCase(category[0].replaceAll('_', ' '))}</td>

                                        <td className="text-nowrap text-right" style={{ width: '30%' }}>{numberWithCommas(parseFloat(isNumber(category[1])))}</td>
                                        <td className="text-nowrap text-right" style={{ width: '30%' }}>{((parseFloat(isNumber(category[1])) / parseFloat(isNumber(totalShareHeld))) * 100).toFixed(2)}%</td>
                                        {/* <td className="text-nowrap" style={{ width: '25%' }}></td> */}
                                      </tr>
                                    );
                                  }
                                })}
                              </tbody>
                              {/* <tfoot>
                            <tr>
                              <td>Total</td>
                              <td className="text-right">
                                {numberWithCommas(parseFloat(isNumber(totalShareHeld)))}
                              </td>
                              <td >
                              </td>
                              <td >
                              </td>
                            </tr>
                          </tfoot> */}
                            </table>
                            <hr />
                          </div>
                          <div className="col-md-12 d-flex justify-content-end" style={{ float: 'right', fontWeight: 'bold' }}>Total: {numberWithCommas(parseFloat(isNumber(totalShareHeld)))}</div>
                        </div>
                        <div className="col-md-5">
                          <div className='row'>
                            <div className="col-md-8">
                              <Chart
                                chartType="PieChart"
                                data={graphData}
                                options={options}
                                // width={600}
                                // height={600}
                                style={{ borderRadius: '2rem', paddingRight: '250px' }}
                              />
                            </div>
                            <div className="col-md-2">

                            </div>
                          </div>
                        </div>
                      </div>

                    </>
                  )}
                  {/* <Chart
                    chartType="PieChart"
                    data={graphData}
                    options={options}
                    style={{ borderRadius: '2rem', overflow: 'hidden', paddingLeft: '10px', marginTop: '20px' }}
                  /> */}
                </PDFExport>
              ):(!serachedShareholders.length && !patternLoading) && (
                <p className="text-center">
                  <b>
                    Category of Shareholding Data not available. Select Date and Company to
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
