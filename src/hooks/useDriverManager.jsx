import { useState } from "react";

const useDriverManager = (authTokens) => {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  const access = String(authTokens.access);
  const [driver, setDriver] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const createDriver = async (driver) => {
    console.log(driver)
    
    try {
        const response = await fetch(`${backendUrl}/api/driver/add/`, {
            "method": "POST",
            "headers": {
                "Authorization": `Bearer ${access}`,
            },
            "body": driver
        })
        if (!response.ok) {
          throw new Error(`Failed to create driver. Status: ${response.status}`);
        }
        console.log(response)
        
        const data = await response.json()
        return data.id
    }
    catch (error) {
        console.log(error)
    }

}

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
      setDrivers(data);
      setResult(data); 
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getDriver = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/driver/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      const data = await response.json();
      setDriver(data);
      console.log(data)
      setResult(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    driver,
    drivers,
    result,
    error,
    loading,
    getDrivers,
    getDriver,
    createDriver,
  };
};

export default useDriverManager;
