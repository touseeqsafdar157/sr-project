import React, { Fragment, useState, useEffect } from "react";
import {
  getCDCDate,
  getShareHolderHistoryByCompanyandDate,
  getShareHoldersByCompany,
} from "store/services/shareholder.service";
import Dropdown from "components/common/dropdown";
import { darkStyle } from "components/defaultStyles";
import Breadcrumb from "components/common/breadcrumb";
import { useSelector } from "react-redux";
import { getCompanies } from "../../../store/services/company.service";
import { getInvestors } from "store/services/investor.service";
import { getShareholders } from "store/services/shareholder.service";
import {
  generateExcel,
  getvalidDateDMonthY,
  getvalidDateDMY,
  IsJsonString,
  listCrud,
  isValidDate,
} from "utilities/utilityFunctions";
import Select from "react-select";
import { toast } from "react-toastify";
import * as _ from "lodash";

import ReactPaginate from "react-paginate";
import Spinner from "components/common/spinner";
import { numberWithCommas } from "utilities/utilityFunctions";

export default function ShareholdingHistory() {
  const baseEmail = sessionStorage.getItem("email") || "";
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [companyViseShareholders, setCompanyViseShareholders] = useState([]);
  const [cdcDates, setCdcDates] = useState([]);
  const [cdcDatesLoading, setCdcDatesLoading] = useState(false);
  const [underSearch, setUnderSearch] = useState("");
  const [historyDate, setHistoryDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [serachedShareholders, setSerachedShareholders] = useState([]);
  const [companies, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [investors_data, setInvestors_data] = useState([]);
  const [shareholders_data, setShareholders_data] = useState([]);
  const [shareholders_data_loading, setShareholders_data_loading] =
    useState(false);
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);


  const getShareHoldersByCompanyCode = async () => {
    setShareholders_data_loading(true);
    try {
      const response = await getShareHoldersByCompany(baseEmail, selectedCompany, "");
      if (response.status === 200) {
        const parents = response.data.data;
        setShareholders_data(parents);
        setShareholders_data_loading(false);
      }
    } catch (error) {
      setShareholders_data_loading(false);
      toast.error("Error fetching shareholders")
    }
  };


  useEffect(() => {
    const getAllCompanies = async () => {
      setCompanies_data_loading(true);
      try {
        const response = await getCompanies(baseEmail);
        if (response.status === 200) {
          const parents = response.data.data;
          const companies_dropdowns = response.data.data.map((item) => {
            let label = `${item.code} - ${item.company_name}`;
            return { label: label, value: item.code };
          });
          setCompanies_dropdown(companies_dropdowns);
          setCompanies_data(parents);
          setCompanies_data_loading(false);
        }
      } catch (error) {
        setCompanies_data_loading(false);
      }
    };
    const getAllInvestors = async () => {
      try {
        const response = await getInvestors(baseEmail);
        if (response.status === 200) {
          setInvestors_data(response.data.data);
        }
      } catch (error) { }
    };
    // const getAllShareHolders = async () => {
    //   setShareholders_data_loading(true);
    //   try {
    //     const response = await getShareholders(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.setShareholders_data(parents);
    //       setShareholders_data_loading(false);
    //     }
    //   } catch (error) {
    //     setShareholders_data_loading(false);
    //   }
    // };
    // getAllShareHolders();
    getAllInvestors();
    getAllCompanies();
  }, []);
  useEffect(() => {
    const getAvailableDates = async () => {
      setCdcDatesLoading(true);
      try {
        const filtered_shareholders = _.uniqBy(
          shareholders_data.filter(
            (item) => item.company_code === selectedCompany
          ),
          "shareholder_id"
        ).map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name}) `;
          return { label: label, value: item.shareholder_id };
        });
        setCompanyViseShareholders(filtered_shareholders);
        const response = await getCDCDate(baseEmail, selectedCompany);
        if (response.status === 200)
          setCdcDates(
            _.uniq(
              response.data.data.filter(
                (item) =>
                  new Date(item) !== "Invalid Date" &&
                  item !== null &&
                  !item.includes("/")
              )
            )
          );
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(`${error?.response?.data?.message}`)
          : toast.error("CDC Dates Not Found");
        setCdcDatesLoading(false);
      }
      setCdcDatesLoading(false);
    };
    if (!!selectedCompany) {
      getAvailableDates();
      getShareHoldersByCompanyCode();
    }
  }, [selectedCompany]);
  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const shareholderPerPage = 10;
  const pagesVisited = pageNumber * shareholderPerPage;
  const totalnumberofPages = 100;
  const displayShareholdersPerPage = serachedShareholders
    .sort((a, b) => {
      if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
        return -1;
      if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
        return 1;
      return 0;
    })
    .slice(pagesVisited, pagesVisited + shareholderPerPage)
    .map((shareholder, i) => (
      <tr key={i}>
        <td>{shareholder.folio_number.startsWith(`${selectedCompany}-`) ? shareholder.folio_number.split("-")[1] : shareholder.folio_number}</td>

        {/* <td>{shareholder.symbol}</td> */}
        <td>{shareholder.shareholder_name}</td>
        <td>{shareholder.shareholder_id}</td>
        <td>
          {
            companies.find((comp) => comp.code === shareholder.company_code)
              ?.company_name
          }
        </td>
        <td className="text-right">
          {numberWithCommas(shareholder.electronic_shares)}
        </td>
        <td className="text-right">
          {numberWithCommas(shareholder.physical_shares)}
        </td>
        <td>{shareholder.cdc_key}</td>
      </tr>
    ));
  const pageCount = Math.ceil(serachedShareholders.length / shareholderPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */

  const handleHistorySearch = () => {
    const getShareholdingHistory = async () => {
      try {
        setHistoryLoading(true);
        const response = await getShareHolderHistoryByCompanyandDate(
          baseEmail,
          selectedCompany,
          historyDate
        );
        if (response.status === 200) {
          // get Company Name
          // const comp = companies.filter(
          //   (item) => item.code === selectedCompany
          // );
          const comp = companies.find(
            (item) => item.code === selectedCompany
          );
          // setSelectedCompanyName(comp[0].company_name);
          setSelectedCompanyName(comp.company_name);

          const regular_obj = response.data.data
            .reverse()
            .find((item) => item.type === "REGULAR");
          const cdc_obj = response.data.data
            .reverse()
            .find((item) => item?.type === "CDC");
          const regular_shareholders = IsJsonString(regular_obj?.shareholders)
            ? JSON.parse(regular_obj.shareholders)
            : [];
          const cdc_shareholders = IsJsonString(cdc_obj?.shareholders)
            ? JSON.parse(cdc_obj.shareholders)
            : [];
            //this was old mapping loop
          // const mapped_shareholders = cdc_shareholders
          //   .concat(regular_shareholders)
          //   .map((holder,i) => {
          //     // console.log("Current Holder => ", holder)
          //     let currentHolder;
          //     const current_shareholder = shareholders_data.find(
          //       (item) => {
          //        if( holder.folio_number === item.folio_number || holder?.shareholder_id === item?.shareholder_id || holder?.shareholder_id === item?.cnic || holder?.shareholder_id === item?.ntn)
          //         {
                    
          //           currentHolder = item
                    

          //         }
          //       });
          //     const keys = Object.keys(holder).indexOf('city')
          //     // console.log("Current Holder => ",currentHolder)
          //     // console.log("Holder => ",holder)

          //     if (keys != -1) {
          //       return { ...currentHolder, ...holder };
          //     } else {
          //             if(currentHolder.folio_number === "12-1826-201277" || holder.folio_number === "12-1826-201277" || currentHolder.folio_number==="1826-201277" || holder.folio_number === "1826-201277"){
          //         console.log("here 2")
          //         console.log("Holder => ", holder)
          //         console.log("Current => ", currentHolder)

          //         let obj = {...currentHolder, ...holder}
          //         console.log("This is obj => ", obj)
          //       }
          //       return { ...currentHolder, ...holder, ...{ city: currentHolder?.city || ''}};
          //     }
          //     // return { ...current_shareholder, ...holder };
          //   });

//           const mapped_shareholders = [];
// for (let i = 0; i < cdc_shareholders.length; i++) {
//   const holder = cdc_shareholders[i];
//   let currentHolder;
//   for (let j = 0; j < shareholders_data.length; j++) {
//     const item = shareholders_data[j];
//     if (holder.folio_number === item.folio_number || holder?.shareholder_id === item?.shareholder_id || holder?.shareholder_id === item?.cnic || holder?.shareholder_id === item?.ntn) {
//       currentHolder = item;
//       break;
//     }
//   }
//   const keys = Object.keys(holder).indexOf('city');
//   if (keys != -1) {
//     mapped_shareholders.push({...currentHolder, ...holder});
//   } else {
//     mapped_shareholders.push({...currentHolder, ...holder, ...{city: currentHolder?.city || ''}});
//   }
// }

// const mapped_shareholders = [];
// for (let i = 0; i < cdc_shareholders.length; i++) {
//   const holder = cdc_shareholders[i];
//   let currentHolder;
//   for (let j = 0; j < shareholders_data.length; j++) {
//     const item = shareholders_data[j];
//     if (holder.folio_number === item.folio_number || holder?.shareholder_id === item?.shareholder_id || holder?.shareholder_id === item?.cnic || holder?.shareholder_id === item?.ntn) {
//       currentHolder = item;
//       break;
//     }
//   }
//   if ('city' in holder) {
//     mapped_shareholders.push({...currentHolder, ...holder});
//   } else {
//     mapped_shareholders.push({...currentHolder, ...holder, ...{city: currentHolder?.city || ''}});
//   }
// }

// for (let i = 0; i < regular_shareholders.length; i++) {
//   const holder = regular_shareholders[i];
//   let currentHolder;
//   for (let j = 0; j < shareholders_data.length; j++) {
//     const item = shareholders_data[j];
//     if (holder.folio_number === item.folio_number || holder?.shareholder_id === item?.shareholder_id || holder?.shareholder_id === item?.cnic || holder?.shareholder_id === item?.ntn) {
//       currentHolder = item;
//       break;
//     }
//   }
//   if ('city' in holder) {
//     mapped_shareholders.push({...currentHolder, ...holder});
//   } else {
//     mapped_shareholders.push({...currentHolder, ...holder, ...{city: currentHolder?.city || ''}});
//   }
// }

//           setSerachedShareholders(mapped_shareholders);
//           setUnderSearch("searched");
//           setHistoryLoading(false);

const mapped_shareholders = [];

for (let i = 0; i < cdc_shareholders.length; i++) {
  const holder = cdc_shareholders[i];
  let currentHolder;
  let foundMatch = false; // introduce a flag to keep track of whether a matching record has been found or not
  
  for (let j = 0; j < shareholders_data.length; j++) {
    const item = shareholders_data[j];
    // if(holder.folio_number.startsWith(`${selectedCompany}-`)) {
    //   holder.folio_number = holder.folio_number.replace(`${selectedCompany}-`,"")
    //  }
     if(item.folio_number.startsWith(`${selectedCompany}-`)) {
     item.folio_number =  item.folio_number.replace(`${selectedCompany}-`,"")
     }
     
     if (holder.folio_number === item.folio_number) {
      // console.log("Found")
      // console.log("Entry => ", i)
      // console.log("Holder => ", holder)
      // console.log("Current => ", item)
      currentHolder = item;
      foundMatch = true; // set the flag to true if a matching record is found based on folio number
      break;
    } 
    // else if (!foundMatch && (holder?.shareholder_id === item?.shareholder_id || holder?.shareholder_id === item?.cnic || holder?.shareholder_id === item?.ntn)) {
    //   if(item._id.split("_")[1].replace(`${selectedCompany}-`, "") === holder.folio_number.replace(`${selectedCompany}-`, "")){
    //     currentHolder = item;
    //     foundMatch = true; // set the flag to true if a matching record is found based on other identifiers
    //     break;
    //   }
    // }
  }

  if (currentHolder && currentHolder !== "") {
    if ('city' in holder) {
      mapped_shareholders.push({...currentHolder, ...holder});
    } else {
      mapped_shareholders.push({...currentHolder, ...holder, ...{city: currentHolder?.city || ''}});
    }
  }
}

for (let i = 0; i < regular_shareholders.length; i++) {
  const holder = regular_shareholders[i];
  let currentHolder;
  let foundMatch = false; // introduce a flag to keep track of whether a matching record has been found or not
  // if(holder.folio_number.replace(`${selectedCompany}-`,"") === "7112-4465") {
  //   console.log("Missing holder is => ", holder)
  // }
  
  for (let j = 0; j < shareholders_data.length; j++) {
    const item = shareholders_data[j];
    if(holder.folio_number.startsWith(`${selectedCompany}-`)) {
     holder.folio_number = holder.folio_number.replace(`${selectedCompany}-`,"")
    }
    if(item.folio_number.startsWith(`${selectedCompany}-`)) {
    item.folio_number =  item.folio_number.replace(`${selectedCompany}-`,"")
    }
    
    if (holder.folio_number === item.folio_number) {

      //      console.log("Found")
      // console.log("Entry => ", i)
      // console.log("Holder => ", holder)
      // console.log("Current => ", item)
      currentHolder = item;
      foundMatch = true; // set the flag to true if a matching record is found based on folio number
      break;
    } 
    // else if (!foundMatch && (holder?.shareholder_id === item?.shareholder_id || holder?.shareholder_id === item?.cnic || holder?.shareholder_id === item?.ntn)) {
    //   if(item._id.split("_")[1].replace(`${selectedCompany}-`, "")){
    //     currentHolder = item;
    //     foundMatch = true; // set the flag to true if a matching record is found based on other identifiers
    //     break;
    //   }
      
    // }
  }

  if (currentHolder && currentHolder !== "") {
    if ('city' in holder) {
      mapped_shareholders.push({...currentHolder, ...holder});
    } else {
      mapped_shareholders.push({...currentHolder, ...holder, ...{city: currentHolder?.city || ''}});
    }
  }
}

// console.log("Mapped_Shareholders => ")
// console.log(mapped_shareholders)

setSerachedShareholders(mapped_shareholders);
setUnderSearch("searched");
setHistoryLoading(false);



        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : console.log("Shareholding History Not Found");
        setUnderSearch("");
        setHistoryLoading(false);
      }
    };
    if (historyDate && selectedCompany) {
      getShareholdingHistory();
    }
  };

  const generateData = (shareholder) => {
    if (shareholder.joint_holders == "") {
      shareholder.joint_holders = "[]";
    }
    const associated_investor = investors_data.find(
      (investor) => (investor.investor_id === shareholder.shareholder_id || investor.cnic === shareholder.shareholder_id || investor.ntn === shareholder.shareholder_id || investor.folio_number === shareholder.shareholder_id)
    );
    const joint_holders = JSON.parse(shareholder.joint_holders);
    const joint_one_holder =
      joint_holders.length === 1
        ? {
          joint1: joint_holders[0].jointHolderName,
          joint1percent: joint_holders[0].jointHolderPercent,
          joint1cnic: joint_holders[0].jointHolderCNIC,
          joint1cnic_expiry_date: isValidDate(
            joint_holders[0].jointHolderCNICExp
          )
            ? getvalidDateDMY(joint_holders[0].jointHolderCNICExp)
            : " ",
        }
        : {
          joint1: " ",
          joint1percent: " ",
          joint1cnic: " ",
          joint1cnic_expiry_date: " ",
        };
    const joint_two_holder =
      joint_holders.length === 2
        ? {
          joint2: joint_holders[1].jointHolderName,
          joint2percent: joint_holders[1].jointHolderPercent,
          joint2cnic: joint_holders[1].jointHolderCNIC,
          joint2cnic_expiry_date: isValidDate(
            joint_holders[1].jointHolderCNICExp
          )
            ? getvalidDateDMY(joint_holders[1].jointHolderCNICExp)
            : " ",
        }
        : {
          joint2: " ",
          joint2percent: " ",
          joint2cnic: " ",
          joint2cnic_expiry_date: " ",
        };
    const joint_three_holder =
      joint_holders.length === 3
        ? {
          joint3: joint_holders[2].jointHolderName,
          joint3percent: joint_holders[2].jointHolderPercent,
          joint3cnic: joint_holders[2].jointHolderCNIC,
          joint3cnic_expiry_date: isValidDate(
            joint_holders[2].jointHolderCNICExp
          )
            ? getvalidDateDMY(joint_holders[2].jointHolderCNICExp)
            : " ",
        }
        : {
          joint3: " ",
          joint3percent: " ",
          joint3cnic: " ",
          joint3cnic_expiry_date: " ",
        };
    const passport_expiry = isValidDate(shareholder.passport_expiry)
      ? getvalidDateDMY(shareholder.passport_expiry)
      : " ";
    const cnic_expiry = associated_investor?.cnic_expiry || ' ';
    return {
      ...joint_one_holder,
      ...joint_two_holder,
      ...joint_three_holder,
      // ...shareholder,
      // folio_number: shareholder.folio_number.split('-')[1],
      folio_number:
        shareholder.cdc_key === "NO"
          ? shareholder.folio_number.startsWith(`${selectedCompany}-`) ? shareholder.folio_number.split("-")[1] : shareholder.folio_number
          : shareholder.folio_number,
      folio_type: shareholder.cdc_key === "YES" ? "Electronic" : "Physical",
      // "cnic/ntn": shareholder.shareholder_id,
      "cnic/ntn":
        shareholder.shareholder_id == shareholder.folio_number
          ? " "
          : shareholder?.cnic ? shareholder?.cnic : shareholder?.ntn ? shareholder?.ntn : shareholder.shareholder_id || ' ',
      cnic_expiry: isValidDate(cnic_expiry) ? getvalidDateDMY(cnic_expiry) : " ",
      percentage_of_holding:
        ((parseInt(shareholder.electronic_shares) ||
          parseInt(shareholder.physical_shares)) /
          _.sum(
            serachedShareholders.map(
              (item) =>
                parseInt(item?.electronic_shares) ||
                parseInt(item?.physical_shares)
            )
          )) *
        100,
      "No._of_shares":
        parseInt(shareholder.electronic_shares) ||
        parseInt(shareholder.physical_shares) || ' ',
      branch_address: `${shareholder?.baranch_address} ${shareholder?.baranch_city !== undefined ||
        shareholder?.baranch_city !== ""
        ? shareholder?.baranch_city
        : " "
        }`,

      // branch_address: shareholder?.baranch_address,
      // branch_city: shareholder?.baranch_city,
      investor_type: associated_investor?.category,
      name: shareholder?.shareholder_name || ' ',
      passport_expiry: passport_expiry || ' ',
      "father/husband_name": shareholder?.father_name || ' ',
      // spouse_name: shareholder?.spouse_name,
      address: `${shareholder?.street_address || ' '} ${shareholder?.city !== undefined ? shareholder?.street_address?.includes(shareholder?.city) ? '' : shareholder?.city : "  "
        }`,
      // street_address: `${shareholder?.street_address} ${
      //   shareholder?.city !== undefined ? shareholder?.city : ""
      // }`,
      // father_name: associated_investor?.father_name,
      spouse_name: associated_investor?.spouse_name || ' ',
    };
  };

  const generateDataForPhysicalReport = (shareholder) => {
    if (shareholder.joint_holders == "") {
      shareholder.joint_holders = "[]";
    }
    const associated_investor = investors_data.find(
      (investor) => (investor.investor_id === shareholder.shareholder_id || investor.cnic === shareholder.shareholder_id || investor.ntn === shareholder.shareholder_id || investor.folio_number === shareholder.shareholder_id)
    );
    const joint_holders = JSON.parse(shareholder.joint_holders);
    const joint_one_holder =
      joint_holders.length === 1
        ? {
          joint1: joint_holders[0].jointHolderName,
          joint1percent: joint_holders[0].jointHolderPercent,
          joint1cnic: joint_holders[0].jointHolderCNIC,
          joint1cnic_expiry_date: isValidDate(
            joint_holders[0].jointHolderCNICExp
          )
            ? getvalidDateDMY(joint_holders[0].jointHolderCNICExp)
            : " ",
        }
        : {
          joint1: " ",
          joint1percent: " ",
          joint1cnic: " ",
          joint1cnic_expiry_date: " ",
        };
    const joint_two_holder =
      joint_holders.length === 2
        ? {
          joint2: joint_holders[1].jointHolderName,
          joint2percent: joint_holders[1].jointHolderPercent,
          joint2cnic: joint_holders[1].jointHolderCNIC,
          joint2cnic_expiry_date: isValidDate(
            joint_holders[1].jointHolderCNICExp
          )
            ? getvalidDateDMY(joint_holders[1].jointHolderCNICExp)
            : " ",
        }
        : {
          joint2: " ",
          joint2percent: " ",
          joint2cnic: " ",
          joint2cnic_expiry_date: " ",
        };
    const joint_three_holder =
      joint_holders.length === 3
        ? {
          joint3: joint_holders[2].jointHolderName,
          joint3percent: joint_holders[2].jointHolderPercent,
          joint3cnic: joint_holders[2].jointHolderCNIC,
          joint3cnic_expiry_date: isValidDate(
            joint_holders[2].jointHolderCNICExp
          )
            ? getvalidDateDMY(joint_holders[2].jointHolderCNICExp)
            : " ",
        }
        : {
          joint3: " ",
          joint3percent: " ",
          joint3cnic: " ",
          joint3cnic_expiry_date: " ",
        };
    const passport_expiry = isValidDate(shareholder.passport_expiry)
      ? getvalidDateDMY(shareholder.passport_expiry)
      : " ";
    const cnic_expiry = associated_investor?.cnic_expiry || ' ';

    //for adding cdc physical and electronic holdings to display in physical file
    if (shareholder.folio_number.split("-")[1] == "0" || shareholder.folio_number == "0") {
      // console.log("CDC SHAREHOLDER")
      // console.log(shareholder.folio_number)
      // console.log("---------------")

      return {
        ...joint_one_holder,
        ...joint_two_holder,
        ...joint_three_holder,
        // ...shareholder,
        folio_number: shareholder.folio_number.startsWith(`${selectedCompany}-`) ? shareholder.folio_number.split("-")[1] : shareholder.folio_number,
        folio_type: shareholder.cdc_key === "YES" ? "Electronic" : "Physical",
        // "cnic/ntn": shareholder.shareholder_id,
        // "cnic/ntn":
        //   shareholder.shareholder_id == shareholder.folio_number
        //     ? " "
        //     : shareholder.shareholder_id !== "" && shareholder.shareholder_id && shareholder.shareholder_id !== null && shareholder.shareholder_id !== "null" ? shareholder?.cnic ? shareholder?.cnic : shareholder?.ntn ? shareholder?.ntn : shareholder.shareholder_id : "",
        "cnic/ntn":
        shareholder?.cnic && shareholder?.cnic !== "" ? shareholder?.cnic : shareholder?.ntn && shareholder?.ntn !== "" ? shareholder?.ntn : ' ',
        cnic_expiry: isValidDate(cnic_expiry)
          ? getvalidDateDMY(cnic_expiry)
          : " ",
        percentage_of_holding:
          ((parseInt(shareholder.electronic_shares) ||
            parseInt(shareholder.physical_shares)) /
            _.sum(
              serachedShareholders.map(
                (item) =>
                  parseInt(item?.electronic_shares) ||
                  parseInt(item?.physical_shares)
              )
            )) *
          100,
        "No._of_shares":
          (parseInt(shareholder.electronic_shares) +
            parseInt(shareholder.physical_shares)) || ' ',

        name: shareholder?.shareholder_name || ' ',
        passport_expiry: passport_expiry || ' ',
        "father/husband_name":
         shareholder.folio_number.startsWith(`${selectedCompany}-`) ? shareholder.folio_number.split("-")[1] == "0" : shareholder.folio_number == "0"
            ? " "
            : associated_investor?.father_name,
        spouse_name:
         shareholder.folio_number.startsWith(`${selectedCompany}-`) ? shareholder.folio_number.split("-")[1] == "0" : shareholder.folio_number == "0"
            ? " "
            : associated_investor?.spouse_name,
        // father_name: shareholder.folio_number.split('-')[1]=='0' ? '' : shareholder?.father_name,
        // spouse_name: shareholder.folio_number.split('-')[1]=='0' ? '' : associated_investor?.spouse_name,
        address: `${shareholder?.street_address} ${shareholder?.city !== undefined ? shareholder?.street_address?.includes(shareholder?.city) ? '' : shareholder?.city : " "
          }`,
        // street_address: `${shareholder?.street_address} ${
        //   shareholder?.city !== undefined ? shareholder?.city : ""
        // }`,
        // father_name: associated_investor?.father_name,
        // spouse_name: associated_investor?.spouse_name,
      };
    } else {
      // console.log("SHAREHOLDER")
      // console.log(shareholder.folio_number)
      // console.log("---------------")
      return {
        ...joint_one_holder,
        ...joint_two_holder,
        ...joint_three_holder,
        // ...shareholder,
        folio_number: shareholder.folio_number.startsWith(`${selectedCompany}-`) ? shareholder.folio_number.split("-")[1] : shareholder.folio_number,
        folio_type: shareholder.cdc_key === "YES" ? "Electronic" : "Physical",
        // "cnic/ntn": shareholder.shareholder_id,
        // "cnic/ntn":
        //   shareholder.shareholder_id == shareholder.folio_number
        //     ? " "
        //     : shareholder?.cnic ? shareholder?.cnic : shareholder?.ntn ? shareholder?.ntn : shareholder.shareholder_id || ' ',
        "cnic/ntn":
         shareholder?.cnic && shareholder?.cnic !== "" ? shareholder?.cnic : shareholder?.ntn && shareholder?.ntn !== "" ? shareholder?.ntn : ' ',
        cnic_expiry: isValidDate(cnic_expiry)
          ? getvalidDateDMY(cnic_expiry)
          : " ",

        percentage_of_holding:
          ((parseInt(shareholder.electronic_shares) ||
            parseInt(shareholder.physical_shares)) /
            _.sum(
              serachedShareholders.map(
                (item) =>
                  parseInt(item?.electronic_shares) ||
                  parseInt(item?.physical_shares)
              )
            )) *
          100,
        "No._of_shares":
          parseInt(shareholder.electronic_shares) ||
          parseInt(shareholder.physical_shares) || ' ',

        name: shareholder?.shareholder_name || ' ',
        passport_expiry: passport_expiry,
        "father/husband_name":
         shareholder.folio_number.startsWith(`${selectedCompany}`) ? shareholder.folio_number.split("-")[1] == "0" : shareholder.folio_number == "0"
            ? " "
            : associated_investor?.father_name,
        spouse_name:
        shareholder.folio_number.startsWith(`${selectedCompany}`) ? shareholder.folio_number.split("-")[1] == "0" : shareholder.folio_number == "0"
            ? " "
            : associated_investor?.spouse_name,
        // father_name: shareholder.folio_number.split('-')[1]=='0' ? '' : shareholder?.father_name,
        // spouse_name: shareholder.folio_number.split('-')[1]=='0' ? '' : associated_investor?.spouse_name,
        address: `${shareholder?.street_address} ${shareholder?.city !== undefined ? shareholder?.street_address?.includes(shareholder?.city) ? '' : shareholder?.city : " "
          }`,
        // street_address: `${shareholder?.street_address} ${
        //   shareholder?.city !== undefined ? shareholder?.city : ""
        // }`,
        // father_name: associated_investor?.father_name,
        // spouse_name: associated_investor?.spouse_name,
      };
    }
  };

  // const generateData = (shareholder) => {
  //   if(shareholder.joint_holders==""){
  //     shareholder.joint_holders ="[]";
  //   }
  //   const associated_investor = investors_data.find(
  //     (investor) => investor.investor_id === shareholder.shareholder_id
  //   );
  //   const joint_holders = JSON.parse(shareholder.joint_holders);
  //   const joint_one_holder =
  //     joint_holders.length === 1
  //       ? {
  //           joint1: joint_holders[0].jointHolderName,
  //           joint1percent: joint_holders[0].jointHolderPercent,
  //           joint1cnic: joint_holders[0].jointHolderCNIC,
  //           joint1cnic_expiry_date: isValidDate(
  //             joint_holders[0].jointHolderCNICExp
  //           )
  //             ? getvalidDateDMY(joint_holders[0].jointHolderCNICExp)
  //             : "",
  //         }
  //       : {
  //           joint1: "",
  //           joint1percent: "",
  //           joint1cnic: "",
  //           joint1cnic_expiry_date: "",
  //         };
  //   const joint_two_holder =
  //     joint_holders.length === 2
  //       ? {
  //           joint2: joint_holders[1].jointHolderName,
  //           joint2percent: joint_holders[1].jointHolderPercent,
  //           joint2cnic: joint_holders[1].jointHolderCNIC,
  //           joint2cnic_expiry_date: isValidDate(
  //             joint_holders[1].jointHolderCNICExp
  //           )
  //             ? getvalidDateDMY(joint_holders[1].jointHolderCNICExp)
  //             : "",
  //         }
  //       : {
  //           joint2: "",
  //           joint2percent: "",
  //           joint2cnic: "",
  //           joint2cnic_expiry_date: "",
  //         };
  //   const joint_three_holder =
  //     joint_holders.length === 3
  //       ? {
  //           joint3: joint_holders[2].jointHolderName,
  //           joint3percent: joint_holders[2].jointHolderPercent,
  //           joint3cnic: joint_holders[2].jointHolderCNIC,
  //           joint3cnic_expiry_date: isValidDate(
  //             joint_holders[2].jointHolderCNICExp
  //           )
  //             ? getvalidDateDMY(joint_holders[2].jointHolderCNICExp)
  //             : "",
  //         }
  //       : {
  //           joint3: "",
  //           joint3percent: "",
  //           joint3cnic: "",
  //           joint3cnic_expiry_date: "",
  //         };
  //   const passport_expiry = isValidDate(shareholder.passport_expiry)
  //     ? getvalidDateDMY(shareholder.passport_expiry)
  //     : "";
  //   const cnic_expiry = associated_investor?.cnic_expiry;
  //   return {
  //     ...joint_one_holder,
  //     ...joint_two_holder,
  //     ...joint_three_holder,
  //     ...shareholder,
  //     folio_type: shareholder.cdc_key === "YES" ? "Electronic" : "Physical",
  //     "cnic/ntn": shareholder.shareholder_id,
  //     cnic_expiry: isValidDate(cnic_expiry) ? getvalidDateDMY(cnic_expiry) : "",
  //     percentage:
  //       ((parseInt(shareholder.electronic_shares) ||
  //         parseInt(shareholder.physical_shares)) /
  //         _.sum(
  //           serachedShareholders.map(
  //             (item) =>
  //               parseInt(item?.electronic_shares) ||
  //               parseInt(item?.physical_shares)
  //           )
  //         )) *
  //       100,
  //     shareholding:
  //       parseInt(shareholder.electronic_shares) ||
  //       parseInt(shareholder.physical_shares) ||
  //       (shareholder.father_name) ||
  //       (shareholder.street_address) ,
  //     shareholder_name: shareholder?.shareholder_name,
  //     passport_expiry,
  //     father_name: associated_investor?.father_name,
  //     spouse_name: associated_investor?.spouse_name,
  //   };
  // };

  const headings = [["Holding as on:", getvalidDateDMonthY(historyDate)]];
  const columns_array = [
    // "participant_id",
    "folio_type",
    "sno",
    "folio_number",
    "name",
    "father/husband_name",
    "address",
    // "street_address",
    // "city",
    "cnic/ntn",
    "No._of_shares",
    "percentage_of_holding",
    "passport_no",
    "passport_expiry",
    "passport_country",
    "zakat_status",
    "investor_type",
    "resident_status",
    "nationality",
    "occupation",
    "tax_status",
    "bank_account_no",
    "bank_account_title",
    "bank_name",
    "branch_address",
    "joint1",
    // "joint1percent",
    "joint1cnic",
    // "joint1cnic_expiry_date",
    "joint2",
    // "joint2percent",
    "joint2cnic",
    // "joint2cnic_expiry_date",
    "joint3",
    // "joint3percent",
    "joint3cnic",
    // "joint3cnic_expiry_date",
    "contact",
    "mobile",

    "email",

    // "cnic_expiry",

    // "shareholder_percent",
    "roshan_account",








    // "baranch_city",
    // "branch_city",
    // "baranch_address",


    // "shareholding",
    // "right_shares",



  ];
  const generateCompleteShareHolding = () => {
    const physicalData = serachedShareholders?.filter(item => item?.cdc_key?.toLowerCase() == 'no')?.sort((a, b) => a.folio_number - b.folio_number);
    const electronicData = serachedShareholders?.filter(item => item?.cdc_key?.toLowerCase() == 'yes')?.sort((a, b) => a.folio_number - b.folio_number);
    const concatePhysicalAndElectronic = physicalData.concat(electronicData);
    const data_array = concatePhysicalAndElectronic
      .filter((data) => data.folio_number !== `${selectedCompany}-0`)
      .map((data, index) => ({
        ..._.pick({
          ...generateData(data),
          sno: index + 1,

          investor_type: data?.category || ' ',
          occupation: data?.occupation || ' ',
          bank_name: data?.bank_name || ' ',
          tax_status: data?.filer?.toUpperCase() || ' ',
          mobile: data?.mobile_no || ' ',
          contact: data?.shareholder_mobile || ' ',
          roshan_account: data?.roshan_account || " ",
          resident_status: data?.resident_status || ' ',
          passport_no: data?.passport_no || ' ',
          passport_country: data?.passport_country || ' ',
          zakat_status: data?.zakat_status || ' ',
          nationality: data?.nationality || ' ',
          bank_account_title: data?.account_title || ' ',
          bank_account_no: data?.account_no || ' ',
          email: data?.shareholder_email || ' ',
          shareholder_percent: data?.shareholder_percent || ' '

        }, columns_array),
      }));
    const headings = [
      [
        "Company Name:",
        selectedCompanyName,
        "Holding as on:",
        getvalidDateDMonthY(historyDate),
      ],
    ];
    const columns =
      serachedShareholders.length &&
      _.keys(
        _.pick(
          {
            folio_type: "PHYSICAL",
            ...data_array[data_array.length - 1],
          },
          columns_array
        )
      ).map((e) => e.toUpperCase().replaceAll("_", " "));
    generateExcel(
      `Shareholding Report ${getvalidDateDMY(new Date())}`,
      "Shareholding Report",
      "Report",
      "Report",
      "DCCL",
      headings,
      columns,
      data_array
    );
  };
  const generatePhysicalShareHolding = () => {
    // console.log("Searched Shareholders")
    // console.log("In Physical Shareholding")
    // console.log(serachedShareholders.filter( (data) =>
    // data.cdc_key === "NO" ||
    // (data.folio_number === `${selectedCompany}-0` &&
    //   data.cdc_key === "YES")))
    
    const data_array = serachedShareholders
      .filter(
        (data) =>
          data.cdc_key === "NO" ||
          (data.folio_number === `${selectedCompany}-0` &&
            data.cdc_key === "YES")
      )
      .map((data, index) => ({
        ..._.pick(
          {
            // ...generateData(data),
            ...generateDataForPhysicalReport(data),
            // percentage:
            //   ((parseInt(data.electronic_shares) ||
            //     parseInt(data.physical_shares)) /
            //     _.sum(
            //       serachedShareholders
            //         .filter((hol) => parseInt(hol.physical_shares))
            //         .map(
            //           (item) =>
            //             parseInt(item?.electronic_shares) ||
            //             parseInt(item?.physical_shares)
            //         )
            //     )) *
            //   100,
            sno: index + 1,
            branch_address: `${data?.baranch_address} ${data?.baranch_city !== undefined || data?.baranch_city !== ""
              ? data?.baranch_city
              : ""
              }`,
            occupation: data?.occupation || ' ',
            bank_name: data?.bank_name || ' ',
            tax_status: data?.filer?.toUpperCase() || ' ',
            passport_no: data?.passport_no || ' ',
            passport_country: data?.passport_country || ' ',
            zakat_status: data?.zakat_status || ' ',
            resident_status: data?.resident_status || ' ',
            nationality: data?.nationality || ' ',
            bank_account_title: data?.account_title || ' ',
            bank_account_no: data?.account_no || ' ',
            email: data?.shareholder_email || ' ',
            shareholder_percent: data?.shareholder_percent || ' ',
            mobile: data?.mobile_no || ' ',
            contact: data?.shareholder_mobile || ' ',
            roshan_account: data?.roshan_account || " ",
            // participant_id:`${data?._id||''}`,
            investor_type: data?.category || '',
            // filer: data?.filer?.includes('Y')? 'YES' : 'NO',
            // address: `${data?.street_address} ${
            //   data?.city !== undefined ? data?.city : ""
            //   }`,
            // street_address: `${data?.street_address} ${
            //   data?.city !== undefined ? data?.city : ""
            // }`,
            // branch_address: data.baranch_address,
            // branch_city: data.baranch_city,
          },
          columns_array.slice(1, columns_array?.length)
        ),
      }));

    const headings = [
      [
        "Company Name:",
        selectedCompanyName,
        "Holding as on:",
        getvalidDateDMonthY(historyDate),
      ],
    ];
    const columns =
      serachedShareholders.length &&
      _.keys(
        _.pick(
          {
            folio_type: "PHYSICAL",
            ...data_array[data_array.length - 1],
          },
          columns_array.slice(1, columns_array?.length)
        )
      ).map((e) => e.toUpperCase().replaceAll("_", " "));
    generateExcel(
      `Physical Shareholding Report ${getvalidDateDMY(new Date())}`,
      "Physical Shareholding Report",
      "Report",
      "Report",
      "DCCL",
      headings,
      columns,
      data_array.sort((a, b) => a.folio_number - b.folio_number)
    );
  };

  const generateElectronicShareHolding = () => {
    // console.log(serachedShareholders.find((item) => item.folio_number === "1826-201277"))
    const data_array = serachedShareholders
      .filter((data) => data.cdc_key === "YES")
      .filter((data) => data.folio_number !== `${selectedCompany}-0`)
      .map((data, index) => ({
        ..._.pick(
          {
            ...generateData(data),
            sno: index + 1,
            investor_type: data?.category || ' ',
            occupation: data?.occupation || ' ',
            bank_name: data?.bank_name || ' ',
            tax_status: data?.filer?.toUpperCase() || ' ',
            mobile: data?.mobile_no || ' ',
            contact: data?.shareholder_mobile || ' ',
            roshan_account: data?.roshan_account || " ",
            resident_status: data?.resident_status || ' ',
            passport_no: data?.passport_no || ' ',
            passport_country: data?.passport_country || ' ',
            zakat_status: data?.zakat_status || ' ',
            nationality: data?.nationality || ' ',
            bank_account_title: data?.account_title || ' ',
            bank_account_no: data?.account_no || ' ',
            email: data?.shareholder_email || ' ',
            shareholder_percent: data?.shareholder_percent || ' '
            // percentage:
            //   ((parseInt(data.electronic_shares) ||
            //     parseInt(data.physical_shares)) /
            //     _.sum(
            //       serachedShareholders
            //         .filter((hol) => parseInt(hol.electronic_shares))
            //         .map(
            //           (item) =>
            //             parseInt(item?.electronic_shares) ||
            //             parseInt(item?.physical_shares)
            //         )
            //     )) *
            //   100,
            // branch_address: `${data?.baranch_address} ${
            //   data?.baranch_city !== undefined || data?.baranch_city !== ""
            //     ? data?.baranch_city
            //     : ""
            //   }`,
            //   // participant_id:`${data?._id||''}`,
            //   occupation: data?.occupation || '',
            //   investor_type: data?.category || '',
            //   bank_name: data?.bank_name || '',
            //   filer: data?.filer?.toUpperCase() || '',
            // address: `${data?.street_address || ''} ${data?.city !== undefined ?data?.street_address?.includes(data?.city) ? '': data?.city : ""
            //   }`,
            // street_address: `${data?.street_address} ${
            //   data?.city !== undefined ? data?.city : ""
            // }`,
            // branch_address: data.baranch_address,
            // branch_city: data.baranch_city,
          },
          columns_array.slice(1, columns_array?.length)
        ),
      }));
      // console.log(data_array.find((item) => item.folio_number === "1826-201277"))
    const headings = [
      [
        "Company Name:",
        selectedCompanyName,
        "Holding as on:",
        getvalidDateDMonthY(historyDate),
      ],
    ];
    // console.log("these are headings => ", headings)
    const columns =
      serachedShareholders.length &&
      _.keys(
        _.pick(
          {
            folio_type: "PHYSICAL",
            ...data_array[data_array.length - 1],
          },
          columns_array?.slice(1, columns_array?.length)
        )
      ).map((e) => e.toUpperCase().replaceAll("_", " "));
      // console.log("These are columns => ", columns)
    generateExcel(
      `Electronic Shareholding Report ${getvalidDateDMY(new Date())}`,
      "Electronic Shareholding Report",
      "Report",
      "Report",
      "DCCL",
      headings,
      columns,
      data_array.sort((a, b) => a.folio_number - b.folio_number)
    );
  };

  const generateInvestorViseShareholding = () => {
    const data_array = serachedShareholders
      .filter((data) => data.folio_number !== `${selectedCompany}-0` || data.folio_number !== "0")
      .filter((data) => data.shareholder_id === selectedInvestor)
      .map((data, index) => ({
        ..._.pick(
          {
            ...data,
            sno: index + 1,
            folio_type: data.cdc_key === "YES" ? "Electronic" : "Physical",
            folio_number: data.folio_number.startsWith(`${selectedCompany}-`) ? data.folio_number.split("-")[1] : data.folio_number,
            percentage:
              ((parseInt(data.electronic_shares) ||
                parseInt(data.physical_shares)) /
                _.sum(
                  serachedShareholders.map(
                    (item) =>
                      parseInt(item?.electronic_shares) ||
                      parseInt(item?.physical_shares)
                  )
                )) *
              100,
            shareholding:
              parseInt(data.electronic_shares) ||
              parseInt(data.physical_shares),
            branch_address: `${data?.baranch_address} ${data?.baranch_city !== undefined || data?.baranch_city !== ""
              ? data?.baranch_city
              : ""
              }`,
            // participant_id:`${data?._id||''}`,
            occupation: data?.occupation || '',
            investor_type: data?.category || '',
            bank_name: data?.bank_name || '',
            tax_status: data?.filer?.toUpperCase() || '',
            address: `${data?.street_address || ''} ${data?.city !== undefined ? data?.city : ""
              }`,
            // street_address: `${data?.street_address} ${
            //   data?.city !== undefined ? data?.city : ""
            // }`,
            // branch_address: data.baranch_address,
            // branch_city: data.baranch_city,
          },
          columns_array?.slice(1, columns_array?.length)
        ),
      }));

    const headings = [
      [
        "Company Name:",
        selectedCompanyName,
        "Holding as on:",
        getvalidDateDMonthY(historyDate),
      ],
    ];
    const columns =
      serachedShareholders.length &&
      _.keys(
        _.pick(
          {
            folio_type: "PHYSICAL",
            ...data_array[data_array.length - 1],
          },
          columns_array?.slice(1, columns_array?.length)
        )
      ).map((e) => e.toUpperCase().replaceAll("_", " "));
    generateExcel(
      `Shareholding Report ${getvalidDateDMY(new Date())}`,
      "Shareholding Report",
      "Report",
      "Report",
      "DCCL",
      headings,
      columns,
      data_array.sort((a, b) => a.folio_number - b.folio_number)
    );
  };
  useEffect(() => { }, [selectedInvestor]);
  // Menu List Start
  const list = [
    {
      function: generateCompleteShareHolding,
      title: "Generate All Shareholding",
    },
    {
      function: generateElectronicShareHolding,
      title: "Generate Electronic Shareholding",
    },
    {
      function: generatePhysicalShareHolding,
      title: "Generate Physical Shareholding",
    },
    {
      function: generateInvestorViseShareholding,
      title: "Generate Selected Investor Holdings",
    },
  ];
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Shareholding History</h6>
        <Breadcrumb title="Shareholdings History" parent="Shareholdings" />
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header ">
                <div className="d-flex justify-content-between">
                  <h5></h5>
                  <div className="btn-group">
                    <Dropdown
                      button_color_class={"btn-success"}
                      header={"Generate Excel Report"}
                      disabled={
                        serachedShareholders.length === 0 ||
                        !historyDate ||
                        !selectedCompany
                      }
                      list={list}
                    >
                      <i className="fa fa-file-excel-o mr-1"></i>
                    </Dropdown>
                  </div>

                  {/* <button
                    className="btn btn-success"
                    disabled={
                      serachedShareholders.length === 0 ||
                      !historyDate ||
                      !selectedCompany
                    }
                    onClick={(e) => {
                      generateExcel(
                        `Shareholding Report ${getvalidDateDMY(new Date())}`,
                        "Shareholding Report",
                        "Report",
                        "Report",
                        "DCCL",
                        headings,
                        columns,
                        serachedShareholders.map((data) => ({
                          folio_type:
                            data.cdc_key === "YES" ? "Electronic" : "Physical",
                          total_percentage:
                            (companies.companies_data.find(
                              (comp) => comp.code === selectedCompany
                            )?.outstanding_shares /
                              (parseInt(data.electronic_shares) +
                                parseInt(data.physical_shares))) *
                            100,
                          ..._.omit(data, [
                            "doc_type",
                            "gateway_code",
                            "joint_holders",
                            "cdc_key",
                          ]),
                        }))
                      );
                    }}
                  >
                    <i className="fa fa-file-excel-o mr-1"></i>Generate Report
                  </button> */}
                </div>

                <div className="row mt-2">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={companies_dropdown}
                        isLoading={companies_data_loading === true}
                        onChange={(selected) => {
                          setSerachedShareholders([])
                          !!selected?.value &&
                            setSelectedCompany(selected.value);
                          !selected && setSelectedCompany("");
                          !selected?.value && setUnderSearch("");
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Company And Date to Check shareholding history
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="histyro">Select Date</label>
                      <input
                        className="form-control"
                        type="date"
                        name="history"
                        id="history"
                        defaultValue={getvalidDateDMY(new Date())}
                        onChange={(e) => {
                          setSerachedShareholders([]);
                          setHistoryDate(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Investor</label>
                      <Select
                        options={companyViseShareholders}
                        isLoading={shareholders_data_loading}
                        onChange={(selected) => {
                          !!selected?.value &&
                            setSelectedInvestor(selected.value);
                          !selected && setSelectedInvestor("");
                        }}
                        isDisabled={!selectedCompany}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Investor to get Shareholding Investor Vise
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <button
                    className="btn btn-success ml-3"
                    onClick={(e) => handleHistorySearch()}
                    disabled={!historyDate || !selectedCompany || !investors_data || investors_data.length == 0}
                  >
                    {investors_data && investors_data.length !== 0 ? "Generate" : "Loading Data..."}
                  </button>
                </div>
                {!!cdcDates.length && (
                  <div className="row mt-2">
                    <div className="alert alert-info fade show ml-3">
                      <h4 className="akert-heading">CDC File Uploaded Dates</h4>
                      <p>
                        <ul className="cdc-dates-ul ml-3">
                          {cdcDates.map((item, i) => (
                            <li key={i}>{getvalidDateDMonthY(item)}</li>
                          ))}
                        </ul>
                      </p>
                    </div>
                  </div>
                )}
                {cdcDatesLoading === true && (
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6">
                      <center>
                        <h6 className="mb-0 text-nowrap">
                          <b>{"Please Wait"}</b>
                        </h6>
                        <div className="d-flex justify-content-center">
                          <div className="loader-box mx-auto">
                            <div className="loader">
                              <div className="line bg-primary"></div>
                              <div className="line bg-primary"></div>
                              <div className="line bg-primary"></div>
                              <div className="line bg-primary"></div>
                            </div>
                          </div>
                        </div>
                      </center>
                    </div>
                  </div>
                )}
              </div>

              {historyLoading === true && <Spinner />}
              {historyLoading === false && !!serachedShareholders.length && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>Folio Number</th>
                        {/* <th>Symbol</th> */}
                        <th>Shareholder Name</th>
                        <th>Shareholder CNIC/NTN</th>
                        <th>Company</th>
                        <th className="text-right">Electronic Shares</th>
                        <th className="text-right">Physical Shares</th>
                        <th>CDC Key</th>
                        {/* {(crudFeatures[1] || crudFeatures[2]) && (
                          <th>Action</th>
                        )} */}
                      </tr>
                    </thead>

                    <tbody>{displayShareholdersPerPage}</tbody>
                  </table>
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
              )}
              {!serachedShareholders.length && !historyLoading && (
                <p className="text-center">
                  <b>
                    Shareholders Data not available. Select Date and Company to
                    generate Record
                  </b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
