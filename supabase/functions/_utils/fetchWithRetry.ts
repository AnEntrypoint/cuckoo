export const fetchWithRetry = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
};
