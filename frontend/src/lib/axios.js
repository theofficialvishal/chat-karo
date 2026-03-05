import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chat-karo-jm79.onrender.com/api",
  withCredentials: true,
});
