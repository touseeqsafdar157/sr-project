import React, { useState, useEffect } from "react";
import Select from "react-select";
import * as _ from "lodash";
import { errorStyles } from "../../defaultStyles";
import { IsJsonString } from "../../../utilities/utilityFunctions";
const TransferOfSharesItem = ({
  certificates,
  num,
  index,
  startCalculation,
  setSelectedCerts,
  selectedCerts,
  calculated,
  df_from,
  df_to,
  df_count,
  df_cert,
}) => {
  const [fromValue, setFromValue] = useState(df_from || "");
  const [toValue, setToValue] = useState(df_to || "");
  const [noOFShares, setNoOFShares] = useState(df_count || "");
  const [selectedCertifcate, setSelectedCertifcate] = useState(df_cert || "");
  useEffect(() => {
    if (calculated === true) {
      startCalculation({
        certificate_no: selectedCertifcate,
        distinctive_no: !!associatedCertifcate()?.from
          ? [
              {
                from: associatedCertifcate()?.from,
                to: associatedCertifcate()?.to,
                count:
                  associatedCertifcate()?.to - associatedCertifcate()?.from + 1,
              },
            ]
          : [...associatedCertifcate()?.selected_certs],
        from: associatedCertifcate().from,
        to: associatedCertifcate().to,
        shares_count: associatedCertifcate().shares_count,
      });
    }
  }, [calculated]);
  const associatedCertifcate = () => {
    const selectedCert =
      !!selectedCertifcate &&
      IsJsonString(
        certificates.find((cert) => selectedCertifcate === cert.certificate_no)
          ?.distinctive_no
      ) &&
      JSON.parse(
        certificates.find((cert) => selectedCertifcate === cert.certificate_no)
          .distinctive_no
      );
    const shares_count =
      !!selectedCertifcate &&
      certificates.find((cert) => selectedCertifcate === cert.certificate_no)
        ?.shares_count;
    return !!selectedCertifcate && selectedCert.length === 1
      ? { shares_count: shares_count, ...selectedCert[0] }
      : { shares_count: shares_count, selected_certs: selectedCert };
  };
  return (
    <>
      <tr>
        <td>
          <Select
            isLoading={certificates.length === 0 && !selectedCertifcate}
            options={certificates.map((cert) => ({
              label: cert.certificate_no,
              value: cert.certificate_no,
            }))}
            defaultValue={df_cert ? { value: df_cert, label: df_cert } : null}
            // isDisabled={df_cert}
            onChange={(selected) => {
              if (!!selectedCerts) {
                if (!!selected) {
                  const arr = selectedCerts;
                  arr.push(selected.value);
                  setSelectedCerts(_.uniq(arr));
                } else {
                  const arr = selectedCerts;
                  arr.pop(selectedCertifcate?.value);
                  setSelectedCerts(_.uniq(arr));
                }
              }
              setSelectedCertifcate(selected.value);
            }}
            id="trans_folio_number"
            placeholder="Select Certificate No"
            menuPortalTarget={document.querySelector("root")}
          />
        </td>
        <td>
          <input
            placeholder="Enter Number"
            type="number"
            name="certificate_no"
            className="form-control"
            value={associatedCertifcate()?.shares_count || df_count}
            readOnly
          />
        </td>
        <td>
          {!!associatedCertifcate()?.shares_count ? (
            !!associatedCertifcate()?.from ? (
              <input
                type="number"
                placeholder="Enter Number"
                className="form-control"
                value={associatedCertifcate().from || df_from}
                readOnly
              />
            ) : (
              associatedCertifcate().selected_certs.map((item) => (
                <input
                  type="number"
                  placeholder="Enter Number"
                  className="form-control"
                  value={item.from}
                  readOnly
                />
              ))
            )
          ) : (
            <input
              type="number"
              placeholder="Enter Number"
              className="form-control"
              value={"0"}
              readOnly
            />
          )}
        </td>
        <td>
          {!!associatedCertifcate()?.shares_count ? (
            !!associatedCertifcate()?.to ? (
              <input
                type="number"
                placeholder="Enter Number"
                className="form-control"
                value={associatedCertifcate().to || df_to}
                readOnly
              />
            ) : (
              associatedCertifcate().selected_certs.map((item) => (
                <input
                  type="number"
                  placeholder="Enter Number"
                  className="form-control"
                  value={item.to}
                  readOnly
                />
              ))
            )
          ) : (
            <input
              type="number"
              placeholder="Enter Number"
              className="form-control"
              value={"0"}
              readOnly
            />
          )}
        </td>
      </tr>
    </>
  );
};

export default TransferOfSharesItem;
