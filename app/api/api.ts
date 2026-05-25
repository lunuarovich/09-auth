import axios from 'axios';

const baseURL = process.env.BACKEND_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
