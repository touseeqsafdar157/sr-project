import React, { Fragment, useState, useEffect } from "react";
import man from "../../../assets/images/dashboard/user.png";
import { LogOut } from "react-feather";
import { withRouter } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { logoutCentral, logoutMain } from "store/services/auth.service";
import { toast } from "react-toastify";

const UserMenu = ({ history }) => {
  const [profile, setProfile] = useState("");
  // auth0 profile
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"));

  useEffect(() => {
    setProfile(localStorage.getItem("profileURL") || man);
  }, []);

  const logoutApp = async() =>{
    const email = sessionStorage.getItem('email');
    try{
      const mainResponse = await logoutMain(email);
      if(mainResponse.status===200){
        const response = await logoutCentral(email);
        if(response.status===200){
          handleLogout();
        }else{
          toast.error(response.data.message);
        }
      }else{
        toast.error(mainResponse.data.message);
      }
    }catch(error){
      if(error.response.data.message){
        toast.error(error.response.data.message);
      }else{
        toast.error(error.message)
      }
    }

  }

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.replace(`${process.env.PUBLIC_URL}/login`);
  };

  return (
    <Fragment>
      <li className="onhover-dropdown">
        <div className="media align-items-center">
          <img
            className="align-self-center pull-right img-50 rounded-circle blur-up lazyloaded"
            src={authenticated ? auth0_profile.picture : profile}
            alt="header-user"
          />
          <div className="dotted-animation">
            <span className="animate-circle"></span>
            <span className="main-circle"></span>
          </div>
        </div>
        <ul className="profile-dropdown onhover-show-div p-20 profile-dropdown-hover">
          <li>
            <a href="#">{sessionStorage.getItem("role")?.toUpperCase()}</a>
          </li>
          <li>
            <a href="#">{sessionStorage.getItem("name")?.toUpperCase()}</a>
          </li>
          <li>
            <a href="#">{sessionStorage.getItem("email")?.toUpperCase()}</a>
          </li>
          <li>
            <a
              // onClick={authenticated ? Logout_From_Auth0 : Logout_From_Firebase}
              onClick={logoutApp}
              //   href="#javascript"
            >
              <LogOut /> {"Log out"}
            </a>
          </li>
        </ul>
      </li>
    </Fragment>
  );
};

export default withRouter(UserMenu);
