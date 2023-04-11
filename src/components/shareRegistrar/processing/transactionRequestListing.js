import React, { Fragment, useState, useEffect, useContext } from "react";
import Breadcrumb from "../../common/breadcrumb";
import Spinner from "../../common/spinner";
import { filterData, SearchType } from "filter-data";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import {
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  ModalFooter,
} from "reactstrap";
import {
  getPaginatedInProcessTransactions,
  getTransactionRequestByStatus,
  getTransactionRequestByType,
  getTransactions,
  updateTransactionStatus,
} from "../../../store/services/transaction.service";
import { useSelector } from "react-redux";
import { listCrud } from "../../../../src/utilities/utilityFunctions";
import TransactionListing from "../transaction/transactionListing";
import Select from "react-select";
import {
  generateRegex,
  getFoundObject,
} from "../../../utilities/utilityFunctions";

import {
  BONUS_SHARE_ALLOTMENT_TEMPLATE,
  RIGHT_SHARE_ALLOTMENT_TEMPLATE,
  DIVIDEND_DISBURSEMENT_TEMPLATE,
  DIVIDEND_DISBURSEMENT,
  RIGHT_SHARE_ALLOTMENT,
  BONUS_SHARE_ALLOTMENT,
  CONSOLIDATE_SHARES,
  DUPLICATE_SHARES,
  ELECTRONIC_TO_PHYSICAL,
  PHYSICAL_TO_ELECTRONIC,
  SPLIT_SHARES,
  TRANSFER_OF_SHARES,
  RIGHT_SUBSCRIBTION,
  TRANSFER_RIGHT_SHARES,
  VERIFICATION_TRANSFER_DEED,
  TRANSMISSION_OF_SHARES,
  // EDIT
  EDIT_CONSOLIDATE_SHARES,
  EDIT_DUPLICATE_SHARES,
  EDIT_ELECTRONIC_TO_PHYSICAL,
  EDIT_PHYSICAL_TO_ELECTRONIC,
  EDIT_SPLIT_SHARES,
  EDIT_TRANSFER_OF_SHARES,
  EDIT_RIGHT_SUBSCRIBTION,
  EDIT_TRANSFER_RIGHT_SHARES,
  EDIT_VERIFICATION_TRANSFER_DEED,
  EDIT_TRANSMISSION_OF_SHARES,
  ELECTRONIC_TRANSFER_OF_SHARES,
  EDIT_ELECTRONIC_TRANSFER_OF_SHARES,
  ELECTRONIC_TRANSMISSION_OF_SHARES,
  EDIT_ELECTRONIC_TRANSMISSION_OF_SHARES,
  CONSOLIDATE_SHARES_TEMPLATE,
  DUPLICATE_SHARES_TEMPLATE,
  TRANSFER_OF_SHARES_TEMPLATE,
  ELECTRONIC_TRANSFER_OF_SHARES_TEMPLATE,
  PHYSICAL_TO_ELECTRONIC_TEMPLATE,
  ELECTRONIC_TO_PHYSICAL_TEMPLATE,
  RIGHT_SUBSCRIBTION_TEMPLATE,
  TRANSFER_RIGHT_SHARES_TEMPLATE,
  VERIFICATION_TRANSFER_DEED_TEMPLATE,
  TRANSMISSION_OF_SHARES_TEMPLATE,
  SPLIT_SHARES_TEMPLATE,
  ELECTRONIC_TRANSMISSION_OF_SHARES_TEMPLATE,
  INITIAL_PUBLIC_OFFERING_SUBSCRIPTION,
  INITIAL_PUBLIC_OFFERING_SUBSCRIPTION_TEMPLATE,
  INITIAL_PUBLIC_OFFERING_PAYMENT,
} from "constant";
import { getInvestors } from "../../../store/services/investor.service";
import { getCompanies } from "../../../store/services/company.service";
import ViewTransaction from "../transaction/viewTransaction";
import ViewTransactionRequest from "./viewTransactionRequest";
import RightShareAllotmentTxn from "components/shareRegistrar/transaction-content/rightShareAllotmentTxn";
import BonusShareAllotmentTxn from "components/shareRegistrar/transaction-content/bonusShareAllotmentTxn";
import DividendDisbursementTxn from "components/shareRegistrar/transaction-content/dividendDisbursementTxn";

