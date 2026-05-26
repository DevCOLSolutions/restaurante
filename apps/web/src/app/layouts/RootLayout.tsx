import { Outlet } from "react-router-dom"

export function RootLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans antialiased">
      <Outlet />
    </div>
  )
}
