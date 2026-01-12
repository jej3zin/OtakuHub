const CACHE_TTL = 1000 * 60 * 10; // 10 min

export async function fetchWithCache(key, url) {
  const cached = localStorage.getItem(key);

  if (cached) {
    const { data, time } = JSON.parse(cached);
    if (Date.now() - time < CACHE_TTL) return data;
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      const json = await res.json();

      localStorage.setItem(
        key,
        JSON.stringify({ data: json.data, time: Date.now() })
      );

      return json.data;
    } catch (e) {
      if (attempt === 3) throw e;
    }
  }
}
