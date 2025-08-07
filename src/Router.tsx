import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "@/pages/Home.page";
import { AuthPage } from "@/pages/Auth.page";
import { DashboardPage } from "@/pages/Dashboard.page";
import { NotFoundPage } from "@/pages/NotFound.page";

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
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
