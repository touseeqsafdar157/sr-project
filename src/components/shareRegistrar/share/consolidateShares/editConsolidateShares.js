import React, { useState, useEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import DistinctiveCounterItem from "../../share-certificate/distinctiveCounterItem";
import Breadcrumb from "../../../common/breadcrumb";
import {
  addConsolidateSharesSchema,
  updateConsolidateSharesSchema,
} from "../../../../store/validations/consolidateSharesValidation";
import { getvalidDateYMD, IsJsonString } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import TransferOfShares from "../transferOfShares/transferOfShares";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import TransferOfSharesItem from "../transferOfSharesItem";
import { editInvestorRequestCON } from "../../../../store/services/investor.service";
import { getCertificateNo } from "../../../../store/services/company.service";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import { getCompanies } from "../../../../store/services/company.service";

const EditConsolidateShares = ({ setInvestorRequestForm }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
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
  const input_certificates = request.input_certificates;
  console.log(request, " ~ input_certificates:", input_certificates)
  const companies_selector = useSelector((data) => data.Companies);
  const [output_certificates] = JSON.parse(request.output_certificates);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [df_snum, setDf_snum] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [loading, setLoading] = useState(false);
  // States
  const [distinctiveSets, setDistinctiveSets] = useState(0);
  const [distinctiveSetsArray, setDistinctiveSetsArray] = useState([]);
  const [startDistinctiveCalculation, setStartDistinctiveCalculation] =
    useState(false);
  const [certificates, setCertificates] = useState([]);
  const [startcalculation, setStartcalculation] = useState(false);
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [distinctiveFrom, setDistinctiveFrom] = useState("0");
  const [distinctiveTo, setDistinctiveTo] = useState("0");
  const [companies, setCompanies] = useState([]);
  const [shareholders_da, setAllShareholders] = useState([]);
  const [isLoadingShareholder, setIsLoadingShareholder] = useState(false);
  const [folio_options, setFolio_options] = useState([]);
  const [certificatesDropdown, setCertificatesDropdown] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);

  const requester_folio_ref = useRef(null);
  // Validation Declarations
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    getValues,
    watch,
  } = useForm({
    defaultValues: updateConsolidateSharesSchema(request).cast(),
    resolver: yupResolver(updateConsolidateSharesSchema(request)),
  });

  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({ control, name: "input_certificates" });


  useEffect(() => {
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
    const getAllShareCertificates = async () => {
      try {

        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("requester_folio").value
        );
        if (response.status === 200) {
          // setCertificates(response.data.data);
          setCertificates(response.data.data.filter((item) => {
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
            // response.data.data.map((item) => ({
              response.data.data.map((item) => ({
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
      }
    };
    if (!!watch("requester_folio")?.value) {
      getAllShareCertificates();
      getCompanyCertificateNo();
    }
  }, [watch("requester_folio")]);

  const getCertificates = () => {
    console.log('112233',parseInt(watch("no_of_certificates") || '0'),watch("no_of_certificates"))
    if (parseInt(watch("no_of_certificates") || '0') !== 0) {
      if ((parseInt(watch("no_of_certificates") || '0') <= (certificates.length)) || (certificates.length === 0)) {
        if (!isNaN(parseInt(watch("no_of_certificates"))) && watch("no_of_certificates") >= 2) {

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
      } else {
        const newVal = 0;
        const oldVal = fields.length;
        for (let i = oldVal; i > newVal; i--) {
          remove(i - 1);
        }
        toast.error(`You Cannot enter more ${certificates.length} certificate number.`)
      }
    } else {
      const newVal = 0;
      const oldVal = fields.length;
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
    }
  }

  useEffect(() => {
    getCertificates();
  }, [watch("no_of_certificates"), JSON.stringify(certificates)]);

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

    const getDistinctiveFrom = () => {
      distinctiveSets === 0 &&
        setDistinctiveFrom(
          Math.min(
            ...updated_input_certificate.map((obj) => parseInt(obj.from))
          )
        );
    };
    const getDistinctiveTo = () => {
      distinctiveSets === 0 &&
        setDistinctiveTo(
          Math.max(...updated_input_certificate.map((obj) => parseInt(obj.to)))
        );
    };
    if (checkAllCertificates) {
      updated_input_certificate = watch("input_certificates").map((cert) => {
        const new_cert = certificates.find(
          (item) => item.certificate_no === cert.certificate_no?.value
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
      getDistinctiveTo();
      getDistinctiveFrom();
    }

    // // const checkSequence = () => {
    // //   const from_to_array = [];
    // //   certificateObjects.forEach((cert, i) => {
    // //     from_to_array.push(cert.from);
    // //     from_to_array.push(cert.to);
    // //   });
    // //   if (isAscending(from_to_array) && isDescending(from_to_array)) {

    // //   }
    // //   if (!isAscending(from_to_array) && !isDescending(from_to_array)) {

    // //   }
    // // };
    // if (startcalculation) {

    //   //checkSequence();
    // }
  }, [JSON.stringify(watch(`input_certificates`))]);


  useEffect(() => {
    const getShareHoldersByCompanyCode = async () => {
      setIsLoadingShareholder(true);
      try {
        const response = await getShareHoldersByCompany(baseEmail, watch("company_code")?.value, "");
        if (response.status === 200) {
          const parents = response.data.data;
          setAllShareholders(parents)
          const options = parents?.filter((h) => h.cdc_key === "NO")
            // .filter((data) => data.company_code === watch("company_code")?.value)
            // .filter((item) => item.cdc_key === "NO")
            .map((item) => {
              let label = `${item.folio_number} (${item.shareholder_name}) `;
              return { label: label, value: item.folio_number };
            });
          setFolio_options(options);
          setIsLoadingShareholder(false)
        }
      } catch (error) {
        setIsLoadingShareholder(false);
        toast.error("Error fetching shareholders")
      }
    };
    getShareHoldersByCompanyCode();
  }, [])







  const handleDistinctiveCounterClick = (distinctive_no) => {
    const temp = distinctiveSetsArray;
    temp.push(distinctive_no);
    setDistinctiveSetsArray(temp);
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
        setCompanies(response.data.data);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Companies Not Found");
      }
    };
    getAllCompanies();
  }, []);
  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email") || "";
    try {
      setLoading(true);
      const response = await editInvestorRequestCON(
        email,
        "CON",
        data.folio_number.value, // TO
        data.company_code.value,
        companies.find(
          (comp) => comp.code === data.company_code.value
        )?.symbol, //    Symbol
        certificateObjects, // Input Certicates
        [
          {
            certificate_no: data.new_certificate_no,
            shares_count: totalSharesCount.toString(),
            distinctive_no: [
              {
                from: distinctiveFrom.toString(),
                to: distinctiveTo.toString(),
                count: distinctiveTo - distinctiveFrom + 1,
              },
              ...distinctiveSetsArray,
            ],
          },
        ],
        data.remarks,
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
  useEffect(() => {
    const getSharesCount = () => {
      setTotalSharesCount(
        input_certificates
          .map((obj) => parseInt(obj.shares_count.replace(/,/g, "")) || 0)
          .reduce((prev, curr) => prev + curr, 0)
      );
    };
    const getDistinctiveFrom = () => {
      setDistinctiveFrom(
        Math.min(...input_certificates.map((obj) => parseInt(obj.from)))
      );
    };
    const getDistinctiveTo = () => {
      setDistinctiveTo(
        Math.max(...input_certificates.map((obj) => parseInt(obj.to)))
      );
    };
    // const checkSequence = () => {
    //   const from_to_array = [];
    //   certificateObjects.forEach((cert, i) => {
    //     from_to_array.push(cert.from);
    //     from_to_array.push(cert.to);
    //   });
    //   if (isAscending(from_to_array) && isDescending(from_to_array)) {

    //   }
    //   if (!isAscending(from_to_array) && !isDescending(from_to_array)) {

    //   }
    // };
    if (!startcalculation) {
      getSharesCount();
      getDistinctiveFrom();
      getDistinctiveTo();
      //checkSequence();
    }
  }, [startcalculation]);

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
                  {/* Request Type */}
                  <div className="form-group my-2">
                    <label>Request Type</label>
                    <input
                      className="form-control"
                      type="text"
                      name="request_type"
                      id="request_tyoe"
                      value="Consolidate Shares"
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
                  {/* Request Date */}
                  {/* <div className="form-group my-2">
                    <label htmlFor="request_date">Request Date</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.request_date && "border border-danger"
                      }`}
                      name="request_date"
                      id="request_date"
                      {...register("request_date")}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.request_date?.message}
                    </small>
                  </div> */}

                  {/* Requester Folio */}
                  <div className="form-group my-2">
                    <label htmlFor="folio_number">Folio Number </label>
                    <Controller
                      name="requester_folio"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={folio_options.length === 0}
                          options={folio_options}
                          id="requester_folio"
                          // ref={requester_folio_ref}
                          styles={errors.requester_folio && errorStyles}
                          onChange={() => {
                            if (watch("no_of_certificates") !== undefined) {
                              setValue("no_of_certificates", '0');
                            }
                          }}
                          placeholder={
                            // !watch("company_code")?.value
                            !watch("company_code")?.value

                              ? "Select Company First"
                              : "Select Folio Number"
                          }
                          // isDisabled={!watch("company_code")?.value}
                          isDisabled={!watch("company_code")?.value}

                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.folio_number?.message}
                    </small>
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
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12 col-lg-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Company</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="company_code">Company </label>
                    <Controller
                      name="company_code"
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="company_code"
                          placeholder="Select Company"
                          styles={errors.company_code && errorStyles}
                          isDisabled={true}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.company_code?.message}
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
                    {watch("folio_number")?.value && (
                      <div
                        className="alert alert-warning dark fade show"
                        target="Alert-8"
                        role="alert"
                      >
                        <b>{`This Shareholder Has ${certificates.length} Certificates`}</b>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-lg-4 col-md-4">
              <div className="card">
                <div className="card-header b-t-success">
                  <h5>Consolidate Shares</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label htmlFor="no_of_certificates">
                      No of Certificates
                    </label>
                    <Controller
                      name="no_of_certificates"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          isLoading={certificates.length === 0}
                          className={`form-control ${errors.no_of_certificates && "border border-danger"
                            }`}
                          id="no_of_certificates"
                          allowNegative={false}
                          placeholder="Enter Quantity"
                          disabled={certificates.length === 0}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_of_certificates?.message}
                    </small>
                    <small className="text-danger">
                      {errors.no_of_certificates?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="shares">No of Collective Shares</label>
                    <NumberFormat
                      className="form-control"
                      id="shares"
                      decimalScale={2}
                      placeholder="Enter Number"
                      value={
                        output_certificates?.shares_count || totalSharesCount
                      }
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="new_certificate_no">
                      New Certificate No
                    </label>
                    <Controller
                      name="new_certificate_no"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${errors.new_certificate_no && "border border-danger"
                            }`}
                          id="new_certificate_no"
                          allowNegative={false}
                          placeholder="Enter Quantity"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.new_certificate_no?.message}
                    </small>
                  </div>
                  {/* Distinctive Sets */}

                  <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <label htmlFor="distinctive_from">Distinctive From</label>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      <label htmlFor="distinctive_to">Distinctive To</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      {/* Distinctive FROM */}
                      <div className="form-group ">
                        <NumberFormat
                          className="form-control"
                          id="distinctive_from"
                          decimalScale={2}
                          placeholder="Enter Number"
                          onChange={(e) => setDistinctiveFrom(e.target.value)}
                          value={distinctiveFrom}
                          readOnly={!!!distinctiveSets}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                      {/* Distinctive TO */}
                      <div className="form-group">
                        <NumberFormat
                          className="form-control"
                          id="distinctive_to"
                          decimalScale={2}
                          onChange={(e) => setDistinctiveTo(e.target.value)}
                          value={distinctiveTo}
                          placeholder="Enter Number"
                          readOnly={!!!distinctiveSets}
                        />
                      </div>
                    </div>
                  </div>
                  {!isNaN(distinctiveSets) &&
                    distinctiveSets < 5 &&
                    [...Array(distinctiveSets)].map((item) => (
                      <DistinctiveCounterItem
                        calculatedCounter={handleDistinctiveCounterClick}
                        calculated={startDistinctiveCalculation}
                      />
                    ))}
                  <div className="d-flex justify-content-center">
                    <div className="">
                      <button
                        type="button"
                        className="btn btn-success btn-xs mx-1"
                        onClick={(e) => setDistinctiveSets(distinctiveSets + 1)}
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                    </div>
                    <div className="">
                      <button
                        type="button"
                        className="btn btn-danger btn-xs mx-1"
                        onClick={(e) => {
                          distinctiveSets !== 0 &&
                            setDistinctiveSets(distinctiveSets - 1);
                        }}
                      >
                        <i className="fa fa-minus"></i>
                      </button>
                    </div>
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
                  {/* {!isNaN(parseInt(watch("no_of_certificates"))) &&
                    [...Array(parseInt(watch("no_of_certificates")))].map(
                      (cert, index) => (
                        <TransferOfSharesItem
                          certificates={certificates}
                          startCalculation={startCalculation}
                          calculated={startcalculation}
                          num={parseInt(watch("no_of_certificates")) + index}
                          df_cert={input_certificates[index].certificate_no}
                          df_from={input_certificates[index].from}
                          df_to={input_certificates[index].to}
                          df_count={input_certificates[index].shares_count}
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
              onClick={(e) => setStartcalculation(true)}
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
                <span>{"Update"}</span>
              )}
            </button>
            {/* <button
              type="button"
              className="btn btn-success mx-2"
              onClick={(e) => setStartcalculation(true)}
            >
              Calculate
            </button> */}
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default EditConsolidateShares;
