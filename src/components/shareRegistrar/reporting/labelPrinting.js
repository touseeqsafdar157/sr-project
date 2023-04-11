// import React, {Fragment, useEffect, useState }from "react";
// import Breadcrumb from "../../common/breadcrumb";
// import Select from "react-select";
// import Spinner from "components/common/spinner";
// import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
// import {
//   darkStyle,
//   disabledStyles,
// } from "components/defaultStyles";
// import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { errorStyles } from "components/defaultStyles";
// import { intimationLetterSchema } from "store/validations/intimationLetterValidation";
// import { getCompanies } from "store/services/company.service"
// import { getShareholders } from "store/services/shareholder.service"
// import { indexOf } from "lodash";
// import ConsolidateShares from "../share/consolidateShares/consolidateShares";
// import { toast } from "react-toastify";
// import { Col, Row } from "reactstrap";
// import ReportHeader from "./report-header";

// export default function LabelPrinting () {
//   const baseEmail = sessionStorage.getItem("email") || "";
//   const [companies_dropdown, setCompanies_dropdown] = useState([])
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [companies_data_loading, setCompanies_data_loading] = useState(false);
//   const [shareholders, setShareholders] = useState([]);
//   const [shareholder_data_loading, setShareholder_data_loading] = useState(false);
//   const [selectedShareholder, setSelectedShareholder] = useState("");
//   const [serachedShareholders, setSearchedShareholders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompanyDetail, setSelectedCompanDetail] = useState({});
//   const pdfExportComponent = React.useRef(null);
//     // Form Validation
//     const {
//       register,
//       formState: { errors },
//       handleSubmit,
//       watch,
//       control,
//       setValue,
//     } = useForm({ resolver: yupResolver(intimationLetterSchema) });
//     useEffect(() => {
//       const getAllCompanies = async () => {
//         setCompanies_data_loading(true);
//         try{
//         const response = await getCompanies(baseEmail)
//         if (response.status===200) {
//               const companies_dropdowns = response.data.data.map((item) => {
//                 let label = `${item.code} - ${item.company_name}`;
//                 return { label: label, value: item.code };
//               });
//               setCompanies(response.data.data);
//             setCompanies_dropdown(companies_dropdowns)
//               setCompanies_data_loading(false)
//               setLoading(false);
//         } }catch(error) {
//           setCompanies_data_loading(false);
//           setLoading(false);
//         }
//         };
//         const getAllShareHolders = async () => {
//           setShareholder_data_loading(true);
//           setLoading(true);
//           try{
//           const response = await getShareholders(baseEmail)
//           if (response.status===200) {
//                 const parents = response.data.data
//                 setShareholders(parents)
//                 setShareholder_data_loading(false)
//           } }catch(error) {
//             setShareholder_data_loading(false);
//           }
//           };
//         getAllCompanies();
//         getAllShareHolders();
//     }, [])
//     const handleLabelPrinting = () => { 
//           const mappedvalue = selectedOptions.map((ma) => {
//           const filtervalue = shareholders.filter((fi) => 
//             fi.company_code==selectedCompany && fi.folio_number === ma.value
//           )
//           return filtervalue;
//           }) 
//         setSearchedShareholders(mappedvalue.flat());
//     };
//     function shareholderCheckbox(value, event) {
//       !!event?.value &&
//       setSelectedShareholder(event.value);
//     !event && setSelectedShareholder("");
//       if (event.action === "select-option" && event.option.value ===
//       "*") {
//         setSelectedOptions(this.options);
//       } 
//       else if (event.action === "deselect-option" &&
//       event.option.value === "*") {
//         setSelectedOptions([]);
//       } else if (event.action === "deselect-option") {
//         setSelectedOptions(value.filter(o => o.value !== "*"));
//       } else if (value.length === this.options.length - 1) {
//         setSelectedOptions(this.options);
//       } else {
//         setSelectedOptions(value);
//       }
//     }
  
