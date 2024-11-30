import { AdminType } from "@/schema/admin.schema";
import axiosClient from "./axios-client";
import axios from "axios";

export const createAdmin = async (data: AdminType, options = {}) => {
  const response = await axiosClient.post("/admin/create", data, {
    ...options,
  });

  return response;
};

export const loginAdmin = async (email: string) => {
  const response = await axiosClient.post("/admin/login", {
    email,
  });

  return response.data;
};

export const sendInviteEmail = async (email: string) => {
  const response = await axiosClient.post("/admin/send-email", {
    email,
  });

  return response.data;
};

export const deleteAdmin = async (id: string) => {
  const response = await axiosClient.delete(`/admin/delete/${id}`);

  return response.data;
};

export const listAdmins = async (options = {}) => {
  const response = await axiosClient.get("/admin/list", options);

  return response.data;
};
