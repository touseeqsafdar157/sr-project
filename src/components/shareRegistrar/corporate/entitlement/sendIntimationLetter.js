import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "components/common/breadcrumb";
import LoadableButton from "components/common/loadables";

import Select from "react-select";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { JsonToTable } from "react-json-to-table";
import xls from "xlsx";
import { entriesIn, over } from "lodash-es";
import { getCompanies } from "store/services/company.service";
import { getvalidDateYMD, loopmessages } from "utilities/utilityFunctions";
import { errorStyles } from "components/defaultStyles";
// Validation Packages
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { entitlementUploaderSchema } from "store/validations/entitlementUploaderValidation";
import { sendIntimationLetter } from "store/services/corporate.service";
import { intimationLetterSchema } from "store/validations/intimationLetterValidation";

const csv = require("csvtojson/v2");
var Papa = require("papaparse/papaparse.min.js");
var _ = require("lodash");

//const csv = require("convert-csv-to-json");
export default function SendIntimationLetter() {
  // Selectors
  const { companies_dropdown, companies_data_loading } = useSelector(
    (data) => data.Companies
  );
  const { announcement_data, announcement_data_loading } = useSelector(
    (data) => data.Announcements
  );
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
  const email = sessionStorage.getItem("email") || "";

  // Form Validation
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(intimationLetterSchema) });
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
    if (!announcement_data_loading && watch("company_code")?.value) {
      setAnnouncement_dropdown(
        announcement_data
          .filter((data) => data.company_code === watch("company_code")?.value)
          .map((item) => {
            let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
            return { label: label, value: item.announcement_id };
          })
      );
    }
  }, [announcement_data_loading, watch("company_code")]);
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
    }
  };

  const handleIntimationLetter = async (data) => {
    setLoading(true);
    try {
      const response = await sendIntimationLetter(
        email,
        data.announcement_id?.value,
        data.company_code?.value
      );
      if (response.data?.status === 200) {
        toast.success(response.data.message);
      } else {
        response?.data?.message
          ? toast.error(response?.data?.message)
          : response?.data?.message instanceof String
          ? toast.error(response?.data?.message)
          : response?.data?.message instanceof Array
          ? loopmessages(response?.data?.message)
          : toast.error("Intimation Letter Not Sent");
      }
      setLoading(false);
    } catch (error) {
      error?.response?.data?.message instanceof String
        ? toast.error(error?.response?.data?.message)
        : error?.response?.data?.message instanceof Array
        ? loopmessages(error?.response?.data?.message)
        : toast.error("Intimation Letter Not Sent");
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
      <h6 className="text-nowrap mt-3 ml-3">Send Intimation Letter</h6>
      <Breadcrumb title="Intimation Letter" parent="Corporate" />
      </div>

      <form onSubmit={handleSubmit(handleIntimationLetter)}>
        <div className="row">
          <div className="col-sm-12 col-md-12">
            <div className="card ">
              <div className="card-header b-t-primary">
                {/* <h3>Send Intimation Letter</h3> */}
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-12 col-md-6 col-lg-6">
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
                          />
                        )}
                        control={control}
                      />

                      <small className="text-danger">
                        {errors.company_code?.message}
                      </small>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
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
                  {/* <div className="d-flex flex-column">
                   <button type="button" className="btn btn-info mt-4">
                    {"Download Sample File"}
                  </button>
                </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
