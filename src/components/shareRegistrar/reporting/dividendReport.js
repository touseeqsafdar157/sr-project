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
// import AddShareholder from "./addShareholders";
// import EditShareholder from "./editShareholder";
// import ViewShareholder from "./viewShareholder";
import {
  company_setter,
  investor_setter,
} from "store/services/dropdown.service";
import { generateRegex, getFoundObject } from "utilities/utilityFunctions";
import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";
import { getCompanies } from "store/services/company.service";
import { getCorporateAnnouncement } from "store/services/corporate.service";
import { getCorporateEntitlement } from "store/services/corporate.service";
import { getShareholders } from "store/services/shareholder.service";
import { numberWithCommas } from "utilities/utilityFunctions";

export default function DividendAllotmentReport() {
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
  const [companies, setCompanies] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcement_data_loading, setAnnouncement_data_loading] = useState([]);
  const [shareholders, setShareholders_data] = useState([])
  const [entitlements, setEntitlements] = useState([])
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);

  // useEffect(async () => {
  //   document.title = "Share Holders";
  //   try {
  //     setCompany_options(await company_setter());
  //     setInvestor_options(await investor_setter());
  //   } catch (err) {
  //     toast.error(`${err.response.data.message}`);
  //   }
  // }, []);

  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
     try{
     const response = await getCompanies(baseEmail)
     if (response.status===200) {
           const parents = response.data.data
           const companies_dropdowns = response.data.data.map((item) => {
            let label = `${item.code} - ${item.company_name}`;
            return { label: label, value: item.code };
          });
        setCompanies_dropdown(companies_dropdowns);
           setCompanies(parents)
           setCompanies_data_loading(false);
     } }catch(error) {
      setCompanies_data_loading(false);
     }
     };
     const getAllCorporateAnnouncement = async () => {
      setAnnouncement_data_loading(true);
      try{
      const response = await getCorporateAnnouncement(baseEmail)
      if (response.status===200) {
            const parents = response.data.data
            setAnnouncements(parents)
            setAnnouncement_data_loading(false)
      } }catch(error) {
        setAnnouncement_data_loading(false);
      }
      };
      const getAllCorporateEntitlements = async () => {
        try{
        const response = await getCorporateEntitlement(baseEmail)
        if (response.status===200) {
              const parents = response.data.data
              setEntitlements(parents)
        } }catch(error) {
        }
        };
      const getAllShareHolders = async () => {
        try{
        const response = await getShareholders(baseEmail)
        if (response.status===200) {
              const parents = response.data.data
              setShareholders_data(parents);
        } }catch(error) {
        }
        };
        getAllShareHolders();
      getAllCorporateAnnouncement();
      getAllCorporateEntitlements()
    getAllCompanies();
 }, [])

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
        <td>{shareholder.shareholder_address}</td>
        <td>{shareholder.cnic_ntn}</td>
        <td className="text-right">{numberWithCommas(shareholder.tax_percentage)}</td>
        <td className="text-right">{numberWithCommas(shareholder.total_holding)}</td>
        <td className="text-right">{numberWithCommas(shareholder.gross_dividend)}</td>
        <td className="text-right">{numberWithCommas(shareholder.tax)}</td>
        <td className="text-right">{numberWithCommas(shareholder.zakat)}</td>
        <td className="text-right">{numberWithCommas(shareholder.total_deducted)}</td>
        <td className="text-right">{numberWithCommas(shareholder.net_dividend)}</td>
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
      const filtered_shareholders = entitlements
        .filter(
          (en) =>
            en.company_code === selectedCompany &&
            en.announcement_id === selectedAnnouncement
        )
        .map((en) => {
          const holder = shareholders.find(
            (hol) => hol.folio_number === en.folio_number
          );
          return {
            ...en,
            roshan_account: holder.roshan_account,
            shareholder_address: holder?.street_address,
            cnic_ntn: holder?.shareholder_id,
            total_deducted: parseInt(en.tax) + parseInt(en.zakat),
          };
        });
      setSearchedAllotments(filtered_shareholders);
    };
    if (selectedAnnouncement && selectedCompany) {
      getShareholders();
    }
  };
  const headings = announcements.length && [
    [
      "Company:",
      companies.find(
        (comp) =>
          comp.code ===
          announcements.find(
            (ann) => ann.announcement_id === selectedAnnouncement
          )?.company_code
      )?.company_name,
      "Face Value",
      companies.find(
        (comp) =>
          comp.code ===
          announcements.find(
            (ann) => ann.announcement_id === selectedAnnouncement
          )?.company_code
      )?.face_value,
    ],
    [
      "Registrar:",
      "Digital Custodian Company Limited",
      "Dividend Percent:",
      `${
        announcements.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.dividend_percent
      }%`,
      "Dividend Number:",
      `${
        announcements.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.dividend_number
      }`,
    ],
    [
      "Title:",
      `Dividend Registered  As On: ${
        announcements.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.period_ended
      }`,
    ],
  ];
  const columns =
    searchedAllotments.length &&
    _.keys(
      _.pick(searchedAllotments[searchedAllotments.length - 1], [
        "folio_number",
        "shareholder_name",
        "shareholder_address",
        "cnic_ntn",
        "tax_percentage",
        "total_holding",
        "gross_dividend",
        "tax",
        "zakat",
        "total_deducted",
        "filer",
        "roshan_account",
        "dividend_amount",
      ])
    ).map((e) => e.toUpperCase().replaceAll("_", " "));
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
      <h6 className="text-nowrap mt-3 ml-3">Dividend Allotment Report</h6>
      <Breadcrumb title="Dividend Allotment Report" parent="Reporting" />
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header ">
                <div className="d-flex justify-content-between">
                  <h5></h5>
                  <button
                    className="btn btn-success"
                    disabled={
                      searchedAllotments.length === 0 ||
                      !selectedAnnouncement ||
                      !selectedCompany
                    }
                    onClick={(e) => {
                      generateExcel(
                        `Dividend Allotment Report ${getvalidDateDMY(
                          new Date()
                        )}`,
                        "Dividend Allotment Report",
                        "Report",
                        "Report",
                        "DCCL",
                        headings,
                        columns,
                        searchedAllotments.map((data) => ({
                          ..._.pick(data, [
                            "folio_number",
                            "shareholder_name",
                            "shareholder_address",
                            "cnic_ntn",
                            "tax_percentage",
                            "total_holding",
                            "gross_dividend",

                            "tax",
                            "zakat",
                            "total_deducted",
                            "filer",
                            "roshan_account",
                            "dividend_amount",
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
                        options={companies_dropdown}
                        isLoading={companies_data_loading === true}
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
                          Select Company And Announcement to Check Dividend
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
                        options={announcements
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
                        isLoading={announcement_data_loading}
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
                          Select Announcement And Date to Check Dividend
                          Allotment Report
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
                        <th>Shareholder Address</th>
                        <th>CNIC/NTN</th>
                        <th className="text-right">Tax Rate</th>
                        <th className="text-right">Shares Held</th>
                        <th className="text-right">Gross Dividend</th>
                        <th className="text-right">Income Tax</th>
                        <th className="text-right">Zakat Deduceted</th>
                        <th className="text-right">Total Deducted</th>
                        <th className="text-right">Net Dividend</th>
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
