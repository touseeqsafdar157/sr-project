import React, { Fragment, useState, useEffect, useContext } from "react";
import CountUp from "react-countup";
// import Breadcrumb from "../common/breadcrumb";
// import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import * as _ from "lodash";
import {
  DollarSign,
  Award,
  Users,
  BarChart2,
  RefreshCcw,
  PieChart,
  PlusCircle,
  PlusSquare,
  Percent,
  Radio,
  Layers,
  Share2,
  Key,
  Eye,
  Save,
  Calendar as Calendars,
  Clock,
  BookOpen,
  CheckSquare,
  Volume,
  Send,
} from "react-feather";
// // import transactionData from "./dummyTransactionData";
// import "./adminDashboard.css";
import "./adminDashboard.css"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup, faPeopleCarryBox, faGavel } from '@fortawesome/free-solid-svg-icons'
import { AiFillNotification } from "react-icons/ai";
import { getTransactionsAllRequests } from "../../../store/services/transaction.service";
import Select from "react-select";
import loader from '../../../assets/images/dcc_loader.svg'
import { BsChevronCompactDown, BsChevronCompactUp, BsCheckLg, } from "react-icons/bs";
// import { Pie } from 'react-chartjs-2';
//images for recent announcement announcements
// import market1 from "../../assets/images/bitcoin/market-1.jpg";
// import market2 from "../../assets/images/bitcoin/market-2.jpg";
// import market3 from "../../assets/images/bitcoin/market-3.jpg";
// import market4 from "../../assets/images/bitcoin/market-4.jpg";

//for outstanding shares
// import round from "../../assets/images/university/round.png";

// import Calendar from "react-big-calendar";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/sass/styles.scss";

//functions for backend calls
import {
  // getDashboardCounters,
  // getDashboardInvestorRequests,
  getDashboardAnnouncements,
} from "../../../store/services/adminDashboard.service";
import {
  darkStyle,
  // disabledStyles,
  // errorStyles,
} from "components/defaultStyles";
//service for piechart shares
// import { getCompanyInfo } from "../../store/services/companyInfo.service";
import { Link } from "react-router-dom";
import { getCompanyById } from "../../../store/services/company.service";
import { getShareHoldersByCompany } from "../../../store/services/shareholder.service";
import { getInvestors, getInvestorRequestByCompanyCodeService } from "../../../store/services/investor.service";
import { getTransactionsListing, getTransactionTypes, getTransactions } from "../../../store/services/transaction.service";
// import { getCompanies } from "store/services/company.service"
import { getCompanies } from "../../../store/services/company.service";
// import { getCorporateAnnouncement } from "../../store/services/corporate.service";
import { getDisburse } from "../../../store/services/disburse.service";
// import { getDashboardCounters } from "../../store/services/adminDashboard.service";
import {getDashboardCounters} from "../../../store/services/adminDashboard.service"
import styled from "styled-components";
// import corporate from '../dashboard/'
// import ReactEcharts from "echarts-for-react";
import ReactEcharts from 'echarts-for-react';
// import {
//   getvalidDateDMMMY,
//   getvalidDateDMonthY,
//   thousandSeperator,
//   numberWithCommas,
// } from "../../../utilityFunctions";
import { numberWithComma,
  getvalidDateDMMMY,
  getvalidDateDMonthY,
  thousandSeperator,
  numberWithCommas,
 } from "utilities/utilityFunctions";
 import Spinner from "components/common/spinner";
