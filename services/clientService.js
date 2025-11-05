const API = process.env.NEXT_PUBLIC_BACKEND_URL + '/clients';

export async function getClients() {
  const res = await fetch(API);
  if (!res.ok) throw new Error('Error al obtener clientes');
  return res.json();
}

export async function createClientAPI(client) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  });
  if (!res.ok) throw new Error('Error creando cliente');
  return res.json();
}
