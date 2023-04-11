import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import Select from "react-select";
import SplitShareCertificateItem from "../SplitShareCertificateItem";
import { useSelector } from "react-redux";
import {
  folio_setter,
  company_setter,
  certificate_setter,
} from "../../../../store/services/dropdown.service";
import { getCertificateNo } from "../../../../store/services/company.service";
import { getvalidDateYMD } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import {
  addInvestorRequestSPL,
  addInvestorRequestTRS,
} from "../../../../store/services/investor.service";
import {
  getShareCertificatesByFolio,
  getShareCertificatesByNumber,
} from "../../../../store/services/shareCertificate.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import TransmissionOfSharesItem from "../transmissionOfSharesItem";
import TransferOfSharesItem from "../transferOfSharesItem";
import {
  addTransmissionOfSharesSchema,
  updateTransmissionOfSharesSchema,
} from "../../../../store/validations/transmissionOfShareValidation";
import { numberWithCommas } from "../../../../utilities/utilityFunctions";

const ViewTransmissionOfShares = ({ setInvestorRequestForm }) => {
  // States
  const dispatch = useDispatch();
  // const shareholders = useSelector((data) => data.Shareholders);
  const [shareholders, setShareholders] = useState([]);
  const companies_selector = useSelector((data) => data.Companies);
  // Session Storage
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  console.log("🚀ViewTransmissionOfShares", request)
  let input_certificates = [];
  if (request.input_certificates !== "") {
    input_certificates = JSON.parse(request.input_certificates);
  }

  // const input_certificates = JSON.parse(request.input_certificates);

  // Ref
  const requester_ref = useRef(null);
  const folio_number_ref = useRef(null);
  const certificate_ref = useRef(null);
  // Selector ENDS
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [df_snum, setDf_snum] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  const [certificates, setCertificates] = useState(input_certificates);
  const [startcalculation, setStartcalculation] = useState(false);
  const [totalSharesCount, setTotalSharesCount] = useState(request.quantity);
  const [certificate, setCertificate] = useState(null);
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
    // defaultValues: updateTransmissionOfSharesSchema(request).cast(),
    // resolver: yupResolver(updateTransmissionOfSharesSchema(request)),
  });
  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };
  useEffect(async () => {
    try {
      setCertificate_options(await certificate_setter());
    } catch (err) {
      !!err?.response?.data?.message
        ? toast.error(err?.response?.data?.message)
        : toast.error("Options Not Found");
    }
  }, []);
  useEffect(() => {
    const getAllShareCertificates = async () => {
      try {
        setCertificatesLoading(true);
        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("folio_no").value
        );
        if (response.status === 200) {
          setCertificates(response.data.data);
          setCertificatesLoading(true);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Certificates Not Found");
      }
    };
    if (!!watch("folio_no")?.value) {
      getAllShareCertificates();
    }
  }, [watch("folio_no")]);
  useEffect(() => {
    const getShareCertificate = async () => {
      try {
        const response = await getShareCertificatesByNumber(
          baseEmail,
          watch("certificate_no")?.value
        );
        if (response.status === 200) {
          setCertificate(response.data.data);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Certificate Not Found");
      }
    };
    if (!!watch("certificate_no")?.value) getShareCertificate();
  }, [watch("certificate_no")]);
  useEffect(() => {
    const getCompanyCertificateNo = async () => {
      try {
        const response = await getCertificateNo(
          baseEmail,
          watch("company_code")?.value
        );
        if (response.status === 200) {
          setDf_snum(response.data.data[0].shares_counter);
          setDistinctiveCounter(response.data.data[0].distinctive_no_counter);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Certificate No Not Found");
      }
    };
    if (!!watch("company_code")?.value) {
      const options = shareholders.shareholders_data && shareholders.shareholders_data
        .filter((data) => data.company_code === watch("company_code")?.value)
        .filter((item) => item.cdc_key === "NO")
        .map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.folio_number };
        });
      setFolio_options(options);
      getCompanyCertificateNo();
    }
  }, [watch("company_code")]);
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
  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addInvestorRequestTRS(
        email,
        "TRS",
        data.folio_no.value, // TO
        data.company_code.value,
        companies_selector.companies_data.find(
          (comp) => comp.code === data.company_code
        )?.symbol, // Symbol
        totalSharesCount.toString(), // Quantity
        "", // Amount Paid
        certificateObjects, // Input Certicates
        []
      );

      if (response.data.status === 200) {
        setLoading(false);
        dispatch({ type: WATCH_INVESTORS_REQUEST });
        dispatch({ type: WATCH_TRANSACTION_REQUEST });
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

  useEffect(async () => {
    try {
      const response = await getShareHoldersByCompany(baseEmail, request.company_code.value);
      if (response.status === 200) {
        setShareholders(response.data.data);
      } else {
        setShareholders([]);
      }
    } catch (error) {
      if (error.response !== undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }, [])

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
                      value="Transmission Of Shares"
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
                      className={`form-control ${errors.request_date && "border border-danger"
                        }`}
                      name="request_date"
                      id="request_date"
                      {...register("request_date")}
                      defaultValue={getvalidDateYMD(new Date())}
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
                      className={`form-control`}
                      value={request?.txn_execution_date}
                      readOnly
                    />
                  </div>
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
                          styles={errors.requester_folio && errorStyles}
                          ref={requester_ref}
                          placeholder={
                            !watch("company_code")?.value
                              ? "Select Company First"
                              : "Select Folio Number"
                          }
                          isDisabled={!watch("company_code")?.value}
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
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                          styles={errors.company_code && errorStyles}
                          isDisabled={true}
                          readOnly
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
                    <label htmlFor="folio_no">Folio Number </label>
                    <Controller
                      name="folio_no"
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="folio_no"
                          styles={errors.folio_no && errorStyles}
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                          ref={folio_number_ref}
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
                      {errors.folio_no?.message}
                    </small>
                  </div>
                  {/* Name */}
                  <div className="form-group my-2">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className={`form-control ${errors.name && "border border-danger"
                        }`}
                      name="name"
                      id="name"
                      {...register("name")}
                      readOnly
                      value={
                        shareholders.length !== 0
                          ? shareholders.find(
                            (holder) =>
                              holder.folio_number === watch("folio_no")?.value
                          )?.shareholder_name
                          : ""
                      }
                    />
                    <small className="text-danger">
                      {errors.name?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="remarks">Remarks (optional)</label>
                    <textarea
                      className={`form-control ${errors.remarks && "border border-danger"
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
                  <h5>Split Of Shares</h5>
                </div>
                <div className="card-body">
                  {/* Quantity */}
                  <div className="form-group my-2">
                    <label htmlFor="certificates">Certificates</label>
                    <Controller
                      name="certificates"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${errors.certificates && "border border-danger"
                            }`}
                          id="certificates"
                          allowNegative={false}
                          placeholder="Enter Certificates"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.quantity?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shares_count">Total Shares Count</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shares_count"
                      id="shares_count"
                      value={numberWithCommas(totalSharesCount)}
                      readOnly
                    />
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
                    <th className="text-nowrap text-right">No of Shares</th>
                    <th className="text-nowrap">Distinctive No. From</th>
                    <th className="text-nowrap">Distinctive To</th>
                    <th className="text-nowrap">Transfer To</th>
                  </tr>
                </thead>
                <tbody>
                  {JSON.parse(request.input_certificates).map(
                    (certificate, i) => {
                      return <tr>
                        <td className="text-nowrap">{certificate.certificate_no}</td>
                        <td className="text-nowrap text-right">{certificate.shares_count}</td>
                        <td className="text-nowrap">{JSON.parse(certificate.distinctive_no)[0].from}</td>
                        <td className="text-nowrap">{JSON.parse(certificate.distinctive_no)[0].to}</td>
                        <td className="text-nowrap">{certificate.folio_number}</td>
                      </tr>
                    })
                  }
                  {/* {!isNaN(parseInt(watch("certificates"))) &&
                    watch("certificates") <= 20 &&
                    [...Array(parseInt(watch("certificates")))].map(
                      (cert, index) => (
                        <TransmissionOfSharesItem
                          certificates={input_certificates}
                          folios={shareholders.shareholders_data && shareholders.shareholders_data.filter(
                            (hold) =>
                              hold.company_code === watch("company_code")?.value
                          )}
                          startCalculation={startCalculation}
                          calculated={true}
                          num={parseInt(watch("certificates")) + index}
                          df_count={input_certificates[index].shares_count}
                          df_cert={input_certificates[index].certificate_no}
                          df_folio={input_certificates[index].folio_number}
                        />
                      )
                    )} */}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default ViewTransmissionOfShares;
