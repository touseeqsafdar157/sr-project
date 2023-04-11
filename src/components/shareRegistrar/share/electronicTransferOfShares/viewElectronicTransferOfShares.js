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
import { useSelector } from "react-redux";
import Breadcrumb from "../../../common/breadcrumb";
import { addSplitShareSchema } from "../../../../store/validations/splitShareValidation";
import { getvalidDateYMD } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import { updateTransferOfShareSchema } from "../../../../store/validations/transferOfSharesValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import { addInvestorRequest } from "../../../../store/services/investor.service";
import { getCompanies } from "../../../../store/services/company.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";
import { updateElectronicTransferOfShareSchema } from "store/validations/electronicTransferOfSharesValidation";

const ViewElectronicTransferOfShares = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  // Selector STARTS
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  const view_certificates = JSON.parse(request.input_certificates);
  // const { inactive_shareholders_data, shareholders_dropdown } = useSelector(
  //   (data) => data.Shareholders
  // );
  const [shareholders, setShareholders] = useState([]);
  // Selector ENDS
  // STATES
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
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
    defaultValues: updateElectronicTransferOfShareSchema(request).cast(),
    resolver: yupResolver(updateElectronicTransferOfShareSchema(request)),
  });

  const handleAddInvestorRequest = async (data) => {
  };

  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedInvestorRequest", {});
    };
  }, []);

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
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
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
                              ? shareholders.find((holder) => {
                                  return (
                                    holder.folio_number ===
                                    watch("transferor_folio_no")?.value
                                  );
                                })?.shareholder_name
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
                    <label htmlFor="no_of_shares">No of shares</label>
                    <NumberFormat
                      className={`form-control text-right`}
                      id="no_of_shares"
                      value={request.quantity}
                      decimalScale={2}
                      thousandSeparator={true}
                      placeholder="Enter Number"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default ViewElectronicTransferOfShares;
