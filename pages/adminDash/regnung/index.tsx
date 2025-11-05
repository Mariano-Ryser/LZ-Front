import { useState, useMemo } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useSales } from "../../../hooks/useSales";
import RechnungCreator from "./components/RechnungCreator";
import RechnungPrint from "./components/RechnungPrint";
import RechnungUpdate from "./components/RechnungUpdate";

export default function SalesPage() {
  const { sales, fetchSales } = useSales(); // <-- agregamos fetchSales
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // FILTRO POR STATUS
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

  const formatCurrency = (amount:number) => Number(amount).toFixed(2);

  const getStatusColor = (status:string  ) => {
    if (status === "paid") return "#8ee7a3ff";
    if (status === "cancelled") return "#fa8992ff";
    if (status === "pending") return "#8ce4f3ff";
    return "white";
  };

  
  return (
    <DashboardLayout>
      <div className="container">
        <h1 className="title">Rechnungen</h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Buscar por cliente o número de factura..."
            className="input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <input
            type="date"
            value={dateFilter}
            className="input"
            onChange={e => setDateFilter(e.target.value)}
          />
          <select
            className="input"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">-- Todos los estados --</option>
            <option value="paid">bezahlt</option>
            <option value="pending">ausstehend</option>
            <option value="cancelled">storniert</option>
          </select>
          <button className="create-btn" onClick={() => setOpenModal(true)}>
            ➕ Neue Rechnung  
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Lieferschein</th>
              <th>Total</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s._id} onClick={() => setSelectedSale(s)} style={{ backgroundColor: getStatusColor(s.status) }}>
                <td>{new Date(s.createdAt).toLocaleString()}</td>
                <td>{s.clientSnapshot?.name || s.client?.name}</td>
                <td>{s.lieferschein}</td>
                <td>{formatCurrency(s.total)} €</td>
                <td>{s.status}</td>
                <td style={{ display: "flex", gap: "5px" }}>
                  {/* <button
                    className="print-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle print action
                    }}
                  >
                    🖨 Drucken
                  </button> */}
                  <button
                    className="edit-btn"
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

        {selectedSale && (
          <RechnungPrint
            sale={selectedSale}
            onClose={() => setSelectedSale(null)}
          />
        )}

 {openModal && (
  <div className="modal-backdrop">
    <div className="modal">
      <button className="close-btn" onClick={() => setOpenModal(false)}>
        ✖
      </button>
      <RechnungCreator 
        onDone={() => setOpenModal(false)}
        refresh={fetchSales}            // ✅ aquí pasamos fetchSales
      />
    </div>
  </div>
)}

        {updateModalOpen && saleToEdit && (
          <RechnungUpdate
            sale={saleToEdit}
            onClose={() => setUpdateModalOpen(false)}
            onSaved={fetchSales} // <-- PASAMOS fetchSales para actualizar la lista
          />
        )}
      </div>

      <style jsx>{`
        .title { font-size: 30px; text-align: center; }
        .filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
        .input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 6px; min-width: 180px; }
        .create-btn { background: #55c56fff; color: black; padding: 10px 14px; border-radius: 6px; border: none; cursor: pointer; }
        .table { width: 100%; border-collapse: collapse; background: white; }
        th, td { padding: 12px; text-align: left; }
        tr:hover{  cursor: pointer;  }
        .print-btn { padding: 4px 8px; font-size: 14px; border-radius: 4px; border: none; background: #007bff; color: white; cursor: pointer; transition: 0.1s;}
        .print-btn:hover { background: #0056b3; }
        .edit-btn { padding: 4px 8px; font-size: 14px; border-radius: 4px; border: none; background: #41ff07ff; color: #000; cursor: pointer; transition: 0.1s; }
        .edit-btn:hover { background: #32c207ff; }
        .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal { background: white; padding: 25px; width: 700px; max-width: 95%; border-radius: 10px; position: relative; overflow-y: auto; max-height: 100vh; }
        .close-btn { background: transparent; border: none; font-size: 22px; position: absolute; top: 10px; right: 10px; cursor: pointer; }
        @media (max-width: 768px) { 
          .modal { background: white; padding: 25px; width: 700px; max-width: 95%; border-radius: 10px; position: relative; overflow-y: auto; max-height: 110vh; }
          .filters { flex-direction: column; } 
          th, td { padding:10px; font-size: 10px; }
          .title { font-size: 20px; text-align: center; }
          .create-btn { padding: 8px 12px; font-size: 15px; }
           

           }
      `}</style>
    </DashboardLayout>
  );
}
