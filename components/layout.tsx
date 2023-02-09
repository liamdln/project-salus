import Navbar from "./navbar"
import type { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  
  
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <header><Navbar /></header>
        <main className="mt-3 mb-3">{children}</main>
        {/* TODO: Footer */}
        <footer className="mt-auto text-center pb-2 pt-2 navbar-blue">Copyright &copy; Liam P 2023 | Demonstration Product</footer>
      </div>
    </>
  )
}