import React, { useState, useEffect } from 'react'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import { getAllEventData, getCompanies } from 'store/services/company.service';
import { EditDirectorSchema } from 'store/validations/votingValidations';
import { getPaginatedEventData } from 'store/services/company.service';
export const ViewDirectorVoting = ({companyLabel, setEditRequirment, getPaginatedRequirment }) => {
    const dirctor = JSON.parse(sessionStorage.getItem("selectedDirector")) || "";
    const baseEmail = sessionStorage.getItem("email") || "";
    const [loading, setLoading] = useState(false)
    const [companies_data_loading, setCompanies_data_loading] = useState(false);
    const [defaultCompany, setDefaultCompany] = useState('');
    const [defaultMeetingid, setDefaultEvent] = useState('')
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
        getValues,
        watch,
    } = useForm({
        defaultValues: EditDirectorSchema(dirctor).cast(),
        resolver: yupResolver(EditDirectorSchema(dirctor)),
    });
    const getPaginatedEvent = async (pagenum) => {
        try {
            const response = await getAllEventData(
                baseEmail,

            );
            if (response.status === 200) {
                const findEvent = response.data.data?.find(item => item?.statutory_event_id == dirctor?.meeting_id)
                let findLabel = `${findEvent?.statutory_event_id} - ${findEvent?.title}`;
                setDefaultEvent(findLabel);

            }
        } catch (error) {
        }
    };


    useEffect(() => {
        const getAllCompanies = async () => {
            setCompanies_data_loading(true);
            try {
                const response = await getCompanies(baseEmail);
                if (response.status === 200) {
                    const parents = response.data.data;
                    const findCompany = parents?.find(item => item?.code == dirctor?.company_code)
                    let findLabel = `${findCompany?.code} - ${findCompany?.company_name}`;
                    setDefaultCompany(findLabel);
                    const companies_dropdowns = response.data.data.map((item) => {
                        let label = `${item.code} - ${item.company_name}`;
                        return { label: label, value: item.code };
                    });
                    setCompanies_data_loading(false);
                }
            } catch (error) {
                setCompanies_data_loading(false);
            }
        };
        getAllCompanies();
        getPaginatedEvent(1)
    }, []);
    const handleAlertRequirment = async (data) => { }

    const appliedStyles = {
        control: (base, state) => ({
            ...base,
            border: "1px solid red",
        }),
    };
    return (
        <div>
            <form onSubmit={handleSubmit(handleAlertRequirment)}>
                <div className="row b-t-primary" style={{ margin: '0px 8px', borderRadius: ' 10px' }}>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="company_code">Company</label>

                            <input
                                name="company_code"
                                className={`form-control ${errors.company_code && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Company"
                                value={companyLabel}
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
                            <label htmlFor="symbol">Symbol</label>

                            <input
                                name="symbol"
                                className={`form-control ${errors.symbol && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Symbol"
                                {...register("symbol")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.symbol?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="term">Term</label>
                            <input
                                name="term"
                                className={`form-control ${errors.term && "border border-danger"
                                    }`}
                                type="text"
                                placeholder="Enter Title"
                                {...register("term")}
                                readOnly
                            />

                            <small className="text-danger">
                                {errors.term?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="effct_date">Effect From</label>

                            <input
                                className={`form-control ${errors.effct_date && "border border-danger"
                                    }`}
                                name="effct_date"
                                type="date"
                                {...register("effct_date")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.effct_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="last_date">Last Date </label>

                            <input
                                className={`form-control ${errors.last_date && "border border-danger"
                                    }`}
                                name="last_date"
                                type="date"
                                {...register("last_date")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.last_date?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="agm_date">AGM  Date </label>

                            <input
                                className={`form-control ${errors.agm_date && "border border-danger"
                                    }`}
                                name="agm_date"
                                type="date"
                                {...register("agm_date")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.agm_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="app_form_date">Application From </label>

                            <input
                                className={`form-control ${errors.app_form_date && "border border-danger"
                                    }`}
                                name="app_form_date"
                                type="date"
                                {...register("app_form_date")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.app_form_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="app_to_date">Application to  </label>

                            <input
                                className={`form-control ${errors.app_to_date && "border border-danger"
                                    }`}
                                name="app_to_date"
                                type="date"
                                {...register("app_to_date")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.app_to_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="authorzation_from">Authorization From  </label>

                            <input
                                className={`form-control ${errors.authorzation_from && "border border-danger"
                                    }`}
                                name="authorzation_from"
                                type="date"
                                {...register("authorzation_from")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.authorzation_from?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="authorzation_to">Authorization to  </label>

                            <input
                                className={`form-control ${errors.authorzation_to && "border border-danger"
                                    }`}
                                name="authorzation_to"
                                type="date"
                                {...register("authorzation_to")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.authorzation_to?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="election_from">Election From  </label>

                            <input
                                className={`form-control ${errors.election_from && "border border-danger"
                                    }`}
                                name="election_from"
                                type="datetime-local"
                                {...register("election_from")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.election_from?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="election_to">Election To  </label>

                            <input
                                className={`form-control ${errors.election_to && "border border-danger"
                                    }`}
                                name="election_to"
                                type="datetime-local"
                                {...register("election_to")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.election_to?.message}
                            </small>
                        </div>
                    </div>


                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="no_director">Number of Directors   </label>


                            <Controller
                                name="no_director"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.no_director && "border border-danger"
                                            }`}
                                        id="no_director"
                                        allowNegative={false}
                                        placeholder="Enter Number"
                                        readOnly
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.no_director?.message}
                            </small>
                        </div>
                    </div>


                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="no_candidate">Number of Candidates   </label>


                            <Controller
                                name="no_candidate"
                                render={({ field }) => (
                                    <NumberFormat
                                        {...field}
                                        className={`form-control ${errors.no_candidate && "border border-danger"
                                            }`}
                                        id="no_candidate"
                                        allowNegative={false}
                                        placeholder="Enter Number "
                                        readOnly
                                    />
                                )}
                                control={control}
                            />

                            <small className="text-danger">
                                {errors.no_candidate?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="meeting_id">Meeting ID</label>
                            <input
                                name="meeting_id"
                                id="meeting_id"
                                className={`form-control ${errors.meeting_id && "border border-danger"
                                    }`}
                                value={dirctor?.meeting_id}
                                readOnly
                            />


                            <small className="text-danger">
                                {errors.meeting_id?.message}
                            </small>
                        </div>
                    </div>

                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="pol_date">Pol Date  </label>

                            <input
                                className={`form-control ${errors.pol_date && "border border-danger"
                                    }`}
                                name="pol_date"
                                type="date"
                                {...register("pol_date")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.pol_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="postal_last_date">Postal Ballot Last Date  </label>

                            <input
                                className={`form-control ${errors.postal_last_date && "border border-danger"
                                    }`}
                                name="postal_last_date"
                                type="date"
                                {...register("postal_last_date")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.postal_last_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="form-group mt-3">
                            <label htmlFor="expire_date">Is Expire  </label>

                            <input
                                className={`form-control ${errors.expire_date && "border border-danger"
                                    }`}
                                name="expire_date"
                                type="date"
                                {...register("expire_date")}
                                readOnly
                            />
                            <small className="text-danger">
                                {errors.expire_date?.message}
                            </small>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group mt-3  ">
                            <label htmlFor="election_result">Election Result</label>
                            <input
                                className={`form-control ${errors.election_result && "border border-danger"
                                    }`}
                                name="election_result"
                                type="text"
                                {...register("election_result")}
                                readOnly
                            />

                            <small className="text-danger">
                                {errors.election_result?.message}
                            </small>
                        </div>
                    </div>




                </div>




            </form>













        </div>)
}
