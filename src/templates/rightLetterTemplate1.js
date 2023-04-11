import { IsJsonString } from "utilities/utilityFunctions";
import company_logo from "assets/images/oilboy_logo.png";
import company_stamp from "assets/images/oilboy_stamp.png";
import signature_1 from "assets/images/signature_1.png";
import signature_2 from "assets/images/signature_2.png";
export const rightLetterTemplateOne = (entitlement, shareholder, company) => {
  const joint_holders = IsJsonString(shareholder?.joint_holders)
    ? JSON.parse(shareholder?.joint_holders)
    : [""];
  const page1 = `<table style="font-weight:normal;">
  <tr rowspan="2">
    <td>
    <img src=${company_logo} alt="logo" />
      <div style="color: black; margin-bottom: 10px">
        Formerly Drekkar Kingsway Limited
      </div>
    </td>
  </tr>
  <tr style="color: black">
    <td>
      <strong>Corporate Office:</strong>
      <div>
        Office Block: Farmhouse No. 16,Street No. 12, Chak Shahzad,
        Islamabad.
      </div>
      <div>Phone no. 051 2726543-4 , 042 36304408</div>
      <div>Web: www.drekkarkingsway.com</div>
    </td>
    <td>
      <strong>Share Registrar:</strong>
      <div>
        Digital Custodian Company Limited, 4-F Perdesi House, Old Queens
        Road, Karachi
      </div>
      <div>Tel: +92 21 3241 9770, Fax: +92 21 3241 6371</div>
      <div>Web: www.digitalcustodian.co</div>
    </td>
  </tr>
</table>
<div style="color: black; text-align: center;margin-bottom: 150px;">
  <h5 style="margin-top: 0px; margin-bottom: 0px;"><b>OFFER&nbsp;LETTER&nbsp;(LETTER&nbsp;OF&nbsp;RIGHTS)<b></h5>
  <div style="font-weight:normal;">
    ISSUE&nbsp;OF&nbsp;<strong>15,000,000</strong>&nbsp;ORDINARY&nbsp;SHARES&nbsp;OF&nbsp;RS.&nbsp;10/-&nbsp;EACH
  </div>
  <div style="font-weight:normal;">
    TO&nbsp;BE&nbsp;ISSUED&nbsp;AT&nbsp;RS.&nbsp;10/-&nbsp;PER&nbsp;SHARE&nbsp;PAYABLE&nbsp;IN&nbsp;FULL&nbsp;ON&nbsp;ACCEPTANCE&nbsp;ON&nbsp;OR
    BEFORE <strong>&nbsp;TUESDAY,&nbsp;JULY&nbsp;05,&nbsp;2022</strong>
  </div>
  <hr style="border-top: 2px solid black; margin:2px; width: 100%" />
  <div>
  <p style="margin-bottom:0;margin-top:2px;">
    <strong
      >IMPORTANT: NOTES AND INSTRUCTIONS FOR DEALING WITH THIS LETTER ARE GIVEN ON PAGE 2 WHICH SHOULD BE CAREFULLY READ AND FOLLOWED.</strong
    >
  </p>
  </div>
  <div>
      <div style="display: flex; width: 100%;margin-bottom: 15px;
      justify-content: space-between;
      height: 80px;">
      <div
        style="
          border: 1px solid black;
          width: 49%;
          height: 90px;
        "
      >
        <strong>NAME & ADDRESS OF SHAREHOLDER</strong>
        <div style="text-align: left;padding-left: 60px; font-weight:normal; font-size:12px;">
          <span>${shareholder?.shareholder_name}</span>
          <br>
                <span>${shareholder?.street_address || ""}&nbsp;${
    shareholder?.city || ""
  }</span>
        </div>
      </div>
      <div
        style="
          border: 1px solid black;
          width: 49%;
          height: 90px;
        "
      >
        <strong>NAME(S) JOINT HOLDER(S), IF ANY</strong>
        <div style="text-align: left;padding-left: 75px;font-weight: normal;font-size:12px;">${joint_holders
          .filter((item) => item?.jointHolderName)
          .map(
            (item) => `<span>${item?.jointHolderName || ""}</span><br>`
          )}</div>
      </div>
    </div>
    <table style="border-collapse: collapse; border: 1px solid black; margin-bottom:10px;">
      <tr style="border: 1px solid black">
        <td style="border: 1px solid black"><b>A</b></td>
        <td style="border: 1px solid black"><b>B</b></td>
        <td style="border: 1px solid black"><b>C</b></td>
        <td style="border: 1px solid black"><b>D</b></td>
        <td style="border: 1px solid black"><b>E</b></td>
        <td style="border: 1px solid black"><b>F</b></td>
      </tr>
      <tr
        style="border: 1px solid black; height: 30px; text-align: center"
      >
        <td style="border: 1px solid black; font-weight: normal;">Folio Number</td>
        <td style="border: 1px solid black; font-weight: normal;">Letter of Rights Number</td>
        <td style="border: 1px solid black; font-weight: normal;">
          Number of Shares held at close of business on May 23, 2022
        </td>
        <td style="border: 1px solid black; font-weight: normal;">
          Total Number of Letters of Right Issued
        </td>
        <td style="border: 1px solid black; font-weight: normal;">
          Number of Right Shares Offered through this Letter of Rights
        </td>
        <td style="border: 1px solid black;">
          <b>Amount payable on or before Tuesday, July 05, 2022 Rupees</b>
        </td>
      </tr>
      <tr style="border: 1px solid black; height: 30px">
        <td style="border: 1px solid black">${
          shareholder.folio_number.split("-")[
            shareholder.folio_number.split("-").length - 1
          ]
        }</td>
        <td style="border: 1px solid black">${
          entitlement?.allotment_number
        }</td>
        <td style="border: 1px solid black">${shareholder?.physical_shares}</td>
        <td style="border: 1px solid black">1</td>
        <td style="border: 1px solid black">${entitlement?.right_shares}</td>
        <td style="border: 1px solid black">${
          company?.face_value || 10 * entitlement?.right_shares
        }</td>
      </tr>
    </table>
    <div style="text-align: justify;">
      <b>Dear Shareholder(s)</b>
      <div style="font-weight:normal;">
        <p style="line-height: 15px; margin: 2px">
          In according with the provision of Section 83(1) of the
          Companies Act, 2017, the provisions of the Companies (Further
          Issue of Shares) Regulations, 2020 and pursuant to the decision
          of the Board of Directors of Oilboy Energy Limited (”the
          Company”), in their meeting held on <b>May 12, 2022</b>, we are
          pleased to offer you Right Shares in the ratio of 150 (One
          Thousand Four Hundred & Eighty Six) ordinary right shares for
          every 100 (One Hundred) ordinary shares (i.e.150%) to be paid
          at Rs. 10/- per share, registered in your name as of the close
          of business on <b>May 23, 2022</b>, subject to the conditions
          mentioned on page number 02 of this letter. Please note that the
          Offer Letter (Letter of Right) is being issued for your
          entitlement of your Right Shares at the Rate of Rs. 10/- per
          share. The Letter of Right have been declared “Eligible
          Securities by CDC vide its Notification.
        </p>
        <p style="line-height: 15px; margin: 2px">
          Right Shares are being offered at a price of PKR 10/- per share
          which is at a discount to last six months’ average share price
          of the Company. Circular under section 83(3) of the Companies
          Act, 2017 / Information as required under Schedule I to the
          Companies (Further Issue of Shares) Regulations, 2020 are
          attached along with Offer Letter (Letter of Rights). All
          fractional right entitlements will be consolidated and disposed
          of on the Pakistan Stock Exchange Limited by the Company and the
          proceeds from such disposition will be paid to the entitled
          shareholders of the Company in due course in the manner provided
          under the applicable laws.
        </p>
        <p style="line-height: 15px; margin: 2px">
          The shareholders holding shares of the Company in physical form
          should please note that under the CDC applicable right share
          procedures, the physical shareholder can renounce his/her Letter
          of Right (LOR) by routing through his/her own CDS Account or Sub
          Account to a person who is the IAS Account holder or Sub Account
          holder with CDC. Further, physical shareholder can renounce
          his/her Letter of Rights by filling the Letter of Renunciation
          (Form “R”) and the Renouncee(s) can also get credit of right
          shares in book-entry form in his/her own CDS investor or sub
          account by filling details on application by Renouncee(s) for
          registration.
        </p>
        <p style="line-height: 15px; margin: 2px">
          Shareholders holding shares of the Company in physical form can
          also get credit of Right Share in his/her on CDS investor or
          sub- account by providing his/her own CDS investor or
          sub-account details on Letter of Acceptance (Form “A”). Please
          note that once the subscription amount for the Right Shares
          hereby offered has been paid, this Letter of Rights will cease
          to be negotiable and cannot be traded any further.
        </p>
        <b>for&nbsp;OILBOY&nbsp;ENERGY&nbsp;LIMITED</b>
      </div>
    </div>
    <table style="border-bottom: 2px solid black;">
      <tbody style="top:20px"><tr>
        <td style="width: 20%; text-align: start;width: 50%;padding-top:50px;">
          <div><b>Lahore</b></div>
          <div><b>May 23, 2022</b></div>
        </td>
        <td style="width: 10%; text-align: center">
          <div><img alt="Amir Zia" width="80" src=${signature_1}></div>
          <div><b>Amir Zia</b></div>
          <div><b>Director</b></div>
        </td>
        <td style="position:relative;">
        <img style="position: absolute; bottom: 0;top:-10px;left: 45px;" src=${company_stamp} height="120" width="120" alt="oilboy_stamp">
        </td>
        <td style="width: 10%; text-align: center;width: 15%;">
          <div><img alt="Farhan A. Sheikh Signature" width="80" src=${signature_2}></div>
          <div><b>Farhan A. Sheikh</b></div>
          <div><b>Director</b></div>
        </td>
      </tr>
    </tbody></table>
    <div>
      <div style="text-align: center">
        <div style="margin-top: 0px; margin-bottom: 0px;font-size:15px;">
        <b style="display:inline">
          RECEIPT&nbsp;TO&nbsp;BE&nbsp;ISSUE&nbsp;BY&nbsp;COMPANY'S&nbsp;BANKER
          </b>
        </div>
        <span><b>(To be completed by Company's Banker)</b></span>
      </div>
      <table style="width: 100%; font-weight: normal">
        <tr style="line-height:16px">
          <td colspan="2" style="width: 30vw; text-align: start">
            <div>
              Folio
              No.&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;_____________
            </div>
            <div>Letter of Right No.&nbsp;_____________</div>
          </td>
        </tr>
        <tr style="line-height:16px">
          <td colspan="2" style="text-align: start; width: 30vw">
            <p>
              Received from
              Mr./Mrs./Miss_____________________________________________
              the sum of Rs._________________
              (Rupees_______________________) by Cash/Crossed Cheque/Pay
              order/Bank Draft No._________ Dated___________ drawn on
              _________________ in respect of _______________ Modarba
              Certificates of this Right issue at the issue price of PKR
              10/- PER
            </p>
          </td>
        </tr>
        <tr style="line-height:16px">
          <td style="text-align: start">
            <div>Bank: __________________________________________</div>
            <div>Branch Name: ___________________________________</div>
            <div>
              Branch
              Code:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;Date:__________________
            </div>
            <div>
              Note: Cash/Cross Cheques/pay Orders/Bank drafts are subject
              to
            </div>
          </td>
          <td>
            <div>Authorized Signature</div>
            <div>Stamp of Receiving Bank</div>
          </td>
        </tr>
      </table>
      <div style="position: relative">
      <div style="position: absolute; text-align: center; width: 100%; top: 20px;font-weight:normal">
        Page 1
      </div>
    </div>
    </div>
  </div>
</div>`;
  const page2 = `
      <table style="font-weight: normal;">
      <tr rowspan="2">
        <td>
          <img src=${company_logo} alt="logo" />
          <div style="color: black; margin-bottom: 10px">
            Formerly Drekkar Kingsway Limited
          </div>
        </td>
      </tr>
    </table>
  <div style="color: black; text-align: center; font-weight: normal;">
      <span>Page 1 & 2 to be retained by Shareholder/Renouncee</span>
      <div>
        <div style="margin-bottom:0;font-size:18px;"><b>NOTES&nbsp;AND&nbsp;INSTRUCTIONS</b></div>
        <div style="text-align: start">
          <div style="margin-bottom:0;font-size:15px;"><b>NOTES:</b></div>
          <table>
            <tr>
              <td style="position: relative">
                <div style="position: absolute; right: 0; top: 0">1.</div>
              </td>
              <td style="padding-left: 20px; text-align: justify">
                <p style="padding: 0; margin: 0;line-height: 15px;font-weight:normal;">
                  This Right Issue is being made in accordance with the
                  Companies (Further Issue of Shares) Regulations 2020, and
                  the Companies Act, 2017. In connection with this issue all
                  necessary approvals and permissions have been obtained and
                  formalities completed.
                </p>
              </td>
            </tr>
            <tr>
              <td style="position: relative">
                <div style="position: absolute; right: 0; top: 0">2.</div>
              </td>
              <td style="padding-left: 20px; text-align: justify">
                <p style="padding: 0; margin: 0;line-height: 15px;font-weight:normal;">
                  This document is negotiable and of value until payment of
                  the right shares has been made, whereupon it will cease to
                  be negotiable and cannot traded any further. Where right
                  shares are desired in physical form, this document must be
                  carefully retained for exchange with the definitive share
                  certificate(s), when ready.
                </p>
              </td>
            </tr>
            <tr>
              <td style="position: relative">
                <div style="position: absolute; right: 0; top: 0">3.</div>
              </td>
              <td style="padding-left: 20px; text-align: justify">
                <p style="padding: 0; margin: 0;line-height: 15px;font-weight:normal;">
                  The Ordinary Right Shares now being offered shall rank pari
                  passu in all respect including voting rights with the
                  existing Ordinary Shares of the Company.
                </p>
              </td>
            </tr>
            <tr>
              <td style="position: relative">
                <div style="position: absolute; right: 0; top: 0">4.</div>
              </td>
              <td style="padding-left: 20px; text-align: justify">
                <p style="padding: 0; margin: 0;line-height: 15px;font-weight:normal;">
                  The Letters of Rights will be quoted on the Pakistan Stock
                  Exchange Limited, from Monday, June 06, 2022 to Tuesday,
                  June 28, 2022 (both days inclusive). Please note that
                  pursuant to the new CDC Right Shares procedures, physical
                  trading of unpaid LOR is not allowed and now no credit of
                  right shares be allowed in book entry form against
                  subscription of physical LORs.
                </p>
              </td>
            </tr>
            <tr>
              <td style="position: relative">
                <div style="position: absolute; right: 0; top: 0">5.</div>
              </td>
              <td style="padding-left: 20px; text-align: justify">
                <p style="padding: 0; margin: 0;line-height: 15px;font-weight:normal;">
                  The instrument of Transfer shall be verified against fully
                  paid Letter of Rights pending issue of definitive share
                  certificate(s) on presentation of this Letter at the
                  Company's Share Registrar office given on the page 1 of this
                  Letter of Rights.
                </p>
              </td>
            </tr>
            <tr>
              <td style="position: relative">
                <div style="position: absolute; right: 0; top: 0">6.</div>
              </td>
              <td style="padding-left: 20px; text-align: justify">
                <p style="padding: 0; margin: 0;line-height: 15px;font-weight:normal;">
                  If the payment is not received by the Company’s Banker(s) on
                  or before July 05, 2022, this Letter of Rights shall be
                  deemed to have been declined and will be treated as
                  cancelled. In that event, this will be offered to and taken
                  up as decided by the Board of Directors of the Company as
                  per requirement of Section 83 of the Companies Act, 2017.
                </p>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div style="text-align: start">
        <div style="margin-bottom:0;font-size:15px;"><b>INSTRUCTIONS</b></div>
        <table style="margin-left: 20px">
          <tr>
            <td>
              <div style="font-weight: bold">1. PAYMENTS- BANKER</div>
            </td>
          </tr>
          <tr>
            <td>
              <table style="margin-left: 5px">
                <tr>
                  <td style="position: relative">
                    <div
                      style="position: absolute; font-weight: bold; top: 0"
                    >
                      a)
                    </div>
                  </td>
                  <td style="padding-left: 15px">
                    <b>Banker to Right Issue</b>
                    <table
                      border
                      style="
                        border-collapse: collapse;
                        border: 2px solid black;
                        width: 100%;
                      "
                    >
                      <tr style="text-align: start">
                        <td style="border: 1px solid black"><b>1-</b></td>
                        <td style="border: 1px solid black; font-weight:normal;">
                          JS Bank Limited&nbsp;<strong>(All Branches)</strong><br />
                          A/C No. 1984041<br />IBAN Code:
                          PK50JSBL9571000001984041
                        </td>
                        <td style="border: 1px solid black">
                          <b>2-</b>
                        </td>
                        <td style="border: 1px solid black; font-weight:normal">
                          Faysal Bank Limited&nbsp;<strong>(All Branches)</strong><br />
                          A/C No. 3192301000002429<br />IBAN Code:
                          PK48FAYS3192301000002429
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="position: relative">
                    <div
                      style="position: absolute; font-weight: bold; top: 0"
                    >
                      b)
                    </div>
                  </td>
                  <td style="padding-left: 15px">
                    <p style="margin: 0; padding: 0; line-height: 15px;font-weight: normal;">
                      Submit this Letter of Rights intact on or before July
                      05, 2022 to any Company's bankers to the issue, namely
                      1) JS Bank Limited 2) Faysal Bank Limited (“the banks”)
                      at any branch in Pakistan with your payment which should
                      be made by Cash or Crossed Cheque or Demand Draft or Pay
                      Order for credit to
                      <b
                        >“OILBOY ENERGY LIMITED RIGHT ISSUE SUBSCRIPTION
                        ACCOUNT”</b
                      >
                      as indicate on page 1 (also shown on page 4).
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="position: relative">
                    <div
                      style="position: absolute; font-weight: bold; top: 0"
                    >
                      c)
                    </div>
                  </td>
                  <td style="padding-left: 15px">
                    <p style="margin: 0; padding: 0; line-height: 15px;font-weight: normal;">
                      The Bank will not accept the payment of Letter of Rights
                      if posted after the close of Business on Tuesday, July
                      05, 2022 and shall be deemed to have been declined by
                      you and will be treated as cancelled unless evidence is
                      available that these have been posted before the last
                      date of payment and received by the bank within due date
                      i.e. <b>Tuesday, July 05, 2022.</b>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="position: relative">
                    <div
                      style="position: absolute; font-weight: bold; top: 0"
                    >
                      d)
                    </div>
                    <p style="display: inline; margin: 0; padding: 0"></p>
                  </td>
                  <td style="padding-left: 15px">
                    All cheques / pay orders / drafts must be drawn on a bank
                    situated in the same city where Letter of Right is
                    deposited.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <div style="font-weight: bold">
                2. PROCEDURE FOR DEPOSIT OF PHYSICAL LOR INTO CDS:
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <table style="margin-left: 5px">
                <tr>
                  <td style="position: relative">
                    <div
                      style="position: absolute; font-weight: bold; top: 0"
                    >
                      a)
                    </div>
                  </td>
                  <td style="padding-left: 15px">
                    <p style="margin: 0; padding: 0; line-height: 15px;font-weight: normal;">
                      Unpaid Rights issued in physical form can be deposited
                      into CDS as per normal deposit procedure, however, this
                      process would only be allowed till 7 business days prior
                      to the last date trading date i.e.
                      <b>Friday, June 17, 2022.</b>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="position: relative">
                    <div
                      style="position: absolute; font-weight: bold; top: 0"
                    >
                      b)
                    </div>
                  </td>
                  <td style="padding-left: 15px">
                    <p style="margin: 0; padding: 0; line-height: 15px;font-weight: normal;">
                      Account holders / participants will send letter of
                      rights duly signed by shareholders and renounced in
                      favour of CDC with securities deposit form and CDS
                      printout. The other deposit formalities will remain the
                      same.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <div style="font-weight: bold">
                3. ACCEPTANCE: (Last date Tuesday, July 05, 2022)
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <table style="margin-left: 5px">
                <tr>
                  <td style="position: relative">
                    <div
                      style="position: absolute; font-weight: bold; top: 0"
                    >
                      a)
                    </div>
                  </td>
                  <td style="padding-left: 15px">
                    <p style="margin: 0; padding: 0; line-height: 15px;font-weight: normal;">
                      Payment of the amount indicated on Page-1, to the
                      Company's Banker to the Issue on before
                      <b>July 05, 2022</b> shall be treated as acceptance of
                      the offer.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="position: relative">
                    <div
                      style="position: absolute; font-weight: bold; top: 0"
                    >
                      b)
                    </div>
                  </td>
                  <td style="padding-left: 15px">
                    <p style="margin: 0; padding: 0; line-height: 15px;font-weight: normal;">
                      FORM” A” in Page-4, should be completed when making
                      payment. The Letter(s) of Rights should be handed over
                      to the Company's Banker to the Issue intact. The
                      receipted Letter of Rights will be returned to you
                      whilst Page 3 & 4 will be retained by the Bank for
                      onward delivery to the Company.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <div style="font-weight: bold">
                4. RENUNCIATION: (Last date Friday, June 17, 2022)
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 0; margin: 0; margin-left: 20px; line-height: 15px;font-weight: normal;">
                If you wish to dispose off the Right Shares offered to you,
                FORM “R” on Page-3 should be completed and signed by all the
                Shareholders named on Page 1 of this Letter of Rights. The
                Renounce(s) should then complete FORM “R” on Page 3, and
                present this Letter of Rights intact to the Company's Banker
                to the Issue along with payment. The receipted Letter of
                Rights will be returned to the Renounce(s) whilst page 3 & 4
                will be retained by the Bank for onward delivery to the
                Company.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <div style="font-weight: bold">
                5. SPLITTING OF LETTER OF RIGHTS: (Last date Friday, June 17,
                2022)
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 0; margin: 0; margin-left: 20px; line-height: 15px;font-weight: normal;">
                The letters of Rights should be returned intact to the
                Company’s share registrar (M/s Vision Consulting Limited) of
                Company, when requesting for splitting of shares into smaller
                denomination.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <div style="font-weight: bold">6. GENERAL</div>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 0; margin: 0; margin-left: 20px; line-height: 15px;font-weight: normal;">
                If any Rights Shares are renounced, the existing shareholders
                (holding physical shares) should take care to write their
                Name(s) and affix their signature(s) in the same style as per
                specimen already available with the Company.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <div style="font-weight: bold">7. FRACTIONAL RIGHTS</div>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 0; margin: 0; margin-left: 20px; line-height: 15px;font-weight: normal;">
                As per Regulation 3 of the Companies (Further Issue of Shares)
                Regulations 2020, The fractional Rights, if any shall be
                consolidated and disposed off on the Pakistan Stock Exchange
                Limited by the Company and proceeds from such dispositions
                will be paid to entitled shareholders of the Company in due
                course in the manner provided under the applicable laws.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <div style="font-weight: bold">
                8. CDC ACCOUNT HOLDERS-ACCEPTENCE AND PROCEDURE:
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 0; margin: 0; margin-left: 20px; line-height: 15px;font-weight: normal;">
                In compliance with the new CDC Regulations relating to Right
                Shares Issue, separate intimation letters have been dispatched
                to CDC Account Holders containing procedures for subscription
                against their Right Shares entitlement.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <div style="font-weight: bold">9. CONTACT INFORMATION</div>
            </td>
          </tr>
          <tr>
            <td>
              <p style="padding: 0; margin: 0; margin-left: 20px; line-height: 15px;font-weight: normal;">
                <b>Share Registrar:</b> Digital Custodian Company Limited, 4-F
                Perdesi House, Old Queens Road, Karachi. Tel: +92 21 3241
                9770, Fax: +92 21 3241 6371 Web:
                <a href="www.digitalcustodian.co">www.digitalcustodian.co</a>
              </p>
            </td>
          </tr>
        </table>
        <div style="position: relative; margin-bottom: 120px">
          <div
            style="
              position: absolute;
              text-align: center;
              width: 100%;
              top: 7px;
            "
          >
            Page 2
          </div>
        </div>
      </div>
    </div>`;
  const page3 = `   <table>
      <tr rowspan="2">
        <td>
          <img src=${company_logo} alt="logo" />
          <div style="color: black; margin-bottom: 10px; font-weight:normal">
            Formerly Drekkar Kingsway Limited
          </div>
        </td>
      </tr>
    </table>
    <div style="color: black; text-align: center">
      <b
        >[To be retained by Bank at the time of payment for delivery to the
        Company]</b
      >
      <div>
        <table>
          <tr>
            <td></td>
            <td style="width: 60%; text-align: center">
              <h5 style="margin-bottom: 0"><b>LETTER OF RENUNCIATION</b></h5>
              <div><strong>Valid up to 17-06-2022</strong></div>
            </td>
            <td style="width: 10%; text-align: start">
              <b>Form "R"</b>
            </td>
            <td style="width: 10%; padding: 0">
              <div
                style="
                  padding: 0px;
                  margin: 0;
                  border: 2px solid black;
                  padding-top: 5px;
                  padding-bottom: 5px;
                "
              >
                <b>R-1</b>
              </div>
            </td>
          </tr>
        </table>
        <div style="text-align: start">
          <p
            style="
              margin: 0;
              padding: 0;
              line-height: 15px;
              font-weight: normal;
            "
          >
            (To be completed by the shareholder(s), if ORDINARY RIGHT SHARES
            offered in this letter are to be renounced)
          </p>
        </div>
        <table>
          <tr>
            <td colspan="2" style="width: 40%; text-align: start">
              The Company Secretary,
            </td>
            <td style="width: 20%"><b>Date:____________________</b></td>
          </tr>
          <tr>
            <td colspan="3" style="width: 40%; text-align: start">
              OILBOY ENERGY LIMITED
            </td>
          </tr>
          <tr>
            <td colspan="3" style="width: 40%; text-align: start">
              <p
                style="
                  margin: 0;
                  padding: 0;
                  line-height: 15px;
                  font-weight: normal;
                "
              >
                Office Block: Farmhouse No. 16, Street No. 12, Chak Shahzad,
                Islamabad.
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="width: 40%; text-align: start">
              Dear Sir(s),
            </td>
          </tr>
          <tr>
            <td colspan="3" style="width: 40%; text-align: start">
              <p
                style="
                  margin: 0;
                  padding: 0;
                  line-height: 15px;
                  font-weight: normal;
                "
              >
                The share offered through this Letter of Rights are hereby
                renounce in favor of the person(s) who sign(s) the
                Registration Application Form (Form“RR” below). You are hereby
                authorize to deliver the relative Share Certificate(s) to the
                said person(s), as the case may be without reference to the
                undersigned, subject to payment of the subscription amounts
                and (if applicable) fulfilment of CDC procedures relating to
                Right Shares.
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center">
              <table>
                <tr style="text-align: center">
                  <td>
                    <b>FULL NAME</b>
                  </td>
                </tr>
                <tr>
                  <td>______________________________1.</td>
                </tr>
                <tr>
                  <td>______________________________2.</td>
                </tr>
                <tr>
                  <td>______________________________3.</td>
                </tr>
                <tr>
                  <td>______________________________4.</td>
                </tr>
              </table>
            </td>
            <td style="text-align: center">
              <table>
                <tr style="text-align: center">
                  <td>
                    <b>SIGNATURE</b>
                  </td>
                </tr>
                <tr>
                  <td>______________________________1.</td>
                </tr>
                <tr>
                  <td>______________________________2.</td>
                </tr>
                <tr>
                  <td>______________________________3.</td>
                </tr>
                <tr>
                  <td>______________________________4.</td>
                </tr>
              </table>
            </td>
            <td style="text-align: center">
              <table>
                <tr style="text-align: center">
                  <td>
                    <b>CNIC</b>
                  </td>
                </tr>
                <tr>
                  <td>______________________________</td>
                </tr>
                <tr>
                  <td>______________________________</td>
                </tr>
                <tr>
                  <td>______________________________</td>
                </tr>
                <tr>
                  <td>______________________________</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: justify">
              <p
                style="
                  margin: 0;
                  padding: 0;
                  line-height: 15px;
                  font-weight: normal;
                "
              >
                <b>NOTES:</b> In case of joint holding all joint holders must
                sign, Signature(s) must be the same as already recorded with
                the Company. In case of CDC Account Holders, attested
                copy(ies) of CNIC(s) must be attached and signatures must
                conform with the signature on CNIC(s). In case of Corporate
                Entity, the Board of Director's Resolution / Power of attorney
                with specimen signature shall be submitted.
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="3"><hr style="border-bottom: 1px solid black" /></td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: end"><b>Form "RR"</b></td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: center; font-weight: bold">
              APPLICATION BY RENOUNCEE(S) FOR REGISTRATION
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: center">
              (To be completed by the person(s) in whose favour this Letter of
              Rights has been renounced)
            </td>
          </tr>
          <tr>
            <td
              colspan="2"
              style="width: 40%; text-align: start; font-weight: normal"
            >
              The Company Secretary,
            </td>
            <td style="width: 20%">Date:____________________</td>
          </tr>
          <tr>
            <td
              colspan="3"
              style="width: 40%; text-align: start; font-weight: normal"
            >
              OILBOY ENERGY LIMITED
            </td>
          </tr>
          <tr>
            <td
              colspan="3"
              style="width: 40%; text-align: start; font-weight: normal"
            >
              Office Block: Farmhouse No. 16, Street No. 12, Chak Shahzad,
              Islamabad.
            </td>
          </tr>
          <tr>
            <td
              colspan="3"
              style="width: 40%; text-align: start; font-weight: normal"
            >
              Dear Sir(s),
            </td>
          </tr>
          <tr>
            <td colspan="3" style="width: 40%; text-align: start">
              <p
                style="
                  margin: 0;
                  padding: 0;
                  line-height: 15px;
                  font-weight: normal;
                "
              >
                Having paid to your banker, the amount shown on page 1 and 4
                of this Letter of Rights, it is requested that the shares may
                please be registered in my/our name(s) upon the terms
                contained herein and subject to the Memorandum and Articles of
                Association of the Company.
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: start">
              <p
                style="
                  margin: 0;
                  padding: 0;
                  line-height: 15px;
                  font-weight: normal;
                "
              >
                I/We declare that I/We am/are National(s) of Pakistan and I/We
                am/are are not minor(s).
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: start; font-weight: normal">
              If not Nationals(s) of Pakistan, then Please specify:&emsp;
              Nationality: _________________________________
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: start; font-weight: normal">
              Folio # [In case of existing shareholders
              (s)]:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;
              _________________________________
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: start">
              <table style="font-weight: normal">
                <tr style="word-break: break-all">
                  <td>Full Name___________________</td>
                  <td style="width: 20%"></td>
                  <td>Father's/Husband's Name__________________</td>
                </tr>
                <tr>
                  <td>CNIC_____________________</td>
                  <td style="width: 30%"></td>

                  <td>Occupation_____________________</td>
                </tr>
                <tr>
                  <td>Address_____________________</td>
                  <td style="width: 30%"></td>
                  <td>Signature_____________________</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: left">
              <p
                style="
                  margin: 0;
                  padding: 0;
                  line-height: 15px;
                  font-weight: normal;
                "
              >
                <b>JOINT HOLDERS:</b> When shares are to be registered in the
                names of more than one person, all joint holders must sign.
                The shares will not be registered in Joint names of more than
                four persons.
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <table style="text-align: center">
                <tr>
                  <td>Name</td>
                  <td>Father's/Husband's Name</td>
                  <td>CNIC No. Passport No.</td>
                  <td>Occupation</td>
                  <td>Signature</td>
                </tr>
                <tr>
                  <td>___________________</td>
                  <td>___________________</td>
                  <td>___________________</td>
                  <td>___________________</td>
                  <td>___________________</td>
                </tr>
                <tr>
                  <td>___________________</td>
                  <td>___________________</td>
                  <td>___________________</td>
                  <td>___________________</td>
                  <td>___________________</td>
                </tr>
                <tr>
                  <td>___________________</td>
                  <td>___________________</td>
                  <td>___________________</td>
                  <td>___________________</td>
                  <td>___________________</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: left">
              <b>Note:</b> All joint holders must sign if shares are to be
              acquired jointly If Right Share are desired in book-entry form
              in CDS.
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <table
                border
                style="
                  border-collapse: collapse;
                  border: 1px solid black;
                  width: 100%;
                "
              >
                <tr>
                  <td colspan="5">
                    CDC Participant ID / CDC Investor Account Services ID
                  </td>
                  <td colspan="5">
                    CDC Investor A/c. No./ Sub A/c / House A/c. No.
                  </td>
                </tr>
                <tr style="height: 20px">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td colspan="1">__________________________</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td colspan="1">Signature(s) of CDC A/c. holder(s)</td>
          </tr>
          <tr>
            <td style="text-align: start" colspan="3">
              <p
                style="
                  margin: 0;
                  padding: 0;
                  line-height: 15px;
                  font-weight: normal;
                "
              >
                In case of Renunciation in favor of Central Depository Company
                of Pakistan Limited for conversion of physical Letter of
                Rights into book- entry form through deposit in CDS.
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <table
                border
                style="
                  border-collapse: collapse;
                  border: 1px solid black;
                  width: 100%;
                "
              >
                <tr>
                  <td colspan="5">
                    CDC Participant ID / CDC Investor Account Services ID
                  </td>
                  <td colspan="5">
                    CDC Investor A/c. No./ Sub A/c / House A/c. No.
                  </td>
                </tr>
                <tr style="height: 20px">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td colspan="1"><b>Signature(s) of CDC A/c. holder(s)</b></td>
          </tr>
        </table>
      </div>
    </div>
    <div style="position: relative; margin-bottom: 220px">
      <div
        style="
          position: absolute;
          text-align: center;
          width: 100%;
          top: 50px;
          font-weight: normal;
        "
      >
        Page 3
      </div>
    </div>`;
  const page4 = `<table>
    <tr rowspan="2">
      <td>
        <img src=${company_logo} alt="logo" />
        <div style="color: black; margin-bottom: 10px;font-weight:normal">
          Formerly Drekkar Kingsway Limited
        </div>
      </td>
    </tr>
  </table>
  <div style="color: black; text-align: center">
    <b>[To be retained by Bank ]</b>
    <div>
    <table style="width: 100%
    ;">
      <tr style="text-align: center;">
        <td style="position: relative;">
          <div style="margin-bottom: 0;display: inline;font-size:18px;"><b>LETTER&nbsp;OF&nbsp; ACCEPTANCE</b></div>
          <div><strong>(Valid up to 05-07-2022)</strong></div>
          <div style="position: absolute;right: 15px;top: -5px;">
            <h5 style="padding-bottom: 5px;padding-top: 5px; margin: 0;border: 2px solid black"><b>R-1</b></h5>
            <span style="text-align: right
            ;"><b>Form "A"</b></span>
          </div>
        </td>
      </tr>
    </table>
      <div style="text-align: start;font-weight: bold; margin-bottom: 30px;">
        (To be completed by person(s) to whom the Letter of Rights is
        addressed and who have accepted the Shares offered)
      </div>
      <table>
        <tr>
          <td colspan="3">
            <table border style="border-collapse: collapse; width: 100%;">
              <tr style="height: 30px;">
                <th>A</th>
                <th>B</th>
                <th colspan="2">C</th>
              </tr>
              <tr style="height: 30px;">
                <th>Folio # / CDC Account #</th>
                <th>Letter of Rights Number</th>
                <th colspan="2">Right Share Subscribed</th>
              </tr>
              <tr style="height: 30px">
                <td rowspan="2">${
                  shareholder.folio_number.split("-")[
                    shareholder.folio_number.split("-").length - 1
                  ]
                }</td>
                <td rowspan="2">${entitlement?.allotment_number}</td>
                <th >Number</th>
                <th>Amount Paid Rs.</th>
                <tr style="height: 30px;"><td>${
                  entitlement?.right_shares
                }</td><td>${
    company?.face_value || 10 * entitlement?.right_shares
  }</td></tr>
              </tr>
            </table>
          </td>
        </tr>
        <tr style="font-weight:normal;">
        <td colspan="2" style=" text-align: start">
        The Directors,
      </td>
      <td style="font-weight:bold;text-align: right;">Date____________________</td>
        </tr>
        <tr style="font-weight:normal;">
          <td colspan="3" style="width: 40%; text-align: start">
            OILBOY ENERGY LIMITED
          </td>
        </tr>
        <tr style="font-weight:normal;">
          <td colspan="3" style="width: 40%; text-align: start">
            Office Block: Farmhouse No. 16, Street No. 12, Chak Shahzad,
            Islamabad.
          </td>
        </tr>
        <tr style="font-weight:normal;">
          <td colspan="3" style="width: 40%; text-align: start">
            Dear Sirs,
          </td>
        </tr>
        <tr style="font-weight:normal;">
          <td colspan="3" style="width: 40%; text-align: justify;">
            Having Paid to your Banker, the amount indicated above, I/We accept the ordinary shares offered through this Letter of Rights and request
            that said ordinary shares be registered in my/our name(s). I/We agree to hold such Shares on the terms and conditions contained in the
            Letter of Offer and subjects to the Memorandum and Articles of Association of the Company.
          </td>
        </tr>
        <tr style="font-weight:normal;">
          <td colspan="3" style="width: 40%; text-align: start">
          <br>
            I/We hereby declare that I/We am /are National(s) of Pakistan / Non-resident Pakistani / Foreign National(s) and am/are not minor(s).
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <table style="text-align: center">
              <tr>
                <th>Name</th>
                <th>Fathe's/Husband's Name</th>
                <th>CNIC No. Passport No.</th>
                <th>Occupation</th>
                <th>Signature</th>
              </tr>
              <tr>
                <td>___________________</td>
                <td>___________________</td>
                <td>___________________</td>
                <td>___________________</td>
                <td>___________________</td>
              </tr>
              <tr>
                <td>___________________</td>
                <td>___________________</td>
                <td>___________________</td>
                <td>___________________</td>
                <td>___________________</td>
              </tr>
              <tr>
                <td>___________________</td>
                <td>___________________</td>
                <td>___________________</td>
                <td>___________________</td>
                <td>___________________</td>
              </tr>
            </table>
          </td>
        </tr>
        
        <tr>
          <td colspan="3" style="text-align: justify; font-weight:normal;">
            If Right Share are desired in book-entry form in CDS
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <table
              border
              style="
                border-collapse: collapse;
                border: 1px solid black;
                width: 100%;
              "
            >
              <tr style="height: 30px;">
                <td colspan="5">
                  CDC Participant ID / CDC Investor Account Services ID
                </td>
                <td colspan="5">
                  CDC Investor A/c. No./ Sub A/c / House A/c. No.
                </td>
              </tr>
              <tr style="height: 30px">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </td>
        </tr>
        
        <tr>
          <td colspan="3" style="text-align: start; font-weight:normal;"><b>NOTE:</b> Signature(s) must be the same as registered with the Company, if shares are held jointly be more than one person, all joint holders
            must sign this form. In case of Corporate Entity, the Board of Director's Resolution / Power of attorney with specimen Signature shall be
            submitted.</td>
        </tr>
        <tr>
          <td colspan="3"><hr style="border-bottom: 1px solid black" /></td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: center; font-weight: bold">
            BANKER'S&nbsp;TO&nbsp;THE&nbsp;ISSUE&nbsp;CONFIRMATION&nbsp;OF&nbsp;RECEIPT&nbsp;OF&nbsp;SUBSCRIPTION&nbsp;AMOUNT
          </td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: start;font-weight:normal;">
            We confirm having received the subscription amount of Rs._____________________for_______________ shares from the above shareholder(s) / renounce(s) named on Page 3 or 4, as the case may be.
          </td>
        </tr>
        
     
        
        
        
        
        
        
        <tr>
          <td colspan="2" style="text-align: start; font-weight:normal;">
            <table>
              <tr style="word-break: break-all">
                <td>Bank:&ensp;______________________</td>
             
              </tr>
              <tr>
                <td>Branch:&ensp;_____________________</td>
              </tr>
              <tr>
                <td>Branch Code: &ensp;________________</td>
              </tr>
              <tr>
                <td>Address: &ensp;____________________</td>
              </tr>
            </table>
          </td>
          <th><div style="font-size:18px;">Authorized Signature &amp;</div><div style="">Stamp of Receiving Bank</div></th>
        </tr>
      </table>
      <div style="position: relative;height: 100%;">
      <div style="position: absolute; text-align: center; width: 100%; top: 250px;font-weight:normal;">
        Page 4
      </div>
    </div>
    </div>
  </div>`;
  const page_printer = `<div
  style="
    width: 210mm;
    min-height: 297mm;
    background-color: white;
    font-family: 'Helvetica',  sans-serif;
    margin: 10mm auto;
  "
  >
    ${page1}${page2}${page3}${page4}
  </div>
`;
  return page_printer;
};
