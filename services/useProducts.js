import { useState, useEffect } from 'react';

export const useProduct = () => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const initialState = { 
    artikelName: '',
    lagerPlatz: '',
    artikelNumber: '',
    description: '',
    imagen: null
  };
  
  const [product, setProduct] = useState(initialState);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      setProduct(prev => ({
        ...prev,
        imagen: files[0] || null,
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: value 
      }));
    }
  };

  const fetchProducts = async () => {
    if (!baseURL) {
      setError("❌ NEXT_PUBLIC_BACKEND_URL no está definido en el .env.local");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/products`);
      const data = await res.json();
      
      if (data.ok) {
        setProducts(data.products);
        setError(null);
      } else {
        setError(data.message || 'Error al obtener productos');
      }
    } catch (err) {
      setError('Error al cargar productos');
      console.error('❌ Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    if (!baseURL) {
      setError("❌ NEXT_PUBLIC_BACKEND_URL no está definido en el .env.local");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });

      const res = await fetch(`${baseURL}/products`, {
        method: 'POST',
        body: formData,
      });

      const raw = await res.text();
      console.log("📩 Respuesta cruda del backend (createProduct):", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("El backend no devolvió JSON válido. Revisa el servidor.");
      }
      
      if (data.ok) {
        setProducts(prev => [data.product, ...prev]);
        setProduct(initialState);
        setError(null);
        return { success: true };
      } else {
        setError(data.message || 'Error al crear producto');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Error al crear producto');
      console.error('❌ Error al crear producto:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
      fetchProducts();
    }
  };

  const deleteProduct = async (id) => {
    if (!baseURL) {
      setError("❌ NEXT_PUBLIC_BACKEND_URL no está definido en el .env.local");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        setError(null);
        return { success: true };
      } else {
        setError(data.message || 'Error al eliminar producto');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Error al eliminar producto');
      console.error('❌ Error al eliminar producto:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (e, updatedProduct) => {
    e.preventDefault();
    if (!baseURL) {
      setError("❌ NEXT_PUBLIC_BACKEND_URL no está definido en el .env.local");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(updatedProduct).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== '_id') {
          if (key === 'imagen' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });
  
      const res = await fetch(`${baseURL}/products/${updatedProduct._id}`, {
        method: 'PUT',
        body: formData,
      });

      const raw = await res.text();
      console.log("📩 Respuesta cruda del backend (updateProduct):", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("El backend no devolvió JSON válido. Revisa el servidor.");
      }
  
      if (data.ok) {
        setProducts(prev => prev.map(p => p._id === updatedProduct._id ? data.product : p));
        setError(null);
        return { success: true };
      } else {
        setError(data.message || 'Error al actualizar producto');
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError('Error al actualizar producto');
      console.error('❌ Error al actualizar producto:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const setProductToEdit = (productData) => {
    setProduct({
      ...productData,
      _id: productData._id
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    product,
    products,
    loading,
    error,
    handleChange,
    createProduct,
    deleteProduct,
    updateProduct,
    setProductToEdit
  };
};
