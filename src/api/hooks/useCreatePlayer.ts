import { useState } from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:8080/api';

export const useCreatePlayer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createPlayer = async (playerData: { username: string; email: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${baseUrl}/players`, playerData);
      setSuccess(true);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError(err.response.data.message);
        setError('Player with that username or email already exists');
      } else {
        setError('Failed to create player');
      }
    } finally {
      setLoading(false);
    }
  };

  return { createPlayer, loading, error, success };
};
