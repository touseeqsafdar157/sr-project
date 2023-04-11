import React, { useState, useEffect, useRef, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  folio_setter,
  company_setter,
  certificate_setter,
} from "../../../../store/services/dropdown.service";
import Breadcrumb from "../../../common/breadcrumb";
import { addSplitShareSchema } from "../../../../store/validations/splitShareValidation";
import {
  getvalidDateYMD,
  IsJsonString,
} from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import { addTransferOfShareSchema } from "../../../../store/validations/transferOfSharesValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import {
  addInvestorRequest,
  addInvestorRequestCEL,
  addInvestorRequestCPH,
  addInvestorRequestSPL,
  editInvestorRequestCPH,
} from "../../../../store/services/investor.service";
import {
  getCompanies,
  getCertificateNo,
} from "../../../../store/services/company.service";
import {
  getShareHoldersByCompany,
  getShareHoldersByShareholderID,
} from "../../../../store/services/shareholder.service";
import {
  getShareCertificates
} from "../../../../store/services/shareCertificate.service";
import { addPhysicalToElectronicSchema } from "../../../../store/validations/physicalToElectronicValidation";
import { updateElectronicToPhysicalValidation } from "../../../../store/validations/electronicToPhysicalValidation";
import SplitShareCertificateItem from "../SplitShareCertificateItem";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";

