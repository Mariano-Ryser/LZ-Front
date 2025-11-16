import { useState, useMemo } from "react";

export default function ArticleList({ sales = [] }) {
  // Estados de filtrado
  const [productFilter, setProductFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [liefFilter, setLiefFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  
  // Construimos array plano de items vendidos
  const soldItems = sales.flatMap((sale) =>
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
  }, [productFilter, clientFilter, liefFilter, dateFrom, dateTo, sales]);

  // Estadísticas
  const totalRevenue = filteredItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueProducts = new Set(filteredItems.map(item => item.productName)).size;

  return (
    <div className="articles-list">
      {/* Panel de Estadísticas */}
      <div className="stats-panel">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-value">€{totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Gesamtumsatz</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-value">{totalItems}</div>
            <div className="stat-label">Verkaufte Einheiten</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-value">{uniqueProducts}</div>
            <div className="stat-label">Einzigartige Artikel</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
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
            />
          </div>
        </div>

        <div className="filter-row">
          <input
            type="text"
            placeholder="Kunde suchen..."
            className="filter-input"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Lieferschein Nr..."
            className="filter-input"
            value={liefFilter}
            onChange={(e) => setLiefFilter(e.target.value)}
          />
          <div className="date-input-group">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="date-input"
              placeholder="Von"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="date-input"
              placeholder="Bis"
            />
          </div>
        </div>
      </div>

      {/* Vista Desktop - Tabla */}
      <div className="table-container desktop-view">
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
            {filteredItems.map((row, idx) => (
              <tr key={`${row.saleId}-${idx}`} className="table-row">
                <td className="product-cell">
                  <div className="product-name">{row.productName}</div>
                </td>
                <td className="quantity-cell">
                  <span className="quantity-badge">{row.quantity}</span>
                </td>
                <td className="price-cell">€{row.unitPrice.toFixed(2)}</td>
                <td className="total-cell">
                  <span className="total-amount">€{row.lineTotal.toFixed(2)}</span>
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
        
        {filteredItems.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Keine verkauften Artikel gefunden</h3>
            <p>Passen Sie die Filterkriterien an, um Ergebnisse zu sehen</p>
          </div>
        )}
      </div>

      {/* Vista Mobile - Cards */}
      <div className="mobile-view">
        {filteredItems.map((row, idx) => (
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
                <span className="price-value">€{row.unitPrice.toFixed(2)}</span>
              </div>
              <div className="price-item total">
                <span className="price-label">Gesamt:</span>
                <span className="price-value">€{row.lineTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="empty-state mobile">
            <div className="empty-icon">📦</div>
            <h3>Keine verkauften Artikel gefunden</h3>
            <p>Passen Sie die Filterkriterien an, um Ergebnisse zu sehen</p>
          </div>
        )}
      </div>

      <style jsx>{`
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

        /* Filtros */
        .filters-section {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e9ecef;
          background: #f8f9fa;
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

        .filter-row {
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

        /* Responsive */
        @media (max-width: 1024px) {
          .stats-panel {
            grid-template-columns: repeat(3, 1fr);
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

          .filter-row {
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
        }
      `}</style>
    </div>
  );
}