import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import Select from "react-select";
import SplitShareCertificateItem from "../SplitShareCertificateItem";
import { useSelector, useDispatch } from "react-redux";
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
  editInvestorRequestRSUB,
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
import { getCompanies } from "store/services/company.service"
import { getCorporateAnnouncement } from "store/services/corporate.service"
import { getCorporateEntitlement } from "store/services/corporate.service"
import { getShareholders } from "store/services/shareholder.service"

const EditRightSuscription = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  const output_certificates = JSON.parse(request.output_certificates);
  // States
  const [cdc_key, setCdc_key] = useState("YES");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  // Ref
  const announcement_ref = useRef(null);
  const entitlement_ref = useRef(null);
  // Selector ENDS
  const [certificates, setCertificates] = useState("");
  const [instrument_types, setInstrument_types] = useState([
    { label: "Cheque", value: "Checque" },
    { label: "Online", value: "Online" },
  ]);
  const [companies_selector, setCompanies_selector] = useState([]);
  const [shareholders, setShareholders] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [entitlements, setEntitlements] = useState([])
  const [selectedEntitlement, setSelectedEntitlement] = useState(
    entitlements.find(
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
    announcements.find(
      (ann) => ann.announcement_id === request.announcement_id.value
    )
  );
  const [selectedShareholder, setSelectedShareholder] = useState(
   shareholders.find(
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
  useEffect(() => {
    const getAllCompanies = async () => {
     try{
     const response = await getCompanies(baseEmail)
     if (response.status===200) {
           const parents = response.data.data
        setCompanies_selector(parents)
     } }catch(error) {
     }
     };
     const getAllCorporateAnnouncement = async () => {
      try{
      const response = await getCorporateAnnouncement(baseEmail)
      if (response.status===200) {
            const parents = response.data.data
            setAnnouncements(parents)
      } }catch(error) {
      }
      };
      const getAllCorporateEntitlements = async () => {
        try{
        const response = await getCorporateEntitlement(baseEmail)
        if (response.status===200) {
              const parents = response.data.data
              setEntitlements(parents)
        } }catch(error) {
        }
        };
      const getAllShareHolders = async () => {
        try{
        const response = await getShareholders(baseEmail)
        if (response.status===200) {
              const parents = response.data.data
              setShareholders(parents);
        } }catch(error) {
        }
        };
        getAllShareHolders();
      getAllCorporateAnnouncement();
      getAllCorporateEntitlements()
    getAllCompanies();
 }, [])
  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
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
    if (watch("company_code")?.value) {
      getCompanyCertificateNo();
    }
  }, [watch("company_code")]);
  useEffect(() => {
    const getEntitlement = async () => {
      try {
        const response = await getCorporateEntitlementById(
          baseEmail,
          watch("entitlements")?.value
        );
        if (response.status === 200) {
          setCdc_key(
            shareholders.find(
              (d) => d.folio_number === response.data.data.folio_number
            ).cdc_key
          );
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Entitlement Not Found");
      }
    };
    if (!!watch("entitlements")?.value) {
      getEntitlement();
    }
  }, [watch("entitlements")]);
  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await editInvestorRequestRSUB(
        email,
        "RSUB",
        shareholders.find(
          (d) => d.folio_number === selectedEntitlement?.folio_number
        )?.folio_number, // TO
        data.company_code.value,
        companies_selector.find(
          (c) => c.code === data.company_code.value
        )?.symbol, // Symbol
        data.entitlements.value,
        data.announcement_no.value,
        (data.sub_shares * selectedAnnouncmement?.right_rate).toString(), // Right Share Price
        selectedAnnouncmement?.right_rate,
        data.sub_shares, // Quantity
        data.execution_date,
        certificateObjects,
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
      setCertificateObjects([]);
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
                          ref={announcement_ref}
                          id="announcement_no"
                          styles={errors.announcement_no && errorStyles}
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
                          ref={entitlement_ref}
                          id="entitlements"
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
                        shareholders.find(
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
                  <div className="form-group my-2">
                    {df_snum !== "" && cdc_key === "NO" && (
                      <div
                        className="alert alert-warning dark fade show"
                        target="Alert-8"
                        role="alert"
                      >
                        <b>{`The last alloted certificate no  was ${df_snum} with distinctive counter ${distinctiveCounter}`}</b>
                      </div>
                    )}
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
                      className={`form-control`}
                      type="text"
                      value={selectedAnnouncmement?.right_percent}
                      placeholder="Right Percent"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Right Shares</label>
                    <input
                      className={`form-control`}
                      type="text"
                      placeholder="Right Shares"
                      value={selectedEntitlement?.right_shares}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Subscribable Right Shares</label>
                    <input
                      className={`form-control`}
                      type="text"
                      placeholder="Right Shares"
                      value={selectedShareholder?.right_shares}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Right Share Rate</label>
                    <input
                      className={`form-control`}
                      type="text"
                      placeholder="Right Share Rate"
                      value={request.price}
                      readOnly
                    />
                  </div>
                  {cdc_key === "NO" && (
                    <div className="form-group my-2">
                      <label htmlFor="certificates">Certificates</label>
                      <input
                        className={`form-control`}
                        name="certificates"
                        type="number"
                        placeholder="Certificates"
                        required
                        onChange={(e) => setCertificates(e.target.value)}
                        value={certificates}
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
                          className={`form-control ${
                            errors.sub_shares && "border-danger"
                          }`}
                          id="sub_shares"
                          allowNegative={false}
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
                      className={`form-control`}
                      type="text"
                      placeholder="Sub Amount"
                      value={request.amount}
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
                  {cdc_key === "NO" && (
                    <div className="form-group my-2">
                      <label htmlFor="Allot Size">Lot Size</label>
                      <input
                        type="text"
                        className="form-control"
                        name="allot_size"
                        id="allot_size"
                        value={
                          companies_selector.find(
                            (comp) => comp.code === watch("company_code")?.value
                          )?.allot_size
                        }
                        readOnly
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!isNaN(parseInt(certificates)) &&
            certificates < 20 &&
            certificates > 0 && (
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
                      {!isNaN(parseInt(certificates)) &&
                        [...Array(parseInt(certificates))].map(
                          (cert, index) => (
                            <SplitShareCertificateItem
                              key={index}
                              startCalculation={startCalculation}
                              calculated={startcalculation}
                              num={parseInt(certificates) + index}
                            />
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          <div className="row px-2 my-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              onClick={(e) => {
                cdc_key === "NO" && setStartcalculation(true);
              }}
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

export default EditRightSuscription;
