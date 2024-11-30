import { LocationType } from "@/schema/location.schema";
import axiosClient from "./axios-client";

export const createLocation = async (location: LocationType, options = {}) => {
  const response = await axiosClient.post(
    "/location/create",
    location,
    options
  );

  return response;
};

export const listLocations = async (options = {}) => {
  const response = await axiosClient.get("/location/list", options);

  return response.data;
};

export const updateLocation = async (id: string, data) => {
  const response = await axiosClient.patch(`/location/update/${id}`, data);

  return response.data;
};

export const suggestLocations = async (options = {}) => {
  const response = await axiosClient.get("/location/suggest", options);

  return response.data;
};

export const deleteLocation = async (id: string) => {
  const response = await axiosClient.delete(`/location/delete/${id}`);

  return response.data;
};
