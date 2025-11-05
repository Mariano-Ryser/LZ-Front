export default function ArticleList({ products = [], sales = [] }) {
  if (!sales.length) return <p>No hay ventas registradas.</p>;

  // 1️⃣ Extraemos todos los items de todas las ventas
  const allItems = sales.flatMap(s => s.items);

  // 2️⃣ Creamos un mapa de productos vendidos
  const productMap = {};

  allItems.forEach(item => {
    const prodId = item.product._id; // ✅ Usamos el product poblado
    if (!productMap[prodId]) {
      productMap[prodId] = {
        artikelName: item.product.artikelName,
        price: item.product.price ?? item.unitPrice,
        soldQty: 0,
        totalRevenue: 0
      };
    }
    productMap[prodId].soldQty += item.quantity;
    productMap[prodId].totalRevenue += item.lineTotal;
  });

  // 3️⃣ Convertimos el mapa a array
  const productStats = Object.values(productMap);

  // 4️⃣ Ordenar por cantidad vendida descendente
  productStats.sort((a, b) => b.soldQty - a.soldQty);

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Vendido</th>
            <th>Precio Unitario (€)</th>
            <th>Total Vendido (€)</th>
          </tr>
        </thead>
        <tbody>
          {productStats.map((p, idx) => (
            <tr key={idx}>
              <td>{p.artikelName}</td>
              <td>{p.soldQty}</td>
              <td>{p.price.toFixed(2)}</td>
              <td>{p.totalRevenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .table-wrapper {
          overflow-x: auto;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
          padding: 10px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
        }
        th, td {
          padding: 12px 16px;
          text-align: left;
        }
        thead {
          background: #4CAF50;
          color: white;
        }
        tbody tr:nth-child(even) {
          background: #f9f9f9;
        }
        tbody tr:hover {
          background: #e6f7ff;
        }
        th {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
