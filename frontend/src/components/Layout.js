import Link from "next/link";

export default function Layout({ children }) {
  let user = {};
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        user = JSON.parse(storedUser);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        localStorage.removeItem("user"); // Clear invalid data
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Academic Management
          </Link>
          {user?.role && (
            <ul className="flex space-x-4">
              <li>
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:underline">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/assignments" className="hover:underline">
                  Assignments
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
      <main className="container mx-auto">{children}</main>
    </div>
  );
}
