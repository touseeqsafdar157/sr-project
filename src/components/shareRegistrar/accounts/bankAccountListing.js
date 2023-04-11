import React, {
  Fragment,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
// import Breadcrumb from "../common/breadcrumb";
import differenceBy from "lodash/differenceBy";
import { tableData } from "../../../data/sharePriceDummyData";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import Breadcrumb from "../../common/breadcrumb";
import { useHistory } from "react-router-dom";

export default function BankAccountListing() {
  const [data, setData] = useState([]);
  let history = useHistory();
  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5>Bank Accounts</h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => history.push("/add-bank-account")}
                >
                  Add Bank Account
                </button>
              </div>
              <div className="table-responsive">
                <table className="table  ">
                  <thead>
                    <tr>
                      {/* {UsersTableHeader.map((items,i) => 
                                                      <th key={i}>{items}</th>
                                                  )} */}
                      <th>Account Number </th>
                      <th>Account Title</th>
                      <th>Bank Code</th>
                      <th>Branch Name</th>
                      <th>Branch Address</th>
                      <th>Branch City</th>
                      <th>Symbol</th>
                      <th>Open Date </th>
                      <th>Closed</th>
                      <th>Close Date</th>
                      <th>Closed By</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data &&
                      data.map((emp, i) => (
                        <tr key={i}>
                          <td>{emp.emp_no}</td>
                          <td>{emp.employee_name}</td>
                          <td>
                            <span className="status-icon bg-success"></span>
                            {emp.father_name}
                          </td>
                          <td>{emp.mobile}</td>
                          <td>{emp.designation}</td>
                          <td>
                            {/* <i className="fa fa-pencil" style={{ width: 35, fontSize: 16, padding: 11, color: 'rgb(40, 167, 69)' }}></i> */}

                            <i
                              className="fa fa-eye"
                              style={{
                                width: 35,
                                fontSize: 16,
                                padding: 11,
                                color: "rgb(68, 102, 242)",
                                cursor: "pointer",
                              }}
                            ></i>
                            <i
                              className="fa fa-pencil"
                              style={{
                                width: 35,
                                fontSize: 16,
                                padding: 11,
                                color: "rgb(40, 167, 69)",
                                cursor: "pointer",
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
