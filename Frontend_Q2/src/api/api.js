import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getUsers = () => axios.get(`${BASE_URL}/users`);

export const getPopular = () => axios.get(`${BASE_URL}/posts?type=popular`);

export const getLatest = () => axios.get(`${BASE_URL}/posts?type=latest`);
