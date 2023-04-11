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
import { EditStatuarRequirment } from "./editStatuarRequirment";
import { AddStatuaryRequirment } from "./addStatuaryRequirment";
import { ViewRequirment } from "./viewRequirment";
import { getPaginatedRequirmentData } from "../../../store/services/company.service";
import { DisplayFormsData } from "./displayFormsData";
import styled from "styled-components";
import Dropdown from "components/common/dropdown";
import { AiTwotoneFilePdf } from "react-icons/ai";
import { StatutoryForm28 } from "./StatutoryForm28";
import { StatutoryForm3 } from "./StatutoryForm3";
import { StatutoryForm3A } from "./StatutoryForm3A";
import { StatutoryForm45 } from "./statutoryForm45";
import { StatutoryForm26 } from "./StatutoryForm26";
import { StatutoryForm4 } from "./StatutoryForm4";
import { StatutoryForm5 } from "./StatutoryForm5";
import { StatutoryForm8 } from "./StatutoryForm8";
import { StatutoryForm7 } from "./StatutoryForm7";
export default function StatuaryRequirments() {
  const baseEmail = sessionStorage.getItem("email") || "";
  // Selector STARTS
  // const companies = useSelector((data) => data.Companies);
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [companyCodeSearch, setCompanyCodeSearch] = useState(false);
  const [companyNameSearch, setCompanyNameSearch] = useState(true);
  const [parentCompanySearch, setParentCompanySearch] = useState(false);

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewAddRequirment, setViewAddRequirment] = useState(false);
  const [editRequirment, setEditRequirment] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [searchedCompanies, setSearchedCompanies] = useState([]);
  const [company_options, setCompany_options] = useState([]);
  // new pagination server side
  const [currentPage, setCurrentPage] = useState();
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState();
  const [hasNextPage, setHasNextPage] = useState();
  const [hasPrevPage, setHasPrevPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [criteria, setCriteria] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [showFormDesign, setShowFormDesign] = useState(false)

  const [formData, setFormData] = useState(null)
  // new pagination end

  let history = useHistory();
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [isLoadingRequirment, setLoadingRequirment] = useState(false);
  const [statuaryRequirment, setStatuaryRequirments] = useState([])
  const [form29Template, setForm29Template] = useState(false)
  const [formATemplate, setFormATemplate] = useState(false)
  const [form28Template, setForm28Template] = useState(false)
  const [form3Template, setForm3Template] = useState(false)
  const [form3ATemplate, setForm3ATemplate] = useState(false)
  const [form45Template, setForm45Template] = useState(false)
  const [form26Template, setForm26Template] = useState(false)
const [form4Template, setForm4Template] = useState(false)
const [form5Template, setStatutoryForm5Template] = useState(false)
const [form8Template, setForm8Template] = useState(false)
const [form7Template, setForm7Template] = useState(false)
  const getPaginatedRequirment = async (pagenum) => {
    setLoadingRequirment(true);
    try {
      const response = await getPaginatedRequirmentData(
        baseEmail,
        pagenum,
        "10",
        // search
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

        setStatuaryRequirments(parents);
        setLoadingRequirment(false);
      }
    } catch (error) {
      setLoadingRequirment(false);
    }
  };
  useEffect(() => {
    getPaginatedRequirment(nextPage);
  }, []);


  const displayStatuaryRequirmentPerPage = statuaryRequirment.map((item, i) => (
    <tr key={i}>
      <td>{item?.company_type || ''}</td>
      <td>{item.title || ''}</td>
      <td>{item?.level || ''}</td>
      <td>{item?.regulations || ''}</td>
      <td>{item?.frequency || ''}</td>
      {/* <td>{item?.notify_days}</td> */}
      <td>{item?.notify_days}</td>

      <td style={{ maxWidth: '80px' }}>

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
            id="RequirmentView"
            data-placement="top"
            onClick={() => {
              const obj = JSON.parse(JSON.stringify(item));
              setViewFlag(true);
              sessionStorage.setItem(
                "selectedrequirment",
                JSON.stringify(obj)
              );
            }}
          ></i>
          <UncontrolledTooltip placement="top" target="RequirmentView">
            {"View Requirment's Detail"}
          </UncontrolledTooltip>
        </>


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
              const obj = JSON.parse(JSON.stringify(item));
              setEditRequirment(true);
              sessionStorage.setItem(
                "selectedrequirment",
                JSON.stringify(obj)
              );
            }}
          ></i>
          <UncontrolledTooltip placement="top" target="companyEdit">
            {"Edit Requirment's Detail"}
          </UncontrolledTooltip>
        </>

      </td>

    </tr>
  ));
  const ViewForm29 = () => {
    setShowFormDesign(true)
    setForm29Template(true)
  }
  const ViewFormA = () => {
    setShowFormDesign(true)
    setFormATemplate(true)
  }
  const ViewForm28 = () => {
    setShowFormDesign(true)
    setForm28Template(true)
  }
  const ViewForm3 = () => {
    setShowFormDesign(true)
    setForm3Template(true)
  }
  const ViewForm3A = () => {
    setShowFormDesign(true)
    setForm3ATemplate(true)
  }
  const ViewForm45 = () => {
    setShowFormDesign(true)
    setForm45Template(true)
  }
  const ViewForm26 = () => {
    setShowFormDesign(true)
    setForm26Template(true)
  }
  const ViewForm4=()=>{
    setShowFormDesign(true)
    setForm4Template(true)
  }
  const ViewForm5=()=>{
    setShowFormDesign(true)
    setStatutoryForm5Template(true)
  }
  const ViewForm8=()=>{
    setShowFormDesign(true)
    setForm8Template(true)
  }
  const ViewForm7=()=>{
    setShowFormDesign(true)
    setForm7Template(true)
  }
  const list = [
    {
      function: ViewForm29,
      title: "Form 29",
    },
    {
      function: ViewFormA,
      title: "Form A",
    },
    {
      function: ViewForm28,
      title: "Form 28",
    },
    {
      function: ViewForm3,
      title: "Form 3",
    },
    {
      function: ViewForm3A,
      title: "Form 3A",
    },
    {
      function: ViewForm45,
      title: "Form 45",
    },
    {
      function: ViewForm26,
      title: "Form 26",
    },
    {
      function: ViewForm4,
      title: "Form 4",
    },
    {
      function: ViewForm5,
      title: "Form 5",
    },
    {
      function: ViewForm8,
      title: "Form 8",
    },
    {
      function: ViewForm7,
      title: "Form 7",
    },

    

  ];


  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Statutory Requirement Listing</h6>
        <Breadcrumb title="Statutory Requirement Listing" parent="Statutory" />
      </div>
      {/* Add Modal */}
      {/* <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
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
      </Modal> */}
      {/* alert code design */}

      <Modal isOpen={viewAddRequirment} show={viewAddRequirment.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddRequirment(false);
          }}
        >
          Add Statutory Requirement
        </ModalHeader>
        <ModalBody>
          <AddStatuaryRequirment getPaginatedRequirment={getPaginatedRequirment} setViewAddRequirment={setViewAddRequirment} />

        </ModalBody>
      </Modal>
      <Modal isOpen={showFormDesign} show={showFormDesign.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setShowFormDesign(false);
            setForm29Template(false);
            setForm28Template(false)
            setForm3ATemplate(false)
            setFormATemplate(false)
            setForm45Template(false)
            setForm4Template(false)
            setStatutoryForm5Template(false)
            setForm8Template(false)
            setForm26Template(false)

          }}
        >

        </ModalHeader>
        <ModalBody>
          {form28Template ? <StatutoryForm28 formTemplate={form28Template} /> :
          form3Template? <StatutoryForm3 formTemplate={form3Template}/>:
          form3ATemplate ? <StatutoryForm3A formTemplate={form3ATemplate}/> :
          form45Template ? <StatutoryForm45 formTemplate={form45Template}/>:
          form26Template ? <StatutoryForm26 formTemplate={form26Template}/>:
          form4Template ? <StatutoryForm4  formTemplate={form4Template}/>:
          form5Template ? <StatutoryForm5  formTemplate={form5Template}/>:
          form8Template ? <StatutoryForm8  formTemplate ={form8Template}/>:
          form7Template ? <StatutoryForm7 formTemplate ={form7Template}/>:
          <DisplayFormsData formATemplate={formATemplate} viewTemplate={form29Template} data={formData} setShowFormDesign={setShowFormDesign} />
          }
        </ModalBody>
      </Modal>

      {/* alert code design */}
      {/* Edit Modal */}
      <Modal isOpen={editRequirment} show={editRequirment.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setEditRequirment(false);
          }}
        >
          Statutory Requirement Edit
        </ModalHeader>
        <ModalBody>
          <EditStatuarRequirment getPaginatedRequirment={getPaginatedRequirment} setEditRequirment={setEditRequirment} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
        Statutory Requirement View
        </ModalHeader>
        <ModalBody>
          <ViewRequirment />
        </ModalBody>
      </Modal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">

                  <div className="col-md-8" />
                  <div className="btn-group">
                    <Dropdown
                      button_color_class={"btn-success"}
                      header={"View Template"}
                      isRequirment = {true}
                      list={list}
                    >
                      <i className="fa fa-file-excel-o mr-1"></i>
                    </Dropdown>
                  </div>


                  <div>
                    {/* <> <button
                    id="viewform"
                        className="btn btn-primary btn-sm ml-2"
                        onClick={()=>{
                          setShowFormDesign(true)
                        }}
                      >
View Template
                        </button>
                        <UncontrolledTooltip  placement="top" target="viewform">
                {'View Form 29' }
              </UncontrolledTooltip></> */}
                    <button
                      className="btn btn-primary btn-sm ml-2"
                      onClick={() => {
                        setViewAddRequirment(true);
                      }}
                    >
                      Add Requirement
                    </button>
                    {/* )} */}
                  </div>
                </div>

              </div>
              {isLoadingRequirment === true && <Spinner />}
              {isLoadingRequirment === false && statuaryRequirment.length !== 0 && (
                <div className="table-responsive">
                  <TableWrapper className="table  ">
                    <thead>
                      <tr>
                        <th>Company Type</th>
                        <th>Title </th>
                        <th>Level</th>
                        <th>Regulation</th>
                        <th>Frequency </th>
                        <th>Notify Days </th>
                        {/* <th>Notify Days </th> */}
                        <th style={{ maxWidth: '80px' }}>Action</th>

                      </tr>
                    </thead>

                    <tbody>{displayStatuaryRequirmentPerPage}</tbody>
                  </TableWrapper>
                  <center className="d-flex justify-content-center py-3">
                    <nav className="pagination">
                      {hasPrevPage && (
                        <button
                          className="btn btn-primary btn-sm mx-1"
                          onClick={() => getPaginatedRequirment(prevPage)}
                        >
                          <span>{"Prev"}</span>
                        </button>
                      )}
                      {hasNextPage && (
                        <button
                          className="btn btn-secondary btn-sm mx-1"
                          onClick={() => getPaginatedRequirment(nextPage)}
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
              {isLoadingRequirment === false && statuaryRequirment.length === 0 && (
                <p className="text-center">
                  <b>Statutory Requeriment Data not available</b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
const TableWrapper = styled.table`

.table td::nth-last-child(8){
  max-width: 80px !important;
}
`;