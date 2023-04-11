import React, { Fragment, useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import {
  sendBulkEntitlements,
  getCorporateAnnouncementById,
  getCorporateAnnouncement,
} from "../../../../store/services/corporate.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { Home, CreditCard, Users, FilePlus } from "react-feather";
import LoadableButton from "../../../common/loadables";
import {
  announcement_id_setter,
  company_code_setter,
  folio_setter,
} from "../../../../store/services/dropdown.service";

import Select from "react-select";
import { addShareCertificateSchema } from "../../../../store/validations/shareCertificateValidation";
import { errorStyles } from "../../../defaultStyles";
import { addEntitlementSchema } from "../../../../store/validations/entitlementValidation";
import { getCompanies, getCompanyById } from "../../../../store/services/company.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import { getInvestors } from "../../../../store/services/investor.service";
import { generateLetters, generateRegex } from "utilities/utilityFunctions";
import Spinner from "components/common/spinner";
import CountUp from "react-countup";

export default function CalculateEntitlement({ setViewAddPage }) {
  const baseEmail = sessionStorage.getItem("email") || "";
  // Validation Declarations
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm({ resolver: yupResolver(addEntitlementSchema) });

  // options
  const [announcement_id_options, setAnnoucement_id_options] = useState([]);
  const [shareHoldings, setShareHoldings] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState({});
  const [company, setCompany] = useState({});
  const [company_code_options, setCompany_code_options] = useState([]);
  const [displayFolios, setDisplayFolios] = useState(false);
  const [dividendPercent, setDividendPercent] = useState("");
  const [underSearch, setUnderSearch] = useState(false);
  const [searchShareHoldings, setSearchShareHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [announcement, setAnnouncement] = useState([]);
  const [criteria, setCriteria] = useState('');
  const [search, setSearch] = useState('');
  let allotment_number = 1;
  let electronicCatcher = 0;
  let physicalCatcher = 0;
  let electronicBonusCatcher = 0;
  let electronicRightsCatcher = 0;
  let total_bonus_shares = 0;
  let total_right_shares = 0;
  let total_gross_dividend = 0;
  let total_net_dividend = 0;
  // let [total_bonus_shares, setTotalBonus] = useState(0);
  // let [total_right_shares, setTotalRights] = useState(0);
  // let [total_gross_dividend, setTotalGrossDividend] = useState(0);
  // let [total_net_dividend, setTotalNetDividend] = useState(0);
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
          //       folio.folio_number !== selectedCompany + "-0"
          //   )
          //   // .map((sh) => ({...sh, folio_number: sh.folio_number.replace(`${selectedCompany}-`,'')}))
          //   .sort((a, b) => a.folio_number.replace(`${selectedCompany}-`,'').replace('-','') - b.folio_number.replace(`${selectedCompany}-`,'').replace('-',''))
          // );
          let cdcHolding = response.data.data.filter((folio) =>
            folio.folio_number == selectedCompany + "-0")
          setShareHoldings(
            [...physicalHolding, ...electronicHolding, ...cdcHolding]
          );
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
      getAllInvestors();
    }
  }, [selectedCompany]);
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
  const getHoldings = (holdings, allotment_number) =>
    holdings
      .filter(
        (holding) =>
          holding.physical_shares > 0 || holding.electronic_shares > 0 || holding.folio_number == selectedCompany + "-0"
      )
      .map((holding, i) => {
        let electronic_shares = !!holding?.electronic_shares
          ? holding?.electronic_shares
          : "0";
        let physical_shares = !!holding?.physical_shares
          ? holding?.physical_shares
          : "0";
        let total_holding = (
          parseInt(electronic_shares) + parseInt(physical_shares)
        ).toString();
        let filer = holding.filer === "Y" ? "Y" : "N";
        let roshan_account = holding.roshan_account === "Y" ? "Y" : "N";
        let zakat_status = holding?.zakat_status === "Y" ? "Y" : "N";
        let gross_div = watch("dividend_percentage")
          ? (total_holding *
            watch("face_value") *
            watch("dividend_percentage")) /
          100
          : 0;
        let tax_rate =
          filer === "Y"
            ? `${watch("filer_tax")}%`
            : `${watch("non_filer_tax")}%`;
        let filer_tax = parseInt(watch("filer_tax") || "0") / 100;
        let non_filer_tax = parseInt(watch("non_filer_tax") || "0") / 100;
        let tax_exempted =
          filer === "Y" ? gross_div * filer_tax : gross_div * non_filer_tax;
        let zakat =
          zakat_status === "Y"
            ? (total_holding * parseInt(watch("face_value") || "0")) / 40
            : 0;
        let bonus_shares =
          (total_holding * parseInt(watch("bonus_percentage") || "0")) / 100;
        let b_fraction = "0." + (bonus_shares.toString().split(".")[1] || 0);
        let right_shares =
          (total_holding * parseInt(watch("right_percentage") || "0")) / 100;
        let r_fraction = "0." + (right_shares.toString().split(".")[1] || 0);
        let net_dividend = gross_div ? gross_div - tax_exempted - zakat : 0;

        let account_title = holding?.account_title;
        let account_no = investors.find(
          (inv) => inv.cnic === holding.shareholder_cnic
        )?.account_no;
        let bank = holding?.bank_name;
        let branch = holding?.baranch_address + " - " + holding?.baranch_city;
        let allotment_letters = !!(parseInt(watch("right_rate") || '0'))
          ? holding.cdc_key === "NO"
            ? generateLetters(
              parseInt(company.allot_size),
              parseInt(right_shares && right_shares.toString().split(".")[0]),
              parseInt(allotment_number)
            )
            : []
          : [];
        allotment_number += allotment_letters.length;
        total_bonus_shares += parseFloat(bonus_shares || '0');
        total_right_shares += parseFloat(right_shares || '0');
        total_gross_dividend += parseFloat(gross_div || '0');
        total_net_dividend += parseFloat(net_dividend || '0');

        // setTotalBonus(total_bonus_shares);
        // setTotalGrossDividend(total_gross_dividend);
        // setTotalNetDividend(total_net_dividend);
        // setTotalRights(total_right_shares);

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
          account_title: account_title,
          account_no: account_no,
          bank: bank,
          branch: branch,
          b_fraction: b_fraction,
          r_fraction: r_fraction,
          shareholder_id: holding.shareholder_id,
          allotment_letters,
        };
      });


  /*  ---------------------  */
  /*  Pagination Code Start  */
  /*  ---------------------  */
  const [pageNumber, setPageNumber] = useState(0);
  const calCulateEntitlementPerPage = 10;
  const pagesVisited = pageNumber * calCulateEntitlementPerPage;
  const totalnumberofPages = 100;
  const displayCalCulateEntitlementPerPage = underSearch === false ?
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
          <tr>
            <td>{i + 1}</td>
            <td>{holding.folio_number}</td>
            <td>{holding.shareholder_name}</td>
            <td>{holding.filer}</td>
            <td className="text-right">
              {Math.trunc(holding.total_holding)}
            </td>
            <td className="text-right">
              {Math.trunc(holding.gross_dividend)}
            </td>
            <td className="text-right">
              {holding.tax_percentage}{" "}
            </td>
            <td className="text-right">
              {Math.trunc(holding.tax)}
            </td>
            <td className="text-right">
              {parseFloat(holding.zakat)?.toFixed("2")}
            </td>
            <td className="text-right">
              {Math.trunc(holding.net_dividend)}
            </td>
            <td className="text-right">
              {Math.trunc(holding.bonus_shares)}
            </td>
            <td className="text-right">{holding.b_fraction}</td>
            <td className="text-right">
              {Math.trunc(holding.right_shares)}
            </td>
            <td className="text-right">{holding.r_fraction}</td>
            <td>{holding.account_title}</td>
            <td>{holding.account_no}</td>
            <td>{holding.bank}</td>
            <td>{holding.branch}</td>
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
            <tr>
              <td>{i + 1}</td>
              <td>{holding.folio_number}</td>
              <td>{holding.shareholder_name}</td>
              <td>{holding.filer}</td>
              <td className="text-right">
                {Math.trunc(holding.total_holding)}
              </td>
              <td className="text-right">
                {Math.trunc(holding.gross_dividend)}
              </td>
              <td className="text-right">
                {holding.tax_percentage}{" "}
              </td>
              <td className="text-right">
                {Math.trunc(holding.tax)}
              </td>
              <td className="text-right">
                {parseFloat(holding.zakat)?.toFixed("2")}
              </td>
              <td className="text-right">
                {Math.trunc(holding.net_dividend)}
              </td>
              <td className="text-right">
                {Math.trunc(holding.bonus_shares)}
              </td>
              <td className="text-right">{holding.b_fraction}</td>
              <td className="text-right">
                {Math.trunc(holding.right_shares)}
              </td>
              <td className="text-right">{holding.r_fraction}</td>
              <td>{holding.account_title}</td>
              <td>{holding.account_no}</td>
              <td>{holding.bank}</td>
              <td>{holding.branch}</td>
            </tr>
          )
        )

  const pageCount = underSearch === false
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
    total_bonus_shares = 0;
    total_right_shares = 0;
    total_gross_dividend = 0;
    total_net_dividend = 0;
    !!e && setSearch(e.target.value);
    if (e.target.value !== '') {
      setUnderSearch(true)
    } else {
      setUnderSearch(false)
    }
    !!e && setUnderSearch(e.target.value);
    if (e?.target?.value?.length > 0) {
      if (val === 'folio') {
        let searchByFolio = shareHoldings.filter((item => {
          return item.folio_number.match(generateRegex(e.target.value));
        }))
        setSearchShareHoldings(searchByFolio)

      } else {
        let searchByName = shareHoldings.filter((item => {
          return item.shareholder_name.match(generateRegex(e.target.value));
        }))
        setSearchShareHoldings(searchByName)
      }
    }

    if (!e?.target?.value) {
      setSearchShareHoldings(shareHoldings)
    }

  }

  const handleAddEntitlement = async (data) => {
    const email = sessionStorage.getItem("email");
    // if(new_holdings.length==0){
    //   return toast.error('Holding is empty');
    // }
    const new_holdings = getHoldings(shareHoldings, allotment_number).map(
      (h) => ({
        ...h,
        s_no: h.s_no.toString(),
        gross_dividend: h.gross_dividend.toString(),
        tax: h.tax.toString(),
        account_no: h?.account_no || "",
        dividend_amount: Math.trunc(h.net_dividend).toString(),
        zakat: h.zakat.toString(),
        bonus_shares: Math.trunc(h.bonus_shares).toString(),
        right_shares: Math.trunc(h.right_shares).toString(),
        company_code: selectedCompany,
      })
    );

    try {
      // const entitlements = shareHoldings.map((holding) => ({ ...holding }));
      setLoading(true);

      const response = await sendBulkEntitlements(
        email,
        data.announcement_id?.value,
        new_holdings
      );

      if (response.data.status === 200) {
        setLoading(false);
        toast.success(`${response.data.message}`);
        setViewAddPage(false);
      } else {
        setLoading(false);
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error(`${error.response.data.message}`);
    }
  };
  useEffect(() => {
    if (Object.keys(company).length > 0) {
      setValue("face_value", company?.face_value);
      setValue("dividend_percentage", '');
      setValue("bonus_percentage", '');
      setValue("right_percentage", '');
      setValue("right_rate", '');
      setValue("filer_tax", "15");
      setValue("non_filer_tax", "30");
    }
  }, [company]);
  return (
    <div>
      <Fragment>
        <form onSubmit={handleAddEntitlement}>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 ">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Entitlement</h5>
                </div>
                <div className="card-body">
                  {/* Dividend Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
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
                        {!selectedCompany && (
                          <small>
                            Select Company to show transactions
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Face Value </label>
                        <Controller
                          name="face_value"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${errors.face_value && "border border-danger"
                                }`}
                              id="face_value"
                              decimalScale={2}
                              placeholder="Enter Face Number"
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.face_value?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Dividend Percentage</label>
                        <div className="input-group mb-3">
                          <Controller
                            name="dividend_percentage"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className="form-control text-right"
                                id="dividend_percentage"
                                // value={selectedAnnouncement.dividend_percent}
                                placeholder="Enter Dividend Percentage"
                              />
                            )}
                            control={control}
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

                        <small className="text-danger">
                          {errors.dividend_percentage?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Bonus Percentage</label>
                        <div className="input-group mb-3">
                          <Controller
                            name="bonus_percentage"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className="form-control text-right"
                                id="bonus_percentage"
                                // value={selectedAnnouncement.bonus_percent}
                                placeholder="Enter Bonus Percentage"
                              />
                            )}
                            control={control}
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

                        <small className="text-danger">
                          {errors.bonus_percentage?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  {/* Bonus Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Right Percentage</label>
                        <div className="input-group mb-3">
                          <Controller
                            name="right_percentage"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className="form-control text-right"
                                id="right_percentage"
                                // value={selectedAnnouncement.right_percent}
                                placeholder="Enter Right Percentage"
                              />
                            )}
                            control={control}
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

                        <small className="text-danger">
                          {errors.right_percentage?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Filer Tax</label>
                        <div className="input-group mb-3">
                          <Controller
                            name="filer_tax"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className={`form-control ${errors.filer_tax && "border border-danger"
                                  }`}
                                id="filer_tax"
                                allowNegative={false}
                                placeholder="Enter Tax Rate"
                              />
                            )}
                            control={control}
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
                        <small className="text-danger">
                          {errors.filer_tax?.message}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* TAX RATE */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Non Filer Tax</label>
                        <div className="input-group mb-3">
                          <Controller
                            name="non_filer_tax"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className={`form-control ${errors.non_filer_tax && "border border-danger"
                                  }`}
                                id="non_filer_tax"
                                allowNegative={false}
                                placeholder="Non Filer Tax"
                              />
                            )}
                            control={control}
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
                        <small className="text-danger">
                          {errors.non_filer_tax?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label htmlFor="right_rate">Right Rate</label>
                        <Controller
                          name="right_rate"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${errors.right_rate && "border border-danger"
                                }`}
                              id="right_rate"
                              allowNegative={false}
                              placeholder="Right Rate"
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.right_rate?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Face Value </label>
                        <Controller
                          name="face_value"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${errors.face_value && "border border-danger"
                                }`}
                              id="face_value"
                              decimalScale={2}
                              placeholder="Enter Face Number"
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.face_value?.message}
                        </small>
                      </div>
                    </div>
                  </div> */}

                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Announcement</h5>
                </div>
                <div className="card-body">
                  <div className="form-group">
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
                    {!selectedCompany && (
                      <small>
                        Select Company to show transactions
                      </small>
                    )}
                  </div>
                  <div className="form-group my-2">
                    <label>Company </label>
                    <input
                      type="text"
                      className={`form-control ${errors.company_code && "border border-danger"
                        }`}
                      {...register("company_code")}
                      placeholder="Select Announcement"
                      value={company !== null && company?.company_name}
                      readOnly
                    />
                    <small className="text-danger">
                      {errors.company_code?.message}
                    </small>
                  </div>

                  <div className="form-group my-2">
                    <label>Financial Period </label>
                    <input
                      type="text"
                      className="form-control"
                      name="financial_period"
                      placeholder="Select Announcement"
                      value={selectedAnnouncement?.period}
                      id="financial_period"
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Face Value </label>
                    <Controller
                      name="face_value"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${errors.face_value && "border border-danger"
                            }`}
                          id="face_value"
                          decimalScale={2}
                          placeholder="Enter Face Number"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.face_value?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div> */}
          {/* <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Entitlement</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                  
                    <div className="col-md-12">
                      <div className="form-group my-2">
                        <label>Dividend Percentage</label>
                        <div className="input-group mb-3">
                          <Controller
                            name="dividend_percentage"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className="form-control text-right"
                                id="dividend_percentage"
                                // value={selectedAnnouncement.dividend_percent}
                                placeholder="Enter Dividend Percentage"
                              />
                            )}
                            control={control}
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

                        <small className="text-danger">
                          {errors.dividend_percentage?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group my-2">
                        <label>Bonus Percentage</label>
                        <div className="input-group mb-3">
                          <Controller
                            name="bonus_percentage"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className="form-control text-right"
                                id="bonus_percentage"
                                // value={selectedAnnouncement.bonus_percent}
                                placeholder="Enter Bonus Percentage"
                              />
                            )}
                            control={control}
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

                        <small className="text-danger">
                          {errors.bonus_percentage?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group my-2">
                        <label>Right Percentage</label>
                        <div className="input-group mb-3">
                          <Controller
                            name="right_percentage"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className="form-control text-right"
                                id="right_percentage"
                                // value={selectedAnnouncement.right_percent}
                                placeholder="Enter Right Percentage"
                              />
                            )}
                            control={control}
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

                        <small className="text-danger">
                          {errors.right_percentage?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Filer Tax</label>
                        <div className="input-group mb-3">
                          <Controller
                            name="filer_tax"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className={`form-control ${errors.filer_tax && "border border-danger"
                                  }`}
                                id="filer_tax"
                                allowNegative={false}
                                placeholder="Enter Tax Rate"
                              />
                            )}
                            control={control}
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
                        <small className="text-danger">
                          {errors.filer_tax?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Non Filer Tax</label>
                        <div className="input-group mb-3">
                          <Controller
                            name="non_filer_tax"
                            render={({ field }) => (
                              <NumberFormat
                                {...field}
                                className={`form-control ${errors.non_filer_tax && "border border-danger"
                                  }`}
                                id="non_filer_tax"
                                allowNegative={false}
                                placeholder="Non Filer Tax"
                              />
                            )}
                            control={control}
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
                        <small className="text-danger">
                          {errors.non_filer_tax?.message}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="right_rate">Right Rate</label>
                    <Controller
                      name="right_rate"
                      render={({ field }) => (
                        <NumberFormat
                          {...field}
                          className={`form-control ${errors.right_rate && "border border-danger"
                            }`}
                          id="right_rate"
                          allowNegative={false}
                          placeholder="Right Rate"
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.right_rate?.message}
                    </small>
                  </div>
                </div>
              </div>
            </div> */}
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
                  <option value="">Select Criteria</option>
                  <option value="folioNumber">Folio Number</option>
                  <option value="name">Name</option>
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
                        : `Search by Folio Number`
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

          {(selectedCompany !== '' && shareHoldings.length === 0) && <Spinner />}
          {
            (shareHoldings.length > 0 || searchShareHoldings.length > 0) && (
              <>{
                (parseInt(total_right_shares || '0') > 0 || parseInt(total_bonus_shares || '0') > 0 || ((parseInt(total_right_shares || '0').toFixed(2) * parseInt(watch("right_rate") || '0')) / 2) > 0) && (
                  <div className="container-fluid">
                    <div className="row">

                      {(parseInt(total_right_shares || '0') > 0) && (<>
                        <div className="col-xm-6 col-sm-6 col-md-6 col-lg-4">
                          <div className="card">
                            <div className="bg-secondary card-body">
                              <div className="media feather-main">
                                <div className="media-body align-self-center">
                                  <h6>Total Right Shares</h6>
                                  {(parseFloat(total_right_shares || '0') / 2).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>)}

                      {(parseInt(total_bonus_shares || '0') > 0) && (<>
                        <div className="col-xm-6 col-sm-6 col-md-6 col-lg-4">
                          <div className="card">
                            <div className="bg-secondary card-body">
                              <div className="media feather-main">
                                <div className="media-body align-self-center">
                                  <h6 className="text-nowrap">Total Bonus Shares</h6>
                                  {(parseFloat(total_bonus_shares || '0') / 2).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>)}

                      {(((parseInt(total_right_shares || '0').toFixed(2) * parseInt(watch("right_rate") || '0')) / 2).toFixed(2) > 0.00) && (
                        <div className="col-xm-6 col-sm-6 col-md-6 col-lg-4">
                          <div className="card">
                            <div className="bg-secondary card-body">
                              <div className="media feather-main">
                                <div className="media-body align-self-center">
                                  <h6 className="text-nowrap">Total Right Rate</h6>
                                  {((parseFloat(total_right_shares || '0').toFixed(2) * parseInt(watch("right_rate") || '0')) / 2).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* {(((parseInt(total_right_shares || '0').toFixed(2) * parseInt(watch("right_rate") || '0')) / 2) > 0) && (<><div className="col-md-3"><b>Total Right Rate</b></div><div className="col-md-2">{((parseFloat(total_right_shares || '0').toFixed(2) * parseInt(watch("right_rate") || '0')) / 2).toFixed(2)}</div></>)} */}

                    </div>
                  </div>
                )}



                {(parseInt(total_gross_dividend || '0') > 0 || parseInt(total_net_dividend || '0') > 0) && (
                  <div className="container-fluid">
                    <div className="row">

                      {(parseInt(total_gross_dividend || '0') > 0) && (
                        <div className="col-xm-6 col-sm-6 col-md-6 col-lg-4">
                          <div className="card">
                            <div className="bg-secondary card-body">
                              <div className="media feather-main">
                                <div className="media-body align-self-center">
                                  <h6 className="text-nowrap">Total Gross Dividend</h6>
                                  {(parseFloat(total_gross_dividend || '0') / 2).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {(parseInt(total_net_dividend || '0') > 0) && (
                        <div className="col-xm-6 col-sm-6 col-md-6 col-lg-4">
                          <div className="card">
                            <div className="bg-secondary card-body">
                              <div className="media feather-main">
                                <div className="media-body align-self-center">
                                  <h6 className="text-nowrap">Total Net Dividend</h6>
                                  {parseFloat(total_net_dividend || '0').toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </>
            )
          }
          <div className="row">
            <div className="col-md-12">
              {
                Object.keys(company).length !== 0 &&
                shareHoldings.length !== 0 && (
                  <table className="table table-responsive">
                    <thead>
                      <tr>
                        <th>S No.</th>
                        <th>Folio</th>
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
                        <th>Account Title</th>
                        <th>Account No</th>
                        <th>Bank</th>
                        <th>Branch</th>
                      </tr>
                    </thead>
                    <tbody>{displayCalCulateEntitlementPerPage} </tbody>
                  </table>
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
          {/* <div className="row my-2">
            <div className="col-md-12">
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
          </div> */}
        </form>
      </Fragment>
    </div >
  );
}