//     return (
//         <Fragment>
//           <div className="d-flex justify-content-between">
//             <h6 className="text-nowrap mt-3 ml-3">Label Printing</h6>
//               <Breadcrumb title="Label Printing" parent="Reporting" />
//               </div>

//               <div className="container-fluid">
//         <div className="row">
//           <div className="col-sm-12">
//             <div className="card">
//               <div className="card-header ">
//                 <div className="d-flex justify-content-between">
//                   <h5></h5>
//                   <button
//                     className="btn btn-danger"
//                     disabled={selectedOptions.length==0 ? true : false}
//                     onClick={(e) => { 
//                       if (pdfExportComponent.current) {
//                       pdfExportComponent.current.save();
//                     }
//                     }}
//                   >
//                     <i className="fa fa-file-pdf-o mr-1"></i>Generate Report Label Printing
//                   </button>
//                   </div>
//               <div className="row mt-2">
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <label htmlFor="searchTransaction">Select Company</label>
//                       <Select
//                         options={companies_dropdown}
//                         isLoading={companies_data_loading === true}
//                         onChange={(selected) => {
//                           const filter = companies.filter((item)=>{
//                             return item.code === selected.value
//                           });
//                           setSelectedCompanDetail(filter[0]);
//                           !!selected?.value &&
//                             setSelectedCompany(selected.value);
//                           !selected && setSelectedCompany("");
//                           selectedOptions.length=0;
//                           setSelectedOptions(selectedOptions);
//                         }}
//                         isClearable={true}
//                         styles={darkStyle}
//                       />
//                       {!selectedCompany && (
//                         <small className="text-dark">
//                           Select Company to check shareholder
//                         </small>
//                       )}
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <label htmlFor="searchTransaction">Select Shareholder</label>
//                       <ReactMultiSelectCheckboxes
//                         options={[{label: "All Shareholder", value: "*"}, ...shareholders
//                           .filter(
//                             (sharehold) =>
//                               sharehold?.company_code === selectedCompany 
//                           )
//                           .map((item) => {
//                               let label = `${item.folio_number} (${item.shareholder_name})`;
//                               return { label: label, value: item.folio_number };
//                           })]}
//                         value={selectedOptions}
//                         isDisabled={selectedCompany=='' ? true : false}
//                         isLoading={shareholder_data_loading}
//                         // styles={!!selectedCompany ? darkStyle : disabledStyles}
//                         onChange={shareholderCheckbox}
//                         setState={setSelectedOptions}
//                         isClearable={true}
//                         width='1000px'
//                       />
//                       {!selectedCompany && (
//                         <small className="text-dark">
//                           Select Shareholder to check the label
//                         </small>
//                       )}
//                     </div>
//                   </div>
//                   <div className="row mt-2">
//                   <button
//                     className="btn btn-success ml-3"
//                     onClick={(e) => handleLabelPrinting()}
//                     disabled={selectedOptions.length==0 ? true : false}
//                   >
//                     Generate
//                   </button>
//                 </div>
//                   </div>
//                   </div>
//                   {loading === true && <Spinner />}
//                   {loading === false && !!serachedShareholders.length && (
//                   <PDFExport paperSize="A4" margin="1.5cm" scale={0.6} repeatHeaders={true} fileName={"Label Printing"} ref={pdfExportComponent}>
                
//                 <ReportHeader title="Shareholder Details" logo={selectedCompanyDetail.logo}/>
//                     <h5 className="text-center">Shareholder Details</h5>
//                {serachedShareholders.length>0 && (
//                 <>
//                 <div className="table-responsive">
//                  <table className="table">
//                   <thead style={{
//                     backgroundColor:"#2E75B5",
//                   }}>
//                     <th style={{color:"white"}}>Shareholder Id</th>
//                     <th style={{color:"white"}}>Shareholder Name</th>
//                     <th style={{color:"white"}}>Shareholder Address</th>
//                   </thead>
//                   <tbody>
//                     {serachedShareholders.map((item)=>{
//                       return(
//                       <tr>
//                         <td>{item.shareholder_id.split('-')[1]}</td>
//                         <td>{item.shareholder_name}</td>
//                         <td>{item.street_address}, {item.city}, {item.country}</td>
//                       </tr>
//                       )
//                     })}
//                   </tbody>
//                  </table>
//                  </div>
//                 </>
//                )}

