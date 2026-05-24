export async function getHistory({ token }) {
  const res = await fetch('/api/chat/history', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function deleteHistory({ token, id }) {
  const res = await fetch(`/api/chat/history/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
