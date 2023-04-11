import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  getFoundObject,
  listCrud,
} from "../../../../src/utilities/utilityFunctions";
import { ToastContainer, toast } from "react-toastify";
import { darkStyle, errorStyles } from "../../defaultStyles";
import { getRoles } from "../../../store/services/role.service";
import { useHistory } from "react-router";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { getvalidDateDMY } from "../../../utilities/utilityFunctions";
import { getUsers } from "../../../store/services/user.service";
import EditUser from "./editUser";
import ViewUser from "./viewUser";
import AddUser from "./addUser";
import { getCompanies } from "../../../store/services/company.service";
import { updateUserStatus, searchTransactionLimitData, RefreshTransactionLimit, getPublicKey } from "../../../store/services/user.service";
import Select from "react-select";
// Redux

export default function UserListing() {
  // const features = useSelector((data) => data.Features).features;
  const email = sessionStorage.getItem("email");
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const user_roles = useSelector((data) => data.Roles).roles_dropdown;
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companies_data_loading, setCompanies_data_loading] = useState(false);

  const [data, setData] = useState([]);
  let history = useHistory();
  const [viewFlag, setViewFlag] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [userList, setUserList] = useState([]);
  const [res, setRes] = useState([]);
  const [search, setSearchValue] = useState();
  const [Loading, setLoading] = useState(false);
  const [toggleStatus, setToggleStatus] = useState(false);
  const [status, setStatus] = useState('');
  const [criteria, setCriteria] = useState('name');
  const [user_email, setUser_Email] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [refreshTransactionLimit, setRefreshTransactionLimit] = useState(false);
  const [updateRefreshTransactionLimit, setUpdateRefreshTransactionLimit] = useState(false);

  const [transactionLimits, setTransactionLimits] = useState('');
  const [transactionLimitsLoading, setTransactionLimitsLoading] = useState(false);

  const [public_key, setPublic_Key] = useState('');
  // useEffect(() => {
  //   if (features.length !== 0) setCrudFeatures(listCrud(features));
  // }, [features]);
  const getAllCompanies = async () => {
    setIsLoadingCompany(true);
    try {
      const response = await getCompanies(email)
      if (response.status === 200) {
        const parents = response.data.data
        const companies_dropdowns = response.data.data.map((item) => {
          let label = `${item.code} - ${item.company_name}`;
          return { label: label, value: item.code };
        });
        setCompanies_dropdown(companies_dropdowns);
        // setCompanies(parents)
        setIsLoadingCompany(false)
      }
    } catch (error) {
      setIsLoadingCompany(false);
    }
  };

  useEffect(() => {
    getAllCompanies();
  }, [])

  const getAllUsers = async () => {
    setLoading(true);
    const response = await getUsers(email);
    if (response.data.status === 200) {
      setUserList(response.data.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    // end amc dropdown
    if (viewAddPage === false && viewEditPage === false) getAllUsers();
  }, [viewEditPage, viewAddPage]);

  const updateStatus = async () => {
    try {
      setStatusLoading(true);
      let updatedstatus = ' ';
      if (status == 'active') {
        updatedstatus = 'deactive';
      } else {
        updatedstatus = 'active';
      }
      const response = await updateUserStatus(email, user_email, updatedstatus);
      if (response.status == 200) {
        setTimeout(() => {
          getAllUsers();
        }, 3000);
        toast.success(response.data.message);
        setToggleStatus(false);
      } else {
        toast.error(response.data.message);
      }
      setStatusLoading(false);
    } catch (error) {
      setStatusLoading(false);
      if (error.response !== undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setStatusLoading(false);
  };

  const getEthBalance = async (user_email) => {
    try {
      setTransactionLimitsLoading(true);
      const response = await getPublicKey(email, user_email);
      if (response.status === 200) {
        const resp = await searchTransactionLimitData(email, response.data.public_key);
        if (resp.status === 200) {
          setPublic_Key(response.data.public_key);
          setTransactionLimits(resp.data.balance);
        } else {
          setPublic_Key('');
          setTransactionLimits('');
        }

      }
      setTransactionLimitsLoading(false);
    } catch (error) {
      setTransactionLimitsLoading(false);
      if (error.response !== undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setTransactionLimitsLoading(false);
  }

  const updateTransactionLimitBalance = async () => {
    try {
      setUpdateRefreshTransactionLimit(true);
      const response = await RefreshTransactionLimit(email, public_key);
      if (response.status === 200) {
        setRefreshTransactionLimit(false);
        setUpdateRefreshTransactionLimit(false);
        setTimeout(() => {
          toast.success(response.data.message);

        }, 1000)

      } else {
        toast.error(response.data.message);
      }

      setUpdateRefreshTransactionLimit(false);
    } catch (error) {
      setUpdateRefreshTransactionLimit(false);
      if (error.response !== undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setUpdateRefreshTransactionLimit(false);
  }

  React.useEffect(() => {
    if (userList) {
      let i;
      res.length = 0;
      setRes(res)
      for (i = 0; i < userList.length; i++) {
        res.push(userList[i]);
        setRes(res)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userList]);

  // function myFunction(e, value) {

  //   console.log('userList', userList)
  //   res.length = 0;
  //   setRes(res);
  //   var filter, td, i,com;
  //   filter = value==='company' ? e.value : e.target.value;

  //   for (i = 0; i < userList.length; i++) {
  //     if(value === 'name'){
  //       td = userList[i].name;
  //     }else if(value === 'email'){
  //       td = userList[i].email;
  //     }else if(value === 'company'){
  //       td = userList[i].company_code;
  //     }
  //     // td = value === 'name' ? userList[i].name : userList[i].email;
      
  //     if (td) {
  //       if (td.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
  //         res.push(userList[i]);
  //         setRes(res);
  //       } else {

  //       }
  //     }
  //   }
  // }

  function myFunction(e, value) {
    console.log('userList', userList);
    
    const filterValue = value === 'company' ? e.value : e.target.value;
    const filteredList = userList.filter(user => {
      if (value === 'name') {
        return user.name.toUpperCase().includes(filterValue.toUpperCase());
      } else if (value === 'email') {
        return user.email.toUpperCase().includes(filterValue.toUpperCase());
      } else if (value === 'company') {
        if(user.company_code === e.value){
          console.log('user=>',user)
          return user;
        }
        // console.log('company_data',user.company_code,'===',e.value)
        // return user = user.company_code === e.value ? user : {};
        // const company = companies.find(c => c.code === user.company_code);
        // return company && company.name.toUpperCase().includes(filterValue.toUpperCase());
      }
      return false;
    });
    
    setRes(filteredList);
  }

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Users</h6>
        <Breadcrumb title="User Listing" parent="User Management" />
      </div>

      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="lg">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          User View
        </ModalHeader>
        <ModalBody>
          <ViewUser />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="lg">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Edit User
        </ModalHeader>
        <ModalBody>
          <EditUser setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>
      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="lg">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add User
        </ModalHeader>
        <ModalBody>
          <AddUser setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>

      {/*Active/Deactive Status*/}
      <Modal isOpen={toggleStatus} show={toggleStatus.toString()} size="md">
        <ModalHeader
          toggle={() => {
            setToggleStatus(false);
          }}
        >
          Active / Deactive User
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-sm-12 col-md-12">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>{status == 'active' ? 'Deactive' : 'Active'} User</h5>
                </div>
                <div className="card-body">
                  <span>Are you sure to want <span className="text-info">{status == 'active' ? 'Deactive' : 'Active'}</span> this user?</span>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6 col-md-6">
              <button className="btn btn-primary btn-sm"
                disabled={Boolean(statusLoading)}
                onClick={updateStatus}>
                {statusLoading ? (
                  <>
                    <span className="fa fa-spinner fa-spin"></span>
                    <span>{"Loading..."}</span>
                  </>
                ) : (
                  <span>{"Update"}</span>
                )}
              </button>
            </div>
            <div className="col-sm-6 col-md-6">
              <button className="btn btn-danger btn-sm"
                onClick={(e) => {
                  setToggleStatus(false)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* for refresh balance */}
      <Modal isOpen={refreshTransactionLimit} show={refreshTransactionLimit.toString()} size="md">
        <ModalHeader
          toggle={() => {
            setRefreshTransactionLimit(false);
          }}
        >
          Refesh Limit
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-sm-12 col-md-12">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Transaction Limit</h5>
                </div>
                <div className="card-body">

                  <div className={`form-group my-2`}>
                    <label htmlFor="email">Transaction Limit</label>
                    {
                      transactionLimitsLoading === false ? (
                        <input
                          className="form-control"
                          type="text"
                          value={transactionLimits}
                          readOnly
                        />
                      ) : (
                        <span className="fa fa-spinner fa-spin"></span>
                      )}
                  </div>

                  <div
                    className={`form-group my-2`}
                  >
                    <label htmlFor="email">User Email</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Email"
                      value={user_email}
                      readOnly
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6 col-md-6">
              <button className="btn btn-primary btn-sm"
                disabled={Boolean(updateRefreshTransactionLimit)}
                onClick={updateTransactionLimitBalance}>
                {updateRefreshTransactionLimit ? (
                  <>
                    <span className="fa fa-spinner fa-spin"></span>
                    <span>{"Loading..."}</span>
                  </>
                ) : (
                  <span>{"Update"}</span>
                )}
              </button>
            </div>
            <div className="col-sm-6 col-md-6">
              <button className="btn btn-danger btn-sm"
                onClick={(e) => {
                  setRefreshTransactionLimit(false)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <div className="col-md-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <div className="d-flex justify-content-start col-sm-10">
              <div className="col-sm-2">
                <div className="form-group">
                  <select
                    name="search_criteria"
                    className={`form-control`}
                    onChange={(e) => {
                      setCriteria(e.target.value);
                      setRes(userList);
                      setSearchValue('');
                    }}
                  >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="company">Company</option>
                  </select>
                </div>
              </div>
              {(criteria == "email" || criteria == "") && (
                <div className="col-sm-5">
                  <div className="form-group">
                    <input
                      id="search"
                      className="form-control"
                      type="text"
                      placeholder={
                        criteria == "" || !criteria
                          ? `Select Criteria`
                          : `Search by Email`
                      }
                      value={search}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        myFunction(e, "email");
                      }}
                      disabled={!criteria}
                    />
                  </div>
                </div>
              )}
              {criteria == "company" && (
                <div className="col-sm-5">
                  <div className="form-group">
                    <Select
                      options={companies_dropdown}
                      isLoading={companies_data_loading}
                      style={!selectedCompany && errorStyles}
                      isClearable={true}
                      onChange={(selected) => {
                        console.log('selected.',selected)
                        setSearchValue(selected.value);
                        myFunction(selected, "company");
                        selected && setSelectedCompany(selected.value);
                        selected && setCompanyName(selected?.label.split(" - ")[1])
                        !selected && setSelectedCompany("");
                        !selected && setCompanyName("")
                      }}
                      styles={darkStyle}
                      disabled={!criteria}
                    />
                    {!selectedCompany && (
                      <small>
                        Select Company to show investor requests
                      </small>
                    )}
                  </div>
                </div>

              )}
              {criteria == "name" && (
                <div className="col-sm-5">
                  <input
                    id="search"
                    className="form-control"
                    type="text"
                    placeholder={
                      criteria == "" || !criteria
                        ? `Select Criteria`
                        : `Search by Name`
                    }
                    value={search}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      myFunction(e, "name");
                    }}
                    disabled={!criteria}
                  />
                </div>
              )}
            </div>
            {/* <div className="form-group">
              <div className='d-flex' style={{Direction: 'row', justifyContent: 'left', alignItems: 'left'}}>
                <label className="text-nowrap pt-2 pr-3">User Email</label>
                <input
                  className="form-control"
                  type="text"
                  data-tip="Search User By Email"
                  placeholder={"Enter Email"}
                  value={search}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    myFunction(e);
                  }
                  }
                />
              </div>
            </div> */}
            <h5></h5>
            {crudFeatures[0] && (
              <div className="form-group my-2">
                <button
                  disabled={Loading ? true : false}
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // for modal
                    setViewAddPage(true);
                  }}
                >
                  <i className="fa fa-plus mr-1"></i> Add User
                </button>
              </div>

            )}
          </div>
          {Loading && (
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
          {!Loading && (
            <div className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap">
                <thead>
                  <tr>
                    <th>{"User Name"}</th>
                    <th>{"User Role"}</th>
                    <th>{"Email"}</th>
                    <th>{"Created At"}</th>
                    <th>{"Company"}</th>
                    <th>{"Status"}</th>
                    <th>{"Action"}</th>
                  </tr>
                </thead>
                <tbody>
                  {res.map((user, i) => (
                    <tr key={i}>
                      <td>{user.name}</td>
                      <td>{user.role}</td>
                      <td>{user.email}</td>
                      <td>{getvalidDateDMY(user.created_at)}</td>
                      <td>
                        {
                          companies_dropdown.find(
                            (item) => item.value === user.company_code
                          )?.label
                        }
                      </td>
                      <td>{user.status}</td>
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
                              const obj = JSON.parse(JSON.stringify(user));
                              obj.company_code = getFoundObject(
                                companies_dropdown,
                                user.company_code
                              );
                              obj.role = getFoundObject(
                                user_roles,
                                user.role.replace("ROLE_", "")
                              );
                              sessionStorage.setItem(
                                "selectedUser",
                                JSON.stringify(obj)
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
                            const obj = JSON.parse(JSON.stringify(user));
                            obj.company_code = getFoundObject(
                              companies_dropdown,
                              user.company_code
                            );
                            obj.role = getFoundObject(
                              user_roles,
                              user.role.replace("ROLE_", "")
                            );
                            sessionStorage.setItem(
                              "selectedUser",
                              JSON.stringify(obj)
                            );
                          }}
                        ></i>

                        <i
                          className={user.status == 'active' ? "fa fa-check" : "fa fa-ban"}
                          style={{
                            width: 35,
                            fontSize: 16,
                            padding: 11,
                            color: "rgb(40, 167, 69)",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // for modal
                            setToggleStatus(true);
                            setStatus(user.status);
                            setUser_Email(user.email)
                            // const obj = JSON.parse(JSON.stringify(user));
                            // obj.company_code = getFoundObject(
                            //   companies_dropdown,
                            //   user.company_code
                            // );
                            // obj.role = getFoundObject(
                            //   user_roles,
                            //   user.role.replace("ROLE_", "")
                            // );
                            // sessionStorage.setItem(
                            //   "selectedUser",
                            //   JSON.stringify(obj)
                            // );
                          }}
                        ></i>

                        {/* for balance */}
                        <i
                          className={"fa fa-plus"}
                          style={{
                            width: 35,
                            fontSize: 16,
                            padding: 11,
                            color: "rgb(40, 167, 69)",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // for modal
                            setRefreshTransactionLimit(true);
                            setUser_Email(user.email)
                            getEthBalance(user.email);
                          }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
