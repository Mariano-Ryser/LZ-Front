import { useState } from "react";

interface Product {
  artikelName?: string;
  lagerPlatz?: string;
  artikelNumber?: string;
  description?: string;
  stock?: number;
  price?: number;
  imagen?: string | File | null;
}

interface ProductCreatorProps {
  product?: Product;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  createProduct: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
}

export const ProductCreator: React.FC<ProductCreatorProps> = ({
  product = {},
  handleChange,
  createProduct,
  loading,
  error,
  onClose,
}) => {
  const safeProduct: Product = {
    artikelName: product.artikelName ?? "",
    lagerPlatz: product.lagerPlatz ?? "",
    artikelNumber: product.artikelNumber ?? "",
    description: product.description ?? "",
    stock: product.stock ?? 0,
    price: product.price ?? 0,
    imagen: product.imagen ?? null,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>➕ Nuevo Producto</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <form onSubmit={createProduct} className="form">

            <div className="input-group">
              <label>Nombre del artículo</label>
              <input
                type="text"
                name="artikelName"
                value={safeProduct.artikelName}
                placeholder="Taladro Bosch"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Lugar en almacén</label>
                <input
                  type="text"
                  name="lagerPlatz"
                  value={safeProduct.lagerPlatz}
                  placeholder="A-12"
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Número de artículo</label>
                <input
                  type="text"
                  name="artikelNumber"
                  value={safeProduct.artikelNumber}
                  placeholder="345-AB"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ✅ Cantidad */}
            <div className="input-group">
              <label>Cantidad</label>
              <input
                type="number"
                name="stock"
                value={safeProduct.stock}
                onChange={handleChange}
                min={0}
              />
            </div>

            {/* ✅ Precio */}
            <div className="input-group">
              <label>Precio (€)</label>
              <input
                type="number"
                name="price"
                value={safeProduct.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Ej: 2.50"
              />
            </div>

            <div className="input-group">
              <label>Descripción</label>
              <textarea
                name="description"
                value={safeProduct.description}
                onChange={handleChange}
                rows={3}
                placeholder="Descripción del producto..."
              />
            </div>

            {/* 📷 Imagen */}
            <div className="input-group file-upload">
              <label className="file-label">
                📷 Subir imagen
                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={handleChange}
                  className="file-input"
                />
              </label>
            </div>

            {error && <div className="error-message">⚠ {error}</div>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "⏳ Creando..." : "✅ Crear Producto"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        /* MISMO ESTILO QUE TENÍAS, SOLO LIGERAMENTE MEJORADO */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-container {
          width: 100%;
          max-width: 560px;
          background: white;
          border-radius: 14px;
          padding-bottom: 10px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: #f3f4f6;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
        }
        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        input,
        textarea {
          padding: 0.7rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
        }
        .submit-button {
          padding: 0.85rem;
          border-radius: 10px;
          background: #2563eb;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ProductCreator;
