import * as yup from "yup";

export const addIPOSubscriptionSchema = yup.object().shape({
  company_code: yup.object().nullable().required("Select Company"),
  offer_id: yup.object().nullable().required("Select IPO"),
  folio_number: yup.object().nullable().required("Select Folio"),
  subscription_through: yup
    .object()
    .nullable()
    .required("Select Subscription Through"),
  shares_subscribed: yup.string().required("Enter Shares Subsribed"),
  shares_alloted: yup.string().required("Enter Shares Alloted"),
  amount_payable: yup.string().required(),
});
