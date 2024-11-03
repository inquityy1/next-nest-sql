import Link from "next/link";

const Home = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to the AdOps Tool
      </h1>
      <Link legacyBehavior href="/campaigns">
        <a className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-300">
          View Campaigns
        </a>
      </Link>
    </div>
  </div>
);

export default Home;
