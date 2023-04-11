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
import Breadcrumb from "../../../common/breadcrumb";
import { addRightSubscribtionValidation } from "../../../../store/validations/rightSubscribtionValidation";
import { getvalidDateYMD } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import {
  addInvestorRequestDUP,
  addInvestorRequestRSUB,
  addInvestorRequestSPL,
} from "../../../../store/services/investor.service";
import {
  getShareCertificatesByFolio,
  getShareCertificatesByNumber,
} from "../../../../store/services/shareCertificate.service";
import {
  getShareHolderByFolioNo,
  getShareHoldersByCompany,
} from "../../../../store/services/shareholder.service";
import {
  getCorporateAnnouncementByCompanyCode,
  getCorporateAnnouncementById,
  getCorporateEntitlementByAnnouncement,
  getCorporateEntitlementById,
} from "../../../../store/services/corporate.service";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import {
  getCompanies,
} from "../../../../store/services/company.service";
import { getShareholders } from "store/services/shareholder.service"
import { getCompanyById } from "../../../../store/services/company.service";
const RightSuscription = ({ setInvestorRequestForm, selectedCompany, companyName }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  // States
  const dispatch = useDispatch();
  // Ref
  const announcement_ref = useRef(null);
  const entitlement_ref = useRef(null);
  // Selector ENDS
  const [certificates, setCertificates] = useState("");
  const [instrument_types, setInstrument_types] = useState([
    { label: "Cheque", value: "Checque" },
    { label: "Online", value: "Online" },
  ]);
  const [cdc_key, setCdc_key] = useState("YES");
  const [selectedEntitlement, setSelectedEntitlement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [entitlementLoading, setEntitlementLoading] = useState(false);
  const [df_snum, setDf_snum] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [announcement_options, setAnnouncement_options] = useState([]);
  const [entitlement_options, setEntitlement_options] = useState([]);
  const [selectedAnnouncmement, setSelectedAnnouncmement] = useState(null);
  const [selectedShareholder, setSelectedShareholder] = useState(null);
  const [folio_options, setFolio_options] = useState([]);
  const [startcalculation, setStartcalculation] = useState(false);
  const [certificate, setCertificate] = useState(null);
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
    setValue,
  } = useForm({ resolver: yupResolver(addRightSubscribtionValidation) });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({ control, name: "output_certificates" });

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
console.log('entitlement_options', entitlement_options)
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
  const getAnnouncements = async () => {
    try {
      setAnnouncementLoading(true);
      const response = await getCorporateAnnouncementByCompanyCode(
        baseEmail,
       selectedCompany
      );
      if (response.status === 200) {
        setAnnouncement_options(
          response.data.data
            .filter((item) => item.expired === "true")
            .map((item) => {
              let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
              return { label: label, value: item.announcement_id };
            })
        );
      }
    } catch (error) {
      !!error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : console.log("Announcements No Not Found");
      setAnnouncementLoading(false);
    }
    setAnnouncementLoading(false);
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
  useEffect(() => {
      getSelectedCompanyInfo()
      getShareHoldersByCompanyCode()
      getAnnouncements();
      getCompanyCertificateNo();
  }, [])

  useEffect(() => {
    if (!isNaN(parseInt(certificates)) && certificates <= 20) {
      const newVal = parseInt(certificates || 0);
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
  }, [certificates]);
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
    // const getAllShareCertificates = async () => {
    //   try {
    //     const response = await getShareCertificatesByFolio(
    //       baseEmail,
    //       selectedEntitlement?.folio_number
    //     );
    //     if (response.status === 200) {
    //       setCertificates(
    //         response.data.data.map((cert) => ({
    //           label: cert.certificate_no,
    //           value: cert.certificate_no,
    //         }))
    //       );
    //     }
    //   } catch (error) {
    //     !!error?.response?.data?.message
    //       ? toast.error(error?.response?.data?.message)
    //       : console.log("Certificates Not Found");
    //   }
    // };
    const getShareHolder = async () => {
      try {
        const response = await getShareHolderByFolioNo(
          baseEmail,
          selectedEntitlement?.folio_number
        );
        if (response.status === 200) {
          setSelectedShareholder(response.data.data);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Shareholder Not Found");
      }
    };
    if (!!selectedEntitlement?.folio_number) {
      getShareHolder();
    }
  }, [selectedEntitlement]);
  useEffect(() => {
    const getEntitlements = async () => {
      try {
        setEntitlementLoading(true);
        const response = await getCorporateEntitlementByAnnouncement(
          baseEmail,
          watch("announcement_no")?.value
        );
        if (response.status === 200) {
          console.log('eneneneneneneneneneneenenen', response.data.data)
          setEntitlement_options(
            response.data.data.map((item) => ({
              label: ` ${item.folio_number}- ${
                shareholders.find(
                  (tem) => tem.folio_number === item.folio_number
                )?.shareholder_name
              }`,
              value: item.entitlement_id,
            }))
          );
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Entitlements Not Found");
        setEntitlementLoading(false);
      }
      setEntitlementLoading(false);
    };
    const getAnnouncement = async () => {
      try {
        const response = await getCorporateAnnouncementById(
          baseEmail,
          watch("announcement_no")?.value
        );
        if (response.status === 200) {
          setSelectedAnnouncmement(response.data.data);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Announcement Not Found");
      }
    };
    if (!!watch("announcement_no")?.value) {
      getAnnouncement();
      getEntitlements();
    }
  }, [watch("announcement_no")]);

  useEffect(() => {
    const getEntitlement = async () => {
      try {
        const response = await getCorporateEntitlementById(
          baseEmail,
          watch("entitlements")?.value
        );
        if (response.status === 200) {
          setSelectedEntitlement(response.data.data);
          setValue(
            "cdc_key",
            shareholders.find(
              (d) => d.folio_number === response.data.data.folio_number
            ).cdc_key
          );
          setCdc_key(
            shareholders.find(
              (d) => d.folio_number === response.data.data.folio_number
            ).cdc_key
          );
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Entitlement Not Found");
      }
    };
    if (!!watch("entitlements")?.value) {
      getEntitlement();
    }
  }, [watch("entitlements")]);
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

  //   const getAnnouncements = async () => {
  //     try {
  //       setAnnouncementLoading(true);
  //       const response = await getCorporateAnnouncementByCompanyCode(
  //         baseEmail,
  //         watch("company_code")?.value
  //       );
  //       if (response.status === 200) {
  //         setAnnouncement_options(
  //           response.data.data
  //             .filter((item) => item.expired === "true")
  //             .map((item) => {
  //               let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
  //               return { label: label, value: item.announcement_id };
  //             })
  //         );
  //       }
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : console.log("Announcements No Not Found");
  //       setAnnouncementLoading(false);
  //     }
  //     setAnnouncementLoading(false);
  //   };
  //   if (!!watch("company_code")?.value) {
  //     announcement_ref.current.clearValue();
  //     entitlement_ref.current.clearValue();
  //     const options = shareholders
  //       .filter((data) => data.company_code === watch("company_code")?.value)
  //       .map((item) => {
  //         let label = `${item.folio_number} (${item.shareholder_name}) `;
  //         return { label: label, value: item.folio_number };
  //       });
  //     setFolio_options(options);
  //     // getCompanyCertificateNo();
  //     // getAnnouncements();
  //   }
  // }, [watch("company_code")]);
  const handleAddInvestorRequest = async (data) => {
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
      const response = await addInvestorRequestRSUB(
        email,
        "RSUB",
        shareholders.find(
          (d) => d.folio_number === selectedEntitlement?.folio_number
        )?.folio_number, // TO
        // data.company_code.value,
        selectedCompany,
        // companies_selector.find(
        //   (c) => c.code === data.company_code.value
        // )?.symbol, // Symbol
        companies_selector?.symbol, // Symbol
        data.entitlements.value,
        data.announcement_no.value,
        (data.sub_shares * selectedAnnouncmement?.right_rate).toString(), // Right Share Price
        selectedAnnouncmement?.right_rate,
        data.sub_shares, // Quantity
        data.execution_date,
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
            <div className="col-md-3 col-sm-12 col-lg-3">
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
                          // options={companies_dropdown}
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
                  {/* Request Type */}
                  <div className="form-group my-2">
                    <label>Request Type</label>
                    <input
                      className="form-control"
                      type="text"
                      name="request_type"
                      id="request_tyoe"
                      value="Right Subscriptions"
                    />
                  </div>
                  {/* Request Date */}
                  <div className="form-group my-2">
                    <label htmlFor="request_date">Request Date</label>
                    <input
                      name="request_date"
                      type="date"
                      className={`form-control ${
                        errors.request_date && "border border-danger"
                      }`}
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
                      name="execution_date"
                      type="date"
                      className={`form-control ${
                        errors.execution_date && "border border-danger"
                      }`}
                      id="execution_date"
                      {...register("execution_date")}
                      // defaultValue={getvalidDateYMD(new Date())}
                    />
                    <small className="text-danger">
                      {errors.execution_date?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 col-lg-3">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>ANNOUNCEMENT</h5>
                </div>
                <div className="card-body">
                  {/* Announcement Number */}
                  <div className="form-group my-2">
                    <label htmlFor="announcement_no">Announcement </label>
                    <Controller
                      name="announcement_no"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={announcement_options}
                          isLoading={announcementLoading}
                          ref={announcement_ref}
                          id="announcement_no"
                          styles={errors.announcement_no && errorStyles}
                          placeholder={
                            !selectedCompany
                              ? "Select Company First"
                              : "Select Announcement"
                          }
                          isDisabled={!selectedCompany}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.announcement_no?.message}
                    </small>
                  </div>
                  {/* Entitlements */}
                  <div className="form-group my-2">
                    <label htmlFor="entitlements">Entitlements </label>
                    <Controller
                      name="entitlements"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={entitlement_options}
                          isLoading={entitlementLoading}
                          ref={entitlement_ref}
                          id="entitlements"
                          styles={errors.entitlements && errorStyles}
                          placeholder={
                            !selectedCompany
                              ? "Select Company First"
                              : "Select Entitlements"
                          }
                          isDisabled={!selectedCompany}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.entitlements?.message}
                    </small>
                  </div>
                  {/* Folio Number */}
                  {/* <div className="form-group my-2">
                    <label htmlFor="folio_no">Folio Number </label>
                    <Controller
                      name="folio_no"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={folio_options}
                          id="folio_no"
                          styles={errors.folio_no && errorStyles}
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
                      {errors.folio_no?.message}
                    </small>
                  </div> */}
                  {/* Name */}
                  <div className="form-group my-2">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className={`form-control`}
                      id="name"
                      value={
                        shareholders.length !== 0 &&
                        !!selectedEntitlement?.folio_number
                          ? shareholders.find(
                              (holder) =>
                                holder.folio_number ===
                                selectedEntitlement.folio_number
                            )?.shareholder_name
                          : ""
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
                      {...register("remarks")}
                      type="text"
                      name="remarks"
                      id="remarks"
                      placeholder="Enter Remarks"
                    />
                    <small className="text-danger">
                      {errors.remarks?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    {df_snum !== "" && cdc_key === "NO" && (
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
            <div className="col-sm-12 col-lg-3 col-md-3">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>RIGHT SHARE DETAILS</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Right Percent</label>
                    <input
                      className={`form-control text-right`}
                      type="text"
                      value={selectedAnnouncmement?.right_percent}
                      placeholder="Right Percent"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Right Shares</label>
                    <input
                      className={`form-control text-right`}
                      type="text"
                      placeholder="Right Shares"
                      value={selectedEntitlement?.right_shares}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Subscribable Right Shares</label>
                    <input
                      className={`form-control text-right`}
                      type="text"
                      placeholder="Right Shares"
                      value={selectedShareholder?.right_shares}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Right Share Rate</label>
                    <input
                      className={`form-control text-right`}
                      type="text"
                      placeholder="Right Share Rate"
                      value={selectedAnnouncmement?.right_rate}
                      readOnly
                    />
                  </div>
                  {cdc_key === "NO" && (
                    <div className="form-group my-2">
                      <label htmlFor="certificates">Certificates</label>
                      <input
                        className={`form-control ${
                          errors.certificates && "border border-danger"
                        }`}
                        {...register("certificates")}
                        name="certificates"
                        type="text"
                        placeholder="Certificates"
                        onChange={(e) => setCertificates(e.target.value)}
                        value={certificates}
                      />
                      <small className="text-danger">
                        {errors.certificates?.message}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-lg-3 col-md-3">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>SUBSCRIBTION DETAILS</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Sub Shares</label>
                    <Controller
                      name="sub_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.sub_shares && "border-danger"
                          }`}
                          id="sub_shares"
                          allowNegative={false}
                          placeholder="Sub Shares"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.sub_shares?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label htmlFor="sub_amount">Sub Amount</label>
                    <input
                      name="sub_amount"
                      className={`form-control text-right`}
                      type="text"
                      placeholder="Sub Amount"
                      value={
                        !!selectedAnnouncmement?.right_rate
                          ? selectedAnnouncmement?.right_rate *
                              watch("sub_shares") || ""
                          : ""
                      }
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="instrument_type">Instrument Type</label>
                    <Controller
                      name="instrument_type"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={instrument_types}
                          id="instrument_type"
                          placeholder="Select Instrument Type"
                          styles={errors.instrument_type && errorStyles}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.instrument_type?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Instrument No</label>
                    <Controller
                      name="instrument_no"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${
                            errors.instrument_no && "border-danger"
                          }`}
                          id="instrument_no"
                          allowNegative={false}
                          placeholder="Instrument No / Ref No"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.instrument_no?.message}
                    </small>
                  </div>
                  {cdc_key === "NO" && (
                    <div className="form-group my-2">
                      <label htmlFor="Allot Size">Lot Size</label>
                      <input
                        type="text"
                        className="form-control text-right"
                        name="allot_size"
                        id="allot_size"
                        value={
                          companies_selector.allot_size
                          // companies_selector.find(
                          //   (comp) => comp.code === selectedCompany
                          // )?.allot_size
                        }
                        readOnly
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {cdc_key === "NO" && (
            <div className="row my-2">
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
                    {/* {!isNaN(parseInt(certificates)) &&
                      certificates <= 20 &&
                      [...Array(parseInt(certificates))].map((cert, index) => (
                        <SplitShareCertificateItem
                          key={index}
                          startCalculation={startCalculation}
                          calculated={startcalculation}
                          num={parseInt(certificates) + index}
                        />
                      ))} */}
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
          )}
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

export default RightSuscription;
