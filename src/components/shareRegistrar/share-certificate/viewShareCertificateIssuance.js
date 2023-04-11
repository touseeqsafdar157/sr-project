import moment from "moment";
import React, { Fragment, useState, useEffect } from "react";
import { isNumber, isValidDate } from "utilities/utilityFunctions";




export default function ViewShareCertificateIssuance() {
  const request = JSON.parse(sessionStorage.getItem("selectedInvestorRequest"));

  return (
    <Fragment>
      <div className="row">
        <div className="col-md-6">
          <div className="card ">
            <div className="card-header b-t-primary">
              <h5>Certificate Issuance Details</h5>
            </div>
            <div className="card-body">
              <div className="form-group mb-3">
                <label>Company Code </label>
                <input
                  name=""
                  className="form-control"
                  value={request?.company_code?.label}
                  disabled
                />
                <small className="text-danger">
                </small>
              </div>

              <div className="form-group mb-3">
                <label>Share Allotment To (Folio Number) </label>
                <input
                  name=""
                  className="form-control"
                  value={request?.folio_number?.label}
                  disabled
                />
                <small className="text-danger">
                </small>
              </div>

              <div className="form-group mb-3">
                <label>Issue Date </label>
                <input
                  name=""
                  className="form-control"
                  value={moment(request?.txn_date).format('DD/MM/YYYY')}
                  disabled
                />
                <small className="text-danger">
                </small>
              </div>

            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card ">
            <div className="card-header b-t-success">
              <h5>Share Alloted Detail</h5>
            </div>
            <div className="card-body">

              <div className="form-group mb-3">
                <label>Type </label>
                <input
                  name=""
                  className="form-control"
                  value={'Issue of Share'}
                  disabled
                />
                <small className="text-danger">
                </small>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label>Certificate No. From </label>
                    <input
                      name=""
                      className="form-control"
                      value={JSON.parse(request.output_certificates)[0].certificate_no.replace(`${request?.company_code.value}-`,'')}
                      disabled
                    />
                    <small className="text-danger">
                    </small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label>Certificate No. To </label>
                    <input
                      name=""
                      className="form-control"
                      value={JSON.parse(request.output_certificates)[JSON.parse(request.output_certificates).length - 1].certificate_no.replace(`${request?.company_code.value}-`,'')}
                      disabled
                    />
                    <small className="text-danger">
                    </small>
                  </div>
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Total Share Count </label>
                <input
                  name=""
                  className="form-control"
                  value={(JSON.parse(request.output_certificates).reduce(
                    (previousScore, currentScore, index) => previousScore + parseFloat(isNumber(currentScore.shares_count)),
                    0))}
                  disabled
                />
                <small className="text-danger">
                </small>
              </div>

            </div>
          </div>
        </div>



        {/* <div className="row">
          <div className="col-md-12  ml-3">
            <button className="btn btn-primary">Submit</button>
          </div>
        </div> */}

      </div>
      <div className="row">
        <div className="card w-100 mx-4">
          <div className="card-header b-t-success">
            <b>CERTIFICATES</b>
          </div>
          <div className="card-body">
            {/* {watch("certificate_to") && watch("certificate_from") && ( */}
            <table className="table">
              <thead>
                <tr>
                  <th className="text-nowrap">Certificate No.</th>
                  <th className="text-nowrap text-right">No of Shares</th>
                  <th className="text-nowrap">Distinctive No. From</th>
                  <th className="text-nowrap">Distinctive To</th>
                </tr>
              </thead>
              <tbody>
                {
                  JSON.parse(request.output_certificates).map((item => {
                    return (
                      <tr>
                        <td className="text-nowrap">{item.certificate_no}</td>
                        <td className="text-nowrap text-right">{parseFloat(isNumber(item.shares_count))}</td>
                        <td className="text-nowrap">{item.from}</td>
                        <td className="text-nowrap">{item.to}</td>
                      </tr>
                    )
                  }))
                }
                {/* {fields.map((item, index) => (
                      <SplitShareCertificateItem
                        key={item.id}
                        // Validation
                        register={register}
                        index={index}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                      />
                    ))} */}
                {/* {Math.abs(
                      parseInt(watch("certificate_to")) -
                        parseInt(watch("certificate_from"))
                    ) +
                      1 <=
                      20 &&
                      [
                        ...Array(
                          Math.abs(
                            parseInt(watch("certificate_to")) -
                              parseInt(watch("certificate_from"))
                          ) + 1
                        ),
                      ].length > 0 &&
                      [
                        ...Array(
                          Math.abs(
                            parseInt(watch("certificate_to")) -
                              parseInt(watch("certificate_from"))
                          ) + 1
                        ),
                      ].map((cert, index) => (
                        <CertificateItem
                          key={index}
                          startCalculation={startCalculation}
                          calculated={startcalculation}
                          num={parseInt(watch("certificate_from")) + index}
                        />
                      ))} */}
              </tbody>
            </table>
            {/* )} */}
          </div>
        </div>
      </div>
    </Fragment >
  )
}

