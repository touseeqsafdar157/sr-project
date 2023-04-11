import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { darkStyle, errorStyles } from "../../defaultStyles";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateElectionSchema } from "../../../store/validations/electionValidation";
import NumberFormat from "react-number-format";

export default function ViewElection({ setViewPage }) {
  const election = JSON.parse(sessionStorage.getItem("selectedElection"));
  const [loading, setLoading] = useState(false);
  const { companies_dropdown, companies_data_loading } = useSelector(
    (data) => data.Companies
  );

  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(updateElectionSchema),
    defaultValues: updateElectionSchema(election).cast(),
  });

  const handleEditElection = async () => {};
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
                          isLoading={companies_data_loading}
                          options={companies_dropdown}
                          id="company_code"
                          placeholder="Select Company"
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                          styles={errors.company_code && errorStyles}
                          isDisabled
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
                      readOnly
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
                          readOnly
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
                          readOnly
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
                          readOnly
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
                          readOnly
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
                          readOnly
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
                          readOnly
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
                          readOnly
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
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.agm_date?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Fragment>
    </div>
  );
}
