import React, { Fragment, useState, useEffect } from "react";
import {
  getPaginatedShareholdersService,
  getShareHolderHistoryByCompanyandDate,
} from "../../../store/services/shareholder.service";
import ToggleButton from "react-toggle-button";
import { darkStyle } from "../../defaultStyles";
import Breadcrumb from "components/common/breadcrumb";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  findArrayObjcetBy,
  generateExcel,
  getvalidDateDMonthY,
  getvalidDateDMY,
  listCrud,
} from "../../../../src/utilities/utilityFunctions";
import { filterData, SearchType } from "filter-data";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import * as _ from "lodash";
import { getShareholders } from "store/services/shareholder.service";
import AddShareholder from "./addShareholders";
import EditShareholder from "./editShareholder";
import ViewShareholder from "./viewShareholder";
import UBOListing from "./uboListing";
import { getCompanies } from "../../../store/services/company.service";
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
import { getInvestors } from "store/services/investor.service";
import { numberWithCommas } from "../../../../src/utilities/utilityFunctions";

export default function ShareholderListing() {
  const baseEmail = sessionStorage.getItem("email") || "";
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true]);
  const [search, setSearch] = useState("");
  const [underSearch, setUnderSearch] = useState("");
  const [shareholders, setShareholders] = useState([]);
  const [active, setActive] = useState(true);
  const [companyNameSearch, setCompanyNameSearch] = useState(false);
  const [folioNoSearch, setFolioNoSearch] = useState(false);
  const [createdAtSearch, setCreatedAtSearch] = useState(false);
  const [historyDate, setHistoryDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [shareholdingHistory, setShareholdingHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [shareho, setshareho] = useState();
  const [shareholderNameSearch, setShareholderNameSearch] = useState(true);
  const [serachedShareholders, setSerachedShareholders] = useState([]);
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [addEditUBOPage, setAddEditUBOPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [company_options, setCompany_options] = useState([]);
  const [investor_options, setInvestor_options] = useState([]);
  const [ntn_field, setNtn_field] = useState({});
  const [companies_data, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [investors_dropdown, setInvestors_dropdown] = useState([]);
  const [investors_dropdown_loading, setInvestors_dropdown_loading] =
    useState(false);
  const [shareholders_data, setShareholders_data] = useState([]);
  const [shareholders_data_loading, setShareholders_data_loading] =
    useState(false);
  // const [inactive_shareholders_data, setInactive_shareholders_data] = useState(
  //   []
  // );
  // const [
  //   inactive_shareholders_data_loading,
  //   setInactive_shareholders_data_loading,
  // ] = useState(false);

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
    if (search.length == 0 || !search || search == "") {
      getPaginatedShareholders();
    }
  }, [search]);

  useEffect(() => {
    if (criteria == "") {
      getPaginatedShareholders();
    }
  }, [criteria]);

  useEffect(() => {
    getActivePaginatedShareholders();
  }, [active]);

  const borderRadiusStyle = { borderRadius: 2 };
  let history = useHistory();
  // useEffect(() => {
  //   if (
  //     shareholders_data.length !== 0 ||
  //     inactive_shareholders_data.length !== 0
  //   ) {
  //     !active
  //       ? setShareholders(shareholders_data)
  //       : setShareholders(inactive_shareholders_data);
  //   }
  // }, [active, shareholders_data, inactive_shareholders_data]);
  // useEffect(async () => {
  //   document.title = "Share Holders";
  //   try {
  //     setCompany_options(await company_setter());
  //     setInvestor_options(await investor_setter());
  //   } catch (err) {
  //     toast.error(`${err.response.data.message}`);
  //   }
  // }, []);

  const getActivePaginatedShareholders = async () => {
    setShareholders_data_loading(true);
    try {
      //for paginated companies
      const response = await getPaginatedShareholdersService(
        baseEmail,
        "1",
        search ? search : "",
        criteria ? criteria : "",
        active
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
        setShareholders(parents);
        setShareholders_data_loading(false);
      }
    } catch (error) {
      setShareholders_data_loading(false);
    }
  };

  const getPaginatedShareholders = async () => {
    setShareholders_data_loading(true);
    try {
      //for paginated companies
      const response = await getPaginatedShareholdersService(
        baseEmail,
        "1",
        "",
        "",
        active
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
        setShareholders(parents);
        setShareholders_data_loading(false);
      }
    } catch (error) {
      setShareholders_data_loading(false);
    }
  };

  const handleNextPage = async () => {
    setShareholders_data_loading(true);
    try {
      //for paginated companies
      const response = await getPaginatedShareholdersService(
        baseEmail,
        nextPage,
        search ? search : "",
        criteria ? criteria : "",
        active
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
        setShareholders(parents);
        setShareholders_data_loading(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setShareholders_data_loading(false);
    }
  };

  const handlePrevPage = async () => {
    setShareholders_data_loading(true);
    try {
      //for paginated companies
      const response = await getPaginatedShareholdersService(
        baseEmail,
        prevPage,
        search ? search : "",
        criteria ? criteria : "",
        active
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
        setShareholders(parents);
        setShareholders_data_loading(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setShareholders_data_loading(false);
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
    setShareholders_data_loading(true);
    if (criteria !== "" && criteria) {
      response = await getPaginatedShareholdersService(
        baseEmail,
        "1",
        search,
        criteria,
        active
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
        setShareholders(parents);
        setShareholders_data_loading(false);
      } else {
        setShareholders_data_loading(false);
        return toast.error(response.data.message);
      }
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
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };
  // const getAllInvestors = async () => {
  //   setInvestors_dropdown_loading(true);
  //   try {
  //     const response = await getInvestors(baseEmail);
  //     if (response.status === 200) {
  //       const investors_dropdowns = response.data.data.map((item) => {
  //         const shareholder_id = !!item.cnic ? item.cnic : item.ntn;
  //         return {
  //           label: `${item.investor_name} - ${shareholder_id}`,
  //           value: shareholder_id,
  //         };
  //       });
  //       setInvestors_dropdown(investors_dropdowns);

  //       setInvestors_dropdown_loading(false);
  //     }
  //   } catch (error) {
  //     setInvestors_dropdown_loading(false);
  //   }
  // };
  // const getAllShareHolders = async () => {
  //   setShareholders_data_loading(true);
  //   // setInactive_shareholders_data_loading(true);
  //   try {
  //     const response = await getShareholders(baseEmail);
  //     if (response.status === 200) {
  //       const parents = response.data.data;
  //       setShareholders_data(parents);
  //       setInactive_shareholders_data(parents);
  //       setShareholders_data_loading(false);
  //       setInactive_shareholders_data_loading(false);
  //     }
  //   } catch (error) {
  //     setShareholders_data_loading(false);
  //     setInactive_shareholders_data_loading(false);
  //   }
  // };

  useEffect(() => {
    // getAllShareHolders();
    getPaginatedShareholders();
    // getAllInvestors();
    getAllCompanies();
  }, []);

  useEffect(() => {
    if (viewAddPage == false) {
      // getAllShareHolders();
      getPaginatedShareholders();
      // getAllInvestors();
      getAllCompanies();
    }
  }, [viewAddPage]);
  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  // const [pageNumber, setPageNumber] = useState(0);
  // const shareholderPerPage = 10;
  // const pagesVisited = pageNumber * shareholderPerPage;
  // const totalnumberofPages = 100;
  // const displayShareholdersPerPage =
  //   serachedShareholders.length === 0
  //     ? shareholders
  //         .sort((a, b) => {
  //           if (
  //             new Date(b.create_at).getTime() < new Date(a.create_at).getTime()
  //           )
  //             return -1;
  //           if (
  //             new Date(b.create_at).getTime() > new Date(a.create_at).getTime()
  //           )
  //             return 1;
  //           return 0;
  //         })
  //         .slice(pagesVisited, pagesVisited + shareholderPerPage)
  const displayShareholdersPerPage = shareholders.map((shareholder, i) => (
    <tr key={i}>
      <td>{shareholder.folio_number}</td>
      <td>{shareholder.shareholder_name}</td>
      <td>{shareholder?.cnic || shareholder?.ntn || shareholder?.shareholder_id || ''}</td>
      <td>
        {
          findArrayObjcetBy(companies_data, "code", shareholder.company_code)
            ?.company_name
        }
      </td>
      <td className="text-right">
        {numberWithCommas(shareholder.electronic_shares)}
      </td>
      <td className="text-right">
        {numberWithCommas(shareholder.physical_shares)}
      </td>
      <td>{shareholder.cdc_key}</td>
      {(crudFeatures[1] || crudFeatures[2] || crudFeatures[3]) && (
        <td>
          {crudFeatures[2] && (
            <>
              <i
                className="fa fa-user-plus"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "#2f840b",
                  cursor: "pointer",
                }}
                title={"Add/Edit UBO"}
                id={`addEditUBO-${shareholder.shareholder_id}`}
                onClick={() => {
                  const obj = JSON.parse(JSON.stringify(shareholder));
                  obj.company_type = companies_data.find(
                    (comp) => comp.code === shareholder.company_code
                  )?.company_type;
                  obj.company_code = getFoundObject(
                    companies_dropdown,
                    obj.company_code
                  );
                  // obj.shareholder_id = getFoundObject(
                  //   investors_dropdown,
                  //   obj.shareholder_id
                  // );
                  // for modal
                  setAddEditUBOPage(true);
                  setNtn_field(obj);
                  sessionStorage.setItem(
                    "selectedShareholder",
                    JSON.stringify(obj)
                  );
                }}
              ></i>
              {/* <UncontrolledTooltip
                        placement="top"
                        target={`addEditUBO-${shareholder.shareholder_id}`}
                      >
                        {"Add/Edit UBO"}
                      </UncontrolledTooltip> */}
            </>
          )}
          {crudFeatures[1] && (
            <>
              <i
                className="fa fa-eye"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "#4466F2",
                  cursor: "pointer",
                }}
                id="shareholderView"
                onClick={() => {
                  const obj = JSON.parse(JSON.stringify(shareholder));

                  obj.company_code = getFoundObject(
                    companies_dropdown,
                    obj.company_code
                  );

                  // obj.shareholder_id = getFoundObject(
                  //   investors_dropdown,
                  //   obj.shareholder_id
                  // );
                  // for modal
                  setViewFlag(true);
                  sessionStorage.setItem(
                    "selectedShareholder",
                    JSON.stringify(obj)
                  );
                }}
              ></i>
              <UncontrolledTooltip
                placement="top"
                target="shareholderView"
              >
                {"View Shareholder's Detail"}
              </UncontrolledTooltip>
            </>
          )}
          {crudFeatures[2] && (
            <>
              <i
                className="fa fa-pencil"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "#FF9F40",
                  cursor: "pointer",
                }}
                id="shareholderEdit"
                onClick={() => {
                  const obj = JSON.parse(JSON.stringify(shareholder));
                  obj.company_type = companies_data.find(
                    (comp) => comp.code === shareholder.company_code
                  )?.company_type;
                  obj.company_code = getFoundObject(
                    companies_dropdown,
                    obj.company_code
                  );
                  // obj.shareholder_id = getFoundObject(
                  //   investors_dropdown,
                  //   obj.shareholder_id
                  // );
                  // for modal
                  setViewEditPage(true);
                  sessionStorage.setItem(
                    "selectedShareholder",
                    JSON.stringify(obj)
                  );
                }}
              ></i>
              <UncontrolledTooltip
                        placement="top"
                        target="shareholderEdit"
                      >
                        {"Edit Shareholder's Detail"}
                      </UncontrolledTooltip>
            </>
          )}
          
        </td>
      )}
    </tr>
  ));

  // const pageCount = !underSearch
  //   ? Math.ceil(shareholders.length / shareholderPerPage)
  //   : serachedShareholders.length &&
  //     Math.ceil(serachedShareholders.length / shareholderPerPage);
  // const changePage = ({ selected }) => {
  //   setPageNumber(selected);
  // };
  // useEffect(() => {
  //   if (companyNameSearch) {
  //     const searchConditions = [
  //       { key: "company_code", value: companyNameSearch, type: SearchType.EQ },
  //     ];
  //     const result = filterData(
  //       shareholders,
  //       searchConditions
  //     );
  //     setSerachedShareholders(result);
  //   } else if (!companyNameSearch) {
  //     setUnderSearch("");
  //   }
  // }, [companyNameSearch]);
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  // useEffect(() => {
  //   if (search) {
  //     const searchConditions = [
  //       {
  //         key: ["company_code", "shareholder_name", "folio_number"],
  //         value: search,
  //         type: SearchType.LK,
  //       },
  //     ];
  //     const result = filterData(shareholders, searchConditions);
  //     setSerachedShareholders(result);
  //   }
  // }, [search]);

  // const handleSearchChange = (e) => {
  //   setSearch(e.target.value);
  //   setUnderSearch(e.target.value);
  //   if (e.target.value.length > 0 && shareholdingHistory.length === 0) {
  //     if (shareholders.length !== 0) {
  //       if (folioNoSearch) {
  //         setSerachedShareholders(
  //           shareholders.filter((holders) => {
  //             return holders.folio_number.match(generateRegex(e.target.value));
  //           })
  //         );
  //       }
  //       if (companyNameSearch) {
  //         setSerachedShareholders(
  //           shareholders.filter((comp) => {
  //             return companies_data
  //               .find((com) => comp.company_code === com.code)
  //               ?.company_name.match(generateRegex(e.target.value));
  //           })
  //         );
  //       }
  //       if (shareholderNameSearch) {
  //         setSerachedShareholders(
  //           shareholders.filter((holders) => {
  //             return holders.shareholder_name.match(
  //               generateRegex(e.target.value)
  //             );
  //           })
  //         );
  //       }
  //       if (createdAtSearch) {
  //         setSerachedShareholders(
  //           shareholders.filter(
  //             (holders) => holders.created_at === e.target.value
  //           )
  //         );
  //       }
  //     }
  //   }
  //   if (e.target.value.length > 0 && shareholdingHistory.length !== 0) {
  //     if (shareholdingHistory?.length !== 0) {
  //       if (folioNoSearch) {
  //         setSerachedShareholders(
  //           shareholdingHistory.filter((holders) => {
  //             return holders.folio_number.match(generateRegex(e.target.value));
  //           })
  //         );
  //       }
  //       if (companyNameSearch) {
  //         setSerachedShareholders(
  //           shareholdingHistory.filter((comp) => {
  //             return companies_data
  //               .find((com) => comp.company_code === com.code)
  //               ?.company_name.match(generateRegex(e.target.value));
  //           })
  //         );
  //       }
  //       if (shareholderNameSearch) {
  //         setSerachedShareholders(
  //           shareholdingHistory.filter((holders) => {
  //             return holders.shareholder_name.match(
  //               generateRegex(e.target.value)
  //             );
  //           })
  //         );
  //       }
  //       if (createdAtSearch) {
  //         setSerachedShareholders(
  //           shareholdingHistory.filter(
  //             (holders) => holders.created_at === e.target.value
  //           )
  //         );
  //       }
  //     }
  //   }
  // };
  // /*  ---------------------  */
  // //  const renderModal = (value) => {
  // //   switch (value) {
  // //     case NTN_TEMPLATE:
  // //       setNtn_field(NTN);
  // //       setAddEditUBOPage(true);
  // //       break;
  // //     default:
  // //       setNtn_field("View Transaction Request");
  // //       break;
  // //   }
  // // };
  // const handleHistorySearch = () => {
  //   const getShareholdingHistory = async () => {
  //     try {
  //       setHistoryLoading(true);
  //       const response = await getShareHolderHistoryByCompanyandDate(
  //         baseEmail,
  //         selectedCompany,
  //         historyDate
  //       );
  //       if (response.status === 200) {
  //         setShareholdingHistory(
  //           JSON.parse(response.data.data[0].shareholders)
  //         );
  //         setUnderSearch("searched");
  //         setHistoryLoading(false);
  //       }
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : console.log("Shareholding History Not Found");
  //       setUnderSearch("");
  //       setHistoryLoading(false);
  //     }
  //   };
  //   if (historyDate && selectedCompany) {
  //     getShareholdingHistory();
  //   }
  // };
  // const headings = [["Holding as on:", getvalidDateDMonthY(historyDate)]];
  // const columns =
  //   underSearch &&
  //   _.keys(
  //     _.assignIn(
  //       { folio_type: "PHYSICAL", total_percentage: "20" },
  //       _.omit(shareholdingHistory[shareholdingHistory.length - 1], [
  //         "doc_type",
  //         "gateway_code",
  //         "joint_holders",
  //         "cdc_key",
  //       ])
  //     )
  //   ).map((e) => e.toUpperCase().replaceAll("_", " "));

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Shareholders Listing</h6>
        <Breadcrumb title="Shareholdings Listing" parent="Shareholdings" />
      </div>

      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Shareholder
        </ModalHeader>
        <ModalBody>
          {companies_data_loading ? (
            <Spinner />
          ) : (
            <AddShareholder setViewAddPage={setViewAddPage} />
          )}
        </ModalBody>
      </Modal>
      {/*Add and Edit UBO Modal */}
      <Modal isOpen={addEditUBOPage} show={addEditUBOPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setAddEditUBOPage(false);
          }}
        >
          Add and Edit UBO
        </ModalHeader>
        <ModalBody>
          {companies_data_loading ? (
            <Spinner />
          ) : (
            <UBOListing setAddEditUBOPage={setAddEditUBOPage} />
          )}
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Shareholder Edit
        </ModalHeader>
        <ModalBody>
          {companies_data_loading ? (
            <Spinner />
          ) : (
            <EditShareholder setViewEditPage={setViewEditPage} />
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
          Shareholder View
        </ModalHeader>
        <ModalBody>
          <ViewShareholder />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header ">
                <div className="d-flex justify-content-between">
                  {/* <h5>Shareholders Listing</h5> */}
                  {/* <h5></h5> */}
                  <form
                    className="d-flex justify-content-start col-sm-10"
                    onSubmit={(e) => handleSearch(e)}
                  >
                    <div className="col-sm-2">
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
                          <option value="folio">Folio No.</option>
                          <option value="name">Name</option>
                          <option value="cnic">CNIC</option>
                          <option value="ntn">NTN</option>
                          <option value="company">Company</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-5">
                      {criteria !== "company" ? (
                        <div className="form-group">
                          <input
                            id="searchTransaction"
                            className="form-control"
                            type="text"
                            // placeholder={"Search Company"}
                            placeholder={
                              criteria == "" || !criteria
                                ? `Select Criteria`
                                : criteria == "ntn"
                                  ? `Search by NTN`
                                  : criteria == "name"
                                    ? `Search by Company Name`
                                    : `Search by Company Code`
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            disabled={!criteria}
                          />
                        </div>
                      ) : (
                        <div className="form-group">
                          {/* <label htmlFor="searchTransaction">
                            Select Company
                          </label> */}
                          <Select
                            options={companies_dropdown}
                            isLoading={companies_data_loading === true}
                            onChange={(selected) => {
                              // selected && handleSearchChange("");
                              !selected && setSearch("");
                              selected && setSearch(selected.value);
                            }}
                            isClearable={true}
                            styles={darkStyle}
                          />
                        </div>
                      )}
                    </div>

                    <div className="col-sm-2">
                      <div className="form-group">
                        <button
                          className="btn btn-secondary btn-sm my-1"
                          // onClick={() => {
                          //   handleSearch();
                          // }}
                          disabled={!criteria}
                        >
                          <span>{"Search"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Show inactive Shareholders </label>
                        <ToggleButton
                          value={active}
                          thumbStyle={borderRadiusStyle}
                          trackStyle={borderRadiusStyle}
                          onToggle={() => {
                            setActive(!active);
                          }}
                        />
                      </div>
                    </div>
                  </form>
                  <div>
                    {crudFeatures[0] && (
                      <div className="btn-group">
                        {/* <button
                        className="btn btn-success btn-sm"
                        disabled={
                          shareholdingHistory.length === 0 ||
                          !historyDate ||
                          !selectedCompany
                        }
                        onClick={(e) => {
                          generateExcel(
                            `Shareholding Report ${getvalidDateDMY(
                              new Date()
                            )}`,
                            "Shareholding Report",
                            "Report",
                            "Report",
                            "DCCL",
                            headings,
                            columns,
                            shareholdingHistory.map((data) => ({
                              folio_type:
                                data.cdc_key === "YES"
                                  ? "Electronic"
                                  : "Physical",
                              total_percentage:
                                (companies_data.find(
                                  (comp) => comp.code === selectedCompany
                                )?.outstanding_shares /
                                  (parseInt(data.electronic_shares) +
                                    parseInt(data.physical_shares))) *
                                100,
                              ..._.omit(data, [
                                "doc_type",
                                "gateway_code",
                                "joint_holders",
                                "cdc_key",
                              ]),
                            }))
                          );
                        }}
                      >
                        <i className="fa fa-file-excel-o mr-1"></i>Generate
                        Report
                      </button> */}
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            // for modal
                            setViewAddPage(true);
                          }}
                        >
                          <i className="fa fa-plus mr-1"></i> Add Shareholder
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-3">
                    <div className="form-group">
                      {/* <input
                        id="searchTransaction"
                        className="form-control"
                        type={`${createdAtSearch ? "date" : "text"}`}
                        placeholder={`Enter ${
                          folioNoSearch
                            ? "Folio Number"
                            : shareholderNameSearch
                            ? "Shareholder Name"
                            : ""
                        }`}
                        value={search}
                        // onChange={(e) => {
                        //   handleSearchChange(e);
                        // }}
                      /> */}
                      {/* <UncontrolledTooltip
                        placement="top"
                        target="searchTransaction"
                      >
                        Enter
                        {folioNoSearch
                          ? " Folio Number"
                          : shareholderNameSearch
                          ? " Shareholder Name"
                          : ""}
                      </UncontrolledTooltip> */}
                    </div>
                  </div>
                  <div className="col-md-2">
                    {/* <span className="checkbox checkbox-info">
                      <input
                        id="company_code"
                        type="checkbox"
                        checked={folioNoSearch}
                        onChange={(e) => {
                          setShareholderNameSearch(false);
                          setCreatedAtSearch(false);
                          setFolioNoSearch(true);
                        }}
                      />
                      <label htmlFor="company_code">Folio Number</label>
                    </span> */}
                  </div>
                  <div className="col-md-2">
                    {/* <span className="checkbox checkbox-info">
                      <input
                        id="created_at"
                        type="checkbox"
                        checked={createdAtSearch}
                        onChange={(e) => {
                          setShareholderNameSearch(false);
                          setCreatedAtSearch(true);
                          setFolioNoSearch(false);
                        }}
                      />
                      <label htmlFor="created_at">Date</label>
                    </span> */}
                  </div>
                  <div className="col-md-2">
                    {/* <span className="checkbox checkbox-info">
                      <input
                        id="parent_company"
                        type="checkbox"
                        checked={shareholderNameSearch}
                        onChange={(e) => {
                          setShareholderNameSearch(true);
                          setCreatedAtSearch(false);
                          setFolioNoSearch(false);
                        }}
                      />
                      <label htmlFor="parent_company">Shareholder Name</label>
                    </span> */}
                  </div>
                  {/* <div className="col-md-3">
                    <label htmlFor="email"></label>
                    <Select
                      options={companies_dropdown}
                      isLoading={companies_dropdown.length=== 0}
                      onChange={(selected) => {
                        !selected && setCompanyNameSearch("");
                        selected && setCompanyNameSearch(selected.value);
                      }}
                      styles={darkStyle}
                      isClearable={true}
                      />
                  </div> */}
                  <div className="col-md-2">
                    <div className="form-group">
                      {/* <label>Show only active Shareholders </label>
                      <ToggleButton
                        value={active}
                        thumbStyle={borderRadiusStyle}
                        trackStyle={borderRadiusStyle}
                        onToggle={() => {
                          setActive(!active);
                        }}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
              {(shareholders_data_loading ||
                companies_data_loading ||
                investors_dropdown_loading) && <Spinner />}
              {!shareholders_data_loading &&
                !companies_data_loading &&
                !investors_dropdown_loading && (
                  <div className="table-responsive">
                    <table className="table  ">
                      <thead>
                        <tr>
                          <th>Folio Number</th>
                          <th>Shareholder Name</th>
                          <th>Shareholder CNIC/NTN</th>
                          <th>Company</th>
                          <th className="text-right">Electronic Shares</th>
                          <th className="text-right">Physical Shares</th>
                          <th>CDC Key</th>
                          {(crudFeatures[1] || crudFeatures[2]) && (
                            <th>Action</th>
                          )}
                        </tr>
                      </thead>

                      <tbody>{displayShareholdersPerPage}</tbody>
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
              {shareholders_data_loading === false &&
                // inactive_shareholders_data_loading === false &&
                // investors_dropdown_loading === false &&
                companies_data_loading === false &&
                shareholders.length === 0 &&
                companies_dropdown.length === 0 && (
                  // investors_dropdown.length === 0 &&
                  <p className="text-center">
                    <b>Shareholders Data not available</b>
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
