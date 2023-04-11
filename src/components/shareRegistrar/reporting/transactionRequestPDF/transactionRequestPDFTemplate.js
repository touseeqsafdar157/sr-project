import {
  SPLIT_SHARES_TEMPLATE,
  CONSOLIDATE_SHARES_TEMPLATE,
  DUPLICATE_SHARES_TEMPLATE,
  TRANSFER_OF_SHARES_TEMPLATE,
  PHYSICAL_TO_ELECTRONIC_TEMPLATE,
  ELECTRONIC_TO_PHYSICAL_TEMPLATE,
  RIGHT_SUBSCRIBTION_TEMPLATE,
  TRANSFER_RIGHT_SHARES_TEMPLATE,
  VERIFICATION_TRANSFER_DEED_TEMPLATE,
  ISSUE_OF_SHARES_TEMPLATE,
  TRANSMISSION_OF_SHARES_TEMPLATE,
} from "constant";
import { getvalidDateDMY, IsJsonString, numberWithCommas } from "utilities/utilityFunctions";

export default function transactionRequestPDFTemplate(
  from_shareholder,
  to_shareholder,
  from_investor,
  to_investor,
  transaction_request,
  investor_request,
  // for transmission of shares only
  to_investors,
  to_shareholders
) {
  from_investor = from_investor && from_investor[0];

  console.log(investor_request, 'data', transaction_request)
  // console.log(JSON.parse(investor_request.output_certificates))
  const inputCertificates = IsJsonString(transaction_request && transaction_request.input_certificates)
    ? JSON.parse(transaction_request.input_certificates)
    : false;
  const outputCertificates = IsJsonString(
    transaction_request.output_certificates
  )
    ? JSON.parse(transaction_request.output_certificates)
    : false;

  function transmissionInvestors(toInvestors, toShareholders) {
    // console.log("🚀 ~ file: transactionRequestPDFTemplate.js:41 ~ transmissionInvestors ~ toInvestors:", toInvestors)
    let transmissionInvestor = "";
    toShareholders.forEach((item, index) => {
      transmissionInvestor += `
      <tr><td> <b> To Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Investor Name </td> 
        <td> ${item?.shareholder_name} </td>    
      </tr>
      <tr>
        <td>Folio Number</td>
        <td>${item?.folio_number}</td>
      </tr>
      <tr>
        <td> CNIC/NTN </td> 
        <td> ${toInvestors[index]?.investor_id} </td> 
        <td>Country</td>
        <td>${item?.country}</td>
      </tr>
      <tr>
        <td>Father Name</td>
        <td>${toInvestors[index]?.father_name}</td>
        <td>Spouse</td>
        <td>${toInvestors[index]?.spouse_name}</td>
      </tr>
      <tr>
        <td>Category</td>
        <td>${toInvestors[index]?.category}</td>
        <td>Occupation</td>
        <td>${toInvestors[index]?.occupation}</td>
      </tr>
      <tr>
        <td>Religion</td>
        <td>${toInvestors[index]?.religion}</td> 
        <td>City</td>
        <td>${item?.city}</td>
      </tr> 
      `;
    });
    return transmissionInvestor;
  }

  function transmissionInputHandler(inputCertificates) {
    let inputDistinctive = "";
    let certificateNumber;
    let folioNumber;
    for (let input of inputCertificates) {
      certificateNumber = input.certificate_no;
      folioNumber = input.folio_number;
      for (let distinctiveItem of JSON.parse(input.distinctive_no && input.distinctive_no)) {
        inputDistinctive += `<tr>
        <td>${certificateNumber}</td>
        <td> ${distinctiveItem.from} </td>
        <td> ${distinctiveItem.to} </td>
        <td> ${numberWithCommas(distinctiveItem.count)} </td>
        <td> ${folioNumber} </td>
        </tr>`;
      }
    }
    return inputDistinctive;
  }
  // Consolidate Input
  function consolidateInputHandler(inputCertificates) {
    let inputDistinctive = "";
    let certificateNumber;
    for (let input of inputCertificates) {
      certificateNumber = input.certificate_no;
      input.distinctive_no = JSON.parse(input.distinctive_no)
      for (let distinctiveItem of input.distinctive_no) {
        inputDistinctive += `<tr>
        <td>${certificateNumber}</td>
        <td> ${distinctiveItem.from} </td>
        <td> ${distinctiveItem.to} </td>
        <td> ${numberWithCommas(distinctiveItem.count)} </td>
        </tr>`;
      }
    }
    return inputDistinctive;
  }

  // Consolidate Output
  function consolidateOutHandler(outputCertificates) {
    let consolidateOutputItems = "";
    let outPutCertificateNumber;
    for (let consolidateOutput of outputCertificates) {
      outPutCertificateNumber = consolidateOutput.certificate_no;
      for (let distinctiveItem of consolidateOutput.distinctive_no) {
        consolidateOutputItems += `<tr>
        <td>${outPutCertificateNumber}</td>
        <td>${distinctiveItem.from}</td>
        <td>${distinctiveItem.to}</td>
        <td>${numberWithCommas(consolidateOutput.shares_count)}</td>
        </tr>`;
      }
    }
    return consolidateOutputItems;
  }

  // Electronic to Physical
  function cphHandler(inputCertificates) {
    let distinctiveNumber = "";
    for (let distNo of inputCertificates) {
      distinctiveNumber += `<tr>
      <td>${distNo.allotted_to}</td>
      <td>${distNo.certificate_no}</td>
      <td>${JSON.parse(distNo.distinctive_no)[0].from}</td>
      <td>${JSON.parse(distNo.distinctive_no)[0].to}</td>
      <td>${numberWithCommas(JSON.parse(distNo.distinctive_no)[0].count)}</td>
      </tr>`;
    }
    return distinctiveNumber;
  }


  const certificateofTOSHandler = () => {
    let distinctiveNumber = "";
    for (let distNo of JSON.parse(transaction_request.input_certificates)) {
      distinctiveNumber += `<tr>
      <td>${distNo.certificate_no}</td>
      <td>${JSON.parse(distNo.distinctive_no)[0].from}</td>
      <td>${JSON.parse(distNo.distinctive_no)[0].to}</td>
      <td>${numberWithCommas(JSON.parse(distNo.distinctive_no)[0].count)}</td>
      </tr>`;
    }
    return distinctiveNumber;
  }

  const inputCertificatesSPLHandler = () => {
    let distinctiveNumber = "";
    let i = 0;
    for (let dist_no of JSON.parse(inputCertificates[0]?.distinctive_no)) {
      distinctiveNumber += `<tr>
      <td>${JSON.parse(transaction_request?.input_certificates)[i]?.certificate_no}</td>
      <td>${dist_no?.from}</td>
      <td>${dist_no?.to}</td>
      <td>${numberWithCommas(dist_no?.count)}</td>
      </tr>`;
    }
    return distinctiveNumber;
  }
   
  const inputCerticateofVTDHandler = () => {
    let distinctiveNumber = "";
    let i = 0;
    for (let dist_no of JSON.parse(transaction_request.input_certificates)) {
      distinctiveNumber += `<tr>
      <td>${dist_no.certificate_no}</td>
        <td>${JSON.parse(dist_no.distinctive_no)[0].from}</td>
        <td>${JSON.parse(dist_no.distinctive_no)[0].to}</td>
      <td>${numberWithCommas(dist_no?.count)}</td>
      </tr>`;
    }
    return distinctiveNumber;
  }
  const outputCertificatesSPLHandler = () => {
    let distinctiveNumber = "";
    let i = 0;
    for (let certificate of JSON.parse(transaction_request.output_certificates) && JSON.parse(transaction_request.output_certificates)) {
      distinctiveNumber += `<tr><td>${certificate.company_code}-${certificate.certificate_no}</td>
      <td>${certificate.distinctive_no[0].from}</td>
       <td>${certificate.distinctive_no[0].to}</td>
      <td>${certificate.distinctive_no[0].count}</td>
      </tr>`;
    }
    return distinctiveNumber;
  }

  const inputCertificateDUPHandler = () => {
    let distinctiveNumber = "";
    for (let dist_no of JSON.parse(transaction_request.input_certificates)) {
      distinctiveNumber += `<tr>
      <td>${dist_no.certificate_no}</td>
        <td>${JSON.parse(dist_no.distinctive_no)[0].from}</td>
        <td>${JSON.parse(dist_no.distinctive_no)[0].to}</td>
      <td>${numberWithCommas(JSON.parse(dist_no.distinctive_no)[0].count)}</td>
      </tr>`;
    }
    return distinctiveNumber;
  }
  
 const outputCertificateDUPHandler = () => {
    let distinctiveNumber = "";
    for (let dist_no of JSON.parse(transaction_request.input_certificates)) {
      distinctiveNumber += `<tr>
      <td>${dist_no.company_code}-${dist_no.certificate_no}</td>
        <td>${JSON.parse(dist_no.distinctive_no)[0].from}</td>
        <td>${JSON.parse(dist_no.distinctive_no)[0].to}</td>
      <td>${numberWithCommas(JSON.parse(dist_no.distinctive_no)[0].count)}</td>
      </tr>`;
    }
    return distinctiveNumber;
  }



  const requestTypeName =
    investor_request?.request_type === "TOS"
      ? "Transfer of Shares"
      : investor_request?.request_type === "TRS"
        ? "Transmission of Shares"
        : investor_request?.request_type === "SPL"
          ? "Split Shares"
          : investor_request?.request_type === "CON"
            ? "Consolidate Shares"
            : investor_request?.request_type === "DUP"
              ? "Duplicate Shares"
              : investor_request?.request_type === "CEL"
                ? "Physical To Electronic"
                : investor_request?.request_type === "CPH"
                  ? "Electronic To Physical"
                  : investor_request?.request_type === "RSUB"
                    ? "Right Subscription"
                    : investor_request?.request_type === "TOR"
                      ? "Transfer of Right Shares"
                      : investor_request?.request_type === "VTD"
                        ? "Verification of Transfer Deed"
                        : investor_request?.txn_type === "ISH"
                          ? "Issue of Shares"
                          : "Invalid Transaction Request";

  const headerSection = `<html>
    <head>
        <title>Share Registrar</title>
    </head>
    <body style="font-family:Arial">
        <header>
            <table width="100%">
            <tr>
                <td colspan="3" style="text-align:center;margin-bottom:3px; font-size:22px;"><b>${requestTypeName}</b></td>
            </tr> 
            </table>
        </header> `;
  {/* <header>
            <table width="100%">
            <tr>
                <td colspan="3" style="text-align:center;margin-bottom:3px; font-size:22px;"><b>${requestTypeName}</b></td>
            </tr> 
            <tr>
                <td colspan="3" style="text-align:center;margin-bottom:3px; font-size:22px;"><b>${requestTypeName}</b></td>
            </tr> 
            </table>
        </header> */}
  const tosTemplate =
    investor_request?.request_type === "TOS" && `
      ${headerSection}
          <table width="100%; line-height="2"; style="line-height:2">
                <tr>
                  <td> <b>Transferee Shareholder Detail:</b></td>
                  <td colspan="3"><hr /></td>
                </tr>
                <tr>
                    <td><b> Transfer No     </td>
                    <td>  :${investor_request?.transfer_no} </td>

                    <td><b><b>Transfer Date </td>
                    <td> :${getvalidDateDMY(investor_request?.txn_execution_date)} </td>  
                </tr>

                <tr>
                    <td><b> Transferee Folio Number </td>
                    <td> :${to_shareholder?.folio_number}  </td> 

                    <td><b> Transaction ID </td>
                    <td> :${transaction_request?.txn_id} </td>  
                </tr>
                <tr>
                  <td><b> Execution Date </td>
                  <td> :${getvalidDateDMY(investor_request?.txn_execution_date)} </td>  
                </tr>

                <tr>
                    <td><b> Transferee Name </td>
                    <td> ${to_investor?.investor_name} </td> 
                    <td><b> CNIC Number</td>
                    <td> :${to_investor?.cnic}</td>  
                </tr>

                <tr>
                  <td><b> Father's Name</td>
                  <td> :${to_investor?.father_name}</td> 
                  <td><b> Spouse Name</td>
                  <td> :${to_investor?.spouse_name}</td> 
                </tr> 
               
                <tr> 
                    <td><b> Address </td>
                    <td colspan="3"> :${to_shareholder?.street_address}, ${to_shareholder?.city
    },${to_shareholder?.country === undefined ? '' : to_shareholder?.country} 
                    </td> 
                </tr>
                 
                <tr>
                    <td><b>Bank Address</td>
                    <td colspan="3"> :${to_shareholder?.bank_name}, ${to_shareholder?.baranch_address
    }, ${to_shareholder?.baranch_city === undefined ? '' : to_shareholder?.baranch_city} </td>
                </tr>

                <tr>
                    <td><b> Occupation  </td>
                    <td> :${to_investor?.occupation}</td>
                    <td><b> Religion </td>
                    <td> :${to_investor?.religion}  </td> 
                </tr>

                <tr>
                    <td><b> Category  </td>
                    <td> :${to_investor?.category}</td>
                    <td><b> Tax Rate</td>
                    <td> :  </td> 
                </tr>

                <tr>
                    <td><b> City  </td>
                    <td> :${to_shareholder?.city}</td>
                    <td><b> Country</td>
                    <td> :${to_shareholder?.country === undefined ? '' : to_shareholder?.country} </td> 
                </tr>

                <tr>
                    <td><b>NTN</td>
                    <td>:${to_investor?.ntn}</td>
                    <td><b>Processing Status</td>
                    <td> <b>: ${transaction_request?.processing_status}</b></td>
                </tr>

                <tr><td> <b> Transferor Detail:</b></td> <td colspan="3"><hr /></td></tr>
                <tr>
                  <td><b>CNIC</td>
                  <td>:${(from_investor?.cnic === 'null' && from_investor?.cnic === null) ? '' : from_investor?.cnic}</td>
                  <td><b>Folio Number</td>
                  <td>:${from_shareholder?.folio_number}</td>
                </tr>
                <tr>
                  <td><b>Name</td>
                  <td>:${from_investor?.investor_name}</td>
                </tr>

                <tr><td> <b> Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
                <tr>
                  <th>Certificate No</th>
                  <th>Distinctive From</th>
                  <th>Distinctive To</th>
                  <th>Shares Count</th>
                </tr> 
                  ${certificateofTOSHandler()}
                <tr>
                  <th>No of Shares:</th>
                  <th>${transaction_request?.quantity}</th>
                </tr>
                </table>  
                </body>
                </html>
                `;

  const splitTemplate =
    investor_request?.request_type === "SPL" &&
    `${headerSection}
  <table width="100%" line-height="2"; style="line-height:2" >
    <tr><td> <b> Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Folio Number </td>
        <td> ${from_shareholder?.folio_number}  </td> 
        <td> Name </td>
        <td> ${from_investor?.investor_name}  </td> 
      </tr>


      <tr>
        <td> Execution Date </td>
        <td> ${getvalidDateDMY(investor_request?.txn_execution_date)} </td>  
        <td>Processing Status</td>
        <td> <b> ${transaction_request?.processing_status}</b></td>
      </tr>

      <tr>
        <td> Transaction ID </td>
        <td> ${transaction_request?.txn_id} </td>  
        <td> Number of Certificates</td>
        <td> <b> ${numberWithCommas(transaction_request?.quantity)}</b></td>
      </tr>

      <tr>
        <td> Company Symbol </td>
        <td>  ${investor_request?.symbol} </td> 
      </tr>

      <tr><td> <b> Input Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th>
        <th>Shares Count</th>
      </tr>
      ${inputCertificatesSPLHandler()}
     
      <tr><td> <b> Output Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th> 
        <th>Shares Count</th>
      </tr>
      ${outputCertificatesSPLHandler()}
  </table>
  `;
  const consolidateTemplate =
    investor_request?.request_type === "CON" &&
    `${headerSection}
  <table width="100%" line-height="2"; style="line-height:2" >
    <tr><td> <b> Requestor Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Folio Number </td>
        <td> ${from_shareholder?.folio_number}  </td>  
      </tr>
      <tr>
        <td> Name </td>
        <td>  ${from_investor?.investor_name} </td> 
      </tr> 
      <tr>
        <td> Company Symbol </td>
        <td>  ${investor_request?.symbol} </td> 
      </tr> 
      <tr><td> <b> Transaction Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Execution Date </td>
        <td> ${getvalidDateDMY(transaction_request?.txn_execution_date)} </td>  
        <td>Processing Status</td>
        <td> <b> ${transaction_request?.processing_status}</b></td>
      </tr>

      <tr>
        <td> Transaction ID </td>
        <td> ${transaction_request?.txn_id} </td>  
      
      </tr>  

      <tr>
        <td> Remarks </td>
        <td> ${transaction_request?.remarks} </td>  
      </tr>
      
      <tr><td> <b> Input Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr> 
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th> 
        <th>Count</th>
      </tr> 

      ${consolidateInputHandler(inputCertificates)}
  

      <tr><td> <b> Output Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th> 
        <th>Shares Count</th>
      </tr>

      ${consolidateOutHandler(outputCertificates)}
      
  </table>`;

  const duplicateTemplate =
    investor_request?.request_type === "DUP" &&
    `${headerSection}
  <table width="100%" line-height="2"; style="line-height:2" >
    <tr><td> <b> Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Folio Number </td>
        <td> ${from_shareholder?.folio_number}  </td> 
        <td> Name </td>
        <td> ${from_investor?.investor_name}  </td> 
      </tr>

      <tr>
        <td> Transfer Date </td>
        <td> ${getvalidDateDMY(investor_request?.closed_date)} </td>  
        <td>Processing Status</td>
        <td> <b> ${transaction_request?.processing_status}</b></td>
      </tr>

      <tr>
        <td> Transaction ID </td>
        <td> ${transaction_request?.txn_id} </td>  
        <td> Number of Certificates</td>
        <td> <b> ${numberWithCommas(transaction_request?.quantity)}</b></td>
      </tr>

      <tr><td> <b> Input Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th>
        <th>Shares Count</th>
      </tr>
          ${inputCertificateDUPHandler()}
      <tr><td> <b> Output Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th> 
        <th>Shares Count</th>
      </tr>
      ${outputCertificateDUPHandler()}

  </table>`;
  const physicalToElectronicTemplate =
    investor_request?.request_type === "CEL" &&
    `${headerSection}
  <table width="100%" line-height="2"; style="line-height:2" >
    <tr><td> <b> Requestor Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>

    <tr>
        <td> Folio Number </td>
        <td> ${from_shareholder?.folio_number}  </td>  
      </tr>
      <tr>
        <td> Name </td>
        <td>  ${from_investor?.investor_name} </td> 
      </tr>

      <tr>
        <td> Company Symbol </td>
        <td>  ${investor_request?.symbol} </td> 
      </tr> 

      <tr><td> <b> To Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Folio Number </td>
        <td> ${to_shareholder?.folio_number}  </td> 
      </tr>
      <tr>
        <td> Name </td>
        <td> ${to_investor?.investor_name}  </td> 
      </tr>  

      <tr><td> <b> Transaction Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Transfer Date </td>
        <td> ${getvalidDateDMY(investor_request?.closed_date)} </td>  
        <td>Processing Status</td>
        <td> <b> ${transaction_request?.processing_status}</b></td>
      </tr>

      <tr>
        <td> Transaction ID </td>
        <td> ${transaction_request?.txn_id} </td>  
        <td> Number of Shares</td>
        <td> <b> ${numberWithCommas(transaction_request?.quantity)}</b></td>
      </tr>

      <tr>
        <td> Transfer Number </td>
        <td> ${transaction_request?.transfer_no} </td>  
        <td> Reference No</td>
        <td> <b> ${transaction_request?.reference}</b></td>
      </tr>

      <tr>
        <td> Remarks </td>
        <td> ${transaction_request?.remarks} </td>  
      </tr>

      
      <tr><td> <b> Input Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th> 
        <th>Shares Count</th>
      </tr>
      ${JSON.parse(transaction_request.input_certificates).map(
      (certificate) => {
        return `<tr><td>${certificate.certificate_no}</td>
          <td>${JSON.parse(certificate.distinctive_no)[0].from}</td>
          <td>${JSON.parse(certificate.distinctive_no)[0].to}</td>
          <td>${numberWithCommas(JSON.parse(certificate.distinctive_no)[0].count)}</td>
          </tr>`;
      }
    )}
  </table>
  `;
  const electronicToPhysicalTemplate =
    investor_request?.request_type === "CPH" &&
    `${headerSection}
  <table width="100%" line-height="2"; style="line-height:2" >
    <tr><td> <b> Requestor Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Folio Number </td>
        <td> ${from_shareholder?.folio_number}  </td>  
      </tr>
      <tr>
        <td> Name </td>
        <td>  ${from_investor?.investor_name} </td> 
      </tr>

      <tr>
        <td> Company Symbol </td>
        <td>  ${investor_request?.symbol} </td> 
      </tr> 

      <tr><td> <b> To Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Folio Number </td>
        <td> ${to_shareholder?.folio_number}  </td> 
      </tr>
      <tr>
        <td> Name </td>
        <td> ${to_investor?.investor_name}  </td> 
      </tr>
      <tr><td> <b> Transaction Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Transfer Date </td>
        <td> ${getvalidDateDMY(investor_request?.closed_date)} </td>  
        <td>Processing Status</td>
        <td> <b> ${transaction_request?.processing_status}</b></td>
      </tr>

      <tr>
        <td> Transaction ID </td>
        <td> ${transaction_request?.txn_id} </td>  
        <td> No of Electronic Shares</td>
        <td> <b> ${numberWithCommas(transaction_request?.quantity)}</b></td>
      </tr> 

      <tr>
        <td> Transfer Number </td>
        <td> ${transaction_request?.transfer_no} </td>  
        <td> Reference No</td>
        <td> <b> ${transaction_request?.reference}</b></td>
      </tr>

      <tr>
        <td> Remarks </td>
        <td> ${transaction_request?.remarks} </td>  
      </tr>
      
      <tr><td> <b> Input Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <th>Alloted To</th>
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th> 
        <th>Count</th>
      </tr> 
 
        ${cphHandler(inputCertificates)} 

      <tr><td> <b> Output Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th> 
        <th>Shares Count</th>
      </tr>
      ${JSON.parse(transaction_request.output_certificates).map(
      (certificate) => {
        return `<tr><td>${certificate.company_code}-${certificate.certificate_no}</td>
          <td>${JSON.parse(certificate.distinctive_no)[0].from}</td>
          <td>${JSON.parse(certificate.distinctive_no)[0].to}</td>
          <td>${numberWithCommas(JSON.parse(certificate.distinctive_no)[0].count)}</td>
          </tr>`;
      }
    )}
  </table>`;
  const transferRightSharesTemplate =
    investor_request?.request_type === "TOR" &&
    `${headerSection}
  <table width="100%" line-height="2"; style="line-height:2" >
    <tr><td> <b> Transferor Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>

    <tr>
        <td> Folio Number </td>
        <td> ${from_shareholder?.folio_number}  </td>  
      </tr>
      <tr>
        <td> Name </td>
        <td>  ${from_investor?.investor_name} </td> 
      </tr>

      <tr><td> <b> Transferee Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Folio Number </td>
        <td> ${to_shareholder?.folio_number}  </td> 
      </tr>
      <tr>
        <td> Name </td>
        <td> ${to_investor?.investor_name}  </td> 
      </tr>  

      <tr><td> <b> Transaction Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Transfer Date </td>
        <td> ${getvalidDateDMY(investor_request?.closed_date)} </td>  
        <td>Processing Status</td>
        <td> <b> ${transaction_request?.processing_status}</b></td>
      </tr>

      <tr>
        <td> Transaction ID </td>
        <td> ${transaction_request?.txn_id} </td>  
        <td> Transfer Right Shares</td>
        <td> <b> ${numberWithCommas(transaction_request?.quantity)}</b></td>
      </tr> 

      <tr>
        <td> Remarks </td>
        <td> ${transaction_request?.remarks} </td>  
      </tr>
  </table>`;
  const verificationTemplates =
    investor_request?.request_type === "VTD" &&
    `
        ${headerSection}
            <table width="100%; line-height="2"; style="line-height:2">
  <tr><td> <b> Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
          <td><b> Folio Number </td>
          <td>: ${from_shareholder?.folio_number}  </td> 
          <td><b> Execution Date </td>
          <td>: ${getvalidDateDMY(investor_request?.txn_execution_date || '')} </td>  

         
      </tr>
      <tr>
          <td><b> Name </td>
          <td>: ${from_investor?.investor_name} </td> 
          <td><b> Transaction ID </td>
          <td>: ${transaction_request?.txn_id} </td>  
      </tr>

      <tr>
      <td><b> Father's Name</td>
      <td>: ${from_investor?.father_name}</td> 
          <td><b> CNIC Number</td>
          <td>: ${from_investor?.cnic}</td>  
      </tr>

      <tr>
         
        <td><b> Spouse Name</td>
        <td>: ${from_investor?.spouse_name}</td> 
      </tr> 
     
      <tr> 
          <td><b> Address </td>
          <td colspan="3">: ${from_shareholder?.street_address}, ${from_shareholder?.city
    },${from_shareholder?.country} </td> 
      </tr>
       

      <tr>
          <td><b>Bank Address</td>
          <td colspan="3">: ${from_shareholder?.bank_name}, ${from_shareholder?.baranch_address
    }, ${from_shareholder?.baranch_city} </td>
      </tr>

      <tr>
          <td><b> Occupation  </td>
          <td>: ${from_investor?.occupation}</td>
          <td><b> Religion </td>
          <td>: ${from_investor?.religion}  </td> 
      </tr>

      <tr>
          <td><b> Category  </td>
          <td>: ${from_investor?.category}</td>
          <td><b> Tax Rate</td>
          <td>:   </td> 
      </tr>

      <tr>
          <td><b> City  </td>
          <td>: ${from_shareholder?.city}</td>
          <td><b> Country</td>
          <td>: ${from_shareholder?.country} </td> 
      </tr>

      <tr>
          <td><b>NTN</td>
          <td>:${from_investor?.ntn}</td>
          <td><b>Processing Status</td>
          <td>: <b> ${transaction_request?.processing_status}</b></td>
      </tr>

      <tr><td> <b> Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th>
      </tr> 
      ${inputCerticateofVTDHandler()}
      <tr>
        <th>No of Shares:</th>
        <th>${transaction_request?.quantity}</th>
      </tr>
  </table>  
</body>
</html>
  `;
  const rightSubscriptionTemplate =
    investor_request?.request_type === "RSUB" &&
    `${headerSection} 
  <table width="100%" line-height="2"; style="line-height:2" >
    <tr><td> <b> Transferor Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>

    <tr>
        <td> Folio Number </td>
        <td> ${from_shareholder?.folio_number}  </td>  
      </tr>
      <tr>
        <td> Name </td>
        <td>  ${from_investor?.investor_name} </td> 
      </tr> 
      <tr>
        <td> Company Symbol </td>
        <td>  ${investor_request?.symbol} </td> 
      </tr> 

      <tr><td> <b> Transaction Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Transfer Date </td>
        <td> ${getvalidDateDMY(investor_request?.closed_date)} </td>  
        <td>Processing Status</td>
        <td> <b> ${transaction_request?.processing_status}</b></td>
      </tr>

      <tr>
        <td> Transaction ID </td>
        <td> ${transaction_request?.txn_id} </td>  
        <td> Subscribed Right Shares</td>
        <td> <b> ${numberWithCommas(transaction_request?.quantity)}</b></td>
      </tr> 

      <tr>
        <td> Remarks </td>
        <td> ${transaction_request?.remarks} </td>  
      </tr>

      <tr><td> <b> Output Certificate Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th> 
        <th>Shares Count</th>
      </tr>

      ${consolidateOutHandler(outputCertificates)}

      
       
  </table>`;
  const transmissionTemplates =
    investor_request?.request_type === "TRS" &&
    `${headerSection}
  <table width="100%" line-height="2"; style="line-height:2" >
    <tr><td> <b> Requestor Shareholder Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Folio Number </td>
        <td> ${transaction_request?.folio_number}  </td>  
      </tr> 
      <tr> 
        <td> Name </td>
        <td>  ${from_investor?.investor_name}  </td> 
      </tr>
      <tr>
        <td> Father Name </td>
        <td> ${from_investor?.father_name}   </td> 
        <td> Spouse Name </td>
        <td>   ${from_investor?.spouse_name}   </td> 
      </tr> 
      <tr>
        <td> Category   </td>
        <td> ${from_investor?.category}   </td> 
        <td> Occupation </td>
        <td>   ${from_investor?.occupation}   </td> 
      </tr> 
      <tr>
        <td> CNIC/NTN   </td>
        <td> ${from_investor?.cnic || from_investor?.ntn}   </td> 
        <td> Religion </td>
        <td>   ${from_investor?.religion}   </td> 
      </tr> 

      <tr>
        <td>Address</td>
        <td colspan="3">${from_shareholder?.street_address}, ${from_shareholder?.city
    }, ${from_shareholder?.country} </td>
      </tr> 

      <tr><td> <b> Transaction Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr>
        <td> Transfer Date </td>
        <td> ${getvalidDateDMY(investor_request?.closed_date)} </td>  
        <td>Processing Status</td>
        <td> <b> ${transaction_request?.processing_status}</b></td>
      </tr>

      <tr>
        <td> Transaction ID </td>
        <td> ${transaction_request?.txn_id} </td>  
      
      </tr>  

      <tr>
        <td> Remarks </td>
        <td> ${transaction_request?.remarks} </td>  
      </tr>
      
      <tr><td> <b> Certificates Detail:</b></td> <td colspan="3"><hr /></td></tr>
      <tr> 
        <th>Certificate No</th>
        <th>Distinctive From</th>
        <th>Distinctive To</th> 
        <th>Count</th>
        <th>To Folio</th>
      </tr> 
      ${transmissionInputHandler(inputCertificates)}

      ${transmissionInvestors(to_investors, to_shareholders)} 
  </table>`;

  const issueofShareTemplates =
    investor_request?.txn_type === "ISH" &&
    `
      ${headerSection}
          <table width="100%; line-height="2"; style="line-height:2">
<tr><td> <b> Certificate Issuance Details:</b></td> <td colspan="3"><hr /></td></tr>
    <tr>
        <td><b> Company Name </td>
        <td>:  ${investor_request?.company_code?.label.replace(`${investor_request?.company_code?.value} - `, '')} </td>
    </tr>
    <tr>
        <td><b> Share Allotment To (Folio Number) </td>
        <td>: ${investor_request?.folio_number?.value}  </td> 
    </tr>
    <tr>
        <td><b> Shareholder Name </td>
        <td>: ${from_investor?.investor_name}  </td> 
    </tr>
    
    <tr><td> <br/><b> Share Alloted Details:</b></td> <td colspan="3"> <br/><hr /></td></tr>
    <tr>
        <td><b> Certificate No. From </td>
        <td>: ${JSON.parse(investor_request?.output_certificates)[0].certificate_no.replace(`${investor_request?.company_code?.value}-`, '')}  </td> 
        <td><b> Certificate No. To </td>
        <td>: ${JSON.parse(investor_request?.output_certificates)[JSON.parse(investor_request?.output_certificates).length - 1].certificate_no.replace(`${investor_request?.company_code?.value}-`, '')}  </td> 
    </tr>

    <tr>
        <td><b> Total Share Count </td>
        <td>: ${investor_request?.quantity} </td>  
    </tr>

   
    
    <tr><td><br/> <b> Certificate Detail:</b></td> <td colspan="3"><br/><hr /></td></tr>
    <tr>
      <th>Certificate No</th>
      <th>Distinctive From</th>
      <th>Distinctive To</th>
      <th>Shares Count</th>
    </tr> 
    ${JSON.parse(investor_request.output_certificates).map(
      (certificate, i) => {
        return `<tr>
        <td>${certificate.certificate_no.replace(`${transaction_request?.company_code}-`, '')}</td>
        <td>${certificate.distinctive_no[0].from}</td>
        <td>${certificate.distinctive_no[0].to}</td>
        <td>${certificate.shares_count}</td>
      </tr>
      `;
      }
    )}    
    
    <tr>
      <th><br />No of Shares:</th>
      <td><br />:${investor_request?.quantity}</th>
    </tr>
</table>  
</body>
</html>
`;

  const chooseTemplate = (requestType) => {
    switch (requestType) {
      case SPLIT_SHARES_TEMPLATE:
        return splitTemplate;
        break;
      case CONSOLIDATE_SHARES_TEMPLATE:
        return consolidateTemplate;
        break;
      case DUPLICATE_SHARES_TEMPLATE:
        return duplicateTemplate;
        break;
      case TRANSFER_OF_SHARES_TEMPLATE:
        return tosTemplate;
        break;
      case PHYSICAL_TO_ELECTRONIC_TEMPLATE:
        return physicalToElectronicTemplate;
        break;
      case ELECTRONIC_TO_PHYSICAL_TEMPLATE:
        return electronicToPhysicalTemplate;
        break;
      case RIGHT_SUBSCRIBTION_TEMPLATE:
        return rightSubscriptionTemplate;
        break;
      case TRANSFER_RIGHT_SHARES_TEMPLATE:
        return transferRightSharesTemplate;
        break;
      case VERIFICATION_TRANSFER_DEED_TEMPLATE:
        return verificationTemplates;
        break;
      case TRANSMISSION_OF_SHARES_TEMPLATE:
        return transmissionTemplates;
        break;
      case ISSUE_OF_SHARES_TEMPLATE:
        return issueofShareTemplates;
        break;
      default:
        return "Template not Found";
    }
  };

  return chooseTemplate((investor_request?.request_type === '' || investor_request?.request_type === undefined) ? investor_request?.txn_type : investor_request?.request_type);
}
