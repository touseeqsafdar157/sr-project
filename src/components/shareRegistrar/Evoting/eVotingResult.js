import React, { useState, useEffect } from 'react'
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "../reporting/page-template";
import ReportHeader from '../reporting/report-header';
import styled from 'styled-components';
// import logo from "../../../assets"
import logo from "../../../assets/images/share-registrar.svg";
import moment from 'moment';
import Spinner from "components/common/spinner";

import { getAllAgendaData } from 'store/services/evoting.service';
import { getAllSpecialResolutionData } from 'store/services/evoting.service';
import { keys } from 'lodash';
export const EvotingResult = ({ allCompanies, data, showData }) => {
    const [allResolutionData, setAllResolutionData] = useState([])
    // const [filterResolution, setFilterResolution]= useState([])
    const pdfExportComponent = React.useRef(null);
    const baseEmail = sessionStorage.getItem("email") || "";
    const [allAganda, setAllAganda] = useState([])
    const [filterResolution, setFilterResolution] = useState([])
    const [filteDataforProxy, setFilterDataForProxy] = useState([])
    const [filterThorughVotingData, setFilterThroughVotingData]=useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [filterResolutionData, setFilterResolutionData] = useState([])
    const [filterThroughtPost, setFilterThroughPost] =  useState([])
    const dummyArray = [
        {
            against: '3',
            favor: '2'
        },
        {
            against: '3',
            favor: '2'
        }
    ]
    console.log('data', data)

    const getAllResolutionData = async () => {
        setLoadingData(true)
        try {
            const response = await getAllSpecialResolutionData(baseEmail);
            if (response.status === 200) {
                const parents = response.data.data;
                // const companiesDatas = response.data.data.map((item) => {
                //   let label = `${item.code} - ${item.company_name}`;
                //   return { label: label, value: item.code };
                // });
                const filterdData = parents?.filter((item) => item?.agenda_id == data?.item_id)
                setAllResolutionData(parents);
                setFilterDataForProxy(filterdData?.filter((item)=>item?.cast_type?.toLowerCase()?.includes('physical')      ))
                setFilterThroughVotingData(filterdData?.filter((item)=>(item?.cast_type?.toLowerCase()?.includes('electronic') && (item?.cast_through?.toLowerCase()?.includes('mobile') || item?.cast_through?.toLowerCase()?.includes('web')))))
                setFilterThroughPost(filterdData?.filter((item)=>item?.cast_through?.toLowerCase()?.includes('post')));
                setLoadingData(false)
                setFilterResolutionData(filterdData)
            }
        } catch (error) {
            setLoadingData(false)
            // setCompanies_data_loading(false);
        }
    };
    console.log('setFilterDataForProxy, filterThorughVotingData', filterThorughVotingData)
    const getAgendaData = async () => {
        try {
            //   setLoadingListing(true);
            const response = await getAllAgendaData(
                baseEmail,
                // pagenum,
                // search
            );
            if (response.status === 200) {

                const date = new Date();
                const currentDate = moment(date)?.format("YYYY-MM-DD")
                const parents = response.data.data ? response.data.data : [];
                
                const filterData = parents?.filter((item) => item?.meeting_id == data?.meeting_id)
                setAllAganda(parents);
                setFilterResolution(filterData)
            }
        } catch (error) {
            //   setLoadingListing(false);
        }
    };
    useEffect(() => {
        getAgendaData();
        getAllResolutionData()
    }, [])

    return (
        <div>
       { loadingData ? 
        <Spinner /> :
        <div>
            {showData ? <PDFExport
                paperSize="A4"
                margin="1cm"
                scale={0.6}
                fileName={`Evoting Result`}
                pageTemplate={PageTemplate}
                ref={pdfExportComponent}
            >
                <ReportHeader
                    title="Shareholder Details"
                    logo={logo}
                    isEvotingResult={true}

                />



                <div className='row'>
                    <div className='col-md-12' style={{ padding: '25px 50px', wordWrap: 'break-word' }}>
                        <h6 style={{ display: 'flex', justifyContent: 'center' }}><b>Results of Voting on Resolutions/Execution Report</b></h6>

                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "11px", fontFamily: "Palatino" }}
                            >
                                <tbody>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}><b>Name of the Company</b></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>{allCompanies?.find((item) => item?.value == data?.company_code)?.label} </td>

                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Date of the general meeting</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>{moment(data?.agenda_from)?.format("YYYY-MM-DD")}</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Date of poll</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>{moment(data?.agenda_from)?.format("YYYY-MM-DD")}</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Dates for casting e-voting</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>{moment(data?.agenda_from)?.format("YYYY-MM-DD")}</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Last date of receiving postal ballot</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>{moment(data?.agenda_to)?.format("YYYY-MM-DD")}</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Any other related information</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}></td>
                                    </tr>
                                </tbody>

                            </table>

                        </Wrapper>

                        <h6 className='mt-5'><b>Resolutions</b></h6>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "11px", fontFamily: "Palatino" }}
                            >

                                <tbody>

                                    {filterResolution?.map((item, idx) => {
                                        return <tr key={idx}>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>{item?.agenda_title || ''}</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>{item?.agenda_item || ''}</td>

                                        </tr>
                                    })}

                                  







                                </tbody>

                            </table>

                        </Wrapper>
                        <PartsWrapper className='mt-4' style={{ justifyContent: 'start' }}>
                            Vote casted in person or through proxy:
                        </PartsWrapper>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "11px", fontFamily: "Palatino" }}
                            >

                                <tbody>
                                    <tr>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={3}>
                                            Particulars
                                        </td>

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={(2 + (filteDataforProxy?.length * 2))}> Result of resolutions (In case of election of directors amend accordingly)</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Name of member*/Folio No.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Present person or through proxy</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Shares held or no. of votes</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Votes Casted</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Invalid Votes</td>
                                        {filteDataforProxy?.map((item, idx) => {
                                            return <td colSpan={2}>Resolution {idx + 1}</td>
                                        })}

                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {filteDataforProxy?.map((item, idx) => {
                                            return <><td >Favor</td>
                                                <td >Against</td>
                                            </>
                                        })}

                                    </tr>

                                 {filteDataforProxy?.map((item, key)=>{
                                return <tr index={key}>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{item?.folio_number}</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{Number(item?.castable_votes) ||''}</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{Number(item?.castable_votes) ||''}</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {filteDataforProxy?.map((item, idx) => {
                                            return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{item?.votes_accepted}</td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }} >{item?.votes_rejected}</td>
                                            </>
                                        })}

                                    </tr>
                                      })} 
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Total</b></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {filteDataforProxy?.map((item, idx) => {
                                            return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{item?.votes_accepted}</td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }} >{item?.votes_rejected}</td>
                                            </>
                                        })}

                                    </tr>








                                </tbody>

                            </table>

                        </Wrapper>









                        <PartsWrapper className='mt-5' style={{ justifyContent: 'start' }}>
                            Vote casted through e-voting:
                        </PartsWrapper>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "11px", fontFamily: "Palatino" }}
                            >

                                <tbody>
                                    <tr>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={2}>
                                            Particulars
                                        </td>

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={(2 + (filterThorughVotingData?.length * 2))}> Result of resolutions (In case of election of directors amend accordingly)</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Name of member*/Folio No.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Shares held or no. of votes</td>
                                        {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Shares held or no. of votes</td> */}
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Votes Casted</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Invalid Votes</td>
                                        
                                        {filterThorughVotingData ?.map((item, idx) => {
                                            return <td colSpan={2}>Resolution {idx + 1}</td>
                                        })}

                                    </tr>




                                   <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {filterThorughVotingData ?.map((item, idx) => {
                                            return <><td >Favor</td>
                                                <td >Against</td>
                                            </>
                                        })}

                                    </tr>

                                    {filterThorughVotingData?.map((item=>{
                                    return <tr >
                                      <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{item?.folio_number}</td>
                                        {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{Number(item?.castable_votes) ||''}</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{Number(item?.castable_votes) ||''}</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {filterThorughVotingData ?.map((item, idx) => {
                                            return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{item?.votes_accepted}</td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }} >{item?.votes_rejected}</td>
                                            </>
                                        })}

                                    </tr>
 } ))}
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Total</b></td>
                                        {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {filterThorughVotingData ?.map((item, idx) => {
                                            return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{item?.votes_accepted}</td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }} >{item?.votes_rejected}</td>
                                            </>
                                        })}

                                    </tr>








                                </tbody>

                            </table>

                        </Wrapper>

                        <PartsWrapper className='mt-5' style={{ justifyContent: 'start' }}>
                            Vote casted through post:
                        </PartsWrapper>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "11px", fontFamily: "Palatino" }}
                            >

                                <tbody>
                                    <tr>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={2}>
                                            Particulars
                                        </td>

                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={(2 + (filterThroughtPost?.length * 2))}> Result of resolutions (In case of election of directors amend accordingly)</td>
                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Name of member*/Folio No.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Shares held or no. of votes</td>
                                        {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Shares held or no. of votes</td> */}
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Votes Casted</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Invalid Votes</td>
                                        {filterThroughtPost?.map((item, idx) => {
                                            return <td colSpan={2}>Resolution {idx + 1}</td>
                                        })}

                                    </tr>
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {filterThroughtPost?.map((item, idx) => {
                                            return <><td >Favor</td>
                                                <td >Against</td>
                                            </>
                                        })}

                                    </tr>

                                   {filterThroughtPost?.map((item, idx)=>{ 
                                   return <tr key = {idx} >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {filterThroughtPost?.map((item, idx) => {
                                            return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }} ></td>
                                            </>
                                        })}

                                    </tr>
 })}
                                    <tr >
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Total</b></td>
                                        {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                        {filterThroughtPost?.map((item, idx) => {
                                            return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }} ></td>
                                            </>
                                        })}

                                    </tr>








                                </tbody>

                            </table>

                        </Wrapper>


                        <PartsWrapper className='mt-5' style={{ justifyContent: 'start' }}>
                            Consolidated result of voting
                        </PartsWrapper>
                        <Wrapper className="table-responsive mt-2" >
                            <table
                                className="table table-bordered"
                                style={{ fontSize: "11px", fontFamily: "Palatino" }}
                            >

                                <tbody>
                                    <tr>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>S NO.</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Resolutions (In case of election of directors amend accordingly)</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Total No. of Shares/Votes held</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Total Number of votes Casted</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Total Number of Invalid Votes</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Number of Votes Casted in Favor</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Number of Votes Casted Against</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Percentage of Votes Castes in Favor</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Resolution Passed/Not Passed</td>
                                        <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Remarks</td>
                                    </tr>


                                    {filterResolutionData?.map((item, idx) => {
                                         const acceptedvote = Number(item?.votes_accepted) ? Number(item?.votes_accepted) : 0
                                         const RejectedVote = Number(item?.votes_rejected) ? Number(item?.votes_rejected) : 0
                                         let percentage=0
                                         let approved_unapprove = ''
                                         if(item?.vote?.toLowerCase() != 'rejected'){
                                         const Total = acceptedvote + RejectedVote;

                                            percentage = (acceptedvote/Total * 100)

                                            if(percentage>50) approved_unapprove = 'Yes'
                                            else approved_unapprove = 'No'
                                            
                                         }
                                        
                                        return <tr>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{idx + 1}</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> Resolution {idx + 1}</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{Number(item?.votes_casted)||''}</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{Number(item?.votes_casted)||''}</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{acceptedvote}</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{RejectedVote||''}</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{percentage ? percentage : 0 }</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{approved_unapprove ? approved_unapprove : item?.vote}</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{item?.remarks|| ''}</td>
                                        </tr>
                                    })}












                                </tbody>

                            </table>

                        </Wrapper>

                        <div style={{ marginTop: '20%' }}>
                            <hr style={{ width: '16%', margin: '0px', borderColor: '#121212' }} />
                            <div style={{ justifyContent: 'start', fontSize: '14px', fontWeight: 'bold' }}>
                                Signature of Chairman
                            </div>
                            <div style={{ justifyContent: 'start', fontSize: '14px', fontWeight: 'bold' }}>
                                Place:
                            </div>
                            <div style={{ justifyContent: 'start', fontSize: '14px', fontWeight: 'bold' }}>
                                Date:
                            </div>

                        </div>




















                    </div>
                </div>
            </PDFExport> :
                <PDFExport
                    paperSize="A4"
                    margin="1cm"
                    scale={0.6}
                    fileName={`Evoting Result`}
                    pageTemplate={PageTemplate}
                    ref={pdfExportComponent}
                >
                    <ReportHeader
                        title="Shareholder Details"
                        logo={logo}
                        isEvotingResult={true}

                    />



                    <div className='row'>
                        <div className='col-md-12' style={{ padding: '25px 50px', wordWrap: 'break-word' }}>
                            <h6 style={{ display: 'flex', justifyContent: 'center' }}><b>Results of Voting on Resolutions/Execution Report</b></h6>

                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "11px", fontFamily: "Palatino" }}
                                >
                                    <tbody>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}><b>Name of the Company</b></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}></td>

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Date of the general meeting</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}></td>
                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Date of poll</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}></td>
                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Dates for casting e-voting</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}></td>
                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Last date of receiving postal ballot</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}></td>
                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Any other related information</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}></td>
                                        </tr>
                                    </tbody>

                                </table>

                            </Wrapper>

                            <h6 className='mt-5'><b>Resolutions</b></h6>
                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "11px", fontFamily: "Palatino" }}
                                >

                                    <tbody>



                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Resolution 1</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Details</td>

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Resolution 2</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Details</td>

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Resolution n</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px', width: '50%' }}>Details</td>

                                        </tr>







                                    </tbody>

                                </table>

                            </Wrapper>
                            <PartsWrapper className='mt-4' style={{ justifyContent: 'start' }}>
                                Vote casted in person or through proxy:
                            </PartsWrapper>
                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "11px", fontFamily: "Palatino" }}
                                >

                                    <tbody>
                                        <tr>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={3}>
                                                Particulars
                                            </td>

                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={(2 + (dummyArray?.length + 2))}> Result of resolutions (In case of election of directors amend accordingly)</td>
                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Name of member*/Folio No.</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Present person or through proxy</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Shares held or no. of votes</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Votes Casted</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Invalid Votes</td>
                                            {dummyArray?.map((item, idx) => {
                                                return <td colSpan={2}>Resolution {idx + 1}</td>
                                            })}

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {dummyArray?.map((item, idx) => {
                                                return <><td >Favor</td>
                                                    <td >Against</td>
                                                </>
                                            })}

                                        </tr>

                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {dummyArray?.map((item, idx) => {
                                                return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }} ></td>
                                                </>
                                            })}

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Total</b></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {dummyArray?.map((item, idx) => {
                                                return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }} ></td>
                                                </>
                                            })}

                                        </tr>








                                    </tbody>

                                </table>

                            </Wrapper>









                            <PartsWrapper className='mt-5' style={{ justifyContent: 'start' }}>
                                Vote casted through e-voting:
                            </PartsWrapper>
                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "11px", fontFamily: "Palatino" }}
                                >

                                    <tbody>
                                        <tr>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={2}>
                                                Particulars
                                            </td>

                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={(2 + (dummyArray?.length + 2))}> Result of resolutions (In case of election of directors amend accordingly)</td>
                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Name of member*/Folio No.</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Shares held or no. of votes</td>
                                            {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Shares held or no. of votes</td> */}
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Votes Casted</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Invalid Votes</td>
                                            {dummyArray?.map((item, idx) => {
                                                return <td colSpan={2}>Resolution {idx + 1}</td>
                                            })}

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {dummyArray?.map((item, idx) => {
                                                return <><td >Favor</td>
                                                    <td >Against</td>
                                                </>
                                            })}

                                        </tr>

                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {dummyArray?.map((item, idx) => {
                                                return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }} ></td>
                                                </>
                                            })}

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Total</b></td>
                                            {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {dummyArray?.map((item, idx) => {
                                                return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }} ></td>
                                                </>
                                            })}

                                        </tr>








                                    </tbody>

                                </table>

                            </Wrapper>

                            <PartsWrapper className='mt-5' style={{ justifyContent: 'start' }}>
                                Vote casted through post:
                            </PartsWrapper>
                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "11px", fontFamily: "Palatino" }}
                                >

                                    <tbody>
                                        <tr>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={2}>
                                                Particulars
                                            </td>

                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }} colSpan={(2 + (dummyArray?.length + 2))}> Result of resolutions (In case of election of directors amend accordingly)</td>
                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Name of member*/Folio No.</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Shares held or no. of votes</td>
                                            {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Shares held or no. of votes</td> */}
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Votes Casted</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>No. of Invalid Votes</td>
                                            {dummyArray?.map((item, idx) => {
                                                return <td colSpan={2}>Resolution {idx + 1}</td>
                                            })}

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {dummyArray?.map((item, idx) => {
                                                return <><td >Favor</td>
                                                    <td >Against</td>
                                                </>
                                            })}

                                        </tr>

                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {dummyArray?.map((item, idx) => {
                                                return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }} ></td>
                                                </>
                                            })}

                                        </tr>
                                        <tr >
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}><b>Total</b></td>
                                            {/* <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td> */}
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            {dummyArray?.map((item, idx) => {
                                                return <><td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                    <td style={{ verticalAlign: 'sub', minHeight: '24px' }} ></td>
                                                </>
                                            })}

                                        </tr>








                                    </tbody>

                                </table>

                            </Wrapper>


                            <PartsWrapper className='mt-5' style={{ justifyContent: 'start' }}>
                                Consolidated result of voting
                            </PartsWrapper>
                            <Wrapper className="table-responsive mt-2" >
                                <table
                                    className="table table-bordered"
                                    style={{ fontSize: "11px", fontFamily: "Palatino" }}
                                >

                                    <tbody>
                                        <tr>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>S NO.</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Resolutions (In case of election of directors amend accordingly)</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Total No. of Shares/Votes held</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Total Number of votes Casted</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Total Number of Invalid Votes</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Number of Votes Casted in Favor</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Number of Votes Casted Against</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Percentage of Votes Castes in Favor</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Resolution Passed/Not Passed</td>
                                            <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>Remarks</td>
                                        </tr>


                                        {dummyArray?.map((item, idx) => {
                                            return <tr>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }}>{idx + 1}</td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }}> Resolution {idx + 1}</td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                                <td style={{ verticalAlign: 'sub', minHeight: '24px' }}></td>
                                            </tr>
                                        })}












                                    </tbody>

                                </table>

                            </Wrapper>

                            <div style={{ marginTop: '20%' }}>
                                <hr style={{ width: '16%', margin: '0px', borderColor: '#121212' }} />
                                <div style={{ justifyContent: 'start', fontSize: '14px', fontWeight: 'bold' }}>
                                    Signature of Chairman
                                </div>
                                <div style={{ justifyContent: 'start', fontSize: '14px', fontWeight: 'bold' }}>
                                    Place:
                                </div>
                                <div style={{ justifyContent: 'start', fontSize: '14px', fontWeight: 'bold' }}>
                                    Date:
                                </div>

                            </div>




















                        </div>
                    </div>
                </PDFExport>}

            <button className='btn btn-danger' onClick={(e) => {
                // if(viewPdf)
                //   SetViewPDf(true)
                if (pdfExportComponent.current) {
                    pdfExportComponent.current.save();
                }
            }}>Download PDF</button>
        </div>}
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
