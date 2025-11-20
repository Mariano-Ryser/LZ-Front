// /services/productService.js

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/products";

// 🔹 Obtener todos los productos
export async function getProducts() {
  try {
    console.log('Fetching products from:', API_URL);
    const res = await fetch(API_URL);
    
    if (!res.ok) {
      throw new Error(`Error al obtener productos: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw new Error(`Network error: ${error.message}`);
  }
}

// 🔹 Crear producto (maneja imagen opcional)
export async function createProductAPI(product) {
  try {
    console.log('Creating product with data:', product);
    console.log('API URL:', API_URL);
    
    const formData = new FormData();

    // Agregar campos al FormData de manera más específica
    if (product.artikelName) formData.append('artikelName', product.artikelName);
    if (product.lagerPlatz) formData.append('lagerPlatz', product.lagerPlatz);
    if (product.artikelNumber) formData.append('artikelNumber', product.artikelNumber);
    if (product.description) formData.append('description', product.description);
    
    // Manejar números - asegurar que sean números válidos
    formData.append('stock', product.stock ? Number(product.stock) : 0);
    formData.append('price', product.price ? Number(product.price) : 0);
    
    // Solo agregar imagen si es un File válido
    if (product.imagen && product.imagen instanceof File) {
      console.log('Adding image file:', product.imagen.name, product.imagen.type);
      formData.append('imagen', product.imagen);
    } else {
      console.log('No valid image file found');
    }

    // DEBUG: Mostrar contenido del FormData
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`FormData: ${key} = File(${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`FormData: ${key} =`, value);
      }
    }

    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    console.log('Response status:', res.status, res.statusText);
    
    if (!res.ok) {
      let errorMessage = `Error ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Si no se puede parsear como JSON, usar text
        const errorText = await res.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const result = await res.json();
    console.log('Product created successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error in createProductAPI:', error);
    throw new Error(`Network error: ${error.message}`);
  }
}
// 🔹 Actualizar producto
export async function updateProductAPI(id, updatedData) {
  try {
    console.log('Updating product:', id, updatedData);
    
    const formData = new FormData();

    for (const key in updatedData) {
      if (updatedData[key] !== undefined && updatedData[key] !== null)
        formData.append(key, updatedData[key]);
    }

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Error al actualizar producto: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error in updateProductAPI:', error);
    throw new Error(`Network error: ${error.message}`);
  }
}


// 🔹 Eliminar producto de la base de datos 
export async function deleteProductAPI(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { 
      method: "DELETE" 
    });
    
    if (!res.ok) {
      throw new Error(`Error al eliminar producto: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error in deleteProductAPI:', error);
    throw new Error(`Network error: ${error.message}`);
  }
}


// 🔹 Eliminar solo la imagen del producto
export async function deleteProductImageAPI(id) {
  try {
    const res = await fetch(`${API_URL}/${id}/image`, {
      method: "DELETE",
    });
    
    if (!res.ok) {
      throw new Error(`Error al eliminar la imagen: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error in deleteProductImageAPI:', error);
    throw new Error(`Network error: ${error.message}`);
  }
}