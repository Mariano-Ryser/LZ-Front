import { useState, useMemo, useEffect, useRef } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useProduct } from "../../../hooks/useProducts";
import { useSales } from "../../../hooks/useSales";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import LoadMoreTrigger from "../../../components/shared/LoadMoreTrigger";

export default function VerkauftetArtikelPage() {
  const { products } = useProduct();
  const { sales, loading, error, refreshSales } = useSales();
  const [productFilter, setProductFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [liefFilter, setLiefFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Construimos array plano de items vendidos
  const soldItems = useMemo(() => {
    return sales.flatMap((sale) =>
      sale.items.map((item) => ({
        productName: item.product?.artikelName || item.artikelName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        clientName: sale.client?.name || "Kunde unbekannt",
        lieferschein: sale.lieferschein,
        date: new Date(sale.createdAt),
        dateString: new Date(sale.createdAt).toLocaleDateString('de-DE'),
        saleId: sale._id
      }))
    );
  }, [sales]);

  // Aplicar filtros
  const filteredItems = useMemo(() => {
    return soldItems.filter((item) => {
      const matchProduct = item.productName
        .toLowerCase()
        .includes(productFilter.toLowerCase());

      const matchClient = item.clientName
        .toLowerCase()
        .includes(clientFilter.toLowerCase());

      const matchLief = (item.lieferschein || "")
        .toString()
        .toLowerCase()
        .includes(liefFilter.toLowerCase());

      // Filtro de fecha
      const itemDate = item.date;
      const fromOK = dateFrom ? itemDate >= new Date(dateFrom) : true;
      const toOK = dateTo ? itemDate <= new Date(dateTo + 'T23:59:59') : true;

      return matchProduct && matchClient && matchLief && fromOK && toOK;
    });
  }, [productFilter, clientFilter, liefFilter, dateFrom, dateTo, soldItems]);

  // Configuración de infinite scroll
  const infiniteScrollConfig = {
    initialCount: 20,
    loadMoreCount: 20,
    loadDelay: 100,
    rootMargin: '200px'
  };

  const {
    visibleItems: visibleSoldItems,
    loadingMore,
    loadMoreRef,
    hasMore
  } = useInfiniteScroll(filteredItems, infiniteScrollConfig);

  // ⚡ ESTADÍSTICAS BASADAS EN TODOS LOS ITEMS FILTRADOS (no solo los visibles)
  const totalRevenue = filteredItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueProducts = new Set(filteredItems.map(item => item.productName)).size;

  // Función para refrescar datos
  const handleRefresh = async () => {
    await refreshSales();
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setProductFilter("");
    setClientFilter("");
    setLiefFilter("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <DashboardLayout>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1 className="page-title">Verkaufte Artikel</h1>
            <p className="page-subtitle">Übersicht aller verkauften Artikel und Verkaufsstatistiken</p>
          </div>
          
          {loading && (
            <div className="loading-message">
              🔄 Lade Verkaufsdaten...
            </div>
          )}
          {error && (
            <div className="error-message">
              ❌ Fehler: {error}
              <button onClick={handleRefresh} className="retry-button">
                Erneut versuchen
              </button>
            </div>
          )}
        </header>

        {/* Componente de Lista de Artículos integrado */}
        <div className="articles-list">
          {/* Panel de Estadísticas */}
          <div className="stats-panel">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{totalRevenue.toFixed(2)}CHF</div>
                <div className="stat-label">Gesamtumsatz</div>
                <div className="stat-subtext">Alle gefilterten Artikel</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{totalItems}</div>
                <div className="stat-label">Verkaufte Einheiten</div>
                <div className="stat-subtext">Alle gefilterten Artikel</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{uniqueProducts}</div>
                <div className="stat-label">Einzigartige Artikel</div>
                <div className="stat-subtext">Alle gefilterten Artikel</div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="filters-section">
            <div className="filters-header">
              <div className="search-group">
                <div className="search-input-container">
                  <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Artikel suchen..."
                    className="search-input"
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    disabled={loading}
                  />
                  {productFilter && (
                    <button 
                      className="clear-button"
                      onClick={() => setProductFilter('')}
                      disabled={loading}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-controls">
                <input
                  type="text"
                  placeholder="Kunde suchen..."
                  className="filter-input"
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Lieferschein Nr..."
                  className="filter-input"
                  value={liefFilter}
                  onChange={(e) => setLiefFilter(e.target.value)}
                  disabled={loading}
                />
                <div className="date-input-group">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="date-input"
                    placeholder="Von"
                    disabled={loading}
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="date-input"
                    placeholder="Bis"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="filters-footer">
              {/* ⚡ CONTADOR DE RESULTADOS - Muestra todos los filtrados vs visibles */}
              <div className="results-info">
                <span>
                  {loading ? (
                    "Lade..."
                  ) : (
                    <>
                      <strong>{visibleSoldItems.length}</strong> von <strong>{filteredItems.length}</strong> Artikeln angezeigt
                      {hasMore && ` (${filteredItems.length - visibleSoldItems.length} mehr verfügbar)`}
                    </>
                  )}
                </span>
              </div>
              
              {(productFilter || clientFilter || liefFilter || dateFrom || dateTo) && (
                <button 
                  className="clear-filters-button"
                  onClick={clearFilters}
                  disabled={loading}
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Verkaufte Artikel werden geladen...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h3>Fehler beim Laden der Artikel</h3>
              <p>{error}</p>
              <button onClick={handleRefresh} className="retry-button large">
                Erneut versuchen
              </button>
            </div>
          ) : (
            <>
              {/* Vista Desktop - Tabla */}
              <div className="table-container desktop-view">
                {filteredItems.length === 0 ? ( // ⚡ Usar filteredItems.length para el empty state
                  <div className="empty-state">
                    {productFilter || clientFilter || liefFilter || dateFrom || dateTo ? (
                      <>
                        <div className="empty-icon">🔍</div>
                        <h3>Keine verkauften Artikel gefunden</h3>
                        <p>Keine Ergebnisse für Ihre Suchkriterien</p>
                        <button 
                          className="clear-filters-button"
                          onClick={clearFilters}
                        >
                          Filter zurücksetzen
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="empty-icon">📦</div>
                        <h3>Keine verkauften Artikel vorhanden</h3>
                        <p>Es wurden noch keine Artikel verkauft</p>
                      </>
                    )}
                  </div>
                ) : (
                  <table className="articles-table">
                    <thead>
                      <tr>
                        <th>Artikel</th>
                        <th>Menge</th>
                        <th>Einzelpreis</th>
                        <th>Gesamt</th>
                        <th>Kunde</th>
                        <th>Lieferschein</th>
                        <th>Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleSoldItems.map((row, idx) => (
                        <tr key={`${row.saleId}-${idx}`} className="table-row">
                          <td className="product-cell">
                            <div className="product-name">{row.productName}</div>
                          </td>
                          <td className="quantity-cell">
                            <span className="quantity-badge">{row.quantity}</span>
                          </td>
                          <td className="price-cell">{row.unitPrice.toFixed(2)}CHF</td>
                          <td className="total-cell">
                            <span className="total-amount">{row.lineTotal.toFixed(2)}CHF</span>
                          </td>
                          <td className="client-cell">{row.clientName}</td>
                          <td className="lieferschein-cell">
                            {row.lieferschein || <span className="empty-value">—</span>}
                          </td>
                          <td className="date-cell">{row.dateString}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Vista Mobile - Cards */}
              <div className="mobile-view">
                {filteredItems.length === 0 ? ( // ⚡ Usar filteredItems.length para el empty state
                  <div className="empty-state mobile">
                    {productFilter || clientFilter || liefFilter || dateFrom || dateTo ? (
                      <>
                        <div className="empty-icon">🔍</div>
                        <h3>Keine verkauften Artikel gefunden</h3>
                        <p>Keine Ergebnisse für Ihre Suchkriterien</p>
                        <button 
                          className="clear-filters-button"
                          onClick={clearFilters}
                        >
                          Filter zurücksetzen
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="empty-icon">📦</div>
                        <h3>Keine verkauften Artikel vorhanden</h3>
                        <p>Es wurden noch keine Artikel verkauft</p>
                      </>
                    )}
                  </div>
                ) : (
                  visibleSoldItems.map((row, idx) => (
                    <div key={`${row.saleId}-${idx}`} className="article-card">
                      <div className="card-header">
                        <h3 className="product-name">{row.productName}</h3>
                        <span className="quantity-badge mobile">{row.quantity}</span>
                      </div>
                      
                      <div className="card-details">
                        <div className="detail-row">
                          <span className="detail-label">Kunde:</span>
                          <span className="detail-value">{row.clientName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Lieferschein:</span>
                          <span className="detail-value">{row.lieferschein || '—'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Datum:</span>
                          <span className="detail-value">{row.dateString}</span>
                        </div>
                      </div>

                      <div className="price-section">
                        <div className="price-item">
                          <span className="price-label">Einzelpreis:</span>
                          <span className="price-value">{row.unitPrice.toFixed(2)}CHF</span>
                        </div>
                        <div className="price-item total">
                          <span className="price-label">Gesamt:</span>
                          <span className="price-value">{row.lineTotal.toFixed(2)}CHF</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Load More Trigger */}
              {hasMore && (
                <div className="load-more-section">
                  <LoadMoreTrigger
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                    loadMoreRef={loadMoreRef}
                    customMessage={`Mehr Artikel laden (${filteredItems.length - visibleSoldItems.length} verfügbar)`}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .container {
          margin: 0px;
          padding: 0px;
          min-height: 100vh;
        }

        .header {
          margin-bottom: 30px;
          position: relative;
        }

        .header-content {
          margin-bottom: 10px;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .page-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin: 0;
          font-weight: 400;
        }

        .loading-message, .error-message {
          padding: 10px 15px;
          border-radius: 6px;
          margin-top: 10px;
          font-size: 0.9rem;
        }

        .loading-message {
          background: #e3f2fd;
          color: #1976d2;
          border: 1px solid #bbdefb;
        }

        .error-message {
          background: #ffebee;
          color: #d32f2f;
          border: 1px solid #ffcdd2;
          display: flex;
          justify-content: between;
          align-items: center;
          gap: 10px;
        }

        .retry-button {
          background: #d32f2f;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .retry-button.large {
          padding: 10px 20px;
          font-size: 1rem;
          margin-top: 10px;
        }

        .retry-button:hover {
          background: #b71c1c;
        }

        /* Estilos del componente de artículos */
        .articles-list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        /* Panel de Estadísticas */
        .stats-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          padding: 2rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6c757d;
          font-weight: 500;
        }

        .stat-subtext {
          font-size: 0.75rem;
          color: #28a745;
          margin-top: 0.25rem;
        }

        /* Filtros */
        .filters-section {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e9ecef;
          background: #f8f9fa;
        }

        .filters-header {
          margin-bottom: 1rem;
        }

        .search-group {
          margin-bottom: 1rem;
        }

        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: #6c757d;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 0.95rem;
          background: white;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .clear-button {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-button:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .filter-controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-input {
          flex: 1;
          min-width: 180px;
          padding: 0.875rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 0.95rem;
          background: white;
          transition: all 0.2s ease;
        }

        .filter-input:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .date-input-group {
          display: flex;
          gap: 0.75rem;
          flex: 2;
          min-width: 280px;
        }

        .date-input {
          flex: 1;
          padding: 0.875rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 0.95rem;
          background: white;
          transition: all 0.2s ease;
          min-width: 140px;
        }

        .date-input:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .filters-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .results-info {
          font-size: 0.9rem;
          color: #6c757d;
        }

        .results-info strong {
          color: #495057;
        }

        .clear-filters-button {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background 0.2s ease;
        }

        .clear-filters-button:hover {
          background: #5a6268;
        }

        /* Loading States */
        .loading-container {
          padding: 4rem 2rem;
          text-align: center;
          color: #6c757d;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4caf50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          padding: 3rem 2rem;
          text-align: center;
          background: #f8f9fa;
          border-radius: 8px;
          margin: 1rem;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        /* Tabla Desktop */
        .table-container {
          overflow-x: auto;
        }

        .articles-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .articles-table th {
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

        .articles-table td {
          padding: 1.25rem;
          border-bottom: 1px solid #e9ecef;
          color: #495057;
          font-size: 0.95rem;
        }

        .table-row {
          transition: background-color 0.15s ease;
        }

        .table-row:hover {
          background-color: #f8f9fa;
        }

        .table-row:last-child td {
          border-bottom: none;
        }

        .product-cell {
          max-width: 250px;
        }

        .product-name {
          font-weight: 500;
          color: #333;
          margin: 0;
          line-height: 1.4;
        }

        .quantity-badge {
          background: #4caf50;
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
        }

        .price-cell, .total-cell {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          white-space: nowrap;
        }

        .total-amount {
          font-weight: 600;
          color: #333;
        }

        .client-cell {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .empty-value {
          color: #adb5bd;
          font-style: italic;
        }

        .date-cell {
          white-space: nowrap;
          color: #6c757d;
          font-size: 0.9rem;
        }

        /* Cards Mobile */
        .mobile-view {
          display: none;
        }

        .article-card {
          padding: 1.5rem;
          border-bottom: 1px solid #e9ecef;
          transition: background-color 0.15s ease;
          background: white;
        }

        .article-card:hover {
          background-color: #f8f9fa;
        }

        .article-card:last-child {
          border-bottom: none;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .product-name {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          flex: 1;
          line-height: 1.4;
        }

        .quantity-badge.mobile {
          background: #4caf50;
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .card-details {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          font-size: 0.85rem;
          color: #6c757d;
          font-weight: 500;
        }

        .detail-value {
          font-size: 0.9rem;
          color: #495057;
          font-weight: 500;
          text-align: right;
        }

        .price-section {
          display: grid;
          gap: 0.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid #e9ecef;
        }

        .price-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-item.total {
          font-weight: 600;
        }

        .price-label {
          font-size: 0.9rem;
          color: #6c757d;
        }

        .price-value {
          font-size: 0.95rem;
          color: #333;
          font-weight: 500;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        }

        /* Empty State */
        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          color: #6c757d;
          background: white;
        }

        .empty-state.mobile {
          padding: 3rem 1.5rem;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 0.75rem 0;
          color: #495057;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* Load More Section */
        .load-more-section {
          padding: 2rem;
          border-top: 1px solid #e9ecef;
          background: #f8f9fa;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .stats-panel {
            grid-template-columns: repeat(2, 1fr);
            padding: 1.5rem;
          }
          
          .filters-section {
            padding: 1.25rem 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .desktop-view {
            display: none;
          }

          .mobile-view {
            display: block;
          }

          .stats-panel {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            padding: 1.25rem;
          }

          .stat-card {
            padding: 1.25rem;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .filters-section {
            padding: 1rem 1.25rem;
          }

          .filter-controls {
            flex-direction: column;
            gap: 0.75rem;
          }

          .filter-input, .date-input-group {
            width: 100%;
            min-width: auto;
          }

          .date-input-group {
            flex-direction: column;
          }

          .search-input-container {
            max-width: none;
          }

          .filters-footer {
            flex-direction: column;
            align-items: flex-start;
          }

          .container {
            padding: 15px;
          }

          .page-title {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .article-card {
            padding: 1.25rem;
          }

          .card-header {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }

          .quantity-badge.mobile {
            align-self: flex-start;
          }

          .stats-panel {
            padding: 1rem;
          }

          .stat-card {
            padding: 1rem;
          }

          .filters-section {
            padding: 1rem;
          }

          .container {
            padding: 10px;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-subtitle {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}