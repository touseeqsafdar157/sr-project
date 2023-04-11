import React, { Fragment, useState, useEffect, useRef } from "react";
import Breadcrumb from "../../common/breadcrumb";
import Select from "react-select";
import { updateNewTransaction } from "../../../store/services/transaction.service";

import { toast } from "react-toastify";
import { darkStyle } from "../../defaultStyles";
import LoadableButton, { LoadableInput } from "../../common/loadables";

import {
  txn_type_setter,
  request_id_setter,
  folio_setter,
  symbol_setter,
  announcement_id_setter,
  entitlement_id_setter,
  company_code_setter,
} from "../../../store/services/dropdown.service";

export default function EditTransaction() {
  const data = JSON.parse(sessionStorage.getItem("selectedTransaction")) || "";

  const txn_type_selector = useRef();
  useEffect(async () => {
    //calling option setter
    try {
      setTxn_type_options(await txn_type_setter());
      setRequest_id_options(await request_id_setter());
      setAnnoucement_id_options(await announcement_id_setter());
      setEntitlement_id_options(await entitlement_id_setter());
      setSymbol_options(await symbol_setter());
      setFolio_options(await folio_setter());
    } catch (err) {
      toast.error(`${err.response.data.message}`);
    }

    return () => {
      sessionStorage.setItem("selectedTransaction", JSON.stringify({}));
    };
  }, []);

  const [txn_id, setTxn_id] = useState(data.txn_id);
  const [request_id, setRequest_id] = useState(data.request_id);
  const [announcement_id, setAnnouncement_id] = useState(data.announcement_id);
  const [entitlement_id, setEntitlement_id] = useState(data.entitlement_id);
  const [folio_number, setFolio_number] = useState(data.folio_number);
  const [txn_type, setTxn_type] = useState(data.txn_type);
  const [symbol, setSymbol] = useState(data.symbol);
  const [quantity, setQuantity] = useState(data.quantity);
  const [from_folio, setFrom_folio] = useState(data.from_folio);
  const [to_folio, setTo_folio] = useState(data.to_folio);
  const [txn_date, setTxn_date] = useState(data.txn_date);
  const [settlement_date, setSettlement_date] = useState(data.settlement_date);

  const [company_code, setCompany_code] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  //options setters
  const [txn_type_options, setTxn_type_options] = useState([]);
  const [request_id_options, setRequest_id_options] = useState([]);
  const [announcement_id_options, setAnnoucement_id_options] = useState([]);
  const [entitlement_id_options, setEntitlement_id_options] = useState([]);
  const [symbol_options, setSymbol_options] = useState([]);
  const [folio_options, setFolio_options] = useState([]);

  // errors

  const [txn_idError, setTxn_idError] = useState(false);
  const [request_idError, setRequest_idError] = useState(false);
  const [announcement_idError, setAnnouncement_idError] = useState(false);
  const [entitlement_idError, setEntitlement_idError] = useState("");
  const [folio_numberError, setFolio_numberError] = useState(false);
  const [txn_typeError, setTxn_typeError] = useState(false);
  const [symbolError, setSymbolError] = useState(false);
  const [quantityError, setQuantityError] = useState(false);
  const [from_folioError, setFrom_folioError] = useState(false);
  const [to_folioError, setTo_folioError] = useState(false);
  const [txn_dateError, setTxn_dateError] = useState(false);
  const [settlement_dateError, setSettlement_dateError] = useState(false);

  const [company_codeError, setCompany_codeError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [referenceError, setReferenceError] = useState(false);

  const handleUpdateTransaction = async () => {
    if (txn_id == "") {
      setTxn_idError(true);
    } else {
      setTxn_idError(false);
    }
    if (request_id == "") {
      setRequest_idError(true);
    } else {
      setRequest_idError(false);
    }
    if (announcement_id == "") {
      setAnnouncement_idError(true);
    } else {
      setAnnouncement_idError(false);
    }
    if (entitlement_id == "") {
      setEntitlement_idError(true);
    } else {
      setEntitlement_idError(false);
    }
    if (folio_number == "") {
      setFolio_numberError(true);
    } else {
      setFolio_numberError(false);
    }
    if (txn_type == "") {
      setTxn_typeError(true);
    } else {
      setTxn_typeError(false);
    }
    if (symbol == "") {
      setSymbolError(true);
    } else {
      setSymbolError(false);
    }
    if (quantity == "") {
      setQuantityError(true);
    } else {
      setQuantityError(false);
    }
    if (from_folio == "") {
      setFrom_folioError(true);
    } else {
      setFrom_folioError(false);
    }
    if (to_folio == "") {
      setTo_folioError(true);
    } else {
      setTo_folioError(false);
    }
    if (txn_date == "") {
      setTxn_dateError(true);
    } else {
      setTxn_dateError(false);
    }
    if (settlement_date == "") {
      setSettlement_dateError(true);
    } else {
      setSettlement_dateError(false);
    }

    if (company_code == "") {
      setCompany_codeError(true);
    } else {
      setCompany_codeError(false);
    }
    if (price == "") {
      setPriceError(true);
    } else {
      setPriceError(false);
    }
    if (amount == "") {
      setAmountError(true);
    } else {
      setAmountError(false);
    }
    if (reference == "") {
      setReferenceError(true);
    } else {
      setReferenceError(false);
    }

    if (
      txn_id !== "" &&
      request_id !== "" &&
      announcement_id !== "" &&
      entitlement_id !== "" &&
      folio_number !== "" &&
      txn_type !== "" &&
      symbol !== "" &&
      quantity !== "" &&
      from_folio !== "" &&
      to_folio !== "" &&
      txn_date !== "" &&
      settlement_date !== "" &&
      company_code !== "" &&
      price !== "" &&
      amount !== "" &&
      reference !== ""
    ) {
      const email = sessionStorage.getItem("email");
      try {
        setLoading(true);
        const response = await updateNewTransaction(
          email,
          txn_id,
          request_id,
          announcement_id,
          entitlement_id,
          folio_number,
          txn_type,
          symbol,
          quantity,
          from_folio,
          to_folio,
          txn_date,
          settlement_date,
          company_code,
          price,
          amount,
          reference
        );

        if (response.data.status == 200) {
          setLoading(false);
          toast.success(`${response.data.message}`);
          setTxn_id("");
          setRequest_id("");
          setAnnouncement_id("");
          setEntitlement_id("");
          setFolio_number("");
          setTxn_type("");
          setSymbol("");
          setQuantity("");
          setFrom_folio("");
          setTo_folio("");
          setTxn_date("");
          setSettlement_date("");
          setUpdated(true);
          setCompany_code("");
          setPrice("");
          setAmount("");
          setReference("");
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
                <h5>Edit Transaction</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="email">Request ID </label>
                  {request_id_options.length > 0 ? (
                    <Select
                      options={request_id_options}
                      onChange={(selected) => {
                        setRequest_id(selected.value);
                      }}
                      defaultInputValue={() => {
                        return request_id_options.find(
                          (item) => item.value == request_id
                        ).label;
                      }}
                      styles={darkStyle}
                    />
                  ) : (
                    <LoadableInput />
                  )}
                  {request_idError && (
                    <p className="error-color">* Request id is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Announcement ID </label>
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

                <div className="form-group">
                  <label htmlFor="email">Entitlement ID </label>
                  {entitlement_id_options.length > 0 ? (
                    <Select
                      options={entitlement_id_options}
                      onChange={(selected) => {
                        setEntitlement_id(selected.value);
                      }}
                      defaultInputValue={() => {
                        return entitlement_id_options.find(
                          (item) => item.value == entitlement_id
                        ).label;
                      }}
                      styles={darkStyle}
                    />
                  ) : (
                    <LoadableInput />
                  )}
                  {entitlement_idError && (
                    <p className="error-color">* Entitlement id is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Txn Type </label>
                  <Select
                    options={txn_type_options}
                    onChange={(selected) => {
                      setTxn_type(selected.value);
                    }}
                    defaultInputValue={txn_type}
                    styles={darkStyle}
                  />
                  {txn_typeError && (
                    <p className="error-color">* Txn Type is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Txn ID </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    readOnly
                    placeholder="Enter Request ID"
                    value={txn_id}
                    onChange={(e) => setTxn_id(e.target.value)}
                  />
                  {txn_idError && (
                    <p className="error-color">* Txn id is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Symbol</label>
                  {symbol_options.length > 0 ? (
                    <Select
                      options={symbol_options}
                      onChange={(selected) => {
                        setSymbol(selected.value);
                      }}
                      defaultInputValue={() => {
                        return symbol_options.find(
                          (item) => item.value == symbol
                        ).label;
                      }}
                      styles={darkStyle}
                    />
                  ) : (
                    <LoadableInput />
                  )}

                  {symbolError && (
                    <p className="error-color">* Symbol is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Company Code</label>
                  {company_code.length > 0 ? (
                    <Select
                      options={company_code}
                      onChange={(selected) => {
                        setCompany_code(selected.value);
                      }}
                      defaultInputValue={() => {
                        return company_code.find(
                          (item) => item.value == company_code
                        ).label;
                      }}
                      styles={darkStyle}
                    />
                  ) : (
                    <LoadableInput />
                  )}
                  {company_codeError && (
                    <p className="error-color">* Company Code is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                {/* <h5>Add Transaction</h5> */}
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="email">Quantity</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  {quantityError && (
                    <p className="error-color">* Quantity is required</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Folio Number </label>
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
                    <p className="error-color">* Folio Number is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">From Folio</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter From Folio"
                    value={from_folio}
                    onChange={(e) => setFrom_folio(e.target.value)}
                  />
                  {from_folioError && (
                    <p className="error-color">* From folio is required</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">To Folio</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="text"
                    placeholder="Enter To Folio"
                    value={to_folio}
                    onChange={(e) => setTo_folio(e.target.value)}
                  />
                  {to_folioError && (
                    <p className="error-color">* To folio is required</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Txn Date</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="date"
                    placeholder="Enter Txn Date"
                    value={txn_date}
                    onChange={(e) => setTxn_date(e.target.value)}
                  />
                  {txn_dateError && (
                    <p className="error-color">* Txn Date is required</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Settlement Date </label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="date"
                    placeholder="Enter Settlement Date "
                    value={settlement_date}
                    onChange={(e) => setSettlement_date(e.target.value)}
                  />
                  {settlement_dateError && (
                    <p className="error-color">* Settlement Date is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <div className="card-header b-t-primary">
                <h5></h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    className="form-control"
                    id="price"
                    type="number"
                    min="0"
                    placeholder="Enter Price"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  {priceError && (
                    <p className="error-color">* Price is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input
                    className="form-control"
                    min="0"
                    id="amount"
                    type="number"
                    placeholder="Enter Amount"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  {amountError && (
                    <p className="error-color">* Amount is required</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="reference">Reference</label>
                  <input
                    className="form-control"
                    id="reference"
                    type="text"
                    placeholder="Enter Reference"
                    onChange={(e) => setReference(e.target.value)}
                  />
                  {referenceError && (
                    <p className="error-color">* Reference is required</p>
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
              methodToExecute={handleUpdateTransaction}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
