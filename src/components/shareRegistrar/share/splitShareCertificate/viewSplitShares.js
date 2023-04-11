import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import SplitShareCertificateItem from "../SplitShareCertificateItem";
import { useSelector } from "react-redux";
import {
  folio_setter,
  company_setter,
  certificate_setter,
} from "../../../../store/services/dropdown.service";
import { getCertificateNo } from "../../../../store/services/company.service";
import Breadcrumb from "../../../common/breadcrumb";
import {
  addSplitShareSchema,
  updateSplitShareSchema,
} from "../../../../store/validations/splitShareValidation";
import { getvalidDateYMD } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import { addInvestorRequestSPL } from "../../../../store/services/investor.service";
import {
  getShareCertificatesByFolio,
  getShareCertificatesByNumber,
} from "../../../../store/services/shareCertificate.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";
import DistinctiveCounterItem from "../../share-certificate/distinctiveCounterItem";
import { getShareholders } from "store/services/shareholder.service"

const ViewSplitShares = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  const [input_certificates] = JSON.parse(request.input_certificates);
  const view_certificates = JSON.parse(request.output_certificates);
  // States
  // const { inactive_shareholders_data } = useSelector(
  //   (data) => data.Shareholders
  // );
  const [inactive_shareholders_data, setInactive_shareholders_data ] = useState([]);
  const getShareHolders = async() =>{
    try{
      const response = await getShareholders(baseEmail);
      if (response.status===200) {
        const parents = response.data.data
        setInactive_shareholders_data(parents)
       }
  
     }catch(error){
  
     }
  }
  useEffect(()=>{
    getShareHolders();
  },[])
  const companies_selector = useSelector((data) => data.Companies);
  // Ref
  const requester_ref = useRef(null);
  const folio_number_ref = useRef(null);
  const certificate_ref = useRef(null);
  // Selector ENDS
  const [loading, setLoading] = useState(false);
  const [df_snum, setDf_snum] = useState("");
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [startcalculation, setStartcalculation] = useState(false);
  // Validation Declarations
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
    defaultValues: updateSplitShareSchema(request).cast(),
    resolver: yupResolver(updateSplitShareSchema(request)),
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
                  <h5>Company</h5>
                </div>
                <div className="card-body">
                  {/* Company */}
                  <div className="form-group my-2">
                    <label htmlFor="company_code">Company</label>
                    <input
                      type="text"
                      className={`form-control `}
                      name="company_code"
                      id="company_code"
                      {...register("company_code")}
                      value={
                        watch("company_code")?.label
                      }
                      readOnly
                    />
                  </div>
                  {/* Folio Number */}
                  <div className="form-group my-2">
                    <label htmlFor="folio_number">Folio Number</label>
                    <input
                      type="text"
                      className={`form-control `}
                      name="folio_no"
                      id="folio_no"
                      {...register("folio_number")}
                      value={
                        watch("folio_no")?.label
                      }
                      readOnly
                    />
                  </div>
                 
                  {/* Name */}
                  <div className="form-group my-2">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className={`form-control ${
                        errors.name && "border border-danger"
                      }`}
                      name="name"
                      id="name"
                      {...register("name")}
                      value={
                        inactive_shareholders_data.length !== 0
                          ? inactive_shareholders_data.find(
                              (holder) =>
                                holder.folio_number === watch("folio_no")?.value
                            )?.shareholder_name
                          : ""
                      }
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.name?.message}
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
                      value="Split of Shares"
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
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.execution_date?.message}
                    </small>
                  </div>
                  {/* Requester Folio */}
                  {/* <div className="form-group my-2">
                    <label htmlFor="requester_folio">Requester Folio</label>
                    <Controller
                      name="requester_folio"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={folio_options}
                          id="requester_folio"
                          styles={errors.requester_folio && errorStyles}
                          ref={requester_ref}
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
                  </div> */}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-lg-4 col-md-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Split Of Shares</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="certificate_no">Certificate No</label>
                    <Controller
                      name="certificate_no"
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="certificate_no"
                          styles={errors.certificate_no && errorStyles}
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                          placeholder={
                            !watch("folio_no")?.value ||
                            certificates.length === 0
                              ? "Select Folio Having Certificates"
                              : "Select Certificate"
                          }
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.certificate_no?.message}
                    </small>
                  </div>
                  {/* Shares */}
                  <div className="form-group my-2">
                    <label htmlFor="shares">Shares</label>
                    <NumberFormat
                      className="form-control text-right"
                      id="shares"
                      decimalScale={2}
                      placeholder="Enter Number"
                      value={input_certificates?.shares_count}
                      thousandSeparator={true}
                      readOnly
                    />
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <label htmlFor="distinctive_from">Distinctive From</label>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <label htmlFor="distinctive_to">Distinctive To</label>
                    </div>
                  </div>
                  {!!input_certificates?.distinctive_no &&
                    !isNaN(
                      JSON.parse(input_certificates.distinctive_no)?.length
                    ) &&
                    JSON.parse(input_certificates.distinctive_no).map(
                      (item) => (
                        <DistinctiveCounterItem
                          calculatedCounter={() => {}}
                          calculated={true}
                          from={item.from}
                          to={item.to}
                        />
                      )
                    )}

                  {/* Split Parts */}
                  <div className="form-group my-2">
                    <label htmlFor="split_parts">Split Parts</label>
                    <Controller
                      name="split_parts"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.split_parts && "border border-danger"
                          }`}
                          id="split_parts"
                          allowNegative={false}
                          placeholder="Enter Quantity"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.split_parts?.message}
                    </small>
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
                    <th className="text-nowrap tex-right">No of Shares</th>
                    <th className="text-nowrap">Distinctive No. From</th>
                    <th className="text-nowrap">Distinctive To</th>
                  </tr>
                </thead>

                <tbody>
                  {!isNaN(parseInt(watch("split_parts"))) &&
                    request.txn_generated === "true" &&
                    [...Array(parseInt(watch("split_parts")))].map(
                      (cert, index) => (
                        <ViewSplitShareCertificateItem
                          startCalculation={startCalculation}
                          calculated={true}
                          num={parseInt(watch("split_parts")) + index}
                          distinctive_no={
                            view_certificates[index]?.distinctive_no
                          }
                          df_snum={view_certificates[index]?.certificate_no}
                          df_noOfShares={view_certificates[index]?.shares_count}
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

export default ViewSplitShares;
