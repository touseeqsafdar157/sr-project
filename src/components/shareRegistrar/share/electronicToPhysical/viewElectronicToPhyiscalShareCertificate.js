import React, { useState, useEffect, useRef, Fragment } from "react";
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
} from "../../../../store/services/investor.service";
import {
  getCompanies,
  getCertificateNo,
} from "../../../../store/services/company.service";
import {
  getShareHoldersByCompany,
  getShareHoldersByShareholderID,
} from "../../../../store/services/shareholder.service";
import { addPhysicalToElectronicSchema } from "../../../../store/validations/physicalToElectronicValidation";
import { updateElectronicToPhysicalValidation } from "../../../../store/validations/electronicToPhysicalValidation";
import SplitShareCertificateItem from "../SplitShareCertificateItem";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";

const ViewElectronicToPhysical = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = IsJsonString(
    sessionStorage.getItem("selectedInvestorRequest")
  )
    ? JSON.parse(sessionStorage.getItem("selectedInvestorRequest"))
    : "";
  const output_certificates =
    IsJsonString(request.output_certificates) &&
    JSON.parse(request.output_certificates);
  const input_certificates =
    IsJsonString(request.input_certificates) &&
    JSON.parse(request.input_certificates);
  // useEffect(() => {
  //   console.log("INPUT", input_certificates);
  //   console.log("OUTPUT", output_certificates);
  // }, [input_certificates, output_certificates]);
  // States
  const [certificateObjects, setCertificateObjects] = useState([]);
  // Refs
  const requester_ref = useRef(null);
  const to_folio_ref = useRef(null);
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

  // useEffect(() => {
  //   console.log(JSON.parse(input_certificates.distinctive_no));
  //   console.log(JSON.parse(output_certificates.distinctive_no));
  // }, [input_certificates, output_certificates]);

  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };

  const handleAddInvestorRequest = async (data) => {
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
                    <label>Transfer No</label>
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
                          placeholder="Enter Number"
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
                      {...register("request_date")}
                      readOnly
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
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
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
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
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
                          className={`form-control text-right ${
                            errors.no_of_shares && "border border-danger"
                          }`}
                          id="no_of_shares"
                          allowNegative={false}
                          thousandSeparator={true}
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
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.reference?.message}
                    </small>
                  </div>
                  {/* <div className="form-group my-2">
                    <label htmlFor="cdc_certificates">
                      Select Distincive CDC Folio
                    </label>
                    <Controller
                      name="cdc_certificates"
                      render={({ field }) => (
                        <Select
                          {...field}
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
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.cdc_certificates?.message}
                    </small>
                  </div> */}
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
                  {input_certificates.map((cert, index) => (
                    <ViewSplitShareCertificateItem
                      startCalculation={startCalculation}
                      calculated={true}
                      num={parseInt(watch("no_of_certificates")) + index}
                      df_snum={cert.certificate_no}
                      distinctive_no={
                        IsJsonString(cert)
                          ? JSON.parse(cert.distinctive_no)
                          : cert.distinctive_no
                      }
                      df_noOfShares={cert.shares_count}
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
                  {output_certificates.map((cert, index) => (
                    <ViewSplitShareCertificateItem
                      startCalculation={startCalculation}
                      calculated={true}
                      num={parseInt(watch("no_of_certificates")) + index}
                      df_snum={output_certificates[index].certificate_no}
                      distinctive_no={output_certificates[index].distinctive_no}
                      df_noOfShares={output_certificates[index].shares_count}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default ViewElectronicToPhysical;
