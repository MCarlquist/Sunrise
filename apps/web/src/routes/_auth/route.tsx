import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
      });
    }
    return { session };
  },
});

function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <div className="border-r">
        <h1 className="text-3xl text-center">Sunrise</h1>
        <div className="grid grid-cols-1 gap-2 p-2">
          <Link to="/dashboard">Dashboard</Link>
          <Link to={"/check-in"}>Check In</Link>
        </div>
      </div>
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
