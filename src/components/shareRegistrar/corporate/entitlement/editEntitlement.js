import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { updateCorporateEntitlement } from "../../../../store/services/corporate.service";

import { darkStyle } from "../../../defaultStyles";
import LoadableButton, { LoadableInput } from "../../../common/loadables";
import Select from "react-select";
import {
  announcement_id_setter,
  folio_setter,
} from "../../../../store/services/dropdown.service";

export default function EditEntitlement() {
  const data =
    JSON.parse(sessionStorage.getItem("selectedCorporateEntitlement")) || "";
  useEffect(async () => {
    try {
      setAnnoucement_id_options(await announcement_id_setter());
      setFolio_options(await folio_setter());
    } catch (err) {
      toast.error(`${err.response.data.message}`);
    }

    return () => {
      sessionStorage.setItem(
        "selectedCorporateEntitlement",
        JSON.stringify({})
      );
    };
  }, []);
  const [entitlement_id, setEntitlement_id] = useState(data.entitlement_id);
  const [announcement_id, setAnnouncement_id] = useState(data.announcement_id);
  const [folio_number, setFolio_number] = useState(data.folio_number);
  const [dividend_amount, setDividend_amount] = useState(data.dividend_amount);
  const [bonus_shares, setBonus_shares] = useState(data.bonus_shares);
  const [right_shares, setRight_shares] = useState(data.right_shares);
  const [dividend_credited, setDividend_credited] = useState(
    data.dividend_credited
  );
  const [dividend_credit_date, setDividend_credit_date] = useState(
    data.dividend_credit_date
  );
  const [bonus_credited, setBonus_credited] = useState(data.bonus_credited);
  const [right_subscribed, setRight_subscribed] = useState(
    data.right_subscribed
  );
  const [right_subs_date, setRight_subs_date] = useState(data.right_subs_date);
  const [account_title, setAccount_title] = useState(data.account_title);
  const [account_no, setAccount_no] = useState(data.account_no);
  const [bank_code, setBank_code] = useState(data.bank_code);
  const [branch, setBranch] = useState(data.branch);
  const [amount, setAmount] = useState(data.amount);
  const [gateway_code, setGateway_code] = useState(data.gateway_code);
  const [loading, setLoading] = useState(false);

  // options
  const [announcement_id_options, setAnnoucement_id_options] = useState([]);
  const [folio_options, setFolio_options] = useState([]);

  // errors
  const [entitlement_idError, setEntitlement_idError] = useState(false);
  const [announcement_idError, setAnnouncement_idError] = useState(false);
  const [folio_numberError, setFolio_numberError] = useState(false);
  const [dividend_amountError, setDividend_amountError] = useState(false);
  const [bonus_sharesError, setBonus_sharesError] = useState(false);
  const [right_sharesError, setRight_sharesError] = useState(false);
  const [dividend_creditedError, setDividend_creditedError] = useState(false);
  const [dividend_credit_dateError, setDividend_credit_dateError] =
    useState(false);
  const [bonus_creditedError, setBonus_creditedError] = useState(false);
  const [right_subscribedError, setRight_subscribedError] = useState(false);
  const [right_subs_dateError, setRight_subs_dateError] = useState(false);
  const [account_titleError, setAccount_titleError] = useState(false);
  const [account_noError, setAccount_noError] = useState(false);
  const [bank_codeError, setBank_codeError] = useState(false);
  const [branchError, setBranchError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [gateway_codeError, setGateway_codeError] = useState(false);

  const handleUpdateEntitlement = async () => {
    if (entitlement_id == "") {
      setEntitlement_idError(true);
    } else {
      setEntitlement_idError(false);
    }
    if (announcement_id == "") {
      setAnnouncement_idError(true);
    } else {
      setAnnouncement_idError(false);
    }
    if (folio_number == "") {
      setFolio_numberError(true);
    } else {
      setFolio_numberError(false);
    }
    if (dividend_amount == "") {
      setDividend_amountError(true);
    } else {
      setDividend_amountError(false);
    }
    if (bonus_shares == "") {
      setBonus_sharesError(true);
    } else {
      setBonus_sharesError(false);
    }
    if (right_shares == "") {
      setRight_sharesError(true);
    } else {
      setRight_sharesError(false);
    }
    if (dividend_credited == "") {
      setDividend_creditedError(true);
    } else {
      setDividend_creditedError(false);
    }
    if (dividend_credit_date == "") {
      setDividend_credit_dateError(true);
    } else {
      setDividend_credit_dateError(false);
    }
    if (bonus_credited == "") {
      setBonus_creditedError(true);
    } else {
      setBonus_creditedError(false);
    }
    if (right_subscribed == "") {
      setRight_subscribedError(true);
    } else {
      setRight_subscribedError(false);
    }
    if (right_subs_date == "") {
      setRight_subs_dateError(true);
    } else {
      setRight_subs_dateError(false);
    }
    if (account_title == "") {
      setAccount_titleError(true);
    } else {
      setAccount_titleError(false);
    }

    if (account_no == "") {
      setAccount_noError(true);
    } else {
      setAccount_noError(false);
    }
    if (bank_code == "") {
      setBank_codeError(true);
    } else {
      setBank_codeError(false);
    }
    if (branch == "") {
      setBranchError(true);
    } else {
      setBranchError(false);
    }
    if (amount == "") {
      setAmountError(true);
    } else {
      setAmountError(false);
    }
    if (gateway_code == "") {
      setGateway_codeError(true);
    } else {
      setGateway_codeError(false);
    }

    if (
      entitlement_id !== "" &&
      announcement_id !== "" &&
      folio_number !== "" &&
      dividend_amount !== "" &&
      bonus_shares !== "" &&
      right_shares !== "" &&
      dividend_credited !== "" &&
      dividend_credit_date !== "" &&
      bonus_credited !== "" &&
      right_subscribed !== "" &&
      right_subs_date !== "" &&
      account_title !== "" &&
      account_no !== "" &&
      bank_code !== "" &&
      branch !== "" &&
      amount !== "" &&
      gateway_code !== ""
    ) {
      const email = sessionStorage.getItem("email");
      try {
        setLoading(true);
        const response = await updateCorporateEntitlement(
          email,
          entitlement_id,
          announcement_id,
          folio_number,
          dividend_amount,
          bonus_shares,
          right_shares,
          dividend_credited,
          dividend_credit_date,
          bonus_credited,
          right_subscribed,
          right_subs_date,
          account_title,
          account_no,
          bank_code,
          branch,
          amount,
          gateway_code
        );

        if (response.data.status == 200) {
          setLoading(false);
          toast.success(`${response.data.message}`);

          setEntitlement_id("");
          setAnnouncement_id("");
          setFolio_number("");
          setDividend_amount("");
          setBonus_shares("");
          setRight_shares("");
          setDividend_credited("");
          setDividend_credit_date("");
          setBonus_credited("");
          setRight_subscribed("");
          setRight_subs_date("");
          setAccount_title("");
          setAccount_no("");
          setBank_code("");
          setBranch("");
          setAmount("");
          setGateway_code("");
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

  return (
    <div>
      <Fragment>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Corporate Entitlement</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="companySecretary">Entitlement id</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    readOnly
                    placeholder="Enter Entitlement id"
                    value={entitlement_id}
                    onChange={(e) => setEntitlement_id(e.target.value)}
                  />
                  {entitlement_idError && (
                    <p className="error-color">* Entitlement id is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Announcement id</label>
                  {announcement_id_options.length > 0 ? (
                    <Select
                      options={announcement_id_options}
                      onChange={(selected) => {
                        setAnnouncement_id(selected.value);
                      }}
                      defaultInputValue={() => {
                        return announcement_id_options.find(
                          (item) => item.value == announcement_id
                        ).label;
                      }}
                      styles={darkStyle}
                    />
                  ) : (
                    <LoadableInput />
                  )}

                  {announcement_idError && (
                    <p className="error-color">* Announcement id is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Folio no</label>
                  {folio_options.length > 0 ? (
                    <Select
                      options={folio_options}
                      onChange={(selected) => {
                        setFolio_number(selected.value);
                      }}
                      styles={darkStyle}
                      defaultInputValue={() => {
                        return folio_options.find(
                          (item) => item.value == folio_number
                        ).label;
                      }}
                    />
                  ) : (
                    <LoadableInput />
                  )}
                  {folio_numberError && (
                    <p className="error-color">* folio no is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Dividend Amount</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Dividend Amount"
                    value={dividend_amount}
                    onChange={(e) => setDividend_amount(e.target.value)}
                  />
                  {dividend_amountError && (
                    <p className="error-color">* Dividend Amount is required</p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Bonus Share</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Bonus Share"
                    value={bonus_shares}
                    onChange={(e) => setBonus_shares(e.target.value)}
                  />
                  {bonus_sharesError && (
                    <p className="error-color">* Bonus Share is required</p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Right Shares</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Right Shares"
                    value={right_shares}
                    onChange={(e) => setRight_shares(e.target.value)}
                  />
                  {right_sharesError && (
                    <p className="error-color">* Right Shares is required</p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Dividend Credited</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Dividend Credited"
                    value={dividend_credited}
                    onChange={(e) => setDividend_credited(e.target.value)}
                  />
                  {dividend_creditedError && (
                    <p className="error-color">
                      * Dividend Credited is required
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="companySecretary">Dividend Credit date</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="date"
                    placeholder="Enter Dividend Credit date"
                    value={dividend_credit_date}
                    onChange={(e) => setDividend_credit_date(e.target.value)}
                  />
                  {dividend_credit_dateError && (
                    <p className="error-color">
                      * Dividend Credit date is required
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Bonus Credited</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Bonus Credited"
                    value={bonus_credited}
                    onChange={(e) => setBonus_credited(e.target.value)}
                  />
                  {bonus_creditedError && (
                    <p className="error-color">* Bonus Credited is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                {/* <h5>checklist Items</h5> */}
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="companySecretary">Right Subscribed</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Right Subscribed"
                    value={right_subscribed}
                    onChange={(e) => setRight_subscribed(e.target.value)}
                  />
                  {right_subscribedError && (
                    <p className="error-color">
                      * Right Subscribed is required
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Right Subs Date</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="date"
                    placeholder="Enter Right Subs Date"
                    value={right_subs_date}
                    onChange={(e) => setRight_subs_date(e.target.value)}
                  />
                  {right_subs_dateError && (
                    <p className="error-color">* Right Subs Date is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Account Title</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Account Title"
                    value={account_title}
                    onChange={(e) => setAccount_title(e.target.value)}
                  />
                  {account_titleError && (
                    <p className="error-color">* Account Title is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Account No</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="EnterAccount No"
                    value={account_no}
                    onChange={(e) => setAccount_no(e.target.value)}
                  />
                  {account_noError && (
                    <p className="error-color">*Account No is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Bank code</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Bank code"
                    value={bank_code}
                    onChange={(e) => setBank_code(e.target.value)}
                  />
                  {bank_codeError && (
                    <p className="error-color">* Bank code is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Branch</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                  {branchError && (
                    <p className="error-color">* Branch is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Amount</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  {amountError && (
                    <p className="error-color">* Amount is required</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="companySecretary">Gateway code</label>
                  <input
                    className="form-control"
                    name="companySecretary"
                    type="text"
                    placeholder="Enter Gateway code"
                    value={gateway_code}
                    onChange={(e) => setGateway_code(e.target.value)}
                  />
                  {gateway_codeError && (
                    <p className="error-color">* Gateway code is required</p>
                  )}
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
              methodToExecute={handleUpdateEntitlement}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
