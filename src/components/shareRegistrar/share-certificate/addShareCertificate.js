import React, { Fragment, useState, useEffect } from "react";
import {
  getCertificateNo,
  getCompanies,
} from "../../../store/services/company.service";
import {
  addCertificate,
  getShareCounter,
  sendIssuanceCertificate,
} from "../../../store/services/shareCertificate.service";
import { getvalidDateYMD } from "../../../utilities/utilityFunctions";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller,useFieldArray } from "react-hook-form";
import NumberFormat from "react-number-format";
import { yupResolver } from "@hookform/resolvers/yup";
import CertificateItem from "./certificateItem";
import { toast } from "react-toastify";
import { addShareCertificateSchema } from "../../../store/validations/shareCertificateValidation";
import { getShareHoldersByCompany } from "../../../store/services/shareholder.service";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_SHARE_CERTIFICATES,
  WATCH_TRANSACTION_REQUEST,
} from "../../../redux/actionTypes";
import SplitShareCertificateItem from "../share/SplitShareCertificateItem";

export default function AddShareCertificate({ setViewAddPage }) {
  // const dispatch = useDispatch();
  // const [df_snum, setDf_snum] = useState("");;
  // const [distinctiveCounter, setDistinctiveCounter] = useState("");
  // const [folio_options, setFolio_options] = useState([]);
  // const [toValue, setToValue] = useState("");
  // const [fromValue, setFromValue] = useState("");
  // const [totalSharesCount, setTotalSharesCount] = useState("0");
  // const [certificateObjects, setCertificateObjects] = useState([]);
  // const [companies, setCompanies_data] = useState([]);
  // const [companies_dropdown, setCompanies_dropdown] = useState([]);
  // const [companies_data_loading, setCompanies_data_loading] = useState(false);
  // // React Select Styles
  // const appliedStyles = {
  //   control: (base, state) => ({
  //     ...base,
  //     border: "1px solid red",
  //   }),
  // };
  // // Yup Validation
  // // Validation Declarations
  // const {
  //   register,
  //   watch,
  //   formState: { errors },
  //   handleSubmit,
  //   control,
  // } = useForm({ resolver: yupResolver(addShareCertificateSchema) });
  // // Create button loader
  // const baseEmail = sessionStorage.getItem("email") || "";
  // const [startcalculation, setStartCalculation] = useState(false);
  // const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   const getAllCompanies = async () => {
  //     setCompanies_data_loading(true);
  //     try{
  //     const response = await getCompanies(baseEmail)
  //     if (response.status===200) {
  //           const parents = response.data.data
  //           const companies_dropdowns = response.data.data.map((item) => {
  //             let label = `${item.code} - ${item.company_name}`;
  //             return { label: label, value: item.code };
  //           });
  //         setCompanies_dropdown(companies_dropdowns);
  //           setCompanies_data(parents)
  //           setCompanies_data_loading(false);
  //     } }catch(error) {
  //       setCompanies_data_loading(false);
  //     }
  //     };
  //     getAllCompanies();

  // }, [])

  // useEffect(() => {
  //   const getSharesCount = () => {
  //     setTotalSharesCount(
  //       certificateObjects
  //         .map((obj) => parseInt(obj.shares_count.replace(/,/g, "")) || 0)
  //         .reduce((prev, curr) => prev + curr, 0)
  //     );
  //   };
  //   if (startcalculation) getSharesCount();
  // }, [startcalculation]);

  // // load companies
  // useEffect(() => {
  //   const email = sessionStorage.getItem("email");
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
  //   const getAllShareholders = async () => {
  //     try {
  //       const response = await getShareHoldersByCompany(
  //         baseEmail,
  //         watch("company_code")?.value
  //       );
  //       if (response.status === 200) {
  //         let options = response.data.data
  //           .filter((item) => item?.cdc_key === "NO")
  //           .map((item) => {
  //             let label = `${item.folio_number} (${item.shareholder_name}) `;
  //             return { label: label, value: item.folio_number };
  //           });
  //         setFolio_options(options);
  //       }
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : console.log("Folios Not Found");
  //     }
  //   };
  //   if (!!watch("company_code")?.value) {
  //     getCompanyCertificateNo();
  //     getAllShareholders();
  //   }
  // }, [watch("company_code")]);

  // // Load Share counter
  // useEffect(() => {
  //   const getFromHandler = async () => {
  //     const response = await getShareCounter(
  //       baseEmail,
  //       watch("company_code")?.value
  //     );
  //     if (response?.status === 200) {
  //       setFromValue(response.data.data.shares_counter);
  //       setToValue(response.data.data.shares_counter);
  //     }
  //   };
  //   if (!!watch("company_code")?.value) {
  //   getFromHandler();
  //   }
  // }, [watch("company_code")]);

  // const startCalculation = (certificate) => {
  //   const newArray = certificateObjects;
  //   newArray.push(certificate);
  //   setCertificateObjects(newArray);
  // };
  // const createCertificate = async (data) => {
  //   const totSharesCount =
  //     startcalculation &&
  //     certificateObjects
  //       .map((obj) => parseInt(obj.shares_count))
  //       .reduce((prev, curr) => prev + curr, 0);
  //   setLoading(true);
  //   try {
  //     setLoading(true);
  //     const response = await addCertificate(
  //       baseEmail,
  //       data.certificate_from,
  //       data.certificate_to,
  //       data.type,
  //       data.issue_date,
  //       totSharesCount.toString(),
  //       certificateObjects,
  //       data.allotted_to.value,
  //       data.company_code.value
  //     );
  //     if (response.status === 200) {
  //       setTimeout(() => {
  //         toast.success(response.data.message);
  //         setViewAddPage(false);
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     setCertificateObjects([]);
  //     setStartCalculation(false);
  //     !!error?.response?.data?.message
  //       ? toast.error(error?.response?.data?.message)
  //       : toast.error(error?.message);
  //   }
  //   setLoading(false);
  // };
  // return (
  //   <Fragment>
  //     <form onSubmit={handleSubmit(createCertificate)}>
  //       <div className="row">
  //         <div className="col-md-6">
  //           <div className="card ">
  //             <div className="card-header b-t-primary">
  //               <h5>Certificate Issuance Details</h5>
  //             </div>
  //             <div className="card-body">
  //               <div className="form-group my-2">
  //                 <label>Company Code </label>
  //                 <Controller
  //                   name="company_code"
  //                   render={({ field }) => (
  //                     <Select
  //                       {...field}
  //                       isLoading={companies_data_loading}
  //                       options={companies_dropdown}
  //                       id="company_code"
  //                       placeholder="Select Company"
  //                       styles={errors.company_code && appliedStyles}
  //                     />
  //                   )}
  //                   control={control}
  //                 />
  //                 <small className="text-danger">
  //                   {errors.company_code?.message}
  //                 </small>
  //               </div>
  //               <div className="form-group mb-3">
  //                 <label>Share Alloted To (Folio Number) </label>

  //                 <Controller
  //                   name="allotted_to"
  //                   render={({ field }) => (
  //                     <Select
  //                       {...field}
  //                       isLoading={folio_options.length === 0}
  //                       options={folio_options}
  //                       id="allotted_to"
  //                       placeholder="Select Folio Number"
  //                       styles={errors.allotted_to && appliedStyles}
  //                     />
  //                   )}
  //                   control={control}
  //                 />
  //                 <small className="text-danger">
  //                   {errors.allotted_to?.message}
  //                 </small>
  //               </div>
  //               <div className="form-group mb-3">
  //                 <label>Issue Date </label>
  //                 <input
  //                   type="date"
  //                   name="issue_date"
  //                   className={`form-control ${
  //                     errors.issue_date && "border border-danger"
  //                   }`}
  //                   {...register("issue_date")}
  //                   defaultValue={getvalidDateYMD(new Date())}
  //                 />
  //                 <small className="text-danger">
  //                   {errors.issue_date?.message}
  //                 </small>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="col-md-6">
  //           <div className="card ">
  //             <div className="card-header b-t-success">
  //               <h5>Certificate Alloted Detail</h5>
  //             </div>
  //             <div className="card-body">
  //               <div className="form-group mb-3">
  //                 <label>Type </label>
  //                 <select
  //                   name="type"
  //                   className={`form-control ${
  //                     errors.type && "border border-danger"
  //                   }`}
  //                   {...register("type")}
  //                 >
  //                   <option value="">Select Type </option>
  //                   <option value="Ordinary">Ordinary </option>
  //                   <option value="Treasury Shares">Treasury Shares </option>
  //                   <option value="Preference Shares">Preference Shares</option>
  //                   <option value="Non-Voting Shares">Non-Voting Shares</option>
  //                   <option value="Redeemable Shares">Redeemable Shares</option>
  //                   <option value="Management Shares">Management Shares</option>
  //                 </select>
  //                 <small className="text-danger">{errors.type?.message}</small>
  //               </div>
  //               <div className="row">
  //                 <div className="col-md-6">
  //                   <div className="form-group my-2">
  //                     <label>Certificate No. From</label>
  //                     <Controller
  //                       name="certificate_from"
  //                       render={({ field }) => (
  //                         <NumberFormat
  //                           {...field}
  //                           className={`form-control ${
  //                             errors.certificate_from && "border border-danger"
  //                           }`}
  //                           id="certificate_from"
  //                           allowNegative={false}
  //                           placeholder="Enter Quantity"
  //                         />
  //                       )}
  //                       control={control}
  //                     />
  //                     <small className="text-danger">
  //                       {errors.certificate_from?.message}
  //                     </small>
  //                   </div>
  //                 </div>
  //                 <div className="col-md-6">
  //                   <div className="form-group my-2">
  //                     <label>Certificate No. To</label>
  //                     <Controller
  //                       name="certificate_to"
  //                       render={({ field }) => (
  //                         <NumberFormat
  //                           {...field}
  //                           className={`form-control ${
  //                             errors.certificate_to && "border border-danger"
  //                           }`}
  //                           id="certificate_to"
  //                           allowNegative={false}
  //                           placeholder="Enter Quantity"
  //                         />
  //                       )}
  //                       control={control}
  //                     />
  //                     <small className="text-danger">
  //                       {errors.certificate_to?.message}
  //                     </small>
  //                   </div>
  //                 </div>
  //               </div>
  //               <div className="form-group my-2">
  //                 <label htmlFor="total_shares_count">Total Shares Count</label>
  //                 <input
  //                   className="form-control"
  //                   type="text"
  //                   name="total_shares_count"
  //                   value={
  //                     startcalculation
  //                       ? certificateObjects
  //                           .map((obj) => parseInt(obj.shares_count))
  //                           .reduce((prev, curr) => prev + curr, 0)
  //                       : "0"
  //                   }
  //                   readOnly
  //                 />
  //               </div>
  //               <div className="form-group my-2">
  //                 {df_snum !== "" && (
  //                   <div
  //                     className="alert alert-warning dark fade show"
  //                     target="Alert-8"
  //                     role="alert"
  //                   >
  //                     <b>{`The last alloted certificate no  was ${df_snum} with distinctive counter ${distinctiveCounter}`}</b>
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="row">
  //         <div className="card w-100 mx-4">
  //           <div className="card-header b-t-success">
  //             <b>CERTIFICATES</b>
  //           </div>
  //           <div className="card-body">
  //             {watch("certificate_to") && watch("certificate_from") && (
  //               <table className="table">
  //                 <thead>
  //                   <tr>
  //                     <th className="text-nowrap">Certificate No.</th>
  //                     <th className="text-nowrap">No of Shares</th>
  //                     <th className="text-nowrap">Distinctive No. From</th>
  //                     <th className="text-nowrap">Distinctive To</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {Math.abs(
  //                     parseInt(watch("certificate_to")) -
  //                       parseInt(watch("certificate_from"))
  //                   ) +
  //                     1 <=
  //                     20 &&
  //                     [
  //                       ...Array(
  //                         Math.abs(
  //                           parseInt(watch("certificate_to")) -
  //                             parseInt(watch("certificate_from"))
  //                         ) + 1
  //                       ),
  //                     ].length > 0 &&
  //                     [
  //                       ...Array(
  //                         Math.abs(
  //                           parseInt(watch("certificate_to")) -
  //                             parseInt(watch("certificate_from"))
  //                         ) + 1
  //                       ),
  //                     ].map((cert, index) => (
  //                       <CertificateItem
  //                         key={index}
  //                         startCalculation={startCalculation}
  //                         calculated={startcalculation}
  //                         num={parseInt(watch("certificate_from")) + index}
  //                       />
  //                     ))}
  //                 </tbody>
  //               </table>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //       {/* {certificateObjects.length === 0 && (
  //         <div className="row">
  //           <p className="text-danger">Calculate All Data</p>
  //         </div>
  //       )} */}
  //       <div className="row">
  //         <div className="col-md-12  ml-3">
  //           <button
  //             type="submit"
  //             className="btn btn-primary"
  //             disabled={loading || !startcalculation}
  //             style={
  //               startcalculation
  //                 ? { cursor: "pointer" }
  //                 : { cursor: "not-allowed" }
  //             }
  //           >
  //             {loading ? (
  //               <>
  //                 <span className="fa fa-spinner fa-spin"></span>
  //                 <span>{"Loading..."}</span>
  //               </>
  //             ) : (
  //               <span>{"Submit"}</span>
  //             )}
  //           </button>
  //           <button
  //             type="button"
  //             className="btn btn-success mx-2"
  //             onClick={(e) => setStartCalculation(true)}
  //           >
  //             Calculate
  //           </button>
  //         </div>
  //       </div>
  //     </form>
  //   </Fragment>
  // );

  const [companies, setCompanies] = useState([]);
  const [df_snum, setDf_snum] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [folio_options, setFolio_options] = useState([]);
  const [toValue, setToValue] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [certificateObjects, setCertificateObjects] = useState([]);
  // React Select Styles
  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };
  // Yup Validation
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(addShareCertificateSchema) });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({ control, name: "output_certificates" });
  // Create button loader
  const baseEmail = sessionStorage.getItem("email") || "";
  const [startcalculation, setStartCalculation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Math.abs(parseInt(watch("certificate_to")) - parseInt(watch("certificate_from"))) + 1 <= 20 &&
      [
        ...Array(
          Math.abs(
            parseInt(watch("certificate_to")) -
              parseInt(watch("certificate_from"))
          ) + 1
        ),
      ].length > 0
    ) {
      const newVal = parseInt(watch("certificate_to") - watch("certificate_from") || 0) + 1;
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
  }, [watch("certificate_from"), watch("certificate_to")]);
  useEffect(() => {
    let updated_output_certificate;
    const checkAllCertificates = watch("output_certificates").length > 0;

    const getSharesCount = () => {
      setTotalSharesCount(
        updated_output_certificate
          .map((obj) => parseInt(obj.shares_count.replace(/,/g, "")) || 0)
          .reduce((prev, curr) => prev + curr, 0)
      );
    };

    if (checkAllCertificates) {
      updated_output_certificate = watch("output_certificates");
      getSharesCount();
    }
  }, [JSON.stringify(watch(`output_certificates`))]);
  // load companies
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const getAllCompanies = async () => {
      const response = await getCompanies(email);
      if (response.status === 200) {
        setCompanies(
          response.data.data.map((com) => {
            return { label: com.company_name, value: com.code };
          })
        );
      }
    };
    getAllCompanies();
  }, []);

  // load companies
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const getCompanyCertificateNo = async () => {
      try {
        const response = await getCertificateNo(
          baseEmail,
          watch("company_code")?.value
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
    const getAllShareholders = async () => {
      try {
        const response = await getShareHoldersByCompany(
          baseEmail,
          watch("company_code")?.value
        );
        if (response.status === 200) {
          let options = response.data.data
            .filter((item) => item?.cdc_key === "NO")
            .map((item) => {
              let label = `${item.folio_number} (${item.shareholder_name}) `;
              return { label: label, value: item.folio_number };
            });
          setFolio_options(options);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Folios Not Found");
      }
    };
    if (!!watch("company_code")?.value) {
      getCompanyCertificateNo();
      getAllShareholders();
    }
  }, [watch("company_code")]);

  // Load Share counter
  useEffect(() => {
    const getFromHandler = async () => {
      const response = await getShareCounter(
        baseEmail,
        watch("company_code")?.value
      );
      if (response?.status === 200 && response?.data?.length > 0) {
        setFromValue(response.data.data[0].shares_counter);
        setToValue(response.data.data[0].shares_counter);
      }
    };
    getFromHandler();
  }, []);

  const startCalculation = (certificate) => {
    const newArray = certificateObjects;
    newArray.push(certificate);
    setCertificateObjects(newArray);
  };
  const createCertificate = async (data) => {
    const updated_output_certificates = data.output_certificates.map(
      (item) => ({
        distinctive_no: [
          { from: item.from, to: item.to, count: item.to - item.from + 1 },
        ],
        ...item,
      })
    );
    setLoading(true);
    try {
      setLoading(true);
      const response = await addCertificate(
        baseEmail,
        data.certificate_from,
        data.certificate_to,
        data.type,
        data.issue_date,
        totalSharesCount.toString(),
        updated_output_certificates,
        data.allotted_to.value,
        data.company_code.value
      );
      if (response.status === 200) {
        setTimeout(() => {
          toast.success(response.data.message);
          setViewAddPage(false);
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      setCertificateObjects([]);
      !!error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : toast.error("Certificate Not Submited ");
    }
    setLoading(false);
  };
  return (
    <Fragment>
      <form onSubmit={handleSubmit(createCertificate)}>
        <div className="row">
          <div className="col-md-6">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Certificate Issuance Details</h5>
              </div>
              <div className="card-body">
                <div className="form-group my-2">
                  <label>Company Code </label>
                  <Controller
                    name="company_code"
                    render={({ field }) => (
                      <Select
                        {...field}
                        isLoading={companies.length === 0}
                        options={companies}
                        id="company_code"
                        placeholder="Select Company"
                        styles={errors.company_code && appliedStyles}
                      />
                    )}
                    control={control}
                  />
                  <small className="text-danger">
                    {errors.company_code?.message}
                  </small>
                </div>
                <div className="form-group mb-3">
                  <label>Share Alloted To (Folio Number) </label>

                  <Controller
                    name="allotted_to"
                    render={({ field }) => (
                      <Select
                        {...field}
                        isLoading={folio_options.length === 0}
                        options={folio_options}
                        id="allotted_to"
                        placeholder="Select Folio Number"
                        styles={errors.allotted_to && appliedStyles}
                      />
                    )}
                    control={control}
                  />
                  <small className="text-danger">
                    {errors.allotted_to?.message}
                  </small>
                </div>
                <div className="form-group mb-3">
                  <label>Issue Date </label>
                  <input
                    type="date"
                    name="issue_date"
                    className={`form-control ${
                      errors.issue_date && "border border-danger"
                    }`}
                    {...register("issue_date")}
                    defaultValue={getvalidDateYMD(new Date())}
                  />
                  <small className="text-danger">
                    {errors.issue_date?.message}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card ">
              <div className="card-header b-t-success">
                <h5>Certificate Alloted Detail</h5>
              </div>
              <div className="card-body">
                <div className="form-group mb-3">
                  <label>Type </label>
                  <select
                    name="type"
                    className={`form-control ${
                      errors.type && "border border-danger"
                    }`}
                    {...register("type")}
                  >
                    <option value="">Select Type </option>
                    <option value="Ordinary">Ordinary </option>
                    <option value="Treasury Shares">Treasury Shares </option>
                    <option value="Preference Shares">Preference Shares</option>
                    <option value="Non-Voting Shares">Non-Voting Shares</option>
                    <option value="Redeemable Shares">Redeemable Shares</option>
                    <option value="Management Shares">Management Shares</option>
                  </select>
                  <small className="text-danger">{errors.type?.message}</small>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group my-2">
                      <label>Certificate No. From</label>
                      <Controller
                        name="certificate_from"
                        render={({ field }) => (
                          <NumberFormat
                            {...field}
                            className={`form-control ${
                              errors.certificate_from && "border border-danger"
                            }`}
                            id="certificate_from"
                            allowNegative={false}
                            placeholder="Enter Quantity"
                          />
                        )}
                        control={control}
                      />
                      <small className="text-danger">
                        {errors.certificate_from?.message}
                      </small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group my-2">
                      <label>Certificate No. To</label>
                      <Controller
                        name="certificate_to"
                        render={({ field }) => (
                          <NumberFormat
                            {...field}
                            className={`form-control ${
                              errors.certificate_to && "border border-danger"
                            }`}
                            id="certificate_to"
                            allowNegative={false}
                            placeholder="Enter Quantity"
                          />
                        )}
                        control={control}
                      />
                      <small className="text-danger">
                        {errors.certificate_to?.message}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group my-2">
                  <label htmlFor="total_shares_count">Total Shares Count</label>
                  <input
                    className="form-control text-right"
                    type="text"
                    name="total_shares_count"
                    value={totalSharesCount}
                    readOnly
                  />
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
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="card w-100 mx-4">
            <div className="card-header b-t-success">
              <b>CERTIFICATES</b>
            </div>
            <div className="card-body">
              {watch("certificate_to") && watch("certificate_from") && (
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
                    {/* {Math.abs(
                      parseInt(watch("certificate_to")) -
                        parseInt(watch("certificate_from"))
                    ) +
                      1 <=
                      20 &&
                      [
                        ...Array(
                          Math.abs(
                            parseInt(watch("certificate_to")) -
                              parseInt(watch("certificate_from"))
                          ) + 1
                        ),
                      ].length > 0 &&
                      [
                        ...Array(
                          Math.abs(
                            parseInt(watch("certificate_to")) -
                              parseInt(watch("certificate_from"))
                          ) + 1
                        ),
                      ].map((cert, index) => (
                        <CertificateItem
                          key={index}
                          startCalculation={startCalculation}
                          calculated={startcalculation}
                          num={parseInt(watch("certificate_from")) + index}
                        />
                      ))} */}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        {/* {certificateObjects.length === 0 && (
          <div className="row">
            <p className="text-danger">Calculate All Data</p>
          </div>
        )} */}
        <div className="row">
          <div className="col-md-12  ml-3">
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
        </div>
      </form>
    </Fragment>
  );
}
