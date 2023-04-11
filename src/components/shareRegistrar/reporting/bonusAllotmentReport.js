import React, { Fragment, useState, useEffect } from "react";
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
import { getCompanies } from "store/services/company.service";
import { getCorporateAnnouncement, getCorporateAnnouncementByCompanyCode, getCorporateEntitlementByAnnouncement, getCorporateEntitlementByCompanyCodeService } from "store/services/corporate.service";
import { getCorporateEntitlement } from "store/services/corporate.service";
import { numberWithCommas } from "utilities/utilityFunctions";
import { getShareCertificatesByCompany, getShareCertificatesByTxnAcceptDateService } from "store/services/shareCertificate.service";
import moment from "moment";
import { getTransactionsByAnnouncementIdService } from "store/services/transaction.service";

export default function BonusAllotmentReport() {
  const baseEmail = sessionStorage.getItem("email") || "";
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [searchedAllotments, setSearchedAllotments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcement_data_loading, setAnnouncement_data_loading] = useState([]);
  const [entitlements, setEntitlements] = useState([]);
  const [shareCertificates, setShare_certificates] = useState([]);
  const [transactionData, setTransactionData] = useState();
  const [loadingTxnData, setLoadingTxnData]= useState(true);
  const [parsedHistory, setParsedHistory] = useState();
const [loadingDAta, setLoadingDAta ] = useState(true);
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
      // const getAllCorporateEntitlements = async () => {
      //   try{
      //   const response = await getCorporateEntitlement(baseEmail)
      //   if (response.status===200) {
      //         const parents = response.data.data
      //         // console.log("Entitlements => ", parents)
      //         setEntitlements(parents)
      //   } }catch(error) {
      //   }
      //   };
      // getAllCorporateAnnouncement();
      // getAllCorporateEntitlements()
      getAllCompanies();
 }, [])

      const getShareCertificates = async(company_code)=>{
        try{
          const response = await getShareCertificatesByCompany(baseEmail,company_code);
          if(response.status===200){
            setShare_certificates(response.data.data);
          }else{
            setShare_certificates([]);
          }
        }catch(error){
          if(error.response!==undefined){
            toast.error(error.response.data.message);
          }else{
            toast.error(error.message);
          }
        }
      }

      const getCorporateAnnouncementsForSelectedCompany = async () => {
        setAnnouncement_data_loading(true);
        try {
          const response = await getCorporateAnnouncementByCompanyCode(
            baseEmail,
            selectedCompany
          );
          if (response.status === 200) {
            const parents = response.data.data
            // setAnnouncements(response.data.data);
            // const announcement_dropdowns = response.data.data.map((item) => {
            //   let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
            //   return { label: label, value: item.announcement_id };
            // });
            setAnnouncements(parents);
            setAnnouncement_data_loading(false);
          }
        } catch (error) {
          setAnnouncement_data_loading(false);
        }
      };

      

      // const getEntitlementsForSelectedCompany = async () => {
      //   // setEntitlement_data_loading(true);
      //   try {
      //     const response = await getCorporateEntitlementByCompanyCodeService(
      //       baseEmail,
      //       selectedCompany
      //     );
      //     if (response.status === 200) {
      //           const parents = response.data.data
      //         // console.log("Entitlements => ", parents)
      //         setEntitlements(parents)
      //     }
      //   } catch (error) {
      //     // setEntitlement_data_loading(false);
      //   }
      // };

      useEffect(() => {
        if(selectedCompany !=="") {
          getCorporateAnnouncementsForSelectedCompany();
          // getEntitlementsForSelectedCompany();
        } else {
          setAnnouncements([]);
          // setEntitlements([]);
        }
}, [selectedCompany]);


const getEntitlementsForSelectedAnnouncement = async () => {
  // setEntitlement_data_loading(true);
  setLoadingDAta(true);
  try {
    const response = await getCorporateEntitlementByAnnouncement(
      baseEmail,
      selectedAnnouncement
    );
    if (response.status === 200) {
          const parents = response.data.data
        setEntitlements(parents)
    }
  } catch (error) {
    setLoadingDAta(false);
    // setEntitlement_data_loading(false);
  }
    setLoadingDAta(false);
  

};

