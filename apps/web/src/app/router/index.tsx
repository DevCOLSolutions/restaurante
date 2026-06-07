import { createBrowserRouter, Navigate } from "react-router-dom"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { LogoutPage } from "@/features/auth/pages/LogoutPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { GuestRoute } from "@/components/GuestRoute"
import { UserRole } from "@/core/auth/types"
import { GlobalManagerLayout } from "@/features/global-manager/layouts/DashboardLayout"
import {
  GlobalManagerDashboardPage,
  TablesPage,
  OrdersPage,
  KitchenPage,
  ProfilePage as GMProfilePage,
  ReportsPage,
  SettingsPage,
  MenuPage,
  MeserosPage,
  SucursalesPage,
  SucursalDetailPage,
} from "@/features/global-manager/pages"
import { AdminSucursalLayout } from "@/features/admin-sucursal/layouts/DashboardLayout"
import {
  AdminSucursalDashboardPage,
  MeserosPage as AdminMeserosPage,
  KitchenPage as AdminKitchenPage,
  ProfilePage as AdminProfilePage,
  TablesPage as AdminTablesPage,
  OrdersPage as AdminOrdersPage,
  ReportsPage as AdminReportsPage,
  SettingsPage as AdminSettingsPage,
} from "@/features/admin-sucursal/pages"
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
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: "logout",
        element: <LogoutPage />,
      },
      // Global Manager routes
      {
        path: "app/global-manager",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.GlobalManager]}>
            <GlobalManagerLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <GlobalManagerDashboardPage /> },
          { path: "tables", element: <TablesPage /> },
          { path: "menu", element: <MenuPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "kitchen", element: <KitchenPage /> },
          { path: "meseros", element: <MeserosPage /> },
          { path: "sucursales", element: <SucursalesPage /> },
          { path: "sucursales/:id", element: <SucursalDetailPage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "profile", element: <GMProfilePage /> },
        ],
      },
      // Admin Sucursal routes
      {
        path: "app/admin-sucursal",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.AdminSucursal]}>
            <AdminSucursalLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminSucursalDashboardPage /> },
          { path: "tables", element: <AdminTablesPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "kitchen", element: <AdminKitchenPage /> },
          { path: "meseros", element: <AdminMeserosPage /> },
          { path: "reports", element: <AdminReportsPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
          { path: "profile", element: <AdminProfilePage /> },
        ],
      },
      // Mesero routes
      {
        path: "app/mesero",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Mesero]}>
            <MeseroLayout />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute allowedRoles={[UserRole.AreaCocina]}>
            <CocinaLayout />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute allowedRoles={[UserRole.ConsumidorFinal]}>
            <ConsumidorLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <ConsumidorDashboardPage /> },
          { path: "profile", element: <GMProfilePage /> },
        ],
      },
    ],
  },
])
