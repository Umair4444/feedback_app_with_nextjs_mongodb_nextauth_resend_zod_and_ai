"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { usePathname } from "next/navigation";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const pathname = usePathname();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gradient-to-r from-white via-gray-50 to-gray-100">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand Logo / Title */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition"
        >
          True Feedback
        </Link>

        {/* Right Side - Auth Buttons */}
        {session ? (
          <div className="flex flex-col md:flex-row items-center gap-3">
            <span className="text-sm sm:text-base text-gray-700">
              Welcome,{" "}
              <span className="font-medium text-gray-900">
                {user?.username || user?.email}
              </span>
            </span>
            <Button
              onClick={() => signOut()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition w-full md:w-auto"
            >
              Logout
            </Button>
          </div>
        ) : (
          pathname !== "/sign-in" && (
            <Link href="/sign-in" className="w-full md:w-auto">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition w-full md:w-auto">
                Login
              </Button>
            </Link>
          )
        )}
      </div>
    </nav>
  );
}

export default Navbar;
