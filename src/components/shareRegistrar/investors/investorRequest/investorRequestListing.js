import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import { useSelector } from "react-redux";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { darkStyle, errorStyles } from "../../../defaultStyles";
import { filterData, SearchType } from "filter-data";
import { useHistory } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import {
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  Spinner,
} from "reactstrap";
import { getInvestorRequestByCompanyCodePaginatedService, getInvestors } from "store/services/investor.service";
import { getCompanies } from "store/services/company.service";
import { getShareholders, getShareHoldersByCompany } from "store/services/shareholder.service";
import { getCorporateAnnouncement, getCorporateAnnouncementByCompanyCode, getCorporateEntitlementByAnnouncement, getCorporateEntitlementByCompanyCodeService } from "store/services/corporate.service";
import { getCorporateEntitlement } from "store/services/corporate.service";
import AddInvestorRequest from "./investorRequests";
import {
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
} from "../../../../constant";
import {
  findArrayObjcetBy,
  getFoundObject,
  getvalidDateDMonthY,
  listCrud,
} from "../../../../utilities/utilityFunctions";
import { getTransactionTypes } from "store/services/transaction.service";
import { getInvestorRequest } from "store/services/investor.service";
import SplitShares from "../../share/splitShareCertificate/SplitShares";
import ConsolidateShares from "../../share/consolidateShares/consolidateShares";
import DuplicateShareCertificate from "../../share/duplicateSharesCertificate/duplicateShareCertificate";
import TransferOfShares from "../../share/transferOfShares/transferOfShares";
import PhysicalToElectronic from "../../share/physicalToElectronic/physicalToElectronic";
import ElectronicToPhysical from "../../share/electronicToPhysical/electronicToPhysical";
import AddIPOSubscription from "../../share/ipoSubscription/addIpoSubscription";
import RightSuscription from "../../share/rightSubscription/rightSubscription";
import TransferOfRightShares from "../../share/transferOfRightShares/transferOfRightShares";
import TransferDeedVerification from "../../share/transferDeedVerification/transferDeedVerification";

import ViewSplitShares from "../../share/splitShareCertificate/viewSplitShares";
import ViewConsolidateShares from "../../share/consolidateShares/viewConsolidateShares";
import ViewDuplicateShareCertificate from "../../share/duplicateSharesCertificate/viewDuplicateShareCertificate";
import ViewTransferOfShares from "../../share/transferOfShares/viewTransferOfShares";
import ViewPhysicalToElectronic from "../../share/physicalToElectronic/viewPhysicalToElectronic";
import ViewElectronicToPhysical from "../../share/electronicToPhysical/viewElectronicToPhyiscalShareCertificate";
import ViewRightSuscription from "../../share/rightSubscription/viewRightSubscription";
import ViewTransferOfRightShares from "../../share/transferOfRightShares/editTransferOfRightShares";
import ViewTransferDeedVerification from "../../share/transferDeedVerification/viewTransferDeedVerification";
import TransmissionOfShares from "../../share/transmissionOfShares/transmissionOfShares";
import ViewTransmissionOfShares from "../../share/transmissionOfShares/viewTransmissionOfShares";

// EDIT
import EditSplitShares from "../../share/splitShareCertificate/editSplitShares";
import EditConsolidateShares from "../../share/consolidateShares/editConsolidateShares";
import EditDuplicateShareCertificate from "../../share/duplicateSharesCertificate/editDuplicateShareCertificate";
import EditTransferOfShares from "../../share/transferOfShares/editTransferOfShares";
import EditPhysicalToElectronic from "../../share/physicalToElectronic/editPhysicalToElectronic";
import EditElectronicToPhysical from "../../share/electronicToPhysical/editElectronicToPhyiscalShareCertificate";
import EditRightSuscription from "../../share/rightSubscription/editRightSubscription";
import EditTransferOfRightShares from "../../share/transferOfRightShares/editTransferOfRightShares";
import EditTransferDeedVerification from "../../share/transferDeedVerification/editTransferDeedVerification";
import EditTransmissionOfShares from "../../share/transmissionOfShares/editTransmissionOfShares";
import ElectronicTransferOfShares from "components/shareRegistrar/share/electronicTransferOfShares/electronicTransferOfShares";
import EditElectronicTransferOfShares from "components/shareRegistrar/share/electronicTransferOfShares/editElectronicTransferOfShares";
import ElectronicTransmissionOfShares from "components/shareRegistrar/share/electronicTransmissionOfShares/electronicTransmissionOfShares";
import ViewElectronicTransferOfShares from "components/shareRegistrar/share/electronicTransferOfShares/viewElectronicTransferOfShares";
import ViewElectronicTransmissionOfShares from "components/shareRegistrar/share/electronicTransmissionOfShares/viewElectronicTransmissionOfShares";
import AddIPOPayment from "components/shareRegistrar/share/ipoPayment/addIpoPayment";
import { setDashPattern } from "pdf-lib";
import { fill } from "lodash";
import { numberWithCommas } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";

