import axios from "axios";

export const wiseClient = axios.create({
  baseURL: process.env.WISE_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.WISE_API_KEY}`,
    "Content-Type": "application/json",
  },
});
