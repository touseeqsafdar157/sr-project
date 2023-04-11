import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import * as _ from "lodash";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { filterData, SearchType } from "filter-data";
import { getCompanies } from "../../../store/services/company.service";
import {
  getShareholders,
  getShareHoldersByCompany,
} from "store/services/shareholder.service";
import {
  generateExcel,
  getvalidDateDMY,
  IsJsonString,
  listCrud,
} from "../../../../src/utilities/utilityFunctions";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import AddShareCertificateIssuance from "./addShareCertificateIssuance";
import EditShareCertificateIssuance from "./editShareCertificateIssuance";
import ViewShareCertificateIssuance from "./viewShareCertificateIssuance";
import {
  getShareCertificates,
  getShareCertificatesByCompany,
  getShareCertificatesByFolio,
} from "../../../store/services/shareCertificate.service";
import Select from "react-select";
import { createSvg } from "chartist";
import { generateRegex } from "../../../utilities/utilityFunctions";
import { darkStyle } from "../../defaultStyles";
import ViewCertificateHistory from "./viewCertificateHistory";
import Spinner from "components/common/spinner";
import AddShareCertificate from "./addShareCertificate";
import { numberWithCommas } from "../../../../src/utilities/utilityFunctions";
import { result } from "lodash";

const ShareCertificateIssuanceListing = () => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const [data, setData] = useState([]);
  const features = useSelector((data) => data.Features).features;
  const certificate_status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Transfered To Electronic", value: "TTE" },
  ];
  const [status, setStatus] = useState("");
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewIssuePage, setViewIssuePage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [shareHoldings, setShareHoldings] = useState([]);
  const [shareHoldingsOptions, setShareHoldingsOptions] = useState([]);
  const [selectedHolding, setSelectedHolding] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [search, setSearch] = useState("");
  const [underSearch, setUnderSearch] = useState("");
  const [searchedCertificates, setSearchedCertificates] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [companies, setCompanies_data] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [share_holders, setShareholders_data] = useState([]);
  const [shareholders_data_loading, setShareholders_data_loading] =
    useState(false);
  const [shareholders_dropdown, setShareholders_dropdown] = useState([]);
  const [share_certificates, setShare_certificates] = useState([]);
  const [share_certificates_loading, setShare_certificates_loading] =
    useState(false);
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);
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
    // const getAllShareHolders = async () => {
    //   setShareholders_data_loading(true);
    //   try {
    // const response = await getShareholders(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.data;
    //       const shareholders_dropdowns = response.data.data.map((item) => {
    //         let label = `${item.folio_number} (${item.shareholder_name})`;
    //         return { label: label, value: item.folio_number };
    //       });
    //       setShareholders_dropdown(shareholders_dropdowns);
    //       setShareholders_data(parents);
    //       setShareholders_data_loading(false);
    //     }
    //   } catch (error) {
    //     setShareholders_data_loading(false);
    //   }
    // };
    // const getAllShareCertificates = async () => {
    //   setShare_certificates_loading(true);
    //   try {
    // const response = await getShareCertificates(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.data;
    //       setShare_certificates(parents);
    //       setShare_certificates_loading(false);
    //     }
    //   } catch (error) {
    //     setShare_certificates_loading(false);
    //   }
    // };
    // getAllShareCertificates();
    // getAllShareHolders();
    getAllCompanies();
  }, []);


  const convertDistinctive_noIntoSingleString = (array) =>{
    return array.map((item)=>{
      if(typeof(item.distinctive_no)==='string'){
        item.distinctive_no = JSON.parse(item.distinctive_no);
      }
      if(typeof(item.distinctive_no)==='object'){
        item.distinctive_no = JSON.stringify(item.distinctive_no);
      }
      return item
    })

  }

  const getShareholdersForSelectedCompany = async () => {
    setShareholders_data_loading(true);
    try {
      const response = await getShareHoldersByCompany(
        baseEmail,
        selectedCompany,
        ""
      );
      if (response.status === 200) {
        const parents = response.data.data;
        const shareholders_dropdowns = response.data.data.map((item) => {
          let label = `${item.folio_number} (${item.shareholder_name})`;
          return { label: label, value: item.folio_number };
        });
        setShareholders_dropdown(shareholders_dropdowns);
        setShareholders_data(parents);
        setShareholders_data_loading(false);
      }
    } catch (error) {
      setShareholders_data_loading(false);
    }
  };

  const getCertificatesForSelectedCompany = async () => {
    setShare_certificates_loading(true);
    try {
      const response = await getShareCertificatesByCompany(
        baseEmail,
        selectedCompany
      );
      if (response.status === 200) {
        const parents = convertDistinctive_noIntoSingleString(response.data.data);
        setShare_certificates(parents);
        setShare_certificates_loading(false);
      }
    } catch (error) {
      setShare_certificates_loading(false);
    }
  };

  useEffect(() => {
    if (selectedCompany !== "") {
      getShareholdersForSelectedCompany();
      getCertificatesForSelectedCompany();
      setInitialLoad(false);
    }
    if (!selectedCompany) {
      setInitialLoad(true);
      setShare_certificates([]);
      setShareholders_dropdown([]);
      setShareholders_data([]);
    }
  }, [selectedCompany]);
  // useEffect(() => {
  //   const getAllShareCertificatesAndShareHolders = async () => {
  //     try {
  //       const shareHoldersResponse = await getShareholders(baseEmail);
  //       const shareCertificateResponse = await getShareCertificates(baseEmail);
  //       if (shareHoldersResponse.status === 200) {
  //         if (shareCertificateResponse.status === 200) {
  //           let options = shareHoldersResponse.data.data.map((item) => {
  //             let label = `${item.folio_number} (${item.shareholder_name}) `;
  //             return { label: label, value: item.folio_number };
  //           });
  //           setShareHoldingsOptions(options);
  //           setShareHoldings(shareHoldersResponse.data.data);
  //           setCertificates(
  //             shareCertificateResponse.data.data.map((cert) => ({
  //               ...cert,
  //               folio_number: cert.allotted_to,
  //               allotted_to: shareHoldersResponse.data.data.find(
  //                 (holding) => holding.folio_number === cert.allotted_to
  //               )?.shareholder_name,
  //               company_code: companies.companies_data.find(
  //                 (comp) => comp.code === cert.company_code
  //               )?.company_name,
  //             }))
  //           );
  //         }
  //       }
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : toast.error("Certificates Not Found");
  //     }
  //   };

  //   getAllShareCertificatesAndShareHolders();
  // }, [companies.companies_data]);
  // useEffect(() => {
  //   const getAllShareCertificatesAndShareHolders = async () => {
  //     try {
  //       const shareCertificateResponse = await getShareCertificatesByCompany(
  //         baseEmail,
  //         selectedCompany
  //       );
  //       if (shareCertificateResponse.status === 200) {
  //         if (selectedHolding !== "") {
  //           setCertificates(
  //             shareCertificateResponse.data.data
  //               .filter((cert) => cert.allotted_to === selectedHolding)
  //               .map((cert) => ({
  //                 ...cert,
  //                 folio_number: cert.allotted_to,
  //                 allotted_to: shareHoldings.find(
  //                   (holding) => holding.folio_number === cert.allotted_to
  //                 )?.shareholder_name,
  //                 company_code: companies.companies_data.find(
  //                   (comp) => comp.code === cert.company_code
  //                 )?.company_name,
  //               }))
  //           );
  //         } else {
  //           setCertificates(
  //             shareCertificateResponse.data.data.map((cert) => ({
  //               ...cert,
  //               folio_number: cert.allotted_to,
  //               allotted_to: shareHoldings.find(
  //                 (holding) => holding.folio_number === cert.allotted_to
  //               )?.shareholder_name,
  //               company_code: companies.companies_data.find(
  //                 (comp) => comp.code === cert.company_code
  //               )?.company_name,
  //             }))
  //           );
  //         }
  //       }
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : toast.error("Certificates Not Found");
  //     }
  //   };
  //   if (selectedCompany !== "") getAllShareCertificatesAndShareHolders();
  // }, [selectedCompany]);

  // useEffect(() => {
  //   const getAllShareCertificatesAndShareHolders = async () => {
  //     try {
  //       const shareCertificateResponse = await getShareCertificatesByFolio(
  //         baseEmail,
  //         selectedHolding
  //       );
  //       if (shareCertificateResponse.status === 200) {
  //         if (selectedCompany !== "") {
  //           setCertificates(
  //             shareCertificateResponse.data.data
  //               .filter((cert) => cert.company_code === selectedCompany)
  //               .map((cert) => ({
  //                 ...cert,
  //                 folio_number: cert.allotted_to,
  //                 allotted_to: shareHoldings.find(
  //                   (holding) => holding.folio_number === cert.allotted_to
  //                 )?.shareholder_name,
  //                 company_code: companies.companies_data.find(
  //                   (comp) => comp.code === cert.company_code
  //                 )?.company_name,
  //               }))
  //           );
  //         } else {
  //           setCertificates(
  //             shareCertificateResponse.data.data.map((cert) => ({
  //               ...cert,
  //               folio_number: cert.allotted_to,
  //               allotted_to: shareHoldings.find(
  //                 (holding) => holding.folio_number === cert.allotted_to
  //               )?.shareholder_name,
  //               company_code: companies.companies_data.find(
  //                 (comp) => comp.code === cert.company_code
  //               )?.company_name,
  //             }))
  //           );
  //         }
  //       }
  //     } catch (error) {
  //       !!error?.response?.data?.message
  //         ? toast.error(error?.response?.data?.message)
  //         : toast.error("Certificates Not Found");
  //     }
  //   };
  //   if (selectedHolding !== "") getAllShareCertificatesAndShareHolders();
  // }, [selectedHolding]);
  const displayDistinctive = (distinctive_no) => {
    if (
      IsJsonString(distinctive_no) &&
      Array.isArray(JSON.parse(distinctive_no))
    ) {
      const distinctive_n = JSON.parse(distinctive_no);

      const distinctive_array = [];
      if (distinctive_n.length !== 0) {
        return [
          distinctive_n.map((item) => item.from).toString(),
          distinctive_n.map((item) => item.to).toString(),
        ];
      } else return "";
    } else return "";
  };
  useEffect(() => {
    // if (search || selectedHolding || selectedCompany || status) {
    if (search || selectedHolding || status) {
      setUnderSearch("qewq");

      const searchConditions = [
        { key: "certificate_no", value: search, type: SearchType.LK },
        // { key: "company_code", value: selectedCompany, type: SearchType.EQ },
        { key: "allotted_to", value: selectedHolding, type: SearchType.EQ },
        { key: "status", value: status, type: SearchType.EQ },
      ];

      let result = filterData(share_certificates, searchConditions);
      // result.distinctive_no = JSON.parse(result.distinctive_no)
      result = convertDistinctive_noIntoSingleString(result)
      setSearchedCertificates(result);
    } else if (!search) {
      setUnderSearch("qewq");

      const searchConditions = [
        { key: "certificate_no", value: search, type: SearchType.LK },
        // { key: "company_code", value: selectedCompany, type: SearchType.EQ },
        { key: "allotted_to", value: selectedHolding, type: SearchType.EQ },
        { key: "status", value: status, type: SearchType.EQ },
      ];

      let result = filterData(share_certificates, searchConditions);

      result = convertDistinctive_noIntoSingleString(result)
      setSearchedCertificates(result);
    } else if (!selectedHolding) {
      setUnderSearch("qewq");

      const searchConditions = [
        { key: "certificate_no", value: search, type: SearchType.LK },
        // { key: "company_code", value: selectedCompany, type: SearchType.EQ },
        { key: "allotted_to", value: selectedHolding, type: SearchType.EQ },
        { key: "status", value: status, type: SearchType.EQ },
      ];

      let result = filterData(share_certificates, searchConditions);
      result = convertDistinctive_noIntoSingleString(result)
      setSearchedCertificates(result);
    } else if (!status) {
      setUnderSearch("qewq");

      const searchConditions = [
        { key: "certificate_no", value: search, type: SearchType.LK },
        // { key: "company_code", value: selectedCompany, type: SearchType.EQ },
        { key: "allotted_to", value: selectedHolding, type: SearchType.EQ },
        { key: "status", value: status, type: SearchType.EQ },
      ];

      let result = filterData(share_certificates, searchConditions);
      result = convertDistinctive_noIntoSingleString(result);
      setSearchedCertificates(result);
    } else if (!search && !selectedHolding && !status) {
      setUnderSearch("");
    }
  }, [search, selectedHolding, status]);
  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const certificatesPerPage = 10;
  const pagesVisited = pageNumber * certificatesPerPage;
  const totalnumberofPages = 100;
  const displayCertificatesPerPage =
    searchedCertificates.length === 0
      ? share_certificates
        .sort((a, b) => {
          if (
            new Date(b.issue_date).getTime() <
            new Date(a.issue_date).getTime()
          )
            return -1;
          if (
            new Date(b.issue_date).getTime() >
            new Date(a.issue_date).getTime()
          )
            return 1;
          return 0;
        })
        .map((cert, i) => ({ ...cert, s_no: i + 1 }))
        .slice(pagesVisited, pagesVisited + certificatesPerPage)
        .map((cert, i) => (
          <tr key={i}>
            <td scope="col">{cert.s_no}</td>
            <td>{cert.allotted_to}</td>
            <td>
              {
                share_holders.find(
                  (holder) => holder.folio_number === cert.allotted_to
                )?.shareholder_name
              }
            </td>
            <td>{cert.certificate_no}</td>
            <td>
              {
                companies.find((comp) => comp.code === cert.company_code)
                  ?.company_name
              }
            </td>
            <td>{displayDistinctive(cert.distinctive_no)[0]}</td>
            <td>{displayDistinctive(cert.distinctive_no)[1]}</td>
            <td className="text-right">
              {numberWithCommas(cert.shares_count)}
            </td>
            <td>{cert.status}</td>
            <td>{cert.txn_id}</td>
            <td>
              <>
                <i
                  className="icofont icofont-history"
                  id="viewCertificateHistory"
                  style={{
                    width: 35,
                    fontSize: 16,
                    padding: 11,
                    color: "rgb(68, 102, 242)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    // for modal
                    setViewFlag(true);
                    sessionStorage.setItem(
                      "selectedCertificateHistory",
                      cert.certificate_history
                    );
                  }}
                ></i>
                <UncontrolledTooltip
                  placement="top"
                  target="viewCertificateHistory"
                >
                  {"View Certificate History"}
                </UncontrolledTooltip>
                {crudFeatures[2] && (
                  <>
                    <i
                      className="fa fa-pencil"
                      style={{
                        width: 35,
                        fontSize: 16,
                        padding: 11,
                        color: "#FF9F40",
                        cursor: "pointer",
                      }}
                      id="editAnnouncement"
                      onClick={() => {
                        const obj = JSON.parse(JSON.stringify(cert));
                        let company_name = companies.find((comp) => comp.code === cert.company_code)
                          ?.company_name;
                        let folioNo = share_holders.find(
                          (holder) => holder.folio_number === cert.allotted_to
                        )?.shareholder_name;
                        let from = displayDistinctive(cert.distinctive_no)[0]
                        let to = displayDistinctive(cert.distinctive_no)[1]
                        // obj.company_code = getFoundObject(
                        //   companies_dropdown,
                        //   obj.company_code
                        // );
                        // obj.symbol = getFoundObject(
                        //   companies_dropdown,
                        //   obj.symbol
                        // );
                        // obj.symbol = getFoundObject(
                        //   symbols_dropdown,
                        //   obj.symbol
                        // );
                        // obj.period = getFoundObject(period_options, obj.period);
                        obj['company_name'] = company_name;
                        obj['shareholder_data'] = shareholders_dropdown;
                        obj['folio_number'] = folioNo;
                        obj['certificate_from'] = from;
                        obj['certificate_to'] = to;
                        obj['certificate_no'] = obj.certificate_no.replaceAll(`${obj.company_code}-`, '');
                        obj['distinctive_no'] = JSON.parse(obj.distinctive_no);
                        obj['allotted_to'] = { label: ((cert.allotted_to === undefined && cert.allotted_to === '') ? '' : cert.allotted_to + ' (' + (folioNo === undefined ? '' : folioNo) + ')'), value: cert.allotted_to === undefined ? '' : cert.allotted_to };
                        obj['company_code'] = { label: obj.company_name, value: obj.company_code };
                        // for modal
                        setViewEditPage(true);
                        sessionStorage.setItem(
                          "selectedCertificateEdit",
                          JSON.stringify(obj)
                        );
                      }}
                    ></i>
                    <UncontrolledTooltip placement="top" target="editAnnouncement">
                      {"Edit Share Certificate Detail"}
                    </UncontrolledTooltip>
                  </>
                )}
              </>
            </td>
          </tr>
        ))
      : searchedCertificates
        .sort((a, b) => {
          if (
            new Date(b.issue_date).getTime() <
            new Date(a.issue_date).getTime()
          )
            return -1;
          if (
            new Date(b.issue_date).getTime() >
            new Date(a.issue_date).getTime()
          )
            return 1;
          return 0;
        })
        .map((cert, i) => ({ ...cert, s_no: i + 1 }))
        .slice(pagesVisited, pagesVisited + certificatesPerPage)
        .map((cert, i) => (
          <tr key={i}>
            <td scope="col">{cert.s_no}</td>
            <td>{cert.allotted_to}</td>
            <td>
              {
                share_holders.find(
                  (holder) => holder.folio_number === cert.allotted_to
                )?.shareholder_name
              }
            </td>
            <td>{cert.certificate_no}</td>
            <td>
              {
                companies.find((comp) => comp.code === cert.company_code)
                  ?.company_name
              }
            </td>
            <td>{displayDistinctive(cert.distinctive_no)[0]}</td>
            <td>{displayDistinctive(cert.distinctive_no)[1]}</td>
            <td className="text-right">
              {numberWithCommas(cert.shares_count)}
            </td>
            <td>{cert.status}</td>
            <td>{cert.txn_id}</td>
            <td>
              <>
                <i
                  className="icofont icofont-history"
                  id="viewCertificateHistory"
                  style={{
                    width: 35,
                    fontSize: 16,
                    padding: 11,
                    color: "rgb(68, 102, 242)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    // for modal
                    setViewFlag(true);
                    sessionStorage.setItem(
                      "selectedCertificateHistory",
                      cert.certificate_history
                    );
                  }}
                ></i>
                <UncontrolledTooltip
                  placement="top"
                  target="viewCertificateHistory"
                >
                  {"View Certificate History"}
                </UncontrolledTooltip>
                {crudFeatures[2] && (
                  <>
                    <i
                      className="fa fa-pencil"
                      style={{
                        width: 35,
                        fontSize: 16,
                        padding: 11,
                        color: "#FF9F40",
                        cursor: "pointer",
                      }}
                      id="editAnnouncement"
                      onClick={() => {
                        const obj = JSON.parse(JSON.stringify(cert));
                        let company_name = companies.find((comp) => comp.code === cert.company_code)
                          ?.company_name;
                        let folioNo = share_holders.find(
                          (holder) => holder.folio_number === cert.allotted_to
                        )?.shareholder_name;
                        let from = displayDistinctive(cert.distinctive_no)[0]
                        let to = displayDistinctive(cert.distinctive_no)[1]
                        // obj.company_code = getFoundObject(
                        //   companies_dropdown,
                        //   obj.company_code
                        // );
                        // obj.symbol = getFoundObject(
                        //   companies_dropdown,
                        //   obj.symbol
                        // );
                        // obj.symbol = getFoundObject(
                        //   symbols_dropdown,
                        //   obj.symbol
                        // );
                        // obj.period = getFoundObject(period_options, obj.period);


                        obj['company_name'] = company_name;
                        obj['shareholder_data'] = shareholders_dropdown;
                        obj['folio_number'] = folioNo;
                        obj['certificate_from'] = from;
                        obj['certificate_to'] = to;
                        obj['certificate_no'] = obj.certificate_no.replaceAll(`${obj.company_code}-`, '');
                        obj['distinctive_no'] = JSON.parse(obj.distinctive_no);
                        obj['allotted_to'] = { label: ((cert.allotted_to === undefined && cert.allotted_to === '') ? '' : cert.allotted_to + ' (' + (folioNo === undefined ? '' : folioNo) + ')'), value: cert.allotted_to === undefined ? '' : cert.allotted_to };
                        obj['company_code'] = { label: obj.company_name, value: obj.company_code };
                        // for modal
                        setViewEditPage(true);
                        sessionStorage.setItem(
                          "selectedCertificateEdit",
                          JSON.stringify(obj)
                        );
                      }}
                    ></i>
                    <UncontrolledTooltip placement="top" target="editAnnouncement">
                      {"Edit Share Certificate Detail"}
                    </UncontrolledTooltip>
                  </>
                )}
              </>
            </td>
            {/* <td>
              {crudFeatures[2] && (
                <>
                  <i
                    className="fa fa-pencil"
                    style={{
                      width: 35,
                      fontSize: 16,
                      padding: 11,
                      color: "#FF9F40",
                      cursor: "pointer",
                    }}
                    id="editAnnouncement"
                    onClick={() => {
                      const obj = JSON.parse(JSON.stringify(cert));
                      // obj.company_code = getFoundObject(
                      //   companies_dropdown,
                      //   obj.company_code
                      // );
                      // obj.symbol = getFoundObject(
                      //   companies_dropdown,
                      //   obj.symbol
                      // );
                      // obj.symbol = getFoundObject(
                      //   symbols_dropdown,
                      //   obj.symbol
                      // );
                      // obj.period = getFoundObject(period_options, obj.period);
                      // for modal
                      // setViewEditPage(true);
                      // sessionStorage.setItem(
                      //   "selectedCorporateAnnouncement",
                      //   JSON.stringify(obj)
                      // );
                    }}
                  ></i>
                  <UncontrolledTooltip placement="top" target="editAnnouncement">
                    {"Edit Announcement's Detail"}
                  </UncontrolledTooltip>
                </>
              )}
            </td> */}
          </tr>
        ));
  const pageCount =
    searchedCertificates.length === 0
      ? Math.ceil(share_certificates.length / certificatesPerPage)
      : Math.ceil(searchedCertificates.length / certificatesPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  const handleSearchChange = () => {
    // const filtered_data = [];
    // !!e && setSearch(e?.target?.value);
    // !!e && setUnderSearch(e.target.value);
    // !!status && setUnderSearch(status);
    // !!folio_number && setUnderSearch(folio_number);
    // !!company && setUnderSearch(company);
    // !e && !status && !folio_number && !company && setSearch("");
    setUnderSearch("qewq");

    const searchConditions = [
      { key: "certificate_no", value: search, type: SearchType.LK },
      { key: "company_code", value: selectedCompany, type: SearchType.EQ },
    ];
    let result = filterData(share_certificates, searchConditions);
    result = convertDistinctive_noIntoSingleString(result)
    setSearchedCertificates(result);
    // if (!!e) {
    //   if (e.target.value.length > 0) {
    //     if (share_certificates.share_certificates_data.length > 0) {
    //       setSearchedCertificates(
    //         share_certificates.share_certificates_data.filter((cert) => {
    //           if (!!cert?.certificate_no)
    //             return cert.certificate_no.match(generateRegex(e.target.value));
    //           else return false;
    //         })
    //       );
    //     }
    //   }
    // }
    // if (!!company) {
    //   for (
    //     let index = 0;
    //     index < share_certificates.share_certificates_data.length;
    //     index++
    //   ) {
    //     const obj = share_certificates.share_certificates_data[index];
    //     if (obj.company_code === company) filtered_data.push(obj);
    //   }
    //   setSearchedCertificates(filtered_data);
    // }
    // if (!!folio_number) {
    //   for (
    //     let index = 0;
    //     index < share_certificates.share_certificates_data.length;
    //     index++
    //   ) {
    //     const obj = share_certificates.share_certificates_data[index];
    //     if (obj.allotted_to === folio_number) filtered_data.push(obj);
    //   }
    //   setSearchedCertificates(filtered_data);
    // }
    // if (!!status) {
    //   for (
    //     let index = 0;
    //     index < share_certificates.share_certificates_data.length;
    //     index++
    //   ) {
    //     const obj = share_certificates.share_certificates_data[index];
    //     if (obj.status === status) filtered_data.push(obj);
    //   }
    //   setSearchedCertificates(filtered_data);
    // }
  };
  const handleReportGeneration = () => {
    const data =
      underSearch && searchedCertificates.length > 0
        ? searchedCertificates
        : share_certificates;

    const mapped_data = data.map((item, i) => ({
      no: i + 1,
      folio_number: item.allotted_to,
      allotted_to: share_holders.find(
        (holder) => holder.folio_number === item.allotted_to
      )?.shareholder_name,
      company: companies.find((comp) => comp.code === item.company_code)
        ?.company_name,
      from: displayDistinctive(item.distinctive_no)[0],
      to: displayDistinctive(item.distinctive_no)[1],
      ...item,
    }));
    const columns = _.keys({
      ..._.pick(mapped_data[mapped_data.length - 1], [
        "no",
        "folio_number",
        "allotted_to",
        "certificate_no",
        "company",
        "from",
        "to",
        "allotted_to",
        "shares_count",
        "status",
      ]),
    }).map((e) => e.toUpperCase().replaceAll("_", " "));
    generateExcel(
      `Share Certificate Report ${getvalidDateDMY(new Date())}`,
      "Share Certificate Report",
      "Report",
      "Report",
      "DCCL",
      [],
      columns,
      _.values(
        mapped_data.map((data) => ({
          ..._.pick(data, [
            "no",
            "folio_number",
            "allotted_to",
            "certificate_no",
            "company",
            "from",
            "to",
            "allotted_to",
            "shares_count",
            "status",
          ]),
        }))
      )
    );
  };
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Share Certificate Listing</h6>
        <Breadcrumb title="Share Certificate" parent="Shareholdings" />
      </div>
      {/* Issue Modal */}
      <Modal isOpen={viewIssuePage} show={viewIssuePage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewIssuePage(false);
          }}
        >
          Add Share Certificate Issuance
        </ModalHeader>
        <ModalBody>
          <AddShareCertificateIssuance setViewIssuePage={setViewIssuePage} />
        </ModalBody>
      </Modal>
      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Share Certificate
        </ModalHeader>
        <ModalBody>
          <AddShareCertificate setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Share Certificate Issuance Edit
        </ModalHeader>
        <ModalBody>
          <EditShareCertificateIssuance setViewEditPage={setViewEditPage} getCertificatesForSelectedCompany={getCertificatesForSelectedCompany} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          View Certificate History
        </ModalHeader>
        <ModalBody>
          <ViewCertificateHistory />
        </ModalBody>
      </Modal>

      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className=" d-flex justify-content-between">
                  <h5></h5>
                  {crudFeatures[0] && (
                    <div className="btn-group">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          // for modal
                          setViewIssuePage(true);
                        }}
                      >
                        <i className="fa fa-file-text"></i> Issue Share
                        Certificate
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          // for modal
                          setViewAddPage(true);
                        }}
                      >
                        <i className="fa fa-plus mr-1"></i> Missing Share
                        Certificate
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleReportGeneration}
                        disabled={share_certificates_loading}
                      >
                        Generate Report
                      </button>
                    </div>
                  )}
                </div>

                <div className="row mt-2 ml-1">
                  <div className="col-sm-12 col-lg-3 col-md-3">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={companies_dropdown}
                        isLoading={companies_data_loading === true}
                        onChange={(selected) => {
                          // selected && handleSearchChange("");
                          !selected && setSelectedCompany("");
                          selected && setSelectedCompany(selected.value);
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-3 col-md-3">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">
                        Search Certificate
                      </label>
                      <input
                        id="searchTransaction"
                        className="form-control"
                        type="text"
                        placeholder={"Enter Certifiacte No"}
                        value={search}
                        onChange={(e) => {
                          setSearch(e?.target?.value);
                        }}
                        isClearable={true}
                        disabled={selectedCompany == ""}
                      />
                    </div>
                  </div>

                  <div className="col-sm-12 col-lg-3 col-md-3">
                    <label htmlFor="email">Folio Number </label>
                    <Select
                      options={shareholders_dropdown}
                      isLoading={shareholders_data_loading === true}
                      onChange={(selected) => {
                        // selected && handleSearchChange("");
                        !selected && setSelectedHolding("");
                        selected && setSelectedHolding(selected.value);
                      }}
                      styles={darkStyle}
                      isClearable={true}
                      isDisabled={
                        selectedCompany == "" ||
                        setShareholders_dropdown.length == 0
                      }
                    />
                  </div>
                  <div className="col-sm-12 col-lg-3 col-md-3">
                    <label htmlFor="email">Status </label>
                    <Select
                      options={certificate_status}
                      isLoading={certificate_status.length === 0}
                      onChange={(selected) => {
                        // selected && handleSearchChange("");
                        !selected && setStatus("");
                        selected && setStatus(selected.value);
                      }}
                      isClearable={true}
                      styles={darkStyle}
                      isDisabled={selectedCompany == ""}
                    />
                  </div>
                </div>
              </div>

              {share_certificates_loading === true && <Spinner />}
              {share_certificates.length !== 0 &&
                share_certificates_loading === false &&
                companies.length !== 0 && (
                  <div className="table-responsive">
                    <table className="table  ">
                      <thead>
                        <tr>
                          <th>S No. </th>
                          <th>Folio No</th>
                          <th>Alloted To</th>
                          <th>Certificate No</th>
                          <th>Company</th>
                          <th>From</th>
                          <th>To</th>
                          <th className="text-right">Shares Count</th>
                          <th>Status</th>
                          <th>Transaction ID</th>
                          <th>History</th>
                        </tr>
                      </thead>

                      <tbody>{displayCertificatesPerPage}</tbody>
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
              {!initialLoad &&
                share_certificates_loading === false &&
                share_certificates.length === 0 && (
                  <p className="text-center">
                    <b>Share Certificates Data not available</b>
                  </p>
                )}
              {initialLoad && share_certificates.length === 0 && (
                <p className="text-center">
                  <b>Select Company to show certificates</b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ShareCertificateIssuanceListing;
