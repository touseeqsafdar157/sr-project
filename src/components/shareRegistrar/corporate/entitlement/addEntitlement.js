import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  WATCH_INVESTORS_REQUEST,
  WATCH_TRANSACTION_REQUEST,
  WATCH_ENTITLEMENTS_DROPDOWN,
  WATCH_ENTITLEMENTS,
} from "../../../../redux/actionTypes";
import { useDispatch } from "react-redux";
import Breadcrumb from "../../../common/breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import {
  sendBulkEntitlements,
  getCorporateAnnouncementById,
  getCorporateAnnouncement,
} from "../../../../store/services/corporate.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
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
import { getCompanyById } from "../../../../store/services/company.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import { getInvestors } from "../../../../store/services/investor.service";
import { generateLetters } from "utilities/utilityFunctions";

export default function AddEntitlement({ setViewAddPage }) {
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
  const [bonusPercent, setBonusPercent] = useState("");
  const [rightPercent, setRightPercent] = useState("");
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState([]);
  let allotment_number = 1;
  let electronicCatcher =0;
  let physicalCatcher = 0;
  let electronicBonusCatcher = 0;
  let electronicRightsCatcher = 0;
  useEffect(() => {
    const getAllCorporateAnnouncement = async () => {
      try {
        const response = await getCorporateAnnouncement(baseEmail);
        if (response.status === 200) {
          setAnnouncement(response.data.data);
        }
      } catch (error) {}
    };
    getAllCorporateAnnouncement();
  }, []);

  useEffect(() => {
    const getAnnouncement = async () => {
      try {
        const response = await getCorporateAnnouncementById(
          baseEmail,
          watch("announcement_id")?.value
        );
        if (response.status === 200) {
          setSelectedAnnouncement(response.data.data);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Announcement Not Found");
      }
    };
    if (!!watch("announcement_id")?.value) {
      getAnnouncement();
    }
  }, [watch("announcement_id")]);

  useEffect(() => {
    const getCompany = async () => {
      try {
        const response = await getCompanyById(
          baseEmail,
          selectedAnnouncement?.company_code
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
    if (!!selectedAnnouncement?.company_code) {
      getCompany();
    }
  }, [selectedAnnouncement]);

  useEffect(() => {
    const getShareHolders = async () => {
      try {
        const response = await getShareHoldersByCompany(
          baseEmail,
          selectedAnnouncement?.company_code,
          "/active"
        );

        console.log("Shareholder Response => ", response);
        if (response.status === 200) {
          let physicalHolding = response.data.data.filter(
            (folio) =>
              folio.cdc_key == "NO" && folio.folio_number !== selectedAnnouncement?.company_code + "-0"
          ).sort((a, b) => a.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'').replace('-','') - b.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'').replace('-',''))

          let electronicHolding = response.data.data.filter(
            (folio) =>
              folio.cdc_key == "YES" && folio.folio_number !== selectedAnnouncement?.company_code + "-0"
          ).sort((a, b) => a.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'').replace('-','') - b.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'').replace('-',''))
          //
          // setShareHoldings(
          //   response.data.data.filter(
          //     (folio) =>
          //       folio.folio_number !== selectedAnnouncement?.company_code + "-0"
          //   )
          //   // .map((sh) => ({...sh, folio_number: sh.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'')}))
          //   .sort((a, b) => a.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'').replace('-','') - b.folio_number.replace(`${selectedAnnouncement?.company_code}-`,'').replace('-',''))
          // );
          let cdcHolding = response.data.data.filter((folio) =>
          folio.folio_number == selectedAnnouncement?.company_code + "-0" )
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
    if (!!company?.code) {
      getShareHolders();
      getAllInvestors();
    }
  }, [company]);
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
          holding.physical_shares > 0 || holding.electronic_shares > 0 || holding.folio_number == selectedAnnouncement?.company_code + "-0"  
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
        let gross_div = selectedAnnouncement.dividend_percent
          ? (total_holding *
              watch("face_value") *
              selectedAnnouncement.dividend_percent) /
            100
          : 0;
        let tax_rate =
          filer === "Y"
            ? `${watch("filer_tax")}%`
            : `${watch("non_filer_tax")}%`;
        let filer_tax = watch("filer_tax") / 100;
        let non_filer_tax = watch("non_filer_tax") / 100;
        let tax_exempted =
          filer === "Y" ? gross_div * filer_tax : gross_div * non_filer_tax;
        let zakat =
          zakat_status === "Y"
            ? (total_holding * parseInt(watch("face_value") || "0")) / 40
            : 0;
        let bonus_shares =
          (total_holding * selectedAnnouncement.bonus_percent) / 100;
        let b_fraction = "0." + (bonus_shares.toString().split(".")[1] || 0);
        let right_shares =
          (total_holding * selectedAnnouncement.right_percent) / 100;
        let r_fraction = "0." + (right_shares.toString().split(".")[1] || 0);
        let net_dividend = gross_div ? gross_div - tax_exempted - zakat : 0;

        let account_title = holding?.account_title;
        let account_no = investors.find(
          (inv) => inv.cnic === holding.shareholder_cnic
        )?.account_no;
        let bank = holding?.bank_name;
        let branch = holding?.baranch_address + " - " + holding?.baranch_city;

        let allotment_letters = !!selectedAnnouncement.right_rate
          ? holding.cdc_key === "NO"
            ? generateLetters(
                parseInt(company.allot_size),
                parseInt(right_shares.toString().split(".")[0]),
                allotment_number
              )
            : []
          : [];
        allotment_number += allotment_letters.length;
        // electronicCatcher = holding.cdc_key == "YES" &&  holding.folio_number !== selectedAnnouncement?.company_code + "-0" ? electronicCatcher + parseInt(holding.electronic_shares) : electronicCatcher + 0;  
        // physicalCatcher = holding.cdc_key == "NO" &&  holding.folio_number !== selectedAnnouncement?.company_code + "-0" ? physicalCatcher + parseInt(holding.physical_shares) : physicalCatcher + 0;
        // electronicBonusCatcher = holding.cdc_key == "YES" &&  holding.folio_number !== selectedAnnouncement?.company_code + "-0" ? electronicBonusCatcher + bonus_shares : electronicBonusCatcher + 0;
        // electronicRightsCatcher = holding.cdc_key == "YES" &&  holding.folio_number !== selectedAnnouncement?.company_code + "-0" ? electronicRightsCatcher + bonus_shares : electronicRightsCatcher + 0;
        // electronic_shares = holding.folio_number == selectedAnnouncement?.company_code + "-0" ? electronicCatcher : electronic_shares;
        // physical_shares = holding.folio_number == selectedAnnouncement?.company_code + "-0" ? physicalCatcher : physical_shares;
        // bonus_shares = holding.folio_number == selectedAnnouncement?.company_code + "-0" ? Math.floor(electronicBonusCatcher) : bonus_shares;
        // right_shares = holding.folio_number == selectedAnnouncement?.company_code + "-0" ? Math.floor(electronicRightsCatcher) : right_shares;
        // b_fraction =holding.folio_number == selectedAnnouncement?.company_code + "-0" ? "0.0" : b_fraction;
        // r_fraction =holding.folio_number == selectedAnnouncement?.company_code + "-0" ? "0.0" : r_fraction;
        // console.log("Electronic Bonus Catcher  for CDC => ", electronicBonusCatcher)

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
        company_code: selectedAnnouncement.company_code,
      })
    );

    // console.log("New Holdings => ", new_holdings);

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
      setValue("filer_tax", "15");
      setValue("non_filer_tax", "30");
    }
  }, [company]);
  return (
    <div>
      <Fragment>
        <form onSubmit={handleSubmit(handleAddEntitlement)}>
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>Announcement</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Announcement ID </label>
                    <Controller
                      name="announcement_id"
                      render={({ field }) => (
                        <Select
                          {...field}
                          isLoading={announcement_id_options.length === 0}
                          options={announcement_id_options}
                          id="announcement_id"
                          placeholder="Select Announcement"
                          styles={errors.announcement_id && errorStyles}
                        />
                      )}
                      control={control}
                    />
                    <small className="text-danger">
                      {errors.announcement_id?.message}
                    </small>
                  </div>
                  <div className="form-group my-2">
                    <label>Company </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.company_code && "border border-danger"
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
                          className={`form-control ${
                            errors.face_value && "border border-danger"
                          }`}
                          id="face_value"
                          decimalScale={2}
                          placeholder="Enter Number"
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
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6 ">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>Cash Dividend</h5>
                </div>
                <div className="card-body">
                  {/* Dividend Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Dividend Issue Number </label>
                        <Controller
                          name="dividend_issue_number"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${
                                errors.dividend_issue_number &&
                                "border border-danger"
                              }`}
                              id="dividend_issue_number"
                              allowNegative={false}
                              placeholder="Enter Number"
                              value={selectedAnnouncement.dividend_number}
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.dividend_issue_number?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Dividend Percentage</label>
                        <div className="input-group mb-3">
                          <NumberFormat
                            className="form-control text-right"
                            id="dividend_percentage"
                            value={selectedAnnouncement.dividend_percent}
                            placeholder="Enter Number"
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
                  {/* Bonus Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Bonus Number </label>
                        <Controller
                          name="bonus_number"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${
                                errors.bonus_number && "border border-danger"
                              }`}
                              id="bonus_number"
                              allowNegative={false}
                              placeholder="Enter Number"
                              value={selectedAnnouncement.bonus_number}
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.bonus_number?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Bonus Percentage</label>
                        <div className="input-group mb-3">
                          <NumberFormat
                            className="form-control text-right"
                            id="dividend_percentage"
                            value={selectedAnnouncement.bonus_percent}
                            placeholder="Enter Number"
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

                  {/* Right Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Right Number </label>
                        <Controller
                          name="right_number"
                          render={({ field }) => (
                            <NumberFormat
                              {...field}
                              className={`form-control ${
                                errors.right_number && "border border-danger"
                              }`}
                              id="right_number"
                              allowNegative={false}
                              placeholder="Enter Number"
                              value={selectedAnnouncement.right_number}
                            />
                          )}
                          control={control}
                        />
                        <small className="text-danger">
                          {errors.right_number?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Right Percentage</label>
                        <div className="input-group mb-3">
                          <NumberFormat
                            className="form-control text-right"
                            id="dividend_percentage"
                            value={selectedAnnouncement.right_percent}
                            placeholder="Enter Number"
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
                  {/* TAX RATE */}
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
                                className={`form-control ${
                                  errors.filer_tax && "border border-danger"
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
                                className={`form-control ${
                                  errors.non_filer_tax && "border border-danger"
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
                    <input
                      type="text"
                      className="form-control"
                      name="right_rate"
                      id="right_rate"
                      placeholder="Right Rate"
                      value={selectedAnnouncement?.right_rate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
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
                <tbody>
                  {Object.keys(company).length !== 0 &&
                    shareHoldings.length !== 0 &&
                    getHoldings(shareHoldings, allotment_number).map(
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
                    )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row my-2">
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
          </div>
        </form>
      </Fragment>
    </div>
  );
}
