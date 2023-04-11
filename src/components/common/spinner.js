import React from "react";
import loader from "assets/images/dcc_loader.svg";
const Spinner = () => {
  return (
    <div className="row d-flex justify-content-center">
      <div className="col-md-6">
        <center>
          <h6 className="mb-0 text-nowrap">
            <b>{"Please Wait"}</b>
          </h6>
          <img alt="dcc_loader" src={loader} />
          {/* <div className="d-flex justify-content-center">
            <div className="loader-box mx-auto">
              <div className="loader">
                <div className="line bg-primary"></div>
                <div className="line bg-primary"></div>
                <div className="line bg-primary"></div>
                <div className="line bg-primary"></div>
              </div>
            </div>
          </div> */}
        </center>
      </div>
    </div>
  );
};

export default Spinner;
