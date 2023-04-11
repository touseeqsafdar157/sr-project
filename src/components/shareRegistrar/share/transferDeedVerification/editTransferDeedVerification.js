import React, { useState, useEffect, Fragment, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
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

import { getvalidDateYMD, IsJsonString } from "../../../../utilities/utilityFunctions";
import { toast } from "react-toastify";
import CertificateItem from "../../share-certificate/certificateItem";
import {
  addTransferDeedVerificationSchema,
  updateTransferDeedVerificationSchema,
} from "../../../../store/validations/transferDeedValidation";
import TransferOfSharesItem from "../transferOfSharesItem";
import { getShareCertificatesByFolio } from "../../../../store/services/shareCertificate.service";
import {
  addInvestorRequest,
  addInvestorRequestTOS,
  addInvestorRequestVTD,
  editInvestorRequestVTD,
} from "../../../../store/services/investor.service";
import {
  getCertificateNo,
  getCompanies,
} from "../../../../store/services/company.service";
import {
  getShareHolderByFolioNo,
  getShareHoldersByCompany,
} from "../../../../store/services/shareholder.service";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import { getShareholders } from "store/services/shareholder.service";
import ViewSplitShareCertificateItem from "../viewSplitCertificateItem";

const EditTransferDeedVerification = ({ setInvestorRequestForm }) => {
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
  console.log(request, " input_certificates:", input_certificates)
  // States
  const [loading, setLoading] = useState(false);
  const [folio_options, setFolio_options] = useState([]);
  const [attachment, setAttachment] = useState(request.attachments);
  const [df_snum, setDf_snum] = useState("");
  const [shareholder, setShareHolder] = useState(null);
  const [company_options, setCompany_options] = useState([]);
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] =
    useState(input_certificates);

  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesDropdown, setCertificatesDropdown] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [companies_selector, setCompanies_selector] = useState([]);
  const [shareholders, setAllShareholders] = useState([]);
  const [inactive_shareholders_data, setInactive_shareholders_data] = useState([])
  const [inactive_shareholders_data_loading, setInactive_shareholders_data_loading] = useState(false);
  // Validation Declarations
  //Refs
  const transferor_ref = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: updateTransferDeedVerificationSchema(request).cast(),
    resolver: yupResolver(updateTransferDeedVerificationSchema(request)),
  });
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
      }
    }, [JSON.stringify(watch(`input_certificates`))]);

  useEffect(() => {
    const getAllShareCertificates = async () => {
      try {
        setCertificatesLoading(true);
        const response = await getShareCertificatesByFolio(
          baseEmail,
          watch("transferor_folio_no").value
        );
        if (response.status === 200) {
          const activeCertificates = response.data.data.filter((item) => {
            if (item.status == 'ACTIVE') {
              return {
                label: item.certificate_no,
                value: item.certificate_no
              }
            }
          })
          activeCertificates.map((item) => {
            item.distinctive_no = JSON.parse(item.distinctive_no).map((item) => {
              item.from = item.from.toString();
              item.to = item.to.toString();
              return item;
            });
            return item;
          })
          setCertificates(activeCertificates);
          setCertificatesDropdown(
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
    if (!!watch("transferor_folio_no")?.value) {
      getAllShareCertificates();
    }
  }, [JSON.stringify(watch('transferor_folio_no'))]);

  const startCalculation = (certificate) => { };
  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await getCompanies(baseEmail);
        setCompanies_selector(response.data.data);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Companies Not Found");
      }
    };
    getAllCompanies();
  }, []);
  useEffect(() => {
    const getShareHoldersByCompanyCode = async () => {
      setInactive_shareholders_data_loading(true);
      try {
        const response = await getShareHoldersByCompany(baseEmail, watch("company_code")?.value, "");
        if (response.status === 200) {
          const parents = response.data.data
          setInactive_shareholders_data(parents)
          const filterParents = parents?.filter(item => item?.cdc_key == 'NO');
          const options = filterParents
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
    getShareHoldersByCompanyCode()
  }, [])
  useEffect(() => {
    // const getAllShareCertificates = async () => {
    //   try {
    //     const response = await getShareCertificatesByFolio(
    //       baseEmail,
    //       watch("transferor_folio_no").value
    //     );
    //     if (response.status === 200) {
    //       setCertificates(
    //         response.data.data.filter((cert) => cert?.td_verified === "false")
    //       );
    //     }
    //   } catch (error) {
    //     !!error?.response?.data?.message
    //       ? toast.error(error?.response?.data?.message)
    //       : console.log("Certificates Not Found");
    //   }
    // };
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
      getShareholder();
      // getAllShareCertificates();
    }
  }, [watch("transferor_folio_no")]);

  useEffect(() => {
    const getSharesCount = () => {
      setTotalSharesCount(
        certificateObjects
          .map((obj) => parseInt(obj?.shares_count.replace(/,/g, "")) || 0)
          .reduce((prev, curr) => prev + curr, 0)
      );
    };
    if (startcalculation) {
      getSharesCount();
    }
  }, [startcalculation]);
  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    setLoading(true);

    try {
      const response = await editInvestorRequestVTD(
        email,
        "VTD", //   Type of Request
        data.transferor_folio_no.value, // FROM
        data.company_code.value,
        companies_selector.find(
          (comp) => comp.code === data.company_code.value
        )?.symbol, //    Symbol
        totalSharesCount.toString(),
        data.request_date,
        [attachment],
        certificateObjects,
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
            <div className="col-md-6 col-sm-12">
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
                  {/* Request Type */}
                  <div className="form-group my-2">
                    <label>Request Type</label>
                    <input
                      className="form-control"
                      type="text"
                      name="request_type"
                      id="request_tyoe"
                      value="Transfer Deed Verification"
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
                  <div className="form-group my-2">
                    <label htmlFor="request_date">Request Date</label>
                    <input
                      type="date"
                      name="request_date"
                      id="request_date"
                      {...register("request_date")}
                      className={`form-control ${errors.request_date && "border border-danger"
                        }`}
                    // readOnly
                    />
                    <small className="text-danger">
                      {errors.request_date?.message}
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
                            id="transferor_folio_no"
                            isLoading={inactive_shareholders_data_loading}
                            options={folio_options}
                            ref={transferor_ref}
                            styles={errors.transferor_folio_no && errorStyles}
                            placeholder={
                              !watch("company_code")?.value
                                ? "Select Company First"
                                : "Select Folio Number"
                            }
                            onChange={(e) => {
                              if (watch('no_of_certificates') !== undefined) {
                                setValue("no_of_certificates", '0');
                              }
                            }}
                            isDisabled={!watch("company_code")?.value}
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
                          className={`form-control ${errors.no_of_certificates && "border border-danger"
                            }`}
                          id="no_of_certificates"
                          allowNegative={false}
                          readOnly={certificates.length === 0}
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
                      value={request.quantity}
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
                      name="remarks"
                      id="remarks"
                      placeholder="Enter Remarks"
                      {...register("remarks")}
                      className={`form-control ${errors.remarks && "border border-danger"
                        }`}
                    // readOnly
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
                        <b>{`Shareholder has ${certificates.length} certiifcates`}</b>
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
                          certificates && certificates?.find(
                            (cert) =>
                              cert?.certificate_no ===
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
                          certificates && certificates.find(
                            (cert) =>
                              cert?.certificate_no ===
                              watch(
                                `input_certificates[${index}]certificate_no`
                              )?.value
                          )?.distinctive_no
                            .map((dist) => (
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
                        <ViewSplitShareCertificateItem
                          startCalculation={startCalculation}
                          calculated={true}
                          num={parseInt(watch("no_of_certificates")) + index}
                          distinctive_no={
                            input_certificates[index].distinctive_no
                          }
                          df_snum={input_certificates[index].certificate_no}
                          df_noOfShares={input_certificates[index].shares_count}
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
            // disabled={loading}
            // style={!loading ? { cursor: "pointer" } : { cursor: "not-allowed" }}
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
        {/* <DevTool control={control} /> */}
      </div>
    </Fragment>
  );
};

export default EditTransferDeedVerification;
