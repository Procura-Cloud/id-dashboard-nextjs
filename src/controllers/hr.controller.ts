import { HRType } from "@/schema/hr.schema";
import axiosClient from "./axios-client";

export const createHR = async (data: HRType, options = {}) => {
  const response = await axiosClient.post("/hr/create", data, {
    ...options,
  });

  return response;
};

export const listHRs = async (options = {}) => {
  const response = await axiosClient.get("/hr/list", {
    ...options,
  });

  return response.data;
};

export const loginHR = async (email: string) => {
  const response = await axiosClient.post("/hr/login", {
    email,
  });

  return response.data;
};

export const deleteHR = async (id: string) => {
  const response = await axiosClient.delete(`/hr/delete/${id}`);

  return response.data;
};

export const sendInviteEmail = async (email: string) => {
  const response = await axiosClient.post("/hr/send-email", {
    email,
  });

  return response.data;
};
