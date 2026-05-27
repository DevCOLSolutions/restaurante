import { createBrowserRouter, Navigate } from "react-router-dom"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { GlobalManagerLayout } from "@/features/global-manager/layouts/DashboardLayout"
import {
  GlobalManagerDashboardPage,
  TablesPage,
  OrdersPage,
  KitchenPage,
  ProfilePage as GMProfilePage,
  ReportsPage,
  SettingsPage,
} from "@/features/global-manager/pages"
import { MeseroLayout } from "@/features/mesero/layouts/DashboardLayout"
import {
  MeseroDashboardPage,
  MeseroTablesPage,
  MeseroOrdersPage,
  MeseroReadyPage,
  OrderCreatePage,
  OrderAddPage,
  MeseroProfilePage,
  ChargePage,
} from "@/features/mesero/pages"
import { CocinaLayout } from "@/features/cocina/layouts/DashboardLayout"
import {
  CocinaDashboardPage,
  PendingPage,
  PreparingPage,
} from "@/features/cocina/pages"
import { ConsumidorLayout } from "@/features/consumidor/layouts/DashboardLayout"
import { ConsumidorDashboardPage } from "@/features/consumidor/pages"
import { RootLayout } from "@/app/layouts/RootLayout"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      // Global Manager routes
      {
        path: "app/global-manager",
        element: <GlobalManagerLayout />,
        children: [
          { index: true, element: <GlobalManagerDashboardPage /> },
          { path: "tables", element: <TablesPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "kitchen", element: <KitchenPage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "profile", element: <GMProfilePage /> },
        ],
      },
      // Mesero routes
      {
        path: "app/mesero",
        element: <MeseroLayout />,
        children: [
          { index: true, element: <MeseroDashboardPage /> },
          { path: "tables", element: <MeseroTablesPage /> },
          { path: "order-create", element: <OrderCreatePage /> },
          { path: "order-add", element: <OrderAddPage /> },
          { path: "orders", element: <MeseroOrdersPage /> },
          { path: "ready", element: <MeseroReadyPage /> },
          { path: "charge", element: <ChargePage /> },
          { path: "profile", element: <MeseroProfilePage /> },
        ],
      },
      // Cocina routes
      {
        path: "app/cocina",
        element: <CocinaLayout />,
        children: [
          { index: true, element: <CocinaDashboardPage /> },
          { path: "pending", element: <PendingPage /> },
          { path: "preparing", element: <PreparingPage /> },
          { path: "profile", element: <GMProfilePage /> },
        ],
      },
      // Consumidor routes
      {
        path: "app/consumidor",
        element: <ConsumidorLayout />,
        children: [
          { index: true, element: <ConsumidorDashboardPage /> },
          { path: "profile", element: <GMProfilePage /> },
        ],
      },
    ],
  },
])
