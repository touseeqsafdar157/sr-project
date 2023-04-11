import * as yup from "yup";

export const castVoteValidation = yup.object().shape({
  investor_id: yup.object().nullable().required("Select Investor"),
});
