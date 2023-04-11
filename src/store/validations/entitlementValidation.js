import * as yup from "yup";

export const addEntitlementSchema = yup.object().shape({
  // company_code: yup.string().required("Select Announcment"),
  announcement_id: yup.object().required("Select Announcement"),
  //   dividend_issue_number: yup.string().required("Enter Dividend Number"),
  //   bonus_number: yup.string().required("Enter Bonus Number"),
  //   right_number: yup.string().required("Enter Right Number"),
  face_value: yup.string().required("Enter Face Value"),
  filer_tax: yup.string().required("Enter Filer Tax"),
  non_filer_tax: yup.string().required("Enter Non Filer Tax"),
});
export const editEntitlementSchema = (entitlement) =>
  yup.object().shape({
    // company_code: yup.string().required("Select Announcment"),
    announcement_id: yup.object().required("Select Announcement").default({
      label: entitlement?.announcement_id,
      value: entitlement?.announcement_id,
    }),
    //   dividend_issue_number: yup.string().required("Enter Dividend Number"),
    //   bonus_number: yup.string().required("Enter Bonus Number"),
    //   right_number: yup.string().required("Enter Right Number"),
    face_value: yup.string().required("Enter Face Value"),
    filer_tax: yup.string().required("Enter Filer Tax"),
    non_filer_tax: yup.string().required("Enter Non Filer Tax"),
  });
// .row>(col-md-4.col-sm-12.col-lg-4>.card>.card-header.b-t-success+.card-body)*3+row>.card>.card-header.b-t-primary+.card-body
