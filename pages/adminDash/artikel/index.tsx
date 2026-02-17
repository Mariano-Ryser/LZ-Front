import { useState, useContext } from 'react';
import { AuthContext } from '../../../components/auth/AuthProvider';
import { useProduct } from '../../../hooks/useProducts';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import LoadMoreTrigger from '../../../components/shared/LoadMoreTrigger';
import { ProductCreator } from './_components/ProductCreator';
import { ProductEditor } from './_components/ProductEditor';
import ExportExcelButton from '../../../components/ui/ExportExcelButton'; // Asegúrate de que la ruta sea correcta



export function ListProduct() {
  const {
    product,
    products,
    loading,
    error, // error a mapear en el frontend. 
    setError,
    refreshTrigger,
    updateProduct,
    handleChange,
    createProduct,
    deleteProductImage,
    deleteProduct,
    setProductToEdit,
    refreshProducts, // ← NUEVO: agregar refreshProducts aquí
  } = useProduct();

  const { isAuthenticated } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // 🎯 NUEVO: Estado para el filtro de stock
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'in-stock', 'low-stock', 'out-of-stock'
  // 🎯 NUEVO: Estado para el ordenamiento
  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'

  
  // 🎯 NUEVO: Funciones de éxito actualizadas
  const handleCreateSuccess = () => {
    setShowModal(false);
    refreshProducts(); // ← En lugar de handleRefresh
  };

  const handleUpdateSuccess = () => {
    setEditingProduct(null);
    refreshProducts(); // ← En lugar de handleRefresh
  };

  // 🎯 NUEVO: Función para determinar el estado del stock
  const getStockStatus = (product) => {
    const stock = product.stock || 0;
    if (stock <= 0) return 'out-of-stock';
    if (stock < 50) return 'low-stock';
    return 'in-stock';
  };

  // 🎯 ACTUALIZADO: Filtrar y ordenar productos
  const filteredProducts = products
    .filter((p) => {
      // Filtro de búsqueda
      const matchesSearch = `${p.artikelName} ${p.artikelNumber} ${p.lagerPlatz}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de stock
      const stockStatus = getStockStatus(p);
      const matchesStock = stockFilter === 'all' || stockStatus === stockFilter;
      
      return matchesSearch && matchesStock;
    })
    // 🎯 NUEVO: Ordenar productos
    .sort((a, b) => {
      if (sortOrder === 'none') return 0;
      
      const stockA = a.stock || 0;
      const stockB = b.stock || 0;
      
      if (sortOrder === 'asc') {
        return stockA - stockB; // Menor a mayor
      } else if (sortOrder === 'desc') {
        return stockB - stockA; // Mayor a menor
      }
      
      return 0;
    });

  // Usar el hook de infinite scroll CON EL TRIGGER
  const {
    visibleItems: visibleProducts,
    loadingMore,
    loadMoreRef,
    hasMore
  } = useInfiniteScroll(filteredProducts, {
    initialCount: 20,
    loadMoreCount: 20,
    loadDelay: 100, 
  }, refreshTrigger);

  return (
    <DashboardLayout>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1>Artikelliste</h1>
            <p className="page-subtitle">Verwalten Sie Ihre Produktliste</p>
              <div className="export-section">
          <ExportExcelButton 
            data={filteredProducts}
            filename="Artikelliste"
            buttonText="Excel"
            disabled={filteredProducts.length === 0 || products.length === 0}
          />
        </div>
          </div>

          
          {isAuthenticated && (
            <button onClick={() => setShowModal(true)} className="new-btn">
              <span className="plus">+</span>
              Neuer Artikel
            </button>
          )}
        </header>

        {/* Buscador y Filtros */}
        <div className="search-section">
          <div className="filters-container">
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                placeholder="Artikel suchen... (Name, Nummer, Lagerplatz)"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="filter-group">
              {/* 🎯 NUEVO: Filtro de Stock */}
              <div className="stock-filter-container">
                <label htmlFor="stock-filter" className="filter-label">
                  Bestandsfilter:
                </label>
                <select
                  id="stock-filter"
                  className="stock-filter"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <option value="all">Alle Artikel</option>
                  <option value="in-stock">Auf Lager (≥50)</option>
                  <option value="low-stock">Wenig Bestand (1-49)</option>
                  <option value="out-of-stock">Nicht auf Lager (0)</option>
                </select>
              </div>

              {/* 🎯 NUEVO: Filtro de Ordenamiento */}
              <div className="sort-filter-container">
                <label htmlFor="sort-order" className="filter-label">
                  Sortieren:
                </label>
                <select
                  id="sort-order"
                  className="sort-filter"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="none">Standard</option>
                  <option value="asc">Bestand: ⬆️ Niedrig zu Hoch</option>
                  <option value="desc">Bestand: ⬇️ Hoch zu Niedrig</option>
                </select>
              </div>
            </div>
          </div>

          <div className="search-stats">
            <span className="results-count">
              {visibleProducts.length} von {filteredProducts.length} Artikeln angezeigt
              {hasMore && ` (${filteredProducts.length - visibleProducts.length} mehr verfügbar)`}
            </span>
            <div className="active-filters">
              {/* 🎯 NUEVO: Mostrar filtro activo */}
              {stockFilter !== 'all' && (
                <span className="active-filter">
                  Filter: { 
                    stockFilter === 'in-stock' ? 'Auf Lager' : 
                    stockFilter === 'low-stock' ? 'Wenig Bestand' : 
                    'Nicht auf Lager'
                  }
                  <button 
                    className="clear-filter"
                    onClick={() => setStockFilter('all')}
                  >
                    ✕
                  </button>
                </span>
              )}
              {/* 🎯 NUEVO: Mostrar ordenamiento activo */}
              {sortOrder !== 'none' && (
                <span className="active-filter">
                  Sortierung: { 
                    sortOrder === 'asc' ? 'Niedrig zu Hoch' : 
                    'Hoch zu Niedrig'
                  }
                  <button 
                    className="clear-filter"
                    onClick={() => setSortOrder('none')}
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabla tipo Excel */}
        <div className="table-container">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              Laden...
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="empty-state">
              {searchTerm || stockFilter !== 'all' || sortOrder !== 'none' ? (
                <>
                  <div className="empty-icon">🔍</div>
                  <h3>Keine Artikel gefunden</h3>
                  <p>
                    {searchTerm && (stockFilter !== 'all' || sortOrder !== 'none')
                      ? `Keine Ergebnisse für "${searchTerm}" mit den ausgewählten Filtern`
                      : searchTerm 
                      ? `Keine Ergebnisse für "${searchTerm}"`
                      : 'Keine Artikel mit den ausgewählten Filtern'
                    }
                  </p>
                  <div className="empty-state-actions">
                    {searchTerm && (
                      <button 
                        className="clear-search-btn"
                        onClick={() => setSearchTerm('')}
                      >
                        Suche zurücksetzen
                      </button>
                    )}
                    {(stockFilter !== 'all' || sortOrder !== 'none') && (
                      <button 
                        className="clear-search-btn"
                        onClick={() => {
                          setStockFilter('all');
                          setSortOrder('none');
                        }}
                      >
                        Alle Filter zurücksetzen
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="empty-icon">📦</div>
                  <h3>Keine Artikel vorhanden</h3>
                  <p>Erstellen Sie Ihren ersten Artikel</p>
                </>
              )}
            </div>
          ) : (
            <>
              <table className="products-table">
                <thead>
                  <tr>
                    <th className="col-name">Artikelname</th>
                    <th className="col-lager">Lagerplatz</th>
                    <th className="col-price">Preis (CHF)</th>
                    <th className="col-stock">
                      Bestand
                      {sortOrder !== 'none' && (
                        <span className="sort-indicator">
                          {sortOrder === 'asc' ? ' ⬆️' : ' ⬇️'}
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((product) => (
                    <tr 
                      key={product._id} 
                      className="product-row"
                      onClick={() => {
                        setEditingProduct(product);
                        setProductToEdit(product);
                      }}
                    >
                      <td className="product-name">
                        {product.artikelName}
                      </td>
                      <td className="product-lager">{product.lagerPlatz || '-'}</td>
                      <td className="product-price">
                        {product.price ? `CHF ${parseFloat(product.price).toFixed(2)}` : '-'}
                      </td>
                      <td className="product-stock">
                        <span className={`stock-badge ${getStockStatus(product)}`}>
                          {product.stock || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Load More Trigger */}
              <LoadMoreTrigger
                loadingMore={loadingMore}
                hasMore={hasMore}
                loadMoreRef={loadMoreRef}
                customMessage="Mehr Artikel laden"
              />
            </>
          )}
        </div>

        {editingProduct && (
          <ProductEditor
            product={editingProduct}
            handleChange={handleChange}
            deleteProductImage={deleteProductImage}
            updateProduct={async (e, updatedProduct) => {
              const result = await updateProduct(e, updatedProduct);
              if (result?.success) {
                handleUpdateSuccess(); // ← NUEVO: usar handleUpdateSuccess
              }
            }}
            deleteProduct={deleteProduct}
            loading={loading}
            error={error}
            onClose={() => setEditingProduct(null)}
          />
        )}

      {showModal && (
  <ProductCreator
    product={product} // ← Esto debe ser el product del hook useProduct
    handleChange={handleChange}
    createProduct={async (e) => {
      const result = await createProduct(e);
      if (result?.success) {
        handleCreateSuccess();
      }
    }}
    loading={loading}
    error={error}
    onClose={() => {
      setShowModal(false);
      // Limpiar errores al cerrar
      setError(null);
    }}
  />
)}
      </div>

      <style jsx>{`
        .container {
          margin: 0px;
          padding: 0px;
          min-height: 100vh;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .header-content {
          flex: 1;
        }
        
        h1 {
          font-size: 2rem;
          margin: 0 0 8px 0;
          color: #333;
          font-weight: 700;
        }
        
        .page-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin: 0;
          font-weight: 400;
        }
        
        .new-btn {
          background: #4caf50;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
          flex-shrink: 0;
        }
        
        .new-btn:hover {
          background: #45a049;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
        }
        
        .plus {
          font-size: 1.2em;
          font-weight: bold;
        }
        
        /* Buscador y Filtros */
        .search-section {
          margin-bottom: 24px;
        }
        
        .filters-container {
          display: flex;
          gap: 16px;
          align-items: flex-end;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 300px;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          color: #6c757d;
          pointer-events: none;
          z-index: 2;
        }
        
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 0.95rem;
          background: white;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .search-input:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }
        
        .clear-search {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          transition: all 0.2s ease;
        }
        
        .clear-search:hover {
          background: #f8f9fa;
          color: #495057;
        }
        
        /* 🎯 NUEVO: Grupo de filtros */
        .filter-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        /* 🎯 NUEVO: Estilos para el filtro de stock */
        .stock-filter-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 200px;
        }
        
        /* 🎯 NUEVO: Estilos para el filtro de ordenamiento */
        .sort-filter-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 220px;
        }
        
        .filter-label {
          font-size: 0.85rem;
          color: #495057;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .stock-filter,
        .sort-filter {
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 0.95rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .stock-filter:focus,
        .sort-filter:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }
        
        .search-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .results-count {
          font-size: 0.85rem;
          color: #6c757d;
          font-weight: 500;
        }
        
        /* 🎯 NUEVO: Contenedor para filtros activos */
        .active-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        /* 🎯 NUEVO: Estilos para el filtro activo */
        .active-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #e3f2fd;
          color: #1976d2;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .clear-filter {
          background: none;
          border: none;
          color: #1976d2;
          cursor: pointer;
          padding: 2px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          font-size: 0.7rem;
          transition: all 0.2s ease;
        }
        
        .clear-filter:hover {
          background: #bbdefb;
        }
        
        /* Tabla Excel */
        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .products-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        
        .products-table th {
          background: #f8f9fa;
          padding: 1rem 1.25rem;
          text-align: left;
          font-weight: 600;
          color: #495057;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e9ecef;
          white-space: nowrap;
        }
        
        .products-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e9ecef;
          color: #495057;
          font-size: 0.95rem;
          vertical-align: middle;
        }
        
        .product-row {
          transition: background-color 0.15s ease;
          cursor: pointer;
        }
        
        .product-row:hover {
          background-color: #f8f9fa;
        }
        
        .product-row:last-child td {
          border-bottom: none;
        }
        
        /* Columnas específicas */
        .col-name { width: 50%; }
        .col-lager { width: 20%; }
        .col-price { width: 15%; }
        .col-stock { width: 15%; }
        
        .product-name {
          font-weight: 500;
          color: #333;
        }
        
        .product-lager {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          color: #6c757d;
        }
        
        .product-price {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-weight: 600;
          color: #333;
        }
        
        .stock-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
          min-width: 40px;
          text-align: center;
        }
        
        .stock-badge.in-stock {
          background: #d4edda;
          color: #155724;
        }
        
        .stock-badge.low-stock {
          background: #fff3cd;
          color: #856404;
        }
        
        .stock-badge.out-of-stock {
          background: #f8d7da;
          color: #721c24;
        }
        
        /* 🎯 NUEVO: Indicador de ordenamiento en la tabla */
        .sort-indicator {
          margin-left: 4px;
          font-size: 0.9em;
        }
        
        /* Estados de carga y vacío */
        .loading {
          padding: 60px 20px;
          text-align: center;
          color: #6c757d;
          font-size: 1.1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f8f9fa;
          border-top: 3px solid #4caf50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .empty-state {
          padding: 80px 20px;
          text-align: center;
          color: #6c757d;
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }
        
        .empty-state h3 {
          margin: 0 0 12px 0;
          color: #495057;
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .empty-state p {
          margin: 0 0 20px 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        
        /* 🎯 NUEVO: Acciones en estado vacío */
        .empty-state-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .clear-search-btn {
          background: #4caf50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .clear-search-btn:hover {
          background: #45a049;
          transform: translateY(-1px);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
          
          .header {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }
          
          .header-content {
            text-align: center;
          }
          
          h1 {
            font-size: 1.75rem;
          }
          
          .filters-container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-group {
            width: 100%;
          }
          
          .search-container {
            min-width: auto;
          }
          
          .stock-filter-container,
          .sort-filter-container {
            min-width: auto;
            width: 100%;
          }
          
          .table-container {
            overflow-x: auto;
          }
          
          .products-table {
            min-width: 500px;
          }
          
          .search-stats {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .active-filters {
            width: 100%;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 10px;
          }
          
          h1 {
            font-size: 1.5rem;
          }
          
          .page-subtitle {
            font-size: 0.9rem;
          }
          
          .search-input {
            font-size: 0.9rem;
            padding: 10px 14px 10px 42px;
          }
          
          .stock-filter,
          .sort-filter {
            padding: 10px 14px;
            font-size: 0.9rem;
          }
          
          .empty-state-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}

export default ListProduct;