import React, { Fragment, useState, useEffect } from "react";
import { getShareHolderHistoryByCompanyandDate, getShareHoldersByCompany } from "store/services/shareholder.service";
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
import { getCompanies } from "store/services/company.service"
import { getCorporateAnnouncement, getCorporateAnnouncementByCompanyCode, getCorporateEntitlementByAnnouncement, getCorporateEntitlementByCompanyCodeService } from "store/services/corporate.service"
import { getCorporateEntitlement } from "store/services/corporate.service"
import { getShareholders } from "store/services/shareholder.service"
import { numberWithCommas } from "utilities/utilityFunctions";

export default function RightAllotmentReport() {
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
  const [inactive_shareholders_data, setInactive_shareholders_data] = useState([])
  const [shareholders_data, setShareholders_data] = useState([])
  const [entitlements, setEntitlements] = useState([])
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);
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
    //  const getAllCorporateAnnouncement = async () => {
    //   setAnnouncement_data_loading(true);
    //   try{
    //   const response = await getCorporateAnnouncement(baseEmail)
    //   if (response.status===200) {
    //         const parents = response.data.data
    //         setAnnouncements(parents)
    //         setAnnouncement_data_loading(false)
    //   } }catch(error) {
    //     setAnnouncement_data_loading(false);
    //   }
    //   };
    //   const getAllCorporateEntitlements = async () => {
    //     try{
    //     const response = await getCorporateEntitlement(baseEmail)
    //     if (response.status===200) {
    //           const parents = response.data.data
    //           setEntitlements(parents)
    //     } }catch(error) {
    //     }
    //     };
      // const getAllShareHolders = async () => {
      //   try{
      //   const response = await getShareholders(baseEmail)
      //   if (response.status===200) {
      //         const parents = response.data.data
      //         setShareholders_data(parents);
      //         setInactive_shareholders_data(parents)
      //   } }catch(error) {
      //   }
      //   };
        // getAllShareHolders();
      // getAllCorporateAnnouncement();
      // getAllCorporateEntitlements()
    getAllCompanies();
 }, []);

 const getCorporateAnnouncementsForSelectedCompany = async () => {
  setAnnouncement_data_loading(true);
  try {
    const response = await getCorporateAnnouncementByCompanyCode(
      baseEmail,
      selectedCompany
    );
    if (response.status === 200) {
      const parents = response.data.data
      setAnnouncements(parents);
      setAnnouncement_data_loading(false);
    }
  } catch (error) {
    setAnnouncement_data_loading(false);
  }
};

const getEntitlementsForSelectedCompany = async () => {
  // setEntitlement_data_loading(true);
  try {
    const response = await getCorporateEntitlementByCompanyCodeService(
      baseEmail,
      selectedCompany
    );
    if (response.status === 200) {
          const parents = response.data.data
        // console.log("Entitlements => ", parents)
        setEntitlements(parents)
    }
  } catch (error) {
    // setEntitlement_data_loading(false);
  }
};

