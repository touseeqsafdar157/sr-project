import React, { useState, useEffect } from 'react'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NumberFormat from "react-number-format";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { getCompanies } from 'store/services/company.service';
import { EditCanidateSchema } from 'store/validations/votingValidations';
import { getShareHoldersByCompany } from 'store/services/shareholder.service';
import { getAllElections } from 'store/services/evoting.service';
export const ViewCanidateVoting = ({companyLabel, setEditRequirment, getPaginatedRequirment }) => {
  const canidatevoting = JSON.parse(sessionStorage.getItem("selectedCanidate")) || "";
  const baseEmail = sessionStorage.getItem("email") || "";
  const [loading, setLoading] = useState(false)
  const [companies_dropdown, setCompanies_dropdown] = useState([]);
  const [companies_data_loading, setCompanies_data_loading] = useState(false);
  const [defaultCompany, setDefaultCompany] = useState('');
  const [selectedCompany, setSelectedCompany] = useState("");
  const [defaultCode, setDefaultCompanyCode] = useState('');
  const [shareholder_dropDown, setshareholder_dropDown] = useState([]);
  const [sharehoerData, setShareholderData] = useState('')
  const [electionIDValue, setElectionIdValue] = useState(null)
  const [shareholderName, setShareholderName] = useState('')
  const [shareHolderLabel, setSelectedShareholderLabel] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    getValues,
    watch,
  } = useForm({
    defaultValues: EditCanidateSchema(canidatevoting).cast(),
    resolver: yupResolver(EditCanidateSchema(canidatevoting)),
  });
  const getAllElection = async () => {
    try {
      const response = await getAllElections(baseEmail);
      if (response.status === 200) {
        const parents = response.data.data;

        const findElection = response.data.data.find((item) => item?.election_id == canidatevoting?.election_id)
        let label = `${findElection?.election_id} - ${findElection?.symbol}`;
        setElectionIdValue(label);

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

  }
  const getShareholderByCompany = async (code) => {
    try {
      const response = await getShareHoldersByCompany(baseEmail, code);
      if (response.status == 200) {


        const options = response.data.data?.map((item) => {
          const shareholder_id = item?.shareholder_id || item?.cnic_copy || item?.ntn;
          let label = `${shareholder_id} - ${item?.shareholder_name}`;
          return { label: label, value: shareholder_id };
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
    if (defaultCode) getShareholderByCompany(defaultCode)

  }, [defaultCode, selectedCompany])
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
                className={`form-control ${errors.term && "border border-danger"
                  }`}
                type="text"
                value={canidatevoting?.candidate_id}
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
                readOnly
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
                readOnly
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
              <input
                name="eligible"
                className={`form-control ${errors.eligible && "border border-danger"
                  }`}
                type="text"

                {...register("eligible")}
                readOnly
              />

              <small className="text-danger">
                {errors.eligible?.message}
              </small>
            </div>

          </div>



          <div className='col-md-4'>
            <div className="form-group mt-3  ">
              <label htmlFor="revoked">Revoked</label>
              <input
                className={`form-control ${errors.revoked && "border border-danger"
                  }`}
                name="revoked"
                type="text"
                {...register("revoked")}
                readOnly
              />



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
                readOnly
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
                readOnly
              />
              <small className="text-danger">
                {errors.comment?.message}
              </small>
            </div>
          </div>


          <div className='col-md-4'>
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
                    readOnly
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
                    className={`form-control ${errors.position && "border border-danger"
                      }`}
                    id="position"
                    allowNegative={false}
                    placeholder="Enter Number"
                    readOnly
                  />
                )}
                control={control}
              />

              <small className="text-danger">
                {errors.position?.message}
              </small>
            </div>
          </div>

          <div className='col-md-4'>
            <div className="form-group mt-3  ">
              <label htmlFor="elected">Elected</label>
              <input
                name="elected"
                className={`form-control ${errors.elected && "border border-danger"
                  }`}
                type="text"
                placeholder="Enter Elected"
                {...register("elected")}
                readOnly
              />

              <small className="text-danger">
                {errors.elected?.message}
              </small>
            </div>

          </div>





        </div>


      </form>













    </div>)
}
