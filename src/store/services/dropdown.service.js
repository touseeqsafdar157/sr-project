import { getTransactionTypes } from "./transaction.service";
import { getInvestorRequest } from "./investor.service";
import { getInvestors } from "./investor.service";
import { getCorporateAnnouncement } from "./corporate.service";
import { getCorporateEntitlement } from "./corporate.service";
import { getCompanies } from "./company.service";
import { getShareholders } from "./shareholder.service";
import { getTransactions } from "./transaction.service";
import { getProcessChecklist } from "./checklist.service";
import { getChecklistItems } from "./checklist.service";
import { getShareCertificates } from "./shareCertificate.service";

export const txn_type_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getTransactionTypes(email);
    let options = response.data.data.map((item) => {
      return { label: item.transactionName, value: item.transactionCode };
    });
    return options;
  } catch (error) {
    throw error;
  }
};
export const investor_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getInvestors(email);
    let options = response.data.data.map((item) => {
      const shareholder_id = !!item.cnic ? item.cnic : item.ntn;
      return {
        label: `${item.investor_name} - ${shareholder_id}`,
        value: shareholder_id,
      };
    });

    return options;
  } catch (error) {
    throw error;
  }
};
export const txn_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getTransactions(email);
    let options = response.data.data.map((item) => {
      return { label: item.txn_id, value: item.txn_id };
    });
    return options;
  } catch (error) {
    throw error;
  }
};

export const request_id_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getInvestorRequest(email);
    let options = response.data.data.map((item) => {
      let label = ` ${item.request_id}  ${item.folio_number}`;
      return { label: label, value: item.request_id };
    });

    return options;
  } catch (error) {
    throw error;
  }
};

export const announcement_id_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getCorporateAnnouncement(email);
    let options = response.data.data.map((item) => {
      let label = `${item.symbol} ${item.bonus_percent}% (B) ${item.dividend_percent}% (D) ${item.right_percent}% (R) `;
      return { label: label, value: item.announcement_id };
    });

    return options;
  } catch (error) {
    throw error;
  }
};

export const entitlement_id_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getCorporateEntitlement(email);
    let options = response.data.data.map((item) => {
      return { label: item.entitlement_id, value: item.entitlement_id };
    });

    return options;
  } catch (error) {
    throw error;
  }
};

export const symbol_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getCompanies(email);
    let options = response.data.data.map((item) => {
      let label = `${item.symbol} (${item.code}) (${item.company_name})`;
      return { label: label, value: item.symbol };
    });

    return options;
  } catch (error) {
    throw error;
  }
};
export const company_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getCompanies(email);
    let options = response.data.data.map((item) => {
      let label = `${item.code} - ${item.company_name}`;
      return { label: label, value: item.code };
    });

    return options;
  } catch (error) {
    throw error;
  }
};

export const certificate_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getShareCertificates(email);
    let options = response.data.data.map((item) => {
      let label = `${item.code} - ${item.company_code}`;
      return { label: label, value: item.code };
    });

    return options;
  } catch (error) {
    throw error;
  }
};

export const company_code_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getCompanies(email);
    let options = response.data.data.map((item) => {
      let label = `${item.code} - ${item.company_name}`;
      return { label: label, value: item.code };
    });

    return options;
  } catch (error) {
    throw error;
  }
};

export const folio_setter = async () => {
  try {
    const email = sessionStorage.getItem("email") || "";
    const response = await getShareholders(email);
    console.log("🚀 ~ file: dropdown.service.js:162 ~ constfolio_setter= ~ response", response)
    let options = response.data.data.map((item) => {
      let label = `${item.folio_number} (${item.shareholder_name}) `;
      return { label: label, value: item.folio_number };
    });

    return options;
  } catch (error) {
    throw error;
  }
};

export const checklist_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getProcessChecklist(email);
    let options = response.data.data.map((item) => {
      let label = `${item.checklist_id} ${item.check_list_title} `;
      return { label: label, value: item.txn_type };
    });

    return options;
  } catch (error) {
    throw error;
  }
};

export const checklist_items_setter = async () => {
  try {
    const email = sessionStorage.getItem("email");
    const response = await getChecklistItems(email);
    let options = response.data.data.map((item) => {
      let label = `${item.item}`;
      return { label: item.item, value: item.item };
    });

    return options;
  } catch (error) {
    throw error;
  }
};

export function MirrorLableValue(entity) {}
