const API = process.env.NEXT_PUBLIC_BACKEND_URL + '/sales';

// -------------------------
// Helper universal para errores - MEJORADO
// -------------------------
async function handleResponse(res, defaultMessage) {
  console.log('🌐 API Response:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url
  });

  if (!res.ok) {
    let errorMessage = defaultMessage;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || defaultMessage;
      console.error('❌ API Error details:', errorData);
    } catch {
      errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  console.log('📄 API Response data:', data);
  return data;
}

// -------------------------
// GET all sales - CON TIMEOUT
// -------------------------
export async function getSales() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seg timeout

  try {
    const res = await fetch(API, { 
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    clearTimeout(timeoutId);
    return handleResponse(res, 'Error al obtener ventas');
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Timeout: El servidor tardó demasiado en responder');
    }
    throw error;
  }
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