import React, { Fragment, useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import {
    sendBulkEntitlements,
    getCorporateAnnouncementById,
    getCorporateAnnouncement,
} from "../../../store/services/corporate.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import LoadableButton from "../../common/loadables";
import {
    announcement_id_setter,
    company_code_setter,
    folio_setter,
} from "../../../store/services/dropdown.service";
import styled from "styled-components";
import Select from "react-select";
import { addShareCertificateSchema } from "../../../store/validations/shareCertificateValidation";
import { errorStyles } from "../../defaultStyles";
import { addEntitlementSchema } from "../../../store/validations/entitlementValidation";
import { getCompanies, getCompanyById } from "../../../store/services/company.service";
import { getShareHoldersByCompany } from "../../../store/services/shareholder.service";
import { getInvestors } from "../../../store/services/investor.service";
import { generateLetters, generateRegex, numberWithCommas } from "utilities/utilityFunctions";
import { Collapse, UncontrolledTooltip } from "reactstrap";
import Breadcrumb from "../../common/breadcrumb";
import { Calculation } from "constant";
import Spinner from "components/common/spinner";

export default function ActionCalculator() {
    const baseEmail = sessionStorage.getItem("email") || "";
    // Validation Declarations
    // const {
    //     register,
    //     watch,
    //     formState: { errors },
    //     handleSubmit,
    //     control,
    //     setValue,
    // } = useForm({ resolver: yupResolver(addEntitlementSchema) });

    // options
    // const company_code = sessionStorage.getItem('company_code') || '';

    const [announcement_id_options, setAnnoucement_id_options] = useState([]);
    const [shareHoldings, setShareHoldings] = useState([]);
    const [investors, setInvestors] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState({});
    const [company, setCompany] = useState({});
    const [selectedCompany, setSelectedCompany] = useState('');
    const [company_code_options, setCompany_code_options] = useState([]);
    const [flag, setFlag] = useState(false);
    const [dividendPercent, setDividendPercent] = useState("");
    const [underSearch, setUnderSearch] = useState("");
    const [companies_dropdown, setCompanies_dropdown] = useState([]);
    const [companies_data_loading, setCompanies_data_loading] = useState(false);

    const [dividendPercentage, setDividendPercentage] = useState("");
    const [bonusPercentage, setBonusPercentage] = useState("");
    const [rightPercentage, setRightPercentage] = useState("");
    const [rightRate, setRightRate] = useState("");
    const [filerTax, setFilerTax] = useState("");
    const [nonFilerTax, setNonFilerTax] = useState("");
    const [rateforzakat, setRateforzakat] = useState("10");
    const [faceVal, setFaceVal] = useState("");
    const [outstandingShares, setOutstandingShares] = useState("");
    const [paidCapital, setPaidCapital] = useState("");

    const [searchShareHoldings, setSearchShareHoldings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [announcement, setAnnouncement] = useState([]);
    const [criteria, setCriteria] = useState('name');
    const [search, setSearch] = useState('');
    const [totalActions, setTotalActions] = useState(0)
    let allotment_number = 1;
    // let total_bonus_shares = 0;
    // let [allotment_number, setAllotmentNumber] = useState(0);
    let [total_bonus_shares, setTotalBonusShare] = useState(0);
    let [total_right_shares, setTotalShare] = useState(0);
    let [total_gross_dividend, setTotalGrossDiv] = useState(0);
    let [total_net_dividend, setTotalNetDiv] = useState(0);
    let [total_b_fraction, setTotalBShare] = useState(0);
    let [total_r_fraction, setTotalRShare] = useState(0);
    // let total_gross_dividend = 0;
    // let total_net_dividend = 0;
    // let total_b_fraction = 0;
    // let total_r_fraction = 0;
    let [totalActionShares, setTotalActionShare] = useState(0);
    let [currentOutstandingShares, setCurrentOutstandingShares] = useState(0);
    let [withholdingTax, setWithholdingTax] = useState(0);
    let [outstandingAfterAction, setOutstandingAfterAction] = useState(0);
    let [totalZakat, setTotalZakat] = useState(0);
    let [paidupCapital, setPaidupCapital] = useState(0);
    let [additionalCapital, setAdditionalCapital] = useState(0);
    let [paidupCapitalAfterAction, setPaidupCapitalAfterAction] = useState(0);
    // let totalActionShares;
    // let currentOutstandingShares = 0;
    // let outstandingAfterAction = 0;
    // let withholdingTax = 0;
    // let totalZakat = 0;
    // let paidupCapital = 0;
    // let additionalCapital = 0;
    // let paidupCapitalAfterAction = 0;

    useEffect(() => {
        const getAllCorporateAnnouncement = async () => {
            try {
                const response = await getCorporateAnnouncement(baseEmail);
                if (response.status === 200) {
                    setAnnouncement(response.data.data);
                }
            } catch (error) { }
        };
        getAllCorporateAnnouncement();
    }, []);

    const WrapperForResponsive = styled.div`
    @media(max-width: 765px){
      .responsive{
      width: 350px;
      margin: auto;
      }
    }
    @media(max-width: 500px){
      .responsive{
      width: 200px;
      margin: auto;
      }
    }
    `;

    useEffect(() => {
        setCompanies_data_loading(true)
        const getAllCompanies = async () => {
            try {
                const response = await getCompanies(baseEmail)
                if (response.status === 200) {
                    const parents = response.data.data
                    const companies_dropdowns = response.data.data.map((item) => {
                        let label = `${item.code} - ${item.company_name}`;
                        return { label: label, value: item.code };
                    });
                    setCompanies_dropdown(companies_dropdowns);
                    setCompanies_data_loading(false)
                }
            } catch (error) {
                setCompanies_data_loading(false)
            }
        };

        getAllCompanies();
    }, []);

    useEffect(() => {
        const getCompany = async () => {
            try {
                const response = await getCompanyById(
                    baseEmail,
                    selectedCompany
                );
                if (response.status === 200) {
                    setCompany(response.data.data);
                }
            } catch (error) {
                !!error?.response?.data?.message
                    ? toast.error(error?.response?.data?.message)
                    : toast.error("Company Not Found");
            }
        };
        if (!!selectedCompany) {
            getCompany();
        }
    }, [selectedCompany]);

    useEffect(() => {
        const getShareHolders = async () => {
            try {
                const response = await getShareHoldersByCompany(
                    baseEmail,
                    selectedCompany,
                    "/active"
                );
                if (response.status === 200) {
                    let physicalHolding = response.data.data.filter(
                        (folio) =>
                            folio.cdc_key == "NO" && folio.folio_number !== selectedCompany + "-0"
                    ).sort((a, b) => a.folio_number.replace(`${selectedCompany}-`, '').replace('-', '') - b.folio_number.replace(`${selectedCompany}-`, '').replace('-', ''))

                    let electronicHolding = response.data.data.filter(
                        (folio) =>
                            folio.cdc_key == "YES" && folio.folio_number !== selectedCompany + "-0"
                    ).sort((a, b) => a.folio_number.replace(`${selectedCompany}-`, '').replace('-', '') - b.folio_number.replace(`${selectedCompany}-`, '').replace('-', ''))
                    //
                    // setShareHoldings(
                    //   response.data.data.filter(
                    //     (folio) =>
                    //       folio.folio_number !== selectedAnnouncement?.company_code + "-0"
                    //   )
                    //   // .map((sh) => ({...sh, folio_number: sh.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'')}))
                    //   .sort((a, b) => a.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'').replace('-','') - b.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'').replace('-',''))
                    // );
                    // let cdcHolding = response.data.data.filter((folio) =>
                    //     folio.folio_number == selectedCompany + "-0")

                    let array = [...physicalHolding, ...electronicHolding]
                    array.map((item) => {
                        item.folio_number = item.folio_number.replace(`${selectedCompany}-`, '')
                        return item
                    })
                    setShareHoldings(array);
                    // setShareHoldings(
                    //     [...physicalHolding, ...electronicHolding, ...cdcHolding]
                    // );
                }
            } catch (error) {
                !!error?.response?.data?.message
                    ? toast.error(error?.response?.data?.message)
                    : toast.error("Folios Not Found");
            }
        };
        const getAllInvestors = async () => {
            try {
                const response = await getInvestors(baseEmail);
                if (response.status === 200) {
                    setInvestors(response.data.data);
                }
            } catch (error) {
                !!error?.response?.data?.message
                    ? toast.error(error?.response?.data?.message)
                    : toast.error("Folios Not Found");
            }
        };
        if (selectedCompany !== '') {
            getShareHolders();
        }
        getAllInvestors();
    }, [company]);

    // useEffect(() => {
    //   if(underSearch===false){

    //   }else{

    //   }
    // }, [searchShareHoldings, shareHoldings])


    useEffect(() => {
        const getAnnouncementOptions = async () => {

            try {
                setAnnoucement_id_options(
                    announcement
                        .filter((ann) => ann.expired !== "true")
                        .map((item) => {
                            let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
                            return { label: label, value: item.announcement_id };
                        })
                );
                setCompany_code_options(await company_code_setter());
            } catch (error) {
                !!error?.response?.data?.message
                    ? toast.error(error?.response?.data?.message)
                    : toast.error("Announcements Not Found");
            }
        };
        getAnnouncementOptions();
    }, [announcement]);



    const getHoldings = (holdings, allotment_number, value) => {
        return holdings
            .filter(
                (holding) =>
                    holding.physical_shares > 0 || holding.electronic_shares > 0 || holding.folio_number == selectedCompany + "-0"
            )
            .map((holding, i) => {

                let electronic_shares;
                let total_holding;
                let physical_shares;
                let filer;
                let zakat_status;
                let gross_div;
                let filer_tax;
                let non_filer_tax;
                let b_fraction;
                let r_fraction;
                let tax_exempted;
                let zakat;
                let bonus_shares;
                let right_shares;
                let net_dividend;
                let allotment_letters;
                let tax_rate;


                electronic_shares = !!holding?.electronic_shares
                    ? holding?.electronic_shares
                    : "0";
                physical_shares = !!holding?.physical_shares
                    ? holding?.physical_shares
                    : "0";
                total_holding = (
                    parseFloat(electronic_shares) + parseFloat(physical_shares)
                ).toString();
                filer = holding.filer === "Y" ? "Y" : "N";
                let roshan_account = holding.roshan_account === "Y" ? "Y" : "N";
                zakat_status = (holding?.zakat_status?.toUpperCase() === "N" || holding?.zakat_status?.toUpperCase() === 'NOT APPLICABLE' || holding?.zakat_status?.toUpperCase() === 'MUSLIM ZAKAT NON-DEDUCTIBLE') ? "N" : "Y";
                zakat =
                    zakat_status === "Y"
                        ? (total_holding * parseFloat(rateforzakat || "0")) * 0.025
                        : 0;
                if (flag === true) {
                    gross_div = dividendPercentage
                        ? (total_holding * faceVal * dividendPercentage) / 100
                        : 0;
                    tax_rate =
                        filer === "Y"
                            ? `${filerTax}%`
                            : `${nonFilerTax}%`;
                    filer_tax = parseFloat(filerTax || "0") / 100;
                    non_filer_tax = parseFloat(nonFilerTax || "0") / 100;
                    tax_exempted =
                        filer === "Y" ? gross_div * filer_tax : gross_div * non_filer_tax;
                    bonus_shares =
                        (total_holding * parseFloat(bonusPercentage || "0")) / 100;
                    b_fraction = "0." + (bonus_shares.toString().split(".")[1] || 0);
                    right_shares =
                        (total_holding * parseFloat(rightPercentage || "0")) / 100;
                    r_fraction = "0." + (right_shares.toString().split(".")[1] || 0);
                    net_dividend = gross_div ? gross_div - tax_exempted - zakat : 0;



                    //  account_title = holding?.account_title;
                    //  account_no = investors.find(
                    //     (inv) => inv.cnic === holding.shareholder_cnic
                    // )?.account_no;
                    // let bank = holding?.bank_name;
                    // let branch = holding?.baranch_address + " - " + holding?.baranch_city;
                    allotment_letters = !!(parseFloat(rightRate || '0'))
                        ? holding.cdc_key === "NO"
                            ? generateLetters(
                                parseFloat(company.allot_size),
                                parseFloat(right_shares && right_shares.toString().split(".")[0]),
                                parseFloat(allotment_number)
                            )
                            : []
                        : [];
                    // allotment_number += allotment_letters.length;
                    // total_bonus_shares += parseFloat(bonus_shares || '0');
                    // total_right_shares += parseFloat(right_shares || '0');
                    // total_gross_dividend += parseFloat(gross_div || '0');
                    // total_net_dividend += parseFloat(net_dividend || '0');
                    // total_b_fraction += parseFloat(b_fraction || '0');
                    // total_r_fraction += parseFloat(r_fraction || '0');

                    // let totalActShares = (parseFloat(bonus_shares || '0') + parseFloat(b_fraction || '0') + parseFloat(right_shares || '0') + parseFloat(r_fraction || '0'));
                    // currentOutstandingShares = parseFloat(outstandingShares || '0');
                    // let outstandingAfterAct = parseFloat(totalActShares || '0') + parseFloat(outstandingShares || '0');
                    // withholdingTax = +parseFloat(tax_exempted || '0');
                    // totalZakat += parseFloat(zakat || '0');
                    // paidupCapital = parseFloat(paidCapital || '0');
                    // let additionalCap = ((parseInt(bonus_shares || '0') + parseInt(b_fraction || '0'))
                    //     * parseInt(faceVal || '0'))
                    //     +
                    //     ((parseInt(right_shares || '0') + parseInt(r_fraction || '0')) * parseInt(rightRate || 0)
                    //     )
                    // let paidupCapitalAfterAct = parseFloat(paidCapital || '0') + parseFloat(additionalCap || '0');

                    // totalActionShares = parseFloat(totalActionShares || '0') + parseFloat(totalActShares || '0');
                    // outstandingAfterAction += parseFloat(outstandingAfterAct || '0');
                    // additionalCapital += parseFloat(additionalCap || '0');
                    // paidupCapitalAfterAction += parseFloat(paidupCapitalAfterAct || '0');
                }

                return {
                    s_no: i + 1,
                    folio_number: holding.folio_number || "",
                    shareholder_name: holding.shareholder_name || "",
                    filer: filer,
                    total_holding: total_holding,
                    gross_dividend: gross_div,
                    tax_percentage: tax_rate,
                    tax: tax_exempted,
                    net_dividend: net_dividend,
                    zakat: zakat,
                    bonus_shares: bonus_shares,
                    right_shares: right_shares,
                    b_fraction: b_fraction,
                    r_fraction: r_fraction,
                    shareholder_id: holding.shareholder_id,
                    allotment_letters,
                };
            }


            )
    };





    /*  ---------------------  */
    /*  Pagination Code Start  */
    /*  ---------------------  */
    const [pageNumber, setPageNumber] = useState(0);
    const calCulateEntitlementPerPage = 10;
    const pagesVisited = pageNumber * calCulateEntitlementPerPage;
    const totalnumberofPages = 100;
    const displayCalCulateEntitlementPerPage = !underSearch ?
        getHoldings(shareHoldings, allotment_number)
            .sort((a, b) => {
                if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
                    return -1;
                if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
                    return 1;
                return 0;
            })
            .slice(pagesVisited, pagesVisited + calCulateEntitlementPerPage)
            .map(
                (holding, i) => (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{holding.folio_number}</td>
                        <td>{holding.shareholder_name}</td>
                        <td>{holding.filer}</td>
                        <td className="text-right">
                            {numberWithCommas(parseFloat(Math.trunc(holding.total_holding) || '0'))}
                        </td>
                        <td className="text-right">
                            {numberWithCommas(parseFloat(holding.gross_dividend || '0').toFixed(2))}
                        </td>
                        <td className="text-right">
                            {numberWithCommas(parseFloat(holding.tax_percentage || '0').toFixed(2))}{" "}
                        </td>
                        <td className="text-right">
                            {numberWithCommas(parseFloat(holding.tax || '0').toFixed(2))}
                        </td>
                        <td className="text-right">
                            {numberWithCommas(parseFloat(parseFloat(holding.zakat) || '0').toFixed(2))}
                        </td>
                        <td className="text-right">
                            {numberWithCommas(parseFloat(holding.net_dividend || '0').toFixed(2))}
                        </td>
                        <td className="text-right">
                            {numberWithCommas(parseFloat(holding.bonus_shares || '0').toFixed(2))}
                        </td>
                        <td className="text-right">{numberWithCommas(parseFloat(holding.b_fraction || '0').toFixed(2))}</td>
                        <td className="text-right">
                            {numberWithCommas(parseFloat(holding.right_shares || '0').toFixed(2))}
                        </td>
                        <td className="text-right">{numberWithCommas(parseFloat(holding.r_fraction || '0').toFixed(2))}</td>
                    </tr>
                )
            ) : getHoldings(searchShareHoldings, allotment_number)
                .sort((a, b) => {
                    if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
                        return -1;
                    if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
                        return 1;
                    return 0;
                })
                .slice(pagesVisited, pagesVisited + calCulateEntitlementPerPage)
                .map(
                    (holding, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{holding.folio_number}</td>
                            <td>{holding.shareholder_name}</td>
                            <td>{holding.filer}</td>
                            <td className="text-right">
                                {numberWithCommas(parseFloat(Math.trunc(holding.total_holding) || '0'))}
                            </td>
                            <td className="text-right">
                                {numberWithCommas(parseFloat(holding.gross_dividend || '0').toFixed(2))}
                            </td>
                            <td className="text-right">
                                {numberWithCommas(parseFloat(holding.tax_percentage || '0').toFixed(2))}{" "}
                            </td>
                            <td className="text-right">
                                {numberWithCommas(parseFloat(holding.tax || '0').toFixed(2))}
                            </td>
                            <td className="text-right">
                                {numberWithCommas(parseFloat(parseFloat(holding.zakat) || '0').toFixed(2))}
                            </td>
                            <td className="text-right">
                                {numberWithCommas(parseFloat(holding.net_dividend || '0').toFixed(2))}
                            </td>
                            <td className="text-right">
                                {numberWithCommas(parseFloat(holding.bonus_shares || '0').toFixed(2))}
                            </td>
                            <td className="text-right">{numberWithCommas(parseFloat(holding.b_fraction || '0').toFixed(2))}</td>
                            <td className="text-right">
                                {numberWithCommas(parseFloat(holding.right_shares || '0').toFixed(2))}
                            </td>
                            <td className="text-right">{numberWithCommas(parseFloat(holding.r_fraction || '0').toFixed(2))}</td>
                        </tr>
                    )
                )

    const pageCount = !underSearch
        ? Math.ceil(getHoldings(shareHoldings, allotment_number).length / calCulateEntitlementPerPage)
        : Math.ceil(getHoldings(searchShareHoldings, allotment_number).length / calCulateEntitlementPerPage);

    // const pageCount = Math.ceil( / calCulateEntitlementPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
    /*  ---------------------  */
    /*  Pagination Code Ended  */
    /*  ---------------------  */

    // Search By name and folio number
    const handleSearchChange = (e, val) => {
        !!e && setSearch(e.target.value);
        !!e && setUnderSearch(e.target.value);
        if (e?.target?.value?.length > 0) {
            if (val === 'folio') {
                let searchByFolio = shareHoldings.filter((item => {
                    return item.folio_number.includes(e.target.value);
                }))
                setSearchShareHoldings(searchByFolio)

            } else {
                let searchByName = shareHoldings.filter((item => {
                    return item.shareholder_name?.toLowerCase().includes(e.target.value?.toLowerCase());
                }))
                setSearchShareHoldings(searchByName)
            }
            setPageNumber(0)
        }

        if (!e?.target?.value) {
            setSearchShareHoldings(shareHoldings)
        }

    }


    useEffect(() => {
        if (Object.keys(company).length > 0) {
            setFaceVal(company?.face_value || '');
            setOutstandingShares(company?.outstanding_shares || '');
            setPaidCapital(company?.paid_up_capital || '');
            //         setValue("dividend_percentage", '');
            //         setValue("bonus_percentage", '');
            //         setValue("right_percentage", '');
            //         setValue("right_rate", '');
            setFilerTax("15")
            setNonFilerTax("30")
        }
    }, [company]);

    const getActionSummaryData = () => {
        shareHoldings
            .filter(
                (holding) =>
                    holding.physical_shares > 0 || holding.electronic_shares > 0 || holding.folio_number == selectedCompany + "-0"
            )
            .map((holding, i) => {

                let electronic_shares = 0;
                let total_holding = 0;
                let physical_shares = 0;
                let filer;
                let zakat_status = 0;
                let gross_div = 0;
                let filer_tax = 0;
                let non_filer_tax = 0;
                let b_fraction = 0;
                let r_fraction = 0;
                let tax_exempted = 0;
                let zakat = 0;
                let bonus_shares = 0;
                let right_shares = 0;
                let net_dividend = 0;
                let allotment_letters = 0;
                let tax_rate = 0;



                electronic_shares = !!holding?.electronic_shares
                    ? holding?.electronic_shares
                    : "0";
                physical_shares = !!holding?.physical_shares
                    ? holding?.physical_shares
                    : "0";
                total_holding = (
                    parseFloat(electronic_shares) + parseFloat(physical_shares)
                ).toString();
                filer = holding.filer === "Y" ? "Y" : "N";
                let roshan_account = holding.roshan_account === "Y" ? "Y" : "N";
                zakat_status = (holding?.zakat_status.toUpperCase() === "N" || holding?.zakat_status.toUpperCase() === 'NOT APPLICABLE' || holding?.zakat_status.toUpperCase() === 'MUSLIM ZAKAT NON-DEDUCTIBLE') ? "N" : "Y";
                zakat =
                    zakat_status === "Y"
                        ? (total_holding * parseFloat(rateforzakat || "0")) * 0.025
                        : 0;
                // if (flag === true) {
                gross_div = dividendPercentage
                    ? (total_holding * faceVal * dividendPercentage) / 100
                    : 0;
                tax_rate =
                    filer === "Y"
                        ? `${filerTax}%`
                        : `${nonFilerTax}%`;
                filer_tax = parseFloat(filerTax || "0") / 100;
                non_filer_tax = parseFloat(nonFilerTax || "0") / 100;
                tax_exempted =
                    filer === "Y" ? gross_div * filer_tax : gross_div * non_filer_tax;
                console.log('total_holding', total_holding, 'bonusPercentage', parseFloat(bonusPercentage || "0"), 'bonus_share', (bonus_shares.toString().split(".")[1] || 0))
                bonus_shares =
                    (total_holding * parseFloat(bonusPercentage || "0")) / 100;
                b_fraction = "0." + (bonus_shares.toString().split(".")[1] || 0);
                right_shares =
                    (total_holding * parseFloat(rightPercentage || "0")) / 100;
                r_fraction = "0." + (right_shares.toString().split(".")[1] || 0);
                net_dividend = gross_div ? gross_div - tax_exempted - zakat : 0;



                //  account_title = holding?.account_title;
                //  account_no = investors.find(
                //     (inv) => inv.cnic === holding.shareholder_cnic
                // )?.account_no;
                // let bank = holding?.bank_name;
                // let branch = holding?.baranch_address + " - " + holding?.baranch_city;
                allotment_letters = !!(parseFloat(rightRate || '0'))
                    ? holding.cdc_key === "NO"
                        ? generateLetters(
                            parseFloat(company.allot_size),
                            parseFloat(right_shares && right_shares.toString().split(".")[0]),
                            parseFloat(allotment_number)
                        )
                        : []
                    : [];
                // allotment_number += allotment_letters.length;
                total_bonus_shares += parseFloat(bonus_shares || '0');
                total_right_shares += parseFloat(right_shares || '0');
                total_gross_dividend += parseFloat(gross_div || '0');
                total_net_dividend += parseFloat(net_dividend || '0');
                total_b_fraction += parseFloat(b_fraction || '0');
                total_r_fraction += parseFloat(r_fraction || '0');
                let totalActShares = (parseFloat(bonus_shares || '0') + parseFloat(b_fraction || '0') + parseFloat(right_shares || '0') + parseFloat(r_fraction || '0'));
                currentOutstandingShares = parseFloat(outstandingShares || '0');
                let outstandingAfterAct = parseFloat(totalActShares || '0') + parseFloat(outstandingShares || '0');
                withholdingTax += parseFloat(tax_exempted || '0');
                totalZakat += parseFloat(zakat || '0');
                paidupCapital = parseFloat(paidCapital || '0');
                let additionalCap = ((parseFloat(bonus_shares || '0') + parseFloat(b_fraction || '0'))
                    * parseFloat(faceVal || '0'))
                    +
                    ((parseFloat(right_shares || '0') + parseFloat(r_fraction || '0')) * parseFloat(rightRate || 0)
                    )
                // let paidupCapitalAfterAct = parseFloat(paidCapital || '0') + parseFloat(additionalCap || '0');
                totalActionShares = parseFloat(totalActionShares || '0') + parseFloat(totalActShares || '0');
                // outstandingAfterAction += parseFloat(outstandingAfterAct || '0');
                additionalCapital += parseFloat(additionalCap || '0');
                // paidupCapitalAfterAction += parseFloat(paidupCapitalAfterAct || '0');


                setTotalShare(total_right_shares);
                setTotalBonusShare(total_bonus_shares);
                setTotalGrossDiv(total_gross_dividend)
                setTotalNetDiv(total_net_dividend)
                setTotalActionShare(totalActionShares)
                setTotalBShare(total_b_fraction)
                setTotalRShare(total_r_fraction)
                setOutstandingAfterAction(parseFloat(currentOutstandingShares || '0') + parseFloat(totalActionShares || '0'))
                setCurrentOutstandingShares(currentOutstandingShares)
                setWithholdingTax(withholdingTax)
                setTotalZakat(totalZakat)
                setPaidupCapital(paidupCapital)
                setAdditionalCapital(additionalCapital)
                setPaidupCapitalAfterAction(parseFloat(additionalCapital || '0') + parseFloat(paidCapital || '0'))

                // }

            }


            )

    };

    const calculations = () => {
        total_right_shares = 0;
        total_bonus_shares = 0;
        total_gross_dividend = 0
        total_net_dividend = 0
        totalActionShares = 0
        total_b_fraction = 0
        total_r_fraction = 0
        outstandingAfterAction = 0
        currentOutstandingShares = 0
        withholdingTax = 0
        totalZakat = 0;
        paidupCapital = 0;
        additionalCapital = 0;
        paidupCapitalAfterAction = 0;
        setFlag(true)
        getActionSummaryData();
    }


    return (
        <Fragment>
            <div className="d-flex justify-content-between">
                <div>
                    <Breadcrumb
                        title="Action Calculator"
                        parent="Corporate"
                        hideBookmark
                    />
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between" style={{ flexWrap: 'wrap' }}>
                                <h5>Action Calculator Configuration</h5>
                            </div>
                            <div className="row pt-2">
                                <div className="col-sm-12 col-md-12 col-lg-12 ">
                                    <div className="card-body">
                                        {/* Dividend Row */}
                                        <div className="row">
                                            <div className="col-md-2">
                                                <div className="form-group  my-2">
                                                    <label htmlFor="company">Company</label>
                                                    <Select
                                                        options={companies_dropdown}
                                                        isLoading={companies_data_loading}
                                                        style={!selectedCompany && errorStyles}
                                                        isClearable={true}
                                                        onChange={(selected) => {
                                                            selected && setSelectedCompany(selected.value);
                                                            !selected && setSelectedCompany("");
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group my-2">
                                                    <label >Dividend Percentage</label>
                                                    <div className="input-group mb-3">
                                                        <NumberFormat
                                                            className="form-control"
                                                            value={dividendPercentage}
                                                            onValueChange={(e) => {
                                                                setFlag(false);
                                                                setDividendPercentage(parseFloat(e.value || ''));
                                                            }}
                                                            // value={selectedAnnouncement.dividend_percent}
                                                            placeholder="Enter Dividend Percentage"
                                                        />
                                                        <div className="input-group-append">
                                                            <span
                                                                className="input-group-text"
                                                                id="basic-addon2"
                                                            >
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group my-2">
                                                    <label>Bonus Percentage</label>
                                                    <div className="input-group mb-3">
                                                        <NumberFormat
                                                            className="form-control"
                                                            value={bonusPercentage}
                                                            onValueChange={(e) => {
                                                                setFlag(false)
                                                                setBonusPercentage((e.value || ''));
                                                            }}
                                                            // value={selectedAnnouncement.bonus_percent}
                                                            placeholder="Enter Bonus Percentage"
                                                        />
                                                        <div className="input-group-append">
                                                            <span
                                                                className="input-group-text"
                                                                id="basic-addon2"
                                                            >
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="col-md-2">
                                                <div className="form-group my-2">
                                                    <label>Right Percentage</label>
                                                    <div className="input-group mb-3">
                                                        <NumberFormat
                                                            className="form-control"
                                                            value={rightPercentage}
                                                            onValueChange={(e) => {
                                                                setFlag(false)
                                                                setRightPercentage((e.value || ''));
                                                            }}
                                                            // value={selectedAnnouncement.right_percent}
                                                            placeholder="Enter Right Percentage"
                                                        />
                                                        <div className="input-group-append">
                                                            <span
                                                                className="input-group-text"
                                                                id="basic-addon2"
                                                            >
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-2">
                                                <div className="form-group my-2">
                                                    <label htmlFor="right_rate">Right Rate</label>
                                                    <NumberFormat
                                                        className={`form-control`}
                                                        value={rightRate}
                                                        onValueChange={(e) => {
                                                            setFlag(false)
                                                            setRightRate((e.value || ''));
                                                        }}
                                                        allowNegative={false}
                                                        placeholder="Right Rate"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group my-2">
                                                    <label>Filer Tax</label>
                                                    <div className="input-group mb-3">
                                                        <NumberFormat
                                                            className={`form-control`}
                                                            value={filerTax}
                                                            onValueChange={(e) => {
                                                                setFlag(false)
                                                                setFilerTax(e.value || '');
                                                            }}
                                                            allowNegative={false}
                                                            placeholder="Enter Tax Rate"
                                                        />
                                                        <div className="input-group-append">
                                                            <span
                                                                className="input-group-text"
                                                                id="basic-addon2"
                                                            >
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* </div> */}
                                        </div>
                                        {/* TAX RATE */}
                                        <div className="row">

                                            <div className="col-md-2">
                                                <div className="form-group my-2">
                                                    <label>Non Filer Tax</label>
                                                    <div className="input-group mb-3">
                                                        <NumberFormat
                                                            className={`form-control`}
                                                            value={nonFilerTax}
                                                            onValueChange={(e) => {
                                                                setFlag(false)
                                                                setNonFilerTax(e.value || '');
                                                            }}
                                                            allowNegative={false}
                                                            placeholder="Non Filer Tax"
                                                        />
                                                        <div className="input-group-append">
                                                            <span
                                                                className="input-group-text"
                                                                id="basic-addon2"
                                                            >
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group my-2">
                                                    <label htmlFor="right_rate">Rate for Zakat</label>
                                                    <NumberFormat
                                                        className={`form-control`}
                                                        value={rateforzakat}
                                                        onValueChange={(e) => {
                                                            setFlag(false)
                                                            setRateforzakat((e.value || ''));
                                                        }}
                                                        allowNegative={false}
                                                        placeholder="Right Rate"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group my-2">
                                                    <label>Face Value </label>
                                                    <NumberFormat
                                                        className={`form-control text-right`}
                                                        value={faceVal}
                                                        decimalScale={2}
                                                        placeholder="Enter Face Number"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>


                                            <div className="col-md-3">
                                                <div className="form-group my-2">
                                                    <br />
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary m-2"
                                                        onClick={() => {
                                                            calculations();
                                                        }}
                                                    >
                                                        Calculate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header d-flex justify-content-between" style={{ flexWrap: 'wrap' }}>
                                    <h5>Action Summary</h5>
                                </div>
                                {
                                    (shareHoldings.length > 0 || searchShareHoldings.length > 0) && (
                                        <>{
                                            (parseInt(total_gross_dividend || '0') > 0 || parseInt(total_net_dividend || '0') || parseInt(total_right_shares || '0') > 0 || parseInt(total_bonus_shares || '0') > 0 || parseInt(total_b_fraction || '0') > 0 || parseInt(total_r_fraction || '0') > 0 || ((parseInt(total_right_shares || '0') * parseInt(rightRate || '0'))) > 0) && (
                                                <div className="container-fluid">
                                                    <WrapperForResponsive>
                                                        <div className="row responsive">
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Bonus Shares</div>
                                                                <h5 className="text-center">{numberWithCommas((parseInt(total_bonus_shares || '0')))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Bonus Fraction</div>
                                                                <h5 className="text-center">{(parseInt(total_b_fraction || '0'))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Right Shares</div>
                                                                <h5 className="text-center">{numberWithCommas((parseInt(total_right_shares || '0')))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Right Fraction</div>
                                                                <h5 className="text-center">{numberWithCommas((parseInt(total_r_fraction || '0')))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Action Shares</div>
                                                                <h5 className="text-center">{numberWithCommas(parseInt((totalActionShares || '0')))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Right Amount</div>
                                                                <h5 className="text-center">{numberWithCommas(parseInt(total_right_shares || '0') * parseInt(rightRate || '0'))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Current Outstanding Shares</div>
                                                                <h5 className="text-center">{numberWithCommas((parseInt((currentOutstandingShares || '0'))))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Outstanding After Action</div>
                                                                <h5 className="text-center">{numberWithCommas((parseInt((outstandingAfterAction || '0'))))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Gross Dividend</div>
                                                                <h5 className="text-center">{numberWithCommas(parseInt(total_gross_dividend || '0'))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Withholding Tax </div>
                                                                <h5 className="text-center">{numberWithCommas(parseInt(withholdingTax || '0'))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Zakat  </div>
                                                                <h5 className="text-center">{numberWithCommas(parseInt(totalZakat || '0'))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Net Dividend</div>
                                                                <h5 className="text-center">{numberWithCommas(parseInt(total_net_dividend || '0'))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Additional Capital </div>
                                                                <h5 className="text-center">{numberWithCommas(parseInt(additionalCapital || '0'))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Paidup Capital </div>
                                                                <h5 className="text-center">{numberWithCommas(parseInt(paidupCapital || '0'))}</h5>
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-center">Paidup Capital After Action </div>
                                                                <h5 className="text-center">{numberWithCommas(parseInt(paidupCapitalAfterAction || '0'))}</h5>
                                                            </div>







                                                            {/* {(((parseInt(total_right_shares || '0').toFixed(2) * parseInt(watch("right_rate") || '0')) / 2) > 0) && (<><div className="col-md-3"><b>Total Right Rate</b></div><div className="col-md-2">{((parseFloat(total_right_shares || '0').toFixed(2) * parseInt(watch("right_rate") || '0')) / 2).toFixed(2)}</div></>)} */}

                                                        </div>
                                                    </WrapperForResponsive>
                                                </div>
                                            )}



                                            {/* {(parseInt(total_gross_dividend || '0') > 0 || parseInt(total_net_dividend || '0') > 0) && (
                                                <div className="container-fluid">
                                                    <div className="row">

                                                        {(parseInt(total_gross_dividend || '0') > 0) && (
                                                            <div className="col-sm-2">
                                                                <div className="card">
                                                                    <div className="bg-secondary card-body">
                                                                        <div className="media feather-main">
                                                                            <div className="media-body align-self-center">
                                                                                <h6 className="text-nowrap" style={{ fontSize: '10px' }}>Total Gross Dividend</h6>
                                                                                {(parseFloat(total_gross_dividend || '0') / 2).toFixed(2)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {(parseInt(total_net_dividend || '0') > 0) && (
                                                            <div className="col-sm-2">
                                                                <div className="card">
                                                                    <div className="bg-secondary card-body">
                                                                        <div className="media feather-main">
                                                                            <div className="media-body align-self-center">
                                                                                <h6 className="text-nowrap" style={{ fontSize: '10px' }}>Total Net Dividend</h6>
                                                                                {parseFloat(total_net_dividend || '0').toFixed(2)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>
                                            )} */}

                                        </>
                                    )
                                }
                            </div>
                            <div className="card">
                                <div className="card-header d-flex justify-content-between" style={{ flexWrap: 'wrap' }}>
                                    <h5>Individuals Calculations</h5>
                                </div>
                                <div className="d-flex justify-content-start col-sm-10">
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <select
                                                name="search_criteria"
                                                className={`form-control`}
                                                onChange={(e) => {
                                                    setCriteria(e.target.value);
                                                    setSearch('');
                                                }}
                                            >
                                                <option value="name">Name</option>
                                                <option value="folioNumber">ID</option>
                                            </select>
                                        </div>
                                    </div>
                                    {(criteria == "folioNumber" || criteria == "") && (
                                        <div className="col-sm-5">
                                            <div className="form-group">
                                                <input
                                                    id="search"
                                                    className="form-control"
                                                    type="text"
                                                    placeholder={
                                                        criteria == "" || !criteria
                                                            ? `Select Criteria`
                                                            : `Search by ID`
                                                    }
                                                    value={search}
                                                    onChange={(e) => {
                                                        handleSearchChange(e, "folio");
                                                    }}
                                                    disabled={!criteria}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {criteria == "name" && (
                                        <div className="col-sm-5">
                                            <input
                                                id="search"
                                                className="form-control"
                                                type="text"
                                                placeholder={
                                                    criteria == "" || !criteria
                                                        ? `Select Criteria`
                                                        : `Search by Name`
                                                }
                                                value={search}
                                                onChange={(e) => {
                                                    handleSearchChange(e, "name");
                                                }}
                                                disabled={!criteria}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        {
                                            Object.keys(company).length !== 0 &&
                                            shareHoldings.length !== 0 && (
                                                <div className="table-responsive">
                                                    <table className="table ">
                                                        <thead>
                                                            <tr>
                                                                <th>S</th>
                                                                <th>ID</th>
                                                                <th>Name</th>
                                                                <th>Filer</th>
                                                                <th className="text-right">Share Holding</th>
                                                                <th className="text-right">Gross Dividend</th>
                                                                <th className="text-right">Tax Rate</th>
                                                                <th className="text-right">Tax Amount</th>
                                                                <th className="text-right">Zakat Amount</th>
                                                                <th className="text-right">Net Dividend</th>
                                                                <th className="text-right">Bonus</th>
                                                                <th className="text-right">B Fraction</th>
                                                                <th className="text-right">Right</th>
                                                                <th className="text-right">R Fraction</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>{displayCalCulateEntitlementPerPage} </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        <center className="d-flex justify-content-center py-3">
                                            <nav className="pagination">
                                                <ReactPaginate
                                                    previousLabel="Previous"
                                                    nextLabel="Next"
                                                    pageCount={pageCount}
                                                    onPageChange={changePage}
                                                    marginPagesDisplayed={1}
                                                    pageRangeDisplayed={3}
                                                    containerClassName={"pagination"}
                                                    previousClassName={"page-item"}
                                                    previousLinkClassName={"page-link"}
                                                    nextClassName={"page-item"}
                                                    nextLinkClassName={"page-link"}
                                                    disabledClassName={"disabled"}
                                                    pageLinkClassName={"page-link"}
                                                    pageClassName={"page-item"}
                                                    activeClassName={"page-item active"}
                                                    activeLinkClassName={"page-link"}
                                                />
                                            </nav>
                                        </center>
                                    </div>
                                </div>
                            </div>


                        </div >
                    </div >
                </div >
            </div >
        </Fragment >
    );
}
// import React, { Fragment, useState, useEffect } from "react";
// import ReactPaginate from "react-paginate";
// import { ToastContainer, toast } from "react-toastify";
// import {
//     sendBulkEntitlements,
//     getCorporateAnnouncementById,
//     getCorporateAnnouncement,
// } from "../../../store/services/corporate.service";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm, Controller } from "react-hook-form";
// import NumberFormat from "react-number-format";
// import LoadableButton from "../../common/loadables";
// import {
//     announcement_id_setter,
//     company_code_setter,
//     folio_setter,
// } from "../../../store/services/dropdown.service";
// import styled from "styled-components";
// import Select from "react-select";
// import { addShareCertificateSchema } from "../../../store/validations/shareCertificateValidation";
// import { errorStyles } from "../../defaultStyles";
// import { addEntitlementSchema } from "../../../store/validations/entitlementValidation";
// import { getCompanies, getCompanyById } from "../../../store/services/company.service";
// import { getShareHoldersByCompany } from "../../../store/services/shareholder.service";
// import { getInvestors } from "../../../store/services/investor.service";
// import { generateLetters, generateRegex, numberWithCommas } from "utilities/utilityFunctions";
// import { Collapse, UncontrolledTooltip } from "reactstrap";
// import Breadcrumb from "../../common/breadcrumb";
// import { Calculation } from "constant";
// import Spinner from "components/common/spinner";

// export default function ActionCalculator() {
//     const baseEmail = sessionStorage.getItem("email") || "";
//     // Validation Declarations
//     // const {
//     //     register,
//     //     watch,
//     //     formState: { errors },
//     //     handleSubmit,
//     //     control,
//     //     setValue,
//     // } = useForm({ resolver: yupResolver(addEntitlementSchema) });

//     // options
//     // const company_code = sessionStorage.getItem('company_code') || '';

//     const [announcement_id_options, setAnnoucement_id_options] = useState([]);
//     const [shareHoldings, setShareHoldings] = useState([]);
//     const [investors, setInvestors] = useState([]);
//     const [selectedAnnouncement, setSelectedAnnouncement] = useState({});
//     const [company, setCompany] = useState({});
//     const [selectedCompany, setSelectedCompany] = useState('');
//     const [company_code_options, setCompany_code_options] = useState([]);
//     const [flag, setFlag] = useState(false);
//     const [dividendPercent, setDividendPercent] = useState("");
//     const [underSearch, setUnderSearch] = useState("");
//     const [companies_dropdown, setCompanies_dropdown] = useState([]);
//     const [companies_data_loading, setCompanies_data_loading] = useState(false);

//     const [dividendPercentage, setDividendPercentage] = useState("");
//     const [bonusPercentage, setBonusPercentage] = useState("");
//     const [rightPercentage, setRightPercentage] = useState("");
//     const [rightRate, setRightRate] = useState("");
//     const [filerTax, setFilerTax] = useState("");
//     const [nonFilerTax, setNonFilerTax] = useState("");
//     const [faceVal, setFaceVal] = useState("");
//     const [outstandingShares, setOutstandingShares] = useState("");
//     const [paidCapital, setPaidCapital] = useState("");

//     const [searchShareHoldings, setSearchShareHoldings] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [announcement, setAnnouncement] = useState([]);
//     const [criteria, setCriteria] = useState('name');
//     const [search, setSearch] = useState('');
//     const [totalActions, setTotalActions] = useState(0)
//     let allotment_number = 1;
//     // let total_bonus_shares = 0;
//     // let [allotment_number, setAllotmentNumber] = useState(0);
//     let [total_bonus_shares, setTotalBonusShare] = useState(0);
//     let [total_right_shares, setTotalShare] = useState(0);
//     let [total_gross_dividend, setTotalGrossDiv] = useState(0);
//     let [total_net_dividend, setTotalNetDiv] = useState(0);
//     let [total_b_fraction, setTotalBShare] = useState(0);
//     let [total_r_fraction, setTotalRShare] = useState(0);
//     // let total_gross_dividend = 0;
//     // let total_net_dividend = 0;
//     // let total_b_fraction = 0;
//     // let total_r_fraction = 0;
//     let [totalActionShares, setTotalActionShare] = useState(0);
//     let [currentOutstandingShares, setCurrentOutstandingShares] = useState(0);
//     let [withholdingTax, setWithholdingTax] = useState(0);
//     let [outstandingAfterAction, setOutstandingAfterAction] = useState(0);
//     let [totalZakat, setTotalZakat] = useState(0);
//     let [paidupCapital, setPaidupCapital] = useState(0);
//     let [additionalCapital, setAdditionalCapital] = useState(0);
//     let [paidupCapitalAfterAction, setPaidupCapitalAfterAction] = useState(0);
//     // let totalActionShares;
//     // let currentOutstandingShares = 0;
//     // let outstandingAfterAction = 0;
//     // let withholdingTax = 0;
//     // let totalZakat = 0;
//     // let paidupCapital = 0;
//     // let additionalCapital = 0;
//     // let paidupCapitalAfterAction = 0;

//     useEffect(() => {
//         const getAllCorporateAnnouncement = async () => {
//             try {
//                 const response = await getCorporateAnnouncement(baseEmail);
//                 if (response.status === 200) {
//                     setAnnouncement(response.data.data);
//                 }
//             } catch (error) { }
//         };
//         getAllCorporateAnnouncement();
//     }, []);

//     const WrapperForResponsive = styled.div`
//     @media(max-width: 765px){
//       .responsive{
//       width: 350px;
//       margin: auto;
//       }
//     }
//     @media(max-width: 500px){
//       .responsive{
//       width: 200px;
//       margin: auto;
//       }
//     }
//     `;

//     useEffect(() => {
//         setCompanies_data_loading(true)
//         const getAllCompanies = async () => {
//             try {
//                 const response = await getCompanies(baseEmail)
//                 if (response.status === 200) {
//                     const parents = response.data.data
//                     const companies_dropdowns = response.data.data.map((item) => {
//                         let label = `${item.code} - ${item.company_name}`;
//                         return { label: label, value: item.code };
//                     });
//                     setCompanies_dropdown(companies_dropdowns);
//                     setCompanies_data_loading(false)
//                 }
//             } catch (error) {
//                 setCompanies_data_loading(false)
//             }
//         };

//         getAllCompanies();
//     }, []);

//     useEffect(() => {
//         const getCompany = async () => {
//             try {
//                 const response = await getCompanyById(
//                     baseEmail,
//                     selectedCompany
//                 );
//                 if (response.status === 200) {
//                     setCompany(response.data.data);
//                 }
//             } catch (error) {
//                 !!error?.response?.data?.message
//                     ? toast.error(error?.response?.data?.message)
//                     : toast.error("Company Not Found");
//             }
//         };
//         if (!!selectedCompany) {
//             getCompany();
//         }
//     }, [selectedCompany]);

//     useEffect(() => {
//         const getShareHolders = async () => {
//             try {
//                 const response = await getShareHoldersByCompany(
//                     baseEmail,
//                     selectedCompany,
//                     "/active"
//                 );
//                 if (response.status === 200) {
//                     let physicalHolding = response.data.data.filter(
//                         (folio) =>
//                             folio.cdc_key == "NO" && folio.folio_number !== selectedCompany + "-0"
//                     ).sort((a, b) => a.folio_number.replace(`${selectedCompany}-`, '').replace('-', '') - b.folio_number.replace(`${selectedCompany}-`, '').replace('-', ''))

//                     let electronicHolding = response.data.data.filter(
//                         (folio) =>
//                             folio.cdc_key == "YES" && folio.folio_number !== selectedCompany + "-0"
//                     ).sort((a, b) => a.folio_number.replace(`${selectedCompany}-`, '').replace('-', '') - b.folio_number.replace(`${selectedCompany}-`, '').replace('-', ''))
//                     //
//                     // setShareHoldings(
//                     //   response.data.data.filter(
//                     //     (folio) =>
//                     //       folio.folio_number !== selectedAnnouncement?.company_code + "-0"
//                     //   )
//                     //   // .map((sh) => ({...sh, folio_number: sh.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'')}))
//                     //   .sort((a, b) => a.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'').replace('-','') - b.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'').replace('-',''))
//                     // );
//                     let cdcHolding = response.data.data.filter((folio) =>
//                         folio.folio_number == selectedCompany + "-0")
//                     setShareHoldings(
//                         [...physicalHolding, ...electronicHolding, ...cdcHolding]
//                     );
//                 }
//             } catch (error) {
//                 !!error?.response?.data?.message
//                     ? toast.error(error?.response?.data?.message)
//                     : toast.error("Folios Not Found");
//             }
//         };
//         const getAllInvestors = async () => {
//             try {
//                 const response = await getInvestors(baseEmail);
//                 if (response.status === 200) {
//                     setInvestors(response.data.data);
//                 }
//             } catch (error) {
//                 !!error?.response?.data?.message
//                     ? toast.error(error?.response?.data?.message)
//                     : toast.error("Folios Not Found");
//             }
//         };
//         if (selectedCompany !== '') {
//             getShareHolders();
//         }
//         getAllInvestors();
//     }, [company]);

//     // useEffect(() => {
//     //   if(underSearch===false){

//     //   }else{

//     //   }
//     // }, [searchShareHoldings, shareHoldings])


//     useEffect(() => {
//         const getAnnouncementOptions = async () => {

//             try {
//                 setAnnoucement_id_options(
//                     announcement
//                         .filter((ann) => ann.expired !== "true")
//                         .map((item) => {
//                             let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
//                             return { label: label, value: item.announcement_id };
//                         })
//                 );
//                 setCompany_code_options(await company_code_setter());
//             } catch (error) {
//                 !!error?.response?.data?.message
//                     ? toast.error(error?.response?.data?.message)
//                     : toast.error("Announcements Not Found");
//             }
//         };
//         getAnnouncementOptions();
//     }, [announcement]);



//     const getHoldings = (holdings, allotment_number, value) => {
//         return holdings
//             .filter(
//                 (holding) =>
//                     holding.physical_shares > 0 || holding.electronic_shares > 0 || holding.folio_number == selectedCompany + "-0"
//             )
//             .map((holding, i) => {

//                 let electronic_shares;
//                 let total_holding;
//                 let physical_shares;
//                 let filer;
//                 let zakat_status;
//                 let gross_div;
//                 let filer_tax;
//                 let non_filer_tax;
//                 let b_fraction;
//                 let r_fraction;
//                 let tax_exempted;
//                 let zakat;
//                 let bonus_shares;
//                 let right_shares;
//                 let net_dividend;
//                 let allotment_letters;
//                 let tax_rate;


//                 electronic_shares = !!holding?.electronic_shares
//                     ? holding?.electronic_shares
//                     : "0";
//                 physical_shares = !!holding?.physical_shares
//                     ? holding?.physical_shares
//                     : "0";
//                 total_holding = (
//                     parseInt(electronic_shares) + parseInt(physical_shares)
//                 ).toString();
//                 filer = holding.filer === "Y" ? "Y" : "N";
//                 let roshan_account = holding.roshan_account === "Y" ? "Y" : "N";
//                 zakat_status = holding?.zakat_status === "Y" ? "Y" : "N";
//                 zakat =
//                     zakat_status === "Y"
//                         ? (total_holding * parseInt(faceVal || "0")) / 40
//                         : 0;
//                 if (flag === true) {
//                     gross_div = dividendPercentage
//                         ? (total_holding * faceVal * dividendPercentage) / 100
//                         : 0;
//                     tax_rate =
//                         filer === "Y"
//                             ? `${filerTax}%`
//                             : `${nonFilerTax}%`;
//                     filer_tax = parseInt(filerTax || "0") / 100;
//                     non_filer_tax = parseInt(nonFilerTax || "0") / 100;
//                     tax_exempted =
//                         filer === "Y" ? gross_div * filer_tax : gross_div * non_filer_tax;
//                     bonus_shares =
//                         (total_holding * parseInt(bonusPercentage || "0")) / 100;
//                     b_fraction = "0." + (bonus_shares.toString().split(".")[1] || 0);
//                     right_shares =
//                         (total_holding * parseInt(rightPercentage || "0")) / 100;
//                     r_fraction = "0." + (right_shares.toString().split(".")[1] || 0);
//                     net_dividend = gross_div ? gross_div - tax_exempted - zakat : 0;



//                     //  account_title = holding?.account_title;
//                     //  account_no = investors.find(
//                     //     (inv) => inv.cnic === holding.shareholder_cnic
//                     // )?.account_no;
//                     // let bank = holding?.bank_name;
//                     // let branch = holding?.baranch_address + " - " + holding?.baranch_city;
//                     allotment_letters = !!(parseInt(rightRate || '0'))
//                         ? holding.cdc_key === "NO"
//                             ? generateLetters(
//                                 parseInt(company.allot_size),
//                                 parseInt(right_shares && right_shares.toString().split(".")[0]),
//                                 parseInt(allotment_number)
//                             )
//                             : []
//                         : [];
//                     // allotment_number += allotment_letters.length;
//                     // total_bonus_shares += parseFloat(bonus_shares || '0');
//                     // total_right_shares += parseFloat(right_shares || '0');
//                     // total_gross_dividend += parseFloat(gross_div || '0');
//                     // total_net_dividend += parseFloat(net_dividend || '0');
//                     // total_b_fraction += parseFloat(b_fraction || '0');
//                     // total_r_fraction += parseFloat(r_fraction || '0');

//                     // let totalActShares = (parseFloat(bonus_shares || '0') + parseFloat(b_fraction || '0') + parseFloat(right_shares || '0') + parseFloat(r_fraction || '0'));
//                     // currentOutstandingShares = parseFloat(outstandingShares || '0');
//                     // let outstandingAfterAct = parseFloat(totalActShares || '0') + parseFloat(outstandingShares || '0');
//                     // withholdingTax = +parseFloat(tax_exempted || '0');
//                     // totalZakat += parseFloat(zakat || '0');
//                     // paidupCapital = parseFloat(paidCapital || '0');
//                     // let additionalCap = ((parseInt(bonus_shares || '0') + parseInt(b_fraction || '0'))
//                     //     * parseInt(faceVal || '0'))
//                     //     +
//                     //     ((parseInt(right_shares || '0') + parseInt(r_fraction || '0')) * parseInt(rightRate || 0)
//                     //     )
//                     // let paidupCapitalAfterAct = parseFloat(paidCapital || '0') + parseFloat(additionalCap || '0');

//                     // totalActionShares = parseFloat(totalActionShares || '0') + parseFloat(totalActShares || '0');
//                     // outstandingAfterAction += parseFloat(outstandingAfterAct || '0');
//                     // additionalCapital += parseFloat(additionalCap || '0');
//                     // paidupCapitalAfterAction += parseFloat(paidupCapitalAfterAct || '0');
//                 }

//                 return {
//                     s_no: i + 1,
//                     folio_number: holding.folio_number || "",
//                     shareholder_name: holding.shareholder_name || "",
//                     filer: filer,
//                     total_holding: total_holding,
//                     gross_dividend: gross_div,
//                     tax_percentage: tax_rate,
//                     tax: tax_exempted,
//                     net_dividend: net_dividend,
//                     zakat: zakat,
//                     bonus_shares: bonus_shares,
//                     right_shares: right_shares,
//                     b_fraction: b_fraction,
//                     r_fraction: r_fraction,
//                     shareholder_id: holding.shareholder_id,
//                     allotment_letters,
//                 };
//             }


//             )
//     };





//     /*  ---------------------  */
//     /*  Pagination Code Start  */
//     /*  ---------------------  */
//     const [pageNumber, setPageNumber] = useState(0);
//     const calCulateEntitlementPerPage = 10;
//     const pagesVisited = pageNumber * calCulateEntitlementPerPage;
//     const totalnumberofPages = 100;
//     const displayCalCulateEntitlementPerPage = !underSearch ?
//         getHoldings(shareHoldings, allotment_number)
//             .sort((a, b) => {
//                 if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
//                     return -1;
//                 if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
//                     return 1;
//                 return 0;
//             })
//             .slice(pagesVisited, pagesVisited + calCulateEntitlementPerPage)
//             .map(
//                 (holding, i) => (
//                     <tr>
//                         <td>{i + 1}</td>
//                         <td>{holding.folio_number}</td>
//                         <td>{holding.shareholder_name}</td>
//                         <td>{holding.filer}</td>
//                         <td className="text-right">
//                             {numberWithCommas(parseFloat(Math.trunc(holding.total_holding) || '0'))}
//                         </td>
//                         <td className="text-right">
//                             {numberWithCommas(parseFloat(Math.trunc(holding.gross_dividend) || '0'))}
//                         </td>
//                         <td className="text-right">
//                             {numberWithCommas(parseFloat(holding.tax_percentage || '0'))}{" "}
//                         </td>
//                         <td className="text-right">
//                             {numberWithCommas(parseFloat(Math.trunc(holding.tax) || '0'))}
//                         </td>
//                         <td className="text-right">
//                             {numberWithCommas(parseFloat(parseFloat(holding.zakat) || '0').toFixed(2))}
//                         </td>
//                         <td className="text-right">
//                             {numberWithCommas(parseFloat(Math.trunc(holding.net_dividend) || '0'))}
//                         </td>
//                         <td className="text-right">
//                             {numberWithCommas(parseFloat(Math.trunc(holding.bonus_shares) || '0'))}
//                         </td>
//                         <td className="text-right">{numberWithCommas(parseFloat(holding.b_fraction || '0').toFixed(2))}</td>
//                         <td className="text-right">
//                             {numberWithCommas(parseFloat(Math.trunc(holding.right_shares) || '0'))}
//                         </td>
//                         <td className="text-right">{numberWithCommas(parseFloat(holding.r_fraction || '0').toFixed(2))}</td>
//                     </tr>
//                 )
//             ) : getHoldings(searchShareHoldings, allotment_number)
//                 .sort((a, b) => {
//                     if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
//                         return -1;
//                     if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
//                         return 1;
//                     return 0;
//                 })
//                 .slice(pagesVisited, pagesVisited + calCulateEntitlementPerPage)
//                 .map(
//                     (holding, i) => (
//                         <tr>
//                             <td>{i + 1}</td>
//                             <td>{holding.folio_number}</td>
//                             <td>{holding.shareholder_name}</td>
//                             <td>{holding.filer}</td>
//                             <td className="text-right">
//                                 {numberWithCommas(parseFloat(Math.trunc(holding.total_holding) || '0'))}
//                             </td>
//                             <td className="text-right">
//                                 {numberWithCommas(parseFloat(Math.trunc(holding.gross_dividend) || '0'))}
//                             </td>
//                             <td className="text-right">
//                                 {numberWithCommas(parseFloat(holding.tax_percentage || '0'))}{" "}
//                             </td>
//                             <td className="text-right">
//                                 {numberWithCommas(parseFloat(Math.trunc(holding.tax) || '0'))}
//                             </td>
//                             <td className="text-right">
//                                 {numberWithCommas(parseFloat(parseFloat(holding.zakat) || '0').toFixed(2))}
//                             </td>
//                             <td className="text-right">
//                                 {numberWithCommas(parseFloat(Math.trunc(holding.net_dividend) || '0'))}
//                             </td>
//                             <td className="text-right">
//                                 {numberWithCommas(parseFloat(Math.trunc(holding.bonus_shares) || '0'))}
//                             </td>
//                             <td className="text-right">{numberWithCommas(parseFloat(holding.b_fraction || '0').toFixed(2))}</td>
//                             <td className="text-right">
//                                 {numberWithCommas(parseFloat(Math.trunc(holding.right_shares) || '0'))}
//                             </td>
//                             <td className="text-right">{numberWithCommas(parseFloat(holding.r_fraction || '0').toFixed(2))}</td>
//                         </tr>
//                     )
//                 )

//     const pageCount = !underSearch
//         ? Math.ceil(getHoldings(shareHoldings, allotment_number).length / calCulateEntitlementPerPage)
//         : Math.ceil(getHoldings(searchShareHoldings, allotment_number).length / calCulateEntitlementPerPage);

//     // const pageCount = Math.ceil( / calCulateEntitlementPerPage);

//     const changePage = ({ selected }) => {
//         setPageNumber(selected);
//     };
//     /*  ---------------------  */
//     /*  Pagination Code Ended  */
//     /*  ---------------------  */

//     // Search By name and folio number
//     const handleSearchChange = (e, val) => {
//         !!e && setSearch(e.target.value);
//         !!e && setUnderSearch(e.target.value);
//         if (e?.target?.value?.length > 0) {
//             if (val === 'folio') {
//                 let searchByFolio = shareHoldings.filter((item => {
//                     return item.folio_number.match(generateRegex(e.target.value));
//                 }))
//                 setSearchShareHoldings(searchByFolio)

//             } else {
//                 let searchByName = shareHoldings.filter((item => {
//                     return item.shareholder_name.match(generateRegex(e.target.value));
//                 }))
//                 setSearchShareHoldings(searchByName)
//             }
//         }

//         if (!e?.target?.value) {
//             setSearchShareHoldings(shareHoldings)
//         }

//     }


//     useEffect(() => {
//         if (Object.keys(company).length > 0) {
//             setFaceVal(company?.face_value || '');
//             setOutstandingShares(company?.outstanding_shares || '');
//             setPaidCapital(company?.paid_up_capital || '');
//             //         setValue("dividend_percentage", '');
//             //         setValue("bonus_percentage", '');
//             //         setValue("right_percentage", '');
//             //         setValue("right_rate", '');
//             setFilerTax("15")
//             setNonFilerTax("30")
//         }
//     }, [company]);

//     const getActionSummaryData = () => {
//         shareHoldings
//             .filter(
//                 (holding) =>
//                     holding.physical_shares > 0 || holding.electronic_shares > 0 || holding.folio_number == selectedCompany + "-0"
//             )
//             .map((holding, i) => {

//                 let electronic_shares = 0;
//                 let total_holding = 0;
//                 let physical_shares = 0;
//                 let filer;
//                 let zakat_status = 0;
//                 let gross_div = 0;
//                 let filer_tax = 0;
//                 let non_filer_tax = 0;
//                 let b_fraction = 0;
//                 let r_fraction = 0;
//                 let tax_exempted = 0;
//                 let zakat = 0;
//                 let bonus_shares = 0;
//                 let right_shares = 0;
//                 let net_dividend = 0;
//                 let allotment_letters = 0;
//                 let tax_rate = 0;



//                 electronic_shares = !!holding?.electronic_shares
//                     ? holding?.electronic_shares
//                     : "0";
//                 physical_shares = !!holding?.physical_shares
//                     ? holding?.physical_shares
//                     : "0";
//                 total_holding = (
//                     parseInt(electronic_shares) + parseInt(physical_shares)
//                 ).toString();
//                 filer = holding.filer === "Y" ? "Y" : "N";
//                 let roshan_account = holding.roshan_account === "Y" ? "Y" : "N";
//                 zakat_status = holding?.zakat_status === "Y" ? "Y" : "N";
//                 zakat =
//                     zakat_status === "Y"
//                         ? (total_holding * parseInt(faceVal || "0")) / 40
//                         : 0;
//                 // if (flag === true) {
//                 gross_div = dividendPercentage
//                     ? (total_holding * faceVal * dividendPercentage) / 100
//                     : 0;
//                 tax_rate =
//                     filer === "Y"
//                         ? `${filerTax}%`
//                         : `${nonFilerTax}%`;
//                 filer_tax = parseInt(filerTax || "0") / 100;
//                 non_filer_tax = parseInt(nonFilerTax || "0") / 100;
//                 tax_exempted =
//                     filer === "Y" ? gross_div * filer_tax : gross_div * non_filer_tax;
//                 bonus_shares =
//                     (total_holding * parseInt(bonusPercentage || "0")) / 100;
//                 b_fraction = "0." + (bonus_shares.toString().split(".")[1] || 0);
//                 right_shares =
//                     (total_holding * parseInt(rightPercentage || "0")) / 100;
//                 r_fraction = "0." + (right_shares.toString().split(".")[1] || 0);
//                 net_dividend = gross_div ? gross_div - tax_exempted - zakat : 0;



//                 //  account_title = holding?.account_title;
//                 //  account_no = investors.find(
//                 //     (inv) => inv.cnic === holding.shareholder_cnic
//                 // )?.account_no;
//                 // let bank = holding?.bank_name;
//                 // let branch = holding?.baranch_address + " - " + holding?.baranch_city;
//                 allotment_letters = !!(parseInt(rightRate || '0'))
//                     ? holding.cdc_key === "NO"
//                         ? generateLetters(
//                             parseInt(company.allot_size),
//                             parseInt(right_shares && right_shares.toString().split(".")[0]),
//                             parseInt(allotment_number)
//                         )
//                         : []
//                     : [];
//                 // allotment_number += allotment_letters.length;
//                 total_bonus_shares += parseFloat(bonus_shares || '0');
//                 total_right_shares += parseFloat(right_shares || '0');
//                 total_gross_dividend += parseFloat(gross_div || '0');
//                 total_net_dividend += parseFloat(net_dividend || '0');
//                 total_b_fraction += parseFloat(b_fraction || '0');
//                 total_r_fraction += parseFloat(r_fraction || '0');
//                 let totalActShares = (parseFloat(bonus_shares || '0') + parseFloat(b_fraction || '0') + parseFloat(right_shares || '0') + parseFloat(r_fraction || '0'));
//                 currentOutstandingShares = parseFloat(outstandingShares || '0');
//                 let outstandingAfterAct = parseFloat(totalActShares || '0') + parseFloat(outstandingShares || '0');
//                 withholdingTax = +parseFloat(tax_exempted || '0');
//                 totalZakat += parseFloat(zakat || '0');
//                 paidupCapital = parseFloat(paidCapital || '0');
//                 let additionalCap = ((parseFloat(bonus_shares || '0') + parseFloat(b_fraction || '0'))
//                     * parseFloat(faceVal || '0'))
//                     +
//                     ((parseFloat(right_shares || '0') + parseFloat(r_fraction || '0')) * parseFloat(rightRate || 0)
//                     )
//                 let paidupCapitalAfterAct = parseFloat(paidCapital || '0') + parseFloat(additionalCap || '0');

//                 totalActionShares = parseFloat(totalActionShares || '0') + parseFloat(totalActShares || '0');
//                 outstandingAfterAction += parseFloat(outstandingAfterAct || '0');
//                 additionalCapital += parseFloat(additionalCap || '0');
//                 paidupCapitalAfterAction += parseFloat(paidupCapitalAfterAct || '0');


//                 setTotalShare(total_right_shares);
//                 setTotalBonusShare(total_bonus_shares);
//                 setTotalGrossDiv(total_gross_dividend)
//                 setTotalNetDiv(total_net_dividend)
//                 setTotalActionShare(totalActionShares)
//                 setTotalBShare(total_b_fraction)
//                 setTotalRShare(total_r_fraction)
//                 setOutstandingAfterAction(outstandingAfterAction)
//                 setCurrentOutstandingShares(currentOutstandingShares)
//                 setWithholdingTax(withholdingTax)
//                 setTotalZakat(totalZakat)
//                 setPaidupCapital(paidupCapital)
//                 setAdditionalCapital(additionalCapital)
//                 setPaidupCapitalAfterAction(paidupCapitalAfterAction)

//                 // }

//             }


//             )

//     };

//     const calculations = () => {
//         total_right_shares = 0;
//         total_bonus_shares = 0;
//         total_gross_dividend = 0
//         total_net_dividend = 0
//         totalActionShares = 0
//         total_b_fraction = 0
//         total_r_fraction = 0
//         outstandingAfterAction = 0
//         currentOutstandingShares = 0
//         withholdingTax = 0
//         totalZakat = 0
//         paidupCapital = 0
//         additionalCapital = 0
//         paidupCapitalAfterAction = 0
//         // setTotalShare(0);
//         // setTotalBonusShare(0);
//         // setTotalGrossDiv(0)
//         // setTotalNetDiv(0)
//         // setTotalActionShare(0)
//         // setTotalBShare(0)
//         // setTotalRShare(0)
//         // setOutstandingAfterAction(0)
//         // setCurrentOutstandingShares(0)
//         // setWithholdingTax(0)
//         // setTotalZakat(0)
//         // setPaidupCapital(0)
//         // setAdditionalCapital(0)
//         // setPaidupCapitalAfterAction(0)
//         setFlag(true)
//         getActionSummaryData();
//     }


//     return (
//         <Fragment>
//             <div className="d-flex justify-content-between">
//                 <div>
//                     <Breadcrumb
//                         title="Action Calculator"
//                         parent="Corporate"
//                         hideBookmark
//                     />
//                 </div>
//             </div>
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className="col-sm-12">
//                         <div className="card">
//                             <div className="card-header d-flex justify-content-between" style={{ flexWrap: 'wrap' }}>
//                                 <h5>Action Calculator</h5>
//                             </div>
//                             <div className="row pt-2">
//                                 <div className="col-sm-12 col-md-12 col-lg-12 ">

//                                     <div className="card-header">
//                                         <h5>Configuration</h5>
//                                     </div>
//                                     <div className="card-body">
//                                         {/* Dividend Row */}
//                                         <div className="row">
//                                             <div className="col-md-3">
//                                                 <div className="form-group  my-2">
//                                                     <label htmlFor="company">Company</label>
//                                                     <Select
//                                                         options={companies_dropdown}
//                                                         isLoading={companies_data_loading}
//                                                         style={!selectedCompany && errorStyles}
//                                                         isClearable={true}
//                                                         onChange={(selected) => {
//                                                             selected && setSelectedCompany(selected.value);
//                                                             !selected && setSelectedCompany("");
//                                                         }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-3">
//                                                 <div className="form-group my-2">
//                                                     <label >Dividend Percentage</label>
//                                                     <div className="input-group mb-3">
//                                                         <NumberFormat
//                                                             className="form-control"
//                                                             value={dividendPercentage}
//                                                             onValueChange={(e) => {
//                                                                 setFlag(false);
//                                                                 setDividendPercentage(parseFloat(e.value || ''));
//                                                             }}
//                                                             // value={selectedAnnouncement.dividend_percent}
//                                                             placeholder="Enter Dividend Percentage"
//                                                         />
//                                                         <div className="input-group-append">
//                                                             <span
//                                                                 className="input-group-text"
//                                                                 id="basic-addon2"
//                                                             >
//                                                                 %
//                                                             </span>
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                             </div>
//                                             <div className="col-md-3">
//                                                 <div className="form-group my-2">
//                                                     <label>Bonus Percentage</label>
//                                                     <div className="input-group mb-3">
//                                                         <NumberFormat
//                                                             className="form-control"
//                                                             value={bonusPercentage}
//                                                             onValueChange={(e) => {
//                                                                 setFlag(false)
//                                                                 setBonusPercentage((e.value || ''));
//                                                             }}
//                                                             // value={selectedAnnouncement.bonus_percent}
//                                                             placeholder="Enter Bonus Percentage"
//                                                         />
//                                                         <div className="input-group-append">
//                                                             <span
//                                                                 className="input-group-text"
//                                                                 id="basic-addon2"
//                                                             >
//                                                                 %
//                                                             </span>
//                                                         </div>
//                                                     </div>

//                                                 </div>
//                                             </div>

//                                             <div className="col-md-3">
//                                                 <div className="form-group my-2">
//                                                     <label>Right Percentage</label>
//                                                     <div className="input-group mb-3">
//                                                         <NumberFormat
//                                                             className="form-control"
//                                                             value={rightPercentage}
//                                                             onValueChange={(e) => {
//                                                                 setFlag(false)
//                                                                 setRightPercentage((e.value || ''));
//                                                             }}
//                                                             // value={selectedAnnouncement.right_percent}
//                                                             placeholder="Enter Right Percentage"
//                                                         />
//                                                         <div className="input-group-append">
//                                                             <span
//                                                                 className="input-group-text"
//                                                                 id="basic-addon2"
//                                                             >
//                                                                 %
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* </div> */}
//                                         </div>
//                                         {/* TAX RATE */}
//                                         <div className="row">
//                                             <div className="col-md-3">
//                                                 <div className="form-group my-2">
//                                                     <label htmlFor="right_rate">Right Rate</label>
//                                                     <NumberFormat
//                                                         className={`form-control`}
//                                                         value={rightRate}
//                                                         onValueChange={(e) => {
//                                                             setFlag(false)
//                                                             setRightRate((e.value || ''));
//                                                         }}
//                                                         allowNegative={false}
//                                                         placeholder="Right Rate"
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-3">
//                                                 <div className="form-group my-2">
//                                                     <label>Filer Tax</label>
//                                                     <div className="input-group mb-3">
//                                                         <NumberFormat
//                                                             className={`form-control`}
//                                                             value={filerTax}
//                                                             onValueChange={(e) => {
//                                                                 setFlag(false)
//                                                                 setFilerTax(e.value || '');
//                                                             }}
//                                                             allowNegative={false}
//                                                             placeholder="Enter Tax Rate"
//                                                         />
//                                                         <div className="input-group-append">
//                                                             <span
//                                                                 className="input-group-text"
//                                                                 id="basic-addon2"
//                                                             >
//                                                                 %
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="col-md-3">
//                                                 <div className="form-group my-2">
//                                                     <label>Non Filer Tax</label>
//                                                     <div className="input-group mb-3">
//                                                         <NumberFormat
//                                                             className={`form-control`}
//                                                             value={nonFilerTax}
//                                                             onValueChange={(e) => {
//                                                                 setFlag(false)
//                                                                 setNonFilerTax(e.value || '');
//                                                             }}
//                                                             allowNegative={false}
//                                                             placeholder="Non Filer Tax"
//                                                         />
//                                                         <div className="input-group-append">
//                                                             <span
//                                                                 className="input-group-text"
//                                                                 id="basic-addon2"
//                                                             >
//                                                                 %
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-3">
//                                                 <div className="form-group my-2">
//                                                     <label>Face Value </label>
//                                                     <NumberFormat
//                                                         className={`form-control text-right`}
//                                                         value={faceVal}
//                                                         decimalScale={2}
//                                                         placeholder="Enter Face Number"
//                                                         readOnly
//                                                     />
//                                                 </div>
//                                             </div>

//                                             <div className="col-md-3">
//                                                 <div className="form-group my-2">
//                                                     <br />
//                                                     <button
//                                                         type="submit"
//                                                         className="btn btn-primary m-2"
//                                                         onClick={() => {
//                                                             calculations();
//                                                         }}
//                                                     >
//                                                         Calculate
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div>
//                             </div>
//                             <div className="card">
//                                 <div className="card-header d-flex justify-content-between" style={{ flexWrap: 'wrap' }}>
//                                     <h5>Action Summary</h5>
//                                 </div>
//                                 {
//                                     (shareHoldings.length > 0 || searchShareHoldings.length > 0) && (
//                                         <>{
//                                             (parseInt(total_gross_dividend || '0') > 0 || parseInt(total_net_dividend || '0') || parseInt(total_right_shares || '0') > 0 || parseInt(total_bonus_shares || '0') > 0 || parseInt(total_b_fraction || '0') > 0 || parseInt(total_r_fraction || '0') > 0 || ((parseInt(total_right_shares || '0').toFixed(2) * parseInt(rightRate || '0')) / 2) > 0) && (
//                                                 <div className="container-fluid">
//                                                     <WrapperForResponsive>
//                                                         <div className="row responsive">
//                                                             {(parseInt(total_bonus_shares || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Bonus Shares</div>
//                                                                     <h5 className="text-right">{numberWithCommas((parseInt((total_bonus_shares || '0') / 2)))}</h5>
//                                                                 </div>
//                                                             )}
//                                                             {(parseFloat(total_b_fraction || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Bonus Fraction</div>
//                                                                     <h5 className="text-right">{(parseInt((total_b_fraction || '0') / 2))}</h5>
//                                                                 </div>
//                                                             )}

//                                                             {(parseInt(total_right_shares || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Right Shares</div>
//                                                                     <h5 className="text-right">{numberWithCommas((parseInt((total_right_shares || '0') / 2)))}</h5>
//                                                                 </div>
//                                                             )}

//                                                             {(parseFloat(total_r_fraction || '0').toFixed(2) > 0.00) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Right Fraction</div>
//                                                                     <h5 className="text-right">{numberWithCommas((parseInt((total_r_fraction || '0') / 2)))}</h5>
//                                                                 </div>
//                                                             )}
//                                                             {(parseInt(totalActionShares || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Action Shares</div>
//                                                                     <h5 className="text-right">{numberWithCommas(((parseInt((totalActionShares || '0')) / 2)))}</h5>
//                                                                 </div>
//                                                             )}

//                                                             {(((parseInt(total_right_shares || '0').toFixed(2) * parseInt(rightRate || '0')) / 2).toFixed(2) > 0.00) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Right Amount</div>
//                                                                     <h5 className="text-right">{numberWithCommas(((parseInt(total_right_shares || '0') * parseInt(rightRate || '0')) / 2))}</h5>
//                                                                 </div>
//                                                             )}

//                                                             {(parseInt(currentOutstandingShares || '0').toFixed(2) > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Current Outstanding Shares</div>
//                                                                     <h5 className="text-right">{numberWithCommas(((parseInt((currentOutstandingShares || '0').toFixed(2)) / 2)))}</h5>
//                                                                 </div>
//                                                             )}



//                                                             {(parseInt(outstandingAfterAction || '0').toFixed(2) > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Outstanding After Action</div>
//                                                                     <h5 className="text-right">{numberWithCommas(((parseInt((outstandingAfterAction || '0')) / 2)))}</h5>
//                                                                 </div>
//                                                             )}

//                                                             {/* {(parseInt(outstandingAfterAction || '0').toFixed(2) > 0) && (
//                                                                 <div className="col-md-2">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Current Outstanding Shares</div>
//                                                                     <h5 className="text-right">{numberWithCommas(((parseFloat(outstandingAfterAction || '0').toFixed(2)) / 2).toFixed(2))}</h5>
//                                                                 </div>
//                                                             )} */}

//                                                             {(parseInt(total_gross_dividend || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Gross Dividend</div>
//                                                                     <h5 className="text-right">{numberWithCommas((parseInt(total_gross_dividend || '0') / 2))}</h5>
//                                                                 </div>
//                                                             )}


//                                                             {(parseInt(withholdingTax || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Withholding Tax </div>
//                                                                     <h5 className="text-right">{numberWithCommas((parseInt(withholdingTax || '0') / 2))}</h5>
//                                                                 </div>
//                                                             )}

//                                                             {(parseInt(totalZakat || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Zakat  </div>
//                                                                     <h5 className="text-right">{numberWithCommas(parseInt(totalZakat || '0') / 2)}</h5>
//                                                                 </div>
//                                                             )}

//                                                             {(parseInt(total_net_dividend || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Net Dividend</div>
//                                                                     <h5 className="text-right">{numberWithCommas(parseInt(total_net_dividend || '0'))}</h5>
//                                                                 </div>
//                                                             )}

//                                                             {(parseInt(additionalCapital || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Additional Capital </div>
//                                                                     <h5 className="text-right">{numberWithCommas(parseInt(additionalCapital || '0'))}</h5>
//                                                                 </div>
//                                                             )}
//                                                             {(parseInt(paidupCapital || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Paidup Capital </div>
//                                                                     <h5 className="text-right">{numberWithCommas(parseInt(paidupCapital || '0'))}</h5>
//                                                                 </div>
//                                                             )}

//                                                             {(parseInt(paidupCapitalAfterAction || '0') > 0) && (
//                                                                 <div className="col-md-3">
//                                                                     <div style={{ fontFamily: '"Montserrat",sans-serif;' }} className="text-right">Paidup Capital After Action </div>
//                                                                     <h5 className="text-right">{numberWithCommas(parseInt(paidupCapitalAfterAction || '0'))}</h5>
//                                                                 </div>
//                                                             )}







//                                                             {/* {(((parseInt(total_right_shares || '0').toFixed(2) * parseInt(watch("right_rate") || '0')) / 2) > 0) && (<><div className="col-md-3"><b>Total Right Rate</b></div><div className="col-md-2">{((parseFloat(total_right_shares || '0').toFixed(2) * parseInt(watch("right_rate") || '0')) / 2).toFixed(2)}</div></>)} */}

//                                                         </div>
//                                                     </WrapperForResponsive>
//                                                 </div>
//                                             )}



//                                             {/* {(parseInt(total_gross_dividend || '0') > 0 || parseInt(total_net_dividend || '0') > 0) && (
//                                                 <div className="container-fluid">
//                                                     <div className="row">

//                                                         {(parseInt(total_gross_dividend || '0') > 0) && (
//                                                             <div className="col-sm-2">
//                                                                 <div className="card">
//                                                                     <div className="bg-secondary card-body">
//                                                                         <div className="media feather-main">
//                                                                             <div className="media-body align-self-center">
//                                                                                 <h6 className="text-nowrap" style={{ fontSize: '10px' }}>Total Gross Dividend</h6>
//                                                                                 {(parseFloat(total_gross_dividend || '0') / 2).toFixed(2)}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         )}

//                                                         {(parseInt(total_net_dividend || '0') > 0) && (
//                                                             <div className="col-sm-2">
//                                                                 <div className="card">
//                                                                     <div className="bg-secondary card-body">
//                                                                         <div className="media feather-main">
//                                                                             <div className="media-body align-self-center">
//                                                                                 <h6 className="text-nowrap" style={{ fontSize: '10px' }}>Total Net Dividend</h6>
//                                                                                 {parseFloat(total_net_dividend || '0').toFixed(2)}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         )}
//                                                     </div>

//                                                 </div>
//                                             )} */}

//                                         </>
//                                     )
//                                 }
//                             </div>
//                             <div className="card">
//                                 <div className="card-header d-flex justify-content-between" style={{ flexWrap: 'wrap' }}>
//                                     <h5>Individuals Calculations</h5>
//                                 </div>
//                                 <div className="d-flex justify-content-start col-sm-10">
//                                     <div className="col-sm-2">
//                                         <div className="form-group">
//                                             <select
//                                                 name="search_criteria"
//                                                 className={`form-control`}
//                                                 onChange={(e) => {
//                                                     setCriteria(e.target.value);
//                                                     setSearch('');
//                                                 }}
//                                             >
//                                                 <option value="">Name</option>
//                                                 <option value="folioNumber">ID</option>
//                                                 <option value="name">Name</option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                     {(criteria == "folioNumber" || criteria == "") && (
//                                         <div className="col-sm-5">
//                                             <div className="form-group">
//                                                 <input
//                                                     id="search"
//                                                     className="form-control"
//                                                     type="text"
//                                                     placeholder={
//                                                         criteria == "" || !criteria
//                                                             ? `Select Criteria`
//                                                             : `Search by ID`
//                                                     }
//                                                     value={search}
//                                                     onChange={(e) => {
//                                                         handleSearchChange(e, "folio");
//                                                     }}
//                                                     disabled={!criteria}
//                                                 />
//                                             </div>
//                                         </div>
//                                     )}
//                                     {criteria == "name" && (
//                                         <div className="col-sm-5">
//                                             <input
//                                                 id="search"
//                                                 className="form-control"
//                                                 type="text"
//                                                 placeholder={
//                                                     criteria == "" || !criteria
//                                                         ? `Select Criteria`
//                                                         : `Search by Name`
//                                                 }
//                                                 value={search}
//                                                 onChange={(e) => {
//                                                     handleSearchChange(e, "name");
//                                                 }}
//                                                 disabled={!criteria}
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-md-12">
//                                         {
//                                             Object.keys(company).length !== 0 &&
//                                             shareHoldings.length !== 0 && (
//                                                 <table className="table table-responsive">
//                                                     <thead>
//                                                         <tr>
//                                                             <th>S</th>
//                                                             <th>ID</th>
//                                                             <th>Name</th>
//                                                             <th>Filer</th>
//                                                             <th className="text-right">Share Holding</th>
//                                                             <th className="text-right">Gross Dividend</th>
//                                                             <th className="text-right">Tax Rate</th>
//                                                             <th className="text-right">Tax Amount</th>
//                                                             <th className="text-right">Zakat Amount</th>
//                                                             <th className="text-right">Net Dividend</th>
//                                                             <th className="text-right">Bonus</th>
//                                                             <th className="text-right">B Fraction</th>
//                                                             <th className="text-right">Right</th>
//                                                             <th className="text-right">R Fraction</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>{displayCalCulateEntitlementPerPage} </tbody>
//                                                 </table>
//                                             )}
//                                         <center className="d-flex justify-content-center py-3">
//                                             <nav className="pagination">
//                                                 <ReactPaginate
//                                                     previousLabel="Previous"
//                                                     nextLabel="Next"
//                                                     pageCount={pageCount}
//                                                     onPageChange={changePage}
//                                                     marginPagesDisplayed={1}
//                                                     pageRangeDisplayed={3}
//                                                     containerClassName={"pagination"}
//                                                     previousClassName={"page-item"}
//                                                     previousLinkClassName={"page-link"}
//                                                     nextClassName={"page-item"}
//                                                     nextLinkClassName={"page-link"}
//                                                     disabledClassName={"disabled"}
//                                                     pageLinkClassName={"page-link"}
//                                                     pageClassName={"page-item"}
//                                                     activeClassName={"page-item active"}
//                                                     activeLinkClassName={"page-link"}
//                                                 />
//                                             </nav>
//                                         </center>
//                                     </div>
//                                 </div>
//                             </div>


//                         </div >
//                     </div >
//                 </div >
//             </div >
//         </Fragment >
//     );
// }