const EditElectronicToPhysical = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  // States
  const [shareHoldings, setShareHoldings] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  const [distinctiveCountercdc, setDistinctiveCountercdc] = useState([]);
  const [cdc_certificates, setCdc_certificates] = useState([]);
  const [output_certificates, setOutput_certificates] = useState([]);
  const [input_certificates, setInput_certificates] = useState([]);
  const [startcalculation, setStartcalculation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [df_snum, setDf_snum] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [share_certificates, setShare_certificates] = useState([]);
  // Refs
  const requester_ref = useRef(null);
  const to_folio_ref = useRef(null);
  // handle dsitinctive counters
  const handleDistinctiveCounters = (array) => {
    const certificates_distinctive_array = [];
    const from_array = [];
    const to_array = [];
    array.forEach((item) => {
      const distinctive_no = share_certificates.find(
        (cert) => cert.certificate_no === item.value
      );
      certificates_distinctive_array.push(distinctive_no);
    });
    setDistinctiveCountercdc([...certificates_distinctive_array]);
  };
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
    defaultValues: updateElectronicToPhysicalValidation(request).cast(),
    resolver: yupResolver(updateElectronicToPhysicalValidation(request)),
  });

  const startInputCalculation = (certificate) => {
    const newArray = input_certificates;
    newArray.push(certificate);
    setInput_certificates(newArray);
  };

  const startOutputCalculation = (certificate) => {
    const newArray = output_certificates;
    newArray.push(certificate);
    setOutput_certificates(newArray);
  };
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
    const getCDCcertificates = async () => {
      const cdc_certs = share_certificates
        .filter(
          (cert) => cert.allotted_to === `${watch("company_code")?.value}-0`
        )
        .filter(
          (cert) =>
            IsJsonString(cert.distinctive_no) &&
            JSON.parse(cert.distinctive_no).length === 1
        )
        .map((cert) => ({
          label: cert.certificate_no,
          value: cert.certificate_no,
        }));

      setCdc_certificates(cdc_certs);
    };
    const getShareHolders = async () => {
      try {
        const response = await getShareHoldersByCompany(
          baseEmail,
          watch("company_code")?.value
        );
        if (response.status === 200) {
          setShareHoldings(response.data.data);
          let options = response.data.data
            .filter((h) => h.cdc_key === "YES")
            .map((item) => {
              let label = `${item.folio_number} (${item.shareholder_name}) `;
              return { label: label, value: item.folio_number };
            });
          setFolio_options(options);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Folios Not Found");
      }
    };

    if (!!watch("company_code")?.value) {
      getShareHolders();
      getCompanyCertificateNo();
      getCDCcertificates();
      getCompanyCertificateNo();
    }
  }, [watch("company_code")]);
  useEffect(() => {
    const getAllShareCertificates = async () => {
      try {
        const response = await getShareCertificates(baseEmail);
        setShare_certificates(response.data.data);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Companies Not Found");
      }
    };
    getAllShareCertificates();
  }, []);
  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await editInvestorRequestCPH(
        email,
        "CPH", //   Type of Request
        data.requester_folio.value,
        data.to_folio.value,
        data.company_code.value,
        "", //    Symbol
        data.no_of_shares,
        input_certificates, //INPUT CERTIFICATES
        output_certificates,
        data.remarks,
        data.reference,
        data.transfer_no,
        request.request_id,
        input_certificates.length.toString()
      );

      if (response.data.status === 200) {
        setLoading(false);
        setInvestorRequestForm(false);
        toast.success(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      setStartcalculation(false);
      setInput_certificates([]);
      setOutput_certificates([]);
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
            <div className="col-sm-12 col-md-6">
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
                      value="Electronic To Physical"
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
                      {...register("request_date")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.request_date?.message}
                    </small>
                  </div>

                  {/* Requester Folio */}
                  <div className="form-group my-2">
                    <label htmlFor="requester_folio">Requester Folio</label>
                    <Controller
                      name="requester_folio"
                      render={({ field }) => (
                        <Select
                          {...field}
                          ref={requester_ref}
                          id="requester_folio"
                          styles={errors.requester_folio && errorStyles}
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
                      {errors.requester_folio?.message}
                    </small>
                  </div>
                  {/* To Folio */}
                  <div className="form-group my-2">
                    <label htmlFor="to_folio">To Folio</label>
                    <Controller
                      name="to_folio"
                      render={({ field }) => (
                        <Select
                          {...field}
                          ref={to_folio_ref}
                          id="to_folio"
                          styles={errors.to_folio && errorStyles}
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
                      {errors.to_folio?.message}
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
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Transaction</h5>
                </div>
                <div className="card-body">
                  {/* Shares */}
                  <div className="form-group my-2">
                    <label htmlFor="no_of_shares">
                      No of Electronic Shares
                    </label>
                    <Controller
                      name="no_of_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_of_shares && "border border-danger"
                          }`}
                          id="no_of_shares"
                          allowNegative={false}
                          placeholder="Enter Quantity"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_of_shares?.message}
                    </small>
                  </div>
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
                    <label>Reference No</label>
                    <Controller
                      name="reference"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.reference && "border-danger"
                          }`}
                          id="reference"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.reference?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Transfer No</label>
                    <Controller
                      name="transfer"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.transfer && "border-danger"
                          }`}
                          id="transfer"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.transfer?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="cdc_certificates">
                      Select Distincive CDC Folio
                    </label>
                    <Controller
                      name="cdc_certificates"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={cdc_certificates.length === 0}
                          options={cdc_certificates}
                          id="cdc_certificates"
                          styles={errors.cdc_certificates && errorStyles}
                          placeholder={
                            !watch("company_code")?.value
                              ? "Select Company First"
                              : "Select Certificate "
                          }
                          isMulti
                          isClearable
                          isDisabled={!watch("company_code")?.value}
                          onChange={(selected) => {
                            setDistinctiveCountercdc([]);
                            setTimeout(() => {
                              !!selected
                                ? handleDistinctiveCounters(selected)
                                : handleDistinctiveCounters([]);
                            }, 20);
                          }}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.cdc_certificates?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    {df_snum !== "" && (
                      <div
                        className="alert alert-warning dark fade show"
                        target="Alert-8"
                        role="alert"
                      >
                        <b>{`The last alloted certificate no  was ${df_snum}`}</b>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <h4>CDC Certificates</h4>
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
                  {!isNaN(distinctiveCountercdc.length) &&
                    distinctiveCountercdc.length <= 20 &&
                    distinctiveCountercdc.map((cert, index) => (
                      <SplitShareCertificateItem
                        startCalculation={startInputCalculation}
                        calculated={startcalculation}
                        num={parseInt(watch("no_of_certificates")) + index}
                        df_from={
                          IsJsonString(cert.distinctive_no) &&
                          JSON.parse(cert.distinctive_no)[0].from
                        }
                        df_to={
                          IsJsonString(cert.distinctive_no) &&
                          JSON.parse(cert.distinctive_no)[0].to
                        }
                        df_noOfShares={cert.shares_count}
                        df_snum={cert.certificate_no.split("-")[1]}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <h4>Output Certificates</h4>
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
                        <SplitShareCertificateItem
                          startCalculation={startOutputCalculation}
                          calculated={startcalculation}
                          num={parseInt(watch("no_of_certificates")) + index}
                        />
                      )
                    )}
                </tbody>
              </table>
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

export default EditElectronicToPhysical;
