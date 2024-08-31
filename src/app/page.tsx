import Head from 'next/head';
import Link from 'next/link';

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
        <div className="flex justify-center bg-gray-400 p-4">
          <Link href="/play" className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
            Play
          </Link>
          <Link href="/create-player" className="px-6 py-3 ml-5 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create account
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
