import React, { useState, useEffect } from 'react'
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "../reporting/page-template";
import {
    getCompanies,
} from "../../../store/services/company.service";
import styled from 'styled-components';
export const StatutoryForm45 = ({ data, formTemplate = false }) => {
    const pdfExportComponent = React.useRef(null);
    const [CompanyData, setCompanyData] = useState(null)
    const [loading, setLoading] = useState(false);
    const [fontFamilyForStaticData, setFontFamilyForStaticData] = useState('Montserrat, sans-serif')
    const [fontSizeForStaticData, setFontSizeForStaticData] = useState('14px')
    const [fontfamilyforDynimicData, setFontFamilyForDynmicData] = useState('Segoe Print')
    const [fontColor, setFontColor] = useState('')
    const baseEmail = sessionStorage.getItem("email") || "";
    const getAllCompanies = async () => {
        setLoading(true)
        try {
            const response = await getCompanies(baseEmail);
            if (response.status === 200) {
                const parents = response.data.data;
                const company = parents?.find(ite => ite?.code == data?.company_code)

                console.log('company', company)

                setCompanyData(company)





                setTimeout(() => {
                    setLoading(false)
                }, 1000);

            }
        } catch (error) {

            setLoading(false)
        }
    };
    useEffect(() => {
        getAllCompanies()
    }, [])
    return (
        <div>

          {formTemplate?  <PDFExport
                paperSize="A4"
                margin="1cm"
                scale={0.6}
                fileName={`Statutory Requirment Form 45`}
                pageTemplate={PageTemplate}
                ref={pdfExportComponent}
            >
                 <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                <FormName>
                    Form 45
                </FormName>
                <div className='row'>
                    <div className='col-md-12' >
                        <HeadingWrapper className='d-flex justify-content-center'>
                            THE COMPANIES ACT, 2017

                        </HeadingWrapper>

                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center'>
                            THE COMPANIES (GENERAL PROVISIONS AND FORMS) REGULATIONS,
                        </HeadingWrapper>

                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <div style={{ fontSize: '15px', fontWeight: 'bold' }} className='d-flex justify-content-center'>
                            2018 [Section 123A(2) and Regulations 19A(5)]

                        </div>

                    </div>
                </div>

                <div className='row mt-4'>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center' style={{ textDecoration: 'underline' }}>
                            DECLARATION OF COMPLIANCE WITH THE PROVISIONS OF SECTION
                        </HeadingWrapper>

                    </div>
                </div>
                <div className='row '>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center' style={{ textDecoration: 'underline' }}>
                            123A OF THE COMPANIES ACT, 2017

                        </HeadingWrapper>

                    </div>
                </div>
                <PartsWrapper className='mt-4 mb-3'>
                    Part I
                </PartsWrapper>
                <div className='row'>
                    <div className='col-md-12' style={{ padding: '25px 50px', wordWrap: 'break-word' }}>
                        {/* <div style={{ border: '1px dashed #dddcdc', paddingLeft: '10px' }}> (Please complete in typescript or in bold block capitals.)</div> */}


                        <div className='d-flex' >
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>1.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>CUIN (Registration Number)  </div>
                            <div className='align-items-center  d-flex'  >{
                                '1234 552'.split("")?.map((item, idx) => {
                                    if (item == ' ') return
                                    return <div style={{ minWidth: '30px', minHeight: '34px', marginLeft: '2px', border: '1px solid #121212', borderRadius: '3px', padding: '6px 9px' }}></div>
                                })
                            }
                            </div>
                        </div>


                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>1.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Name of the Company  </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>




                        <div className='d-flex  mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>1.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '20.20%', paddingLeft: '20px' }}>Fee Payment Details</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Challan No.</div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '17.20%', paddingLeft: '20px', minHeight: '34px' }}></ScrollWrapper>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Amount</div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '19.20%', paddingLeft: '20px', minHeight: '34px' }}></ScrollWrapper>
                        </div>
                        <PartsWrapper className='mt-4 mb-3'>
                            Part II
                        </PartsWrapper>
                        <div style={{ marginTop: '30px' }}>2.1 Compliance against notice issued under sub-regulation (1) of Regulation 19A:</div>


                        <div> </div>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                            >

                                <tbody>


                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Sr. No.</b></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b> Particulars</b> </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Response</b></td>


                                    </tr>

                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>i.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{`The Company in <month> has issued, a notice as per Form 42 to every member directly holding at least twenty five percent of shares or voting rights in the company or to the representative of every legal person or legal arrangement which holds at least twenty five percent of shares or voting rights in the Company, to obtain information of its ultimate beneficial owners, in compliance with sub-regulation (1) of regulation 19A.

The total number of notices issued is _____________.`}
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>


                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>ii. If reply to (i) is Yes,
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The Company has received declarations as per Form 43 from the members/persons to whom notices have been issued, as required under sub-regulation (2) of regulation 19A:

                                            Total no. of members directly holding at least twenty five percent of shares or voting rights in the company and representatives of legal persons or legal arrangements holding twenty five percent of shares or voting rights in the company, as on the date of Form 45: _________

                                            No. of members or Hsubmitting the declarations against the notice(s) issued is: ______

                                            No. of members or representatives who have failed to submit the declaration against the notice(s) issued is: _______
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>iii. If reply to (ii) is Yes,
                                            ,
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The Company has noted accurate particulars of its ultimate beneficial owners, received from the persons vide declaration as per Form 43, in a register of ultimate beneficial owners, as specified under sub-regulation (4) of regulation 19A, and in compliance with the provisions of sub-section (2) of section 123A of the Act.
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>iv.
                                            ,
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The board of directors of the Company has authorized its chief executive officer or one of its directors or officers to provide the information required under sub-regulation (6) of regulation 19A to the registrar or any other authority or agency pursuant to the powers to call for information entrusted by law to such authority or agency, and to provide further assistance as may be required.
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>v. If reply to (iv) is yes,
                                            ,
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The Company has nominated the following officer, as required in terms of sub-regulation (6) of regulation 19A:  </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>

                                        1. Name <br/> ____________________
                                        <br/>
2. Father’s Name<br/> ______________<br/>
3. Designation<br/> _______________<br/>
4. NIC No.<br/> _________________<br/>
5. Cell No.<br/> ________________<br/>
6. Email address<br/>
<br/>
7. Usual residential address<br/>
_______________

                                        </td>

                                    </tr>




                                </tbody>

                            </table>

                        </Wrapper>


                        <PartsWrapper className='mt-4 mb-3'>
                            Part III
                        </PartsWrapper>
                        <div style={{ marginTop: '30px' }}>3.1 Compliance in respect of induction of new members in terms of sub-regulation (2) or changes in particulars of ultimate beneficial owners in terms of sub-regulation (3) of Regulation 19A:</div>


                        <div> </div>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                            >

                                <tbody>


                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Sr. No.</b></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b> Particulars</b> </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Response</b></td>


                                    </tr>

                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>i.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{`The Company has received, during the <year>, declaration filed by the new members in Form 43, or declaration(s) for changes in the beneficial ownership or controlling interest from the member(s) in Form 44, as required under sub-regulation (2) or sub-regulation (3) of regulation 19A, respectively.`}
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>


                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>ii. If reply to (i) is Yes, 
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{`The Company has noted the accurate and updated particulars of its ultimate beneficial owners received through declaration(s) during the <year> in the register of ultimate beneficial owners, as specified under sub-regulation (4) of regulation 19A, and in compliance with the provisions of sub-section (2) of section 123A of the Act.`}
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>iii.
                                            
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The board of directors of the Company has authorized its chief executive officer or one of its directors or officers to provide the information required under sub-regulation (6) of regulation 19A to the registrar or any other authority or agency pursuant to the powers to call for information entrusted by law to such authority or agency, and to provide further assistance as may be required. </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>iv. If reply to (iii) is yes,
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The Company has nominated the following officer, as required in terms of sub-regulation (6) of regulation 19A
 </td>
 <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>

1. Name <br/> ____________________
<br/>
2. Father’s Name<br/> ______________<br/>
3. Designation<br/> _______________<br/>
4. NIC No.<br/> _________________<br/>
5. Cell No.<br/> ________________<br/>
6. Email address<br/>
<br/>
7. Usual residential address<br/>
_______________

</td>

                                    </tr>
                                  




                                </tbody>

                            </table>

                        </Wrapper>






                        <div className='d-flex  mt-2' >
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>4.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px' }}>
                                <div>Declaration</div>
                                <div className='mt-2'>I do hereby solemnly, and sincerely declare that the information provided in the form is:</div>
                                <ul className='mt-3' style={{ listStyleType: 'none', }}>
                                    <li className='mt-2 '><span style={{ fontSize: '16px' }}>(i)</span> <span style={{ paddingLeft: '10px' }}>true and correct to the best of my knowledge, in consonance with the record as maintained by the Company and nothing has been concealed; and  </span></li>
                                    <li className='mt-2 '> <span style={{ fontSize: '16px' }}>(ii)</span> <span style={{ paddingLeft: '10px' }}>hereby reported after complying with and fulfilling all requirements under the relevant provisions of law, rules, regulations, directives, circulars and notifications whichever is applicable.</span></li>

                                </ul>
                            </div>
                        </div>
                        {/* <div className='d-flex' >
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', minHeight: '70px', width: '93%', padding: ' 5px 10px' }} />


                        </div> */}
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>5.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
                            <ScrollWrapper className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>5.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Signatures  </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>
                        {/* <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>5.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div> */}

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Day</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Month</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '16%', padding: ' 5px 10px' }}>Year </div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>5.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px' }}>Day</div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                        </div>
                        <div style={{ marginTop: '30px' }}>* &nbsp; &nbsp;	For the first time the company issues notice to its members in form 42, the month during which such notices have been issued shall be mentioned.</div>



                    </div>
                </div>
</div>
            </PDFExport> :<PDFExport
                paperSize="A4"
                margin="1cm"
                scale={0.6}
                fileName={`Statutory Requirment Form 45`}
                pageTemplate={PageTemplate}
                ref={pdfExportComponent}
            >
                 <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                <FormName>
                    Form 45
                </FormName>
                <div className='row'>
                    <div className='col-md-12' >
                        <HeadingWrapper className='d-flex justify-content-center'>
                            THE COMPANIES ACT, 2017

                        </HeadingWrapper>

                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center'>
                            THE COMPANIES (GENERAL PROVISIONS AND FORMS) REGULATIONS,
                        </HeadingWrapper>

                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <div style={{ fontSize: '15px', fontWeight: 'bold' }} className='d-flex justify-content-center'>
                            2018 [Section 123A(2) and Regulations 19A(5)]

                        </div>

                    </div>
                </div>

                <div className='row mt-4'>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center' style={{ textDecoration: 'underline' }}>
                            DECLARATION OF COMPLIANCE WITH THE PROVISIONS OF SECTION
                        </HeadingWrapper>

                    </div>
                </div>
                <div className='row '>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center' style={{ textDecoration: 'underline' }}>
                            123A OF THE COMPANIES ACT, 2017

                        </HeadingWrapper>

                    </div>
                </div>
                <PartsWrapper className='mt-4 mb-3'>
                    Part I
                </PartsWrapper>
                <div className='row'>
                    <div className='col-md-12' style={{ padding: '25px 50px', wordWrap: 'break-word' }}>
                        {/* <div style={{ border: '1px dashed #dddcdc', paddingLeft: '10px' }}> (Please complete in typescript or in bold block capitals.)</div> */}


                        <div className='d-flex' >
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>1.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>CUIN (Registration Number)  </div>
                            <div className='align-items-center  d-flex'  >{
                                '1234 552'.split("")?.map((item, idx) => {
                                    if (item == ' ') return
                                    return <div style={{ minWidth: '30px', minHeight: '34px', marginLeft: '2px', border: '1px solid #121212', borderRadius: '3px', padding: '6px 9px' }}></div>
                                })
                            }
                            </div>
                        </div>


                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>1.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Name of the Company  </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' , fontFamily: `${fontfamilyforDynimicData}`}}>{CompanyData?.company_name || ''} </ScrollWrapper>
                        </div>




                        <div className='d-flex  mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>1.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '20.20%', paddingLeft: '20px' }}>Fee Payment Details</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Challan No.</div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '17.20%', paddingLeft: '20px', minHeight: '34px' }}></ScrollWrapper>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Amount</div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '19.20%', paddingLeft: '20px', minHeight: '34px' }}></ScrollWrapper>
                        </div>
                        <PartsWrapper className='mt-4 mb-3'>
                            Part II
                        </PartsWrapper>
                        <div style={{ marginTop: '30px' }}>2.1 Compliance against notice issued under sub-regulation (1) of Regulation 19A:</div>


                        <div> </div>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                            >

                                <tbody>


                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Sr. No.</b></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b> Particulars</b> </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Response</b></td>


                                    </tr>

                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>i.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{`The Company in <month> has issued, a notice as per Form 42 to every member directly holding at least twenty five percent of shares or voting rights in the company or to the representative of every legal person or legal arrangement which holds at least twenty five percent of shares or voting rights in the Company, to obtain information of its ultimate beneficial owners, in compliance with sub-regulation (1) of regulation 19A.

The total number of notices issued is _____________.`}
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>


                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>ii. If reply to (i) is Yes,
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The Company has received declarations as per Form 43 from the members/persons to whom notices have been issued, as required under sub-regulation (2) of regulation 19A:

                                            Total no. of members directly holding at least twenty five percent of shares or voting rights in the company and representatives of legal persons or legal arrangements holding twenty five percent of shares or voting rights in the company, as on the date of Form 45: _________

                                            No. of members or Hsubmitting the declarations against the notice(s) issued is: ______

                                            No. of members or representatives who have failed to submit the declaration against the notice(s) issued is: _______
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>iii. If reply to (ii) is Yes,
                                            ,
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The Company has noted accurate particulars of its ultimate beneficial owners, received from the persons vide declaration as per Form 43, in a register of ultimate beneficial owners, as specified under sub-regulation (4) of regulation 19A, and in compliance with the provisions of sub-section (2) of section 123A of the Act.
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>iv.
                                            ,
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The board of directors of the Company has authorized its chief executive officer or one of its directors or officers to provide the information required under sub-regulation (6) of regulation 19A to the registrar or any other authority or agency pursuant to the powers to call for information entrusted by law to such authority or agency, and to provide further assistance as may be required.
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>v. If reply to (iv) is yes,
                                            ,
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The Company has nominated the following officer, as required in terms of sub-regulation (6) of regulation 19A:  </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>

                                        1. Name <br/> ____________________
                                        <br/>
2. Father’s Name<br/> ______________<br/>
3. Designation<br/> _______________<br/>
4. NIC No.<br/> _________________<br/>
5. Cell No.<br/> ________________<br/>
6. Email address<br/>
<br/>
7. Usual residential address<br/>
_______________

                                        </td>

                                    </tr>




                                </tbody>

                            </table>

                        </Wrapper>


                        <PartsWrapper className='mt-4 mb-3'>
                            Part III
                        </PartsWrapper>
                        <div style={{ marginTop: '30px' }}>3.1 Compliance in respect of induction of new members in terms of sub-regulation (2) or changes in particulars of ultimate beneficial owners in terms of sub-regulation (3) of Regulation 19A:</div>


                        <div> </div>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                            >

                                <tbody>


                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Sr. No.</b></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b> Particulars</b> </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Response</b></td>


                                    </tr>

                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>i.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{`The Company has received, during the <year>, declaration filed by the new members in Form 43, or declaration(s) for changes in the beneficial ownership or controlling interest from the member(s) in Form 44, as required under sub-regulation (2) or sub-regulation (3) of regulation 19A, respectively.`}
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>


                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>ii. If reply to (i) is Yes, 
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{`The Company has noted the accurate and updated particulars of its ultimate beneficial owners received through declaration(s) during the <year> in the register of ultimate beneficial owners, as specified under sub-regulation (4) of regulation 19A, and in compliance with the provisions of sub-section (2) of section 123A of the Act.`}
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>iii.
                                            
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The board of directors of the Company has authorized its chief executive officer or one of its directors or officers to provide the information required under sub-regulation (6) of regulation 19A to the registrar or any other authority or agency pursuant to the powers to call for information entrusted by law to such authority or agency, and to provide further assistance as may be required. </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Yes/No</td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>iv. If reply to (iii) is yes,
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>The Company has nominated the following officer, as required in terms of sub-regulation (6) of regulation 19A
 </td>
 <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>

1. Name <br/> ____________________
<br/>
2. Father’s Name<br/> ______________<br/>
3. Designation<br/> _______________<br/>
4. NIC No.<br/> _________________<br/>
5. Cell No.<br/> ________________<br/>
6. Email address<br/>
<br/>
7. Usual residential address<br/>
_______________

</td>

                                    </tr>
                                  




                                </tbody>

                            </table>

                        </Wrapper>






                        <div className='d-flex  mt-2' >
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>4.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px' }}>
                                <div>Declaration</div>
                                <div className='mt-2'>I do hereby solemnly, and sincerely declare that the information provided in the form is:</div>
                                <ul className='mt-3' style={{ listStyleType: 'none', }}>
                                    <li className='mt-2 '><span style={{ fontSize: '16px' }}>(i)</span> <span style={{ paddingLeft: '10px' }}>true and correct to the best of my knowledge, in consonance with the record as maintained by the Company and nothing has been concealed; and  </span></li>
                                    <li className='mt-2 '> <span style={{ fontSize: '16px' }}>(ii)</span> <span style={{ paddingLeft: '10px' }}>hereby reported after complying with and fulfilling all requirements under the relevant provisions of law, rules, regulations, directives, circulars and notifications whichever is applicable.</span></li>

                                </ul>
                            </div>
                        </div>
                        {/* <div className='d-flex' >
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', minHeight: '70px', width: '93%', padding: ' 5px 10px' }} />


                        </div> */}
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>5.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
                            <ScrollWrapper className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>5.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Signatures  </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>
                        {/* <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>5.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div> */}

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Day</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Month</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '16%', padding: ' 5px 10px' }}>Year </div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>5.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px' }}>Day</div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                        </div>
                        <div style={{ marginTop: '30px' }}>* &nbsp; &nbsp;	For the first time the company issues notice to its members in form 42, the month during which such notices have been issued shall be mentioned.</div>



                    </div>
                </div>
