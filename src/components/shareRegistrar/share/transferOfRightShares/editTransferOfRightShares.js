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
import { getvalidDateYMD } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import { addTransferOfShareSchema } from "../../../../store/validations/transferOfSharesValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import { getCertificateNo } from "../../../../store/services/company.service";
import {
  addInvestorRequest,
  addInvestorRequestTOR,
  editInvestorRequestTOR,
} from "../../../../store/services/investor.service";
import { getCompanies } from "../../../../store/services/company.service";
import { getShareholders } from "../../../../store/services/shareholder.service";
import {
  getShareHolderByFolioNo,
  getShareHoldersByCompany,
} from "../../../../store/services/shareholder.service";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import { updateTransferOfRightShareSchema } from "../../../../store/validations/transferOfRightSharesValidation";

const EditTransferOfRightShares = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const dispatch = useDispatch();
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  //Refs
  const transferor_ref = useRef(null);
  const transferee_ref = useRef(null);
  // States
  const [loading, setLoading] = useState(false);
  const [folio_options, setFolio_options] = useState([]);
  const [shareHoldings, setShareHoldings] = useState([]);
  const [company_options, setCompany_options] = useState([]);
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [shareholder, setShareholder] = useState(null);
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [companies_selector, setCompanies_selctor] = useState([]);
  const [shareholders, setShareholders] = useState([]);
  // Validation Declarations
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    watch,
  } = useForm({
    defaultValues: updateTransferOfRightShareSchema(request).cast(),
    resolver: yupResolver(updateTransferOfRightShareSchema(request)),
  });
  useEffect(() => {
    const getAllCompanies = async () => {
      try{
      const response = await getCompanies(baseEmail)
      if (response.status===200) {
            const parents = response.data.data
          setCompanies_selctor(parents)
      } }catch(error) {
      }
      };
        const getAllShareHolders = async () => {
          try{
          const response = await getShareholders(baseEmail)
          if (response.status===200) {
                const parents = response.data.data
                setShareholders(parents)
          } }catch(error) {
          }
          };
          getAllShareHolders();
      getAllCompanies();

  }, [])
  useEffect(() => {
    const getShareholder = async () => {
      try {
        const response = await getShareHolderByFolioNo(
          baseEmail,
          watch("transferor_folio_no").value
        );
        if (response.status === 200) {
          setShareholder(response.data.data);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Shareholder Not Found");
      }
    };

    if (!!watch("transferor_folio_no")?.value) {
      getShareholder();
    }
  }, [watch("transferor_folio_no")]);
  useEffect(() => {
    const getSharesCount = () => {
      setTotalSharesCount(
        certificateObjects
          .map((obj) => parseInt(obj.shares_count.replace(/,/g, "")) || 0)
          .reduce((prev, curr) => prev + curr, 0)
      );
    };
    if (startcalculation) getSharesCount();
  }, [startcalculation]);

  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };

  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await editInvestorRequestTOR(
        email,
        "TOR", //   Type of Request
        data.transferor_folio_no.value, // FROM
        data.company_code.value,
        companies_selector.find(
          (comp) => comp.code === data.company_code.value
        )?.symbol, //    Symbol
        data.transferee_folio_no.value, // TO
        data.quantity,
        data.remarks,
        request.request_id
      );

      if (response.data.status === 200) {
        setLoading(false);
        setInvestorRequestForm(false);
        toast.success(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      dispatch({ type: WATCH_INVESTORS_REQUEST });
      dispatch({ type: WATCH_TRANSACTION_REQUEST });
      setStartcalculation(false);
      setCertificateObjects([]);
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
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="company_code"
                          placeholder="Select Company"
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                          styles={errors.company_code && errorStyles}
                          isDisabled={true}
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
                      value="Transfer Of Right Shares"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Processing Status</label>
                    <input
                      className="form-control"
                      type="text"
                      name="request_type"
                      id="request_tyoe"
                      value={request.status}
                      readOnly
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
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.request_date?.message}
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
                      readOnly
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
                    <h6>Transferor</h6>
                    <div className="form-group">
                      <label htmlFor="transferor_folio_no">Folio Number</label>
                      <Controller
                        name="transferor_folio_no"
                        render={({ field }) => (
                          <Select
                            {...field}
                            ref={transferor_ref}
                            id="transferor_folio_no"
                            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                            styles={errors.transferor_folio_no && errorStyles}
                            placeholder={
                              !watch("company_code")?.value
                                ? "Select Company First"
                                : "Select Folio Number"
                            }
                            isDisabled={true}
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
                            shareholders.length !== 0
                              ? shareholders.find(
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
                        name="transferee_folio_no"
                        render={({ field }) => (
                          <Select
                            {...field}
                            ref={transferee_ref}
                            id="transferee_folio_no"
                            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                            placeholder={
                              !watch("company_code")?.value
                                ? "Select Company First"
                                : "Select Folio Number"
                            }
                            styles={errors.transferee_folio_no && errorStyles}
                            isDisabled={true}
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
                            shareholders.length !== 0
                              ? shareholders.find(
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
                  <div className="form-group my-2">
                    <label htmlFor="quantity">Quantity</label>
                    <Controller
                      name="quantity"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.quantity && "border border-danger"
                          }`}
                          id="quantity"
                          allowNegative={false}
                          placeholder="Quantity"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.quantity?.message}
                    </small>
                  </div>
                  {/* Avilable Shares */}
                  <div className="form-group my-2">
                    <label htmlFor="no_of_shares">Available Right Shares</label>
                    <NumberFormat
                      className={`form-control`}
                      id="no_of_shares"
                      value={shareholder?.right_shares}
                      decimalScale={2}
                      placeholder="Enter Number"
                      readOnly
                    />
                  </div>

                  {/* Distinctive From */}
                  {/* <div className="form-group my-2">
                        <label htmlFor="price">Price</label>
                        <Controller
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

          {/* <div className="row my-2">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-nowrap">Certificate No.</th>
                    <th className="text-nowrap">No of Shares</th>
                    <th className="text-nowrap">Distinctive No. From</th>
                    <th className="text-nowrap">Distinctive To</th>
                  </tr>
                </thead>

                <tbody>
                  {!isNaN(parseInt(watch("no_of_certificates"))) &&
                    [...Array(parseInt(watch("no_of_certificates")))].map(
                      (cert, index) => (
                        <TransferOfSharesItem
                          certificates={certificates}
                          startCalculation={startCalculation}
                          calculated={startcalculation}
                          num={parseInt(watch("no_of_certificates")) + index}
                        />
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div> */}
          <div className="row px-2 my-2">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => setStartcalculation(true)}
              // disabled={loading}
              // style={!loading ? { cursor: "pointer" } : { cursor: "not-allowed" }}
            >
              {loading ? (
                <>
                  <span className="fa fa-spinner fa-spin"></span>
                  <span>{"Loading..."}</span>
                </>
              ) : (
                <span>{"Generate Transaction"}</span>
              )}
            </button>
            {/* <button
              type="button"
              className="btn btn-success mx-2"
              onClick={(e) => setStartcalculation(true)}
            >
              Calculate
            </button> */}
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default EditTransferOfRightShares;
