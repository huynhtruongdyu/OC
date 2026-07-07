export const apiClient = {
  get: async <T>(url: string) => {
    const res = await fetch(url);
    return res.json() as T;
  },
  post: async <T>(url: string, body: unknown) => {
    const res = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
    return res.json() as T;
  },
};
