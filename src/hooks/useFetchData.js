import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchSneakers = () => {
  const [sneakers, setSneakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        const response = await axios.get('http://localhost:5500/sneakers');
        setSneakers(response.data.sneakers);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSneakers();
  }, []);

  return { sneakers, loading, error };
};

export default useFetchSneakers;
