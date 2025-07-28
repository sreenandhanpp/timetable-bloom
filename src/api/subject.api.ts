import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";

export interface SubjectPayload {
  subjectName: string;
  subjectCode: string;
  subjectType: string; // "Lecture" or "Lab"
  faculty: string;
  periodsPerWeek: number;
  labName?: string;
  semester: string;
  department: string;
}

export const createSubject = async (payload: SubjectPayload) => {
  const { data } = await apiClient.post(ENDPOINTS.subject.create, payload);
  return data;
};

export const getSubjectList = async () => {
  const { data } = await apiClient.get(ENDPOINTS.subject.list);
  return data;
};

export const getSubjectDetails = async (id: string) => {
  const { data } = await apiClient.get(ENDPOINTS.subject.details(id));
  return data;
};

export const updateSubject = async (id: string, payload: Partial<SubjectPayload>) => {
  const { data } = await apiClient.put(ENDPOINTS.subject.update(id), payload);
  return data;
};

export const deleteSubject = async (id: string) => {
  const { data } = await apiClient.delete(ENDPOINTS.subject.delete(id));
  return data;
};

export const getSubjectById = async (id: string) => {
  const { data } = await apiClient.get(ENDPOINTS.subject.details(id));
  return data;
};
