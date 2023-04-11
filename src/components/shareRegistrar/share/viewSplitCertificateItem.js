import React, { useState, useEffect } from "react";
import { numberWithCommas } from "utilities/utilityFunctions";

const ViewSplitShareCertificateItem = ({
  num,
  startCalculation,
  calculated,
  distinctive_no,
  df_noOfShares,
  df_snum,
}) => {
  const [noOFShares, setNoOFShares] = useState(df_noOfShares || "");
  const [snum, setSNum] = useState(df_snum || "");
  useEffect(() => {
    if (calculated === true) {
      startCalculation({
        certificate_no: snum,
        distinctive_no: distinctive_no,
        shares_count: noOFShares,
      });
    }
  }, [calculated]);
  return (
    <>
      <tr>
        <td scope="col">
          <b>
            <input
              placeholder="Enter Cert No"
              value={snum}
              type="text"
              className="form-control"
              onChange={(e) => {
                setSNum(e.target.value);
              }}
              readOnly={df_snum}
              required
            />
          </b>
        </td>
        <td>
          <input
            placeholder="Enter Share Count"
            value={df_snum==true ? numberWithCommas(noOFShares) : noOFShares}
            type="number"
            className="form-control"
            onChange={(e) => {
              setNoOFShares(e.target.value);
            }}
            readOnly={df_noOfShares}
            required
          />
          <small className="text-danger"></small>
        </td>
         <td>
          {distinctive_no && distinctive_no.map((item) => (
            <input
              type="number"
              placeholder="Enter Number"
              className="form-control"
              value={item.from}
              readOnly
              required
            />
          ))}
        </td>
        <td>
          {distinctive_no && distinctive_no.map((item) => (
            <input
              type="number"
              placeholder="Enter Number"
              className="form-control"
              value={item.to}
              readOnly
              required
            />
          ))}
        </td>
      </tr>
    </>
  );
};

export default ViewSplitShareCertificateItem;
