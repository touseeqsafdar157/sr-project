import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { darkStyle, errorStyles } from "../../defaultStyles";
import Select from "react-select";
import * as _ from "lodash";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateElectionSchema } from "../../../store/validations/electionValidation";
import NumberFormat from "react-number-format";
import { toast } from "react-toastify";
import { updateElection } from "../../../store/services/election.service";
import {
  WATCH_ELECTIONS,
  WATCH_ELECTIONS_DROPDOWN,
} from "../../../redux/actionTypes";
import { thousandSeperator } from "utilities/utilityFunctions";

export default function EditElection({ setViewEditPage }) {
  const dispatch = useDispatch();
  const election = JSON.parse(sessionStorage.getItem("selectedElection"));
  const [loading, setLoading] = useState(false);
  const [investorsDropdown, setInvestorsDropdown] = useState();
  const { companies_dropdown, companies_data_loading } = useSelector(
    (data) => data.Companies
  );

  const { shareholders_data, shareholders_data_loading } = useSelector(
    (data) => data.Shareholders
  );
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(updateElectionSchema(election)),
    defaultValues: updateElectionSchema(election).cast(),
  });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({ control, name: "candidates" });

  // GET Investors on Company Change
  useEffect(() => {
    if (watch("company_code")?.value) {
      const company_investors = shareholders_data.filter(
        (holder) => holder.company_code === watch("company_code")?.value
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
  }, [watch("company_code")]);

  const handleEditElection = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await updateElection(
        email,
        election.election_id,
        data.company_code.value,
        data.term,
        data.election_from,
        data.election_to,
        data.number_of_directors,
        data.effect_from,
        data.last_date,
        data.agm_date,
        data.application_from,
        data.application_to
      );

      if (response.data.status === 200) {
        setTimeout(() => {
          dispatch({ type: WATCH_ELECTIONS_DROPDOWN });
          dispatch({ type: WATCH_ELECTIONS });
          toast.success(`${response.data.message}`);
          setLoading(false);
          setViewEditPage(false);
        }, 2000);
      } else {
        setLoading(false);
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      !!error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : toast.error("Elections Not UPdated");
    }
  };
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleEditElection)}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Company Information </h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="election_id">Election ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="election_id"
                      id="election_id"
                      readOnly
                      value={election.election_id}
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="company_code">Company</label>
                    <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={shareholders_data_loading}
                          options={companies_dropdown}
                          id="company_code"
                          placeholder="Select Company"
                          styles={errors.company_code && errorStyles}
                          isDisabled={shareholders_data_loading}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.company_code?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="term">Term</label>
                    <input
                      className={`form-control ${
                        errors.term && "border border-danger"
                      }`}
                      name="term"
                      type="text"
                      placeholder="Enter Term"
                      {...register("term")}
                    />
                    <small className="text-danger">
                      {errors.term?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>No of Directors</label>
                    <Controller
                      name="number_of_directors"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.number_of_directors && "border-danger"
                          }`}
                          id="number_of_directors"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.number_of_directors?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>No of Candidates</label>
                    <Controller
                      name="no_of_candidates"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_of_candidates && "border-danger"
                          }`}
                          id="no_of_candidates"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_of_candidates?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Election Candidates</label>
                    <Controller
                      name="election_candidates"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.election_candidates && "border-danger"
                          }`}
                          id="election_candidates"
                          allowNegative={false}
                          placeholder="Enter Candidates"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.election_candidates?.message}
                    </small>
                    <div className="form-group my-2">
                      <label>Elected Candidates</label>
                      <Controller
                        name="elected_candidates"
                        render={({ field }) => (
                          <NumberFormat
                            {...field}
                            className={`form-control ${
                              errors.elected_candidates && "border-danger"
                            }`}
                            id="elected_candidates"
                            allowNegative={false}
                            placeholder="Elected Candidates"
                            readOnly
                          />
                        )}
                        control={control}
                      />
                      <small className="text-danger">
                        {errors.elected_candidates?.message}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header b-t-info">
                  <h5>CANDIDATES</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <button
                        type="button"
                        className="btn btn-success btn-block"
                        onClick={(e) => append({ investor_id: null })}
                        disabled={investorsDropdown.length === 0}
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                  <div className="row my-2">
                    <div className="w-100">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="text-nowrap">Investor </th>
                            <th className="text-nowrap">No of Shares (E/P)</th>
                            <th className="text-nowrap">Total Folios</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map((item, index) => (
                            <tr key={item.id}>
                              <td>
                                <Controller
                                  name={`candidates.${index}.investor_id`}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      isLoading={shareholders_data_loading}
                                      options={investorsDropdown}
                                      id={`candidates.${index}.investor_id`}
                                      placeholder="Select Candidate"
                                      styles={
                                        errors.candidates?.[index]
                                          ?.investor_id && errorStyles
                                      }
                                    />
                                  )}
                                  control={control}
                                />
                                <small className="text-danger">
                                  {
                                    errors.candidates?.[index]?.investor_id
                                      ?.message
                                  }
                                </small>
                              </td>
                              <td>
                                {thousandSeperator(
                                  shareholders_data
                                    .filter(
                                      (holder) =>
                                        holder.company_code ===
                                          watch("company_code")?.value &&
                                        holder.folio_number !==
                                          watch("company_code")?.value + "-0"
                                    )
                                    .filter(
                                      (holder) =>
                                        holder.shareholder_id ===
                                        watch("candidates")[index].investor_id
                                          ?.value
                                    )
                                    .filter(
                                      (holder) => holder.cdc_key === "YES"
                                    )
                                    .map(
                                      (holder) =>
                                        parseInt(holder.electronic_shares) || 0
                                    )
                                    .reduce((acc, curr) => acc + curr, 0)
                                ) +
                                  "/" +
                                  thousandSeperator(
                                    shareholders_data
                                      .filter(
                                        (holder) =>
                                          holder.company_code ===
                                            watch("company_code")?.value &&
                                          holder.folio_number !==
                                            watch("company_code")?.value + "-0"
                                      )
                                      .filter(
                                        (holder) =>
                                          holder.shareholder_id ===
                                          watch("candidates")[index].investor_id
                                            ?.value
                                      )
                                      .filter(
                                        (holder) => holder.cdc_key === "NO"
                                      )
                                      .map(
                                        (holder) =>
                                          parseInt(holder.physical_shares) || 0
                                      )
                                      .reduce((acc, curr) => acc + curr, 0)
                                  )}
                              </td>
                              <td>
                                {
                                  shareholders_data
                                    .filter(
                                      (holder) =>
                                        holder.company_code ===
                                        watch("company_code")?.value
                                    )
                                    .filter(
                                      (holder) =>
                                        holder.shareholder_id ===
                                        watch("candidates")[index].investor_id
                                          ?.value
                                    ).length
                                }
                              </td>
                              <td>
                                <i
                                  className="fa fa-trash-o"
                                  style={{
                                    width: 35,
                                    fontSize: 16,
                                    padding: 11,
                                    color: "#FF0000",
                                    cursor: "pointer",
                                  }}
                                  id={`delete${index}`}
                                  data-placement="top"
                                  onClick={() => remove(index)}
                                ></i>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Election Information</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6 col-lg-6 col-md-5">
                      <div className="form-group my-2">
                        <label htmlFor="election_from">Election From</label>
                        <input
                          className={`form-control ${
                            errors.election_from && "border border-danger"
                          }`}
                          name="election_from"
                          type="date"
                          {...register("election_from")}
                        />
                        <small className="text-danger">
                          {errors.election_from?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-6 col-md-5">
                      <div className="form-group my-2">
                        <label htmlFor="election_to">Election To</label>
                        <input
                          className={`form-control ${
                            errors.election_to && "border border-danger"
                          }`}
                          name="election_to"
                          type="date"
                          {...register("election_to")}
                        />
                        <small className="text-danger">
                          {errors.election_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 col-lg-6 col-md-5">
                      <div className="form-group my-2">
                        <label htmlFor="application_from">
                          Application From
                        </label>
                        <input
                          className={`form-control ${
                            errors.application_from && "border border-danger"
                          }`}
                          name="application_from"
                          type="date"
                          {...register("application_from")}
                        />
                        <small className="text-danger">
                          {errors.application_from?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-6 col-md-5">
                      <div className="form-group my-2">
                        <label htmlFor="application_to">Application To</label>
                        <input
                          className={`form-control ${
                            errors.application_to && "border border-danger"
                          }`}
                          name="application_to"
                          type="date"
                          {...register("application_to")}
                        />
                        <small className="text-danger">
                          {errors.application_to?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 col-lg-6 col-md-5">
                      <div className="form-group my-2">
                        <label htmlFor="effect_from">Effect From</label>
                        <input
                          className={`form-control ${
                            errors.effect_from && "border border-danger"
                          }`}
                          name="effect_from"
                          type="date"
                          {...register("effect_from")}
                        />
                        <small className="text-danger">
                          {errors.effect_from?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-6 col-md-5">
                      <div className="form-group my-2">
                        <label htmlFor="last_date">Last Date</label>
                        <input
                          className={`form-control ${
                            errors.last_date && "border border-danger"
                          }`}
                          name="last_date"
                          type="date"
                          {...register("last_date")}
                        />
                        <small className="text-danger">
                          {errors.last_date?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="agm_date">AGM Date</label>
                    <input
                      className={`form-control ${
                        errors.agm_date && "border border-danger"
                      }`}
                      name="agm_date"
                      type="date"
                      {...register("agm_date")}
                    />
                    <small className="text-danger">
                      {errors.agm_date?.message}
                    </small>
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
