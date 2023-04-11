import React, { Fragment, useState, useEffect } from "react";
import {
    getShareHolderHistoryByCompanyandDate,
    getShareHolderPatternByCompanyandDate,
    getShareHoldersByCompany,
} from "../../../store/services/shareholder.service";
import { darkStyle } from "../../defaultStyles";
import Breadcrumb from "../../common/breadcrumb";
import { useSelector } from "react-redux";
import { getCompanies } from "../../../store/services/company.service";
import {
    generateExcel,
    getvalidDateDMonthY,
    getvalidDateDMY,
    isNumber,
    listCrud,
} from "../../../utilities/utilityFunctions";
import Select from "react-select";
import { toast } from "react-toastify";
import * as _ from "lodash";
import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";
import { numberWithCommas } from "../../../utilities/utilityFunctions";
import ReportHeader from "./report-header";
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "./page-template";
import { Chart } from "react-google-charts";
import moment from "moment";
export default function FreeFloat() {
    const pdfExportComponent = React.useRef(null);
    const baseEmail = sessionStorage.getItem("email") || "";
    const features = useSelector((data) => data.Features).features;
    const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
    const [underSearch, setUnderSearch] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [companies, setCompanies_data] = useState([]);
    const [companies_dropdown, setCompanies_dropdown] = useState([]);
    const [selectedCompanDetail, setSelectedCompanDetail] = useState([]);
    const [freeFloatData, setFreeFloatData] = useState([]);
    const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const [viewExcel, setViewExel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewPDF, setViewPDF] = useState(false);
    const [date, setDate] = useState('');
    const [totalPhysicalShare, setTotalPhysicalShare] = useState('0');
    const [totalElectronicShares, setTotalElectronicShares] = useState('0');
    
    let free_float = 0
    useEffect(() => {
        if (features.length !== 0) setCrudFeatures(listCrud(features));
    }, [features]);
    useEffect(() => {
        const getAllCompanies = async () => {
            setCompanies_data_loading(true);
            try {
                const response = await getCompanies(baseEmail)
                if (response.status === 200) {
                    const parents = response.data.data
                    const companies_dropdowns = response.data.data.map((item) => {
                        let label = `${item.code} - ${item.company_name}`;
                        return { label: label, value: item.code };
                    });
                    setCompanies_dropdown(companies_dropdowns);
                    setCompanies_data(parents)
                    setCompanies_data_loading(false);
                }
            } catch (error) {
                setCompanies_data_loading(false);
            }
        };
        getAllCompanies();

    }, [])

    useEffect(() => {

        const getShareHoldersByCompanyData = async () => {
        }
        if (selectedCompany !== '' && date !== '') {
            getShareHoldersByCompanyData();
        }
    }, [JSON.stringify(selectedCompany), date])

    const handleViewData = async () => {
        if (selectedCompany === "" && date === '') {
            toast.error('Please select company and date')
        } else if (selectedCompany === "") {
            toast.error('Please select company')
        } else if (date === '') {
            toast.error('Please select date')
        } else {
            try {
                setLoading(true);
                const response = await getShareHolderPatternByCompanyandDate(
                    baseEmail,
                    selectedCompany,
                    date
                );
                if (response.status === 200) {
                    const modified_data = response.data.data.Holding_report.map((item, index) => {
                        return Object.entries(item)
                    });
                    setTotalPhysicalShare(response.data.data?.total_physical_shares);
                    setTotalElectronicShares(response.data.data?.total_electronic_shares)
                    const dummyArrayforFreeFloat = []
                    const govtHolding = modified_data.flat()?.find(item => item[0] == "PUBLIC_SECTOR");
                    dummyArrayforFreeFloat.push(['Government Holding', govtHolding[1] || 0]);


                    // dummyArrayforFreeFloat.push(['Government Holding', govtHolding[1]||0]);



                    const directorfreefloat = modified_data.flat()?.find(item => item[0] == "DIRECTORS")
                    const exectivefreefloat = modified_data.flat()?.find(item => item[0] == "EXECUTIVES")

                    const sponsors = modified_data.flat()?.find(item => item[0] == "SPONSORS")
                    const SumofDirectorandExectiv = ((Number(directorfreefloat[1]) || 0) + (Number(exectivefreefloat[1]) || 0) + (Number(sponsors[1] || 0)))
                    dummyArrayforFreeFloat.push(['Shares Held By Directors, Sponsors And Senior Management Officers And Their Associates.', SumofDirectorandExectiv || 0])



                    const individualValues = modified_data.flat()?.find(item => item[0] == "INDIVIDUALS")
                    dummyArrayforFreeFloat.push(['Shares Held In Physical Form (General Public).', individualValues[1] || 0])




                    const accociateCompanies = modified_data.flat()?.find(item => item[0] == "ASSOCIATED_COMPANIES")

                    dummyArrayforFreeFloat.push(['Shares Held In CDS By Associate Companies.', accociateCompanies[1] || 0])


                    const EmployeData = modified_data.flat()?.find(item => item[0] == "EMPLOYEE");
                    dummyArrayforFreeFloat.push(['Shares Issued Under Employees Stock Option Schemes That Cannot Be Sold In The Open Market In Normal Course.', EmployeData[1] || 0])



                    // treasury_shares
                    const treasury_share = Number(selectedCompanDetail?.treasury_shares) > 0 ? Number(selectedCompanDetail?.treasury_shares) : 0
                    dummyArrayforFreeFloat.push(['Treasury Shares', treasury_share])


                    const anyOther = modified_data.flat()?.find(item => item[0] == "BLOCKED_SHARED");
                    dummyArrayforFreeFloat.push(['Any Other Category That Are Barred From Selling At The Review Date.', anyOther[1] || 0])
                    // modified_data.flat().map((category, i)=>{
                    //     free_float = parseFloat(free_float || '0') + (parseFloat(category[1] || '0') !== 0 ? (parseFloat(selectedCompanDetail.outstanding_shares || '0') - parseFloat(category[1] || '0')) : 0);
                    // })
                    // console.log('free_float', free_float)
                    setFreeFloatData(dummyArrayforFreeFloat);





                    // setFreeFloatData(modified_data.flat());
                    setViewPDF(true);
                    setLoading(false);
                }
            } catch (error) {
                !!error?.response?.data?.message
                    ? toast.error(error?.response?.data?.message)
                    : toast.error(error?.message);
                setUnderSearch("");
                setLoading(false);
            }
        }
    }
    //  Function First Letter Capital after space
    const titleCase = (str) => {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }



    return (
        <Fragment>
            <div className="d-flex justify-content-between">
                <h6 className="text-nowrap mt-3 ml-3">Free Float Report</h6>
                <Breadcrumb title="Free Float" parent="Free Float Reort" />
            </div>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header ">
                                <div className="d-flex justify-content-end">
                                <div>
                                        <button
                                            className="btn btn-danger"
                                            onClick={(e) => {
                                                if (pdfExportComponent.current) {
                                                    pdfExportComponent.current.save();
                                                }
                                            }}
                                            disabled={!viewPDF}
                                        >
                                            <i className="fa fa-file-pdf-o mr-1"></i>Print PDF
                                        </button>
                                    </div>
                                </div>


                                <div className="row mt-2">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="searchTransaction">Select Company</label>
                                            <Select
                                                options={companies_dropdown}
                                                isLoading={companies_data_loading === true}
                                                onChange={(selected) => {
                                                    if(selected?.value){
                                                        setViewPDF(false);
                                                        const filter = companies.find((item) => {
                                                            return item.code === selected.value;
                                                        });   
                                                        setSelectedCompanDetail(filter);
                                                        setSelectedCompany(selected.value)
                                                        
                                                    } else{
                                                        setUnderSearch("")
                                                        setSelectedCompany("")
                                                        
                                                    }
                                                    // const filter = companies.filter((item) => {
                                                    //     return item.code === selected.value;
                                                    // });
                                                    // setViewPDF(false);
                                                    // setSelectedCompanDetail(filter[0]);
                                                    // console.log('parents=>', filter)
                                                    // !!selected?.value &&
                                                    //     setSelectedCompany(selected.value);
                                                    // !selected && setSelectedCompany("");
                                                    // !selected?.value && setUnderSearch("");
                                                }}
                                                isClearable={true}
                                                styles={darkStyle}
                                            />
                                            {!selectedCompany && (
                                                <small className="text-dark">
                                                    Select Company And Date to Check shareholding pattern
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="history">Select Date</label>
                                            <input
                                                className="form-control"
                                                type="date"
                                                name="pattern"
                                                id="pattern"
                                                onChange={(e) => {
                                                    setDate(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-2"></div> */}
                                    {/* <div className="col-md-2 mt-4">
                                        <h5 className="mt-1"></h5>
                                        <button
                                            className="btn btn-danger"
                                            onClick={(e) => {
                                                if (pdfExportComponent.current) {
                                                    pdfExportComponent.current.save();
                                                }
                                            }}
                                            disabled={!viewPDF}
                                        >
                                            <i className="fa fa-file-pdf-o mr-1"></i>Print PDF
                                        </button>
                                    </div> */}
                                </div>
                                <div className="row mt-2 ml-1">
                                    <button
                                        className="btn btn-danger"
                                        onClick={(e) => {
                                            handleViewData()
                                        }}
                                        disabled={!selectedCompany || !date}
                                    >
                                        View PDF Report
                                    </button>
                                </div>

                            </div>


                            {(loading === true && freeFloatData.length === 0) && <Spinner />}
                            {(loading === false && freeFloatData.length > 0) ? (
                                <PDFExport
                                    paperSize="A4"
                                    margin="1.5cm"
                                    scale={0.6}
                                    fileName={`Free Float Report (DCCL})`}
                                    pageTemplate={PageTemplate}
                                    ref={pdfExportComponent}
                                >
                                    <ReportHeader
                                        title="Shareholder Details"
                                        logo={selectedCompanDetail?.logo || '****'}
                                    />
                                    <h5
                                        className="d-flex justify-content-center fw-bold pl-4"
                                        style={{ fontSize: "12px", fontWeight: 'bold', fontFamily: "Montserrat rev=1" }}
                                    >
                                        {selectedCompanDetail?.company_name ||''}
                                    </h5>
                                    <div
                                        className="d-flex justify-content-center pl-4"
                                        style={{ fontSize: "12px", fontWeight: 'bold', fontFamily: "Montserrat rev=1" }}
                                    >
                                        FREE FLOAT OF SHARES
                                        {/* Company:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {'DCCL'}
                    </span> */}
                                    </div>
                                    <div
                                        className="d-flex justify-content-center fw-bold pl-4 mb-4"
                                        style={{ fontSize: "12px", fontWeight: 'bold', fontFamily: "Montserrat rev=1" }}
                                    >
                                         AS ON {moment(date)?.format('MMMM DD, YYYY')?.toUpperCase()}
                                    </div>
                                    <>
                                        <div className='row mt-2'>
                                            <div className="col-md-12">
                                                <div className="table-responsive pl-2">
                                                    <table
                                                        border="0"
                                                        className="table"
                                                        style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                                                    >
                                                        <thead >
                                                        </thead>
                                                        <tbody border="0">
                                                            <tr>
                                                                <td style={{ width: '80%', border: '0px' }} className="text-nowrap">
                                                                    <b>Total Outstanding Shares</b>
                                                                </td>
                                                                <td style={{ width: '20%', border: '0px' }} className="text-nowrap text-right">
                                                                    <b> {numberWithCommas(parseFloat(selectedCompanDetail.outstanding_shares || '0'))}</b>
                                                                </td>
                                                            </tr>
                                                            {freeFloatData.map((category, i) => {
                                                             
                                                                // free_float = parseFloat(free_float || '0') + (parseFloat(category[1] || '0') !== 0 ? (parseFloat(selectedCompanDetail.outstanding_shares || '0') - parseFloat(category[1] || '0')) : 0);
                                                                free_float = parseFloat(free_float || '0') + (parseFloat(category[1] || '0') !== 0 ? (parseFloat(category[1] || '0')) : 0);
                                                                return (
                                                                    <tr>
                                                                        <td style={{ width: '80%' }} className="text-nowrap">
                                                                        <b>Less: </b>{category[0]? category[0] : ''}
                                                                            {/* <b>Less: </b>{(titleCase(category[0]) && titleCase(category[0].replaceAll('_', ' ')).length === 3 && titleCase(category[0].replaceAll('_', ' ')).includes('Cdc')) ? titleCase(category[0].replaceAll('_', ' ')).toUpperCase() : titleCase(category[0].replaceAll('_', ' '))} */}
                                                                        </td>
                                                                        <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                       
                                                                        {/* {parseFloat(isNumber(category[1]) || '0') !== 0 ? numberWithCommas(parseFloat(isNumber(category[1]))) || '0' : '-'} */}

                                                                           {parseFloat(isNumber(category[1]) || '0') !== 0 ? '(' + numberWithCommas( parseFloat(isNumber(category[1]) || '0')) + ')' : '-'}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Free Float</b>
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    <b>{numberWithCommas(parseFloat(selectedCompanDetail.outstanding_shares || '0') - parseFloat(free_float || '0'))}</b>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Total Number of Shares held in Physical Form</b>
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    <b>{numberWithCommas(parseFloat(totalPhysicalShare ||'0'))}</b>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Total Number of shares in CDC</b>
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    <b>{numberWithCommas(parseFloat(totalElectronicShares ||'0'))}</b>
                                                                </td>
                                                            </tr>
                                                            {/* <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Less:</b> Government Holding
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    (24,561,812)
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Less:</b> Shares Held By Directors, Sponsors and Senior Management Officers and their Associates
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    (16,631)
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Less:</b> Shares Held in Physcial Form (General Public)
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    (3,568,094)
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Less:</b> Shares Held in CDC by Associate Companies
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    (79,374,443)
                                                                </td>
                                                            </tr>

                                                             <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Less:</b> Shares Held issued under Employees Stock Options Schemes that cannot be sold in oper market in normal course.
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    -
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Less:</b> Treasury Shares
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    -
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Less:</b> Any other category that are barred from selling at the review date
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    -
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Free Float</b>
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    <b>25,852,250</b>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Total Number of Shares held in Physical Form</b>
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    <b>54,586,602</b>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ width: '80%' }} className="text-nowrap">
                                                                    <b>Total Number of shares in CDC</b>
                                                                </td>
                                                                <td style={{ width: '20%' }} className="text-nowrap text-right">
                                                                    <b>78,815,898</b>
                                                                </td>
                                                            </tr> */}

                                                        </tbody>

                                                    </table>
                                                </div>
                                            </div>

                                        </div>

                                    </>


                                </PDFExport>
                            ) : (
                                null
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
