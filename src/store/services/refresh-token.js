import axios from "axios";
import Config from "./../../config/index";
import { ToastContainer, toast } from "react-toastify";

const RefreshTokenHandler = {
  InProgress: false,

  requestIt: async function (request) { },

  handleIt: async function (resp) {
    
    if (resp.message == "jwt malformed" || resp.message == "jwt expired") {
      try {
        let refreshToken = sessionStorage.getItem("refreshToken") || "";
        let email = sessionStorage.getItem("email") || "";
        let url = `${Config.loginRegisterUrl}/user/token`;

        // if (this.InProgress == false) {
        // this.InProgress = true;
        let response = await axios.post(url, {
          email,
          refresh_token: refreshToken,
        });
        // if (Object.keys(response.data).length == 2) {
        if(response.data.refreshToken === undefined){
          toast.error('Session has been expired.');
          setTimeout(() => {
            sessionStorage.clear();
            window.location.href = "/login";
          }, 3000);
        }
        else if (response.data.refreshToken != '' && response.data.token != '') {
          sessionStorage.removeItem("refreshToken");
          sessionStorage.removeItem("token");
          sessionStorage.setItem("refreshToken", response.data.refreshToken);
          sessionStorage.setItem("token", response.data.token);
          return { status: true };
        }
        //   this.InProgress = false;
        // } else {
        //   return { status: true };
        // }
      } catch (err) {
        if (err.response.data.message == "[AuthGuard] Reuse of the refreshToken  detected!") {
          sessionStorage.clear();
          window.location.href = "/login";
        } else if (err.response.data.status === undefined) {
          toast.error("Session has been expired.");
          setTimeout(() => {
            sessionStorage.clear();
            window.location.href = "/login";
          }, 3000);
        }else {
          // if main jwt expire then app will be logout.
          // if(err.response.data.message==="jwt expired")
          if (err.response.data.status === 401) {
            toast.error("Session has been expired.");
            setTimeout(() => {
              sessionStorage.clear();
              window.location.href = "/login";
            }, 3000);
          } else {
            throw err;
          }

        }
      }
    } else if (resp.message == "[AuthGuard] Login again to restore success") {
      sessionStorage.clear();
      window.location.href = "/login";
    } else {
      return resp;
    }
  },
};

export default RefreshTokenHandler;
