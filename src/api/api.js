import axios from "axios";

const API_BASE_URL = "https://fakestoreapi.com";

export const getProducts = () => axios.get(`${API_BASE_URL}/products`);
export const getProduct = (id) => axios.get(`${API_BASE_URL}/products/${id}`);
export const createProduct = (productData) =>
  axios.post(`${API_BASE_URL}/products`, productData);
export const updateProduct = (id, productData) =>
  axios.put(`${API_BASE_URL}/products/${id}`, productData);
export const deleteProduct = (id) =>
  axios.delete(`${API_BASE_URL}/products/${id}`);
