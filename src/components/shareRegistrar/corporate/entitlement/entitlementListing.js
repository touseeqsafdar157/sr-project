import React, { Fragment, useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import {
  getCorporateAnnouncementByCompanyCode,
  getCorporateEntitlement,
  getCorporateEntitlementByAnnouncement,
} from "../../../../store/services/corporate.service";
import download from "downloadjs";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as _ from "lodash";
import { useSelector } from "react-redux";
import { filterData, SearchType } from "filter-data";
import Dropdown from "../../../common/dropdown";
import {
  generateExcel,
  generateRegex,
  getvalidDateDMY,
  listCrud,
} from "../../../../../src/utilities/utilityFunctions";
import Spinner from "components/common/spinner";

import ReactPaginate from "react-paginate";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  ModalFooter,
} from "reactstrap";
import AddEntitlement from "./addEntitlement";
import EditEntitlement from "./editEntitlement";
import ViewEntitlement from "./viewEntitlement";
import ViewIndividualEntitlement from "./viewIndividualEntitlement";
import { darkStyle, disabledStyles, errorStyles } from "../../../defaultStyles";
import { rightLetterTemplateOne } from "templates/rightLetterTemplate1";
import jsPDF from "jspdf";
import DOMPurify from "dompurify";
import ToggleButton from "react-toggle-button";
import { getCompanies } from "store/services/company.service";
import { getCorporateAnnouncement } from "store/services/corporate.service";
import {
  getShareholders,
  getShareHoldersByCompany,
} from "store/services/shareholder.service";

