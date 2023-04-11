import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { getCharges } from "../../../store/services/charges.service";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AddCharges from "./addCharges";
import EditCharges from "./editCharges";

export default function ChargesListing() {
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  let history = useHistory();
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const getAllCharges = async () => {
      try {
        const response = await getCharges(email);
        setData(response.data.data);
      } catch (error) {
        toast.error(` ${error.response.data.message}`);
      }
    };

    getAllCharges();
  }, []);
  return (
    <Fragment>
      <Breadcrumb title="Charges Listing" parent="Charges" />
      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Charges
        </ModalHeader>
        <ModalBody>
          <AddCharges setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Charges Edit
        </ModalHeader>
        <ModalBody>
          <EditCharges setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5>Charges Listing</h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // for modal
                    setViewAddPage(true);
                  }}
                >
                  <i className="fa fa-plus mr-1"></i> Add Charges
                </button>
              </div>
              <div className="table-responsive">
                <table className="table  ">
                  <thead>
                    <tr>
                      {/* {UsersTableHeader.map((items,i) => 
                                                      <th key={i}>{items}</th>
                                                  )} */}
                      <th>Title</th>
                      <th>Percentage </th>

                      <th>Applicable On</th>
                      <th>Reference</th>
                      <th>Active</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data &&
                      data.map((item, i) => (
                        <tr key={i}>
                          <td>{item.title}</td>
                          <td>{item.percentage}</td>
                          <td>
                            <span className="status-icon bg-success"></span>
                            {item.applicable_on}
                          </td>
                          <td>{item.Reference}</td>

                          <td>{item.active}</td>

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
                                  "selectedCharges",
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
