import { useEffect } from "react";
import { useRouter } from "next/router";

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    }, [router]);

    return <Component {...props} />;
  };
}
