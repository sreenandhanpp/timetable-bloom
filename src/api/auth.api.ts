import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

export interface LoginPayload {
  email: string;
  password: string;
}

export const adminLogin = async (payload: LoginPayload) => {
  const { data } = await apiClient.post(ENDPOINTS.auth.adminLogin, payload);

  // Save admin token with a role identifier
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", "admin");
  }

  return data;
};

export const staffLogin = async (payload: LoginPayload) => {
  const { data } = await apiClient.post(ENDPOINTS.auth.staffLogin, payload);

  // Save staff token with role identifier
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", "staff");
  }

  return data;
};

export const getAdminProfile = async () => {
  const { data } = await apiClient.get(ENDPOINTS.auth.adminProfile);
  return data;
};

export const getStaffProfile = async () => {
  const { data } = await apiClient.get(ENDPOINTS.auth.staffProfile);
  return data;
};
