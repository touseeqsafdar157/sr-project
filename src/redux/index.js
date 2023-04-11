import { combineReducers } from "redux";
import TodoApp from "./todo/reducer";
import EmailApp from "./email/reducer";
import ChatApp from "./chat/reducer";
import Ecommerce from "./ecommerce/product/reducer";
import Cart from "./ecommerce/cart/reducer";
import Wishlist from "./ecommerce/wishlist/reducer";
import Filters from "./ecommerce/filter/reducer";
import Bookmarkapp from "./bookmark/reducer";
import Taskapp from "./task/reducer";
import Projectapp from "./project/reducer";
import Customizer from "./customizer/reducer";
import Companies from "./shareregistrar/company/reducer";
import Shareholders from "./shareregistrar/shareholder/reducer";
import Investors from "./shareregistrar/investor/reducer";
import InvestorsRequests from "./shareregistrar/investor-request/reducer";
import Features from "./shareregistrar/auth/reducer";
import TransactionRequests from "./shareregistrar/transaction-request/reducer";
import ShareCertificates from "./shareregistrar/share-certificate/reducer";
import Entitlements from "./shareregistrar/entitlements/reducer";
import Announcements from "./shareregistrar/announcement/reducer";
import Dividend from "./shareregistrar/dividend-disbursement/reducer";
import Roles from "./shareregistrar/roles/reducer";
import Elections from "./shareregistrar/elections/reducer";

const reducers = combineReducers({
  TodoApp,
  EmailApp,
  ChatApp,
  Product: Ecommerce,
  Wishlist,
  Cart,
  Filters,
  Bookmarkapp,
  Taskapp,
  Projectapp,
  Customizer,
  Companies,
  Shareholders,
  Investors,
  InvestorsRequests,
  Features,
  TransactionRequests,
  ShareCertificates,
  Entitlements,
  Announcements,
  Dividend,
  Roles,
  Elections,
});

export default reducers;
