/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { setCookie, getCookies, removeCookie } from 'typescript-cookie'

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user/checkAuthStatus', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.userToken);
        } else {
          console.error('Failed to fetch authentication status');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };

    checkLoggedInStatus();
  }, []);

  const handleLogout = async () => {
    try {
      console.log(getCookies())
      const response = await fetch('http://localhost:8000/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        document.cookie = 'userToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
        setIsLoggedIn(false);
        router.push('/user/sign-in');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="navbar bg-base-100 flex justify-between items-center">
      <div className="flex gap-1 justify-center">
        <Link
          className="bg-transparent text-2xl text-black font-semibold"
          href="/"
          prefetch={false}
        >
          SazimStore
        </Link>
      </div>
      <div className="flex items-center justify-end bg-base-80">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="user" src="http://localhost:8000/user.jpg" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            {isLoggedIn ? (
              <>
                <Link
                  className="justify-between"
                  href="/products"
                  prefetch={false}
                >
                  Products
                </Link>
                <Link
                  className="justify-between"
                  href="/add-products"
                  prefetch={false}
                >
                  New Product
                </Link>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </>
            ) : (
              <Link
                className="justify-between"
                href="/user/sign-in"
                prefetch={false}
              >
                Sign-in
              </Link>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
