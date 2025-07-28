import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

export interface StaffPayload {
  name: string;
  department: string;
  email: string;
  phone?: string;
  designation: string;
}

export const createStaff = async (payload: StaffPayload) => {
  const { data } = await apiClient.post(ENDPOINTS.staff.create, payload);
  return data;
};

export const getStaffList = async () => {
  const { data } = await apiClient.get(ENDPOINTS.staff.list);
  return data;
};

export const deleteStaff = async (id: string) => {
  const { data } = await apiClient.delete(ENDPOINTS.staff.delete(id));
  return data;
};

export const getStaffDetails = async (id: string) => {
  const { data } = await apiClient.get(ENDPOINTS.staff.details(id));
  return data;
};

export const updateStaff = async (id: string, payload: any) => {
  const { data } = await apiClient.put(ENDPOINTS.staff.update(id), payload);
  return data;
};
