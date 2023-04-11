import React, { useEffect, useState, useReducer } from "react";
import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";
import * as _ from "lodash";
import {
  BONUS_SHARE_ALLOTMENT_TEMPLATE,
  DIVIDEND_DISBURSEMENT_TEMPLATE,
  RIGHT_SHARE_ALLOTMENT_TEMPLATE,
  RIGHT_SUBSCRIBTION_TEMPLATE,
} from "constant";

import { toast } from "react-toastify";
import { filterData, SearchType } from "filter-data";
import {
  getBonusEntitlementsByTransactionId,
  getDividendEntitlementsByTransactionId,
  getRightEntitlementsByTransactionId,
} from "store/services/transaction.service";
import {
  generateExcel,
  getvalidDateDMonthY,
  sortyByDate,
} from "utilities/utilityFunctions";
const ViewTransactionEntitlements = () => {
  const { txn_type, txn_id } =
    JSON.parse(sessionStorage.getItem("selectedTransactionRequest")) || "";
  const dividend_array = [
    "filter",
    "total_holding",
    "gross_dividend",
    "tax_percentage",
    "tax",
    "zakat",
  ];
  const right_allotment_array = ["right_shares", "r_fraction"];
  const bonus_allotment_array = ["bonus_shares", "b_fraction"];
  const [entitlements, setEntitlements] = useState([]);
  const [searchedEntitlements, setSearchedEntitlements] = useState([]);
  const [search, setSearch] = useState("");
  const [entitlementsLoading, setEntitlementsLoading] = useState(false);
  const initial_state = {
    shareholder_name: true,
    folio_number: false,
    account_title: false,
  };
  const [SHAREHOLDER_NAME, FOLIO_NUMBER, ACCOUNT_TITLE] = [
    "SHAREHOLDER_NAME",
    "FOLIO_NUMBER",
    "ACCOUNT_TITLE",
  ];
  const reducer = (state = initial_state, action) => {
    switch (action.type) {
      case SHAREHOLDER_NAME:
        return {
          ...state,
          shareholder_name: true,
          folio_number: false,
          account_title: false,
        };
      case FOLIO_NUMBER:
        return {
          ...state,
          folio_number: true,
          shareholder_name: false,
          account_title: false,
        };
      case ACCOUNT_TITLE:
        return {
          ...state,
          account_title: true,
          shareholder_name: false,
          folio_number: false,
        };
      default:
        return state;
    }
  };
  // Reducers
  const [state, dispatch] = useReducer(reducer, initial_state);
  useEffect(() => {
    if (search) {
      const state_value = state.account_title
        ? "account_title"
        : state.shareholder_name
        ? "shareholder_name"
        : state.folio_number
        ? "folio_number"
        : "shareholder_name";
      const searchConditions = [
        { key: state_value, value: search, type: SearchType.LK },
      ];
      const result = filterData(entitlements, searchConditions);
      setSearchedEntitlements(result);
    }
  }, [search]);
  useEffect(() => {
    const getEntitlements = async () => {
      const baseEmail = sessionStorage.getItem("email") || "";
      setEntitlementsLoading(true);
      try {
        const response =
          txn_type?.value === BONUS_SHARE_ALLOTMENT_TEMPLATE
            ? await getBonusEntitlementsByTransactionId(baseEmail, txn_id)
            : txn_type?.value === RIGHT_SHARE_ALLOTMENT_TEMPLATE
            ? await getRightEntitlementsByTransactionId(baseEmail, txn_id)
            : txn_type?.value === DIVIDEND_DISBURSEMENT_TEMPLATE
            ? await getDividendEntitlementsByTransactionId(baseEmail, txn_id)
            : null;
        if (response.status === 200) {
          setEntitlements(
            response.data.data.map((item) => {
              return txn_type.value === BONUS_SHARE_ALLOTMENT_TEMPLATE
                ? _.omit(item, [...right_allotment_array, ...dividend_array])
                : txn_type.value === RIGHT_SHARE_ALLOTMENT_TEMPLATE
                ? _.omit(item, [...bonus_allotment_array, ...dividend_array])
                : txn_type.value === DIVIDEND_DISBURSEMENT_TEMPLATE
                ? _.omit(item, [
                    ...bonus_allotment_array,
                    ...right_allotment_array,
                  ])
                : item;
            })
          );
          setEntitlementsLoading(false);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(`${error?.response?.data?.message}`)
          : console.log("Entitlements Not Found");
        setEntitlementsLoading(false);
      }
      setEntitlementsLoading(false);
    };
    if (entitlements.length === 0) getEntitlements();
  }, []);
  useEffect(() => {
  }, [entitlements]);
  const columns_array = [
    "entitlement_id",
    "folio_number",
    "shareholder_name",
    "filer",
    "total_holding",
    "gross_dividend",
    "tax_percentage",
    "tax",
    "zakat",
    "bonus_shares",
    "b_fraction",
    "right_shares",
    "r_fraction",
    "account_title",
    "account_no",
    "bank",
    "branch",
  ];
  const generateExcelReport = () => {

    const data_array = entitlements.map((data) => {
      data.folio_number = data.folio_number.replace(`${data.company_code}-`,'');
      return {..._.pick(data, columns_array)}
    });
    const headings = [[""]];
    const columns = _.keys(
      _.pick(
        {
          ...data_array[data_array.length - 1],
        },
        columns_array
      )
    ).map((e) => e.toUpperCase().replaceAll("_", " "));
    generateExcel(
      `Entitlement Report ${getvalidDateDMonthY(new Date())}`,
      "Entitlement Report",
      "Report",
      "Report",
      "DCCL",
      headings,
      columns,
      data_array
    );
  };
  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const entitlementsPerPage = 10;
  const pagesVisited = pageNumber * entitlementsPerPage;
  const totalnumberofPages = 100;
  const displayEntitlementsPerPage = !search
    ? sortyByDate(entitlements)
        .map((holding, i) => ({ ...holding, s_no: i + 1 }))
        .slice(pagesVisited, pagesVisited + entitlementsPerPage)
        .map((holding, i) => (
          <tr key={i}>
            <td>{holding.s_no}</td>
            <td>{holding.entitlement_id}</td>
            <td>{holding.folio_number.replace(`${holding.company_code}-`,'')}</td>
            <td>{holding.shareholder_name}</td>
            {txn_type.value === DIVIDEND_DISBURSEMENT_TEMPLATE && (
              <>
                <td>{holding.filer}</td>
                <td>{holding.total_holding}</td>
                <td>{holding.gross_dividend}</td>
                <td>{holding.tax_percentage} </td>
                <td>{holding.tax}</td>
                <td>{holding.zakat}</td>
              </>
            )}
            {txn_type.value === BONUS_SHARE_ALLOTMENT_TEMPLATE && (
              <>
                <td>{holding.bonus_shares}</td>
                <td>{holding.b_fraction}</td>
              </>
            )}
            {txn_type.value === RIGHT_SHARE_ALLOTMENT_TEMPLATE && (
              <>
                <td>{holding.right_shares}</td>
                <td>{holding.r_fraction}</td>
              </>
            )}
            <td>{holding.account_title}</td>
            <td>{holding.account_no}</td>
            <td>{holding.bank}</td>
            <td>{holding.branch}</td>
          </tr>
        ))
    : sortyByDate(searchedEntitlements)
        .map((holding, i) => ({ ...holding, s_no: i + 1 }))
        .slice(pagesVisited, pagesVisited + entitlementsPerPage)
        .map((holding, i) => (
          <tr key={i}>
            <td>{holding.s_no}</td>
            <td>{holding.entitlement_id}</td>
            <td>{holding.folio_number.split('-')[1]}</td>
            <td>{holding.shareholder_name}</td>
            {txn_type.value === DIVIDEND_DISBURSEMENT_TEMPLATE && (
              <>
                <td>{holding.filer}</td>
                <td>{holding.total_holding}</td>
                <td>{holding.gross_dividend}</td>
                <td>{holding.tax_percentage} </td>
                <td>{holding.tax}</td>
                <td>{holding.zakat}</td>
              </>
            )}
            {txn_type.value === BONUS_SHARE_ALLOTMENT_TEMPLATE && (
              <>
                <td>{holding.bonus_shares}</td>
                <td>{holding.b_fraction}</td>
              </>
            )}
            {txn_type.value === RIGHT_SHARE_ALLOTMENT_TEMPLATE && (
              <>
                <td>{holding.right_shares}</td>
                <td>{holding.r_fraction}</td>
              </>
            )}
            <td>{holding.account_title}</td>
            <td>{holding.account_no}</td>
            <td>{holding.bank}</td>
            <td>{holding.branch}</td>
          </tr>
        ));
  const pageCount = !search
    ? Math.ceil(entitlements.length / entitlementsPerPage)
    : Math.ceil(searchedEntitlements.length / entitlementsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  return (
    <div className="row">
      <div className="col-md-12">
        {entitlementsLoading ? (
          <Spinner />
        ) : (
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <div className="w-100">
                <div className="row">
                  <div className="col-md-4 col-lg-4 col-sm-12">
                    <div className="form-group">
                      <small>{`Search by`}</small>
                      <input
                        className={`form-control`}
                        name="name"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`${
                          state.folio_number
                            ? "Folio Number"
                            : state.account_title
                            ? "Account Title"
                            : state.shareholder_name
                            ? "Shareholder Name"
                            : "Folio Number"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-12 mt-3">
                    <div className="checkbox checkbox-success ">
                      <input
                        id="shareholder_name"
                        type="checkbox"
                        checked={state.shareholder_name}
                        onChange={() => dispatch({ type: SHAREHOLDER_NAME })}
                      />
                      <label htmlFor="shareholder_name">Shareholder Name</label>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2 col-sm-12 mt-3">
                    <div className="checkbox checkbox-success ">
                      <input
                        id="folio_number"
                        type="checkbox"
                        checked={state.folio_number}
                        onChange={(e) => dispatch({ type: FOLIO_NUMBER })}
                      />
                      <label htmlFor="folio_number">Folio Number</label>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2 col-sm-12 mt-3">
                    <div className="checkbox checkbox-success ">
                      <input
                        id="account_title"
                        type="checkbox"
                        checked={state.account_title}
                        onChange={(e) => {
                          dispatch({ type: ACCOUNT_TITLE });
                        }}
                      />
                      <label htmlFor="account_title">Account Title</label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  className="btn btn-success"
                  onClick={generateExcelReport}
                >
                  Generate Excel Report
                </button>
              </div>
            </div>
            {entitlementsLoading ? (
              <Spinner />
            ) : (
              <div className="card-body">
                <table className="table table-responsive">
                  <thead>
                    <tr>
                      <th>S No.</th>
                      <th>Entitlement Id</th>
                      <th>Folio Number</th>
                      <th>Name</th>
                      {txn_type.value === DIVIDEND_DISBURSEMENT_TEMPLATE && (
                        <>
                          <th>Filer</th>
                          <th>Share Holding</th>
                          <th>Gross Dividend</th>
                          <th>Tax Rate</th>
                          <th>Tax Amount</th>
                          <th>Zakat Amount</th>
                        </>
                      )}
                      {txn_type.value === BONUS_SHARE_ALLOTMENT_TEMPLATE && (
                        <>
                          <th>Bonus</th>
                          <th>B Fraction</th>
                        </>
                      )}
                      {txn_type.value === RIGHT_SHARE_ALLOTMENT_TEMPLATE && (
                        <>
                          <th>Right</th>
                          <th>R Fraction</th>
                        </>
                      )}
                      <th>Account Title</th>
                      <th>Account No</th>
                      <th>Bank</th>
                      <th>Branch</th>
                    </tr>
                  </thead>
                  <tbody>{displayEntitlementsPerPage}</tbody>
                </table>
                <center className="d-flex justify-content-center py-3">
                  <nav className="pagination">
                    <ReactPaginate
                      previousLabel="Previous"
                      nextLabel="Next"
                      pageCount={pageCount}
                      onPageChange={changePage}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      containerClassName={"pagination"}
                      previousClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextClassName={"page-item"}
                      nextLinkClassName={"page-link"}
                      disabledClassName={"disabled"}
                      pageLinkClassName={"page-link"}
                      pageClassName={"page-item"}
                      activeClassName={"page-item active"}
                      activeLinkClassName={"page-link"}
                    />
                  </nav>
                </center>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTransactionEntitlements;
