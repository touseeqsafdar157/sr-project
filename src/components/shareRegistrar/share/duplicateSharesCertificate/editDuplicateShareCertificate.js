import React, { useState, useEffect, useRef, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import {
  folio_setter,
  company_setter,
  certificate_setter,
  symbol_setter,
} from "../../../../store/services/dropdown.service";
import { getCertificateNo } from "../../../../store/services/company.service";
import Breadcrumb from "../../../common/breadcrumb";
import { updateDuplicateCertificatesSchema } from "../../../../store/validations/duplicateCertificatesValidation";
import { getvalidDateYMD } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import TransferOfShares from "../transferOfShares/transferOfShares";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import TransferOfSharesItem from "../transferOfSharesItem";
import {
  addInvestorRequest,
  addInvestorRequestDUP,
  addInvestorRequestTOS,
  editInvestorRequestDUP,
} from "../../../../store/services/investor.service";
import { getCompanies } from "../../../../store/services/company.service";
import SplitShareCertificateItem from "../SplitShareCertificateItem";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";

const EditDuplicateShareCertificate = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  const input_certificates = JSON.parse(request.input_certificates);
  const output_certificates = JSON.parse(request.output_certificates);
  const dispatch = useDispatch();
  // Selector ENDS
  // States
  const [inputCertificateObjects, setInputCertificateObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outputCertificateObjects, setOutputCertificateObjects] = useState([]);
  const [df_snum, setDf_snum] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [startcalculation, setStartcalculation] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [companies, setCompanies] = useState([]);
  //Refs
  const requester_ref = useRef(null);
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
    defaultValues: updateDuplicateCertificatesSchema(request).cast(),
    resolver: yupResolver(updateDuplicateCertificatesSchema(request)),
  });
  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await getCompanies(baseEmail);
        setCompanies(response.data.data);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Companies Not Found");
      }
    };
    getAllCompanies();
  }, []);

  const startInputCalculation = (certificate) => {
    const newArray = inputCertificateObjects;
    newArray.push(certificate);
    setInputCertificateObjects(newArray);
  };
  const startOutputCalculation = (certificate) => {
    const newArray = outputCertificateObjects;
    newArray.push(certificate);
    setOutputCertificateObjects(newArray);
  };
  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await editInvestorRequestDUP(
        email,
        "DUP",
        data.requester_folio.value, // TO
        data.company_code.value,
        companies.find(
          (comp) => comp.code === data.company_code.value
        )?.symbol,
        "", // Amount Paid
        inputCertificateObjects, // Input Certicates
        outputCertificateObjects,
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
      setStartcalculation(false);
      setInputCertificateObjects([]);
      setOutputCertificateObjects([]);
      !!error?.response?.data?.message
        ? toast.error(`${error?.response?.data?.message}`)
        : toast.error("Request Not Submitted");
    }
  };
  // useEffect(() => {
  //   const getCompanyCertificateNo = async () => {
  //     try {
  //       const response = await getCertificateNo(
  //         baseEmail,
  //         watch("company_code")?.value
  //       );
  //       if (response.status === 200) {
  //         setDf_snum(response.data.data.shares_counter);
  //         setDistinctiveCounter(response.data.data.distinctive_no_counter);
  //       }
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : console.log("Certificate No Not Found");
  //     }
  //   };

  //   if (!!watch("company_code")?.value) {
  //     getCompanyCertificateNo();
  //   }
  // }, [watch("company_code")]);
  useEffect(() => {
    const getAllShareCertificates = async () => {
      try {
        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("requester_folio").value
        );
        if (response.status === 200) {
          setCertificates(response.data.data);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Certificates Not Found");
      }
    };
    if (!!watch("requester_folio")?.value) getAllShareCertificates();
  }, [watch("requester_folio")]);
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
                  {/* Request Type */}
                  <div className="form-group my-2">
                    <label>Request Type</label>
                    <input
                      className="form-control"
                      type="text"
                      name="request_type"
                      id="request_tyoe"
                      value="Duplicate Shares"
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
                  <h5>Company</h5>
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
                  {/* Folio Number */}
                  <div className="form-group my-2">
                    <label htmlFor="requester_folio">Requester Folio</label>
                    <Controller
                      name="requester_folio"
                      render={({ field }) => (
                        <Select
                          {...field}
                          ref={requester_ref}
                          id="requester_folio"
                          placeholder={
                            !watch("company_code")?.value
                              ? "Select Company First"
                              : "Select Folio Number"
                          }
                          styles={errors.requester_folio && errorStyles}
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.requester_folio?.message}
                    </small>
                  </div>
                  {/* Name */}
                  <div className="form-group my-2">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="form-control"
                      name="name"
                      id="name"
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
            <div className="col-sm-12 col-lg-4 col-md-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Duplicates</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="no_of_certificates">
                      No of Certificate
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
                          allowNegative={false}
                          placeholder="Enter Quantity"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_of_certificates?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    {df_snum !== "" && (
                      <div
                        className="alert alert-warning dark fade show"
                        target="Alert-8"
                        role="alert"
                      >
                        <b>{`The last alloted certificate no  was ${df_snum} with distinctive counter ${distinctiveCounter}`}</b>
                      </div>
                    )}
                  </div>
                  <div className="form-group my-2">
                    {!!watch("requester_folio")?.value && (
                      <div
                        className="alert alert-warning dark fade show"
                        target="Alert-8"
                        role="alert"
                      >
                        <b>{`This Shareholder has ${certificates.length} certificates`}</b>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row my-2">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>
                    <b>Input Certificate</b>
                  </h5>
                </div>
                <div className="card-body">
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
                                startCalculation={startInputCalculation}
                                calculated={startcalculation}
                                df_snum={
                                  input_certificates[index].certificate_no
                                }
                                num={
                                  parseInt(watch("no_of_certificates")) + index
                                }
                                distinctive_no={
                                  input_certificates[index].distinctive_no
                                }
                                df_noOfShares={
                                  input_certificates[index].shares_count
                                }
                              />
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row my-2">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>
                    <b>Output Certificate</b>
                  </h5>
                </div>
                <div className="card-body">
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
                                startCalculation={startOutputCalculation}
                                calculated={startcalculation}
                                num={
                                  parseInt(watch("no_of_certificates")) + index
                                }
                                distinctive_no={
                                  input_certificates[index].distinctive_no
                                }
                                df_noOfShares={
                                  input_certificates[index].shares_count
                                }
                              />
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row px-2 my-2">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => setStartcalculation(true)}
              disabled={loading}
              style={
                !loading ? { cursor: "pointer" } : { cursor: "not-allowed" }
              }
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

export default EditDuplicateShareCertificate;
