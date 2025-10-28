// /services/productService.js

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/products";

// 🔹 Obtener todos los productos
export async function getProducts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

// 🔹 Crear producto (maneja imagen opcional)
export async function createProductAPI(product) {
  const formData = new FormData();

  for (const key in product) {
    if (product[key] !== undefined && product[key] !== null)
      formData.append(key, product[key]);
  }

  const res = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
}

// 🔹 Actualizar producto
export async function updateProductAPI(id, updatedData) {
  const formData = new FormData();

  for (const key in updatedData) {
    if (updatedData[key] !== undefined && updatedData[key] !== null)
      formData.append(key, updatedData[key]);
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
}

// 🔹 Eliminar solo la imagen del producto
export async function deleteProductImageAPI(id) {
  const res = await fetch(`${API_URL}/${id}/image`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar la imagen del producto");
  return res.json();
}

// 🔹 Eliminar producto
export async function deleteProductAPI(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return res.json();
}
