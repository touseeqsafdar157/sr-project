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

export default function ViewIndividualEntitlement() {
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
  const { inactive_shareholders_data, inactive_shareholders_data_loading } =
    useSelector((data) => data.Shareholders);
  const { investors_data, investors_data_loading } = useSelector(
    (data) => data.Investors
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
    const getShareHolders = () => {
      setShareHoldings(
        inactive_shareholders_data.filter(
          (item) => item.company_code === selectedAnnouncement?.company_code
        )
      );
    };
    const getAllInvestors = () => {
      setInvestors(investors_data);
    };
    if (!!company?.code) {
      getShareHolders();
      getAllInvestors();
    }
  }, [company]);

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
            {/* <div className="col-sm-12 col-md-4 col-lg-4 ">
              <div className="card ">
                <div className="card-header b-t-primary">
                  <h5>ALLOTMENTS</h5>
                </div>
                <div className="card-body"></div>
              </div>
            </div> */}
            <div className="col-sm-12 col-md-4 col-lg-4 ">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>ALLOTMENTS</h5>
                </div>
                <div className="card-body">
                  {/* Dividend Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Bonus Shares </label>

                        <input
                          type="text"
                          name="bonus_shares"
                          id="bonus_shares"
                          className="form-control text-right"
                          value={numberWithCommas(entitlement.bonus_shares)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Bonus Credited</label>
                        <input
                          type="text"
                          name="bonus_cred"
                          id="bonus_cred"
                          className="form-control text-right"
                          value={numberWithCommas(entitlement.bonus_credited)}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  {/* Bonus Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Dividend Amount </label>

                        <input
                          type="text"
                          name="dividend_amount"
                          className="form-control text-right"
                          id="dividend_amount"
                          value={numberWithCommas(entitlement.dividend_amount)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Dividend Credited</label>
                        <input
                          type="text"
                          name="dividend_cred"
                          id="dividend_cred"
                          className="form-control text-right"
                          value={numberWithCommas(entitlement.dividend_credited)}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Row */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Right Shares </label>

                        <input
                          type="text"
                          name="right_shares"
                          id="right_shares"
                          className="form-control text-right"
                          value={numberWithCommas(entitlement.right_shares)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>Right Subscribed</label>
                        <input
                          type="text"
                          name="right_shares"
                          id="right_shares"
                          className="form-control text-right"
                          value={numberWithCommas(entitlement.right_subscribed)}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>R Fraction </label>

                        <input
                          type="text"
                          name="right_shares"
                          id="right_shares"
                          className="form-control text-right"
                          value={numberWithCommas(entitlement.r_fraction)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group my-2">
                        <label>B Fraction</label>
                        <input
                          type="text"
                          name="right_shares"
                          id="right_shares"
                          className="form-control text-right"
                          value={numberWithCommas(entitlement.b_fraction)}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 ">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>ACCOUNT DETAILS</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Account No </label>
                    <input
                      type="text"
                      name="account_no"
                      id="account_no"
                      className="form-control"
                      value={entitlement.account_no}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Account Title </label>

                    <input
                      type="text"
                      name="account_title"
                      id="account_title"
                      className="form-control"
                      value={entitlement.account_title}
                      readOnly
                    />
                  </div>

                  <div className="form-group my-2">
                    <label>Bank Code </label>
                    <input
                      type="text"
                      name="bank_code"
                      id="bank_code"
                      className="form-control"
                      value={entitlement.bank_code}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Branch </label>

                    <input
                      type="text"
                      name="branch"
                      id="branch"
                      className="form-control"
                      value={entitlement.branch}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-4 col-lg-4 ">
              <div className="card ">
                <div className="card-header b-t-success">
                  <h5>TRANSACTION DETAILS</h5>
                </div>
                <div className="card-body">
                  <div className="form-group my-2">
                    <label>Bonus Transaction ID </label>
                    <input
                      type="text"
                      name="bonus_txn_id"
                      id="bonus_txn_id"
                      className="form-control"
                      value={entitlement.bonus_txn_id}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Dividend Transaction ID </label>
                    <input
                      type="text"
                      name="account_no"
                      id="account_no"
                      className="form-control"
                      value={entitlement.dividend_txn_id}
                      readOnly
                    />
                  </div>

                  <div className="form-group my-2">
                    <label>Right Transaction ID </label>
                    <input
                      type="text"
                      name="account_no"
                      id="account_no"
                      className="form-control"
                      value={entitlement.right_txn_id}
                      readOnly
                    />
                  </div>
                  <div className="form-group my-2">
                    <label>Announcement ID </label>
                    <input
                      type="text"
                      name="account_no"
                      id="account_no"
                      className="form-control"
                      value={entitlement.announcement_id}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Fragment>
    </div>
  );
}
