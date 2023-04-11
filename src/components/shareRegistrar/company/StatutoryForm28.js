import React, { useState, useEffect } from 'react'
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "../reporting/page-template";
import {
    getCompanies,
} from "../../../store/services/company.service";
import styled from 'styled-components';
export const StatutoryForm28 = ({data, formTemplate=false}) => {
    const pdfExportComponent = React.useRef(null);
    const [CompanyData, setCompanyData] = useState(null)
    const [loading, setLoading] = useState(false);
    const baseEmail = sessionStorage.getItem("email") || "";
    const [fontFamilyForStaticData, setFontFamilyForStaticData] = useState('Montserrat, sans-serif')
    const [fontSizeForStaticData, setFontSizeForStaticData] = useState('14px')
    const [fontfamilyforDynimicData, setFontFamilyForDynmicData] = useState('Segoe Print')
    const [fontColor, setFontColor] = useState('')
    const getAllCompanies = async () => {
        setLoading(true)
        try {
            const response = await getCompanies(baseEmail);
            if (response.status === 200) {
                const parents = response.data.data;
                const company = parents?.find(ite => ite?.code == data?.company_code)
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
          {formTemplate ?  <PDFExport
                paperSize="A4"
                margin="1cm"
                scale={0.6}
                fileName={`Statutory Requirment Form 28`}
                pageTemplate={PageTemplate}
                ref={pdfExportComponent}
            >
                 <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                <FormName>
                    Form 28
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
                            THE COMPANIES (GENERAL PROVISIONS AND FORMS) REGULATIONS, 2018
                        </HeadingWrapper>

                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <div style={{ fontSize: '15px', fontWeight: 'bold' }} className='d-flex justify-content-center'>
                            [Section 167 and Regulation 4]
                        </div>

                    </div>
                </div>

                <div className='row mt-4'>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center'>
                            CONSENT TO ACT AS DIRECTOR / CHIEF EXECUTIVE
                        </HeadingWrapper>

                    </div>
                </div>
                <PartsWrapper className='mt-4 mb-3'>
                    Part I
                </PartsWrapper>
                <div className='row'>
                    <div className='col-md-12' style={{ padding: '25px 50px', wordWrap: 'break-word' }}>
                        <div style={{ border: '1px dashed #dddcdc', paddingLeft: '10px' }}> (Please complete in typescript or in bold block capitals.)</div>


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
                        <div className='d-flex align-items-center mt-2' style={{ gap: '15px' }}>
                            <div className='align-items-center'>2.</div>
                            <div className='align-items-center' >I/we, the undersigned, have consented to act as Director(s) / Chief Executive of the above named company pursuant to section 167 of the Companies Act, 2017, and certify that I / We am / are not ineligible to become Director(s) / Chief Executive under section 153 or 177 of the Companies Act, 2017. </div>

                        </div>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "9px", fontFamily: "Montserrat rev=1" }}
                            >
                                <thead

                                >
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                        Name in full
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Father’s / husband’s Name
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Designation
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                        Address
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Occupation
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        NIC No or passport No. in case of Foreign National
                                    </th>
                                    <th
                                        style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                    >
                                        Signature
                                    </th>


                                </thead>
                                <tbody>



                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>

                                    </tr>
                                    <tr >

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    </tr>




                                </tbody>

                            </table>

                        </Wrapper>


                        <PartsWrapper className='mt-4 mb-3'>
                            Part III
                        </PartsWrapper>
                        <div className='d-flex  mt-2' >
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px' }}>
                                <div>Declaration</div>
                                <div className='mt-2'>I do hereby solemnly, and sincerely declare that the information provided in the form is:</div>
                                <ul className='mt-3' style={{ listStyleType: 'none', }}>
                                    <li className='mt-2 '><span style={{ fontSize: '16px' }}>(i)</span> <span style={{ paddingLeft: '10px' }}>true and correct to the best of my knowledge, in consonance with the record as maintained by the Company and nothing has been concealed; and  </span></li>
                                    <li className='mt-2 '> <span style={{ fontSize: '16px' }}>(ii)</span> <span style={{ paddingLeft: '10px' }}>hereby reported after complying with and fulfilling all requirements under the relevant provisions of law, rules, regulations, directives, circulars and notifications whichever is applicable.</span></li>

                                </ul>
                            </div>
                        </div>
                        <div className='d-flex' >
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', minHeight: '70px', width: '93%', padding: ' 5px 10px' }} />


                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
                            <ScrollWrapper className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Signatures  </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.4</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>

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
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.5</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px' }}>Day</div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                        </div>


                    </div>
                </div>
                </div>
            </PDFExport> : 
            <PDFExport
            paperSize="A4"
            margin="1cm"
            scale={0.6}
            fileName={`Statutory Requirment Form 28`}
            pageTemplate={PageTemplate}
            ref={pdfExportComponent}
        >
             <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
            <FormName>
                Form 28
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
                        THE COMPANIES (GENERAL PROVISIONS AND FORMS) REGULATIONS, 2018
                    </HeadingWrapper>

                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <div style={{ fontSize: '15px', fontWeight: 'bold' }} className='d-flex justify-content-center'>
                        [Section 167 and Regulation 4]
                    </div>

                </div>
            </div>

            <div className='row mt-4'>
                <div className='col-md-12'>
                    <HeadingWrapper className='d-flex justify-content-center'>
                        CONSENT TO ACT AS DIRECTOR / CHIEF EXECUTIVE
                    </HeadingWrapper>

                </div>
            </div>
            <PartsWrapper className='mt-4 mb-3'>
                Part I
            </PartsWrapper>
            <div className='row'>
                <div className='col-md-12' style={{ padding: '25px 50px', wordWrap: 'break-word' }}>
                    <div style={{ border: '1px dashed #dddcdc', paddingLeft: '10px' }}> (Please complete in typescript or in bold block capitals.)</div>


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
                        <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px', fontFamily: `${fontfamilyforDynimicData}` }}>{CompanyData?.company_name||''} </ScrollWrapper>
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
                    <div className='d-flex align-items-center mt-2' style={{ gap: '15px' }}>
                        <div className='align-items-center'>2.</div>
                        <div className='align-items-center' >I/we, the undersigned, have consented to act as Director(s) / Chief Executive of the above named company pursuant to section 167 of the Companies Act, 2017, and certify that I / We am / are not ineligible to become Director(s) / Chief Executive under section 153 or 177 of the Companies Act, 2017. </div>

                    </div>
                    <Wrapper className="table-responsive mt-2" >
                        <table
                            className="table table-bordered"
                            style={{ fontSize: "9px", fontFamily: "Montserrat rev=1" }}
                        >
                            <thead

                            >
                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                    Name in full
                                </th>
                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                    Father’s / husband’s Name
                                </th>
                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                    Designation
                                </th>
                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                    Address
                                </th>
                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                    Occupation
                                </th>
                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                    NIC No or passport No. in case of Foreign National
                                </th>
                                <th
                                    style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                >
                                    Signature
                                </th>


                            </thead>
                            <tbody>



                                <tr >
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> </td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>

                                </tr>
                                <tr >

                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> </td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                </tr>




                            </tbody>

                        </table>

                    </Wrapper>


                    <PartsWrapper className='mt-4 mb-3'>
                        Part III
                    </PartsWrapper>
                    <div className='d-flex  mt-2' >
                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.1</div>
                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px' }}>
                            <div>Declaration</div>
                            <div className='mt-2'>I do hereby solemnly, and sincerely declare that the information provided in the form is:</div>
                            <ul className='mt-3' style={{ listStyleType: 'none', }}>
                                <li className='mt-2 '><span style={{ fontSize: '16px' }}>(i)</span> <span style={{ paddingLeft: '10px' }}>true and correct to the best of my knowledge, in consonance with the record as maintained by the Company and nothing has been concealed; and  </span></li>
                                <li className='mt-2 '> <span style={{ fontSize: '16px' }}>(ii)</span> <span style={{ paddingLeft: '10px' }}>hereby reported after complying with and fulfilling all requirements under the relevant provisions of law, rules, regulations, directives, circulars and notifications whichever is applicable.</span></li>

                            </ul>
                        </div>
                    </div>
                    <div className='d-flex' >
                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', minHeight: '70px', width: '93%', padding: ' 5px 10px' }} />


                    </div>
                    <div className='d-flex mt-2'>
                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.2</div>
                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                        <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        <ScrollWrapper className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
                    </div>
                    <div className='d-flex mt-2'>
                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.3</div>
                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Signatures  </div>
                        <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
                    </div>
                    <div className='d-flex mt-2'>
                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.4</div>
                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
                        <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
                    </div>

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
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.5</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px' }}>Day</div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                        </div>


                </div>
            </div>
            </div>
        </PDFExport>}

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
    border: 1px solid #121212
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