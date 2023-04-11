import React from "react";
import Config from "../../config/index";

const Footer = (props) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 footer-copyright">
            <p className="mb-0">{`Copyright ${currentYear} © Share Registrar All rights reserved.`}</p>
          </div>
          <div className="col-md-6">
            <p className="pull-right mb-0">
              {"Digital Custodian"}
              <i className="fa fa-heart"></i> {Config.appVersion}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
