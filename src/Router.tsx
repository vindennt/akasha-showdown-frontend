import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/Home.page";
import { AuthPage } from "./pages/Auth.page";
import { DashboardPage } from "./pages/Dashboard.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signin",
    element: <AuthPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