//                       <br/>
//                          <div>
//                           <span className="ml-2">This document is computer generated and does not require the Registrar's signature or the Company's stamp in order to be considered valid</span>
//                           <hr/>
//                          </div>
//                     </PDFExport>
//                 )}
//                    {serachedShareholders.length === 0 &&
//                 loading === false && (
//                   <p className="text-center">
//                     <b>Shareholder Data not available</b>
//                   </p>
//                 )}
//                   </div>
//                   </div>
//                   </div>
//                   </div>
//         </Fragment>
//     )

// }

import React, {Fragment, useEffect, useState }from "react";
import Breadcrumb from "../../common/breadcrumb";
import Select from "react-select";
import Spinner from "components/common/spinner";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import {
  darkStyle,
  disabledStyles,
} from "components/defaultStyles";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorStyles } from "components/defaultStyles";
import { intimationLetterSchema } from "store/validations/intimationLetterValidation";
import { getCompanies } from "store/services/company.service"
import { getShareholders } from "store/services/shareholder.service"
import { indexOf } from "lodash";
import ConsolidateShares from "../share/consolidateShares/consolidateShares";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
export default function LabelPrinting () {
  const baseEmail = sessionStorage.getItem("email") || "";
  const [companies_dropdown, setCompanies_dropdown] = useState([])
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [shareholders, setShareholders] = useState([]);
  const [shareholder_data_loading, setShareholder_data_loading] = useState(false);
  const [selectedShareholder, setSelectedShareholder] = useState("");
  const [serachedShareholders, setSearchedShareholders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const pdfExportComponent = React.useRef(null);
    // Form Validation
    const {
      register,
      formState: { errors },
      handleSubmit,
      watch,
      control,
      setValue,
    } = useForm({ resolver: yupResolver(intimationLetterSchema) });
    useEffect(() => {
      const getAllCompanies = async () => {
        setCompanies_data_loading(true);
        try{
        const response = await getCompanies(baseEmail)
        if (response.status===200) {
              const companies_dropdowns = response.data.data.map((item) => {
                let label = `${item.code} - ${item.company_name}`;
                return { label: label, value: item.code };
              });
            setCompanies_dropdown(companies_dropdowns)
              setCompanies_data_loading(false)
              setLoading(false);
        } }catch(error) {
          setCompanies_data_loading(false);
          setLoading(false);
        }
        };
        const getAllShareHolders = async () => {
          setShareholder_data_loading(true);
          setLoading(true);
          try{
          const response = await getShareholders(baseEmail)
          if (response.status===200) {
                const parents = response.data.data
                setShareholders(parents)
                setShareholder_data_loading(false)
          } }catch(error) {
            setShareholder_data_loading(false);
          }
          };
        getAllCompanies();
        getAllShareHolders();
    }, [])
    const handleLabelPrinting = () => { 
          const mappedvalue = selectedOptions.map((ma) => {
          const filtervalue = shareholders.filter((fi) => 
            fi.company_code==selectedCompany && fi.folio_number === ma.value
          )
          return filtervalue;
          }) 
        setSearchedShareholders(mappedvalue.flat());
    };
    function shareholderCheckbox(value, event) {
      !!event?.value &&
      setSelectedShareholder(event.value);
    !event && setSelectedShareholder("");
      if (event.action === "select-option" && event.option.value ===
      "*") {
        setSelectedOptions(this.options);
      } 
      else if (event.action === "deselect-option" &&
      event.option.value === "*") {
        setSelectedOptions([]);
      } else if (event.action === "deselect-option") {
        setSelectedOptions(value.filter(o => o.value !== "*"));
      } else if (value.length === this.options.length - 1) {
        setSelectedOptions(this.options);
      } else {
        setSelectedOptions(value);
      }
    }
  
    return (
        <Fragment>
          <div className="d-flex justify-content-between">
            <h6 className="text-nowrap mt-3 ml-3">Label Printing</h6>
              <Breadcrumb title="Label Printing" parent="Reporting" />
              </div>

              <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header ">
                <div className="d-flex justify-content-between">
                  <h5></h5>
                  <button
                    className="btn btn-danger"
                    disabled={selectedOptions.length==0 ? true : false}
                    onClick={(e) => { 
                      if (pdfExportComponent.current) {
                      pdfExportComponent.current.save();
                    }
                    }}
                  >
                    <i className="fa fa-file-pdf-o mr-1"></i>Generate Report Label Printing
                  </button>
                  </div>
              <div className="row mt-2">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Company</label>
                      <Select
                        options={companies_dropdown}
                        isLoading={companies_data_loading === true}
                        onChange={(selected) => {
                          !!selected?.value &&
                            setSelectedCompany(selected.value);
                          !selected && setSelectedCompany("");
                          selectedOptions.length=0;
                          setSelectedOptions(selectedOptions);
                        }}
                        isClearable={true}
                        styles={darkStyle}
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Company to check shareholder
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="searchTransaction">Select Shareholder</label>
                      <ReactMultiSelectCheckboxes
                        options={[{label: "All Shareholder", value: "*"}, ...shareholders
                          .filter(
                            (sharehold) =>
                              sharehold?.company_code === selectedCompany 
                          )
                          .map((item) => {
                              let label = `${item.folio_number} (${item.shareholder_name})`;
                              return { label: label, value: item.folio_number };
                          })]}
                        value={selectedOptions}
                        isDisabled={selectedCompany=='' ? true : false}
                        isLoading={shareholder_data_loading}
                        // styles={!!selectedCompany ? darkStyle : disabledStyles}
                        onChange={shareholderCheckbox}
                        setState={setSelectedOptions}
                        isClearable={true}
                        width='1000px'
                      />
                      {!selectedCompany && (
                        <small className="text-dark">
                          Select Shareholder to check the label
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="row mt-2">
                  <button
                    className="btn btn-success ml-3"
                    onClick={(e) => handleLabelPrinting()}
                    disabled={selectedOptions.length==0 ? true : false}
                  >
                    Generate
                  </button>
                </div>
                  </div>
                  </div>
                  {loading === true && <Spinner />}
                  {loading === false && !!serachedShareholders.length && (
                  <div className="row">
                  <div className="w-100 mx-auto">
                  <PDFExport paperSize="A4" margin="1.5cm" scale={0.6} repeatHeaders={true} fileName={"Label Printing"} ref={pdfExportComponent}>
                <div className="card-header b-t-primary">
                  <h5 className="text-center">Shareholder Details</h5>
                </div>
                <Row>
                {serachedShareholders.map((shareholder) => (
                  <Col md="6">
                <div className="card-body">
                  <div className="">
                      <>
                           <div className="mt-3 font-weight-bold">Shareholder Id: <span className="mt-3 font-weight-light">{shareholder.shareholder_id}</span></div>
                           <div className="mt-3 font-weight-bold">Shareholder Name: <span className="mt-3 font-weight-light">{shareholder.shareholder_name}</span></div>
                           <div className="mt-3 font-weight-bold">Shareholder Address: <span className="mt-3 font-weight-light">{shareholder.street_address}, {shareholder.city}, {shareholder.country}</span></div>
                           </>
                    </div>
                    </div>
                    </Col>
                         ))}
                         </Row>
                    </PDFExport>
                </div>
                </div>
                )}
                   {serachedShareholders.length === 0 &&
                loading === false && (
                  <p className="text-center">
                    <b>Shareholder Data not available</b>
                  </p>
                )}
                  </div>
                  </div>
                  </div>
                  </div>
        </Fragment>
    )

}
