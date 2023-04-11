import React, { useState, useEffect } from "react";
import logo from "../assets/images/share-registrar.svg";
// import macslogo from "../assets/images/macs-core-logo.png";
import DCCLlogo from "../assets/DCC-Logo.svg";
import man from "../assets/images/dashboard/user.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withRouter } from "react-router";
import { handleResponse } from "../services/fack.backend";
import { Login, YourName, Password, RememberMe } from "../constant";
import { loginService, getLoggedinUserInfo } from "../store/services/auth.service";
import { Link } from "react-router-dom";
import Config from "../config/index";

const Signin = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [Loading, setLoading] = useState(false);

  const [value, setValue] = useState(localStorage.getItem("profileURL" || man));

  // errors
  const [emailError, setemailError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [togglePassword, setTogglePassword] = useState('password');

  useEffect(() => {
    document.title = Config.appTitle + ' ' + '('+Config.appVersion+')';
    if (value !== null) localStorage.setItem("profileURL", value);
    else localStorage.setItem("profileURL", man);
  }, [value]);

  const loginAuth = async () => {
    if (email == "") {
      setemailError(true);
    } else {
      setemailError(false);
    }
    if (password == "") {
      setpasswordError(true);
    } else {
      setpasswordError(false);
    }
    if (email !== "" && password !== "") {
      try {
        setLoading(true);
        const response = await loginService(email, password);
        if (response.data.status === 200) {
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("refreshToken", response.data.refreshToken);
          const userInfo = await getLoggedinUserInfo(email);
          if(userInfo.status===200){
          toast.success(userInfo.data.message);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("name", userInfo.data.data.name);
          sessionStorage.setItem("role", userInfo.data.data.role);
          sessionStorage.setItem("features", userInfo.data.data.features);
          window.location.replace(
            `${process.env.PUBLIC_URL}/dashboard/default`
          );
          }else{
            toast.error(userInfo.data.message);
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("refreshToken");
          }
        } else {
          // toast.error("Oppss.. The password is invalid or the user does not have a password.");
          toast.error(response.data.message);
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("refreshToken");
        }
        setLoading(false);
      } catch (error) {
        setTimeout(() => {
          toast.error(
            "Oppss.. The password is invalid or the user does not have a password."
          );
        }, 200);
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="container-fluid p-0">
          {/* <!-- login page start--> */}
          <div className="authentication-main">
            <div className="row">
              <div className="col-md-12">
                <div className="auth-innerright">
                  <div className="authentication-box">
                    <div className="text-center">
                      <img src={DCCLlogo} width="130" alt="" />
                      <div className="text-center"></div>
                    </div>
                    <div className="card mt-4">
                      <div className="card-body">
                        <div className="text-center">
                          <img src={logo} alt="" className="py-3" width="220" />
                          {/* <h4>Share Registrar</h4> */}
                        </div>
                        <form className="theme-form">
                          <div className="form-group">
                            <label className="col-form-label pt-0">
                              {YourName}
                            </label>
                            <input
                              className="form-control"
                              type="email"
                              name="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Email address"
                            />
                            {emailError && (
                              <p className="error-color">* Email is required</p>
                            )}
                          </div>
                          <div className="form-group">
                            <label className="col-form-label">{Password}</label>
                            <div class="input-group mb-3">
                            <input
                              className="form-control"
                              type={togglePassword}
                              name="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <div class="input-group-append">
                                <span class="input-group-text" onClick={(e)=>{
                                  if(togglePassword=='password'){
                                    setTogglePassword('text');
                                  }else{
                                    setTogglePassword('password');
                                  }
                                }}>
                                  {togglePassword=='password' ? (
                                    <i class="fa fa-eye"></i>
                                  ):(
                                    <i class="fa fa-eye-slash"></i>
                                  )}
                                  
                                </span>
                              </div>
                              </div>
                            {passwordError && (
                              <p className="error-color">
                                * Password is required
                              </p>
                            )}
                          </div>
                          {/* <div className="checkbox p-0">
                            <input id="checkbox1" type="checkbox" />
                            <label htmlFor="checkbox1">{RememberMe}</label>
                          </div> */}
                          <div className="form-group form-row mt-3 mb-0">
                            {/* <button
                              className="btn btn-primary btn-block"
                              type="button"
                              onClick={() => loginAuth()}
                            >
                              {Login}
                            </button> */}

                            <button
                              className="btn btn-primary btn-block"
                              type="button"
                              onClick={() => loginAuth()}
                              disabled={Boolean(Loading)}
                            >
                              {Loading ? (
                                <>
                                  <span className="fa fa-spinner fa-spin"></span>
                                  <span> Loading...</span>
                                </>
                              ) : (
                                <span> {Login}</span>
                              )}
                            </button>
                          </div>
                          <div className="form-group mt-3 mb-0">
                                {/* <a href="#">Forgot Password</a> */}
                                <Link to="/forget-password">Forgot Password</Link>
                            </div>
                          <hr style={{ width: "60%" }} />
                          {/* <p
                            className="text-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              history.push(
                                `${process.env.PUBLIC_URL}/forget-password`
                              );
                            }}
                          >
                            Forget Password
                          </p> */}
                          <div
                            className="text-center opacity-50"
                            style={{ color: "grey" }}
                          >
                            {/* <h6>Version 0.3</h6> */}
                            {/* <h6>SHARE-REGISTRAR DEV ENVIRONMENT VERSION 2.0</h6> */}
                            {/* <h6>SHARE-REGISTRAR UAT ENVIRONMENT VERSION 2.0</h6> */}

                            {/* <h6>SHARE-REGISTRAR VERSION 2.1</h6> */}
                            <h6>{Config.appTitle} {Config.appVersion}</h6>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
          {/* <!-- login page end--> */}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Signin);
