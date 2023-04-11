import * as yup from "yup";
import { IsJsonString } from "../../utilities/utilityFunctions";

export const addAlertValidationSchema = yup.object().shape({

  // Company Details
  title: yup.string().required("Enter Title"),
  section: yup.string(),
  regulations: yup.string(),
  days_dependent: yup.string(),
  notify_days: yup.string(),
  notify_via: yup.string(),
  active: yup.string(),
  dependent: yup.string(),
  frequency: yup.string(),
  level_ddl: yup.string(),
  company_type: yup.string().required("Select Company Type"),
  form_code: yup.string().required("Code is Required")

});
export const EditRequirmentScema = (requirment) =>
  yup.object().shape({
    title: yup.string().required("Enter Title").default(requirment.title),
    section: yup.string().default(requirment.section),
    regulations: yup.string().default(requirment.regulations),
    days_dependent: yup.string().default(requirment.days_to_dependent),
    notify_days: yup.string().default(requirment.notify_days),
    notify_via: yup.string().default(requirment.notify_via),
    active: yup.string().default(requirment.active),
    dependent: yup.string().default(requirment.dependent),
    frequency: yup.string().default(requirment.frequency),
    level_ddl: yup.string().default(requirment.level),
    company_type: yup.string().required("Select Company Type").default(requirment.company_type),
    form_code: yup.string().required("Code is Required").default(requirment.code),

    
  });

  export const addEventValidationSchema = yup.object().shape({
    comapny_code: yup.object(),
    title: yup.string().required("Enter Title"),
    start_date: yup.string(),
    deadline_date: yup.string(),
    reminder_days: yup.string(),
    action_date: yup.string(),
    previous_action_date: yup.string(),
    status: yup.string(),
    comment: yup.string(),
    closed: yup.string(),
    action_by_text: yup.string(),
    request_code: yup.string(),
    auto_generated: yup.string(),
  });
  export const EditEventScema = (event) =>
  yup.object().shape({
    comapny_code: yup.object().default(event.comapny_code),
    title: yup.string().default(event.title),
    start_date: yup.string().default(event.start_date),
    deadline_date: yup.string().default(event.deadline_date),
    reminder_days: yup.string().default(event.reminder_days),
    action_date: yup.string().default(event.action_date),
    previous_action_date: yup.string().default(event.previous_action_date),
    status: yup.string().default(event.status),
    comment: yup.string().default(event.comments),
    closed: yup.string().default(event.closed),
    action_by_text: yup.string().default(event.action_by),
    request_code: yup.string().default(event?.request_code),
    auto_generated: yup.string().default(event?.auto_generated),
  });