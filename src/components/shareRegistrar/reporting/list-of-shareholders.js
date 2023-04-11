import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import Select from "react-select";
import Spinner from "components/common/spinner";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { darkStyle, disabledStyles } from "components/defaultStyles";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorStyles } from "components/defaultStyles";
import { intimationLetterSchema } from "store/validations/intimationLetterValidation";
import { getCompanies } from "store/services/company.service";
import { getShareHoldersByCompany } from "store/services/shareholder.service";
import { getInvestors } from "store/services/investor.service";
import { indexOf, isNumber } from "lodash";
import ConsolidateShares from "../share/consolidateShares/consolidateShares";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import ReportHeader from "./report-header";
import { numberWithCommas } from "utilities/utilityFunctions";
import moment from "moment";
import PageTemplate from "./page-template";

export default function ListOfShareholders() {
  const baseEmail = sessionStorage.getItem("email") || "";
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [shareholders, setShareholders] = useState([]);
  const [shareholder_data_loading, setShareholder_data_loading] =
    useState(false);
  const [selectedShareholder, setSelectedShareholder] = useState("");
  const [serachedShareholders, setSearchedShareholders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyDetail, setSelectedCompanDetail] = useState({});
  const [investors, setInvestors] = useState([]);
  const [isInvestorData, setIsInvestorData] = useState(null);
  const [totalShareholding, setTotalShareholding] = useState("");
  const [totalShareholdingPercentage, setTotalShareholdingPercentage] =
    useState("");
  const [freeFloatPercentage, setFreeFloatPercentage] = useState("");

  const pdfExportComponent = React.useRef(null);
  // Form Validation
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(intimationLetterSchema) });

  const getAllCompanies = async () => {
    setCompanies_data_loading(true);
    try {
      const response = await getCompanies(baseEmail);
      if (response.status === 200) {
        const companies_dropdowns = response.data.data.map((item) => {
          let label = `${item.code} - ${item.company_name}`;
          return { label: label, value: item.code };
        });
        setCompanies(response.data.data);
        setCompanies_dropdown(companies_dropdowns);
        setCompanies_data_loading(false);
        setLoading(false);
      }
    } catch (error) {
      setCompanies_data_loading(false);
      setLoading(false);
    }
  };

  const getAllInvestors = async () => {
    try {
      setIsInvestorData(true)
      const response = await getInvestors(baseEmail);
      if (response.status === 200) {
        setInvestors(response.data.data);
      } else {
        setInvestors([]);
      }
    } catch (error) {}
    setIsInvestorData(false)

  };

  useEffect(() => {
    getAllInvestors();
    getAllCompanies();
  }, []);

  const toFixedPercent = (val, decimals)=>{
    let parts = val.toString().split(".");
    return parseFloat(parts[0] + "." + parts[1].substring(0, decimals));
}

  const getAllShareHolders = async () => {
    setShareholder_data_loading(true);
    setLoading(true);
    try {
      const response = await getShareHoldersByCompany(
        baseEmail,
        selectedCompany
      );
      if (response.status === 200) {
        setShareholders(response.data.data);
        let array = [];
        for (let i = 0; i < investors.length; i++) {
          for (let j = 0; j < response.data.data.length; j++) {
            if (
              investors[i].investor_id ==
                response.data.data[j].shareholder_id &&
              investors[i].investor_id.split("-")[1] !== "0"
            ) {
              array.push({
                ...response.data.data[j],
                father_name: investors[i].father_name,
                cnic: investors[i].cnic ? investors[i].cnic : "",
                ntn: investors[i].ntn ? investors[i].ntn : ""
              });
            }
          }
        }

        // calculate total holding
        let totalValue = 0;
        const updatedArray = array.map((item) => {
          let shareholdings =
            parseInt(item.physical_shares.replaceAll(",", "")) +
            parseInt(item.electronic_shares.replaceAll(",", ""));

          totalValue +=
            parseInt(item.physical_shares.replaceAll(",", "")) +
            parseInt(item.electronic_shares.replaceAll(",", ""));
          return { ...item, shareholding: shareholdings };
        }).filter((s) => parseInt(s.physical_shares) > 0 || parseInt(s.electronic_shares) > 0);

        // const totalHolding = response.data.data.reduce((row1, row2)=> parseFloat(row1.physical_shares) + parseFloat(row2.physical_shares),initialValue)

        let total_holding_per = 0;
        let updatedShareholders = updatedArray.map((item) => {
          let per = (+item.shareholding / totalValue) * 100;
          total_holding_per += per;
          return { ...item, percentage: toFixedPercent(per,3) };
        }).sort((a,b) => parseInt(b.shareholding) - parseInt(a.shareholding));
        setShareholders(updatedShareholders);
        setTotalShareholding(totalValue.toString());
        setTotalShareholdingPercentage(total_holding_per.toFixed(3).toString());
        let free_float_per =
          (+selectedCompanyDetail.free_float / total_holding_per) * 100;
        setFreeFloatPercentage(free_float_per.toFixed(3));
        // setShareholders(mapped_shareholders);
        setShareholder_data_loading(false);
      }
    } catch (error) {
      setShareholder_data_loading(false);
    }
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">List of Shareholders</h6>
        <Breadcrumb title="List of Shareholders" parent="Reporting" />
      </div>

      <div className="container-fluid">
        <div className="card">
          <div className="card-header ">
            <div className="d-flex justify-content-between">
              <h5></h5>
              <button
                className="btn btn-danger"
                onClick={(e) => {
                  if (pdfExportComponent.current) {
                    pdfExportComponent.current.save();
                  }
                }}
              >
                <i className="fa fa-file-pdf-o mr-1"></i>Print PDF
              </button>
            </div>
            <div className="row mt-2">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="searchTransaction">Select Company</label>
                  <Select
                    options={companies_dropdown}
                    isLoading={companies_data_loading === true}
                    onChange={(selected) => {
                      const filter = companies.filter((item) => {
                        return item.code === selected.value;
                      });
                      setSelectedCompanDetail(filter[0]);
                      !!selected?.value && setSelectedCompany(selected.value);
                      !selected && setSelectedCompany("");
                      selectedOptions.length = 0;
                      setSelectedOptions(selectedOptions);
                    }}
                    isClearable={true}
                    styles={darkStyle}
                  />
                  {!selectedCompany && (
                    <small className="text-dark">
                      Select Company to check shareholder
                    </small>
                  )}
                </div>
              </div>
              <div className="col-md-3 mt-4">
                <button
                  className="btn btn-success ml-3"
                  onClick={(e) => getAllShareHolders()}
                  disabled={isInvestorData}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
          {shareholder_data_loading === true && <Spinner />}
          {shareholders.length > 0 ? (
            <PDFExport
              paperSize="A4"
              margin="1.5cm"
              scale={0.6}
              fileName={`List of Shareholders (${selectedCompanyDetail.company_name})`}
              pageTemplate={PageTemplate}
              ref={pdfExportComponent}
            >
              <ReportHeader
                title="Shareholder Details"
                logo={selectedCompanyDetail.logo}
              />
              <h5
                className="text-center"
                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
              >
                List of Shareholders
              </h5>
              <div
                className="text-center"
                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
              >
                Company:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {selectedCompanyDetail.company_name}
                </span>
              </div>
              {shareholders.length > 0 && (
                <>
                  <div className="table-responsive">
                    <table
                      className="table"
                      style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#2E75B5",
                        }}
                      >
                        <th style={{ color: "white" }} className="text-nowrap">
                          S#
                        </th>
                        <th style={{ color: "white" }} className="text-nowrap">
                          FOLIO #
                        </th>
                        <th style={{ color: "white" }} className="text-nowrap">
                          NAME
                        </th>
                        <th style={{ color: "white" }} className="text-nowrap">
                          FATHER NAME
                        </th>
                        <th style={{ color: "white" }} className="text-nowrap">
                          ADDRESS
                        </th>
                        <th style={{ color: "white" }} className="text-nowrap">
                          CNIC/NTN
                        </th>
                        <th
                          style={{ color: "white" }}
                          className="text-nowrap text-right"
                        >
                          SHAREHOLDING
                        </th>
                        <th
                          style={{ color: "white" }}
                          className="text-nowrap text-right"
                        >
                          PERCENTAGE
                        </th>
                      </thead>
                      <tbody>
                        {shareholders.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.folio_number?.replace(`${selectedCompany}-`, ' ')}</td>
                              <td>{item.shareholder_name}</td>
                              <td>{item.father_name}</td>
                              <td>{item.street_address} { item?.street_address?.includes(item?.city) ? '' : item?.city}</td>
                              <td>
                                {item.cnic
                                  ? item.cnic
                                  : item.ntn
                                  ? item.ntn
                                  : ""}
                              </td>
                              <td className="text-right">
                                {numberWithCommas(item.shareholding)}
                              </td>
                              <td className="text-right">
                                {item.percentage + "%"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2}></td>
                          <td colSpan={4}>Total</td>
                          <td className="text-right">
                            {numberWithCommas(totalShareholding)}
                          </td>
                          <td className="text-right">
                            {totalShareholdingPercentage}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                    <hr />
                  </div>
                </>
              )}

              <div
                className="row"
                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
              >
                <div className="col-md-6">
                  <div
                    className="card-header text-center"
                    style={{
                      backgroundColor: "#2E75B5",
                      color: "white",
                    }}
                  >
                    COMPANY PROFILE
                  </div>
                  <div className="card-body">
                    <div>Key Role</div>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: "bold", padding: "8px" }}>
                            {selectedCompanyDetail.ceo_name}
                          </td>
                          <td>CEO</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold", padding: "8px" }}>
                            {selectedCompanyDetail.company_secretary}
                          </td>
                          <td>Company Secretary</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="card-header text-center"
                    style={{
                      backgroundColor: "#2E75B5",
                      color: "white",
                    }}
                  >
                    EQUITY PORTFOLIO
                  </div>
                  <div className="card-body text-center">
                    <div></div>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: "bold", padding: "8px" }}>
                            Share
                          </td>
                          <td>{numberWithCommas(totalShareholding)}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold", padding: "8px" }}>
                            Free Float
                          </td>
                          <td>
                            {selectedCompanyDetail.free_float === ""
                              ? "0"
                              : selectedCompanyDetail.free_float}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold", padding: "8px" }}>
                            Free Float%
                          </td>
                          <td>
                            {(((parseFloat(selectedCompanyDetail.free_float || '0') / parseFloat(totalShareholding || '0')) * 100))=== ""
                              ? "0"
                              : (((parseFloat(selectedCompanyDetail.free_float || '0') / parseFloat(totalShareholding || '0')) * 100).toFixed(4))}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <hr />

              <div
                className="row"
                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
              >
                <div className="col-md-6">
                  <div
                    className="card-header text-center"
                    style={{
                      backgroundColor: "#2E75B5",
                      color: "white",
                    }}
                  >
                    ADDRESS
                  </div>
                  <div className="card-body text-center">
                    LSE Plaza, 19- Khayaban-E-Aiwan-E-Iqbal, Lahore
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="card-header text-center"
                    style={{
                      backgroundColor: "#2E75B5",
                      color: "white",
                    }}
                  >
                    D-REGISTRAR
                  </div>
                  <div className="card-body text-center">
                    Digital Custodian Company Limited
                  </div>
                </div>
              </div>
            </PDFExport>
          ) : (
            <>
              <p className="text-center">
                <b>Shareholder Data not available</b>
              </p>
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
}
