import { VendorType } from "@/schema/vendor.schema";
import axiosClient from "./axios-client";
import { send } from "process";

export const createVendor = async (data: VendorType, options = {}) => {
  const response = await axiosClient.post("/vendor/create", data, {
    ...options,
  });

  return response;
};

export const sendInviteEmail = async (email: string) => {
  const response = await axiosClient.post("/vendor/send-email", {
    email,
  });

  return response.data;
};

export const deleteVendor = async (id: string) => {
  const response = await axiosClient.delete(`/vendor/delete/${id}`);

  return response.data;
};

export const listVendors = async (options = {}) => {
  const response = await axiosClient.get("/vendor/list", {
    ...options,
  });

  return response.data;
};

export const getAssignedCandidates = async (params = {}) => {
  const response = await axiosClient.get(`/vendor/assigned-candidates`, {
    params: params,
  });

  return response.data;
};

export const getAssignedCompletedSubmissions = async (params = {}) => {
  const response = await axiosClient.get(
    `/vendor/assigned-completed-submissions`,
    { params: params }
  );

  return response.data;
};

export const suggestVendor = async (options = {}) => {
  const response = await axiosClient.get("/vendor/suggest", options);

  return response.data;
};

export const loginVendor = async (email: string) => {
  const response = await axiosClient.post("/vendor/login", {
    email,
  });

  return response.data;
};

export const updateVendor = async (id: string, data) => {
  const response = await axiosClient.patch(`/vendor/update/${id}`, data);

  return response.data;
};

export const downloadCard = async (id: string) => {
  try {
    // Fetch the file as a blob
    const response = await axiosClient.get(`/vendor/download-card/${id}`, {
      responseType: "blob",
    });

    // Create a URL for the blob
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${id}.pdf`);

    // Append the link, trigger the click, and remove the element
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the blob URL after download
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};

export const downloadCards = async (ids: string[]) => {
  try {
    // Fetch the file as a blob
    const response = await axiosClient.post(
      `/vendor/download-cards`,
      {
        ids,
      },
      {
        responseType: "blob",
      }
    );

    // Create a URL for the blob
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `id-cards.zip`);

    // Append the link, trigger the click, and remove the element
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the blob URL after download
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};

export const downloadAndMarkDone = async (ids: string[]) => {
  try {
    // Fetch the file as a blob
    const response = await axiosClient.post(
      `/vendor/download-mark-done`,
      {
        ids,
      },
      {
        responseType: "blob",
      }
    );

    // Create a URL for the blob
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `id-cards.zip`);

    // Append the link, trigger the click, and remove the element
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the blob URL after download
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};

export const markCompleted = async (id) => {
  const response = await axiosClient.patch(`/vendor/mark-completed/${id}`);

  return response.data;
};
