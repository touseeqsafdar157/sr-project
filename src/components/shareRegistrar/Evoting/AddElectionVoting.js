import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getCompanies } from 'store/services/company.service';
import { addDirectorSchema } from 'store/validations/votingValidations';
import { AddAuthorizedScema } from 'store/validations/votingValidations';
import { errorStyles } from 'components/defaultStyles';
import { getShareHoldersByCompany } from 'store/services/shareholder.service';
import { addElectionVotingData, getAllAuthorization, getAllElections } from 'store/services/evoting.service';
import moment from 'moment';
import styled from 'styled-components';
import { addAuthoriziedVoting } from 'store/services/evoting.service';
import { getAllCandidateData } from 'store/services/evoting.service';
import VoteCasting from './voteCasting';
import { AddElectionSchema } from 'store/validations/votingValidations';
export const AddElectionVoting = ({ setAddElection, getPaginatedRequirment }) => {
    const [loading, setLoading] = useState(false)
    const email = sessionStorage.getItem("email");
    const [isError, setIsError] = useState(false)
    const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
    const [sharehoerData, setShareholderData] = useState('')
    const [selectedshareHolder, setSelectedShareholder] = useState('');
    const [ElectionIdDropdown, setElectionsDropDown] = useState([])
    const [folioNumber, setFolioNumber] = useState('')
    const [authorizationOptions, setAuthorizationOptions] = useState([])
    const [selectedAuthorizationId, setSelectedAuthorizationId] = useState('')
    const [startVoteCastedCalculation, setVoteCastCalculation] = useState(false);
    const [votecastingArray, setVotecastingArray] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [companies_dropdown, setCompanies_dropdown] = useState([]);
    const [allCandidate, setAllCanidate] = useState([])
    const [selectedElection, setSelectedElection]=useState('')
    const [allElection, setAllElection] = useState('')
    const [filterCandidate, setFilterCandidate]=useState([])
    const [copyOfFilterCandidate, setFilterOfCandidate] = useState();
    const [selectedDirector, setSelectedDirector] = useState(0)
    const [castAbleVote, setCastAbleVote] = useState(0)
    const [votableShare, setVotableShare] = useState(0)
    const [companyError, setCommpanyError] = useState(false)
    const [electionError, setElectionError] = useState(false)
    const [voterError, setVoterError]= useState(false)
    const [totalVotes, setTotalVotes] = useState(null);
    const electionIdref = useRef(null);
        const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
        resetField,
        control,
    } = useForm({ resolver: yupResolver(AddElectionSchema) });
    const getAllElection = async () => {
        try {
            const response = await getAllElections(email);
            if (response.status === 200) {
               
                const parents = response.data.data;
                const options = response.data.data.map((item) => {
                    let label = `${item.election_id} - ${item.symbol}`;
                    return { label: label, value: item.election_id, companyCode: item?.company_code, noOfDirector: item?.number_of_directors };
                });
                setAllElection(options);
            }
        } catch (error) {
        }
    }
    const getAllCandidate = async () => {
        try {
            const response = await getAllCandidateData(email);
            if (response.status === 200) {
                const parents = response.data.data;
                setAllCanidate(parents)
              
            }
        } catch (error) {
        }
    }
    const getAllAuthorizationData = async () => {
        try {
            const response = await getAllAuthorization(email);
            if (response.status === 200) {
                const parents = response.data.data;
                const options = response.data.data.map((item) => {
                    let label = `${item.auth_id} - ${item.authorized_name}`;
                    return { label: label, value: item.auth_id };
                });
                setAuthorizationOptions(options);
            }
        } catch (error) {
        }
    }


    const updateData = (e, id, key) => {
            const newArrToSum = [...filterCandidate];
            const newArr = [...filterCandidate];
            const index = newArrToSum?.findIndex(item => item?.candidate_id == id);
            const findObj = newArrToSum?.find(item => item?.candidate_id == id);
            const sum = newArrToSum?.reduce((a, b) => a + b.vote_casted, 0);
            if (index !== -1) {
              if (key == 'vote_casted') {
                const checkVal = (sum-findObj?.vote_casted)+e;
                if (checkVal <= castAbleVote) {
                    // value={`${(Number(item?.vote_casted/castAbleVote)*100)?.toFixed(2)?.toString()}%`}
                  newArr[index][key] = e;
                  newArr[index]['voting_percentage'] =`${(Number(newArr[index].vote_casted/castAbleVote)*100)?.toFixed(2)?.toString()}%`
                  setFilterCandidate(newArr);
                } else {
                    toast.error(`The total sum of all votes cannot exceed ${castAbleVote}.`);
                //   alert(`The total sum of all votes cannot exceed ${castAbleVote}.`);
                }
              } else {
                newArr[index][key] = e;
                setFilterCandidate(newArr);
              }
            }
          







       
    
      };
    useEffect(() => {
        const getAllCompanies = async () => {
            // setCompanies_data_loading(true);
            try {
                const response = await getCompanies(email);
                if (response.status === 200) {
                    const parents = response.data.data;
                    const companies_dropdowns = response.data.data.map((item) => {
                        let label = `${item.code} - ${item.company_name}`;
                        return { label: label, value: item.code };
                    });
                    setCompanies_dropdown(companies_dropdowns);
                }
            } catch (error) {
            }
        };
        getAllAuthorizationData();
        getAllElection();
        getAllCompanies();
        getAllCandidate();
    }, []);
    useEffect(()=>{
        if(selectedElection){
           
            const formatedData = allCandidate?.filter(i => i?.election_id==selectedElection);
            let sum=0
const votes = formatedData?.map((item)=>{
const NumberofShare =  Number(item?.number_of_votes)?Number(item?.number_of_votes) :0
sum=NumberofShare+sum;
})
setTotalVotes(sum*formatedData?.length)
            const newList = formatedData?.map(item => {
                return {
                    ...item,
                    vote_casted: 0,
                    votes_accepted: '',
                    votes_rejected: '',
                    comments: '',
                    voting_percentage: '',
                }
            })
            setFilterCandidate(newList)
          
        }
        else{
            setFilterCandidate([])
        }
    },[selectedElection])
    const getShareholderByCompany = async (code) => {
        try {
            const response = await getShareHoldersByCompany(email, code);
            if (response.status == 200) {
                const options = response.data.data?.map((item) => {
                    const electronicShare =  Number(item?.electronic_shares) ? Number(item?.electronic_shares) : 0
                    const physicalShares =  Number(item?.physical_shares) ? Number(item?.physical_shares) : 0
                    const shareholder_id = item?.shareholder_id || item?.cnic_copy || item?.ntn;
                    let label = `${item?.folio_number} - ${item?.shareholder_name}`;
                    return { label: label, value: shareholder_id, folio_number: item?.folio_number, votableShare: (electronicShare+physicalShares) };
                })
                setshareholder_dropDown(options)
                setShareholderData(response.data.data)
            }
        } catch (error) {
            if (error.response != undefined) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    }
    useEffect(() => {
        if (selectedCompany){
         const filterElection =   allElection?.filter((item)=>item?.companyCode==selectedCompany);
         setElectionsDropDown(filterElection)
            getShareholderByCompany(selectedCompany)}

    }, [selectedCompany])


    const handleAlertMessage = async (data) => {
        setVoteCastCalculation(true)
if(!selectedCompany){
   setCommpanyError(true)
}else{
    setCommpanyError(false)
}
if(!selectedElection){
   setElectionError(true)
}else{
    setElectionError(false)
}
if(!selectedshareHolder){
    setVoterError(true)
}else{
    setVoterError(false)
}
if(!selectedCompany || !selectedElection ||!selectedshareHolder) return;
if(sumOfFilterCandidate() !=0 ) {
    toast.error('Remaining Votes Should Be Equal To Zero');
    return;
}
    const votesCast= filterCandidate?.map((item)=>{
        return{
            candidate_id: item?.candidate_id,
            candidate_name: item?.candidate_name,
            votes_casted: item?.vote_casted,
            votes_accepted: item?.votes_accepted,
            votes_rejected: item?.votes_rejected,
            comments: item?.comments,
            voting_percentage: item?.voting_percentage,  
        }
    })
        try {
            setLoading(true);
            const response = await addElectionVotingData(
                email,
                selectedCompany,
                selectedElection,
                data?.cast_type,
                data?.cast_through,
                selectedshareHolder,
                folioNumber,
                selectedAuthorizationId,
                votableShare?.toString(),
                castAbleVote?.toString(),
                data?.remarks,
                votesCast,


            );

            if (response.data.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload();
                    toast.success(`${response.data.message}`);
                    setAddElection(false);
                }, 2000);
            } else {
                setLoading(false);
                toast.error(`${response.data.message}`);
            }
        } catch (error) {
            setLoading(false);
            !!error?.response?.data?.message
                ? toast.error(error?.response?.data?.message)
                : toast.error("Election Voting Not Added");
        }
    }

    const appliedStyles = {
        control: (base, state) => ({
            ...base,
            border: "1px solid red",
        }),
    };
   
    const sumOfFilterCandidate = ()=>{
        const sum = filterCandidate?.reduce((a, b) => a + b.vote_casted, 0);
        return castAbleVote-sum;
    }
    useEffect(()=>{
        if(selectedDirector&&votableShare){
            setCastAbleVote(selectedDirector*votableShare)
            const newArray =filterCandidate?.map((item)=>{
                return{
                    ...item,
                    vote_casted: 0,
                }
                
              })
              setFilterCandidate(newArray)
        }
    },[selectedDirector, votableShare])
    return (
        <div>
<form onSubmit={handleSubmit(handleAlertMessage)}>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Election</h5>
              </div>
              <div className="card-body">
              <div className="form-group mt-3">
                            <label htmlFor="company_code">Company</label>

                            <Controller
                                name="company_code"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={companies_dropdown}
                                        isLoading={!companies_dropdown?.length}
                                        id="company_code"
                                        placeholder={'Enter Company'}
                                        onChange={(selected) => {
                                            if (selected?.value) {setSelectedCompany(selected?.value);
                                                setElectionsDropDown(null)
                                                 
                                                setFilterCandidate([])
                                                setSelectedElection('')
                                                setSelectedShareholder('')
                                                resetField("cast_type");
                                                resetField("cast_through");
                                                setFolioNumber('')
                                                setSelectedAuthorizationId('')
                                                setVotableShare(0)
                                                setCastAbleVote(0)
                                                resetField("remarks");
                                                setshareholder_dropDown(null)
                                            }
                                            else {setSelectedCompany("");
                                            setFilterCandidate([])
                                                setSelectedElection('')
                                                resetField("cast_type");
                                                resetField("cast_through");
                                                setFolioNumber('')
                                                setSelectedAuthorizationId('')
                                                setVotableShare(0)
                                                setCastAbleVote(0)
                                                resetField("remarks");
                                                setshareholder_dropDown([])
                                                setSelectedShareholder('')
                                        }
                                    }}
                                        isClearable={true}
                                        styles={companyError&& appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {companyError ? 'Enter Company': ''}
                            </small>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="election_id">Election Id</label>

                            <Controller
                                name="election_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={ElectionIdDropdown}
                                        isLoading={!ElectionIdDropdown?.length}
                                        value={ElectionIdDropdown?.filter(
                                            (option) => option.value === selectedElection
                                          )}
                                        id="election_id"
                                        ref={electionIdref}
                                        placeholder={'Enter Election ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {setSelectedElection(selected?.value)
                                                setSelectedDirector(Number(selected?.noOfDirector) ?Number(selected?.noOfDirector) : 0 )
                                                // setVotableShare(0)
                                                // setCastAbleVote(0)
                                            }
                                            else{ setSelectedElection("");
                                            setSelectedDirector(0)
                                            // setVotableShare(0)
                                            // setCastAbleVote(0)
                                        }
                                        }}
                                        isClearable={true}
                                        styles={electionError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {electionError ? 'Enter Election Id' : ''}
                            </small>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="remarks">Remarks </label>

                            <input
                                className={`form-control ${errors.remarks && "border border-danger"
                                    }`}
                                name="remarks"
                                type="text"
                                placeholder='Enter Remarks'
                                {...register("remarks")}
                            />
                            <small className="text-danger">
                                {errors.remarks?.message}
                            </small>
                        </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-xl-4">
            <div className="card ">
              <div className="card-header b-t-success">
                <h5>Casting</h5>
              </div>
              <div className="card-body">
                        <div className="form-group mt-3  ">
                            <label htmlFor="cast_type">Cast Type </label>
                            <select
                                name="cast_type"
                                className={`form-control ${errors.cast_type && "border border-danger"
                                    }`}
                                {...register("cast_type")}
                            >
                                <option value="">Select</option>
                                <option value="Physical">Physical </option>
                                <option value="Electronic">Electronic</option>
                            </select>
                            <small className="text-danger">
                                {errors.cast_type?.message}
                            </small>
                        </div>
                    <div className="form-group mt-3  ">
                            <label htmlFor="cast_through">Cast Through </label>
                            <select
                                name="cast_through"
                                className={`form-control ${errors.cast_type && "border border-danger"
                                    }`}
                                {...register("cast_through")}
                            >
                                <option value="">Select</option>
                                <option value="Ballot Paper">Ballot Paper </option>
                                <option value="Web App">Web App</option>
                                {/* <option value="Mobile App">Mobile App</option> */}
                                <option value="Post">Post</option>

                            </select>
                            <small className="text-danger">
                                {errors.cast_through?.message}
                            </small>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="voter_id">Folio Number</label>

                            <Controller
                                name="voter_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={shareholder_dropDown}
                                        isLoading={!shareholder_dropDown?.length}
                                        value={shareholder_dropDown?.filter(
                                            (option) => option.value === selectedshareHolder
                                          )}
                                        id="voter_id"
                                        placeholder={'Enter Folio Number'}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                setSelectedShareholder(selected.value)
                                                setFolioNumber(selected.folio_number)
                                                setVotableShare(selected?.votableShare)
                                                
                                            }
                                            else {
                                                setSelectedShareholder('')
                                                setFolioNumber('');
                                                setVotableShare('');
                                            }
                                        }}
                                        isClearable={true}
                                        styles={voterError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />
                            <small className="text-danger">
                                {voterError ? 'Enter Folio Number' : ''}
                            </small>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="votable_share">Votable Shares    </label>


                            <Controller
                                name="votable_share"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.votable_share && "border border-danger"
                                            }`}
                                        id="votable_share"
                                        value={votableShare}
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                        readOnly
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.votable_share?.message}
                            </small>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="castable_vote">Castable Votes    </label>


                            <Controller
                                name="castable_vote"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.castable_vote && "border border-danger"
                                            }`}
                                        id="castable_vote"
                                        value={castAbleVote}
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                        readOnly
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.castable_vote?.message}
                            </small>
                        </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-xl-4">
            <div className="card ">
              <div className="card-header b-t-success">
                <h5>Authorization</h5>
              </div>
              <div className="card-body">
              <div className="form-group mt-3">
                            <label htmlFor="authorzation_id"> Proxy/Authorization ID</label>

                            <Controller
                                name="authorzation_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={authorizationOptions}
                                        isLoading={!authorizationOptions?.length}
                                        id="authorzation_id"
                                        placeholder={'Enter Authorzation ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                setSelectedAuthorizationId(selected.value)
                                                // setFolioNumber(selected.folio_number)
                                            }
                                            else {
                                                setSelectedAuthorizationId('')
                                                // setFolioNumber('')
                                            }
                                        }}
                                        isClearable={true}
                                        styles={errors.authorzation_id && appliedStyles}
                                    />
                                )}
                                control={control}
                            />
                            <small className="text-danger">
                                {errors.voter_id?.message}
                            </small>
                        </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4">
                    <div className="card w-100 mx-4">
                     
                        <div className="card-header b-t-success" style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                          <div>  <b>Vote Casting</b></div>

                            <div>
                            <div><b>Total Votes: {castAbleVote}</b></div>
                            <div>
                          <b>  Remaining votes:  <span> {sumOfFilterCandidate()}</span></b>
                            </div>
                        </div>
                       
                        </div>
                        <div>
                       
                        </div>
                        <div className="card-body">
                           {filterCandidate?.length ?
                            <TableWrapper className="table table-responsive">
                                <thead>
                                    <tr>
                                        <th className="text-nowrap">S No.</th>
                                        <th className="text-nowrap">Candidate Name</th>
                                        <th className="text-nowrap">Votes Casted</th>
                                        <th className="text-nowrap">Voting Percentage</th>
                                        <th className="text-nowrap"> Votes Accepted</th>
                                        <th className="text-nowrap"> Votes Rejected</th>
                                        <th className="text-nowrap"> Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { filterCandidate.map(
                                        (item, key) => (
                                            <tr key = {key}>
                                            <td scope="col">
                                                <b>{key+1}</b>
                                            </td>
                                           
                                            <td>
                                                <input
                                                    type="text"
                                                    name="candidate_name"
                                                    id="candidate_name"
                                                    placeholder="Candidate Name"
                                                    style={{ maxWidth: '150px', minWidth: "150px" }}
                                                    className="form-control"
                                                    value={item?.candidate_name}
                                                    onChange={(e)=>{
                                                        updateData(e?.target?.value, item?.candidate_id, 'candidate_name')
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    // type="text"
                                                    name="votes_casted"
                                                    id="votes_casted"
                                                    placeholder="Votes Casted"
                                                    style={{ maxWidth: '150px', minWidth: "150px" }}
                                                    className="form-control"
                                                    value={item?.vote_casted>0? item?.vote_casted : ''}
                                                   
                                                    onChange={(e)=>{
                                                        if(!e.target.value.length)updateData(Number(0), item?.candidate_id, 'vote_casted')
                                                        if(e.target.value.match(/^\d+$/))  updateData(Number(e?.target?.value), item?.candidate_id, 'vote_casted')
                                                        else  toast.error('Kindly Enter Only Digit');
                                                        //  toast.e ()
                                                    }}
                                                />
                                            </td>
                            
                                            <td>
                                                <input
                                                    type="text"
                                                    name="voting_percentage"
                                                    id="voting_percentage"
                                                    style={{ maxWidth: '180px', minWidth: "180px" }}
                                                    placeholder="Voting Percentage"
                                                    className="form-control"
                                                    value={item?.voting_percentage}
                                                    // value={`${(Number(item?.vote_casted/castAbleVote)*100)?.toFixed(2)?.toString()}%`}
                                                    // onChange={(e)=>{
                                                    //     updateData(e, item?.candidate_id, 'voting_percentage')
                                                    // }}
                                                    readOnly
                                                    // maxLength={16}
                                                   
                                                />
                            
                                            </td>
                            
                            
                                            <td>
                                                <input
                                                    type="number"
                                                    name="votes_accepted"
                                                    id="votes_accepted"
                                                    placeholder="Votes Accepted"
                                                    className="form-control"
                                                    value={item?.votes_accepted}
                                                    style={{ maxWidth: '150px', minWidth: "150px" }}
                                                    onChange={(e)=>{
                                                        updateData(e?.target?.value, item?.candidate_id, 'votes_accepted')
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    name="votes_rejected"
                                                    id="votes_rejected"
                                                    placeholder="Votes Rejected"
                                                    className="form-control"
                                                    value={item?.votes_rejected}
                                                    style={{ maxWidth: '150px', minWidth: "150px" }}
                                                    onChange={(e)=>{
                                                        updateData(e?.target?.value, item?.candidate_id, 'votes_rejected')
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="comments"
                                                    id="comments"
                                                    placeholder="Comments"
                                                    className="form-control"
                                                    value={item?.comments}
                                                    style={{ maxWidth: '150px', minWidth: "150px" }}
                                                    onChange={(e)=>{
                                                        updateData(e?.target?.value, item?.candidate_id, 'comments')
                                                    }}
                                                />
                                            </td>
                            
                                        </tr>
                                            // <VoteCasting
                                            //     key={index}
                                            //     num={index + 1}
                                            //     startCalculation={startGovCalculation}
                                            //     calculated={startVoteCastedCalculation}
                                            // // roles={roles}
                                            // // editGover={true}
                                            // />
                                        )
                                    ) 
                                    }
                                </tbody>
                            </TableWrapper> : 
                                        <div>Candidate Data Not Available</div>}
                        </div>
                    </div>
                </div>
        <div className="row">
          <div className="col-md-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={Boolean(loading)}
            >
              {loading ? (
                <>
                  <span className="fa fa-spinner fa-spin"></span>
                  <span>{"Loading..."}</span>
                </>
              ) : (
                <span>{"Submit"}</span>
              )}
            </button>
          </div>
        </div>
      </form>









            {/* <form onSubmit={handleSubmit(handleAlertMessage)}>
                <div className="row b-t-primary" style={{ margin: '0px 8px', borderRadius: ' 10px' }}>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="company_code">Company</label>

                            <Controller
                                name="company_code"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={companies_dropdown}
                                        isLoading={!companies_dropdown?.length}
                                        id="company_code"
                                        placeholder={'Enter Company'}
                                        onChange={(selected) => {
                                            if (selected?.value) {setSelectedCompany(selected?.value);
                                                setElectionsDropDown(null)
                                                 
                                                setFilterCandidate([])
                                                setSelectedElection('')
                                                setSelectedShareholder('')
                                                resetField("cast_type");
                                                resetField("cast_through");
                                                setFolioNumber('')
                                                setSelectedAuthorizationId('')
                                                setVotableShare(0)
                                                setCastAbleVote(0)
                                                resetField("remarks");
                                                setshareholder_dropDown(null)
                                            }
                                            else {setSelectedCompany("");
                                            setFilterCandidate([])
                                                setSelectedElection('')
                                                resetField("cast_type");
                                                resetField("cast_through");
                                                setFolioNumber('')
                                                setSelectedAuthorizationId('')
                                                setVotableShare(0)
                                                setCastAbleVote(0)
                                                resetField("remarks");
                                                setshareholder_dropDown([])
                                                setSelectedShareholder('')
                                        }
                                    }}
                                        isClearable={true}
                                        styles={companyError&& appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {companyError ? 'Enter Company': ''}
                            </small>
                        </div>
                       
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="election_id">Election Id</label>

                            <Controller
                                name="election_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={ElectionIdDropdown}
                                        isLoading={!ElectionIdDropdown?.length}
                                        value={ElectionIdDropdown?.filter(
                                            (option) => option.value === selectedElection
                                          )}
                                        id="election_id"
                                        ref={electionIdref}
                                        placeholder={'Enter Election ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {setSelectedElection(selected?.value)
                                                setSelectedDirector(Number(selected?.noOfDirector) ?Number(selected?.noOfDirector) : 0 )
                                                // setVotableShare(0)
                                                // setCastAbleVote(0)
                                            }
                                            else{ setSelectedElection("");
                                            setSelectedDirector(0)
                                            // setVotableShare(0)
                                            // setCastAbleVote(0)
                                        }
                                        }}
                                        isClearable={true}
                                        styles={electionError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {electionError ? 'Enter Election Id' : ''}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3  ">
                            <label htmlFor="cast_type">Cast Type </label>
                            <select
                                name="cast_type"
                                className={`form-control ${errors.cast_type && "border border-danger"
                                    }`}
                                {...register("cast_type")}
                            >
                                <option value="">Select</option>
                                <option value="Physical">Physical </option>
                                <option value="Electronic">Electronic</option>
                            </select>
                            <small className="text-danger">
                                {errors.cast_type?.message}
                            </small>
                        </div>

                    </div>
                   
                    <div className='col-md-4'>
                        <div className="form-group mt-3  ">
                            <label htmlFor="cast_through">Cast Through </label>
                            <select
                                name="cast_through"
                                className={`form-control ${errors.cast_type && "border border-danger"
                                    }`}
                                {...register("cast_through")}
                            >
                                <option value="">Select</option>
                                <option value="Ballot Paper">Ballot Paper </option>
                                <option value="Web App">Web App</option>
                                <option value="Post">Post</option>

                            </select>
                            <small className="text-danger">
                                {errors.cast_through?.message}
                            </small>
                        </div>

                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="voter_id">Folio Number</label>

                            <Controller
                                name="voter_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={shareholder_dropDown}
                                        isLoading={!shareholder_dropDown?.length}
                                        value={shareholder_dropDown?.filter(
                                            (option) => option.value === selectedshareHolder
                                          )}
                                        id="voter_id"
                                        placeholder={'Enter Voter ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                setSelectedShareholder(selected.value)
                                                setFolioNumber(selected.folio_number)
                                                setVotableShare(selected?.votableShare)
                                                
                                            }
                                            else {
                                                setSelectedShareholder('')
                                                setFolioNumber('');
                                                setVotableShare('');
                                            }
                                        }}
                                        isClearable={true}
                                        styles={voterError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />
                            <small className="text-danger">
                                {voterError ? 'Enter Voter Id' : ''}
                            </small>
                        </div>
                    </div>
                
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="authorzation_id">Authorization ID</label>

                            <Controller
                                name="authorzation_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={authorizationOptions}
                                        isLoading={!authorizationOptions?.length}
                                        id="authorzation_id"
                                        placeholder={'Enter Authorzation ID'}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                setSelectedAuthorizationId(selected.value)
                                                // setFolioNumber(selected.folio_number)
                                            }
                                            else {
                                                setSelectedAuthorizationId('')
                                                // setFolioNumber('')
                                            }
                                        }}
                                        isClearable={true}
                                        styles={errors.authorzation_id && appliedStyles}
                                    />
                                )}
                                control={control}
                            />
                            <small className="text-danger">
                                {errors.voter_id?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="votable_share">Votable Shares    </label>


                            <Controller
                                name="votable_share"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.votable_share && "border border-danger"
                                            }`}
                                        id="votable_share"
                                        value={votableShare}
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                        readOnly
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.votable_share?.message}
                            </small>
                        </div>
                       
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="castable_vote">Castable Votes    </label>


                            <Controller
                                name="castable_vote"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.castable_vote && "border border-danger"
                                            }`}
                                        id="castable_vote"
                                        value={castAbleVote}
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                        readOnly
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.castable_vote?.message}
                            </small>
                        </div>
                    </div>


                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="remarks">Remarks </label>

                            <input
                                className={`form-control ${errors.remarks && "border border-danger"
                                    }`}
                                name="remarks"
                                type="text"
                                placeholder='Enter Remarks'
                                {...register("remarks")}
                            />
                            <small className="text-danger">
                                {errors.remarks?.message}
                            </small>
                        </div>
                    </div>






                </div>

                <div className="row mt-4">
                    <div className="card w-100 mx-4">
                     
                        <div className="card-header b-t-success" style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                          <div>  <b>Vote Casting</b></div>

                            <div>
                            <div><b>Total Votes: {castAbleVote}</b></div>
                            <div>
                          <b>  Remaining votes:  <span> {sumOfFilterCandidate()}</span></b>
                            </div>
                        </div>
                       
                        </div>
                        <div>
                       
                        </div>
                        <div className="card-body">
                           {filterCandidate?.length ?
                            <TableWrapper className="table table-responsive">
                                <thead>
                                    <tr>
                                        <th className="text-nowrap">S No.</th>
                                        <th className="text-nowrap">Candidate Name</th>
                                        <th className="text-nowrap">Votes Casted</th>
                                        <th className="text-nowrap">Voting Percentage</th>
                                        <th className="text-nowrap"> Votes Accepted</th>
                                        <th className="text-nowrap"> Votes Rejected</th>
                                        <th className="text-nowrap"> Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { filterCandidate.map(
                                        (item, key) => (
                                            <tr key = {key}>
                                            <td scope="col">
                                                <b>{key+1}</b>
                                            </td>
                                           
                                            <td>
                                                <input
                                                    type="text"
                                                    name="candidate_name"
                                                    id="candidate_name"
                                                    placeholder="Candidate Name"
                                                    style={{ maxWidth: '150px', minWidth: "150px" }}
                                                    className="form-control"
                                                    value={item?.candidate_name}
                                                    onChange={(e)=>{
                                                        updateData(e?.target?.value, item?.candidate_id, 'candidate_name')
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    // type="text"
                                                    name="votes_casted"
                                                    id="votes_casted"
                                                    placeholder="Votes Casted"
                                                    style={{ maxWidth: '150px', minWidth: "150px" }}
                                                    className="form-control"
                                                    value={item?.vote_casted>0? item?.vote_casted : ''}
                                                   
                                                    onChange={(e)=>{
                                                        if(!e.target.value.length)updateData(Number(0), item?.candidate_id, 'vote_casted')
                                                        if(e.target.value.match(/^\d+$/))  updateData(Number(e?.target?.value), item?.candidate_id, 'vote_casted')
                                                        else  toast.error('Kindly Enter Only Digit');
                                                        //  toast.e ()
                                                    }}
                                                />
                                            </td>
                            
                                            <td>
                                                <input
                                                    type="text"
                                                    name="voting_percentage"
                                                    id="voting_percentage"
                                                    style={{ maxWidth: '180px', minWidth: "180px" }}
                                                    placeholder="Voting Percentage"
                                                    className="form-control"
                                                    value={item?.voting_percentage}
                                                    // value={`${(Number(item?.vote_casted/castAbleVote)*100)?.toFixed(2)?.toString()}%`}
                                                    // onChange={(e)=>{
                                                    //     updateData(e, item?.candidate_id, 'voting_percentage')
                                                    // }}
                                                    readOnly
                                                    // maxLength={16}
                                                   
                                                />
                            
                                            </td>
                            
                            
                                            <td>
                                                <input
                                                    type="number"
                                                    name="votes_accepted"
                                                    id="votes_accepted"
                                                    placeholder="Votes Accepted"
                                                    className="form-control"
                                                    value={item?.votes_accepted}
                                                    style={{ maxWidth: '150px', minWidth: "150px" }}
                                                    onChange={(e)=>{
                                                        updateData(e?.target?.value, item?.candidate_id, 'votes_accepted')
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    name="votes_rejected"
                                                    id="votes_rejected"
                                                    placeholder="Votes Rejected"
                                                    className="form-control"
                                                    value={item?.votes_rejected}
                                                    style={{ maxWidth: '150px', minWidth: "150px" }}
                                                    onChange={(e)=>{
                                                        updateData(e?.target?.value, item?.candidate_id, 'votes_rejected')
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="comments"
                                                    id="comments"
                                                    placeholder="Comments"
                                                    className="form-control"
                                                    value={item?.comments}
                                                    style={{ maxWidth: '150px', minWidth: "150px" }}
                                                    onChange={(e)=>{
                                                        updateData(e?.target?.value, item?.candidate_id, 'comments')
                                                    }}
                                                />
                                            </td>
                            
                                        </tr>
                                            // <VoteCasting
                                            //     key={index}
                                            //     num={index + 1}
                                            //     startCalculation={startGovCalculation}
                                            //     calculated={startVoteCastedCalculation}
                                            // // roles={roles}
                                            // // editGover={true}
                                            // />
                                        )
                                    ) 
                                    }
                                </tbody>
                            </TableWrapper> : 
                                        <div>Candidate Data Not Available</div>}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={Boolean(loading)}
                        >
                            {loading ? (
                                <>
                                    <span className="fa fa-spinner fa-spin"></span>
                                    <span>{"Loading..."}</span>
                                </>
                            ) : (
                                <span>{"Submit"}</span>
                            )}
                        </button>
                    </div>
                </div>
            </form> */}













        </div>)
}
const TableWrapper = styled.table`
padding-bottom: 100px;
overflow-x: scroll;
overflow-x: scroll;
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