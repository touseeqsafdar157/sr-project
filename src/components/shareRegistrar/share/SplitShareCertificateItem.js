import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";

const SplitShareCertificateItem = ({
  // Validation
  register,
  index,
  errors,
  setValue,
  watch,
}) => {
  return (
    <>
      <tr>
        <td scope="col">
          <input
            name={`output_certificates[${index}]certificate_no`}
            placeholder="Enter Cert No"
            type="number"
            className={`form-control ${
              errors?.output_certificates?.[index]?.certificate_no &&
              "border border-danger"
            }`}
            {...register(`output_certificates.${index}.certificate_no`)}
          />
          <small className="text-danger">
            {errors?.output_certificates?.[index]?.certificate_no?.message}
          </small>
        </td>
        <td>
          <input
            name={`output_certificates[${index}]shares_count`}
            placeholder="Enter Share Count"
            type="number"
            className={`form-control text-right ${
              errors?.output_certificates?.[index]?.shares_count &&
              "border border-danger"
            }`}
            {...register(`output_certificates.${index}.shares_count`)}
          />
          <small className="text-danger">
            {errors?.output_certificates?.[index]?.shares_count?.message}
          </small>
        </td>
        <td>
          <input
            name={`output_certificates[${index}]from`}
            type="number"
            placeholder="Enter Number"
            className={`form-control ${
              errors?.output_certificates?.[index]?.from &&
              "border border-danger"
            }`}
            {...register(`output_certificates.${index}.from`)}
            onChange={(e) => {
              setValue(
                `output_certificates.${index}.to`,
                isNaN(
                  parseInt(watch(`output_certificates.${index}.shares_count`)) +
                    parseInt(e.target.value)
                )
                  ? "0"
                  : parseInt(
                      watch(`output_certificates.${index}.shares_count`)
                    ) +
                      parseInt(e.target.value) -
                      1
              );
            }}
          />
          <small className="text-danger">
            {errors?.output_certificates?.[index]?.from?.message}
          </small>
        </td>
        <td>
          <input
            name={`output_certificates[${index}]to`}
            type="number"
            placeholder="Enter Number"
            className={`form-control ${
              errors?.output_certificates?.[index]?.to && "border border-danger"
            }`}
            {...register(`output_certificates.${index}.to`)}
            readOnly
          />
          <small className="text-danger">
            {errors?.output_certificates?.[index]?.to?.message}
          </small>
        </td>
      </tr>
    </>
  );
};

export default SplitShareCertificateItem;
