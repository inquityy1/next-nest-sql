import withAuth from "../hoc/withAuth";
import { useRouter } from "next/router";

function Chat() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("authToken");
    // Redirect to the login page
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Logout Button in the top-right corner */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow"
        >
          Logout
        </button>
      </div>

      {/* Main Chat Content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Chat</h1>
          <p className="text-gray-700 mb-6 text-center">
            Welcome to the chat app! This will be your messaging space.
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrap the Chat component with the authentication HOC
export default withAuth(Chat);
