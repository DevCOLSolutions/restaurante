import { Outlet } from "react-router-dom"
import { AuthInitializer } from "@/components/AuthInitializer"

export function RootLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans antialiased">
      <AuthInitializer>
        <Outlet />
      </AuthInitializer>
    </div>
  )
}
