import { CandidateType } from "@/schema/candidate.schema";
import axiosClient from "./axios-client";

export const createCandidate = async (data) => {
  const response = await axiosClient.post("/candidate/create", data);

  return response.data;
};

export const listSumbmissions = async (options = {}) => {
  const response = await axiosClient.get("/candidate/list", options);

  return response.data;
};

export const updateCandidate = async (id: string, data) => {
  const response = await axiosClient.patch(`/candidate/update/${id}`, data);

  return response.data;
};

export const getCandidateForm = async (id: string) => {
  const response = await axiosClient.get(`/candidate/${id}`);

  return response.data;
};

export const requestChanges = async (id, data) => {
  const response = await axiosClient.post(
    `/candidate/request-changes/${id}`,
    data
  );

  return response.data;
};

export const getApprovedCandidates = async () => {
  const response = await axiosClient.get("/candidate/approved-submissions");

  return response.data;
};

export const approveCandidate = async (id) => {
  const response = await axiosClient.patch(`/candidate/approve/${id}`);

  return response.data;
};

export const submitForm = async (
  id,
  {
    token,
    photo,
  }: {
    token: string;
    photo: File;
  }
) => {
  const formData = new FormData();

  formData.append("token", token);
  formData.append("profileImage", photo);

  const response = await axiosClient.post(
    `/candidate/submit-form/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const verifyCandidate = async (token) => {
  const response = await axiosClient.post("/candidate/verify-token", { token });

  return response.data;
};

export const sendToVendor = async (ids: string[], vendorId: string) => {
  const response = await axiosClient.post(`/candidate/send-to-vendor`, {
    ids,
    vendorId,
  });

  return response.data;
};

export const getCompletedSubmissions = async (options = {}) => {
  const response = await axiosClient.get(
    "/candidate/completed-submissions",
    options
  );

  return response.data;
};
