import React, { useState, useEffect } from 'react'
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "../reporting/page-template";
import {
    getCompanies,
} from "../../../store/services/company.service";
import styled from 'styled-components';
export const StatutoryForm3 = ({ data, formTemplate = false }) => {
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

{formTemplate ? 
            <PDFExport
                paperSize="A4"
                margin="1cm"
                scale={0.6}
                fileName={`Statutory Requirment Form 3`}
                pageTemplate={PageTemplate}
                ref={pdfExportComponent}
            >
                <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                <FormName>
                    Form 3
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
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px', fontFamily: `${fontfamilyforDynimicData}` }}> </ScrollWrapper>
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
                            <div className='align-items-center' >Share Capital </div>

                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '43%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '25%', padding: ' 5px 10px' }}> Number of Shares</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '25%', padding: ' 5px 10px' }}> Amount (Rs)</div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.1</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '43%', padding: ' 5px 10px' }}>Authorized capital </div>
            <div className='align-items-center' style={{  width: '25%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212'   }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '25%', padding: ' 5px 10px', borderRight:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
        </div>

        <div className='d-flex  mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.2</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '43%', padding: ' 5px 10px' }}>Paid up capital</div>
            <div className='align-items-center' style={{ width: '25%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '25%', padding: ' 5px 10px' }}> </div>
        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '43%', padding: ' 5px 10px' }}>(Inclusive of present allotment) </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '25%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '25%', padding: ' 5px 10px' }}> </div>
                        </div>
                        <WrapperDashed className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                            >
                                <tbody>
                                    <tr >
                                        <td style={{ minHeight: '24px', width: '7%' }}>2.4</td>
                                        <td style={{ minHeight: '24px', width: '31%' }}><div>
                                            Kind of shares
                                        </div>
                                            <div>
                                                (Check relevant checkbox)
                                            </div></td>
                                        <td style={{ minHeight: '24px', width: '31%' }}>

                                            <div className='d-flex' style={{ gap: '5px', alignItems: 'center' }}>
                                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                                <div>
                                                    Ordinary
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '31%' }}>
                                            <div className='d-flex' style={{ gap: '5px', alignItems: 'center' }}>
                                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                                <div>
                                                    Preference
                                                </div>
                                            </div>

                                        </td>



                                    </tr>




                                </tbody>

                            </table>

                        </WrapperDashed>




                        <WrapperDashed className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                            >

                                <tbody>



                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.4</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '31%' }}><div>
                                            Class of shares
                                        </div>
                                            <div>
                                                (Check relevant checkbox)
                                            </div></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '62%' }}>
                                            <div className='d-flex' style={{ gap: '50%', alignItems: 'center' }}>
                                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                                <div>
                                                    Class A
                                                </div>
                                            </div>
                                            <div className='d-flex mt-2' style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                                <div>
                                                    Class
                                                </div>
                                            </div>
                                            <div className='ml-3 mt-2'>
                                                s B
                                            </div>

                                            <div className='d-flex mt-2' style={{ gap: '50%', alignItems: 'center' }}>
                                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                                <div className='d-flex' style={{ gap: '10px', alignItems: 'center' }}>
                                                    <div>
                                                        Preferred:
                                                    </div>
                                                    <div>
                                                        Participatory:
                                                    </div>
                                                    <div>
                                                        Redeemable
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='ml-3 mt-2'>
                                                at Shareholder’s option
                                            </div>
                                            <div className='d-flex mt-2' style={{ gap: '50%', alignItems: 'center' }}>
                                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                                <div className='d-flex' style={{ gap: '10px', alignItems: 'center' }}>
                                                    <div>
                                                        Preferred:
                                                    </div>
                                                    <div>
                                                        Non
                                                    </div>
                                                    <div>
                                                        Participatory:
                                                    </div>
                                                    <div>
                                                        Non-
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='ml-3 mt-2'>
                                                Redeemable
                                            </div>
                                            <div className='d-flex mt-2' style={{ gap: '50%', alignItems: 'center' }}>
                                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                                <div className='d-flex' style={{ gap: '30px', alignItems: 'center' }}>
                                                    <div>
                                                        Preferred:
                                                    </div>
                                                    <div>
                                                        Non
                                                    </div>
                                                    <div>
                                                        Participatory:
                                                    </div>


                                                </div>
                                            </div>
                                            <div className='ml-3 mt-2'>
                                                Redeemable at company’s option
                                            </div>
                                            <div className='d-flex mt-2' style={{ gap: '50%', alignItems: 'center' }}>
                                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                                <div className='d-flex' style={{ gap: '30px', alignItems: 'center' }}>
                                                    <div>
                                                        Preferred:
                                                    </div>
                                                    <div>
                                                        Non
                                                    </div>
                                                    <div>
                                                        Participatory:
                                                    </div>


                                                </div>
                                            </div>
                                            <div className='ml-3 mt-2'>
                                                Redeemable at Shareholder’s option
                                            </div>
                                            <div className='d-flex mt-2' style={{ gap: '50%', alignItems: 'center' }}>
                                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                                <div className='d-flex' style={{ gap: '20px', alignItems: 'center' }}>
                                                    <div>
                                                        Any
                                                    </div>
                                                    <div>
                                                        other
                                                    </div>
                                                    <div>
                                                        Class,
                                                    </div>
                                                    <div>
                                                        (please specify)______________
                                                    </div>


                                                </div>
                                            </div>
                                        </td>


                                    </tr>




                                </tbody>

                            </table>

                        </WrapperDashed>

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
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.5</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px' }}>Date of allotment*</div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212'}}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212',  width: '4%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '8px', width: '3%' }}>-</div>
            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212'}}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px', borderRight:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '8px', width: '3%' }}>-</div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', border: '1px solid #121212', }}> </div>
        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>(*If shares were allotted on different dates, then date of first allotment shall be mentioned)</div>

                        <WrapperDashed className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                            >

                                <tbody>



                                    <tr >
                                        <td style={{ minHeight: '24px', width: '7%' }}>2.4</td>
                                        <td style={{ minHeight: '24px', width: '31%' }}>
                                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                SECTION A — SHARES ALLOTTED AGAINST CASH CONSIDERATION
                                            </div>
                                        </td>





                                    </tr>




                                </tbody>

                            </table>

                        </WrapperDashed>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Number of Shares</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> indicating class, if any</div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>


                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Per share  (Rs)</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Total Amount (Rs)</div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Nominal amount </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Premium </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.4</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Discount </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <div>{'('}</div>
                                    <div>{')'}</div>
                                </div>
                            </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.5</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>
                                <div>
                                    {'Total (Amount paid on each share '}
                                </div>
                                <div>
                                    {'2.6.2 to 2.6.4)'}
                                </div>
                            </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}>
                            </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Specify currency</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Total Amount of foreign currency</div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.6</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Consideration received against allotment in foreign currency (equivalent amount in PKR included in total amount mentioned at 2.6.5) </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>
                        <WrapperDashed className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                            >

                                <tbody>



                                    <tr >
                                        <td style={{ minHeight: '24px', width: '7%' }}>2.7</td>
                                        <td style={{ minHeight: '24px', width: '31%' }}>
                                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                SECTION B — SHARES ALLOTTED FOR CONSIDERATION OTHERWISE THAN IN CASH
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                            </table>

                        </WrapperDashed>

                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Number of Shares</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> indicating class, if any</div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>


                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Per share  (Rs)</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Total Amount (Rs)</div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Nominal amount </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>

                        <div className='d-flex mt-3'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Premium </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>

                        <div className='d-flex mt-3'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.4</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Discount </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <div>{'('}</div>
                                    <div>{')'}</div>
                                </div>
                            </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>

                        <div className='d-flex mt-3'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.5</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>
                                <div>
                                    Total (2.7.2 to 2.7.4)
                                </div>

                            </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}>

                            </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>


                        <div className='d-flex mt-3'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.6</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>The consideration for which shares have been allotted is as follow: </div>
                            {/* <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Number of Shares</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div> */}
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> </div>

                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}> </div>
                            {/* <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Number of Shares</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div> */}
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Amount (Rs.)</div>

                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>(a)    Property and assets acquired (give description) </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}></div>

                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>(b)   Good will </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}></div>

                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>(c)    Services (give nature of services) </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}></div>

                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>(d)    Other items ( to be specified) </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}></div>

                        </div>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>(e)    Total  (a to d)</div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}></div>

                        </div>

                        <WrapperDashed className="table-responsive mt-5" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                            >

                                <tbody>
                                    <tr >
                                        <td style={{ minHeight: '24px', width: '7%' }}>2.8</td>
                                        <td style={{ minHeight: '24px', width: '31%' }}>
                                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                SECTION C — ALLOTMENT OF BONUS SHARES
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </WrapperDashed>
                        <div className='d-flex mt-2'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Number of Shares</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> indicating class, if any</div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.8.1</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>
                        <div className='d-flex'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Allotment Ratio (Existing shares / bonus shares)</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Total Amount (Rs)</div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.8.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> Details of Bonus Shares</div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
                            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
                        </div>


                        <div className='d-flex mt-3'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '33%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '20%', padding: ' 5px 10px' }}> Resolution number</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '2%', padding: ' 5px 10px' }}> </div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Day</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Month</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '16%', padding: ' 5px 10px' }}>Year </div>
                            <div></div>
                        </div>
                        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.8.3</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '33%', padding: ' 5px 10px' }}>Particulars of resolution of Board of directors / shareholders</div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '20%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '2%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '8px', width: '3%' }}></div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '8px', width: '3%' }}></div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px' , borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212'}}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
        </div>
                        <WrapperDashed className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                            >
                                <tbody>
                                    <tr >
                                        <td style={{ minHeight: '24px', width: '7%' }}>2.9</td>
                                        <td style={{ minHeight: '24px', width: '31%' }}>
                                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                SECTION D—NAME, ADDRESSE, AND OTHER PARTICULARS, OF THE ALLOTTEES
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                            </table>

                        </WrapperDashed>

                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "9px", fontFamily: "Montserrat rev=1" }}
                            >
                                <thead

                                >
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                        Date of allotment
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Name of allottee in full
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Father's / husband's name
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                        Nationality
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Country of origin in case of foreign national
                                    </th>
                                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                        Address of the allottee
                                    </th>
                                    <th
                                        style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                    >
                                        Number of shares allotted
                                    </th>
                                    <th
                                        style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                    >
                                        NIC No./NICOP/Passport No. of allottee/Registration Number, if any(in case of allotee other than natural person)
                                    </th>

                                </thead>
                                <tbody>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(1)</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(2)</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(3) </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(4)</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(5)</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(6)</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(7)</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(8)</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>DD-MM-YYYY</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> </td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Please enter NIC No. without (-)</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> </td>
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
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                    </tr>
                                </tbody>

                            </table>

                        </Wrapper>
                        <PartsWrapper className='mt-5  mb-3'>
                            Part III
                        </PartsWrapper>
                        <div className='d-flex  mt-3' >
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
                        <div className='d-flex mt-3'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.2</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
                            <ScrollWrapper className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>
                        <div className='d-flex mt-3'>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.3</div>
                            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Signatures  </div>
                            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
                        </div>
                        <div className='d-flex mt-3'>
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
            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
        </div>
                        <PartsWrapper style={{ justifyContent: 'start' }} className='mt-4 mb-3'>
                            Enclosures:
                        </PartsWrapper>


                        <div className='mt-3 ml-5'>
                            1.&nbsp;&nbsp;&nbsp;&nbsp;In case shares are allotted against cash consideration, a report from Auditor of the Company in terms of section 70(1)(b) of the Act as per Appendix attached herewith, to the effect that the amount of consideration has been received in full.
                        </div>
                        <div className='mt-3 ml-5'>
                            2.&nbsp;&nbsp;&nbsp;&nbsp;In case shares are allotted against consideration otherwise than in cash, a copy of the  contract in writing constituting the title of the allottee to the allotment together with a contract of sale, or for services or other consideration in respect of which that allotment was made, such contract being duly stamped.
                        </div>
                        <div className='mt-3 ml-5'>
                            3.&nbsp;&nbsp;&nbsp;&nbsp;In case bonus shares are issued, copies of the resolution of Board of Directors /members authorizing the issue of such shares.
                        </div>
                        <div className='mt-3 ml-5'>
                            4.&nbsp;&nbsp;&nbsp;&nbsp;In case the shares are issued at discount, a copy of the special resolution passed by the members authorizing such issue and where the maximum rate of discount exceeds limits specified in the Act, a copy of the order of the Commission permitting the issue at the higher percentage.
                        </div>
                        <div className='mt-3 ml-5'>
                            5.&nbsp;&nbsp;&nbsp;&nbsp;In case of allotment of shares in consequence of the exercise of the option for conversion in terms of an agreement for participation term certificates, term finance certificates, redeemable capital, musharika or hire-purchase shall be reported in Section-B and copies of the relevant documents submitted with the return.
                        </div>
                        <div className='mt-3 ml-5'>
                            6.&nbsp;&nbsp;&nbsp;&nbsp;Any other document, certificate, report etc required under any regulation pertaining to issuance of shares.
                        </div>
                    </div>
                </div>
                </div>
            </PDFExport>
