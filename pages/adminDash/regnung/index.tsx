import { useState, useMemo, useEffect, useRef } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useSales } from "../../../hooks/useSales";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import LoadMoreTrigger from "../../../components/shared/LoadMoreTrigger";
import RechnungCreator from "./components/RechnungCreator";
import RechnungPrint from "./components/RechnungPrint";
import RechnungUpdate from "./components/RechnungUpdate";

export default function SalesPage() {
  const { sales, loading, error, fetchSales } = useSales();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState(null);

  const filtered = useMemo(() => {
    return sales.filter(s => {
      const clientName = s.clientSnapshot?.name || s.client?.name || "";
      const matchName = clientName.toLowerCase().includes(search.toLowerCase());
      const matchLieferschein = s.lieferschein?.toString().includes(search);
      const matchDate = dateFilter
        ? new Date(s.createdAt).toISOString().slice(0, 10) === dateFilter
        : true;
      const matchStatus = statusFilter ? s.status === statusFilter : true;
      return (matchName || matchLieferschein) && matchDate && matchStatus;
    });
  }, [sales, search, dateFilter, statusFilter]);

  // Configuración simple para infinite scroll
  const infiniteScrollConfig = {
    initialCount: 20,
    loadMoreCount: 20,
    loadDelay: 100,
    rootMargin: '200px'
  };

  const {
    visibleItems: visibleSales,
    loadingMore,
    loadMoreRef,
    hasMore
  } = useInfiniteScroll(filtered, infiniteScrollConfig);

  const formatCurrency = (amount : number) => {
    return Number(amount || 0).toFixed(2);
  };

  const getStatusColor = (status : string) => {
    const colors = {
      "paid": "#e1f7d4ff",
      "cancelled": "#ffe6e9", 
      "pending": "#e3f7fc"
    };
    return colors[status] || "#f8f9fa";
  };

  const getStatusText = (status : string) => {
    const texts = {
      "paid": "Bezahlt",
      "cancelled": "Storniert",
      "pending": "Ausstehend"
    };
    return texts[status] || status;
  };

  const formatDate = (dateString : string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleRefresh = async () => {
    await fetchSales();
  };

  return (
    <DashboardLayout>
      <div className="sales-container">
        {/* Header */}
        <div className="sales-header">
          <div className="header-left">
            <h1>Rechnungen</h1>
            <p>Verwalten Sie Ihre Rechnungen und Verkäufe</p>
            
            {loading && (
              <div className="loading-message">
                🔄 Lade Rechnungen...
              </div>
            )}
            {error && (
              <div className="error-message">
                ❌ Fehler: {error}
                <button onClick={fetchSales} className="retry-button">
                  Erneut versuchen
                </button>
              </div>
            )}
          </div>
          
          <button 
            className="create-button" 
            onClick={() => setOpenModal(true)}
            disabled={loading}
          >
            <span>+</span>
            Neue Rechnung
          </button>
        </div>

        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Kunde oder Rechnungsnummer suchen..."
              className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              disabled={loading}
            />
            {search && (
              <button 
                className="clear-button"
                onClick={() => setSearch('')}
                disabled={loading}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="filter-controls">
            <input
              type="date"
              value={dateFilter}
              className="filter-input"
              onChange={e => setDateFilter(e.target.value)}
              disabled={loading}
            />
            <select
              className="filter-input"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              disabled={loading}
            >
              <option value="">Alle Status</option>
              <option value="paid">Bezahlt</option>
              <option value="pending">Ausstehend</option>
              <option value="cancelled">Storniert</option>
            </select>
          </div>
          
          <div className="results-info">
            <span>
              {loading ? (
                "Lade..."
              ) : (
                <>
                  <strong>{visibleSales.length}</strong> von <strong>{filtered.length}</strong> Rechnungen
                  {hasMore && ` (${filtered.length - visibleSales.length} mehr verfügbar)`}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Rechnungen werden geladen...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Fehler beim Laden der Rechnungen</h3>
            <p>{error}</p>
            <button onClick={fetchSales} className="retry-button large">
              Erneut versuchen
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="desktop-table">
              {visibleSales.length === 0 ? (
                <div className="empty-state">
                  {search || dateFilter || statusFilter ? (
                    <>
                      <div className="empty-icon">🔍</div>
                      <h3>Keine Rechnungen gefunden</h3>
                      <p>Keine Ergebnisse für Ihre Suchkriterien</p>
                      <button 
                        className="clear-filters-button"
                        onClick={() => {
                          setSearch('');
                          setDateFilter('');
                          setStatusFilter('');
                        }}
                      >
                        Filter zurücksetzen
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="empty-icon">🧾</div>
                      <h3>Keine Rechnungen vorhanden</h3>
                      <p>Erstellen Sie Ihre erste Rechnung</p>
                      <button 
                        className="create-button outline"
                        onClick={() => setOpenModal(true)}
                      >
                        Erste Rechnung erstellen
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Kunde</th>
                      <th>Lieferschein</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSales.map(s => (
                      <tr 
                        key={s._id} 
                        className="table-row"
                        onClick={() => setSelectedSale(s)}
                      >
                        <td>{formatDate(s.createdAt)}</td>
                        <td className="client-name">
                          {s.clientSnapshot?.name || s.client?.name || 'Unbekannt'}
                        </td>
                        <td>{s.lieferschein || '-'}</td>
                        <td className="total-amount">{formatCurrency(s.total)} €</td>
                        <td>
                          <span 
                            className="status-tag"
                            style={{ backgroundColor: getStatusColor(s.status) }}
                          >
                            {getStatusText(s.status)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="edit-button"
                            onClick={(e) => {
                              setSaleToEdit(s);
                              setUpdateModalOpen(true);
                              e.stopPropagation();
                            }}
                          >
                            Bearbeiten
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="mobile-cards">
              {visibleSales.length === 0 ? (
                <div className="empty-state mobile">
                  {search || dateFilter || statusFilter ? (
                    <>
                      <div className="empty-icon">🔍</div>
                      <h3>Keine Rechnungen gefunden</h3>
                      <p>Keine Ergebnisse für Ihre Suchkriterien</p>
                      <button 
                        className="clear-filters-button"
                        onClick={() => {
                          setSearch('');
                          setDateFilter('');
                          setStatusFilter('');
                        }}
                      >
                        Filter zurücksetzen
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="empty-icon">🧾</div>
                      <h3>Keine Rechnungen vorhanden</h3>
                      <p>Erstellen Sie Ihre erste Rechnung</p>
                      <button 
                        className="create-button outline"
                        onClick={() => setOpenModal(true)}
                      >
                        Erste Rechnung erstellen
                      </button>
                    </>
                  )}
                </div>
              ) : (
                visibleSales.map(s => (
                  <div 
                    key={s._id} 
                    className="sale-card"
                    onClick={() => setSelectedSale(s)}
                    style={{ borderLeftColor: getStatusColor(s.status) }}
                  >
                    <div className="card-header">
                      <div className="card-client">
                        <h3>{s.clientSnapshot?.name || s.client?.name || 'Unbekannt'}</h3>
                        <span className="card-date">{formatDate(s.createdAt)}</span>
                      </div>
                      <span 
                        className="status-tag mobile"
                        style={{ backgroundColor: getStatusColor(s.status) }}
                      >
                        {getStatusText(s.status)}
                      </span>
                    </div>
                    
                    <div className="card-details">
                      <div className="detail-row">
                        <span>Lieferschein:</span>
                        <span>{s.lieferschein || '-'}</span>
                      </div>
                      <div className="detail-row">
                        <span>Total:</span>
                        <span className="card-total">{formatCurrency(s.total)} €</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        className="edit-button mobile"
                        onClick={(e) => {
                          setSaleToEdit(s);
                          setUpdateModalOpen(true);
                          e.stopPropagation();
                        }}
                      >
                        Bearbeiten
                      </button>
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
                  customMessage={`Mehr Rechnungen laden (${filtered.length - visibleSales.length} verfügbar)`}
                />
              </div>
            )}
          </>
        )}

        {/* Modals */}
        {selectedSale && (
          <RechnungPrint
            sale={selectedSale}
            onClose={() => setSelectedSale(null)}
          />
        )}

        {openModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setOpenModal(false)}>✖</button>
              <RechnungCreator 
                onDone={() => setOpenModal(false)}
                refresh={handleRefresh}
              />
            </div>
          </div>
        )}

        {updateModalOpen && saleToEdit && (
          <RechnungUpdate
            sale={saleToEdit}
            onClose={() => setUpdateModalOpen(false)}
            onSaved={handleRefresh}
          />
        )}
      </div>

      <style jsx>{`
        .sales-container {
          padding: 20px;
          min-height: 100vh;
          background: #f5f5f5;
        }

        /* Header Styles */
        .sales-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          gap: 20px;
        }

        .header-left h1 {
          margin: 0 0 8px 0;
          font-size: 2rem;
          color: #333;
          font-weight: 700;
        }

        .header-left p {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 1rem;
        }

        .loading-message {
          background: #e3f2fd;
          color: #1565c0;
          padding: 10px 15px;
          border-radius: 6px;
          font-size: 0.9rem;
          display: inline-block;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 10px 15px;
          border-radius: 6px;
          font-size: 0.9rem;
          display: inline-block;
        }

        .create-button {
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
          white-space: nowrap;
        }

        .create-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .create-button:not(:disabled):hover {
          background: #45a049;
          transform: translateY(-1px);
        }

        .create-button.outline {
          background: transparent;
          color: #4caf50;
          border: 2px solid #4caf50;
        }

        .create-button.outline:hover {
          background: #4caf50;
          color: white;
        }

        /* Filters Section */
        .filters-section {
          margin-bottom: 24px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 500px;
          margin-bottom: 12px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #666;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #4caf50;
        }

        .clear-button {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
        }

        .filter-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .filter-input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          min-width: 150px;
        }

        .results-info {
          font-size: 0.85rem;
          color: #666;
        }

        /* Loading and Error States */
        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          background: white;
          border-radius: 12px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4caf50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .retry-button {
          background: #4caf50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          margin-left: 10px;
        }

        .retry-button.large {
          padding: 12px 24px;
          font-size: 1rem;
          margin-top: 10px;
        }

        /* Desktop Table */
        .desktop-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .sales-table {
          width: 100%;
          border-collapse: collapse;
        }

        .sales-table th {
          background: #f8f9fa;
          padding: 16px;
          text-align: left;
          font-weight: 600;
          color: #333;
          font-size: 0.85rem;
          border-bottom: 2px solid #e9ecef;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sales-table td {
          padding: 16px;
          border-bottom: 1px solid #e9ecef;
          color: #333;
          font-size: 0.95rem;
        }

        .table-row {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .table-row:hover {
          background-color: #f8f9fa;
        }

        .client-name {
          font-weight: 500;
        }

        .total-amount {
          font-weight: 600;
          color: #333;
        }

        .status-tag {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
          min-width: 80px;
          text-align: center;
        }

        .edit-button {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .edit-button:hover {
          background: #5a6268;
        }

        /* Mobile Cards */
        .mobile-cards {
          display: none;
        }

        .sale-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-left: 4px solid #e9ecef;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sale-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .card-client h3 {
          margin: 0 0 4px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        .card-date {
          font-size: 0.85rem;
          color: #666;
        }

        .status-tag.mobile {
          font-size: 0.75rem;
          padding: 4px 8px;
        }

        .card-details {
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .detail-row span:first-child {
          color: #666;
          font-size: 0.85rem;
        }

        .card-total {
          font-weight: 600;
          color: #333;
          font-size: 1rem;
        }

        .card-actions {
          display: flex;
          justify-content: flex-end;
        }

        .edit-button.mobile {
          width: auto;
        }

        /* Empty States */
        .empty-state {
          padding: 80px 20px;
          text-align: center;
          color: #666;
        }

        .empty-state.mobile {
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 12px 0;
          color: #333;
          font-size: 1.25rem;
        }

        .empty-state p {
          margin: 0 0 20px 0;
          font-size: 0.95rem;
        }

        .clear-filters-button {
          background: #4caf50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        /* Load More Section */
        .load-more-section {
          padding: 20px;
          display: flex;
          justify-content: center;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          overflow: auto;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sales-container {
            padding: 16px;
          }

          .sales-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-left {
            text-align: center;
          }

          .desktop-table {
            display: none;
          }

          .mobile-cards {
            display: block;
          }

          .filter-controls {
            flex-direction: column;
          }

          .filter-input {
            width: 100%;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
}