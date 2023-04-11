import { all } from "redux-saga/effects";
import { WatcherEcommerceApp } from "../redux/ecommerce";
import { WatcherChatApp } from "../redux/chat";
import { WatcherEmailApp } from "../redux/email";
import { watchTodoList } from "../redux/todo";
import { watchBookmarkList } from "../redux/bookmark";
import { watcherTaskApp } from "../redux/task";
import { watcherCompanies } from "../redux/shareregistrar/company";
import { watcherShareholders } from "../redux/shareregistrar/shareholder";
import { watcherInvestors } from "../redux/shareregistrar/investor";
import { watcherInvestorsRequests } from "../redux/shareregistrar/investor-request";
import { watcherTransactionRequests } from "../redux/shareregistrar/transaction-request";
import { watcherShareCertificatess } from "../redux/shareregistrar/share-certificate";
import { watcherAnnouncements } from "../redux/shareregistrar/announcement";
import { watcherEntitlements } from "../redux/shareregistrar/entitlements";
import { watcherDividendDisbursement } from "../redux/shareregistrar/dividend-disbursement";
import { watcherRoles } from "../redux/shareregistrar/roles";
import { watcherElections } from "../redux/shareregistrar/elections";

export default function* rootSagas() {
  yield all([
    WatcherEcommerceApp(),
    WatcherChatApp(),
    WatcherEmailApp(),
    watchTodoList(),
    watchBookmarkList(),
    watcherTaskApp(),
    watcherCompanies(),
    watcherShareholders(),
    watcherInvestors(),
    watcherInvestorsRequests(),
    watcherTransactionRequests(),
    watcherShareCertificatess(),
    watcherAnnouncements(),
    watcherEntitlements(),
    watcherDividendDisbursement(),
    watcherRoles(),
    watcherElections(),
  ]);
}
