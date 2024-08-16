import React from 'react';
import useFetchData from '../hooks/useFetchData';

const DataDisplay = () => {
  const { data, loading, error } = useFetchData('https://31b867de-bd9f-481e-ad70-682ea4a5a251-00-3j6oiun96ae2l.spock.replit.dev/sneakers');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Data from API</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.titulo}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataDisplay;
