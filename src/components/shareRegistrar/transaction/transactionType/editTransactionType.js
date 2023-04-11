import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import LoadableButton from "../../../common/loadables";
import { ToastContainer, toast } from "react-toastify";
import ToggleButton from "react-toggle-button";
import { updateNewTransactionType } from "../../../../store/services/transaction.service";

export default function EditTransactionType() {
  const data =
    JSON.parse(sessionStorage.getItem("selectedTransactionType")) || "";
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedTransactionType", JSON.stringify({}));
    };
  }, []);
  const [txn_type_id, setTxn_type_id] = useState(data.txn_type_id);
  const [txn_type, setTxn_type] = useState(data.txn_type);
  const [transaction_type, setTransaction_type] = useState(
    data.transaction_type
  );
  const [active, setActive] = useState(data.active == "true" ? true : false);
  const [loading, setLoading] = useState(false);

  // errors

  const [txn_typeError, setTxn_typeError] = useState(false);
  const [transaction_typeError, setTransaction_typeError] = useState(false);

  const handleUpdateTransactionType = async () => {
    if (txn_type == "") {
      setTxn_typeError(true);
    } else {
      setTxn_typeError(false);
    }
    if (transaction_type == "") {
      setTransaction_typeError(true);
    } else {
      setTransaction_typeError(false);
    }

    if (txn_type !== "" && transaction_type !== "") {
      const email = sessionStorage.getItem("email");
      try {
        setLoading(true);
        const response = await updateNewTransactionType(
          email,
          txn_type_id,
          txn_type,
          transaction_type,
          active.toString()
        );

        if (response.data.status == 200) {
          setLoading(false);
          toast.success(`${response.data.message}`);
          setTxn_type("");
          setTransaction_type("");
          setActive(false);
        } else {
          setLoading(false);
          toast.error(`${response.data.message}`);
        }
      } catch (error) {
        setLoading(false);
        toast.error(`${error.response.data.message}`);
      }
    }
  };

  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment> 
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Update Transaction Type</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="companySecretary">Txn Type</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="name"
                    placeholder="Enter Txn Type"
                    value={txn_type}
                    onChange={(e) => setTxn_type(e.target.value)}
                  />
                  {txn_typeError && (
                    <p className="error-color">* Txn Type is required</p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Transaction Type</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Transaction Type"
                    value={transaction_type}
                    onChange={(e) => setTransaction_type(e.target.value)}
                  />
                  {transaction_typeError && (
                    <p className="error-color">
                      * Transaction Type is required
                    </p>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="email">Active </label>
                      <ToggleButton
                        value={active}
                        thumbStyle={borderRadiusStyle}
                        trackStyle={borderRadiusStyle}
                        onToggle={() => {
                          if (active) {
                            setActive(false);
                          } else {
                            setActive(true);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <LoadableButton
              loading={loading}
              title="Update"
              methodToExecute={handleUpdateTransactionType}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
