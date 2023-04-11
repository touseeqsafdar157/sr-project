import React, { useState, useEffect } from "react";
import Select from "react-select";
const TransmissionCertificateItem = ({
  folio_options,
  num,
  startCalculation,
  calculated,
}) => {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [noOFShares, setNoOFShares] = useState("");
  useEffect(() => {
    if (calculated === true) {
      startCalculation({
        certificate_no: num,
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
          <Select
            isLoading={folio_options.length === 0}
            options={folio_options}
            id="folio_number"
            placeholder="Select Folio Number"
          />
        </td>
        <td>
          <input
            placeholder="Enter Number"
            type="number"
            name="certificate_no"
            className="form-control"
            readOnly={calculated}
          />
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
          />
        </td>
        <td>
          <input
            type="number"
            className="form-control"
            placeholder="Enter To"
            value={toValue}
          />
        </td>
        <td>
          <input
            type="number"
            className="form-control"
            placeholder="Enter To"
            value={toValue}
          />
        </td>
      </tr>
    </>
  );
};

export default TransmissionCertificateItem;
