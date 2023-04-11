import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import CountUp from "react-countup";
import { Home, CreditCard, Users, FilePlus } from "react-feather";
// import { calcultionOptions, calcultionData } from "../../../data/default";
import { useSelector } from "react-redux";
import { getvalidDateDMMMY } from "../../../utilities/utilityFunctions";
import Spinner from "components/common/spinner";
import { getCompanies } from "store/services/company.service"
import { getInvestors, getInvestorsCount } from "store/services/investor.service"
import { getShareholders, getShareholdersCount } from "store/services/shareholder.service"
import { getTransactions, getTransactionsCounter } from "store/services/transaction.service"
import { getDisburse, getDisburseCount } from "store/services/disburse.service"
import { getCorporateAnnouncement, getCorporateAnnouncementDashboard, getCorporateAnnouncementDividend } from "store/services/corporate.service"
import ReactEcharts from 'echarts-for-react';
import { getRegisteredCompany } from "store/services/dashboard.service";
import Select from "react-select";
import { toast } from "react-toastify";

const Default = () => {
  const baseEmail = sessionStorage.getItem("email") || "";
  const [allCompanies, setAllCompanies] = useState([]);
  const [allInvestors, setAllInvestors] = useState([]);
  const [allShareholders, setAllShareholders] = useState([]);
  const [allTransaction, setAllTransaction] = useState([]);
  const [allDisburse, setAllDisburse] = useState([]);
  // const [allAnnouncement, setAllAnnouncement] = useState([]);
  const [dividendAnnouncement, setDividendAnnouncement] = useState([]);
  const [bonusAnnouncement, setBonusAnnouncement] = useState([]);
  const [rightAnnouncement, setRightAnnouncement] = useState([]);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [isLoadingInvestor, setIsLoadingInvestor] = useState(false);
  const [isLoadingShareholder, setIsLoadingShareholder] = useState(false);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [isLoadingDisburse, setIsLoadingDisburse] = useState(false);
  const [isLoadingAnnouncement, setIsLoadingAnnouncement] = useState(false);
  const [allyears, setAllyears] = useState([]);
  const [allRegisteredCompanies, setAllRegisteredCompanies] = useState([]);
  const [companiesRegiteredByYear, setCompaniesRegiteredByYear] = useState([]);
  const [selectYear, setSelectYear] = useState([]);
  const [year, setYear] = useState('');
  const [isLoadingYear, setIsLoadingYear] = useState(false);
  let [showCompaniesByYear, setShowCompaniesByYear] = useState([]);
  // const [isLoadingDividend, setIsLoadingDividend] = useState(false);

  useEffect(() => {
    const getAllCompanies = async () => {
      setIsLoadingCompany(true);
      try {
        const response = await getCompanies(baseEmail)
        if (response.status === 200) {
          const parents = response.data.data
          setAllCompanies(parents)
          setIsLoadingCompany(false)
        }
      } catch (error) {
        setIsLoadingCompany(false);
      }
    };
    const getAllRegisteredCompany = async () => {
      setIsLoadingYear(true);
      let minOffset = 0, maxOffset = 30;
      let thisYear = (new Date()).getFullYear();
      let allyears = [];
      for (let x = 0; x <= maxOffset; x++) {
        let y = { label: thisYear - x, value: thisYear - x }
        allyears.push(y);
      }
      setSelectYear(allyears)
      setIsLoadingCompany(true);
      try {
        const response = await getRegisteredCompany(baseEmail)
        if (response.status === 200) {
          const parents = response.data.data;
          let all_years = [...new Set(response.data.data.map(x => new Date(x.created_at).getFullYear()))];
          all_years.filter((elem) => {
            let count = 0;
            response.data.data.filter((item) => {
              if (elem === new Date(item.created_at).getFullYear()) {
                count += 1;
              }
            })
            companiesRegiteredByYear.push(count);
          })
          setAllyears(all_years);
          setAllRegisteredCompanies(parents)
        }
      } catch (error) {
        setIsLoadingYear(false)
      }
      setIsLoadingYear(false)
    };
    const getAllInvestors = async () => {
      setIsLoadingInvestor(true);
      try {
        const response = await getInvestorsCount(baseEmail)
        if (response.status === 200) {
          const parents = response.data.count
          setAllInvestors(parents)
          setIsLoadingInvestor(false)
        }
      } catch (error) {
        setIsLoadingInvestor(false);
      }
    };
    const getAllShareHolders = async () => {
      setIsLoadingShareholder(true);
      try {
        const response = await getShareholdersCount(baseEmail)
        if (response.status === 200) {
          const parents = response.data.count
          setAllShareholders(parents)
          setIsLoadingShareholder(false)
        }
      } catch (error) {
        setIsLoadingShareholder(false);
      }
    };
    const getAllTransactions = async () => {
      setIsLoadingTransaction(true);
      try {
        const response = await getTransactionsCounter(baseEmail)
        if (response.status === 200) {
          const parents = response.data.count
          setAllTransaction(parents)
          setIsLoadingTransaction(false)
        }
      } catch (error) {
        setIsLoadingTransaction(false);
      }
    };
    const getAllDisbursement = async () => {
      setIsLoadingDisburse(true);
      try {
        const response = await getDisburseCount(baseEmail)
        if (response.status === 200) {
          const parents = response.data.count
          setAllDisburse(parents)
          setIsLoadingDisburse(false)
        }
      } catch (error) {
        setIsLoadingDisburse(false);
      }
    };
    const getAllCorporateAnnouncement = async () => {
      setIsLoadingAnnouncement(true);
      try {
        const response = await getCorporateAnnouncementDashboard(baseEmail)
        
        if (response.data.status === 200) {
          
          let dividend = [];
          let bonus = [];
          let right = [];
          dividend= response.data?.dividend;
          bonus = response.data?.bonus;
          right = response.data?.right
          // const parents = response.data.data
          // setAllAnnouncement(parents)
          setDividendAnnouncement(dividend || [])
          setBonusAnnouncement(bonus || [])
          setRightAnnouncement(right || [])

          setIsLoadingAnnouncement(false)
        }if(response.data.status===404){
          setIsLoadingAnnouncement(false)
        }
      } catch (error) {
        console.log('error=>',error)
        setIsLoadingAnnouncement(false);
      }
    };
    getAllCorporateAnnouncement();
    getAllRegisteredCompany();
    // getAllCorporateAnnouncementDividend();
    getAllDisbursement();
    getAllTransactions();
    getAllShareHolders();
    getAllInvestors();
    getAllCompanies();
  }, [])

  useEffect(() => {
    const getCompaniesByYears = () => {
      let comp = [];
      allRegisteredCompanies.filter((item) => {
        let y = new Date(item.created_at).getFullYear();
        console.log('reg', y)
        if (y === year) {
          comp.push({ company_name: item.company_name, company_code: item.symbol, reqistered_year: y })
        } else if (year === '') {
          comp.push({ company_name: item.company_name, company_code: item.symbol, reqistered_year: y })
        }
      })
      setShowCompaniesByYear(comp);
    }

    getCompaniesByYears()
  }, [allRegisteredCompanies, JSON.stringify(year)])

  let options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: allyears
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '2%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: allyears // allyears ['JAN', 'FEB', 'MARCH', 'APRIL', 'MAY', 'JUN', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'COMPANIES',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: companiesRegiteredByYear
      },
    ]
  };



  return (
    <Fragment>
      <Breadcrumb parent="Dashboard" title="Shares E-Registry" />
      <div className="container-fluid">
        {/* Test */}
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="media feather-main">
                  <div className="feather-icon-block">
                    <Home />
                  </div>
                  <div className="media-body align-self-center">
                    <h6>Companies</h6>
                    {isLoadingCompany == false && (
                      <CountUp end={allCompanies.length} />
                    )}
                    {
                      isLoadingCompany == true && <p>Loading...</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="media feather-main">
                  <div className="feather-icon-block">
                    <Users />
                  </div>
                  <div className="media-body align-self-center">
                    <h6>Investors</h6>
                    {isLoadingInvestor == false && (
                      <CountUp end={allInvestors} />
                    )}
                    {isLoadingInvestor == true && <p>Loading...</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="media feather-main">
                  <div className="feather-icon-block">
                    <Users />
                  </div>
                  <div className="media-body align-self-center">
                    <h6>Share Holders</h6>
                    {isLoadingShareholder == false &&
                      (
                        <CountUp end={allShareholders} />
                      )}
                    {isLoadingShareholder == true && <p>Loading...</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card cicle">
              <div className="card-body">
                <div className="media feather-main">
                  <div className="feather-icon-block">
                    <CreditCard />
                  </div>
                  <div className="media-body align-self-center">
                    <h6>Transactions</h6>
                    {isLoadingTransaction == false && (
                      <CountUp
                        end={allTransaction}
                      />
                    )}
                    {isLoadingTransaction == true && <p>Loading...</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="media feather-main">
                  <div className="feather-icon-block">
                    <FilePlus />
                  </div>
                  <div className="media-body align-self-center">
                    <h6>Dividend Disbursement</h6>
                    {isLoadingDisburse == false && (
                      <CountUp end={allDisburse} />
                    )}
                    {isLoadingDisburse == true && <p>Loading...</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-4 xl-50">
            <div className="card height-equal">
              <div className="card-header">
                <h5>Cash Dividend</h5>
              </div>
              <div className="card-body">
                <div className="notifiaction-media">
                  {isLoadingAnnouncement == true && (
                    <Spinner />
                  )}
                  {isLoadingAnnouncement == false &&
                    dividendAnnouncement.length !== 0 &&
                    allCompanies.length !== 0 &&
                    (dividendAnnouncement && dividendAnnouncement)
                      .map((ann, i) => {
                        const day = getvalidDateDMMMY(ann.created_at).split(
                          "-"
                        )[0];
                        const month = getvalidDateDMMMY(ann.created_at).split(
                          "-"
                        )[1];
                        const company = allCompanies.find(
                          (comp) => comp.code == ann.company_code
                        );
                        return (
                          <div className="media mb-08" key={i}>
                            <div className="media-body">
                              <h6 className="d-flex justify-content-between align-items-center pl-0">
                                <span className="d-flex align-items-center">
                                  <span className="f-20 text-center">
                                    <span> {day} </span>
                                    <small>
                                      <span className="text-muted font-size-70">
                                        {month}
                                      </span>
                                    </small>
                                  </span>
                                  <span className="d-inline-block ml-3">
                                    <span className="d-inline-block">
                                      {company != undefined ? company.company_name : ''}
                                    </span>
                                    <small>
                                      <span className="text-muted font-size-70">
                                        {company != undefined ? company.symbol : ''}
                                      </span>
                                    </small>
                                  </span>
                                </span>
                                <span className="pull-right font-primary f-18">
                                  {ann.dividend_percent}%
                                </span>
                              </h6>
                            </div>
                          </div>
                        );
                      })}
                  {isLoadingAnnouncement === false &&
                    dividendAnnouncement.length === 0 && (
                      <p className="text-center">
                        <b>Announcement Data not Available</b>
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 xl-50">
            <div className="card height-equal">
              <div className="card-header">
                <h5>Bonus Shares</h5>
              </div>
              <div className="card-body">
                <div className="notifiaction-media">
                  {isLoadingAnnouncement === true && (
                    <Spinner />
                  )}
                  {isLoadingAnnouncement === false &&
                    bonusAnnouncement.length !== 0 &&
                    allCompanies.length !== 0 &&
                    bonusAnnouncement
                      .map((ann, i) => {
                        const day = getvalidDateDMMMY(ann.created_at).split(
                          "-"
                        )[0];
                        const month = getvalidDateDMMMY(ann.created_at).split(
                          "-"
                        )[1];
                        const company = allCompanies.find(
                          (comp) => comp.code === ann.company_code
                        ) == undefined ? {} : allCompanies.find(
                          (comp) => comp.code === ann.company_code
                        );
                        return (
                          <div className="media mb-08" key={i}>
                            <div className="media-body">
                              <h6 className="d-flex justify-content-between align-items-center pl-0">
                                <span className="d-flex align-items-center">
                                  <span className="f-20 text-center">
                                    <span> {day} </span>
                                    <small>
                                      <span className="text-muted font-size-70">
                                        {month}
                                      </span>
                                    </small>
                                  </span>
                                  <span className="d-inline-block ml-3">
                                    <span className="d-inline-block">
                                      {company.company_name}
                                    </span>
                                    <small>
                                      <span className="text-muted font-size-70">
                                        {company.symbol}
                                      </span>
                                    </small>
                                  </span>
                                </span>
                                <span className="pull-right font-primary f-18">
                                  {ann.bonus_percent}%
                                </span>
                              </h6>
                            </div>
                          </div>
                        );
                      })}
                  {isLoadingAnnouncement === false &&
                    bonusAnnouncement.length === 0 && (
                      <p className="text-center">
                        <b>Announcement Data not Available</b>
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 xl-50">
            <div className="card height-equal">
              <div className="card-header">
                <h5>Right Shares</h5>
              </div>
              <div className="card-body">
                <div className="notifiaction-media">
                  {isLoadingAnnouncement === true && (
                    <Spinner />
                  )}
                  {isLoadingAnnouncement === false &&
                    rightAnnouncement.length !== 0 &&
                    allCompanies.length !== 0 &&
                    rightAnnouncement
                      .map((ann, i) => {
                        const day = getvalidDateDMMMY(ann.created_at).split(
                          "-"
                        )[0];
                        const month = getvalidDateDMMMY(ann.created_at).split(
                          "-"
                        )[1];
                        const company = allCompanies.find(
                          (comp) => comp.code === ann.company_code
                        ) == undefined ? {} : allCompanies.find(
                          (comp) => comp.code === ann.company_code
                        );
                        return (
                          <div className="media mb-08" key={i}>
                            <div className="media-body">
                              <h6 className="d-flex justify-content-between align-items-center pl-0">
                                <span className="d-flex align-items-center">
                                  <span className="f-20 text-center">
                                    <span> {day} </span>
                                    <small>
                                      <span className="text-muted font-size-70">
                                        {month}
                                      </span>
                                    </small>
                                  </span>
                                  <span className="d-inline-block ml-3">
                                    <span className="d-inline-block">
                                      {company.company_name}
                                    </span>
                                    <small>
                                      <span className="text-muted font-size-70">
                                        {company.symbol}
                                      </span>
                                    </small>
                                  </span>
                                </span>
                                <span className="pull-right font-primary f-18">
                                  {ann.right_percent}%
                                </span>
                              </h6>
                            </div>
                          </div>
                        );
                      })}
                  {isLoadingAnnouncement === false &&
                    rightAnnouncement.length === 0 && (
                      <p className="text-center">
                        <b>Announcement Data not Available</b>
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-4 xl-50">
            <div className="card height-equal">
              <div className="card-header">
                <h5>TOTAL REGISTERED COMPANY</h5>
              </div>
              <div className="card-body">
                <div className="notifiaction-media">
                  {isLoadingYear === true && (
                    <Spinner />
                  )}
                  {isLoadingYear === false && (<ReactEcharts style={{ width: '100%', height: '300px' }} option={options} />)}


                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 xl-50">
            <div className="card height-equal" style={{ minHeight: '371px', maxHeight: '371px', overflowY: 'scroll', overflowX: "hidden" }}>
              <div className="card-header">
                <h5>REGISTERED COMPANY BY YEAR</h5>
              </div>
              <div className="card-body">
                <div className="notifiaction-media">
                  <div className="form-group">
                  {showCompaniesByYear.length===0&& (
                    <Spinner />
                  )}
                    {showCompaniesByYear.length && (
                      <>
                        <div className="d-flex w-100">
                          <label htmlFor="searchTransaction" className="pt-2 pr-3">Select Year</label>
                          <Select
                            options={selectYear}
                            isLoading={isLoadingYear === true}
                            onChange={(selected) => {
                              if (selected.value) {
                                setYear(selected.value)
                              } else {
                                setYear("")
                              }
                            }}
                            isClearable={true}
                          />
                        </div>
                        {showCompaniesByYear.map((item) => {
                          return (
                            <span className="d-flex align-items-center">
                              <span className="f-20 text-center">
                                <small>
                                  <span className='text-muted font-size-90'> {item.reqistered_year} </span>
                                </small>
                              </span>
                              <span className="d-inline-block ml-3">
                                <span className="d-inline-block">
                                  {item?.company_name || ''}
                                </span>
                                <span className="text-muted font-size-70">
                                  {' (' + item?.company_code + ')' || ' ()'}
                                </span>
                              </span>
                            </span>
                          )
                        })}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment >
  );
};

export default Default;
