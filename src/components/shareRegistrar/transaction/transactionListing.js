import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { getTransactions } from "../../../store/services/transaction.service";
import {
  announcement_id_setter,
  entitlement_id_setter,
  folio_setter,
  symbol_setter,
  txn_type_setter,
} from "../../../store/services/dropdown.service";
import { getFoundObject } from "../../../utilities/utilityFunctions";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AddTransaction from "./addTransaction";
import EditTransaction from "./editTransaction";
import ViewTransaction from "./viewTransaction";
import { getCompanies } from "../../../store/services/company.service";
import { getInvestors } from "../../../store/services/investor.service";
import ViewTransactionRequest from "../processing/viewTransactionRequest";

export default function TransactionListing() {
  const [investors, setInvestors] = useState([]);
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [symbol_options, setSymbol_options] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  const [txn_type_options, setTxn_type_options] = useState([]);
  const [announcement_id_options, setAnnoucement_id_options] = useState([]);
  const [entitlement_id_options, setEntitlement_id_options] = useState([]);
  let history = useHistory();
  // Selectors
  const { inactive_shareholders_dropdown } = useSelector(
    (data) => data.Shareholders
  );
  useEffect(async () => {
    try {
      setAnnoucement_id_options(await announcement_id_setter());
      setEntitlement_id_options(await entitlement_id_setter());
      setSymbol_options(await symbol_setter());
      setFolio_options(await folio_setter());
      setTxn_type_options(await txn_type_setter());
    } catch (err) {
      !!err?.response?.data?.message
        ? toast.error(err?.response?.data?.message)
        : toast.error("Options Not Found");
    }
  }, []);
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const getAllCompanies = async () => {
      try {
        const response = await getCompanies(email);
        setCompanies(
          response.data.data.map((comp) => ({
            label: comp.company_name,
            value: comp.code,
          }))
        );
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Companies Not Found");
      }
    };
    const getAllInvestors = async () => {
      try {
        const response = await getInvestors(email);
        if (response?.status === 200) {
          setInvestors(
            response.data.data.map((investor) => ({
              label: investor.account_no + "-" + investor.investor_name,
              value: investor.investor_id,
            }))
          );
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(`${error?.response?.data?.message}`)
          : toast.error("Investors Not Found");
      }
    };
    const getAllTransactions = async () => {
      try {
        const response = await getTransactions(email);
        setData(response.data.data);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Transactions Not Found");
      }
    };
    // end amc dropdown
    getAllInvestors();
    getAllTransactions();
    getAllCompanies();
  }, []);
  return (
    <Fragment>
      <Breadcrumb title="Transaction Listing" parent="Transaction" />
      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Transaction
        </ModalHeader>
        <ModalBody>
          <AddTransaction setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Transaction Edit
        </ModalHeader>
        <ModalBody>
          <EditTransaction setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Transaction View
        </ModalHeader>
        <ModalBody>
          <ViewTransactionRequest />
        </ModalBody>
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5>Transaction Listing</h5>

                {/* <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    // for modal
                    setViewAddPage(true);
                  }}
                >
                  <i className="fa fa-plus mr-1"></i> Add Transaction
                </button> */}
              </div>
              <div className="table-responsive">
                <table className="table  ">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Announcement ID </th>
                      <th>Entitlement ID</th>
                      <th>Folio Number</th>
                      <th>Txn Type</th>
                      <th>Doc Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.length !== 0 &&
                      investors.length !== 0 &&
                      folio_options.length !== 0 &&
                      symbol_options.length !== 0 &&
                      txn_type_options.length !== 0 &&
                      entitlement_id_options.length !== 0 &&
                      announcement_id_options.length !== 0 &&
                      data.map((item, i) => (
                        <tr key={i}>
                          <td>{item.request_id || "N/A"}</td>
                          <td>{item.announcement_id || "N/A"}</td>
                          <td>
                            <span className="status-icon bg-success"></span>
                            {item.entitlement_id || "N/A"}
                          </td>
                          <td>
                            {inactive_shareholders_dropdown.find(
                              (holder) => holder.value === item.folio_number
                            )?.label || "N/A"}
                          </td>
                          <td>{item.txn_type || "N/A"}</td>
                          <td>{item.doc_type || "N/A"}</td>
                          <td>
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
                                const obj = JSON.parse(JSON.stringify(item));
                                obj.announcement_id = getFoundObject(
                                  announcement_id_options,
                                  obj.announcement_id
                                );
                                obj.entitlement_id = getFoundObject(
                                  entitlement_id_options,
                                  obj.entitlement_id
                                );
                                obj.from_folio = getFoundObject(
                                  folio_options,
                                  obj.from_folio
                                );
                                obj.symbol = getFoundObject(
                                  symbol_options,
                                  obj.symbol
                                );
                                obj.txn_type = getFoundObject(
                                  txn_type_options,
                                  obj.txn_type
                                );
                                obj.folio_number = getFoundObject(
                                  folio_options,
                                  obj.folio_number
                                );
                                obj.company_code = getFoundObject(
                                  companies,
                                  obj.company_code
                                );
                                // for modal
                                setViewFlag(true);
                                sessionStorage.setItem(
                                  "selectedTransactionRequest",
                                  JSON.stringify(obj)
                                );
                              }}
                            ></i>
                            {/* <i
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
                                  "selectedTransaction",
                                  JSON.stringify(item)
                                );
                                
                              }}
                            ></i> */}
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