</div>
            </PDFExport> }
            <button disabled={loading} className='btn btn-danger' onClick={(e) => {
                // if(viewPdf)
                //   SetViewPDf(true)
                if (pdfExportComponent.current) {
                    pdfExportComponent.current.save();
                }
            }}>Download PDF</button>
        </div>
    )
}
const PartsWrapper = styled.div`
color: #121212;
text-decoration: underline;
justify-content: center;
display: flex;
margin-right: 15px;
font-size: 17px;
font-weight: bold;
`;
const ScrollWrapper = styled.div`
max-height: 50px;
overflow-y: scroll;
overflow-x: hidden;
::-webkit-scrollbar{
    height: 5px;
    width: 3px;
  }
  
  ::-webkit-scrollbar-track{
    background: #F9F9FB;
  }
  ::-webkit-scrollbar-thumb{
    background: #4E515680;
    border-radius: 5px;
  
  }
`;
const HeadingWrapper = styled.div`
font-size: 17px;
font-weight: bold;
`;
const FormName = styled.div`
color: #121212;
text-decoration: underline;
justify-content: end;
display: flex;
margin-right: 15px;
font-size: 17px;
font-weight: bold;
`;
const Wrapper = styled.div`
table.table-bordered{
    border: 1px solid #121212;
     border-color: #121212; 
    // border:1px solid blue;
    // margin-top:20px;
  }
// table.table-bordered > thead > tr > th{
//     // border:1px solid blue;
//     border-color: #121212; 
// }
// table.table-bordered > tbody > tr > td{
//     // border:1px solid blue;
//     borderC-color: #121212; 
// }
 tr td {
    // border:1px solid blue;.
    border-color: #121212; 
}

`;
const WrapperDashed = styled.div`

  td {
    
    border: 1px dashed #dddcdc;
}

`;