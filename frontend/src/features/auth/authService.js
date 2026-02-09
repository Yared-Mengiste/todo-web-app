import api from "../../services/apiClient";

export const login = (data) =>
  api.post("/api/login", data);

export const logout = () =>
  api.post("/api/logout");

export const register = (data) =>
  api.post("/api/register", data);
