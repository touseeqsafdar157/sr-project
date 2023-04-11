import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useSelector } from "react-redux";
import { listCrud } from "../../../../src/utilities/utilityFunctions";
import {
  getCompanies,
  getPaginatedCompaniesService,
} from "../../../store/services/company.service";
import { filterData, SearchType } from "filter-data";

import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import AddCompany from "./addCompany";
import EditCompany from "./editCompany";
import ViewCompany from "./viewCompany";
import {
  generateRegex,
  getFoundObject,
} from "../../../utilities/utilityFunctions";
import Select from "react-select";
import { company_setter } from "../../../store/services/dropdown.service";
import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";
import SectorsData from "../Sectors.json";

// import { useForm, Controller } from "react-hook-form";
// import { addAlertValidationSchema } from "store/validations/alertValidation";
// import { yupResolver } from "@hookform/resolvers/yup";
// import NumberFormat from "react-number-format";

export default function CompanyListing() {
  const baseEmail = sessionStorage.getItem("email") || "";
  // Selector STARTS
  // const companies = useSelector((data) => data.Companies);
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  // Selector ENDS
  const [companyCodeSearch, setCompanyCodeSearch] = useState(false);
  const [companyNameSearch, setCompanyNameSearch] = useState(true);
  const [parentCompanySearch, setParentCompanySearch] = useState(false);

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  // const [viewAlert, setViewAlert] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [searchedCompanies, setSearchedCompanies] = useState([]);
  const [company_options, setCompany_options] = useState([]);
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
  // const {
  //   register,
  //   watch,
  //   formState: { errors },
  //   handleSubmit,
  //   control,
  // } = useForm({ resolver: yupResolver(addAlertValidationSchema) });
  let history = useHistory();
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);
  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);

  // const getAllCompanies = async () => {
  //   setIsLoadingCompany(true);
  //   try{
  //   const response = await getCompanies(baseEmail)
  //   if (response.status===200) {
  //         const parents = response.data.data
  //         const companies_dropdowns = response.data.data.map((item) => {
  //           let label = `${item.code} - ${item.company_name}`;
  //           return { label: label, value: item.code };
  //         });
  //         const obj = {label: 'Not Applicable', value:'N/A'};
  //         companies_dropdowns.push(obj)
  //       setCompanies_dropdown(companies_dropdowns);
  //         setCompanies(parents)
  //         setIsLoadingCompany(false)
  //   } }catch(error) {
  //     setIsLoadingCompany(false);
  //   }
  //   };

  const getPaginatedCompanies = async () => {
    setIsLoadingCompany(true);
    try {
      //for paginated companies
      const response = await getPaginatedCompaniesService(
        baseEmail,
        "1",
        "",
        ""
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
        setCompanies(parents);
        setIsLoadingCompany(false);
      }
    } catch (error) {
      setIsLoadingCompany(false);
    }
  };

  useEffect(() => {
    getPaginatedCompanies();
  }, []);

  useEffect(() => {
    if (search.length == 0 || !search || search == "") {
      getPaginatedCompanies();
    }
  }, [search]);

  useEffect(() => {
    if (criteria == "") {
      getPaginatedCompanies();
    }
  }, [criteria]);

  useEffect(
    () => {
      if (viewAddPage == false || viewEditPage == false) {
        getPaginatedCompanies();
      }
    },
    [viewAddPage],
    [viewEditPage]
  );

  //new pagination
  const handleNextPage = async () => {
    setIsLoadingCompany(true);
    try {
      //for paginated companies
      const response = await getPaginatedCompaniesService(
        baseEmail,
        nextPage,
        search ? search : "",
        criteria ? criteria : ""
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
        setCompanies(parents);
        setIsLoadingCompany(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoadingCompany(false);
    }
  };

  const handlePrevPage = async () => {
    setIsLoadingCompany(true);
    try {
      //for paginated companies
      const response = await getPaginatedCompaniesService(
        baseEmail,
        prevPage,
        search ? search : "",
        criteria ? criteria : ""
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
        setCompanies(parents);
        setIsLoadingCompany(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoadingCompany(false);
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
    setIsLoadingCompany(true);
    if (criteria !== "" && criteria) {
      response = await getPaginatedCompaniesService(
        baseEmail,
        "1",
        search,
        criteria
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
        setCompanies(parents);
        setIsLoadingCompany(false);
      } else {
        return toast.error(response.data.message);
      }
    }
  };

  // const handleKeypress = (e) => {
  //   if (e.keyCode === 13) {
  //     handleSearch();
  //   }
  // };

  // const companiesPerPage = 10;
  // const pagesVisited = pageNumber * companiesPerPage;
  // const totalnumberofPages = 100;
  // const displayCompaniesPerPage = !search
  // ? companies
  //     .sort((a, b) => {
  //       if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
  //         return -1;
  //       if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
  //         return 1;
  //       return 0;
  //     })
  //     .slice(pagesVisited, pagesVisited + companiesPerPage)
  //     .map((company, i) => (
  const displayCompaniesPerPage = companies.map((company, i) => (
    <tr key={i}>
      <td>{company.company_name}</td>
      <td>{company.company_secretary}</td>
      {/* <td>
              {
                companies.companies_data.find(
                  (comp) => company.parent_code === comp.code
                )?.company_name
              }
            </td> */}
      <td>{company.ntn}</td>
      <td>{company.incorporation_no}</td>
      <td>{company.sector_code}</td>
      {/* <td>{company.contact_person_name}</td> */}
      {(crudFeatures[1] || crudFeatures[2]) && (
        <td>
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
                id="companyView"
                data-placement="top"
                onClick={() => {
                  const obj = JSON.parse(JSON.stringify(company));
                  obj.parent = getFoundObject(
                    companies_dropdown,
                    obj.parent_code
                  );
                  if (
                    obj.sector_code == "" ||
                    obj.sector_code.replace("/", "") == "NA"
                  ) {
                    obj.sector_code = {
                      label: obj.sector_code,
                      value: obj.sector_code,
                    };
                  } else {
                    let sector_code = SectorsData.sectors.filter(
                      (item) => item.sector_code === obj.sector_code
                    );
                    if (sector_code.length > 0) {
                      obj.sector_code = getFoundObject(
                        SectorsData.sectors.map((item) => {
                          return {
                            label: item.sector_name + "-" + item.sector_code,
                            value: item.sector_code,
                          };
                        }),
                        obj.sector_code
                      );
                    } else {
                      obj.sector_code = getFoundObject(
                        SectorsData.sectors.map((item) => {
                          return {
                            label: item.sector_name + "-" + item.sector_code,
                            value: item.sector_code,
                          };
                        }),
                        "0"
                      );
                    }
                  }
                  // for modal
                  setViewFlag(true);
                  sessionStorage.setItem(
                    "selectedCompany",
                    JSON.stringify(obj)
                  );
                }}
              ></i>
              <UncontrolledTooltip placement="top" target="companyView">
                {"View Company's Detail"}
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
                id="companyEdit"
                data-placement="top"
                onClick={() => {
                  const obj = JSON.parse(JSON.stringify(company));
                  obj.parent_code = getFoundObject(
                    companies_dropdown,
                    obj.parent_code
                  );

                  if (
                    obj.sector_code == "" ||
                    obj.sector_code.replace("/", "") == "NA"
                  ) {
                    obj.sector_code = {
                      label: obj.sector_code,
                      value: obj.sector_code,
                    };
                  } else {
                    let sector_code = SectorsData.sectors.filter(
                      (item) => item.sector_code === obj.sector_code
                    );
                    if (sector_code.length > 0) {
                      obj.sector_code = getFoundObject(
                        SectorsData.sectors.map((item) => {
                          return {
                            label: item.sector_name + "-" + item.sector_code,
                            value: item.sector_code,
                          };
                        }),
                        obj.sector_code
                      );
                    } else {
                      obj.sector_code = getFoundObject(
                        SectorsData.sectors.map((item) => {
                          return {
                            label: item.sector_name + "-" + item.sector_code,
                            value: item.sector_code,
                          };
                        }),
                        "0"
                      );
                    }
                  }
                  // for modal
                  setViewEditPage(true);
                  sessionStorage.setItem(
                    "selectedCompany",
                    JSON.stringify(obj)
                  );
                }}
              ></i>
              <UncontrolledTooltip placement="top" target="companyEdit">
                {"Edit Company's Detail"}
              </UncontrolledTooltip>
            </>
          )}
        </td>
      )}
    </tr>
  ));
  // : searchedCompanies
  //     .sort((a, b) => {
  //       if (
  //         new Date(b.created_at).getTime() < new Date(a.created_at).getTime()
  //       )
  //         return -1;
  //       if (
  //         new Date(b.created_at).getTime() > new Date(a.created_at).getTime()
  //       )
  //         return 1;
  //       return 0;
  //     })
  //     .slice(pagesVisited, pagesVisited + companiesPerPage)
  //     .map((company, i) => (
  //       <tr key={i}>
  //         <td>
  //           <span className="status-icon bg-success"></span>
  //           {company.company_name}
  //         </td>
  //         <td>{company.company_secretary}</td>
  //         {/* <td>
  //           {
  //             companies.companies_data.find(
  //               (comp) => company.parent_code === comp.code
  //             )?.company_name
  //           }
  //         </td> */}
  //         <td>{company.ntn}</td>
  //         <td>{company.incorporation_no}</td>
  //         <td>{company.sector_code}</td>
  //         {/* <td>{company.contact_person_name}</td> */}
  //         {(crudFeatures[1] || crudFeatures[2]) && (
  //           <td>
  //             {crudFeatures[1] && (
  //               <>
  //                 <i
  //                   className="fa fa-eye"
  //                   style={{
  //                     width: 35,
  //                     fontSize: 16,
  //                     padding: 11,
  //                     color: "#4466F2",
  //                     cursor: "pointer",
  //                   }}
  //                   id="companyView"
  //                   data-placement="top"
  //                   onClick={() => {
  //                     const obj = JSON.parse(JSON.stringify(company));
  //                     obj.parent = getFoundObject(
  //                       companies_dropdown,
  //                       obj.parent_code
  //                     );
  //                     if (
  //                       obj.sector_code == "" ||
  //                       obj.sector_code.replace("/", "") == "NA"
  //                     ) {
  //                       obj.sector_code = {
  //                         label: obj.sector_code,
  //                         value: obj.sector_code,
  //                       };
  //                     } else {
  //                       let sector_code = SectorsData.sectors.filter(
  //                         (item) => item.sector_code === obj.sector_code
  //                       );
  //                       if (sector_code.length > 0) {
  //                         obj.sector_code = getFoundObject(
  //                           SectorsData.sectors.map((item) => {
  //                             return {
  //                               label:
  //                                 item.sector_name + "-" + item.sector_code,
  //                               value: item.sector_code,
  //                             };
  //                           }),
  //                           obj.sector_code
  //                         );
  //                       } else {
  //                         obj.sector_code = getFoundObject(
  //                           SectorsData.sectors.map((item) => {
  //                             return {
  //                               label:
  //                                 item.sector_name + "-" + item.sector_code,
  //                               value: item.sector_code,
  //                             };
  //                           }),
  //                           "0"
  //                         );
  //                       }
  //                     }
  //                     // for modal
  //                     setViewFlag(true);
  //                     sessionStorage.setItem(
  //                       "selectedCompany",
  //                       JSON.stringify(obj)
  //                     );
  //                   }}
  //                 ></i>
  //                 <UncontrolledTooltip placement="top" target="companyView">
  //                   {"View Company's Detail"}
  //                 </UncontrolledTooltip>
  //               </>
  //             )}
  //             {crudFeatures[2] && (
  //               <>
  //                 <i
  //                   className="fa fa-pencil"
  //                   style={{
  //                     width: 35,
  //                     fontSize: 16,
  //                     padding: 11,
  //                     color: "#FF9F40",
  //                     cursor: "pointer",
  //                   }}
  //                   id="companyEdit"
  //                   data-placement="top"
  //                   onClick={() => {
  //                     const obj = JSON.parse(JSON.stringify(company));
  //                     obj.parent_code = getFoundObject(
  //                       companies_dropdown,
  //                       obj.parent_code
  //                     );
  //                     if (
  //                       obj.sector_code == "" ||
  //                       obj.sector_code.replace("/", "") == "NA"
  //                     ) {
  //                       obj.sector_code = {
  //                         label: obj.sector_code,
  //                         value: obj.sector_code,
  //                       };
  //                     } else {
  //                       let sector_code = SectorsData.sectors.filter(
  //                         (item) => item.sector_code === obj.sector_code
  //                       );
  //                       if (sector_code.length > 0) {
  //                         obj.sector_code = getFoundObject(
  //                           SectorsData.sectors.map((item) => {
  //                             return {
  //                               label:
  //                                 item.sector_name + "-" + item.sector_code,
  //                               value: item.sector_code,
  //                             };
  //                           }),
  //                           obj.sector_code
  //                         );
  //                       } else {
  //                         obj.sector_code = getFoundObject(
  //                           SectorsData.sectors.map((item) => {
  //                             return {
  //                               label:
  //                                 item.sector_name + "-" + item.sector_code,
  //                               value: item.sector_code,
  //                             };
  //                           }),
  //                           "0"
  //                         );
  //                       }
  //                     }
  //                     // for modal
  //                     setViewEditPage(true);
  //                     sessionStorage.setItem(
  //                       "selectedCompany",
  //                       JSON.stringify(obj)
  //                     );
  //                   }}
  //                 ></i>
  //                 <UncontrolledTooltip placement="top" target="companyEdit">
  //                   {"Edit Company's Detail"}
  //                 </UncontrolledTooltip>
  //               </>
  //             )}
  //           </td>
  //         )}
  //       </tr>
  //     ));

  //old pagination
  // const pageCount = !search
  //   ? Math.ceil(companies.length / companiesPerPage)
  //   : Math.ceil(searchedCompanies.length / companiesPerPage);
  // const changePage = ({ selected }) => {
  //   setPageNumber(selected);
  // };
  // end old pagination

  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */

  // const handleSearchChange = (e) => {
  //   setSearch(e.target.value);
  //   if (e.target.value.length > 0) {
  //     if (companies.copmanies_data?.length !== 0) {
  //       if (companyCodeSearch) {
  //         setSearchedCompanies(
  //           companies.companies_data.filter((comp) => {
  //             return comp.code.match(generateRegex(e.target.value));
  //           })
  //         );
  //       }
  //       if (companyNameSearch) {
  //         setSearchedCompanies(
  //           companies.companies_data.filter((comp) => {
  //             return comp.company_name.match(generateRegex(e.target.value));
  //           })
  //         );
  //       }
  //       if (parentCompanySearch) {
  //         setSearchedCompanies(
  //           companies.companies_data
  //             .map((com) => ({
  //               parent_name:
  //                 companies.companies_data.find(
  //                   (co) => com.parent_code === co.code
  //                 )?.company_name || "",
  //               ...com,
  //             }))
  //             .filter((comp) => {
  //               return comp.parent_name.match(generateRegex(e.target.value));
  //             })
  //         );
  //       }
  //     }
  //   }
  // };
  //   useEffect(() => {
  //     if (companyCodeSearch){
  //     if (search) {
  //       console.log("search", search)

  //       const searchConditions = [
  //         {
  //           key: ["code"],
  //           value: search,
  //           type: SearchType.LK,
  //         },
  //       ];

  //       const result = filterData(companies.companies_data, searchConditions);
  //       console.log("result", result);
  //       setSearchedCompanies(result);
  //     }
  //   }
  //   if(companyNameSearch){
  //      if (search) {
  //       console.log("search", search)

  //       const searchConditions = [
  //         {
  //           key: ["company_name"],
  //           value: search,
  //           type: SearchType.LK,
  //         },
  //       ];

  //       const result = filterData(companies.companies_data, searchConditions);
  //       console.log("result", result);
  //       setSearchedCompanies(result);
  //     }
  //   }
  //   if(parentCompanySearch){
  //     if (search) {
  //      console.log("search", search)

  //      const searchConditions = [
  //        {
  //          key: ["parent_name"],
  //          value: search,
  //          type: SearchType.LK,
  //        },
  //      ];

  //      const result = filterData(companies.companies_data, searchConditions);
  //      console.log("result", result);
  //      setSearchedCompanies(result);
  //    }
  //  }
  //   }, [search]);
  // useEffect(() => {
  //   if (search) {
  //     const searchConditions = [
  //       {
  //         key: ["ntn", "company_name"],
  //         value: search,
  //         type: SearchType.LK,
  //       },
  //     ];
  //     const result = filterData(companies, searchConditions);
  //     setSearchedCompanies(result);
  //   }
  // }, [search]);
  // const handleAlertMessage = (data)=> {
  //   console.log('dataaaa', data)
  // }
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Company Listing</h6>
        <Breadcrumb title="Company Listing" parent="Company" />
      </div>
      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Company
        </ModalHeader>
        <ModalBody>
          <AddCompany setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* alert code design */}
{/* 
      <Modal isOpen={viewAlert} show={viewAlert.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAlert(false);
          }}
        >
          Show Alert 
        </ModalHeader>
        <ModalBody>
          <div>
          <form onSubmit={handleSubmit(handleAlertMessage)}>
            <div className="row">
              <div className="col-md-12">
            <div className="card ">
                <div className="card-header b-t-primary">
                 <h5> Alert</h5>
                  </div>
                  <div className="row">
                  <div className="form-group mt-3 col-md-4">
                    <label htmlFor="company_type">Company Type</label>
                    <select
                      name="company_type"
                      className={`form-control ${
                        errors.company_type && "border border-danger"
                      }`}
                      {...register("company_type")}
                    >
                      <option value="">Select</option>
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                    <small className="text-danger">
                      {errors.company_type?.message}
                    </small>
                  </div>

                  <div className="form-group mt-3 col-md-4">
                    <label>Title</label>
                    <input
                      name="title"
                      className={`form-control ${
                        errors.title && "border border-danger"
                      }`}
                      type="text"
                      placeholder="Enter Title"
                      {...register("title")}
                    />
                    <small className="text-danger">
                      {errors.title?.message}
                    </small>
                  </div>
                  <div className="form-group mt-3 col-md-4">
                    <label>Section</label>
                    <input
                      name="section"
                      className={`form-control ${
                        errors.section && "border border-danger"
                      }`}
                      type="section"
                      placeholder="Enter Section"
                      {...register("section")}
                    />
                    <small className="text-danger">
                      {errors.section?.message}
                    </small>
                  </div>
                  <div className="form-group mt-3 col-md-4">
                    <label>Regulations </label>
                    <input
                      name="regulations"
                      className={`form-control ${
                        errors.regulations && "border border-danger"
                      }`}
                      type="regulations"
                      placeholder="Enter Regulations"
                      {...register("regulations")}
                    />
                    <small className="text-danger">
                      {errors.regulations?.message}
                    </small>
                  </div>
                  <div className="form-group mt-3 col-md-4">
                    <label>Frequency </label>
                    <input
                      name="frequency"
                      className={`form-control ${
                        errors.frequency && "border border-danger"
                      }`}
                      type="frequency"
                      placeholder="Enter Frequency"
                      {...register("frequency")}
                    />
                    <small className="text-danger">
                      {errors.frequency?.message}
                    </small>
                  </div>  
                  <div className="form-group mt-3 col-md-4">
                    <label htmlFor="level_ddl">Level DDL</label>
                    <select
                      name="level_ddl"
                      className={`form-control ${
                        errors.level_ddl && "border border-danger"
                      }`}
                      {...register("level_ddl")}
                    >
                      <option value="">Select</option>
                      <option value="Critical">Critical</option>
                      <option value="Normal">Normal</option>
                      <option value="Information">Information</option>
                    </select>
                    <small className="text-danger">
                      {errors.level_ddl?.message}
                    </small>
                  </div>
                  <div className="form-group mt-3 col-md-4">
                    <label>Dependent On Req </label>
                    <input
                      name="dependent "
                      className={`form-control ${
                        errors.dependent && "border border-danger"
                      }`}
                      type="dependent"
                      placeholder="Enter Dependent"
                      {...register("dependent")}
                    />
                    <small className="text-danger">
                      {errors.dependent?.message}
                    </small>
                  </div>
                  <div className="form-group mt-3 col-md-4">
                    <label>Days To Dependent No.</label>

                    <Controller
                      name="days_dependent"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.days_dependent && "border border-danger"
                          }`}
                          id="days_dependent"
                          allowNegative={false}
                          placeholder="Enter Days To Dependent No."
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.days_dependent?.message}
                    </small>
                  </div>
                  <div className="form-group mt-3 col-md-4">
                    <label>Notify Days</label>

                    <Controller
                      name="notify_days"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.notify_days && "border border-danger"
                          }`}
                          id="notify_days"
                          allowNegative={false}
                          placeholder="Enter Notify Days"
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.notify_days?.message}
                    </small>
                  </div>
                  <div className="form-group mt-3 col-md-4">
                    <label htmlFor="notify_via">Notify Via</label>
                    <select
                      name="notify_via"
                      className={`form-control ${
                        errors.notify_via && "border border-danger"
                      }`}
                      {...register("notify_via")}
                    >
                      <option value="">Select</option>
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                    <small className="text-danger">
                      {errors.notify_via?.message}
                    </small>
                  </div>
                  <div className="form-group mt-3 col-md-4">
                    <label htmlFor="active">Active</label>
                    <select
                      name="active"
                      className={`form-control ${
                        errors.active && "border border-danger"
                      }`}
                      {...register("active")}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <small className="text-danger">
                      {errors.active?.message}
                    </small>
                  </div>




               

                  </div>



                  </div>
                  </div>
            </div>
            <div className="row">
            <div className="col-md-12">
              <button
                type="submit"
                className="btn btn-primary"
                style={{marginLeft : '15px'}}
                // disabled={Boolean(loading)}
              >
                {false ? (
                  <>
                    <span className="fa fa-spinner fa-spin"></span>
                    <span>{"Loading..."}</span>
                  </>
                ) : (
                  <span>{"Submit"}</span>
                )}
              </button>
            </div>
          </div>
            </form>
          </div>

        </ModalBody>
      </Modal> */}
            {/* alert code design */}
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Company Edit
        </ModalHeader>
        <ModalBody>
          <EditCompany setViewEditPage={setViewEditPage} getPaginatedCompanies={getPaginatedCompanies}/>
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Company View
        </ModalHeader>
        <ModalBody>
          <ViewCompany />
        </ModalBody>
      </Modal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  {/* <h5>Company Listing</h5> */}
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
                          <option value="ntn">NTN</option>
                          <option value="name">Name</option>
                          <option value="code">Code</option>
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
                              : criteria == "ntn"
                              ? `Search by NTN`
                              : criteria == "name"
                              ? `Search by Company Name`
                              : `Search by Company Code`
                          }
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
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
                          <span>{"Search"}</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  <div>
                    {crudFeatures[0] && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          // for modal
                          setViewAddPage(true);
                        }}
                      >
                        <i className="fa fa-plus mr-1"></i> Add Company
                      </button>
                    )}
                  </div>
                  {/* <div>
                    {crudFeatures[0] && (
                      <button
                        className="btn btn-primary btn-sm ml-2"
                        onClick={() => {
                          // for modal
                          setViewAlert(true);
                        }}
                      >
                        Dummy Model
                      </button>
                    )}
                  </div> */}
                </div>
                {/* <div className="row my-3">
                  <div className="col-sm-3">
                    <div className="form-group">
                      <input
                        id="searchTransaction"
                        className="form-control"
                        type="text"
                        data-testid="search-company"
                        placeholder={`Enter ${
                          companyCodeSearch
                            ? "Company Code"
                            : parentCompanySearch
                            ? "Parent Company"
                            : "Company Name"
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
                        id="company_name"
                        type="checkbox"
                        checked={companyNameSearch}
                        value={companyNameSearch}
                        onChange={(e) => {
                          setCompanyNameSearch(true);
                          setParentCompanySearch(false);
                          setCompanyCodeSearch(false);
                        }}
                      />
                      <label htmlFor="company_name">Company Name</label>
                    </span>
                  </div>
                   <div className="col-md-2">
                    <span className="checkbox checkbox-info">
                      <input
                        id="parent_company"
                        type="checkbox"
                        checked={parentCompanySearch}
                        onChange={(e) => {
                          setParentCompanySearch(true);
                          setCompanyNameSearch(false);
                          setCompanyCodeSearch(false);
                        }}
                      />
                      <label htmlFor="parent_company">Parent Company</label>
                    </span>
                  </div>
                  <div className="col-md-2">
                    <span className="checkbox checkbox-info">
                      <input
                        id="company_code"
                        type="checkbox"
                        checked={companyCodeSearch}
                        onChange={(e) => {
                          setCompanyNameSearch(false);
                          setParentCompanySearch(false);
                          setCompanyCodeSearch(true);
                        }}
                      />
                      <label htmlFor="company_code">Company Code</label>
                    </span>
                  </div>
                </div> */}
              </div>
              {isLoadingCompany === true && <Spinner />}
              {isLoadingCompany === false && companies.length !== 0 && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Company Secretary </th>
                        <th>NTN</th>
                        <th>Incorporation No</th>
                        <th>Sector Code </th>
                        {(crudFeatures[1] || crudFeatures[2]) && (
                          <th>Action</th>
                        )}
                      </tr>
                    </thead>

                    <tbody>{displayCompaniesPerPage}</tbody>
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
              {isLoadingCompany === false && companies.length === 0 && (
                <p className="text-center">
                  <b>Companies Data not available</b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
