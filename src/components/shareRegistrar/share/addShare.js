import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { addShare } from "../../../store/services/shareholder.service";
import { toast } from "react-toastify";
import { Quantity } from "../../../constant";
import LoadableButton from "../../common/loadables";
import Select from "react-select";
import { darkStyle } from "../../defaultStyles";
import { symbol_setter } from "../../../store/services/dropdown.service";

export default function AddShare() {
  const [offer_id, setOffer_id] = useState("");
  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState("");
  const [offer_volume, setOffer_volume] = useState("");
  const [offer_price, setOffer_price] = useState("");
  const [final_offer_price, setFinal_offer_price] = useState("");
  const [bb_percent, setBb_percent] = useState("");
  const [bb_from, setBb_from] = useState("");
  const [bb_to, setBb_to] = useState("");
  const [strike_price, setStrike_price] = useState("");
  const [bid_price, setBid_price] = useState("");
  const [bid_volume, setBid_volume] = useState("");
  const [ipo_percent, setIpo_percent] = useState("");
  const [ipo_from, setIpo_from] = useState("");
  const [ipo_to, setIpo_to] = useState("");
  const [subscribed_volume, setSubscribed_volume] = useState("");

  const [loading, setLoading] = useState(false);

  //options
  const [symbol_options, setSymbol_options] = useState([]);

  // errors

  const [symbolError, setSymbolError] = useState(false);
  const [quantityError, setQuantityError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [offer_volumeError, setOffer_volumeError] = useState(false);
  const [offer_priceError, setOffer_priceError] = useState(false);
  const [final_offer_priceError, setFinal_offer_priceError] = useState(false);
  const [bb_percentError, setBb_percentError] = useState(false);
  const [bb_fromError, setBb_fromError] = useState(false);
  const [bb_toError, setBb_toError] = useState(false);
  const [strike_priceError, setStrike_priceError] = useState(false);
  const [bid_volumeError, setBid_volumeError] = useState(false);
  const [ipo_percentError, setIpo_percentError] = useState(false);
  const [ipo_fromError, setIpo_fromError] = useState(false);
  const [ipo_toError, setIpo_toError] = useState(false);
  const [subscribed_volumeError, setSubscribedError] = useState(false);

  useEffect(async () => {
    //calling option setter
    try {
      setSymbol_options(await symbol_setter());
    } catch (err) {
      toast.error(`${err.response.data.message}`);
    }
  }, []);

  const handleAddShare = async () => {
    if (symbol == "") {
      setSymbolError(true);
    } else {
      setSymbolError(false);
    }
    if (type == "") {
      setTypeError(true);
    } else {
      setTypeError(false);
    }
    if (offer_volume == "") {
      setOffer_volumeError(true);
    } else {
      setOffer_volumeError(false);
    }
    if (offer_price == "") {
      setOffer_priceError(true);
    } else {
      setOffer_priceError(false);
    }

    if (final_offer_price == "") {
      setFinal_offer_priceError(true);
    } else {
      setFinal_offer_priceError(false);
    }
    if (bb_percent == "") {
      setBb_percentError(true);
    } else {
      setBb_percentError(false);
    }
    if (bb_from == "") {
      setBb_fromError(true);
    } else {
      setBb_fromError(false);
    }
    if (bb_to == "") {
      setBb_toError(true);
    } else {
      setBb_toError(false);
    }
    if (strike_price == "") {
      setStrike_priceError(true);
    } else {
      setStrike_priceError(false);
    }

    if (bid_volume == "") {
      setBid_volumeError(true);
    } else {
      setBid_volumeError(false);
    }
    if (ipo_percent == "") {
      setIpo_percentError(true);
    } else {
      setIpo_percentError(false);
    }
    if (ipo_from == "") {
      setIpo_fromError(true);
    } else {
      setIpo_fromError(false);
    }
    if (ipo_to == "") {
      setIpo_toError(true);
    } else {
      setIpo_toError(false);
    }
    if (subscribed_volume == "") {
      setSubscribedError(true);
    } else {
      setSubscribedError(false);
    }

    if (
      symbol !== "" &&
      type !== "" &&
      offer_volume !== "" &&
      offer_price !== "" &&
      final_offer_price !== "" &&
      bb_percent !== "" &&
      bb_from !== "" &&
      bb_to !== "" &&
      strike_price !== "" &&
      bid_price !== "" &&
      bid_volume !== "" &&
      ipo_percent !== "" &&
      ipo_from !== "" &&
      ipo_to !== "" &&
      subscribed_volume !== ""
    ) {
      const email = sessionStorage.getItem("email");
      try {
        setLoading(true);
        const response = await addShare(
          email,
          symbol,
          type,
          offer_volume,
          offer_price,
          final_offer_price,
          bb_percent,
          bb_from,
          bb_to,
          strike_price,
          bid_volume,
          ipo_percent,
          ipo_from,
          ipo_to,
          subscribed_volume
        );

        if (response.data.status == 200) {
          setLoading(false);
          toast.success(`${response.data.message}`);
          setSymbol("");
          setOffer_id("");
          setType("");
          setOffer_volume("");
          setOffer_price("");
          setFinal_offer_price("");
          setBb_percent("");
          setBb_from("");
          setBb_to("");
          setStrike_price("");
          setBid_volume("");
          setIpo_percent("");
          setIpo_from("");
          setIpo_to("");
          setSubscribed_volume("");
        } else {
          setLoading(false);
          toast.error(`${response.data.message}`);
        }
      } catch (error) {
        setLoading(false);
        toast.error(`${error.response.data.message}`);
      }
    }
  };
  const borderRadiusStyle = { borderRadius: 2 };
  return (
    <div>
      <Fragment>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 ">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Add Public Offering</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="email">Symbol</label>
                  <Select
                    options={symbol_options}
                    onChange={(selected) => {
                      setSymbol(selected.value);
                    }}
                    styles={darkStyle}
                  />
                  {symbolError && (
                    <p className="error-color">* Symbol is required</p>
                  )}
                </div>
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">Type</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="TEXT"
                    placeholder="Enter Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                  {typeError && (
                    <p className="error-color">* Offered Volume is required</p>
                  )}
                </div>
                {/* field ends */}
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">Offered Volume</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="TEXT"
                    placeholder="Enter Offered Volume"
                    value={offer_volume}
                    onChange={(e) => setOffer_volume(e.target.value)}
                  />
                  {offer_volumeError && (
                    <p className="error-color">* Offered Volume is required</p>
                  )}
                </div>
                {/* field ends */}
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">Offered Price</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="TEXT"
                    placeholder="Enter Offered Price"
                    value={offer_price}
                    onChange={(e) => setOffer_price(e.target.value)}
                  />
                  {offer_priceError && (
                    <p className="error-color">* Offered Price is required</p>
                  )}
                </div>
                {/* field ends */}
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">Final Offered Price</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="TEXT"
                    placeholder="Enter Final Offered Price"
                    value={final_offer_price}
                    onChange={(e) => setFinal_offer_price(e.target.value)}
                  />
                  {final_offer_priceError && (
                    <p className="error-color">
                      * Final Offered Price is required
                    </p>
                  )}
                </div>
                {/* field ends */}
              </div>
            </div>
          </div>
          {/* card starts */}
          <div className="col-sm-12 col-md-6 col-xl-4">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>Book Building</h5>
              </div>
              <div className="card-body">
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">Book Building Percent</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="TEXT"
                    placeholder="Enter Book Building Percent"
                    value={bb_percent}
                    onChange={(e) => setBb_percent(e.target.value)}
                  />
                  {bb_percentError && (
                    <p className="error-color">
                      * Book Building Percent is required
                    </p>
                  )}
                </div>
                {/* field ends */}
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">BB From</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="date"
                    placeholder="Enter BB From"
                    value={bb_from}
                    onChange={(e) => setBb_from(e.target.value)}
                  />
                  {bb_fromError && (
                    <p className="error-color">* BB From is required</p>
                  )}
                </div>
                {/* field ends */}
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">BB To</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="date"
                    placeholder="Enter BB To"
                    value={bb_to}
                    onChange={(e) => setBb_to(e.target.value)}
                  />
                  {bb_toError && (
                    <p className="error-color">* BB To is required</p>
                  )}
                </div>
                {/* field ends */}
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">Strike Price</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="TEXT"
                    placeholder="Enter Strike Price"
                    value={strike_price}
                    onChange={(e) => setStrike_price(e.target.value)}
                  />
                  {strike_priceError && (
                    <p className="error-color">* Strike Price is required</p>
                  )}
                </div>
                {/* field ends */}
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">Bid Volume</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="TEXT"
                    placeholder="Enter Bid Volume"
                    value={bid_volume}
                    onChange={(e) => setBid_volume(e.target.value)}
                  />
                  {bid_volumeError && (
                    <p className="error-color">* Bid Price is required</p>
                  )}
                </div>
                {/* field ends */}
              </div>
            </div>
          </div>
          {/* card ends */}

          {/* card starts */}
          <div className="col-sm-12 col-md-6 col-xl-4">
            <div className="card ">
              <div className="card-header b-t-primary">
                <h5>IPO</h5>
              </div>
              <div className="card-body">
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">IPO Percent</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="TEXT"
                    placeholder="Enter IPO Percent"
                    value={ipo_percent}
                    onChange={(e) => setIpo_percent(e.target.value)}
                  />
                  {ipo_percentError && (
                    <p className="error-color">* IPO Percent is required</p>
                  )}
                </div>
                {/* field ends */}
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">IPO From</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="date"
                    placeholder="Enter IPO From"
                    value={ipo_from}
                    onChange={(e) => setIpo_from(e.target.value)}
                  />
                  {ipo_fromError && (
                    <p className="error-color">* IPO From is required</p>
                  )}
                </div>
                {/* field ends */}
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">IPO To</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="date"
                    placeholder="Enter IPO To"
                    value={ipo_to}
                    onChange={(e) => setIpo_to(e.target.value)}
                  />
                  {ipo_toError && (
                    <p className="error-color">* IPO To is required</p>
                  )}
                </div>
                {/* field ends */}
                {/* fied starts */}
                <div className="form-group">
                  <label htmlFor="email">Subscribed Volume</label>
                  <input
                    className="form-control"
                    id="companyEmail"
                    type="TEXT"
                    placeholder="Enter Subscribed Volume"
                    value={subscribed_volume}
                    onChange={(e) => setSubscribed_volume(e.target.value)}
                  />
                  {subscribed_volumeError && (
                    <p className="error-color">
                      * Subscribed Volume is required
                    </p>
                  )}
                </div>
                {/* field ends */}
              </div>
            </div>
          </div>
          {/* card ends */}

          {/* row div ending below */}
        </div>

        <div className="row">
          <div className="col-md-12">
            <LoadableButton
              loading={loading}
              title="Submit"
              methodToExecute={handleAddShare}
            />
          </div>
        </div>
      </Fragment>
    </div>
  );
}