const getTxnForSelectedAnnouncement = async () => {
  // setEntitlement_data_loading(true);
  setLoadingTxnData(true);
  try {
    const response = await getTransactionsByAnnouncementIdService(
      baseEmail,
      selectedAnnouncement
    );
    if (response.status === 200) {
          let parents = response.data.data
        // console.log("Entitlements => ", parents)
        if (parents.length > 0) {
          parents = parents.filter((item) => item.txn_type === "BSA" && item.processing_status == "APPROVED");
        }
        setParsedHistory(JSON.parse(parents[0].txn_history));
        setTransactionData(parents);
        setLoadingTxnData(false);
    }
  } catch (error) {
    toast.error("Error fetching txn by announcement!");
    // setEntitlement_data_loading(false);
  }
};

useEffect(() => {
  if(selectedCompany && selectedAnnouncement !== ""){
    getEntitlementsForSelectedAnnouncement();
    getTxnForSelectedAnnouncement();
  }
  else{
    setParsedHistory([]);
    setEntitlements([]);
    setTransactionData([]);
  }
}, [selectedAnnouncement])

const getShareCertificatesByTxnAcceptDate = async(searchDate)=>{
  try{
    const response = await getShareCertificatesByTxnAcceptDateService(baseEmail,searchDate);
    // console.log("Certificate Response => ", response);
    if(response.status===200){
      setShare_certificates(response.data.data);
    }else{
      setShare_certificates([]);
    }
  }catch(error){
    if(error.response!==undefined){
      toast.error(error.response.data.message);
    }else{
      toast.error(error.message);
    }
  }
}

