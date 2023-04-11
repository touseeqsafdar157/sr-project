import React, { useState, useEffect } from 'react'
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "../reporting/page-template";
import {
    getCompanies,
} from "../../../store/services/company.service";
import styled from 'styled-components';
export const StatutoryForm7 = ({ data, formTemplate = false }) => {
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

            {formTemplate ?
                <PDFExport
                    paperSize="A4"
                    margin="1cm"
                    scale={0.6}
                    fileName={`Statutory Requirment Form 7`}
                    pageTemplate={PageTemplate}
                    ref={pdfExportComponent}
                >
                    <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                    <FormName>
                        Form 7
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
                                {` 2018 [See [Section 85 (1) (a) Regulation 4]`}

                            </div>

                        </div>
                    </div>

                    <div className='row mt-4'>
                        <div className='col-md-12'>
                            <HeadingWrapper className='d-flex justify-content-center' style={{ textDecoration: 'underline' }}>
                                NOTICE OF ALTERATION IN SHARE CAPITAL



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
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>1.1</div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}>CUIN (Registration Number)  </div>
                                <div className='align-items-center  d-flex'  >{
                                    '1234 552'.split("")?.map((item, idx) => {
                                        if (item == ' ') return
                                        return <div style={{ minWidth: '30px', minHeight: '34px', marginLeft: '2px', border: '1px solid #121212', borderRadius: '3px', padding: '6px 9px' }}></div>
                                    })
                                }
                                </div>
                            </div>


                            <div className='d-flex mt-2'>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>1.2</div>
                                <div className='align-items-center' style={{ width: '28%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>Name of the Company  </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' }}> </div>
                            </div>
                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "12px", fontFamily: "Montserrat rev=1 !important" }}
                                >

                                    <tbody>



                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>1.3</td>
                                            <td colSpan={3} style={{ verticalAlign: 'sub', minHeight: '24px' }}>Memorandum of fee for increase in authorized capital:</td>

                                        </tr>
                                        <tr >

                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>1.3.1</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '67%' }}>Total amount payable on capital as increased (Rs.)</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '19%' }}></td>

                                        </tr>
                                        <tr >

                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td colSpan={2} style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>

                                        </tr>
                                        <tr >

                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>1.3.2</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '67%' }}>Amount which would have been payable by reference to its capital immediately before the increase (Rs)</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '19%' }}></td>

                                        </tr>
                                        <tr >

                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td colSpan={2} style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>

                                        </tr>
                                        <tr >

                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>1.3.3</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '67%' }}>Difference of 1.4.1 and 1.4.2 (Rs.)</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '19%' }}></td>

                                        </tr>




                                    </tbody>

                                </table>

                            </Wrapper>
                            <div className='d-flex  mt-2'>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>1.3</div>
                                <div className='align-items-center' style={{ width: '20.20%', paddingLeft: '20px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>Fee Payment Details</div>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '5%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>1.3.1</div>
                                <div className='align-items-center' style={{ width: '13.20%', paddingLeft: '20px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>Challan No.</div>
                                <div className='align-items-center' style={{ width: '17.20%', paddingLeft: '20px', minHeight: '34px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '5%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>1.3.3</div>
                                <div className='align-items-center' style={{ width: '13.20%', paddingLeft: '20px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>Amount</div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '19.20%', paddingLeft: '20px', minHeight: '34px' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}><i>	* fee for increase in authorized capital plus filing fee of this form </i></div>
                            <PartsWrapper className='mt-4 mb-3'>
                                Part II
                            </PartsWrapper>

                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "12px", fontFamily: "Montserrat rev=1 !important" }}
                                >

                                    <tbody>



                                       
                                        <tr >

                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.1</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '46%' }}>Notice is hereby given pursuant to section 85 of the Companies Act, 2017 that a special resolution was passed for increase in authorized share capital on:</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '47%' }}> 
                                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "12px", fontFamily: "Montserrat rev=1 !important" }}
                                >

                                    <tbody>



                                       
                                        <tr >

                                            <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px' }}>Day</td>
                                            <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px' }}>Month</td>
                                            <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px'}}>Year</td>

                                        </tr>
                                        <tr >

                                            <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                            <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                            <td style={{ verticalAlign: 'sub', height: '37px'}}></td>
                                            <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                            <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                            <td style={{ verticalAlign: 'sub', height: '37px'}}></td>

                                        </tr>
                                       
                                       




                                    </tbody>

                                </table>

                            </Wrapper>
                            </td>

                                        </tr>
                                        <tr >

                                           
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.2</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '46%' }}>Share capital increased in pursuance of an obligation of the company under an agreement on (date of agreement with party to the agreement)</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '47%' }}>
                                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "12px", fontFamily: "Montserrat rev=1 !important" }}
                                >

                                    <tbody>



                                       
                                        <tr >

                                            <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px' }}>Day</td>
                                            <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px' }}>Month</td>
                                            <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px'}}>Year</td>

                                        </tr>
                                        <tr >

                                            <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                            <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                            <td style={{ verticalAlign: 'sub', height: '37px'}}></td>
                                            <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                            <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                            <td style={{ verticalAlign: 'sub', height: '37px'}}></td>

                                        </tr>
                                       
                                       




                                    </tbody>

                                </table>

                            </Wrapper>
                            <div style={{marginTop: '50px', border: '1px solid #121212', width: '100%', minHeight: '70px'}}/>

                                            </td>

                                        </tr>
                                       
                                       




                                    </tbody>

                                </table>

                            </Wrapper>




                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "12px", fontFamily: "Montserrat rev=1 !important" }}
                                >

                                    <tbody>



                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}></td>
                                            <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}>Amount (Rs)</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}>Divided into (no of shares)</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}>Of Rs. per share</td>

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}></td>
                                            <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.3.1</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}>Existing authorized share capital</td>
                                            <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                        </tr>
                                       
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}></td>
                                            <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.3.2</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}>Addition</td>
                                            <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}></td>
                                            <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.3.3</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}>New authorised share capital</td>
                                            <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                        </tr>


                                    </tbody>

                                </table>

                            </Wrapper>

                            <div className='d-flex mt-2'>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>2.4</div>
                                <div className='align-items-center' style={{ width: '33%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>Conditions subject to which the new shares have been or are to be issued </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '60%', padding: ' 5px 10px' }}> </div>
                            </div>
                            <PartsWrapper className='mt-4 mb-4'>
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

                            <div className='d-flex mt-4'>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.2</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </div>
                                <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </div>
                            </div>
                            <div className='d-flex mt-2'>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.3</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Signatures  </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </div>
                            </div>
                            <div className='d-flex mt-2'>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.4</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </div>
                            </div>

                            <div className='d-flex mt-2'>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                                <div className='align-items-center' style={{ width: '51%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                                <div className='align-items-center' style={{ width: '10%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> Day</div>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '3%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                                <div className='align-items-center' style={{ width: '10%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> Month</div>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '3%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '16%', padding: ' 5px 10px' }}>Year </div>
                                <div></div>
                            </div>
                            <div className='d-flex '>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}>3.5</div>
                                <div className='align-items-center' style={{ width: '51%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}>Date</div>
                                <div className='align-items-center' style={{ width: '5%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                                <div className='align-items-center' style={{ width: '5%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '3%', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                                <div className='align-items-center' style={{ width: '5%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                                <div className='align-items-center' style={{ width: '5%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                                <div className='align-items-center' style={{ paddingLeft: '2px', width: '3%', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                                <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                                <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                                <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                                <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212' }}> </div>
                            </div>
                            <PartsWrapper className='mt-4 mb-4' style={{ textDecoration: 'none', justifyContent: 'start' }}>
                                Enclosures:
                            </PartsWrapper>
                            <ul style={{paddingLeft: '120px', listStyle: 'disc', marginTop: '10px'}}>
        <li >Amended Memorandum of Association and if applicable, copy of articles of association. </li>
    </ul>

                        </div>
                    </div>

                    </div>
                </PDFExport> :
               <PDFExport
               paperSize="A4"
               margin="1cm"
               scale={0.6}
               fileName={`Statutory Requirment Form 7`}
               pageTemplate={PageTemplate}
               ref={pdfExportComponent}
           >
             <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
               <FormName>
                   Form 7
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
                           {` 2018 [See [Section 85 (1) (a) Regulation 4]`}

                       </div>

                   </div>
               </div>

               <div className='row mt-4'>
                   <div className='col-md-12'>
                       <HeadingWrapper className='d-flex justify-content-center' style={{ textDecoration: 'underline' }}>
                           NOTICE OF ALTERATION IN SHARE CAPITAL



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
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>1.1</div>
                           <div className='align-items-center' style={{ border: '1px solid #121212', width: '28%', padding: ' 5px 10px' }}>CUIN (Registration Number)  </div>
                           <div className='align-items-center  d-flex'  >{
                               '1234 552'.split("")?.map((item, idx) => {
                                   if (item == ' ') return
                                   return <div style={{ minWidth: '30px', minHeight: '34px', marginLeft: '2px', border: '1px solid #121212', borderRadius: '3px', padding: '6px 9px' }}></div>
                               })
                           }
                           </div>
                       </div>


                       <div className='d-flex mt-2'>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>1.2</div>
                           <div className='align-items-center' style={{ width: '28%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>Name of the Company  </div>
                           <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' , fontFamily: `${fontfamilyforDynimicData}` }}>{CompanyData?.company_name || ''} </div>
                       </div>
                       <Wrapper className="table-responsive mt-2" >
                           <table
                               className="table table-bordered"
                               style={{ fontSize: "12px", fontFamily: "Montserrat rev=1 !important" }}
                           >

                               <tbody>



                                   <tr >
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>1.3</td>
                                       <td colSpan={3} style={{ verticalAlign: 'sub', minHeight: '24px' }}>Memorandum of fee for increase in authorized capital:</td>

                                   </tr>
                                   <tr >

                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>1.3.1</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '67%' }}>Total amount payable on capital as increased (Rs.)</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '19%' }}></td>

                                   </tr>
                                   <tr >

                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td colSpan={2} style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>

                                   </tr>
                                   <tr >

                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>1.3.2</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '67%' }}>Amount which would have been payable by reference to its capital immediately before the increase (Rs)</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '19%' }}></td>

                                   </tr>
                                   <tr >

                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td colSpan={2} style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>

                                   </tr>
                                   <tr >

                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>1.3.3</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '67%' }}>Difference of 1.4.1 and 1.4.2 (Rs.)</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '19%' }}></td>

                                   </tr>




                               </tbody>

                           </table>

                       </Wrapper>
                       <div className='d-flex  mt-2'>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>1.3</div>
                           <div className='align-items-center' style={{ width: '20.20%', paddingLeft: '20px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>Fee Payment Details</div>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '5%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>1.3.1</div>
                           <div className='align-items-center' style={{ width: '13.20%', paddingLeft: '20px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>Challan No.</div>
                           <div className='align-items-center' style={{ width: '17.20%', paddingLeft: '20px', minHeight: '34px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '5%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>1.3.3</div>
                           <div className='align-items-center' style={{ width: '13.20%', paddingLeft: '20px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>Amount</div>
                           <div className='align-items-center' style={{ border: '1px solid #121212', width: '19.20%', paddingLeft: '20px', minHeight: '34px' }}></div>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'center' }}><i>	* fee for increase in authorized capital plus filing fee of this form </i></div>
                       <PartsWrapper className='mt-4 mb-3'>
                           Part II
                       </PartsWrapper>

                       <Wrapper className="table-responsive mt-2" >
                           <table
                               className="table table-bordered"
                               style={{ fontSize: "12px", fontFamily: "Montserrat rev=1 !important" }}
                           >

                               <tbody>



                                  
                                   <tr >

                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.1</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '46%' }}>Notice is hereby given pursuant to section 85 of the Companies Act, 2017 that a special resolution was passed for increase in authorized share capital on:</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '47%' }}> 
                                       <Wrapper className="table-responsive mt-2" >
                           <table
                               className="table table-bordered"
                               style={{ fontSize: "12px", fontFamily: "Montserrat rev=1 !important" }}
                           >

                               <tbody>



                                  
                                   <tr >

                                       <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px' }}>Day</td>
                                       <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px' }}>Month</td>
                                       <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px'}}>Year</td>

                                   </tr>
                                   <tr >

                                       <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                       <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                       <td style={{ verticalAlign: 'sub', height: '37px'}}></td>
                                       <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                       <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                       <td style={{ verticalAlign: 'sub', height: '37px'}}></td>

                                   </tr>
                                  
                                  




                               </tbody>

                           </table>

                       </Wrapper>
                       </td>

                                   </tr>
                                   <tr >

                                      
                                   <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.2</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '46%' }}>Share capital increased in pursuance of an obligation of the company under an agreement on (date of agreement with party to the agreement)</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '47%' }}>
                                       <Wrapper className="table-responsive mt-2" >
                           <table
                               className="table table-bordered"
                               style={{ fontSize: "12px", fontFamily: "Montserrat rev=1 !important" }}
                           >

                               <tbody>



                                  
                                   <tr >

                                       <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px' }}>Day</td>
                                       <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px' }}>Month</td>
                                       <td colSpan={2} style={{ verticalAlign: 'sub', height: '100px'}}>Year</td>

                                   </tr>
                                   <tr >

                                       <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                       <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                       <td style={{ verticalAlign: 'sub', height: '37px'}}></td>
                                       <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                       <td style={{ verticalAlign: 'sub', height: '37px' }}></td>
                                       <td style={{ verticalAlign: 'sub', height: '37px'}}></td>

                                   </tr>
                                  
                                  




                               </tbody>

                           </table>

                       </Wrapper>
                       <div style={{marginTop: '50px', border: '1px solid #121212', width: '100%', minHeight: '70px'}}/>

                                       </td>

                                   </tr>
                                  
                                  




                               </tbody>

                           </table>

                       </Wrapper>




                       <Wrapper className="table-responsive mt-2" >
                           <table
                               className="table table-bordered"
                               style={{ fontSize: "12px", fontFamily: "Montserrat rev=1 !important" }}
                           >

                               <tbody>



                                   <tr >
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}></td>
                                       <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}>Amount (Rs)</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}>Divided into (no of shares)</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}>Of Rs. per share</td>

                                   </tr>
                                   <tr >
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}></td>
                                       <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                   </tr>
                                   <tr >
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.3.1</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}>Existing authorized share capital</td>
                                       <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                   </tr>
                                  
                                   <tr >
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}></td>
                                       <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                   </tr>
                                   <tr >
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.3.2</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}>Addition</td>
                                       <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                   </tr>
                                   <tr >
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}></td>
                                       <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                   </tr>
                                   <tr >
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '7%' }}>2.3.3</td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '26%' }}>New authorised share capital</td>
                                       <td  style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>
                                       <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '20%' }}></td>

                                   </tr>


                               </tbody>

                           </table>

                       </Wrapper>

                       <div className='d-flex mt-2'>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>2.4</div>
                           <div className='align-items-center' style={{ width: '33%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}>Conditions subject to which the new shares have been or are to be issued </div>
                           <div className='align-items-center' style={{ border: '1px solid #121212', width: '60%', padding: ' 5px 10px' }}> </div>
                       </div>
                       <PartsWrapper className='mt-4 mb-4'>
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

                       <div className='d-flex mt-4'>
                           <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.2</div>
                           <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                           <div className='align-items-center' style={{ border: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </div>
                           <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </div>
                       </div>
                       <div className='d-flex mt-2'>
                           <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.3</div>
                           <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Signatures  </div>
                           <div className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </div>
                       </div>
                       <div className='d-flex mt-2'>
                           <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>3.4</div>
                           <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '44%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
                           <div className='align-items-center' style={{ border: '1px solid #121212', width: '49%', padding: ' 5px 10px' }}> </div>
                       </div>

                       <div className='d-flex mt-2'>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                           <div className='align-items-center' style={{ width: '51%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                           <div className='align-items-center' style={{ width: '10%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> Day</div>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '3%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                           <div className='align-items-center' style={{ width: '10%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}> Month</div>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '3%', borderLeft: '1px solid #121212', borderTop: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                           <div className='align-items-center' style={{ border: '1px solid #121212', width: '16%', padding: ' 5px 10px' }}>Year </div>
                           <div></div>
                       </div>
                       <div className='d-flex '>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '7%', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}>3.5</div>
                           <div className='align-items-center' style={{ width: '51%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}>Date</div>
                           <div className='align-items-center' style={{ width: '5%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                           <div className='align-items-center' style={{ width: '5%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '3%', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                           <div className='align-items-center' style={{ width: '5%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                           <div className='align-items-center' style={{ width: '5%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                           <div className='align-items-center' style={{ paddingLeft: '2px', width: '3%', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}></div>
                           <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                           <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                           <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212' }}> </div>
                           <div className='align-items-center' style={{ width: '4%', padding: ' 5px 10px', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212' }}> </div>
                       </div>
                       <PartsWrapper className='mt-4 mb-4' style={{ textDecoration: 'none', justifyContent: 'start' }}>
                           Enclosures:
                       </PartsWrapper>
                       <ul style={{paddingLeft: '120px', listStyle: 'disc', marginTop: '10px'}}>
   <li >Amended Memorandum of Association and if applicable, copy of articles of association. </li>
</ul>

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