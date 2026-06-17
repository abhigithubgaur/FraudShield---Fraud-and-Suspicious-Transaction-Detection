export const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("email", data.email);
  localStorage.setItem("role", data.role);
};

export const clearAuth = () => {
  localStorage.clear();
};

export const getAuth = () => ({
  token: localStorage.getItem("token"),
  userId: localStorage.getItem("userId"),
  email: localStorage.getItem("email"),
  role: localStorage.getItem("role"),
});