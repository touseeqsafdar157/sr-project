import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import * as _ from "lodash";
import {
  folio_setter,
  company_setter,
  certificate_setter,
} from "../../../../store/services/dropdown.service";
import { useSelector } from "react-redux";
import Breadcrumb from "../../../common/breadcrumb";

import {
  getvalidDateYMD,
  IsJsonString,
} from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import { addTransferDeedVerificationSchema } from "../../../../store/validations/transferDeedValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import {
  addInvestorRequest,
  addInvestorRequestTOS,
  addInvestorRequestVTD,
} from "../../../../store/services/investor.service";
import {
  getCertificateNo,
  getCompanies,
} from "../../../../store/services/company.service";
import {
  getShareHolderByFolioNo,
  getShareHoldersByCompany,
} from "../../../../store/services/shareholder.service";
import { getShareholders } from "store/services/shareholder.service"
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import { getInvestorRequest } from "store/services/investor.service"
// import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import { getCompanyById } from "../../../../store/services/company.service";
const TransferDeedVerification = ({ setInvestorRequestForm, selectedCompany, companyName }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  //Refs
  const transferor_ref = useRef(null);
  const transferee_ref = useRef(null);
  // States
  const [loading, setLoading] = useState(false);
  const [folio_options, setFolio_options] = useState([]);
  const [nonSelectedCertificates, setNonSelectedCertificates] = useState([]);
  const [styledCertificates, setStyledCertificates] = useState([]);
  const [attachment, setAttachment] = useState("");
  const [df_snum, setDf_snum] = useState("");
  const [shareholder, setShareHolder] = useState(null);
  const [company_options, setCompany_options] = useState([]);
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [certificatesDropdown, setCertificatesDropdown] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [certificatesFillted, setCertificatesFillted] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [shareholders, setAllShareholders] = useState([]);
  const [isLoadingShareholder, setIsLoadingShareholder] = useState(false);
  const [companies_selector, setCompanies_selector] = useState([]);


  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm({ resolver: yupResolver(addTransferDeedVerificationSchema) });
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
          .map((obj) => parseInt(obj?.shares_count.replace(/,/g, "")) || 0)
          .reduce((prev, curr) => prev + curr, 0)
      );
    };
    if (startcalculation && !!certificateObjects.length) {
      getSharesCount();
      setNonSelectedCertificates(
        certificateObjects.filter((cert) => !cert.certificate_no)
      );
      setStyledCertificates(
        certificateObjects.map((cert) => ({
          id: cert.id,
          backgroundColor: `${!cert.certificate_no ? "#ff073059" : ""}`,
        }))
      );
    }
  }, [startcalculation]);

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
  // useEffect(() => {
  //   const getAllCompanies = async () => {
  //     try {
  //       const response = await getCompanies(baseEmail);
  //       setCompanies(response.data.data);
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
  //   getAllShareHolders();
  // }, []);
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
          const filtered_certificates = response.data.data.filter((cert) => {
            if (cert?.td_verified === "false") {
              cert.distinctive_no = JSON.parse(cert.distinctive_no).map((item) => {
                item.from = item.from.toString();
                item.to = item.to.toString();
                return item;
              });
              return cert;
            }
          }
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
          : console.log("Certificates Not Found");
        setCertificatesLoading(false);
      }
    };
    const getShareholder = async () => {
      try {
        const response = await getShareHolderByFolioNo(
          baseEmail,
          watch("transferor_folio_no").value
        );
        if (response.status === 200) {
          setShareHolder(response.data.data);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Shareholder Not Found");
      }
    };

    if (!!watch("transferor_folio_no")?.value) {
      // getShareholder();
      getAllShareCertificates();
    }
  }, [watch("transferor_folio_no")]);
  const getSelectedCompanyInfo = async () => {
    try {
      const response = await getCompanyById(baseEmail, selectedCompany);
      if (response.status === 200) {
        const parents = response.data.data;
        setCompanies_selector(parents);
      }
    } catch (error) {
      toast.error("Error fetching company info")
    }
  }
  useEffect(() => {
    const getShareHolders = async () => {
      try {
        const response = await getShareHoldersByCompany(
          baseEmail,
          selectedCompany
        );
        if (response.status === 200) {
          const physicalShareholders = response.data.data.filter((item) => {
            return item.cdc_key == "NO";
          })
          const filterOption = physicalShareholders?.filter(item => item?.folio_number != `${selectedCompany}-0`);
          let options = filterOption.map((item) => {
            let label = `${item.folio_number} (${item.shareholder_name}) `;
            return { label: label, value: item.folio_number };
          });
          setFolio_options(options);
          setAllShareholders(response.data.data)
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Folios Not Found");
      }
    };
    if (selectedCompany) {
      transferor_ref.current.clearValue();
      getShareHolders();
    }
    getSelectedCompanyInfo()
    // if (!!watch("company_code")?.value) {
    //   transferor_ref.current.clearValue();
    //   getShareHolders();
    // }
  }, []);
  const handleAddInvestorRequest = async (data) => {
    const updated_input_certificates = data.input_certificates.map((cert) => ({
      ...certificates.find(
        (item) => item.certificate_no === cert.certificate_no?.value
      ),
    }));
    const email = sessionStorage.getItem("email");
    setLoading(true);

    try {
      const response = await addInvestorRequestVTD(
        email,
        "VTD", //   Type of Request
        data.transferor_folio_no.value, // FROM
        selectedCompany,
        // data.company_code.value,
        // companies.find(
        //   (comp) => comp.code === data.company_code.value
        // )?.symbol, //    Symbol
        companies_selector?.symbol, //symbol
        totalSharesCount.toString(),
        data.request_date,
        [attachment],
        updated_input_certificates,
        data.remarks,
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
            <div className="col-sm-12 col-lg-6">
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
                      defaultValue={selectedCompany}
                      render={({ field, value }) => (
                        <Select
                          {...field}
                          // isLoading={company_options.length === 0}
                          // options={company_options}
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
                  {/* Request Type */}
                  <div className="form-group my-2">
                    <label>Request Type</label>
                    <input
                      className="form-control"
                      type="text"
                      name="request_type"
                      id="request_tyoe"
                      value="Transfer Deed Verification"
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
                      className={`form-control ${errors.execution_date && "border border-danger"
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
                    <div className="form-group">
                      <label htmlFor="transferor_folio_no">Folio Number</label>
                      <Controller
                        name="transferor_folio_no"
                        render={({ field }) => (
                          <Select
                            {...field}
                            isLoading={folio_options.length === 0}
                            options={folio_options}
                            ref={transferor_ref}
                            id="transferor_folio_no"
                            styles={errors.transferor_folio_no && errorStyles}
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
                            shareholders.length !== 0
                              ? shareholders.find(
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
                          className={`form-control text-right ${errors.no_of_certificates && "border border-danger"
                            }`}
                          id="no_of_certificates"
                          readOnly={certificates.length === 0}
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
                  <div className="form-group">
                    <label htmlFor="attachment">Attachment</label>
                    <input
                      className={`form-control ${errors.attachment && "border border-danger"
                        }`}
                      name="attachment"
                      type="file"
                      {...register("attachment")}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          let img = e.target.files[0];
                          const reader = new FileReader();
                          reader.readAsDataURL(img);
                          reader.onload = function () {
                            setAttachment(reader.result);
                          };
                        }
                      }}
                    />
                    <small className="text-danger d-block">
                      {errors.attachment?.message}
                    </small>
                    {attachment && (
                      <img
                        width="200"
                        src={attachment}
                        alt="image_of_attachment"
                      />
                    )}
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
                    <th className="text-nowrap text-right">No of Shares</th>
                    <th className="text-nowrap">Distinctive No. From</th>
                    <th className="text-nowrap">Distinctive To</th>
                  </tr>
                </thead>

                <tbody>
                  {/* {!isNaN(parseInt(watch("no_of_certificates"))) &&
                    [...Array(parseInt(watch("no_of_certificates")))].map(
                      (cert, index) => (
                        <TransferOfSharesItem
                          certificates={certificates}
                          startCalculation={startCalculation}
                          calculated={startcalculation}
                          num={parseInt(watch("no_of_certificates")) + index}
                          index={index}
                        />
                      )
                    )} */}
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

export default TransferDeedVerification;
