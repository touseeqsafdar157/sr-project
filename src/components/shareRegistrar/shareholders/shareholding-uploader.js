import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import LoadableButton from "../../common/loadables";
import { uploadCDCfile } from "../../../store/services/shareholder.service";
import { toast } from "react-toastify";
import { JsonToTable } from "react-json-to-table";
import xls from "xlsx";
import { entriesIn, over } from "lodash-es";
import { getCompanies } from "../../../store/services/company.service";
import {
  getvalidDateYMD,
  loopmessages,
} from "../../../utilities/utilityFunctions";
const csv = require("csvtojson/v2");
var Papa = require("papaparse/papaparse.min.js");
var _ = require("lodash");
//const csv = require("convert-csv-to-json");
export default function ShareholdingUploader() {
  // User Email
  const baseEmail = sessionStorage.getItem("email") || "";
  const [companyCode, setCompanyCode] = useState("");
  const [companySymbol, setCompanySymbol] = useState("");
  const [companies, setCompanies] = useState([]);
  const [header, setHeader] = useState({});
  const [footer, setFooter] = useState({});
  const [fileData, setfileData] = useState([]);
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const [fileDataCount, setFileDataCount] = useState(0);
  const [checkFileInput, setCheckFileInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const email = sessionStorage.getItem("email") || "";
  const columns = [
    [
      "Element ID",
      "Acc No",
      "Acc Type",
      "Acc Title",
      "Father/Husband Name",
      "Address",
      "CNIC/NTN",
      "Zakat Status",
      "Share Holder Catg",
      "Residency Status",
      "Nationality",
      "Occupation Code",
      "Divident Mandate",
      "Bank Account",
      "Bank Account Title",
      "Bank Name",
      "Branch Address",
      "ShareHolding",
      "Contact",
      "Mobile No",
      "Email",
      "Registration",
      "Unknown",
    ],
  ];
  const parseFile = (file) => {
    Papa.parse(file, {
      header: false,
      complete: (result) => {
        if (result.data.length) {
          // First Row Data
          setHeader(result.data[0]);
          const companyExist = companies.find(
            (comp) => comp.isin === result.data[0][0].toString()
          );
          if (!!companyExist === false) {
            toast.error(
              `Company ${result.data[0][1]} with ISIN ${result.data[0][0]} does not exist in the system`
            );
          } else {
            setCompanyCode(companyExist?.code);
            setCompanySymbol(companyExist?.symbol);
          }
          const firstRow = result.data[0];
          setHeader({
            IsinCode: result.data[0][0],
            CompanyName: result.data[0][1],
            RegistrarCode: result.data[0][2],
            RegistrarName: result.data[0][3],
            CDCsystemLoggedInUserID: result.data[0][4],
            ReportGenDate: result.data[0][5],
            ReportGenTime: result.data[0][6],
            AsOnDate: result.data[0][7],
          });
          // Last Row Data;
          setFooter(result.data[result.data.length - 2]);
          const lastRow = result.data[result.data.length - 2];
          setFooter({
            NoOfRecords: result.data[result.data.length - 2][0],
            TotalHoldings: result.data[result.data.length - 2][1],
          });
          result.data.shift();
          result.data.pop();
          result.data.pop();

          const updatedRow = result.data.map((item) => ({
            ParticipantID: item[0],
            AccNo: item[1],
            AccType: item[2],
            AccTitle: item[3],
            FatherHusband: item[4],
            Address: `${item[5] + item[6]}`,
            City: item[7],
            CNIC: item[8],
            NTN: item[9],
            PassPortNo: item[10],
            PassPortDate: item[11],
            PassPortCountry: item[12],
            ZakatStatus: item[13],
            InvestorType: item[14],
            ResidencyStatus: item[15],
            Nationality: item[16],
            Occupation: item[17],
            BankAccountNo: item[18],
            AccountTitle: item[19],
            BankName: item[20],
            BranchAddress: item[21],
            Joint1: item[22],
            Joint1CNIC: item[23],
            Joint2: item[24],
            Joint2CNIC: item[25],
            Joint3: item[26],
            Joint3CNIC: item[27],
            ShareHolding: item[28],
            // Contact: item[30]
            Contact: item[29],
            Mobile: item[30],
            email: item[31],
            RegistrationNo: item[33] || "",
            // RoshanDigitalAccount: item[34] || "",
          }));
          setFileDataCount(updatedRow.length);
          setfileData(updatedRow);
        } else {
          toast.error("File is Empty");
        }
      },
    });
  };
  const upload = async (e) => {
    setFileError("");
    setfileData(null);

    let file = e?.target.files[0];
    let filesize = parseInt(file.size);
    let type = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (filesize <= 209715200) {
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
      } else {
        toast.error("Please Upload txt file format");
        setFileDataCount(0);
      }
    }
  };

  const sendCDCfile = async () => {
    setLoading(true);
    try {
      const response = await uploadCDCfile(
        email,
        companySymbol,
        companyCode,
        header,
        fileData.map((data) => ({
          ...data,
          PassPortDate: getvalidDateYMD(
            new Date(parseInt(Date.parse(data.PassPortDate)))
          ),
        })),
        footer
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
          : toast.error("File Not Submitted");
      }
      setLoading(false);
    } catch (error) {
      error?.response?.data?.message instanceof String
        ? toast.error(error?.response?.data?.message)
        : error?.response?.data?.message instanceof Array
        ? loopmessages(error?.response?.data?.message)
        : toast.error(error?.message);
      setLoading(false);
    }
  };
  const handleBulkUpload = async () => {
    setLoading(true);
    const email = sessionStorage.getItem("email") || "";
    try {
      // const response = await uploadCDCFile( email, fileData );
      // if (response?.status === 200) {
      //   toast.success(response.data.message);
      // }
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
    setLoading(false);
  };
  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await getCompanies(baseEmail);
        if (response.status === 200) {
          setCompanies(response.data.data);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Companies Not Found");
      }
    };
    getAllCompanies();
  }, []);
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
      <h6 className="text-nowrap mt-3 ml-3">CDC Uploader</h6>
      <Breadcrumb title="Shareholding Uploader" parent="Shareholdings" />
      </div>

      <div className="row">
        <div className="col-sm-12 col-md-12">
          <div className="card ">
            <div className="card-header b-t-primary">
              {/* <h3>CDC Uploader</h3> */}
            </div>
            <div className="card-body">
              <div className=" mb-3">
                <input
                  className="form-control"
                  name="bulkUpload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  placeholder="Upload"
                  multiple={false}
                  onClick={(e) => (e.target.value = null)}
                  onChange={(e) => {
                    upload(e);
                  }}
                />
              </div>
              <div className="my-3 d-flex flex-row justify-content-between">
                <div className="d-flex flex-column">
                  <LoadableButton
                    loading={loading}
                    title="Submit"
                    methodToExecute={sendCDCfile}
                  />
                </div>
                {/* <div className="d-flex flex-column">
                   <button type="button" className="btn btn-info mt-4">
                    {"Download Sample File"}
                  </button>
                </div> */}
              </div>
              {!!header?.AsOnDate && (
                <div className="d-flex justify-content-start ml-2">
                  <div>
                    <label>Submition Date</label>
                    <br />
                    <h5>{header.AsOnDate}</h5>
                  </div>
                </div>
              )}
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
