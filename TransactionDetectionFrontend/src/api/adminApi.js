import api from "./axios";

export const getMetrics = async () => {
  const response = await api.get("/admin/metrics");
  return response.data;
};

export const getAlerts = async () => {
  const response = await api.get("/admin/alerts");
  return response.data;
};

export const getRiskProfiles = async () => {
  const response = await api.get(
    "/admin/users/risk-profiles"
  );
  return response.data;
};

export const getRules = async () => {
  const response = await api.get("/admin/rules");
  return response.data;
};

export const updateRules = async (data) => {
  const response = await api.put(
    "/admin/rules",
    data
  );
  return response.data;
};

export const updateUserStatus = async (
  userId,
  status
) => {
  const response = await api.put(
    `/admin/users/${userId}/status?status=${status}`
  );

  return response.data;
};

export const resolveTransaction = async (
  transactionId,
  action
) => {
  const response = await api.put(
    `/admin/transactions/${transactionId}/resolve`,
    {
      action,
    }
  );

  return response.data;
};

export const downloadReport = async () => {
  const response = await api.get(
    "/admin/reports/csv",
    {
      responseType: "blob",
    }
  );

  return response.data;
};