'use client';

import { useState } from 'react';
import Head from 'next/head';
import { useCreatePlayer } from '../../api/hooks/useCreatePlayer';
import Link from 'next/link';

const CreatePlayer: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { createPlayer, loading, error, success } = useCreatePlayer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) return;

    await createPlayer({ username, email });

    if (!error) {
      setUsername('');
      setEmail('');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Head>
        <title>Create Player - Chess App</title>
        <meta name="description" content="Create a new player in the Chess app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center p-4">
        <h1 className="text-4xl font-bold mb-6">Create a New Player</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Player'}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
          {success && <p className="text-green-500 text-xs italic mt-4">Player created successfully!</p>}
        </form>
        <Link href="/" className="text-blue-500 hover:underline">
          Go back to Home
        </Link>
      </main>
    </div>
  );
};

export default CreatePlayer;
