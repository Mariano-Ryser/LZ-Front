import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useClients } from '../../../hooks/useClients';
import { useState, useMemo } from 'react';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import LoadMoreTrigger from '../../../components/shared/LoadMoreTrigger';
import ClientsCreator from './components/ClientCreator';
import ClientEditor from './components/ClientEditor';

export default function ClientsPage() {
  const { clients, loading, createClient, editClient, fetchClients, refreshTrigger } = useClients();
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (client) => {
    setEditingClient(client);
  };

  const handleCloseEdit = () => {
    setEditingClient(null);
  };

  // Filtrar clientes basado en el término de búsqueda
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;

    const term = searchTerm.toLowerCase().trim();
    return clients.filter(client => 
      client.name?.toLowerCase().includes(term) ||
      client.vorname?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.adresse?.toLowerCase().includes(term) ||
      client.phone?.includes(term)
    );
  }, [clients, searchTerm]);

  // Usar el hook de infinite scroll
const {
  visibleItems: visibleClients,
  loadingMore,
  loadMoreRef,
  hasMore
} = useInfiniteScroll(filteredClients, {
  initialCount: 10,        // Mostrar solo 5 inicialmente
  loadMoreCount: 3,       // Cargar de 3 en 3
  loadDelay: 300,         // Delay más corto para testing
  rootMargin: '100px'     // Menos margen para que se active más fácil
}, refreshTrigger);

  return (
    <DashboardLayout>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1>Kunden</h1>
            <p className="page-subtitle">Verwalten Sie Ihre Kundenliste</p>
          </div>
          <button className="new-btn" onClick={() => setShowModal(true)}>
            <span className="plus">+</span>
            Neuer Kunde
          </button>
        </header>

        {/* Buscador */}
        <div className="search-section">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Kunden suchen... (Name, Vorname, Email, Adresse, Telefon)"
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
          <div className="search-stats">
            <span className="results-count">
              {visibleClients.length} von {filteredClients.length} Kunden angezeigt
              {hasMore && ` (${filteredClients.length - visibleClients.length} mehr verfügbar)`}
            </span>
          </div>
        </div>

        <div className="clients-list">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              Laden...
            </div>
          ) : visibleClients.length === 0 ? ( // ✅ CORREGIDO: usar visibleClients en lugar de filteredClients
            <div className="empty-state">
              {searchTerm ? (
                <>
                  <div className="empty-icon">🔍</div>
                  <h3>Keine Kunden gefunden</h3>
                  <p>Keine Ergebnisse für "{searchTerm}"</p>
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    Suche zurücksetzen
                  </button>
                </>
              ) : (
                <>
                  <div className="empty-icon">👥</div>
                  <h3>Keine Kunden vorhanden</h3>
                  <p>Erstellen Sie Ihren ersten Kunden</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="clients-grid">
                {visibleClients.map(client => (
                  <div key={client._id} className="client-card">
                    <div className="client-info">
                      <h3>{client.vorname} {client.name}</h3>
                      <div className="client-details">
                        <div className="detail">
                          <span className="label">Email:</span>
                          <span className="value">{client.email || '-'}</span>
                        </div>
                        <div className="detail">
                          <span className="label">Adresse:</span>
                          <span className="value">{client.adresse || '-'}</span>
                        </div>
                        <div className="detail">
                          <span className="label">Telefon:</span>
                          <span className="value">{client.phone || '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="client-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(client)}
                      >
                        Bearbeiten
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Trigger reutilizable */}
              <LoadMoreTrigger
                loadingMore={loadingMore}
                hasMore={hasMore}
                loadMoreRef={loadMoreRef}
                customMessage="..."
              />
            </>
          )}
        </div>

        {showModal && (
          <ClientsCreator
            onClose={() => setShowModal(false)}
            onCreated={fetchClients}
            createClient={createClient}
          />
        )}

        {editingClient && (
          <ClientEditor
            client={editingClient}
            onClose={handleCloseEdit}
            onUpdated={fetchClients}
            updateClient={editClient}
          />
        )}
      </div>

      <style jsx>{`
        .container { 
          padding: 20px;
          min-height: 100vh;
          background: #f8f9fa;
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
        
        /* Buscador */
        .search-section {
          margin-bottom: 24px;
        }
        
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 600px;
          margin-bottom: 8px;
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
        
        .search-input::placeholder {
          color: #adb5bd;
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
        
        .search-stats {
          min-height: 20px;
        }
        
        .results-count {
          font-size: 0.85rem;
          color: #6c757d;
          font-weight: 500;
        }
        
        .clients-list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
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
        
        .clients-grid {
          display: flex;
          flex-direction: column;
        }
        
        .client-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
          transition: background-color 0.2s ease;
        }
        
        .client-card:hover {
          background: #f8f9fa;
        }
        
        .client-card:last-child {
          border-bottom: none;
        }
        
        .client-info {
          flex: 1;
        }
        
        .client-info h3 {
          margin: 0 0 12px 0;
          font-size: 1.2rem;
          color: #333;
          font-weight: 600;
        }
        
        .client-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .detail {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .label {
          font-weight: 500;
          color: #6c757d;
          min-width: 70px;
          font-size: 0.9rem;
        }
        
        .value {
          color: #333;
          font-size: 0.9rem;
        }
        
        .client-actions {
          margin-left: 20px;
          flex-shrink: 0;
        }
        
        .edit-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        
        .edit-btn:hover {
          background: #5a6268;
          transform: translateY(-1px);
        }

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
          
          .search-container {
            max-width: none;
          }
          
          .client-card {
            flex-direction: column;
            gap: 15px;
          }
          
          .client-actions {
            margin-left: 0;
            width: 100%;
          }
          
          .edit-btn {
            width: 100%;
            padding: 10px;
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
          
          .client-card {
            padding: 15px;
          }
          
          .detail {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
          
          .label {
            min-width: auto;
          }
          
          .search-input {
            font-size: 0.9rem;
            padding: 10px 14px 10px 42px;
          }
          
          .search-input::placeholder {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}