import * as React from "react";
import moment from "moment";
const PageTemplate = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        fontSize:"10px",
        fontFamily:"Palatino",
      }}
    >
      <small>This document is computer generated and does not require the Registrar's signature or the Company's 
        stamp in order to be considered valid. ({moment(new Date()).format('DD-MM-YYYY LT')}) Reference No: {moment(new Date()).valueOf()}</small>
    </div>
  );
};
export default PageTemplate;