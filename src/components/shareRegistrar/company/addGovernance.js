import React, { useState, useEffect } from "react";
import Select from "react-select";
import NumberFormat from "react-number-format";
import InputMask from "react-input-mask";
import { darkStyle, disabledStyles } from "../../defaultStyles";
import styled from "styled-components";
import ToggleButton from "react-toggle-button";

const GovernanceItem = ({
  num,
  startCalculation,
  calculated,
  roles,
  gov_name,
  gov_email,
  gov_contact,
  gov_role,
  gov_cnic,
  viewCompany,
  editGover,
  reasons,
  dates,
  activeGov,
  gov_father_husband_name,
  gov_address,
  gov_nationality,
  gov_business,
  gov_directorship,
  dummys
//  'cnic_passport '
}) => {
  const [name, setName] = useState(gov_name || "");
  const [father_husband_name, setfather_husband_name] = useState(gov_father_husband_name || "");
  const [address, setAddress] = useState(gov_address|| '')
  const [email, setEmail] = useState(gov_email || "");
  const [contact, setContact] = useState(gov_contact || "");
  const [role, setRole] = useState("");
   const [defaultdirectorship, setDefaultDirectorShip] = useState(gov_directorship)
  const [nationality, setNationality] = useState('')
  const [defaultNatinality] = useState(gov_nationality);
  const [defaultvalue, setDefaultValue] =useState(gov_role)
const [cnic_passport, setCnic_passport] = useState(gov_cnic || '')
const [business, setbusiness] = useState(gov_business|| '');
const [directorship, setDirectionShip]= useState('')
const [reason, setReason] = useState(reasons || '')
const[date, setDate] = useState(dates || null)
  const [active, setactive] = useState(activeGov=='Y' ? true :activeGov =='N' ?false : false ); //done
const [nationalitydropdown] = useState([
  {label :'Afghan'},
  {label :'Albanian'},
  {label: 'Algerian'},
  {label :'Argentine Argentinian'},
  {label: 'Australian'},
  {label: 'Austrian'},
    {label :'Bangladeshi'},
    {label: 'Belgian'},
    {label: 'Bolivian'},
    {label: 'Batswana'},
    {label: 'Brazilian' },
    {label: 'Bulgarian'},
    {label:"Cambodian"},
    {label: 'Cameroonian'},
    {label: 'Canadian' },
    {label: 'Chilean'},
    {label: 'Chinese'},
    {label: 'Colombian'}, 
    {label: 'Costa Rican'},
    {label: 'Croatian'},
    {label :'Cuban'},
    {label: 'Czech'},
    {label: 'Danish'},
    {label: 'Dominican'},
    {label: 'Ecuadorian'},
    {label: 'Egyptian'},
    {label: 'Salvadorian'},
    {label: 'English'}, 
    {label: 'Estonian'},
    {label: 'Fijian'},
    {label: 'Finnish'},
    {label: 'French'},
{label: 'German'},
{label: 'Ghanaian'},
{label: 'Greek'},
{label: 'Guatemalan'},
{label: 'Haitian'},
{label :'Haitian'},
{label: 'Hungarian'},
{label: 'Icelandic'  },
{label: 'Indian'},
{label: 'Indonesian'},
{label: 'Iranian'},
{
  label: 'Iraqi'
},
{label: 'Irish'},
{
  label: 'Israeli'
},
{label: 'Italian'},
{label: 'Jamaican'},
{
  label: 'Japanese'
},
{label:'Jordanian' },
{label: 'Kenyan'},
{label: 'Kuwaiti'},
{label: 'Lao'},
{label: 'Latvian'},
{label: 'Lebanese'},
{label :'Libyan'},
{label: 'Lithuanian'},
{label: 'Malagasy'}, 
{
  label : 'Malaysian'
},
{label: 'Malian'},
{label: 'Maltese'},
{label: 'Mexican'},
{label: 'Mongolian'},
{label: 'Moroccan'},
{label: 'Mozambican'}, 
{
  label: 'Namibian'
},
{label: 'Nepalese'},
{label: 'Dutch'},
{label: 'New Zealand'},
{label: 'Nicaraguan'},
{label :'Nigerian'},
{label: 'Norwegian'},
{label: 'Pakistani'},
{label: 'Panamanian'},
{label: 'Paraguayan'},
{label: 'Peruvian'},
{label: 'Philippine'},
{label: 'Polish'},
{
  label :'Portuguese'
},
{label: 'Romanian'},
{label: 'Russian'},
{label :'Saudi'},
{label: 'Scottish'},
{label :'Senegalese'},
{label :'Serbian'},
{label: 'Singaporean'},
{label: 'Slovak'},
{label: 'South African'},
{label: 'Korean'},
{label: 'Spanish'},
{label: 'Sri Lankan'},
{label: 'Sudanese'},
{label: 'Swedish'},
{label: 'Swiss'},
{label: 'Syrian'},
{label: 'Taiwanese'},
{label: 'Tajikistani'},
{label: 'Thai'},
{label: 'Tongan'},
{label :'Tunisian'},
{label: 'Turkish'},
{label: 'Ukrainian'},
{label: 'Emirati'},
{label: 'British'},
{label :'American '},
{label: 'Uruguayan'},
{label: 'Venezuelan'},
{label: 'Vietnamese'},
{label: 'Welsh'},
{label: 'Zambian'},
{label: 'Zimbabwean'}

])
const [governanceRole] = useState([
    {label: 'CEO'},
    {label: 'CFO'},
    {label: 'COO'},
    {label: 'Chairman'},
    {label: 'Company Secretary'},
    {label: 'CFO/Company Secretary'},
    {label: 'Director'},
    {label: 'Chairman/Non-Ex-Director'},
    {label: 'Chairman/Independent-Director'},
    {label: 'Shareholder/Non-Ex-Director'},
    {label: 'Shareholder/Independent-Director'},
    
])
const [directorshipRole] = useState([
 {label: 'Nominee'},
 {label: 'Independent'},
 {label: 'Additional'},
 {label: 'Other'},
])

  useEffect(() => {
    if (calculated === true) {
      startCalculation({
        name,
        email,
        contact,
        role: role || defaultvalue || '',
        cnic_passport,
        active : active? 'Y' : 'N',
        reason,
        date,
        father_husband_name,
        nationality,
        business,
        address,
        directorship:directorship|| gov_directorship|| ''
        
      });
    }
  }, [calculated]);
  const borderRadiusStyle = { borderRadius: 2 };
  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      console.log({ data, isDisabled, isFocused, isSelected });
      return {
        ...styles,
        backgroundColor: isFocused ? "#ffff" : 'NONE',
        
        color:isSelected ? 'red': "#333333"
      };
    }
  };
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
            style={{maxWidth: '155px', minWidth: "155px"}}
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={calculated &&!editGover }
          />
        </td>
        <td>
          <input
            type="text"
            name="father_husband_name"
            id="father_husband_name"
            placeholder="Father/Husband Name"
            style={{maxWidth: '155px', minWidth: "155px"}}
            className="form-control"
            value={father_husband_name}
            onChange={(e) => setfather_husband_name(e.target.value)}
            readOnly={calculated &&!editGover }
          />
        </td>
        <td>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Enter Address"
            style={{maxWidth: '155px', minWidth: "155px"}}
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            readOnly={calculated &&!editGover }
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
          name="nationality"
          id="nationality"
          style={{maxWidth: '180px', minWidth: "180px"}}
           placeholder="Select Nationality"
          className="form-control"
          value={defaultNatinality}
          // maxLength={16}
          // onChange={(e) =>{ 
          //   setCnic_passport(e.target.value)
          //   }}
          readOnly={calculated&& !editGover}
        />
          :
          <SelectWrapper
           isLoading={nationalitydropdown?.length === 0}
           options={nationalitydropdown}
          //  defaultValue={ {label:'test'}}
          //  defaultInputValue={{label:'test'}}
          
           styles={ calculated&& !editGover ? disabledStyles : darkStyle }
           placeholder={defaultNatinality || "Nationality"}
           isClearable
           isSearchable
           onChange={(selected) =>{
            if(selected?.label) setNationality(selected?.label)
            else setNationality('');
          }}
           id="parent"
           readOnly={calculated&& !editGover}
          //  styles={colourStyles}
          />
        }
        </td>


        <td>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            className="form-control"
            style={{maxWidth: '155px', minWidth: "155px"}}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={calculated && !editGover}
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
            style={{maxWidth: '155px', minWidth: "155px"}}
            maxLength={16}
            onChange={(e) =>{ 
              if(!e.target.value.length)setContact('')
              if(e.target.value.match(/^\d+$/)) setContact(e.target.value)
              }}
            readOnly={calculated&& !editGover}
          />
        </td>
     
        <td>
          <input
            type="text"
            name="bussiness"
            id="bussiness"
            placeholder="Business Occupation"
            className="form-control"
            value={business}
            // maxLength={16}
            style={{maxWidth: '155px', minWidth: "155px"}}
            onChange={(e) =>{ 
              setbusiness(e.target.value)
              }}
            readOnly={calculated&& !editGover}
          />
        </td>
        <td>
          <input
            type="text"
            name="cnic"
            id="cnic"
            placeholder="CNIC/Passport"
            className="form-control"
            value={cnic_passport}
            maxLength={16}
            style={{maxWidth: '155px', minWidth: "155px"}}
            onChange={(e) =>{ 
              setCnic_passport(e.target.value)
              }}
            readOnly={calculated&& !editGover}
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
          style={{maxWidth: '155px', minWidth: "155px"}}
           placeholder="Select Role"
          className="form-control"
          value={defaultvalue}
          // maxLength={16}
          // onChange={(e) =>{ 
          //   setCnic_passport(e.target.value)
          //   }}
          readOnly={calculated&& !editGover}
        />
          :
          <SelectWrapper
           isLoading={roles?.length === 0}
           options={governanceRole}
          //  defaultValue={ {label:'test'}}
          //  defaultInputValue={{label:'test'}}
          
           styles={ calculated&& !editGover ? disabledStyles : darkStyle }
           placeholder={defaultvalue || "Select Role"}
           isClearable
           isSearchable
           onChange={(selected) =>{
            if(selected?.label) setRole(selected?.label)
            else setRole('');
          }}
           id="parent"
           readOnly={calculated&& !editGover}
          />
        }
        </td>
{/* {console.log('count', count)} */}

        <td>
        <input
            type="text"
            name="reason"
            id="reason"
            placeholder="Enter Reason"
            className="form-control"
            style={{maxWidth: '155px', minWidth: "155px"}}
            // maxLength={16}
            value={reason}
            disabled={active}
            onChange={(e) => { 
            setReason(e?.target?.value)
            }}
            readOnly={calculated&& !editGover}
          />
          
        </td>
        <td>
        <input
            type="date"
            name="date"
            id="date"
            placeholder="Enter Date"
            className="form-control"
            style={{maxWidth: '155px', minWidth: "155px"}}
            // maxLength={16}
            disabled={active}
            value={date}
            onChange={(e) => { 
            setDate(e?.target?.value)
            }}
            readOnly={calculated&& !editGover}
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







       {(role=='Director' || defaultvalue == 'Director')?

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
name="directorship"
id="directorship"
style={{maxWidth: '180px', minWidth: "180px"}}
 placeholder="Nature Directorship"
className="form-control"
value={defaultdirectorship}
// maxLength={16}
// onChange={(e) =>{ 
//   setCnic_passport(e.target.value)
//   }}
readOnly={calculated&& !editGover}
/>
:
<SelectWrapper
 isLoading={roles?.length === 0}
 options={directorshipRole}
//  defaultValue={ {label:'test'}}
//  defaultInputValue={{label:'test'}}

 styles={ calculated&& !editGover ? disabledStyles : darkStyle }
 placeholder={defaultdirectorship || "Nature Directorship"}
 isClearable
 isSearchable
 onChange={(selected) =>{
  if(selected?.label) setDirectionShip(selected?.label)
  else setDirectionShip('');
}}
 id="directorship"
 readOnly={calculated&& !editGover}
/>
}
</td>
        // <td>
        // <input
        //     type="text"
        //     name="naturedirectorship "
        //     id="naturedirectorship"
        //     placeholder="Nature Directorship"
        //     className="form-control"
        //     style={{maxWidth: '155px', minWidth: "155px"}}
        //     // maxLength={16}
        //     // disabled={active}
        //     value={directorship}
        //     onChange={(e) => { 
        //       setDirectionShip(e?.target?.value)
        //     }}
        //     readOnly={calculated&& !editGover}
        //   />
          
        // </td>
        
        : ''}



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

export default GovernanceItem;

const SelectWrapper = styled(Select)`

// max-width: 265px !important;
min-width: 265px !important;
.Select-option.is-selected {
  color: red;
}
`;