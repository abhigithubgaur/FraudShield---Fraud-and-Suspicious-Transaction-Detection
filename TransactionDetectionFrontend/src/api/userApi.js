import api from "./axios";

export const freezeAccount = async () => {
  const response = await api.post(
    "/user/freeze"
  );

  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/user/all");
  return response.data;
};