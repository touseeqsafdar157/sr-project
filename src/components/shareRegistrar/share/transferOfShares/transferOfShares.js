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
import {
  getvalidDateYMD,
  IsJsonString,
} from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import { addTransferOfShareSchema } from "../../../../store/validations/transferOfSharesValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import {
  addInvestorRequest,
  addInvestorRequestTOS,
} from "../../../../store/services/investor.service";
import {
  getCertificateNo,
  getCompanies,
  getCompanyById,
} from "../../../../store/services/company.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import { getShareholders } from "store/services/shareholder.service"

const TransferOfShares = ({ setInvestorRequestForm, selectedCompany, companyName }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  //Refs
  const transferor_ref = useRef(null);
  const transferee_ref = useRef(null);
  // States
  const [loading, setLoading] = useState(false);
  const [folio_options, setFolio_options] = useState([]);
  const [df_snum, setDf_snum] = useState("");
  const [shareHoldings, setShareHoldings] = useState([]);
  const [company_options, setCompany_options] = useState([]);
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificatesDropdown, setCertificatesDropdown] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [inactive_shareholders_data, setInactive_shareholders_data] = useState([])
  const [inactive_shareholders_data_loading, setInactive_shareholders_data_loading] = useState(false);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companies_data_loading , setCompanies_data_loading] = useState(false);
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(addTransferOfShareSchema) });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({ control, name: "input_certificates" });

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
          shares_count: new_cert.shares_count,
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

  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };
  // useEffect(async () => {
  //   try {
  //     setCompany_options(await company_setter());
  //     setCertificate_options(await certificate_setter());
  //   } catch (err) {
  //     !!err?.response?.data?.message
  //       ? toast.error(err?.response?.data?.message)
  //       : toast.error("Options Not Found");
  //   }
  // }, []);


  const getShareHoldersByCompanyCode = async () => {
    setInactive_shareholders_data_loading(true);
    try {
      const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
      if (response.status === 200) {
        const parents = response.data.data
            setInactive_shareholders_data(parents)
            const filterParents =  parents?.filter(item=>item?.cdc_key =='NO');
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

  const getSelectedCompanyInfo = async () => {
    try {
      const response = await getCompanyById(baseEmail, selectedCompany);
      if (response.status === 200) {
        const parents = response.data.data;
        setCompanies(parents);
      }
    } catch (error) {
      toast.error("Error fetching company info")
    }
  }

  useEffect(() => {
    // const getAllCompanies = async () => {
    //   setCompanies_data_loading(true);
    //   try {
    //     const response = await getCompanies(baseEmail);
    //     const companies_dropdowns = response.data.data.map((item) => {
    //       let label = `${item.code} - ${item.company_name}`;
    //       return { label: label, value: item.code };
    //     });
    //     setCompanies_dropdown(companies_dropdowns);
    //     setCompanies(response.data.data);
    //     setCompanies_data_loading(false);
    //   } catch (error) {
    //       !!error?.response?.data?.message
    //       ? toast.error(error?.response?.data?.message)
    //       : toast.error("Companies Not Found");
    //       setCompanies_data_loading(false);
    //   }
    // };
    // const getAllShareHolders = async () => {
    //   setInactive_shareholders_data_loading(true);
    //   try{
    //   const response = await getShareholders(baseEmail)
    //   if (response.status===200) {
    //         const parents = response.data.data
    //         setInactive_shareholders_data(parents)
    //         setInactive_shareholders_data_loading(false)
    //   } }catch(error) {
    //     setInactive_shareholders_data_loading(false);
    //   }
    //   };
    // getAllCompanies();
    getSelectedCompanyInfo();
    // getAllShareHolders();
    getShareHoldersByCompanyCode()
  }, []);
  useEffect(() => {
    const getAllShareCertificates = async () => {
      setCertificatesLoading(true);
      if (watch('no_of_certificates') !== undefined) {
        setValue("no_of_certificates", '0');
      }
      try {
        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("transferor_folio_no").value
        );
        if (response.status === 200) {
          const filtered_certificates = response.data.data.filter(
            (item) => item?.td_verified === "true"
          );
          setCertificates(filtered_certificates);
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
  // useEffect(() => {
  //   const getShareHolders = async () => {
  //     try {
  //       const response = await getShareHoldersByCompany(
  //         baseEmail,
  //         watch("company_code")?.value
  //       );
  //       if (response.status === 200) {
  //         let options = response.data.data.map((item) => {
  //           let label = `${item.folio_number} (${item.shareholder_name}) `;
  //           return { label: label, value: item.folio_number };
  //         });
  //         setFolio_options(options);
  //       }
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : console.log("Folios Not Found");
  //     }
  //   };
  //   if (!!watch("company_code")?.value) {
  //     transferor_ref.current.clearValue();
  //     transferee_ref.current.clearValue();
  //     const options = inactive_shareholders_data
  //       .filter((data) => data.company_code === watch("company_code")?.value)
  //       .filter((item) => item.cdc_key === "NO")
  //       .map((item) => {
  //         let label = `${item.folio_number} (${item.shareholder_name}) `;
  //         return { label: label, value: item.folio_number };
  //       });
  //     setFolio_options(options);
  //   }
  // }, [watch("company_code"), inactive_shareholders_data_loading]);
  const handleAddInvestorRequest = async (data) => {
    const updated_input_certificate = data.input_certificates.map((cert) => ({
      ...certificates.find(
        (item) => item.certificate_no === cert.certificate_no?.value
      ),
    }));
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addInvestorRequestTOS(
        email,
        "TOS", //   Type of Request
        data.transferor_folio_no.value, // FROM
        // data.company_code.value,
        selectedCompany,
        // companies.find((comp) => comp.code === data.company_code.value)
        //   ?.symbol, //    Symbol
        companies?.symbol,
        data.transferee_folio_no.value, // TO
        totalSharesCount.toString(),
        data.request_date,
        updated_input_certificate, // Input Certificates (Multiple)
        data.remarks,
        data.transfer_no,
        data.execution_date
      );

      if (response.data.status === 200) {
        setLoading(false);
        setInvestorRequestForm(false);
        toast.success(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
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
                      data-testid="company_code"
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          // isLoading={companies_data_loading}
                          // options={companies_dropdown}
                          id="company_code"
                          // placeholder="Select Company"
                          placeholder={`${selectedCompany} - ${companyName}`}
                          value={selectedCompany}
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
                      // defaultValue={getvalidDateYMD(new Date())}
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
                    />
                    <small className="text-danger">
                      {errors.execution_date?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Transfer Number</label>
                    <Controller
                      data-testid="transfer_no"
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
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.transfer_no?.message}
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
                    />
                    <small className="text-danger">
                      {errors.remarks?.message}
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
                  {/* <div className="form-group my-2">
                        <label htmlFor="requester_folio">Requester Folio</label>
                        <Controller
                          data-testid="requester_folio"
                          name="requester_folio"
                          render={({ field }) => (
                            <Select
                              {...field}
                              isLoading={folio_options.length === 0}
                              options={folio_options}
                              id="requester_folio"
                              placeholder="Select Folio Number"
                              styles={errors.requester_folio && errorStyles}
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
                        data-testid="transferor_folio_no"
                        name="transferor_folio_no"
                        render={({ field }) => (
                          <Select
                            {...field}
                            isLoading={inactive_shareholders_data_loading}
                            options={folio_options}
                            ref={transferor_ref}
                            id="transferor_folio_no"
                            styles={errors.transferor_folio_no && errorStyles}
                            placeholder={
                              selectedCompany == "" || !selectedCompany
                                ? "Select Company First"
                                : "Select Folio Number"
                            }
                            // isDisabled={!selectedCompany || selectedCompany == ""}
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
                        data-testid="transferee_folio_no"
                        name="transferee_folio_no"
                        render={({ field }) => (
                          <Select
                            {...field}
                            isLoading={inactive_shareholders_data_loading}
                            options={folio_options}
                            ref={transferee_ref}
                            id="transferee_folio_no"
                            placeholder={
                              // !watch("company_code")?.value
                              !selectedCompany || selectedCompany == ""
                                ? "Select Company First"
                                : "Select Folio Number"
                            }
                            styles={errors.transferee_folio_no && errorStyles}
                            // isDisabled={!watch("company_code")?.value}
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
                      data-testid="no_of_certificates"
                      name="no_of_certificates"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.no_of_certificates && "border border-danger"
                          }`}
                          id="no_of_certificates"
                          readOnly={certificates.length === 0}
                          allowNegative={false}
                          placeholder={`${
                            certificates.length > 0
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
                  {/* Shares */}
                  <div className="form-group my-2">
                    <label htmlFor="no_of_shares">No of shares</label>
                    <NumberFormat
                      className={`form-control`}
                      id="no_of_shares"
                      value={totalSharesCount}
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
                        {certificatesLoading ? (
                          <b>Loading...</b>
                        ) : (
                          <b>{`This Shareholder Has ${certificates.length} Certificates`}</b>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Distinctive From */}
                  {/* <div className="form-group my-2">
                        <label htmlFor="price">Price</label>
                        <Controller
                          data-testid="price"
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
                          data-testid="amount"
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
                      </td>
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
          <div className="row px-2 my-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="fa fa-spinner fa-spin"></span>
                  <span>{"Loading..."}</span>
                </>
              ) : (
                <span>{"Submit"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default TransferOfShares;
