export async function fetchRBAC() {
  try {
    let apiUrl = import.meta.env.VITE_API_URL || (window.location.origin + '/api');
    const res = await fetch(`${apiUrl}/rbac.php`);
    if (!res.ok) return { ok: false };
    return await res.json();
  } catch {
    return { ok: false };
  }
}
