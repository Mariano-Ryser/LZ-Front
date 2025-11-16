const API = process.env.NEXT_PUBLIC_BACKEND_URL + '/clients';

// GET all
export async function getClients() {
  const res = await fetch(API);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Error al obtener clientes' }));
    throw new Error(errorData.message || 'Error al obtener clientes');
  }
  return res.json();
}

// CREATE
export async function createClientAPI(client) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  });
  
  const data = await res.json().catch(() => ({ message: 'Error de servidor' }));
  
  if (!res.ok) {
    throw new Error(data.message || 'Error creando cliente');
  }
  
  return data;
}

// UPDATE
export async function updateClientAPI(id, client) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  });
  
  const data = await res.json().catch(() => ({ message: 'Error de servidor' }));
  
  if (!res.ok) {
    throw new Error(data.message || 'Error editando cliente');
  }
  
  return data;
}

// DELETE
export async function deleteClientAPI(id) {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
  });
  
  const data = await res.json().catch(() => ({ message: 'Error de servidor' }));
  
  if (!res.ok) {
    throw new Error(data.message || 'Error eliminando cliente');
  }
  
  return data;
}