import * as yup from "yup";

export const addUserSchema = yup.object().shape({
  name: yup.string().required("Enter User Name"),
  user_type: yup.string().required("Select User Type").default("ADMIN"),
  cnic: yup
    .string()
    .when("user_type", {
      is: "SHAREHOLDER",
      then: yup
        .string()
        .test(
          "len",
          "Enter Complete CNIC",
          (val) => val.replaceAll("_", "").replaceAll("-", "").length === 13
        ),
    })
    .default(""),
  user_email: yup
    .string()
    .when("user_type", {
      is: "ADMIN",
      then: yup.string().required("Enter Email").email("Enter Correct Email"),
    })
    .when("user_type", {
      is: "COMPANYUSER",
      then: yup.string().required("Enter Email").email("Enter Correct Email"),
    })
    .default(""),

  role: yup.object().nullable().required("Select Role"),
  company: yup
    .object()
    .nullable()
    .when("user_type", {
      is: "COMPANYUSER",
      then: yup.object().nullable().required("Select Company"),
    })
    .when("user_type", {
      is: "SHAREHOLDER",
      then: yup.object().nullable().required("Select Company"),
    })
    .default(null),
});

export const updateUserSchema = (user) =>
  yup.object().shape({
    name: yup.string().required("Enter User Name").default(user.name),
    user_type: yup
      .string()
      .required("Select User Type")
      .default(user?.user_type),
    cnic: yup
      .string()
      .when("user_type", {
        is: "SHAREHOLDER",
        then: yup
          .string()
          .test(
            "len",
            "Enter Complete CNIC",
            (val) => val.replaceAll("_", "").replaceAll("-", "").length === 13
          ),
      })
      .default(user?.cnic),
    user_email: yup
      .string()
      .when("user_type", {
        is: "ADMIN",
        then: yup.string().required("Enter Email").email("Enter Correct Email"),
      })
      .when("user_type", {
        is: "COMPANYUSER",
        then: yup.string().required("Enter Email").email("Enter Correct Email"),
      })
      .default(user.email.replace("USER_", "")),

    role: yup.object().nullable().required("Select Role").default(user.role),
    company: yup
      .object()
      .nullable()
      .when("user_type", {
        is: "COMPANYUSER",
        then: yup.object().nullable().required("Select Company"),
      })
      .when("user_type", {
        is: "SHAREHOLDER",
        then: yup.object().nullable().required("Select Company"),
      })
      .default(user.company_code),
  });
