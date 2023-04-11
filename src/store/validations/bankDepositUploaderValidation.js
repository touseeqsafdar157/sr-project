import * as yup from "yup";

export const bankDepositUploaderSchema = yup.object().shape({
  announcement_id: yup.object().nullable(),
  company_code: yup.object().nullable(),
  bank_deposit_date: yup.string().required("Enter Date"),
  file: yup
    .mixed()
    .test("checkFile", "Upload CDC File", (value) => !!value.length)
    .test(
      "fileType",
      "We Only accept file type of CSV, TXT, XLS, XLSX",
      (value) =>
        value.length !== 0
          ? value[0]?.type === "text/csv" ||
            value[0]?.type === "text/plain" ||
            value[0]?.type === "application/vnd.ms-excel" ||
            value[0]?.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : true
    ),
});
