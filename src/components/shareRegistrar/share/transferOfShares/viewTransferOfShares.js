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

const ViewTransferOfShares = ({ setInvestorRequestForm }) => {
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
    defaultValues: updateTransferOfShareSchema(request).cast(),
    resolver: yupResolver(updateTransferOfShareSchema(request)),
  });

  const handleAddInvestorRequest = async (data) => { };
  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };

  useEffect(() => {
    // const getAllShareCertificates = async () => {
    //   try {
    //     const response = await getShareCertificatesByFolio(
    //       baseEmail,
    //       watch("transferor_folio_no").value
    //     );
    //     if (response.status === 200) {
    //       setCertificates(
    //         response.data.data.filter((item) => item?.td_verified === "true")
    //       );
    //     }
    //   } catch (error) {
    //     !!error?.response?.data?.message
    //       ? toast.error(error?.response?.data?.message)
    //       : toast.error("Certificates Not Found");
    //   }
    // };

    if (!!watch("transferor_folio_no")?.value)
      setCertificates(view_certificates);
  }, [watch("transferor_folio_no")]);

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
  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedInvestorRequest", {});
    };
  }, []);

  useEffect(async () => {
    try {
      const response = await getShareHoldersByCompany(
        baseEmail,
        request.company_code.value
      );
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
  }, []);

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
                          id="company_code"
                          placeholder="Select Company"
                          isDisabled={true}
                          styles={errors.company_code && errorStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.company_code?.message}
                    </small>
                  </div> */}
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
                      className={`form-control ${errors.request_date && "border border-danger"
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
                      className={`form-control ${errors.execution_date && "border border-danger"
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
                    <div className="form-group my-2">
                      <label htmlFor="transferor_folio_no">Folio Number</label>
                      <input
                        type="text"
                        className={`form-control `}
                        name="transferor_folio_no"
                        id="transferor_folio_no"
                        {...register("transferor_folio_no")}
                        value={
                          watch("transferor_folio_no")?.label
                        }
                        readOnly
                      />
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
                    {/* <div className="form-group"> */}
                      <div className="form-group my-2">
                        <label htmlFor="transferee_folio_no">Folio Number</label>
                        <input
                          type="text"
                          className={`form-control `}
                          name="transferee_folio_no"
                          id="transferee_folio_no"
                          {...register("transferee_folio_no")}
                          value={
                            watch("transferee_folio_no")?.label
                          }
                          readOnly
                        />
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
                </div>
              </div>
              <div className="col-sm-12 col-lg-4 col-md-4">
                <div className="card">
                  <div className="card-header b-t-success">
                    <h5>Transaction</h5>
                  </div>
                  <div className="card-body">
                    <div className="form-group my-2">
                      <label htmlFor="no_of_certificates">
                        No Of Certificates
                      </label>
                      <Controller
                        name="no_of_certificates"
                        render={({ field }) => (
                          <NumberFormat
                            {...field}
                            className={`form-control text-right ${errors.no_of_certificates && "border border-danger"
                              }`}
                            id="no_of_certificates"
                            readOnly
                            allowNegative={false}
                            thousandSeparator={true}
                            placeholder={`${certificates.length > 0
                              ? "Enter Quantity"
                              : "Transferor has no certificates"
                              }`}
                          />
                        )}
                        control={control}
                      />
                      <small className="text-danger">
                        {errors.no_of_certificates?.message}
                      </small>
                    </div>
                    <div className="form-group my-2">
                      <label htmlFor="no_of_shares">No of shares</label>
                      <NumberFormat
                        className={`form-control text-right`}
                        id="no_of_shares"
                        value={request.quantity}
                        thousandSeparator={true}
                        decimalScale={2}
                        placeholder="Enter Number"
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
                      <th className="text-nowrap">No of Shares</th>
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
                            calculated={startcalculation}
                            num={parseInt(watch("no_of_certificates")) + index}
                            distinctive_no={JSON.parse(
                              view_certificates[index].distinctive_no
                            )}
                            df_snum={view_certificates[index].certificate_no}
                            df_noOfShares={view_certificates[index].shares_count}
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

export default ViewTransferOfShares;
