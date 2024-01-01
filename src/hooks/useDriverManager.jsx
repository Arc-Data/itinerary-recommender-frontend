import { useState } from "react";

const useDriverManager = (authTokens) => {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  const access = String(authTokens.access);
  const [driver, setDriver] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const getDrivers = async (page, query = "", type = "") => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/driver/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      const data = await response.json();
      setDriver(data);
      setResult(data); 
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    driver,
    result,
    error,
    loading,
    getDrivers,
  };
};

export default useDriverManager;
