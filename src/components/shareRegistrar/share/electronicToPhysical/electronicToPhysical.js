import React, { useState, useEffect, useRef, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { errorStyles } from "../../../defaultStyles";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { getShareholders } from "../../../../store/services/shareholder.service";
import Select from "react-select";
import {
  folio_setter,
  company_setter,
  certificate_setter,
} from "../../../../store/services/dropdown.service";
import Breadcrumb from "../../../common/breadcrumb";
import { addSplitShareSchema } from "../../../../store/validations/splitShareValidation";
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
  addInvestorRequestCPH,
  addInvestorRequestSPL,
} from "../../../../store/services/investor.service";
import {
  getCompanies,
  getCertificateNo,
} from "../../../../store/services/company.service";
import {
   getShareCertificates
} from "../../../../store/services/shareCertificate.service";
import {
  getShareHoldersByCompany,
  getShareHoldersByShareholderID,
} from "../../../../store/services/shareholder.service";
import { addPhysicalToElectronicSchema } from "../../../../store/validations/physicalToElectronicValidation";
import { addElectronicToPhysicalValidation } from "../../../../store/validations/electronicToPhysicalValidation";
import SplitShareCertificateItem from "../SplitShareCertificateItem";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
} from "../../../../redux/actionTypes";
import { getCompanyById } from "../../../../store/services/company.service";
const ElectronicToPhysical = ({ setInvestorRequestForm, selectedCompany, companyName }) => {
  const baseEmail = sessionStorage.getItem("email") || "";
  // States
  const [loading, setLoading] = useState(false);
  const [distinctiveCountercdc, setDistinctiveCountercdc] = useState([]);
  const [df_snum, setDf_snum] = useState("");
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [folio_options, setFolio_options] = useState([]);
  const [to_folio_options, setTo_folio_options] = useState([]);
  const [shareHoldings, setShareHoldings] = useState([]);
  const [company_options, setCompany_options] = useState([]);
  const [cdc_certificates, setCdc_certificates] = useState([]);
  const [certificate_options, setCertificate_options] = useState([]);
  const [certificateObjects, setCertificateObjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  const [startcalculation, setStartcalculation] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [share_certificates, setShare_certificates] = useState([]);
  const [shareholders, setShareholders] = useState([]);
  const [companies_data_loading , setCompanies_data_loading] = useState(false);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_selector, setCompanies_selector] = useState([]);

  // Refs
  const requester_ref = useRef(null);
  const to_folio_ref = useRef(null);
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    reset,
  } = useForm({ resolver: yupResolver(addElectronicToPhysicalValidation) });
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
  const handleDistinctiveCounters = (array) => {
    const certificates_distinctive_array = [];
    const from_array = [];
    const to_array = [];
    array.forEach((item) => {
      const distinctive_no = share_certificates.find(
        (cert) => cert.certificate_no === item.value
      );
      certificates_distinctive_array.push(distinctive_no);

    });
    setDistinctiveCountercdc([...certificates_distinctive_array]);
  };

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
    const getAllShareCertificates = async () => {
      try {
        const response = await getShareCertificates(baseEmail);
        setShare_certificates(response.data.data);
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Companies Not Found");
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
    // getAllCompanies();
    getSelectedCompanyInfo();
    getAllShareCertificates();
  }, []);

  useEffect(() => {
    const getShareholdersByInvestorID = async () => {
      try {
        const investor_id = shareHoldings.find(
          (holding) => holding?.folio_number === watch("requester_folio").value
        )?.shareholder_id;
        const response = await getShareHoldersByShareholderID(
          baseEmail,
          investor_id
        );
        if (response.status === 200) {
          let to_folios;
          if (
            watch("requester_folio")?.value ===
            `${selectedCompany}-0`
          ) {
            to_folios = shareHoldings
              .filter(
                (h) =>
                  h.cdc_key === "NO" &&
                  h.company_code === selectedCompany &&
                  h.folio_number !== `${selectedCompany}-0`
              )
              .map((item) => {
                let label = `${item.folio_number} (${item.shareholder_name}) `;
                return { label: label, value: item.folio_number };
              });
          } else {
            to_folios = response.data.data
              .filter((h) => h.cdc_key === "NO")
              .map((item) => {
                let label = `${item.folio_number} (${item.shareholder_name}) `;
                return { label: label, value: item.folio_number };
              });
          }
          setTo_folio_options(to_folios);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Shareholders Not Found Not Found");
      }
    };
    if (!!watch("requester_folio")?.value) {
      getShareholdersByInvestorID();
      to_folio_ref.current.clearValue();
    }
  }, [watch("requester_folio")]);
  useEffect(() => {
    const getCompanyCertificateNo = async () => {
      try {
        const response = await getCertificateNo(
          baseEmail,
          selectedCompany
        );
        if (response.status === 200) {
          setDf_snum(response.data.data[0].shares_counter);
          setDistinctiveCounter(response.data.data[0].distinctive_no_counter);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Certificate No Not Found");
      }
    };
    // const getCompanyShareholders = async () => {
    //   try {
    //     const response = await getShareholders(baseEmail);
    //     if (response.status === 200) {
    //       setShareHoldings(response.data.data);
    //       let options = response.data.data
    //         .filter((h) => {
    //           return (
    //             (h.cdc_key === "YES" &&
    //               h.company_code === watch("company_code")?.value) ||
    //             h.folio_number === `${watch("company_code")}-0`
    //           );
    //         })
    //         .map((item) => {
    //           let label = `${item.folio_number} (${item.shareholder_name}) `;
    //           return { label: label, value: item.folio_number };
    //         });
    //       setFolio_options(options);
    //     }
    //   } catch (error) {
    //     !!error?.response?.data?.message
    //       ? toast.error(error?.response?.data?.message)
    //       : toast.error("Folios Not Found");
    //   }
    // };
    const getCDCcertificates = async () => {
      const cdc_certs = share_certificates
        .filter(
          (cert) => cert.allotted_to === `${selectedCompany}-0`
        )
        .map((cert) => ({
          label: cert.certificate_no,
          value: cert.certificate_no,
        }));
      setCdc_certificates(cdc_certs);
    };
    const getShareHoldersByCompanyCode = async () => {
      // setIsLoadingShareholder(true);
      try {
        const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
        if (response.status === 200) {
          const parents = response.data.data;
          setShareHoldings(parents)
          // folio_number_ref.current.clearValue();
          // setValue("split_parts", "0");
          const filterOption = parents?.filter(item=>item?.folio_number == `${selectedCompany}-0`);
          const options = filterOption
            .filter((item) => item.cdc_key === "NO")
            .map((item) => {
              let label = `${item.folio_number} (${item.shareholder_name}) `;
              return { label: label, value: item.folio_number };
            });
  
  
          setFolio_options(options);
          // setIsLoadingShareholder(false);
        }
      } catch (error) {
        // setIsLoadingShareholder(false);
        toast.error("Error fetching shareholders")
      }
    };
    if (selectedCompany) {
      // getCompanyShareholders();
      getShareHoldersByCompanyCode();
      getCompanyCertificateNo();
      getCDCcertificates();
      requester_ref.current.clearValue();
      to_folio_ref.current.clearValue();
    }
  }, []);

  const handleAddInvestorRequest = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      setLoading(true);
      const response = await addInvestorRequestCPH(
        email,
        "CPH", //   Type of Request
        data.requester_folio.value,
        data.to_folio.value,
        // data.company_code.value,
        selectedCompany,
        "", //    Symbol
        data.no_of_shares,
        certificateObjects,
        data.remarks,
        data.reference,
        data.transfer_no,
        distinctiveCountercdc,
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
                          // options={companies_dropdown}
                          id="company_code"
                          placeholder={`${selectedCompany} - ${companyName}`}
                          styles={errors.company_code && errorStyles}
                          isDisabled={true}
                          value={value}
                          // onChange={(select) => {
                          //   to_folio_ref.current.clearValue();
                          //   requester_ref.current.clearValue();
                          // }}
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
                      value="Electronic To Physical"
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
                          ref={requester_ref}
                          options={folio_options}
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
                  {/* To Folio */}
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
                  {/* Shares */}
                  <div className="form-group my-2">
                    <label htmlFor="no_of_shares">
                      No of Electronic Shares
                    </label>
                    <Controller
                      name="no_of_shares"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control text-right ${
                            errors.no_of_shares && "border border-danger"
                          }`}
                          id="no_of_shares"
                          allowNegative={false}
                          // thousandSeparator={true}
                          placeholder="Enter Quantity"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.no_of_shares?.message}
                    </small>
                  </div>
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
                      {errors.reference_no?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="cdc_certificates">
                      Select Distincive CDC Folio
                    </label>
                    <Controller
                      name="cdc_certificates"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={cdc_certificates.length === 0}
                          options={cdc_certificates}
                          id="cdc_certificates"
                          styles={errors.cdc_certificates && errorStyles}
                          placeholder={
                            !selectedCompany
                              ? "Select Company First"
                              : "Select Certificate "
                          }
                          isMulti
                          isClearable
                          isDisabled={!selectedCompany}
                          onChange={(selected) => {
                            setDistinctiveCountercdc([]);
                            setTimeout(() => {
                              !!selected
                                ? handleDistinctiveCounters(selected)
                                : handleDistinctiveCounters([]);
                            }, 20);
                          }}
                        />
                      )}
                      control={control}
                    />

                    <small className="text-danger">
                      {errors.cdc_certificates?.message}
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
          <div className="row">
            <h4>CDC Certificates</h4>
          </div>
          <div className="row my-2">
            <div className="table-responsive">
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
                  {!isNaN(distinctiveCountercdc.length) &&
                    distinctiveCountercdc.length <= 20 &&
                    distinctiveCountercdc.map((cert, index) => (
                      <SplitShareCertificateItem
                      register={register}
                        startCalculation={() => {}}
                        calculated={startcalculation}
                        num={parseInt(watch("no_of_certificates")) + index}
                        df_from={
                          IsJsonString(cert.distinctive_no) &&
                          JSON.parse(cert.distinctive_no)[0].from
                        }
                        df_to={
                          IsJsonString(cert.distinctive_no) &&
                          JSON.parse(cert.distinctive_no)[0].to
                        }
                        df_noOfShares={cert.shares_count}
                        df_snum={cert.certificate_no.split("-")[1]}
                        setValue={setValue}
                        watch={watch}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <h4>Output Certificates</h4>
          </div>
          <div className="row my-2">
            <div className="table-responsive">
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
                  {!isNaN(parseInt(watch("no_of_certificates"))) &&
                    watch("no_of_certificates") <= 20 &&
                    [...Array(parseInt(watch("no_of_certificates")))].map(
                      (cert, index) => (
                        <SplitShareCertificateItem
                        register={register}
                          startCalculation={startCalculation}
                          calculated={startcalculation}
                          num={parseInt(watch("no_of_certificates")) + index}
                          setValue={setValue}
                          watch={watch}
                        />
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row px-2 my-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !startcalculation}
              style={
                startcalculation
                  ? { cursor: "pointer" }
                  : { cursor: "not-allowed" }
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
            <button
              type="button"
              className="btn btn-success mx-2"
              onClick={(e) => setStartcalculation(true)}
            >
              Calculate
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default ElectronicToPhysical;
