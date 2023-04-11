import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { filterData, SearchType } from "filter-data";
import {
  BONUS_SHARE_ALLOTMENT_TEMPLATE,
  RIGHT_SHARE_ALLOTMENT_TEMPLATE,
  DIVIDEND_DISBURSEMENT_TEMPLATE,
  DIVIDEND_DISBURSEMENT,
  RIGHT_SHARE_ALLOTMENT,
  BONUS_SHARE_ALLOTMENT,
} from "constant";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import { useSelector } from "react-redux";
import { listCrud } from "utilities/utilityFunctions";
import Select from "react-select";
import {
  generateRegex,
  getFoundObject,
} from "../../../utilities/utilityFunctions";
import ViewTransactionRequest from "components/shareRegistrar/processing/viewTransactionRequest";
import { darkStyle, errorStyles } from "components/defaultStyles";
import ReactPaginate from "react-paginate";
import ViewTxnHistory from "components/shareRegistrar/processing/viewTxnHistory";
import Spinner from "components/common/spinner";
import { getPaginatedTransactions, getTransactionTypes } from "store/services/transaction.service";
import { getCompanies, getCompanyById } from "store/services/company.service";
import { getShareholders, getShareHoldersByCompany } from "store/services/shareholder.service";
import { getTransactionsListing } from "store/services/transaction.service";
import { numberWithCommas } from "utilities/utilityFunctions";
import { announcement_id_setter, entitlement_id_setter, folio_setter, symbol_setter, txn_type_setter } from "store/services/dropdown.service";
import { getCorporateAnnouncement } from "store/services/corporate.service";
import ViewTransactionEntitlements from "../processing/viewTransactionEntitlements";

