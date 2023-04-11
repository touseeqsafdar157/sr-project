import React, { useState, useEffect } from 'react'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getCompanies } from 'store/services/company.service';
import { EditDirectorSchema } from 'store/validations/votingValidations';
import { getPaginatedEventData } from 'store/services/company.service';
import moment from 'moment';
import { getAllCandidateData, updateBoardElection, UpdateElectionVoting } from 'store/services/evoting.service';
import { getShareHoldersByCompany } from 'store/services/shareholder.service';
import { getAllAuthorization } from 'store/services/evoting.service';
import styled from 'styled-components';
import { EditElectionVotingSchema } from 'store/validations/votingValidations';
import { getAllElections } from 'store/services/evoting.service';
import Spinner from "components/common/spinner";
export const EditElectionVoting = ({ allCompanies, companyCode, companyLabel, setEditDirectorVoting }) => {
    const selectedElectionData = JSON.parse(sessionStorage.getItem("selectedElection")) || "";
    const baseEmail = sessionStorage.getItem("email") || "";
    const [loading, setLoading] = useState(false)
    const [companies_dropdown, setCompanies_dropdown] = useState([]);
    const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const [defaultCompany, setDefaultCompany] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(selectedElectionData?.company_code||"");
    const [defaultCode, setDefaultCompanyCode] = useState('');
    const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
    const [selectedshareHolder, setSelectedShareholder] = useState(selectedElectionData?.voter_id||'');
    const [folioNumber, setFolioNumber] = useState(selectedElectionData?.folio_number)
    const [authorizationOptions, setAuthorizationOptions] = useState([])
    const [selectedAuthorizationId, setSelectedAuthorizationId] = useState('')
    const [filterCandidate, setFilterCandidate] = useState(selectedElectionData?.vote_casting ? JSON.parse(selectedElectionData?.vote_casting):[])
    const [totalVotes, setTotalVotes] = useState(null);
    const [ElectionIdDropdown, setElectionsDropDown] = useState([{label: selectedElectionData?.election_id, value:selectedElectionData?.election_id }])
    const [selectedElection, setSelectedElection] = useState(selectedElectionData?.election_id||'')
    const [allElection, setAllElection] = useState([])
    const [allCandidate, setAllCanidate] = useState([])
    const [selectedDirector, setSelectedDirector] = useState(0)
    const [castAbleVote, setCastAbleVote] = useState(Number(selectedElectionData?.castable_votes)||0)
    const [votableShare, setVotableShare] = useState(Number(selectedElectionData?.votable_shares)||0)
    const [defaultCompanyLabel, setDefaultCompanyLabel] = useState(allCompanies?.find((item)=>item?.value==selectedElectionData?.company_code))
    const [defaultElectionId, setDefaultElectionLabel] = useState({label: selectedElectionData?.election_id, value:selectedElectionData?.election_id })
    const [defaultVoterId, setDefaultVoterId] = useState({label: selectedElectionData?.voter_id, value:selectedElectionData?.voter_id })
    const [companyError, setCommpanyError] = useState(false)
    const [electionError, setElectionError] = useState(false)
    const [loadingListing, setLoadingListing]= useState(false)
    const [voterError, setVoterError]= useState(false)
    const [defaultvalueElectionId, setDefaultValueofElection] = useState(selectedElectionData?.election_id||'')
    const [defaultvalueofVoterId, setDefaultValueOfVoterId] = useState( selectedElectionData?.voter_id || '')
        const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
        getValues,
        resetField,
        watch,
    } = useForm({
        defaultValues: EditElectionVotingSchema(selectedElectionData).cast(),
        resolver: yupResolver(EditElectionVotingSchema(selectedElectionData)),
    });
    const updateData = (e, id, key) => {
        const newArrToSum = [...filterCandidate];
        const newArr = [...filterCandidate];
        const index = newArrToSum?.findIndex(item => item?.candidate_id == id);
        const findObj = newArrToSum?.find(item => item?.candidate_id == id);
        const sum = newArrToSum?.reduce((a, b) => a + b.votes_casted, 0);
        if (index !== -1) {
          if (key == 'votes_casted') {
            const checkVal = (sum-findObj?.votes_casted)+e;
            if (checkVal <= castAbleVote) {
              newArr[index][key] = e;
              newArr[index]['voting_percentage'] =`${(Number(newArr[index].votes_casted/castAbleVote)*100)?.toFixed(2)?.toString()}%`
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
    const getAllCandidate = async () => {
        try {
            const response = await getAllCandidateData(baseEmail);
            if (response.status === 200) {
                const parents = response.data.data;
                setAllCanidate(parents)
let sum=0
const filterArray = []
const parseCandidate=JSON.parse(selectedElectionData?.vote_casting)
 const data =parseCandidate?.map((item)=>{
  const findCandidate=  parents?.find((z)=>z?.candidate_id==item?.candidate_id)
  
  if(findCandidate){
    filterArray.push(findCandidate)
    const noOfShare = findCandidate?.number_of_votes;
    const NumberOfShare = Number(noOfShare) ?  Number(noOfShare) : 0;
    sum=sum+NumberOfShare;
  }

})
setTotalVotes(sum * filterArray?.length)
            }
        } catch (error) {
        }
    }
    const getAllElection = async () => {
        try {
            const response = await getAllElections(baseEmail);
            if (response.status === 200) {
                const parents = response.data.data;
                const options = response.data.data.map((item) => {
                    let label = `${item.election_id} - ${item.symbol}`;
                    return { label: label, value: item.election_id, companyCode: item?.company_code, noOfDirector: item?.number_of_directors };
                });
                setAllElection(options);
                // setCompanies_data_loading(false);
            }
        } catch (error) {
            // setCompanies_data_loading(false);
        }
    }

    const getAllAuthorizationData = async () => {
        try {
            const response = await getAllAuthorization(baseEmail);
            if (response.status === 200) {
                const parents = response.data.data;
                const options = response.data.data.map((item) => {
                    let label = `${item.auth_id} - ${item.authorized_name}`;
                    return { label: label, value: item.auth_id };
                });
                setAuthorizationOptions(options);
                // setCompanies_data_loading(false);
            }
        } catch (error) {
            // setCompanies_data_loading(false);
        }
    }
    useEffect(() => {
        const getAllCompanies = async () => {
            setCompanies_data_loading(true);
            try {
                const response = await getCompanies(baseEmail);
                if (response.status === 200) {
                    const parents = response.data.data;
                    const findCompany = parents?.find(item => item?.code == selectedElectionData?.company_code)
                    let findLabel = `${findCompany?.code} - ${findCompany?.company_name}`;
                    setDefaultCompanyCode(findCompany?.code)
                    setDefaultCompany(findLabel);
                    const companies_dropdowns = response.data.data.map((item) => {
                        let label = `${item.code} - ${item.company_name}`;
                        return { label: label, value: item.code };
                    });
                    setCompanies_dropdown(companies_dropdowns);
                    setCompanies_data_loading(false);
                }
            } catch (error) {
                setCompanies_data_loading(false);
            }
        };

setLoadingListing(true)

        getAllCandidate();
        getAllElection();
        getAllCompanies();
        getAllAuthorizationData()
        setTimeout(() => {
            setLoadingListing(false) 
        }, 3000);
        
    }, []);
    const handleAlertRequirment = async (data) => {
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
            //  alert('Your Remaining Vote Is Less Then CastAble Vote It Should Be Equal To CastAble Vote')
             return;
         }
        const votesCast= filterCandidate?.map((item)=>{
            return{
                candidate_id: item?.candidate_id,
                candidate_name: item?.candidate_name,
                votes_casted: item?.votes_casted,
                votes_accepted: item?.votes_accepted,
                votes_rejected: item?.votes_rejected,
                comments: item?.comments,
                voting_percentage: item?.voting_percentage,  
            }
        })
    
    try {
      setLoading(true);
      // let response;
      const response = await UpdateElectionVoting(
        baseEmail,
        selectedElectionData?.voting_id,
        selectedCompany ||defaultCode || '',
        selectedElection||selectedElectionData?.election_id||'',
        data?.cast_type||'',
        data?.cast_through||'',
        // data?.attachment,
        selectedshareHolder||selectedElectionData?.voter_id||'',
        folioNumber,
        selectedAuthorizationId||selectedElectionData?.authroization_id||'',
        votableShare?.toString()||'',
       castAbleVote?.toString()||'',
        data?.remarks||'',
        votesCast,
          );

      if (response.data.status === 200) {
          setTimeout(() => {
              setLoading(false);
              window.location.reload();
              // getPaginatedRequirment("1")
              // getAllCompanies();
              toast.success(`${response.data.message}`);
              setEditDirectorVoting(false);
          }, 2000);
      } else {
          setLoading(false);
          toast.error(`${response.data.message}`);
      }
  } catch (error) {
      setLoading(false);
      !!error?.response?.data?.message
          ? toast.error(error?.response?.data?.message)
          : toast.error("Event Not Added");
  }
    }
    const getShareholderByCompany = async (code) => {
        try {
            const response = await getShareHoldersByCompany(baseEmail, code);
            if (response.status == 200) {


                const options = response.data.data?.map((item) => {
                    const electronicShare =  Number(item?.electronic_shares) ? Number(item?.electronic_shares) : 0
                    const physicalShares =  Number(item?.physical_shares) ? Number(item?.physical_shares) : 0
                    const shareholder_id = item?.shareholder_id || item?.cnic_copy || item?.ntn;
                    let label = `${item?.folio_number} - ${item?.shareholder_name}`;
                    return { label: label, value: shareholder_id, folio_number: item?.folio_number, votableShare: (electronicShare+physicalShares) };
                })
                setshareholder_dropDown(options)
            }
        } catch (error) {
            if (error.response != undefined) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    }

    const appliedStyles = {
        control: (base, state) => ({
            ...base,
            border: "1px solid red",
        }),
    };


    useEffect(() => {
        if (selectedCompany) {
            const filterElection = allElection?.filter((item) => item?.companyCode == selectedCompany);
            setElectionsDropDown(filterElection)
            getShareholderByCompany(selectedCompany)
        }

    }, [selectedCompany])
    useEffect(() => {
        if (selectedElection) {

            const formatedData = allCandidate?.filter(i => i?.election_id == selectedElection);
            let sum = 0
            const votes = formatedData?.map((item) => {
                const NumberofShare = Number(item?.number_of_votes) ? Number(item?.number_of_votes) : 0
                sum = NumberofShare + sum;
            })
            setTotalVotes(sum * formatedData?.length)
            const newList = formatedData?.map(item => {
                return {
                    ...item,
                    votes_casted: '',
                    votes_accepted: '',
                    votes_rejected: '',
                    comments: '',
                    voting_percentage: '',
                }
            })
            if(newList?.length){
            setFilterCandidate(newList)
        }
        }

    }, [selectedElection])
    useEffect(()=>{
        if(selectedDirector&&votableShare){
            const newArray =filterCandidate?.map((item)=>{
                return{
                    ...item,
                    votes_casted: '',
                }
                
              })
              setFilterCandidate(newArray)
            setCastAbleVote(selectedDirector*votableShare)
      
        }
        // const sum = filterCandidate?.reduce((a, b) => a + b.votes_casted, 0);
        // if(votableShare!=sum){
        // const newArray =filterCandidate?.map((item)=>{
        //     return{
        //         ...item,
        //         votes_casted: '',
        //     }
            
        //   })
        //   setFilterCandidate(newArray)
        // }
    },[selectedDirector, votableShare])
    const sumOfFilterCandidate = ()=>{
        if(filterCandidate?.length && Array.isArray(filterCandidate)){
        const sum = filterCandidate?.reduce((a, b) => a + b.votes_casted, 0);
        return castAbleVote-sum;
    }
    }
    return (
        <div>
              {loadingListing === true ? <Spinner />:
<>
<form onSubmit={handleSubmit(handleAlertRequirment)}>
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
                                        defaultValue={defaultCompanyLabel}
                                        onChange={(selected) => {
                                            if (selected?.value) {setSelectedCompany(selected?.value);
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
                                                setshareholder_dropDown([])
                                                setDefaultVoterId('')
                                                setDefaultElectionLabel('')
                                                setDefaultValueofElection(null)
                                                setDefaultValueOfVoterId(null)
                                            
                                            }
                                            else {setSelectedCompany("");
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
                                                setshareholder_dropDown([])
                                                setDefaultVoterId('')
                                                setDefaultElectionLabel('')
                                                setDefaultValueofElection(null)
                                                setDefaultValueOfVoterId(null)
                                        }
                                        }}
                                        isClearable={true}
                                        styles={companyError&& appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {companyError? 'Enter Company': ''}
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
                                        id="election_id"
                                        placeholder={defaultvalueElectionId||'Enter Election ID'}
                                        defaultValue={{label: selectedElectionData?.election_id, value:selectedElectionData?.election_id }}
                                        value={ElectionIdDropdown?.filter(
                                            (option) => option.value === selectedElection
                                          )}
                                        onChange={(selected) => {
                                            if (selected?.value){ setSelectedElection(selected?.value);
                                                setSelectedDirector(Number(selected?.noOfDirector) ?Number(selected?.noOfDirector) : 0 )
                                                setVotableShare(0)
                                                setCastAbleVote(0)
                                            }
                                            else {setSelectedElection("");
                                            setSelectedDirector(0)
                                            setVotableShare(0)
                                                setCastAbleVote(0)
                                        }
                                        }}
                                        isClearable={true}
                                        styles={electionError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {electionError ? 'Enter Election':''}
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
                                        id="voter_id"
                                        placeholder={defaultvalueofVoterId|| 'Enter Folio Number'}
                                        defaultValue={defaultVoterId}
                                        value={shareholder_dropDown?.filter(
                                            (option) => option.value === selectedshareHolder
                                          )}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                // setFilterCandidate([])
                                                setSelectedShareholder(selected.value)
                                                setFolioNumber(selected.folio_number)
                                                setVotableShare(selected?.votableShare)
                                               
                                            }
                                            else {
                                                // setFilterCandidate([])
                                                setCastAbleVote(0)
                                                setSelectedShareholder('')
                                                setFolioNumber('')
                                                setVotableShare('')
                                            }
                                        }}
                                        isClearable={true}
                                        styles={voterError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />
                            <small className="text-danger">
                                {voterError? 'Enter Folio Number':''}
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
                                        allowNegative={false}
                                        value={castAbleVote}
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
                            <label htmlFor="authorzation_id">Proxy/Authorization ID</label>

                            <Controller
                                name="authorzation_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={authorizationOptions}
                                        isLoading={!authorizationOptions?.length}
                                        id="authorzation_id"
                                        placeholder={selectedElectionData?.authroization_id||'Enter Authorzation ID'}
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
                        <div className="card-body">
                        { Array.isArray(filterCandidate)&& filterCandidate?.length ?
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
                                        {filterCandidate?.map(
                                            (item, key) => (
                                                <tr key={key}>
                                                    <td scope="col">
                                                        <b>{key + 1}</b>
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
                                                            onChange={(e) => {
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
                                                    value={item?.votes_casted>0? item?.votes_casted : ''}
                                                    // onKeyPress={(e)=>{
                                                    //     e.preventDefault()
                                                    //     alert('Kindly up down button of vote casted field')
                                                    //     }}
                                                    // min={0}
                                                    // max={totalVotes}
                                                    onChange={(e)=>{
                                                        if(!e.target.value.length) updateData(Number(0), item?.candidate_id, 'votes_casted')
                                                        if(e.target.value.match(/^\d+$/))  updateData(Number(e?.target?.value), item?.candidate_id, 'votes_casted')
                                                    
                                                        else  toast.error('Kindly Enter Only Digit');
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
                                                            // value={`${(Number(item?.votes_accepted / totalVotes) * 100)?.toFixed(2)?.toString()}%`}
                                                            // onChange={(e)=>{
                                                            //     updateData(e, item?.candidate_id, 'voting_percentage')
                                                            // }}
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
                                                            onChange={(e) => {
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
                                                            style={{ maxWidth: '150px', minWidth: "150px" }}
                                                            onChange={(e) => {
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
                                                            onChange={(e) => {
                                                                updateData(e?.target?.value, item?.candidate_id, 'comments')
                                                            }}
                                                            
                                                        />
                                                    </td>

                                                </tr>

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
     
     
     
     
     
     
     {/* <form onSubmit={handleSubmit(handleAlertRequirment)}>
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
                                        defaultValue={defaultCompanyLabel}
                                        onChange={(selected) => {
                                            if (selected?.value) {setSelectedCompany(selected?.value);
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
                                                setshareholder_dropDown([])
                                                setDefaultVoterId('')
                                                setDefaultElectionLabel('')
                                                setDefaultValueofElection(null)
                                                setDefaultValueOfVoterId(null)
                                            
                                            }
                                            else {setSelectedCompany("");
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
                                                setshareholder_dropDown([])
                                                setDefaultVoterId('')
                                                setDefaultElectionLabel('')
                                                setDefaultValueofElection(null)
                                                setDefaultValueOfVoterId(null)
                                        }
                                        }}
                                        isClearable={true}
                                        styles={companyError&& appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {companyError? 'Enter Company': ''}
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
                                        id="election_id"
                                        placeholder={defaultvalueElectionId||'Enter Election ID'}
                                        defaultValue={{label: selectedElectionData?.election_id, value:selectedElectionData?.election_id }}
                                        value={ElectionIdDropdown?.filter(
                                            (option) => option.value === selectedElection
                                          )}
                                        onChange={(selected) => {
                                            if (selected?.value){ setSelectedElection(selected?.value);
                                                setSelectedDirector(Number(selected?.noOfDirector) ?Number(selected?.noOfDirector) : 0 )
                                                setVotableShare(0)
                                                setCastAbleVote(0)
                                            }
                                            else {setSelectedElection("");
                                            setSelectedDirector(0)
                                            setVotableShare(0)
                                                setCastAbleVote(0)
                                        }
                                        }}
                                        isClearable={true}
                                        styles={electionError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {electionError ? 'Enter Election':''}
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
                            <label htmlFor="voter_id">Voter ID</label>
                           
                            <Controller
                                name="voter_id"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={shareholder_dropDown}
                                        isLoading={!shareholder_dropDown?.length}
                                        id="voter_id"
                                        placeholder={defaultvalueofVoterId|| 'Enter Voter ID'}
                                        defaultValue={defaultVoterId}
                                        value={shareholder_dropDown?.filter(
                                            (option) => option.value === selectedshareHolder
                                          )}
                                        onChange={(selected) => {
                                            if (selected?.value) {
                                                // setFilterCandidate([])
                                                setSelectedShareholder(selected.value)
                                                setFolioNumber(selected.folio_number)
                                                setVotableShare(selected?.votableShare)
                                               
                                            }
                                            else {
                                                // setFilterCandidate([])
                                                setCastAbleVote(0)
                                                setSelectedShareholder('')
                                                setFolioNumber('')
                                                setVotableShare('')
                                            }
                                        }}
                                        isClearable={true}
                                        styles={voterError && appliedStyles}
                                    />
                                )}
                                control={control}
                            />
                            <small className="text-danger">
                                {voterError? 'Enter Voter Id':''}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="folio_No">Folio Number</label>

                            <input
                                name="folio_No"
                                className={`form-control ${errors.voter_id && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Folio Number"
                                {...register("folio_No")}
                                value={folioNumber}
                            />
                            <small className="text-danger">
                                {errors.folio_No?.message}
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
                                        placeholder={selectedElectionData?.authroization_id||'Enter Authorzation ID'}
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
                                        allowNegative={false}
                                        value={castAbleVote}
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
                        <div className="card-body">
                        { Array.isArray(filterCandidate)&& filterCandidate?.length ?
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
                                        {filterCandidate?.map(
                                            (item, key) => (
                                                <tr key={key}>
                                                    <td scope="col">
                                                        <b>{key + 1}</b>
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
                                                            onChange={(e) => {
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
                                                    value={item?.votes_casted>0? item?.votes_casted : ''}
                                                    // onKeyPress={(e)=>{
                                                    //     e.preventDefault()
                                                    //     alert('Kindly up down button of vote casted field')
                                                    //     }}
                                                    // min={0}
                                                    // max={totalVotes}
                                                    onChange={(e)=>{
                                                        if(!e.target.value.length) updateData(Number(0), item?.candidate_id, 'votes_casted')
                                                        if(e.target.value.match(/^\d+$/))  updateData(Number(e?.target?.value), item?.candidate_id, 'votes_casted')
                                                    
                                                        else  toast.error('Kindly Enter Only Digit');
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
                                                            // value={`${(Number(item?.votes_accepted / totalVotes) * 100)?.toFixed(2)?.toString()}%`}
                                                            // onChange={(e)=>{
                                                            //     updateData(e, item?.candidate_id, 'voting_percentage')
                                                            // }}
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
                                                            onChange={(e) => {
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
                                                            style={{ maxWidth: '150px', minWidth: "150px" }}
                                                            onChange={(e) => {
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
                                                            onChange={(e) => {
                                                                updateData(e?.target?.value, item?.candidate_id, 'comments')
                                                            }}
                                                            
                                                        />
                                                    </td>

                                                </tr>

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
</>

                            }










        </div>
    )
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