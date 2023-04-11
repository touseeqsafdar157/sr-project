import {
  GET_SHAREHOLDERS,
  GET_SHAREHOLDERS_DROPDOWN,
  WATCH_SHAREHOLDERS,
  WATCH_SHAREHOLDERS_DROPDOWN,
  // PHYSICAL
  GET_PHYSICAL_SHAREHOLDERS,
  GET_PHYSICAL_SHAREHOLDERS_DROPDOWN,
  WATCH_PHYSICAL_SHAREHOLDERS,
  WATCH_PHYSICAL_SHAREHOLDERS_DROPDOWN,
  // ELECTRONIC
  GET_ELECTRONIC_SHAREHOLDERS,
  GET_ELECTRONIC_SHAREHOLDERS_DROPDOWN,
  WATCH_ELECTRONIC_SHAREHOLDERS,
  WATCH_ELECTRONIC_SHAREHOLDERS_DROPDOWN,
  GET_INACTIVE_SHAREHOLDERS_DROPDOWN,
  GET_INACTIVE_SHAREHOLDERS,
} from "../../../redux/actionTypes";

export const watchShareholders = () => ({ type: WATCH_SHAREHOLDERS });

export const watchShareholdersDropdown = () => ({
  type: WATCH_SHAREHOLDERS_DROPDOWN,
});

export const fetchShareholders = (shareholders) => ({
  type: GET_SHAREHOLDERS,
  payload: shareholders,
});

export const fetchInactiveShareholders = (shareholders) => ({
  type: GET_INACTIVE_SHAREHOLDERS,
  payload: shareholders,
});

export const fetchInactiveShareholdersDropdown = (shareholders) => ({
  type: GET_INACTIVE_SHAREHOLDERS_DROPDOWN,
  payload: shareholders,
});

export const fetchShareholdersDropdown = (dropdown) => ({
  type: GET_SHAREHOLDERS_DROPDOWN,
  payload: dropdown,
});

// PHYSICAL
export const watchPhysicalShareholders = () => ({
  type: WATCH_PHYSICAL_SHAREHOLDERS,
});

export const watchPhysicalShareholdersDropdown = () => ({
  type: WATCH_PHYSICAL_SHAREHOLDERS_DROPDOWN,
});

export const fetchPhysicalShareholders = (shareholders) => ({
  type: GET_PHYSICAL_SHAREHOLDERS,
  payload: shareholders,
});

export const fetchPhysicalShareholdersDropdown = (dropdown) => ({
  type: GET_PHYSICAL_SHAREHOLDERS_DROPDOWN,
  payload: dropdown,
});

// ELECTRONIC
export const watchElectronicShareholders = () => ({
  type: WATCH_ELECTRONIC_SHAREHOLDERS,
});

export const watchElectronicShareholdersDropdown = () => ({
  type: WATCH_ELECTRONIC_SHAREHOLDERS_DROPDOWN,
});

export const fetchElectronicShareholders = (shareholders) => ({
  type: GET_ELECTRONIC_SHAREHOLDERS,
  payload: shareholders,
});

export const fetchElectronicShareholdersDropdown = (dropdown) => ({
  type: GET_ELECTRONIC_SHAREHOLDERS_DROPDOWN,
  payload: dropdown,
});
