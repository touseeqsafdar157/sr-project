import * as yup from "yup";

export const addIPOAnnouncementSchema = yup.object().shape({
  offer_date: yup.string().required("Enter Offer Date"),
  company_code: yup.object().nullable().required("Select Company"),
  offer_type: yup.object().nullable().required("Select IP Type"),
  offer_volume: yup.string().required("Enter Offer Volume"),
  face_value: yup.string().required("Enter Face Value"),
  offer_price: yup.string().required("Enter Offer Price"),
  final_offer_price: yup.string().required("Enter Findal Offer Price"),

  // Book Building
  book_building: yup.boolean(),
  book_building_percent: yup.string().when("book_building", {
    is: true,
    then: yup.string().required("Enter Percent"),
    otherwise: yup.string(),
  }),
  book_building_shares: yup.string().when("book_building", {
    is: true,
    then: yup.string().required("Enter Book Building Shares"),
    otherwise: yup.string(),
  }),
  book_building_from: yup.string().when("book_building", {
    is: true,
    then: yup.string().required("Enter Book Building From"),
    otherwise: yup.string(),
  }),
  book_building_to: yup.string().when("book_building", {
    is: true,
    then: yup.string().required("Enter Book Building To"),
    otherwise: yup.string(),
  }),
  strike_price: yup.string().when("book_building", {
    is: true,
    then: yup.string().required("Enter Strike Price"),
    otherwise: yup.string(),
  }),
  bid_volume: yup.string().when("book_building", {
    is: true,
    then: yup.string().required("Enter Bid Volume"),
    otherwise: yup.string(),
  }),
  book_building_credit_date: yup.string().when("book_building", {
    is: (val) => val > 0,
    then: yup.string().required("Enter Bonus Percent"),
    otherwise: yup.string(),
  }),
  //IPO
  ipo_percent: yup.string().required("Enter Percent"),
  ipo_shares: yup.string().required("Enter IPO Shares"),
  ipo_from: yup.string().required("Enter IPO From Date"),
  ipo_to: yup.string().required("Enter IPO To Date"),
  ipo_credit_date: yup.string().required("Enter IPO Credit Date"),
  ipo_sub_volume: yup.string().required("Enter IPO subscribed vliume"),
});
