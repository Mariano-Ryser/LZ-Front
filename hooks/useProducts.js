// /hooks/useProduct.js
import { useState, useEffect } from "react";
import {
  getProducts,
  createProductAPI,
  updateProductAPI,
  deleteProductImageAPI, 
  deleteProductAPI,
} from "../services/productService";

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //fetch que trae los productos desde la api
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data.products);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
//  manejar cambios de los imputs

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProduct((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  // Crear producto
  async function createProduct(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await createProductAPI(product);
      setProducts((prev) => [...prev, created]);
      setProduct({});
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }

  // 🔄 Actualizar producto
  async function updateProduct(e, updatedProduct) {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateProductAPI(updatedProduct._id, updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 🖼️ Eliminar solo la imagen del producto
async function deleteProductImage(id) {
  setLoading(true);
  try {
    const result = await deleteProductImageAPI(id);
    // Actualizar el estado local del producto
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, imagen: "", publicId: "" } : p
      )
    );
    return result;
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
  //  Eliminar producto
  async function deleteProduct(id) {
    setLoading(true);
    try {
      await deleteProductAPI(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ✨ Configurar producto a editar
  const setProductToEdit = (p) => setProduct(p);
  return {
    product,
    products,
    loading,
    error,
    handleChange,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProductImage,
    deleteProduct,
    setProductToEdit,
  };
};
