// Tool to cache data in localStorage with a TTL (Time To Live) in minutes
export function setCache(key: string, value: any, ttlMinutes: number): void {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttlMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getCache(key: string): any | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null; // Item not found
  }
  const item = JSON.parse(itemStr);
  const now = new Date();

  // Check if the item has expired
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key); // Remove expired item
    return null;
  }

  return item.value; // Return the cached value
}
