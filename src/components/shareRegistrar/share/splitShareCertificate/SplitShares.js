import React, { useState, useEffect, Fragment, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import { getCertificateNo, getCompanyById } from "../../../../store/services/company.service";
import Breadcrumb from "../../../common/breadcrumb";
import { addSplitShareSchema } from "../../../../store/validations/splitShareValidation";
import {
  getvalidDateYMD,
  IsJsonString,
} from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import { addInvestorRequestSPL } from "../../../../store/services/investor.service";
import {
  getShareCertificatesByFolio,
  getShareCertificatesByNumber,
} from "../../../../store/services/shareCertificate.service";
import {
  getCompanies,
} from "../../../../store/services/company.service";
import { getShareholders } from "store/services/shareholder.service"
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import DistinctiveCounterItem from "../../share-certificate/distinctiveCounterItem";

const SplitShares = ({ setInvestorRequestForm, selectedCompany, companyName }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  // States
  const dispatch = useDispatch();
  // Ref
  const requester_ref = useRef(null);
  const folio_number_ref = useRef(null);
  const certificate_ref = useRef(null);
  // Selector ENDS
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [df_snum, setDf_snum] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [folio_options, setFolio_options] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [startcalculation, setStartcalculation] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [companies_selector, setCompanies_selector] = useState([]);
  const [shareholders, setAllShareholders] = useState([]);
  const [isLoadingShareholder, setIsLoadingShareholder] = useState(false);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(addSplitShareSchema) });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({ control, name: "output_certificates" });

  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };
  // useEffect(() => {
  //   const getAllCompanies = async () => {
  //     try {
  //       const response = await getCompanies(baseEmail);
  //       setCompanies_selector(response.data.data);
  //       const companies_dropdowns = response.data.data.map((item) => {
  //         let label = `${item.code} - ${item.company_name}`;
  //         return { label: label, value: item.code };
  //       });
  //       setCompanies_dropdown(companies_dropdowns);
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : toast.error("Companies Not Found");
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
  //   // getAllShareHolders();
  // }, []);
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
    const getAllShareCertificates = async () => {
      try {
        setCertificatesLoading(true);
        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("folio_no").value
        );
        if (response.status === 200) {
          
           let activeCertifcates = response.data.data.filter((cert) => {
              if(cert.status=='ACTIVE'){
              return cert;
              }
            })
          
          setCertificates(activeCertifcates.map((item)=>{
            return {label: item.certificate_no,
              value: item.certificate_no}
          }));
          setCertificatesLoading(false);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Certificates Not Found");
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

  const getShareHoldersByCompanyCode = async () => {
    setIsLoadingShareholder(true);
    try {
      const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
      if (response.status === 200) {
        const parents = response.data.data;
        setAllShareholders(parents)
        folio_number_ref.current.clearValue();
        setValue("split_parts", "0");
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
    const getCompanyCertificateNo = async () => {
      try {
        const response = await getCertificateNo(
          baseEmail,
          // watch("company_code")?.value
          selectedCompany,
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
    if (!!selectedCompany) {
      // folio_number_ref.current.clearValue();
      // setValue("split_parts", "0");
      // const options = shareholders
      //   .filter((data) => data.company_code === watch("company_code")?.value)
      //   .filter((item) => item.cdc_key === "NO")
      //   .map((item) => {
      //     let label = `${item.folio_number} (${item.shareholder_name}) `;
      //     return { label: label, value: item.folio_number };
      //   });
      // setFolio_options(options);
      getCompanyCertificateNo();
    }
  }, [])
  // , shareholders.inactive_shareholders_data_loading]);

  useEffect(() => {
    if (!isNaN(parseInt(watch("split_parts"))) && watch("split_parts") <= 20) {
      const newVal = parseInt(watch("split_parts") || 0);
      const oldVal = fields.length;
      if (newVal > oldVal) {
        // append certificates to field array
        for (let i = oldVal; i < newVal; i++) {
          append({ certificate_no: "", shares_count: "", from: "", to: "" });
        }
      } else {
        // remove certificates from field array
        for (let i = oldVal; i > newVal; i--) {
          remove(i - 1);
        }
      }
    }
  }, [watch("split_parts")]);


  const handleAddInvestorRequest = async (data) => {
    console.log("Submit Data => ", data);
    const updated_output_certificates = data.output_certificates.map(
      (item) => ({
        distinctive_no: [
          { from: item.from, to: item.to, count: item.to - item.from + 1 },
        ],
        ...item,
      })
    );
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addInvestorRequestSPL(
        email,
        "SPL",
        data.folio_no.value, // TO
        // data.company_code.value,
        selectedCompany,
        // companies_selector.find(
        //   (item) => item.code === data.company_code?.value
        // )?.symbol, // Symbol
        companies_selector?.symbol, // Symbol
        data.split_parts, // Quantity
        "", // Amount Paid
        [certificate], // Input Certicates
        updated_output_certificates, // Output Certificates
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
                      defaultValue={selectedCompany}
                      render={({ field, value }) => (
                        <Select
                          {...field}
                          // defaultValue={selectedCompany}
                          // isLoading={
                          //   companies_dropdown.length === 0
                          // }
                          // options={companies_dropdown}
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
                        shareholders && shareholders.length !== 0
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
                      value="Split of Shares"
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
                  <div className="form-group my-2">
                    {watch("folio_no")?.value && (
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
                  <h5>Split Of Shares</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="certificate_no">Certificate No</label>
                    <Controller
                      name="certificate_no"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={!certificates.length}
                          options={certificates}
                          id="certificate_no"
                          styles={errors.certificate_no && errorStyles}
                          ref={certificate_ref}
                          placeholder={
                            !watch("folio_no")?.value ||
                            certificates.length === 0
                              ? "Select Folio Having Certificates"
                              : "Select Certificate"
                          }
                          isDisabled={!watch("folio_no")?.value}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.certificate_no?.message}
                    </small>
                  </div>
                  {/* Shares */}
                  <div className="form-group my-2">
                    <label htmlFor="shares">Shares</label>
                    <NumberFormat
                      className="form-control text-right"
                      id="shares"
                      decimalScale={2}
                      placeholder="Enter Number"
                      value={!!certificate && certificate?.shares_count}
                      readOnly
                    />
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <label htmlFor="distinctive_from">Distinctive From</label>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <label htmlFor="distinctive_to">Distinctive To</label>
                    </div>
                  </div>
                  {!!certificate?.distinctive_no &&
                    !isNaN(JSON.parse(certificate.distinctive_no)?.length) &&
                    JSON.parse(certificate.distinctive_no).map((item) => (
                      <DistinctiveCounterItem
                        calculatedCounter={() => {}}
                        J
                        calculated={true}
                        from={item.from}
                        to={item.to}
                      />
                    ))}
                  {/* Split Parts */}
                  <div className="form-group my-2">
                    <label htmlFor="split_parts">Split Parts</label>
                    <Controller
                      name="split_parts"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.split_parts && "border border-danger"
                          }`}
                          id="split_parts"
                          allowNegative={false}
                          placeholder="Enter Quantity"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.split_parts?.message}
                    </small>
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
                  </tr>
                </thead>
                <tbody>
                  {fields.map((item, index) => (
                    <SplitShareCertificateItem
                      key={item.id}
                      // Validation
                      register={register}
                      index={index}
                      errors={errors}
                      setValue={setValue}
                      watch={watch}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row px-2 my-2">
            <button
              type="submit"
              className="btn btn-primary"
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
                <span>{"Submit"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default SplitShares;
