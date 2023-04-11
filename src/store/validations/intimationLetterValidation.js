import * as yup from "yup";

export const intimationLetterSchema = yup.object().shape({
  announcement_id: yup.object().nullable().required("Select Announcement"),
  company_code: yup.object().nullable().required("Select Company"),
});
