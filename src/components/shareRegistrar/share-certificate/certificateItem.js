import React, { useState, useEffect } from "react";

const CertificateItem = ({ num, startCalculation, calculated }) => {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [noOFShares, setNoOFShares] = useState("");
  useEffect(() => {
    if (calculated === true) {
      startCalculation({
        certificate_no: num.toString(),
        distinctive_no: [
          {
            from: fromValue,
            to: toValue.toString(),
            count: toValue - fromValue + 1,
          },
        ],
        from: fromValue,
        to: toValue.toString(),
        shares_count: noOFShares,
      });
    }
  }, [calculated]);
  return (
    <>
      <tr>
        <td scope="col">
          <b>{num}</b>
        </td>
        <td>
          <input
            placeholder="Enter Share Count"
            value={noOFShares}
            type="number"
            name=""
            className="form-control"
            onChange={(e) => {
              setNoOFShares(e.target.value);
            }}
            readOnly={calculated}
            required
          />
          <small className="text-danger"></small>
        </td>
        <td>
          <input
            type="number"
            placeholder="Enter Number"
            className="form-control"
            value={fromValue}
            onChange={(e) => {
              setFromValue(e.target.value);
              setToValue(
                isNaN(parseInt(noOFShares) + parseInt(e.target.value))
                  ? "0"
                  : parseInt(noOFShares) + parseInt(e.target.value) - 1
              );
            }}
            readOnly={calculated}
            required
          />
        </td>
        <td>
          <input
            type="number"
            className="form-control"
            placeholder="Enter To"
            value={toValue}
            //  onChange={(e) =>  (parseInt(e.target.value) > parseInt(fromValue) ) && setToValue(parseInt(e.target.value)) }
            // onChange={(e) => {
            //   setToValue(e.target.value);
            //   // setToValue(e.target.value);
            //   // setShareCount(e.target.value - fromValue);
            //   // setCompanySharesCount(e.target.value + fromValue);
            // }}
            readOnly
            required
          />
        </td>
      </tr>
    </>
  );
};

export default CertificateItem;
