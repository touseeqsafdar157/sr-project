import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import axios from "axios";
import { useSelector } from "react-redux";
import { listCrud } from "../../../../src/utilities/utilityFunctions";
import { ToastContainer, toast } from "react-toastify";
import { getRoles } from "../../../store/services/role.service";
import { useHistory } from "react-router";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import EditRole from "./editRole";
import ViewRole from "./viewRole";

import RoleAdd from "./addRole";
import { getvalidDateDMY } from "../../../utilities/utilityFunctions";

export default function RoleListing() {
  const features = useSelector((data) => data.Features).features;
  const roles = useSelector((data) => data.Roles);
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [data, setData] = useState([]);
  let history = useHistory();
  const [viewFlag, setViewFlag] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
      <h6 className="text-nowrap mt-3 ml-3">Roles</h6>
      <Breadcrumb title="Role Listing" parent="Role Management" />
      </div>

      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Role View
        </ModalHeader>
        <ModalBody>
          <ViewRole />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Edit User Role
        </ModalHeader>
        <ModalBody>
          <EditRole setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>
      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Role
        </ModalHeader>
        <ModalBody>
          <RoleAdd setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>

      <div className="col-md-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h5></h5>
            {crudFeatures[0] && (
              <button
                disabled={Loading ? true : false}
                className="btn btn-primary btn-sm"
                onClick={() => {
                  // for modal
                  setViewAddPage(true);
                }}
              >
                <i className="fa fa-plus mr-1"></i> Add Role
              </button>
            )}
          </div>
          {roles.roles_data_loading && !roles.roles_data.length && (
            <div className="row d-flex justify-content-center">
              <div className="col-md-6">
                <center>
                  <h6 className="mb-0 text-nowrap">
                    <b>{"Please Wait"}</b>
                  </h6>
                  <div className="d-flex justify-content-center">
                    <div className="loader-box mx-auto">
                      <div className="loader">
                        <div className="line bg-primary"></div>
                        <div className="line bg-primary"></div>
                        <div className="line bg-primary"></div>
                        <div className="line bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </center>
              </div>
            </div>
          )}
          {!roles.roles_data_loading && roles.roles_data.length > 0 && (
            <div className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap">
                <thead>
                  <tr>
                    <th>{"Role Name"}</th>
                    <th>{"Doc Type"}</th>
                    <th>{"Created At"}</th>
                    <th>{"Description"}</th>
                    <th>{"Status"}</th>
                    <th>{"Action"}</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.roles_data.map((role, i) => (
                    <tr key={i}>
                      <td>{role.role_name}</td>
                      <td>{role.doc_type}</td>
                      <td>
                        <span className="status-icon bg-success"></span>
                        {getvalidDateDMY(role.created_at)}
                      </td>
                      <td>{role.description}</td>
                      <td>{role.status}</td>
                      <td className="text-nowrap">
                        {crudFeatures[1] && (
                          <i
                            className="fa fa-eye"
                            style={{
                              width: 35,
                              fontSize: 16,
                              padding: 11,
                              color: "rgb(68, 102, 242)",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              // for modal
                              setViewFlag(true);
                              sessionStorage.setItem(
                                "selectedRole",
                                JSON.stringify(role)
                              );
                            }}
                          ></i>
                        )}

                        <i
                          className="fa fa-pencil"
                          style={{
                            width: 35,
                            fontSize: 16,
                            padding: 11,
                            color: "rgb(40, 167, 69)",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // for modal
                            setViewEditPage(true);
                            sessionStorage.setItem(
                              "selectedRole",
                              JSON.stringify(role)
                            );
                          }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {roles.roles_data_loading === false &&
                roles.roles_data.length === 0 && (
                  <p className="text-center">
                    <b>Roles Data not available</b>
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
