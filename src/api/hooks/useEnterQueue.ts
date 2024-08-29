import { useState } from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:8080/api';

export const useEnterQueue = () => {
  const [isEnteringQueue, setIsEnteringQueue] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enterQueue = async () => {
    setIsEnteringQueue(true);
    try {
      await axios.put(`${baseUrl}/players/1/enter-queue`, { /* Include necessary data if needed */ });
      alert('Entered queue successfully');
    } catch (err) {
      console.error('Error entering queue:', err);
      setError('Failed to enter queue');
    } finally {
      setIsEnteringQueue(false);
    }
  };

  return { enterQueue, isEnteringQueue, error };
};