export default function InvestorRequestListing() {
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
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const baseEmail = sessionStorage.getItem("email") || "";
  const [searchedInvestorsRequests, setSearchedInvestorsRequests] = useState(
    []
  );
  const [mappedInvestorRequests, setMappedInvestorRequests] = useState([]);
  const [showInvestorRequestForm, setShowInvestorRequestForm] = useState(false);
  const [search, setSearch] = useState("");
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [folioSearch, setFolioSearch] = useState(true);
  const [underSearch, setUnderSearch] = useState("");
  const [statuses, setStatus] = useState("");
  const [shareholderNameSearch, setShareholderNameSearch] = useState(false);
  const [requests_type, setRequests_type] = useState("");
  const [viewFlag, setViewFlag] = useState(false);
  const [investor_request, setInvestor_request] = useState("");
  const [symbol_options, setSymbol_options] = useState([]);
  const [selectInvestorRequest, setSelectInvestorType] = useState("");
  const [filter_data, set_filterData] = useState([]);
  const [isLoadingInvestor, setIsLoadingInvestor] = useState(false);
  const [investor_request_types_loading, setInvestor_request_types_loading] =
    useState(false);
  const [investor_request_data, setInvestor_request_data] = useState([]);
  const [investor_request_types, setInvestor_request_types] = useState([]);
  const [investors_dropdown, setInvestors_dropdown] = useState([]);
  const [investors_dropdown_loading, setInvestors_dropdown_loading] =
    useState(false);
  const [companies_data, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [inactive_shareholders_data, setInactive_shareholders_data] = useState(
    []
  );
  const [inactive_shareholders_dropdown, setInactive_shareholders_dropdown] =
    useState([]);
  const [
    inactive_shareholders_data_loading,
    setInactive_shareholders_data_loading,
  ] = useState(false);
  const [announcement_dropdown, setAnnouncement_dropdown] = useState([]);
  const [announcement_data_loading, setAnnouncement_data_loading] =
    useState(false);
  const [entitlement_dropdown, setEntitlement_dropdown] = useState([]);
  const [entitlement_data_loading, setEntitlement_data_loading] =
    useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyName, setCompanyName] = useState("");

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

    const [type, setType] = useState("");


  useEffect(() => {
    // const getAllInvestorsRequests = async () => {
    //   setIsLoadingInvestor(true);
    //   try {
    //     const response = await getInvestorRequest(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.data;
    //       setInvestor_request_data(parents);
    //       setIsLoadingInvestor(false);
    //     }
    //   } catch (error) {
    //     setIsLoadingInvestor(false);
    //   }
    // };
    const txn_type_setter = async () => {
      setInvestor_request_types_loading(true);
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
    const getAllInvestors = async () => {
      setInvestors_dropdown_loading(true);
      try {
        const response = await getInvestors(baseEmail);
        if (response.status === 200) {
          const investors_dropdowns = response.data.data.map((item) => {
            const shareholder_id = !!item.cnic ? item.cnic : item.ntn;
            return {
              label: `${item.investor_name} - ${shareholder_id}`,
              value: shareholder_id,
            };
          });
          setInvestors_dropdown_loading(false);
          setInvestors_dropdown(investors_dropdowns);
        }
      } catch (error) {
        setInvestors_dropdown_loading(false);
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
    //       const parents = response.data.data;
    //       const shareholders_dropdown = response.data.data.map((item) => {
    //         let label = `${item.folio_number} (${item.shareholder_name}) `;
    //         return { label: label, value: item.folio_number };
    //       });
    //       setInactive_shareholders_dropdown(shareholders_dropdown);
    //       setInactive_shareholders_data(parents);
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
    // const getAllCorporateEntitlements = async () => {
    //   setEntitlement_data_loading(true);
    //   try {
    //     const response = await getCorporateEntitlement(baseEmail);
    //     if (response.status === 200) {
    //       const entitlments_dropdowns = response.data.data.map((item) => {
    //         return { label: item.entitlement_id, value: item.entitlement_id };
    //       });
    //       setEntitlement_dropdown(entitlments_dropdowns);
    //       setEntitlement_data_loading(false);
    //     }
    //   } catch (error) {
    //     setEntitlement_data_loading(false);
    //   }
    // };
    // getAllInvestorsRequests();
    txn_type_setter();
    getAllInvestors();
    getAllCompanies();
    // getAllShareHolders();
    // getAllCorporateAnnouncement();
    // getAllCorporateEntitlements();
  }, []);

  useEffect(() => {
    setMappedInvestorRequests(
     investor_request_data && investor_request_data.length > 0 ? investor_request_data.map((request) => ({
        requester_name: inactive_shareholders_data.find(
          (holder) => holder.folio_number === request.folio_number
        )?.shareholder_name,
        ...request,
      })) : []
    );
  }, [investor_request_data]);
  // Investor Request Types

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
        setInactive_shareholders_data(parents);
      setInactive_shareholders_data_loading(false);

      }
    } catch (error) {
      setInactive_shareholders_data_loading(false);
      toast.error("Error fetching shareholders")
    }
  };

  const getInvestorsRequestsByCompanyCode = async () => {
      setIsLoadingInvestor(true);
      try {
        const response = await getInvestorRequestByCompanyCodePaginatedService(baseEmail, selectedCompany, "", search ? search : "", criteria ? criteria : "" ,type ? type : "");
        if (response.status === 200) {
          setHasNextPage(response.data.data.hasNextPage);
          setHasPrevPage(response.data.data.hasPrevPage);
          setNextPage(response.data.data.nextPage);
          setPrevPage(response.data.data.prevPage);
          setCurrentPage(response.data.data.page);
          setTotalPages(response.data.data.totalPages);
          setTotalRecords(response.data.data.totalDocs);
          const parents = response.data.data.docs ? response.data.data.docs : [];
          setInvestor_request_data(parents);
          setIsLoadingInvestor(false);
        }
      } catch (error) {
        setIsLoadingInvestor(false);
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

    const getEntitlementsForSelectedCompany = async () => {
      setEntitlement_data_loading(true);
      try {
        const response = await getCorporateEntitlementByCompanyCodeService(
          baseEmail,
          selectedCompany
        );
        if (response.status === 200) {
          const entitlments_dropdowns = response.data.data.map((item) => {
                    return { label: item.entitlement_id, value: item.entitlement_id };
                  });
                  setEntitlement_dropdown(entitlments_dropdowns);
                  setEntitlement_data_loading(false);
        }
      } catch (error) {
        setEntitlement_data_loading(false);
      }
    };
  

  useEffect(() => {
    if(selectedCompany !=="") {
      getShareHoldersByCompanyCode()
      getInvestorsRequestsByCompanyCode()
      getCorporateAnnouncementsForSelectedCompany()
      getEntitlementsForSelectedCompany()
    } else {
      setInactive_shareholders_dropdown([]);
      setInactive_shareholders_data([]);
      setInvestor_request_data([]);
      setAnnouncement_dropdown([]);
      setEntitlement_dropdown([])
      
    }
  }, [selectedCompany])

  useEffect(() => {
    if (criteria == "") {
      // getShareHoldersByCompanyCode()
      getInvestorsRequestsByCompanyCode()
      // getCorporateAnnouncementsForSelectedCompany()
    }
  }, [criteria]);

  useEffect(() => {
      // getShareHoldersByCompanyCode()
      getInvestorsRequestsByCompanyCode()
      // getCorporateAnnouncementsForSelectedCompany()
  }, [type]);

  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);
  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const InvestorsRequestsPerPage = 10;
  const pagesVisited = pageNumber * InvestorsRequestsPerPage;
  const totalnumberofPages = 100;
  const displayInvestorsRequestsPerPage =
    // searchedInvestorsRequests.length === 0
    //   ? filter_data
    //       .sort((a, b) => {
    //         if (
    //           new Date(b.created_at.replaceAll("/", "-")).getTime() <
    //           new Date(a.created_at.replaceAll("/", "-")).getTime()
    //         )
    //           return -1;
    //         if (
    //           new Date(b.created_at.replaceAll("/", "-")).getTime() >
    //           new Date(a.created_at.replaceAll("/", "-")).getTime()
    //         )
    //           return 1;
    //         return 0;
    //       })
    //       .map((request, i) => ({ ...request, s_no: i + 1 }))
    //       .slice(pagesVisited, pagesVisited + InvestorsRequestsPerPage)
    //       .map((item, i) => (
    //         <tr key={i}>
    //           <td>{item.s_no}</td>
    //           <td>
    //             {
    //               inactive_shareholders_dropdown.find(
    //                 (holder) => holder.value === item.folio_number
    //               )?.label
    //             }
    //           </td>
    //           <td>
    //             {
    //               findArrayObjcetBy(companies_data, "code", item.company_code)
    //                 ?.company_name
    //             }
    //           </td>
    //           <td>
    //             {
    //               findArrayObjcetBy(
    //                 investor_request_types,
    //                 "value",
    //                 item.request_type
    //               )?.label
    //             }
    //           </td>
    //           <td>
    //             {getvalidDateDMonthY(item?.request_date || item?.created_at)}
    //           </td>
    //           <td className="text-right">{numberWithCommas(item.quantity)}</td>
    //           <td>{item.status}</td>
    //           {(crudFeatures[1] || crudFeatures[2]) &&
    //           !companies_data_loading &&
    //           !inactive_shareholders_data_loading &&
    //           (!!item?.announcement_id ? !announcement_data_loading : true) &&
    //           (!!item?.entitlement_id ? !entitlement_data_loading : true) ? (
    //             <td>
    //               {crudFeatures[1] && (
    //                 <>
    //                   <i
    //                     className="fa fa-eye"
    //                     style={{
    //                       width: 35,
    //                       fontSize: 16,
    //                       padding: 11,
    //                       color: "rgb(68, 102, 242)",
    //                       cursor: "pointer",
    //                     }}
    //                     id="investorRequestView"
    //                     onClick={() => {
    //                       const obj = JSON.parse(JSON.stringify(item));

    //                       obj.folio_number = getFoundObject(
    //                         inactive_shareholders_dropdown,
    //                         obj.folio_number
    //                       );
    //                       obj.to_folio_number = getFoundObject(
    //                         inactive_shareholders_dropdown,
    //                         obj.to_folio_number
    //                       );
    //                       obj.announcement_id = getFoundObject(
    //                         announcement_dropdown,
    //                         obj.announcement_id
    //                       );
    //                       obj.entitlement_id = getFoundObject(
    //                         entitlement_dropdown,
    //                         obj.entitlement_id
    //                       );
    //                       obj.company_code = getFoundObject(
    //                         companies_dropdown,
    //                         obj.company_code
    //                       );
    //                       // for modal
    //                       // setViewFlag(true);
    //                       renderModal(item.request_type);
    //                       sessionStorage.setItem(
    //                         "selectedInvestorRequest",
    //                         JSON.stringify(obj)
    //                       );
    //                     }}
    //                   ></i>
    //                   <UncontrolledTooltip
    //                     placement="top"
    //                     target="investorRequestView"
    //                   >
    //                     {"View Investor's Request Detail"}
    //                   </UncontrolledTooltip>
    //                 </>
    //               )}
    //               {crudFeatures[2] && item?.txn_generated === "false" && (
    //                 <>
    //                   <i
    //                     className="fa fa-send-o"
    //                     style={{
    //                       width: 35,
    //                       fontSize: 16,
    //                       padding: 11,
    //                       color: "#FF9F40",
    //                       cursor: "pointer",
    //                     }}
    //                     id="investorRequestEdit"
    //                     onClick={() => {
    //                       const obj = JSON.parse(JSON.stringify(item));

    //                       obj.announcement_id = getFoundObject(
    //                         announcement_dropdown,
    //                         obj.announcement_id
    //                       );
    //                       obj.entitlement_id = getFoundObject(
    //                         entitlement_dropdown,
    //                         obj.entitlement_id
    //                       );

    //                       obj.folio_number = getFoundObject(
    //                         inactive_shareholders_dropdown,
    //                         obj.folio_number
    //                       );
    //                       obj.symbol = getFoundObject(
    //                         symbol_options,
    //                         obj.symbol
    //                       );
    //                       obj.request_type = getFoundObject(
    //                         investor_request_types,
    //                         obj.request_type
    //                       );
    //                       obj.to_investor_id = getFoundObject(
    //                         investors_dropdown,
    //                         obj.to_investor_id
    //                       );
    //                       obj.to_folio_number = getFoundObject(
    //                         inactive_shareholders_dropdown,
    //                         obj.to_folio_number
    //                       );
    //                       obj.company_code = getFoundObject(
    //                         companies_dropdown,
    //                         obj.company_code
    //                       );
    //                       // for modal
    //                       renderModal(`Edit ${item.request_type}`);
    //                       sessionStorage.setItem(
    //                         "selectedInvestorRequest",
    //                         JSON.stringify(obj)
    //                       );
    //                     }}
    //                   ></i>
    //                   <UncontrolledTooltip
    //                     placement="top"
    //                     target="investorRequestEdit"
    //                   >
    //                     {"Edit Investor's Request Detail"}
    //                   </UncontrolledTooltip>
    //                 </>
    //               )}
    //             </td>
    //           ) : (
    //             <td className="d-flex justify-content-center text-primary">
    //               <div className="fa fa-spinner fa-spin "></div>
    //             </td>
    //           )}
    //         </tr>
    //       ))
    //   : searchedInvestorsRequests
    //       .sort((a, b) => {
    //         if (
    //           new Date(b.created_at.replaceAll("/", "-")).getTime() <
    //           new Date(a.created_at.replaceAll("/", "-")).getTime()
    //         )
    //           return -1;
    //         if (
    //           new Date(b.created_at.replaceAll("/", "-")).getTime() >
    //           new Date(a.created_at.replaceAll("/", "-")).getTime()
    //         )
    //           return 1;
    //         return 0;
    //       })
    //       .map((request, i) => ({ ...request, s_no: i + 1 }))
    //       .slice(pagesVisited, pagesVisited + InvestorsRequestsPerPage)
    //       .map((item, i) => (
         investor_request_data && investor_request_data?.length > 0 ?  investor_request_data.map((item, i) => (
            <tr key={i}>
              {/* <td>{item.s_no}</td> */}
              <td>
                {
                  inactive_shareholders_dropdown.find(
                    (holder) => holder.value === item.folio_number
                  )?.label
                }
              </td>
              <td>
                {
                  findArrayObjcetBy(companies_data, "code", item.company_code)
                    ?.company_name
                }
              </td>
              <td>
                {
                  findArrayObjcetBy(
                    investor_request_types,
                    "value",
                    item.request_type
                  )?.label
                }
              </td>
              <td>
                {getvalidDateDMonthY(item?.request_date || item?.created_at)}
              </td>
              <td className="text-right">{numberWithCommas(item.quantity)}</td>
              <td>{item.status}</td>


              {(crudFeatures[1] || crudFeatures[2]) &&
                !companies_data_loading &&
                !inactive_shareholders_data_loading &&
                (item?.announcement_id ? !announcement_data_loading : true) &&
                (item?.entitlement_id ? !entitlement_data_loading : true) && (
                  <td>
                    {crudFeatures[1] && (
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
                              inactive_shareholders_dropdown,
                              obj.folio_number
                            );

                            obj.to_folio_number = getFoundObject(
                              inactive_shareholders_dropdown,
                              obj.to_folio_number
                            );
                            obj.announcement_id = getFoundObject(
                              announcement_dropdown,
                              obj.announcement_id
                            );
                            obj.entitlement_id = getFoundObject(
                              entitlement_dropdown,
                              obj.entitlement_id
                            );
                            obj.company_code = getFoundObject(
                              companies_dropdown,
                              obj.company_code
                            );
                            // for modal
                            // setViewFlag(true);
                            renderModal(item.request_type);

                            sessionStorage.setItem(
                              "selectedInvestorRequest",
                              JSON.stringify(obj)
                            );
                          }}
                        ></i>
                        <UncontrolledTooltip
                          placement="top"
                          target="investorRequestView"
                        >
                          {"View Investor's Request Detail"}
                        </UncontrolledTooltip>
                      </>
                    )}
                    {crudFeatures[2] && item?.txn_generated === "false" && (
                      <>
                        <i
                          className="fa fa-send-o"
                          style={{
                            width: 35,
                            fontSize: 16,
                            padding: 11,
                            color: "#FF9F40",
                            cursor: "pointer",
                          }}
                          id="investorRequestEdit"
                          onClick={() => {
                            const obj = JSON.parse(JSON.stringify(item));

                            obj.announcement_id = getFoundObject(
                              announcement_dropdown,
                              obj.announcement_id
                            );
                            obj.entitlement_id = getFoundObject(
                              entitlement_dropdown,
                              obj.entitlement_id
                            );
                            obj.folio_number = getFoundObject(
                              inactive_shareholders_dropdown,
                              obj.folio_number
                            );
                            obj.symbol = getFoundObject(
                              symbol_options,
                              obj.symbol
                            );
                            obj.request_type = getFoundObject(
                              investor_request_types,
                              obj.request_type
                            );
                            obj.to_investor_id = getFoundObject(
                              investors_dropdown,
                              obj.to_investor_id
                            );
                            obj.to_folio_number = getFoundObject(
                              inactive_shareholders_dropdown,
                              obj.to_folio_number
                            );
                            obj.company_code = getFoundObject(
                              companies_dropdown,
                              obj.company_code
                            );
                            // for modal
                            renderModal(`Edit ${item.request_type}`);
                            sessionStorage.setItem(
                              "selectedInvestorRequest",
                              JSON.stringify(obj)
                            );
                          }}
                        ></i>
                        <UncontrolledTooltip
                          placement="top"
                          target="investorRequestEdit"
                        >
                          {"Edit Investor's Request Detail"}
                        </UncontrolledTooltip>
                      </>
                    )}
                  </td>
                )}
            </tr>
          )) : "";
  const pageCount =
    searchedInvestorsRequests.length === 0
      ? Math.ceil(filter_data.length / InvestorsRequestsPerPage)
      : Math.ceil(searchedInvestorsRequests.length / InvestorsRequestsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
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
      case ELECTRONIC_TRANSFER_OF_SHARES:
        setInvestor_request(ELECTRONIC_TRANSFER_OF_SHARES);
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
      case ELECTRONIC_TRANSMISSION_OF_SHARES:
        setInvestor_request(ELECTRONIC_TRANSMISSION_OF_SHARES);
        setShowInvestorRequestForm(true);
        break;
      case INITIAL_PUBLIC_OFFERING_SUBSCRIPTION:
        setInvestor_request(INITIAL_PUBLIC_OFFERING_SUBSCRIPTION);
        setShowInvestorRequestForm(true);
        break;
      case INITIAL_PUBLIC_OFFERING_PAYMENT:
        setInvestor_request(INITIAL_PUBLIC_OFFERING_PAYMENT);
        setShowInvestorRequestForm(true);
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
  // useEffect(() => {
  //   if (requests_type || statuses || shareholderNameSearch || folioSearch) {
  //     const searchConditions = [
  //       { key: "request_type", value: requests_type, type: SearchType.EQ },
  //       { key: "status", value: statuses, type: SearchType.EQ },
  //       {
  //         key: ["requester_name", "folio_number"],
  //         value: search,
  //         type: SearchType.LK,
  //       },
  //     ];
  //     const result = filterData(mappedInvestorRequests, searchConditions);
  //     setSearchedInvestorsRequests(result);
  //   } else if (!requests_type && !statuses) {
  //     setUnderSearch("");
  //   }
  // }, [search, requests_type, statuses]);

  // useEffect(() => {
  //   if (search) {
  //     const searchConditions = [
  //       {
  //         key: ["folio_number", "status"],
  //         value: search,
  //         type: SearchType.LK,
  //       },
  //     ];
  //     const result = filterData(filter_data, searchConditions);
  //     setSearchedInvestorsRequests(result);
  //   }
  // }, [search]);
  const onButtonClickIPO = () => {
    // const a = mappedInvestorRequests.filter((i) => {
    //   return i.request_type === "";
    // });
    setType("IPO")
    setSelectInvestorType("IPO");
    // set_filterData(a);
  };
  const onButtonClickCertificate = () => {
    // const a = mappedInvestorRequests.filter((i) => {
    //   return (
    //     i.request_type === "SPL" ||
    //     i.request_type === "DUP" ||
    //     i.request_type === "CON" ||
    //     i.request_type === "CEL"
    //   );
    // });
    setType("SPL,DUP,CON,CEL");
    setSelectInvestorType("Physical Share Certificates");
    // set_filterData(a);
  };
  const onButtonClickDigital = () => {
    // const a = mappedInvestorRequests.filter((i) => {
    //   return (
    //     i.request_type === "VTD" ||
    //     i.request_type === "TOS" ||
    //     i.request_type === "CPH" ||
    //     i.request_type === "TRS" ||
    //     i.request_type === "ETOS" ||
    //     i.request_type === "ETRS"
    //   );
    // });
    setType("VTD,TOS,CPH,TRS,ETOS,ETRS")
    setSelectInvestorType("Digital Shares");
    // set_filterData(a);
  };
  const onButtonClickRight = () => {
    // const a = mappedInvestorRequests.filter((i) => {
    //   return i.request_type === "RSUB" || i.request_type === "TOR";
    // });
    setType("RSUB,TOR")
    setSelectInvestorType("Right Shares");
    // set_filterData(a);
  };

  const handleNextPage = async () => {
    setIsLoadingInvestor(true);
    try {
      //for paginated companies
      const response = await getInvestorRequestByCompanyCodePaginatedService(
        baseEmail,
        selectedCompany,
        nextPage,
        search ? search : "",
        criteria ? criteria : "",
        type ? type : ""
      );
      // console.log("Paginated Response => ", response.data.data);
      if (response.status === 200) {
        // console.log("Paginated Companies? => ", response)
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
        setInvestor_request_data(parents)
        setIsLoadingInvestor(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoadingInvestor(false);
    }
  };

  const handlePrevPage = async () => {
    setIsLoadingInvestor(true);
    try {
      //for paginated companies
      const response = await getInvestorRequestByCompanyCodePaginatedService(
        baseEmail,
        selectedCompany,
        prevPage,
        search ? search : "",
        criteria ? criteria : "",
        type ? type : ""
      );
      // console.log("Paginated Response => ", response.data.data);
      if (response.status === 200) {
        // console.log("Paginated Companies? => ", response)
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
        setInvestor_request_data(parents);
        setIsLoadingInvestor(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoadingInvestor(false);
    }
  };


  const handleSearch = async (e) => {
    console.log('handle',e)
    e.preventDefault();
    if (criteria == "" || !criteria) {
      return toast.error("Please select search criteria!");
    }
    if (!search || search == "") {
      return toast.error("Enter value for searching");
    }
    let response;
    setInvestor_request_types_loading(false);

    if (criteria !== "" && criteria) {
      response = await getInvestorRequestByCompanyCodePaginatedService(
        baseEmail,
        selectedCompany,
        "1",
        search,
        criteria,
        type ? type : "",
      );

      console.log("Search REsponse => ", response)
      if (response.status === 200) {
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);

        const parents = response.data.data.docs ? response.data.data.docs : [];
        setInvestor_request_data(parents)
        setInvestor_request_types_loading(false);

      } else {
        return toast.error(response.data.message);
      }
    }
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Investors Request Listing</h6>
        <Breadcrumb title="Investor Request Listing" parent="Investors" />
      </div>
      {/* Investor Request Form*/}
      <Modal
        isOpen={showInvestorRequestForm}
        show={showInvestorRequestForm.toString()}
        size="xl"
      >
        <ModalHeader
          toggle={() => {
            setShowInvestorRequestForm(false);
          }}
        >
          {investor_request}
        </ModalHeader>
        <ModalBody>
          {investor_request === SPLIT_SHARES ? (
            <SplitShares setInvestorRequestForm={setShowInvestorRequestForm} selectedCompany={selectedCompany} companyName={companyName} />
          ) : investor_request === CONSOLIDATE_SHARES ? (
            <ConsolidateShares
              setInvestorRequestForm={setShowInvestorRequestForm} selectedCompany={selectedCompany} companyName={companyName}
            />
          ) : investor_request === DUPLICATE_SHARES ? (
            <DuplicateShareCertificate
              setInvestorRequestForm={setShowInvestorRequestForm}
              selectedCompany={selectedCompany}
              companyName={companyName}
            />
          ) : investor_request === TRANSFER_OF_SHARES ? (
            //in progress
            <TransferOfShares
              setInvestorRequestForm={setShowInvestorRequestForm}
              selectedCompany={selectedCompany}
              companyName={companyName}
            />
          ) : investor_request === PHYSICAL_TO_ELECTRONIC ? (
            <PhysicalToElectronic
              setInvestorRequestForm={setShowInvestorRequestForm}
              selectedCompany={selectedCompany}
              companyName={companyName}
            />
          ) : investor_request === ELECTRONIC_TO_PHYSICAL ? (
            <ElectronicToPhysical
              setInvestorRequestForm={setShowInvestorRequestForm}
              selectedCompany={selectedCompany}
              companyName={companyName}
            />
          ) : investor_request === RIGHT_SUBSCRIBTION ? (
            <RightSuscription
              setInvestorRequestForm={setShowInvestorRequestForm}
              selectedCompany={selectedCompany}
              companyName={companyName}
            />
          ) : investor_request === TRANSFER_RIGHT_SHARES ? (
            <TransferOfRightShares
              setInvestorRequestForm={setShowInvestorRequestForm}
              selectedCompany={selectedCompany}
               companyName={companyName}
            />
          ) : investor_request === VERIFICATION_TRANSFER_DEED ? (
            <TransferDeedVerification
              setInvestorRequestForm={setShowInvestorRequestForm}
              selectedCompany={selectedCompany}
               companyName={companyName}
            />
          ) : investor_request === TRANSMISSION_OF_SHARES ? (
            <TransmissionOfShares
              setInvestorRequestForm={setShowInvestorRequestForm}
              selectedCompany={selectedCompany}
              companyName={companyName}
            />
          ) : investor_request === ELECTRONIC_TRANSFER_OF_SHARES ? (
            <ElectronicTransferOfShares
              setInvestorRequestForm={setShowInvestorRequestForm}
              selectedCompany={selectedCompany}
              companyName={companyName}
            />
          ) : investor_request === ELECTRONIC_TRANSMISSION_OF_SHARES ? (
            <ElectronicTransmissionOfShares
              setInvestorRequestForm={setShowInvestorRequestForm}
               selectedCompany={selectedCompany}
              companyName={companyName}
            />
          ) : investor_request === INITIAL_PUBLIC_OFFERING_SUBSCRIPTION ? (
            <AddIPOSubscription
              setInvestorRequestForm={setShowInvestorRequestForm}
            />
          ) : (
            <AddIPOPayment
              setInvestorRequestForm={setShowInvestorRequestForm}
            />
          )}
        </ModalBody>
      </Modal>
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
          <AddInvestorRequest setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          {investor_request}
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
      {/* View Modal */}
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
          ) : investor_request === TRANSMISSION_OF_SHARES ? (
            <ViewTransmissionOfShares />
          ) : investor_request === ELECTRONIC_TRANSFER_OF_SHARES ? (
            <ViewElectronicTransferOfShares />
          ) : (
            <ViewElectronicTransmissionOfShares />
          )}
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  {/* <h5>Investors Request Listing</h5> */}

                  <div className="col-sm-4">
                    <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <Select
                      options={companies_dropdown}
                      isLoading={companies_data_loading}
                      style={!selectedCompany && errorStyles}
                      isClearable={true}
                      onChange={(selected) => {
                        selected && setSelectedCompany(selected.value);
                        selected&& setCompanyName(selected?.label.split(" - ")[1])
                        !selected && setSelectedCompany("");
                        !selected&& setCompanyName("")
                      }}
                      styles={darkStyle}
                    />
                    {!selectedCompany && (
                      <small>
                        Select Company to show investor requests
                      </small>
                    )}
                    </div>
                  </div>
                  {/* <div className="col-sm-4 mt-4">
                    <div className="form-group">
                      <input
                        id="searchTransaction"
                        className="form-control"
                        type="text"
                        placeholder={"Search Investor Request"}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div> */}
                  

                  {selectedCompany && selectedCompany !== "" && <div
                    btn-group
                    btn-group-sm
                    flex-wrap
                    d-flex
                    justify-content-center
                    py-1
                  >
                    <Dropdown>
                      <Dropdown.Toggle>
                        {!selectInvestorRequest || selectInvestorRequest === ""
                          ? "Select Investor Request Type"
                          : selectInvestorRequest}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          value="Digital Shares"
                          onClick={(e) => onButtonClickDigital()}
                        >
                          Digital Shares
                        </Dropdown.Item>
                        <Dropdown.Item
                          value="Physical Share Certificates"
                          onClick={(e) => onButtonClickCertificate()}
                        >
                          Physical Share Certificates
                        </Dropdown.Item>
                        <Dropdown.Item
                          value="Right Shares"
                          onClick={(e) => onButtonClickRight()}
                        >
                          Right Shares
                        </Dropdown.Item>
                        <Dropdown.Item
                          value="IPO"
                          onClick={(e) => onButtonClickIPO()}
                        >
                          IPO
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>}
                </div>

              {selectedCompany && selectedCompany !== "" &&  
              <div className="d-flex justify-content-between">
                  {/* <h5>Company Listing</h5> */}
                  <form
                    className="d-flex justify-content-start col-sm-12"
                    onSubmit={(e) => handleSearch(e)}
                  >
                    <div className="col-sm-2">
                      <div className="form-group">
                        {/* <label htmlFor="company_type">Search Criteria</label> */}
                        <select
                          name="search_criteria"
                          className={`form-control`}
                          onChange={(e) => {
                            setSearch('')
                            setCriteria(e.target.value);
                          }}
                        >
                          <option value="">Select Criteria</option>
                          {/* <option value="id">ID</option> */}
                          {/* <option value="type">Type</option> */}
                          <option value="status">Status</option>
                          <option value="folio">Folio No.</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-5">
                      <div className="form-group">
                          <input
                          id="searchTransaction"
                          className="form-control"
                          type="text"
                          // placeholder={"Search Company"}
                          placeholder={
                            criteria == "" || !criteria
                              ? `Select Criteria`
                              // : criteria == "id"
                              // ? `Search by Request Id`
                              : criteria == "status"
                              ? `Search by Status`
                              : `Search by Folio Number`
                          }
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value)
                          }}
                          // onKeyPress={handleKeypress}
                          disabled={!criteria}
                        /> 
                      </div>
                    </div>

                    <div className="col-sm-2">
                      <div className="form-group">
                        <button
                          className="btn btn-secondary btn-sm my-1"
                          disabled={!criteria}
                        >
                          <span>Search</span>
                        </button>
                      </div>
                    </div>
                  </form>
                  </div>}
                
                {crudFeatures[0] && selectedCompany && selectedCompany != "" && (
                  <div className="row my-4">
                    <div className="col-sm-12 col-md-12 ">
                      {/* <label className="d-flex justify-content-center align-content-center">
                        <b>{"Select Investor Request Type"}</b>
                      </label> */}
                      <div
                        className="btn-group btn-group-sm flex-wrap d-flex justify-content-center py-1"
                        role="group"
                        aria-label="Basic example"
                      >
                        {selectInvestorRequest === "Digital Shares" ? (
                          <>
                            <button
                              className="btn btn-info mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {ELECTRONIC_TRANSFER_OF_SHARES}
                            </button>

                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {ELECTRONIC_TO_PHYSICAL}
                            </button>

                            <button
                              className="btn btn-info mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {ELECTRONIC_TRANSMISSION_OF_SHARES}
                            </button>
                          </>
                        ) : (
                          ""
                        )}
                        {selectInvestorRequest ===
                        "Physical Share Certificates" ? (
                          <>
                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {VERIFICATION_TRANSFER_DEED}
                            </button>

                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {TRANSFER_OF_SHARES}
                            </button>

                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {TRANSMISSION_OF_SHARES}
                            </button>

                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {SPLIT_SHARES}
                            </button>
                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {DUPLICATE_SHARES}
                            </button>

                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {CONSOLIDATE_SHARES}
                            </button>
                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {PHYSICAL_TO_ELECTRONIC}
                            </button>
                          </>
                        ) : (
                          ""
                        )}
                        {selectInvestorRequest === "Right Shares" ? (
                          <>
                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {RIGHT_SUBSCRIBTION}
                            </button>
                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {TRANSFER_RIGHT_SHARES}
                            </button>
                          </>
                        ) : (
                          ""
                        )}

                        {selectInvestorRequest === "IPO" ? (
                          <>
                            <button
                              className="btn btn-primary mt-1"
                              type="button"
                              onClick={(e) => renderModal(e.target.innerText)}
                            >
                              {INITIAL_PUBLIC_OFFERING_SUBSCRIPTION}
                            </button>
                          </>
                        ) : (
                          ""
                        )}
                        {/* <button
                          className="btn btn-info mt-1"
                          type="button"
                          onClick={(e) => renderModal(e.target.innerText)}
                        >
                          {INITIAL_PUBLIC_OFFERING_SUBSCRIPTION}
                        </button> */}
                        {/* <button
                          className="btn btn-info mt-1"
                          type="button"
                          onClick={(e) => renderModal(e.target.innerText)}
                        >
                          {INITIAL_PUBLIC_OFFERING_PAYMENT}
                        </button> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="row mx-1 my-3">
                <div className="col-lg-3 col-sm-12">
                  <div className="form-group">
                    <input
                      id="searchRequestListing"
                      className="form-control"
                      type="text"
                      data-testid="search-company"
                      placeholder={`Enter ${
                        folioSearch
                          ? "Folio Number"
                          : shareholderNameSearch
                          ? "Shareholder Name"
                          : ""
                      }`}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <span className="checkbox checkbox-success ">
                    <input
                      id="folio_number"
                      type="checkbox"
                      checked={folioSearch}
                      onChange={(e) => {
                        setFolioSearch(true);
                        setShareholderNameSearch(false);
                      }}
                    />
                    <label htmlFor="folio_number">Folio Number</label>
                  </span>
                </div>
                <div className="col-md-2">
                  <span className="checkbox checkbox-info">
                    <input
                      id="shareholder_name"
                      type="checkbox"
                      checked={shareholderNameSearch}
                      onChange={(e) => {
                        setFolioSearch(false);
                        setShareholderNameSearch(true);
                      }}
                    />
                    <label htmlFor="shareholder_name">Shareholder Name</label>
                  </span>
                </div>
                <div className="col-sm-12 col-lg-2 col-md-4">
                  <label htmlFor="email">Request Type</label>
                  <Select
                    options={investor_request_types}
                    isLoading={investor_request_types.length === 0}
                    onChange={(selected) => {
                      !selected && setRequests_type("");
                      selected && setRequests_type(selected.value);
                    }}
                    styles={darkStyle}
                    isClearable={true}
                  />
                </div>
                <div className="col-sm-12 col-lg-2 col-md-4">
                  <label htmlFor="status">Select Status</label>
                  <Select
                    options={[
                      { label: "Inreview", value: "INREVIEW" },
                      { label: "Pending", value: "PENDING" },
                      { label: "Approved", value: "APPROVED" },
                      { label: "Disapproved", value: "DISAPPROVED" },
                      { label: "Rejected", value: "REJECTED" },
                    ]}
                    onChange={(selected) => {
                      !selected && setStatus("");
                      selected && setStatus(selected.value);
                    }}
                    styles={darkStyle}
                    isClearable={true}
                  />
                </div>
              </div> */}

                

              {(isLoadingInvestor ||
                investor_request_types_loading ||
                companies_data_loading) && (
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

              {!isLoadingInvestor &&
                !investors_dropdown_loading &&
                !companies_data_loading &&
                !investor_request_types_loading && investor_request_data.length !== 0 && (
                  <div className="table-responsive">
                    <table className="table  ">
                      <thead>
                        <tr>
                          {/* <th>S No.</th> */}
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
              {investor_request_data.length === 0 &&
                isLoadingInvestor === false && (
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
