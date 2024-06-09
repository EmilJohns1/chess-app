// pages/index.tsx
import Head from 'next/head';
import Chessboard from '../components/Chessboard';

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Head>
        <title>Next.js Chess App</title>
        <meta name="description" content="Chess app created with Next.js, TypeScript, and Tailwind CSS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center">
        <h1 className="text-4xl font-bold mb-12">Chess App</h1>
        <div className="flex justify-center">
          <Chessboard />
        </div>
      </main>
    </div>
  );
};

export default Home;