import { darkStyle, errorStyles } from "../../defaultStyles";
import ReactPaginate from "react-paginate";
import ViewTxnHistory from "./viewTxnHistory";
import sixteen from "../../../assets/images/user/16.png";
import CheckListContent from "./checkListContent";
import {
  WATCH_SHAREHOLDERS,
  WATCH_SHAREHOLDERS_DROPDOWN,
  WATCH_SHARE_CERTIFICATES,
  WATCH_SHARE_CERTIFICATES_DROPDOWN,
  WATCH_TRANSACTION_LISTING,
  WATCH_TRANSACTION_REQUEST,
} from "redux/actionTypes";
import ViewTransactionEntitlements from "./viewTransactionEntitlements";
import { getTransactionsListing } from "store/services/transaction.service";
import { getTransactionTypes } from "store/services/transaction.service";
import { getCorporateAnnouncement, getCorporateAnnouncementByCompanyCode } from "store/services/corporate.service";
import { getShareholders, getShareHoldersByCompany } from "store/services/shareholder.service";
import { numberWithCommas } from "../../../../src/utilities/utilityFunctions";
import EditSplitShares from "../share/splitShareCertificate/editSplitShares";
import EditConsolidateShares from "../share/consolidateShares/editConsolidateShares";
import EditDuplicateShareCertificate from "../share/duplicateSharesCertificate/editDuplicateShareCertificate";
import EditTransferOfShares from "../share/transferOfShares/editTransferOfShares";
import EditPhysicalToElectronic from "../share/physicalToElectronic/editPhysicalToElectronic";
import EditElectronicToPhysical from "../share/electronicToPhysical/editElectronicToPhyiscalShareCertificate";
import EditRightSuscription from "../share/rightSubscription/editRightSubscription";
import EditTransferOfRightShares from "../share/transferOfRightShares/editTransferOfRightShares";
import EditTransferDeedVerification from "../share/transferDeedVerification/editTransferDeedVerification";
import EditTransmissionOfShares from "../share/transmissionOfShares/editTransmissionOfShares";
import EditElectronicTransferOfShares from "../share/electronicTransferOfShares/editElectronicTransferOfShares";

