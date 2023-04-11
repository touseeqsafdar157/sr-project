import React, { Fragment, useState, useEffect, useRef } from "react";
import Breadcrumb from "components/common/breadcrumb";
import {
  getInvestorRequest,
  getInvestorRequestByCompanyCodeAndTypeService,
  getInvestorRequestByCompanyCodeService,
  getInvestorRequestByTypeService,
  getInvestors,
} from "store/services/investor.service";
import { darkStyle, errorStyles } from "components/defaultStyles";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";
import {
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  ModalFooter,
} from "reactstrap";
import Spinner from "components/common/spinner";
import {
  folio_setter,
  symbol_setter,
  announcement_id_setter,
  entitlement_id_setter,
  txn_type_setter,
} from "store/services/dropdown.service";
import transactionRequestPDFTemplate from "./transactionRequestPDF/transactionRequestPDFTemplate";
import DOMPurify from "dompurify";
import jsPDF from "jspdf";
import {
  CONSOLIDATE_SHARES,
  DUPLICATE_SHARES,
  ELECTRONIC_TO_PHYSICAL,
  PHYSICAL_TO_ELECTRONIC,
  SPLIT_SHARES,
  ISSUE_OF_SHARES,
  TRANSFER_OF_SHARES,
  RIGHT_SUBSCRIBTION,
  TRANSFER_RIGHT_SHARES,
  VERIFICATION_TRANSFER_DEED,
  TRANSMISSION_OF_SHARES,
  TRANSMISSION_OF_SHARES_TEMPLATE,
} from "constant";
import {
  getFoundObject,
  getvalidDateDMonthY,
  getvalidDateDMY,
  IsJsonString,
  listCrud,
} from "utilities/utilityFunctions";
import { getCompanies } from "store/services/company.service";
import {
  getCorporateAnnouncement,
  getCorporateAnnouncementByCompanyCode,
  getCorporateEntitlementByCompanyCodeService,
} from "store/services/corporate.service";
import { getCorporateEntitlement } from "store/services/corporate.service";
import {
  getShareholders,
  getShareHoldersByCompany,
} from "store/services/shareholder.service";
import Select from "react-select";
import ViewSplitShares from "components/shareRegistrar/share/splitShareCertificate/viewSplitShares";
import ViewConsolidateShares from "components/shareRegistrar/share/consolidateShares/viewConsolidateShares";
import ViewDuplicateShareCertificate from "components/shareRegistrar/share/duplicateSharesCertificate/viewDuplicateShareCertificate";
import ViewTransferOfShares from "components/shareRegistrar/share/transferOfShares/viewTransferOfShares";
import ViewPhysicalToElectronic from "components/shareRegistrar/share/physicalToElectronic/viewPhysicalToElectronic";
import ViewElectronicToPhysical from "components/shareRegistrar/share/electronicToPhysical/viewElectronicToPhyiscalShareCertificate";
import ViewRightSuscription from "components/shareRegistrar/share/rightSubscription/viewRightSubscription";
import ViewTransferOfRightShares from "components/shareRegistrar/share/transferOfRightShares/viewTransferOfRightShares";
import ViewTransferDeedVerification from "components/shareRegistrar/share/transferDeedVerification/viewTransferDeedVerification";
import TransmissionOfShares from "components/shareRegistrar/share/transmissionOfShares/transmissionOfShares";
import ViewTransmissionOfShares from "components/shareRegistrar/share/transmissionOfShares/viewTransmissionOfShares";
import {
  getTransactionRequestByType,
  getTransactionsByCompanyCodeAndTypeService,
  getTransactionTypes,
} from "store/services/transaction.service";
import { getTransactionsListing } from "store/services/transaction.service";
import { numberWithCommas } from "utilities/utilityFunctions";
import { toast } from "react-toastify";
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "./page-template";
import ReportHeader from "./report-header";
import {
  getShareCertificates,
  getShareCertificatesByCompany,
} from "store/services/shareCertificate.service";
import moment from "moment";
import ViewShareCertificateIssuance from "../share-certificate/viewShareCertificateIssuance";

