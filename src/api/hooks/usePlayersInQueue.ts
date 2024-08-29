import { useEffect, useState } from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:8080/api';

export const usePlayersInQueue = () => {
  const [playersInQueue, setPlayersInQueue] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayersInQueue = async () => {
      try {
        const response = await axios.get(`${baseUrl}/players/in-queue`);
        setPlayersInQueue(response.data);
      } catch (err) {
        console.error('Error fetching players in queue:', err);
        setError('Failed to fetch players in queue');
      }
    };

    fetchPlayersInQueue();
  }, []);

  return { playersInQueue, error };
};
