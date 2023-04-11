import * as yup from "yup";

export const addIpoPaymentValidation = yup.object().shape({
  subscription_id: yup.object().nullable().required("Selet Subscription ID"),
  amount_paid: yup.string().required("Enter Amount"),
  instrument_type: yup.object().nullable().required("Select Instrument Type"),
  instrument_number: yup.string().required("Enter Instrument Number"),
  bank: yup.string().required("Enter Bank Name"),
  branch: yup.string().required("Enter Branch"),
  payment_evidence: yup
    .mixed()
    .test(
      "len",
      "Please Provide Evidence",
      (value) => value && value.length > 0
    )
    .test("fileSize", "Image Size Should be less than 1MB", (value) => {
      return value.length !== 0 ? value[0]?.size <= 1000000 : true;
    })
    .test("fileType", "We Only accept Image type of PNG, JPG, JPEG", (value) =>
      value.length !== 0
        ? value[0]?.type === "image/jpeg" ||
          value[0]?.type === "image/jpg" ||
          value[0]?.type === "image/png"
        : true
    ),
});
