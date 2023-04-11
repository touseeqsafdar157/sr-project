import React, { Fragment, useState, useEffect } from "react"; 
import Breadcrumb from "../../../common/breadcrumb";
import { getChecklistItems } from "../../../../store/services/checklist.service";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AddChecklistItem from './addChecklistItem';
import EditChecklistItem from './editChecklistItem';
import ViewChecklistItem from './viewChecklistItem';

export default function ChecklistItemListing() {
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);

  let history = useHistory();
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const getAllChecklistItems = async () => {
      try {
        const response = await getChecklistItems(email);
        setData(response.data.data);
      } catch (error) {
        toast.error(` ${error.response.data.message}`);
      }
    };
    // end amc dropdown
    getAllChecklistItems();
  }, []);
  return (
    <Fragment>
      <Breadcrumb title="Process Checklist Item Listing" parent="Checklist" />

      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Checklist Item
        </ModalHeader>
        <ModalBody>
          <AddChecklistItem setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Checklist Item Edit
        </ModalHeader>
        <ModalBody>
          <EditChecklistItem setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Checklist Item View
        </ModalHeader>
        <ModalBody>
          <ViewChecklistItem />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5>Checklist Item Listing</h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // for modal
                    setViewAddPage(true);
                  }}
                >
                  <i className="fa fa-plus mr-1"></i> Add CheckList Item
                </button>
              </div>
              <div className="table-responsive">
                <table className="table  ">
                  <thead>
                    <tr>
                      {/* {UsersTableHeader.map((items,i) => 
                                                      <th key={i}>{items}</th>
                                                  )} */}
                      <th>Item id</th>
                      <th>Checklist Id </th>

                      <th>Txn Type</th>
                      <th>Serial No.</th>
                      <th>Created Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data &&
                      data.map((item, i) => (
                        <tr key={i}>
                          <td>{item.item_id}</td>
                          <td>{item.checklist_id}</td>
                          <td>
                            <span className="status-icon bg-success"></span>
                            {item.txn_type}
                          </td>
                          <td>{item.serial_no}</td>
                          <td>{item.created_date}</td>

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
                                // for modal
                                setViewFlag(true);
                                sessionStorage.setItem(
                                  "selectedChecklistItem",
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
                                  "selectedChecklistItem",
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
