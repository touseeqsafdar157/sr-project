import React, { Fragment, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Header from "./common/header-component/header";
import Sidebar from "./common/sidebar-component/sidebar";
import RightSidebar from "./common/right-sidebar";
import Footer from "./common/footer";
import ThemeCustomizer from "./common/theme-customizer";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  WATCH_COMPANIES,
  WATCH_SHAREHOLDERS,
  WATCH_INVESTORS,
  WATCH_INVESTORS_REQUEST,
  GET_FEATURES,
  WATCH_TRANSACTION_REQUEST,
  WATCH_TRANSACTION_REQUEST_TYPES,
  WATCH_SHARE_CERTIFICATES,
  WATCH_ENTITLEMENTS,
  WATCH_DIVIDEND,
  WATCH_ANNOUNCEMENTS,
  WATCH_COMPANIES_SYMBOLS,
  WATCH_INACTIVE_SHAREHOLDERS,
  WATCH_ROLES,
  WATCH_ELECTIONS,
  WATCH_ELECTIONS_DROPDOWN,
  WATCH_TRANSACTION_LISTING,
  GET_INVESTORS_REQUEST_TYPES,
  WATCH_INVESTORS_REQUEST_TYPES,
} from "../redux/actionTypes";
import Config from "../config/index";

const AppLayout = (props) => {
  const dispatch = useDispatch();
  // const token = sessionStorage.getItem("token");

  useEffect(()=>{
    if(window.location.pathname=="/login" && sessionStorage.getItem('email')!==null){
      sessionStorage.clear();
      // window.location.replace(`${process.env.PUBLIC_URL}/login`);
      // window.location.href=`${process.env.PUBLIC_URL}/login`;
    }
    document.title = Config.appTitle + ' ' + '('+Config.appVersion+')';
  },[])

  useEffect(() => {
    // if (token !== null) {
    if (sessionStorage.getItem("token") !== null) {
      // dispatch({ type: WATCH_COMPANIES });
      // dispatch({ type: WATCH_COMPANIES_SYMBOLS });
      // dispatch({ type: WATCH_SHAREHOLDERS });
      // dispatch({ type: WATCH_INACTIVE_SHAREHOLDERS });
      // dispatch({ type: WATCH_INVESTORS });
      // dispatch({ type: WATCH_INVESTORS_REQUEST });
      // dispatch({ type: WATCH_TRANSACTION_REQUEST });
      // dispatch({ type: WATCH_TRANSACTION_LISTING });
      // dispatch({ type: WATCH_INVESTORS_REQUEST_TYPES });
      // dispatch({ type: WATCH_SHARE_CERTIFICATES });
      // dispatch({ type: WATCH_ENTITLEMENTS });
      // dispatch({ type: WATCH_ANNOUNCEMENTS });
      // dispatch({ type: WATCH_DIVIDEND });
      dispatch({ type: WATCH_ROLES });
      // dispatch({ type: WATCH_ELECTIONS_DROPDOWN });
      // dispatch({ type: WATCH_ELECTIONS });

      dispatch({
        type: GET_FEATURES,
        payload: JSON.parse(sessionStorage.getItem("features")),
      });
    }
  }, [sessionStorage.getItem("token")]);
  // }, [token]);

  useEffect(() => {
    localStorage.setItem("layout_version", "dark-only");
  }, []);

  
  return (
    <Fragment>
      {sessionStorage.getItem("token")!=null && window.location.pathname!="/login" ? (
      <div className="page-wrapper">
        <div className="page-body-wrapper">
          {/* {token ? ( */}
          
            <>
              <Header />
              <Sidebar />
              <RightSidebar />
              <div className="page-body">{props.children}</div>
              <Footer />
              <ThemeCustomizer />
            </>
         
        </div>
      </div>
       ) : (
        <Redirect to={`${process.env.PUBLIC_URL}/login`} />
      )}
      <ToastContainer />
    </Fragment>
  );
};

export default AppLayout;
