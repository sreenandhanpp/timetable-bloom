import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

export interface BreakItem {
  id: number | string;     // unique id for each break
  name: string;            // e.g., "Morning Break"
  start: string;           // e.g., "10:50"
  end: string;             // e.g., "11:10"
}

export interface ConfigPayload {
  semester?: number | 'global'; // semester-specific config or global
  startOfDay: string;           // e.g., "08:50"
  qcpcEnabled: boolean;         // true or false
  qcpcStart?: string;           // required only if qcpcEnabled is true
  qcpcEnd?: string;             // required only if qcpcEnabled is true
  classStart: string;           // e.g., "09:05"
  classEnd: string;             // e.g., "16:15"
  lunchStart: string;           // e.g., "12:50"
  lunchEnd: string;             // e.g., "13:30"
  breaks: BreakItem[];          // array of other breaks
  periodBeforeLunch?: Number; // e.g., "10:50"
  periodAfterLunch?: Number;  // e.g., "14:00"
}


// Create configuration
export const createConfig = async (payload: ConfigPayload) => {
  const { data } = await apiClient.post(ENDPOINTS.configuration.create, payload);
  return data;
};

// Get all configurations
export const getConfigList = async () => {
  const { data } = await apiClient.get(ENDPOINTS.configuration.list);
  return data;
};

// Get configuration by ID
export const getConfigDetails = async (id: string) => {
  const { data } = await apiClient.get(ENDPOINTS.configuration.details(id));
  return data;
};

// Update configuration by ID
export const updateConfig = async (id: string, payload: Partial<ConfigPayload>) => {
  const { data } = await apiClient.put(ENDPOINTS.configuration.update(id), payload);
  return data;
};

// Delete configuration by ID
export const deleteConfig = async (id: string) => {
  const { data } = await apiClient.delete(ENDPOINTS.configuration.delete(id));
  return data;
};