const getShareHoldersByCompanyCode = async () => {
  try {
    
    const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
    if (response.status === 200) {
      const parents = response.data.data;
      setShareholders_data(parents);
      setInactive_shareholders_data(parents);

    }
  } catch (error) {
    toast.error("Error fetching shareholders")
  }
};

 useEffect(() => {
  if(selectedCompany !== ""){
    getShareHoldersByCompanyCode();
    // getEntitlementsForSelectedCompany();
    getCorporateAnnouncementsForSelectedCompany();
  } else {
    setShareholders_data([]);
    setInactive_shareholders_data([]);
    // setEntitlements([]);
    setAnnouncements([]);
  }
 }, [selectedCompany])


 const getEntitlementsForSelectedAnnouncement = async () => {
  // setEntitlement_data_loading(true);
  try {
    const response = await getCorporateEntitlementByAnnouncement(
      baseEmail,
      selectedAnnouncement
    );
    if (response.status === 200) {
          const parents = response.data.data
        // console.log("Entitlements => ", parents)
        setEntitlements(parents)
    }
  } catch (error) {
    // setEntitlement_data_loading(false);
  }
};


 useEffect(() => {
  if(selectedAnnouncement && selectedAnnouncement !== ""){
    getEntitlementsForSelectedAnnouncement()
  }
  else{
    setEntitlements([]);
  }
 }, [selectedAnnouncement])

  // useEffect(async () => {
  //   document.title = "Share Holders";
  //   try {)
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
        <td>{shareholder.folio_number.replace(`${selectedCompany}-`,'')}</td>
        <td>{shareholder.shareholder_name}</td>
        <td className="text-right">{numberWithCommas(shareholder.total_holding)}</td>
        <td className="text-right">{numberWithCommas(shareholder.right_shares)}</td>
        <td className="text-right">{numberWithCommas(shareholder.r_fraction)}</td>
        {/* <td className="text-right">{numberWithCommas(shareholder.right_subscribed)}</td> */}
        <td className="text-right">{shareholder.allotment_letter_number}</td>
        <td className="text-right">{shareholder.no_of_letters}</td>
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
      const generated_physical_entitlements = entitlements
      //comment new
        // .filter(
        //   (en) =>
        //     // en.company_code === selectedCompany &&
        //     en.announcement_id === selectedAnnouncement
        // )
        .filter(
          (en) =>
            shareholders_data.find(
              (item) => item.folio_number === en.folio_number
            )?.cdc_key === "NO"
        );
      const generated_electronic_entitlements = entitlements
        // .filter(
        //   (en) =>
        //     // en.company_code === selectedCompany &&
        //     en.announcement_id === selectedAnnouncement
        // )
        .filter(
          (en) =>
            shareholders_data.find(
              (item) => item.folio_number === en.folio_number
            )?.cdc_key === "YES"
        );
      const filtered_shareholders = generated_physical_entitlements.map(
        (en, i) => {
          const associated_holder = shareholders_data.find(
            (item) => item.folio_number === en.folio_number
          );

          return {
            ...en,
            folio_number:en.folio_number.replace(`${selectedCompany}-`,''),
            allotment_letter_number: i + 2,
            no_of_letters: 1,
            shareholder_address:
              associated_holder?.street_address +
              ", " +
              associated_holder?.city,
            cdc_key: associated_holder?.cdc_key,
          };
        }
      );
      const cdc_holder = inactive_shareholders_data.find(
        (item) => item.folio_number === selectedCompany + "-0"
      );

      if(cdc_holder) {
        filtered_shareholders.unshift({
          ...cdc_holder,
          folio_number: cdc_holder.folio_number.replace(`${selectedCompany}-`,''),
          total_holding: _.sum(
            generated_electronic_entitlements.map(
              (item) => parseInt(item.total_holding) || 0
            )
          ),
          r_fraction: _.sum(
            generated_electronic_entitlements.map(
              (item) => parseFloat(item.r_fraction) || 0
            )
          ),
          right_shares: _.sum(
            generated_electronic_entitlements.map(
              (item) => parseFloat(item.right_shares) || 0
            )
          ),
          // right_subscribed: 0,
          allotment_letter_number: 1,
          no_of_letters: 1,
          shareholder_address:
            "CDC House, 99-B, Block-B, S.M.C.H.S.,  Main Shahra-e-Faisal, Karachi – 74400, Pakistan.",
        });
      }
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
    ],
    ["Registrar:", "Digital Custodian Company Limited"],
    [
      "Right Rate:",
      `${
        announcements.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.right_rate
      }`,
      "Right Percent:",
      `${
        announcements.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.right_percent
      }%`,
      "Right Number:",
      `${
        announcements.find(
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
        //comment new
        // "right_subscribed",
        "allotment_letter_number",
        "no_of_letters",
        "shareholder_address",
      ])
    ).map((e) => e.toUpperCase().replaceAll("_", " "));
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
      <h6 className="text-nowrap mt-3 ml-3">Right Allotment Report</h6>
      <Breadcrumb title="Right Allotment Report" parent="Reporting" />
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
                        `Right Allotment Report ${getvalidDateDMY(new Date())}`,
                        "Right Allotment Report",
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
                            // "right_subscribed",
                            "allotment_letter_number",
                            "no_of_letters",
                            "shareholder_address",
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
                        <th className="text-right">Shareholding</th>
                        <th className="text-right">Right Entitlement</th>
                        <th className="text-right">Fraction</th>
                        {/* <th className="text-right">Right Subscribed</th> */}
                        <th className="text-right">Allotment Letter Number</th>
                        <th className="text-right">No of Letters</th>
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
