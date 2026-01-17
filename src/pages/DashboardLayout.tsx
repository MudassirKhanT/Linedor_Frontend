import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard/projects", label: "Projects" },
    { path: "/dashboard/people", label: "People" },
    { path: "/dashboard/press", label: "Press" },
    { path: "/dashboard/studio", label: "Studio" },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-6 tracking-wide">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`px-3 py-2 rounded-md font-medium transition ${location.pathname === item.path ? "bg-gray-700 text-white" : "hover:bg-gray-800 hover:text-gray-200"}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="destructive"
          className="mt-auto bg-red-600 hover:bg-red-700"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </Button>
      </aside>

      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
