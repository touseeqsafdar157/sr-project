import * as yup from "yup";

export const entitlementUploaderSchema = yup.object().shape({
  announcement_id: yup.object().nullable().required("Select Announcement"),
  company_code: yup.object().nullable().required("Select Company"),
  as_per_date: yup.string().required("Enter Date"),
  file: yup
    .mixed()
    .test("checkFile", "Upload CDC File", (value) => !!value.length)
    .test("fileType", "We Only accept Image type of CSV or TXT", (value) =>
      value.length !== 0
        ? value[0]?.type === "text/csv" || value[0]?.type === "text/plain"
        : true
    ),
});