export default function TransactionListings() {
  const features = useSelector((data) => data.Features).features;
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
  const baseEmail = sessionStorage.getItem("email") || "";
  const request_types = [
    {
      label: "Transfer of Shares",
      value: "TOS",
    },
    {
      label: "IPO Subscription",
      value: "IPO",
    },
    {
      label: "Right Subscription",
      value: "RSA",
    },
    {
      label: "Issuance Of Shares",
      value: "RSA",
    },
  ];
  const [search, setSearch] = useState("");
  const [underSearch, setUnderSearch] = useState("");
  const [searchedTransactions, setSearchedTransactions] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [investor_request_types, setInvestor_request_types] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [shareholders_dropdown, setShareholders_dropdown] = useState([]);
  const [shareholders_data_loading, setShareholders_data_loading] = useState(false);
  const [transaction_listing_data, setTransaction_listing_data] = useState([]);
  const [transaction_listing_loading, setTransaction_listing_loadng] = useState(false);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");

  const [company_data, setCompany_Data] = useState([]);
  const [shareholders, setShareholders] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(
    {}
  );
  const [viewEntitlements, setViewEntitlements] = useState(false);

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
  let history = useHistory();

  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);
  useEffect(() => {
    const txn_type_setter = async () => {
      try {
        const email = sessionStorage.getItem("email");
        const response = await getTransactionTypes(email);
        const options = response.data.data.map((item) => {
          return { label: item.transactionName, value: item.transactionCode };
        });
        setInvestor_request_types(options)
      } catch (error) {
      }
    };
    const getAllCompanies = async () => {
      try {
        const response = await getCompanies(baseEmail)
        if (response.status === 200) {
          const parents = response.data.data
          const companies_dropdowns = response.data.data.map((item) => {
            let label = `${item.code} - ${item.company_name}`;
            return { label: label, value: item.code };
          });
          setCompanies_dropdown(companies_dropdowns);
          setCompanies(parents)
        }
      } catch (error) {
      }
    };

    txn_type_setter();
    getAllCompanies();
    // getAllShareHolders();
    // getAllTransactions();

  }, []);

  const getCompany = async (code) => {
    try {
      const response = await getCompanyById(baseEmail, code);
      if (response.status == 200) {
        // setShareholders_dropdown(shareholders_dropdown);
        setCompany_Data(response.data.data);
      } else {
        setCompany_Data([]);
      }
    } catch (error) {
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }

  const getAnnouncementsByCompany = async (code) => {
    try {
      const response = await getCorporateAnnouncement(baseEmail, code);
      if (response.status == 200) {
        const announcement_dropdowns = response.data.data.map((item) => {
          let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
          return { label: label, value: item.announcement_id };
        });
        setAnnouncements(announcement_dropdowns)
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }



  const getShareHoldersByCompanyCode = async (code) => {
    setShareholders_data_loading(true);
    try {

      const response = await getShareHoldersByCompany(baseEmail, code, "");
      if (response.status === 200) {
        const parents = response.data.data;
        const shareholders_dropdown = response.data.data.map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.folio_number };
        });
        setShareholders_dropdown(shareholders_dropdown);
        setShareholders_data_loading(false);

      }
    } catch (error) {
      setShareholders_data_loading(false);
      toast.error("Error fetching shareholders")
    }
  };

  const getTransactionsByCompanyCode = async (code) => {
    setTransaction_listing_loadng(false)
    try {
      const response = await getPaginatedTransactions(
        baseEmail,
        code,
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
          setTransaction_listing_data(parents)
          setTransaction_listing_loadng(false)
        } else {
          const parents = response.data.data.docs ? response.data.data.docs : []
          setTransaction_listing_data(parents)
          setTransaction_listing_loadng(false)
        }
      }
    } catch (error) {
      toast.error("Error fetching transactions!")
      setTransaction_listing_loadng(false)
    }
  };

  // useEffect(() => {
  //   setShareholders_dropdown([]);
  //   setTransaction_listing_data([]);
  // }, [selectedCompany])

  const handleNextPage = async () => {
    setTransaction_listing_loadng(true);
    try {
      //for paginated companies
      const response = await getPaginatedTransactions(
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
        setTransaction_listing_data(parents)
        setTransaction_listing_loadng(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setTransaction_listing_loadng(false);
    }
  };

  const handlePrevPage = async () => {
    setTransaction_listing_loadng(true);
    try {
      //for paginated companies
      const response = await getPaginatedTransactions(
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
        setTransaction_listing_data(parents);
        setTransaction_listing_loadng(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setTransaction_listing_loadng(false);
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
    setTransaction_listing_loadng(false);

    if (criteria !== "" && criteria) {
      response = await getPaginatedTransactions(
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
        setTransaction_listing_data(parents)
        setTransaction_listing_loadng(false);

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
    //   ? transaction_listing_data
    //       .sort((a, b) => {
    //         if (new Date(b.txn_date).getTime() < new Date(a.txn_date).getTime())
    //           return -1;
    //         if (new Date(b.txn_date).getTime() > new Date(a.txn_date).getTime())
    //           return 1;
    //         return 0;
    //       })
    //       .slice(pagesVisited, pagesVisited + txnPerPage)
    transaction_listing_data && transaction_listing_data.length > 0 ? transaction_listing_data.map((item, i) => (
      <tr key={i}>
        <td>{item.txn_id}</td>
        <td>
          {
            shareholders_dropdown.find(
              (holder) => holder.value === item.folio_number
            )?.label
          }
        </td>
        <td>
          {
            companies.find(
              (comp) => comp.code === item.company_code
            )?.company_name
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
        {crudFeatures[2] && (
          <td>
            <>
              <i
                className="icofont icofont-history"
                id="viewTransactionHistory"
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
                target="viewTransactionHistory"
              >
                {"View Transaction History"}
              </UncontrolledTooltip>
              <i
                className="fa fa-eye"
                id="viewTransaction"
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
                    // announcements.announcement_dropdown,
                    announcements,
                    obj.announcement_id
                  );
                  //   obj.entitlement_id = getFoundObject(
                  //     entitlements.entitlement_dropdown,
                  //     obj.entitlement_id
                  //   );
                  obj.from_folio = getFoundObject(
                    // shareholders.shareholders_dropdown,
                    shareholders_dropdown,
                    obj.from_folio
                  );
                  obj.symbol = {
                    value: company_data?.symbol,
                    label: company_data?.symbol,
                  };
                  let txnr_type = investor_request_types.find(
                    (tem) => tem.value === item.txn_type
                  )?.label;
                  // for modal
                  obj['txn_type'] = txnr_type;
                  obj.folio_number = getFoundObject(
                    shareholders_dropdown,
                    obj.folio_number
                  );
                  obj.company_code = {
                    label: company_data?.company_name,
                    value: company_data?.code,
                  };
                  // for modal
                  setViewFlag(true);
                  sessionStorage.setItem(
                    "selectedTransactionRequest",
                    JSON.stringify(obj)
                  );
                }}
              // onClick={() => {
              //   const obj = JSON.parse(JSON.stringify(item));
              //   obj.announcement_id = getFoundObject(
              //     announcement_id_options,
              //     obj.announcement_id
              //   );
              //   obj.entitlement_id = getFoundObject(
              //     entitlement_id_options,
              //     obj.entitlement_id
              //   );
              //   obj.from_folio = getFoundObject(
              //     folio_options,
              //     obj.from_folio
              //   );
              //   obj.symbol = getFoundObject(
              //     symbol_options,
              //     obj.symbol
              //   );
              //   obj.txn_type = getFoundObject(
              //     txn_type_options,
              //     obj.txn_type
              //   );
              //   obj.folio_number = getFoundObject(
              //     folio_options,
              //     obj.folio_number
              //   );
              //   obj.company_code = getFoundObject(
              //     companies,
              //     obj.company_code
              //   );
              //   let txnr_type = investor_request_types.find(
              //       (tem) => tem.value === item.txn_type
              //     )?.label;
              //   // for modal
              //   obj['txn_type'] = txnr_type;
              //   setViewFlag(true);
              //   sessionStorage.setItem(
              //     "selectedTransactionRequest",
              //     JSON.stringify(obj)
              //   );
              // }}
              // onClick={() => {
              //   const obj = JSON.parse(JSON.stringify(item));
              //   obj.announcement_id = getFoundObject(
              //     announcements.announcement_dropdown,
              //     obj.announcement_id
              //   );
              //   obj.entitlement_id = getFoundObject(
              //     entitlements.entitlement_dropdown,
              //     obj.entitlement_id
              //   );
              //   obj.from_folio = getFoundObject(
              //     shareholders.shareholders_dropdown,
              //     obj.from_folio
              //   );
              //   // obj.symbol = getFoundObject(symbol_options, obj.symbol);
              //   obj.txn_type = getFoundObject(
              //     transaction_request_types,
              //     obj.txn_type
              //   );
              //   obj.folio_number = getFoundObject(
              //     shareholders.shareholders_dropdown,
              //     obj.folio_number
              //   );
              //   obj.company_code = getFoundObject(
              //     companies.companies_dropdown,
              //     obj.company_code
              //   );
              //   // for modal
              //   setViewFlag(true);
              //   sessionStorage.setItem(
              //     "selectedTransactionRequest",
              //     JSON.stringify(obj)
              //   );
              // }}
              ></i>
              <UncontrolledTooltip placement="top" target="viewTransaction">
                {"View Transaction Detail"}
              </UncontrolledTooltip>
              {(!!item.announcement_id && item.txn_type !== 'RSUB') && (

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
                        announcements,
                        obj.announcement_id
                      );
                      if (item.txn_type !== 'BSA') {
                        obj.from_number = getFoundObject(
                          shareholders_dropdown,
                          obj.from_number)
                      }

                      obj.symbol = {
                        value: company_data?.symbol,
                        label: company_data?.symbol,
                      };
                      obj.txn_type = getFoundObject(
                        investor_request_types,
                        obj.txn_type
                      )
                      if (item.txn_type !== 'BSA') {
                        obj.folio_number = getFoundObject(
                          shareholders_dropdown,
                          obj.folio_number
                        );
                      }
                      obj.company_code = {
                        label: company_data?.company_name,
                        value: company_data?.code,
                      };
                      console.log('item.txn_type',item.txn_type)
                      // for modalcompanies
                      setSelectedTransaction(obj);
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
        )}
      </tr >
    )) : ""
  // : searchedTransactions
  //     .sort((a, b) => {
  //       if (new Date(b.txn_date).getTime() < new Date(a.txn_date).getTime())
  //         return -1;
  //       if (new Date(b.txn_date).getTime() > new Date(a.txn_date).getTime())
  //         return 1;
  //       return 0;
  //     })
  //     .slice(pagesVisited, pagesVisited + txnPerPage)
  //     .map((item, i) => (
  //       <tr
  //         key={i}
  //         style={{
  //           backgroundColor: processing_statuses.find(
  //             (tem) => tem.status === item.processing_status
  //           )?.color,
  //         }}
  //       >
  //         <td>{item.txn_id}</td>
  //         <td>
  //           {
  //             shareholders_dropdown.find(
  //               (holder) => holder.value === item.folio_number
  //             )?.label
  //           }
  //         </td>
  //         <td>
  //           {
  //             companies.find(
  //               (comp) => comp.code === item.company_code
  //             )?.company_name
  //           }
  //         </td>
  //         <td>
  //           {
  //             transaction_listing_data.find(
  //               (tem) => tem.value === item.txn_type
  //             )?.label
  //           }
  //         </td>
  //         <td>{item.announcement_id}</td>
  //         <td>{item.entitlement_id}</td>
  //         <td>{item.processing_status}</td>
  //         <td className="text-right">{numberWithCommas(item.quantity)}</td>
  //         <td>{item.price}</td>
  //         {crudFeatures[2] && (
  //           <td>
  //             <>
  //               <i
  //                 className="icofont icofont-history"
  //                 id="viewTransactionHistory"
  //                 style={{
  //                   width: 35,
  //                   fontSize: 16,
  //                   padding: 11,
  //                   color: "rgb(68, 102, 242)",
  //                   cursor: "pointer",
  //                 }}
  //                 onClick={() => {
  //                   // for modal
  //                   setViewHistory(true);
  //                   sessionStorage.setItem(
  //                     "selectedTxnHistory",
  //                     item.txn_history
  //                   );
  //                 }}
  //               ></i>
  //               <UncontrolledTooltip
  //                 placement="top"
  //                 target="viewTransactionHistory"
  //               >
  //                 {"View Transaction History"}
  //               </UncontrolledTooltip>
  //               {/* <i
  //                 className="fa fa-eye"
  //                 id="viewTransaction"
  //                 style={{
  //                   width: 35,
  //                   fontSize: 16,
  //                   padding: 11,
  //                   color: "rgb(68, 102, 242)",
  //                   cursor: "pointer",
  //                 }}
  //                 onClick={() => {
  //                   const obj = JSON.parse(JSON.stringify(item));
  //                   obj.announcement_id = getFoundObject(
  //                     announcements.announcement_dropdown,
  //                     obj.announcement_id
  //                   );
  //                   obj.entitlement_id = getFoundObject(
  //                     entitlements.entitlement_dropdown,
  //                     obj.entitlement_id
  //                   );
  //                   obj.from_folio = getFoundObject(
  //                     shareholders.shareholders_dropdown,
  //                     obj.from_folio
  //                   );
  //                   // obj.symbol = getFoundObject(symbol_options, obj.symbol);
  //                   obj.txn_type = getFoundObject(
  //                     transaction_request_types,
  //                     obj.txn_type
  //                   );
  //                   obj.folio_number = getFoundObject(
  //                     shareholders.shareholders_dropdown,
  //                     obj.folio_number
  //                   );
  //                   obj.company_code = getFoundObject(
  //                     companies.companies_dropdown,
  //                     obj.company_code
  //                   );
  //                   // for modal
  //                   setViewFlag(true);
  //                   sessionStorage.setItem(
  //                     "selectedTransactionRequest",
  //                     JSON.stringify(obj)
  //                   );
  //                 }}
  //               ></i>
  //               <UncontrolledTooltip placement="top" target="viewTransaction">
  //                 {"View Transaction Detail"}
  //               </UncontrolledTooltip> */}
  //             </>
  //           </td>
  //         )}
  //       </tr>
  //     ));
  const pageCount = !underSearch
    ? Math.ceil(transaction_listing_data.length / txnPerPage)
    : Math.ceil(searchedTransactions.length / txnPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  // useEffect(() => {
  //   if (search || request_type) {

  //     const searchConditions = [
  //       { key: "txn_id", value: search, type: SearchType.LK },
  //       { key: "txn_type", value: request_type, type: SearchType.EQ },
  //     ];
  //     const result = filterData(
  //       transaction_listing_data,
  //       searchConditions

  //     );
  //     setSearchedTransactions(result);
  //   } else if (!search && !request_type) {
  //     setUnderSearch("");
  //   }
  // }, [search, request_type]);

  // const handleSearchChange = (e = "", txn_type = "", status = "") => {
  //   !!e && setSearch(e.target.value);
  //   !!e && setUnderSearch(e.target.value);
  //   !!txn_type && setUnderSearch(txn_type);
  //   !!status && setUnderSearch(txn_type);
  //   !e && !status && !txn_type && setSearch("");
  //   if (!!e) {
  //     if (e.target.value.length > 0) {
  //       if (transaction_listing_data.length > 0) {
  //         let filtered_data = transaction_listing_data.filter((txn) => {
  //           return txn.txn_id.match(generateRegex(e.target.value));
  //         });
  //         // const half = (num) => Math.ceil(num / 2);
  //         // if (filtered_data.length === 0) {
  //         //   filtered_data =
  //         //     transaction_listing_data.filter((txn) => {
  //         //       return txn.txn_id[-half(txn.txn_id.length)].match(
  //         //         generateRegex(e.target.value)
  //         //       );
  //         //     });
  //         // }
  //         setSearchedTransactions(filtered_data);
  //       }
  //     }
  //   }
  //   if (!!txn_type) {
  //     setSearchedTransactions(
  //       transaction_listing_data.filter((txn) => txn.txn_type === txn_type)
  //     );
  //   }
  //   if (!!status) {
  //     setSearchedTransactions(
  //       transaction_listing_data.filter(
  //         (txn) => txn.processing_status === status
  //       )
  //     );
  //   }
  // };
  return (
    <Fragment>
      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Investor Request
        </ModalHeader>
        <ModalBody>
          {/* <AddInvestorRequest setViewAddPage={setViewAddPage} /> */}
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
          {selectedTransaction.txn_type?.value ===
            DIVIDEND_DISBURSEMENT_TEMPLATE
            ? DIVIDEND_DISBURSEMENT + " Entitlements"
            : selectedTransaction.txn_type?.value ===
              RIGHT_SHARE_ALLOTMENT_TEMPLATE
              ? RIGHT_SHARE_ALLOTMENT + " Entitlements"
              : selectedTransaction.txn_type?.value ===
                BONUS_SHARE_ALLOTMENT_TEMPLATE
                ? BONUS_SHARE_ALLOTMENT + " Entitlements"
                : "Transasction Request"}
        </ModalHeader>
        <ModalBody>
          <ViewTransactionEntitlements />
        </ModalBody>

      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Investor Request Edit
        </ModalHeader>
        <ModalBody>
          {/* <EditInvestorRequest setViewEditPage={setViewEditPage} /> */}
        </ModalBody>
      </Modal>
      <Breadcrumb title="Transaction Listing" parent="Transactions" />

      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Transaction Request View
        </ModalHeader>
        <ModalBody>
          <ViewTransactionRequest setViewFlag={setViewFlag} />
        </ModalBody>
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
                          getTransactionsByCompanyCode(selected.value)
                          getCompany(selected.value);
                          getShareHoldersByCompanyCode(selected.value);
                          getAnnouncementsByCompany(selected.value);
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
                {selectedCompany && selectedCompany !== "" && <div className="row mt-2">
                  {/* <div className="col-sm-12 col-lg-4 col-md-4">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">
                        Search Transaction
                      </label>
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
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-4 col-md-4">
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
                        // onChange={(selected) => {
                        //   selected &&
                        //     handleSearchChange("", "", selected?.value);
                        //   !selected && setUnderSearch("");
                        // }}
                        styles={darkStyle}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-4 col-md-4">
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
                          <option value="status">Status</option>
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

                        {criteria == "status" &&
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
                              // selected &&
                              //   handleSearchChange("", "", selected?.value);
                              // !selected && setUnderSearch("");

                              selected && setSearch(selected.value);
                              !selected && setSearch("");

                              !selected && getTransactionsByCompanyCode();
                            }}
                            styles={darkStyle}
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
                              !selected && getTransactionsByCompanyCode();

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
              {((transaction_listing_loading ||
                !transaction_listing_data ||
                shareholders_data_loading) && (selectedCompany && selectedCompany !== "")) && <Spinner />}
              {!transaction_listing_loading &&
                transaction_listing_data && transaction_listing_data.length != 0 &&
                !shareholders_data_loading && (
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
              {transaction_listing_data.length === 0 &&
                transaction_listing_loading === false && selectedCompany && selectedCompany !== "" && (
                  <p className="text-center">
                    <b>Transactions Data not available</b>
                  </p>
                )}
              {!selectedCompany || selectedCompany == "" && (
                <p className="text-center">
                  <b>Select Company to show transaction data</b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
