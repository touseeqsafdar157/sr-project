import Spinner from "components/common/spinner";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getTransactionTypes } from "store/services/transaction.service";
const CheckListContent = ({
  transactionRequest,
  acceptedLoading,
  rejectedLoading,
  updateAcceptStatusAccepted,
  updateAcceptStatusRejected,
}) => {
  const [checkList, setCheckList] = useState([]);
  const [checkListLoading, setCheckListLoading] = useState(false);
  useEffect(() => {
    const getAllTransactionRequest = async () => {
      try {
        setCheckListLoading(true);
        const baseEmail = sessionStorage.getItem("email") || "";
        const response = await getTransactionTypes(baseEmail);
        if (response.status === 200) {
          console.log(' ~ response:',response.data.data,transactionRequest.txn_type)
          setCheckList(
            response.data.data.find(
              (type) =>
                type.transactionName === transactionRequest.txn_type
            ).checklist
          );
        }
        setCheckListLoading(false);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Transaction Types Not Found");
        setCheckListLoading(false);
      }
    };
    getAllTransactionRequest();
  }, []);
  return (
    <>
      <div className="row">
        {!checkListLoading && checkList.length > 0 ? (
          <div className="table-responsive">
            <table className="table  ">
              <thead>
                <tr>
                  <th>Check List Item No.</th>
                  <th>Check List Item Description</th>
                  <th>Checked</th>
                </tr>
              </thead>

              <tbody>
                {checkList.length !== 0 &&
                  checkList.map((item, i) => (
                    <tr key={i}>
                      <td>{item.checklistItemNo}</td>
                      <td>
                        <label className="d-block" htmlFor="chk-ani">
                          <input
                            className="checkbox_animated"
                            id="chk-ani"
                            type="checkbox"
                            defaultChecked={item.checked}
                            onChange={(e) => (item.checked = e.target.checked)}
                          />
                          Approve
                        </label>
                      </td>
                      <td>{item.checklistItemDescription}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
      <div className="row px-2">
        {JSON.parse(transactionRequest?.txn_flow)
          .find((item) => item.pointedTo === true)
          ?.labels?.map((tem, i) => (
            <button
              key={i}
              className={`btn btn-${i === 0 ? "primary" : "danger"} mx-2`}
              disabled={acceptedLoading || rejectedLoading}
              onClick={(e) =>
                i === 0
                  ? updateAcceptStatusAccepted(checkList)
                  : updateAcceptStatusRejected(checkList)
              }
            >
              {i === 0 && acceptedLoading ? (
                <>
                  <span className="fa fa-spinner fa-spin"></span>
                  <span>{"Loading..."}</span>
                </>
              ) : i === 1 && rejectedLoading ? (
                <>
                  <span className="fa fa-spinner fa-spin"></span>
                  <span>{"Loading..."}</span>
                </>
              ) : (
                <span>{tem}</span>
              )}
            </button>
          ))}
        {/* <button
              className="btn btn-primary mx-2"
              disabled={Boolean(loading)}
              onClick={(e) => updateAcceptStatusAccepted()}
            >
              {loading ? (
                <>
                  <span className="fa fa-spinner fa-spin"></span>
                  <span>{"Loading..."}</span>
                </>
              ) : (
                <span>{"Accept"}</span>
              )}
            </button> */}
        {/* <button
              className="btn btn-danger mx-2"
              disabled={Boolean(loading)}
              onClick={(e) => updateAcceptStatusRejected()}
            >
              {loading ? (
                <>
                  <span className="fa fa-spinner fa-spin"></span>
                  <span>{"Loading..."}</span>
                </>
              ) : (
                <span>{"Reject"}</span>
              )}
            </button> */}
      </div>
    </>
  );
};

export default CheckListContent;
