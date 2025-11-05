import { useState, useEffect } from 'react';
import { getSales, createSaleAPI, updateSaleAPI } from '../services/saleService';

export function useSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener ventas
  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await getSales();
      setSales(data.sales || data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales(); }, []);

  // Crear venta + refrescar (como pediste)
  const createSale = async (payload) => {
    setLoading(true);
    try {
      const res = await createSaleAPI(payload);

      // ✅ Refresca toda la lista igual que updateSale
      await fetchSales();

      return { success: true, sale: res.sale || res };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar venta + refrescar
  const updateSale = async (saleId, payload) => {
    setLoading(true);
    try {
      const res = await updateSaleAPI(saleId, payload);

      // ✅ Mantengo tu lógica: refresco todo
      await fetchSales();

      return { success: true, sale: res.sale };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { sales, loading, error, fetchSales, createSale, updateSale };
}
