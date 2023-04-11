import React, { Fragment, useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Select from "react-select";
import { addShareCertificateSchema, editShareCertificateSchema } from "store/validations/shareCertificateValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import SplitShareCertificateItem from "../share/SplitShareCertificateItem";
import NumberFormat from "react-number-format";
import { toast } from "react-toastify";
import { sendIssuanceCertificate, updateIssuanceCertificate } from "store/services/shareCertificate.service";

export default function EditShareCertificateIssuance({ setViewEditPage, getCertificatesForSelectedCompany }) {
  const baseEmail = sessionStorage.getItem("email") || "";
  const [company_name, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false);
  const [distinctiveCounter, setDistinctiveCounter] = useState("");
  const [folio_options, setFolio_options] = useState([]);
  const [allotted_to, setAllotTo] = useState([]);
  const [type, setType] = useState([]);
  const [toValue, setToValue] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [totalSharesCount, setTotalSharesCount] = useState("0");
  // const [certificateObjects, setCertificateObjects] = useState([]);
  let shareCertificate = JSON.parse(sessionStorage.getItem("selectedCertificateEdit") || '');


  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm({
    defaultValues: editShareCertificateSchema(shareCertificate).cast(),
    resolver: yupResolver(editShareCertificateSchema(shareCertificate), {
      stripUnknown: true,
      abortEarly: false,
    }),
  });
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({ control, name: "output_certificates" });

  useEffect(() => {
    setCompanyName([shareCertificate.company_code]);
    setFolio_options(shareCertificate.shareholder_data)
  }, [])

  const appliedStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid red",
    }),
  };



  // ({ resolver: yupResolver(addShareCertificateSchema) });
  const handleUpdateShareholderCertificate = async (data) => {
    const updated_output_certificates =[
      { from: data.from, to: data.to, count: (data.to - data.from + 1).toString() }]
    setLoading(true);
    try {
      setLoading(true);
      const response = await updateIssuanceCertificate(
        baseEmail,
        data.type,
        data.issue_date,
        watch('company_code')?.value+'-'+data.certificate_no.toString(),
        updated_output_certificates,
        watch('allotted_to')?.value,
        watch('company_code')?.value,
      );
      if (response.status === 200) {
        setTimeout(() => {
          toast.success(response.data.message);
          getCertificatesForSelectedCompany()
          setViewEditPage(false);
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      if(error?.response?.data !== undefined){
        // toast.error(error?.response?.data)
      }else{
        toast.error("Certificate Not Upadate ")
      }
    }
    setLoading(false);
  }


  return (
    <Fragment>
      <form onSubmit={handleSubmit(handleUpdateShareholderCertificate)}>
        <div className="row">
          <div className="col-md-6">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Certificate Issuance Details</h5>
              </div>
              <div className="card-body">
                <div className="form-group mb-3">
                  <label>Company Code </label>
                  <Controller
                    name="company_code"
                    render={({ field }) => (
                      <Select
                        {...field}
                        isDisabled={true}
                        isLoading={company_name.length === 0}
                        options={company_name}
                        id="company_code"
                        placeholder="Select Company"
                        styles={errors.company_code && appliedStyles}
                        {...register("company_code")}
                      />
                    )}
                    control={control}
                  />
                  <small className="text-danger">
                    {errors.company_code?.message}
                  </small>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="allotted_to">Share Alloted To (Folio Number) </label>
                  <Controller
                    name="allotted_to"
                    render={({ field }) => (
                      <Select
                        {...field}
                        isLoading={folio_options.length === 0}
                        options={folio_options}
                        id="allotted_to"
                        placeholder="Select Folio Number"
                        // {...register("allotted_to")}
                      // styles={
                      //   errors.allotted_to ? errorStyles : disabledStyles
                      // }
                      />
                    )}
                    control={control}
                  />

                  <small className="text-danger">
                    {errors.allotted_to?.message}
                  </small>
                </div>
                <div className="form-group mb-3">
                  <label>Issue Date </label>
                  <input
                    type="date"
                    name="issue_date"
                    id="issue_date"
                    className={`form-control ${errors.issue_date && "border border-danger"
                      }`}
                    {...register("issue_date")}
                  // defaultValue={getvalidDateYMD(new Date())}
                  />
                  <small className="text-danger">
                    {errors.issue_date?.message}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card ">
              <div className="card-header b-t-success">
                <h5>Certificate Detail</h5>
              </div>
              <div className="card-body">
                <div className="form-group mb-3">
                  <label>Type </label>
                  <select
                  name="type"
                    className={`form-control ${errors.type && "border border-danger"
                      }`}
                      id="type"
                    {...register("type")}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">Select Type </option>
                    <option value="Ordinary">Ordinary </option>
                    <option value="Treasury Shares">Treasury Shares </option>
                    <option value="Preference Shares">Preference Shares</option>
                    <option value="Non-Voting Shares">Non-Voting Shares</option>
                    <option value="Redeemable Shares">Redeemable Shares</option>
                    <option value="Management Shares">Management Shares</option>
                  </select>
                  <small className="text-danger">{errors.type?.message}</small>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>Distinctive No. From </label>
                      <input
                        type="text"
                        name="from"
                        id="from"
                        className={`form-control ${errors.from && "border border-danger"
                          }`}
                        {...register("from")}
                        onChange={(e) => {
                          setValue(
                            `to`,
                            isNaN(
                              parseInt(watch(`count`)) +
                              parseInt(e.target.value)
                            )
                              ? "0"
                              : parseInt(
                                watch(`count`)
                              ) +
                              parseInt(e.target.value) -
                              1
                          );
                        }}

                      // defaultValue={getvalidDateYMD(new Date())}
                      />
                      <small className="text-danger">
                        {errors.from?.message}
                      </small>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className="form-group mb-3">
                      <label>Distinctive To </label>
                      <Controller
                        name="to"
                        render={({ field }) => (
                          <NumberFormat
                            {...field}
                            className={`form-control ${errors.to && "border border-danger"
                              }`}
                            id="to"
                            allowNegative={false}
                            placeholder="Enter Quantity"
                          />
                        )}
                        control={control}
                      />
                      <small className="text-danger">
                        {errors.to?.message}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className='col-md-6'>
                    <div className="form-group mb-3">
                      <label>Shares Count </label>
                      <Controller
                        name="count"
                        render={({ field }) => (
                          <NumberFormat
                            {...field}
                            className={`form-control ${errors.count && "border border-danger"
                              }`}
                            id="count"
                            allowNegative={false}
                            placeholder="Enter Quantity"
                          />
                        )}
                        control={control}
                      />
                      <small className="text-danger">
                        {errors.count?.message}
                      </small>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className="form-group mb-3">
                      <label>Certificate No.</label>
                      <Controller
                        name="certificate_no"
                        render={({ field }) => (
                          <NumberFormat
                            {...field}
                            className={`form-control ${errors.certificate_no && "border border-danger"
                              }`}
                            id="certificate_no"
                            allowNegative={false}
                            placeholder="Enter Certificate No."
                            readOnly
                          />
                        )}
                        control={control}
                      />
                      <small className="text-danger">
                        {errors.certificate_no?.message}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12  ml-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="fa fa-spinner fa-spin"></span>
                  <span>{"Loading..."}</span>
                </>
              ) : (
                <span>{"Update"}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
