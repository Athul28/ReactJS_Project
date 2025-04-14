"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex w-full items-center justify-between bg-blue-600 px-4 py-3 text-white shadow-md">
      <Link href="/" className="text-xl transition-colors hover:text-blue-300">
        Quizzo
      </Link>
      <div className="flex items-center space-x-4">
        {session?.user ? (
          <>
            <a
              href="/profile"
              className="rounded-md bg-blue-500 px-3 py-2 transition-colors hover:bg-blue-400"
            >
              Profile
            </a>
            <button
              onClick={() => signOut()}
              className="cursor-pointer rounded-md bg-red-500 px-3 py-2 transition-colors hover:bg-red-400"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="cursor-pointer rounded-md bg-green-500 px-3 py-2 transition-colors hover:bg-green-400"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
