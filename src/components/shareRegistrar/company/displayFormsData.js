import React, { Suspense, useEffect, useState } from 'react'
import styled from 'styled-components'
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "../reporting/page-template";
import moment from 'moment';
import Spinner from "components/common/spinner";
import {
    getCompanies,
} from "../../../store/services/company.service";
export const DisplayFormsData = ({ data, viewTemplate = false, formATemplate = false }) => {
    const baseEmail = sessionStorage.getItem("email") || "";
    const pdfExportComponent = React.useRef(null);
    const [loading, setLoading] = useState(true);
    const [CompanyData, setCompanyData] = useState([])
    const [deactiveDirector, setDriectorDeactive] = useState(null);
    const [ActiveDirector, SetActiveDirector] = useState(null)
    const [companySectory, setCompanySectory] = useState(null)
    const [companyCeo, setCompanyCeo] = useState(null)
    const [companyCfo, setCompanyCfo] = useState(null)
    const [director, setDirector] = useState(null)
    const [legalAdvisor, setLegalAdvisor] = useState(null)
    const [allDirectors, setAllDirectors] = useState(null);
    const [companyCsCFO, setcompanyCSCfo] = useState(null)
    const [ceoCnic, setCompanyCeoCnic] = useState('')
    const [cfoCnic, setCompanycfoCnic] = useState('')
    const [sectoryCnic, setSectoryCnic] = useState('')
    const [legalAdvisorCnic, setLegalAdvisorCnic] = useState('')
    const [fontFamilyForStaticData, setFontFamilyForStaticData] = useState('Montserrat, sans-serif')
    const [fontSizeForStaticData, setFontSizeForStaticData] = useState('14px')
    const [fontfamilyforDynimicData, setFontFamilyForDynmicData] = useState('Segoe Print')
    const [fontColor, setFontColor] = useState('')
    const [compnaygovernance] = useState([])
    const getAllCompanies = async () => {
        setLoading(true)
        try {
            const response = await getCompanies(baseEmail);
            if (response.status === 200) {
                const parents = response.data.data;
                const company = parents?.find(ite => ite?.code == data?.company_code)
                const governance = JSON.parse(company.governance);
                const CFO = governance.find(item => item?.role?.toLowerCase()?.trim() == 'cfo')
                const ceo = governance.find(item => item?.role?.toLowerCase()?.trim() == 'ceo')
                const sectory = governance.find(item => item?.role?.toLowerCase()?.trim() == 'company secretary')
                const coo = governance.find(item => item?.role?.toLowerCase()?.trim() == 'coo')
                const cs_cfo = governance.find(item => item?.role?.toLowerCase()?.trim() == 'cfo/company secretary')
                const directr = governance?.find(item => item?.role == 'Director')
                const alldirectrs = governance?.filter(item => item?.role == 'Director' && item?.active?.toLowerCase() == 'n')
                if (ceo?.cnic_passport) {
                    const cnic = ceo?.cnic_passport?.replaceAll('-', '')?.replaceAll('_', '')
                    setCompanyCeoCnic(cnic)
                }
                if (cs_cfo?.cnic_passport) {
                    const cfo_cnic = cs_cfo?.cnic_passport?.replaceAll('-', '').replaceAll('_', '')
                    setSectoryCnic(cfo_cnic)
                    setCompanycfoCnic(cfo_cnic)
                }
                else {

                    if (sectory?.cnic_passport) {
                        const sectory_cnic = sectory?.cnic_passport?.replaceAll('-', '').replaceAll('_', '')
                        setSectoryCnic(sectory_cnic)
                    }
                    if (CFO?.cnic_passport) {
                        const cfo_cnic = CFO?.cnic_passport?.replaceAll('-', '').replaceAll('_', '')
                        setCompanycfoCnic(cfo_cnic)
                    }
                }


                setAllDirectors(alldirectrs)
                setCompanyData(company)
                console.log('company', company)
                if (company?.service_providers) {
                    const service = JSON.parse(company?.service_providers)
                    const legal = service?.find(item => item?.type == 'Legal Advisor');
                    if (legal?.cnic) {
                        const legal_cnic = legal?.cnic?.replaceAll('-', '').replaceAll('_', '')
                        setLegalAdvisorCnic(legal_cnic)
                    }
                    setLegalAdvisor(legal)
                }
                setCompanyCeo(ceo)
                setCompanySectory(sectory)
                setCompanyCfo(CFO)
                setcompanyCSCfo(cs_cfo)
                setDirector(directr)
                if (governance?.length) {
                    const resign = governance?.filter(item => item?.active?.toLowerCase() == 'y' && item?.role == 'Director' && item?.date == data?.start_date)
                    const active = governance?.filter(item => item?.active?.toLowerCase() == 'n' && item?.role == 'Director' && item?.date == data?.start_date)
                    setDriectorDeactive(resign)
                    SetActiveDirector(active)

                }

                if (ceo?.contact) {
                    compnaygovernance.push(ceo.contact)
                } if (sectory?.contact) {
                    compnaygovernance.push(sectory.contact)
                }

                if (CFO?.contact) {
                    compnaygovernance.push(CFO.contact)
                } if (directr?.contact) {
                    compnaygovernance.push(directr.contact)
                }

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
            {loading ? <Spinner /> : viewTemplate ?
                <PDFExport
                    paperSize="A4"
                    margin="1cm"
                    scale={0.6}
                    fileName={`Statutory Requirment Form 29`}
                    pageTemplate={PageTemplate}
                    ref={pdfExportComponent}
                >
                     <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                    <FormName>
                        Form 29
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
                                [Section 197 and Regulations 4 & 20]
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12'>
                            <HeadingWrapper className='d-flex justify-content-center'>
                                PARTICULARS OF DIRECTORS AND OFFICERS, INCLUDING THE CHIEF
                            </HeadingWrapper>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12'>
                            <HeadingWrapper className='d-flex justify-content-center'>
                                EXECUTIVE, SECRETARY, CHIEF FINANCIAL OFFICER, AUDITORS AND LEGAL
                            </HeadingWrapper>

                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12'>
                            <HeadingWrapper className='d-flex justify-content-center'>
                                ADVISER OR OF ANY CHANGE THEREIN
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
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>1.1</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>CUIN (Registration Number)  </div>
                                <div className='align-items-center  d-flex'  >{
                                    '1234 55'.split("")?.map((item, idx) => {
                                        if (item == ' ') return
                                        return <div style={{ minWidth: '30px', minHeight: '34px', marginLeft: '2px', border: '1px solid #121212', borderRadius: '3px', padding: '6px 9px' }}></div>
                                    })
                                }
                                </div>
                            </div>


                            <div className='d-flex mt-2'>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>1.2</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Name of the Company  </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '69%', padding: ' 5px 10px' }}> </div>
                            </div>




                            <div className='d-flex  mt-2'>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>1.3</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '20.20%', paddingLeft: '20px' }}>Fee Payment Details</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.1</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Challan No.</div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '17.20%', paddingLeft: '20px', minHeight: '34px' }}></div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.3</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Amount</div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '23.20%', paddingLeft: '20px', minHeight: '34px' }}></div>

                            </div>
                            <PartsWrapper className='mt-4 mb-3'>
                                Part II
                            </PartsWrapper>
                            <div className='d-flex align-items-center mt-4' style={{ gap: '50px' }}>
                                <div className='align-items-center'>2.</div>
                                <div className='align-items-center' >Particulars:</div>

                            </div>
                            <Wrapper className="table-responsive mt-3" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                >
                                    <thead

                                    >
                                        <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                            Present Name in Full
                                        </th>
                                        <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                            NIC No or passport No. in case of Foreign National
                                        </th>
                                        <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                            Father’s/ Husband’s Name
                                        </th>
                                        <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                            Address
                                        </th>
                                        <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                            Designation
                                        </th>
                                        <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                            Nationality**
                                        </th>
                                        <th
                                            style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                        >
                                            Business Occupation*** (if any)
                                        </th>
                                        <th

                                            style={{ verticalAlign: 'sub', border: '1px solid #121212' }}
                                        >
                                            Date of present appointment or change
                                        </th>
                                        <th
                                            style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                        >
                                            Mode of appointment / change / any other Remarks****
                                        </th>
                                        <th
                                            style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                        >
                                            Nature of directorship (nominee/independent/additional/other)
                                        </th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ verticalAlign: 'sub' }}>(a)</td>
                                            <td style={{ verticalAlign: 'sub' }}> (b)</td>
                                            <td style={{ verticalAlign: 'sub' }}> (c)</td>
                                            <td style={{ verticalAlign: 'sub' }}>
                                                (d)
                                            </td>
                                            <td style={{ verticalAlign: 'sub' }} >(e)</td>
                                            <td style={{ verticalAlign: 'sub' }}>(f)</td>
                                            <td style={{ verticalAlign: 'sub' }}>(g)</td>

                                            <td style={{ verticalAlign: 'sub' }}>(h)</td>
                                            <td style={{ verticalAlign: 'sub' }}>(i)</td>
                                            <td style={{ verticalAlign: 'sub' }}>(j)</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={9} >2.1 New appointment/election:</td>
                                            <td></td>
                                        </tr>
                                        {ActiveDirector?.length ? ActiveDirector?.map((item, idx) => {
                                            return <tr key={idx}>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.name}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.cnic_passport}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.father_husband_name} </td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.address}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.role}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.nationality}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.business}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.date} </td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.reason}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.directorship}</td>
                                            </tr>
                                        }) : <>
                                            <tr >
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}> </td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}> </td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                            </tr>
                                            <tr >
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}> </td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}> </td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                            </tr></>}
                                        <tr>
                                            <td colSpan={9} >2.2 Ceasing of office/Retirement/Resignation:</td>
                                            <td></td>
                                        </tr>
                                        {deactiveDirector?.length ? deactiveDirector?.map((item, idx) => {
                                            return <tr key={idx}>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.name}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.cnic_passport}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.father_husband_name} </td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.address}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.role}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.nationality}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.business}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.date} </td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.reason}</td>
                                                <td style={{ verticalAlign: 'sub' }}>{item?.directorship}</td>
                                            </tr>
                                        }) : <>
                                            <tr >
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}> </td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}> </td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                            </tr>
                                            <tr >
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}> </td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}> </td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                                <td style={{ verticalAlign: 'sub' }}></td>
                                            </tr></>}
                                        <tr>
                                            <td colSpan={9} >2.3 Any other change in particulars relating to columns (a) to (g) above:</td>
                                            <td></td>
                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}> </td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}> </td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}> </td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}> </td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                            <td style={{ verticalAlign: 'sub' }}></td>
                                        </tr>
                                    </tbody>

                                </table>

                            </Wrapper>

                            <ul className='mt-5' style={{ listStyleType: 'none', }}>
                                <li className='mt-2 d-flex' style={{ alignItems: 'center' }}><b style={{ fontSize: '20px' }}>*</b> <span style={{ paddingLeft: '10px', marginTop: '-6px' }}> In the case of a firm, the full name, address and above mentioned particulars of each partner, and the date on which each became a partner. </span></li>
                                <li className='mt-2 d-flex' style={{ alignItems: 'center' }}> <b style={{ fontSize: '20px' }}>**</b> <span style={{ paddingLeft: '10px', marginTop: '-6px' }}>In case the nationality is not the nationality of origin, provide the nationality of origin as well.</span></li>
                                <li className='mt-2 d-flex' style={{ alignItems: 'center' }}><b style={{ fontSize: '20px' }}>***</b> <span style={{ paddingLeft: '10px', marginTop: '-6px' }}>Also provide particulars of other directorships or offices held, if any.”.</span></li>
                                <li className='mt-2 d-flex' style={{ alignItems: 'center' }}><b style={{ fontSize: '20px' }}>****</b> <span style={{ paddingLeft: '10px', marginTop: '-6px' }}>In case of resignation of a director, the resignation letter and in case of removal of a director, member’s resolution be attached</span></li>

                            </ul>
                            <PartsWrapper className='mt-5 mb-3'>
                                Part III
                            </PartsWrapper>
                            <div className='d-flex  mt-5' >
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>3.1</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '97%', padding: ' 5px 10px' }}>
                                    <div>Declaration</div>
                                    <div className='mt-2'>I do hereby solemnly, and sincerely declare that the information provided in the form is:</div>
                                    <ul className='mt-3' style={{ listStyleType: 'none', }}>
                                        <li className='mt-2 '><span style={{ fontSize: '16px' }}>(i)</span> <span style={{ paddingLeft: '10px' }}>true and correct to the best of my knowledge, in consonance with the record as maintained by the Company and nothing has been concealed; and  </span></li>
                                        <li className='mt-2 '> <span style={{ fontSize: '16px' }}>(ii)</span> <span style={{ paddingLeft: '10px' }}>hereby reported after complying with and fulfilling all requirements under the relevant provisions of law, rules, regulations, directives, circulars and notifications whichever is applicable.</span></li>

                                    </ul>
                                </div>
                            </div>
                            <div className='d-flex mt-2'>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>3.2</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '46%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '34%', padding: ' 5px 10px' }}> </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '34%', padding: ' 5px 10px' }}> </div>
                            </div>
                            <div className='d-flex mt-2'>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>3.3</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '35%', padding: ' 5px 10px' }}>Signatures  </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '62%', padding: ' 5px 10px' }}> </div>
                            </div>
                            <div className='d-flex mt-2'>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>3.4</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '50%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '47%', padding: ' 5px 10px' }}> </div>
                            </div>

                            <div className='d-flex mt-2'>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '59%', padding: ' 5px 10px' }}> </div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Day</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Month</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '16%', padding: ' 5px 10px' }}>Year </div>
                                <div></div>
                            </div>
                            <div className='d-flex '>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>3.5</div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '59%', padding: ' 5px 10px' }}>Day</div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                            </div>


                        </div>
                    </div>
                    </div>
                </PDFExport> : formATemplate ?
                    <PDFExport
                        paperSize="A4"
                        margin="1cm"
                        scale={0.6}
                        fileName={`Statutory Alert Form A`}
                        pageTemplate={PageTemplate}
                        ref={pdfExportComponent}
                    >
                         <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                        <FormName>
                            Form A
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
                                    2018[Section 130(1) and Regulation 4]
                                </div>

                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-md-12'>
                                <HeadingWrapper className='d-flex justify-content-center'>
                                    ANNUAL RETURN OF COMPANY HAVING SHARE CAPITAL
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
                                        '1234 55'.split("")?.map((item, idx) => {
                                            if (item == ' ') return
                                            return <div style={{ minWidth: '30px', minHeight: '34px', marginLeft: '2px', border: '1px solid #121212', borderRadius: '3px', padding: '6px 9px' }}>{ }</div>
                                        })
                                    }
                                    </div>
                                </div>


                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>1.2</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Name of the Company  </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' }}> </div>
                                </div>


                                <div className='d-flex  mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>1.3</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '20.20%', paddingLeft: '20px' }}>Fee Payment Details</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.1</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Challan No.</div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '17.20%', paddingLeft: '20px', minHeight: '34px' }}></div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.3</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Amount</div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '19.20%', paddingLeft: '20px', minHeight: '34px' }}></div>
                                </div>

                                <div className='d-flex mt-5'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px', color: '#121212' }}> Day</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px', color: '#121212' }}> Month</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '16%', padding: ' 5px 10px', color: '#121212' }}>Year </div>
                                    <div></div>
                                </div>
                                <div className='d-flex '>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%', color: '#121212' }}>1.4</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px', color: '#121212' }}>Form A made up to</div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                </div>
                                <div className='d-flex mt-2 '>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%', color: '#121212' }}>1.5</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px', color: '#121212' }}>Date of AGM</div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                </div>
                                <PartsWrapper className='mt-4 mb-3'>
                                    Part II
                                </PartsWrapper>
                                <PartsWrapper style={{ justifyContent: 'start' }} className='mt-4 mb-3'>
                                    Section-AB
                                </PartsWrapper>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.1</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Registered office address  </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' }}> </div>
                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.2</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Email Address:  </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' }}> </div>
                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.3</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Office Tel. No.:  </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' }}> </div>
                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.4</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Office Fax No.: </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' }}> </div>
                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.5</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Principal line of business </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' }}> </div>
                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Mobile No. of Authorized officer
                                        (Chief Executive/ Director/ Company Secretary/Chief Financial Officer) </div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' }}> </div>
                                </div>


                                <div className='mt-5'>
                                    <div className="table-responsive " >
                                        <table
                                            className="table "
                                            style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                                        >

                                            <tbody>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}>2.7</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }} colSpan={4} >Authorized Share Capital</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Classes and kinds of Shares</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}> No. of Shares</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Amount</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Face Value</td>

                                                </tr>
                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Ordinary Shares</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}> </td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table-responsive mt-3 " >
                                        <table
                                            className="table "
                                            style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                                        >

                                            <tbody>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}>2.8</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }} colSpan={4} >Paid up Share Capital</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Classes and kinds of Shares</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}> No. of Shares</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Amount</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Face Value</td>

                                                </tr>
                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Ordinary Shares</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}> </td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="table-responsive  mt-3" >
                                        <table
                                            className="table "
                                            style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                                        >

                                            <tbody>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', maxWidth: '20px', width: '7%' }}>2.9</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold' }} colSpan={3} >Particulars of the holding /subsidiary company, if any</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Name of company</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Holding/Subsidiary</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>% of shares held</td>

                                                </tr>
                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}> </td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.10</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>Chief Executive Officer  </div>
                                </div>

                                <div className="table-responsive  mt-3" >
                                    <table
                                        className="table "
                                        style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                    >

                                        <tbody>

                                            <tr >
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}>2.10</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Name</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold' }} colSpan={13} ></td>
                                            </tr>

                                            <tr >
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Address</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold' }} colSpan={13} ></td>
                                            </tr>
                                            <tr>
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>CNIC</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>


                                            </tr>

                                        </tbody>
                                    </table>
                                </div>

                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.11</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>Chief Financial Officer  </div>
                                </div>

                                <div className="table-responsive  mt-3" >
                                    <table
                                        className="table "
                                        style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                    >

                                        <tbody>

                                            <tr >
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Name</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold' }} colSpan={13} ></td>
                                            </tr>

                                            <tr >
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Address</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold' }} colSpan={13} ></td>
                                            </tr>
                                            <tr>
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>CNIC</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>


                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.12</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>Secretary  </div>
                                </div>

                                <div className="table-responsive  mt-3" >
                                    <table
                                        className="table "
                                        style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                    >

                                        <tbody>

                                            <tr >
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Name</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold' }} colSpan={13} ></td>
                                            </tr>

                                            <tr >
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', maxWidth: '1px' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Address</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold' }} colSpan={13} ></td>
                                            </tr>
                                            <tr>
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>CNIC</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>


                                            </tr>

                                        </tbody>
                                    </table>
                                </div>

                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.13</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>Legal Advisor  </div>
                                </div>

                                <div className="table-responsive  mt-3" >
                                    <table
                                        className="table "
                                        style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                    >

                                        <tbody>

                                            <tr >
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Name</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold' }} colSpan={13} ></td>
                                            </tr>

                                            <tr >
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Address</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold' }} colSpan={13} ></td>
                                            </tr>
                                            <tr>
                                                <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>CNIC</td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>
                                                <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}></td>


                                            </tr>

                                        </tbody>
                                    </table>
                                </div>



                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.14</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212', fontWeight: 'bold' }}>Particulars of Auditor(s)  </div>
                                </div>

                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderLeft: '1px solid #121212', paddingLeft: '2px', width: '20%' }}>Name</div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '80%', padding: ' 5px 10px', color: '#121212' }}>Address </div>
                                </div>
                                <div className='d-flex'>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', paddingLeft: '2px', width: '20%', minHeight: '34px' }}></div>
                                    <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '80%', padding: ' 5px 10px', color: '#121212', minHeight: '34px' }}> </div>
                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.15</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212', fontWeight: 'bold' }}>Particulars of Share Registrar (if applicable)  </div>
                                </div>

                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderLeft: '1px solid #121212', paddingLeft: '2px', width: '20%' }}>Name</div>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', width: '80%', padding: ' 5px 10px', color: '#121212' }}>Address </div>
                                </div>
                                <div className='d-flex'>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', paddingLeft: '2px', width: '20%', minHeight: '34px' }}></div>
                                    <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '80%', padding: ' 5px 10px', color: '#121212', minHeight: '34px' }}> </div>
                                </div>
                                <div className='d-flex'>
                                    <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', paddingLeft: '2px', width: '20%', minHeight: '34px' }}>Email</div>
                                    <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', minHeight: '34px', width: '80%', padding: ' 5px 10px', color: '#121212' }}> </div>
                                </div>



                                <PartsWrapper style={{ justifyContent: 'start' }} className='mt-4 mb-3'>
                                    Section-B
                                </PartsWrapper>

                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.16</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>List of Directors as on the date annual return is made  </div>
                                </div>
                                <Wrapper className="table-responsive mt-3" >
                                    <table
                                        className="table table-bordered"
                                        style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                    >
                                        <thead

                                        >
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                S#
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                Name
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                Address
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                Nationality
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                NIC No. (Passport No. if foreigner)
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                Date of appointment or election                                            </th>

                                        </thead>
                                        <tbody>
                                            {[1, 2, 3, 4, 5, 6, 7]?.map((item, idx) => {
                                                return <tr key={idx}>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '34px' }}> </td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>

                                                </tr>
                                            })



                                            }


                                        </tbody>

                                    </table>

                                </Wrapper>

                                <div className='d-flex mt-5'>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.17</div>
                                    <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>List of members & debenture holders on the date upto which this Form is made  </div>
                                </div>

                                <Wrapper className="table-responsive mt-3" >
                                    <table
                                        className="table table-bordered"
                                        style={{ fontSize: "10px", fontFamily: "Montserrat rev=1"}}
                                    >
                                        <thead

                                        >
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                S#
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                Folio #
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                Name
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                Address
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                Nationality
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >CNIC No. (Passport No. if foreigner)
                                                No. of  shares held/Debenture                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                CNIC No. (Passport No. if foreigner)
                                            </th>

                                        </thead>
                                        <tbody>
                                            {[1, 2, 3, 4]?.map((item, idx) => {
                                                if (idx < 2) {
                                                    return <>
                                                        {idx == 0 && <tr>
                                                            <td colSpan={7}>Members</td>
                                                        </tr>}

                                                        <tr key={idx}>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}> </td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                        </tr>
                                                    </>
                                                }
                                                else {
                                                    return <>
                                                        {idx == 2 ? <tr>
                                                            <td colSpan={7}>Debenture holders</td>
                                                        </tr> : ''}

                                                        <tr key={idx}>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}> </td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                        </tr>
                                                    </>
                                                }

                                            })



                                            }


                                        </tbody>

                                    </table>

                                </Wrapper>










                                <div className='d-flex mt-4'>
                                    <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderRight: '1px solid #121212', borderTop: '1px solid #121212', paddingLeft: '2px', width: '100%' }}>2.18       Transfer of shares (debentures) since last Form A was made</div>
                                </div>
                                <Wrapper className="table-responsive" >
                                    <table
                                        className="table table-bordered"
                                        style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                    >
                                        <thead

                                        >
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                S#
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                Name of Transferor
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                Name of Transferee
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                Number of shares transferred
                                            </th>
                                            <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                Date of registration of transfer
                                            </th>

                                        </thead>
                                        <tbody>
                                            {[1, 2, 3, 4, 5, 6, 7]?.map((item, idx) => {
                                                if (idx >= 3) {
                                                    return <tr key={idx}>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub', fontWeight: 'bold', textDecoration: 'underline' }}>{idx == 3 ? 'Debenture holders' : ''}</td>
                                                        <td style={{ verticalAlign: 'sub' }}> </td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>

                                                    </tr>
                                                } else {
                                                    return <tr key={idx}>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub', fontWeight: 'bold', textDecoration: 'underline' }}>{idx == 0 ? 'Members' : ''}</td>
                                                        <td style={{ verticalAlign: 'sub' }}> </td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>

                                                    </tr>
                                                }

                                            })



                                            }


                                        </tbody>

                                    </table>

                                </Wrapper>
                                <PartsWrapper className='mt-5 mb-3'>
                                    Part III
                                </PartsWrapper>
                                <div className='d-flex  mt-5' >
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
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', paddingLeft: '2px', width: '7%' }}>3.2</div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '44%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '24.5%', padding: ' 5px 10px' }}> </div>
                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', paddingLeft: '2px', width: '7%' }}>3.3</div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '39%', padding: ' 5px 10px' }}>Signatures  </div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '55%', padding: ' 5px 10px' }}> </div>
                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', paddingLeft: '2px', width: '7%' }}>3.4</div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '46%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '47%', padding: ' 5px 10px' }}> </div>
                                </div>


                                <div className='d-flex mt-2'>
                                    <div className='align-items-center' style={{ border: '1px solid #121212', paddingLeft: '2px', width: '7%' }}></div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '55%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '8%', padding: ' 5px 10px' }}> Day</div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', paddingLeft: '2px', width: '3%' }}></div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '8%', padding: ' 5px 10px' }}> Month</div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', paddingLeft: '2px', width: '3%' }}></div>
                                    <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '16%', padding: ' 5px 10px' }}>Year </div>
                                    <div></div>
                                </div>
                                <div className='d-flex '>
                                    <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', paddingLeft: '2px', width: '7%' }}>3.5</div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '55%', padding: ' 5px 10px' }}>Day</div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', paddingLeft: '2px', width: '3%' }}></div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', paddingLeft: '2px', width: '3%' }}></div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                </div>
                                <PartsWrapper className='mt-5 mb-3'>
                                    INSTRUCTIONS FOR FILLING FORM-A
                                </PartsWrapper>
                                <div>
                                    1.&nbsp;&nbsp;The Form shall be made upto the date of last AGM of the Company or the last date of the calendar year where no AGM is held during the year.
                                </div>
                                <div>
                                    2.&nbsp;&nbsp;Under S. No.2.17 above, the aggregate number of shares held by each member should be stated.
                                </div>
                                <div>3.&nbsp;&nbsp;When the shares are of different classes the columns should be subdivided so that the number of each class held, is shown separately against S. Nos. 2.7, 2.8 and 2.17</div>
                                <div>4.&nbsp;&nbsp;If the space provided in the Form is insufficient, the required information should be listed in a separate statement attached to this return which should be similarly signed. </div>
                                <div>5.&nbsp;&nbsp;In case a body corporate is a member, registration number may be mentioned instead of NIC number. </div>
                                <div>6.&nbsp;&nbsp;In case of foreign nationals, indicate “passport number” in the space provided for “NIC No.” Pakistani nationals will only indicate “NIC No.”</div>
                                <div>7.&nbsp;&nbsp;This form is to be filed within 30 days of the date indicated in S.No.1.4</div>






                            </div>
                        </div>
                        </div>
                    </PDFExport>
                    : data?.req_code?.toLowerCase()?.includes('form 29')|| data?.req_code?.toLowerCase()?.includes('form29')?
                        <PDFExport
                            paperSize="A4"
                            margin="1cm"
                            scale={0.6}
                            fileName={`Statutory Alert Form 29`}
                            pageTemplate={PageTemplate}
                            ref={pdfExportComponent}
                        >
                             <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                            <FormName>
                                Form 29
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
                                        [Section 197 and Regulations 4 & 20]
                                    </div>

                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <HeadingWrapper className='d-flex justify-content-center'>
                                        PARTICULARS OF DIRECTORS AND OFFICERS, INCLUDING THE CHIEF
                                    </HeadingWrapper>

                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <HeadingWrapper className='d-flex justify-content-center'>
                                        EXECUTIVE, SECRETARY, CHIEF FINANCIAL OFFICER, AUDITORS AND LEGAL
                                    </HeadingWrapper>

                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <HeadingWrapper className='d-flex justify-content-center'>
                                        ADVISER OR OF ANY CHANGE THEREIN
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
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>1.1</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>CUIN (Registration Number)  </div>
                                        <div className='align-items-center  d-flex'  >{
                                            '1234 55'.split("")?.map((item, idx) => {
                                                if (item == ' ') return
                                                return <div style={{ minWidth: '30px', minHeight: '34px', marginLeft: '2px', border: '1px solid #121212', borderRadius: '3px', padding: '6px 9px' }}>{' '}</div>
                                            })
                                        }
                                        </div>
                                    </div>


                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>1.2</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Name of the Company  </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '69%', padding: ' 5px 10px',fontFamily: `${fontfamilyforDynimicData}` }}> {CompanyData?.company_name}</div>
                                    </div>




                                    <div className='d-flex  mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>1.3</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '20.20%', paddingLeft: '20px' }}>Fee Payment Details</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.1</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Challan No.</div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '17.20%', paddingLeft: '20px', minHeight: '34px' }}></div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.3</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Amount</div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '23.20%', paddingLeft: '20px', minHeight: '34px' }}></div>

                                    </div>
                                    <PartsWrapper className='mt-4 mb-3'>
                                        Part II
                                    </PartsWrapper>
                                    <div className='d-flex align-items-center mt-4' style={{ gap: '20px' }}>
                                        <div className='align-items-center'>2.</div>
                                        <div className='align-items-center' >Particulars:</div>

                                    </div>
                                    <Wrapper className="table-responsive mt-3" >
                                        <table
                                            className="table table-bordered"
                                            style={{ fontSize: "10px",  fontFamily: "Montserrat rev=1" }}
                                        >
                                            <thead

                                            >
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                    Present Name in Full
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    NIC No or passport No. in case of Foreign National
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Father’s/ Husband’s Name
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                    Usual residential address
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Designation
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Nationality**
                                                </th>
                                                <th
                                                    style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                                >
                                                    Business Occupation*** (if any)
                                                </th>
                                                <th

                                                    style={{ verticalAlign: 'sub', border: '1px solid #121212' }}
                                                >
                                                    Date of present appointment or change
                                                </th>
                                                <th
                                                    style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                                >
                                                    Mode of appointment / change / any other Remarks****
                                                </th>
                                                <th
                                                    style={{ verticalAlign: 'sub', border: '1px solid #121212' }}

                                                >
                                                    Nature of directorship (nominee/independent/additional/other)
                                                </th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ verticalAlign: 'sub' }}>(a)</td>
                                                    <td style={{ verticalAlign: 'sub' }}> (b)</td>
                                                    <td style={{ verticalAlign: 'sub' }}> (c)</td>
                                                    <td style={{ verticalAlign: 'sub' }}>
                                                        (d)
                                                    </td>
                                                    <td style={{ verticalAlign: 'sub' }} >(e)</td>
                                                    <td style={{ verticalAlign: 'sub' }}>(f)</td>
                                                    <td style={{ verticalAlign: 'sub' }}>(g)</td>

                                                    <td style={{ verticalAlign: 'sub' }}>(h)</td>
                                                    <td style={{ verticalAlign: 'sub' }}>(i)</td>
                                                    <td style={{ verticalAlign: 'sub' }}>(j)</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={9} >2.1 New appointment/election:</td>
                                                    <td></td>
                                                </tr>
                                                {ActiveDirector?.length ? ActiveDirector?.map((item, idx) => {
                                                    return <tr key={idx}>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}` }}>{item?.name}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}` }}>{item?.cnic_passport}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}` }}>{item?.father_husband_name} </td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}` }}>{item?.address}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}` }}>{item?.role}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}` }}>{item?.nationality}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}` }}>{item?.business}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}` }}>{item?.date} </td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}` }}>{item?.reason}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}` }}>{item?.directorship}</td>
                                                    </tr>
                                                }) : <>
                                                    <tr >
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}> </td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}> </td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                    </tr>
                                                    <tr >
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}> </td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}> </td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                    </tr></>}
                                                <tr>
                                                    <td colSpan={9} >2.2 Ceasing of office/Retirement/Resignation:</td>
                                                    <td></td>
                                                </tr>
                                                {deactiveDirector?.length ? deactiveDirector?.map((item, idx) => {
                                                    return <tr key={idx}>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}`}}>{item?.name}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}`}}>{item?.cnic_passport}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}`}}>{item?.father_husband_name} </td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}`}}>{item?.address}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}`}}>{item?.role}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}`}}>{item?.nationality}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}`}}>{item?.business}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}`}}>{item?.date} </td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}`}}>{item?.reason}</td>
                                                        <td style={{ verticalAlign: 'sub',fontFamily: `${fontfamilyforDynimicData}`}}>{item?.directorship}</td>
                                                    </tr>
                                                }) : <>
                                                    <tr >
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}> </td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}> </td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                    </tr>
                                                    <tr >
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}> </td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}> </td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                        <td style={{ verticalAlign: 'sub' }}></td>
                                                    </tr></>}
                                                <tr>
                                                    <td colSpan={9} >2.3 Any other change in particulars relating to columns (a) to (g) above:</td>
                                                    <td></td>
                                                </tr>
                                                <tr >
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}> </td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}> </td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                </tr>
                                                <tr >
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}> </td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}> </td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                    <td style={{ verticalAlign: 'sub' }}></td>
                                                </tr>
                                            </tbody>

                                        </table>

                                    </Wrapper>

                                    <ul className='mt-5' style={{ listStyleType: 'none', }}>
                                        <li className='mt-2 d-flex' style={{ alignItems: 'center' }}><b style={{ fontSize: '20px' }}>*</b> <span style={{ paddingLeft: '10px', marginTop: '-6px' }}> In the case of a firm, the full name, address and above mentioned particulars of each partner, and the date on which each became a partner. </span></li>
                                        <li className='mt-2 d-flex' style={{ alignItems: 'center' }}> <b style={{ fontSize: '20px' }}>**</b> <span style={{ paddingLeft: '10px', marginTop: '-6px' }}>In case the nationality is not the nationality of origin, provide the nationality of origin as well.</span></li>
                                        <li className='mt-2 d-flex' style={{ alignItems: 'center' }}><b style={{ fontSize: '20px' }}>***</b> <span style={{ paddingLeft: '10px', marginTop: '-6px' }}>Also provide particulars of other directorships or offices held, if any.”.</span></li>
                                        <li className='mt-2 d-flex' style={{ alignItems: 'center' }}><b style={{ fontSize: '20px' }}>****</b> <span style={{ paddingLeft: '10px', marginTop: '-6px' }}>In case of resignation of a director, the resignation letter and in case of removal of a director, member’s resolution be attached</span></li>

                                    </ul>
                                    <PartsWrapper className='mt-5 mb-3'>
                                        Part III
                                    </PartsWrapper>
                                    <div className='d-flex  mt-5' >
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>3.1</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '97%', padding: ' 5px 10px' }}>
                                            <div>Declaration</div>
                                            <div className='mt-2'>I do hereby solemnly, and sincerely declare that the information provided in the form is:</div>
                                            <ul className='mt-3' style={{ listStyleType: 'none', }}>
                                                <li className='mt-2 '><span style={{ fontSize: '16px' }}>(i)</span> <span style={{ paddingLeft: '10px' }}>true and correct to the best of my knowledge, in consonance with the record as maintained by the Company and nothing has been concealed; and  </span></li>
                                                <li className='mt-2 '> <span style={{ fontSize: '16px' }}>(ii)</span> <span style={{ paddingLeft: '10px' }}>hereby reported after complying with and fulfilling all requirements under the relevant provisions of law, rules, regulations, directives, circulars and notifications whichever is applicable.</span></li>

                                            </ul>
                                        </div>
                                    </div>
                                    <div className='d-flex mt-4'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>3.2</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '46%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '34%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '34%', padding: ' 5px 10px' }}> </div>
                                    </div>
                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>3.3</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '35%', padding: ' 5px 10px' }}>Signatures  </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '62%', padding: ' 5px 10px' }}> </div>
                                    </div>
                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>3.4</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '50%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '47%', padding: ' 5px 10px' }}> </div>
                                    </div>

                                    <div className='d-flex mt-4'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '59%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Day</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px' }}> Month</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '16%', padding: ' 5px 10px' }}>Year </div>
                                        <div></div>
                                    </div>
                                    <div className='d-flex '>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}>3.5</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '59%', padding: ' 5px 10px' }}>Day</div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
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
                            fileName={`Statutory Alert Form A`}
                            pageTemplate={PageTemplate}
                            ref={pdfExportComponent}
                        >
                             <div style={{fontFamily: `${fontFamilyForStaticData}`, fontSize: `${fontSizeForStaticData}`, fontWeight: 500}}>
                            <FormName>
                                Form A
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
                                        2018[Section 130(1) and Regulation 4]
                                    </div>

                                </div>
                            </div>
                            <div className='row mt-4'>
                                <div className='col-md-12'>
                                    <HeadingWrapper className='d-flex justify-content-center'>
                                        ANNUAL RETURN OF COMPANY HAVING SHARE CAPITAL
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
                                            '1234 55'.split("")?.map((item, idx) => {
                                                if (item == ' ') return
                                                return <div style={{ minWidth: '30px', minHeight: '34px', marginLeft: '2px', border: '1px solid #121212', borderRadius: '3px', padding: '6px 9px' }}>{ }</div>
                                            })
                                        }
                                        </div>
                                    </div>


                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>1.2</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Name of the Company  </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px', fontFamily: `${fontfamilyforDynimicData}` }}>{CompanyData?.company_name} </div>
                                    </div>


                                    <div className='d-flex  mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>1.3</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '20.20%', paddingLeft: '20px' }}>Fee Payment Details</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.1</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Challan No.</div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '17.20%', paddingLeft: '20px', minHeight: '34px' }}></div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '5%' }}>1.3.3</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '13.20%', paddingLeft: '20px' }}>Amount</div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '19.20%', paddingLeft: '20px', minHeight: '34px' }}></div>
                                    </div>

                                    <div className='d-flex mt-5'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px', color: '#121212' }}> Day</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '8%', padding: ' 5px 10px', color: '#121212' }}> Month</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '16%', padding: ' 5px 10px', color: '#121212' }}>Year </div>
                                        <div></div>
                                    </div>
                                    <div className='d-flex '>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%', color: '#121212' }}>1.4</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px', color: '#121212' }}>Form A made up to</div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    </div>
                                    <div className='d-flex mt-2 '>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%', color: '#121212' }}>1.5</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '55%', padding: ' 5px 10px', color: '#121212' }}>Date of AGM</div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    </div>
                                    <PartsWrapper className='mt-4 mb-3'>
                                        Part II
                                    </PartsWrapper>
                                    <PartsWrapper style={{ justifyContent: 'start' }} className='mt-4 mb-3'>
                                        Section-AB
                                    </PartsWrapper>
                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.1</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Registered office address  </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px', fontFamily: `${fontfamilyforDynimicData}` }}> </div>
                                    </div>
                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.2</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Email Address:  </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px', fontFamily: `${fontfamilyforDynimicData}` }}>{companyCeo?.email && companySectory?.email ? companyCeo?.email + ' , ' + companySectory?.email : companyCeo?.email ? companyCeo?.email : companySectory?.email} </div>
                                    </div>
                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.3</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Office Tel. No.:  </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px',fontFamily: `${fontfamilyforDynimicData}` }}>{companyCeo?.contact && companySectory?.contact ? companyCeo?.contact + ' , ' + companySectory?.contact : companyCeo?.contact ? companyCeo?.contact : companySectory?.contact} </div>
                                    </div>
                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.4</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Office Fax No.: </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px' }}> </div>
                                    </div>
                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.5</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Principal line of business </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px',fontFamily: `${fontfamilyforDynimicData}` }}>{CompanyData?.bussines_service || ''} </div>
                                    </div>
                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.6</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '28%', padding: ' 5px 10px' }}>Mobile No. of Authorized officer
                                            (Chief Executive/ Director/ Company Secretary/Chief Financial Officer) </div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '65%', padding: ' 5px 10px',fontFamily: `${fontfamilyforDynimicData}` }}>{compnaygovernance?.length ? compnaygovernance?.length == 4 ? compnaygovernance[0] + ',' + compnaygovernance[1] + ',' + compnaygovernance[2] + ',' + compnaygovernance[3] : compnaygovernance?.length == 3 ? compnaygovernance[0] + ',' + compnaygovernance[1] + ',' + compnaygovernance[2] : compnaygovernance?.length == 2 ? compnaygovernance[0] + ',' + compnaygovernance[1] : compnaygovernance[0] : ''} </div>
                                    </div>


                                    <div className='mt-5'>
                                        <div className="table-responsive " >
                                            <table
                                                className="table "
                                                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                                            >

                                                <tbody>

                                                    <tr >
                                                        <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}>2.7</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }} colSpan={4} >Authorized Share Capital</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Classes and kinds of Shares</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}> No. of Shares</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Amount</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Face Value</td>

                                                    </tr>
                                                    <tr >
                                                        <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Ordinary Shares</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' ,fontFamily: `${fontfamilyforDynimicData}`}}>{CompanyData?.ordinary_shares} </td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{Number(CompanyData?.ordinary_shares) * Number(CompanyData?.face_value)}</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}`}}>{CompanyData?.face_value}</td>

                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="table-responsive mt-3 " >
                                            <table
                                                className="table "
                                                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                                            >

                                                <tbody>

                                                    <tr >
                                                        <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}>2.8</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }} colSpan={4} >Paid up Share Capital</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Classes and kinds of Shares</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}> No. of Shares</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Amount</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Face Value</td>

                                                    </tr>
                                                    <tr >
                                                        <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}> </td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Ordinary Shares</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{CompanyData?.ordinary_shares} </td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{Number(CompanyData?.ordinary_shares) * Number(CompanyData?.face_value)}</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{CompanyData?.face_value}</td>

                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="table-responsive  mt-3" >
                                            <table
                                                className="table "
                                                style={{ fontSize: "12px", fontFamily: "Montserrat rev=1" }}
                                            >

                                                <tbody>

                                                    <tr >
                                                        <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', maxWidth: '20px', width: '7%' }}>2.9</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold' }} colSpan={3} >Particulars of the holding /subsidiary company, if any</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Name of company</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>Holding/Subsidiary</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>% of shares held</td>

                                                    </tr>
                                                    <tr >
                                                        <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{CompanyData?.company_name || ''}</td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}> </td>
                                                        <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}></td>

                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>


                                    </div>
                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.10</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>Chief Executive Officer  </div>
                                    </div>

                                    <div className="table-responsive  mt-3" >
                                        <table
                                            className="table "
                                            style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                        >

                                            <tbody>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}>2.10</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%' }}>Name</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold', fontFamily: `${fontfamilyforDynimicData}`  }} colSpan={13} >{companyCeo?.name || ''} </td>
                                                </tr>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%' }}>Address</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold', fontFamily: `${fontfamilyforDynimicData}`  }} colSpan={13} >{companyCeo?.address || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%' }}>CNIC</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(0, 1) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(1, 2) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(2, 3) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(3, 4) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(4, 5) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(5, 6) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(6, 7) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(7, 8) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(8, 9) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(9, 10) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(10, 11) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(11, 12) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}` }}>{ceoCnic?.slice(12, 13) || ''}</td>

                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.11</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>Chief Financial Officer  </div>
                                    </div>

                                    <div className="table-responsive  mt-3" >
                                        <table
                                            className="table "
                                            style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                        >

                                            <tbody>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%' }}>Name</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold', fontFamily: `${fontfamilyforDynimicData}` }} colSpan={13} >{companyCfo?.name || ''}</td>
                                                </tr>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%' }}>Address</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold', fontFamily: `${fontfamilyforDynimicData}`}} colSpan={13} >{companyCfo?.address || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%' }}>CNIC</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(0, 1) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(1, 2) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(2, 3) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(3, 4) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(4, 5) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(5, 6) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(6, 7) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(7, 8) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(8, 9) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(9, 10) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(10, 11) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(11, 12) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontFamily: `${fontfamilyforDynimicData}`  }}>{cfoCnic?.slice(12, 13) || ''}</td>


                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='d-flex mt-2'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.12</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>Secretary  </div>
                                    </div>

                                    <div className="table-responsive  mt-3" >
                                        <table
                                            className="table "
                                            style={{ fontSize: "10px", fontFamily: "Montserrat rev=1"}}
                                        >

                                            <tbody>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%' }}>Name</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold',fontFamily: `${fontfamilyforDynimicData}` }} colSpan={13} >{companySectory?.name || ''}</td>
                                                </tr>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', maxWidth: '1px', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%' }}>Address</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold',fontFamily: `${fontfamilyforDynimicData}` }} colSpan={13} >{companySectory?.address || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%'}}>CNIC</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(0, 1) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(1, 2) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(2, 3) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(3, 4) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(4, 5) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(5, 6) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(6, 7) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(7, 8) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(8, 9) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(9, 10) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(10, 11) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(11, 12) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{sectoryCnic?.slice(12, 13) || ''}</td>


                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='d-flex mt-4'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.13</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>Legal Advisor  </div>
                                    </div>

                                    <div className="table-responsive  mt-5" >
                                        <table
                                            className="table "
                                            style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                        >

                                            <tbody>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%' }}>Name</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold',fontFamily: `${fontfamilyforDynimicData}`  }} colSpan={13} >{legalAdvisor?.auditor || ''}</td>
                                                </tr>

                                                <tr >
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%' }}>Address</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', fontWeight: 'bold',fontFamily: `${fontfamilyforDynimicData}`  }} colSpan={13} >{legalAdvisor?.address || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ verticalAlign: 'sub', border: '1px dashed #dddcdc', width: '7%' }}></td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212', width:'12%'}}>CNIC</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(0, 1) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(1, 2) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(2, 3) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(3, 4) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(4, 5) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(5, 6) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(6, 7) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(7, 8) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(8, 9) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(9, 10) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(10, 11) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(11, 12) || ''}</td>
                                                    <td style={{ verticalAlign: 'sub', border: '1px solid #121212',fontFamily: `${fontfamilyforDynimicData}` }}>{legalAdvisorCnic?.slice(12, 13) || ''}</td>


                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>



                                    <div className='d-flex mt-4'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.14</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212', fontWeight: 'bold' }}>Particulars of Auditor(s)  </div>
                                    </div>

                                    <div className='d-flex mt-4'>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderLeft: '1px solid #121212', paddingLeft: '2px', width: '20%' }}>Name</div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '80%', padding: ' 5px 10px', color: '#121212' }}>Address </div>
                                    </div>
                                    <div className='d-flex'>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', paddingLeft: '2px', width: '20%', minHeight: '34px', fontFamily: `${fontfamilyforDynimicData}` }}></div>
                                        <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '80%', padding: ' 5px 10px', color: '#121212', minHeight: '34px',fontFamily: `${fontfamilyforDynimicData}` }}> </div>
                                    </div>
                                    <div className='d-flex mt-4'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.15</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212', fontWeight: 'bold' }}>Particulars of Share Registrar (if applicable)  </div>
                                    </div>

                                    <div className='d-flex mt-4'>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderLeft: '1px solid #121212', paddingLeft: '2px', width: '20%' }}>Name</div>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', width: '80%', padding: ' 5px 10px', color: '#121212' }}>Address </div>
                                    </div>
                                    <div className='d-flex'>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', paddingLeft: '2px', width: '20%', minHeight: '34px',fontFamily: `${fontfamilyforDynimicData}` }}></div>
                                        <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '80%', padding: ' 5px 10px', color: '#121212', minHeight: '34px' ,fontFamily: `${fontfamilyforDynimicData}`}}> </div>
                                    </div>
                                    <div className='d-flex'>
                                        <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', paddingLeft: '2px', width: '20%', minHeight: '34px' }}>Email</div>
                                        <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', minHeight: '34px', width: '80%', padding: ' 5px 10px', color: '#121212' }}> </div>
                                    </div>



                                    <PartsWrapper style={{ justifyContent: 'start' }} className='mt-5 mb-3'>
                                        Section-B
                                    </PartsWrapper>

                                    <div className='d-flex mt-5'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.16</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>List of Directors as on the date annual return is made  </div>
                                    </div>
                                    <Wrapper className="table-responsive mt-4" >
                                        <table
                                            className="table table-bordered"
                                            style={{ fontSize: "10px", fontFamily: "Montserrat rev=1"  }}
                                        >
                                            <thead

                                            >
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                    S#
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Name
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Address
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                    Nationality
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    NIC No. (Passport No. if foreigner)
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Date of appointment or election                                            </th>

                                            </thead>
                                            <tbody>
                                                {allDirectors?.length ? allDirectors?.map((item, idx) => {
                                                    return <tr key={idx}>
                                                        <td style={{ verticalAlign: 'sub', minHeight: '34px',fontFamily: `${fontfamilyforDynimicData}` }}>{idx + 1}</td>
                                                        <td style={{ verticalAlign: 'sub', minHeight: '34px',fontFamily: `${fontfamilyforDynimicData}`  }}>{item?.name}</td>
                                                        <td style={{ verticalAlign: 'sub', minHeight: '34px',fontFamily: `${fontfamilyforDynimicData}`  }}>{item?.address} </td>
                                                        <td style={{ verticalAlign: 'sub', minHeight: '34px',fontFamily: `${fontfamilyforDynimicData}`  }}>{item?.nationality}</td>
                                                        <td style={{ verticalAlign: 'sub', minHeight: '34px',fontFamily: `${fontfamilyforDynimicData}`  }}>{item?.cnic_passport}</td>
                                                        <td style={{ verticalAlign: 'sub', minHeight: '34px',fontFamily: `${fontfamilyforDynimicData}`  }}>{item?.date}</td>

                                                    </tr>
                                                }) :
                                                    [1, 2, 3, 4, 5, 6, 7]?.map((item, idx) => {
                                                        return <tr key={idx}>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}> </td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>

                                                        </tr>
                                                    })



                                                }


                                            </tbody>

                                        </table>

                                    </Wrapper>

                                    <div className='d-flex mt-4'>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', paddingLeft: '2px', width: '7%' }}>2.17</div>
                                        <div className='align-items-center' style={{ border: '1px dashed #dddcdc', width: '93%', padding: ' 5px 10px', color: '#121212' }}>List of members & debenture holders on the date upto which this Form is made  </div>
                                    </div>

                                    <Wrapper className="table-responsive mt-5" >
                                        <table
                                            className="table table-bordered"
                                            style={{ fontSize: "10px", fontFamily: "Montserrat rev=1" }}
                                        >
                                            <thead

                                            >
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                    S#
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Folio #
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Name
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                    Address
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Nationality
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >CNIC No. (Passport No. if foreigner)
                                                    No. of  shares held/Debenture                                            </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    CNIC No. (Passport No. if foreigner)
                                                </th>

                                            </thead>
                                            <tbody>
                                                {[1, 2, 3, 4]?.map((item, idx) => {
                                                    if (idx < 2) {
                                                        return <>
                                                            {idx == 0 && <tr>
                                                                <td colSpan={7}>Members</td>
                                                            </tr>}

                                                            <tr key={idx}>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}> </td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            </tr>
                                                        </>
                                                    }
                                                    else {
                                                        return <>
                                                            {idx == 2 ? <tr>
                                                                <td colSpan={7}>Debenture holders</td>
                                                            </tr> : ''}

                                                            <tr key={idx}>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}> </td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                                <td style={{ verticalAlign: 'sub', minHeight: '34px' }}></td>
                                                            </tr>
                                                        </>
                                                    }

                                                })



                                                }


                                            </tbody>

                                        </table>

                                    </Wrapper>










                                    <div className='d-flex mt-5'>
                                        <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderRight: '1px solid #121212', borderTop: '1px solid #121212', paddingLeft: '2px', width: '100%' }}>2.18       Transfer of shares (debentures) since last Form A was made</div>
                                    </div>
                                    <Wrapper className="table-responsive" >
                                        <table
                                            className="table table-bordered"
                                            style={{ fontSize: "10px",  fontFamily: "Montserrat rev=1"  }}
                                        >
                                            <thead

                                            >
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                    S#
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Name of Transferor
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Name of Transferee
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }}>
                                                    Number of shares transferred
                                                </th>
                                                <th style={{ verticalAlign: 'sub', border: '1px solid #121212' }} >
                                                    Date of registration of transfer
                                                </th>

                                            </thead>
                                            <tbody>
                                                {[1, 2, 3, 4, 5, 6, 7]?.map((item, idx) => {
                                                    if (idx >= 3) {
                                                        return <tr key={idx}>
                                                            <td style={{ verticalAlign: 'sub' }}></td>
                                                            <td style={{ verticalAlign: 'sub', fontWeight: 'bold', textDecoration: 'underline' }}>{idx == 3 ? 'Debenture holders' : ''}</td>
                                                            <td style={{ verticalAlign: 'sub' }}> </td>
                                                            <td style={{ verticalAlign: 'sub' }}></td>
                                                            <td style={{ verticalAlign: 'sub' }}></td>

                                                        </tr>
                                                    } else {
                                                        return <tr key={idx}>
                                                            <td style={{ verticalAlign: 'sub' }}></td>
                                                            <td style={{ verticalAlign: 'sub', fontWeight: 'bold', textDecoration: 'underline' }}>{idx == 0 ? 'Members' : ''}</td>
                                                            <td style={{ verticalAlign: 'sub' }}> </td>
                                                            <td style={{ verticalAlign: 'sub' }}></td>
                                                            <td style={{ verticalAlign: 'sub' }}></td>

                                                        </tr>
                                                    }

                                                })



                                                }


                                            </tbody>

                                        </table>

                                    </Wrapper>
                                    <PartsWrapper className='mt-5 mb-3'>
                                        Part III
                                    </PartsWrapper>
                                    <div className='d-flex  mt-5' >
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
                                    <div className='d-flex mt-3'>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', paddingLeft: '2px', width: '7%' }}>3.2</div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '48%', padding: ' 5px 10px' }}>Name of Authorized Officer with designation/ Authorized Intermediary </div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '26.5%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '26.5%', padding: ' 5px 10px' }}> </div>
                                    </div>
                                    <div className='d-flex mt-3'>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', paddingLeft: '2px', width: '7%' }}>3.3</div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '39%', padding: ' 5px 10px' }}>Signatures  </div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '55%', padding: ' 5px 10px' }}> </div>
                                    </div>
                                    <div className='d-flex mt-3'>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', paddingLeft: '2px', width: '7%' }}>3.4</div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '46%', padding: ' 5px 10px' }}>Registration No of Authorized Intermediary, if applicable </div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '47%', padding: ' 5px 10px' }}> </div>
                                    </div>


                                    <div className='d-flex mt-4'>
                                        <div className='align-items-center' style={{ border: '1px solid #121212', paddingLeft: '2px', width: '7%' }}></div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '55%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '8%', padding: ' 5px 10px' }}> Day</div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '8%', padding: ' 5px 10px' }}> Month</div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ borderTop: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '16%', padding: ' 5px 10px' }}>Year </div>
                                        <div></div>
                                    </div>
                                    <div className='d-flex '>
                                        <div className='align-items-center' style={{ borderLeft: '1px solid #121212', borderBottom: '1px solid #121212', borderRight: '1px solid #121212', paddingLeft: '2px', width: '7%' }}>3.5</div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '55%', padding: ' 5px 10px' }}>Day</div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', paddingLeft: '2px', width: '3%' }}></div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                        <div className='align-items-center' style={{ borderBottom: '1px solid #121212', borderRight: '1px solid #121212', width: '4%', padding: ' 5px 10px' }}> </div>
                                    </div>
                                    <PartsWrapper className='mt-5 mb-3'>
                                        INSTRUCTIONS FOR FILLING FORM-A
                                    </PartsWrapper>
                                    <div>
                                        1.&nbsp;&nbsp;The Form shall be made upto the date of last AGM of the Company or the last date of the calendar year where no AGM is held during the year.
                                    </div>
                                    <div>
                                        2.&nbsp;&nbsp;Under S. No.2.17 above, the aggregate number of shares held by each member should be stated.
                                    </div>
                                    <div>3.&nbsp;&nbsp;When the shares are of different classes the columns should be subdivided so that the number of each class held, is shown separately against S. Nos. 2.7, 2.8 and 2.17</div>
                                    <div>4.&nbsp;&nbsp;If the space provided in the Form is insufficient, the required information should be listed in a separate statement attached to this return which should be similarly signed. </div>
                                    <div>5.&nbsp;&nbsp;In case a body corporate is a member, registration number may be mentioned instead of NIC number. </div>
                                    <div>6.&nbsp;&nbsp;In case of foreign nationals, indicate “passport number” in the space provided for “NIC No.” Pakistani nationals will only indicate “NIC No.”</div>
                                    <div>7.&nbsp;&nbsp;This form is to be filed within 30 days of the date indicated in S.No.1.4</div>








                                </div>
                            </div>
                            </div>
                        </PDFExport>
            }
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
const FormName = styled.div`
color: #121212;
text-decoration: underline;
justify-content: end;
display: flex;
margin-right: 15px;
font-size: 17px;
font-weight: bold;
`;
const HeadingWrapper = styled.div`
font-size: 17px;
font-weight: bold;
`;
const PartsWrapper = styled.div`
color: #121212;
text-decoration: underline;
justify-content: center;
display: flex;
margin-right: 15px;
font-size: 17px;
font-weight: bold;
`;
const CompanyNameWrapper = styled.div`
border: 1px solid rgb(18, 18, 18);
// margin-left: 65px;
width: 79%;
padding-left: 10px;
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
const div = styled.div`
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
const TdWrapper = styled.td`
max-width: 80px;
min-width: 80px;
// max-height: 150px;
// min-height: 150px;
// overflow: hidden;
// text-overflow: ellipsis;
word-wrap: break-word;
border: 1px solid #121212;
 padding: 4px 8px;
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