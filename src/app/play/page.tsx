'use client';

import { usePlayersInQueue } from '@/api/hooks/usePlayersInQueue';
import { useEnterQueue } from '@/api/hooks/useEnterQueue';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

const Play: React.FC = () => {
  const { playersInQueue, error: fetchError } = usePlayersInQueue();
  const { enterQueue, isEnteringQueue, error: enterError } = useEnterQueue();

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100">
      <Head>
        <title>Play Chess</title>
        <meta name="description" content="Enter the queue and see players currently in the queue" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center mt-10">
        <h1 className="text-3xl font-bold mb-6">Play Chess</h1>
        <button
          onClick={enterQueue}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isEnteringQueue}
        >
          {isEnteringQueue ? 'Entering Queue...' : 'Enter Queue'}
        </button>
        
        {enterError && <p className="text-red-500">{enterError}</p>}
        
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Players in Queue</h2>
          {fetchError ? (
            <p className="text-red-500">{fetchError}</p>
          ) : (
            <ul>
              {playersInQueue.map(player => (
                <li key={player.id} className="border-b py-2">{player.username}</li>
              ))}
            </ul>
          )}
        </div>

        <Link href="/" className="mt-10 text-blue-500 hover:underline">
          Back to Home
        </Link>
      </main>
    </div>
  );
};

export default Play;
