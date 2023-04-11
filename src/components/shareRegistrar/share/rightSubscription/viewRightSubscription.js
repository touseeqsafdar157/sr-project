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
  addRightSubscribtionValidation,
  updateRightSubscribtionValidation,
} from "../../../../store/validations/rightSubscribtionValidation";
import { getvalidDateYMD } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import {
  addInvestorRequestDUP,
  addInvestorRequestRSUB,
  addInvestorRequestSPL,
} from "../../../../store/services/investor.service";
import {
  getShareCertificatesByFolio,
  getShareCertificatesByNumber,
} from "../../../../store/services/shareCertificate.service";
import {
  getShareHolderByFolioNo,
  getShareHoldersByCompany,
} from "../../../../store/services/shareholder.service";
import {
  getCorporateAnnouncementByCompanyCode,
  getCorporateAnnouncementById,
  getCorporateEntitlementByAnnouncement,
  getCorporateEntitlementById,
} from "../../../../store/services/corporate.service";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";
import { numberWithCommas } from "../../../../utilities/utilityFunctions";

const ViewRightSuscription = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  const output_certificates = JSON.parse(request.output_certificates);
  // States
  const shareholders = useSelector((data) => data.Shareholders);
  const announcements = useSelector((data) => data.Announcements);
  const folios = useSelector((data) => data.Shareholders);
  const entitlements = useSelector((data) => data.Entitlements);
  const companies_selector = useSelector((data) => data.Companies);
  // Ref
  const announcement_ref = useRef(null);
  const entitlement_ref = useRef(null);
  // Selector ENDS
  const [certificates, setCertificates] = useState(output_certificates.length);
  const [instrument_types, setInstrument_types] = useState([
    { label: "Cheque", value: "Checque" },
    { label: "Online", value: "Online" },
  ]);

  const [selectedEntitlement, setSelectedEntitlement] = useState(
    entitlements.entitlement_data.find(
      (enn) => enn.entitlement_id === request.entitlement_id.value
    )
  );
  const [loading, setLoading] = useState(false);
  const [df_snum, setDf_snum] = useState("");
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [announcement_options, setAnnouncement_options] = useState([]);
  const [entitlement_options, setEntitlement_options] = useState([]);
  const [selectedAnnouncmement, setSelectedAnnouncmement] = useState(
    announcements.announcement_data.find(
      (ann) => ann.announcement_id === request.announcement_id.value
    )
  );
  const [selectedShareholder, setSelectedShareholder] = useState(
    folios.shareholders_data.find(
      (holders) => holders.folio_number === request.folio_number.value
    )
  );
  const [folio_options, setFolio_options] = useState([]);
  const [startcalculation, setStartcalculation] = useState(false);
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
    defaultValues: updateRightSubscribtionValidation(request).cast(),
    resolver: yupResolver(updateRightSubscribtionValidation(request)),
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
            <div className="col-md-3 col-sm-12 col-lg-3">
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
                      value="Right Subscriptions"
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
                      name="request_date"
                      type="date"
                      className={`form-control ${
                        errors.request_date && "border border-danger"
                      }`}
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
                      name="execution_date"
                      type="date"
                      className={`form-control ${
                        errors.execution_date && "border border-danger"
                      }`}
                      id="execution_date"
                      {...register("execution_date")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.execution_date?.message}
                    </small>
                  </div>

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
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 col-lg-3">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>ANNOUNCEMENT</h5>
                </div>
                <div className="card-body">
                  {/* Announcement Number */}
                  <div className="form-group my-2">
                    <label htmlFor="announcement_no">Announcement </label>
                    <Controller
                      name="announcement_no"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={announcement_options}
                          ref={announcement_ref}
                          id="announcement_no"
                          styles={errors.announcement_no && errorStyles}
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                          placeholder={
                            !watch("company_code")?.value
                              ? "Select Company First"
                              : "Select Announcement"
                          }
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.announcement_no?.message}
                    </small>
                  </div>
                  {/* Entitlements */}
                  <div className="form-group my-2">
                    <label htmlFor="entitlements">Entitlements </label>
                    <Controller
                      name="entitlements"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={entitlement_options}
                          ref={entitlement_ref}
                          id="entitlements"
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                          styles={errors.entitlements && errorStyles}
                          placeholder={
                            !watch("company_code")?.value
                              ? "Select Company First"
                              : "Select Entitlements"
                          }
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.entitlements?.message}
                    </small>
                  </div>

                  {/* Name */}
                  <div className="form-group my-2">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className={`form-control`}
                      id="name"
                      value={
                        shareholders.shareholders_data.find(
                          (holder) =>
                            holder.folio_number === request.folio_number.value
                        )?.shareholder_name
                      }
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Folio</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className={`form-control`}
                      id="name"
                      value={request.folio_number.label}
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
            <div className="col-sm-12 col-lg-3 col-md-3">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>RIGHT SHARE DETAILS</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Right Percent</label>
                    <input
                      className={`form-control text-right`}
                      type="text"
                      value={selectedAnnouncmement?.right_percent}
                      placeholder="Right Percent"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Right Shares</label>
                    <input
                      className={`form-control text-right`}
                      type="text"
                      placeholder="Right Shares"
                      value={numberWithCommas(selectedEntitlement?.right_shares)}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Subscribable Right Shares</label>
                    <input
                      className={`form-control text-right`}
                      type="text"
                      placeholder="Right Shares"
                      value={numberWithCommas(selectedShareholder?.right_shares)}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Right Share Rate</label>
                    <input
                      className={`form-control text-right`}
                      type="text"
                      placeholder="Right Share Rate"
                      value={request.price}
                      readOnly
                    />
                  </div>
                  {output_certificates.length > 0 && (
                    <div className="form-group my-2">
                      <label htmlFor="certificates">Certificates</label>
                      <input
                        className={`form-control`}
                        name="certificates"
                        type="text"
                        placeholder="Certificates"
                        value={output_certificates.length}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-lg-3 col-md-3">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>SUBSCRIBTION DETAILS</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Sub Shares</label>
                    <Controller
                      name="sub_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.sub_shares && "border-danger"
                          }`}
                          id="sub_shares"
                          allowNegative={false}
                          thousandSeparator={true}
                          placeholder="Sub Shares"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.sub_shares?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label htmlFor="sub_amount">Sub Amount</label>
                    <input
                      name="sub_amount"
                      className={`form-control text-right`}
                      type="text"
                      placeholder="Sub Amount"
                      value={numberWithCommas(request.amount)}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="instrument_type">Instrument Type</label>
                    <Controller
                      name="instrument_type"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={instrument_types}
                          id="instrument_type"
                          placeholder="Select Instrument Type"
                          components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                          styles={errors.instrument_type && errorStyles}
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.instrument_type?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Instrument No</label>
                    <Controller
                      name="instrument_no"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.instrument_no && "border-danger"
                          }`}
                          id="instrument_no"
                          allowNegative={false}
                          placeholder="Instrument No / Ref No"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.instrument_no?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {output_certificates.length !== "0" && (
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
                    {!isNaN(parseInt(certificates)) &&
                      [...Array(parseInt(certificates))].map((cert, index) => (
                        <ViewSplitShareCertificateItem
                          key={index}
                          startCalculation={startCalculation}
                          calculated={true}
                          num={parseInt(certificates) + index}
                          df_snum={output_certificates[index].certificate_no}
                          distinctive_no={
                            output_certificates[index].distinctive_no
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
          )}
        </form>
      </div>
    </Fragment>
  );
};

export default ViewRightSuscription;
