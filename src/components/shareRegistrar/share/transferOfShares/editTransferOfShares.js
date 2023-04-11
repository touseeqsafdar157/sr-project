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
import { useSelector, useDispatch } from "react-redux";
import Breadcrumb from "../../../common/breadcrumb";
import { addSplitShareSchema } from "../../../../store/validations/splitShareValidation";
import { getvalidDateYMD, IsJsonString } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import { updateTransferOfShareSchema } from "../../../../store/validations/transferOfSharesValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import {
  addInvestorRequest,
  editInvestorRequestTOS,
} from "../../../../store/services/investor.service";
import { getCompanies } from "../../../../store/services/company.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";
import { getShareholders } from "store/services/shareholder.service";

const EditTransferOfShares = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  // Selector STARTS
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));
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
  const view_certificates = request.input_certificates;
  console.log(request.input_certificates, "🚀input_certificates:=>", request)
  // const view_certificates = JSON.parse(request.input_certificates);
  // Selector ENDS
  // STATES
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [newcertificates, setNewcertificates] = useState(view_certificates);
  const [certificates, setCertificates] = useState([]);
  // States
  const [loading, setLoading] = useState(false);
  const [folio_options, setFolio_options] = useState([]);
  const [companies_selector, setCompanies_selector] = useState([]);
  const [shareholders, setAllShareholders] = useState([]);
  const [certificatesDropdown, setCertificatesDropdown] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [inactive_shareholders_data, setInactive_shareholders_data] = useState([])
  const [inactive_shareholders_data_loading, setInactive_shareholders_data_loading] = useState(false);
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
    setValue,
    watch,
  } = useForm({
    defaultValues: updateTransferOfShareSchema(request).cast(),
    resolver: yupResolver(updateTransferOfShareSchema(request)),
  });

  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({ control, name: "input_certificates" });

  useEffect(() => {
    const getShareHoldersByCompanyCode = async () => {
      setInactive_shareholders_data_loading(true);
      try {
        const response = await getShareHoldersByCompany(baseEmail, watch("company_code")?.value, "");
        if (response.status === 200) {
          const parents = response.data.data
          setInactive_shareholders_data(parents)
          const filterParents = parents?.filter(item => item?.cdc_key == 'NO');
          // console.log('parents', parents)
          // console.log('filterParents', filterParents)
          const options = filterParents
            // .filter((data) => data.company_code === selectedCompany)
            // .filter((item) => item.cdc_key === "NO")
            .map((item) => {
              let label = `${item.folio_number} (${item.shareholder_name}) `;
              return { label: label, value: item.folio_number };
            });
          setFolio_options(options);
          setInactive_shareholders_data_loading(false);

        }
      } catch (error) {
        setInactive_shareholders_data_loading(false);
        toast.error("Error fetching shareholders")
      }
    };
    getShareHoldersByCompanyCode()
  }, [])


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
        const new_cert = certificates?.find(
          (item) => item?.certificate_no === cert?.certificate_no?.value
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
    const getAllShareCertificates = async () => {
      setCertificatesLoading(true);

      try {
        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("transferor_folio_no").value
        );
        if (response.status === 200) {
          const filtered_certificates = response.data.data.filter(
            (item) => item?.td_verified === "true"
          );
          setCertificates(filtered_certificates.filter((item) => {
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
            filtered_certificates.map((item) => ({
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

    if (!!watch("transferor_folio_no")?.value) getAllShareCertificates();
  }, [watch("transferor_folio_no")]);

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

  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await editInvestorRequestTOS(
        email,
        "TOS", //   Type of Request
        data.transferor_folio_no.value, // FROM
        data.company_code.value,
        companies_selector.find(
          (comp) => comp.code === data.company_code.value
        )?.symbol, //    Symbol
        data.transferee_folio_no.value, // TO
        totalSharesCount.toString(),
        data.request_date,
        certificateObjects,
        data.remarks,
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
  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };
  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await getCompanies(baseEmail);
        setCompanies_selector(response.data.data);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Companies Not Found");
      }
    };
    const getAllShareHolders = async () => {
      try {
        const response = await getShareholders(baseEmail)
        if (response.status === 200) {
          const parents = response.data.data
          setAllShareholders(parents)
        }
      } catch (error) {
      }
    };
    getAllCompanies();
    getAllShareHolders();
  }, []);


  // useEffect(() => {
  //   const getAllShareCertificates = async () => {
  //     try {
  //       const response = await getShareCertificatesByFolio(
  //         baseEmail,
  //         watch("transferor_folio_no").value
  //       );
  //       if (response.status === 200) {
  //         setCertificates(
  //           response.data.data.filter((item) => item?.td_verified === "true")
  //         );
  //       }
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : toast.error("Certificates Not Found");
  //     }
  //   };

  //   if (!!watch("transferor_folio_no")?.value) {
  //     getAllShareCertificates();
  //   }
  // }, [watch("transferor_folio_no")]);

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
                        // readOnly
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.transfer_no?.message}
                    </small>
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
                    <div className="form-group">
                      <label htmlFor="transferor_folio_no">Folio Number</label>
                      <Controller
                        name="transferor_folio_no"
                        render={({ field }) => (
                          <Select
                            {...field}
                            isLoading={inactive_shareholders_data_loading}
                            options={folio_options}
                            ref={transferor_ref}
                            id="transferor_folio_no"
                            styles={errors.transferor_folio_no && errorStyles}
                            onChange={() => {
                              if (watch('no_of_certificates') !== undefined) {
                                setValue("no_of_certificates", '0');
                              }
                            }}
                            placeholder={
                              !watch("company_code")?.value
                                ? "Select Company First"
                                : "Select Folio Number"
                            }
                          // isDisabled={true}
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
                            !inactive_shareholders_data_loading
                              ? inactive_shareholders_data.find(
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
                            isLoading={inactive_shareholders_data_loading}
                            options={folio_options}
                            ref={transferee_ref}
                            id="transferee_folio_no"
                            placeholder={
                              !watch("company_code")?.value
                                ? "Select Company First"
                                : "Select Folio Number"
                            }
                            styles={errors.transferee_folio_no && errorStyles}
                          // isDisabled={true}
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
                            !inactive_shareholders_data_loading
                              ? inactive_shareholders_data.find(
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
                        // readOnly
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
                          className={`form-control ${errors.no_of_certificates && "border border-danger"
                            }`}
                          id="no_of_certificates"
                          // readOnly
                          allowNegative={false}
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
                      className={`form-control`}
                      id="no_of_shares"
                      value={request.quantity}
                      decimalScale={2}
                      placeholder="Enter Number"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    {!!watch("transferor_folio_no")?.value && (
                      <div
                        className="alert alert-warning dark fade show"
                        target="Alert-8"
                        role="alert"
                      >
                        <b>{`Transferor has ${certificates.length} certiifcates`}</b>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row my-2">
            <div className="w-100">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-nowrap">Certificate No.</th>
                    <th className="text-nowrap">No of Shares</th>
                    <th className="text-nowrap">Distinctive No. From</th>
                    <th className="text-nowrap">Distinctive To</th>
                  </tr>
                </thead>
                {console.log(watch(`input_certificates[${0}]certificate_no`)?.value, 'certificates', certificates)}
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
                          className="form-control text-right"
                          name={`input_certificates[${index}]shares_count`}
                          id={`input_certificates[${index}]shares_count`}
                          value={
                            certificates && certificates.find(
                              (cert) =>
                                cert.certificate_no ===
                                watch(
                                  `input_certificates[${index}]certificate_no`
                                )?.value
                            )?.shares_count
                          }
                          placeholder="Select Certificate"
                          readOnly
                        />
                      </td>
                      <td>
                        {watch(`input_certificates[${index}]certificate_no`) ? (
                          certificates && certificates?.find(
                            (cert) =>
                              cert?.certificate_no ===
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
                          certificates && certificates.find(
                            (cert) =>
                              cert?.certificate_no ===
                              watch(
                                `input_certificates[${index}]certificate_no`
                              )?.value
                          )?.distinctive_no
                            .map((dist) => (
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
                      {/* <tr key={item.id}>
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
                          value={
                            certificates.find(
                              (cert) =>
                                cert.certificate_no ===
                                watch(
                                  `input_certificates[${index}]certificate_no`
                                )?.value
                            )?.shares_count
                          }
                          placeholder="Select Certificate"
                          readOnly
                        />
                      </td>
                      <td>
                        {watch(`input_certificates[${index}]certificate_no`) ? (
                          JSON.parse(
                            certificates.find(
                              (cert) =>
                                cert.certificate_no ===
                                watch(
                                  `input_certificates[${index}]certificate_no`
                                )?.value
                            )?.distinctive_no
                          ).map((dist) => (
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
                          JSON.parse(
                            certificates.find(
                              (cert) =>
                                cert.certificate_no ===
                                watch(
                                  `input_certificates[${index}]certificate_no`
                                )?.value
                            )?.distinctive_no
                          ).map((dist) => (
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
                      </td> */}
                    </tr>
                  ))}
                  {/* {!isNaN(parseInt(watch("no_of_certificates"))) &&
                    watch("no_of_certificates") <= 20 &&
                    [...Array(parseInt(watch("no_of_certificates")))].map(
                      (cert, index) => (
                        <TransferOfSharesItem
                          certificates={certificates}
                          startCalculation={startCalculation}
                          calculated={startcalculation}
                          num={parseInt(watch("no_of_certificates")) + index}
                        />
                      )
                    )} */}
                </tbody>
              </table>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => setStartcalculation(true)}
            disabled={loading}
            style={!loading ? { cursor: "pointer" } : { cursor: "not-allowed" }}
          >
            {loading ? (
              <>
                <span className="fa fa-spinner fa-spin"></span>
                <span>{"Loading..."}</span>
              </>
            ) : (
              <span>{"Update"}</span>
            )}
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default EditTransferOfShares;
