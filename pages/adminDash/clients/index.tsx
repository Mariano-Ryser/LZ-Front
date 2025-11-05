import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useClients } from '../../../hooks/useClients';
import { useState } from 'react';
import ClientsCreator from './components/ClientCreator';

export default function ClientsPage() {
  const { clients, loading, createClient, fetchClients } = useClients();
  const [showModal, setShowModal] = useState(false);

  return (
    <DashboardLayout>
      <div className="container">
        <h1>Clientes</h1>
        <button className="new-btn" onClick={() => setShowModal(true)}>+ neuer Kunde</button>

        <ul>
          {loading ? (
            <li>Cargando...</li>
          ) : clients.length === 0 ? (
            <li>No hay clientes</li>
          ) : (
            clients.map(c => (
              <li key={c._id}>{c.name} — {c.email || '-'} — {c.phone || '-'}</li>
            ))
          )}
        </ul>

        {showModal && (
          <ClientsCreator
            onClose={() => setShowModal(false)}
            onCreated={fetchClients}
            createClient={createClient}
          />
        )}
      </div>

      <style jsx>{`
        .container { padding: 20px; }
        h1 { font-size: 28px; margin-bottom: 15px; }
        .new-btn {
          background: #4caf50;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 15px;
        }
        ul { list-style: none; padding: 0; }
        li { padding: 8px 0; border-bottom: 1px solid #eee; }
      `}</style>
    </DashboardLayout>
  );
}
