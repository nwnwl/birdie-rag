export async function getFiles(token) {
  const res = await fetch("/api/documents/", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function uploadFile({ file, token }) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/documents/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function renameFile({ id, name, token }) {
  const res = await fetch(`/api/documents/${id}/rename`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function deleteFile({ id, token }) {
  const res = await fetch(`/api/documents/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
