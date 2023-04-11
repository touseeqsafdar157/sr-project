import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  folio_setter,
  company_setter,
  certificate_setter,
} from "../../../../store/services/dropdown.service";
import Breadcrumb from "../../../common/breadcrumb";
import { addSplitShareSchema } from "../../../../store/validations/splitShareValidation";
import { getShareHoldersByShareholderID } from "../../../../store/services/shareholder.service";
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
  addInvestorRequestCEL,
  addInvestorRequestSPL,
} from "../../../../store/services/investor.service";
import { getCompanies } from "../../../../store/services/company.service";
import { getShareholders } from "store/services/shareholder.service"
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import { addPhysicalToElectronicSchema } from "../../../../store/validations/physicalToElectronicValidation";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import { getCompanyById } from "../../../../store/services/company.service";
const PhysicalToElectronic = ({ setInvestorRequestForm, selectedCompany, companyName }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  // Refs
  const requester_ref = useRef(null);
  const to_folio_ref = useRef(null);
  // States
  const [loading, setLoading] = useState(false);
  const [toFolioLoading, setToFolioLoading] = useState(false);
  const [fromFolioLoading, setFromFolioLoading] = useState(false);
  const [to_folio_options, setTo_folio_options] = useState([]);
  const [folio_options, setFolio_options] = useState([]);

  const [company_options, setCompany_options] = useState([]);
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesDropdown, setCertificatesDropdown] = useState([]);
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [companies_selector, setCompanies_selector] = useState([]);
  const [shareholders, setAllShareholders] = useState([]);
  const [isLoadingShareholder, setIsLoadingShareholder] = useState(false);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({ resolver: yupResolver(addPhysicalToElectronicSchema) });
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

  const getSelectedCompanyInfo = async () => {
    try {
      const response = await getCompanyById(baseEmail, selectedCompany);
      if (response.status === 200) {
        const parents = response.data.data;
        console.log("By Id => ", parents)
                setCompanies_selector(parents);
      }
    } catch (error) {
      toast.error("Error fetching company info")
    }
  }
  const getShareHoldersByCompanyCode = async () => {
    setIsLoadingShareholder(true);
    try {
      const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
      if (response.status === 200) {
        const parents = response.data.data;
        setAllShareholders(parents)
        // folio_number_ref.current.clearValue();
        // setValue("split_parts", "0");
        const options = parents
          .filter((item) => item.cdc_key === "NO")
          .map((item) => {
            let label = `${item.folio_number} (${item.shareholder_name}) `;
            return { label: label, value: item.folio_number };
          });


        setFolio_options(options);
        setIsLoadingShareholder(false);
      }
    } catch (error) {
      setIsLoadingShareholder(false);
      toast.error("Error fetching shareholders")
    }
  };
  useEffect(() => {
      getSelectedCompanyInfo()
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
    const getSharesCount = () => {
      setTotalSharesCount(
        certificateObjects
          .map((obj) => parseInt(obj.shares_count.replace(/,/g, "")) || 0)
          .reduce((prev, curr) => prev + curr, 0)
      );
    };
    if (startcalculation) getSharesCount();
  }, [startcalculation]);

  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };

  // useEffect(() => {
  //   const getAllCompanies = async () => {
  //     setCompanies_data_loading(true);
  //     try {
  //       const response = await getCompanies(baseEmail);
  //       setCompanies_selector(response.data.data);
  //       const companies_dropdowns = response.data.data.map((item) => {
  //         let label = `${item.code} - ${item.company_name}`;
  //         return { label: label, value: item.code };
  //       });
  //       setCompanies_dropdown(companies_dropdowns);
  //       setCompanies_data_loading(false);
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : toast.error("Companies Not Found");
  //         setCompanies_data_loading(false);
  //     }
  //   };
  //   const getAllShareHolders = async () => {
  //     setIsLoadingShareholder(true);
  //     try{
  //     const response = await getShareholders(baseEmail)
  //     if (response.status===200) {
  //           const parents = response.data.data
  //           setAllShareholders(parents)
  //           setIsLoadingShareholder(false)
  //     } }catch(error) {
  //       setIsLoadingShareholder(false);
  //     }
  //     };
  //   getAllCompanies();
  //   getAllShareHolders();
  // }, []);
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
            if(item.status=='ACTIVE'){
              return item;
            }
          })
          setCertificates(activeCertificates);

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

    // const getShareholders = () => {
    //   // const investor_id = shareholders.shareholders_data.find(
    //   //   (holding) => holding?.folio_number === watch("requester_folio").value
    //   // )?.shareholder_id;
    //   // const to_folios = shareholders.inactive_shareholders_data
    //   const to_folios = shareholders
    //     .filter((h) => h.cdc_key === "YES")
    //     .filter(
    //       (holder) => holder.company_code === watch("company_code")?.value
    //     )
    //     .map((item) => {
    //       let label = `${item.folio_number} (${item.shareholder_name}) `;
    //       return { label: label, value: item.folio_number };
    //     });
    //   if (to_folios.length === 0) {
    //     setTo_folio_options(
    //       // shareholders.inactive_shareholders_data
    //       shareholders
    //         .filter(
    //           (holder) =>
    //             holder.folio_number === `${watch("company_code")?.value}-0`
    //         )
    //         .map((item) => {
    //           let label = `${item.folio_number} (${item.shareholder_name}) `;
    //           return { label: label, value: item.folio_number };
    //         })
    //     );
    //   } else {
    //     setTo_folio_options(to_folios);
    //   }
    // };

    const getShareholders = async () => {
      try {
        setToFolioLoading(true);
        const investor_id = shareholders.find(
          (holding) => holding?.folio_number === watch("requester_folio").value
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
                    holder.folio_number === `${selectedCompany}-0`
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

    if (!!watch("requester_folio")?.value) {
      to_folio_ref.current.clearValue();
      getAllShareCertificates();
      getShareholders();
    }
  }, [watch("requester_folio")]);
  // useEffect(() => {
  //   const getShareHolders = () => {
  //     // const options = shareholders.shareholders_data
  //     const options = shareholders
  //       .filter((data) => data.company_code === watch("company_code")?.value)
  //       .filter((item) => item.cdc_key === "NO")
  //       .map((item) => {
  //         let label = `${item.folio_number} (${item.shareholder_name}) `;
  //         return { label: label, value: item.folio_number };
  //       });
  //     setFolio_options(options);
  //   };
  //   if (!!watch("company_code")?.value) {
  //     requester_ref.current.clearValue();
  //     to_folio_ref.current.clearValue();
  //     getShareHolders();
  //   }
  // }, [watch("company_code"), shareholders]);

  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    const updated_input_certificate = data.input_certificates.map((cert) => ({
      ...certificates.find(
        (item) => item.certificate_no === cert.certificate_no?.value
      ),
    }));
    try {
      setLoading(true);
      const response = await addInvestorRequestCEL(
        email,
        "CEL", //   Type of Request
        data.requester_folio.value,
        data.to_folio.value,
        selectedCompany,
        // data.company_code.value,
        // companies_dropdown.find(
        //   (item) => item.company_code === data.company_code.value
        // )?.symbol, //    Symbol
        companies_selector?.symbol, // Symbol
        totalSharesCount.toString(),
        updated_input_certificate,
        data.remarks,
        data.reference,
        data.transfer_no,
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
                      render={({ field, value }) => (
                        <Select
                          {...field}
                          // isLoading={companies_data_loading}
                          options={companies_dropdown}
                          id="company_code"
                          placeholder={`${selectedCompany} - ${companyName}`}
                          value={value}
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
                      value="Physical To Electronic"
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
                    />
                    <small className="text-danger">
                      {errors.execution_date?.message}
                    </small>
                  </div>
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
                            !selectedCompany
                              ? "Select Company First"
                              : "Select Folio Number"
                          }
                          isDisabled={!selectedCompany}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.requester_folio?.message}
                    </small>
                  </div>
                  {/* Transfer To Folio */}
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
                            !selectedCompany
                              ? "Select Company First"
                              : "Select Folio Number"
                          }
                          isDisabled={!selectedCompany}
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
                          className={`form-control ${
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
                      className={`form-control text-right`}
                      id="no_of_shares"
                      value={totalSharesCount}
                      decimalScale={2}
                      placeholder="Enter Number"
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
                    <label>Reference No</label>
                    <Controller
                      name="reference"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.reference && "border-danger"
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

export default PhysicalToElectronic;
