import Navbar from "./navbar"
import type { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <header><Navbar /></header>
        <main className="mt-3">{children}</main>
        <footer className="mt-auto text-center pb-2 pt-2 bg-dark">Footer</footer>
      </div>
    </>
  )
}