export default function InvestorRequestReport() {
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  // Array of Requests
  const request_types = [
    CONSOLIDATE_SHARES,
    DUPLICATE_SHARES,
    SPLIT_SHARES,
    ELECTRONIC_TO_PHYSICAL,
    PHYSICAL_TO_ELECTRONIC,
    TRANSFER_OF_SHARES,
    RIGHT_SUBSCRIBTION,
    TRANSFER_RIGHT_SHARES,
  ];
  const letterRef = useRef(null);

  const baseEmail = sessionStorage.getItem("email") || "";
  const [searchedInvestorsRequests, setSearchedInvestorsRequests] = useState(
    []
  );
  const [showInvestorRequestForm, setShowInvestorRequestForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [search, setSearch] = useState("");
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [viewFlagPDF, setViewFlagPDF] = useState(false);
  const [generatePdfLoading, setGeneratePdfLoading] = useState(false);
  const [announcement_id_options, setAnnoucement_id_options] = useState([]);
  const [entitlement_id_options, setEntitlement_id_options] = useState([]);
  const [investor_request, setInvestor_request] = useState("");
  const [symbol_options, setSymbol_options] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  const [txn_type_options, setTxn_type_options] = useState([]);
  // selected investor request data
  const [selectedFromShareholder, setSelectedFromShareholder] = useState(null);
  const [selectedToShareholder, setSelectedToShareholder] = useState(null);
  const [selectedFromInvestor, setSelectedFromInvestor] = useState(null);
  const [selectedToInvestor, setSelectedToInvestor] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedInvestorRequest, setSelectedInvestorRequest] = useState(null);
  const [selectedInvestors, setSelectedInvestors] = useState([]);
  const [selectedShareholders, setSelectedShareholders] = useState([]);
  // Investor Request Types
  const [investorRequestForm, setInvestorRequestForm] = useState(false);
  const [editInvestorRequestForm, setEditInvestorRequestForm] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [shareholders, setShareholders_data] = useState([]);
  const [shareholders_dropdown, setShareholders_dropdown] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [announcement_dropdown, setAnnouncement_dropdown] = useState([]);
  const [entitlements, setEntitlements] = useState([]);
  const [entitlments_dropdown, setEntitment_dropdown] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [investorsLoading, setInvestorsLoading] = useState(false);
  const [investors_requests, setInvestor_request_data] = useState([]);
  const [investor_request_types, setInvestor_request_types] = useState([]);
  const [investor_request_loading, setInvestor_request_loading] =
    useState(false);
  const [transaction_requests, setTransaction_request] = useState([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState();
  const [transactionDate, setTransactionDate] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [share_certificates, setShare_certificates] = useState([]);
  const [share_certificates_loading, setShare_certificates_loading] =
    useState(false);

  const [compDetails, setCompDetails] = useState();
  const pdfExportComponent = React.useRef(null);


  const transactionTypeDropdown = [
    { label: "Split Shares", value: "SPL" },
    { label: "Consolidate Shares", value: "CON" },
    { label: "Duplicate Shares", value: "DUP" },
    { label: "Transfer of Shares", value: "TOS" },
    { label: "Physical to Electronic", value: "CEL" },
    { label: "Electronic to Physical", value: "CPH" },
    { label: "Right Subscription", value: "RSUB" },
    { label: "Transfer Right Shares", value: "TOR" },
    { label: "Verification Transfer Deed", value: "VTD" },
    { label: "Transmission of Shares", value: "TRS" },
  ];
  let history = useHistory();
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);
  useEffect(() => {
    const getAllInvestors = async () => {
      setInvestorsLoading(true);
      try {
        const response = await getInvestors(baseEmail);
        if (response.status === 200) {
          setInvestors(response.data.data);
          setInvestorsLoading(false);
        }
      } catch (err) {
        if (err.response !== undefined) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Request Failed!")
        }
      }
    };
    getAllInvestors()
  }, [])

  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try {
        const response = await getCompanies(baseEmail);
        if (response.status === 200) {
          const parents = response.data.data;
          let companies_dropdowns = response.data.data.map((item) => {
            let label = `${item.code} - ${item.company_name}`;
            return { label: label, value: item.code };
          });
          companies_dropdowns.unshift({ label: "ALL", value: "all" });
          setCompanies_dropdown(companies_dropdowns);
          setCompanies(parents);
          setCompanies_data_loading(false);
        }
      } catch (error) {
        setCompanies_data_loading(false);
      }
    };
    // const getAllCorporateAnnouncement = async () => {
    //   try {
    //     const response = await getCorporateAnnouncement(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.data;
    //       const announcement_dropdowns = announcements.data.data.map((item) => {
    //         let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
    //         return { label: label, value: item.announcement_id };
    //       });
    //       setAnnouncement_dropdown(announcement_dropdowns);
    //       setAnnouncements(parents);
    //     }
    //   } catch (error) {}
    // };
    // const getAllCorporateEntitlements = async () => {
    //   try {
    //     const response = await getCorporateEntitlement(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.data;
    //       const entitlments_dropdowns = entitlements.data.data.map((item) => {
    //         return { label: item.entitlement_id, value: item.entitlement_id };
    //       });
    //       setEntitment_dropdown(entitlments_dropdowns);
    //       setEntitlements(parents);
    //     }
    //   } catch (error) {}
    // };
    // const getAllShareHolders = async () => {
    //   try {
    //     const response = await getShareholders(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.data;
    //       const shareholders_dropdowns = response.data.data.map((item) => {
    //         let label = `${item.folio_number} (${item.shareholder_name}) `;
    //         return { label: label, value: item.folio_number };
    //       });
    //       setShareholders_dropdown(shareholders_dropdowns);
    //       setShareholders_data(parents);
    //     }
    //   } catch (error) {}
    // };
    // const getAllInvestors = async () => {
    //   try {
    //     const response = await getInvestors(baseEmail);
    //     if (response.status === 200) {
    //       setInvestors(response.data.data);
    //     }
    //   } catch (error) {}
    // };
    // const getAllInvestorsRequests = async () => {
    //   setInvestor_request_loading(true);
    //   try {
    //     const response = await getInvestorRequest(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.data;
    //       setInvestor_request_data(parents);
    //       setInvestor_request_loading(false);
    //     }
    //   } catch (error) {
    //     setInvestor_request_loading(false);
    //   }
    // };
    const txn_type_setter = async () => {
      try {
        setInvestor_request_loading(true);
        const email = sessionStorage.getItem("email");
        const response = await getTransactionTypes(email);
        const options = response.data.data.map((item) => {
          return { label: item.transactionName, value: item.transactionCode };
        });
        setInvestor_request_types(options);
        setInvestor_request_loading(false);
      } catch (error) {
        setInvestor_request_loading(false);
      }
    };
    // const getAllTransactions = async () => {
    //   setInvestor_request_loading(true);
    //   try {
    //     const response = await getTransactionsListing(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.data;
    //       setTransaction_request(parents);
    //       setInvestor_request_loading(false);
    //     }
    //   } catch (error) {
    //     setInvestor_request_loading(false);
    //   }
    // };
    // getAllTransactions();
    txn_type_setter();
    // getAllShareHolders();
    // getAllCorporateAnnouncement();
    // getAllCorporateEntitlements();
    getAllCompanies();
    // getAllInvestors();
    // getAllInvestorsRequests();
  }, []);

  const getAllTransactions = async () => {
    setInvestor_request_loading(true);
    try {
      const response = await getTransactionsListing(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
        setTransaction_request(parents);
        setInvestor_request_loading(false);
      }
    } catch (error) {
      setInvestor_request_loading(false);
    }
  };

  const getAllInvestorsRequests = async () => {
    setInvestor_request_loading(true);
    try {
      const response = await getInvestorRequest(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
        setInvestor_request_data(parents);
        setInvestor_request_loading(false);
      }
    } catch (error) {
      setInvestor_request_loading(false);
    }
  };



  const getAllShareHolders = async () => {
    try {
      const response = await getShareholders(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
        const shareholders_dropdowns = response.data.data.map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.folio_number };
        });
        setShareholders_dropdown(shareholders_dropdowns);
        setShareholders_data(parents);
      }
    } catch (error) { }
  };

  const getAllCorporateAnnouncement = async () => {
    try {
      const response = await getCorporateAnnouncement(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
        const announcement_dropdowns = announcements.data.data.map((item) => {
          let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
          return { label: label, value: item.announcement_id };
        });
        setAnnouncement_dropdown(announcement_dropdowns);
        setAnnouncements(parents);
      }
    } catch (error) { }
  };

  const getAllCorporateEntitlements = async () => {
    try {
      const response = await getCorporateEntitlement(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
        const entitlments_dropdowns = entitlements.data.data.map((item) => {
          return { label: item.entitlement_id, value: item.entitlement_id };
        });
        setEntitment_dropdown(entitlments_dropdowns);
        setEntitlements(parents);
      }
    } catch (error) { }
  };

  const getEntitlementsForSelectedCompany = async () => {
    // setEntitlement_data_loading(true);
    try {
      const response = await getCorporateEntitlementByCompanyCodeService(
        baseEmail,
        selectedCompany
      );
      if (response.status === 200) {
        const parents = response.data.data;
        const entitlments_dropdowns = entitlements.data.data.map((item) => {
          return { label: item.entitlement_id, value: item.entitlement_id };
        });
        setEntitment_dropdown(entitlments_dropdowns);
        setEntitlements(parents);
      }
    } catch (error) {
      // setEntitlement_data_loading(false);
    }
  };

  const getShareholdersByCompanyCode = async () => {
    try {
      const response = await getShareHoldersByCompany(
        baseEmail,
        selectedCompany
      );
      if (response.status === 200) {
        const parents = response.data.data;
        const shareholders_dropdowns = response.data.data.map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.folio_number };
        });
        setShareholders_dropdown(shareholders_dropdowns);
        setShareholders_data(parents);
      }
    } catch (error) { }
  };

  const getInvestorRequestsByCompanyCodeAndType = async () => {
    setInvestor_request_loading(true);
    try {
      //investorrequest
      const response = await getInvestorRequestByCompanyCodeAndTypeService(
        baseEmail,
        selectedCompany,
        selectedTransactionType,
        '',
        // fromDate,
        "",
        // toDate,
        "",
      );
      if (response.status === 200) {
        const parents = response.data.data;
        setInvestor_request_data(parents);
        setSearchedInvestorsRequests(parents);
        setInvestor_request_loading(false);
      }
    } catch (error) {
      setInvestor_request_loading(false);
    }
  };

  const getInvestorRequestsByType = async () => {
    setInvestor_request_loading(true);
    try {
      const response = await getInvestorRequestByTypeService(
        baseEmail,
        selectedTransactionType,
        true,
        // fromDate,
        "",
        // toDate,
        "",
      );
      if (response.status === 200) {
        const parents = response.data.data;
        setInvestor_request_data(parents);
        setSearchedInvestorsRequests(parents);
        setInvestor_request_loading(false);
      }
    } catch (error) {
      setInvestor_request_loading(false);
    }
  };

  const getTransactionsByCompanyCodeAndType = async () => {
    setInvestor_request_loading(true);
    //Transaction
    try {
      const response = await getTransactionsByCompanyCodeAndTypeService(
        baseEmail,
        selectedCompany,
        selectedTransactionType,
        '',
        // fromDate,
        "",
        // toDate,
        ""
      );
      if (response.status === 200) {
        const parents = response.data.data;
        if (parents.length == 0) {
          toast.error("No transaction record found!");
          setTransaction_request(parents);
          setInvestor_request_loading(false);
        } else {
          if (selectedTransactionType === 'ISH' || selectedTransactionType === 'BSA' || selectedTransactionType === 'RSA') {
            setInvestor_request_data(parents);
            setSearchedInvestorsRequests(parents);
            setInvestor_request_loading(false);
            setTransaction_request(parents);
            setInvestor_request_loading(false);
            setInvestor_request_loading(false);
          } else {
            setTransaction_request(parents);
            setInvestor_request_loading(false);
          }
        }

      }
    } catch (error) {
      toast.error("Error fetching transactions!")
      setInvestor_request_loading(false);
    }
  };

  const getTransactionsByType = async () => {
    setInvestor_request_loading(true);
    try {
      const response = await getTransactionRequestByType(
        baseEmail,
        selectedTransactionType,
        true,
        // fromDate,
        "",
        // toDate,
        ""
      );
      if (response.status === 200) {
        const parents = response.data.data;
        if (parents.length == 0) {
          toast.error("No transaction record found!")
          setTransaction_request(parents);
          setInvestor_request_loading(false);
        } else {
          setTransaction_request(parents);
          setInvestor_request_loading(false);
        }

      }
    } catch (error) {
      toast.error("Error fetching transactions!")

      setInvestor_request_loading(false);
    }
  };

  const getCorporateAnnouncementsForSelectedCompany = async () => {
    // setAnnouncement_data_loading(true);
    try {
      const response = await getCorporateAnnouncementByCompanyCode(
        baseEmail,
        selectedCompany
      );
      if (response.status === 200) {
        // setAnnouncements(response.data.data);
        const announcement_dropdowns = response.data.data.map((item) => {
          let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
          return { label: label, value: item.announcement_id };
        });
        setAnnouncement_dropdown(announcement_dropdowns);
        // setAnnouncement_data_loading(false);
      }
    } catch (error) {
      // setAnnouncement_data_loading(false);
    }
  };

  const getCertificatesForSelectedCompany = async () => {
    setShare_certificates_loading(true);
    try {
      const response = await getShareCertificatesByCompany(
        baseEmail,
        selectedCompany
      );
      if (response.status === 200) {
        const parents = response.data.data;
        setShare_certificates(parents);
        setShare_certificates_loading(false);
      }
    } catch (error) {
      setShare_certificates_loading(false);
    }
  };

  const getAllCertificates = async () => {
    setShare_certificates_loading(true);
    try {
      const response = await getShareCertificates(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
        setShare_certificates(parents);
        setShare_certificates_loading(false);
      }
    } catch (error) {
      setShare_certificates_loading(false);
    }
  };

  const getDataByCompanyCode = async () => {
    if (selectedCompany == "all") {
      // getAllTransactions();
      // getAllInvestorsRequests();
      //transactions will be searched based on txn type
      setCompDetails({
        company_name: "All",
      });
      // await getAllInvestors();
      // getAllCertificates();
      await getAllCorporateAnnouncement();
      await getAllCorporateEntitlements();
      await getAllShareHolders();
    } else {
      let sel = companies.find((comp) => comp.code == selectedCompany);
      // await getAllInvestors();
      await setCompDetails(sel);
      // getCertificatesForSelectedCompany();
      // getAllCorporateEntitlements();
      await getShareholdersByCompanyCode();
      // getInvestorRequestsByCompanyCode();
    }
  };

  const handleGenerate = async () => {
    setSearchedInvestorsRequests([]);
    setTransaction_request([]);
    if (!selectedCompany || selectedCompany == "") {
      return toast.error("Company is required!");
    }
    if (!selectedTransactionType || selectedTransactionType == "") {
      return toast.error("Transaction Type is required!");
    }

    // if (fromDate && !toDate) {
    //   return toast.error("To Date is required");
    // }
    // if (toDate && !fromDate) {
    //   return toast.error("From Date is required");
    // }
    if (selectedCompany == "all") {
      getInvestorRequestsByType();
      getTransactionsByType();
    } else {
      if (selectedTransactionType === 'ISH' || selectedTransactionType === 'BSA' || selectedTransactionType === 'RSA') {
        getTransactionsByCompanyCodeAndType();
      } else {
        getTransactionsByCompanyCodeAndType();
        getInvestorRequestsByCompanyCodeAndType();
        getCorporateAnnouncementsForSelectedCompany();
        getEntitlementsForSelectedCompany();
      }

    }
  };

  useEffect(() => {
    if (selectedCompany !== "") {
      getDataByCompanyCode();
    } else if (!selectedCompany || selectedCompany === "") {
      setSearchedInvestorsRequests([]);
      setTransaction_request([]);
    }
  }, [selectedCompany]);

  const getTime = () => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  // useEffect(async () => {
  //   try {
  //     setAnnoucement_id_options(await announcement_id_setter());
  //     setEntitlement_id_options(await entitlement_id_setter());
  //     setSymbol_options(await symbol_setter());
  //     setTxn_type_options(await txn_type_setter());
  //   } catch (err) {
  //     !!err?.response?.data?.message
  //       ? toast.error(err?.response?.data?.message)
  //       : toast.error("Options Not Found");
  //   }
  // }, []);
  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */

  const [pageNumber, setPageNumber] = useState(0);
  const InvestorsRequestsPerPage = 10;
  const pagesVisited = pageNumber * InvestorsRequestsPerPage;
  const totalnumberofPages = 100;
  const displayInvestorsRequestsPerPage =
    searchedInvestorsRequests.length &&
    searchedInvestorsRequests
      .sort((a, b) => {
        if (
          new Date(b.created_at.replaceAll("/", "-")).getTime() <
          new Date(a.created_at.replaceAll("/", "-")).getTime()
        )
          return -1;
        if (
          new Date(b.created_at.replaceAll("/", "-")).getTime() >
          new Date(a.created_at.replaceAll("/", "-")).getTime()
        )
          return 1;
        return 0;
      })
      .slice(pagesVisited, pagesVisited + InvestorsRequestsPerPage)
      .map((item, i) => (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{item.folio_number}</td>
          <td>
            {
              companies.find((comp) => comp.code === item.company_code)
                ?.company_name
            }
          </td>
          <td>
            {
              selectedTransactionType === 'ISH' ? 'Issue of Shares' : investor_request_types.find(
                (inv) => inv.value === item.request_type
              )?.label
            }
          </td>
          <td>{getvalidDateDMonthY(item?.request_date || item?.created_at)}</td>
          <td className="text-right">{numberWithCommas(item.quantity)}</td>
          <td>{(selectedTransactionType === 'ISH' || selectedTransactionType === 'BSA' || selectedTransactionType === 'RSA' || selectedTransactionType === 'DUP') ? item.processing_status : item.status}</td>
          {(crudFeatures[1] || crudFeatures[2]) && (
            <td>
              {crudFeatures[1] && (
                <>
                  <>
                    <i
                      className="fa fa-eye"
                      style={{
                        width: 35,
                        fontSize: 16,
                        padding: 11,
                        color: "rgb(68, 102, 242)",
                        cursor: "pointer",
                      }}
                      id="investorRequestView"
                      onClick={() => {
                        const obj = JSON.parse(JSON.stringify(item));
                        obj.folio_number = getFoundObject(
                          shareholders_dropdown,
                          obj.folio_number
                        );

                        obj.to_folio_number = getFoundObject(
                          shareholders_dropdown,
                          obj.to_folio_number
                        );
                        obj.announcement_id = getFoundObject(
                          announcement_dropdown,
                          obj.announcement_id
                        );
                        obj.entitlement_id = getFoundObject(
                          entitlments_dropdown,
                          obj.entitlement_id
                        );
                        obj.company_code = getFoundObject(
                          companies_dropdown,
                          obj.company_code
                        );
                        // for modal
                        if (item.txn_type !== 'BSA' && item.txn_type !== 'RSA') {
                          setViewFlag(true);
                        }
                        sessionStorage.setItem(
                          "selectedInvestorRequest",
                          JSON.stringify(obj)
                        );

                        renderModal(item.request_type || item.txn_type);


                      }}
                    ></i>
                    <UncontrolledTooltip
                      placement="top"
                      target="investorRequestView"
                    >
                      {"View Investor's Request Detail"}
                    </UncontrolledTooltip>
                  </>
                  <i
                    className="fa fa-file-pdf-o"
                    style={{
                      width: 35,
                      fontSize: 16,
                      padding: 11,
                      color: "rgb(242, 68, 164)",
                      cursor: "pointer",
                    }}
                    id="generatePDF"
                    onClick={() => {
                      const obj = JSON.parse(JSON.stringify(item));
                      /* FOR TRS */
                      const input_certificates = IsJsonString(
                        obj?.input_certificates
                      )
                        ? JSON.parse(obj?.input_certificates)
                        : [];
                      const transmitted_shareholders = [];
                      const transmitted_investors = [];
                      if (
                        obj?.request_type === TRANSMISSION_OF_SHARES_TEMPLATE
                      ) {
                        input_certificates.forEach((item) => {
                          const shareholder = shareholders.find(
                            (holder) =>
                              holder.folio_number === item?.folio_number
                          );
                          transmitted_shareholders.push(shareholder);
                          transmitted_investors.push(
                            investors.find(
                              (investor) =>
                                investor.investor_id ===
                                shareholder?.shareholder_id
                            )
                          );
                        });
                        setSelectedInvestors(transmitted_investors);
                        setSelectedShareholders(transmitted_shareholders);
                      }
                      /* FOR TRS */
                      const selected_from_shareholder = shareholders.find(
                        (item) => item.folio_number === obj?.folio_number
                      );
                      const selected_to_shareholder = shareholders.find(
                        (item) => item.folio_number === obj?.to_folio_number
                      );
                      const selected_from_investor = []
                      // const selected_from_investor = investors.map((item) => {
                      //   if (item.investor_id === selected_from_shareholder?.shareholder_id) {
                      //     //return item;
                      //     break
                      //   }
                      // });
                      for (let i = 0; i < investors.length; i++) {
                        if (investors[i].investor_id === selected_from_shareholder?.shareholder_id) {
                          selected_from_investor.push(investors[i]);
                          break;
                        } else if (investors[i].cnic === selected_from_shareholder?.shareholder_id) {
                          selected_from_investor.push(investors[i]);
                          break;
                        } else if (investors[i].ntn === selected_from_shareholder?.shareholder_id) {
                          selected_from_investor.push(investors[i]);
                          break;
                        } else if (investors[i].folio_number === selected_from_shareholder?.shareholder_id) {
                          selected_from_investor.push(investors[i]);
                          break;
                        }
                      }
                      const selected_to_investor = investors.find(
                        (item) =>
                          item.investor_id ===
                          selected_to_shareholder?.shareholder_id
                      );
                      console.log("🚀 ~ file:", selected_to_investor)
                      const selected_transaction = transaction_requests.find(
                        (item) => item.request_id === obj?.request_id
                      );
                      setSelectedFromInvestor(selected_from_investor);
                      setSelectedToInvestor(selected_to_investor);
                      setSelectedFromShareholder(selected_from_shareholder);
                      setSelectedToShareholder(selected_to_shareholder);
                      setSelectedTransaction(selected_transaction);
                      setSelectedInvestorRequest(obj);

                      obj.folio_number = getFoundObject(
                        shareholders_dropdown,
                        obj.folio_number
                      );

                      obj.to_folio_number = getFoundObject(
                        shareholders_dropdown,
                        obj.to_folio_number
                      );
                      obj.announcement_id = getFoundObject(
                        announcement_dropdown,
                        obj.announcement_id
                      );
                      obj.entitlement_id = getFoundObject(
                        entitlments_dropdown,
                        obj.entitlement_id
                      );
                      obj.company_code = getFoundObject(
                        companies_dropdown,
                        obj.company_code
                      );
                      // for modal
                      setViewFlagPDF(true);
                      // renderModal(item.request_type);

                      sessionStorage.setItem(
                        "selectedInvestorRequest",
                        JSON.stringify(obj)
                      );
                    }}
                  ></i>
                  <UncontrolledTooltip placement="top" target="generatePDF">
                    {"Generate PDF file for this record"}
                  </UncontrolledTooltip>
                </>
              )}
            </td>
          )}
        </tr>
      ));
  const pageCount =
    searchedInvestorsRequests.length &&
    Math.ceil(searchedInvestorsRequests.length / InvestorsRequestsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  // const handleHistorySearch = () => {
  //   const getShareholders = () => {
  //     const filtered_shareholders = investors_requests.filter(
  //       (en) => en.company_code === selectedCompany
  //     );
  //     setSearchedInvestorsRequests(filtered_shareholders);
  //   };
  //   if (searchedInvestorsRequests && selectedCompany) {
  //     getShareholders();
  //   }
  // };
  const isDisplayed = (request_type) => request_types.includes(request_type);
  // const showModal = (investor_request) => {

  //   return (
  //     <Modal
  //       isOpen={isDisplayed(investor_request)}
  //       show={isDisplayed(investor_request).toString()}
  //       size="xl"
  //     >
  //       <ModalHeader
  //         toggle={() => {
  //           isDisplayed(false);
  //         }}
  //       >
  //         {investor_request}
  //       </ModalHeader>
  //       <ModalBody>
  //         {investor_request === SPLIT_SHARES ? (
  //           <SplitShares />
  //         ) : investor_request === CONSOLIDATE_SHARES ? (
  //           <ConsolidateShares />
  //         ) : investor_request === DUPLICATE_SHARES ? (
  //           <DuplicateShareCertificate />
  //         ) : investor_request === TRANSFER_OF_SHARES ? (
  //           <TransferOfShares />
  //         ) : investor_request === PHYSICAL_TO_ELECTRONIC ? (
  //           <PhysicalToElectronic />
  //         ) : (
  //           <ElectronicToPhysical />
  //         )}
  //       </ModalBody>
  //     </Modal>
  //   );
  // };
  // Print pDF
  const printTransactionRequest = () => {
    setGeneratePdfLoading(true);
    var doc = new jsPDF({
      orientation: "landscape",
      format: "a4",
      unit: "px",
    });
    var content = document.getElementById(`transaction-request-1`);
    doc.html(content, {
      callback: function (doc) {
        // doc.addImage(company.logo, "PNG", 10, 10, 60, 60);
        doc.save(`transaction-request.pdf`);
        setGeneratePdfLoading(false);
      },
      html2canvas: {
        scale: 0.5,
        useCORS: true,
      },
      margin: [0, 0, 0, 0],
      x: 0,
      y: 0,
    });
  };

  const renderModal = (value) => {
    switch (value) {
      case SPLIT_SHARES:
        setInvestor_request(SPLIT_SHARES);
        setShowInvestorRequestForm(true);
        break;
      case CONSOLIDATE_SHARES:
        setInvestor_request(CONSOLIDATE_SHARES);
        setShowInvestorRequestForm(true);
        break;
      case DUPLICATE_SHARES:
        setInvestor_request(DUPLICATE_SHARES);
        setShowInvestorRequestForm(true);
        break;
      case TRANSFER_OF_SHARES:
        setInvestor_request(TRANSFER_OF_SHARES);
        setShowInvestorRequestForm(true);
        break;
      case PHYSICAL_TO_ELECTRONIC:
        setInvestor_request(PHYSICAL_TO_ELECTRONIC);
        setShowInvestorRequestForm(true);
        break;
      case ELECTRONIC_TO_PHYSICAL:
        setInvestor_request(ELECTRONIC_TO_PHYSICAL);
        setShowInvestorRequestForm(true);
        break;
      case RIGHT_SUBSCRIBTION:
        setInvestor_request(RIGHT_SUBSCRIBTION);
        setShowInvestorRequestForm(true);
        break;
      case TRANSFER_RIGHT_SHARES:
        setInvestor_request(TRANSFER_RIGHT_SHARES);
        setShowInvestorRequestForm(true);
        break;
      case VERIFICATION_TRANSFER_DEED:
        setInvestor_request(VERIFICATION_TRANSFER_DEED);
        setShowInvestorRequestForm(true);
        break;
      case TRANSMISSION_OF_SHARES:
        setInvestor_request(TRANSMISSION_OF_SHARES);
        setShowInvestorRequestForm(true);
        break;
      case ISSUE_OF_SHARES:
        setInvestor_request(ISSUE_OF_SHARES);
        setViewFlag(true);
        break;
      case "SPL":
        setInvestor_request(SPLIT_SHARES);
        setViewFlag(true);
        break;
      case "CON":
        setInvestor_request(CONSOLIDATE_SHARES);
        setViewFlag(true);
        break;
      case "DUP":
        setInvestor_request(DUPLICATE_SHARES);
        setViewFlag(true);
        break;
      case "TOS":
        setInvestor_request(TRANSFER_OF_SHARES);
        setViewFlag(true);
        break;
      case "CEL":
        setInvestor_request(PHYSICAL_TO_ELECTRONIC);
        setViewFlag(true);
        break;
      case "CPH":
        setInvestor_request(ELECTRONIC_TO_PHYSICAL);
        setViewFlag(true);
        break;
      case "RSUB":
        setInvestor_request(RIGHT_SUBSCRIBTION);
        setViewFlag(true);
        break;
      case "TOR":
        setInvestor_request(TRANSFER_RIGHT_SHARES);
        setViewFlag(true);
        break;
      case "VTD":
        setInvestor_request(VERIFICATION_TRANSFER_DEED);
        setViewFlag(true);
        break;
      case "TRS":
        setInvestor_request(TRANSMISSION_OF_SHARES);
        setViewFlag(true);
        break;
      case "ISH":
        setInvestor_request(ISSUE_OF_SHARES);
        setViewFlag(true);
        break;
      default:
        break;
    }
  };
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Investor Request Listing</h6>
        <Breadcrumb title="Investor Request Listing" parent="Investors" />
      </div>
      {/* Investor Request Form*/}

      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          {`View ${investor_request}`}
        </ModalHeader>
        <ModalBody>
          {investor_request === SPLIT_SHARES ? (
            <ViewSplitShares />
          ) : investor_request === CONSOLIDATE_SHARES ? (
            <ViewConsolidateShares />
          ) : investor_request === DUPLICATE_SHARES ? (
            <ViewDuplicateShareCertificate />
          ) : investor_request === TRANSFER_OF_SHARES ? (
            <ViewTransferOfShares />
          ) : investor_request === PHYSICAL_TO_ELECTRONIC ? (
            <ViewPhysicalToElectronic />
          ) : investor_request === ELECTRONIC_TO_PHYSICAL ? (
            <ViewElectronicToPhysical />
          ) : investor_request === RIGHT_SUBSCRIBTION ? (
            <ViewRightSuscription />
          ) : investor_request === TRANSFER_RIGHT_SHARES ? (
            <ViewTransferOfRightShares />
          ) : investor_request === VERIFICATION_TRANSFER_DEED ? (
            <ViewTransferDeedVerification />
          ) : investor_request === ISSUE_OF_SHARES ? (
            <ViewShareCertificateIssuance />
          ) : investor_request === TRANSMISSION_OF_SHARES ? (
            <ViewTransmissionOfShares />
          ) : (
            <></>
          )}
        </ModalBody>
      </Modal>

      {/* PDF MODAL */}
      <Modal isOpen={viewFlagPDF} show={viewFlagPDF.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlagPDF(false);
          }}
        >
          PDF
        </ModalHeader>
        {viewFlagPDF && (
          <ModalBody>
            <div className="landscape-letter">
              <div
                className="p-letter"
                id={"transaction-request-1"}
                style={{ width: "auto" }}
                ref={letterRef}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    transactionRequestPDFTemplate(
                      selectedFromShareholder,
                      selectedToShareholder,
                      selectedFromInvestor,
                      selectedToInvestor,
                      selectedTransaction,
                      selectedInvestorRequest,
                      selectedInvestors,
                      selectedShareholders
                    )
                  ),
                }}
              ></div>
            </div>
          </ModalBody>
        )}

        <ModalFooter>
          <div className="row">
            <div className="col-md-12">
              <button
                type="button"
                className="btn btn-info mr-2"
                onClick={(e) => printTransactionRequest()}
                disabled={Boolean(generatePdfLoading)}
              >
                {generatePdfLoading ? (
                  <>
                    <span className="fa fa-spinner fa-spin mr-1"></span>
                    <span>{"Loading..."}</span>
                  </>
                ) : (
                  <span>{"Save As Pdf"}</span>
                )}
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  <h5></h5>
                  {/* {selectedTransactionType === "TOS" && (
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        if (pdfExportComponent.current) {
                          pdfExportComponent.current.save();
                        }
                      }}
                    >
                      Download PDF
                    </button>
                  )} */}
                </div>
                <div className="row my-3">
                  <div className="col-md-3 col-sm-3">
                    <label htmlFor="company">Company</label>
                    <Select
                      options={companies_dropdown}
                      isLoading={companies_data_loading}
                      style={!selectedCompany && errorStyles}
                      isClearable={true}
                      onChange={(selected) => {
                        setSearchedInvestorsRequests([]);
                        selected && setSelectedCompany(selected.value);
                        !selected && setSelectedCompany("");
                      }}
                      styles={darkStyle}
                    />
                    {!selectedCompany && (
                      <small>
                        Select Company and Transaction Type to generate Report
                      </small>
                    )}
                  </div>

                  <div className="col-md-3 col-sm-3">
                    <label htmlFor="announcement">Transaction Type</label>
                    <Select
                      options={investor_request_types}
                      isLoading={investor_request_loading}
                      isClearable={true}
                      onChange={(selected) => {
                        setSearchedInvestorsRequests([]);
                        selected && setSelectedTransactionType(selected.value);
                        !selected && setSelectedTransactionType("");
                      }}
                      styles={darkStyle}
                    />
                    {!selectedTransactionType && (
                      <small>
                        Select Company And Transaction Type to generate Report
                      </small>
                    )}
                  </div>

                  {/* <div className="col-md-3 col-sm-3">
                    <div className="form-group">
                      <label htmlFor="date">From Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="from_date"
                        id="from_date"
                        defaultValue={getvalidDateDMY(new Date())}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 col-sm-3">
                    <div className="form-group">
                      <label htmlFor="date">To Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="from_date"
                        id="from_date"
                        defaultValue={getvalidDateDMY(new Date())}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div> */}
                </div>
                {selectedCompany && selectedTransactionType && (
                  <div className="row mt-2">
                    <button
                      className="btn btn-success ml-3"
                      // onClick={(e) => handleHistorySearch()}
                      onClick={(e) => handleGenerate()}
                      disabled={investorsLoading}
                    >
                      {investorsLoading ? (
                        <>
                          <span>{"Genrate"}</span>
                        </>
                      ) : (
                        <span>{"Genrate"}</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
              {(investor_request_loading) && <Spinner />}
              {companies.length === 0 &&
                // shareholders.length === 0 &&
                investors_requests.length === 0 &&
                investor_request_loading === true &&
                searchedInvestorsRequests.length === 0 && (
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6">
                      <center>
                        <h6 className="mb-0 text-nowrap">
                          <b>{"Please Wait"}</b>
                        </h6>
                        <div className="d-flex justify-content-center">
                          <div className="loader-box mx-auto">
                            <div className="loader">
                              <div className="line bg-primary"></div>
                              <div className="line bg-primary"></div>
                              <div className="line bg-primary"></div>
                              <div className="line bg-primary"></div>
                            </div>
                          </div>
                        </div>
                      </center>
                    </div>
                  </div>
                )}
              {companies.length !== 0 &&
                // shareholders.length !== 0 &&

                investors_requests.length !== 0 &&
                investor_request_loading === false &&
                searchedInvestorsRequests.length !== 0 && (
                  // selectedTransactionType !== "TOS" ? (
                  <div className="table-responsive">
                    <table className="table  ">
                      <thead>
                        <tr>
                          <th>S No.</th>
                          <th>Folio Number</th>
                          <th>Company</th>
                          <th>Request Type</th>
                          <th>Request Date</th>
                          <th className="text-right">Quantity</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{displayInvestorsRequestsPerPage}</tbody>
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
                )
                // : (
                //   companies.length !== 0 &&
                //   // shareholders.length !== 0 &&
                //   // share_certificates.length !== 0 &&
                //   transaction_requests.length !== 0 &&
                //   // investors_requests.length !== 0 &&
                //   investor_request_loading === false &&
                //   // searchedInvestorsRequests.length !== 0 &&
                //   selectedTransactionType === "TOS" && (
                //     <>
                //       <PDFExport
                //         paperSize="A4"
                //         margin="1.5cm"
                //         scale={0.6}
                //         fileName={`Transfer of Shares Report for ${compDetails?.company_name}`}
                //         pageTemplate={PageTemplate}
                //         ref={pdfExportComponent}
                //       >
                //         {/* <ReportHeader
                //         title={`Transfer of Shares Details for ${compDetails?.company_name}`}
                //         disabledLogos={true}
                //       /> */}
                //         <h5
                //           className="text-center"
                //           style={{ fontSize: "16px", fontFamily: "Palatino" }}
                //         >
                //           Transfer of Shares Report
                //         </h5>
                //         <div className="row d-flex justify-content-between w-100 p-2 px-3">
                //           <div
                //             className="text-left"
                //             style={{ fontSize: "10px", fontFamily: "Palatino" }}
                //           >
                //             Company:{" "}
                //             <span style={{ fontWeight: "bold" }}>
                //               {compDetails?.company_name}
                //             </span>
                //           </div>
                //           <div
                //             className="text-right d-flex justify-content-end"
                //             style={{ fontSize: "10px", fontFamily: "Palatino" }}
                //           >
                //             Date From:{" "}
                //             <span style={{ fontWeight: "bold" }}>
                //               {moment(fromDate).format("DD-MM-YYYY")}
                //             </span>
                //           </div>
                //         </div>

                //         <div className="row d-flex justify-content-between w-100 p-2 px-3">
                //           <div
                //             className="text-left "
                //             style={{ fontSize: "10px", fontFamily: "Palatino" }}
                //           >
                //             Report Generated:{" "}
                //             <span style={{ fontWeight: "bold" }}>
                //               {moment().format("DD-MM-YYYY")} {getTime()}
                //               {/* {moment().tz("Asia/Karachi")} */}
                //             </span>
                //           </div>

                //           <div
                //             className="text-right d-flex justify-content-end"
                //             style={{ fontSize: "10px", fontFamily: "Palatino" }}
                //           >
                //             Date To:{" "}
                //             <span style={{ fontWeight: "bold" }}>
                //               {moment(toDate).format("DD-MM-YYYY")}
                //             </span>
                //           </div>
                //         </div>
                //         {searchedInvestorsRequests.length > 0 &&
                //           transaction_requests.length > 0 && (
                //             <>
                //               <div className="table-responsive">
                //                 <table
                //                   className="table"
                //                   style={{
                //                     fontSize: "10px",
                //                     fontFamily: "Palatino",
                //                   }}
                //                 >
                //                   <thead
                //                     style={{
                //                       backgroundColor: "#2E75B5",
                //                     }}
                //                   >
                //                     <th
                //                       style={{ color: "white" }}
                //                       className="text-nowrap"
                //                     >
                //                       Transfer Date
                //                     </th>
                //                     <th
                //                       style={{ color: "white" }}
                //                       className="text-nowrap"
                //                     >
                //                       Transfer#
                //                     </th>
                //                     <th
                //                       style={{ color: "white" }}
                //                       className="text-nowrap"
                //                     >
                //                       Transaction Id
                //                     </th>
                //                     <th
                //                       style={{ color: "white" }}
                //                       className="text-nowrap"
                //                     >
                //                       Transferor
                //                     </th>
                //                     <th
                //                       style={{ color: "white" }}
                //                       className="text-nowrap"
                //                     >
                //                       # of Shares
                //                     </th>
                //                     <th
                //                       style={{ color: "white" }}
                //                       className="text-nowrap"
                //                     >
                //                       Certificate # From
                //                     </th>
                //                     <th
                //                       style={{ color: "white" }}
                //                       className="text-nowrap text-right"
                //                     >
                //                       Certificate # To
                //                     </th>
                //                     <th
                //                       style={{ color: "white" }}
                //                       className="text-nowrap text-right"
                //                     >
                //                       Distinctive # from
                //                     </th>
                //                     <th
                //                       style={{ color: "white" }}
                //                       className="text-nowrap text-right"
                //                     >
                //                       Distinctive # to
                //                     </th>

                //                     <th
                //                       style={{ color: "white" }}
                //                       className="text-nowrap text-right"
                //                     >
                //                       Transferee
                //                     </th>
                //                   </thead>
                //                   <tbody>
                //                     {transaction_requests.map((item, index) => {
                //                       return (
                //                         <tr key={index}>
                //                           <td>
                //                             {/* {moment(item.created_at).format(
                //                               "DD-MM-YYYY"
                //                             )} */}
                //                             {moment(item.txn_execution_date).format(
                //                               "DD-MM-YYYY"
                //                             )}
                //                           </td>
                //                           <td>{item.transfer_no}</td>
                //                           <td>{item.txn_id}</td>
                //                           <td>
                //                             {item.from_folio}{" "}
                //                             {shareholders.length > 0 &&
                //                               shareholders.find(
                //                                 (shr) =>
                //                                   shr.folio_number ==
                //                                   item.from_folio
                //                               )?.shareholder_name}
                //                             {
                //                           </td>
                //                           <td>
                //                             {numberWithCommas(
                //                               parseInt(item.quantity)
                //                             )}
                //                           </td>
                //                           <td>
                //                             {
                //                               JSON.parse(
                //                                 item.input_certificates
                //                               )[0].certificate_no
                //                             }
                //                             {
                //                           </td>
                //                           <td className="text-right">
                //                             {
                //                               JSON.parse(item.input_certificates)[
                //                                 JSON.parse(
                //                                   item.input_certificates
                //                                 ).length - 1
                //                               ].certificate_no
                //                             }
                //                             {
                //                           </td>
                //                           <td className="text-right">
                //                             {
                //                               JSON.parse(
                //                                 JSON.parse(
                //                                   item.input_certificates
                //                                 )[0].distinctive_no
                //                               )[0].from
                //                             }
                //                           </td>
                //                           <td className="text-right">
                //                             {
                //                               JSON.parse(
                //                                 JSON.parse(
                //                                   item.input_certificates
                //                                 )[
                //                                   JSON.parse(
                //                                     item.input_certificates
                //                                   ).length - 1
                //                                 ].distinctive_no
                //                               )[
                //                                 JSON.parse(
                //                                   JSON.parse(
                //                                     item.input_certificates
                //                                   )[
                //                                     JSON.parse(
                //                                       item.input_certificates
                //                                     ).length - 1
                //                                   ].distinctive_no
                //                                 ).length - 1
                //                               ].to
                //                             }
                //                           </td>
                //                           <td className="text-right">
                //                             {item.folio_number}{" "}
                //                             {shareholders.length > 0 &&
                //                               shareholders.find(
                //                                 (shr) =>
                //                                   shr.folio_number ==
                //                                   item.folio_number
                //                               )?.shareholder_name}
                //                           </td>
                //                         </tr>
                //                       );
                //                     })}
                //                   </tbody>
                //                   {/* <tfoot>
                //                     <tr>
                //                       <td colSpan={2}></td>
                //                       <td colSpan={4}>Total</td>
                //                       <td className="text-right">
                //                         numberWithCommas(totalShareholding)
                //                       </td>
                //                       <td className="text-right">
                //                         totalShareholdingPercentage
                //                       </td>
                //                     </tr>
                //                   </tfoot> */}
                //                 </table>
                //                 <hr />
                //               </div>
                //             </>
                //           )}
                //       </PDFExport>

                //       {/* <center className="d-flex justify-content-center py-3">
                //         <nav className="pagination">
                //           <ReactPaginate
                //             previousLabel="Previous"
                //             nextLabel="Next"
                //             pageCount={pageCount}
                //             onPageChange={changePage}
                //             marginPagesDisplayed={1}
                //             pageRangeDisplayed={3}
                //             containerClassName={"pagination"}
                //             previousClassName={"page-item"}
                //             previousLinkClassName={"page-link"}
                //             nextClassName={"page-item"}
                //             nextLinkClassName={"page-link"}
                //             disabledClassName={"disabled"}
                //             pageLinkClassName={"page-link"}
                //             pageClassName={"page-item"}
                //             activeClassName={"page-item active"}
                //             activeLinkClassName={"page-link"}
                //           />
                //         </nav>
                //       </center> */}
                //     </>
                //   )
                // )}
              }

              {searchedInvestorsRequests.length === 0 &&
                investor_request_loading === false && (
                  <p className="text-center">
                    <b>Investors Request Data not available</b>
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
