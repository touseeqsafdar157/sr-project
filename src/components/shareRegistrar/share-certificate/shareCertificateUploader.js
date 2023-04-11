import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { JsonToTable } from "react-json-to-table";
import { saveAs } from "file-saver";
import Select from "react-select";
import {
  fitToColumn,
  getvalidDateDMonthY,
  getvalidDateDMY,
  loopmessages,
  s2ab,
  validateFile,
} from "../../../utilities/utilityFunctions";
import xls from "xlsx";
import { refreshTokenHandler } from "../../../store/services/auth.service";
import moment from "moment";
import { getCompanies } from "../../../store/services/company.service";
import { EMPLOYEES_FILE } from "../../../constant";
import { indexOf } from "lodash-es";
import { shareHoldingBulkUpload } from "../../../store/services/shareholder.service";
import { darkStyle, errorStyles } from "../../defaultStyles";
import { uploadShareCertificate } from "../../../store/services/shareCertificate.service";
const csv = require("csvtojson/v2");
var _ = require("lodash");

export default function CertificateUploader() {
  const baseEmail = sessionStorage.getItem("email") || "";
  const [showIssues, setShowIssues] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [issuesInFile, setIssuesInFile] = useState([]);
  const [fileData, setfileData] = useState([]);
  const [modFileData, setModFileData] = useState([]);
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const [chkData, setChkData] = useState([]);
  const [fileDataCount, setFileDataCount] = useState(0);
  const [checkFileInput, setCheckFileInput] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [companies, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const columns = [
    ["Folio No", "Certificate No", "From", "To", "Shares Count", "Status"],
  ];
  const handleDownloadSampleFile = () => {
    const work_book = xls.utils.book_new();
    work_book.Props = {
      Title: "Share Certicates File",
      Subject: "Upload Share Certicates",
      Author: "Digital Custodian",
      CreatedDate: new Date(),
    };
    work_book.SheetNames.push("Share Certicates");

    const sheet_data = xls.utils.aoa_to_sheet(columns);
    sheet_data["!cols"] = fitToColumn(columns);
    work_book.Sheets["Share Certicates"] = sheet_data;
    const work_book_export = xls.write(work_book, {
      bookType: "xlsx",
      type: "binary",
    });
    saveAs(
      new Blob([s2ab(work_book_export)], { type: "application/octet-stream" }),
      "Share Certicates Sample File.xlsx"
    );
  };
  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try{
      const response = await getCompanies(baseEmail)
      if (response.status===200) {
            const parents = response.data.data
            const companies_dropdowns = response.data.data.map((item) => {
              let label = `${item.code} - ${item.company_name}`;
              return { label: label, value: item.code };
            });
          setCompanies_dropdown(companies_dropdowns);
            setCompanies_data(parents)
            setCompanies_data_loading(false);
      } }catch(error) {
        setCompanies_data_loading(false);
      }
      };
      getAllCompanies();

  }, [])
  const upload = async (e) => {
    setFileError("");
    setfileData(null);
    let file = e?.target.files[0];
    let filesize = parseInt(file.size);
    if (filesize <= 2097152) {
      let type = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (type === "csv") {
        //code here
        setFile(file);
        setFileName(file.name);
        //start
        let jsonarray = [];
        csv()
          .fromFile(file.path)
          .then((jsonObj) => {
            jsonarray = jsonObj;
            jsonarray.forEach((element) => {});
            setfileData(jsonarray);
            setFileDataCount(jsonarray.length);
          });

        //end
      } else if (type === "xlsx") {
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
            header: 2,
            raw: false,
            dateNF: "YYYY-MM-DD",
            defval:"",
          });
          /* Update state */

          //  let jsonarray:any = [];
          setfileData(data);

          setFileDataCount(data.length);
          setCheckFileInput(true);
          const newData = data.map((item) => {
            return _.mapKeys(item, (value, key) => {
              return key.replaceAll(" ", "");
            });
          });
          setModFileData(newData);
          // Check If Company Exist
        };
        if (rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
        // end 2
      } else {
        toast.error("Please Upload Correct Format of File");
        setFileDataCount(0);
      }
    } else {
      toast.error("File size should be less than 2MB");
      setFileDataCount(0);
    }
  };
  const validateFields = () => {
    if (!checkFileInput) {
      toast.error("Please Upload File First");
      return false;
    }
    if (selectedCompany === "") {
      toast.error("Please Select Company");
      return false;
    }
    // toast.success("File is Getting Uploaded");
    return true;
  };
  const handleBulkUpload = async () => {
    if (validateFields()) {
      try {
        const email = sessionStorage.getItem("email") || "";
        setLoading(true);
        const response = await uploadShareCertificate(
          email,
          selectedCompany,
          modFileData
        );
        if (response?.status === 200) {
          toast.success(response.data.message);
          setfileData([]);
          setModFileData([]);
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
    }
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
      <h6 className="text-nowrap mt-3 ml-3">Bulk Upload</h6>
      <Breadcrumb title="Share Certificate Uploader" parent="Shareholdings" />
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-12">
          <div className="card ">
            <div className="card-header b-t-primary">
              {/* <h5>Bulk Upload</h5> */}
            </div>
            <div className="card-body">
              <div className="my-3 row">
                <div className="col-md-6">
                  <label htmlFor="company">Company</label>
                  <Select
                    isLoading={companies_dropdown.length === 0}
                    options={companies_dropdown}
                    onChange={(selected) => setSelectedCompany(selected.value)}
                    id="parent"
                    placeholder="Select Company"
                    styles={darkStyle}
                  />
                </div>

                <div className="col-md-6">
                  <label>Bulk Upload</label>
                  <input
                    className="form-control"
                    name="bulkUpload"
                    type="file"
                    placeholder="Upload"
                    multiple={false}
                    onChange={(e) => {
                      upload(e);
                    }}
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                  />
                </div>
              </div>
              <div className="my-3 d-flex flex-row justify-content-between">
                <div className="d-flex flex-column">
                  <button
                    type="button"
                    className="btn btn-primary mt-4"
                    onClick={handleBulkUpload}
                    disabled={Boolean(Loading)}
                  >
                    {Loading ? (
                      <>
                        <span className="fa fa-spinner fa-spin"></span>
                        <span>{"Loading..."}</span>
                      </>
                    ) : (
                      <span>{"Upload"}</span>
                    )}
                  </button>
                </div>
                <div className="d-flex flex-column">
                  <button
                    type="button"
                    className="btn btn-info mt-4"
                    onClick={(e) => handleDownloadSampleFile()}
                  >
                    {"Download Sample File"}
                  </button>
                </div>
              </div>
              {/* {showIssues && (
                <div className="my-3 d-flex flex-row justify-content-between">
                  <div
                    className="alert alert-danger fade show w-75"
                    role="alert"
                  >
                    <h5 className="alert-heading">
                      <b>Issues In File</b>
                    </h5>
                    <ul className="issue-list">
                      {issuesInFile.length > 0 &&
                        issuesInFile.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              )} */}
              {/* start */}
              {fileDataCount <= 0 ? (
                ""
              ) : (
                <div className="table-responsive mt-3">
                  <JsonToTable json={fileData} />
                </div>
              )}
              Total Rows: <span className="text-primary">{fileDataCount} </span>
              {/* end */}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
