import React, { Fragment, useState, useEffect } from "react";
import { getShareHolderHistoryByCompanyandDate } from "store/services/shareholder.service";
import {
  darkStyle,
  disabledStyles,
  errorStyles,
} from "components/defaultStyles";
import Breadcrumb from "components/common/breadcrumb";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  generateExcel,
  getvalidDateDMonthY,
  getvalidDateDMY,
  IsJsonString,
  listCrud,
} from "utilities/utilityFunctions";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import * as _ from "lodash";
import {
  company_setter,
  investor_setter,
} from "store/services/dropdown.service";
import { generateRegex, getFoundObject } from "utilities/utilityFunctions";
import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";

export default function RightAllotmentReportRegister() {
  const baseEmail = sessionStorage.getItem("email") || "";
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [search, setSearch] = useState("");
  const [underSearch, setUnderSearch] = useState("");
  const [companyNameSearch, setCompanyNameSearch] = useState(false);
  const [folioNoSearch, setFolioNoSearch] = useState(false);
  const [createdAtSearch, setCreatedAtSearch] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [shareholdingHistory, setShareholdingHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [shareho, setshareho] = useState();
  const [shareholderNameSearch, setShareholderNameSearch] = useState(true);
  const [searchedAllotments, setSearchedAllotments] = useState([]);
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [company_options, setCompany_options] = useState([]);
  const [investor_options, setInvestor_options] = useState([]);
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);
  // Selector STARTS
  const shareholders = useSelector((data) => data.Shareholders);
  const companies = useSelector((data) => data.Companies);
  const entitlements = useSelector((data) => data.Entitlements);
  const announcements = useSelector((data) => data.Announcements);
  const investors = useSelector((data) => data.Investors);

  // Selector ENDS

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
  const displayShareholdersPerPage = searchedAllotments
    .sort((a, b) => {
      if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
        return -1;
      if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
        return 1;
      return 0;
    })
    .slice(pagesVisited, pagesVisited + shareholderPerPage)
    .map((shareholder, i) => (
      <tr key={i}>
        <td>{shareholder.folio_number}</td>
        <td>{shareholder.shareholder_name}</td>
        <td>{shareholder.total_holding}</td>
        <td>{shareholder.right_shares}</td>
        <td>{shareholder.r_fraction}</td>
        <td>{shareholder.right_subscribed}</td>
        <td>{shareholder.net_holding}</td>
        <td>{shareholder.from}</td>
        <td>{shareholder.to}</td>
        <td>{shareholder.no_of_letters}</td>
      </tr>
    ));
  const pageCount = Math.ceil(searchedAllotments.length / shareholderPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */

  const handleHistorySearch = () => {
    const getShareholders = () => {
      const filtered_shareholders = entitlements.entitlement_data
        .filter(
          (en) =>
            en.company_code === selectedCompany &&
            en.announcement_id === selectedAnnouncement
        )
        .map((en) => ({
          ...en,
          from: IsJsonString(en.r_letters)
            ? JSON.parse(en.r_letters)[0].from
            : "",
          to: IsJsonString(en.r_letters)
            ? JSON.parse(en.r_letters)[JSON.parse(en.r_letters).length - 1].to
            : "",
          no_of_letters: IsJsonString(en.r_letters)
            ? JSON.parse(en.r_letters).length
            : "0",
          net_holding:
            parseInt(en.total_holding) + parseInt(en.right_subscribed),
        }));
      setSearchedAllotments(filtered_shareholders);
    };
    if (selectedAnnouncement && selectedCompany) {
      getShareholders();
    }
  };
  const headings = announcements.announcement_data.length && [
    [
      "Company:",
      companies.companies_data.find(
        (comp) =>
          comp.code ===
          announcements.announcement_data.find(
            (ann) => ann.announcement_id === selectedAnnouncement
          )?.company_code
      )?.company_name,
    ],
    ["Registrar:", "Digital Custodian Company Limited"],
    [
      "Right Rate:",
      `${
        announcements.announcement_data.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.right_rate
      }`,
      "Right Percent:",
      `${
        announcements.announcement_data.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.right_percent
      }%`,
      "Right Number:",
      `${
        announcements.announcement_data.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.right_number
      }`,
    ],
    ["Holding as on:", getvalidDateDMonthY(new Date())],
  ];
  const columns =
    searchedAllotments.length &&
    _.keys(
      _.pick(searchedAllotments[searchedAllotments.length - 1], [
        "folio_number",
        "shareholder_name",
        "total_holding",
        "right_shares",
        "r_fraction",
        "right_subscribed",
        "net_holding",
        "from",
        "to",
        "no_of_letters",
      ])
    ).map((e) => e.toUpperCase().replaceAll("_", " "));
  return (
    <Fragment>
      <Breadcrumb title="Right Allotment Register" parent="Reporting" />

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header ">
                <div className="d-flex justify-content-between">
                  <h5>Right Allotment Register</h5>
                  <button
                    className="btn btn-success"
                    disabled={
                      searchedAllotments.length === 0 ||
                      !selectedAnnouncement ||
                      !selectedCompany
                    }
                    onClick={(e) => {
                      generateExcel(
                        `Right Allotment Register ${getvalidDateDMY(
                          new Date()
                        )}`,
                        "Right Allotment Register",
                        "Report",
                        "Report",
                        "DCCL",
                        headings,
                        columns,
                        searchedAllotments.map((data) => ({
                          ..._.pick(data, [
                            "folio_number",
                            "shareholder_name",
                            "total_holding",
                            "right_shares",
                            "r_fraction",
                            "right_subscribed",
                            "net_holding",
                            "from",
                            "to",
                            "no_of_letters",
                          ]),
                        }))
                      );
                    }}
                  >
                    <i className="fa fa-file-excel-o mr-1"></i>Generate Report
                  </button>
                </div>

                <div className="row mt-2">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={companies.companies_dropdown}
                        isLoading={companies.companies_data_loading === true}
                        onChange={(selected) => {
                          !!selected?.value &&
                            setSelectedCompany(selected.value);
                          !selected && setSelectedCompany("");
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Company And Announcement to Check Right
                          Allotment Report
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">
                        Select Announcement
                      </label>
                      <Select
                        options={announcements.announcement_data
                          .filter(
                            (ann) =>
                              ann?.company_code === selectedCompany &&
                              ann?.expired === "true"
                          )
                          .map((item) => {
                            let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
                            return {
                              label: label,
                              value: item.announcement_id,
                            };
                          })}
                        isDisabled={!selectedCompany}
                        isLoading={announcements.announcement_data_loading}
                        styles={!!selectedCompany ? darkStyle : disabledStyles}
                        onChange={(selected) => {
                          !!selected?.value &&
                            setSelectedAnnouncement(selected.value);
                          !selected && setSelectedAnnouncement("");
                        }}
                        isClearable={true}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Announcement And Date to Check Right Allotment
                          Report
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <button
                    className="btn btn-success ml-3"
                    onClick={(e) => handleHistorySearch()}
                    disabled={!selectedAnnouncement && !selectedCompany}
                  >
                    Generate
                  </button>
                </div>
              </div>
              {historyLoading === true && <Spinner />}
              {historyLoading === false && !!searchedAllotments.length && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>Folio Number</th>
                        <th>Shareholder Name</th>
                        <th>Shareholding</th>
                        <th>Right Entitlement</th>
                        <th>Fraction</th>
                        <th>Right Subscribed</th>
                        <th>Net Holding</th>
                        <th>Allotment From</th>
                        <th>Allotment To</th>
                        <th>No of Letters</th>
                        {/* {(crudFeatures[1] || crudFeatures[2]) && (
                          <th>Action</th>
                        )} */}
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
              {!searchedAllotments.length && !historyLoading && (
                <p className="text-center">
                  <b>
                    Shareholders Data not available. Select Company and
                    Announcement to generate Record
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
