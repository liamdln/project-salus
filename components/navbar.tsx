import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./navbar.module.css"

export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <>
        <span>NAVBAR</span>
    </>
  )
}