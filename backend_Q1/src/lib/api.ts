import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.TEST_SERVER_URL!;

if (!BASE_URL) {
  throw new Error(
    "TEST_SERVER_URL is not defined in the environment variables."
  );
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export function setAuthToken(bearer: string) {
  api.defaults.headers.common["Authorization"] = bearer;
}
