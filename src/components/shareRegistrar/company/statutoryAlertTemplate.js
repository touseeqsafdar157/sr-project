import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState  } from 'draft-js';
import { PDFExport } from "@progress/kendo-react-pdf";
import PageTemplate from "../reporting/page-template";
import dcclogo from "../../../assets/DCC-Logo.svg";
import { sendEmail } from 'store/services/company.service';
import { AiFillFileText } from "react-icons/ai";
import { FaPlus, FaEnvelopeOpenText } from "react-icons/fa";
import { toast } from "react-toastify";
export const StatutoryAlertTemplate = ({toomailData, data, evetRequirment, setSendTemplate, authorizationData}) => {
    console.log('evetRequirment,', evetRequirment)
    console.log('data', data)
    const [preview, setPreView] = useState(true);
    // const [sendTemplate, setSendTemplate] = useState(false)
    const [toMail, setToMail] = useState(toomailData || '')
    const [ccMail, setCCMail] = useState('')
    const baseEmail = sessionStorage.getItem("email") || "";
    const [subject, setSubject] = useState('Statutory Alert')
    const [textForTemplates, setTextForTemplates] = useState(authorizationData? [] :[{
       text: `Event:${evetRequirment[0]}`
    },
    {
        text: `Requirment: ${evetRequirment[1]}`
    }
])
    const [textForTemplate, setTextForTemplate] = useState('')
    const pdfExportComponent = React.useRef(null);
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    const [viewPdf, SetViewPDf] = useState(false)
    const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      ContentState.createFromText(authorizationData ? '':`Event:${evetRequirment[0]}
Requirment: ${evetRequirment[1]}
       `)
    ));
    useEffect(()=>{
        setPreView(true)

        // setTextForTemplates(...[textForTemplates, {key: '1',}])
    },[])
    const sendInvoicetemplate = async () => {
        const toomail = toMail?.split(',')
        const cc = ccMail?.split(',');
        try {
          setLoadingInvoice(true);
    
          const response = await sendEmail(
            baseEmail,
            data?.company_code,
            toomail,
            cc,
            subject,
            JSON.stringify(textForTemplates)
    
          );
    
          if (response.data.status === 200) {
            setTimeout(() => {
              setLoadingInvoice(false);
              // window.location.reload();
              // getAllCompanies();
              toast.success(`${response.data.message}`);
              setSendTemplate(false);
              setToMail('');
              setCCMail('');
            //   setWriteText('');
              setTextForTemplate('')
            }, 2000);
          } else {
            setLoadingInvoice(false);
            toast.error(`${response.data.message}`);
          }
        } catch (error) {
          setLoadingInvoice(false);
          !!error?.response?.data?.message
            ? toast.error(error?.response?.data?.message)
            : toast.error("Event Not Added");
        }
      }
    const handleEditorChange = (newEditorState) => {
        setEditorState(newEditorState);
        // Perform other actions based on the new editor state
      };
  return (

    <div>
       {preview ? <div className="row card b-t-primary">
            <div className="col-md-12 mt-2"  >
              <form style={{ width: '100%' }}>


                <div className="form-group">
                  <label className="col-form-label">TO</label>
                  <div class="input-group mb-3">
                    <InputWrapper
                      className="form-control"
                      type="email"
                      name="toemail"
                      placeholder="Loaded Emails"
                      value={toMail}
                      onChange={(e) => {
                        setToMail(e.target?.value)
                      }}
                    />

                  </div>

                </div>
                <div className="form-group">
                  <label className="col-form-label">CC</label>
                  <div class="input-group mb-3">
                    <InputWrapper
                      className="form-control"
                      type="email"
                      name="ccemail"
                      placeholder="Emails"
                      value={ccMail}
                      onChange={(e) => {
                        setCCMail(e.target?.value)
                      }}
                    />

                  </div>

                </div>
                <div className="form-group">
                  <label className="col-form-label">Subject</label>
                  <div class="input-group mb-3">
                    <InputWrapper
                      className="form-control"
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={subject}
                      onChange={(e) => {

                        setSubject(e.target?.value)
                      }}
                    />
                  </div>

                </div>

                <div className="form-group">
                  <label className="col-form-label">Content</label>
                  <div class="input-group mb-3">
                  <Editor
   editorState={editorState}
   onEditorStateChange={handleEditorChange}
   onChange={(e)=>{
    setTextForTemplates(e?.blocks)
   }}
/>;
                    {/* <textarea class="form-control" type="text"
                      name="subject"
                      id="subject"
                      value={textForTemplate}
                      placeholder="Enter Content "

                      onChange={(e) => {
                        setTextForTemplate(e.target.value)
                      }} rows="3"></textarea> */}
                  </div>

                </div>

              </form>
              <button className="btn mt-5" style={{ background: 'rgb(47, 60, 78)', color: '#fff', boxShadow: "rgb(90 90 90 / 84%) 0px 8px 16px 0px, rgb(0 0 0 / 19%) 0px 6px 20px 0px" }} onClick={() => {
                setPreView(false)
              }}>
                Preview
              </button>
            </div>
          </div> :
            <div className="row card b-t-primary">
              <div className="col-md-12 mt-2"  >
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Statutory Event</div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px', gap: '13px' }}>
                    {/* <div >
                      <AiTwotonePrinter />
                      <span style={{ paddingLeft: ' 7px' }}>Print</span>
                    </div> */}
                    <div onClick={(e) => {
                      // if(viewPdf)
                      SetViewPDf(true)
                      if (pdfExportComponent.current) {
                        pdfExportComponent.current.save();
                      }
                    }} style={{ cursor: 'pointer' }}>
                      <AiFillFileText />
                      <span style={{ paddingLeft: ' 7px' }}>PDF</span>
                    </div>
                  </div>
                </div>
                {/* {viewPdf? */}
                <PDFExport
                  paperSize="A4"
                  margin="1.5cm"
                  scale={0.6}
                  fileName={`Statutory Alert`}
                  pageTemplate={PageTemplate}
                  ref={pdfExportComponent}
                >

                  <div className="card mt-2" style={{ width: '100%', border: '2px solid #4466f2 ', padding: '15px 10px 32px 10px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: ' center' }}>
                        <img style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#67bbe3', padding: '5px' }}
                          src={dcclogo} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', fontSize: '22px' }}>
                        Statutory Alert
                      </div>
                      {/* <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <FaEnvelopeOpenText size={40} style={{ color: '#16151569', display: 'flex', justifyContent: 'center' }} />
                      </div> */}
                      <div className="row">
                        <div className="col-md-1 " />
                        <div className="col-md-10 " style={{ color: "gray", padding: '10px 20px 0px 50px' }}>Based on data updated
                          following statutory requirement may be considered.</div>
                      </div>
                      <div className="row">
                        <div className="col-md-3 " />
                        <div className="col-md-6 " style={{ color: "gray", padding: '0px 50px' }}> <hr style={{ width: '100%', border: '1px solid  #cdcdcd' }} /></div>
                        <div className="col-md-3 " />
                      </div>
                     
{textForTemplates.map(item=>{
  return <div className="row">
  <div className="col-md-1 " />

  <div className="col-md-10 " style={{ padding: '0px 20px 0px 50px' }}>
 
    <div style={{ marginTop: '10px', fontSize: '14px', whiteSpace: 'pre-wrap' }}><b> {item?.text}
    </b>
    </div>
  </div>
</div>
})}
                   
                      <div className="row mt-2">
                        <div className="col-md-1 " />
                        <div className="col-md-10 " style={{ color: "gray", padding: '0px 20px' }}>
                          <p style={{ justifyContent: 'center', display: 'flex', color: 'gray' }}>This is a system
                            generated alert. For information purpose only. In case of any discrepancy contact share registrar
                            officer.
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-1 " />
                        <div className="col-md-10 " style={{ color: "gray", padding: '0px 8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', fontSize: '12px', color: '#545454', padding: '0px 8px' }} >
                            <div> copyright © 2023 Copyright Digital Custodian Company Limited All Rights Reserved</div>

                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </PDFExport>


              </div>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
                <button onClick={() => {
                  setPreView(true)
                }} className="btn btn-primary" style={{ boxShadow: "rgb(66 82 114 / 84%) 0px 8px 16px 0px, rgb(0 0 0 / 19%) 0px 6px 20px 0px" }}>
                  Edit Template
                </button>
                <button onClick={() => {
                  sendInvoicetemplate()
                }} className="btn btn-success" disabled={loadingInvoice} style={{ boxShadow: "rgb(66 114 67 / 84%) 0px 8px 16px 0px, rgb(0 0 0 / 19%) 0px 6px 20px 0px", }}>
                  {loadingInvoice ? <>
                    <span className="fa fa-spinner fa-spin"></span>
                    <span>{"Loading..."}</span>
                  </> : 'Send Email'}
                </button>

              </div>
            </div>

          }  




    </div>
  )
}
const InputWrapper = styled.input`
border-top: none;
border-left: none;
border-right: none;
&:active{
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;  
}
&:focus{
  border-top: none !important;
  border-left: none !important;
  border-right: none !important; }
`;
