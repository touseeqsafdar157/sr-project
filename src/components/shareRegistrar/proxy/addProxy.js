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
import { thousandSeperator } from "utilities/utilityFunctions";
import { addProxySchema } from "store/validations/proxyValidation";

export default function AddProxy({ setViewAddPage }) {
  const election = JSON.parse(sessionStorage.getItem("selectedElection")) || {};
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [investorsDropdown, setInvestorsDropdown] = useState([]);
  const [proxytoInvestorsDropdown, setProxytoInvestorsDropdown] = useState([]);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const { companies_dropdown, companies_data_loading } = useSelector(
    (data) => data.Companies
  );
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
    if (shareholders_data.length > 0 && watch("shareholder")?.value) {
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
  }, [watch("shareholder")]);

  const handleAddProxy = async (data) => {
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
        <form onSubmit={handleSubmit(handleAddProxy)}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Shareholder </h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="shareholder">Shareholder</label>
                    <Controller
                      name="shareholder"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={shareholders_data.length === 0}
                          options={investorsDropdown}
                          id="shareholder"
                          placeholder="Select Shareholder"
                          styles={errors.shareholder && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.shareholder?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="physical_shares">Physical Shares</label>
                    <input
                      className="form-control"
                      name="physical_shares"
                      type="text"
                      placeholder="Select Shareholder"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="electronic_shares">Electronic Shares</label>
                    <input
                      className="form-control"
                      name="electronic_shares"
                      type="text"
                      placeholder="Select Shareholder"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Proxy To</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <span className="checkbox checkbox-success ">
                      <input
                        id="company_name"
                        type="checkbox"
                        onChange={(e) => {}}
                      />
                      <label htmlFor="company_name">
                        Registered Shareholder
                      </label>
                    </span>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="proxy_to_shareholder">Shareholder</label>
                    <Controller
                      name="proxy_to_shareholder"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={shareholders_data_loading}
                          options={investorsDropdown}
                          id="proxy_to_shareholder"
                          placeholder="Select Shareholder"
                          styles={errors.proxy_to_shareholder && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.proxy_to_shareholder?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shareholder_name">Shareholder Name</label>
                    <input
                      className={`form-control ${
                        errors.shareholder_name && "border border-danger"
                      }`}
                      name="shareholder_name"
                      type="text"
                      placeholder="Enter Name"
                      {...register("shareholder_name")}
                    />
                    <small className="text-danger">
                      {errors.shareholder_name?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="CNIC">CNIC</label>
                    <Controller
                      name="CNIC"
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          className={`form-control ${
                            errors.CNIC && "border border-danger"
                          }`}
                          placeholder="Enter CNIC"
                          mask="99999-9999999-9"
                        ></InputMask>
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.CNIC?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Mobile No.</label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon2">
                          +92
                        </span>
                      </div>
                      <Controller
                        name="mobile"
                        render={({ field }) => (
                          <NumberFormat
                            {...field}
                            className={`form-control ${
                              errors.mobile && "border-danger"
                            }`}
                            id="mobile"
                            allowNegative={false}
                            placeholder="Enter Mobile No."
                          />
                        )}
                        control={control}
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
