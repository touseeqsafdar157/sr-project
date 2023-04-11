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
import { updateTransferOfShareSchema } from "../../../../store/validations/transferOfSharesValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import {
  addInvestorRequest,
  editInvestorRequestTOS,
} from "../../../../store/services/investor.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";
import { getCompanies } from "../../../../store/services/company.service";
import { getShareholders } from "store/services/shareholder.service";

const EditElectronicTransferOfShares = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  const view_certificates = JSON.parse(request.input_certificates);
  // STATES
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [newcertificates, setNewcertificates] = useState(view_certificates);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companies_selector, setCompanies_selector] = useState([]);
  const [shareholders, setAllShareholders] = useState([]);
  //Refs
  const transferor_ref = useRef(null);
  const transferee_ref = useRef(null);
  // States
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
    defaultValues: updateTransferOfShareSchema(request).cast(),
    resolver: yupResolver(updateTransferOfShareSchema(request)),
  });
  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await getCompanies(baseEmail);
        setCompanies_selector(response.data.data);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Companies Not Found");
      }
    };
    const getAllShareHolders = async () => {  
      try{
      const response = await getShareholders(baseEmail)
      if (response.status===200) {
            const parents = response.data.data
            setAllShareholders(parents)
      } }catch(error) {
      }
      };
    getAllCompanies();
    getAllShareHolders();
  }, []);

  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await editInvestorRequestTOS(
        email,
        "TOS", //   Type of Request
        data.transferor_folio_no.value, // FROM
        data.company_code.value,
        companies_selector.companies_data.find(
          (comp) => comp.code === data.company_code.value
        )?.symbol, //    Symbol
        data.transferee_folio_no.value, // TO
        totalSharesCount.toString(),
        data.request_date,
        certificateObjects,
        data.remarks,
        data.transfer_no,
        request.request_id
      );

      if (response.data.status === 200) {
        setLoading(false);
        setInvestorRequestForm(false);
        toast.success(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      setStartcalculation(false);
      setCertificateObjects([]);
      !!error?.response?.data?.message
        ? toast.error(`${error?.response?.data?.message}`)
        : toast.error("Request Not Submitted");
    }
  };
  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };

  useEffect(() => {
    const getAllShareCertificates = async () => {
      try {
        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("transferor_folio_no").value
        );
        if (response.status === 200) {
          setCertificates(
            response.data.data.filter((item) => item?.td_verified === "true")
          );
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Certificates Not Found");
      }
    };

    if (!!watch("transferor_folio_no")?.value) {
      getAllShareCertificates();
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
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedInvestorRequest", {});
    };
  }, []);
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
                          isDisabled={true}
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
                      value="Transfer Of Shares"
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
                  <div className="form-group my-2">
                    <label>Transfer Number</label>
                    <Controller
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
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.transfer_no?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Request ID</label>
                    <input
                      className="form-control"
                      type="text"
                      name="request_type"
                      id="request_tyoe"
                      value={request.request_id}
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
                      readOnly
                      {...register("request_date")}
                    />
                    <small className="text-danger">
                      {errors.request_date?.message}
                    </small>
                  </div>
                  {/* Execution Date */}
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
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.execution_date?.message}
                    </small>
                  </div>
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
                            shareholders.shareholders_data.length !== 0
                              ? shareholders.shareholders_data.find(
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
                            shareholders.shareholders_data.length !== 0
                              ? shareholders.shareholders_data.find(
                                  (holder) =>
                                    holder.folio_number ===
                                    watch("transferee_folio_no")?.value
                                )?.shareholder_name
                              : ""
                          }
                          readOnly
                        />
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
                    <label htmlFor="no_of_certificates">
                      No Of Certificates
                    </label>
                    <Controller
                      name="no_of_certificates"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_of_certificates && "border border-danger"
                          }`}
                          id="no_of_certificates"
                          readOnly
                          allowNegative={false}
                          placeholder={`${
                            certificates.length > 0
                              ? "Enter Quantity"
                              : "Transferor has no certificates"
                          }`}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_of_certificates?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="no_of_shares">No of shares</label>
                    <NumberFormat
                      className={`form-control`}
                      id="no_of_shares"
                      value={request.quantity}
                      decimalScale={2}
                      placeholder="Enter Number"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    {!!watch("transferor_folio_no")?.value && (
                      <div
                        className="alert alert-warning dark fade show"
                        target="Alert-8"
                        role="alert"
                      >
                        <b>{`Transferor has ${certificates.length} certiifcates`}</b>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row my-2">
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
                        <ViewSplitShareCertificateItem
                          startCalculation={startCalculation}
                          calculated={true}
                          num={parseInt(watch("no_of_certificates")) + index}
                          df_snum={view_certificates[index].certificate_no}
                          distinctive_no={
                            view_certificates[index].distinctive_no
                          }
                          df_noOfShares={view_certificates[index].shares_count}
                        />
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => setStartcalculation(true)}
            disabled={loading}
            style={!loading ? { cursor: "pointer" } : { cursor: "not-allowed" }}
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
        </form>
      </div>
    </Fragment>
  );
};

export default EditElectronicTransferOfShares;
