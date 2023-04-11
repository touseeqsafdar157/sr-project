import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
export const DistinctiveCounterItem = ({
  from,
  to,
  calculatedCounter,
  calculated,
}) => {
  useEffect(() => {
    if (calculated) {
      calculatedCounter({
        from: distinctiveFrom,
        to: distinctiveTo,
        count: distinctiveTo - distinctiveFrom + 1,
      });
    }
  }, [calculated]);
  const [distinctiveFrom, setDistinctiveFrom] = useState(from || "");
  const [distinctiveTo, setDistinctiveTo] = useState(to || "");
  return (
    <div className="row">
      <div className="col-sm-12 col-md-6 col-lg-6">
        {/* Distinctive FROM */}
        <div className="form-group ">
          <NumberFormat
            className="form-control"
            id="distinctive_from"
            decimalScale={2}
            placeholder="Enter Number"
            onChange={(e) => setDistinctiveFrom(e.target.value)}
            value={distinctiveFrom}
            readOnly={from}
          />
        </div>
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6">
        {/* Distinctive TO */}
        <div className="form-group">
          <NumberFormat
            className="form-control"
            id="distinctive_to"
            decimalScale={2}
            onChange={(e) => setDistinctiveTo(e.target.value)}
            value={distinctiveTo}
            placeholder="Enter Number"
            readOnly={to}
          />
        </div>
      </div>
    </div>
  );
};

export default DistinctiveCounterItem;
