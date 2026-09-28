import api from "./api.js";

export async function getProducts() {
  const response = await api.get("/products");
  return response;
}

export async function getProductById(id) {
  const response = await api.get(`/products/${id}`);
  return response;
}

export async function createProduct(productData) {
  const response = await api.post("/products", productData);
  return response;
}

export async function updateProduct(id, productData) {
  const response = await api.put(`/products/${id}`, productData);
  return response;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response;
}
