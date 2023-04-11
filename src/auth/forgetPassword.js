import React, { useState, useEffect } from "react";
import logo from "../assets/images/share-registrar.svg";
// import macslogo from "../assets/images/macs-core-logo.png";
import DCCLlogo from "../assets/DCC-Logo.svg";
import man from "../assets/images/dashboard/user.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withRouter } from "react-router";
import {
  firebase_app,
  googleProvider,
  facebookProvider,
  twitterProvider,
  githubProvider,
  Jwt_token,
} from "../data/config";
import { handleResponse } from "../services/fack.backend";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Login,
  LOGIN,
  YourName,
  Password,
  RememberMe,
  LoginWithAuth0,
  LoginWithJWT,
} from "../constant";
import { forgotPassword, forgotPasswordOtp, loginService } from "../store/services/auth.service";
const config = require("../data/app_config.json");

const ForgetPassword = ({ history }) => {
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toggle, setToggle] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [otp, setOTP] = useState('');
  const [togglePassword, setTogglePassword] = useState('password');
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState('password');

  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [value, setValue] = useState(localStorage.getItem("profileURL" || man));

  useEffect(() => {
    if (value !== null) localStorage.setItem("profileURL", value);
    else localStorage.setItem("profileURL", man);
  }, [value]);

  const handleSendEmail = async () => {
    setToggle(true);
    setEmailError(false);
    if (!email.toLowerCase()) {
      setEmailError(true);
      return;
    }
    try {
      const response = await forgotPassword(email.toLowerCase());
      if (response.data.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          setOTP('');
          // setEmail('');
          setConfirmPassword('');
          setPassword('');
          setPasswordError('');
          setConfirmPasswordError('');
          setToggle(false);
        }, 1000);
      } else {
        // toast.error(response.data.message);
      }
    } catch (err) {
      setToggle(true);
      if (err.response !== undefined) {
        if (err.response.status === 500) {
          toast.error('Oops! something went wrong.');
        } else {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error("Request Failed!")
      }
    }
  };

  const validate = () => {
    let optErr,
      passErr,
      conPassErr = '';

    otp.trim() === '' ? (optErr = '* OPT Is Required') : (optErr = '');
    password.trim() === '' ? (passErr = '* Password Is Required') : (passErr = '');
    confirmPassword.trim() === ''
      ? (conPassErr = '* Confirm Password Is Required')
      : confirmPassword !== password
        ? (conPassErr = '* Not Match')
        : (conPassErr = '');

    if (optErr || passErr || conPassErr) {
      setOtpError(optErr);
      setPasswordError(passErr);
      setConfirmPasswordError(conPassErr);
      return false;
    } else {
      return true;
    }
  };

  const confirmForgetPassword = async () => {
    const isValid = validate();
    if (isValid) {
      setToggle(false);
      setEmailError(false);
      try {
        const response = await forgotPasswordOtp(email.toLowerCase(), otp, password, confirmPassword);
        if (response.data.status === 200) {
          toast.success(response.data.message);
          setTimeout(() => {
            setOTP('');
            setEmail('');
            setConfirmPassword('');
            setPassword('');
            window.location.replace(
              `${process.env.PUBLIC_URL}/login`
            );
          }, 1000);
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        setToggle(false);
        if (err.response !== undefined) {
          if (err.response.status === 500) {
            toast.error('Oops! something went wrong.');
          } else {
            toast.error(err.response.data.message);
          }
        } else {
          toast.error("Request Failed!")
        }
      }
    }
  };


  return (
    <div>
      <div className="page-wrapper">
        <div className="container-fluid p-0">
          {/* <!-- login page start--> */}
          {toggle ? (
            <div className="authentication-main">
              <div className="row">
                <div className="col-md-12">
                  <div className="auth-innerright">
                    <div className="authentication-box">
                      <div className="text-center">
                        <img src={DCCLlogo} width="130" alt="" />
                      </div>
                      <div className="card mt-4">
                        <div className="card-body">
                          <div className="text-center">
                            <img src={logo} alt="" className="py-3" width="220" />
                            {/* <h4>Share Registrar</h4> */}
                            <h6>{"Forget Password"} </h6>
                          </div>
                          <form className="theme-form">
                            <div className="form-group">
                              <label className="col-form-label pt-0">
                                Enter Email
                              </label>
                              <input
                                className="form-control"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => {
                                  setEmailError(false)
                                  setEmail(e.target.value)
                                }}
                                placeholder="Email address"
                              />
                              {emailError && (
                                <p className="error-color">* Email is required</p>
                              )}
                            </div>

                            <div className="form-group form-row mt-3 mb-0">
                              <button
                                className="btn btn-primary btn-block"
                                type="button"
                                onClick={handleSendEmail}
                              >
                                Recover Password
                              </button>
                              <button
                                className="btn btn-dark btn-block"
                                type="button"
                                onClick={() => {
                                  history.push(`/login`);
                                }}
                              >
                                Cancel
                              </button>
                            </div>

                            <div
                              className="login-divider"
                              style={{ visibility: "hidden" }}
                            ></div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="authentication-main">
              <div className="row">
                <div className="col-md-12">
                  <div className="auth-innerright">
                    <div className="authentication-box">
                      <div className="text-center">
                        <img src={DCCLlogo} width="130" alt="" />
                      </div>
                      <div className="card mt-4">
                        <div className="card-body">
                          <div className="text-center">
                            <img src={logo} alt="" className="py-3" width="220" />
                            {/* <h4>Share Registrar</h4> */}
                            <h6>{"OTP Varification"} </h6>
                          </div>
                          <form className="theme-form">
                            <div className="form-group">
                              <label className="col-form-label pt-0">
                                OTP Code
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                name="otpCode"
                                placeholder="OTP Code"
                                value={otp}
                                onChange={(e) => {
                                  setOTP(e.target.value);
                                  setOtpError('');
                                }}
                              />
                              {otpError.length > 0 && (
                                <p className="error-color">{otpError}</p>
                              )}
                            </div>
                            <div className="form-group">
                              <label className="col-form-label pt-0">
                                Password
                              </label>
                              <div class="input-group mb-3">
                                <input
                                  className="form-control"
                                  type={togglePassword}
                                  placeholder="Enter Password"
                                  value={password}
                                  onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError('');
                                  }}
                                />
                                <div class="input-group-append">
                                  <span class="input-group-text" onClick={(e) => {
                                    if (togglePassword == 'password') {
                                      setTogglePassword('text');
                                    } else {
                                      setTogglePassword('password');
                                    }
                                  }}>
                                    {togglePassword == 'password' ? (
                                      <i class="fa fa-eye"></i>
                                    ) : (
                                      <i class="fa fa-eye-slash"></i>
                                    )}

                                  </span>
                                </div>
                              </div>
                              {console.log('password', passwordError)}
                              {passwordError.length > 0 && (<p className="error-color">{passwordError}</p>)}
                            </div>
                            <div className="form-group">
                              <label className="col-form-label pt-0">
                                Confirm Password
                              </label>
                              <div class="input-group mb-3">
                                <input
                                  className="form-control"
                                  type={toggleConfirmPassword}
                                  placeholder="Enter Confirm Password"
                                  value={confirmPassword}
                                  onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setConfirmPasswordError('');
                                  }}
                                />
                                <div class="input-group-append">
                                  <span class="input-group-text" onClick={(e) => {
                                    if (toggleConfirmPassword == 'password') {
                                      setToggleConfirmPassword('text');
                                    } else {
                                      setToggleConfirmPassword('password');
                                    }
                                  }}>
                                    {toggleConfirmPassword == 'password' ? (
                                      <i class="fa fa-eye"></i>
                                    ) : (
                                      <i class="fa fa-eye-slash"></i>
                                    )}

                                  </span>
                                </div>
                              </div>
                            </div>
                            {confirmPasswordError.length > 0 && (
                              <p className="error-color">{confirmPasswordError}</p>
                            )}
                            <div className="form-group form-row mt-3 mb-0">
                              <button
                                className="btn btn-primary btn-block"
                                type="button"
                                onClick={() => {
                                  confirmForgetPassword();
                                }}
                              >
                                Confirm
                              </button>
                              <button
                                className="btn btn-dark btn-block"
                                type="button"
                                onClick={() => {
                                  setToggle(true);
                                }}
                              >
                                Cancel
                              </button>
                            </div>

                            <div
                              className="login-divider"
                              style={{ visibility: "hidden" }}
                            ></div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ToastContainer />
          {/* <!-- login page end--> */}
        </div>
      </div>
    </div>
  );
};

export default withRouter(ForgetPassword);