useEffect(() => {
  // console.log("History => ", parsedHistory);
  if(parsedHistory && parsedHistory !== "" && parsedHistory.length > 0){
    // console.log("History => ", parsedHistory[parsedHistory.length - 1]);
   let searchDate = parsedHistory[parsedHistory.length - 1]?.at;
   getShareCertificatesByTxnAcceptDate(searchDate)
  //  searchDate = moment(searchDate).format("YYYY-MM-DD");
  //  console.log("Search Date => ", searchDate);

  }
  else{
    setShare_certificates([]);
    // setParsedHistory([]);
    // setEntitlements([]);
    // setTransactionData([]);
  }
}, [parsedHistory])

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
    .map((shareholder, i) => {
      // console.log("Mapping Shareholder => ", shareholder)
      return(
      <tr key={i}>
        <td>{shareholder.folio_number.replace(`${selectedCompany}-`,'')}</td>
        <td>{shareholder.shareholder_name}</td>
        <td className="text-right">{numberWithCommas(shareholder.total_holding)}</td>
        <td className="text-right">{numberWithCommas(shareholder.bonus_shares)}</td>
        <td className="text-right">{numberWithCommas(shareholder.net_holding)}</td>
        {/* <td>{shareholder.certificate_from}</td>
        <td>{shareholder.certificate_to}</td> */}
        <td>{shareholder.certificate_no}</td>
        <td>{shareholder.distinctive_from}</td>
        <td>{shareholder.distinctive_to}</td>
        <td>{shareholder.no_of_letters}</td>
        <td className="text-right">{numberWithCommas(shareholder.b_fraction)}</td>
      </tr>
      )
      });
  const pageCount = Math.ceil(searchedAllotments.length / shareholderPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */

  // const handleHistorySearch = () => {
  //   const getShareholders = () => {
  //     const filtered_shareholders = entitlements
  //       .filter(
  //         (en) =>
  //           en.company_code === selectedCompany &&
  //           en.announcement_id === selectedAnnouncement
  //       )
  //       .map((en) => ({
  //         ...en,
  //         b_fraction: +en.b_fraction,
  //         folio_number: en.folio_number.replace(`${selectedCompany}-`,''),
  //         certificate_from: IsJsonString(en.b_letters)
  //           ? JSON.parse(en.b_letters)[0]?.certificate_no
  //           : "",
  //         certificate_to: IsJsonString(en.b_letters)
  //           ? JSON.parse(en.b_letters)[JSON.parse(en.b_letters).length - 1]
  //               ?.certificate_no
  //           : "",
  //         distinctive_from: IsJsonString(en.b_letters)
  //           ? JSON.parse(en.b_letters)[0]?.from
  //           : "",
  //         distinctive_to: IsJsonString(en.b_letters)
  //           ? JSON.parse(en.b_letters)[JSON.parse(en.b_letters).length - 1]?.to
  //           : "",
  //         no_of_letters: IsJsonString(en.b_letters)
  //           ? JSON.parse(en.b_letters).length
  //           : "0",
  //         net_holding: parseInt(en.total_holding) + parseInt(en.bonus_shares),
  //       }));
  //     setSearchedAllotments(filtered_shareholders);
  //   };
  //   if (selectedAnnouncement && selectedCompany) {
  //     getShareholders();
  //   }
  // };

  const getCertificateNo = (folio_no, created_at) =>{
    // console.log(folio_no);

   let data = shareCertificates.filter((item)=>{
    // console.log("item => ", item.allotted_to)
  //  return item.allotted_to===folio_no && item.issue_date === created_at});
  return item.allotted_to === folio_no && JSON.parse(item.certificate_history)[0].action.includes("alloted as bonus shares")});


  //  console.log(`Data of folio ${folio_no} => `, data)
  //  if(!data) {
  //   let date = new Date(created_at);
  //   date.setDate(date.getDate() + 1)
  //   date = moment(date).format("YYYY-MM-DD")
  //   data = shareCertificates.filter((item)=>item.allotted_to===folio_no && item.issue_date === date.toString());
  //  }
   let finalVal = data.length - 1
   data = data[finalVal]
   let certificateNo='';
  //  console.log(`Data of folio ${folio_no} => `, data)
   if(data!==undefined){
    certificateNo=data.certificate_no;
   }
   return certificateNo;
  }

  const getDistinctive = (folio_no, created_at) =>{
    let data = shareCertificates.filter((item)=>item.allotted_to===folio_no && JSON.parse(item.certificate_history)[0].action.includes("alloted as bonus shares"));
    // if(!data) {
    //   let date = new Date(created_at);
    //   date.setDate(date.getDate() + 1)
    //   date = moment(date).format("YYYY-MM-DD")
    //   data = shareCertificates.filter((item)=>item.allotted_to===folio_no && item.issue_date === date.toString());
    // }

    let finalVal = data.length - 1
    data = data[finalVal]

    // console.log("Data =>", data)
   
    let distinctive=[];
    if(data!==undefined){
      distinctive = JSON.parse(data.distinctive_no) !== undefined ? JSON.parse(data.distinctive_no) : [{from:'',to:''}]
    }else{
      distinctive= [{from:'',to:''}];
    }
    return [distinctive[0].from, distinctive[0].to]
   }

  const handleHistorySearch = () => {
    const getShareholders = () => {
      setHistoryLoading(true)
      // console.log("Entitlement? => ", entitlements);
      // console.log("Selected => ", selectedAnnouncement);
      let filtered_entitlements = entitlements
      .filter(
        (en) =>
          // en.company_code === selectedCompany &&
          en.announcement_id === selectedAnnouncement
      );
      // console.log("Filtered Entitlements => ", filtered_entitlements)
      const filtered_shareholders = entitlements
        .filter(
          (en) =>
            // en.company_code === selectedCompany &&
            en.announcement_id === selectedAnnouncement && en.b_executed == "true"
        )
        .map((en) => ({
          ...en,
          b_fraction: +en.b_fraction,
          folio_number: en.folio_number.replace(`${selectedCompany}-`,''),
          // certificate_from: getCertificateNo(en.folio_number),
          // certificate_to: getCertificateNo(en.folio_number),
          // certificate_no:getCertificateNo(en.folio_number, en.created_at).replace(`${selectedCompany}-`,''),
          certificate_no:getCertificateNo(en.folio_number).replace(`${selectedCompany}-`,''),
          distinctive_from: getDistinctive(en.folio_number)[0],
          distinctive_to: getDistinctive(en.folio_number)[1],
          no_of_letters: IsJsonString(en.b_letters)
            ? JSON.parse(en.b_letters).length
            : "0",
          net_holding: parseInt(en.total_holding) + parseInt(en.bonus_shares),
        }));
        // console.log("Filtered Shareholders => ", filtered_shareholders.filter(s => s.folio_number.replace(`${selectedCompany}-`,'') == "0"))
        // console.log("Filtering started")
        let physicalShareholders = filtered_shareholders.filter((item) => item.certificate_no !== "" && item.folio_number !== "0")
        let electronicShareholders = filtered_shareholders.filter((item) => item.certificate_no == "" || item.folio_number == "0")
        // console.log("Physical filtered => ", physicalShareholders)
        // console.log("Electronic filtered => ", electronicShareholders)
        // console.log("Sorting started")

        physicalShareholders = physicalShareholders.sort((a, b) => a.folio_number.replace('-','') - b.folio_number.replace('-',''))
        electronicShareholders = electronicShareholders.sort((a, b) => a.folio_number.replace('-','') - b.folio_number.replace('-',''))
        // console.log("Physical Sorted => ", physicalShareholders)
        // console.log("Electronic Sorted => ", electronicShareholders)
        // console.log("State update started")
        // console.log("CDC => ", electronicShareholders[0]);
        let finalSortedData = [...physicalShareholders, ...electronicShareholders];
        // console.log("Final Sorted => ", finalSortedData);
      // setSearchedAllotments(filtered_shareholders.sort((a, b) => a.folio_number.replace('-','') - b.folio_number.replace('-','')));
      setSearchedAllotments(finalSortedData);
   setTimeout(() => {
    setHistoryLoading(false)
   }, 1000);
    
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
      "Bonus Percent:",
      `${
        announcements.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.bonus_percent
      }%`,
      "Bonus Number:",
      `${
        announcements.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.bonus_number
      }`,
    ],
    [
      "Book Closure:",
      `From ${getvalidDateDMY(
        announcements.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.book_closure_from
      )} To ${getvalidDateDMY(
        announcements.find(
          (ann) => ann.announcement_id === selectedAnnouncement
        )?.book_closure_to
      )}`,
    ],
  ];
  const columns =
    searchedAllotments.length &&
    _.keys(
      _.pick(searchedAllotments[searchedAllotments.length - 1], [
        "folio_number",
        "shareholder_name",
        "total_holding",
        "bonus_shares",
        "net_holding",
        "b_fraction",
        // "certificate_from",
        // "certificate_to",
        "certificate_no",
        "distinctive_from",
        "distinctive_to",
        "no_of_letters",
      ])
    ).map((e) => e.toUpperCase().replaceAll("_", " "));
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
      <h6 className="text-nowrap mt-3 ml-3">Bonus Allotment Report</h6>
      <Breadcrumb title="Bonus Allotment Report" parent="Reporting" />
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
                        `Bonus Allotment Report ${getvalidDateDMY(new Date())}`,
                        "Bonus Allotment Report",
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
                            "bonus_shares",
                            "net_holding",
                            "b_fraction",
                            // "certificate_from",
                            // "certificate_to",
                            'certificate_no',
                            "distinctive_from",
                            "distinctive_to",
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
                        options={companies_dropdown}
                        isLoading={companies_data_loading === true}
                        onChange={(selected) => {
                          !!selected?.value &&
                            setSelectedCompany(selected.value);
                          !selected && setSelectedCompany("");
                          // if(selected && selected?.value !== "") {
                          //   getShareCertificates(selected?.value);
                          // }
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Company And Announcement to Check Bonus
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
                          Select Company And Announcement to Check Bonus Allotment
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
                    disabled={!selectedAnnouncement || !selectedCompany || loadingDAta || historyLoading}
                    
                  >
                    Generate
                  </button>
                </div>
              </div>
              {historyLoading && <Spinner />}
              {historyLoading === false && !!searchedAllotments.length && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>Folio Number</th>
                        <th>Shareholder Name</th>
                        <th className="text-right">Shareholding</th>
                        <th className="text-right">Bonus Shares</th>
                        <th className="text-right">Net Holding</th>
                        {/* <th>Certificate From</th>
                        <th>Certificate To</th> */}
                        <th>Certificate No</th>
                        <th>Distinctive From</th>
                        <th>Distinctive To</th>
                        <th>No of Letters</th>
                        <th className="text-right">Bonus Fraction</th>
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
