// src/api/timetable.ts

import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

// Payload structure for timetable generation
export interface GenerateTimetablePayload {
  semester: number;
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
  const { data } = await apiClient.get(ENDPOINTS.timetable.bySemester(semester, department));
  return data;
};

// Get list of all timetables (admin view)
export const getAllTimetables = async () => {
  const { data } = await apiClient.get(ENDPOINTS.timetable.list);
  return data;
};

// Delete a timetable
export const deleteTimetable = async (semester: number, department: string) => {
  const { data } = await apiClient.delete(ENDPOINTS.timetable.delete(semester, department));
  return data;
};