// import Spinner from "../common/spinner";
import {
  CONSOLIDATE_SHARES_TEMPLATE,
  DUPLICATE_SHARES_TEMPLATE,
  ELECTRONIC_TO_PHYSICAL,
  ELECTRONIC_TO_PHYSICAL_TEMPLATE,
  PHYSICAL_TO_ELECTRONIC_TEMPLATE,
  RIGHT_SUBSCRIBTION,
  RIGHT_SUBSCRIBTION_TEMPLATE,
  SPLIT_SHARES,
  SPLIT_SHARES_TEMPLATE,
  TRANSFER_OF_SHARES_TEMPLATE,
  TRANSFER_RIGHT_SHARES_TEMPLATE,
  TRANSMISSION_OF_SHARES_TEMPLATE,
  VERIFICATION_TRANSFER_DEED_TEMPLATE,
} from "constant";
import { toast } from "react-toastify";
import { FaRegNewspaper, FaUsers, FaTag, FaHive, FaChartPie, FaCalendarAlt, FaCalendarCheck, FaDatabase } from 'react-icons/fa';
// import sixteen from "../../assets/images/user/16.png";
import { Chart } from "react-google-charts";
import { getDashboardGraphData } from "../../../store/services/adminDashboard.service";
import { getCorporateActions } from "../../../store/services/corporate.service";
// import { getDashboardGraphData } from "../../store/services/adminDashboard.service";
// import { getDashboardGraphData } from "../../store/services/adminDashboard.service";
const AdminDashboard = () => {
  //localizer for React Big Calender
  const localizer = momentLocalizer(moment);
  let allViews = Object.keys(Views).map((k) => Views[k]);
  //states to store all values from backend

  // const { dashboard_data, dashboard_loading } = useSelector(
  //   (data) => data.Dashboard
  // );
  // const { company_data, company_data_loading } = useSelector(
  //   (data) => data.Company
  // );
  // const { announcement_data, announcement_data_loading } = useSelector(
  //   (data) => data.Announcements
  // );
  // const { investor_request_data, investor_request_loading } = useSelector(
  //   (data) => data.InvestorsRequests
  // );
  // const { transaction_request_types_loading, transaction_request_types } =
  //   useSelector((data) => data.TransactionRequests);
  const data = {
    labels: ['Individual', 'Associated Companies', 'Modaraba', 'Public Sector'],
    datasets: [
      {
        label: '# of Votes',
        data: [59, 23, 10, 9],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
        is3D: true,
      },
    ],
  };
  
  const colors = {
    fern_green: "#538135",
    astra: "#2E75B5",
    pirate_gold: "#Bf9000",
    boulder: "#7B7B7B",
    tia_maria: "#C55A11",
    st_tropaz: "#2F5496",
    oxford_blue: "#323F4F",
    mine_shaft: "#3A3838",
    pine_glade: "#A8D08D",
    regent_st_blue: "#9CC3E5",
    dandelion: "#FFD965",
    silver: "#C9C9C9",
    tacao: "#F4B183",
    chetwode_blue: "#8EAADB",
    bali_hai: "#8496B0",
    dove_gray: "#757070",
    moss_green: "#C5E0B3",
    spindle: "#BDD7EE",
    golden_glow: "#FEE599",
    alto: "#DBDBDB",
    maize: "#F7CBAC",
    spindle_2: "#B4C6E7",
    cadet_blue: "#ADB9CA",
    silver_chalice: "#AEABAB",
    zanah: "#E2EFD9",
    link_water: "#DEEBF6",
    barley_white: "#FFF2CC",
    gallery: "#EDEDED",
    champagne: "#FBE5D5",
    link_water_2: "#D9E2F3",
    geyser: "#D6DCE4",
    alto2: "#D0CECE",
  }
  const [dashboard_data, setDashboard_Data] = useState([]);
  const [dashboard_loading, setDashboard_Loading] = useState(false);

  const [company_governance, setCompanyGovernance] = useState([]);
  let [company_data, setCompany_Data] = useState([]);
  const [company_data_loading, setCompany_Data_Loading] = useState(false);
  const [showCompanyGoveranceFullData, setShowCompanyGoveranceData] = useState(false);
  const [announcement_data, setAnnouncement_Data] = useState([]);
  const [showFullAnnouncement, setshowFullAnnouncment] = useState(false)
  const [announcement_data_loading, setAnnouncement_Data_Loading] = useState(false);
  const [investor_request_data, setInvestor_Request_Data] = useState([]);
  const [investor_request_loading, setInvestor_Request_Loading] = useState(false);
  // console.log('company_data', company_data)
  const [transaction_request_types, setTransaction_Request_Types] = useState([]);
  const [transaction_request_types_loading, setTransaction_Request_Types_Loading] = useState(false);
  const [statutoryCompliances, setStatutoryCompliances] = useState(false);
  const [shareholders, setShareholders] = useState([]);
  const [shareholderLoading, setShareholderLoading] = useState(false);
  const [statutoryRequirements, setStatutoryRequirements] = useState(false);
  const [physicalShares, setPhysicalShares] = useState([]);
  const [electronicShares, setElectronicShares] = useState([]);
  const [investorRequest, setInvestorRequest] = useState([]);
  const [showInvestorRequest, setShowInvestorRequest] = useState(false)
  const [completedTxns, setCompletedTxns] = useState([]);
  const [showCompletedTxns, setShowCompletedTxns] = useState(false);
  const [transaction_request_data_loading, setTransaction_Request_Data_Loading] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [graphDataLoading, setGraphDataLoading] = useState(false);
  const [companyCFO, setCompanyCFO] = useState('')
  const [companyChairman, setCompanyChairman] = useState();
  const [auditor, setAuditor] = useState('')
  const [ceoName, setCeoName] = useState('');
  const [nextBoardElection, setNextBoardElection] = useState('');
  const [company_secretary, setCompanysectory] = useState('')
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [ freefloatPer, setFreeFloat] = useState(null)
 const [keyExective, setKeyExective] = useState(null)
const [loading, setLoading] = useState(false);
  let color  = 0;
  let thirdcolor = 0;
  const [chartColor] = useState([])
  const dummyChartColor =  [
    '#3366CC',
    '#CC3300',
    '#FF9900',
    '#009900',
    '#990099',
    '#0099CC',
    '#CC3366',
    '#669900',
    '#336699',
    '#993399',
    '#009999',
    '#999900',
    '#6633CC',
    '#CC6600',
    '#990000',
    '#669900',
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#95A6D1",
    "#6581C7",
    "#CFCF90",
    "#B2B9B2",
    "#ACC7AC",
 ];
  const boardElectionData = new Date(company_data?.board_election_date);
  // const chartData = [
  //   ["Task", "Hours per Day"],
  //   [`individual:${((27/43)*100).toFixed(1)}%`, 27],
  //   [`Associated companies:${((12/43)*100).toFixed(1)}%` , 12],
  //   [`Modaraba:${((2/43)*100).toFixed(1)}%`, 2],
  //   [`Public Sector:${((2/43)*100).toFixed(1)}%`, 2],


  // ];
  const getAllCompanies = async () => {
    setCompanies_data_loading(true);
    try {
      const response = await getCompanies(email);
      if (response.status === 200) {
        const companies_dropdowns = response.data.data.map((item) => {
          let label = `${item.code} - ${item.company_name}`;
          return { label: label, value: item.code };
        });
        // setCompanies(response.data.data);
        setCompanies_dropdown(companies_dropdowns);
        setCompanies_data_loading(false);
        // setLoading(false);
      }
    } catch (error) {
      setCompanies_data_loading(false);
      // setLoading(false);
    }
  };
  useEffect(()=>{
    getAllCompanies()
  }, []);
  useEffect(() => {
    if (company_governance?.length) {
      const CFO = company_governance.find(item => item?.role?.toLowerCase()?.trim() == 'cfo')?.name
      const chairman = company_governance.find(item => item?.role?.toLowerCase()?.trim() == 'company chairman' || item?.role?.toLowerCase()?.trim() == 'chairman')?.name
      const ceo = company_governance.find(item => item?.role?.toLowerCase()?.trim() == 'ceo')?.name
      const sectory = company_governance.find(item => item?.role?.toLowerCase()?.trim() == 'company secretary')?.name
      const coo = company_governance.find(item => item?.role?.toLowerCase()?.trim() == 'coo')?.name
      const cs_cfo = company_governance.find(item => item?.role?.toLowerCase()?.trim() == 'cfo/company secretary')?.name
      // setCoo(coo);
      // setCompanyCFO(CFO);
      // setCeoName(ceo);
      // setCompanysectory(sectory)
      // setCompanyChairman(chairman);
      const dummyArray = []
      if(chairman){
        const obj = {};
        obj['role']= 'Chairman'
        obj['name']= chairman
        dummyArray.push(obj)
      }

      if(ceo || company_data.ceo_name){
        const obj = {};
        obj['role']= 'CEO'
        obj['name']= ceo || company_data.ceo_name
        dummyArray.push(obj)
      }
      if(CFO || cs_cfo){
        const obj = {};
        obj['role']= 'CFO'
        obj['name']= CFO || cs_cfo
        dummyArray.push(obj)
      }
      if(coo){
        const obj = {};
        obj['role']= 'COO'
        obj['name']= coo
        dummyArray.push(obj)
      }
      if(sectory || company_data.company_secretary || cs_cfo){
        const obj = {};
        obj['role']= 'Company Secretary'
        obj['name']= sectory || company_data.company_secretary || cs_cfo
        dummyArray.push(obj)
      }

     
      if(dummyArray?.length) setKeyExective(dummyArray)
else setKeyExective([])

    }

  }, [JSON.stringify(company_governance)])
  useEffect(() => {
    if (company_data?.service_providers) {
      const ServiceProviderParseData = JSON.parse(company_data?.service_providers)
      const getAuditor = ServiceProviderParseData?.find(item => item?.type == "Auditor")?.auditor
      setAuditor(getAuditor)

    }
    if (company_data?.next_board_election_date) setNextBoardElection(company_data?.next_board_election_date)
    const paidupvalue = company_data?.paid_up_capital ? company_data?.paid_up_capital :  company_data?.outstanding_shares ? company_data?.outstanding_shares : 1
    if(company_data?.free_float) { 
     const percentage =  (company_data?.free_float / paidupvalue) * 100;
     setFreeFloat(percentage)
    }
    else {  setFreeFloat(null)}
  }, [JSON.stringify(company_data)])
  const getDashBoardCountData = async () => {
    try {
      setDashboard_Loading(true);
      const response = await getDashboardCounters(email, selectedCompany);
      if (response.status == 200) {
        if (response.data.data.corporateTransactions.length > 5) {
          response.data.data.corporateTransactions.length = 5;
        }
        setDashboard_Data(response.data.data);
      } else {
        setDashboard_Data([]);
      }
      setDashboard_Loading(false);
    } catch (error) {
      setDashboard_Loading(false);
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setDashboard_Loading(false);
  }

  const getCompany = async () => {
    try {
      setCompany_Data_Loading(true);
      const response = await getCompanyById(email, selectedCompany);
      if (response.status == 200) {
        // console.log("Response company => ", response)
        company_data = response.data.data;
        setCompany_Data(response.data.data);
        setCompanyGovernance(JSON.parse(response.data.data.governance))
      } else {
        setCompany_Data([]);
      }
      setCompany_Data_Loading(false);
    } catch (error) {
      setCompany_Data_Loading(false);
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    getShareholderByCompany();
    setCompany_Data_Loading(false);
  }

  const getInvestorRequestsByCompany = async () => {
    try {
      setInvestor_Request_Loading(true);
      const response = await getInvestorRequestByCompanyCodeService(email, selectedCompany);
      if (response.status == 200) {
        setInvestor_Request_Data(response.data.data);
      } else {
        setInvestor_Request_Data([]);
      }
      setInvestor_Request_Loading(false);
    } catch (error) {
      setInvestor_Request_Loading(false);
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setInvestor_Request_Loading(false);
  }

  // const getAnnouncements = async () => {
  //   try {
  //     setAnnouncement_Data_Loading(true);
  //     const response = await getCorporateAnnouncement(email, company_code);
  //     if (response.status == 200) {
  //       if (response.data.data.length > 5) {
  //         response.data.data.length = 5;
  //         setAnnouncement_Data(response.data.data);
  //       } else {
  //         setAnnouncement_Data(response.data.data);
  //       }
  //     } else {
  //       setAnnouncement_Data([]);
  //     }
  //     setAnnouncement_Data_Loading(false);
  //   } catch (error) {
  //     setAnnouncement_Data_Loading(false);
  //     if (error.response != undefined) {
  //       toast.error(error.response.data.message);
  //     } else {
  //       toast.error(error.message);
  //     }
  //   }
  //   setAnnouncement_Data_Loading(false);
  // }

  const getTransactionsRequestTypes = async () => {
    try {
      setTransaction_Request_Types_Loading(true);
      const response = await getTransactionTypes(email);
      if (response.status == 200) {
        const options = response.data.data.map((item) => {
          return { label: item.transactionName, value: item.transactionCode };
        });
        setTransaction_Request_Types(options);
      } else {
        setTransaction_Request_Types([]);
      }
      setTransaction_Request_Types_Loading(false);
    } catch (error) {
      setTransaction_Request_Types_Loading(false);
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setTransaction_Request_Types_Loading(false);
  }

  const getShareholderByCompany = async () => {
    try {
      setShareholderLoading(true);
      const response = await getShareHoldersByCompany(email, selectedCompany);
      if (response.status == 200) {
        setShareholders(response.data.data);
        const physical_shares = _.sum(
          response.data.data.filter(
            (comp) =>
              comp.company_code === selectedCompany &&
              comp.cdc_key === "NO" &&
              comp.folio_number !== selectedCompany + "-0"
          )
            .map((da) => parseInt(da.physical_shares))
        );

        setPhysicalShares(physical_shares);
        let sum;
        // console.log("Company Data => ", company_data)

        if (company_data.company_type.toLowerCase() === "private") {
          // console.log("In Private");
          let temp = 0;
          sum =
            response.data.data.filter((item) => item.selectedCompany === selectedCompany)
              .map((item) =>
                // isNaN(parseInt(item.electronic_shares)) ? 0 : parseInt(item.electronic_shares)
                parseInt(item.electronic_shares)
              )
          for (let i = 0; i < sum.length; i++) {
            // console.log(`Sum of ${i} => `, sum[i])
            // console.log(`Type of => `, typeof sum[i])
            temp = temp + sum[i];
          }
          sum = temp;

        } else {
          // console.log("In Public");
          sum = response.data.data.find(
            (hold) => hold.folio_number === selectedCompany + "-0"
          )?.physical_shares;;
        }

        // let electronic_shares =
        // company_data.company_type === "Private" ? _.sum(
        //     response.data.data.filter((item) => item.company_code === company_code)
        //         .map((item) =>{
        //           console.log("Company => ", item)
        //         console.log("Electronic shares in loop => ", item.electronic_shares);
        //           return isNaN(parseInt(item.electronic_shares))
        //             ? 0
        //             : parseInt(item.electronic_shares)
        //           }
        //         )
        //     )
        //   : response.data.data.find(
        //       (hold) => hold.folio_number === company_code + "-0"
        //     )?.physical_shares;
        let electronic_shares = sum;
        // console.log("Electronic Shares => ", electronic_shares)
        setElectronicShares(electronic_shares);


      } else {
        setShareholders([]);
      }
      setShareholderLoading(false);
    } catch (error) {
      setShareholderLoading(false);
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setShareholderLoading(false);
  }
  /* previous function that is used to get data for transaction
    const getAllTransactions = async () => {
      try {
        setTransaction_Request_Data_Loading(true);
        // const response = await getTransactionsListing(baseEmail);
        const response = await getTransactions(email);
        if (response.status == 200) {
          // setTransaction_Requests(response.data.data);
  
          let pendingTxns = response.data.data.filter((item) => item.processing_status !== "APPROVED");
          pendingTxns.length = 5;
          setInvestorRequest(pendingTxns);
          let completedTxns = response.data.data.filter((item) => item.processing_status === "APPROVED");
          completedTxns.length = 5;
  
          setCompletedTxns(completedTxns);
        } else {
          setInvestorRequest([]);
          setCompletedTxns([]);
        }
        setTransaction_Request_Data_Loading(false);
      } catch (error) {
        setTransaction_Request_Data_Loading(false);
        if (error.response !== undefined) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
      setTransaction_Request_Data_Loading(false);
    }
  
  upper code is commented that is used for getting the data of all transaction */
  const getColor=(index)=>{
    chartColor.push(dummyChartColor[index]);
  }
  const getShareHolerGraphData = async () => {
    try {
      setGraphDataLoading(true);
      const response = await getDashboardGraphData(email, selectedCompany);
      if (response.status == 200) {
        if (response.data.data?.length) {
          const chartData = response.data.data[0];
          const getKeys = Object.keys(chartData);
          const keys = getKeys.filter(z => chartData[z] > 0)
          let percentage = 0;
          keys.map(item => percentage = chartData[item] + percentage)
          const dummyArrayForChart = [["Task", "Hours per Day"]]
          keys.map((item, index) => {
            const chartArray = [];
            if (((chartData[item] / percentage) * 100).toFixed(2) > 0.00) {
              chartArray.push(`${item?.replaceAll('_', ' ')}:${((chartData[item] / percentage) * 100).toFixed(2).toString()}% `)
              chartArray.push(chartData[item])
              
              dummyArrayForChart.push(chartArray)
              getColor(index);
            }
          })

          setGraphData(dummyArrayForChart);
        }
        else {
          setGraphData([]);
        }
      } else {
        setGraphData([]);
      }
    } catch (error) {
      setGraphDataLoading(false)
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }

    setGraphDataLoading(false)
  }
  const getDataForAllTransaction = async () => {
    try {
      setTransaction_Request_Data_Loading(true);
      const response = await getTransactionsAllRequests(email);
      if (response.status == 200) {
        const concateTwoArray = response.data.pending.concat(response.data.rejected)
        const sortedArray = concateTwoArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        // sortedArray.length = 5;
        setInvestorRequest(sortedArray.slice(0, 5));

        setCompletedTxns(response.data.completed);
      } else {
        setInvestorRequest([]);
        setCompletedTxns([]);
      }
      setTransaction_Request_Data_Loading(false);
    } catch (error) {
      setTransaction_Request_Data_Loading(false);
      if (error.response !== undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setTransaction_Request_Data_Loading(false);
  }
  const getCoprateActions = async () => {
    try {
      setAnnouncement_Data_Loading(true);
      const response = await getCorporateActions(email, selectedCompany);
      if (response.status == 200) {
        // console.log('======', response.data.corporateActions)
        // if (response.data.data.length > 5) {
        //   response.data.data.length = 5;
        //   setAnnouncement_Data(response.data.data);
        // } else {
        setAnnouncement_Data(response.data.corporateActions);
        // }
      } else {
        setAnnouncement_Data([]);
      }
      setAnnouncement_Data_Loading(false);
    } catch (error) {
      setAnnouncement_Data_Loading(false);
      if (error.response != undefined) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
    setAnnouncement_Data_Loading(false);
  }
  useEffect(() => {
    if(selectedCompany){
    getCompany();
    getDashBoardCountData();
    getInvestorRequestsByCompany();
    // getAnnouncements();
    getTransactionsRequestTypes();
    getShareHolerGraphData();
    // // getShareholderByCompany();
    getDataForAllTransaction();
    getCoprateActions();
    // getAllTransactions();
    }
  }, [selectedCompany])

  const {
    PENDING: PENDING_SPL,
    REJECTED: REJECTED_SPL,
    APPROVED: APPROVED_SPL,
  } = _.groupBy(
    investor_request_data.filter(
      (item) => item.request_type === SPLIT_SHARES_TEMPLATE
    ),
    "status"
  );

  const {
    PENDING: PENDING_CON,
    REJECTED: REJECTED_CON,
    APPROVED: APPROVED_CON,
  } = _.groupBy(
    investor_request_data.filter(
      (item) => item.request_type === CONSOLIDATE_SHARES_TEMPLATE
    ),
    "status"
  );

  const {
    PENDING: PENDING_DUP,
    REJECTED: REJECTED_DUP,
    APPROVED: APPROVED_DUP,
  } = _.groupBy(
    investor_request_data.filter(
      (item) => item.request_type === DUPLICATE_SHARES_TEMPLATE
    ),
    "status"
  );

  const {
    PENDING: PENDING_TOS,
    REJECTED: REJECTED_TOS,
    APPROVED: APPROVED_TOS,
  } = _.groupBy(
    investor_request_data.filter(
      (item) => item.request_type === TRANSFER_OF_SHARES_TEMPLATE
    ),
    "status"
  );

  const {
    PENDING: PENDING_CEL,
    REJECTED: REJECTED_CEL,
    APPROVED: APPROVED_CEL,
  } = _.groupBy(
    investor_request_data.filter(
      (item) => item.request_type === PHYSICAL_TO_ELECTRONIC_TEMPLATE
    ),
    "status"
  );

  const {
    PENDING: PENDING_CPH,
    REJECTED: REJECTED_CPH,
    APPROVED: APPROVED_CPH,
  } = _.groupBy(
    investor_request_data.filter(
      (item) => item.request_type === ELECTRONIC_TO_PHYSICAL_TEMPLATE
    ),
    "status"
  );

  const {
    PENDING: PENDING_RSUB,
    REJECTED: REJECTED_RSUB,
    APPROVED: APPROVED_RSUB,
  } = _.groupBy(
    investor_request_data.filter(
      (item) => item.request_type === RIGHT_SUBSCRIBTION_TEMPLATE
    ),
    "status"
  );

  const {
    PENDING: PENDING_TOR,
    REJECTED: REJECTED_TOR,
    APPROVED: APPROVED_TOR,
  } = _.groupBy(
    investor_request_data.filter(
      (item) => item.request_type === TRANSFER_RIGHT_SHARES_TEMPLATE
    ),
    "status"
  );

  const {
    PENDING: PENDING_VTD,
    REJECTED: REJECTED_VTD,
    APPROVED: APPROVED_VTD,
  } = _.groupBy(
    investor_request_data.filter(
      (item) => item.request_type === VERIFICATION_TRANSFER_DEED_TEMPLATE
    ),
    "status"
  );

  const {
    PENDING: PENDING_TRS,
    REJECTED: REJECTED_TRS,
    APPROVED: APPROVED_TRS,
  } = _.groupBy(
    investor_request_data.filter(
      (item) => item.request_type === TRANSMISSION_OF_SHARES_TEMPLATE
    ),
    "status"
  );

  const [eventData, setEventData] = useState([]);
  const email = sessionStorage.getItem("email");
  // const company_code = sessionStorage.getItem("company_code");
  // console.log('eventData', eventData)
  // var doughnutDataElectronicPhysical = {
  //   labels: ["Electronic", "Physical"],
  //   datasets: [
  //     {
  //       lagend: "none",
  //       data: [
  //         dashboard_data?.physicalShareholders,
  //         dashboard_data?.electronicShareholders,
  //       ],
  //       // borderColor: ["#fb4333", "#634da7"],
  //       borderColor: [colors.barley_white, colors.spindle],
  //       // backgroundColor: ["#fb4333", "#634da7"],
  //       backgroundColor: [colors.barley_white, colors.spindle],
  //       fill: "origin",
  //     },
  //   ],
  // };

  // var doughnutOptionsElectronicPhysical = {
  //   maintainAspectRatio: true,
  //   elements: {
  //     point: {
  //       hoverRadius: 7,
  //       radius: 5,
  //     },
  //   },
  //   legend: {
  //     display: false,
  //   },
  //   plugins: {
  //     datalabels: {
  //       display: false,
  //     },
  //   },
  //   tooltips: {
  //     enabled: false,
  //   },
  // };
  // const totalShareholding =
  //   !dashboard_loading &&
  //   parseInt(dashboard_data?.physicalShareholders) +
  //   parseInt(dashboard_data?.electronicShareholders);
  //big doughnut
  // var doughnutDataShares = {
  //   labels: [
  //     "OutstandingShares",
  //     "Treasury Shares",
  //     "Free Float",
  //     "Preference Shares",
  //     "Ordinary Shares",
  //     "Nno Voting Shares",
  //     "Redeemable Shares",
  //     "Management Shares",
  //   ],
  //   datasets: [
  //     {
  //       data: [
  //         !company_data?.outstanding_shares ||
  //           isNaN(parseInt(company_data?.outstanding_shares))
  //           ? 0
  //           : parseInt(company_data?.outstanding_shares),

  //         !company_data?.treasury_shares ||
  //           isNaN(parseInt(company_data?.treasury_shares))
  //           ? 0
  //           : parseInt(company_data?.treasury_shares),

  //         !company_data?.free_float || isNaN(parseInt(company_data?.free_float))
  //           ? 0
  //           : parseInt(company_data?.free_float),

  //         !company_data?.preference_shares ||
  //           isNaN(parseInt(company_data?.preference_shares))
  //           ? 0
  //           : parseInt(company_data?.preference_shares),

  //         !company_data?.ordinary_shares ||
  //           isNaN(parseInt(company_data?.ordinary_shares))
  //           ? 0
  //           : parseInt(company_data?.ordinary_shares),

  //         !company_data?.non_voting_shares ||
  //           isNaN(parseInt(company_data?.non_voting_shares))
  //           ? 0
  //           : parseInt(company_data?.non_voting_shares),

  //         !company_data?.redeemable_shares ||
  //           isNaN(parseInt(company_data?.redeemable_shares))
  //           ? 0
  //           : parseInt(company_data?.redeemable_shares),

  //         !company_data?.management_shares ||
  //           isNaN(parseInt(company_data?.management_shares))
  //           ? 0
  //           : parseInt(company_data?.management_shares),
  //       ],
  //       // borderColor: [
  //       //   "#1bfdcd",
  //       //   "#c927ff",
  //       //   "#7cdc84",
  //       //   "#8669e1",
  //       //   "#954e14",
  //       //   "#c6fe0a",
  //       //   "#dd9610",
  //       // ],
  //       // backgroundColor: [
  //       //   "#1bfdcd",
  //       //   "#c927ff",
  //       //   "#7cdc84",
  //       //   "#8669e1",
  //       //   "#954e14",
  //       //   "#c6fe0a",
  //       //   "#dd9610",
  //       // ],
  //       borderColor: [
  //         colors.oxford_blue,
  //         colors.mine_shaft,
  //         colors.bali_hai,
  //         colors.dove_gray,
  //         colors.cadet_blue,
  //         colors.silver_chalice,
  //         colors.geyser,
  //       ],
  //       backgroundColor: [
  //         colors.oxford_blue,
  //         colors.mine_shaft,
  //         colors.bali_hai,
  //         colors.dove_gray,
  //         colors.cadet_blue,
  //         colors.silver_chalice,
  //         colors.geyser,
  //       ],
  //       fill: "origin",
  //     },
  //   ],
  // };

  // var doughnutOptionsShares = {
  //   maintainAspectRatio: true,
  //   elements: {
  //     point: {
  //       hoverRadius: 7,
  //       radius: 5,
  //     },
  //   },
  //   legend: {
  //     display: false,
  //   },
  //   plugins: {
  //     datalabels: {
  //       display: false,
  //     },
  //   },
  //   tooltips: {
  //     enabled: true,
  //   },
  // };

  //middle page bonus,dividents,rights table button
  // const Button = ({ type }) => {
  //   return <button className={`btn-status ${type}`}>{type}</button>;
  // };

  // const datasetKeyProvider = () => {
  //   return Math.random();
  // };
  useEffect(() => {
    if (announcement_data.length > 0) {
      setEventData(
        announcement_data.map((item, index) => ({
          id: index,
          title: <div></div>,
          titlee: `Announcement: ${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `,
          allDay: true,
          start: item.announcement_date,
          end: item.period_ended,
          bonusEvent: Number(item?.bonus_percent) > 0 ? true : false,
          divindentEvent: Number(item?.dividend_percent) > 0 ? true : false,
          rightEvent: Number(item?.right_percent) ? true : false
          // borderColor: Number(item?.bonus_percent)>0 ? : Number(item?.dividend_percent)> 0 || Number(item?.right_percent)> 0
        }))
      );
    }
  }, [announcement_data?.length]);
  const options = {
    is3D: true,
    pieSliceText: 'percentage',
    // pieSliceTextStyle: {
    //   color: 'black',
    // },
    colors: chartColor,
    tooltip: {
      isHtml: false,
      trigger: 'none'
    },
    chartArea: {
      left: 0,
      top: 20,
      right: 50,
      width: '60% ',
      height: '90%'
    },
    sliceVisibilityThreshold: 0,
    legend: {
      position: 'none', 
      // alignment: 'center' ,
      // orientation: 'vertical',
      // position: 'left',
      // alignment: 'center',
      maxLines: 1,
      textStyle: {
        color: '#a5a5a5',
        fontSize: 12,
        width: '100%',
        bold: true,
        marginTop: '400px'
      },
    },
    
    // vAxis: {
    //   minValue: 0,
    //   ticks: [0, .3, .6, .9, 1]
    // },
    isStacked: 'percent',
  };

  const option = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 180,
        endAngle: 0,
        splitNumber: 10,
        itemStyle: {
          color: '#121212',
          background: '#121212'
        },
        progress: {
          show: true,
          roundCap: true,
          width: 2
        },
        pointer: {
          icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
          length: '75%',
          width: 6,
          offsetCenter: [0, '-8%']
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 3,
            color: [

              [1, '#121212']
            ]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          distance: -1,
          length: 3,
          show: true,
          lineStyle: {
            show: true,
            width: 2,
            color: 'black'
          }
        },
        axisLabel: {
          distance: 8,
          show: false,
          itemStyle: {
            color: '#121212'
          },
          color: '#121212',
          fontSize: 8
        },
        anchor: {
          show: false,
        },
        title: {
          show: true
        },
        detail: {
          show: false,

        },
        data: [
          {
            value: (electronicShares / (electronicShares + physicalShares) * 100)
          }
        ]
      }
    ]

  };

  
  return (
    <>
      {/* bread crumb at the top of the page */}
      {/* <div className=" justify-content-between d-flex">
        <div className="d-flex">
          <div>
           // <Breadcrumb title="Dashboard" hideBookmark="true" />
            <img src={company_data.logo} className="ml-3 mt-3" /> &nbsp;
           
         
          </div>
          <div className="d-flex ">
          <div style={{fontSize:"20px"}}>{company_data.company_name}</div>
          </div>
          <Wrapper>
          <div  className="ml-3 mt-3" >dashboard1</div>
          <div  className="ml-3 mt-3" >dashboard1</div>
          </Wrapper>
        </div>
        </div> */}
  <div className="row">
    <div className="col-md-6">
    <div className="form-group">
                  <label htmlFor="searchTransaction">Select Company</label>
                  <Select
                    options={companies_dropdown}
                    isLoading={companies_data_loading === true}
                    onChange={(selected) => {
                  if(selected.value){
                    setSelectedCompany(selected.value)
                  } else{
                    setSelectedCompany("")
                  }
                    }}
                    isClearable={true}
                    styles={darkStyle}
                  />
                  {!selectedCompany && (
                    <small className="text-dark">
                      Select Company to check Dashboard Data
                    </small>
                  )}
                </div>
    </div>


</div>
{selectedCompany&& <>
      <div className=" row d-flex justify-content-between">
        <div className="col-md-9">
          <div className=" row ">
            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
              <img src={company_data.logo} className=" col-md-6 ml-3 mt-3" />
              <div className="col-md-6" style={{ fontSize: "20px" }}>{company_data.company_name}</div>
            </div>
          </div>
        </div>
        <Wrapper className="col-md-3">
          <ReactEcharts style={{ width: '60px', height: '100px' }} option={option} />
          <div style={{ fontSize: "20px" }} >DASHBOARD</div>
        </Wrapper>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 col-xl-3 col-lg-6 mt-3">
            <div className="card o-hidden shadow">
              <div className="bg-secondary b-r-4 card-body">
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <FaRegNewspaper size={40} />
                  </div>
                  <div>
                    <div className="media-body">
                      <span className="m-0">Total Shares</span>
                      {!dashboard_loading ? (
                        <h4 className="mb-0 counter"  style={{display: 'flex', justifyContent: 'flex-end'}}>
                          {company_data?.total_shares ? numberWithCommas(parseInt(company_data?.total_shares)) : ''}

                        </h4>
                      ) : (
                        <div className="row d-flex text-white ">
      <div className="col-md-6">
        <center>
          <h6 className="mb-0 text-nowrap">
            <b>{"Please Wait"}</b>
          </h6>
          <img alt="dcc_loader" src={loader} />
        </center>
      </div>
    </div>
                        // <Spinner />
                      )}

                    </div>
                  </div>
                </div>
                {/* <div className="media static-top-widget " style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                  <div className="align-self-center text-center">
                    <FaRegNewspaper size={40} />
                  </div>
                  <div className="media-body">
                    <span className="m-0">Total Shares</span>
                    {!dashboard_loading ? (
                      <h4 className="mb-0 counter">
                        {company_data?.total_shares? numberWithCommas(parseInt(company_data?.total_shares)) : ''}
                       
                      </h4>
                    ) : (
                      <Spinner />
                    )}

                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3 col-lg-6 mt-3">
            <div className="card o-hidden shadow">
              <div style={{ background: '#ff8309' }} className="b-r-4 card-body">
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                  <FaUsers className='text-white' size={40} />
                  </div>
                  <div>
                  <div className="media-body">
                    <span className="m-0 text-white">Shareholders</span>
                    {!dashboard_loading &&
                      !!dashboard_data?.shareholderCount ? (
                      <h4 className="mb-0 counter text-white" style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {dashboard_data?.shareholderCount ? numberWithCommas(parseInt(dashboard_data?.shareholderCount)) : ''}
                        {/* <CountUp
                          className="counter"
                          start={0}
                          end={parseInt(dashboard_data?.shareholderCount)}
                        /> */}
                      </h4>
                    ) : (
                      <div className="row d-flex text-white ">
                      <div className="col-md-6">
                        <center>
                          <h6 className="mb-0 text-nowrap">
                            <b>{"Please Wait"}</b>
                          </h6>
                          <img alt="dcc_loader" src={loader} />
                        </center>
                      </div>
                    </div>
                      // <Spinner />
                    )}

                    {/* <Users className="icon-bg" /> */}
                  </div>
                  </div>
                </div>


                {/* <div className="media static-top-widget">
                  <div className="align-self-center text-center">
                    <FaUsers className='text-white' size={40} />
                  </div>
                  <div className="media-body">
                    <span className="m-0 text-white">Shareholders</span>
                    {!dashboard_loading &&
                      !!dashboard_data?.shareholderCount ? (
                      <h4 className="mb-0 counter text-white">
                        {dashboard_data?.shareholderCount ? numberWithCommas(parseInt(dashboard_data?.shareholderCount)) : ''}
                        <CountUp
                          className="counter"
                          start={0}
                          end={parseInt(dashboard_data?.shareholderCount)}
                        />
                      </h4>
                    ) : (
                      <Spinner />
                    )}

                    <Users className="icon-bg" />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3 col-lg-6 mt-3">
            <div className="card o-hidden shadow">
              <div style={{ background: '#999999c9' }} className=" b-r-4 card-body">
                   <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                  <FaTag className='text-white' size={40} />
                  </div>
                  <div>
                  <div className="media-body">
                    <span className="m-0 text-white">Face Value</span>
                    {!dashboard_loading &&
                      !!dashboard_data?.certificatesCount ? (
                      <h4 className="mb-0 counter text-white"  style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {company_data?.face_value ? numberWithCommas(parseInt(company_data?.face_value)) : ''}
                        {/* <CountUp
                          className="counter"
                          start={0}
                          end={parseInt(company_data?.face_value)}
                        /> */}
                      </h4>
                    ) : (
                      <div className="row d-flex text-white ">
                      <div className="col-md-6">
                        <center>
                          <h6 className="mb-0 text-nowrap">
                            <b>{"Please Wait"}</b>
                          </h6>
                          <img alt="dcc_loader" src={loader} />
                        </center>
                      </div>
                    </div>
                      // <Spinner />
                    )}

                    {/* <Award className="icon-bg" /> */}
                  </div>
                  </div>
                </div>
                {/* <div className="media static-top-widget">
                  <div className="align-self-center text-center">
                    <FaTag className='text-white' size={40} />
                  </div>
                  <div className="media-body">
                    <span className="m-0 text-white">Face Value</span>
                    {!dashboard_loading &&
                      !!dashboard_data?.certificatesCount ? (
                      <h4 className="mb-0 counter text-white">
                        {company_data?.face_value ? numberWithCommas(parseInt(company_data?.face_value)) : ''}
                        <CountUp
                          className="counter"
                          start={0}
                          end={parseInt(company_data?.face_value)}
                        />
                      </h4>
                    ) : (
                      <Spinner />
                    )}

                    <Award className="icon-bg" />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3 col-lg-6 mt-3">
            <div className="card o-hidden shadow">
              <div style={{ background: 'rgb(255 214 15)' }} className="b-r-4 card-body">
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                  <FaHive className='text-white' size={40} />
                  </div>
                  <div>
                  <div className="media-body">
                    <span className="m-0 text-white"> Free Float %</span>
                    {!dashboard_loading &&
                      !!dashboard_data?.lotSize ? (
                      <h4 className="mb-0 counter text-white"  style={{display: 'flex', justifyContent: 'flex-end'}}>
                         {`${freefloatPer ?freefloatPer>100 ? 100: freefloatPer.toFixed(3) : '0'}%`}
                        {/* {`${company_data?.free_float ? (((Number(company_data?.free_float) / Number(company_data?.paid_up_capital) || 1))/100).toFixed(3) : '0'}%`} */}
                        {/* {dashboard_data?.lotSize ? numberWithCommas(parseInt(dashboard_data?.lotSize)) : ''} */}
                        {/* <CountUp
                          className="counter"
                          start={0}
                          end={parseInt(dashboard_data?.lotSize)}
                        /> */}
                      </h4>
                    ) : (
                      <div className="row d-flex text-white ">
                      <div className="col-md-6">
                        <center>
                          <h6 className="mb-0 text-nowrap">
                            <b>{"Please Wait"}</b>
                          </h6>
                          <img alt="dcc_loader" src={loader} />
                        </center>
                      </div>
                    </div>
                      // <Spinner />
                    )}

                    {/* <Award className="icon-bg" /> */}
                  </div>
                  </div>
                </div>
                {/* <div className="media static-top-widget">
                  <div className="align-self-center text-center">
                    <FaHive className='text-white' size={40} />
                  </div>
                  <div className="media-body">
                    <span className="m-0 text-white">Lot Size</span>
                    {!dashboard_loading &&
                      !!dashboard_data?.lotSize ? (
                      <h4 className="mb-0 counter text-white">
                        {dashboard_data?.lotSize ? numberWithCommas(parseInt(dashboard_data?.lotSize)) : ''}
                        <CountUp
                          className="counter"
                          start={0}
                          end={parseInt(dashboard_data?.lotSize)}
                        />
                      </h4>
                    ) : (
                      <Spinner />
                    )}

                    <Award className="icon-bg" />
                  </div>
                </div> */}
              </div>
            </div>
          </div>


          {/* <div className="col-sm-6 col-xl-3 col-lg-6 mt-3">
              <div className="card o-hidden shadow">
                <div className="bg-primary b-r-4 card-body">
                  <div className="media static-top-widget">
                    <div className="align-self-start mx-0 text-center">
                      {!dashboard_loading &&
                        !!dashboard_data?.physicalShareholders &&
                        !!dashboard_data?.electronicShareholders && (
                          <Doughnut
                            data={doughnutDataElectronicPhysical}
                            options={doughnutOptionsElectronicPhysical}
                            height={50}
                            width={50}
                            datasetKeyProvider={datasetKeyProvider}
                          />
                        )}
                    </div>
                    <div className="media-body">
                      <div className="d-flex justify-content-between">
                        <span className="m-0">Physical</span>

                        <span className="m-0">Electronic</span>
                      </div>
                      {!dashboard_loading &&
                      !!dashboard_data?.physicalShareholders &&
                      !!dashboard_data?.electronicShareholders ? (
                        <>
                          <div className="d-flex justify-content-between">
                            <h4 className="mb-0 counter">
                              <span>
                                <CountUp
                                  className="counter"
                                  start={0}
                                  end={
                                    (parseInt(
                                      dashboard_data?.physicalShareholders
                                    ) /
                                      totalShareholding) *
                                    100
                                  }
                                />
                                %
                              </span>
                            </h4>

                            <h4 className="mb-0 counter">
                              <span>
                                <CountUp
                                  className="counter"
                                  start={0}
                                  end={
                                    (parseInt(
                                      dashboard_data?.electronicShareholders
                                    ) /
                                      totalShareholding) *
                                    100
                                  }
                                />
                                %
                              </span>
                            </h4>
                          </div>

                          <BarChart2 className="icon-bg" />
                        </>
                      ) : (
                        <Spinner />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
        </div>
      </div>

      {/* Shares Title */}
      <div className="container-fluid">
        <div className="page-header" style={{ marginTop: '-25px' }}>
          <div className="row">
            <div className="col">
              <div className="page-header-left d-flex">
                <ReactEcharts style={{ width: '60px', height: '60px' }} option={option} />
                <h3>  Shares</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Shares Title */}

      <div className="container-fluid">
        <WrapperForResponsive>
          {/* <span>Electronic Shares 65% {(electronicShares / (electronicShares + physicalShares)) * 100}%</span> */}
          <div className="row responsive">
            <div className="col-md-1" />
            <div className="col-md">
              {/* <span>Electronic Shares 65% {(electronicShares / (electronicShares + physicalShares)) * 100}%</span> */}
              <span>Electronic Shares</span>
              <h5>{numberWithCommas(electronicShares)}</h5>
            </div>
            <div className="col-md">
              {/* <span>Physical Shares 35% {(physicalShares / (electronicShares + physicalShares)) * 100}%</span> */}
              {/* {physicalShares >= 0 ? (physicalShares / (electronicShares + physicalShares)) * 100 : 0}% */}
              <span>Physical Shares </span>
              <h5>{numberWithCommas(physicalShares)}</h5>
            </div>
            <div className="col-md">
              {/* <span>Outstanding 90%</span> */}
              <span>Outstanding</span>
              <h5>{company_data.outstanding_shares === "" ? "0" : numberWithCommas(company_data.outstanding_shares)}</h5>
            </div>
            <div className="col-md">
              {/* <span>Free Float 75%</span> */}
              <span>Free Float</span>
              <h5>{company_data.free_float === "" ? "0" : numberWithCommas(company_data.free_float)}</h5>
            </div>
            <div className="col-md">
              {/* <span>Treasury 10%</span> */}
              <span>Treasury</span>
              <h5>{company_data.treasury_shares === "" ? "0" : (company_data.treasury_shares)}</h5>
            </div>
          </div>
        </WrapperForResponsive>
        <WrapperForResponsive>
          <div className="row mt-3 responsive ">
            <div className="col-md-1" />

            <div className="col-md">
              <span>Ordinary</span>
              <h5>{company_data.ordinary_shares === "" ? "0" : numberWithCommas(company_data.ordinary_shares)}</h5>
            </div>
            <div className="col-md">
              <span>Redeemable</span>
              <h5>{company_data.redeemable_shares === "" ? "0" : numberWithCommas(company_data.redeemable_shares)}</h5>
            </div>
            <div className="col-md">
              <span>Preference</span>
              <h5>{company_data.preference_shares === "" ? "0" : numberWithCommas(company_data.preference_shares)}</h5>
            </div>
            <div className="col-md">
              <span>Non-Voting</span>
              <h5>{company_data.non_voting_shares === "" ? "0" : numberWithCommas(company_data.non_voting_shares)}</h5>
            </div>
            <div className="col-md">
              <span>Management</span>
              <h5>{company_data.management_shares === "" ? "0" : numberWithCommas(company_data.management_shares)}</h5>
            </div>
          </div>
        </WrapperForResponsive>

        <div className="row mt-3">
          {/* <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-header">
                  <h5><PieChart/> Share Types</h5>
                </div>
                {!company_data_loading ? (
                  <>
                    <div className="card-body">

                              <Pie data={data} /> */}

          {/* <Doughnut
                            data={doughnutDataElectronicPhysical}
                            options={doughnutOptionsElectronicPhysical}
                            height={30}
                            width={50}
                            datasetKeyProvider={datasetKeyProvider}
                          /> */}
          {/* </div>
                  </>
                ) : (
                  <Spinner />
                )}
              </div>
                </div> */}

          <div className="col-md-4 mt-2">
            <ScrollWrapper className="card shadow" style={{ borderRadius: '20px',  maxHeight: '405px', minHeight: '405px', overflowY: 'scroll', overflowX: 'hidden' }}>
              <div className="text-center d-flex mt-2 ml-3" style={{ gap: '20px' }}>
                <FaChartPie className='text-muted' size={40} />
                <h5 className="mt-2 font-weight-bold"> Shareholder Types</h5>
              </div>
              { !graphDataLoading?<>
                <Chart
                  chartType="PieChart"
                  data={graphData}
                  options={options}
                  style={{ borderRadius: '2rem', overflow: 'hidden', paddingLeft: '10px', paddingBottom: '20px' }}
                />
                <div className="row">
                  <div className="col-md-12"/>
                </div>
                <ScrollWrapper  style={{ maxHeight: '120px', minHeight: '120px', overflowY: 'scroll', overflowX: 'hidden' }} >
                <Responsive className="row">
                  <div className="col-md-3"/>
                  <div className="col-md-9 respons" style={{justifyContent: 'center'}}>
                {graphData?.slice(1, graphData?.length)?.map((ite, index)=>{
                  return <div key={index} className='d-flex ' style={{ alignItems: 'center', gap: '5px', }}>
                  <div style={{ minWidth: '10px', height: '10px', backgroundColor: chartColor[index], maxWidth: '10px' }} ></div>
                  <div >{ite[0]}</div>

              </div>
              
                })}
                </div>
                {/* <div className="col-md-4"/> */}
                </Responsive>
                </ScrollWrapper>
                </>
                : graphDataLoading ? <Spinner /> : !graphData?.length && <div className="text-center">Data no Found</div>}

            </ScrollWrapper>
          </div>




          <div className="col-md-4 mt-2">
            <ScrollWrapper isOverflow={showCompanyGoveranceFullData} className="card shadow" style={{ borderRadius: '20px', height: '405px', minHeight: '400px',overflowY: 'scroll', overflowX: 'hidden'  }}>
              <div className="text-center d-flex mt-2 ml-3" style={{ gap: '20px' }}>
                <FontAwesomeIcon className='text-muted' icon={faPeopleCarryBox} style={{ fontSize: '40px' }} />
                <h5 className="font-weight-bold">Board of Directors</h5>
              </div>

              {!company_data_loading ? (
                <>
                  {company_governance.length > 0 ? (
                    <div>
                      <div className="card-body">
                        <TableWrapper className="table table-borderless">
                          <tbody>
                            { company_governance.map((item, index) => {
                              return (
                                <tr className={index == company_governance?.length - 1 ? '' : "border-bottom"}>
                                  <td><h1 className="text-muted">{index + 1}</h1></td>
                                  <td><h6 >{item.name}</h6>
                                    {item.role && <span>{item.role}</span>}
                                  </td>
                                </tr>
                              );
                            })
                              // : company_governance.slice(0, 5).map((item, index) => {
                              //   return (
                              //     <tr class="border-bottom">
                              //       <td><h1 className="text-muted">{index + 1}</h1></td>
                              //       <td><h6 style={{fontWeight: 'bold'}}>{item.name}</h6>
                              //         {item.role && <span>{item.role}</span>}
                              //       </td>
                              //     </tr>
                              //   );
                              // })
                            }
                            {/* <tr>
                            <td><h1 className="text-muted">2</h1></td>
                            <td><h6>Ali Imran Hashmi</h6>
                              <span>Shareholder Director</span>
                            </td>
                          </tr>
                          <tr>
                            <td><h1 className="text-muted">3</h1></td>
                            <td><h6>Muhammad Kamran</h6>
                            <span>Nominee Director</span>
                            </td>
                          </tr>
                          <tr>
                            <td><h1 className="text-muted">4</h1></td>
                            <td><h6>Israr Danyal</h6>
                            <span>Shareholder Director</span>
                            </td>
                          </tr> */}
                          </tbody>
                        </TableWrapper>
                        {/* {showCompanyGoveranceFullData ? <FaAngleUpWrapper onClick={() => setShowCompanyGoveranceData(false)} className='text-secondary' /> : <FaAngleDownWrapper onClick={() => setShowCompanyGoveranceData(true)} className='text-secondary' />} */}

                      </div>
                    </div>
                  ) : (
                    <div className="text-center">Data no Found</div>
                  )}

                </>
              ) : (
                <Spinner />
              )}
            </ScrollWrapper>
          </div>

          <div className="col-md-4 mt-2">
            <div className="card shadow" style={{ borderRadius: '20px', minHeight: '405px' }}>
              <div className="text-center d-flex mt-2 ml-3" style={{ gap: '20px' }}>
                {/* <Key size={40} /> */}
                <FontAwesomeIcon className='text-muted' icon={faPeopleGroup} style={{ fontSize: '40px' }} />
                <h5 className="font-weight-bold">Key Executives</h5>
              </div>
              {!company_data_loading ? (
                <>
                  {keyExective?.length? (
                    <div>
                      <div className="card-body">
                        <TableWrapperKeyExective className="table table-borderless">
                          <tbody>
                          {keyExective?.map((item, idx)=>{
                              return (
                                <tr key={idx} className={idx == keyExective?.length - 1 ? '' : "border-bottom"}>
                                  <td><h1 className="text-muted">{idx + 1}</h1></td>
                                  <td>
                                  <h6 style={{ fontWeight: 'bold' }}>{item?.role}</h6>
                                  <span> {item?.name}</span>
                                </td>
                                  {/* <td><h6 style={{ fontWeight: 'bold' }}>{item.name}</h6>
                                    {item.role && <span>{item.role}</span>}
                                  </td> */}
                                </tr>
                              );
                            })}


                            {/* {companyChairman ?
                              <tr className="border-bottom">
                                <td><h1 className="text-muted">1</h1></td>
                                <td>
                                  <h6 style={{fontWeight: 'bold'}}>Chairman</h6>
                                  <span> {companyChairman}</span>
                                </td>
                              </tr>
                              : ''}
                            {ceoName || company_data.ceo_name ?
                              <tr className="border-bottom">
                                <td><h1 className="text-muted">{companyChairman ? 2 : 1}</h1></td>
                                <td>
                                  <h6 style={{fontWeight: 'bold'}}>CEO</h6>
                                  <span>{ ceoName || company_data.ceo_name}</span>
                                </td>
                              </tr> : ''}
                            {companyCFO ?
                              <tr className="border-bottom">
                                <td><h1 className="text-muted">{companyChairman && (ceoName || company_data.ceo_name) ? 3 : ceoName || company_data.ceo_name || companyChairman ? 2 : 1}</h1></td>
                                <td>
                                  <h6 style={{fontWeight: 'bold'}}>CFO</h6>
                                  <span>{companyCFO}</span>
                                </td>
                              </tr> : ''}
                            {company_secretary || company_data.company_secretary ?
                              <tr>
                                <td><h1 className="text-muted">{(companyChairman && (ceoName || company_data.ceo_name) && companyCFO) ? 4 : (companyChairman && (company_data.ceo_name ||ceoName)) ? 3 : (companyChairman && companyCFO) ? 3 : ((company_data.ceo_name || ceoName) && companyCFO) ? 3 : (ceoName || company_data.ceo_name || companyCFO || companyChairman) ? 2 : 1}</h1></td>
                                <td>
                                  <h6 style={{fontWeight: 'bold'}}>Company Secretary</h6>
                                  <span>{company_secretary || company_data.company_secretary}</span>
                                </td>
                              </tr> : ''} */}
                            {/* <tr>
                            <td><h1 className="text-muted">2</h1></td>
                            <td><h6>Muhammad Ali Nasir</h6>
                              <span>Company Secretary</span>
                            </td>
                          </tr>
                          <tr>
                            <td><h1 className="text-muted">3</h1></td>
                            <td><h6>Muhammad Nawaz</h6>
                            <span>Chief Finance Officer</span>
                            </td>
                          </tr>
                          <tr>
                            <td><h1 className="text-muted">4</h1></td>
                            <td><h6>Shahbaz Ali Agha</h6>
                            <span>Chief Operating Officer</span>
                            </td>
                          </tr> */}
                          </tbody>
                        </TableWrapperKeyExective>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">Data not Found</div>
                  )}

                </>
              ) : (
                <Spinner />
              )}
            </div>
          </div>
          {/* calander card hidden */}
          {/* <div className="col-md-4">
            <div className="card h-100 shadow"
            >
              <div className="card-header">
                <h5><Clock /> Events</h5>
              </div>
              <div className="card-body">
                {!announcement_data_loading ? (
                  announcement_data.length > 0 ? (
                    <Calendar
                      localizer={localizer}
                      scrollToTime={new Date(1970, 1, 1, 6)}
                      defaultDate={new Date(2022, 3, 12)}
                      onSelectEvent={(event) => alert(event.title)}
                      views={allViews}
                      events={eventData}
                      eventOverlap
                      dragRevertDuration={500}
                      dragScroll
                      showMultiDayTimes
                      step={60}
                      startAccessor="start"
                      endAccessor="end"
                    />
                  ) : (
                    <p>
                      <b>No Upcoming Events Available</b>
                    </p>
                  )
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div> */}
          {/* calander card hidden */}
        </div>
        <WrapperForResponsive>
          <div className="row mt-2 responsive" >
            <div className="col-md-3 mt-2">
              {auditor|| company_data?.company_auditor ? <div> <h3><Eye /> Auditors</h3>
                <h6 style={{ fontWeight: 'bold' }}>{ auditor ||company_data?.company_auditor}</h6>
                <span>External Auditor</span>
              </div> : ''}
            </div>

            <div className="col-md-3  mt-2">
              {company_data?.company_registrar ? <div> <h3><FaDatabase className='text-muted' size={30} /> Registrar</h3>
                <h6 style={{ fontWeight: 'bold' }}>{company_data?.company_registrar}</h6>
                <span> Share Registrar</span></div> : ''}
            </div>
            <div className="col-md-3  mt-2  " >
              {company_data?.fiscal_year ? <div> <h3><FaCalendarAlt className='text-muted' size={30} /> Fiscal Year</h3>
                <h6 style={{ fontWeight: 'bold' }}>{moment(company_data.fiscal_year).format('MMMM')}</h6></div> : ''}
            </div>
            <div className="col-md-3  mt-2  " >
              {nextBoardElection || moment(boardElectionData.getFullYear() + 3).format('DD-MM-YYYY') !== 'Invalid date' ? <div> <h3><FaCalendarCheck className='text-muted' size={30} /> Board Election</h3>
                <h6 style={{ fontWeight: 'bold' }}> Next : {moment(nextBoardElection).format('DD-MM-YYYY') ||  moment(boardElectionData.setFullYear(boardElectionData.getFullYear() + 3)).format('DD-MM-YYYY')}</h6></div> : ''}
            </div>
          </div>
        </WrapperForResponsive>
      </div>

      {/* <div className="container-fluid">
        <div className="row mt-3">
        <div className="col-md-4">
              <div className="card h-100 shadow"
              >
                <div className="card-header">
                  <h5><Clock/> Events</h5>
                </div>
                <div className="card-body">
                  {!announcement_data_loading ? (
                    announcement_data.length > 0 ? (
                      <Calendar
                        localizer={localizer}
                        scrollToTime={new Date(1970, 1, 1, 6)}
                        defaultDate={new Date(2022, 3, 12)}
                        onSelectEvent={(event) => alert(event.title)}
                        views={allViews}
                        events={eventData}
                        eventOverlap
                        dragRevertDuration={500}
                        dragScroll
                        showMultiDayTimes
                        step={60}
                        startAccessor="start"
                        endAccessor="end"
                      />
                    ) : (
                      <p>
                        <b>No Upcoming Events Available</b>
                      </p>
                    )
                  ) : (
                    <Spinner />
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-header">
                  <h5><BookOpen/> Satuatory Requirements</h5>
                </div>
                {!company_data_loading ? (
                  <>
                     <div className="card-body">
                    <div>
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><h6 className="text-primary">25 Jan</h6></td>
                            <td><h6>SECP Submissions</h6><span>From-29 Submission</span></td>
                            <td><h6 className="text-warning">25 Jan</h6></td>
                          </tr>
                          <tr>
                          <td><h6 className="text-primary">05 Feb</h6></td>
                            <td><h6>PSX Announcement</h6><span>AGM/EOGM Notice</span></td>
                            <td><h6 className="text-warning">05 Feb</h6></td>
                          </tr>
                          <tr>
                            <td><h6 className="text-primary">13 Feb</h6></td>
                            <td><h6>SECP Submissions</h6><span>From-A Submission</span></td>
                            <td><h6 className="text-warning">13 Feb</h6></td>
                          </tr>
                          <tr>
                          <td><h6 className="text-primary">01 Mar</h6></td>
                            <td><h6>Shareholder Notice</h6><span>Change of Director Notice</span></td>
                            <td><h6 className="text-warning">01 Mar</h6></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  </>
                ) : (
                  <Spinner />
                )}
              </div>
                </div>

                <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-header">
                  <h5><CheckSquare/> Satuatory Compliances</h5>
                </div>
                {!company_data_loading ? (
                  <>
                  <div className="card-body">
                    <div>
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><h6 className="text-primary">25 Jan</h6></td>
                            <td><h6>SECP Submissions</h6><span>From-29 Submission</span></td>
                            <td><h6 className="text-warning">29 Jan</h6></td>
                          </tr>
                          <tr>
                          <td><h6 className="text-primary">05 Feb</h6></td>
                            <td><h6>PSX Announcement</h6><span>AGM/EOGM Notice</span></td>
                            <td><h6 className="text-warning">15 Feb</h6></td>
                          </tr>
                          <tr>
                            <td><h6 className="text-primary">13 Feb</h6></td>
                            <td><h6>SECP Submissions</h6><span>From-A Submission</span></td>
                            <td><h6 className="text-warning">25 Feb</h6></td>
                          </tr>
                          <tr>
                          <td><h6 className="text-primary">01 Mar</h6></td>
                            <td><h6>Shareholder Notice</h6><span>Change of Director Notice</span></td>
                            <td><h6 className="text-warning">21 Apr</h6></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  </>
                ) : (
                  <Spinner />
                )}
              </div>
                </div>

        </div>

      </div> */}
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col mt-4">
            <div className="card  shadow" style={{ borderRadius: '20px', minHeight: '370px' }}>
              <div className="text-center d-flex mt-2 ml-3" style={{ gap: '20px', alignItems: 'center' }}>
                {/* <Key size={40} /> */}
                {/* <img style={{marginTop: '-5px'}} src={corporate} alt="" /> */}
                <AiFillNotification className='text-muted' size={30} />
                <h5 style={{ color: '#04b4fa' }}>Corporate Actions</h5>
              </div>

              {!company_data_loading ? (
                <>
                  {announcement_data.length > 0 ? (
                    <div>
                      <div className="card-body">
                        <TableWrapper className="table table-borderless">
                          <tbody>
                            {announcement_data.map((item, index) => {
                              return (
                                <ResponsiveWrapperForTable className={index == announcement_data?.length - 1 ? '' : "border-bottom"}>
                                  <td style={{ color: 'rgb(4, 180, 250)' }}><div style={{ fontWeight: 'bold', fontSize: '20px' }} >{item.period_ended !== "" && moment(item.period_ended).format('DD')}</div>
                                    <div style={{ fontWeight: 'bold', marginTop: '-8px', display: 'flex', alignItems: 'center', fontSize: '14px' }} >{item.period_ended !== "" && moment(item.period_ended).format('MMM')}</div>
                                  </td>
                                  <td><h6 className="responsiveHeading" style={{ fontWeight: 'bold', textOverflow: 'ellipsis',  whiteSpace: 'nowrap', overflow: 'hidden' }}>{`${Number(item?.bonus_percent) > 0 ? 'Bonous Entitlements' : ''} ${Number(item?.dividend_percent) > 0 ? 'Dividend Entitlements' : ''}  ${Number(item?.right_percent) > 0 ? 'Right Entitlements' : ''}`}</h6>{item.expired == 'true' ? <span className="text-success" style={{ fontWeight: 'bold' }}>COMPLETED</span> : <span className="text-warning" style={{ fontWeight: 'bold' }}>IN PROCESS</span>}</td>
                                  <td><div style={{ fontWeight: 'bold', fontSize: '20px' }} className="text-warning">{moment(item.announcement_date).format('DD')}</div>
                                    <div style={{ fontWeight: 'bold', marginTop: '-8px', alignItems:'center', display: 'flex', fontSize: '14px' }} className="text-warning">{moment(item.announcement_date).format('MMM')}</div>
                                  </td>
                                </ResponsiveWrapperForTable>
                              );
                            })
                              // : announcement_data.slice(0, 4).map((item, index) => {
                              //   return (
                              //     <tr className="border-bottom">
                              //       <td><h6 style={{ fontWeight: 'bold' }} className="text-primary">{moment(item.announcement_date).format('DD MMM')}</h6></td>
                              //       <td><h6 style={{ fontWeight: 'bold' }}>{item.symbol}</h6><span style={{ fontWeight: 'bold' }}>{item.company_code}</span></td>
                              //       <td><h6 style={{ fontWeight: 'bold' }} className="text-warning">{item.period_ended !== "" && moment(item.period_ended).format('DD MMM')}</h6></td>
                              //     </tr>
                              //   );
                              // })
                            }

                            {/* <tr>
                          <td><h6 className="text-primary">05 Feb</h6></td>
                            <td><h6>Dividend Disbursement</h6><span>In Process</span></td>
                            <td><h6 className="text-warning">15 Feb</h6></td>
                          </tr>
                          <tr>
                            <td><h6 className="text-primary">13 Feb</h6></td>
                            <td><h6>Bonus Entitlements</h6><span>Completed</span></td>
                            <td><h6 className="text-warning">25 Feb</h6></td>
                          </tr>
                          <tr>
                          <td><h6 className="text-primary">01 Mar</h6></td>
                            <td><h6>Right Entitlements</h6><span>Completed</span></td>
                            <td><h6 className="text-warning">21 Apr</h6></td>
                          </tr> */}
                          </tbody>
                        </TableWrapper>
                        {/* {announcement_data.length > 4 ? showFullAnnouncement ? <FaAngleUpWrapper onClick={() => setshowFullAnnouncment(false)} className='text-secondary' /> : <FaAngleDownWrapper onClick={() => setshowFullAnnouncment(true)} className='text-secondary' /> : ''} */}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">Data not Found</div>
                  )}

                </>
              ) : (
                <Spinner />
              )}
            </div>
          </div>

          <div className="col mt-4">
            <div className="card  shadow " style={{ borderRadius: '20px', minHeight: '370px' }}>
              <div className="text-center d-flex mt-2 ml-3" style={{ gap: '20px' }}>
                {/* <Key size={40} /> */}
                <Send className='text-muted' size={30} />
                <h5 style={{ color: '#04b4fa' }}> Investor Requests</h5>
              </div>
              {!transaction_request_data_loading ? (
                <>
                  {investorRequest?.length ?
                    <div>
                      <div className="card-body" style={{ height: 'fit-content' }}>
                        <TableWrapper className="table table-borderless">
                          <tbody>
                            {investorRequest.map((item, idx) => {
                              return (
                                <tr className={idx == investorRequest?.length - 1 ? '' : "border-bottom"}>
                                  <td style={{ color: 'rgb(4, 180, 250)' }}><div style={{ fontWeight: 'bold', fontSize: '20px' }} >{moment(item.txn_date).format('DD')}</div>
                                    <div style={{ fontWeight: 'bold', marginTop: '-8px', fontSize: '14px', display: 'flex', alignItems: 'center' }} >{moment(item.txn_date).format('MMM')}</div></td>
                                  <td><h6 style={{ fontWeight: 'bold' }}>
                                    {
                                      transaction_request_types.find(
                                        (tem) => tem.value === item.txn_type
                                      )?.label
                                    }
                                  </h6>{item.processing_status.toLowerCase() == 'pending' ? <span className=" text-danger " style={{ fontWeight: 'bold' }}>{item.processing_status}</span> : <span style={{ fontWeight: 'bold' }}>{item.processing_status}</span>}</td>
                                </tr>
                              );
                            })
                              // : investorRequest.slice(0, 4).map((item) => {
                              //   return (
                              //     <tr className="border-bottom">
                              //       <td><h6 style={{ fontWeight: 'bold' }} className="text-primary">{moment(item.txn_date).format('DD MMM')}</h6></td>
                              //       <td><h6 style={{ fontWeight: 'bold' }}>
                              //         {
                              //           transaction_request_types.find(
                              //             (tem) => tem.value === item.txn_type
                              //           )?.label
                              //         }
                              //       </h6 ><span style={{ fontWeight: 'bold' }}>{item.processing_status}</span></td>
                              //     </tr>
                              //   );
                              // })
                            }

                            {/* <tr>
                          <td><h6 className="text-primary">05 Feb</h6></td>
                            <td><h6>Duplicate Certificate</h6><span>In Process</span></td>
                          </tr>
                          <tr>
                            <td><h6 className="text-primary">13 Feb</h6></td>
                            <td><h6>Physical to Electronic</h6><span>In Process</span></td>
                          </tr>
                          <tr>
                          <td><h6 className="text-primary">01 Mar</h6></td>
                            <td><h6>Right Subscription</h6><span>In Process</span></td>
                          </tr> */}
                          </tbody>
                        </TableWrapper>
                        {/* { investorRequest?.length > 4 ? showInvestorRequest ? <FaAngleUpWrapper onClick={() => setShowInvestorRequest(false)} className='text-secondary' /> : <FaAngleDownWrapper onClick={() => setShowInvestorRequest(true)} className='text-secondary' />: ''} */}
                      </div>
                    </div> : <div className="text-center">Data not Found</div>}
                </>
              ) : (
                <Spinner />
              )}
            </div>
          </div>

          <div className="col mt-4">
            <div className="card  shadow" style={{ borderRadius: '20px', minHeight: '370px' }}>
              <div className="text-center d-flex mt-2 ml-3" style={{ gap: '20px' }}>
                {/* <Key size={40} /> */}
                <BsCheckLg className='text-muted  ms-3' size={30} />
                <h5 style={{ color: '#04b4fa' }}>  Completed Requests</h5>
              </div>
              {!transaction_request_data_loading ? (
                <> {completedTxns?.length ?
                  <div>
                    <div className="card-body" style={{ height: 'fit-content' }}>
                      <TableWrapper className="table table-borderless">
                        <tbody>
                          {completedTxns.map((item, idx) => {
                            return (
                              <tr className={idx == completedTxns?.length - 1 ? '' : "border-bottom"}>
                                <td style={{ color: 'rgb(4, 180, 250)' }}><div style={{ fontWeight: 'bold', fontSize: '20px' }}>{moment(item.txn_date).format('DD')}</div>
                                  <div style={{ fontWeight: 'bold', marginTop: '-8px', display: 'flex', alignItems: 'center', fontSize: '14px' }}>{moment(item.txn_date).format('MMM')}</div></td>
                                <td><h6 style={{ fontWeight: 'bold' }}>
                                  {
                                    transaction_request_types.find(
                                      (tem) => tem.value === item.txn_type
                                    )?.label
                                  }
                                </h6><span style={{ fontWeight: 'bold' }}>{item.processing_status}</span></td>
                                <td><div style={{ fontWeight: 'bold', fontSize: '20px' }} className="text-warning">{moment(item.settlement_date).format('DD')}</div>
                                  <div style={{ fontWeight: 'bold', marginTop: '-8px', display: 'flex', alignItems: 'center',  fontSize: '14px' }} className="text-warning">{moment(item.settlement_date).format('MMM')}</div></td>
                              </tr>
                            );
                          })
                            // : completedTxns.slice(0, 4).map((item) => {
                            //   return (
                            //     <tr className="border-bottom">
                            //       <td><h6 style={{ fontWeight: 'bold' }} className="text-primary">{moment(item.txn_date).format('DD MMM')}</h6></td>
                            //       <td><h6 style={{ fontWeight: 'bold' }}>
                            //         {
                            //           transaction_request_types.find(
                            //             (tem) => tem.value === item.txn_type
                            //           )?.label
                            //         }
                            //       </h6><span style={{ fontWeight: 'bold' }}>{item.processing_status}</span></td>
                            //       <td><h6 style={{ fontWeight: 'bold' }} className="text-warning">{moment(item.settlement_date).format('DD MMM')}</h6></td>
                            //     </tr>
                            //   );
                            // })
                          }
                          {/* <tr>
                          <td><h6 className="text-primary">05 Feb</h6></td>
                            <td><h6>Verify Trnasfer Deed</h6><span>Completed</span></td>
                            <td><h6 className="text-warning">15 Feb</h6></td>
                          </tr>
                          <tr>
                            <td><h6 className="text-primary">13 Feb</h6></td>
                            <td><h6>Split Share Certificate</h6><span>Completed</span></td>
                            <td><h6 className="text-warning">25 Feb</h6></td>
                          </tr>
                          <tr>
                          <td><h6 className="text-primary">01 Mar</h6></td>
                            <td><h6>Share Submission</h6><span>Completed</span></td>
                            <td><h6 className="text-warning">21 Apr</h6></td>
                          </tr> */}
                        </tbody>
                      </TableWrapper>
                      {/* {completedTxns.length> 4 ?  showCompletedTxns ? <FaAngleUpWrapper onClick={() => setShowCompletedTxns(false)} className='text-secondary' /> : <FaAngleDownWrapper onClick={() => setShowCompletedTxns(true)} className='text-secondary' /> : ''} */}
                    </div>
                  </div> : <div className="text-center">Data not Found</div>}
                </>
              ) : (
                <Spinner />
              )}
            </div>
          </div>

        </div>

      </div>
      <div className="container-fluid mb-3 mt-3" >
        <div className="row">
          <div className="col-md-4 mt-3">
            <EventsWrapper className="card pb-4 shadow" style={{ borderRadius: '20px', height: '380px', minHeight: '416px' }}>
              <div className="text-center d-flex mt-2 ml-3" style={{ gap: '20px' }}>
                <FaCalendarAlt className='text-muted' size={30} />
                <h5 style={{ color: '#04b4fa' }}>Events Calendar</h5>
              </div>

              <div className="card-body">
                {!announcement_data_loading ? (
                  announcement_data.length > 0 ? (
                    <CalendarWrapper
                      localizer={localizer}
                      scrollToTime={new Date(1970, 1, 1, 6)}
                      onSelectEvent={(event) => alert(event.titlee)}
                      views={allViews}
                      events={eventData}
                      eventOverlap
                      dragRevertDuration={500}
                      dragScroll
                      showMultiDayTimes
                      step={60}
                      startAccessor="start"
                      endAccessor="end"
                      background={true}

                      eventPropGetter={event => ({

                        style: {
                          backgroundColor: 'green',
                          border: event.bonusEvent ? '2px solid #609df8' : event.rightEvent ? '2px solid rgb(255, 131, 9)' : '2px solid rgb(255, 214, 15)',
                          minHeight: '35px',
                          maxHeight: '35px',
                          marginTop: '-20px',
                          borderRadius: '5px',
                          overflow: 'hidden',

                        }
                      })}
                    />
                  ) : (
                    <p>
                      <b>No Upcoming Events Available</b>
                    </p>
                  )
                ) : (
                  <Spinner />
                )}
              </div>
            </EventsWrapper>
          </div>


        </div>

      </div>

</>}
    </>
  );
};

