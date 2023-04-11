import React, { useState, useEffect } from "react";
import Select from "react-select";
import NumberFormat from "react-number-format";
import InputMask from "react-input-mask";
import { darkStyle, disabledStyles } from "../../defaultStyles";
import styled from "styled-components";
import ToggleButton from "react-toggle-button";

export const AuthorizedPersonItem = ({
  num,
  startCalculation,
  calculated,
  roles,
  ap_name,
  ap_email,
  ap_contact,
  ap_role,
  editPerson,
  activeuser,
  roless,
  dates,
  reasons
}) => {
  const [name, setName] = useState(ap_name || "");
  const [email, setEmail] = useState(ap_email || "");
  const [contact, setContact] = useState(ap_contact || "");
  const [rolessa, setRole] = useState(roless || "");
const [reason, setReason] = useState(reasons || '')
const[date, setDate] = useState(dates || null)
  const [active, setactive] = useState(activeuser=='Y' ? true :activeuser =='N' ?false : false ); //done

  const [governanceRole] = useState([
    {label: 'CEO'},
   {   label: 'chairman/Non-Ex-director'},
   {   label: 'chairman/independent-director'},
   {   label: 'Shareholder/Non-Ex-director'},
   {   label: 'shareholder/independent-director'},
 ])
  useEffect(() => {
    if (calculated === true) {
      startCalculation({
        name,
        email,
        contact,
        role: 'COMPANY_ROLE',
        active : active? 'Y' : 'N',
        reason,
        date
      });
    }
  }, [calculated]);
  const borderRadiusStyle = { borderRadius: 2 };
console.log('active', active)
  return (
    <>
      <tr>
        <td scope="col">
          <b>{num}</b>
        </td>
        <td>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter Name"
            className="form-control"
            style={{minWidth :'140px'}}
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={calculated && !editPerson}
          />
        </td>
        <td>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            className="form-control"
            style={{minWidth :'140px'}}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={calculated&& !editPerson}
          />
        </td>
        <td>
          <input
            type="text"
            name="contact"
            id="contact"
            placeholder="Enter Contact"
            className="form-control"
            style={{minWidth :'140px'}}
            maxLength={16}
            value={contact}
            onChange={(e) => { 
              if(e.target.value.match(/^\d+$/)) setContact(e.target.value)
            }}
            readOnly={calculated&& !editPerson}
          />
        </td>
     
        <td>
        <input
            type="text"
            name="reason"
            id="reason"
            placeholder="Enter Reason"
            className="form-control"
            style={{minWidth :'140px'}}
            // maxLength={16}
            value={reason}
            disabled={active}
            onChange={(e) => { 
            setReason(e?.target?.value)
            }}
            readOnly={calculated&& !editPerson}
          />
          
        </td>
        <td>
        <input
            type="date"
            name="date"
            id="date"
            placeholder="Enter Date"
            className="form-control"
            style={{minWidth :'140px'}}
            // maxLength={16}
            disabled={active}
            value={date}
            onChange={(e) => { 
            setDate(e?.target?.value)
            }}
            readOnly={calculated&& !editPerson}
          />
          
        </td>
        <td>
        <ToggleButton
                      name="active"
                      value={active}
                      thumbStyle={borderRadiusStyle}
                      trackStyle={borderRadiusStyle}
                      onToggle={() => {
                        if (active) {
                          setactive(false);
                        } else {
                          setactive(true);
                        }
                      }}
                    />
        </td>

                {/* <td>
        <SelectWrapper
           isLoading={roles?.length === 0}
           options={governanceRole}
           styles={calculated ? disabledStyles : darkStyle}
           className="w-100"
          // value={role}
           placeholder="Select Role"
           isClearable
           isSearchable
           onChange={(selected) =>{
            if(selected?.label) setRole(selected?.label)
            else setRole('');
          }}
           id="parent"
          />
        </td> */}
        {/* <td>
        //this code is commented when the company role us uncommented upper select should be comment
           <Select
            isLoading={roles.length === 0}
            options={roles}
            defaultValue={roles.find((role) => role.value === ap_role)}
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
            // readOnly={calculated}
            readOnly={true}
          />
        </td> */}
      </tr>
    </>
  );
};
const SelectWrapper = styled(Select)`

max-width: 250px !important;
min-width: 230px !important;
`;