// components/products/listProduct.js
import { useState, useContext } from 'react';
import { AuthContext  } from '../../components/auth/AuthProvider';
import { useProduct } from '../../services/useProducts';
import { formatCurrency } from '../../utils/formatters';
import { ProductCreator } from './productCreator';
import { ProductEditor } from './productEditor';

export function ListProduct() {
  const {
    product,
    products,
    total,
    loading,
    error,
    updateProduct,
    handleChange,
    createProduct,
    deleteProduct,
    fetchProducts,
    setProductToEdit,
    filters,
    handleFilterChange,
    applyFilters,
    resetFilters
  } = useProduct();

  const { isAuthenticated} = useContext(AuthContext);

  // Estados de modales
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Opciones para los selects
  const sortOptions = [
    { value: '', label: 'Ordenar...' },
    { value: 'price-asc', label: 'Precio ↑' },
    { value: 'price-desc', label: 'Precio ↓' },
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' }
  ];

  // Obtener valores únicos para los filtros
  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const uniqueSuppliers = [...new Set(products.map(p => p.supplier))];
  const uniqueLugares = [...new Set(products.map(p => p.lugarDeVenta))];
  const uniqueMarcas = [...new Set(products.map(p => p.marca))];

  return (
    <div className="cyber-container">
      {/* Filtros compactos */}
              <button
          className="cyber-small-button toggle-filters-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
        <div className={`cyber-filters-compact ${showFilters ? 'show' : ''}`}>
        <select
          className="cyber-filter-select"
          name="sort"
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="cyber-filter-select"
          name="category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">Categoría</option>
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="cyber-filter-select"
          name="marca"
          value={filters.marca}
          onChange={(e) => handleFilterChange('marca', e.target.value)}
        >
          <option value="">Marca</option>
          {uniqueMarcas.map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>

        <button
          className="cyber-small-button"
          onClick={applyFilters}
          disabled={loading}
        >
          Filtrar
        </button>

        <button
          className="cyber-small-button reset"
          onClick={resetFilters}
          disabled={loading}
        >
          Limpiar
        </button>
      {isAuthenticated && (
        <button
          className="cyber-small-button add"
          onClick={() => setShowModal(true)}
        >
          + Nuevo
        </button> )}

      </div>

      {/* Lista tipo tabla con estilo elegante */}
      <div className="cyber-excel-table">
        <div className="cyber-excel-header">
          <div className="cyber-excel-cell">Imagen</div>
          <div className="cyber-excel-cell">Nombre</div>
          <div className="cyber-excel-cell">Precio</div>
          <div className="cyber-excel-cell">Categoría</div>
          <div className="cyber-excel-cell">Proveedor</div>
          <div className="cyber-excel-cell">Acciones</div>
        </div>

        {products.length === 0 ? ( 
          <div className="cyber-excel-row">
            <div className="cyber-excel-cell" colSpan="6">
              No se encontraron productos
            </div>
          </div>
        ) : ( 
          products.map((product) => (
            <div
             key={product._id}
              className="cyber-excel-row"
              onClick={() => {
                setEditingProduct(product);
                setProductToEdit(product); // Establecer el producto a editar
              }}
            >
              <div className="cyber-excel-cell">
                {product.imagen && (
                  <img 
                    src={product.imagen} 
                    alt={product.name} 
                    className="cyber-excel-image" 
                  />
                )}
              </div>
              <div className="cyber-excel-cell">{product.name}</div>
              <div className="cyber-excel-cell">{formatCurrency(product.price)}</div>
              <div className="cyber-excel-cell">{product.category}</div>
              <div className="cyber-excel-cell">{product.supplier}</div>
              <div className="cyber-excel-cell">
              <button
                className="cyber-excel-delete"
                onClick={(e) => {
                  e.stopPropagation();  // Detener la propagación para evitar que se active el evento de la fila
                  deleteProduct(product._id);
                }}
                disabled={loading}
              >
                Eliminar
              </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cyber-total">
        Total: {formatCurrency(total)} CRD
      </div>

      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          handleChange={handleChange}
          updateProduct={(e, updatedProduct) => {
            updateProduct(e, updatedProduct).then(() => {
              if (!error) setEditingProduct(null);
            });
          }}
          deleteProduct={deleteProduct}
          loading={loading}
          error={error}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {showModal && ( 
        <ProductCreator
          product={product}
          handleChange={handleChange}
          createProduct={(e) => {
            createProduct(e).then(() => {
              if (!error) setShowModal(false);
            });
          }}
          loading={loading}
          error={error}
          onClose={() => setShowModal(false)}
        />
      )}

<style jsx>{`
  .cyber-container {
    padding: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
    background: #1f1f1f; /* Fondo oscuro */
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  .cyber-filters-compact {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .cyber-filter-select {
    padding: 0.75rem;
    background: #333; /* Fondo oscuro para los selects */
    border: 1px solid #444; /* Borde gris */
    border-radius: 8px;
    color: #fff; /* Texto blanco */
    font-size: 1rem;
    min-width: 150px;
    transition: border-color 0.3s;
  }

  .cyber-filter-select:focus {
    border-color: #007bff;
    outline: none;
  }

  .cyber-small-button {
    padding: 0.6rem 1.2rem;
    background: #007bff; /* Botones en azul */
    border: 1px solid #0056b3;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.3s;
  }

  .cyber-small-button:hover:not(:disabled) {
    background: #0056b3;
  }

  .cyber-excel-table {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    background-color: #2a2a2a; /* Fondo oscuro de la tabla */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  .cyber-excel-header {
    display: grid;
    grid-template-columns: 100px 2fr 1fr 1fr 1fr 120px;
    background: #333; /* Fondo oscuro para los encabezados */
    padding: 1rem;
    font-weight: 600;
    color: #ddd; /* Color de texto claro */
    text-transform: uppercase;
  }

  .cyber-excel-row {
    display: grid;
    grid-template-columns: 100px 2fr 1fr 1fr 1fr 120px;
    padding: 1rem;
    border-top: 1px solid #444; /* Borde de las filas */
    transition: background 0.3s;
  }

  .cyber-excel-row:hover {
    background: #444; /* Fondo al hacer hover */
  }

  .cyber-excel-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    color: #fff; /* Texto blanco */
  }

  .cyber-excel-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }

  .cyber-excel-delete {
    padding: 0.4rem 0.8rem;
    background: #ff5733; /* Botón de eliminar en rojo */
    border: 1px solid #ff5733;
    color: white;
    font-size: 0.9rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .cyber-excel-delete:hover:not(:disabled) {
    background: #e04e2b; /* Color de hover para eliminar */
  }

  .cyber-total {
    text-align: right;
    font-weight: bold;
    color: #28a745; /* Color verde para el total */
    font-size: 1.2rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 768px) {
    .cyber-excel-header,
    .cyber-excel-row {
      grid-template-columns: 80px 1fr 1fr 1fr 80px;
    }

    .cyber-excel-cell:nth-child(4),
    .cyber-excel-cell:nth-child(5) {
      display: none;
    }
  }

  .toggle-filters-button {
  margin-bottom: 1rem;
}

/* Pantallas pequeñas */
@media (max-width: 480px) {
  .cyber-container {
    padding: 1rem;
  }

  .cyber-filters-compact {
    display: none;
    flex-direction: column;
    gap: 0.5rem;
  }

  .cyber-filters-compact.show {
    display: flex;
  }

  .cyber-filter-select,
  .cyber-small-button {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .cyber-excel-header,
  .cyber-excel-row {
    grid-template-columns: 60px 2fr 1fr 80px;
    font-size: 0.8rem;
  }

  .cyber-excel-cell {
    font-size: 0.8rem;
  }

  .cyber-excel-image {
    width: 40px;
    height: 40px;
  }

  .cyber-excel-delete {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }

  .cyber-total {
    font-size: 1rem;
  }
}
`}</style>
    </div>
  );
}

export default ListProduct;