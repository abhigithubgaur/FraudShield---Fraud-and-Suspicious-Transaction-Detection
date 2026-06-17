import api from "./axios";

export const initiateTransaction = async (data) => {
  const response = await api.post(
    "/transactions/initiate",
    data
  );

  return response.data;
};

export const verifyOtp = async (
  transactionId,
  otpCode
) => {
  const response = await api.post(
    `/transactions/${transactionId}/verify-otp`,
    {
      otpCode,
    }
  );

  return response.data;
};

export const getTransactionHistory = async (
  userId
) => {
  const response = await api.get(
    `/transactions/my-history/${userId}`
  );

  return response.data;
};