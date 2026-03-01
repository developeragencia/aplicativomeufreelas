export async function fetchRBAC() {
  try {
    let apiUrl = import.meta.env.VITE_API_URL || (window.location.origin + '/api');
    let emailParam = '';
    try {
      const raw = localStorage.getItem('meufreelas_user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.email) emailParam = `?email=${encodeURIComponent(u.email)}`;
      }
    } catch {}
    const res = await fetch(`${apiUrl}/rbac.php${emailParam}`);
    if (!res.ok) return { ok: false };
    return await res.json();
  } catch {
    return { ok: false };
  }
}
