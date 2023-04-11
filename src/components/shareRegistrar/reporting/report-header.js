// import DCClogo from "./../../assets/DCC-Logo.svg";\
import DCClogo from "../../../assets/DCC-Logo.svg"
import logo from "../../../assets/images/share-registrar.svg";
import React from "react";

const ReportHeader = (props) => {
  return (
    <>
      <div className=" d-flex justify-content-between align-items-center mb-3 ">
        <img src={DCClogo} alt="DCC-Logo" className="" height="80" />
        {/* <h3 className="text-black mt-2">{props.title}</h3> */}
       {!props?.isEvotingResult ? <img
          src={logo}
          alt="D-Registy-Logo"
          className=""
          height="40"
          width="147px"
        /> : ''}
        {/* {props.logo !=="" ? */}
        <img src={props.logo} className="" height="80" width="100px" /> 
        {/* : */}
        {/* // <img src=""s className="" height="80" width="100px" />} */}
      
      </div>
    </>
  );
};

export default ReportHeader;
