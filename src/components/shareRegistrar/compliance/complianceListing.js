import React, { Fragment, useState, useEffect } from "react";

import Breadcrumb from "../../common/breadcrumb";
import { getCompliance } from "../../../store/services/compliance.service";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AddCompliance from "./addCompliance";
import EditCompliance from "./editCompliance";
import ViewCompliance from "./viewCompliance";

export default function ComplianceListing() {
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);

  let history = useHistory();
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const getAllCompliance = async () => {
      try {
        const response = await getCompliance(email);

        setData(response.data.data);
      } catch (error) {
        toast.error(`${error.response.data.message}`);
      }
    };
    // end amc dropdown
    getAllCompliance();
  }, []);
  return (
    <Fragment>
      <Breadcrumb title="Compliance Listing" parent="Compliances" />
      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Compliance
        </ModalHeader>
        <ModalBody>
          <AddCompliance setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Compliance Edit
        </ModalHeader>
        <ModalBody>
          <EditCompliance setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Compliance View
        </ModalHeader>
        <ModalBody>
          <ViewCompliance />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5>Compliance Listing</h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // for modal
                    setViewAddPage(true);
                  }}
                >
                  <i className="fa fa-plus mr-1"></i> Add Compliance
                </button>
              </div>
              <div className="table-responsive">
                <table className="table  ">
                  <thead>
                    <tr>
                      {/* {UsersTableHeader.map((items,i) => 
                                                              <th key={i}>{items}</th>
                                                          )} */}

                      <th>Action Date</th>
                      <th>Role ID</th>
                      <th>Serial No</th>
                      <th>Item</th>
                      <th>Compliant</th>
                      <th>Not Compliant</th>
                      <th>Doc Type</th>

                      <th>Action </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data &&
                      data.map((item, i) => (
                        <tr key={i}>
                          <td>{item.action_date}</td>
                          <td>{item.role_id}</td>
                          <td>
                            <span className="status-icon bg-success"></span>
                            {item.serial_no}
                          </td>
                          <td>{item.item}</td>
                          <td>{item.compliant}</td>
                          <td>{item.not_compliant}</td>
                          <td>{item.doc_type}</td>
                          <td>
                            {/* <i className="fa fa-pencil" style={{ width: 35, fontSize: 16, padding: 11, color: 'rgb(40, 167, 69)' }}></i> */}

                            <i
                              className="fa fa-eye"
                              style={{
                                width: 35,
                                fontSize: 16,
                                padding: 11,
                                color: "#4466F2",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                // for modal4
                                setViewFlag(true);
                                sessionStorage.setItem(
                                  "selectedCompliance",
                                  JSON.stringify(item)
                                );
                              }}
                            ></i>
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
                                  "selectedCompliance",
                                  JSON.stringify(item)
                                );
                              }}
                            ></i>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {data.length == 0 && (
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
