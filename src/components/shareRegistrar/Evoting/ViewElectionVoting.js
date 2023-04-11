import React, {useState, useEffect} from 'react'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getCompanies } from 'store/services/company.service';
import { EditDirectorSchema } from 'store/validations/votingValidations';
import { getPaginatedEventData } from 'store/services/company.service';
import moment from 'moment';
import { updateBoardElection } from 'store/services/evoting.service';
import { getShareHoldersByCompany } from 'store/services/shareholder.service';
import { getAllAuthorization } from 'store/services/evoting.service';
import styled from 'styled-components';
import { EditElectionVotingSchema } from 'store/validations/votingValidations';
export const ViewElectionVoting = ({setEditDirectorVoting}) => {
    const selectedElectionData = JSON.parse(sessionStorage.getItem("selectedElection")) || "";
    const baseEmail = sessionStorage.getItem("email") || "";
    const [loading, setLoading] = useState(false)
    const [companies_dropdown, setCompanies_dropdown] = useState([]);
    const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const [defaultCompany, setDefaultCompany] = useState('');
    const [selectedCompany, setSelectedCompany] = useState("");
    const [defaultCode, setDefaultCompanyCode]=  useState('');
    const [selectedMeeting, setSelectedMeetingid ] = useState('')
    const [meetingDropDown, setMeetingDropdown] = useState([])
    const [defaultMeeting, setDefaultEvent] = useState('')
    const [defaultMeetingid, setDefaultMeetingId] = useState('')
    const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
    const [selectedshareHolder, setSelectedShareholder] = useState('');
    const [folioNumber, setFolioNumber] = useState('')
    const [authorizationOptions, setAuthorizationOptions] = useState([]) 
const [selectedAuthorizationId, setSelectedAuthorizationId] = useState('')
const [filterCandidate, setFilterCandidate] = useState(selectedElectionData?.vote_casting?JSON.parse(selectedElectionData?.vote_casting):[])
console.log('filterCandidate', filterCandidate)
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
        getValues,
        watch,
      } = useForm({
        defaultValues: EditElectionVotingSchema(selectedElectionData).cast(),
        resolver: yupResolver(EditElectionVotingSchema(selectedElectionData)),
      });

      const getAllAuthorizationData =async ()=>{
        try {
            const response = await getAllAuthorization(baseEmail);
            if (response.status === 200) {
                const parents = response.data.data;
                console.log('=====fdfdfdfdsfds', parents)
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
       console.log('fddsf', selectedElectionData)
    useEffect(() => {
        const getAllCompanies = async () => {
          setCompanies_data_loading(true);
          try {
            const response = await getCompanies(baseEmail);
            if (response.status === 200) {
              const parents = response.data.data;
              const findCompany =  parents?.find(item=> item?.code == selectedElectionData?.company_code)
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
        getAllCompanies();
        getAllAuthorizationData()
      }, []);
      const handleAlertRequirment = async(data)=>{}
      const getShareholderByCompany = async (code) => {
        try {
            //   setShareholderLoading(true);
            const response = await getShareHoldersByCompany(baseEmail, code);
            if (response.status == 200) {

              
                const options = response.data.data?.map((item) => {
                    const shareholder_id = item?.shareholder_id || item?.cnic_copy || item?.ntn;
                    let label = `${shareholder_id} - ${item?.shareholder_name}`;
                    return { label: label, value: shareholder_id, folio_number: item?.folio_number };
                })
                setshareholder_dropDown(options)
                // setShareholderData(response.data.data)
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
  return (
    <div>
          
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

                            <input
                           className={`form-control ${errors.company_code && "border border-danger"
                               }`}
                           name="company_code"
                           type="text"
                           value={defaultCompany}
                           placeholder='Enter Company'
                           {...register("company_code")}
                           readOnly
                       />

                            <small className="text-danger">
                                {errors.company_code?.message}
                            </small>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="election_id">Election Id</label>

                            <input
                                className={`form-control ${errors.election_id && "border border-danger"
                                    }`}
                                name="election_id"
                                type="text"
                                value={selectedElectionData?.election_id}
                                placeholder='Enter Election Id'
                                {...register("election_id")}
                                readOnly
                            />

                            <small className="text-danger">
                                {errors.election_id?.message}
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
                           readOnly
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
                  <input
                           className={`form-control ${errors.cast_type && "border border-danger"
                               }`}
                           name="cast_type"
                           type="text"
                           value={selectedElectionData?.cast_type}
                           placeholder='Enter Cast Type'
                           {...register("cast_type")}
                           readOnly
                       />
                
                  <small className="text-danger">
                    {errors.cast_type?.message}
                  </small>
                </div>
                <div className="form-group mt-3  ">
                  <label htmlFor="cast_through">Cast Through </label>
                  <input
                           className={`form-control ${errors.cast_through && "border border-danger"
                               }`}
                           name="cast_through"
                           type="text"
                           value={selectedElectionData?.cast_through}
                           placeholder='Enter Cast Through'
                           {...register("cast_through")}
                           readOnly
                       />
                  <small className="text-danger">
                    {errors.cast_through?.message}
                  </small>
                </div>
                <div className="form-group mt-3">
                            <label htmlFor="voter_id">Folio Number</label>

                            <input
                           className={`form-control ${errors.voter_id && "border border-danger"
                               }`}
                           name="voter_id"
                           type="text"
                           value={selectedElectionData?.folio_number|| selectedElectionData?.voter_id}
                           placeholder='Enter Folio Number'
                           {...register("voter_id")}
                           readOnly
                       />
                            <small className="text-danger">
                                {errors.voter_id?.message}
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
                            <input
                                name="authorzation_id"
                                className={`form-control ${errors.voter_id && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Authorized Id"
                                {...register("authorzation_id")}
                                readOnly
                                value={selectedElectionData?.authroization_id}
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
                        <div className="card-header b-t-success">
                            <b>Vote Casting</b>
                        </div>
                        <div className="card-body">
                            {filterCandidate?.length ?
                                <TableWrapper className="table table-responsive">
                                    <thead>
                                        <tr>
                                            <th className="text-nowrap">S No.</th>
                                            {/* <th className="text-nowrap"> Candidate ID</th> */}
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
                                                            readOnly
                                                           
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            name="votes_casted"
                                                            id="votes_casted"
                                                            placeholder="Votes Casted"
                                                            style={{ maxWidth: '150px', minWidth: "150px" }}
                                                            className="form-control"
                                                            value={item?.votes_casted}
                                                            // onKeyPress={(e) => {
                                                            //     e.preventDefault()
                                                            //     alert('Kindly Press Up Down Button Of Vote Casted Field For Input')
                                                            // }}
                                                            // min={0}
                                                            readOnly
                                                            // max={totalVotes}
                                                            
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
                                                            readOnly
                                                            value={item?.voting_percentage}
                                                            // value={`${(Number(item?.votes_accepted / totalVotes) * 100)?.toFixed(2)?.toString()}%`}
                                                            

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
                                                            readOnly
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
                                                           
                                                            readOnly
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
                                                           
                                                            readOnly
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
</form>   
          
          
          
          
            {/* <form onSubmit={handleSubmit(handleAlertRequirment)}>
                <div className="row b-t-primary" style={{ margin: '0px 8px', borderRadius: ' 10px' }}>
                <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="company_code">Company</label>

                            <input
                           className={`form-control ${errors.company_code && "border border-danger"
                               }`}
                           name="company_code"
                           type="text"
                           value={defaultCompany}
                           placeholder='Enter Company'
                           {...register("company_code")}
                           readOnly
                       />

                            <small className="text-danger">
                                {errors.company_code?.message}
                            </small>
                        </div>
                       
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="election_id">Election Id</label>

                            <input
                                className={`form-control ${errors.election_id && "border border-danger"
                                    }`}
                                name="election_id"
                                type="text"
                                value={selectedElectionData?.election_id}
                                placeholder='Enter Election Id'
                                {...register("election_id")}
                                readOnly
                            />

                            <small className="text-danger">
                                {errors.election_id?.message}
                            </small>
                        </div>
                    </div>
                <div className='col-md-4'>
                    <div className="form-group mt-3  ">
                  <label htmlFor="cast_type">Cast Type </label>
                  <input
                           className={`form-control ${errors.cast_type && "border border-danger"
                               }`}
                           name="cast_type"
                           type="text"
                           value={selectedElectionData?.cast_type}
                           placeholder='Enter Cast Type'
                           {...register("cast_type")}
                           readOnly
                       />
                
                  <small className="text-danger">
                    {errors.cast_type?.message}
                  </small>
                </div>
               

                    </div>
                    <div className='col-md-4'>
                    <div className="form-group mt-3  ">
                  <label htmlFor="cast_through">Cast Through </label>
                  <input
                           className={`form-control ${errors.cast_through && "border border-danger"
                               }`}
                           name="cast_through"
                           type="text"
                           value={selectedElectionData?.cast_through}
                           placeholder='Enter Cast Through'
                           {...register("cast_through")}
                           readOnly
                       />
                  <small className="text-danger">
                    {errors.cast_through?.message}
                  </small>
                </div>

                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="voter_id">Voter ID</label>

                            <input
                           className={`form-control ${errors.voter_id && "border border-danger"
                               }`}
                           name="voter_id"
                           type="text"
                           value={selectedElectionData?.voter_id}
                           placeholder='Enter Voter Id'
                           {...register("voter_id")}
                           readOnly
                       />
                            <small className="text-danger">
                                {errors.voter_id?.message}
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
                                readOnly
                                value={selectedElectionData?.folio_number}
                            />
                            <small className="text-danger">
                                {errors.folio_No?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="authorzation_id">Authorization ID</label>
                            <input
                                name="authorzation_id"
                                className={`form-control ${errors.voter_id && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Authorized Id"
                                {...register("authorzation_id")}
                                readOnly
                                value={selectedElectionData?.authroization_id}
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
                           readOnly
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
                        <div className="card-header b-t-success">
                            <b>Vote Casting</b>
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
                                                            readOnly
                                                           
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            name="votes_casted"
                                                            id="votes_casted"
                                                            placeholder="Votes Casted"
                                                            style={{ maxWidth: '150px', minWidth: "150px" }}
                                                            className="form-control"
                                                            value={item?.votes_casted}
                                                            // onKeyPress={(e) => {
                                                            //     e.preventDefault()
                                                            //     alert('Kindly Press Up Down Button Of Vote Casted Field For Input')
                                                            // }}
                                                            // min={0}
                                                            readOnly
                                                            // max={totalVotes}
                                                            
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
                                                            readOnly
                                                            value={item?.voting_percentage}
                                                            // value={`${(Number(item?.votes_accepted / totalVotes) * 100)?.toFixed(2)?.toString()}%`}
                                                            

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
                                                            readOnly
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
                                                           
                                                            readOnly
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
                                                           
                                                            readOnly
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


            </form> */}













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