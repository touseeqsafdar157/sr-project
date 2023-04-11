import React, { Fragment, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Spinner from "components/common/spinner";
// import { AddStatuaryEvent } from "./addStatuaryEvent";
import { ManualAlertModel } from "./manualAlertModel";
export default function ManualStatuaryAlert() {
  // const baseEmail = sessionStorage.getItem("email") || "";
  const [manualAlert, setManualalert] = useState(false);
  const [manualStatuaryData] = useState([
    { event: 'After AGM meeting', forms: 'Form A' },
    { event: 'End of calander year but no AGM', forms: 'Form A' },
    { event: 'Details of 25 percent or more holding', forms: 'Form 45' },
    { event: 'Increase in Paid Up Capital' , forms: 'Form 3'},
    { event: 'Increase in Paid Up Captial due to Bonus' , forms: 'Form 3'},
    { event: 'Increase in Paid Up Capital due to Right', forms: 'Form 3' },
    { event: 'Decrease in Paid Up Capital' , forms: 'Form 3'},
    { event: 'Decrease in Paid Up Capital due to Buy Back of shares' , forms: 'Form 3'},
    { event: 'Major Shareholder holding changed', forms: 'From 3A' },
    { event: 'Change of Principle Line of Business', forms: 'Form 4' },
    { event: 'Change of Province of company', forms: 'Form 5' },
    { event: 'Increase in Authorised Capital', forms: 'Form 7' },
    { event: 'Decrease in Authorised Capital', forms: 'Form 7' },
    { event: 'Company Name Change', forms: 'Form 8' },
    { event: 'Appointment of New Director', forms: 'Form 28' },
    { event: 'Change in Director', forms: 'Form 29' },
    { event: 'Change in CEO', forms: 'Form 29' },
    { event: 'Change in CFO', forms: 'Form 29' },
    { event: 'Change in CS', forms: 'Form 29' },
    { event: 'Change in Auditor', forms: 'Form 29' },
    { event: 'Change in Ledgal Advisor ', forms: 'Form 29' },
  ])
const [data, setData] =  useState(null)
  const displayStatuaryEventPerPage = manualStatuaryData.map((item, i) => (
    <tr key={i}>
      <td>{i + 1}</td>
      <td>{item.event}</td>
      <td>{item.forms}</td>
      <td>
        <button
          className="btn btn-secondary btn-sm my-1"
        onClick={()=>  {
          setManualalert(true)
          setData(item)
        }}
        >
          Send Alert
        </button>

      </td>

    </tr>
  ));


  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3">Manual Statutory Alerts Listing</h6>
        <Breadcrumb title="Manual Statutory Alerts Listing" parent="Company" />
      </div>
      <Modal isOpen={manualAlert} show={manualAlert.toString()} size="lg">
        <ModalHeader
          toggle={() => {
            setManualalert(false);
          }}
        >
         Manual Statutory Alerts
        </ModalHeader>
        <ModalBody>
          <ManualAlertModel setManualalert={setManualalert} data={data} />

        </ModalBody>
      </Modal>

      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              {!manualStatuaryData.length && <Spinner />}
              {manualStatuaryData.length !== 0 && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>SR No#</th>
                        <th>Event </th>
                        <th>Forms </th>
                        <th>Action</th>

                      </tr>
                    </thead>

                    <tbody>{displayStatuaryEventPerPage}</tbody>
                  </table>
                
                </div>
              )}
              {!manualStatuaryData?.length && (
                <p className="text-center">
                  <b> Manual Statutory Alerts Data not available</b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
