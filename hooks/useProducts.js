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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // fetch que trae los productos desde la api - CON DEPENDENCIA DEL TRIGGER
  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]); // ← NUEVO: se ejecuta cuando cambia el trigger

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data.products || data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Manejar cambios de los inputs
const handleChange = (e) => {
  const { name, value, files, type } = e.target;

  // Si es archivo (imagen)
  if (files) {
    setProduct((prev) => ({ ...prev, [name]: files[0] }));
    return;
  }

  // Para números - permitir vacío temporalmente
  if (type === "number") {
    setProduct((prev) => ({
      ...prev,
      [name]: value === "" ? "" : value, // Mantener como string temporalmente
    }));
    return;
  }

  // Strings normales
  setProduct((prev) => ({ ...prev, [name]: value }));
};
  // Crear producto - MEJORADO
async function createProduct(e) {
  e.preventDefault();
  setLoading(true);
  setError(null); // Limpiar errores previos
  
  try {
    console.log('Creating product with data:', product);
    
    // Validaciones más robustas
    if (!product.artikelName || product.artikelName.trim() === '') {
      throw new Error('Artikel Name ist erforderlich');
    }
    
    // Preparar datos para enviar - estructura más limpia
    const productToCreate = {
      artikelName: product.artikelName.trim(),
      lagerPlatz: product.lagerPlatz || "",
      artikelNumber: product.artikelNumber || "",
      description: product.description || "",
      stock: product.stock === '' ? 0 : Number(product.stock || 0),
      price: product.price === '' ? 0 : Number(product.price || 0),
    };
    
    // Solo agregar imagen si existe y es un File válido
    if (product.imagen && product.imagen instanceof File) {
      productToCreate.imagen = product.imagen;
      console.log('Including image in request:', product.imagen.name);
    }
    
    console.log('Sending to API:', productToCreate);
    
    const created = await createProductAPI(productToCreate);
    
    // Actualizar la lista de productos
    setProducts(prev => [...prev, created.product || created]);
    
    // Limpiar el formulario COMPLETAMENTE
    setProduct({
      artikelName: "",
      lagerPlatz: "",
      artikelNumber: "",
      description: "",
      stock: 0,
      price: 0,
      imagen: null,
    });
    
    // Trigger refresh para infinite scroll
    setRefreshTrigger(prev => prev + 1);
    
    console.log('Product created successfully');
    return { success: true, product: created.product || created };
    
  } catch (err) {
    console.error('Error creating product:', err);
    const errorMessage = err.message || 'Unbekannter Fehler';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
}
  // Actualizar producto - MEJORADO
  async function updateProduct(e, updatedProduct) {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Updating product:', updatedProduct);
      const updated = await updateProductAPI(updatedProduct._id, updatedProduct);
      
      // Actualizar la lista local
      setProducts(prev =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1);
      
      setError(null);
      return { success: true, product: updated };
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }

  // Eliminar solo la imagen del producto - MEJORADO
  async function deleteProductImage(id) {
    setLoading(true);
    try {
      const result = await deleteProductImageAPI(id);
      
      // Actualizar la lista local
      setProducts(prev =>
        prev.map((p) =>
          p._id === id ? { ...p, imagen: "", publicId: "" } : p
        )
      );
      
      setRefreshTrigger(prev => prev + 1);
      return { success: true, result };
    } catch (err) {
      console.error('Error deleting product image:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }

  // Eliminar producto - MEJORADO
  async function deleteProduct(id) {
    setLoading(true);
    try {
      await deleteProductAPI(id);
      
      // Actualizar la lista local
      setProducts(prev => prev.filter((p) => p._id !== id));
      
      setRefreshTrigger(prev => prev + 1);
      return { success: true };
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }

  // Configurar producto a editar
  const setProductToEdit = (p) => {
    setProduct(p);
  };

  // Función para forzar refresh manual
  const refreshProducts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    product,
    products,
    loading,
    error,
    setError, // ← AÑADIR esto
    refreshTrigger,
    handleChange,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProductImage,
    deleteProduct,
    setProductToEdit,
    refreshProducts, // ← NUEVO: función para refresh manual
  };
};