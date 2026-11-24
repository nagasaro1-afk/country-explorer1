const CACHE_MS = 3600000; // 1 hour

async function cachedFetch(url) {
  try {
    const c = JSON.parse(localStorage.getItem(url) || "null");
    if (c && Date.now() - c.time < CACHE_MS) return c.data;
  } catch (e) {}
  const res = await fetch(url);
  if (!res.ok) throw new Error("API status " + res.status);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Bad response");
  try { localStorage.setItem(url, JSON.stringify({ time: Date.now(), data })); } catch (e) {}
  return data;
}
