import React, { useState, useEffect } from "react";
import Select from "react-select";
import NumberFormat from "react-number-format";
import InputMask from "react-input-mask";
import { darkStyle, disabledStyles } from "../../defaultStyles";
import styled from "styled-components";
const ServiceProvider = ({
  num,
  startCalculation,
  calculated,
  ser_auditor,
  ser_email,
  ser_type,
  ser_address,
  ser_contact,
  ser_phone,
  viewCompany,
  editService,
  ser_cnic,
}) => {
  // const [name, setName] = useState(gov_name || "");
  const [auditor, setAuditor] = useState(ser_auditor|| '')
  const [email, setEmail] = useState(ser_email || "");
  const [contact, setContact] = useState(ser_contact || "");
  const [advisor, setAdvisor] = useState("");
  const [phone, setPhone] = useState(ser_phone || '')
  const [cnic, setCnic] = useState(ser_cnic || '')
  const [defaultvalue, setDefaultValue] =useState(ser_type)
const [address, setAddress] = useState(ser_address || '')
const [legalAdvisorOption] = useState([
    // {label: 'Name'},
    // {label: 'Type'},
    {label: 'Auditor'},
    {label: 'Internal Auditor'},
    {label: 'Legal Advisor'},
    {label: 'Shariah Advisor'},
    // {label: 'Chairman/Independent-Director'},
    // {label: 'Shareholder/Non-Ex-Director'},
    // {label: 'Shareholder/Independent-Director'},
    
])
  useEffect(() => {
    if (calculated === true) {
      startCalculation({
        auditor,
        email,
        contact,
        phone,
        type: advisor || defaultvalue || '',
        address,
        cnic,
      });
    }
  }, [calculated]);
  return (
    <>
      <tr>
        <td scope="col">
          <b>{num}</b>
        </td>
        <td>
          <input
            type="text"
            name="auditor"
            id="auditor"
            style={{maxWidth: '140px', minWidth: "140px"}}
            placeholder="Enter Name"
            className="form-control"
            value={auditor}
            onChange={(e) => setAuditor(e.target.value)}
            readOnly={calculated && !editService }
          />
        </td>
        <td>
          {/* <select
          styles={ calculated ? disabledStyles : darkStyle }
          onChange={(selected) =>{
            if(selected) setRole(selected)
            else setRole('');
          }}
          >
            <option value={'CEO'}>
            CEO
            </option>
            <option value={'CEO'}>
            chairman/Non-Ex-director
            </option>
          </select> */}
          {viewCompany ?
          <input
          type="text"
          name="parent"
          id="parent"
          style={{maxWidth: '140px', minWidth: "140px"}}
          placeholder="Select Type"
          className="form-control"
          value={defaultvalue}
          // maxLength={16}
          // onChange={(e) =>{ 
          //   setCnic_passport(e.target.value)
          //   }}
          readOnly={calculated && !editService }
        />
          :
          <SelectWrapper
        //    isLoading={roles?.length === 0}
           options={legalAdvisorOption}
          //  defaultValue={ {label:'test'}}
          //  defaultInputValue={{label:'test'}}
          
           styles={ calculated && !editService ? disabledStyles : darkStyle }
           placeholder={defaultvalue || "Enter Type"}
           isClearable
           isSearchable
           onChange={(selected) =>{
            if(selected?.label) setAdvisor(selected?.label)
            else setAdvisor('');
          }}
           id="parent"
           readOnly={calculated && !editService}
          />
        }
        </td>
        <td>
          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="Enter Phone"
            className="form-control"
            value={phone}
            style={{maxWidth: '140px', minWidth: "140px"}}
            maxLength={16}
            onChange={(e) =>{ 
              if(!e.target.value.length)setPhone('')
              if(e.target.value.match(/^\d+$/)) setPhone(e.target.value)
              }}
            readOnly={calculated && !editService }
          />
        </td>
        <td>
          <input
            type="text"
            name="cnic"
            id="cnic"
            style={{maxWidth: '140px', minWidth: "140px"}}
            placeholder="Enter CNIC"
            className="form-control"
            value={cnic}
            maxLength={16}
            onChange={(e) =>{ 
             
              setCnic(e.target.value)
              }}
            readOnly={calculated && !editService }
          />
        </td>

        <td>
          <input
            type="text"
            name="contact"
            id="contact"
            placeholder="Enter Contact"
            className="form-control"
            value={contact}
            maxLength={16}
            style={{maxWidth: '140px', minWidth: "140px"}}
            onChange={(e) =>{ 
              if(!e.target.value.length)setContact('')
              if(e.target.value.match(/^\d+$/)) setContact(e.target.value)
              }}
            readOnly={calculated && !editService }
          />
        </td>
        <td>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            className="form-control"
            value={email}
            style={{maxWidth: '140px', minWidth: "140px"}}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={calculated && !editService }
          />
        </td>
      
        <td>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Enter Address"
            className="form-control"
            style={{maxWidth: '140px', minWidth: "140px"}}
            value={address}
            // maxLength={16}
            onChange={(e) =>{ 
                setAddress(e.target.value)
              }}
            readOnly={calculated && !editService }
          />
        </td>
       
        {/* <td>
        //this code is commented when the company role us uncommented upper select should be comment

          <Select
            isLoading={roles.length === 0}
            options={roles}
            defaultValue={roles.find((role) => role.value === gov_role)}
            onChange={(selected) => setRole(selected.value)}
            id="parent"
            placeholder="Select Role"
            styles={calculated ? disabledStyles : darkStyle}
            isDisabled={calculated}
          />



           <input
           type="text"
            defaultValue="COMPANY_ROLE"
            onChange={(selected) => setRole(selected.value)}
            id="parent"
            placeholder="Select Role"
            className="form-control"
            styles={calculated ? disabledStyles : darkStyle}
            // isDisabled={calculated}
            readOnly={true}
          />
        </td> */}
      </tr>
    </>
  );
};

export default ServiceProvider;

const SelectWrapper = styled(Select)`

max-width: 250px !important;
min-width: 230px !important;
`;