import { useState, useEffect } from 'react';
import { 
  getSales, 
  createSaleAPI, 
  updateSaleAPI 
} from '../services/saleService';

export function useSales(limit = 20) {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 🔄 Cargar ventas paginadas
  const fetchSales = async (pageToLoad = 1, isRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`📡 Fetching sales page ${pageToLoad}...`);
      const data = await getSales(pageToLoad, limit);
      const newSales = data.sales || data || [];

      if (pageToLoad === 1 || isRefresh) {
        // Reset completo
        setSales(newSales);
      } else {
        // Append incremental
        setSales(prev => [...prev, ...newSales]);
      }

      setHasMore(newSales.length === limit);

    } catch (err) {
      console.error('❌ Error fetching sales:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Inicial + refresco
  useEffect(() => {
    setPage(1);
    fetchSales(1, true);
  }, [refreshTrigger]);

  // Paginar
  const loadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSales(nextPage);
  };

  // Crear venta - MEJORADO
  const createSale = async (payload) => {
    try {
      console.log('🟢 Creating sale...');
      const res = await createSaleAPI(payload);

      // Refrescar lista inmediatamente
      setRefreshTrigger(t => t + 1);
      
      return { success: true, sale: res.sale };
    } catch (err) {
      console.error('❌ Error creating sale:', err);
      return { success: false, message: err.message };
    }
  };

  // Editar venta - MEJORADO
  const updateSale = async (id, payload) => {
    try {
      console.log('🟡 Updating sale...');
      const res = await updateSaleAPI(id, payload);

      // Refrescar lista inmediatamente
      setRefreshTrigger(t => t + 1);
      
      return { success: true, sale: res.sale };
    } catch (err) {
      console.error('❌ Error updating sale:', err);
      return { success: false, message: err.message };
    }
  };

  // Función para refrescar manualmente
  const refreshSales = () => {
    setRefreshTrigger(t => t + 1);
  };

  return {
    sales,
    loading,
    error,
    hasMore,
    loadMore,
    createSale,
    updateSale,
    refreshSales, // Nueva función exportada
    refreshTrigger
  };
}