import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { getShares } from "../../../store/services/shareholder.service";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AddShare from "./addShare";
import EditShare from "./editShare";
// import ViewShare from './viewShare';

export default function ShareListing() {
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);

  let history = useHistory();
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const getAllShares = async () => {
      try {
        const response = await getShares(email);
        if (response.data.status === 200) setData(response.data.data);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Share Listing Not Found");
      }
    };
    // end amc dropdown
    getAllShares();
  }, []);
  return (
    <Fragment>
      <Breadcrumb title="Public Offering" parent="Shareholdings" />
      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Public Offering
        </ModalHeader>
        <ModalBody>
          <AddShare setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Public Offering Edit
        </ModalHeader>
        <ModalBody>
          <EditShare setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5>Public Offering</h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // for modal
                    setViewAddPage(true);
                  }}
                >
                  <i className="fa fa-plus mr-1"></i> Add Public Offering
                </button>
              </div>
              <div className="table-responsive">
                <table className="table  ">
                  <thead>
                    <tr>
                      {/* {UsersTableHeader.map((items,i) => 
                                                      <th key={i}>{items}</th>
                                                  )} */}
                      <th>Symbol</th>
                      <th>Quantity</th>
                      <th>Doc Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data &&
                      data.map((item, i) => (
                        <tr key={i}>
                          <td>{item.symbol}</td>
                          <td>{item.quantity}</td>
                          <td>
                            <span className="status-icon bg-success"></span>
                            {item.doc_type}
                          </td>

                          <td>
                            {/* <i className="fa fa-pencil" style={{ width: 35, fontSize: 16, padding: 11, color: 'rgb(40, 167, 69)' }}></i> */}

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
                                  "selectedShare",
                                  JSON.stringify(item)
                                );
                              }}
                            ></i>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {data.length === 0 && (
                  <p className="text-center mt-4 mb-2">
                    There are no records to display
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
