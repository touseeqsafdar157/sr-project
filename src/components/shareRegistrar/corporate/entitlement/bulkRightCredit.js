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
import { getCorporateAnnouncement } from "store/services/corporate.service"
import { getvalidDateYMD, loopmessages } from "utilities/utilityFunctions";
import { errorStyles } from "components/defaultStyles";
// Validation Packages
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  bankDepositUpload,
  bulkRightCredit,
} from "store/services/corporate.service";
import { bulkRightCreditSchema } from "store/validations/bulkRightCreditValidation";

const csv = require("csvtojson/v2");
var Papa = require("papaparse/papaparse.min.js");
var _ = require("lodash");

//const csv = require("convert-csv-to-json");
export default function BulkRigthCredit() {
  // User Email
  const baseEmail = sessionStorage.getItem("email") || "";
  const [companyCode, setCompanyCode] = useState("");
  const [companySymbol, setCompanySymbol] = useState("");
  const [companies, setCompanies] = useState([]);
  const [announcement_dropdown, setAnnouncement_dropdown] = useState([]);
  const [fileData, setfileData] = useState([]);
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
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(bulkRightCreditSchema) });
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
    if (!announcement_data_loading && watch("company_code")?.value) {
      setAnnouncement_dropdown(
        announcement_data
          .filter((data) => data.company_code === watch("company_code")?.value)
          .filter((data) => !data.is_right_credited)
          .map((item) => {
            let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
            return { label: label, value: item.announcement_id };
          })
      );
    }
  }, [announcement_data_loading, watch("company_code")]);

  const handleBulkRightCredit = async (data) => {
    setLoading(true);
    try {
      const response = await bulkRightCredit(
        email,
        data.announcement_id?.value,
        data.company_code?.value
      );
      if (response.data?.status === 200) {
        company_ref.current.clearValue();
        announcement_ref.current.clearValue();
        toast.success(response.data.message);
      } else {
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
      <h6 className="text-nowrap mt-3 ml-3">Bulk Right Credit</h6>
      <Breadcrumb title="Bulk Right Credit" parent="Corporate" />
       </div>

      <form onSubmit={handleSubmit(handleBulkRightCredit)}>
        <div className="row">
          <div className="col-sm-12 col-md-12">
            <div className="card ">
              <div className="card-header b-t-primary">
                {/* <h3>Bulk Right Credit</h3> */}
              </div>
              <div className="card-body">
                <div className="row">
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
                            placeholder="Select Company"
                            styles={errors.company_code && errorStyles}
                            ref={company_ref}
                          />
                        )}
                        control={control}
                      />

                      <small className="text-danger">
                        {errors.company_code?.message}
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
                            styles={errors.announcement_id && errorStyles}
                            isDisabled={!announcement_dropdown.length}
                            ref={announcement_ref}
                          />
                        )}
                        control={control}
                      />

                      <small className="text-danger">
                        {errors.announcement_id?.message}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
