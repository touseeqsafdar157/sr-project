import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useSelector } from "react-redux";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import { filterData, SearchType } from "filter-data";
import { darkStyle } from "../../defaultStyles";
import { generateRegex, listCrud } from "../../../utilities/utilityFunctions";
import AddInvestor from "./addInvestors";
import EditInvestor from "./editInvestor";
import ViewInvestor from "./viewInvestor";
import {
  getInvestors,
  getPaginatedInvestorsService,
} from "store/services/investor.service";
import Spinner from "components/common/spinner";
import { toast } from "react-toastify";

export default function InvestorsListing() {
  const baseEmail = sessionStorage.getItem("email") || "";
  // Selector STARTS
  const features = useSelector((data) => data.Features).features;
  // Selector ENDS
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  // Select Options
  const investor_categories = [
    { label: "INDIVIDUALS", value: "INDIVIDUALS" },
    { label: "PUBLIC SECTO", value: "PUBLIC SECTOR" },
    { label: "JOINT STOCK COMPANIE", value: "JOINT STOCK COMPANIES" },
    { label: "FINANCIAL INSTITUTION", value: "FINANCIAL INSTITUTIONS" },
    { label: "MUTITAL FUND/TRUSTE", value: "MUTITAL FUND/TRUSTEE" },
    { label: "INSURANCE COMPANIE", value: "INSURANCE COMPANIES" },
    { label: "INVESTMENT COMPANIE", value: "INVESTMENT COMPANIES" },
    { label: "DIRECTORS", value: "DIRECTORS" },
    { label: "EXECUTIVES", value: "EXECUTIVES" },
    { label: "ASSOCIATED COMPANIE", value: "ASSOCIATED COMPANIES" },
    { label: "INVESTMENT COMPANIE", value: "INVESTMENT COMPANIES" },
    { label: "LEASING COMPANIE", value: "LEASING COMPANIES" },
    { label: "TRUSTS", value: "TRUSTS" },
    { label: "NIT AND IC", value: "NIT AND ICP" },
    { label: "MODARBA", value: "MODARBA" },
    { label: "MODARBA MANAGEMEN", value: "MODARBA MANAGEMENT" },
    { label: "CORPORATE ORGANIZATION", value: "CORPORATE ORGANIZATIONS" },
    { label: "CHARITABLE INSTITUTE", value: "CHARITABLE INSTITUTES" },
    { label: "EMPLOYEE", value: "EMPLOYEE" },
    { label: "CDC", value: "CDC" },
    { label: "OTHERS", value: "OTHERS" },
  ];
  // States
  const [search, setSearch] = useState("");
  const [searchedInvestors, setSearchedInvestors] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [investors, setInvestors] = useState([]);
  const [isLoadingInvestor, setIsLoadingInvestor] = useState(false);
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

  const getPaginatedInvestors = async () => {
    setIsLoadingInvestor(true);
    try {
      const response = await getPaginatedInvestorsService(
        baseEmail,
        "1",
        "",
        ""
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
        setInvestors(parents);
        setIsLoadingInvestor(false);
      }
    } catch (error) {
      setIsLoadingInvestor(false);
    }
  };

  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);

  useEffect(() => {
    // const getAllInvestors = async () => {
    //   setIsLoadingInvestor(true);
    //   try {
    //     const response = await getInvestors(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.data;
    //       setInvestors(parents);
    //       setIsLoadingInvestor(false);
    //     }
    //   } catch (error) {
    //     setIsLoadingInvestor(false);
    //   }
    // };
    // getAllInvestors();
    getPaginatedInvestors();
  }, []);

  useEffect(() => {
    if (search.length == 0 || !search || search == "") {
      getPaginatedInvestors();
    }
  }, [search]);

  useEffect(() => {
    if (criteria == "") {
      getPaginatedInvestors();
    }
  }, [criteria]);

  //new pagination
  const handleNextPage = async () => {
    setIsLoadingInvestor(true);
    try {
      //for paginated companies
      const response = await getPaginatedInvestorsService(
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
        setInvestors(parents);
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
      const response = await getPaginatedInvestorsService(
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
        setInvestors(parents);
        setIsLoadingInvestor(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoadingInvestor(false);
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
    setIsLoadingInvestor(true);
    let response;
    if (criteria !== "" && criteria) {
      response = await getPaginatedInvestorsService(
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
        setInvestors(parents);
        setIsLoadingInvestor(false);
      } else {
        return toast.error(response.data.message);
      }
    }
  };
  // new pagination ends
  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  // const [pageNumber, setPageNumber] = useState(0);
  // const investorsPerPage = 10;
  // const pagesVisited = pageNumber * investorsPerPage;
  // const totalnumberofPages = 100;
  // const displayInvestorsPerPage = !search
  //   ? investors
  //       .sort((a, b) => {
  //         if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
  //           return -1;
  //         if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
  //           return 1;
  //         return 0;
  //       })
  //       .slice(pagesVisited, pagesVisited + investorsPerPage)
  const displayInvestorsPerPage = investors.map((item, i) => (
    <tr key={i}>
      <td>{item.investor_id}</td>
      <td>{item.category}</td>
      <td>{item.investor_name}</td>
      <td>{item.cnic || item.ntn}</td>
      <td>{item.occupation}</td>
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
                id="investorView"
                onClick={() => {
                  // for modal
                  setViewFlag(true);
                  sessionStorage.setItem(
                    "selectedInvestor",
                    JSON.stringify(item)
                  );
                }}
              ></i>
              <UncontrolledTooltip placement="top" target="investorView">
                {"View Investor's Detail"}
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
                id="investorEdit"
                onClick={() => {
                  // for modal
                  setViewEditPage(true);
                  sessionStorage.setItem(
                    "selectedInvestor",
                    JSON.stringify(item)
                  );
                }}
              ></i>
              <UncontrolledTooltip placement="top" target="investorEdit">
                {"Edit Investor's Detail"}
              </UncontrolledTooltip>
            </>
          )}
        </td>
      )}
    </tr>
  ));

  // const pageCount = !search
  //   ? Math.ceil(investors.length / investorsPerPage)
  //   : Math.ceil(searchedInvestors.length / investorsPerPage);
  // const changePage = ({ selected }) => {
  //   setPageNumber(selected);
  // };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  // const handleSearchChange = (e) => {
  //   setSearch(e.target.value);
  //   if (e.target.value.length > 0) {
  //     if (investors.investors_data?.length !== 0) {
  //       // if (selectedCategory !== "") {
  //       //   setSearchedInvestors(
  //       //     investors.investors_data
  //       //       .filter((ing) => ing.category === selectedCategory)
  //       //       .filter((inv) => {
  //       //         return inv.investor_id.match(generateRegex(e.target.value));
  //       //       })
  //       //   );
  //       // } else {
  //       setSearchedInvestors(
  //         investors.investors_data.filter((inv) => {
  //           return inv.investor_id.match(generateRegex(e.target.value));
  //         })
  //       );
  //       // }
  //     }
  //   }
  // };
  // useEffect(() => {
  //   if (search) {
  //     const searchConditions = [
  //       {
  //         key: ["investor_name", "investor_id", "category", "occupation"],
  //         value: search,
  //         type: SearchType.LK,
  //       },
  //     ];
  //     const result = filterData(investors, searchConditions);
  //     setSearchedInvestors(result);
  //   }
  // }, [search]);
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Investors Listing</h6>
        <Breadcrumb title="Investors Listing" parent="Investors" />
      </div>

      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="lg">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Investor
        </ModalHeader>
        <ModalBody>
          <AddInvestor setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Investor Edit
        </ModalHeader>
        <ModalBody>
          <EditInvestor setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Investor View
        </ModalHeader>
        <ModalBody>
          <ViewInvestor />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  {/* <h5>Investors Listing</h5> */}
                  {/* <div className="col-sm-6">
                    <div className="form-group">
                      <input
                        id="searchTransaction"
                        className="form-control"
                        type="text"
                        placeholder={"Search Investor"}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div> */}
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
                          <option value="id">ID</option>
                          <option value="name">Name</option>
                          <option value="category">Category</option>
                          <option value="occupation">Occupation</option>
                          {/* <option value="cnic">CNIC</option>
                          <option value="ntn">NTN</option> */}
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-5">
                      <div className="form-group">
                        {criteria !== "category" ? (
                          <input
                            id="searchTransaction"
                            className="form-control"
                            type="text"
                            // placeholder={"Search Company"}
                            placeholder={
                              criteria == "" || !criteria
                                ? `Select Criteria`
                                : criteria == "id"
                                ? `Search by ID`
                                : criteria == "name"
                                ? `Search by Investor Name`
                                : criteria == "category"
                                ? `Search by investor Category`
                                : `Search by Occupation`
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            disabled={!criteria}
                          />
                        ) : (
                          <select
                            className={`form-control`}
                            name="category"
                            onChange={(e) => setSearch(e.target.value)}
                          >
                            <option value="">Select Category</option>
                            <option value="INDIVIDUALS">INDIVIDUALS</option>
                            <option value="PUBLIC SECTOR">PUBLIC SECTOR</option>
                            <option value="JOINT STOCK COMPANIES">
                              JOINT STOCK COMPANIES
                            </option>
                            <option value="FINANCIAL INSTITUTIONS">
                              FINANCIAL INSTITUTIONS
                            </option>
                            <option value="MUTITAL FUND/TRUSTEE">
                              MUTITAL FUND/TRUSTEE
                            </option>
                            <option value="INSURANCE COMPANIES">
                              INSURANCE COMPANIES
                            </option>
                            <option value="INVESTMENT COMPANIES">
                              INVESTMENT COMPANIES
                            </option>
                            <option value="DIRECTORS">DIRECTORS</option>
                            <option value="EXECUTIVES">EXECUTIVES</option>
                            <option value="ASSOCIATED COMPANIES">
                              ASSOCIATED COMPANIES
                            </option>
                            <option value="INVESTMENT COMPANIES">
                              INVESTMENT COMPANIES
                            </option>
                            <option value="LEASING COMPANIES">
                              LEASING COMPANIES
                            </option>
                            <option value="TRUSTS">TRUSTS</option>
                            <option value="NIT AND ICP">NIT AND ICP</option>
                            <option value="MODARBA">MODARBA</option>
                            <option value="MODARBA MANAGEMENT">
                              MODARBA MANAGEMENT
                            </option>
                            <option value="CORPORATE ORGANIZATIONS">
                              CORPORATE ORGANIZATIONS
                            </option>
                            <option value="CHARITABLE INSTITUTES">
                              CHARITABLE INSTITUTES
                            </option>
                            <option value="EMPLOYEE">EMPLOYEE</option>
                            <option value="CDC">CDC</option>
                            <option value="OTHERS">OTHERS</option>
                            <option value="SPONSORS">SPONSORS</option>
                          </select>
                        )}
                      </div>
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
                        <i className="fa fa-plus mr-1"></i> Add Investor
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {isLoadingInvestor === true && <Spinner />}
              {isLoadingInvestor === false && investors.length !== 0 && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>Investor ID </th>
                        <th>Category</th>
                        <th>Investor Name</th>
                        <th>CNIC / NTN</th>
                        <th>Occupation</th>
                        {(crudFeatures[1] || crudFeatures[2]) && (
                          <th>Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>{displayInvestorsPerPage}</tbody>
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
              {investors.length === 0 && isLoadingInvestor === false && (
                <p className="text-center">
                  <b>Investors Data not available</b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
