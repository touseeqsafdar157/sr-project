import React, { useState, useEffect } from "react";
import Select from "react-select";
import * as _ from "lodash";
import { IsJsonString } from "../../../utilities/utilityFunctions";

const ElectronicTransmissionOfSharesItem = ({
  folios,
  startCalculation,
  calculated,
  num,
  df_count,
  df_folio,
}) => {
  const [noOFShares, setNoOFShares] = useState(df_count || "");
  const [selectedFolio, setSelectedFolio] = useState(null);
  useEffect(() => {
    if (calculated === true) {
      startCalculation({
        shares_count: noOFShares,
        folio_number: selectedFolio?.value,
      });
    }
  }, [calculated]);
  useEffect(() => {
    if (df_folio) {
      setSelectedFolio(folios.find((item) => item.value === df_folio));
    }
  }, [folios, df_folio]);

  return (
    <>
      <tr>
        <td scope="col">{num}</td>

        <td>
          <input
            placeholder="Enter Number"
            type="number"
            name="shares"
            min="0"
            className="form-control"
            onChange={(e) => setNoOFShares(e.target.value)}
            value={noOFShares}
            readOnly={df_count}
          />
        </td>

        <td>
          <Select
            isLoading={folios.length === 0}
            options={folios}
            value={selectedFolio}
            isDisabled={df_folio}
            id="trans_folio_number"
            placeholder="Select Folio No"
            menuPortalTarget={document.querySelector("root")}
            onChange={(selected) => setSelectedFolio(selected?.value)}
          />
        </td>
      </tr>
    </>
  );
};

export default ElectronicTransmissionOfSharesItem;
