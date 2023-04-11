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
import { addTransmissionOfSharesSchema } from "../../../../store/validations/transmissionOfShareValidation";
import ElectronicTransmissionOfSharesItem from "../electronicTransmissionOfSharesItem";
import {
  addElectronicTransmissionOfSharesSchema,
  updateElectronicTransmissionOfSharesSchema,
} from "store/validations/electronicTransmissionOfShareValidation";

const ViewElectronicTransmissionOfShares = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request =
    JSON.parse(sessionStorage.getItem("selectedInvestorRequest")) || "";
  const { input_certificates } =
    JSON.parse(sessionStorage.getItem("selectedInvestorRequest")) || "";
  // States
  const dispatch = useDispatch();
  // const {
  //   inactive_shareholders_data,
  //   shareholders_data,
  //   shareholders_data_loading,
  //   inactive_shareholders_data_loading,
  // } = useSelector((data) => data.Shareholders);
  const [shareholders_data, setShareholders_Data] = useState([]);
  const [inactive_shareholders_data, setInactive_Shareholders_Data] = useState([]);

  const { companies_dropdown, companies_data, companies_data_loading } =
    useSelector((data) => data.Companies);
  // Ref
  const requester_ref = useRef(null);
  const certificate_ref = useRef(null);
  // Selector ENDS
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareholderShares, setShareholderShares] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  const [inactive_folio_options, setInactive_folio_options] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [startcalculation, setStartcalculation] = useState(false);
  const [totalSharesCount, setTotalSharesCount] = useState("");
  const [certificate, setCertificate] = useState(null);
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(updateElectronicTransmissionOfSharesSchema(request)),
    defaultValues: updateElectronicTransmissionOfSharesSchema(request).cast(),
  });

  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };

  useEffect(async()=>{
    try {
      const response = await getShareHoldersByCompany(baseEmail, request.company_code.value);
      if (response.status === 200){
        setShareholders_Data(response.data.data);
        setInactive_Shareholders_Data(response.data.data);
      }else{
        setShareholders_Data([]);
        setInactive_Shareholders_Data([]);
      }
    } catch (error) {
        if(error.response!==undefined){
          toast.error(error.response.data.message);
        }else{
          toast.error(error.message);
        }
    }
  },[])

  useEffect(() => {
    if (!!watch("folio_no")?.value) {
      setShareholderShares(
        shareholders_data.find(
          (holder) => holder.folio_number === watch("folio_no")?.value
        )?.electronic_shares
      );
    }
  }, [watch("folio_no")]);

  useEffect(() => {
    if (!!watch("company_code")?.value) {
      const options = shareholders_data
        .filter((data) => data.company_code === watch("company_code")?.value)
        .filter((item) => item.cdc_key === "YES")
        .map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.folio_number };
        });
      const inactive_options = inactive_shareholders_data
        .filter((data) => data.company_code === watch("company_code")?.value)
        .filter((item) => item.cdc_key === "YES")
        .map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.folio_number };
        });
      setInactive_folio_options(inactive_options);
      setFolio_options(options);
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

  const handleAddInvestorRequest = async (data) => {};
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
                  {/* <div className="form-group my-2">
                    <label htmlFor="company_code">Company </label>
                    <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={companies_data_loading}
                          options={companies_data
                            .filter((item) => item.company_type === "Private")
                            .map((item) => {
                              let label = `${item.code} - ${item.company_name}`;
                              return { label: label, value: item.code };
                            })}
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
                  </div> */}
                  {/* Folio Number */}
                  <div className="form-group">
                      <label htmlFor="folio_no">Folio Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="folio_no"
                        placeholder="Enter Name"
                        value={
                          watch('folio_no')?.label
                        }
                        readOnly
                      />
                    </div>
                  {/* <div className="form-group my-2">
                    <label htmlFor="folio_no">Folio Number </label>
                    <Controller
                      name="folio_no"
                      render={({ field }) => (
                        <Select
                          {...field}
                          // isLoading={folio_options.length === 0}
                          options={folio_options}
                          id="folio_no"
                          styles={errors.folio_no && errorStyles}
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
                  </div> */}
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
                        shareholders_data.length !== 0
                          ? shareholders_data.find(
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
                      value="Electronic Transmission Of Shares"
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Transfer Number</label>
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
                          placeholder="Transfer Number"
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.transfer_no?.message}
                    </small>
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

            <div className="col-sm-12 col-lg-4 col-md-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>No Of Shares</h5>
                </div>
                <div className="card-body">
                  {/* Quantity */}
                  <div className="form-group my-2">
                    <label htmlFor="transferees">Transferees</label>
                    <Controller
                      name="transferees"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.transferees && "border border-danger"
                          }`}
                          id="transferees"
                          allowNegative={false}
                          placeholder="Enter Number"
                          readOnly={true}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.transferees?.message}
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
                    <th className="text-nowrap">No</th>
                    <th className="text-nowrap">No of Shares</th>
                    <th className="text-nowrap">Transfer To</th>
                  </tr>
                </thead>

                <tbody>
                  {JSON.parse(input_certificates)?.length &&
                    JSON.parse(input_certificates).map((cert, index) => (
                      <ElectronicTransmissionOfSharesItem
                        folios={inactive_folio_options}
                        key={index}
                        num={index + 1}
                        df_count={cert.shares_count}
                        df_folio={cert.folio_number}
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

export default ViewElectronicTransmissionOfShares;
