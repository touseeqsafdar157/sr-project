import React, { Fragment, useState, useEffect } from "react"; 
import Breadcrumb from "../../../common/breadcrumb";
import { getProcessChecklist } from "../../../../store/services/checklist.service";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AddChecklist from './addChecklist';
import EditChecklist from './editChecklist';

export default function ChecklistListing() {
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  let history = useHistory();
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const getAllChecklist = async () => {
      try {
        const response = await getProcessChecklist(email);
        setData(response.data.data);
      } catch (error) {
        toast.error(`All Companies List ${error.response.data.message}`);
      }
    };
    // end amc dropdown
    getAllChecklist();
  }, []);
  return (
    <Fragment>
    <Breadcrumb title="Process Checklist Listing" parent="Checklist" />
     {/* Add Modal */}
     <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Process Checklist
        </ModalHeader>
        <ModalBody>
          <AddChecklist setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Checklist Process Edit
        </ModalHeader>
        <ModalBody>
          <EditChecklist setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5>Process Checklist Listing</h5> 
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // for modal
                    setViewAddPage(true);
                  }}
                >
                  <i className="fa fa-plus mr-1"></i> Add Process Checklist
                </button>

              </div>
              <div className="table-responsive">
                <table className="table  ">
                  <thead>
                    <tr>
                      {/* {UsersTableHeader.map((items,i) => 
                                                      <th key={i}>{items}</th>
                                                  )} */}
                      <th>Checklist id</th>
                      <th>Txn Type </th>

                      <th>Checklist Title</th>
                      <th>Active</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data &&
                      data.map((item, i) => (
                        <tr key={i}>
                          <td>{item.checklist_id}</td>
                          <td>{item.txn_type}</td>

                          <td>
                            <span className="status-icon bg-success"></span>
                            {item.check_list_title}
                          </td>
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
                                  "selectedProcessChecklist",
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