export default function EntitlementListing() {
  const features = useSelector((data) => data.Features).features;
  const baseEmail = sessionStorage.getItem("email") || "";
  const [newEntitlements, setNewEntitlements] = useState([]);
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [generatePdfLoading, setGeneratePdfLoading] = useState(false);
  const [viewFlagPDF, setViewFlagPDF] = useState(false);
  const [active, setActive] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState("");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [underSearch, setUnderSearch] = useState("");
  const [search, setSearch] = useState("");
  const [searchedEntitlements, setSearchedEntitlements] = useState([]);
  const [data, setData] = useState([]);
  const [viewAddPage, setViewAddPage] = useState(false);
  const [viewCalculatePage, setViewCalculatePage] = useState(false);
  const [viewEditPage, setViewEditPage] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  // Right Letter Data
  const [entitlement, setEntitlement] = useState(null);
  const [announcement, setAnnouncement] = useState(null);
  const [shareHolder, setShareHolder] = useState(null);
  const [company, setCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [entitlements, setEntitlements] = useState([]);
  const [entitlement_data_loading, setEntitlement_data_loading] =
    useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcement_dropdown, setAnnouncement_dropdown] = useState([]);
  const [announcement_data_loading, setAnnouncement_data_loading] =
    useState(false);
  const [shareholders, setShareholders] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const borderRadiusStyle = { borderRadius: 2 };
  // REFS
  const divRef = useRef(null);
  let history = useHistory();
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
          setCompanies(parents);
          setCompanies_data_loading(false);
        }
      } catch (error) {
        setCompanies_data_loading(false);
      }
    };
    // const getAllShareHolders = async () => {
    //   try {
    //     const response = await getShareholders(baseEmail);
    //     if (response.status === 200) {
    //       const parents = response.data.data;
    //       setShareholders(parents);
    //     }
    //   } catch (error) {}
    // };
    // const getAllCorporateAnnouncement = async () => {
    //   setAnnouncement_data_loading(true);
    //   try {
    //     const response = await getCorporateAnnouncement(baseEmail);
    //     if (response.status === 200) {
    //       setAnnouncements(response.data.data);
    //       const announcement_dropdowns = response.data.data.map((item) => {
    //         let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
    //         return { label: label, value: item.announcement_id };
    //       });
    //       setAnnouncement_dropdown(announcement_dropdowns);
    //       setAnnouncement_data_loading(false);
    //     }
    //   } catch (error) {
    //     setAnnouncement_data_loading(false);
    //   }
    // };
    // const getAllCorporateEntitlements = async () => {
    //   setEntitlement_data_loading(true);
    //   try {
    //     const response = await getCorporateEntitlement(baseEmail);
    //     if (response.status === 200) {
    //       setEntitlements(response.data.data);
    //       setEntitlement_data_loading(false);
    //     }
    //   } catch (error) {
    //     setEntitlement_data_loading(false);
    //   }
    // };
    getAllCompanies();
    // getAllShareHolders();
    // getAllCorporateAnnouncement();
    // getAllCorporateEntitlements();
  }, []);

  const getShareholdersForSelectedCompany = async () => {
    // setShareholders_data_loading(true);
    try {
      const response = await getShareHoldersByCompany(
        baseEmail,
        selectedCompany,
        ""
      );
      if (response.status === 200) {
        const parents = response.data.data;
        setShareholders(parents);
      }
    } catch (error) {
      console.log("Error => ", error?.message);
    }
  };

  const getCorporateAnnouncementsForSelectedCompany = async () => {
    setAnnouncement_data_loading(true);
    try {
      const response = await getCorporateAnnouncementByCompanyCode(
        baseEmail,
        selectedCompany
      );
      if (response.status === 200) {
        setAnnouncements(response.data.data);
        const announcement_dropdowns = response.data.data.map((item) => {
          let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
          return { label: label, value: item.announcement_id };
        });
        setAnnouncement_dropdown(announcement_dropdowns);
        setAnnouncement_data_loading(false);
      }
    } catch (error) {
      setAnnouncement_data_loading(false);
    }
  };

  useEffect(() => {
    if (selectedCompany !== "") {
      getShareholdersForSelectedCompany();
      getCorporateAnnouncementsForSelectedCompany();
      setInitialLoad(false);
    }
    if (!selectedCompany) {
      setInitialLoad(true);
      setAnnouncement_dropdown([]);
      setShareholders([]);
      setEntitlements([]);
    }
  }, [selectedCompany]);

  const getEntitlementsForSelectedAnnouncement = async () => {
    setEntitlement_data_loading(true);
    try {
      const response = await getCorporateEntitlementByAnnouncement(
        baseEmail,
        selectedAnnouncement
      );
      if (response.status === 200) {
        setEntitlements(response.data.data);
        setEntitlement_data_loading(false);
      }
    } catch (error) {
      setEntitlement_data_loading(false);
    }
  };

  useEffect(() => {
    if (selectedAnnouncement && selectedAnnouncement !== "") {
      getEntitlementsForSelectedAnnouncement();
    }
    if (!selectedAnnouncement || selectedAnnouncement == "") {
      setEntitlements([]);
    }
  }, [selectedAnnouncement]);

  useEffect(() => {
    if (entitlements.length > 0 && shareholders && shareholders.length > 0) {
      setNewEntitlements(
        entitlements.map((item) => ({
          shareholder_address:
            shareholders.find(
              (holder) => holder.folio_number === item.folio_number
            )?.street_address +
            ", " +
            shareholders.find(
              (holder) => holder.folio_number === item.folio_number
            )?.street_address,
          cdc_key: shareholders.find(
            (holder) => holder.folio_number === item.folio_number
          )?.cdc_key,
          ...item,
        }))
      );
    }
  }, [entitlements, shareholders]);
  useEffect(() => {
    // if (search || selectedAnnouncement || selectedCompany || active) {
    // if (search || selectedAnnouncement || active) {
    if (search || active) {
      setUnderSearch("qweq");
      const searchConditions = [
        { key: "entitlement_id", value: search, type: SearchType.LK },
        // { key: "company_code", value: selectedCompany, type: SearchType.EQ },
        // {
        //   key: "announcement_id",
        //   value: selectedAnnouncement,
        //   type: SearchType.EQ,
        // },
        { key: "cdc_key", value: active ? "NO" : "YES", type: SearchType.EQ },
      ];
      const result = filterData(newEntitlements, searchConditions);
      setSearchedEntitlements(result);
    } else if (
      !search &&
      // !selectedAnnouncement &&
      // !selectedCompany &&
      !active
    ) {
      setUnderSearch("");
    }
    // }, [search, selectedCompany, selectedAnnouncement, active]);
  }, [search, selectedAnnouncement, active]);

  // const handleSearchChange = (e = "", company = "") => {
  //   !!e && setSearch(e.target.value);
  //   !!e && setUnderSearch(e.target.value);
  //   !!company && setUnderSearch(company);
  //   if (e?.target?.value?.length) {
  //     if (newEntitlements?.length !== 0) {
  //       if (company) {
  //         setSearchedEntitlements(
  //           newEntitlements
  //             .filter((en) => en?.company_code === company)
  //             .filter((en) => {
  //               return en.entitlement_id.match(generateRegex(e.target.value));
  //             })
  //         );
  //       } else
  //         setSearchedEntitlements(
  //           newEntitlements.filter((en) => {
  //             return en.entitlement_id.match(generateRegex(e.target.value));
  //           })
  //         );
  //     }
  //   }
  //   if (company && !e?.target?.value) {
  //     setSearchedEntitlements(
  //       newEntitlements.filter(
  //         (en) => en.company_code === company
  //       )
  //     );
  //     setFilteredAnnouncements(
  //       announcements.announcement_data
  //         .filter((data) => data.company_code === company)
  //         .map((item) => {
  //           let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
  //           return { label: label, value: item.announcement_id };
  //         })
  //     );
  //   }
  // };
  // Report Generation Functions Starts
  const generateCompleteEntitlementExcel = () => {
    const columns = _.keys({
      shareholder_name: "name",
      ..._.pick(newEntitlements[newEntitlements.length - 1], [
        "folio_number",
        "announcement_id",
        "total_holding",
        "right_shares",
        "r_fraction",
        "bonus_shares",
        "b_fraction",
        "gross_dividend",
        "zakat",
        "tax",
        "filer",
        "tax_percentage",
        "dividend_amount",
        "account_title",
        "bank_code",
        "branch",
        "shareholder_address",
      ]),
    }).map((e) => e.toUpperCase().replaceAll("_", " "));

    const headings = companies.length !== 0 &&
      announcements.length !== 0 &&
      newEntitlements.length !== 0 &&
      selectedCompany && [
        [
          "Company:",
          companies.find((comp) => comp.code === selectedCompany)?.company_name,
        ],
        ["Registrar:", "Digital Custodian Company Limited"],
        ["Title: ", `Entitlement Report ${getvalidDateDMY(new Date())}`],
        [
          "Right Rate:",
          announcements.find((data) => {
            return data.announcement_id === selectedAnnouncement;
          })?.right_rate,
          "Right Number:",
          announcements.find((data) => {
            return data.announcement_id === selectedAnnouncement;
          })?.right_number,
          "Right Percentage:",
          announcements.find((data) => {
            return data.announcement_id === selectedAnnouncement;
          })?.right_percent,
        ],
        [
          "Dividend Number:",
          announcements.find((data) => {
            return data.announcement_id === selectedAnnouncement;
          })?.dividend_number,
          "Dividend Percentage:",
          announcements.find((data) => {
            return data.announcement_id === selectedAnnouncement;
          })?.dividend_percent,
        ],
        [
          "Right Number:",
          // announcements.announcement_data.find((data) => {
          announcements.find((data) => {
            return data.announcement_id === selectedAnnouncement;
          })?.bonus_number,
          "Bonus Percentage:",
          announcements.find((data) => {
            return data.announcement_id === selectedAnnouncement;
          })?.bonus_percent,
        ],
        [
          "Company Face Value:",
          companies.find((comp) => comp.code === selectedCompany)?.face_value,
        ],
      ];
    generateExcel(
      `Entitlements Report ${getvalidDateDMY(new Date())}`,
      "Entitlement Report",
      "Report",
      "Report",
      "DCCL",
      headings,
      columns,
      _.values(
        newEntitlements
          .filter(
            (data) =>
              data?.company_code === selectedCompany &&
              data?.announcement_id === selectedAnnouncement
          )
          .map((data) => ({
            shareholder_name: shareholders.find(
              (hold) => hold.folio_number === data.folio_number
            )?.shareholder_name,
            ..._.pick(data, [
              "folio_number",
              "announcement_id",
              "total_holding",
              "right_shares",
              "r_fraction",
              "bonus_shares",
              "b_fraction",
              "gross_dividend",
              "zakat",
              "tax",
              "filer",
              "tax_percentage",
              "dividend_amount",
              "account_title",
              "bank_code",
              "branch",
              "shareholder_address",
            ]),
          }))
      ),
      [
        "",
        "",
        "",
        _.sum(
          newEntitlements
            .filter(
              (ent) =>
                ent?.company_code === selectedCompany &&
                ent?.announcement_id === selectedAnnouncement
            )
            .map((en) => parseInt(en.right_shares))
        ),
      ]
    );
  };

  const generateRightExcel = () => {
    const columns = _.keys({
      shareholder_name: "name",
      ..._.pick(newEntitlements[newEntitlements.length - 1], [
        "folio_number",
        "announcement_id",
        "total_holding",
        "right_shares",
        "r_fraction",
        "shareholder_address",
      ]),
    }).map((e) => e.toUpperCase().replaceAll("_", " "));

    const headings = companies.length !== 0 &&
      announcements.length !== 0 &&
      newEntitlements.length !== 0 &&
      selectedCompany && [
        [
          "Company:",
          companies.find((comp) => comp.code === selectedCompany)?.company_name,
        ],
        ["Registrar:", "Digital Custodian Company Limited"],
        ["Title: ", `Right Allotment ${getvalidDateDMY(new Date())}`],
        [
          "Right Rate:",
          announcements.find(
            (data) => data.announcement_id === selectedAnnouncement
          )?.right_rate,
          "Right Number:",
          announcements.find(
            (data) => data.announcement_id === selectedAnnouncement
          )?.right_number,
          "Right Percentage:",
          announcements.find(
            (data) => data.announcement_id === selectedAnnouncement
          )?.right_percent,
        ],

        [
          "Right Number:",
          announcements.find(
            (data) => data.announcement_id === selectedAnnouncement
          )?.bonus_number,
        ],
        [
          "Company Face Value:",
          companies.find((comp) => comp.code === selectedCompany)?.face_value,
        ],
      ];
    generateExcel(
      `Right Entitlements Report ${getvalidDateDMY(new Date())}`,
      "Right Entitlement Report",
      "Report",
      "Report",
      "DCCL",
      headings,
      columns,
      _.values(
        newEntitlements
          .filter(
            (data) =>
              data?.company_code === selectedCompany &&
              data?.announcement_id === selectedAnnouncement
          )
          .map((data) => ({
            shareholder_name: shareholders.find(
              (hold) => hold.folio_number === data.folio_number
            )?.shareholder_name,
            ..._.pick(data, [
              "folio_number",
              "announcement_id",
              "total_holding",
              "right_shares",
              "r_fraction",
              "shareholder_address",
            ]),
          }))
      ),
      [
        "",
        "",
        "",
        _.sum(
          newEntitlements
            .filter(
              (ent) =>
                ent?.company_code === selectedCompany &&
                ent?.announcement_id === selectedAnnouncement
            )
            .map((en) => parseInt(en.right_shares))
        ),
      ]
    );
  };
  const generateDividendExcel = () => {
    const columns = _.keys({
      shareholder_name: "name",
      ..._.pick(newEntitlements[newEntitlements.length - 1], [
        "folio_number",
        "announcement_id",
        "total_holding",
        "gross_dividend",
        "zakat",
        "tax",
        "filer",
        "tax_percentage",
        "dividend_amount",
        "account_title",
        "bank_code",
        "branch",
        "shareholder_address",
      ]),
    }).map((e) => e.toUpperCase().replaceAll("_", " "));

    const headings = companies.length !== 0 &&
      announcements.length !== 0 &&
      newEntitlements.length !== 0 &&
      selectedCompany && [
        [
          "Company:",
          companies.find((comp) => comp.code === selectedCompany)?.company_name,
        ],
        ["Registrar:", "Digital Custodian Company Limited"],
        ["Title: ", `Dividend Entitlement ${getvalidDateDMY(new Date())}`],

        [
          "Dividend Number:",
          announcements.find(
            (data) => data.announcement_id === selectedAnnouncement
          )?.dividend_number,
          "Dividend Percentage:",
          announcements.find(
            (data) => data.announcement_id === selectedAnnouncement
          )?.dividend_percent,
        ],
        [
          "Company Face Value:",
          companies.find((comp) => comp.code === selectedCompany)?.face_value,
        ],
      ];
    generateExcel(
      `Dividend Entitlements Report ${getvalidDateDMY(new Date())}`,
      "Dividend Entitlement Report",
      "Report",
      "Report",
      "DCCL",
      headings,
      columns,
      _.values(
        newEntitlements
          .filter(
            (data) =>
              data?.company_code === selectedCompany &&
              data?.announcement_id === selectedAnnouncement
          )
          .map((data) => ({
            shareholder_name: shareholders.find(
              (hold) => hold.folio_number === data.folio_number
            )?.shareholder_name,
            ..._.pick(data, [
              "folio_number",
              "announcement_id",
              "total_holding",
              "gross_dividend",
              "zakat",
              "tax",
              "filer",
              "tax_percentage",
              "dividend_amount",
              "account_title",
              "bank_code",
              "branch",
              "shareholder_address",
            ]),
          }))
      ),
      [
        "",
        "",
        "",
        _.sum(
          newEntitlements
            .filter(
              (ent) =>
                ent?.company_code === selectedCompany &&
                ent?.announcement_id === selectedAnnouncement
            )
            .map((en) => parseInt(en.gross_dividend))
        ),
      ]
    );
  };
  const generateBonusExcel = () => {
    const columns = _.keys({
      shareholder_name: "name",
      ..._.pick(newEntitlements[newEntitlements.length - 1], [
        "folio_number",
        "announcement_id",
        "total_holding",
        "bonus_shares",
        "b_fraction",
        "shareholder_address",
      ]),
    }).map((e) => e.toUpperCase().replaceAll("_", " "));

    const headings = companies.length !== 0 &&
      announcements.length !== 0 &&
      newEntitlements.length !== 0 &&
      selectedCompany && [
        [
          "Company:",
          companies.find((comp) => comp.code === selectedCompany)?.company_name,
        ],
        ["Registrar:", "Digital Custodian Company Limited"],
        ["Title: ", `Bonus Allotment ${getvalidDateDMY(new Date())}`],

        [
          "Bonus Percentage:",
          announcements.find(
            (data) => data.announcement_id === selectedAnnouncement
          )?.bonus_percent,
        ],
        [
          "Company Face Value:",
          companies.find((comp) => comp.code === selectedCompany)?.face_value,
        ],
      ];
    generateExcel(
      `Bonus Entitlements Report ${getvalidDateDMY(new Date())}`,
      "Bonus Entitlement Report",
      "Report",
      "Report",
      "DCCL",
      headings,
      columns,
      _.values(
        newEntitlements
          .filter(
            (data) =>
              data?.company_code === selectedCompany &&
              data?.announcement_id === selectedAnnouncement
          )
          .map((data) => ({
            shareholder_name: shareholders.find(
              (hold) => hold.folio_number === data.folio_number
            )?.shareholder_name,
            ..._.pick(data, [
              "folio_number",
              "announcement_id",
              "total_holding",
              "bonus_shares",
              "b_fraction",
              "shareholder_address",
            ]),
          }))
      ),
      [
        "",
        "",
        "",
        _.sum(
          newEntitlements
            .filter(
              (ent) =>
                ent?.company_code === selectedCompany &&
                ent?.announcement_id === selectedAnnouncement
            )
            .map((en) => parseInt(en.bonus_shares))
        ),
      ]
    );
  };
  // Report Generation Function Ends

  // Menu List Start
  const list = [
    {
      function: generateCompleteEntitlementExcel,
      title: "Generate Entitlement Report",
    },
    {
      function: generateRightExcel,
      title: "Generate Right Entitlement Report",
    },
    {
      function: generateDividendExcel,
      title: "Generate Dividend Entitlement Report",
    },
    {
      function: generateBonusExcel,
      title: "Generate Bonus Entitlement Report",
    },
  ];
  // Menu List End

  const printRightLetter = async () => {
    setGeneratePdfLoading(true);

    // const url = right_letter;
    // const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    // const pdfDoc = await PDFDocument.load(existingPdfBytes);
    // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // const pages = pdfDoc.getPages();
    // const firstPage = pages[0];
    // const { width, height } = firstPage.getSize();
    // firstPage.drawText("This text was added with JavaScript!", {
    //   x: 5,
    //   y: height / 2 + 300,
    //   size: 10,
    //   font: helveticaFont,
    //   color: rgb(0, 0, 0),
    //   // rotate: degrees(-45),
    // });

    // const pdfBytes = await pdfDoc.save();
    // setGeneratePdfLoading(false);
    // download(pdfBytes, "right_letter.pdf", "application/pdf");

    var doc = new jsPDF({
      orientation: "p",
      format: "a4",
      unit: "pt",
    });
    var content = document.getElementById(`transaction-request-1`);
    doc.html(content, {
      callback: function (doc) {
        // doc.addImage(company.logo, "PNG", 10, 10, 60, 60);
        doc.save(`right_letter.pdf`);
        setGeneratePdfLoading(false);
      },
      html2canvas: {
        scale: 0.6,
        useCORS: true,
      },
      margin: [-20, 0, 0, -70],
      x: 0,
      y: 0,
    });
  };

  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const entitlementsPerPage = 10;
  const pagesVisited = pageNumber * entitlementsPerPage;
  const totalnumberofPages = 100;
  const displayEntitlementsPerPage = !underSearch
    ? newEntitlements
      .sort((a, b) => {
        if (new Date(b.create_at).getTime() < new Date(a.create_at).getTime())
          return -1;
        if (new Date(b.create_at).getTime() > new Date(a.create_at).getTime())
          return 1;
        return 0;
      })
      .slice(pagesVisited, pagesVisited + entitlementsPerPage)
      .map((item, i) => (
        <tr key={i}>
          <td>{item.entitlement_id}</td>
          <td>{item.announcement_id}</td>
          <td>
            {
              companies.find((comp) => comp.code === item.company_code)
                ?.company_name
            }
          </td>
          <td>{item.folio_number}</td>
          <td>{item.account_no}</td>
          <td>{item.bank_code}</td>
          {(crudFeatures[1] || crudFeatures[2]) && (
            <td>
              {crudFeatures[1] && (
                <>
                  <i
                    className="fa fa-eye"
                    style={{
                      width: 35,
                      fontSize: 16,
                      padding: 11,
                      color: "#4466F2",
                      cursor: "pointer",
                    }}
                    id="viewEntitlement"
                    onClick={() => {
                      // for modal
                      setViewFlag(true);

                      sessionStorage.setItem(
                        "selectedCorporateEntitlement",
                        JSON.stringify(item)
                      );
                    }}
                  ></i>
                  <UncontrolledTooltip
                    placement="top"
                    target="viewEntitlement"
                  >
                    {"View Entitlement's Detail"}
                    !!{" "}
                  </UncontrolledTooltip>
                  {item.right_shares &&
                    shareholders.find(
                      (hol) => hol.folio_number === item.folio_number
                    )?.cdc_key === "NO" && (
                      <>
                        <i
                          className="fa fa-file-pdf-o"
                          style={{
                            width: 35,
                            fontSize: 16,
                            padding: 11,
                            color: "rgb(242, 68, 164)",
                            cursor: "pointer",
                          }}
                          id="generatePDF"
                          onClick={() => {
                            const obj = JSON.parse(JSON.stringify(item));
                            const associated_entitlements =
                              newEntitlements.filter(
                                (en) =>
                                  en.announcement_id === obj.announcement_id
                              );
                            obj.total_letters =
                              associated_entitlements.length;
                            obj.allotment_number = associated_entitlements
                              .filter((en) => en.cdc_key === "NO")
                              .sort(
                                (a, b) =>
                                  a.folio_number.split("-")[
                                  a.folio_number.split("-").length - 1
                                  ] -
                                  b.folio_number.split("-")[
                                  b.folio_number.split("-").length - 1
                                  ]
                              )
                              .map((item, i) => ({
                                allotment_number: i + 2,
                                ...item,
                              }))
                              .find(
                                (item) =>
                                  item.entitlement_id === obj.entitlement_id
                              )?.allotment_number;
                            setEntitlement(obj);
                            setAnnouncement(
                              announcements.find(
                                (ann) =>
                                  ann.announcement_id === obj.announcement_id
                              )
                            );
                            setCompany(
                              companies.find(
                                (comp) => comp.code === obj.compny_code
                              )
                            );
                            setShareHolder(
                              shareholders.find(
                                (hold) =>
                                  hold.folio_number === obj.folio_number
                              )
                            );
                            setViewFlagPDF(true);
                            sessionStorage.setItem(
                              "selectedCorporateEntitlement",
                              JSON.stringify(obj)
                            );
                          }}
                        ></i>
                        <UncontrolledTooltip
                          placement="top"
                          target="generatePDF"
                        >
                          {"Generate PDF file for this record"}
                        </UncontrolledTooltip>
                      </>
                    )}
                </>
              )}
            </td>
          )}
        </tr>
      ))
    : searchedEntitlements
      .sort((a, b) => {
        if (
          new Date(b.created_at).getTime() < new Date(a.created_at).getTime()
        )
          return -1;
        if (
          new Date(b.created_at).getTime() > new Date(a.created_at).getTime()
        )
          return 1;
        return 0;
      })
      .slice(pagesVisited, pagesVisited + entitlementsPerPage)
      .map((item, i) => (
        <tr key={i}>
          <td>{item.entitlement_id}</td>
          <td>{item.announcement_id}</td>
          <td>
            {
              companies.find((comp) => comp.code === item.company_code)
                ?.company_name
            }
          </td>
          <td>{item.folio_number}</td>
          <td>{item.account_no}</td>
          <td>{item.bank_code}</td>
          {(crudFeatures[1] || crudFeatures[2]) && (
            <td>
              {crudFeatures[1] && (
                <>
                  <i
                    className="fa fa-eye"
                    style={{
                      width: 35,
                      fontSize: 16,
                      padding: 11,
                      color: "#4466F2",
                      cursor: "pointer",
                    }}
                    id="viewEntitlement"
                    onClick={() => {
                      // for modal
                      setViewFlag(true);

                      sessionStorage.setItem(
                        "selectedCorporateEntitlement",
                        JSON.stringify(item)
                      );
                    }}
                  ></i>
                  <UncontrolledTooltip
                    placement="top"
                    target="viewEntitlement"
                  >
                    {"View Entitlement's Detail"}
                  </UncontrolledTooltip>
                  {item.right_shares > 0 &&
                    shareholders.find(
                      (hol) => hol.folio_number === item.folio_number
                    )?.cdc_key === "NO" && (
                      <>
                        <i
                          className="fa fa-file-pdf-o"
                          style={{
                            width: 35,
                            fontSize: 16,
                            padding: 11,
                            color: "rgb(242, 68, 164)",
                            cursor: "pointer",
                          }}
                          id="generatePDF"
                          onClick={() => {
                            const obj = JSON.parse(JSON.stringify(item));
                            const associated_entitlements =
                              newEntitlements.filter(
                                (en) =>
                                  en.announcement_id === obj.announcement_id
                              );
                            obj.total_letters =
                              associated_entitlements.length;
                            obj.allotment_number = associated_entitlements
                              .filter((en) => en.cdc_key === "NO")
                              .sort(
                                (a, b) =>
                                  a.folio_number.split("-")[
                                  a.folio_number.split("-").length - 1
                                  ] -
                                  b.folio_number.split("-")[
                                  b.folio_number.split("-").length - 1
                                  ]
                              )
                              .map((item, i) => ({
                                allotment_number: i + 2,
                                ...item,
                              }))
                              .find(
                                (item) =>
                                  item.entitlement_id === obj.entitlement_id
                              )?.allotment_number;
                            setEntitlement(obj);
                            setAnnouncement(
                              announcements.find(
                                (ann) =>
                                  ann.announcement_id === obj.announcement_id
                              )
                            );
                            setCompany(
                              companies.find(
                                (comp) => comp.code === obj.compny_code
                              )
                            );
                            setShareHolder(
                              shareholders.find(
                                (hold) =>
                                  hold.folio_number === obj.folio_number
                              )
                            );
                            setViewFlagPDF(true);

                            sessionStorage.setItem(
                              "selectedCorporateEntitlement",
                              JSON.stringify(obj)
                            );
                          }}
                        ></i>
                        <UncontrolledTooltip
                          placement="top"
                          target="generatePDF"
                        >
                          {"Generate PDF file for this record"}
                        </UncontrolledTooltip>
                      </>
                    )}
                </>
              )}
            </td>
          )}
        </tr>
      ));
  const pageCount = !underSearch
    ? Math.ceil(newEntitlements.length / entitlementsPerPage)
    : Math.ceil(searchedEntitlements.length / entitlementsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /*  ---------------------  */
  /*  Pagination Code Ended  */
  /*  ---------------------  */
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Corporate Entitlement Listing</h6>
        <Breadcrumb title="Entitlement Listing" parent="Corporate" />
      </div>

      {/* Add Modal */}
      <Modal isOpen={viewAddPage} show={viewAddPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewAddPage(false);
          }}
        >
          Add Entitlement
        </ModalHeader>
        <ModalBody>
          <AddEntitlement setViewAddPage={setViewAddPage} />
        </ModalBody>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={viewEditPage} show={viewEditPage.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewEditPage(false);
          }}
        >
          Entitlement Edit
        </ModalHeader>
        <ModalBody>
          <EditEntitlement setViewEditPage={setViewEditPage} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Entitlement View
        </ModalHeader>
        <ModalBody>
          <ViewIndividualEntitlement />
        </ModalBody>
      </Modal>
      {/* PDF MODAL */}
      <Modal isOpen={viewFlagPDF} show={viewFlagPDF.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlagPDF(false);
          }}
        >
          PDF
        </ModalHeader>
        {viewFlagPDF && (
          <ModalBody>
            <div className="landscape-letter">
              <div
                className="p-letter"
                id={"transaction-request-1"}
                style={{ width: "auto" }}
                ref={divRef}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    rightLetterTemplateOne(entitlement, shareHolder, company)
                  ),
                }}
              ></div>
            </div>
          </ModalBody>
        )}

        <ModalFooter>
          <div className="row">
            <div className="col-md-12">
              <button
                type="button"
                className="btn btn-info mr-2"
                onClick={(e) => printRightLetter()}
                disabled={Boolean(generatePdfLoading)}
              >
                {generatePdfLoading ? (
                  <>
                    <span className="fa fa-spinner fa-spin mr-1"></span>
                    <span>{"Loading..."}</span>
                  </>
                ) : (
                  <span>{"Save As Pdf"}</span>
                )}
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  <h5></h5>

                  <div className="btn-group">
                    <Dropdown
                      button_color_class={"btn-success"}
                      header={"Generate Report"}
                      disabled={
                        entitlement_data_loading ||
                        newEntitlements.length === 0 ||
                        !selectedCompany ||
                        !selectedAnnouncement
                      }
                      list={list}
                    >
                      <i className="fa fa-file-excel-o mr-1"></i>
                    </Dropdown>

                    {crudFeatures[0] && (
                      <button
                        className="btn btn-primary btn-sm ml-3"
                        onClick={() => {
                          // for modal
                          setViewAddPage(true);
                        }}
                      >
                        <i className="fa fa-plus mr-1"></i>Add Entitlement
                      </button>
                    )}
                  </div>
                </div>
                <div className="row my-3">
                  <div className="col-md-3 col-sm-3">
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
                      styles={darkStyle}
                    />
                    {!selectedCompany && (
                      <small>
                        Select Company and Announcement to generate Report
                      </small>
                    )}
                  </div>

                  <div className="col-md-3 col-sm-3">
                    <label htmlFor="announcement">Announcement</label>
                    <Select
                      options={announcement_dropdown}
                      isLoading={announcement_data_loading}
                      isClearable={true}
                      onChange={(selected) => {
                        selected && setSelectedAnnouncement(selected.value);
                        !selected && setSelectedAnnouncement("");
                      }}
                      styles={darkStyle}
                    />
                    {!selectedAnnouncement && (
                      <small>
                        Select Company And Announcement to generate Report
                      </small>
                    )}
                  </div>

                  <div className="col-md-3 col-sm-3">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">
                        Search by Entitlement ID
                      </label>
                      <input
                        id="searchTransaction"
                        className="form-control"
                        type="text"
                        placeholder={`Enter Entitlement ID`}
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                      />
                      <UncontrolledTooltip
                        placement="top"
                        target="searchTransaction"
                      >
                        Search
                      </UncontrolledTooltip>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-3">
                    <div className="form-group">
                      <br />
                      <label>Show Physical Entitlements </label>
                      <br />
                      <ToggleButton
                        value={active}
                        thumbStyle={borderRadiusStyle}
                        trackStyle={borderRadiusStyle}
                        onToggle={() => {
                          setActive(!active);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {entitlement_data_loading === true && <Spinner />}
              {newEntitlements.length !== 0 &&
                entitlement_data_loading === false && (
                  <div className="table-responsive">
                    <table className="table  ">
                      <thead>
                        <tr>
                          <th>Entitlement Id </th>
                          <th>Annuoncement Id</th>
                          <th>Company</th>
                          <th>Folio no</th>
                          <th>Bank Code</th>
                          <th>Account no</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>{displayEntitlementsPerPage}</tbody>
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
              {entitlement_data_loading === false &&
                entitlements.length === 0 && (
                  <p className="text-center">
                    <b>Entitlements Data not available</b>
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
