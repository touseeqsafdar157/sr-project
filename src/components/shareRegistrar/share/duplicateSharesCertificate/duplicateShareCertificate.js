import React, { useState, useEffect, useRef, Fragment } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import {
  folio_setter,
  company_setter,
  certificate_setter,
  symbol_setter,
} from "../../../../store/services/dropdown.service";
import { getCertificateNo, getCompanyById } from "../../../../store/services/company.service";
import Breadcrumb from "../../../common/breadcrumb";
import { addConsolidateSharesSchema } from "../../../../store/validations/consolidateSharesValidation";
import {
  getvalidDateYMD,
  IsJsonString,
} from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import TransferOfShares from "../transferOfShares/transferOfShares";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import TransferOfSharesItem from "../transferOfSharesItem";
import {
  addInvestorRequest,
  addInvestorRequestDUP,
  addInvestorRequestTOS,
} from "../../../../store/services/investor.service";
import {
  getCompanies,
} from "../../../../store/services/company.service";
import { getShareholders } from "store/services/shareholder.service"
import SplitShareCertificateItem from "../SplitShareCertificateItem";
import { addDuplicateCertificatesSchema } from "../../../../store/validations/duplicateCertificatesValidation";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";
const DuplicateShareCertificate = ({ setInvestorRequestForm, selectedCompany, companyName }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  // States
  const [df_snum, setDf_snum] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [folio_options, setFolio_options] = useState([]);
  const [company_options, setCompany_options] = useState([]);
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesDropdown, setCertificatesDropdown] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [inputCertificateObjects, setInputCertificateObjects] = useState([]);
  const [outputCertificateObjects, setOutputCertificateObjects] = useState([]);
  const [startcalculation, setStartcalculation] = useState(false);
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [distinctiveFrom, setDistinctiveFrom] = useState("0");
  const [distinctiveTo, setDistinctiveTo] = useState("0");
  const [loading, setLoading] = useState(false);
  const [symbol_options, setSymbol_options] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [inactive_shareholders_data, setInactive_shareholders_data] = useState([]);
  const [inactive_shareholders_data_loading, setInactive_shareholders_data_loading] = useState(false);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  //Refs
  const requester_ref = useRef(null);
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(addDuplicateCertificatesSchema) });
  const {
    fields: input_fields,
    append: input_append,
    remove: input_remove,
  } = useFieldArray({ control, name: "input_certificates" });
  const {
    fields: output_fields,
    append: output_append,
    remove: output_remove,
  } = useFieldArray({ control, name: "output_certificates" });

  const startInputCalculation = (certificate) => {
    const newArray = inputCertificateObjects;
    newArray.push(certificate);
    setInputCertificateObjects(newArray);
  };
  const startOutputCalculation = (certificate) => {
    const newArray = outputCertificateObjects;
    newArray.push(certificate);
    setOutputCertificateObjects(newArray);
  };
  const handleAddInvestorRequest = async (data) => {
    const updated_input_certificates = data.input_certificates.map((cert) => ({
      ...certificates.find(
        (item) => item.certificate_no === cert.certificate_no?.value
      ),
    }));
    const updated_output_certificates = updated_input_certificates.map(
      (cert, i) => ({
        ...cert,
        certificate_no: data.output_certificates[i]?.certificate_no,
      })
    );
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addInvestorRequestDUP(
        email,
        "DUP",
        data.requester_folio.value, // TO
        // data.company_code.value,
        selectedCompany,
        // companies.find(
        //   (comp) => comp.code === data.company_code.value
        // )?.symbol,
        companies.find?.symbol,
        "", // Amount Paid
        updated_input_certificates, // Input Certicates
        updated_output_certificates,
        data.remarks,
        data.request_date,
        data.execution_date
      );

      if (response.data.status === 200) {
        setLoading(false);
        setInvestorRequestForm(false);
        toast.success(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      setInputCertificateObjects([]);
      setOutputCertificateObjects([]);
      !!error?.response?.data?.message
        ? toast.error(`${error?.response?.data?.message}`)
        : toast.error("Request Not Submitted");
    }
  };

  const getShareHoldersByCompanyCode = async () => {
    setInactive_shareholders_data_loading(true);
    try {
      const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
      if (response.status === 200) {
        const parents = response.data.data
            setInactive_shareholders_data(parents)
        const options = parents?.filter((h) => h.cdc_key === "NO")?.
              // .filter((data) => data.company_code === selectedCompany)
              // .filter((item) => item.cdc_key === "NO")
              map((item) => {
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

  const getCompanyCertificateNo = async () => {
    try {
      const response = await getCertificateNo(
        baseEmail,
        selectedCompany
      );
      if (response.status === 200) {
        setDf_snum(response.data.data.shares_counter);
        setDistinctiveCounter(response.data.data.distinctive_no_counter);
      }
    } catch (error) {
      !!error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : console.log("Certificate No Not Found");
    }
  };

  const getSelectedCompanyInfo = async () => {
    try {
      const response = await getCompanyById(baseEmail, selectedCompany);
      if (response.status === 200) {
        const parents = response.data.data;
        console.log("By Id => ", parents)
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
    //     setCompanies(response.data.data);
    //     const companies_dropdowns = response.data.data.map((item) => {
    //       let label = `${item.code} - ${item.company_name}`;
    //       return { label: label, value: item.code };
    //     });
    //     setCompanies_dropdown(companies_dropdowns);
    //     setCompanies_data_loading(false);
    //   } catch (error) {
    //     !!error?.response?.data?.message
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
    //         setInactive_shareholders_data_loading(false);
    //   } }catch(error) {
    //     setInactive_shareholders_data_loading(false);
    //   }
    //   };
    // getAllCompanies();
    // getAllShareHolders();
    getSelectedCompanyInfo();
    getShareHoldersByCompanyCode();
    getCompanyCertificateNo();


  }, []);
  // useEffect(async () => {
  //   try {
  //     setCertificate_options(await certificate_setter());
  //   } catch (err) {
  //     !!err?.response?.data?.message
  //       ? toast.error(err?.response?.data?.message)
  //       : toast.error("Options Not Found");
  //   }
  // }, []);
  useEffect(() => {
  }, [JSON.stringify(watch(`input_certificates`))]);
  // useEffect(() => {
  //   const getCompanyCertificateNo = async () => {
  //     try {
  //       const response = await getCertificateNo(
  //         baseEmail,
  //         watch("company_code")?.value
  //       );
  //       if (response.status === 200) {
  //         setDf_snum(response.data.data.shares_counter);
  //         setDistinctiveCounter(response.data.data.distinctive_no_counter);
  //       }
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : console.log("Certificate No Not Found");
  //     }
  //   };
  //   if (!!watch("company_code")?.value) {
  //     requester_ref.current.clearValue();
  //     const options = inactive_shareholders_data
  //       .filter((data) => data.company_code === watch("company_code")?.value)
  //       .filter((item) => item.cdc_key === "NO")
  //       .map((item) => {
  //         let label = `${item.folio_number} (${item.shareholder_name}) `;
  //         return { label: label, value: item.folio_number };
  //       });
  //     setFolio_options(options);
  //     getCompanyCertificateNo();
  //   }
  // }, [watch("company_code"), inactive_shareholders_data_loading]);
  useEffect(() => {
    if (
      !isNaN(parseInt(watch("no_of_certificates"))) &&
      watch("no_of_certificates") <= 20
    ) {
      const newVal = parseInt(watch("no_of_certificates") || 0);
      const oldVal = input_fields.length;
      if (newVal > oldVal) {
        // append certificates to field array
        for (let i = oldVal; i < newVal; i++) {
          input_append({ certificate_no: null });
          output_append({ certificate_no: "" });
        }
      } else {
        // remove certificates from field array
        for (let i = oldVal; i > newVal; i--) {
          input_remove(i - 1);
          output_remove(i - 1);
        }
      }
    }
  }, [watch("no_of_certificates")]);
  useEffect(() => {
    const getAllShareCertificates = async () => {
      setCertificatesLoading(true);
      if (watch('no_of_certificates') !== undefined) {
        setValue("no_of_certificates", '0');
      }
      try {
        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("requester_folio").value
        );
        if (response.status === 200) {
          const activeCertificates = response.data.data.filter((item) => {
            if(item.status=='ACTIVE'){
            return item;
            }
          })
          setCertificates(activeCertificates);
          // setCertificates(activeCertificates.map((item) => {
          //   return {label: item.certificate_no,
          //   value: item.certificate_no}
          // }))
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
    if (!!watch("requester_folio")?.value) getAllShareCertificates();
  }, [watch("requester_folio")]);
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
                    <label htmlFor="company_code">Company </label>
                    <Controller
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
                  {/* Folio Number */}
                  <div className="form-group my-2">
                    <label htmlFor="requester_folio">Folio No</label>
                    <Controller
                      name="requester_folio"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={inactive_shareholders_data_loading}
                          options={folio_options}
                          ref={requester_ref}
                          id="requester_folio"
                          placeholder={
                            // !watch("company_code")?.value
                            !selectedCompany
                              ? "Select Company First"
                              : "Select Folio Number"
                          }
                          styles={errors.requester_folio && errorStyles}
                          // isDisabled={!watch("company_code")?.value}
                          isDisabled={!selectedCompany}

                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.requester_folio?.message}
                    </small>
                  </div>
                  {/* Name */}
                  <div className="form-group my-2">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="form-control"
                      name="name"
                      id="name"
                      value={
                        inactive_shareholders_data.find(
                          (hold) =>
                            hold.folio_number ===
                            watch("requester_folio")?.value
                        )?.shareholder_name
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
                      value="Duplicate Shares"
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
                      // defaultValue={getvalidDateYMD(new Date())}
                    />
                    <small className="text-danger">
                      {errors.execution_date?.message}
                    </small>
                  </div>
                  {/* Requester Folio */}
                  {/* <div className="form-group my-2">
                        <label htmlFor="folio_number">Folio Number </label>
                        <Controller
                          name="folio_number"
                          render={({ field }) => (
                            <Select
                              {...field}
                              isLoading={folio_options.length === 0}
                              options={folio_options}
                              id="folio_number"
                              placeholder="Select Folio Number"
                              styles={errors.folio_number && errorStyles}
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.folio_number?.message}
                        </small>
                      </div> */}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-lg-4 col-md-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Duplicates</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="no_of_certificates">
                      No of Certificate
                    </label>
                    <Controller
                      name="no_of_certificates"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.no_of_certificates && "border border-danger"
                          }`}
                          id="no_of_certificates"
                          allowNegative={false}
                          placeholder="Enter Quantity"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_of_certificates?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    {df_snum !== "" && (
                      <div
                        className="alert alert-warning dark fade show"
                        target="Alert-8"
                        role="alert"
                      >
                        <b>{`The last alloted certificate no  was ${df_snum} with distinctive counter ${distinctiveCounter}`}</b>
                      </div>
                    )}
                  </div>
                  <div className="form-group my-2">
                    {!!watch("requester_folio")?.value && (
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
                </div>
              </div>
            </div>
          </div>

          <div className="row my-2">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>
                    <b>Input Certificate</b>
                  </h5>
                </div>
                <div className="card-body">
                  <div className="w-100">
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
                        {input_fields.map((item, index) => (
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
                                  errors.input_certificates?.[index]
                                    ?.certificate_no?.message
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
                              {watch(
                                `input_certificates[${index}]certificate_no`
                              ) ? (
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
                              {watch(
                                `input_certificates[${index}]certificate_no`
                              ) ? (
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
                                startCalculation={startInputCalculation}
                                calculated={startcalculation}
                                setSelectedCerts={setSelectedCerts}
                                selectedCerts={selectedCerts}
                                num={
                                  parseInt(watch("no_of_certificates")) + index
                                }
                              />
                            )
                          )} */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row my-2">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>
                    <b>Output Certificate</b>
                  </h5>
                </div>
                <div className="card-body">
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
                        {output_fields.map((item, index) => (
                          <tr key={item.id}>
                            <td>
                              <input
                                name={`output_certificates[${index}]certificate_no`}
                                placeholder="Enter Cert No"
                                type="number"
                                className={`form-control ${
                                  errors.output_certificates?.[index]
                                    ?.certificate_no && "border border-danger"
                                }`}
                                {...register(
                                  `output_certificates.${index}.certificate_no`
                                )}
                              />
                              <small className="text-danger">
                                {
                                  errors.output_certificates?.[index]
                                    ?.certificate_no?.message
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
                              {watch(
                                `input_certificates[${index}]certificate_no`
                              ) ? (
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
                              {watch(
                                `input_certificates[${index}]certificate_no`
                              ) ? (
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
                        ))}{" "}
                        {/* {selectedCerts.length <= 20 &&
                          selectedCerts.map((cert, index) => (
                            <ViewSplitShareCertificateItem
                              startCalculation={startOutputCalculation}
                              calculated={startcalculation}
                              num={
                                parseInt(watch("no_of_certificates")) + index
                              }
                              distinctive_no={JSON.parse(
                                certificates.find(
                                  (cer) => cer.certificate_no === cert
                                )?.distinctive_no
                              )}
                              df_noOfShares={
                                certificates.find(
                                  (cer) => cer.certificate_no === cert
                                )?.shares_count
                              }
                            />
                          ))} */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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

export default DuplicateShareCertificate;
