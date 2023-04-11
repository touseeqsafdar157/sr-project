import * as yup from "yup";

export const addInvestorRequestSchema = yup.object().shape({
  // Investor Request Details
  request_date: yup.string().test("test-date", "Enter Date", (value) => {
    return value;
  }),
  folio_number: yup.object().required("Select Folio Number"),
  request_type: yup.object().required("Select Request Type"),
  announcement_id: yup.object().required("Select Announcement"),
  entitlement_id: yup.object().required("Select Entitlement"),
  company_code: yup.object().required("Select Company"),
  symbol: yup.object().required("Select Symbol"),
  quantity: yup.string().required("Enter Quantity"),
  price: yup.string().required("Enter Price"),
  // Amount Details
  amount: yup.string().required("Enter Amount"),
  amount_payable: yup.string().required("Enter Amount Payable"),
  amount_paid: yup.string().required("Enter Amount Paid"),
  // approved_date: yup.string().test("test-date", "Enter Date", (value) => {
  //   return value;
  // }),
  // status: yup.object().required("Select Status"),
  // closed_date: yup.string().test("test-date", "Enter Date", (value) => {
  //   return value;
  // }),
  to_folio_number: yup.object().required("Select Share Holding"),
  to_investor_id: yup.object().required("Select Investor"),
});

export const editInvestorRequestSchema = (investor) =>
  yup.object().shape({
    // Investor Request Details
    request_date: yup
      .string()
      .test("test-date", "Enter Date", (value) => {
        return value;
      })
      .default(investor.request_date),
    folio_number: yup
      .object()
      .required("Select Folio Number")
      .default(investor.folio_number),
    request_type: yup
      .object()
      .required("Select Request Type")
      .default(investor.request_type),
    announcement_id: yup
      .object()
      .required("Select Announcement")
      .default(investor.announcement_id),
    entitlement_id: yup
      .object()
      .required("Select Entitlement")
      .default(investor.entitlement_id),
    company_code: yup
      .object()
      .required("Select Company")
      .default(investor.company_code),
    symbol: yup.object().required("Select Symbol").default(investor.symbol),
    quantity: yup
      .string()
      .required("Enter Quantity")
      .default(investor.quantity),
    price: yup.string().required("Enter Price").default(investor.price),
    // Amount Details
    amount: yup.string().required("Enter Amount").default(investor.amount),
    amount_payable: yup
      .string()
      .required("Enter Amount Payable")
      .default(investor.amount_payable),
    amount_paid: yup
      .string()
      .required("Enter Amount Paid")
      .default(investor.amount_paid),
    // approved_date: yup.string().test("test-date", "Enter Date", (value) => {
    //   return value;
    // }).default(investor.approved_date),
    // status: yup.object().required("Select Status").default(investor.status),
    // closed_date: yup.string().test("test-date", "Enter Date", (value) => {
    //   return value;
    // }).default(investor.closed_date),
    to_folio_number: yup
      .object()
      .required("Select Share Holding")
      .default(investor.to_folio_number),
    to_investor_id: yup
      .object()
      .required("Select Investor")
      .default(investor.to_investor_id),
  });
