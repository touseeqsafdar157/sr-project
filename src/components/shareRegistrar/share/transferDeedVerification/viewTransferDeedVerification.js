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

import {
  getvalidDateYMD,
  IsJsonString,
} from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import {
  addTransferDeedVerificationSchema,
  updateTransferDeedVerificationSchema,
} from "../../../../store/validations/transferDeedValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import {
  addInvestorRequest,
  addInvestorRequestTOS,
  addInvestorRequestVTD,
} from "../../../../store/services/investor.service";
import {
  getCertificateNo,
  getCompanies,
} from "../../../../store/services/company.service";
import {
  getShareHolderByFolioNo,
  getShareHoldersByCompany,
} from "../../../../store/services/shareholder.service";
import { getShareholders } from "../../../../store/services/shareholder.service";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";

const ViewTransferDeedVerification = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  const input_certificates = IsJsonString(request.input_certificates)
    ? JSON.parse(request.input_certificates)
    : request.input_certificates;
  // Selector STARTS
  // const shareholders = useSelector((data) => data.Shareholders);
  const [shareholders, setShareholders] = useState([]);
  const companies_selector = useSelector((data) => data.Companies);

  // Selector ENDS
  //Refs
  const transferor_ref = useRef(null);
  const transferee_ref = useRef(null);
  // States
  const [loading, setLoading] = useState(false);
  const [folio_options, setFolio_options] = useState([]);
  const [attachment, setAttachment] = useState(request.attachment);
  const [df_snum, setDf_snum] = useState("");
  const [shareholder, setShareHolder] = useState(null);
  const [company_options, setCompany_options] = useState([]);
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [companies, setCompanies] = useState([]);
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
    defaultValues: updateTransferDeedVerificationSchema(request).cast(),
    resolver: yupResolver(updateTransferDeedVerificationSchema(request)),
  });

  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };

  const handleAddInvestorRequest = async (data) => {
  };

  useEffect(async () => {
    try {
      const response = await getShareHoldersByCompany(baseEmail, request.company_code.value);
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
  }, [])

  return (
    <Fragment>
      <div className="container-fluid">
        <form onSubmit={handleSubmit(handleAddInvestorRequest)}>
          <div className="row">
            <div className="col-md-6 col-sm-12">
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
                  {/* Request Type */}
                  <div className="form-group my-2">
                    <label>Request Type</label>
                    <input
                      className="form-control"
                      type="text"
                      name="request_type"
                      id="request_tyoe"
                      value="Transfer Deed Verification"
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
                      className={`form-control ${errors.request_date && "border border-danger"
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
                  <div className="form-group my-2">

                    <div className="form-group">
                      <label htmlFor="transferor_folio_no">Folio Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="transferor_folio_no"
                        placeholder="Enter Name"
                        value={
                          watch('transferor_folio_no')?.label
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
                                  watch("transferor_folio_no")?.value
                              )?.shareholder_name
                              : ""
                          }
                          readOnly
                        />
                      </div>
                    </div>
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
                          allowNegative={false}
                          thousandSeparator={true}
                          readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_of_certificates?.message}
                    </small>
                  </div>
                  {/* Shares */}
                  <div className="form-group my-2">
                    <label htmlFor="no_of_shares">No of shares</label>
                    <NumberFormat
                      className={`form-control text-right`}
                      id="no_of_shares"
                      value={request.quantity}
                      decimalScale={2}
                      placeholder="Enter Number"
                      thousandSeparator={true}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="attachment">Attachment</label>
                    {attachment && (
                      <img
                        width="200"
                        src={attachment}
                        alt="image_of_attachment"
                      />
                    )}
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
                          calculated={true}
                          num={parseInt(watch("no_of_certificates")) + index}
                          distinctive_no={
                            JSON.parse(input_certificates[index].distinctive_no)
                          }
                          df_snum={input_certificates[index].certificate_no}
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

export default ViewTransferDeedVerification;
