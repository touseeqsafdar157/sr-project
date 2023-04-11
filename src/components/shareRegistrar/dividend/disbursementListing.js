import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { getDisburse, getPaginatedDisbursementsByCompanyCode } from "../../../store/services/disburse.service";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import AddDisbursement from "./addDisbursement";
import EditDisbursement from "./editDisbursement";
import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";
import { numberWithCommas } from "utilities/utilityFunctions";
import Select from "react-select";
import { darkStyle, errorStyles } from "components/defaultStyles";
import { getCompanies } from "store/services/company.service";
import { getShareHoldersByCompany } from "store/services/shareholder.service";

export default function DisbursementListing() {
  const baseEmail = sessionStorage.getItem("email") || "";
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [searchedDisbursements, setSearchedDisbursements] = useState([]);
  const [search, setSearch] = useState("");
  const [dividend, setDividend] = useState([]);
  const [dividend_data_loading, setDividend_data_loading] = useState(false);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [inactive_shareholders_dropdown, setInactive_shareholders_dropdown] =
    useState([]);
  const [
    inactive_shareholders_data_loading,
    setInactive_shareholders_data_loading,
  ] = useState(false);
  const [folio_options, setFolio_options] = useState([]);
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
          setCompanies_data_loading(false);
        }
      } catch (error) {
        setCompanies_data_loading(false);
      }
    };

    // const getAllDisburse = async () => {
    //   setDividend_data_loading(true);
    //   try{
    //   const response = await getDisburse(baseEmail)
    //   if (response.status===200) {
    //         const parents = response.data.data
    //         setDividend(parents)
    //         setDividend_data_loading(false)
    //   } }catch(error) {
    //     setDividend_data_loading(false);
    //   }
    //   };
    //     getAllDisburse();
        getAllCompanies();

  },[])

  const getShareHoldersByCompanyCode = async () => {
    setInactive_shareholders_data_loading(true);
    try {
      
      const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
      // console.log("Response => ", response);
      if (response.status === 200) {
        // const parents = response.data.data;
        const shareholders_dropdown = response.data.data.map((item) => {
                    let label = `${item.folio_number} (${item.shareholder_name}) `;
                    return { label: label, value: item.folio_number };
                  });
        setFolio_options(shareholders_dropdown);
        setInactive_shareholders_dropdown(shareholders_dropdown);
        setInactive_shareholders_data_loading(false);

      }
    } catch (error) {
      setInactive_shareholders_data_loading(false);
      toast.error("Error fetching shareholders")
    }
  };

  const getPaginatedDisburseByCompanyCode = async () => {
    setDividend_data_loading(true);
    try{
    const response = await getPaginatedDisbursementsByCompanyCode(baseEmail, selectedCompany, 1, "" , "")
    if (response.status===200) {
          const parents = response.data.data.docs
          setHasNextPage(response.data.data.hasNextPage);
          setHasPrevPage(response.data.data.hasPrevPage);
          setNextPage(response.data.data.nextPage);
          setPrevPage(response.data.data.prevPage);
          setCurrentPage(response.data.data.page);
          setTotalPages(response.data.data.totalPages);
          setTotalRecords(response.data.data.totalDocs);
          setDividend(parents)
          setDividend_data_loading(false)
    } }catch(error) {
      setDividend_data_loading(false);
    }
    };

  useEffect(() => {
    if(selectedCompany !== "") {
      getShareHoldersByCompanyCode();
      getPaginatedDisburseByCompanyCode();
    }
    else {
      setInactive_shareholders_dropdown([]);
      setDividend([]);
      setFolio_options([]);
    }
  }, [selectedCompany])


  useEffect(() => {
    if(viewAddPage==false){
      getPaginatedDisburseByCompanyCode();
    }
  },[viewAddPage])


  const handleNextPage = async () => {
    setDividend_data_loading(true);
    try {
      //for paginated companies
      const response = await getPaginatedDisbursementsByCompanyCode(
        baseEmail,
        selectedCompany,
        nextPage,
        search ? search : "",
        criteria ? criteria : "",
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
        setDividend(parents)
        setDividend_data_loading(false)
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setDividend_data_loading(false);
    }
  };

  const handlePrevPage = async () => {
    setDividend_data_loading(true);
    try {
      //for paginated companies
      const response = await getPaginatedDisbursementsByCompanyCode(
        baseEmail,
        selectedCompany,
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
        // setCompanies(parents);
        setDividend(parents)
        setDividend_data_loading(false)
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setDividend_data_loading(false);
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
    setDividend_data_loading(true);

    if (criteria !== "" && criteria) {
      response = await getPaginatedDisbursementsByCompanyCode(
        baseEmail,
        selectedCompany,
        "1",
        search,
        criteria,
      );

      // console.log("Search REsponse => ", response)
      if (response.status === 200) {
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);

        const parents = response.data.data.docs ? response.data.data.docs : [];
        setDividend(parents)
        setDividend_data_loading(false)

      } else {
        setDividend_data_loading(false)
        return toast.error(response.data.message);
      }
    }
  };

  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const disburementsPerPage = 10;
  const pagesVisited = pageNumber * disburementsPerPage;
  const totalnumberofPages = 100;
  const displayDisburementsPerPage = !search
    ? dividend
        .sort((a, b) => {
          if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
            return -1;
          if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
            return 1;
          return 0;
        })
        .slice(pagesVisited, pagesVisited + disburementsPerPage)
        .map((item, i) => (
          <tr key={i}>
            <td>{item.disburse_id}</td>
            <td>{item.disburse_date}</td>
            {/* <td>{item.folio_no}</td> */}
            <td>
                {
                  inactive_shareholders_dropdown.find(
                    (holder) => holder.value === item.folio_no
                  )?.label
                }
              </td>
              <td>
                {
                  companies_dropdown.find((comp) => comp.value === item.company_code)
                    ?.label.split(" - ")[1]
                }
              </td>
            <td className="text-right">{numberWithCommas(item.amount_disbursed)}</td>
            <td>{item.status}</td>
            {/* <td>
              <i
                className="fa fa-pencil"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "#FF9F40",
                  cursor: "pointer",
                }}
                id="viewDisbursement"
                onClick={() => {
                  // for modal
                  setViewEditPage(true);
                  sessionStorage.setItem(
                    "selectedDisbursement",
                    JSON.stringify(item)
                  );
                }}
              ></i>
              <UncontrolledTooltip placement="top" target="viewDisbursement">
                {"View Disbursement's Detail"}
              </UncontrolledTooltip>
            </td> */}
          </tr>
        ))
    : searchedDisbursements
        .sort((a, b) => {
          if (
            new Date(b.created_at).getTime() < new Date(a.created_at).getTime()
          )
            return -1;
          if (
            new Date(b.created_at).getTime() > new Date(a.created_at).getTime()
          )
            return 1;
          return 0;
        })
        .slice(pagesVisited, pagesVisited + disburementsPerPage)
        .map((item, i) => (
          <tr key={i}>
            <td>{item.disburse_id}</td>
            <td>{item.disburse_date}</td>
            <td>{item.folio_no}</td>
            <td className="text-right">{numberWithCommas(item.amount_disbursed)}</td>
            <td>{item.status}</td>
            {/* <td>
              <i
                className="fa fa-pencil"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "#FF9F40",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // for modal
                  setViewEditPage(true);
                  sessionStorage.setItem(
                    "selectedDisbursement",
                    JSON.stringify(item)
                  );
                }}
              ></i>
            </td> */}
          </tr>
        ));
  const pageCount = !search
    ? Math.ceil(dividend.length / disburementsPerPage)
    : Math.ceil(searchedDisbursements.length / disburementsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
      <h6 className="text-nowrap mt-3 ml-3">Disbursement Listing</h6>
      <Breadcrumb title="Disbursement Listing" parent="Dividend Disbursement" />
      </div>

      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Disbursement
        </ModalHeader>
        <ModalBody>
          <AddDisbursement setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Disbursement Edit
        </ModalHeader>
        <ModalBody>
          <EditDisbursement setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="row d-flex justify-content-between">
                <h5></h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // for modal
                    setViewAddPage(true);
                  }}
                >
                  <i className="fa fa-plus mr-1"></i> Add Disbursement
                </button>
                </div>

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
                        Select Company to show dividend disbursements
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
                          <option value="id">Id</option>
                          <option value="folio">Folio</option>
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
                       options={folio_options}
                      //  isLoading={investor_request_types.length === 0}
                  
                       onChange={(selected) => {
                        selected && setSearch(selected.value);
                          !selected && setSearch("");
                          !selected && getPaginatedDisburseByCompanyCode();

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
              {dividend_data_loading === true && <Spinner />}
              {dividend.length !== 0 && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>Disburse id</th>
                        <th>Disburse date </th>
                        <th>Folio no</th>
                        <th>Company</th>
                        <th className="text-right">Amount disbursed </th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>{displayDisburementsPerPage}</tbody>
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
              {dividend_data_loading === false &&
                dividend.length === 0 && (
                  <p className="text-center">
                    <b>Dividend Disbursement Data not available</b>
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
