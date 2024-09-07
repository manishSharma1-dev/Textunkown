"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()} className="border-2 p-2 bg-black text-white rounded-md">Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()} className="border-2 p-2 bg-black text-white rounded-md">Sign in</button>
    </>
  )
}