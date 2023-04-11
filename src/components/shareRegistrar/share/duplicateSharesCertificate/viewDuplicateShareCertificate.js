import React, { useState, useEffect, useRef, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { useSelector } from "react-redux";
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
} from "../../../../store/services/investor.service";
import SplitShareCertificateItem from "../SplitShareCertificateItem";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";

const ViewDuplicateShareCertificate = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  const input_certificates = JSON.parse(request.input_certificates);
  const output_certificates = JSON.parse(request.output_certificates);

  const [shareholders, setShareholders] = useState([]);

  // Selector ENDS
  // States
  const [inputCertificateObjects, setInputCertificateObjects] = useState([]);
  const [outputCertificateObjects, setOutputCertificateObjects] = useState([]);
  const [startcalculation, setStartcalculation] = useState(false);
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
  };

  useEffect(async()=>{
    try {
      const response = await getShareHoldersByCompany(baseEmail, request.company_code.value);
      if (response.status === 200){
        setShareholders(response.data.data);
      }else{
        setShareholders([]);
      }
    } catch (error) {
        if(error.response!==undefined){
          toast.error(error.response.data.message);
        }else{
          toast.error(error.message);
        }
    }
  },[])

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
                      value={request.status || request.processing_status}
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
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
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
                      value={
                        shareholders.length !== 0
                              ? shareholders.find(
                                  (holder) =>
                                    holder.folio_number ===
                                    watch("requester_folio")?.value
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
                                startCalculation={startOutputCalculation}
                                calculated={true}
                                num={
                                  parseInt(watch("no_of_certificates")) + index
                                }
                                df_snum={
                                  input_certificates[index].certificate_no
                                }
                                distinctive_no={
                                  JSON.parse(input_certificates[index].distinctive_no)
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

          {request.txn_generated === "true" && (
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
                            <th className="text-nowrap text-right">No of Shares</th>
                            <th className="text-nowrap">
                              Distinctive No. From
                            </th>
                            <th className="text-nowrap">Distinctive To</th>
                          </tr>
                        </thead>

                        <tbody>
                          {!isNaN(parseInt(watch("no_of_certificates"))) &&
                            [
                              ...Array(parseInt(watch("no_of_certificates"))),
                            ].map((cert, index) => (
                              <ViewSplitShareCertificateItem
                                startCalculation={startOutputCalculation}
                                calculated={startcalculation}
                                num={
                                  parseInt(watch("no_of_certificates")) + index
                                }
                                df_snum={
                                  output_certificates[index].certificate_no
                                }
                                distinctive_no={
                                   JSON.parse(output_certificates[index].distinctive_no)
                                }
                                df_noOfShares={
                                  output_certificates[index].shares_count
                                }
                              />
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </Fragment>
  );
};

export default ViewDuplicateShareCertificate;