: <PDFExport
paperSize="A4"
margin="1cm"
scale={0.6}
fileName={`Statutory Requirment Form 3`}
pageTemplate={PageTemplate}
ref={pdfExportComponent}
>
<div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
<FormName>
    Form 3
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
            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px', fontFamily: "Segoe Print" }}>{CompanyData?.company_name || ''} </ScrollWrapper>
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
            <div className='align-items-center' >Share Capital </div>

        </div>
        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '43%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '25%', padding: ' 5px 10px' }}> Number of Shares</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '25%', padding: ' 5px 10px' }}> Amount (Rs)</div>
            <div></div>
        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.1</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '43%', padding: ' 5px 10px' }}>Authorized capital </div>
            <div className='align-items-center' style={{  width: '25%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212'   }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '25%', padding: ' 5px 10px', borderRight:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
        </div>

        <div className='d-flex  mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.2</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '43%', padding: ' 5px 10px' }}>Paid up capital</div>
            <div className='align-items-center' style={{ width: '25%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '25%', padding: ' 5px 10px' }}> </div>
        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '43%', padding: ' 5px 10px' }}>(Inclusive of present allotment) </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '25%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '25%', padding: ' 5px 10px' }}> </div>
        </div>
        <WrapperDashed className="table-responsive mt-2" >
            <table
                className="table table-bordered"
                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
            >

                <tbody>



                    <tr >
                        <td style={{ minHeight: '24px', width: '7%' }}>2.4</td>
                        <td style={{ minHeight: '24px', width: '31%' }}><div>
                            Kind of shares
                        </div>
                            <div>
                                (Check relevant checkbox)
                            </div></td>
                        <td style={{ minHeight: '24px', width: '31%' }}>

                            <div className='d-flex' style={{ gap: '5px', alignItems: 'center' }}>
                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                <div>
                                    Ordinary
                                </div>
                            </div>
                        </td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '31%' }}>
                            <div className='d-flex' style={{ gap: '5px', alignItems: 'center' }}>
                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                <div>
                                    Preference
                                </div>
                            </div>

                        </td>



                    </tr>




                </tbody>

            </table>

        </WrapperDashed>




        <WrapperDashed className="table-responsive mt-2" >
            <table
                className="table table-bordered"
                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
            >

                <tbody>



                    <tr >
                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.4</td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '31%' }}><div>
                            Class of shares
                        </div>
                            <div>
                                (Check relevant checkbox)
                            </div></td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '62%' }}>
                            <div className='d-flex' style={{ gap: '50%', alignItems: 'center' }}>
                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                <div>
                                    Class A
                                </div>
                            </div>
                            <div className='d-flex mt-2' style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                <div>
                                    Class
                                </div>
                            </div>
                            <div className='ml-3 mt-2'>
                                s B
                            </div>

                            <div className='d-flex mt-2' style={{ gap: '50%', alignItems: 'center' }}>
                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                <div className='d-flex' style={{ gap: '10px', alignItems: 'center' }}>
                                    <div>
                                        Preferred:
                                    </div>
                                    <div>
                                        Participatory:
                                    </div>
                                    <div>
                                        Redeemable
                                    </div>

                                </div>
                            </div>
                            <div className='ml-3 mt-2'>
                                at Shareholder’s option
                            </div>
                            <div className='d-flex mt-2' style={{ gap: '50%', alignItems: 'center' }}>
                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                <div className='d-flex' style={{ gap: '10px', alignItems: 'center' }}>
                                    <div>
                                        Preferred:
                                    </div>
                                    <div>
                                        Non
                                    </div>
                                    <div>
                                        Participatory:
                                    </div>
                                    <div>
                                        Non-
                                    </div>

                                </div>
                            </div>
                            <div className='ml-3 mt-2'>
                                Redeemable
                            </div>
                            <div className='d-flex mt-2' style={{ gap: '50%', alignItems: 'center' }}>
                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                <div className='d-flex' style={{ gap: '30px', alignItems: 'center' }}>
                                    <div>
                                        Preferred:
                                    </div>
                                    <div>
                                        Non
                                    </div>
                                    <div>
                                        Participatory:
                                    </div>


                                </div>
                            </div>
                            <div className='ml-3 mt-2'>
                                Redeemable at company’s option
                            </div>
                            <div className='d-flex mt-2' style={{ gap: '50%', alignItems: 'center' }}>
                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                <div className='d-flex' style={{ gap: '30px', alignItems: 'center' }}>
                                    <div>
                                        Preferred:
                                    </div>
                                    <div>
                                        Non
                                    </div>
                                    <div>
                                        Participatory:
                                    </div>


                                </div>
                            </div>
                            <div className='ml-3 mt-2'>
                                Redeemable at Shareholder’s option
                            </div>
                            <div className='d-flex mt-2' style={{ gap: '50%', alignItems: 'center' }}>
                                <div style={{ minWidth: '30px', minHeight: '27px', border: '1px solid #121212' }} />
                                <div className='d-flex' style={{ gap: '20px', alignItems: 'center' }}>
                                    <div>
                                        Any
                                    </div>
                                    <div>
                                        other
                                    </div>
                                    <div>
                                        Class,
                                    </div>
                                    <div>
                                        (please specify)______________
                                    </div>


                                </div>
                            </div>
                        </td>


                    </tr>




                </tbody>

            </table>

        </WrapperDashed>

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
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.5</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px' }}>Date of allotment*</div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212'}}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212',  width: '4%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '8px', width: '3%' }}>-</div>
            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212'}}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px', borderRight:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '8px', width: '3%' }}>-</div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', border: '1px solid #121212', }}> </div>
        </div>


        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>(*If shares were allotted on different dates, then date of first allotment shall be mentioned)</div>

        <WrapperDashed className="table-responsive mt-2" >
            <table
                className="table table-bordered"
                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
            >

                <tbody>



                    <tr >
                        <td style={{ minHeight: '24px', width: '7%' }}>2.4</td>
                        <td style={{ minHeight: '24px', width: '31%' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                SECTION A — SHARES ALLOTTED AGAINST CASH CONSIDERATION
                            </div>
                        </td>





                    </tr>




                </tbody>

            </table>

        </WrapperDashed>

        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Number of Shares</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> indicating class, if any</div>
            <div></div>
        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.1</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>


        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Per share  (Rs)</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Total Amount (Rs)</div>
            <div></div>
        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.2</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Nominal amount </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>

        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.3</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Premium </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>

        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.4</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Discount </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>{'('}</div>
                    <div>{')'}</div>
                </div>
            </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>

        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.5</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>
                <div>
                    {'Total (Amount paid on each share '}
                </div>
                <div>
                    {'2.6.2 to 2.6.4)'}
                </div>
            </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}>

            </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>


        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Specify currency</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Total Amount of foreign currency</div>
            <div></div>
        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6.6</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Consideration received against allotment in foreign currency (equivalent amount in PKR included in total amount mentioned at 2.6.5) </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>


        <WrapperDashed className="table-responsive mt-2" >
            <table
                className="table table-bordered"
                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
            >

                <tbody>



                    <tr >
                        <td style={{ minHeight: '24px', width: '7%' }}>2.7</td>
                        <td style={{ minHeight: '24px', width: '31%' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                SECTION B — SHARES ALLOTTED FOR CONSIDERATION OTHERWISE THAN IN CASH
                            </div>
                        </td>





                    </tr>




                </tbody>

            </table>

        </WrapperDashed>

        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Number of Shares</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> indicating class, if any</div>
            <div></div>
        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.1</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>


        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Per share  (Rs)</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}>Total Amount (Rs)</div>
            <div></div>
        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.2</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Nominal amount </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>

        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.3</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Premium </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>

        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.4</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>Discount </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>{'('}</div>
                    <div>{')'}</div>
                </div>
            </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>

        <div className='d-flex mt-3'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.5</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}>
                <div>
                    Total (2.7.2 to 2.7.4)
                </div>

            </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}>

            </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>


        <div className='d-flex mt-3'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.7.6</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>The consideration for which shares have been allotted is as follow: </div>
            {/* <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Number of Shares</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div> */}
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> </div>

        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}> </div>
            {/* <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Number of Shares</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div> */}
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Amount (Rs.)</div>

        </div>
        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>(a)    Property and assets acquired (give description) </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}></div>

        </div>
        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>(b)   Good will </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}></div>

        </div>
        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>(c)    Services (give nature of services) </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}></div>

        </div>
        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>(d)    Other items ( to be specified) </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}></div>

        </div>
        <div className='d-flex mt-3'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '62%', padding: ' 5px 10px' }}>(e)    Total  (a to d)</div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}></div>

        </div>

        <WrapperDashed className="table-responsive mt-5" >
            <table
                className="table table-bordered"
                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
            >

                <tbody>



                    <tr >
                        <td style={{ minHeight: '24px', width: '7%' }}>2.8</td>
                        <td style={{ minHeight: '24px', width: '31%' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                SECTION C — ALLOTMENT OF BONUS SHARES
                            </div>
                        </td>





                    </tr>




                </tbody>

            </table>

        </WrapperDashed>


        <div className='d-flex mt-2'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Number of Shares</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> indicating class, if any</div>
            <div></div>
        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.8.1</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>
        <div className='d-flex'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Allotment Ratio (Existing shares / bonus shares)</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '24%', padding: ' 5px 10px' }}> Total Amount (Rs)</div>
            <div></div>
        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.8.2</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '36%', padding: ' 5px 10px' }}> Details of Bonus Shares</div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '2%' }}></div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '24%', padding: ' 5px 10px' }}> </div>
        </div>


        <div className='d-flex mt-3'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '33%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '20%', padding: ' 5px 10px' }}> Resolution number</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '2%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Day</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Month</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '16%', padding: ' 5px 10px' }}>Year </div>
            <div></div>
        </div>
        <div className='d-flex '>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.8.3</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '33%', padding: ' 5px 10px' }}>Particulars of resolution of Board of directors / shareholders</div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '20%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '2%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '8px', width: '3%' }}></div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '8px', width: '3%' }}></div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px' , borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212'}}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
        </div>

        <WrapperDashed className="table-responsive mt-2" >
            <table
                className="table table-bordered"
                style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
            >

                <tbody>



                    <tr >
                        <td style={{ minHeight: '24px', width: '7%' }}>2.9</td>
                        <td style={{ minHeight: '24px', width: '31%' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                SECTION D—NAME, ADDRESSE, AND OTHER PARTICULARS, OF THE ALLOTTEES
                            </div>
                        </td>





                    </tr>




                </tbody>

            </table>

        </WrapperDashed>

        <Wrapper className="table-responsive mt-2" >
            <table
                className="table table-bordered"
                style={{ fontSize: "9px", fontFamily: "Montserrat rev=1" }}
            >
                <thead

                >
                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                        Date of allotment
                    </th>
                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                        Name of allottee in full
                    </th>
                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                        Father's / husband's name
                    </th>
                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                        Nationality
                    </th>
                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                        Country of origin in case of foreign national
                    </th>
                    <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                        Address of the allottee
                    </th>
                    <th
                        style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                    >
                        Number of shares allotted
                    </th>
                    <th
                        style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                    >
                        NIC No./NICOP/Passport No. of allottee/Registration Number, if any(in case of allotee other than natural person)
                    </th>

                </thead>
                <tbody>



                    <tr >
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(1)</td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(2)</td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(3) </td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(4)</td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(5)</td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(6)</td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(7)</td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>(8)</td>
                    </tr>
                    <tr >

                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>DD-MM-YYYY</td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> </td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Please enter NIC No. without (-)</td>
                    </tr>
                    <tr >

                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> </td>
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
                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                    </tr>




                </tbody>

            </table>

        </Wrapper>


















        <PartsWrapper className='mt-5 mb-3'>
            Part III
        </PartsWrapper>
        <div className='d-flex  mt-3' >
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
        <div className='d-flex mt-3'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.2</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
            <ScrollWrapper className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </ScrollWrapper>
        </div>
        <div className='d-flex mt-3'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.3</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Signatures  </div>
            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
        </div>
        <div className='d-flex mt-3'>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.4</div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
            <ScrollWrapper className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </ScrollWrapper>
        </div>

        <div className='d-flex mt-3'>
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
            <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
            <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{  width: '4%', padding: ' 5px 10px', borderLeft:'1px solid #121212', borderTop:'1px solid #121212',  borderBottom:'1px solid #121212' }}> </div>
            <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
        </div>
        <PartsWrapper style={{ justifyContent: 'start' }} className='mt-4 mb-3'>
            Enclosures:
        </PartsWrapper>


        <div className='mt-3 ml-5'>
            1.&nbsp;&nbsp;&nbsp;&nbsp;In case shares are allotted against cash consideration, a report from Auditor of the Company in terms of section 70(1)(b) of the Act as per Appendix attached herewith, to the effect that the amount of consideration has been received in full.
        </div>
        <div className='mt-3 ml-5'>
            2.&nbsp;&nbsp;&nbsp;&nbsp;In case shares are allotted against consideration otherwise than in cash, a copy of the  contract in writing constituting the title of the allottee to the allotment together with a contract of sale, or for services or other consideration in respect of which that allotment was made, such contract being duly stamped.
        </div>
        <div className='mt-3 ml-5'>
            3.&nbsp;&nbsp;&nbsp;&nbsp;In case bonus shares are issued, copies of the resolution of Board of Directors /members authorizing the issue of such shares.
        </div>
        <div className='mt-3 ml-5'>
            4.&nbsp;&nbsp;&nbsp;&nbsp;In case the shares are issued at discount, a copy of the special resolution passed by the members authorizing such issue and where the maximum rate of discount exceeds limits specified in the Act, a copy of the order of the Commission permitting the issue at the higher percentage.
        </div>
        <div className='mt-3 ml-5'>
            5.&nbsp;&nbsp;&nbsp;&nbsp;In case of allotment of shares in consequence of the exercise of the option for conversion in terms of an agreement for participation term certificates, term finance certificates, redeemable capital, musharika or hire-purchase shall be reported in Section-B and copies of the relevant documents submitted with the return.
        </div>
        <div className='mt-3 ml-5'>
            6.&nbsp;&nbsp;&nbsp;&nbsp;Any other document, certificate, report etc required under any regulation pertaining to issuance of shares.
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
const WrapperDashed = styled.div`

  td {
    
    border: 1px dashed #dddcdc;
}

`;