import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { errorStyles } from "../../defaultStyles";
import * as _ from "lodash";
import Select from "react-select";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addElectionSchema } from "../../../store/validations/electionValidation";
import NumberFormat from "react-number-format";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import {
  WATCH_ELECTIONS,
  WATCH_ELECTIONS_DROPDOWN,
} from "../../../redux/actionTypes";
import { addElection } from "../../../store/services/election.service";
import { getFoundObject, thousandSeperator } from "utilities/utilityFunctions";
import { addProxySchema } from "store/validations/proxyValidation";

export default function CastVote({ setViewAddPage }) {
  const election = JSON.parse(sessionStorage.getItem("selectedElection")) || {};
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [investorsDropdown, setInvestorsDropdown] = useState([]);
  const [electronicShares, setElectronicShares] = useState("");
  const [physicalShares, setPhysicalShares] = useState("");
  const [proxytoInvestorsDropdown, setProxytoInvestorsDropdown] = useState([]);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const { companies_dropdown, companies_data_loading } = useSelector(
    (data) => data.Companies
  );
  const { elections_dropdown, elections_dropdown_loading, elections_data } =
    useSelector((data) => data.Elections);
  const { investors_dropdown, investors_data_loading, investors_data } =
    useSelector((data) => data.Investors);

  const { shareholders_data, shareholders_data_loading } = useSelector(
    (data) => data.Shareholders
  );

  // Validation Declarations
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm({ resolver: yupResolver(addProxySchema) });

  useEffect(() => {
    if (shareholders_data.length > 0) {
      const company_investors = shareholders_data.filter(
        (holder) => holder.company_code === election?.company_code?.value
      );
      const company_investors_dropdown = _.uniqBy(
        company_investors,
        "shareholder_id"
      ).map((holder) => ({
        label: `${holder.shareholder_name} - ${holder.shareholder_id}`,
        value: holder.shareholder_id,
      }));

      setInvestorsDropdown(company_investors_dropdown);
    }
  }, [shareholders_data]);
  useEffect(() => {
    setValue("company_code", election?.company_code);
    setValue("election_id", election?.election_option);
  }, []);

  useEffect(() => {
    if (watch("election_id")?.value) {
      setValue(
        "company_code",
        getFoundObject(
          companies_dropdown,
          elections_data.find(
            (ele) => ele.election_id === watch("election_id")?.value
          )?.company_code
        )
      );
    }
  }, [watch("election_id")]);

  useEffect(() => {
    if (shareholders_data.length > 0 && watch("investor_id")?.value) {
      const company_investors = shareholders_data.filter(
        (holder) => holder.company_code === election?.company_code?.value
      );
      const company_investors_dropdown = _.uniqBy(
        company_investors,
        "shareholder_id"
      ).map((holder) => ({
        label: `${holder.shareholder_name} - ${holder.shareholder_id}`,
        value: holder.shareholder_id,
      }));

      setInvestorsDropdown(company_investors_dropdown);
      setPhysicalShares(
        thousandSeperator(
          shareholders_data
            .filter(
              (holder) =>
                holder.company_code === watch("company_code")?.value &&
                holder.folio_number !== watch("company_code")?.value + "-0"
            )
            .filter(
              (holder) => holder.shareholder_id === watch("investor_id")?.value
            )
            .filter((holder) => holder.cdc_key === "NO")
            .map((holder) => parseInt(holder.physical_shares) || 0)
            .reduce((acc, curr) => acc + curr, 0)
        )
      );
      setElectronicShares(
        thousandSeperator(
          shareholders_data
            .filter(
              (holder) =>
                holder.company_code === watch("company_code")?.value &&
                holder.folio_number !== watch("company_code")?.value + "-0"
            )
            .filter(
              (holder) => holder.shareholder_id === watch("investor_id")?.value
            )
            .filter((holder) => holder.cdc_key === "YES")
            .map((holder) => parseInt(holder.electronic_shares) || 0)
            .reduce((acc, curr) => acc + curr, 0)
        )
      );
    }
  }, [watch("investor_id")]);

  const handleCastVote = async (data) => {
    const email = sessionStorage.getItem("email");
    // try {
    //   setLoading(true);

    //   if (response.data.status === 200) {
    //     setTimeout(() => {
    //       dispatch({ type: WATCH_ELECTIONS_DROPDOWN });
    //       dispatch({ type: WATCH_ELECTIONS });
    //       toast.success(`${response.data.message}`);
    //       setLoading(false);
    //       setViewAddPage(false);
    //     }, 2000);
    //   } else {
    //     toast.error(`${response.data.message}`);
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   !!error?.response?.data?.message
    //     ? toast.error(error?.response?.data?.message)
    //     : toast.error("Elections Not Added");
    // }
  };
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleCastVote)}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>ELECTION INFO</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="election_id">Election ID</label>
                    <Controller
                      name="election_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={election.election_option}
                          isLoading={elections_dropdown_loading}
                          isDisabled={!!election?.election_id}
                          options={elections_dropdown}
                          id="election_id"
                          placeholder="Select Election"
                          styles={errors.election_id && errorStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.election_id?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="company_code">Company</label>
                    <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="company_code"
                          placeholder="Select Company"
                          isDisabled={election?.company_code}
                          options={companies_dropdown}
                          styles={errors.company_code && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.company_code?.message}
                    </small>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 col-lg-6 col-md-5">
                      <div className="form-group my-2">
                        <label htmlFor="election_from">Election From</label>
                        <input
                          className="form-control"
                          name="election_from"
                          type="date"
                          value={election?.election_from}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-6 col-md-5">
                      <div className="form-group my-2">
                        <label htmlFor="election_to">Election To</label>
                        <input
                          className="form-control"
                          name="election_to"
                          type="date"
                          value={election?.election_to}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>INVESTOR INFO</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="investor_id">Investor</label>
                    <Controller
                      name="investor_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={shareholders_data_loading}
                          options={investorsDropdown}
                          id="investor_id"
                          placeholder="Select Investor"
                          styles={errors.investor_id && errorStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.investor_id?.message}
                    </small>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 col-lg-6">
                      <div className="form-group my-2">
                        <label htmlFor="physical_shares">Physical Shares</label>
                        <input
                          className="form-control"
                          name="physical_shares"
                          type="text"
                          placeholder="Select Investor"
                          readOnly
                          value={physicalShares}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 col-lg-6">
                      <div className="form-group my-2">
                        <label htmlFor="electronic_shares">
                          Electronic Shares
                        </label>
                        <input
                          className="form-control"
                          name="electronic_shares"
                          type="type"
                          placeholder="Enter Electronic Shares"
                          readOnly
                          value={electronicShares}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Vote Casting</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="w-100">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Candidates</th>
                            <th>Votes</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="candidate"
                                id="candidate"
                                placeholder="Canddiate"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                name="vote"
                                id="vote"
                                placeholder="votes"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 col-sm-12 col-lg-4">
                      <label htmlFor="total_vote"></label>
                      <input
                        className="form-control"
                        type="text"
                        name="total_vote"
                        id="total_vote"
                        placeholder="Total Vote"
                      />
                    </div>
                    <div className="col-md-4 col-sm-12 col-lg-4">
                      <label htmlFor="total_casted"></label>
                      <input
                        className="form-control"
                        type="text"
                        name="total_casted"
                        id="total_casted"
                        placeholder="Total Casted"
                      />
                    </div>
                    <div className="col-md-4 col-sm-12 col-lg-4">
                      <label htmlFor="remaining"></label>
                      <input
                        className="form-control"
                        type="text"
                        name="remaining"
                        id="remaining"
                        placeholder="Total Remaining"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={Boolean(loading)}
              >
                {loading ? (
                  <>
                    <span className="fa fa-spinner fa-spin"></span>
                    <span>{"Loading..."}</span>
                  </>
                ) : (
                  <span>{"Submit"}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </Fragment>
    </div>
  );
}
