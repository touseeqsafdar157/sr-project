import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import InputMask from "react-input-mask";
import ToggleButton from "react-toggle-button";

const JointHoldersItem = ({
  num,
  startCalculation,
  calculated,
  jh_name,
  jh_cnic,
  jh_percent,
  jh_filer,
  jh_cnic_expiry,
}) => {
  const [jointHolderName, setJointHolderName] = useState(jh_name || "");
  const [jointHolderCNIC, setJointHolderCNIC] = useState(jh_cnic || "");
  const [jointHolderCNICExpiry, setJointHolderCNICExpiry] = useState(
    jh_cnic_expiry || ""
  );
  const [jointHolderPercent, setJointHolderPercent] = useState(
    jh_percent || ""
  );
  const [filer, setFiler] = useState(jh_filer === "Y" || false);
  const borderRadiusStyle = { borderRadius: 2 };

  useEffect(() => {
    if (calculated === true) {
      startCalculation({
        jointHolderName,
        jointHolderCNIC,
        jointHolderPercent,
        jointHolderCNICExp: jointHolderCNICExpiry,
        filer: filer ? "Y" : "N",
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
            type="text"
            name="joint_name"
            id="joint_name"
            placeholder="Enter Name"
            className="form-control"
            value={jointHolderName}
            onChange={(e) => setJointHolderName(e.target.value)}
            readOnly={calculated}
          />
          <small className="text-danger"></small>
        </td>
        <td>
          <InputMask
            className="form-control"
            placeholder="Enter CNIC"
            mask="99999-9999999-9"
            value={jointHolderCNIC}
            onChange={(e) => setJointHolderCNIC(e.target.value)}
            readOnly={calculated}
          ></InputMask>
        </td>
        <td>
          <input
            type="date"
            name="jh_expiry"
            id="jh_expiry"
            className="form-control"
            value={jointHolderCNICExpiry}
            onChange={(e) => setJointHolderCNICExpiry(e.target.value)}
            readOnly={calculated}
          />
        </td>
        <td>
          <div className="input-group">
            <NumberFormat
              className="form-control"
              id="shareholder_percent"
              allowNegative={false}
              placeholder="Enter Number"
              value={jointHolderPercent}
              onChange={(e) => setJointHolderPercent(e.target.value)}
              readOnly={calculated}
            />
            <div className="input-group-append">
              <span className="input-group-text" id="basic-addon2">
                %
              </span>
            </div>
          </div>
        </td>
        <td>
          <ToggleButton
            value={filer}
            thumbStyle={borderRadiusStyle}
            trackStyle={borderRadiusStyle}
            onToggle={() => {
              !calculated && setFiler(!filer);
            }}
          />
        </td>
      </tr>
    </>
  );
};

export default JointHoldersItem;
