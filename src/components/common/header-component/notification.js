import React, { Fragment } from "react";
import { useHistory } from "react-router";
import {
  ShoppingBag,
  Download,
  AlertCircle,
  MoreHorizontal,
} from "react-feather";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import { Notification, All } from "../../../constant";
import { useSelector } from "react-redux";
import { getFoundObject } from "../../../utilities/utilityFunctions";
import ViewTransactionRequest from "../../shareRegistrar/processing/viewTransactionRequest";

const Notifications = (props) => {
  const transaction_requests = useSelector((data) => data.TransactionRequests);
  const announcements = useSelector((data) => data.Announcements);
  const entitlements = useSelector((data) => data.Entitlements);
  const shareholders = useSelector((data) => data.Shareholders);
  const { investor_request_types } = useSelector(
    (data) => data.InvestorsRequests
  );
  const companies = useSelector((data) => data.Companies);
  const history = useHistory();
  const [viewFlag, setViewFlag] = React.useState(false);
  return (
    <Fragment>
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Transaction Request View
        </ModalHeader>
        <ModalBody>
          <ViewTransactionRequest setViewFlag={setViewFlag} />
        </ModalBody>
      </Modal>
      <div>
        <ul
          className="notification-dropdown onhover-show-div p-0"
          style={{ minHeight: "20vh", overflow: "scroll" }}
        >
          <li className="txt-dark">Recent Transactions</li>
          {transaction_requests.transaction_request_data
            .sort((a, b) => b.txn_id - a.txn_id)
            .slice(0, 5)
            .map((item, i) => (
              <li
                key={i}
                onClick={() => {
                  const obj = JSON.parse(JSON.stringify(item));
                  obj.announcement_id = getFoundObject(
                    announcements.announcement_dropdown,
                    obj.announcement_id
                  );
                  obj.entitlement_id = getFoundObject(
                    entitlements.entitlement_dropdown,
                    obj.entitlement_id
                  );
                  obj.from_folio = getFoundObject(
                    shareholders.shareholders_dropdown,
                    obj.from_folio
                  );
                  // obj.symbol = getFoundObject(symbol_options, obj.symbol);
                  obj.txn_type = getFoundObject(
                    investor_request_types,
                    obj.txn_type
                  );
                  obj.folio_number = getFoundObject(
                    shareholders.shareholders_dropdown,
                    obj.folio_number
                  );
                  obj.company_code = getFoundObject(
                    companies.companies_dropdown,
                    obj.company_code
                  );
                  // for modal
                  setViewFlag(true);
                  sessionStorage.setItem(
                    "selectedTransactionRequest",
                    JSON.stringify(obj)
                  );
                }}
              >
                <div className="media">
                  <div className="media-body">
                    <h6 className="mt-0">
                      <span>
                        <AlertCircle className="font-danger" />
                      </span>
                      {`ID: ${item.txn_id}`}
                    </h6>
                    <p className="mb-0">
                      <b>Transaction Type:</b>
                      {` ${
                        transaction_requests.transaction_request_types.find(
                          (tem) => tem.value === item.txn_type
                        )?.label
                      }`}
                    </p>
                    <p>
                      <b>Requester Folio:</b>
                      {` ${
                        shareholders.shareholders_dropdown.find(
                          (tem) => tem.value === item.folio_number
                        )?.label
                      }`}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          <li onClick={(e) => history.push("/transaction-requests")}>
            <div className="media">
              <div className="media-body">
                <h6 className="mt-0">
                  <span>
                    <MoreHorizontal className="font-danger" />
                  </span>
                  View More
                </h6>
              </div>
            </div>
          </li>

          {/* <li>
            {Notification}{" "}
            <span className="badge badge-pill badge-primary pull-right">
              {"3"}
            </span>
          </li> */}
        </ul>
      </div>
    </Fragment>
  );
};

export default Notifications;
