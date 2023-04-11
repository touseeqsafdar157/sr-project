import React, { useState, useEffect, Fragment, useRef } from "react";
import DistinctiveCounterItem from "../../share-certificate/distinctiveCounterItem";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import {
  folio_setter,
  company_setter,
  certificate_setter,
  symbol_setter,
} from "../../../../store/services/dropdown.service";
import Breadcrumb from "../../../common/breadcrumb";
import {
  addConsolidateSharesSchema,
  updateConsolidateSharesSchema,
} from "../../../../store/validations/consolidateSharesValidation";
import { getvalidDateYMD } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import TransferOfShares from "../transferOfShares/transferOfShares";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import TransferOfSharesItem from "../transferOfSharesItem";
import {
  addInvestorRequest,
  addInvestorRequestTOS,
} from "../../../../store/services/investor.service";
import { getCertificateNo } from "../../../../store/services/company.service";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";

const ViewConsolidateShares = () => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  const input_certificates = JSON.parse(request.input_certificates);
  const [output_certificates] = JSON.parse(request.output_certificates);
  const [certificateObjects, setCertificateObjects] = useState([]);
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
    defaultValues: updateConsolidateSharesSchema(request).cast(),
    resolver: yupResolver(updateConsolidateSharesSchema(request)),
  });
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
                      value="Consolidate Shares"
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
                    <label htmlFor="folio_number">Folio Number </label>
                    <Controller
                      name="folio_number"
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="folio_number"
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                          styles={errors.folio_number && errorStyles}
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
                      {errors.folio_number?.message}
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
            <div className="col-md-4 col-sm-12 col-lg-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Company</h5>
                </div>
                <div className="card-body">
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
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-lg-4 col-md-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Consolidate Shares</h5>
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
                    <label htmlFor="shares">No of Collective Shares</label>
                    <NumberFormat
                      className="form-control"
                      id="shares"
                      decimalScale={2}
                      placeholder="Enter Number"
                      value={output_certificates?.shares_count || ""}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="new_certificate_no">
                      New Certificate No
                    </label>
                    <Controller
                      name="new_certificate_no"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.new_certificate_no && "border border-danger"
                          }`}
                          id="new_certificate_no"
                          allowNegative={false}
                          placeholder="Enter Quantity"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.new_certificate_no?.message}
                    </small>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-12">
                      <label htmlFor="distinctive_to">Distinctive From</label>
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-12">
                      <label htmlFor="distinctive_to">Distinctive To</label>
                    </div>
                  </div>
                  {request.txn_generated === "true" &&
                    output_certificates.distinctive_no.map((item) => (
                      <DistinctiveCounterItem
                        calculatedCounter={() => {}}
                        from={item.from}
                        to={item.to}
                        calculated={true}
                      />
                    ))}
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
                          df_snum={input_certificates[index].certificate_no}
                          distinctive_no={
                            JSON.parse(input_certificates[index].distinctive_no)
                          }
                          df_noOfShares={input_certificates[index].shares_count}
                        />
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default ViewConsolidateShares;
