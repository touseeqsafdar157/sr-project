import React, { Fragment, useEffect, useState, useRef } from "react";
import Breadcrumb from "components/common/breadcrumb";
import LoadableButton from "components/common/loadables";

import Select from "react-select";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { JsonToTable } from "react-json-to-table";
import xls from "xlsx";
import { entriesIn, over } from "lodash-es";
import { getCompanies } from "store/services/company.service";
import {
  fitToColumn,
  generateExcel,
  getvalidDateYMD,
  loopmessages,
} from "utilities/utilityFunctions";
import { errorStyles } from "components/defaultStyles";
// Validation Packages
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bankDepositUpload } from "store/services/corporate.service";
import { bankDepositUploaderSchema } from "store/validations/bankDepositUploaderValidation";
import { getCorporateAnnouncement } from "store/services/corporate.service"
const csv = require("csvtojson/v2");
var Papa = require("papaparse/papaparse.min.js");
var _ = require("lodash");

//const csv = require("convert-csv-to-json");
export default function BankDepositUploader() {
  // User Email
  const baseEmail = sessionStorage.getItem("email") || "";
  const [companyCode, setCompanyCode] = useState("");
  const [companySymbol, setCompanySymbol] = useState("");
  const [companies, setCompanies] = useState([]);
  const [announcement_dropdown, setAnnouncement_dropdown] = useState([]);
  const [fileData, setfileData] = useState([]);
  const [modFileData, setModFileData] = useState([]);
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const [fileDataCount, setFileDataCount] = useState(0);
  const [checkFileInput, setCheckFileInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([])
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [announcement_data, setAnnouncement_data] = useState([])
  const [announcement_data_loading, setAnnouncement_data_loading] = useState(false);
  const email = sessionStorage.getItem("email") || "";
  const [selectCompany, setSelectComapny] = useState('');
  const [selectAnnouncement, setSelectAnnounceMent] = useState('');
  const [isError, setIsError] = useState(false) 
  const [errorCompany, setErrorSelectCompany] = useState(false);
  // REFS
  const announcement_ref = useRef(null);
  const company_ref = useRef(null);
  // Form Validation
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    resetField,
  } = useForm({ resolver: yupResolver(bankDepositUploaderSchema) });
  const parseFile = (file) => {
    Papa.parse(file, {
      header: false,
      complete: (result) => {
        if (result.data.length) {
          result.data.shift();
          result.data.pop();
          result.data.pop();

          const updatedRow = result.data.map((item) => ({
            participant_id: item[0],
            description: item[1],
            acc_no: item[2],
            shareholding: item[5],
            entitlements_offered: item[6],
            rights_offered: item[7],
            r_fraction: item[8],
            b_fraction: "",
            bonus_offered: "",
          }));
          setFileDataCount(updatedRow.length);
          setfileData(updatedRow);
        } else {
          toast.error("File is Empty");
        }
      },
    });
  };
  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try{
      const response = await getCompanies(baseEmail)
      if (response.status===200) {
            const companies_dropdowns = response.data.data.map((item) => {
              let label = `${item.code} - ${item.company_name}`;
              return { label: label, value: item.code };
            });
          setCompanies_dropdown(companies_dropdowns);
            setCompanies_data_loading(false)
      } }catch(error) {
        setCompanies_data_loading(false);
      }
      };
        const getAllCorporateAnnouncement = async () => {
          setAnnouncement_data_loading(true);
          try{
          const response = await getCorporateAnnouncement(baseEmail)
          if (response.status===200) {
                const announcement_dropdowns = response.data.data.map((item) => {
                  let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
                  return { label: label, value: item.announcement_id };
                });
                setAnnouncement_data(response.data.data)
                setAnnouncement_dropdown(announcement_dropdowns)
                setAnnouncement_data_loading(false)
          } }catch(error) {
            setAnnouncement_data_loading(false);
          }
          };
  getAllCompanies();
  getAllCorporateAnnouncement();

}, [])

  useEffect(() => {
    if (!announcement_data_loading && selectCompany) {
      setAnnouncement_dropdown(
        announcement_data
          .filter((data) => data.company_code === selectCompany)
          .map((item) => {
            let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
            return { label: label, value: item.announcement_id };
          })
      );
    }
  }, [announcement_data_loading, selectCompany]);
  const upload = async (e) => {
    setFileError("");
    setfileData(null);

    let file = e?.target.files[0];
    let filesize = parseInt(file.size);
    let type = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (type === "csv") {
      parseFile(file);
      //code here
      setFile(file);
      setFileName(file.name);
      //start
      let jsonarray = [];
      // Send Request
      setCheckFileInput(true);
    } else if (type === "txt") {
      parseFile(file);
    } else if (type === "xlsx" || type === "xls") {
      setFile(file);
      setFileName(file.name);

      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target?.result;
        const wb = xls.read(bstr, { type: rABS ? "binary" : "array" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */

        // _.forEach(ws, (value, key) => {
        //   if (value?.v?.toString() !== value?.w?.toString()) {
        //     _.mapValues(value, () => {});
        //   }
        //   // _.forEach(value, (v, k) => {
        //   //   if(k=="w")
        //   // });
        // });
        const data = xls.utils.sheet_to_json(ws, {
          range: 4,
          raw: false,
          dateNF: "YYYY-MM-DD",
          defval:"",
        });
        /* Update state */

        //  let jsonarray:any = [];
        setfileData(data);

        setFileDataCount(data.length);
        setCheckFileInput(true);

        // Check If Company Exist
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
      // end 2
    }
  };

  const handleDownloadSampleFile = () => {
    const headings = [
      ["Bank Limited", ""],
      ["Right Shares Subscription Account", ""],
      ["Account No: ", ""],
      ["Details of Subscribers", ""],
    ];
    const columns = [
      "S.No.",
      "Branch Name and City",
      "Branch Code",
      "Name of Subscriber",
      "CNIC No. For Natural Person/ NTN for other entities",
      "Type of Shareholder",
      "Folio No. ",
      "CDC A/c",
      "CDC Sub A/c",
      "LOR/ Right Subscription Receipt No.",
      "Date of Subscription",
      "No. of Right Shares Subscribed",
      " Amount (PKR) ",
    ];
    generateExcel(
      "Bank Deposit Sample File",
      "Bank Deposit Sample File",
      "File",
      "File",
      "DCCL",
      headings,
      columns,
      [""]
    );
  };
  const handleBankDepositUploader = async (data) => {
   
    if(!selectCompany)
    {
      setErrorSelectCompany(true)
      return
    }
    else{
      setErrorSelectCompany(false)
    }
    if(!selectAnnouncement)
    {
      setIsError(true)
      return
    }
    else{
      setIsError(false)
    }
    try {
      setLoading(true);
      const response = await bankDepositUpload(
        email,
        selectAnnouncement,
        selectCompany,
        data.bank_deposit_date,
        fileData.map((item) => ({
          serial_no: item["S.No."] || "",
          branch_name: item["Branch Name and City"] || "",
          branch_code: item["Branch Code"] || "",
          subscriber_name: item["Name of Subscriber"] || "",
          investor_key:
            item["CNIC No. For Natural Person/ NTN for other entities"] || "",
          type_of_shareholder: item["Type of Shareholder"] || "",
          folio_number: item["Folio No. "] || "",
          cdc_account: item["CDC A/c"] || "",
          cdc_sub_account: item["CDC Sub A/c"] || "",
          right_sub_script_no:
            item["LOR/ Right Subscription Receipt No."] || "",
          date_of_subscription: item["Date of Subscription"] || "",
          right_shares_subscribed: item["No. of Right Shares Subscribed"] || "",
          amount: item[" Amount (PKR) "] || item["Amount (PKR)"] || "",
        }))
      );
      if (response.data?.status === 200) {
        toast.success(response.data.message);
        company_ref.current.clearValue();
        announcement_ref.current.clearValue();
        setIsError(false);
        setErrorSelectCompany(false);
        setSelectComapny('')
        setSelectAnnounceMent('')
        resetField("company_code");
        resetField("announcement_id");
        reset();
      } else {
        // setIsError(false)
        setIsError(false);
        setErrorSelectCompany(false);
        response?.data?.message
          ? toast.error(response?.data?.message)
          : response?.data?.message instanceof String
          ? toast.error(response?.data?.message)
          : response?.data?.message instanceof Array
          ? loopmessages(response?.data?.message)
          : toast.error("File Not Submitted");

      }
      setLoading(false);
    } catch (error) {
      setIsError(false);
      setErrorSelectCompany(false);
      // setIsError(true)
      error?.response?.data?.message instanceof String
        ? toast.error(error?.response?.data?.message)
        : error?.response?.data?.message instanceof Array
        ? loopmessages(error?.response?.data?.message)
        : toast.error("File Not Submitted");
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
      <h6 className="text-nowrap mt-3 ml-3">Bank Deposit Uploader</h6>
      <Breadcrumb title="Bank Deposit Uploader" parent="Corporate" />
       </div>

      <form onSubmit={handleSubmit(handleBankDepositUploader)}>
        <div className="row">
          <div className="col-sm-12 col-md-12">
            <div className="card ">
              <div className="card-header b-t-primary">
                <div className="d-flex justify-content-between">
                  <h4 className="flex-column">
                    {/* <b>Bank Deposit Uploader</b> */}
                  </h4>
                  <div>
                    <div className="flex-column">
                      <button
                        type="button"
                        className="btn btn-info mt-4"
                        onClick={(e) => handleDownloadSampleFile()}
                      >
                        {"Download Sample File"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-12 col-md-3 col-lg-3">
                    <div className="form-group">
                      <label htmlFor="file">CDC Entitlement File</label>
                      <input
                        className={`form-control ${
                          errors.file && "border border-danger"
                        }`}
                        name="file"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        placeholder="Upload"
                        {...register("file")}
                        multiple={false}
                        onClick={(e) => (e.target.value = null)}
                        onChange={(e) => {
                          upload(e);
                        }}
                      />
                      <small className="text-danger d-block">
                        {errors.file?.message}
                      </small>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3 col-lg-3">
                    <div className="form-group my-2">
                      <label htmlFor="company_code">Company</label>
                      <Controller
                        name="company_code"
                        render={({ field }) => (
                          <Select
                            {...field}
                            isLoading={companies_data_loading}
                            options={companies_dropdown}
                            id="company_code"
                            onChange={(selected)=>{
                              if(selected?.value) {
                                setErrorSelectCompany(false);
                                setSelectComapny(selected?.value)
                              }
                              else{
                                setSelectComapny(null)
                              }
                            }}
                            placeholder="Select Company"
                            styles={errorCompany&& errorStyles}
                            ref={company_ref}
                          />
                        )}
                        control={control}
                      />

                      <small className="text-danger">
                      {errorCompany ? 'Select Company' : ''}
                      </small>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3 col-lg-3">
                    <div className="form-group my-2">
                      <label htmlFor="announcement_id">Announcement ID</label>
                      <Controller
                        name="announcement_id"
                        render={({ field }) => (
                          <Select
                            {...field}
                            isLoading={announcement_data_loading}
                            options={announcement_dropdown}
                            id="announcement_id"
                            placeholder="Select Announcement"
                            onChange={(selected)=>{
                              if(selected?.value) {
                                setIsError(false);
                                setSelectAnnounceMent(selected?.value)
                              }
                              else{
                                setSelectAnnounceMent(null)
                              }
                            }}
                            styles={isError && errorStyles}
                            isDisabled={!announcement_dropdown.length}
                            ref={announcement_ref}
                          />
                        )}
                        control={control}
                      />

                      <small className="text-danger">
                        {isError ? 'Select Announcement' : ''}
                      </small>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3 col-lg-3">
                    <div className="form-group my-2">
                      <label htmlFor="bank_deposit_date">
                        Bank Deposit Date
                      </label>
                      <input
                        className={`form-control ${
                          errors.bank_deposit_date && "border border-danger"
                        }`}
                        name="bank_deposit_date"
                        type="date"
                        {...register("bank_deposit_date")}
                        defaultValue={getvalidDateYMD(new Date())}
                      />
                      <small className="text-danger">
                        {errors.bank_deposit_date?.message}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="my-3 d-flex flex-row justify-content-between">
                  <div className="d-flex flex-column">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={Boolean(loading)}
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
                  {/* <div className="d-flex flex-column">
                   <button type="button" className="btn btn-info mt-4">
                    {"Download Sample File"}
                  </button>
                </div> */}
                </div>
                {/* start */}
                {fileDataCount <= 0 ? (
                  ""
                ) : (
                  <div className="table-responsive mt-3">
                    <JsonToTable json={fileData} />
                  </div>
                )}
                Total Rows:{" "}
                <span className="text-primary">{fileDataCount} </span>
                {/* end */}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
