// src/api/timetable.ts

import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

// Payload structure for timetable generation
export interface GenerateTimetablePayload {
  type: string;
  department: string;
}

// Response structure (can be refined further based on your schema)
export interface TimetableEntry {
  day: string;
  timeSlot: {
    start: string;
    end: string;
  };
  subject?: string;
  type: "lecture" | "lab" | "qcpc" | "lunch" | "break";
  room?: string;
}

// Generate timetable for a semester & department
export const generateTimetable = async (payload: GenerateTimetablePayload) => {
  const { data } = await apiClient.post(ENDPOINTS.timetable.generate, payload);
  return data;
};

// Get timetable for a specific semester and department
export const getTimetable = async (semester: number, department: string) => {
  const { data } = await apiClient.get(
    ENDPOINTS.timetable.bySemester(semester, department)
  );
  return data;
};

// Get list of all timetables (admin view)
export const getAllTimetables = async () => {
  const { data } = await apiClient.get(ENDPOINTS.timetable.list);
  return data;
};

// Delete a timetable
export const deleteTimetable = async (semester: number, department: string) => {
  const { data } = await apiClient.delete(
    ENDPOINTS.timetable.delete(semester, department)
  );
  return data;
};

// Get all odd/even semester timetables for a specific version
export const getTimetablesByVersionType = async (
  type: "odd" | "even",
  version: number
) => {
  const { data } = await apiClient.get(
    ENDPOINTS.timetable.byVersionType(type, version)
  );
  return data;
};

// Set a timetable version as active
export const setActiveTimetable = async (
  type: "odd" | "even",
  version: number
) => {
  const { data } = await apiClient.post(
    ENDPOINTS.timetable.setActive(type, version)
  );
  return data;
};

// Get currently active timetable version for odd/even
export const getActiveTimetable = async (type: "odd" | "even") => {
  const { data } = await apiClient.get(
    ENDPOINTS.timetable.getActive(type)
  );
  return data;
};

export const getPublicTimetableBySemester = async (
  semester: number,
  dept: string
) => {
  const { data } = await apiClient.get(
    ENDPOINTS.timetable.publicBySemester(semester, dept)
  );
  return data;
};