export default function TransactionRequestListing() {
  const features = useSelector((data) => data.Features).features;
  const baseEmail = sessionStorage.getItem("email") || "";
  const [viewHistory, setViewHistory] = useState(false);
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const processing_statuses = [
    { color: "#90ee9047", status: "ACCEPTED" },
    { color: "#90ee9047", status: "APPROVED" },
    { color: "#ff073059", status: "DISAPPROVED" },
    { color: "#ff073059", status: "REJECTED" },
    { color: "lightyellow", status: "INREVIEW" },
    { color: "lightyellow", status: "PENDING" },
  ];
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [request_type, setRequest_type] = useState("");
  const [underSearch, setUnderSearch] = useState("");
  const [transactionRequestType, setTransactionRequestType] = useState("");
  const [searchedTransactions, setSearchedTransactions] = useState([]);
  const [selectedTransactionRequest, setSelectedTransactionRequest] = useState(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [acceptedLoading, setAcceptedLoading] = useState(false);
  const [rejectedLoading, setRejectedLoading] = useState(false);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [viewEntitlements, setViewEntitlements] = useState(false);
  // Transactopm Action States
  const [investor_request, setInvestor_request] = useState("");
  const [showCheckList, setShowCheckList] = useState(false);
  const [checkListLoading, setCheckListLoading] = useState(false);
  const [companies_data, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [transaction_request_data, setTransaction_request_data] = useState([]);
  const [
    transaction_request_data_loading,
    setTransaction_request_data_loading,
  ] = useState(false);
  const [investor_request_types, setInvestor_request_types] = useState([]);
  const [investor_request_types_loading, setInvestor_request_types_loading] =
    useState(false);
  const [announcement_dropdown, setAnnouncement_dropdown] = useState([]);
  const [announcement_data_loading, setAnnouncement_data_loading] =
    useState(false);
  const [inactive_shareholders_dropdown, setInactive_shareholders_dropdown] =
    useState([]);
  const [
    inactive_shareholders_data_loading,
    setInactive_shareholders_data_loading,
  ] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  // new pagination server side
  const [currentPage, setCurrentPage] = useState();
  const [nextPage, setNextPage] = useState();
  const [prevPage, setPrevPage] = useState();
  const [hasNextPage, setHasNextPage] = useState();
  const [hasPrevPage, setHasPrevPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [criteria, setCriteria] = useState();
  const [totalRecords, setTotalRecords] = useState();
  // new pagination end

  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);

  useEffect(() => {
    setInvestor_request_types_loading(true);
    const txn_type_setter = async () => {
      try {
        const email = sessionStorage.getItem("email");
        const response = await getTransactionTypes(email);
        const options = response.data.data.map((item) => {
          return { label: item.transactionName, value: item.transactionCode };
        });
        setInvestor_request_types(options);
        setInvestor_request_types_loading(false);
      } catch (error) {
        setInvestor_request_types_loading(false);
      }
    };

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

    // const getAllShareHolders = async () => {
    //   setInactive_shareholders_data_loading(true);
    //   try {
    //     const response = await getShareholders(baseEmail);
    //     if (response.status === 200) {
    //       const shareholders_dropdown = response.data.data.map((item) => {
    //         let label = `${item.folio_number} (${item.shareholder_name}) `;
    //         return { label: label, value: item.folio_number };
    //       });
    //       setInactive_shareholders_dropdown(shareholders_dropdown);
    //       setInactive_shareholders_data_loading(false);
    //     }
    //   } catch (error) {
    //     setInactive_shareholders_data_loading(false);
    //   }
    // };

    // const getAllCorporateAnnouncement = async () => {
    //   setAnnouncement_data_loading(true);
    //   try {
    //     const response = await getCorporateAnnouncement(baseEmail);
    //     if (response.status === 200) {
    //       const announcement_dropdowns = response.data.data.map((item) => {
    //         let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
    //         return { label: label, value: item.announcement_id };
    //       });
    //       setAnnouncement_dropdown(announcement_dropdowns);
    //       setAnnouncement_data_loading(false);
    //     }
    //   } catch (error) {
    //     setAnnouncement_data_loading(false);
    //   }
    // };
    txn_type_setter();
    getAllCompanies();
    // getAllShareHolders();
    // getAllTransactions();
    // getAllCorporateAnnouncement();
  }, []);


  // const getAllTransactions = async () => {
  //   setTransaction_request_data_loading(true);
  //   try {
  //     const response = await getTransactionsListing(baseEmail);
  //     if (response.status === 200) {
  //       const parents = response.data.data;
  //       setTransaction_request_data(parents);
  //       setTransaction_request_data_loading(false);
  //     }
  //   } catch (error) {
  //     setTransaction_request_data_loading(false);
  //   }
  // };

  const getShareHoldersByCompanyCode = async () => {
    setInactive_shareholders_data_loading(true);
    try {

      const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
      if (response.status === 200) {
        const parents = response.data.data;
        const shareholders_dropdown = response.data.data.map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.folio_number };
        });
        setInactive_shareholders_dropdown(shareholders_dropdown);
        setInactive_shareholders_data_loading(false);

      }
    } catch (error) {
      setInactive_shareholders_data_loading(false);
      toast.error("Error fetching shareholders")
    }
  };

  const getInprocessTransactionsByCompanyCode = async () => {
    setTransaction_request_data_loading(false)
    try {
      const response = await getPaginatedInProcessTransactions(
        baseEmail,
        selectedCompany,
        1,
        "",
        ""
      );
      if (response.status === 200) {
        const parents = response.data.data.docs;
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);
        if (parents.length == 0) {
          toast.error("No transaction record found!")
          setTransaction_request_data(parents)
          setTransaction_request_data_loading(false)
        } else {
          const parents = response.data.data.docs ? response.data.data.docs : []
          setTransaction_request_data(parents)
          setTransaction_request_data_loading(false)
        }
      }
    } catch (error) {
      toast.error("Error fetching transactions!")
      setTransaction_request_data_loading(false)
    }
  };

  const getCorporateAnnouncementsForSelectedCompany = async () => {
    setAnnouncement_data_loading(true);
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
        setAnnouncement_data_loading(false);
      }
    } catch (error) {
      setAnnouncement_data_loading(false);
    }
  };

  useEffect(() => {
    if (selectedCompany !== "") {
      getShareHoldersByCompanyCode();
      getCorporateAnnouncementsForSelectedCompany();
      getInprocessTransactionsByCompanyCode();
    }
    else {
      setInactive_shareholders_dropdown([]);
      setAnnouncement_data_loading([]);
      setTransaction_request_data([]);
    }
  }, [selectedCompany])


  const handleNextPage = async () => {
    setTransaction_request_data_loading(true);
    try {
      //for paginated companies
      const response = await getPaginatedInProcessTransactions(
        baseEmail,
        selectedCompany,
        nextPage,
        search ? search : "",
        criteria ? criteria : "",
      );
      if (response.status === 200) {
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);

        // const parents = response.data.data.docs;
        const parents = response.data.data.docs ? response.data.data.docs : [];

        //   const companies_dropdowns = response.data.data.docs.map((item) => {
        //     let label = `${item.code} - ${item.company_name}`;
        //     return { label: label, value: item.code };
        //   });
        //   const obj = {label: 'Not Applicable', value:'N/A'};
        //   companies_dropdowns.push(obj)
        // setCompanies_dropdown(companies_dropdowns);
        // setCompanies(parents);
        setTransaction_request_data(parents)
        setTransaction_request_data_loading(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setTransaction_request_data_loading(false);
    }
  };

  const handlePrevPage = async () => {
    setTransaction_request_data_loading(true);
    try {
      //for paginated companies
      const response = await getPaginatedInProcessTransactions(
        baseEmail,
        selectedCompany,
        prevPage,
        search ? search : "",
        criteria ? criteria : ""
      );
      if (response.status === 200) {
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);

        // const parents = response.data.data.docs;
        const parents = response.data.data.docs ? response.data.data.docs : [];

        //   const companies_dropdowns = response.data.data.docs.map((item) => {
        //     let label = `${item.code} - ${item.company_name}`;
        //     return { label: label, value: item.code };
        //   });
        //   const obj = {label: 'Not Applicable', value:'N/A'};
        //   companies_dropdowns.push(obj)
        // setCompanies_dropdown(companies_dropdowns);
        // setCompanies(parents);
        setTransaction_request_data(parents);
        setTransaction_request_data_loading(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setTransaction_request_data_loading(false);
    }
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    if (criteria == "" || !criteria) {
      return toast.error("Please select search criteria!");
    }
    if (!search || search == "") {
      return toast.error("Enter value for searching");
    }
    let response;
    setTransaction_request_data_loading(true);

    if (criteria !== "" && criteria) {
      response = await getPaginatedInProcessTransactions(
        baseEmail,
        selectedCompany,
        "1",
        search,
        criteria,
      );

      if (response.status === 200) {
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);

        const parents = response.data.data.docs ? response.data.data.docs : [];
        setTransaction_request_data(parents)
        setTransaction_request_data_loading(false);

      } else {
        return toast.error(response.data.message);
      }
    }
  };

  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const txnPerPage = 10;
  const pagesVisited = pageNumber * txnPerPage;
  const totalnumberofPages = 100;
  const displayTransactionsPerPage =
    // searchedTransactions.length === 0
    //   ? transaction_request_data
    //       .sort((a, b) => {
    //         if (new Date(b.txn_date).getTime() < new Date(a.txn_date).getTime())
    //           return -1;
    //         if (new Date(b.txn_date).getTime() > new Date(a.txn_date).getTime())
    //           return 1;
    //         return 0;
    //       })
    //       .slice(pagesVisited, pagesVisited + txnPerPage)
    transaction_request_data && transaction_request_data.length > 0 ? transaction_request_data.map((item, i) => (
      <tr
        key={i}
        style={{
          backgroundColor: processing_statuses.find(
            (tem) => tem.status === item.processing_status
          )?.color,
        }}
      >
        <td>{item.txn_id}</td>
        <td>
          {
            inactive_shareholders_dropdown.find(
              (holder) => holder.value === item.folio_number
            )?.label
          }
        </td>
        <td>
          {
            companies_data.find((comp) => comp.code === item.company_code)
              ?.company_name
          }
        </td>
        <td>
          {
            investor_request_types.find(
              (tem) => tem.value === item.txn_type
            )?.label
          }
        </td>
        <td>{item.announcement_id}</td>
        <td>{item.entitlement_id}</td>
        <td>{item.processing_status}</td>
        <td className="text-right">{numberWithCommas(item.quantity)}</td>
        <td className="text-right">{numberWithCommas(item.price)}</td>

        {(crudFeatures[2] || crudFeatures[1]) &&
          !companies_data_loading &&
          !inactive_shareholders_data_loading &&
          (!!item?.announcement_id ? !announcement_data_loading : true) ? (
          <td>
            <>
              {crudFeatures[1] && (
                <>
                  <i
                    className="icofont icofont-history"
                    id={`viewTransactionHistory-${item.txn_id}`}
                    style={{
                      width: 35,
                      fontSize: 16,
                      padding: 11,
                      color: "rgb(68, 102, 242)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      // for modal
                      setViewHistory(true);
                      sessionStorage.setItem(
                        "selectedTxnHistory",
                        item.txn_history
                      );
                    }}
                  ></i>
                  <UncontrolledTooltip
                    placement="top"
                    target={`viewTransactionHistory-${item.txn_id}`}
                  >
                    {"View Transaction History"}
                  </UncontrolledTooltip>

                  <i
                    className="fa fa-eye"
                    id={`viewTransaction-${item.txn_id}`}
                    style={{
                      width: 35,
                      fontSize: 16,
                      padding: 11,
                      color: "rgb(68, 102, 242)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const obj = JSON.parse(JSON.stringify(item));
                      obj.announcement_id = getFoundObject(
                        announcement_dropdown,
                        obj.announcement_id
                      );
                      obj.from_folio = getFoundObject(
                        inactive_shareholders_dropdown,
                        obj.from_folio
                      );
                      obj.txn_type = getFoundObject(
                        investor_request_types,
                        obj.txn_type
                      )?.label;
                      obj.folio_number = getFoundObject(
                        inactive_shareholders_dropdown,
                        obj.folio_number
                      );
                      obj.symbol = getFoundObject(
                        companies_dropdown,
                        obj.symbol
                      );
                      obj.company_code = getFoundObject(
                        companies_dropdown,
                        obj.company_code
                      );

                      // for modalcompanies
                      setSelectedTransactionRequest(obj);
                      setViewFlag(true);
                      sessionStorage.setItem(
                        "selectedTransactionRequest",
                        JSON.stringify(obj)
                      );
                    }}
                  ></i>
                  <UncontrolledTooltip
                    placement="top"
                    target={`viewTransaction-${item.txn_id}`}
                  >
                    {"View Transaction Detail"}
                  </UncontrolledTooltip>
                </>
              )}

              {crudFeatures[2] && (
                <>
                  <i
                    className="fa fa-pencil"
                    id={`EditTransaction-${item.txn_id}`}
                    style={{
                      width: 35,
                      fontSize: 16,
                      padding: 11,
                      color: "rgb(68, 102, 242)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const obj = JSON.parse(JSON.stringify(item));
                      obj.announcement_id = getFoundObject(
                        announcement_dropdown,
                        obj.announcement_id
                      );
                      obj.from_folio = getFoundObject(
                        inactive_shareholders_dropdown,
                        obj.from_folio
                      );
                      obj.txn_type = getFoundObject(
                        investor_request_types,
                        obj.txn_type
                      )?.value;
                      obj.folio_number = getFoundObject(
                        inactive_shareholders_dropdown,
                        obj.folio_number
                      );
                      obj.symbol = getFoundObject(
                        companies_dropdown,
                        obj.symbol
                      );
                      obj.company_code = getFoundObject(
                        companies_dropdown,
                        obj.company_code
                      );
                      renderModal(`Edit ${item.txn_type}`)
                      setSelectedTransactionRequest(obj);
                      setViewEditPage(true);
                      sessionStorage.setItem(
                        "selectedInvestorRequest",
                        JSON.stringify(obj)
                      );
                    }}
                  ></i>
                  <UncontrolledTooltip
                    placement="top"
                    target={`EditTransaction-${item.txn_id}`}
                  >
                    {"Edit Transaction Detail"}
                  </UncontrolledTooltip>
                </>
              )}
              {!!item.announcement_id &&
                (item.txn_type === BONUS_SHARE_ALLOTMENT_TEMPLATE ||
                  item.txn_type === RIGHT_SHARE_ALLOTMENT_TEMPLATE ||
                  item.txn_type === DIVIDEND_DISBURSEMENT_TEMPLATE) && (
                  <>
                    <i
                      className="fa fa-paperclip"
                      id={`viewEntitlements-${item.txn_id}`}
                      style={{
                        width: 35,
                        fontSize: 16,
                        padding: 11,
                        color: "rgb(68, 102, 12)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        const obj = JSON.parse(JSON.stringify(item));
                        obj.announcement_id = getFoundObject(
                          announcement_dropdown,
                          obj.announcement_id
                        );
                        obj.from_folio = getFoundObject(
                          inactive_shareholders_dropdown,
                          obj.from_folio
                        );

                        obj.txn_type = getFoundObject(
                          investor_request_types,
                          obj.txn_type
                        );
                        obj.folio_number = getFoundObject(
                          inactive_shareholders_dropdown,
                          obj.folio_number
                        );
                        obj.symbol = getFoundObject(
                          companies_dropdown,
                          obj.symbol
                        );
                        obj.company_code = getFoundObject(
                          companies_dropdown,
                          obj.company_code
                        );
                        // for modalcompanies
                        setSelectedTransactionRequest(obj);
                        setViewEntitlements(true);
                        sessionStorage.setItem(
                          "selectedTransactionRequest",
                          JSON.stringify(obj)
                        );
                      }}
                    ></i>
                    <UncontrolledTooltip
                      placement="top"
                      target={`viewEntitlements-${item.txn_id}`}
                    >
                      {"View Entitlements"}
                    </UncontrolledTooltip>
                  </>
                )}
            </>
          </td>
        ) : (
          <td className="d-flex justify-content-center text-primary">
            <div
              style={{
                width: 35,
                padding: 11,
              }}
              className="fa fa-spinner fa-spin "
            ></div>
          </td>
        )}
      </tr>
    )) : ""

  const updateAcceptStatusAccepted = async (checkList) => {
    setAcceptedLoading(true);
    try {
      const response = await updateTransactionStatus(
        baseEmail,
        selectedTransactionRequest?.txn_id,
        "ACCEPTED",
        checkList
      );
      if (response.status === 200) {
        setTimeout(() => {
          toast.success(response.data.message);
          getShareHoldersByCompanyCode();
          getCorporateAnnouncementsForSelectedCompany();
          getInprocessTransactionsByCompanyCode();
          setAcceptedLoading(false);
          setShowCheckList(false);
          setViewFlag(false);
          // getAllTransactions();
        }, 2000);
      }
    } catch (error) {
      setAcceptedLoading(false);
      !!error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : toast.error("Transaction Status Not Submitted");
    }
  };
  const updateAcceptStatusRejected = async (checkList) => {
    setRejectedLoading(true);
    try {
      const response = await updateTransactionStatus(
        baseEmail,
        selectedTransactionRequest?.txn_id,
        "REJECTED",
        checkList
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          dispatch({ type: WATCH_TRANSACTION_REQUEST });
          getShareHoldersByCompanyCode();
          getCorporateAnnouncementsForSelectedCompany();
          getInprocessTransactionsByCompanyCode();
          setRejectedLoading(false);
          setShowCheckList(false);
          setViewFlag(false);
        }, 2000);
      }
    } catch (error) {
      setRejectedLoading(false);
      !!error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : toast.error("Transaction Status Not Submitted");
    }
  };
  const renderModal = (value) => {
    switch (value) {
      case DIVIDEND_DISBURSEMENT_TEMPLATE:
        setTransactionRequestType(DIVIDEND_DISBURSEMENT);
        setViewFlag(true);
        break;
      case RIGHT_SHARE_ALLOTMENT_TEMPLATE:
        setTransactionRequestType(RIGHT_SHARE_ALLOTMENT);
        setViewFlag(true);
        break;
      case BONUS_SHARE_ALLOTMENT_TEMPLATE:
        setTransactionRequestType(BONUS_SHARE_ALLOTMENT);
        setViewFlag(true);
        break;
      case EDIT_ELECTRONIC_TRANSMISSION_OF_SHARES:
        setInvestor_request(EDIT_ELECTRONIC_TRANSFER_OF_SHARES);
        setViewEditPage(true);
        break;
      case EDIT_SPLIT_SHARES:
        setInvestor_request(EDIT_SPLIT_SHARES);
        setViewEditPage(true);
        break;
      case EDIT_CONSOLIDATE_SHARES:
        setInvestor_request(EDIT_CONSOLIDATE_SHARES);
        setViewEditPage(true);
        break;
      case EDIT_DUPLICATE_SHARES:
        setInvestor_request(EDIT_DUPLICATE_SHARES);
        setViewEditPage(true);
        break;
      case EDIT_TRANSFER_OF_SHARES:
        setInvestor_request(EDIT_TRANSFER_OF_SHARES);
        setViewEditPage(true);
        break;
      case EDIT_ELECTRONIC_TRANSFER_OF_SHARES:
        setInvestor_request(EDIT_ELECTRONIC_TRANSFER_OF_SHARES);
        setViewEditPage(true);
        break;
      case EDIT_PHYSICAL_TO_ELECTRONIC:
        setInvestor_request(EDIT_PHYSICAL_TO_ELECTRONIC);
        setViewEditPage(true);
        break;
      case EDIT_ELECTRONIC_TO_PHYSICAL:
        setInvestor_request(EDIT_ELECTRONIC_TO_PHYSICAL);
        setViewEditPage(true);
        break;
      case EDIT_RIGHT_SUBSCRIBTION:
        setInvestor_request(EDIT_RIGHT_SUBSCRIBTION);
        setViewEditPage(true);
        break;
      case EDIT_TRANSFER_RIGHT_SHARES:
        setInvestor_request(EDIT_TRANSFER_RIGHT_SHARES);
        setViewEditPage(true);
        break;
      case EDIT_VERIFICATION_TRANSFER_DEED:
        setInvestor_request(EDIT_VERIFICATION_TRANSFER_DEED);
        setViewEditPage(true);
        break;
      case EDIT_TRANSMISSION_OF_SHARES:
        setInvestor_request(EDIT_TRANSMISSION_OF_SHARES);
        setViewEditPage(true);
        break;
      case SPLIT_SHARES_TEMPLATE:
        setInvestor_request(SPLIT_SHARES);
        setViewFlag(true);
        break;
      case CONSOLIDATE_SHARES_TEMPLATE:
        setInvestor_request(CONSOLIDATE_SHARES);
        setViewFlag(true);
        break;
      case DUPLICATE_SHARES_TEMPLATE:
        setInvestor_request(DUPLICATE_SHARES);
        setViewFlag(true);
        break;
      case TRANSFER_OF_SHARES_TEMPLATE:
        setInvestor_request(TRANSFER_OF_SHARES);
        setViewFlag(true);
        break;
      case ELECTRONIC_TRANSFER_OF_SHARES_TEMPLATE:
        setInvestor_request(ELECTRONIC_TRANSFER_OF_SHARES);
        setViewFlag(true);
        break;
      case PHYSICAL_TO_ELECTRONIC_TEMPLATE:
        setInvestor_request(PHYSICAL_TO_ELECTRONIC);
        setViewFlag(true);
        break;
      case ELECTRONIC_TO_PHYSICAL_TEMPLATE:
        setInvestor_request(ELECTRONIC_TO_PHYSICAL);
        setViewFlag(true);
        break;
      case RIGHT_SUBSCRIBTION_TEMPLATE:
        setInvestor_request(RIGHT_SUBSCRIBTION);
        setViewFlag(true);
        break;
      case TRANSFER_RIGHT_SHARES_TEMPLATE:
        setInvestor_request(TRANSFER_RIGHT_SHARES);
        setViewFlag(true);
        break;
      case VERIFICATION_TRANSFER_DEED_TEMPLATE:
        setInvestor_request(VERIFICATION_TRANSFER_DEED);
        setViewFlag(true);
        break;
      case TRANSMISSION_OF_SHARES_TEMPLATE:
        setInvestor_request(TRANSMISSION_OF_SHARES);
        setViewFlag(true);
      case ELECTRONIC_TRANSMISSION_OF_SHARES_TEMPLATE:
        setInvestor_request(ELECTRONIC_TRANSMISSION_OF_SHARES);
        setViewFlag(true);
        break;
      default:
        break;
    }
  };
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <div>
          <Breadcrumb
            title="Transaction Requests Listing"
            parent="Processing"
          />
        </div>
      </div>
      {/* Check list Content */}
      <Modal isOpen={showCheckList} show={showCheckList.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setShowCheckList(false);
          }}
        >
          Transaction Check List
        </ModalHeader>
        <ModalBody>
          <CheckListContent
            transactionRequest={selectedTransactionRequest}
            acceptedLoading={acceptedLoading}
            rejectedLoading={rejectedLoading}
            updateAcceptStatusAccepted={updateAcceptStatusAccepted}
            updateAcceptStatusRejected={updateAcceptStatusRejected}
          />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          {"View "}
          {selectedTransactionRequest.txn_type ===
            DIVIDEND_DISBURSEMENT_TEMPLATE
            ? DIVIDEND_DISBURSEMENT + " Transaction"
            : selectedTransactionRequest.txn_type ===
              RIGHT_SHARE_ALLOTMENT_TEMPLATE
              ? RIGHT_SHARE_ALLOTMENT + " Transaction"
              : selectedTransactionRequest.txn_type ===
                BONUS_SHARE_ALLOTMENT_TEMPLATE
                ? BONUS_SHARE_ALLOTMENT + " Transaction"
                : "Transasction Request"}
        </ModalHeader>
        <ModalBody>
          {selectedTransactionRequest.txn_type ===
            DIVIDEND_DISBURSEMENT_TEMPLATE ? (
            <DividendDisbursementTxn />
          ) : selectedTransactionRequest.txn_type ===
            RIGHT_SHARE_ALLOTMENT_TEMPLATE ? (
            <RightShareAllotmentTxn />
          ) : selectedTransactionRequest.txn_type ===
            BONUS_SHARE_ALLOTMENT_TEMPLATE ? (
            <BonusShareAllotmentTxn />
          ) : (
            <ViewTransactionRequest setViewFlag={setViewFlag} />
          )}
        </ModalBody>
        {crudFeatures[2] && (
          <ModalFooter>
            <div className="row mx-3">
              <div className="col-md-3 col-lg-3 col-xl-3 col-sm-12">
                <div className="form-group">
                  {selectedTransactionRequest.processing_status ===
                    "DISAPPROVED" ? (
                    <button
                      disabled
                      style={{ cursor: "not-allowed" }}
                      className="btn btn-danger"
                    >
                      Disapproved
                    </button>
                  ) : selectedTransactionRequest.processing_status ===
                    "APPROVED" ? (
                    <button
                      className="btn btn-success"
                      style={{ cursor: "not-allowed" }}
                    >
                      Approved
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={(e) => setShowCheckList(true)}
                    >
                      Action
                    </button>
                  )}
                </div>
              </div>
            </div>
          </ModalFooter>
        )}
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Edit Transaction Request
        </ModalHeader>
        <ModalBody>
          {investor_request === EDIT_SPLIT_SHARES ? (
            <EditSplitShares setInvestorRequestForm={setViewEditPage} />
          ) : investor_request === EDIT_CONSOLIDATE_SHARES ? (
            <EditConsolidateShares setInvestorRequestForm={setViewEditPage} />
          ) : investor_request === EDIT_DUPLICATE_SHARES ? (
            <EditDuplicateShareCertificate
              setInvestorRequestForm={setViewEditPage}
            />
          ) : investor_request === EDIT_TRANSFER_OF_SHARES ? (
            <EditTransferOfShares setInvestorRequestForm={setViewEditPage} />
          ) : investor_request === EDIT_PHYSICAL_TO_ELECTRONIC ? (
            <EditPhysicalToElectronic
              setInvestorRequestForm={setViewEditPage}
            />
          ) : investor_request === EDIT_ELECTRONIC_TO_PHYSICAL ? (
            <EditElectronicToPhysical
              setInvestorRequestForm={setViewEditPage}
            />
          ) : investor_request === EDIT_RIGHT_SUBSCRIBTION ? (
            <EditRightSuscription setInvestorRequestForm={setViewEditPage} />
          ) : investor_request === EDIT_TRANSFER_RIGHT_SHARES ? (
            <EditTransferOfRightShares
              setInvestorRequestForm={setViewEditPage}
            />
          ) : investor_request === EDIT_VERIFICATION_TRANSFER_DEED ? (
            <EditTransferDeedVerification
              setInvestorRequestForm={setViewEditPage}
            />
          ) : EDIT_TRANSMISSION_OF_SHARES ? (
            <EditTransmissionOfShares
              setInvestorRequestForm={setViewEditPage}
            />
          ) : (
            <EditElectronicTransferOfShares
              setInvestorRequestForm={setViewEditPage}
            />
          )}
        </ModalBody>
      </Modal>
      {/* View Entitlement */}
      <Modal
        isOpen={viewEntitlements}
        show={viewEntitlements.toString()}
        size="xl"
      >
        <ModalHeader
          toggle={() => {
            setViewEntitlements(false);
          }}
        >
          {"View "}
          {selectedTransactionRequest.txn_type ===
            DIVIDEND_DISBURSEMENT_TEMPLATE
            ? DIVIDEND_DISBURSEMENT + " Entitlements"
            : selectedTransactionRequest.txn_type ===
              RIGHT_SHARE_ALLOTMENT_TEMPLATE
              ? RIGHT_SHARE_ALLOTMENT + " Entitlements"
              : selectedTransactionRequest.txn_type ===
                BONUS_SHARE_ALLOTMENT_TEMPLATE
                ? BONUS_SHARE_ALLOTMENT + " Entitlements"
                : "Transasction Request"}
        </ModalHeader>
        <ModalBody>
          <ViewTransactionEntitlements />
        </ModalBody>
        <ModalFooter>
          <div className="row mx-3">
            <div className="col-md-3 col-lg-3 col-xl-3 col-sm-12">
              <div className="form-group">
                {selectedTransactionRequest.processing_status ===
                  "DISAPPROVED" ? (
                  <button
                    disabled
                    style={{ cursor: "not-allowed" }}
                    className="btn btn-danger"
                  >
                    Disapproved
                  </button>
                ) : selectedTransactionRequest.processing_status ===
                  "APPROVED" ? (
                  <button
                    className="btn btn-success"
                    style={{ cursor: "not-allowed" }}
                  >
                    Approved
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={(e) => setShowCheckList(true)}
                  >
                    Action
                  </button>
                )}
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>

      {/* View Transaction History */}
      <Modal isOpen={viewHistory} show={viewHistory.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewHistory(false);
          }}
        >
          Transaction Request History View
        </ModalHeader>
        <ModalBody>
          <ViewTxnHistory setViewFlag={setViewHistory} />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="row mt-2">
                  <div className="col-sm-12 col-lg-4 col-md-4">
                    <div className="form-group">
                      <label htmlFor="company">Company</label>
                      <Select
                        options={companies_dropdown}
                        isLoading={companies_data_loading}
                        style={!selectedCompany && errorStyles}
                        isClearable={true}
                        onChange={(selected) => {
                          selected && setSelectedCompany(selected.value);
                          !selected && setSelectedCompany("");
                        }}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small>
                          Select Company to show transactions
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                {selectedCompany && selectedCompany !== "" &&
                  <div className="row mt-2">
                    {/* <div className="col-sm-12 col-lg-4 col-md-4">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">
                        Search Transaction
                        <input
                          id="searchTransaction"
                          className="form-control"
                          type="text"
                          placeholder={"Enter Search ID"}
                          value={search}
                          onChange={(e) => {
                            setSearch(e?.target?.value);
                          }}
                          isClearable={true}
                        />
                      </label>
                    </div>
                  </div> */}
                    {/* <div className="col-sm-12 col-lg-4 col-md-4">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Status</label>
                      <Select
                        options={[
                          { label: "Inreview", value: "INREVIEW" },
                          { label: "Pending", value: "PENDING" },
                          { label: "Approved", value: "APPROVED" },
                          { label: "Disapproved", value: "DISAPPROVED" },
                          { label: "Rejected", value: "REJECTED" },
                        ]}
                        isClearable={true}
                        onChange={(selected) => {
                          selected &&
                            handleSearchChange("", "", selected?.value);
                          !selected && setUnderSearch("");
                        }}
                        styles={darkStyle}
                      />
                    </div>
                  </div> */}
                    {/* <div className="col-sm-12 col-lg-4 col-md-4">
                    <label htmlFor="email">Transaction Type </label>
                    <Select
                      options={investor_request_types}
                      isLoading={investor_request_types.length === 0}
                      onChange={(selected) => {
                        !selected && setRequest_type("");
                        selected && setRequest_type(selected.value);
                      }}
                      styles={darkStyle}
                      isClearable={true}
                    />
                  </div> */}
                    <form
                      className="d-flex justify-content-start col-sm-10"
                      onSubmit={(e) => handleSearch(e)}
                      style={{flexWrap: 'wrap'}}
                    >
                      <div className="col-sm-3">
                        <div className="form-group">
                          {/* <label htmlFor="company_type">Search Criteria</label> */}
                          <select
                            name="search_criteria"
                            className={`form-control`}
                            onChange={(e) => {
                              setCriteria(e.target.value);
                            }}
                          >
                            <option value="">Select Criteria</option>
                            <option value="id">Id</option>
                            <option value="type">Type</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="form-group">
                          {criteria != "type" && criteria != "status" && <input
                            id="searchTransaction"
                            className="form-control"
                            type="text"
                            // placeholder={"Search Company"}
                            placeholder={
                              criteria == "" || !criteria
                                ? `Select Criteria`
                                : criteria == "id"
                                  ? `Search by Transaction Id`
                                  : criteria == "name"
                                    ? `Search by Company Name`
                                    : `Search by Company Code`
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            // onKeyPress={handleKeypress}
                            disabled={!criteria}
                          />}

                          {criteria == "type" &&
                            <Select
                              options={investor_request_types}
                              isLoading={investor_request_types.length === 0}

                              onChange={(selected) => {
                                //  !selected && setRequest_type("");
                                //  selected && setRequest_type(selected.value);
                                selected && setSearch(selected.value);
                                !selected && setSearch("");
                                !selected && getInprocessTransactionsByCompanyCode();

                              }}
                              styles={darkStyle}
                              isClearable={true}
                            />}
                        </div>
                      </div>

                      <div className="col-sm-2">
                        <div className="form-group">
                          <button
                            className="btn btn-secondary btn-sm my-1"
                            disabled={!criteria}
                          >
                            <span>{"Search"}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>}
              </div>
              {(transaction_request_data_loading ||
                investor_request_types_loading ||
                inactive_shareholders_data_loading) && <Spinner />}
              {investor_request_types_loading === false &&
                transaction_request_data_loading === false &&
                inactive_shareholders_data_loading === false && (
                  <div className="table-responsive">
                    <table className="table  ">
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Folio Number</th>
                          <th>Company</th>
                          <th>Request Type</th>
                          <th>Announcement ID</th>
                          <th>Entitlement ID</th>
                          <th>Status</th>
                          <th className="text-right">Quantity</th>
                          <th className="text-right">Price</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>{displayTransactionsPerPage}</tbody>
                    </table>
                    <center className="d-flex justify-content-center py-3">
                      <nav className="pagination">
                        {/* <ReactPaginate
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
                        /> */}
                        {hasPrevPage && (
                          <button
                            className="btn btn-primary btn-sm mx-1"
                            onClick={() => handlePrevPage()}
                          >
                            <span>{"Prev"}</span>
                          </button>
                        )}
                        {hasNextPage && (
                          <button
                            className="btn btn-secondary btn-sm mx-1"
                            onClick={() => handleNextPage()}
                          >
                            <span>{"Next"}</span>
                          </button>
                        )}
                      </nav>
                    </center>
                    <p className="align-content-center text-center mx-2">
                      Page {currentPage} of {totalPages}
                    </p>
                    <p className="text-right mx-2">{totalRecords} Records</p>
                  </div>

                )}
              {transaction_request_data && transaction_request_data.length === 0 &&
                transaction_request_data_loading === false && (
                  <p className="text-center">
                    <b>Transactions Requests Data not available</b>
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </Fragment>
  );
}
