import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { getvalidDateYMD, IsJsonString } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import { addTransferOfShareSchema } from "../../../../store/validations/transferOfSharesValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import {
  addInvestorRequest,
  addInvestorRequestCEL,
  addInvestorRequestSPL,
  editInvestorRequestCEL,
} from "../../../../store/services/investor.service";
import { getCompanies } from "../../../../store/services/company.service";
import { getShareHoldersByCompany, getShareHoldersByShareholderID } from "../../../../store/services/shareholder.service";
import {
  addPhysicalToElectronicSchema,
  updatePhysicalToElectronicSchema,
} from "../../../../store/validations/physicalToElectronicValidation";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";

const EditPhysicalToElectronic = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
  console.log("🚀 ~ file: editPhysicalToElectronic.js:37 ~ request:", request)
  request.input_certificates = JSON.parse(request?.input_certificates).map((item) => {
    let certificate_no = {
      label: item.certificate_no,
      value: item.certificate_no,
    }
    let folio_number = {
      label: item.folio_number,
      value: item.folio_number,
    }
    return { ...item, certificate_no: certificate_no, folio_number: folio_number }
  })
  const input_certificates = request.input_certificates;

  // Refs
  const requester_ref = useRef(null);
  // States
  const [loading, setLoading] = useState(false);
  const [folio_options, setFolio_options] = useState([]);
  const [shareholders, setAllShareholders] = useState([]);
  const [company_options, setCompany_options] = useState([]);
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [certificates, setCertificates] = useState(input_certificates);
  const [totalSharesCount, setTotalSharesCount] = useState(request.quantity);
  const [startcalculation, setStartcalculation] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesDropdown, setCertificatesDropdown] = useState([]);
  const [to_folio_options, setTo_folio_options] = useState([]);
  const to_folio_ref = useRef(null);
  const [toFolioLoading, setToFolioLoading] = useState(false);
  const [fromFolioLoading, setFromFolioLoading] = useState(false);
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
    defaultValues: updatePhysicalToElectronicSchema(request).cast(),
    resolver: yupResolver(updatePhysicalToElectronicSchema(request)),
  });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({ control, name: "input_certificates" });
  useEffect(() => {
    if (
      !isNaN(parseInt(watch("no_of_certificates"))) &&
      watch("no_of_certificates") <= 20
    ) {
      const newVal = parseInt(watch("no_of_certificates") || 0);
      const oldVal = fields.length;
      if (newVal > oldVal) {
        // append certificates to field array
        for (let i = oldVal; i < newVal; i++) {
          append({ certificate_no: null });
        }
      } else {
        // remove certificates from field array
        for (let i = oldVal; i > newVal; i--) {
          remove(i - 1);
        }
      }
    }
  }, [watch("no_of_certificates")]);

  useEffect(() => {
    let updated_input_certificate;
    const checkAllCertificates =
      watch("input_certificates").length > 0 &&
      watch("input_certificates").every((cert) => cert.certificate_no);

    const getSharesCount = () => {
      setTotalSharesCount(
        updated_input_certificate
          .map((obj) => parseInt(obj.shares_count.replace(/,/g, "")) || 0)
          .reduce((prev, curr) => prev + curr, 0)
      );
    };

    if (checkAllCertificates) {
      updated_input_certificate = watch("input_certificates").map((cert) => {
        const new_cert = certificates.find(
          (item) => item.certificate_no === cert.certificate_no?.value
        );
        return {
          shares_count: new_cert?.shares_count,
          from: IsJsonString(new_cert?.distinctive_no)
            ? JSON.parse(new_cert?.distinctive_no)[0]?.from
            : 0,
          to: IsJsonString(new_cert?.distinctive_no)
            ? JSON.parse(new_cert?.distinctive_no)[0]?.to
            : 0,
          ...cert,
        };
      });
      getSharesCount();
    }
  }, [JSON.stringify(watch(`input_certificates`))]);
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
    const getAllShareCertificates = async () => {
      setCertificatesLoading(true);
      try {
        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("requester_folio").value
        );
        if (response.status === 200) {
          const activeCertificates = response.data.data.filter((item) => {
            if (item.status == 'ACTIVE') {
              return item;
            }
          })
          setCertificates(activeCertificates.filter((item) => {
            if (item.status == 'ACTIVE') {
              item.distinctive_no = JSON.parse(item.distinctive_no);
              return {
                ...item,
                label: item.certificate_no,
                value: item.certificate_no
              }

            }
          }));

          setCertificatesDropdown(
            // response.data.data.map((item) => ({
            activeCertificates.map((item) => ({
              label: item.certificate_no,
              value: item.certificate_no,
            }))
          );
          setCertificatesLoading(false);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Certificates Not Found");
        setCertificatesLoading(false);
      }
    };

    const getShareholders = async () => {
      try {
        setToFolioLoading(true);
        const investor_id = shareholders.find(
          (holding) => holding?.folio_number === watch("to_folio").value
        )?.shareholder_id;
        const response = await getShareHoldersByShareholderID(
          baseEmail,
          investor_id
        );
        if (response.status === 200) {
          // const to_folios = response.data.data
          //   .filter((h) => h.cdc_key === "YES")
          //   .map((item) => {
          //     let label = `${item.folio_number} (${item.shareholder_name}) `;
          //     return { label: label, value: item.folio_number };
          //   });
          // if (to_folios.length === 0) {
          setTo_folio_options(
            shareholders
              .filter(
                (holder) =>
                  holder.folio_number === watch('company_code').value
              )
              .map((item) => {
                let label = `${item.folio_number} (${item.shareholder_name}) `;
                return { label: label, value: item.folio_number };
              })
          );
          // } else {
          //   setTo_folio_options(to_folios);
          // }
          setToFolioLoading(false);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Shareholders Not Found Not Found");
        setToFolioLoading(false);
      }
      setToFolioLoading(false);
    };


    if (!!watch("to_folio")?.value) {
      to_folio_ref.current.clearValue();
      getAllShareCertificates();
      getShareholders();
    }
  }, [watch("to_folio")]);

  useEffect(() => {
    const getShareHolders = async () => {
      try {
        const response = await getShareHoldersByCompany(
          baseEmail,
          watch("company_code")?.value
        );
        if (response.status === 200) {
          setAllShareholders(response.data.data)
          let options = response.data.data.map((item) => {
            let label = `${item.folio_number} (${item.shareholder_name}) `;
            return { label: label, value: item.folio_number };
          });
          setFolio_options(options);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Folios Not Found");
      }
    };
    if (!!watch("company_code")?.value) {
      getShareHolders();
    }
  }, [watch("company_code")]);

  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await editInvestorRequestCEL(
        email,
        "CEL", //   Type of Request
        data.requester_folio.value,
        data.company_code.value,
        data.to_folio.value,
        "", //    Symbol
        totalSharesCount.toString(),
        certificateObjects,
        data.remarks,
        data.reference,
        data.transfer_no,
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
                          options={company_options}
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
                  {/* Request Type */}
                  <div className="form-group my-2">
                    <label>Request Type</label>
                    <input
                      className="form-control"
                      type="text"
                      name="request_type"
                      id="request_tyoe"
                      value="Physical To Electronic"
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
                  <div className="form-group my-2">
                    <label>Transfer Number</label>
                    <Controller
                      name="transfer_no"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${errors.transfer_no && "border-danger"
                            }`}
                          id="transfer_no"
                          allowNegative={false}
                          placeholder="Transfer Number"
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
                  {/* Execution Date */}
                  {/* <div className="form-group my-2">
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
                      </div> */}
                  {/* Requester Folio */}
                  <div className="form-group my-2">
                    <label htmlFor="requester_folio">Requester Folio</label>
                    <Controller
                      name="requester_folio"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={folio_options.length === 0}
                          options={folio_options}
                          ref={requester_ref}
                          id="requester_folio"
                          styles={errors.requester_folio && errorStyles}
                          placeholder={
                            !watch('company_code')?.value
                              ? "Select Company First"
                              : "Select Folio Number"
                          }
                          isDisabled={!watch('company_code')?.value}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.requester_folio?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="to_folio">To Folio</label>
                    <Controller
                      name="to_folio"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={to_folio_options.length === 0}
                          ref={to_folio_ref}
                          options={to_folio_options}
                          id="to_folio"
                          styles={errors.to_folio && errorStyles}
                          placeholder={
                            !watch('company_code').value
                              ? "Select Company First"
                              : "Select Folio Number"
                          }
                          isDisabled={!watch('company_code')?.value}
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
                      className={`form-control ${errors.remarks && "border border-danger"
                        }`}
                      type="text"
                      name="remarks"
                      id="remarks"
                      placeholder="Enter Remarks"
                      {...register("remarks")}
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
                  <div className="form-group my-2">
                    <label htmlFor="no_of_certificates">
                      No Of Certificates
                    </label>
                    <Controller
                      name="no_of_certificates"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${errors.no_of_certificates && "border border-danger"
                            }`}
                          id="no_of_certificates"
                          readOnly={certificates.length === 0}
                          allowNegative={false}
                        // readOnly
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
                      className={`form-control`}
                      id="no_of_shares"
                      value={request.quantity}
                      decimalScale={2}
                      placeholder="Enter Number"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Reference No</label>
                    <Controller
                      name="reference"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${errors.reference && "border-danger"
                            }`}
                          id="reference"
                          allowNegative={false}
                          placeholder="Enter Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.reference?.message}
                    </small>
                  </div>
                  {/* Distinctive From */}
                  {/* <div className="form-group my-2">
                        <label htmlFor="price">Price</label>
                        <Controller
                          name="price"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${
                                errors.price && "border border-danger"
                              }`}
                              id="price"
                              allowNegative={false}
                              placeholder="Enter Quantity"
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.price?.message}
                        </small>
                      </div> */}
                  {/* Distinctive TO */}
                  {/* <div className="form-group my-2">
                        <label htmlFor="amount">Amount</label>
                        <Controller
                          name="amount"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${
                                errors.amount && "border border-danger"
                              }`}
                              id="amount"
                              allowNegative={false}
                              placeholder="Enter Quantity"
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.amount?.message}
                        </small>
                      </div> */}
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
                  {fields.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <Controller
                          name={`input_certificates.${index}.certificate_no`}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isLoading={certificatesLoading}
                              options={certificatesDropdown}
                              id={`input_certificates.${index}.certificate_no`}
                              placeholder="Select Certificate"
                              styles={
                                errors.input_certificates?.[index]
                                  ?.certificate_no && errorStyles
                              }
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {
                            errors.input_certificates?.[index]?.certificate_no
                              ?.message
                          }
                        </small>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name={`input_certificates[${index}]shares_count`}
                          id={`input_certificates[${index}]shares_count`}
                          value={certificates
                            .find(
                              (cert) =>
                                cert.certificate_no ===
                                watch(
                                  `input_certificates[${index}]certificate_no`
                                )?.value
                            )
                            ?.shares_count.replace(/,g/, "")}
                          placeholder="Select Certificate"
                          readOnly
                        />
                      </td>
                      <td>
                        {watch(`input_certificates[${index}]certificate_no`) ? (
                          certificates.find(
                            (cert) =>
                              cert.certificate_no ===
                              watch(
                                `input_certificates[${index}]certificate_no`
                              )?.value
                          )?.distinctive_no.map((dist) => (
                            <input
                              className="form-control"
                              type="text"
                              name={`input_certificates[${index}]from`}
                              id={`input_certificates[${index}]from`}
                              value={dist.from}
                              placeholder="Select Certificate"
                              readOnly
                            />
                          ))
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            name={`input_certificates[${index}]from`}
                            id={`input_certificates[${index}]from`}
                            placeholder="Select Certificate"
                            readOnly
                          />
                        )}
                      </td>
                      <td>
                        {watch(`input_certificates[${index}]certificate_no`) ? (
                          certificates.find(
                            (cert) =>
                              cert.certificate_no ===
                              watch(
                                `input_certificates[${index}]certificate_no`
                              )?.value
                          )?.distinctive_no.map((dist) => (
                            <input
                              type="text"
                              className="form-control"
                              name={`input_certificates[${index}]to`}
                              id={`input_certificates[${index}]to`}
                              value={dist.to}
                              placeholder="Select Certificate"
                              readOnly
                            />
                          ))
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            name={`input_certificates[${index}]to`}
                            id={`input_certificates[${index}]to`}
                            placeholder="Select Certificate"
                            readOnly
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row px-2 my-2">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => setStartcalculation(true)}
              disabled={loading}
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

export default EditPhysicalToElectronic;