export default AdminDashboard;
const Wrapper = styled.div`
display: flex;
align-items: center;
`;
const FaAngleDownWrapper = styled(BsChevronCompactDown)`
color: #e8e8e8 !important;
margin: auto;
font-size: 30px;
justify-content: center;
display: flex;
cursor: pointer;
`;
const FaAngleUpWrapper = styled(BsChevronCompactUp)`
color: #e8e8e8 !important;
margin: auto;
font-size: 30px;
justify-content: center;
display: flex;
cursor: pointer;
`;
const CalendarWrapper = styled(Calendar)`
overflow-y: scroll;
.rbc-event{
  background-color: rgba(68, 102, 242, 0.1)  !important;
}
.rbc-agenda-table tr{
  background-color: unset !important;
  border: 2px solid #dee0e4 ! important;
}
.rbc-row-segment {
  flex-basis: 14.2857% !important;
  max-width: 14.2857% !important;
}

// .rbc-event{
//   width: 63px !important;
//     margin-top: -20px;
//     min-height: 35px;
//     // background-color: rgba(68, 102, 242, 0.1) !important;
//     background-color: unset
//     border: 2px solid #db7257;
//     border-radius: 5px;
// }
// .rbc-event-continues-after{
//    border-top-right-radius: unset; 
//    border-bottom-right-radius: unset;
//   }
// .rbc-row-segment {
//   .rbc-event-content{
//     width: 50px !important;
//     margin-top: -20px;
//     height: 30px;
//   }
// }
// .rbc-row-segment{
//   .rbc-event-content{
//     width: 50px !important;
//     margin-top: -20px;
//     height: 30px;
//   }
// }

::-webkit-scrollbar {
  width: 3px;
  height: 5px;
  max-height: 5px;
}
::-webkit-scrollbar-track{
  background:#F9F9FB;
}
::-webkit-scrollbar-thumb{
  background: #4E515680;
  border-radius: 5px;
  height: 4px;
}
.rbc-toolbar{
  button{
    padding: 4px !important;
    font-size:  !important;
  }
}
`
const WrapperForResponsive = styled.div`
@media(max-width: 765px){
  .responsive{
  width: 350px;
  margin: auto;
  }
}
@media(max-width: 500px){
  .responsive{
  width: 250px;
  margin: auto;
  }
}
`;
const Responsive= styled.div`
// @media(max-width: 1100px){
//   .respons{
//     margin-top: 10px;
//       }
// }
@media(max-width: 1120px){
  .respons{
margin-left: 30px;
  }
}
@media(max-width: 765px){
  .respons{
margin-left: 200px;
  }
}
@media(max-width: 610px){
  .respons{
    margin-left: 30px;
      }
}

`
const EventsWrapper = styled.div`
overflow-y: scroll;
::-webkit-scrollbar{
  height: 5px;
  width: 3px;
}

::-webkit-scrollbar-track{
  background: #F9F9FB;
}
::-webkit-scrollbar-thumb{
  background: #4E515680;
  border-radius: 5px;

}
`;
const ScrollWrapper = styled.div`
// overflow-y: scroll;
// height: 405px;
::-webkit-scrollbar{
  height: 5px;
  width: 3px;
}

::-webkit-scrollbar-track{
  background: #F9F9FB;
}
::-webkit-scrollbar-thumb{
  background: #4E515680;
  border-radius: 5px;

}

`;
const TableWrapper = styled.table`
th, td {
  :nth-child(1) {
    padding-top: 10px;
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;

  }
  :nth-child(2) {
    padding-top: 10px;
    padding-bottom: 0px;
    padding-left: 10px;
    padding-right: 0px;

  }
  :nth-child(3) {
    padding-top: 10px;
    padding-bottom: 0px;
    padding-left: 10px;
    padding-right: 0px;

  }
}
`;
const TableWrapperKeyExective = styled.table`
tr td:nth-child(1) {
  padding-top: 10px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
tr td:nth-child(2) {
  padding-top: 10px;
    padding-bottom: 0px;
    padding-left: 0px;
    padding-right: 0px;
    margin-left: -10px;
}
`;
const ResponsiveWrapperForTable = styled.tr`
@media(min-width: 100px){
  .responsiveHeading{
    width: 100px;
  }
}
@media(min-width: 300px){
  .responsiveHeading{
    width: 150px;
  }
}
@media(min-width: 400px){
  .responsiveHeading{
    width: 200px;
  }
}
@media(min-width: 610px){
  .responsiveHeading{
    width: 200px;
      }
}
@media(min-width: 1180px){
  .responsiveHeading{
    width: 180px;
      }
}
@media(min-width: 1300px){
  .responsiveHeading{
    width: 200px;
      }
}
@media(min-width: 1500px){
  .responsiveHeading{
    width: 250px;
      }
}
@media(min-width: 1700px){
  .responsiveHeading{
    width: 300px;
      }
}
`;