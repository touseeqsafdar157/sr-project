import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  sendBulkEntitlements,
  getCorporateAnnouncementById,
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
import { disabledStyles, errorStyles } from "../../../defaultStyles";
import {
  addEntitlementSchema,
  editEntitlementSchema,
} from "../../../../store/validations/entitlementValidation";
import { getCompanyById } from "../../../../store/services/company.service";
import { getShareHoldersByCompany } from "../../../../store/services/shareholder.service";
import { getInvestors } from "../../../../store/services/investor.service";
import { numberWithCommas } from "utilities/utilityFunctions";

export default function AddEntitlement() {
  const entitlement =
    JSON.parse(sessionStorage.getItem("selectedCorporateEntitlement")) || "";
  const baseEmail = sessionStorage.getItem("email") || "";
  // Announcements
  const { announcement_data, announcement_data_loading } = useSelector(
    (data) => data.Announcements
  );
  const { companies_data, companies_data_loading } = useSelector(
    (data) => data.Companies
  );
  // Validation Declarations
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    getValues,
  } = useForm({
    defaultValues: editEntitlementSchema(entitlement).cast(),
    resolver: yupResolver(editEntitlementSchema(entitlement)),
  });

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

  useEffect(() => {
    const getAnnouncement = () => {
      setSelectedAnnouncement(
        announcement_data.find(
          (item) => item.announcement_id === watch("announcement_id")?.value
        )
      );
    };
    if (!!watch("announcement_id")?.value) {
      getAnnouncement();
    }
  }, [watch("announcement_id")]);

  useEffect(() => {
    const getCompany = () => {
      setCompany(
        companies_data.find(
          (item) => item.code === selectedAnnouncement?.company_code
        )
      );
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
          selectedAnnouncement?.company_code
        );
        if (response.status === 200) {
          setShareHoldings(response.data.data);
        }
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error(error?.message);
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
        setAnnoucement_id_options(await announcement_id_setter());
        setCompany_code_options(await company_code_setter());
      } catch (error) {
        !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Announcements Not Found");
      }
    };
    getAnnouncementOptions();
  }, []);

  const handleAddEntitlement = async (data) => {
    const email = sessionStorage.getItem("email");
    try {
      // const entitlements = shareHoldings.map((holding) => ({ ...holding }));
      setLoading(true);
      const holdings = shareHoldings.map((holding, i) => {
        const electronic_shares = holding?.electronic_shares || "0";
        const physical_shares = holding?.physical_shares || "0";
        const total_holding =
          parseInt(electronic_shares) + parseInt(physical_shares);
        const filer = holding?.filer === "Y" ? "Y" : "N";
        const zakat_status = holding?.zakat_status === "Y" ? "Y" : "N";
        const gross_div =
          (total_holding *
            company.face_value *
            selectedAnnouncement.dividend_number) /
          100;
        const tax_rate = filer === "Y" ? "15%" : "30%";
        const tax_exempted =
          filer === "Y"
            ? gross_div - gross_div * 0.15
            : gross_div - gross_div * 0.3;
        const zakat = zakat_status === "Y" ? gross_div / 40 : gross_div;
        const bonus_shares =
          (total_holding * selectedAnnouncement.bonus_number) / 100;
        const right_shares =
          (total_holding * selectedAnnouncement.right_number) / 100;
        const account_title = holding?.account_title;
        const account_no = holding?.account_no;
        const bank = holding?.bank_name;
        const branch = holding?.baranch_address + " - " + holding?.baranch_city;

        return {
          s_no: (i + 1).toString(),
          folio_number: holding.folio_number,
          shareholder_name: holding.shareholder_name,
          filer: filer,
          share_holding: total_holding,
          dividend_credited: gross_div.toString(),
          tax_rate: tax_rate,
          tax: tax_exempted.toString(),
          dividend_amount: (gross_div - tax_exempted).toString(),
          zakat: zakat.toString(),
          bonus_shares: bonus_shares.toString(),
          right_shares: right_shares.toString(),
          account_title: account_title,
          account_no: account_no,
          bank_code: bank,
          branch: branch,
        };
      });
      const response = await sendBulkEntitlements(
        email,
        data.announcement_id.value,
        holdings
      );

      if (response.data.status === 200) {
        setLoading(false);
        toast.success(`${response.data.message}`);
      } else {
        setLoading(false);
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error(`${error.response.data.message}`);
    }
  };

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
                          styles={disabledStyles}
                          isDisabled={true}
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
                          value={company.face_value}
                          placeholder="Enter Number"
                          readOnly
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
                              className={`form-control text-right ${
                                errors.dividend_issue_number &&
                                "border border-danger"
                              }`}
                              id="dividend_issue_number"
                              allowNegative={false}
                              thousandSeparator={true}
                              placeholder="Enter Number"
                              value={selectedAnnouncement.dividend_number}
                              readOnly
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
                            thousandSeparator={true}
                            placeholder="Enter Number"
                            readOnly
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
                              className={`form-control text-right ${
                                errors.bonus_number && "border border-danger"
                              }`}
                              id="bonus_number"
                              allowNegative={false}
                              thousandSeparator={true}
                              placeholder="Enter Number"
                              value={selectedAnnouncement.bonus_number}
                              readOnly
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
                            thousandSeparator={true}
                            placeholder="Enter Number"
                            readOnly
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
                              className={`form-control text-right ${
                                errors.right_number && "border border-danger"
                              }`}
                              id="right_number"
                              allowNegative={false}
                              thousandSeparator={true}
                              placeholder="Enter Number"
                              value={selectedAnnouncement.right_number}
                              readOnly
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
                            thousandSeparator={true}
                            value={selectedAnnouncement.right_percent}
                            placeholder="Enter Number"
                            readOnly
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
                  <div className="form-group my-2">
                    <label htmlFor="right_rate">Right Rate</label>
                    <input
                      type="text"
                      className="form-control text-right"
                      name="right_rate"
                      id="right_rate"
                      placeholder="Right Rate"
                      value={numberWithCommas(selectedAnnouncement?.right_rate)}
                      readOnly
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
                    <th className="text-right">JH Tax</th>
                    <th className="text-right">Zakat</th>
                    <th className="text-right">Net Divident</th>
                    <th className="text-right">Bonus</th>
                    <th className="text-right">Right</th>
                    <th>Account Title</th>
                    <th>Account No</th>
                    <th>Bank</th>
                    <th>Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {shareHoldings.length !== 0 &&
                    shareHoldings
                      .map((holding, i) => {
                        const associated_investor = investors.find(
                          (inv) => inv.cnic === holding.shareholder_cnic
                        );
                        const electronic_shares = !!holding?.electronic_shares
                          ? holding?.electronic_shares
                          : "0";
                        const physical_shares = !!holding?.physical_shares
                          ? holding?.physical_shares
                          : "0";
                        const total_holding = (
                          parseInt(electronic_shares) +
                          parseInt(physical_shares)
                        ).toString();
                        const filer =
                          associated_investor?.filer === "Y" ? "Y" : "N";
                        const zakat_status =
                          associated_investor?.zakat_status === "Y" ? "Y" : "N";
                        const gross_div =
                          (total_holding *
                            company.face_value *
                            selectedAnnouncement.dividend_number) /
                          100;
                        const tax_rate = filer === "Y" ? "15%" : "30%";
                        const tax_exempted =
                          filer === "Y"
                            ? gross_div - gross_div * 0.15
                            : gross_div - gross_div * 0.3;
                        const zakat =
                          zakat_status === "Y" ? gross_div / 40 : gross_div;
                        const bonus_shares =
                          (total_holding * selectedAnnouncement.bonus_percent) /
                          100;
                        const right_shares =
                          (total_holding * selectedAnnouncement.right_percent) /
                          100;
                        const account_title = holding?.account_title;
                        const account_no = holding?.account_no;
                        const bank = holding?.bank_name;
                        const branch =
                          holding?.baranch_address +
                          " - " +
                          holding?.baranch_city;

                        return {
                          s_no: i + 1,
                          folio_no: holding.folio_number,
                          shareholder_name: holding.shareholder_name,
                          filer: filer,
                          share_holding: total_holding,
                          gorss_dividend: gross_div,
                          tax_rate: tax_rate,
                          tax: tax_exempted,
                          net_dividend: gross_div - tax_exempted,
                          zakat: zakat,
                          bonus_shares: bonus_shares,
                          right_shares: right_shares,
                          account_title: account_title,
                          account_no: account_no,
                          bank: bank,
                          branch: branch,
                        };
                      })
                      .map((holding, i) => (
                        <tr>
                          <td>{i + 1}</td>
                          <td>{holding.folio_no}</td>
                          <td>{holding.shareholder_name}</td>
                          <td>{holding.filer}</td>
                          <td className="text-right">
                            {numberWithCommas(parseFloat(holding.share_holding)?.toFixed("2"))}
                          </td>
                          <td className="text-right">
                            {numberWithCommas(parseFloat(holding.gorss_dividend)?.toFixed("2"))}
                          </td>
                          <td className="text-right">{numberWithCommas(holding.tax_rate)} </td>
                          <td className="text-right">{numberWithCommas(parseFloat(holding.tax)?.toFixed("2"))}</td>
                          <td className="text-right">{numberWithCommas(parseFloat(holding.zakat)?.toFixed("2"))}</td>
                          <td className="text-right">
                            {numberWithCommas(parseFloat(holding.net_dividend)?.toFixed("2"))}
                          </td>
                          <td className="text-right">
                            {numberWithCommas(parseFloat(holding.bonus_shares)?.toFixed("2"))}
                          </td>
                          <td className="text-right">{numberWithCommas(holding.right_shares?.toFixed("2"))}</td>
                          <td>{holding.account_title}</td>
                          <td>{holding.account_no}</td>
                          <td>{holding.bank}</td>
                          <td>{holding.branch}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </Fragment>
    </div>
  );
}
