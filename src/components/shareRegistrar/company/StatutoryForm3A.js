import React, { useState, useEffect } from 'react'
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "../reporting/page-template";
import {
    getCompanies,
} from "../../../store/services/company.service";
import styled from 'styled-components';
export const StatutoryForm3A = ({ data, formTemplate = false }) => {
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

{formTemplate ?  <PDFExport
                paperSize="A4"
                margin="1cm"
                scale={0.6}
                fileName={`Statutory Requirment Form 3A`}
                pageTemplate={PageTemplate}
                ref={pdfExportComponent}
            >
                   <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                <FormName>
                    Form 3A
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
                            [Section 465 (4) and Regulations 4 & 14]
                        </div>

                    </div>
                </div>

                <div className='row mt-4'>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center'>
                            CHANGE OF MORE THAN TWENTY FIVE PERCENT IN SHAREHOLDING OR
                        </HeadingWrapper>

                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center'>
                            MEMBERSHIP OR VOTING RIGHTS
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


                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', fontSize: '14px', fontWeight: 'bold' }}>Change in shareholding </div>
                            {/* <div className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </div> */}
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.1.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '58%', padding: ' 5px 10px' }}>Total Number of paid up shares  </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.1.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '86%', padding: ' 5px 10px' }}>Particulars of change in shareholding  </div>
                            {/* <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </ScrollWrapper> */}
                        </div>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                            >
                                <thead

                                >
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                        Name of Transferor
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        CNIC/ Passport No. of Transferor, if applicable
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Name of Transferee/Allottee
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                        CNIC/ Passport No. of Transferee/Allottee, if applicable
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Address of Transferee/ Allottee
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        No of shares transferred/ Allotted
                                    </th>
                                    <th
                                        style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                    >
                                        Kind / Class of Shares
                                    </th>
                                    <th
                                        style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                    >
                                        Date of transfer/ Allotment
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
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>

                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>

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

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', fontSize: '14px', fontWeight: 'bold' }}>Change in voting right </div>
                            {/* <div className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </div> */}
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.2.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '58%', padding: ' 5px 10px' }}>Reason & details of change in voting rights  </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px', minHeight: '45px' }}> </div>
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '48%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Day</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Month</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '16%', padding: ' 5px 10px' }}>Year </div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.2.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '48%', padding: ' 5px 10px' }}>Effective date of change in voting right</div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px' , borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212'}}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', fontSize: '14px', fontWeight: 'bold' }}>Change in membership </div>
                            {/* <div className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </div> */}
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.3.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '58%', padding: ' 5px 10px' }}>Total Number of members prior to change  </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.3.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '86%', padding: ' 5px 10px' }}>Particulars of change in members  </div>
                            {/* <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </ScrollWrapper> */}
                        </div>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                            >

                                <tbody>

                                    <tr>
                                        <td colSpan={3}>Particulars of Outgoing Member(s), if any</td>
                                        <td colSpan={3}>Particulars of New Member(s)</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Name</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> CNIC/ Passport No.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Date of cessation</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Name</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>CNIC/ Passport No.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Date of Admission</td>

                                    </tr>

                                    <tr >
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
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    </tr>




                                </tbody>

                            </table>

                        </Wrapper>









                        <PartsWrapper className='mt-5 mb-3'>
                            Part III
                        </PartsWrapper>
                        <div className='d-flex  mt-4' >
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
            </PDFExport>:
            <PDFExport
                paperSize="A4"
                margin="1cm"
                scale={0.6}
                fileName={`Statutory Requirment Form 3A`}
                pageTemplate={PageTemplate}
                ref={pdfExportComponent}
            >
                   <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                <FormName>
                    Form 3A
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
                            [Section 465 (4) and Regulations 4 & 14]
                        </div>

                    </div>
                </div>

                <div className='row mt-4'>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center'>
                            CHANGE OF MORE THAN TWENTY FIVE PERCENT IN SHAREHOLDING OR
                        </HeadingWrapper>

                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col-md-12'>
                        <HeadingWrapper className='d-flex justify-content-center'>
                            MEMBERSHIP OR VOTING RIGHTS
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
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px'  , fontFamily: `${fontfamilyforDynimicData}`}}>{CompanyData?.company_name || ''} </ScrollWrapper>
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


                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', fontSize: '14px', fontWeight: 'bold' }}>Change in shareholding </div>
                            {/* <div className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </div> */}
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.1.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '58%', padding: ' 5px 10px' }}>Total Number of paid up shares  </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.1.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '86%', padding: ' 5px 10px' }}>Particulars of change in shareholding  </div>
                            {/* <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </ScrollWrapper> */}
                        </div>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                            >
                                <thead

                                >
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                        Name of Transferor
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        CNIC/ Passport No. of Transferor, if applicable
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Name of Transferee/Allottee
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                        CNIC/ Passport No. of Transferee/Allottee, if applicable
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Address of Transferee/ Allottee
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        No of shares transferred/ Allotted
                                    </th>
                                    <th
                                        style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                    >
                                        Kind / Class of Shares
                                    </th>
                                    <th
                                        style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                    >
                                        Date of transfer/ Allotment
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
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>

                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>

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

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', fontSize: '14px', fontWeight: 'bold' }}>Change in voting right </div>
                            {/* <div className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </div> */}
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.2.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '58%', padding: ' 5px 10px' }}>Reason & details of change in voting rights  </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px', minHeight: '45px' }}> </div>
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '48%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Day</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Month</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '16%', padding: ' 5px 10px' }}>Year </div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.2.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '48%', padding: ' 5px 10px' }}>Effective date of change in voting right</div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
                            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px' , borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212'}}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                        </div>


                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', fontSize: '14px', fontWeight: 'bold' }}>Change in membership </div>
                            {/* <div className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </div> */}
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.3.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '58%', padding: ' 5px 10px' }}>Total Number of members prior to change  </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.3.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '86%', padding: ' 5px 10px' }}>Particulars of change in members  </div>
                            {/* <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}> </ScrollWrapper> */}
                        </div>
                        <Wrapper className="table-responsive mt-4" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                            >

                                <tbody>

                                    <tr>
                                        <td colSpan={3}>Particulars of Outgoing Member(s), if any</td>
                                        <td colSpan={3}>Particulars of New Member(s)</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Name</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> CNIC/ Passport No.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Date of cessation</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Name</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>CNIC/ Passport No.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Date of Admission</td>

                                    </tr>

                                    <tr >
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
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    </tr>




                                </tbody>

                            </table>

                        </Wrapper>









                        <PartsWrapper className='mt-5 mb-3'>
                            Part III
                        </PartsWrapper>
                        <div className='d-flex  mt-4' >
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