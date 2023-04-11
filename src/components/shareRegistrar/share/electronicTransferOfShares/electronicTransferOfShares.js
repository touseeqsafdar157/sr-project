import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import {
  folio_setter,
  company_setter,
  certificate_setter,
} from "../../../../store/services/dropdown.service";
import { useSelector, useDispatch } from "react-redux";
import Breadcrumb from "../../../common/breadcrumb";
import { addSplitShareSchema } from "../../../../store/validations/splitShareValidation";
import {
  getvalidDateYMD,
  thousandSeperator,
} from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import { addElectronicTransferOfShareSchema } from "../../../../store/validations/electronicTransferOfSharesValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import {
  addInvestorRequest,
  addInvestorRequestTOS,
} from "../../../../store/services/investor.service";
import {
  getCertificateNo,
  getCompanies,
} from "../../../../store/services/company.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import {
  COMPANIES_END_DROPDOWN_LOADING,
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import {
  getShareholders
} from "../../../../store/services/shareholder.service";
import { getCompanyById } from "../../../../store/services/company.service";
const ElectronicTransferOfShares = ({ setInvestorRequestForm, selectedCompany, companyName }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  //Refs
  const transferor_ref = useRef(null);
  const transferee_ref = useRef(null);
  // States
  const [loading, setLoading] = useState(false);
  const [folio_options, setFolio_options] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [df_snum, setDf_snum] = useState("");
  const [shareHoldings, setShareHoldings] = useState([]);
  const [company_options, setCompany_options] = useState([]);
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [electronicShares, setElectronicShares] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [inactive_shareholders_data, setInactive_shareholders_data] = useState([])
  const [inactive_shareholders_data_loading, setInactive_shareholders_data_loading] = useState(false);
  const [companies_data, setCompanies_data] = useState([])
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [companies_selector, setCompanies_selector] = useState([]);

  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({ resolver: yupResolver(addElectronicTransferOfShareSchema) });

  const getShareHoldersByCompanyCode = async () => {
    setInactive_shareholders_data_loading(true);
    try {
      const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
      if (response.status === 200) {
        const parents = response.data.data;
        console.log("🚀 ~ ~ getShareHoldersByCompanyCode ~ parents:", parents)
        setInactive_shareholders_data(parents)
        // setAllShareholders(parents)
        // folio_number_ref.current.clearValue();
        // setValue("split_parts", "0");
        const options = parents
          .filter((item) => item.cdc_key === "NO")
          .map((item) => {
            let label = `${item.folio_number} (${item.shareholder_name}) `;
            return { label: label, value: item.folio_number };
          });


        setFolio_options(options);
        setInactive_shareholders_data_loading(false);
      }
    } catch (error) {
      setInactive_shareholders_data_loading(false);
      toast.error("Error fetching shareholders")
    }
  };

  const getSelectedCompanyInfo = async () => {
    try {
      const response = await getCompanyById(baseEmail, selectedCompany);
      if (response.status === 200) {
        const parents = response.data.data;
                setCompanies_selector(parents);
      }
    } catch (error) {
      toast.error("Error fetching company info")
    }
  }

  useEffect(() => {
      getSelectedCompanyInfo()
      getShareHoldersByCompanyCode()
  }, [])


  // useEffect(() => {
  //   const getAllCompanies = async () => {
  //     setCompanies_data_loading(true);
  //     try{
  //     const response = await getCompanies(baseEmail)
  //     if (response.status===200) {
  //           const parents = response.data.data
  //           setCompanies_data(parents)
  //           setCompanies_data_loading(false)
  //     } }catch(error) {
  //       setCompanies_data_loading(false);
  //     }
  //     };
  //   const getAllShareHolders = async () => {
  //     setInactive_shareholders_data_loading(true);
  //     try{
  //     const response = await getShareholders(baseEmail)
  //     if (response.status===200) {
  //           const parents = response.data.data
  //           setInactive_shareholders_data(parents)
  //           setInactive_shareholders_data_loading(false)
  //     } }catch(error) {
  //       setInactive_shareholders_data_loading(false);
  //     }
  //     };
  //     getAllShareHolders();
  //     getAllCompanies();
  // }, [])
  useEffect(() => {
    if (!!watch("transferor_folio_no")?.value) {
      const shares = inactive_shareholders_data.find(
        (item) => item.folio_number === watch("transferor_folio_no")?.value
      )?.electronic_shares;
      setElectronicShares(shares);
    }
  }, [watch("transferor_folio_no")]);

  useEffect(() => {
    if (!!watch("company_code")?.value) {
      transferor_ref.current.clearValue();
      transferee_ref.current.clearValue();
      const options = inactive_shareholders_data
        .filter((data) => data.company_code === watch("company_code")?.value)
        .filter((item) => item.cdc_key === "YES")
        .map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.folio_number };
        });
      console.log("🚀 ~ file: electronicTransferOfShares.js:170 ~ useEffect ~ options:", options)
      setFolio_options(options);
    }
  }, [watch("company_code"),inactive_shareholders_data]);
  useEffect(() => {
    if (!companies_data_loading) {
      setCompanies_dropdown(
        companies_data
          .filter((item) => item.company_type === "Private")
          .map((item) => {
            let label = `${item.code} - ${item.company_name}`;
            return { label: label, value: item.code };
          })
      );
    }
  }, [companies_data_loading]);
  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addInvestorRequestTOS(
        email,
        "ETOS", //   Type of Request
        data.transferor_folio_no.value, // FROM
        // data.company_code.value,
        selectedCompany,
        // companies_data.find((comp) => comp.code === data.company_code.value)
        //   ?.symbol, //    Symbol
        companies_selector?.symbol, // Symbol
        data.transferee_folio_no.value, // TO
        data.quantity, // Quantity
        data.request_date,
        [],
        data.remarks,
        data.transfer_no,
        data.execution_date
      );

      if (response.data.status === 200) {
        setLoading(false);
        setInvestorRequestForm(false);
        toast.success(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      !!error?.response?.data?.message
        ? toast.error(`${error?.response?.data?.message}`)
        : toast.error("Request Not Submitted");
    }
  };
  return (
    <Fragment>
      <div className="container-fluid">
        <form onSubmit={handleSubmit(handleAddInvestorRequest)}>
          <div className="row">
            <div className="col-md-4 col-sm-12 col-lg-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Request</h5>
                </div>
                <div className="card-body">
                  {/* Company */}
                  <div className="form-group my-2">
                    <label htmlFor="company_code">Company </label>
                    <Controller
                      data-testid="company_code"
                      name="company_code"
                      render={({ field, value }) => (
                        <Select
                          {...field}
                          // isLoading={companies_data_loading}
                          // options={companies_dropdown}
                          id="company_code"
                          placeholder={`${selectedCompany} - ${companyName}`}
                          isDisabled={true}
                          value={value}
                          styles={errors.company_code && errorStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.company_code?.message}
                    </small>
                  </div>
                  {/* Request Type */}
                  <div className="form-group my-2">
                    <label>Request Type</label>
                    <input
                      className="form-control"
                      type="text"
                      name="request_type"
                      id="request_tyoe"
                      value="Electronic Transfer Of Shares"
                    />
                  </div>
                  {/* Request Date */}
                  <div className="form-group my-2">
                    <label htmlFor="request_date">Request Date</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.request_date && "border border-danger"
                      }`}
                      name="request_date"
                      id="request_date"
                      {...register("request_date")}
                      // defaultValue={getvalidDateYMD(new Date())}
                    />
                    <small className="text-danger">
                      {errors.request_date?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="execution_date">Execution Date</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.execution_date && "border border-danger"
                      }`}
                      name="execution_date"
                      id="execution_date"
                      {...register("execution_date")}
                    />
                    <small className="text-danger">
                      {errors.execution_date?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Transfer Number</label>
                    <Controller
                      data-testid="transfer_no"
                      name="transfer_no"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.transfer_no && "border-danger"
                          }`}
                          id="transfer_no"
                          allowNegative={false}
                          placeholder="Transfer Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.transfer_no?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="remarks">Remarks (optional)</label>
                    <textarea
                      className={`form-control ${
                        errors.remarks && "border border-danger"
                      }`}
                      type="text"
                      name="remarks"
                      id="remarks"
                      placeholder="Enter Remarks"
                      {...register("remarks")}
                    />
                    <small className="text-danger">
                      {errors.remarks?.message}
                    </small>
                  </div>
                  {/* Execution Date */}
                  {/* <div className="form-group my-2">
                    <label htmlFor="execution_date">Execution Date</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.execution_date && "border border-danger"
                      }`}
                      name="execution_date"
                      id="execution_date"
                      {...register("execution_date")}
                    />
                    <small className="text-danger">
                      {errors.execution_date?.message}
                    </small>
                  </div> */}
                  {/* Requester Folio */}
                  {/* <div className="form-group my-2">
                        <label htmlFor="requester_folio">Requester Folio</label>
                        <Controller
                          data-testid="requester_folio"
                          name="requester_folio"
                          render={({ field }) => (
                            <Select
                              {...field}
                              isLoading={folio_options.length === 0}
                              options={folio_options}
                              id="requester_folio"
                              placeholder="Select Folio Number"
                              styles={errors.requester_folio && errorStyles}
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.requester_folio?.message}
                        </small>
                      </div> */}
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12 col-lg-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Transfer Details</h5>
                </div>
                <div className="card-body">
                  {/* Folio Number */}
                  <div className="form-group my-2">
                  {console.log('folio=>',folio_options)}
                    <h6>Transferor</h6>
                    <div className="form-group">
                      <label htmlFor="transferor_folio_no">Folio Number</label>
                      <Controller
                        data-testid="transferor_folio_no"
                        name="transferor_folio_no"
                        render={({ field }) => (
                          <Select
                            {...field}
                            isLoading={folio_options.length===0}
                            options={folio_options}
                            ref={transferor_ref}
                            id="transferor_folio_no"
                            styles={errors.transferor_folio_no && errorStyles}
                            placeholder={
                              !selectedCompany
                                ? "Select Company First"
                                : "Select Folio Number"
                            }
                            isDisabled={!selectedCompany}
                          />
                        )}
                        control={control}
                      />
                      <small className="text-danger">
                        {errors.transferor_folio_no?.message}
                      </small>
                    </div>
                    <div className="form-group">
                      <div className="form-group">
                        <label htmlFor="transferor_name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="transferor_name"
                          placeholder="Enter Name"
                          value={
                            !inactive_shareholders_data_loading
                              ? inactive_shareholders_data.find(
                                  (holder) =>
                                    holder.folio_number ===
                                    watch("transferor_folio_no")?.value
                                )?.shareholder_name
                              : ""
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  {/* Name */}
                  <div className="form-group my-2">
                    <h6>Transferee</h6>
                    <div className="form-group">
                      <label htmlFor="transferee_folio_no">Folio Number</label>
                      <Controller
                        data-testid="transferee_folio_no"
                        name="transferee_folio_no"
                        render={({ field }) => (
                          <Select
                            {...field}
                            isLoading={inactive_shareholders_data_loading}
                            options={folio_options}
                            ref={transferee_ref}
                            id="transferee_folio_no"
                            placeholder={
                              !selectedCompany
                                ? "Select Company First"
                                : "Select Folio Number"
                            }
                            styles={errors.transferee_folio_no && errorStyles}
                            isDisabled={!selectedCompany}
                          />
                        )}
                        control={control}
                      />
                      <small className="text-danger">
                        {errors.transferee_folio_no?.message}
                      </small>
                    </div>
                    <div className="form-group">
                      <div className="form-group">
                        <label htmlFor="transferor_name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="transferor_name"
                          placeholder="Enter Name"
                          value={
                            !inactive_shareholders_data_loading
                              ? inactive_shareholders_data.find(
                                  (holder) =>
                                    holder.folio_number ===
                                    watch("transferee_folio_no")?.value
                                )?.shareholder_name
                              : ""
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-lg-4 col-md-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Transaction</h5>
                </div>
                <div className="card-body">
                  {/* Shares */}
                  <div className="form-group my-2">
                    <label>No of Shares</label>
                    <Controller
                      name="quantity"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.quantity && "border-danger"
                          }`}
                          id="quantity"
                          allowNegative={false}
                          placeholder="Enter Shares"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.quantity?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    {parseInt(electronicShares) >= 0 && (
                      <div
                        className="alert alert-warning dark fade show"
                        target="Alert-8"
                        role="alert"
                      >
                        <b>{`Transferor has ${thousandSeperator(
                          electronicShares
                        )} shares`}</b>
                      </div>
                    )}
                  </div>

                  {/* Distinctive From */}
                  {/* <div className="form-group my-2">
                        <label htmlFor="price">Price</label>
                        <Controller
                          data-testid="price"
                          name="price"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${
                                errors.price && "border border-danger"
                              }`}
                              id="price"
                              allowNegative={false}
                              placeholder="Enter Quantity"
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.price?.message}
                        </small>
                      </div> */}
                  {/* Distinctive TO */}
                  {/* <div className="form-group my-2">
                        <label htmlFor="amount">Amount</label>
                        <Controller
                          data-testid="amount"
                          name="amount"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${
                                errors.amount && "border border-danger"
                              }`}
                              id="amount"
                              allowNegative={false}
                              placeholder="Enter Quantity"
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.amount?.message}
                        </small>
                      </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="row px-2 my-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
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
        </form>
      </div>
    </Fragment>
  );
};

export default ElectronicTransferOfShares;
