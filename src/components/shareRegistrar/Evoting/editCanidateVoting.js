import React, { useState, useEffect } from 'react'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getCompanies } from 'store/services/company.service';
import { EditCanidateSchema } from 'store/validations/votingValidations';
import { getShareHoldersByCompany } from 'store/services/shareholder.service';
import { errorStyles } from 'components/defaultStyles';
import { getAllElections } from 'store/services/evoting.service';
import moment from 'moment';
import { updateCanidateVoting } from 'store/services/evoting.service';
export const EditCanidateVoting = ({companyLabel, setEditDirectorVoting, getCanidatePaginatedData }) => {
    const canidatevoting = JSON.parse(sessionStorage.getItem("selectedCanidate")) || "";
    const baseEmail = sessionStorage.getItem("email") || "";
    const [loading, setLoading] = useState(false)
    const [companies_dropdown, setCompanies_dropdown] = useState([]);
    const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const [defaultCompany, setDefaultCompany] = useState('');
    const [defaultCode, setDefaultCompanyCode] = useState('');
    const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
    const [sharehoerData, setShareholderData] = useState('')
    const [electionIDValue, setElectionIdValue] = useState(null)
    const [allCompanies, setAllCompanies] = useState(null)
    const [companyValue, setCompanyValue] = useState('')
    const [shareholderName, setShareholderName] = useState('')
    const [shareHolderLabel, setSelectedShareholderLabel] = useState('')
    const [elctionid, setElectionId] = useState('');
    const [term, setTerm] = useState(canidatevoting?.term || '')
    const [defaultelectionId, setDefaultElectinId] = useState('')
    

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,

    } = useForm({
        defaultValues: EditCanidateSchema(canidatevoting).cast(),
        resolver: yupResolver(EditCanidateSchema(canidatevoting)),
    });
    const getAllElection = async () => {
        try {
            const response = await getAllElections(baseEmail);
            if (response.status === 200) {
                const options = response.data.data.map((item) => {
                    let label = `${item.election_id} - ${item.symbol}`;
                    return { label: label, value: item.election_id, companyCode: item?.company_code };
                });
                const findId = options?.find((item) => item?.election_id == canidatevoting?.election_id)
                setElectionId(findId?.value)
                const findElection = response.data.data.find((item) => item?.election_id == canidatevoting?.election_id)
                let label = `${findElection?.election_id} - ${findElection?.symbol}`;
                setElectionIdValue(label);
                setDefaultElectinId(findElection?.election_id)
                const findCompany = allCompanies?.find((item) => item?.code == canidatevoting?.company_code)
                let companyLabel = `${findCompany?.code} - ${findCompany?.company_name}`;
                setCompanyValue(companyLabel)
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        const getAllCompanies = async () => {
            setCompanies_data_loading(true);
            try {
                const response = await getCompanies(baseEmail);
                if (response.status === 200) {
                    const parents = response.data.data;
                    const findCompany = parents?.find(item => item?.code == canidatevoting?.company_code)
                    let findLabel = `${findCompany?.code} - ${findCompany?.company_name}`;
                    setDefaultCompanyCode(findCompany?.code)
                    setDefaultCompany(findLabel);
                    const companies_dropdowns = response.data.data.map((item) => {
                        let label = `${item.code} - ${item.company_name}`;
                        return { label: label, value: item.code };
                    });
                    setCompanies_dropdown(companies_dropdowns);
                    setAllCompanies(parents)
                    setCompanies_data_loading(false);
                }
            } catch (error) {
                setCompanies_data_loading(false);
            }
        };
        getAllCompanies();
        getAllElection()
    }, []);
    const handleCanidateVoting = async (data) => {
        const date = new Date();
        const createdAt = moment(date)?.format('YYYY-MM-DD')
       
        try {
            setLoading(true);
            const response = await updateCanidateVoting(
                baseEmail,
                canidatevoting?.candidate_id,
                // elctionid || defaultelectionId,
                canidatevoting?.election_id,
                canidatevoting?.company_code,
                canidatevoting?.symbol,
                canidatevoting?.folio_number,
                shareholderName,
                term,
                data?.eligible,
                data?.revoked,
                data?.revoked_date,
                data?.comment,
                data?.no_votes,
                data?.position,
                data?.elected,
                createdAt
            );

            if (response.data.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                    window.location.reload();

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

                    const shareholder_id = item?.shareholder_id || item?.cnic_copy || item?.ntn;
                    let label = `${shareholder_id} - ${item?.shareholder_name}`;
                    return { label: label, value: shareholder_id, folio_number: item?.folio_number, name: item?.shareholder_name };
                })



                const findId = options?.find((item) => item?.folio_number == canidatevoting?.folio_number)

                setshareholder_dropDown(findId)
                setShareholderName(findId?.name);
                setSelectedShareholderLabel(findId?.label)
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

        getShareholderByCompany(canidatevoting?.company_code)

    }, [])
    const appliedStyles = {
        control: (base, state) => ({
            ...base,
            border: "1px solid red",
        }),
    };








    return (
        <div>
            <form onSubmit={handleSubmit(handleCanidateVoting)}>
                <div className="row b-t-primary" style={{ margin: '0px 8px', borderRadius: ' 10px' }}>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="election_id">Election ID</label>

                            <input
                                name="election_id"
                                className={`form-control ${errors.election_id && "border border-danger"
                                    }`}
                                type="text"
                                value={canidatevoting?.election_id}
                                readOnly
                                placeholder="Enter election_id"
                                {...register("election_id")}
                            />


                            <small className="text-danger">
                                {errors.election_id?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="company_code">Company</label>
                            <input
                                name="company_code"
                                className={`form-control ${errors.company_code && "border border-danger"
                                    }`}
                                type="text"
                                value={companyLabel}
                                readOnly
                                placeholder="Enter Company Code"
                                {...register("company_code")}
                            />


                            <small className="text-danger">
                                {errors.company_code?.message}
                            </small>
                        </div>
                    </div>



                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="symbol">Symbol</label>
{console.log('canidatevoting', canidatevoting)}
                            <input
                                name="symbol"
                                className={`form-control ${errors.symbol && "border border-danger"
                                    }`}
                                type="text"
                                readOnly
                                value={canidatevoting?.symbol || ''}
                                placeholder="Enter Symbol"
                                {...register("symbol")}
                            />
                            <small className="text-danger">
                                {errors.symbol?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="canidate_id"> Canidate ID</label>
                            <input
                                name="canidate_id"
                                className={`form-control ${errors.canidate_id && "border border-danger"
                                    }`}
                                type="text"
                                value={canidatevoting?.folio_number + '_' + canidatevoting?.candidate_name}
                                placeholder="Enter Canidate Id"
                                {...register("canidate_id")}
                                readOnly
                            />

                            <small className="text-danger">
                                {errors.canidate_id?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="folio_no"> Folio Number</label>

                            <input
                                name="folio_no"
                                className={`form-control ${errors.folio_no && "border border-danger"
                                    }`}
                                type="text"
                                value={canidatevoting?.folio_number}
                                placeholder="Enter folio_no"
                                {...register("folio_no")}
                                disabled={true}
                            />
                            <small className="text-danger">
                                {errors.folio_no?.message}
                            </small>
                        </div>
                    </div>










                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="canidate_name">Candidate Name</label>

                            <input
                                name="canidate_name"
                                className={`form-control ${errors.canidate_name && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter canidate Name"
                                value={canidatevoting?.candidate_name}
                                {...register("canidate_name")}
                                disabled={true}
                            />
                            <small className="text-danger">
                                {errors.canidate_name?.message}
                            </small>
                        </div>
                    </div>


                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="term"> Term</label>

                            <input
                                name="term"
                                className={`form-control ${errors.term && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter term"
                                value={canidatevoting?.term}
                                {...register("term")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.term?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3  ">
                            <label htmlFor="eligible">Eligible</label>
                            <select
                                name="eligible"
                                className={`form-control ${errors.eligible && "border border-danger"
                                    }`}
                                {...register("eligible")}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                            <small className="text-danger">
                                {errors.eligible?.message}
                            </small>
                        </div>

                    </div>



                    <div className='col-md-4'>
                        <div className="form-group mt-3  ">
                            <label htmlFor="revoked">Revoked</label>
                            <select
                                name="revoked"
                                className={`form-control ${errors.revoked && "border border-danger"
                                    }`}
                                {...register("revoked")}
                                
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                            <small className="text-danger">
                                {errors.revoked?.message}
                            </small>
                        </div>

                    </div>












                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="revoked_date">Revoked Date</label>

                            <input
                                className={`form-control ${errors.revoked_date && "border border-danger"
                                    }`}
                                name="revoked_date"
                                type="date"
                                {...register("revoked_date")}
                            />
                            <small className="text-danger">
                                {errors.revoked_date?.message}
                            </small>
                        </div>
                    </div>



                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="comment"> Revoked Comment</label>

                            <input
                                name="comment"
                                className={`form-control ${errors.comment && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Comment"
                                {...register("comment")}
                            />
                            <small className="text-danger">
                                {errors.comment?.message}
                            </small>
                        </div>
                    </div>


                    {/* <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="no_votes">Number of Votes   </label>


                            <Controller
                                name="no_votes"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.no_votes && "border border-danger"
                                            }`}
                                        id="no_votes"
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.no_votes?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="position">Position   </label>


                            <Controller
                                name="position"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${positionError && "border border-danger"
                                            }`}
                                        id="position"
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {positionError ? 'Enter Number' : ''}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3  ">
                            <label htmlFor="elected">Elected</label>
                            <select
                                name="elected"
                                className={`form-control ${errors.elected && "border border-danger"
                                    }`}
                                {...register("elected")}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                            <small className="text-danger">
                                {errors.elected?.message}
                            </small>
                        </div>

                    </div> */}







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













        </div>)
}
