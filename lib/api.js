export const callAPI = async (url, options = {}) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    };

    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "API Error");
    }

    return data;
  } catch (err) {
    console.error("API ERROR:", err);
    return { error: true, message: err.message || "Network error" };
  }
};

