import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import { useSelector } from "react-redux";
import { listCrud } from "../../../../../src/utilities/utilityFunctions";
import { useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import AddAnnouncement from "./addAnnouncement";
import EditAnnouncement from "./editAnnouncement";
import ViewAnnouncement from "./viewAnnouncement";
import { getFoundObject } from "../../../../utilities/utilityFunctions";
import { getCompanies } from "store/services/company.service";
import {
  getCorporateAnnouncement,
  getPaginatedCorporateAnnouncementService,
} from "store/services/corporate.service";
import {
  company_setter,
  symbol_setter,
} from "../../../../store/services/dropdown.service";
import Spinner from "components/common/spinner";
import Select from "react-select";
import { darkStyle } from "components/defaultStyles";
import CalculateEntitlement from "./calculateEntitlement";
import moment from "moment";

export default function AnnouncementListing() {
  const baseEmail = sessionStorage.getItem("email") || "";
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [search, setSearch] = useState("");
  const [searchedAnnouncements, setSearchedAnnouncements] = useState([]);
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [symbol_options, setSymbol_options] = useState([]);
  const [period_options, setPeriod_options] = useState([
    {
      label: "Q1",
      value: "Q1",
    },
    {
      label: "Q2",
      value: "Q2",
    },
    {
      label: "Q3",
      value: "Q3",
    },
    {
      label: "Q4",
      value: "Q4",
    },
  ]);
  const [companies, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [symbols_dropdown, setSymbols_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcement_data_loading, setAnnouncement_data_loading] =
    useState(false);

  const [viewCalculatePage, setViewCalculatePage] = useState(false);

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
      getPaginatedCorporateAnnouncement();
    }
  }, [search]);

  useEffect(() => {
    if (criteria == "") {
      getPaginatedCorporateAnnouncement();
    }
  }, [criteria]);

  let history = useHistory();
  useEffect(() => {
    getAllCompanies();
    // getAllCorporateAnnouncement();
    getPaginatedCorporateAnnouncement();
  }, []);
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
        // const symbols_dropdowns = response.data.data.map((item) => {
        //   let label = `${item.symbol} - ${item.company_name}`;
        //   return { label: label, value: item.symbol };
        // });
        setCompanies_dropdown(companies_dropdowns);
        // setSymbols_dropdown(symbols_dropdowns);
        setCompanies_data(parents);
        setCompanies_data_loading(false);
      }
    } catch (error) {
      setCompanies_data_loading(false);
    }
  };
  // const getAllCorporateAnnouncement = async () => {
  //   setAnnouncement_data_loading(true);
  //   try {
  //     const response = await getCorporateAnnouncement(baseEmail);
  //     if (response.status === 200) {
  //       const parents = response.data.data;
  //       setAnnouncements(parents);
  //       setAnnouncement_data_loading(false);
  //     }
  //   } catch (error) {
  //     setAnnouncement_data_loading(false);
  //   }
  // };

  const getPaginatedCorporateAnnouncement = async () => {
    setAnnouncement_data_loading(true);
    try {
      const response = await getPaginatedCorporateAnnouncementService(
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
        setAnnouncements(parents);
        setAnnouncement_data_loading(false);
      }
    } catch (error) {
      setAnnouncement_data_loading(false);
    }
  };

  const handleNextPage = async () => {
    setAnnouncement_data_loading(true);
    try {
      //for paginated companies
      const response = await getPaginatedCorporateAnnouncementService(
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
        setAnnouncements(parents);
        setAnnouncement_data_loading(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setAnnouncement_data_loading(false);
    }
  };

  const handlePrevPage = async () => {
    setAnnouncement_data_loading(true);
    try {
      //for paginated companies
      const response = await getPaginatedCorporateAnnouncementService(
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
        setAnnouncements(parents);
        setAnnouncement_data_loading(false);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      setAnnouncement_data_loading(false);
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
    setAnnouncement_data_loading(true);
    if (criteria !== "" && criteria) {
      console.log("Search => ", search);
      console.log("Criteria => ", criteria);

      response = await getPaginatedCorporateAnnouncementService(
        baseEmail,
        "1",
        search,
        criteria
      );
      if (response.status == 200) {
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);

        // const parents = response.data.data.docs;
        const parents = response.data.data.docs ? response.data.data.docs : [];
        setAnnouncements(parents);
        setAnnouncement_data_loading(false);
      } else {
        setAnnouncement_data_loading(false);
        return toast.error(response.data.message);
      }
    }
  };

  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const acnnouncementsPerPage = 10;
  const pagesVisited = pageNumber * acnnouncementsPerPage;
  const totalnumberofPages = 100;
  // const displayAcnnouncementsPerPage = !search
  //   ? announcements
  //       .sort((a, b) => {
  //         if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
  //           return -1;
  //         if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
  //           return 1;
  //         return 0;
  //       })
  //       .slice(pagesVisited, pagesVisited + acnnouncementsPerPage)
  const displayAcnnouncementsPerPage = announcements.map((item, i) => (
    <tr key={i}>
      <td>{moment(item?.announcement_date)?.format('DD-MM-YYYY') || ''}</td>
      <td>{item.announcement_id}</td>
      <td>{item.bonus_percent}</td>
      <td>{item.symbol}</td>
      <td>
        {
          companies.find((comp) => comp.code === item.company_code)
            ?.company_name
        }
      </td>
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
                id="viewAnnouncement"
                onClick={() => {
                  const obj = JSON.parse(JSON.stringify(item));
                  obj.company_code = getFoundObject(
                    companies_dropdown,
                    obj.company_code
                  );
                  // obj.symbol = getFoundObject(
                  //   companies_dropdown,
                  //   obj.symbol
                  // );
                  // obj.symbol = getFoundObject(
                  //   symbols_dropdown,
                  //   obj.symbol
                  // );
                  obj.period = getFoundObject(period_options, obj.period);
                  // for modal
                  setViewFlag(true);
                  sessionStorage.setItem(
                    "selectedCorporateAnnouncement",
                    JSON.stringify(obj)
                  );
                }}
              ></i>
              <UncontrolledTooltip placement="top" target="viewAnnouncement">
                {"View Announcement's Detail"}
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
                id="editAnnouncement"
                onClick={() => {
                  const obj = JSON.parse(JSON.stringify(item));
                  obj.company_code = getFoundObject(
                    companies_dropdown,
                    obj.company_code
                  );
                  // obj.symbol = getFoundObject(
                  //   companies_dropdown,
                  //   obj.symbol
                  // );
                  // obj.symbol = getFoundObject(
                  //   symbols_dropdown,
                  //   obj.symbol
                  // );
                  obj.period = getFoundObject(period_options, obj.period);
                  // for modal
                  setViewEditPage(true);
                  sessionStorage.setItem(
                    "selectedCorporateAnnouncement",
                    JSON.stringify(obj)
                  );
                }}
              ></i>
              <UncontrolledTooltip placement="top" target="editAnnouncement">
                {"Edit Announcement's Detail"}
              </UncontrolledTooltip>
            </>
          )}
        </td>
      )}
    </tr>
  ));

  const pageCount = !search
    ? Math.ceil(announcements.length / acnnouncementsPerPage)
    : Math.ceil(searchedAnnouncements.length / acnnouncementsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">
          Corporate Announcement Listing
        </h6>
        <Breadcrumb title="Announcement Listing" parent="Corporate" />
      </div>

      {/* Calculator Modal */}
      <Modal isOpen={viewCalculatePage} show={viewCalculatePage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewCalculatePage(false);
          }}
        >
          Action Calculator
        </ModalHeader>
        <ModalBody>
          <CalculateEntitlement setViewCalculatePage={setViewCalculatePage} />
        </ModalBody>
      </Modal>

      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Announcement
        </ModalHeader>
        <ModalBody>
          <AddAnnouncement setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Announcement Edit
        </ModalHeader>
        <ModalBody>
          <EditAnnouncement setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Announcement View
        </ModalHeader>
        <ModalBody>
          <ViewAnnouncement />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
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
                          // console.log(e.target.value);
                          setCriteria(e.target.value);
                        }}
                      >
                        <option value="">Select Criteria</option>
                        <option value="id">Announcement Id</option>
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
                              : criteria == "id"
                                ? `Search by Announcement Id`
                                : criteria == "company"
                                  ? `Search by Company`
                                  : `Search by Company`
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
                </form>
            </div>
            <div className='d-flex justify-content-end mb-3'>
              <div className="btn-group mr-3">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // for modal
                    history.push("/corporate-action-calculator")
                  }}
                >
                 Action Calculator
                </button>
              </div>
              {crudFeatures[0] && (
                <div className="btn-group">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      // for modal
                      setViewAddPage(true);
                    }}
                  >
                    <i className="fa fa-plus mr-1"></i>Add Announcement
                  </button>
                </div>
              )}
            </div>
            {(announcement_data_loading === true ||
              companies_data_loading === true) && <Spinner />}
            {announcement_data_loading === false &&
              companies_data_loading === false &&
              companies.length !== 0 &&
              announcements.length !== 0 && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>Announcement Date</th>
                        <th>Announcement Id </th>
                        <th>Bonus Percent</th>
                        <th>Symbol</th>
                        <th>Company</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>{displayAcnnouncementsPerPage}</tbody>
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
            {announcement_data_loading === false &&
              announcements.length === 0 && (
                <p className="text-center">
                  <b>Announcement Data not Available</b>
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
    </Fragment >
  );
}
