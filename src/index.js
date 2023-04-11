import React, { useEffect, Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import AuthGuard from "./auth/AuthGuard";
// * Import custom components for redux *
import { Provider } from "react-redux";
import store from "./store";
//config data
import configDB from "./data/customizer/config";

// Import custom Components
import App from "./components/app";
import Default from "./components/dashboard/defaultCompo/default";

import Signin from "./auth/signin";
import ForgetPassword from "./auth/forgetPassword";
import Spinner from "components/common/spinner";

// import share registrar

const CompanyListing = lazy(() =>
  import("./components/shareRegistrar/company/companyListing")
);
const StatuaryEvents = lazy(() =>
  import("./components/shareRegistrar/company/statyaryEvent")
);
const StatuaryRequirments = lazy(() =>
  import("./components/shareRegistrar/company/statuarrequirment")
);
const ManualStatuaryAlert = lazy(() =>
  import("./components/shareRegistrar/company/manualStatuaryAlert")
);
const CompanyDashboard = lazy(() =>
  import("./components/shareRegistrar/company/adminDashboard")
);
const InvestorsListing = lazy(() =>
  import("./components/shareRegistrar/investors/investorsListing")
);
const InvestorRequestListing = lazy(() =>
  import(
    "./components/shareRegistrar/investors/investorRequest/investorRequestListing"
  )
);

const ShareholderListing = lazy(() =>
  import("./components/shareRegistrar/shareholders/shareholderListing")
);
const AnnouncementListing = lazy(() =>
  import(
    "./components/shareRegistrar/corporate/announcement/announcementListing"
  )
);
const IPOListing = lazy(() =>
  import("./components/shareRegistrar/corporate/ipoAnnouncement/ipoListing")
);
const EntitlementListing = lazy(() =>
  import("./components/shareRegistrar/corporate/entitlement/entitlementListing")
);
const ActionCalculator = lazy(() =>
  import("./components/shareRegistrar/corporate/action-calculator")
);
const EntitlementUploader = lazy(() =>
  import(
    "./components/shareRegistrar/corporate/entitlement/entitlementsUploader"
  )
);
const SendIntimationLetter = lazy(() =>
  import(
    "./components/shareRegistrar/corporate/entitlement/sendIntimationLetter"
  )
);
const BulkRigthCredit = lazy(() =>
  import("./components/shareRegistrar/corporate/entitlement/bulkRightCredit")
);
const BankDepositUploader = lazy(() =>
  import(
    "./components/shareRegistrar/corporate/entitlement/bankDepositUploader"
  )
);
const DisbursementListing = lazy(() =>
  import("./components/shareRegistrar/dividend/disbursementListing")
);
const ShareUploader = lazy(() =>
  import("./components/shareRegistrar/shareholders/shareholding-uploader")
);
const ShareCertificateIssuanceListing = lazy(() =>
  import(
    "./components/shareRegistrar/share-certificate/shareCertificateIssuanceListing"
  )
);
const UserListing = lazy(() =>
  import("./components/shareRegistrar/user-management/userListing")
);
const RoleListing = lazy(() =>
  import("./components/shareRegistrar/role-management/roleListing")
);

const TransactionRequestListing = lazy(() =>
  import("./components/shareRegistrar/processing/transactionRequestListing")
);
const TransactionListings = lazy(() =>
  import("./components/shareRegistrar/transactionListing/transactionListing")
);

const ShareHoldingBulkUpload = lazy(() =>
  import("./components/shareRegistrar/shareholders/physicalHoldingUploader")
);
const CertificateUploader = lazy(() =>
  import(
    "./components/shareRegistrar/share-certificate/shareCertificateUploader"
  )
);
const ShareholdingHistory = lazy(() =>
  import("./components/shareRegistrar/reporting/shareholdingHistory")
);
const RightAllotmentReport = lazy(() =>
  import("./components/shareRegistrar/reporting/rightAllotmentReport")
);
const RightAllotmentRegister = lazy(() =>
  import("./components/shareRegistrar/reporting/rightAllotmentRegister")
);
const InvestorRequestReport = lazy(() =>
  import("./components/shareRegistrar/reporting/investorsRequestReport")
);
const BonusAllotmentReport = lazy(() =>
  import("./components/shareRegistrar/reporting/bonusAllotmentReport")
);
const DividendAllotmentReport = lazy(() =>
  import("./components/shareRegistrar/reporting/dividendReport")
);
const LabelPrinting = lazy(() =>
  import("./components/shareRegistrar/reporting/labelPrinting")
);
// User Modules
const ShareholdingPattern = lazy(() =>
  import("./components/shareRegistrar/reporting/shareholdingPattern")
);

const CategoryOfShareholding = lazy(() =>
  import("./components/shareRegistrar/reporting/categoryofShareholding")
);

const FreeFloat = lazy(() =>
  import("./components/shareRegistrar/reporting/freeFloatReport")
);

const DistinctiveCounter = lazy(() =>
  import("components/shareRegistrar/distinctiveCounter/distinctiveCounter")
);

const ElectionListing = lazy(() =>
  import("./components/shareRegistrar/election/electionListing")
);

const ListOfShareholders = lazy(() =>
  import("./components/shareRegistrar/reporting/list-of-shareholders")
);
const EvotingListing = lazy(() =>
  import("./components/shareRegistrar/Evoting/evotingListing")
);

const ShareHolderStatement = lazy(() =>
  import("./components/shareRegistrar/reporting/shareHolderStatement")
);
const CanidateListing = lazy(() =>
  import("./components/shareRegistrar/Evoting/electionOfCanidate")
);
const SpecialVoteCastData = lazy(() =>
  import("./components/shareRegistrar/Evoting/SpecialVoteCastPage")
);
const AuthorizationListing = lazy(() =>
  import("./components/shareRegistrar/Evoting/authorizationListing")
);
const SpecialResolutionListing = lazy(() =>
  import("./components/shareRegistrar/Evoting/specialResolutionListing")
);
const ListingSpecialVoting = lazy(() =>
  import("./components/shareRegistrar/Evoting/listingSpecialVoting")
);
const SpecialVotingReport = lazy(() =>
  import("./components/shareRegistrar/Evoting/SpecialVotingReport")
);
const DirectorVotingReport = lazy(() =>
  import("./components/shareRegistrar/Evoting/directorVotingReport")
);
const ListingofElection = lazy(() =>
  import("./components/shareRegistrar/Evoting/listingOFElection")
);
const CompileSpecialResolutionResult = lazy(() =>
  import("./components/shareRegistrar/Evoting/CompileSpecialResolutionResult")
);
const TosReport = lazy(() =>
  import("./components/shareRegistrar/reporting/tosReport")
);
// import EditAnnouncement from "./components/shareRegistrar/corporate/announcement/editAnnouncement";

// setup fake backend
// configureFakeBackend();

const Root = () => {
  const abortController = new AbortController();

  useEffect(() => {
    const color = localStorage.getItem("color");
    // const layout =
    //   localStorage.getItem("layout_version") ||
    //   configDB.data.color.layout_version;
    const layout = "light" || configDB.data.color.layout_version;

    // firebase_app.auth().onAuthStateChanged(setCurrentUser);
    document.body.classList.add(layout);
    console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
    console.disableYellowBox = true;
    document
      .getElementById("color")
      .setAttribute(
        "href",
        `${process.env.PUBLIC_URL}/assets/css/${color}.css`
      );

    return function cleanup() {
      abortController.abort();
    };

    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter basename={`/`}>
          <Switch>
            <Suspense fallback={<Spinner />}>
              <Route
                exact
                path={`${process.env.PUBLIC_URL}/shareregistrar`}
                render={() => {
                  return <Redirect to={`${process.env.PUBLIC_URL}/login`} />;
                }}
              />
              <Route
                exact
                path={`${process.env.PUBLIC_URL}/login`}
                component={Signin}
              />
              <Route
                exact
                path={`${process.env.PUBLIC_URL}/forget-password`}
                component={ForgetPassword}
              />

              <App>
                <Suspense fallback={<Spinner />}>
                  <AuthGuard
                    exact
                    path={`/`}
                    render={() => {
                      return (
                        <Redirect
                          to={`${process.env.PUBLIC_URL}/dashboard/default`}
                        />
                      );
                    }}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/dashboard/default`}
                    component={Default}
                  />

                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/company-listing`}
                    component={CompanyListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/manual-statutory-alert`}
                    component={ManualStatuaryAlert}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/company-dashboard`}
                    component={CompanyDashboard}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/statutory-requirements-listing`}
                    component={StatuaryRequirments}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/statutory-events`}
                    component={StatuaryEvents}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/investors-listing`}
                    component={InvestorsListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/investor-request-listing`}
                    component={InvestorRequestListing}
                  />
                  {/* IPO Announcement */}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/ipo-listing`}
                    component={IPOListing}
                  />
                  {/* Inprocess Transaction*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/inprocess-transactions`}
                    component={TransactionRequestListing}
                  />
                  {/* Transaction Listing*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/transaction-listing`}
                    component={TransactionListings}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/shareholder-listing`}
                    component={ShareholderListing}
                  />
                  {/* Evoting start */}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/elections-of-directors-listing`}
                    component={EvotingListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/shareholding-statement`}
                    component={ShareHolderStatement}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/candidates-listing`}
                    component={CanidateListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/proxy-and-authorization-listing`}
                    component={AuthorizationListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/special-resolution-listing`}
                    component={ListingSpecialVoting}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/special-voting`}
                    component={SpecialResolutionListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/election-voting`}
                    component={ListingofElection}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/compile-resolution-results`}
                    component={CompileSpecialResolutionResult}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/special-voting-report`}
                    component={SpecialVotingReport}
                  />

                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/election-voting-report`}
                    component={DirectorVotingReport}
                  />
                  {/* Evoting End */}
                  {/* Election  Start*/}
                  {/* Eelection Listing*/}

                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/election-listing`}
                    component={ElectionListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/special-vote-cast`}
                    component={SpecialVoteCastData}
                  />
                  {/* Election  Start*/}

                  {/* Reporting  Start*/}
                  {/* Shareholding Pattern*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/shareholding-pattern`}
                    component={ShareholdingPattern}
                  />
                  {/* Shareholding History*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/shareholding-history`}
                    component={ShareholdingHistory}
                  />
                  {/* Category Of Shareholder*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/category-of-shareholding`}
                    component={CategoryOfShareholding}
                  />
                  {/* Free Float Reort*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/free-float-report`}
                    component={FreeFloat}
                  />
                  {/* Right Allotment History*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/right-allotment-report`}
                    component={RightAllotmentReport}
                  />
                  {/* Right Allotment Reister*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/right-allotment-register`}
                    component={RightAllotmentRegister}
                  />

                  {/*List of Shareholders Report */}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/list-of-shareholders`}
                    component={ListOfShareholders}
                  />
                  {/* Bonus Allotment History*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/bonus-allotment-report`}
                    component={BonusAllotmentReport}
                  />
                  {/* Dividend Allotment History*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/dividend-allotment-report`}
                    component={DividendAllotmentReport}
                  />
                  {/* Investors Request Report*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/investors-request-report`}
                    component={InvestorRequestReport}
                  />
                  {/* TOS Report*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/tos-report`}
                    component={TosReport}
                  />
                  {/* Reporting End*/}
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/share-certificate-listing`}
                    component={ShareCertificateIssuanceListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/shareholding-uploader`}
                    component={ShareUploader}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/physical-file-uploader`}
                    component={ShareHoldingBulkUpload}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/certificate-file-uploader`}
                    component={CertificateUploader}
                  />

                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/users-listing`}
                    component={UserListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/roles-listing`}
                    component={RoleListing}
                  />

                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/corporate-announcement-listing`}
                    component={AnnouncementListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/corporate-action-calculator`}
                    component={ActionCalculator}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/corporate-entitlement-listing`}
                    component={EntitlementListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/corporate-entitlement-uploader`}
                    component={EntitlementUploader}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/intimation-letter`}
                    component={SendIntimationLetter}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/right-credit`}
                    component={BulkRigthCredit}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/bank-deposit-uploader`}
                    component={BankDepositUploader}
                  />

                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/company-counter`}
                    component={DistinctiveCounter}
                  />

                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/disbursement-listing`}
                    component={DisbursementListing}
                  />
                  <AuthGuard
                    exact
                    path={`${process.env.PUBLIC_URL}/label-printing`}
                    component={LabelPrinting}
                  />
                </Suspense>
              </App>
            </Suspense>
          </Switch>
        </BrowserRouter>
      </Provider>
    </div>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

serviceWorker.unregister();
