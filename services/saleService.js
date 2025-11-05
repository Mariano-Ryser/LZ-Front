const API = process.env.NEXT_PUBLIC_BACKEND_URL + '/sales';

// -------------------------
// Helper universal para errores
// -------------------------
async function handleResponse(res, defaultMessage) {
  if (!res.ok) {
    let err = null;
    try {
      err = await res.json();
    } catch {}
    throw new Error(err?.message || defaultMessage);
  }
  return res.json();
}

// -------------------------
// GET all sales
// -------------------------
export async function getSales() {
  const res = await fetch(API, { method: 'GET' });
  return handleResponse(res, 'Error al obtener ventas');
}

// -------------------------
// CREATE sale
// -------------------------
export async function createSaleAPI(payload) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(res, 'Error creando venta');
}

// -------------------------
// UPDATE sale
// -------------------------
export async function updateSaleAPI(saleId, payload) {
  const res = await fetch(`${API}/${saleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(res, 'Error actualizando venta');
}
