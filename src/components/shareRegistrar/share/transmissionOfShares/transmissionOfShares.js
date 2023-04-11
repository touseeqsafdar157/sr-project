import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { getShareholders } from "store/services/shareholder.service"
import SplitShareCertificateItem from "../SplitShareCertificateItem";
import { useSelector } from "react-redux";
import {
  folio_setter,
  company_setter,
  certificate_setter,
} from "../../../../store/services/dropdown.service";
import { getCertificateNo } from "../../../../store/services/company.service";
import {
  getvalidDateYMD,
  IsJsonString,
} from "../../../../utilities/utilityFunctions";
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
import 
  {getCompanies} from "../../../../store/services/company.service";
import { getCompanyById } from "../../../../store/services/company.service";
const TransmissionOfShares = ({ setInvestorRequestForm, selectedCompany, companyName }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  // States
  // Ref
  const requester_ref = useRef(null);
  const folio_number_ref = useRef(null);
  const certificate_ref = useRef(null);
  // Selector ENDS
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesDropdown, setCertificatesDropdown] = useState([]);
  const [loading, setLoading] = useState(false);
  const [df_snum, setDf_snum] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [startcalculation, setStartcalculation] = useState(false);
  const [totalSharesCount, setTotalSharesCount] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [shareholders_data_loading, setShareholders_data_loading] = useState(false);
  const [shareholders, setShareholders] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companies_data_loading , setCompanies_data_loading] = useState(false);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_selector, setCompanies_selector] = useState([]);

  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(addTransmissionOfSharesSchema) });
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
  // useEffect(() => {
  //   const getAllCompanies = async () => {
  //     setCompanies_data_loading(true);
  //     try {
  //       const response = await getCompanies(baseEmail);
  //       setCompanies(response.data.data);
  //       const companies_dropdowns = response.data.data.map((item) => {
  //         let label = `${item.code} - ${item.company_name}`;
  //         return { label: label, value: item.code };
  //       });
  //       setCompanies_dropdown(companies_dropdowns);
  //       setCompanies_data_loading(false);
  //     } catch (error) {
  //         !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : toast.error("Companies Not Found");
  //         setCompanies_data_loading(false);
  //     }
  //   };
  //   const getAllShareHolders = async () => {
  //     setShareholders_data_loading(true);
  //     try{
  //     const response = await getShareholders(baseEmail)
  //     if (response.status===200) {
  //           const parents = response.data.data
  //           setShareholders(parents)
  //           setShareholders_data_loading(false)
  //     } }catch(error) {
  //       setShareholders_data_loading(false);
  //     }
  //     };
  //     getAllCompanies();
  //     getAllShareHolders();
  // }, [])
  useEffect(() => {
    if (
      !isNaN(parseInt(watch("certificates"))) &&
      watch("certificates") <= 20
    ) {
      const newVal = parseInt(watch("certificates") || 0);
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
  }, [watch("certificates")]);

  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    console.log(certificate);
    setCertificateObjects(newArray);
  };
  useEffect(async () => {
    try {
      setCertificate_options(await certificate_setter());
    } catch (err) {
      !!err?.response?.data?.message
        ? toast.error(err?.response?.data?.message)
        : toast.error("Options Not Found");
    }
  }, []);
  useEffect(() => {
    const getAllShareCertificates = async () => {
      try {
        setCertificatesLoading(true);
        if (watch('certificates') !== undefined) {
          setValue("certificates", '0');
        }
        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("folio_no").value
        );
        if (response.status === 200) {
          const activeCertificates = response.data.data.filter((item) => {
            if(item.status=='ACTIVE'){
            return {label: item.certificate_no,
            value: item.certificate_no}
            }
          })
          setCertificates(activeCertificates);
          // setCertificates(response.data.data.filter((item) => {
          //   if(item.status=='ACTIVE'){
          //   return {label: item.certificate_no,
          //   value: item.certificate_no}
          //   }
          // }));
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
    if (!!watch("folio_no")?.value) {
      getAllShareCertificates();
    }
  }, [watch("folio_no")]);
  useEffect(() => {
    const getShareCertificate = async () => {
      try {
        const response = await getShareCertificatesByNumber(
          baseEmail,
          watch("certificate_no")?.value
        );
        if (response.status === 200) {
          setCertificate(response.data.data);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Certificate Not Found");
      }
    };
    if (!!watch("certificate_no")?.value) getShareCertificate();
  }, [watch("certificate_no")]);
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
  useEffect(() => {
    // const getCompanyCertificateNo = async () => {
    //   try {
    //     const response = await getCertificateNo(
    //       baseEmail,
    //       watch("company_code")?.value
    //     );
    //     if (response.status === 200) {
    //       setDf_snum(response.data.data[0].shares_counter);
    //       setDistinctiveCounter(response.data.data[0].distinctive_no_counter);
    //     }
    //   } catch (error) {
    //     !!error?.response?.data?.message
    //       ? toast.error(error?.response?.data?.message)
    //       : console.log("Certificate No Not Found");
    //   }
    // };
    const getShareHolders = async () => {
      try {
        const response = await getShareHoldersByCompany(
          baseEmail,
        selectedCompany
        );
        if (response.status === 200) {
          console.log('v', response.data.data)
          let options = response.data.data?.filter((h) => h.cdc_key === "NO")?.map((item) => {
            let label = `${item.folio_number} (${item.shareholder_name}) `;
            return { label: label, value: item.folio_number };
          });
          setShareholders(response.data.data)
          setFolio_options(options);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Folios Not Found");
      }
    };
    if (selectedCompany) {
      folio_number_ref.current.clearValue();
      getShareHolders();
      getSelectedCompanyInfo()
      // getCompanyCertificateNo();
    }
  }, []);

  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    const updated_input_certificates = data.input_certificates.map((cert) => ({
      ...certificates.find(
        (item) => item.certificate_no === cert.certificate_no?.value
      ),
      folio_number: cert.folio_number.value,
    }));
    try {
      setLoading(true);
      const response = await addInvestorRequestTRS(
        email,
        "TRS",
        data.folio_no.value, // TO
        // data.company_code.value,
        selectedCompany,
        // companies.find(
        //   (comp) => comp.code === data.company_code
        // )?.symbol, // Symbol
        companies_selector?.symbol, // Symbol
        totalSharesCount.toString(), // Quantity
        "", // Amount Paid
        updated_input_certificates, // Input Certicates
        [],
        data.remarks,
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
                      render={({ field, value }) => (
                        <Select
                          {...field}
                          // isLoading={
                          //   companies_dropdown.length === 0
                          // }
                          // options={companies_dropdown}
                          id="company_code"
                          placeholder={`${selectedCompany} - ${companyName}`}
                          styles={errors.company_code && errorStyles}
                          value={value}
                          isDisabled={true}
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
                    <label htmlFor="folio_no">Folio Number </label>
                    <Controller
                      name="folio_no"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={folio_options.length === 0}
                          options={folio_options}
                          id="folio_no"
                          styles={errors.folio_no && errorStyles}
                          ref={folio_number_ref}
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
                      {errors.folio_no?.message}
                    </small>
                  </div>
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
                        shareholders.length !== 0
                          ? shareholders.find(
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
                      value="Transmission Of Shares"
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
                    <label htmlFor="certificates">Certificates</label>
                    <Controller
                      name="certificates"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.certificates && "border border-danger"
                          }`}
                          id="certificates"
                          allowNegative={false}
                          placeholder="Enter Certificates"
                          isDisabled={!!watch("folio_no")?.value}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.quantity?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shares_count">Total Shares Count</label>
                    <input
                      type="text"
                      className="form-control text-right"
                      name="shares_count"
                      id="shares_count"
                      placeholder="Total Shares Count"
                      value={totalSharesCount}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    {!!watch("folio_no")?.value && (
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
            <div className="w-100">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-nowrap">Certificate No.</th>
                    <th className="text-nowrap text-right">No of Shares</th>
                    <th className="text-nowrap">Distinctive No. From</th>
                    <th className="text-nowrap">Distinctive To</th>
                    <th className="text-nowrap">Transfer To</th>
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
                      <td>
                        <Controller
                          name={`input_certificates.${index}.folio_number`}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={folio_options}
                              id={`input_certificates.${index}.folio_number`}
                              placeholder="Select Folio Number"
                              styles={
                                errors.input_certificates?.[index]
                                  ?.folio_number && errorStyles
                              }
                            />
                          )}
                          control={control}
                        />
                      </td>
                    </tr>
                  ))}
                  {/* {!isNaN(parseInt(watch("certificates"))) &&
                    watch("certificates") <= 20 &&
                    [...Array(parseInt(watch("certificates")))].map(
                      (cert, index) => (
                        <TransmissionOfSharesItem
                          certificates={certificates}
                          folios={folio_options}
                          startCalculation={startCalculation}
                          calculated={startcalculation}
                          num={parseInt(watch("certificates")) + index}
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

export default TransmissionOfShares;
