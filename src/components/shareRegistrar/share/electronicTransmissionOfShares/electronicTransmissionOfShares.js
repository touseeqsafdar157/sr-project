import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { getShareholders } from "store/services/shareholder.service"
import {
  getCompanies,
} from "../../../../store/services/company.service";
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
import { addElectronicTransmissionOfSharesSchema } from "store/validations/electronicTransmissionOfShareValidation";
import { getCompanyById } from "../../../../store/services/company.service";

const ElectronicTransmissionOfShares = ({ setInvestorRequestForm, selectedCompany, companyName }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  // States
  // Ref
  const requester_ref = useRef(null);
  const folio_number_ref = useRef(null);
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
  const [companies_data, setCompanies_data] = useState([])
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [shareholders_data, setShareholders_data] = useState([])
  const [shareholders_data_loading, setShareholders_data_loading] = useState(false);
  const [companies_selector, setCompanies_selector] = useState([]);

  const [inactive_shareholders_data_loading, setInactive_shareholders_data_loading] = useState(false);
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(addElectronicTransmissionOfSharesSchema),
  });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({ control, name: "input_certificates" });
    // useEffect(() => {
    //   const getAllCompanies = async () => {
    //     setCompanies_data_loading(true);
    //     try{
    //     const response = await getCompanies(baseEmail)
    //     if (response.status===200) {
    //           const parents = response.data.data
    //           setCompanies_data(parents)
    //           setCompanies_data_loading(false)
    //     } }catch(error) {
    //       setCompanies_data_loading(false);
    //     }
    //     };
    //     const getAllShareHolders = async () => {
    //       setInactive_shareholders_data_loading(true);
    //       setShareholders_data_loading(true);
    //       try{
    //       const response = await getShareholders(baseEmail)
    //       if (response.status===200) {
    //             const parents = response.data.data
    //             setShareholders_data(parents)
    //             setShareholders_data_loading(false)
    //             setInactive_shareholders_data_loading(false);
    //       } }catch(error) {
    //         setShareholders_data_loading(false);
    //         setInactive_shareholders_data_loading(false);
    //       }
    //       };
    //     getAllCompanies();
    //     getAllShareHolders()
    // }, [])
    const getShareHoldersByCompanyCode = async () => {
      setShareholders_data_loading(true);
      setInactive_shareholders_data_loading(true);
      try {
        const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
        if (response.status === 200) {
          const parents = response.data.data;
          setShareholders_data(parents)
          // folio_number_ref.current.clearValue();
          // setValue("split_parts", "0");
          const options = parents
            .filter((item) => item.cdc_key === "NO")
            .map((item) => {
              let label = `${item.folio_number} (${item.shareholder_name}) `;
              return { label: label, value: item.folio_number };
            });
  
  
          setFolio_options(options);
          setShareholders_data_loading(false);
          setInactive_shareholders_data_loading(false);
        }
      } catch (error) {
        setShareholders_data_loading(false);
        setInactive_shareholders_data_loading(false);
        toast.error("Error fetching shareholders")
      }
    };
  
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
        getSelectedCompanyInfo()
        getShareHoldersByCompanyCode()
    }, [])
  useEffect(() => {
    if (!isNaN(parseInt(watch("transferees"))) && watch("transferees") <= 20) {
      const newVal = parseInt(watch("transferees") || 0);
      const oldVal = fields.length;
      if (newVal > oldVal) {
        // append certificates to field array
        for (let i = oldVal; i < newVal; i++) {
          append({ shares_count: "", folio_number: null });
        }
      } else {
        // remove certificates from field array
        for (let i = oldVal; i > newVal; i--) {
          remove(i - 1);
        }
      }
    }
  }, [watch("transferees")]);

  useEffect(() => {
    let updated_input_certificate;
    const checkAllCertificates = watch("input_certificates").length > 0;

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
          ...cert,
        };
      });
      getSharesCount();
    }
  }, [JSON.stringify(watch(`input_certificates`))]);
  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };

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
    if (selectedCompany) {
      folio_number_ref.current.clearValue();
      const options = shareholders_data
        .filter((data) => data.company_code === selectedCompany)
        .filter((item) => item.cdc_key === "YES")
        .map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.folio_number };
        });
      const inactive_options = shareholders_data
        .filter((data) => data.company_code === selectedCompany)
        .filter((item) => item.cdc_key === "YES")
        .map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.folio_number };
        });
      setInactive_folio_options(inactive_options);
      setFolio_options(options);
    }
  }, [shareholders_data]);

  const handleAddInvestorRequest = async (data) => {
    const updated_input_certificate = data.input_certificates.map((cert) => ({
      ...cert,
      folio_number: cert.folio_number?.value,
    }));
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addInvestorRequestTRS(
        email,
        "ETRS",
        data.folio_no.value, // TO
        // data.company_code.value,
        selectedCompany,
        // companies_data.find((comp) => comp.code === data.company_code)?.symbol, // Symbol
        companies_selector?.symbol, // Symbol
        totalSharesCount.toString(), // Quantity
        "", // Amount Paid
        updated_input_certificate, // Input Certicates
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
                          // isLoading={companies_data_loading}
                          // options={companies_data
                          //   .filter((item) => item.company_type === "Private")
                          //   .map((item) => {
                          //     let label = `${item.code} - ${item.company_name}`;
                          //     return { label: label, value: item.code };
                          //   })}
                          id="company_code"
                          placeholder={`${selectedCompany} - ${companyName}`}
                          isDisabled={true}
                          value={value}
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
                          readOnly={!watch("folio_no")?.value}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.transferees?.message}
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
                    {!!shareholderShares && (
                      <div
                        className="alert alert-warning dark fade show"
                        target="Alert-8"
                        role="alert"
                      >
                        <b>{`Shareholder has ${shareholderShares} electronic shares `}</b>
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
                    <th className="text-nowrap">No</th>
                    <th className="text-nowrap">Transfer To</th>
                    <th className="text-nowrap">No of Shares</th>
                  </tr>
                </thead>

                <tbody>
                  {fields.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>
                        <Controller
                          name={`input_certificates.${index}.folio_number`}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isLoading={inactive_shareholders_data_loading}
                              options={inactive_folio_options}
                              id={`input_certificates.${index}.folio_number`}
                              placeholder="Select Folio"
                              styles={
                                errors.input_certificates?.[index]
                                  ?.folio_number && errorStyles
                              }
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {
                            errors.input_certificates?.[index]?.folio_number
                              ?.message
                          }
                        </small>
                      </td>
                      <td>
                        <input
                          name={`input_certificates[${index}]shares_count`}
                          placeholder="Enter Share Count"
                          type="number"
                          className={`form-control ${
                            errors.input_certificates?.[index]?.shares_count &&
                            "border border-danger"
                          }`}
                          {...register(
                            `input_certificates.${index}.shares_count`
                          )}
                        />
                        <small className="text-danger">
                          {
                            errors.input_certificates?.[index]?.shares_count
                              ?.message
                          }
                        </small>
                      </td>
                    </tr>
                  ))}
                  {/* {!isNaN(parseInt(watch("transferees"))) &&
                    watch("transferees") <= 20 &&
                    [...Array(parseInt(watch("transferees")))].map(
                      (cert, index) => (
                        <ElectronicTransmissionOfSharesItem
                          key={index}
                          folios={inactive_folio_options}
                          startCalculation={startCalculation}
                          calculated={startcalculation}
                          num={index + 1}
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

export default ElectronicTransmissionOfShares;
