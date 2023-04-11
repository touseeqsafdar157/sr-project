import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import NumberFormat from "react-number-format";
import { setFolioCounterSchema } from "store/validations/distinctiveCounterValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { errorStyles } from "components/defaultStyles";
import { toast } from "react-toastify";
import { getCompanies } from "../../../store/services/company.service";
import {
  getFolioCounter,
  updateFolioCounter,
} from "store/services/counter.service";

const UpdateFolioCounter = () => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [folioCounter, setFolioCounter] = useState({});
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);

  // Select Ref
  const companyRef = useRef(null);
  const renderFolioCounter = (key) => (
    <h4>
      {apiLoading
        ? "Loading..."
        : !Object.keys(folioCounter).length
        ? "xxxxxx"
        : folioCounter[key]}
    </h4>
  );
  // Validation Declarations For Certificate Counter
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({ resolver: yupResolver(setFolioCounterSchema) });
  useEffect(() => {
    const getAllCompanies = async () => {
      setIsLoadingCompany(true);
      try{
      const response = await getCompanies(baseEmail)
      if (response.status===200) {
            const parents = response.data.data
            const companies_dropdowns = response.data.data.map((item) => {
              let label = `${item.code} - ${item.company_name}`;
              return { label: label, value: item.code };
            });
          setCompanies_dropdown(companies_dropdowns);
            setCompanies(parents)
            setIsLoadingCompany(false)
      } }catch(error) {
        setIsLoadingCompany(false);
      }
      };
      getAllCompanies();

  }, [])

  const handleSetFolioCounter = async (data) => {
    setLoading(true);
    try {
      const email = sessionStorage.getItem("email");
      const response = await updateFolioCounter(
        email,
        data.company_code.value,
        data.folio_counter
      );
      if (response?.status === 200) {
        toast.success(`${response.data.message}`);
        setLoading(false);
        reset();
        companyRef.current.clearValue();
      } else {
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      !!error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : console.log("Update Folio Counter Failed");
      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    const getCounters = async () => {
      setApiLoading(true);
      try {
        const email = sessionStorage.getItem("email") || "";
        const response = await getFolioCounter(
          email,
          watch("company_code")?.value
        );
        if (response.status === 200) {
          setFolioCounter(response.data.data);
          setApiLoading(false);
        }
        setApiLoading(false);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Counters Not Found");
        setApiLoading(false);
      }
      setApiLoading(false);
    };
    if (!!watch("company_code")?.value) {
      getCounters();
    }
  }, [watch("company_code")]);

  return (
    <div className="row">
      <div className="col-md-6 col-lg-6 col-sm-12">
        <div className="card">
          <div className="card-header">
            <h5>UPDATE FOLIO COUNTER</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(handleSetFolioCounter)}>
              <div className="row">
                <div className="col-12">
                  <div className="form-group my-2">
                    <label htmlFor="company_code">Select Company</label>
                    <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          ref={companyRef}
                          isLoading={isLoadingCompany}
                          options={companies_dropdown}
                          id="company_code"
                          placeholder="Select Company"
                          styles={errors.company_code && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.company_code?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Folio Counter</label>
                    <Controller
                      name="folio_counter"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.folio_counter && "border-danger"
                          }`}
                          id="folio_counter"
                          allowNegative={false}
                          placeholder="Enter Counter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.folio_counter?.message}
                    </small>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
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
                      <span>{"Update"}</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-lg-6 col-sm-12">
        <div className="card">
          <div className="card-header">
            <h5>CURRENT FOLIO COUNTER</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                {!watch("company_code")?.value && <h6>Select Company</h6>}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <small className="text-muted">Folio Counter</small>
                {renderFolioCounter("folio_counter")}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <small className="text-muted">SYMBOL</small>
                {renderFolioCounter("symbol")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateFolioCounter;
