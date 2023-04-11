import React, { Fragment, useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import {getUBO} from "../../../store/services/shareholder.service";
import AddUBO from "./addUBO";
import EditUBO from "./editUBO";
import ViewUBO from "./viewUBO";
import Spinner from "components/common/spinner";
import {
    findArrayObjcetBy,
    generateExcel,
    getvalidDateDMonthY,
    getvalidDateDMY,
    listCrud,
  } from "../../../utilities/utilityFunctions";
import { numberWithCommas } from "../../../utilities/utilityFunctions";

export default function UboListing() {
    // states
    const [pageNumber, setPageNumber] = useState(0);
    const uboPerPage = 7;
    const pagesVisited = pageNumber * uboPerPage;
    const features = useSelector((data) => data.Features).features;
    const [data, setData] = useState([]);
    const [crudFeatures, setCrudFeatures] = useState([true, true, true]);
    const [isLoading, setIsLoading] = useState(false);
    const [UBOLoading, setUBOLoading] = useState(false);
    const [viewEditPage, setViewEditPage] = useState(false);
    const [viewAddPage, setViewAddPage] = useState(false);
    const [viewPage, setViewPage] = useState(false);
    const pageCount = data
    ? Math.ceil(data.length / uboPerPage)
    : ""
    const changePage = ({ selected }) => {
      setPageNumber(selected);
    };
        // holder
        let holder =
        JSON.parse(sessionStorage.getItem("selectedShareholder")) || "";
    useEffect(() => {
        if (features.length !== 0) setCrudFeatures(listCrud(features));
      }, [features]);

      const getAllUBO = async () => {
        setIsLoading(true);
        const email = sessionStorage.getItem("email");
        try {
          const response = await getUBO(email);
            setData(response.data.data.filter((item)=> {
              return item.folio_number===holder.folio_number}));
          
          setIsLoading(false)
        } catch (error) {
          !!error?.response?.data?.message
            ? toast.error(error?.response?.data?.message)
            : toast.error("UBO Not Found");
            setIsLoading(false);
        }
      };
      const getAllUpdatedUBO = async () => {
        setIsLoading(true);
        const email = sessionStorage.getItem("email");
        try {
          const response = await getUBO(email);
          setTimeout(()=>{
            setData(response.data.data.filter((item)=> {
              return item.folio_number===holder.folio_number}));
          },3000)
          
          setIsLoading(false)
        } catch (error) {
          !!error?.response?.data?.message
            ? toast.error(error?.response?.data?.message)
            : toast.error("UBO Not Found");
            setIsLoading(false);
        }
      };
    useEffect(() => {
      getAllUBO();
    }, []);
    useEffect(() => {
      if(viewAddPage===false) {
        getAllUpdatedUBO();
      }

    }, [viewAddPage])

    useEffect(() => {
      if(viewEditPage==false) {
        getAllUpdatedUBO();
      }

    }, [viewEditPage])
    const displayUBOPerPage = data
    .slice(pagesVisited, pagesVisited + uboPerPage)
    .map((user) => {
      return (
        <tr>
           <td>{user.cnic || user.ntn}</td>
          <td>{user.name}</td>
          <td className="text-right">{numberWithCommas(user.no_of_shares)}</td>
          <td className="text-right">{numberWithCommas(user.percentage_shares)}</td>
          {(crudFeatures[1] || crudFeatures[2]) && (
                
                <td>
                   {crudFeatures[2] && (
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
                        id="UBOView"
                          onClick={() => {
                            // for modal
                            setViewPage(true);
                            sessionStorage.setItem('singleUBO', JSON.stringify(user))
                          }}
                      ></i>
                      <UncontrolledTooltip
                        placement="top"
                        target="UBOView"
                      >
                        {"View UBO's Detail"}
                      </UncontrolledTooltip>
                    </>
                  )}
                  {crudFeatures[1] && (
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
                        id="uboEdit"
                        onClick={() => {
                          // for modal
                          setViewEditPage(true);
                          sessionStorage.setItem('singleUBO', JSON.stringify(user))
                        }}
                      ></i>
                      <UncontrolledTooltip
                        placement="top"
                        target="uboEdit"
                      >
                        {"Edit UBO's Detail"}
                      </UncontrolledTooltip>
                    </>
                  )}    
                </td>
              )}
          <div>
          </div>
        </tr>
      )
  
    })
  return (
    <div>
      <Fragment>
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="lg">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add UBO
        </ModalHeader>
        <ModalBody>
          <AddUBO setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="lg">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Edit UBO
        </ModalHeader>
        <ModalBody>
          <EditUBO setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>
      <Modal isOpen={viewPage} show={viewPage.toString()} size="lg">
        <ModalHeader
          toggle={() => {
            setViewPage(false);
          }}
        >
          View UBO
        </ModalHeader>
        <ModalBody>
          <ViewUBO setViewPage={setViewPage} />
        </ModalBody>
      </Modal>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  <h5>UBO Listing</h5>
                  {crudFeatures[0] && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        // for modal
                        setViewAddPage(true);
                      }}
                    >
                      <i className="fa fa-plus mr-1"></i> Add UBO
                    </button>
                  )}
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>
                {isLoading ? <Spinner /> : (
                <div className="table-responsive">
                    <table className="table  ">
                      <thead>
                        <tr>
                          <th>UBO CNIC/NTN</th>
                          <th>UBO Name</th>
                          <th>Number Of Shares</th>
                          <th>Percentage Shares</th>
                          {(crudFeatures[2] || crudFeatures[1]) && (
                            <th>Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>{displayUBOPerPage}</tbody>
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
                     {
                data.length === 0 &&
                (
                  <p className="text-center">
                    <b>UBO Data not available</b>
                  </p>
                )}
      
      </Fragment>
    </div>
  );
};
