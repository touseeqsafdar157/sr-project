import React, { useState, useEffect } from "react";
import Select from "react-select";
import NumberFormat from "react-number-format";
import InputMask from "react-input-mask";
import { darkStyle, disabledStyles } from "../../defaultStyles";
import styled from "styled-components";
import ToggleButton from "react-toggle-button";

const VoteCasting = ({
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
    const [candidate_name, set_canidiate_name] = useState(gov_name || "");
    const [votes_casted, set_votes_casted] = useState('')
    const [voting_percentage, set_voting_percentage] = useState('')
    const [votes_accepted, set_votes_accepted] = useState('');
    const [votes_rejected, set_votes_rejected] = useState('')
    const [comments, set_comments]= useState('')
  
    // const [governanceRole] = useState([
    //     { label: 'CEO' },
    //     { label: 'CFO' },
    //     { label: 'COO' },
    //     { label: 'Chairman' },
    //     { label: 'Company Secretary' },
    //     { label: 'CFO/Company Secretary' },
    //     { label: 'Director' },
    //     { label: 'Chairman/Non-Ex-Director' },
    //     { label: 'Chairman/Independent-Director' },
    //     { label: 'Shareholder/Non-Ex-Director' },
    //     { label: 'Shareholder/Independent-Director' },

    // ])
    // const [directorshipRole] = useState([
    //     { label: 'Nominee' },
    //     { label: 'Independent' },
    //     { label: 'Additional' },
    //     { label: 'Other' },
    // ])

    useEffect(() => {
        if (calculated === true) {
            startCalculation({
                candidate_name,
                votes_casted,
                voting_percentage,
                votes_accepted,
                votes_rejected,
                comments

                // contact,
                // role: role || defaultvalue || '',
                // cnic_passport,
                // active: active ? 'Y' : 'N',
                // reason,
                // date,
                // father_husband_name,
                // nationality,
                // business,
                // address,
                // directorship: directorship || gov_directorship || ''

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

                color: isSelected ? 'red' : "#333333"
            };
        }
    };
    return (
        <>
            <tr>
                <td scope="col">
                    <b>{num}</b>
                </td>
                {/* <td>
                    <input
                        type="number"
                        name="candidate_id"
                        id="candidate_id"
                        placeholder="Candidate ID"
                        style={{ maxWidth: '150px', minWidth: "150px" }}
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        readOnly={calculated && !editGover}
                    />
                </td> */}
                <td>
                    <input
                        type="text"
                        name="candidate_name"
                        id="candidate_name"
                        placeholder="Candidate Name"
                        style={{ maxWidth: '150px', minWidth: "150px" }}
                        className="form-control"
                        value={candidate_name}
                        onChange={(e) => set_canidiate_name(e.target.value)}
                        readOnly={calculated && !editGover}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        name="votes_casted"
                        id="votes_casted"
                        placeholder="Votes Casted"
                        style={{ maxWidth: '150px', minWidth: "150px" }}
                        className="form-control"
                        value={votes_casted}
                        onChange={(e) => set_votes_casted(e.target.value)}
                        readOnly={calculated && !editGover}
                    />
                </td>

                <td>
                    <input
                        type="number"
                        name="voting_percentage"
                        id="voting_percentage"
                        style={{ maxWidth: '180px', minWidth: "180px" }}
                        placeholder="Voting Percentage"
                        className="form-control"
                        value={voting_percentage}

                        // maxLength={16}
                        onChange={(e) =>{ 
                            set_voting_percentage(e.target.value)
                          }}
                        readOnly={calculated && !editGover}
                    />

                </td>


                <td>
                    <input
                        type="number"
                        name="votes_accepted"
                        id="votes_accepted"
                        placeholder="Votes Accepted"
                        className="form-control"
                        style={{ maxWidth: '150px', minWidth: "150px" }}
                        value={votes_accepted}
                        onChange={(e) => set_votes_accepted(e.target.value)}
                        readOnly={calculated && !editGover}
                    />
                </td>
                <td>
                    <input
                        type="number"
                        name="votes_rejected"
                        id="votes_rejected"
                        placeholder="Votes Rejected"
                        className="form-control"
                        value={votes_rejected}
                        style={{ maxWidth: '150px', minWidth: "150px" }}
                        onChange={(e) => {
                            set_votes_rejected(e.target.value)
                        }}
                        readOnly={calculated && !editGover}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        name="comments"
                        id="comments"
                        placeholder="Comments"
                        className="form-control"
                        value={comments}
                        style={{ maxWidth: '150px', minWidth: "150px" }}
                        onChange={(e) => {
                          
                            set_comments(e.target.value)
                        }}
                        readOnly={calculated && !editGover}
                    />
                </td>

            </tr>
        </>
    );
};

export default VoteCasting;

const SelectWrapper = styled(Select)`

// max-width: 250px !important;
min-width: 250px !important;
.Select-option.is-selected {
  color: red;
}
`;