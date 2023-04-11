import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { useSelector } from "react-redux";
import { listCrud } from "../../../../src/utilities/utilityFunctions";
import {
  getCompanies,
} from "../../../store/services/company.service";
import { Modal, ModalHeader, ModalBody, UncontrolledTooltip } from "reactstrap";
import Spinner from "components/common/spinner";
import { AddStatuaryEvent } from "./addStatuaryEvent";
import { EditStatuaryEvent } from "./editStatuaryEvent";
import { ViewEvent } from "./viewEvent";
import { AiOutlineSend} from "react-icons/ai";
import styled from "styled-components";
import { getPaginatedEventData } from "../../../store/services/company.service";
import { BsEnvelope } from "react-icons/bs";
import { DisplayFormsData } from "./displayFormsData";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { StatutoryAlertTemplate } from "./statutoryAlertTemplate";
import { StatutoryForm28 } from "./StatutoryForm28";
import { StatutoryForm3 } from "./StatutoryForm3";
import { StatutoryForm3A } from "./StatutoryForm3A";
import { StatutoryForm45 } from "./statutoryForm45";
import { StatutoryForm26 } from "./StatutoryForm26";
import { StatutoryForm4 } from "./StatutoryForm4";
import { StatutoryForm5 } from "./StatutoryForm5";
import { StatutoryForm8 } from "./StatutoryForm8";
import { StatutoryForm7 } from "./StatutoryForm7";
export default function StatuaryEvents() {
  const baseEmail = sessionStorage.getItem("email") || "";
  const features = useSelector((data) => data.Features).features;
  const [crudFeatures, setCrudFeatures] = useState([true, true, true, true]);
  const [addEvent, setAddEvent] = useState(false);
  const [editEvent, setEditEvent] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [currentPage, setCurrentPage] = useState();
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState();
  const [hasNextPage, setHasNextPage] = useState();
  const [hasPrevPage, setHasPrevPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [preview, setPreView] = useState(true);
  const [companiesData, setAllCompanies] = useState([]);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [statuaryEvent, setStatuaryEvents] = useState([])
  const [isLoading, setIsLoading] = useState('');
  const [sendTemplate, setSendTemplate] = useState(false)
  const [toMail, setToMail] = useState('')
  const [textwrite, setWriteText] = useState('')
  const [textForTemplate, setTextForTemplate] = useState('')
  const [allCompanyData, setAllCompanyData] = useState([])
  const [showFormDesign, setShowFormDesign] = useState(false)
  const [formData, setFormData] = useState(null)
  const [code, setCode] = useState(null);
  const [emaildata, setEmailData]= useState(null)
  const [forms, setForms] = useState('')
 
  useEffect(() => {
    if (features.length !== 0) setCrudFeatures(listCrud(features));
  }, [features]);
  const getPaginatedEvent = async (pagenum) => {
    setIsLoadingCompany(true);
    try {
      const response = await getPaginatedEventData(
        baseEmail,
        pagenum,
        "10",
        // search
      );
      if (response.status === 200) {
        setHasNextPage(response.data.data.hasNextPage);
        setHasPrevPage(response.data.data.hasPrevPage);
        setNextPage(response.data.data.nextPage);
        setPrevPage(response.data.data.prevPage);
        setCurrentPage(response.data.data.page);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalDocs);
        const parents = response.data.data.docs ? response.data.data.docs : [];

        setStatuaryEvents(parents);
        setIsLoadingCompany(false);
      }
    } catch (error) {
      setIsLoadingCompany(false);
    }
  };
  const getAllCompanies = async () => {
    try {
      const response = await getCompanies(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;
        setAllCompanyData(parents)
        const companiesDatas = response.data.data.map((item) => {
          let label = `${item.code} - ${item.company_name}`;
          return { label: label, value: item.code };
        });
        setAllCompanies(companiesDatas);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getAllCompanies()
    getPaginatedEvent(nextPage);
   
   
  }, []);

 
 
  const displayStatuaryEventPerPage = statuaryEvent.map((item, i) => (
    <tr key={i}>
      <td>{
        companiesData?.find(ite => ite?.value == item?.company_code)?.label || ''}</td>
      <td>{item?.req_code || ''}</td>
      <td>{item.title || ''}</td>
      <td>{item.start_date || ''}</td>
      <td>{item.deadline_date || ''}</td>
      <td>{item.reminder_days || ''}</td>
      <td key={i}>
        {crudFeatures[1] && (
          <>
            <i
              className="fa fa-eye"
              style={{
                // width: 25,
                fontSize: 16,
                padding: 11,
                color: "#4466F2",
                cursor: "pointer",
              }}
              id="Eventview"
              data-placement="top"
              onClick={() => {
                const obj = JSON.parse(JSON.stringify(item));
                setViewFlag(true);
                sessionStorage.setItem(
                  "selectedEvent",
                  JSON.stringify(obj)
                );
              }}
            ></i>
            <UncontrolledTooltip placement="top" target="Eventview">
              {"View Event's Detail"}
            </UncontrolledTooltip>
          </>

        )}
        {crudFeatures[2] && (
          <>
            <i
              className="fa fa-pencil"
              style={{
                // width: 25,
                fontSize: 16,
                padding: 11,
                color: "#FF9F40",
                cursor: "pointer",
              }}
              id="statutoryEventEdit"
              data-placement="top"
              onClick={() => {
                const obj = JSON.parse(JSON.stringify(item));
                setEditEvent(true);
                sessionStorage.setItem(
                  "selectedEvent",
                  JSON.stringify(obj)
                );
              }}

            ></i>
            <UncontrolledTooltip placement="top" target="statutoryEventEdit">
              {"Edit Event's Detail"}
            </UncontrolledTooltip>
          </>)}
        <>

          <span style={{ maxWidth: '20px', minWidth: '20px' }}> {item?._id == isLoading ? <>
            <span className="fa fa-spinner fa-spin"></span>
            <span>{"Loading..."}</span>
          </> : <>
            <AiOutlineSendWraper id="forwardAlert" style={{ color: '#1ea6ec', cursor: 'pointer' }} size={15}
              onClick={() => {
                setEmailData(item)
                setCode(item?.company_code)
                const data = allCompanyData?.find(ite => ite?.code == item?.company_code)
                const CEOEmail = data?.ceo_email;
                const parseGovernance = JSON.parse(data?.governance)
                const ceoEmail = parseGovernance?.find(item => item?.role == 'CEO')?.email || CEOEmail || '';
                const sectoryEmail = parseGovernance?.find(item => item?.role == 'Company Secretary')?.email;
                const concateEmail = `${ceoEmail && sectoryEmail ? ceoEmail + ' , ' + sectoryEmail : ceoEmail ? ceoEmail : sectoryEmail}`
                setToMail(concateEmail)
                if (item?.req_code) {
                  let str = 'Event: ' + item?.req_code;
                  setWriteText(str?.replace(' - ', '\nRequirement: '))
                  setTextForTemplate(str?.replace(' - ', 'Requirement: ')?.split('Requirement:'))
                }
                setSendTemplate(true)
                

              }}
            />
            <UncontrolledTooltip placement="top" target="forwardAlert">
              {"Sent Alert"}
            </UncontrolledTooltip>
          </>
          }</span>
        </>
        {item?.req_code?.toLowerCase()?.includes('form 29') || item?.req_code?.toLowerCase()?.includes('form29')?
          <>
            <i
              className="fa fa-paperclip"
              id={`viewform`}
              style={{
                // width: 25,
                fontSize: 16,
                padding: 8,
                color: "rgb(68, 102, 12)",
                cursor: "pointer",
              }}
              onClick={() => {
                setFormData(item)
                setShowFormDesign(true)
              }}
            ></i>
            <UncontrolledTooltip
              placement="top"
              target={`viewform`}
            >
              {"View Form 29"}
            </UncontrolledTooltip>
          </> : item?.req_code?.split("- ")[1]?.toLowerCase()?.includes('form a') || item?.req_code?.split(" -")[0]?.toLowerCase()?.includes('form a')?
            <>
              <i
                className="fa fa-paperclip"
                id={`viewformA`}
                style={{
                  //  width: 25,
                  fontSize: 16,
                  padding: 11,
                  color: "rgb(68, 102, 12)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setFormData(item)
                  setShowFormDesign(true)
                }}
              ></i>
              <UncontrolledTooltip
                placement="top"
                target={`viewformA`}
              >
                {"View Form A"}
              </UncontrolledTooltip>
            </> :item?.req_code?.split("- ")[1]?.toLowerCase()?.includes('form 28') || item?.req_code?.split(" -")[0]?.toLowerCase()?.includes('form 28')?
            <>
              <i
                className="fa fa-paperclip"
                id={`viewform28`}
                style={{
                  //  width: 25,
                  fontSize: 16,
                  padding: 11,
                  color: "rgb(68, 102, 12)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  let formName =  item?.req_code?.split("- ")[1]?.toLowerCase()?.trim();
                  if(formName=='form 28'){}
                  else formName=  item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()
                  setForms(formName)
                  setFormData(item)
                  setShowFormDesign(true)
                }}
              ></i>
              <UncontrolledTooltip
                placement="top"
                target={`viewform28`}
              >
                {"View Form 28"}
              </UncontrolledTooltip>
            </> : item?.req_code?.split("- ")[1]?.toLowerCase()?.trim()=='form 3' || item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()=='form 3' ?
            <>
              <i
                className="fa fa-paperclip"
                id={`viewform3`}
                style={{
                  //  width: 25,
                  fontSize: 16,
                  padding: 11,
                  color: "rgb(68, 102, 12)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  let formName =  item?.req_code?.split("- ")[1]?.toLowerCase()?.trim();
                  if(formName=='form 3'){}
                  else formName=  item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()
                  setForms(formName)
                  setFormData(item)
                  setShowFormDesign(true)
                }}
              ></i>
              <UncontrolledTooltip
                placement="top"
                target={`viewform3`}
              >
                {"View Form 3"}
              </UncontrolledTooltip>
            </>  : item?.req_code?.split("- ")[1]?.toLowerCase()?.trim()=='form 3a' ||  item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()=='form 3a' ?
            
            <>
              <i
                className="fa fa-paperclip"
                id={`viewformaa`}
                style={{
                  //  width: 25,
                  fontSize: 16,
                  padding: 11,
                  color: "rgb(68, 102, 12)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  let formName =  item?.req_code?.split("- ")[1]?.toLowerCase()?.trim();
                  if(formName=='form 3a'){}
                  else formName=  item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()
                  setForms(formName)
                  setFormData(item)
                  setShowFormDesign(true)
                }}
              ></i>
              <UncontrolledTooltip
                placement="top"
                target={`viewformaa`}
              >
                {"View Form3A"}
              </UncontrolledTooltip>
            </>:item?.req_code?.split("- ")[1]?.toLowerCase()?.trim()=='form 45' || item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()=='form 45' ?<>
              <i
                className="fa fa-paperclip"
                id={`viewForm45`}
                style={{
                  //  width: 25,
                  fontSize: 16,
                  padding: 11,
                  color: "rgb(68, 102, 12)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  let formName =  item?.req_code?.split("- ")[1]?.toLowerCase()?.trim();
                  if(formName=='form 45'){}
                  else formName=  item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()
                  setForms(formName)
                  setFormData(item)
                  setShowFormDesign(true)
                }}
              ></i>
              <UncontrolledTooltip
                placement="top"
                target={`viewForm45`}
              >
                {"View Form 45"}
              </UncontrolledTooltip>
            </>:item?.req_code?.split("- ")[1]?.toLowerCase()?.trim()=='form 26' || item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()=='form 26' ?<>
              <i
                className="fa fa-paperclip"
                id={`viewForm26`}
                style={{
                  //  width: 25,
                  fontSize: 16,
                  padding: 11,
                  color: "rgb(68, 102, 12)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  let formName =  item?.req_code?.split("- ")[1]?.toLowerCase()?.trim();
                  if(formName=='form 26'){}
                  else formName=  item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()
                  setForms(formName)
                  setFormData(item)
                  setShowFormDesign(true)
                }}
              ></i>
              <UncontrolledTooltip
                placement="top"
                target={`viewForm26`}
              >
                {"View Form 26"}
              </UncontrolledTooltip>
            </>:
            item?.req_code?.split("- ")[1]?.toLowerCase()?.trim()=='form 4' || item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()=='form 4' ?<>
            <i
              className="fa fa-paperclip"
              id={`viewForm4`}
              style={{
                //  width: 25,
                fontSize: 16,
                padding: 11,
                color: "rgb(68, 102, 12)",
                cursor: "pointer",
              }}
              onClick={() => {
                let formName =  item?.req_code?.split("- ")[1]?.toLowerCase()?.trim();
                if(formName=='form 4'){}
                else formName=  item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()
                setForms(formName)
                setFormData(item)
                setShowFormDesign(true)
              }}
            ></i>
            <UncontrolledTooltip
              placement="top"
              target={`viewForm4`}
            >
              {"View Form 4"}
            </UncontrolledTooltip>
          </>:
           item?.req_code?.split("- ")[1]?.toLowerCase()?.trim()=='form 5' || item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()=='form 5' ?<>
           <i
             className="fa fa-paperclip"
             id={`viewForm5`}
             style={{
               //  width: 25,
               fontSize: 16,
               padding: 11,
               color: "rgb(68, 102, 12)",
               cursor: "pointer",
             }}
             onClick={() => {
               let formName =  item?.req_code?.split("- ")[1]?.toLowerCase()?.trim();
               if(formName=='form 5'){}
               else formName=  item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()
               setForms(formName)
               setFormData(item)
               setShowFormDesign(true)
             }}
           ></i>
           <UncontrolledTooltip
             placement="top"
             target={`viewForm5`}
           >
             {"View Form 5"}
           </UncontrolledTooltip>
         </>:item?.req_code?.split("- ")[1]?.toLowerCase()?.trim()=='form 8' || item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()=='form 8' ?<>
           <i
             className="fa fa-paperclip"
             id={`viewForm8`}
             style={{
               //  width: 25,
               fontSize: 16,
               padding: 11,
               color: "rgb(68, 102, 12)",
               cursor: "pointer",
             }}
             onClick={() => {
               let formName =  item?.req_code?.split("- ")[1]?.toLowerCase()?.trim();
               if(formName=='form 8'){}
               else formName=  item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()
               setForms(formName)
               setFormData(item)
               setShowFormDesign(true)
             }}
           ></i>
           <UncontrolledTooltip
             placement="top"
             target={`viewForm8`}
           >
             {"View Form 8"}
           </UncontrolledTooltip>
         </>:item?.req_code?.split("- ")[1]?.toLowerCase()?.trim()=='form 7' || item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()=='form 7' ?<>
           <i
             className="fa fa-paperclip"
             id={`viewForm7`}
             style={{
               //  width: 25,
               fontSize: 16,
               padding: 11,
               color: "rgb(68, 102, 12)",
               cursor: "pointer",
             }}
             onClick={() => {
               let formName =  item?.req_code?.split("- ")[1]?.toLowerCase()?.trim();
               if(formName=='form 7'){}
               else formName=  item?.req_code?.split(" -")[0]?.toLowerCase()?.trim()
               setForms(formName)
               setFormData(item)
               setShowFormDesign(true)
             }}
           ></i>
           <UncontrolledTooltip
             placement="top"
             target={`viewForm7`}
           >
             {"View Form 7"}
           </UncontrolledTooltip>
         </>:
            ''
        }

      </td>

    </tr>
  ));

 
  return (
    <Fragment>
      <div className="d-flex justify-content-between">
        <h6 className="text-nowrap mt-3 ml-3"> Manual Statutory Event Listing</h6>
        <Breadcrumb title="Manual Statutory Event Listing" parent="Statutory" />
      </div>


      <Modal isOpen={addEvent} show={addEvent.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setAddEvent(false);
          }}
        >
          Add Event
        </ModalHeader>
        <ModalBody>
          <AddStatuaryEvent setAddEvent={setAddEvent} />

        </ModalBody>
      </Modal>
      <Modal isOpen={showFormDesign} show={showFormDesign.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setShowFormDesign(false);
            setForms('')
          }}
        >

        </ModalHeader>
        <ModalBody>
        {forms=='form 28'? 
        <StatutoryForm28  data={formData}/>
        
        :forms=='form 3' ? 
        <StatutoryForm3 data={formData}/>
        : forms=='form 3a' ? <StatutoryForm3A data={formData}/>:
      forms==  'form 45'?<StatutoryForm45 data={formData}/>:
      forms==  'form 26'?<StatutoryForm26 data={formData}/>:
      forms==  'form 4'?<StatutoryForm4 data={formData}/>:
      forms==  'form 5'?<StatutoryForm5 data={formData}/>:
      forms==  'form 8'?<StatutoryForm8 data={formData}/>:
      forms==  'form 7'?<StatutoryForm7 data={formData}/>:
          <DisplayFormsData data={formData} setShowFormDesign={setShowFormDesign} />
}
      
        </ModalBody>
      </Modal>
      <Modal isOpen={sendTemplate} show={sendTemplate.toString()} size="lg">
        <ModalHeader
          toggle={() => {
            setSendTemplate(false);
            setPreView(true)
          }}
        // style={{borderBottom: 'red', color }}
        >

          <div className="d-flex" style={{ alignItems: 'center', gap: '15px' }}>

            <BsEnvelope size={20} />
            <div>Send Invoice</div>
          </div>
        </ModalHeader>
        <ModalBody style={{ margin: '-2px 8px 8px 8px' }}>
          {/* <AlertEmailModal/> */}
<StatutoryAlertTemplate setSendTemplate={setSendTemplate} toomailData = {toMail} data={emaildata} evetRequirment={textForTemplate}/>
        

        </ModalBody>
      </Modal>
      {/* alert code design */}
      {/* Edit Modal */}
      <Modal isOpen={editEvent} show={editEvent.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setEditEvent(false);
          }}
        >
          Event Edit
        </ModalHeader>
        <ModalBody>
          <EditStatuaryEvent setEditEvent={setEditEvent} getPaginatedEvent={getPaginatedEvent} showID={true} />
        </ModalBody>
      </Modal>
      {/* View Modal */}
      <Modal isOpen={viewFlag} show={viewFlag.toString()} size="xl">
        <ModalHeader
          toggle={() => {
            setViewFlag(false);
          }}
        >
          Event View
        </ModalHeader>
        <ModalBody>
          <ViewEvent showID={true} />
        </ModalBody>
      </Modal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
              
                  <div className="col-sm-8" />
                  <div>
                    {crudFeatures[0] && (
                      <button
                        className="btn btn-primary btn-sm ml-2"
                        onClick={() => {
                          setAddEvent(true);
                        }}
                      >
                        Add Event
                      </button>
                    )}
                  </div>
                </div>

              </div>
              {isLoadingCompany === true && <Spinner />}
              {isLoadingCompany === false && statuaryEvent.length !== 0 && (
                <div className="table-responsive">
                  <table className="table  ">
                    <thead>
                      <tr>
                        <th>Company Code</th>
                        <th>Request Code </th>
                        <th>Title </th>
                        <th>Start Date</th>
                        <th>Deadline Date </th>
                        <th>Reminder Days </th>
                        <th>Action</th>

                      </tr>
                    </thead>

                    <tbody>{displayStatuaryEventPerPage}</tbody>
                  </table>
                  <center className="d-flex justify-content-center py-3">
                    <nav className="pagination">
                      {hasPrevPage && (
                        <button
                          className="btn btn-primary btn-sm mx-1"
                          onClick={() => getPaginatedEvent(prevPage)}
                        >
                          <span>{"Prev"}</span>
                        </button>
                      )}
                      {hasNextPage && (
                        <button
                          className="btn btn-secondary btn-sm mx-1"
                          onClick={() => getPaginatedEvent(nextPage)}
                        >
                          <span>{"Next"}</span>
                        </button>
                      )}
                    </nav>
                  </center>
                  <p className="align-content-center text-center mx-2">
                    Page {currentPage} of {totalPages}
                  </p>
                  <p className="text-right mx-2">{totalRecords} Records</p>
                </div>
              )}
              {isLoadingCompany === false && statuaryEvent.length === 0 && (
                <p className="text-center">
                  <b>Statutory Event Data not available</b>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

const AiOutlineSendWraper = styled(AiOutlineSend)`
&:active{
  outline: none;
  
}
&:focus{
outline: none;
}
`;

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
