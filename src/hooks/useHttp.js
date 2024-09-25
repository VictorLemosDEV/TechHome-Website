import { useState, useCallback } from 'react';
import axios from 'axios';

export const useHttp = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const httpRequestHandler = useCallback(async (method, url, requestData = null) => {
    setLoading(true);
    setError(null); // Reset error before the request

    try {
      const config = {
        method: method,
        url: url,
        data: requestData,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios(config);
      setData(response.data); // Update state with the response data
      return response.data; // Return the response data
    } catch (err) {
      setError(err.message); // Set error message in case of failure
      throw err; // Re-throw the error so it can be handled in the component if needed
    } finally {
      setLoading(false); // Stop loading when request is finished
    }
  }, []);

  return { data, error, loading, httpRequestHandler };
};
