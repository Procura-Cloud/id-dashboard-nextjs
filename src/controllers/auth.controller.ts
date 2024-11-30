import axiosClient from "./axios-client";

export const verifyAuthToken = async (token: string) => {
  const response = await axiosClient.post("/auth/verify", {
    token,
  });

  return response;
};
