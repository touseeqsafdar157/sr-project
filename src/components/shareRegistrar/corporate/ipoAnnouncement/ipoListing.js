import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "components/common/breadcrumb";
import { getCorporateAnnouncement } from "store/services/corporate.service";
import { useSelector } from "react-redux";
import { listCrud } from "utilities/utilityFunctions";
import { useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import EditAnnouncement from "components/shareRegistrar/corporate/announcement/editAnnouncement";
import ViewAnnouncement from "components/shareRegistrar/corporate/announcement/viewAnnouncement";
import { getFoundObject } from "utilities/utilityFunctions";

import Spinner from "components/common/spinner";
import AddIPOAnnouncement from "./addIPOAnnouncement";

export default function IPOListing() {
  const features = useSelector((data) => data.Features).features;
  const announcements = useSelector((data) => data.Announcements);
  const companies = useSelector((data) => data.Companies);
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
  // useEffect(() => {
  //   if (features.length !== 0) setCrudFeatures(listCrud(features));
  // }, [features]);
  let history = useHistory();

  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const acnnouncementsPerPage = 10;
  const pagesVisited = pageNumber * acnnouncementsPerPage;
  const totalnumberofPages = 100;
  const displayAcnnouncementsPerPage = !search
    ? announcements.announcement_data
        .sort((a, b) => {
          if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
            return -1;
          if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
            return 1;
          return 0;
        })
        .slice(pagesVisited, pagesVisited + acnnouncementsPerPage)
        .map((item, i) => (
          <tr key={i}>
            <td>{item.announcement_date}</td>
            <td>{item.announcement_id}</td>
            <td>{item.bonus_percent}</td>
            <td>{item.symbol}</td>
            <td>
              {
                companies.companies_data.find(
                  (comp) => comp.code === item.company_code
                )?.company_name
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
                          companies.companies_dropdown,
                          obj.company_code
                        );
                        obj.symbol = getFoundObject(
                          companies.companies_symbol_dropdown,
                          obj.symbol
                        );
                        obj.period = getFoundObject(period_options, obj.period);
                        // for modal
                        setViewFlag(true);
                        sessionStorage.setItem(
                          "selectedCorporateAnnouncement",
                          JSON.stringify(obj)
                        );
                      }}
                    ></i>
                    <UncontrolledTooltip
                      placement="top"
                      target="viewAnnouncement"
                    >
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
                          companies.companies_dropdown,
                          obj.company_code
                        );
                        obj.symbol = getFoundObject(
                          companies.companies_symbol_dropdown,
                          obj.symbol
                        );
                        obj.period = getFoundObject(period_options, obj.period);
                        // for modal
                        setViewEditPage(true);
                        sessionStorage.setItem(
                          "selectedCorporateAnnouncement",
                          JSON.stringify(obj)
                        );
                      }}
                    ></i>
                    <UncontrolledTooltip
                      placement="top"
                      target="editAnnouncement"
                    >
                      {"Edit Announcement's Detail"}
                    </UncontrolledTooltip>
                  </>
                )}
              </td>
            )}
          </tr>
        ))
    : searchedAnnouncements
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
        .slice(pagesVisited, pagesVisited + acnnouncementsPerPage)
        .map((item, i) => (
          <tr key={i}>
            <td>{item.announcement_date}</td>
            <td>{item.announcement_id}</td>
            <td>{item.bonus_percent}</td>
            <td>{item.symbol}</td>
            <td>
              {
                companies.companies_data.find(
                  (comp) => comp.code === item.company_code
                )?.company_name
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
                          companies.companies_dropdown,
                          obj.company_code
                        );
                        obj.symbol = getFoundObject(
                          companies.companies_symbol_dropdown,
                          obj.symbol
                        );
                        obj.period = getFoundObject(period_options, obj.period);
                        // for modal
                        setViewEditPage(true);
                        sessionStorage.setItem(
                          "selectedCorporateAnnouncement",
                          JSON.stringify(obj)
                        );
                      }}
                    ></i>
                    <UncontrolledTooltip
                      placement="top"
                      target="viewAnnouncement"
                    >
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
                          companies.companies_dropdown,
                          obj.company_code
                        );
                        obj.symbol = getFoundObject(
                          companies.companies_symbol_dropdown,
                          obj.symbol
                        );
                        obj.period = getFoundObject(period_options, obj.period);
                        // for modal
                        setViewEditPage(true);
                        sessionStorage.setItem(
                          "selectedCorporateAnnouncement",
                          JSON.stringify(obj)
                        );
                      }}
                    ></i>
                    <UncontrolledTooltip
                      placement="top"
                      target="editAnnouncement"
                    >
                      {"Edit Announcement's Detail"}
                    </UncontrolledTooltip>
                  </>
                )}
              </td>
            )}
          </tr>
        ));
  const pageCount = !search
    ? Math.ceil(announcements.announcement_data.length / acnnouncementsPerPage)
    : Math.ceil(searchedAnnouncements.length / acnnouncementsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  return (
    <Fragment>
      <Breadcrumb title="IPO Announcement Listing" parent="Corporate" />
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
          <AddIPOAnnouncement setViewAddPage={setViewAddPage} />
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
                <h5>IPO Announcement Listing</h5>
                {crudFeatures[0] && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      // for modal
                      setViewAddPage(true);
                    }}
                  >
                    <i className="fa fa-plus mr-1"></i>Add Announcement
                  </button>
                )}
              </div>
              {(announcements.announcement_data_loading === true ||
                companies.companies_data_loading === true) && <Spinner />}
              {announcements.announcement_data_loading === false &&
                companies.companies_data_loading === false &&
                companies.companies_data.length !== 0 &&
                announcements.announcement_data.length !== 0 && (
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
              {announcements.announcement_data_loading === false &&
                announcements.announcement_data.length === 0 && (
                  <p className="text-center">
                    <b>Announcement Data not Available</b>
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
