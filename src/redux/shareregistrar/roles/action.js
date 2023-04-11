import {
  ROLES_BEGIN_DROPDOWN_LOADING,
  ROLES_BEGIN_LOADING,
  ROLES_END_DROPDOWN_LOADING,
  ROLES_END_LOADING,
  GET_ROLES,
  GET_ROLES_DROPDOWN,
  WATCH_ROLES,
  WATCH_ROLES_DROPDOWN,
} from "../../../redux/actionTypes";

export const watchRoles = () => ({ type: WATCH_ROLES });

export const watchRolesDropDown = () => ({
  type: WATCH_ROLES_DROPDOWN,
});

export const beginCompanyLoading = () => ({
  type: ROLES_BEGIN_LOADING,
});

export const beginCompanyDropdownLoading = () => ({
  type: ROLES_BEGIN_DROPDOWN_LOADING,
});

export const endCompanyLoading = () => ({
  type: ROLES_END_LOADING,
});

export const endCompanyDropdownLoading = () => ({
  type: ROLES_END_DROPDOWN_LOADING,
});

export const fetchRoles = (roles) => ({
  type: GET_ROLES,
  payload: roles,
});
export const fetchRolesDropDown = (dropdown) => ({
  type: GET_ROLES_DROPDOWN,
  payload: dropdown,
});
