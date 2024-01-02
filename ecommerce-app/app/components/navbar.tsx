"use client"

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user/checkAuthRole', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setUserRole(data.role);
        } else {
          console.error('Failed to fetch user role');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        document.cookie = 'userToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
        setUserRole(null);
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
            {(userRole === 'USER' || userRole === 'ADMIN') ? (
              <>
                <Link
                  className="justify-between"
                  href="/products"
                  prefetch={false}
                >
                  Products
                </Link>

                {userRole === 'USER' && (
                  <><Link
                    className="justify-between"
                    href="/cart"
                    prefetch={false}
                  >
                    Cart
                  </Link><Link
                    className="justify-between"
                    href="/orders"
                    prefetch={false}
                  >
                      Orders
                    </Link></>
                )}
                {userRole === 'ADMIN' && (
                  <><Link
                    className="justify-between"
                    href="/add-products"
                    prefetch={false}
                  >
                    New Product
                  </Link><Link
                    className="justify-between"
                    href="/customer-orders"
                    prefetch={false}
                  >
                      Customer Orders
                    </Link></>
                )}
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </>
            ) : (
              <><Link
                className="justify-between"
                href="/products"
                prefetch={false}
              >
                Products
              </Link>
                <Link
                  className="justify-between"
                  href="/cart"
                  prefetch={false}
                >
                  Cart
                </Link><Link
                  className="justify-between"
                  href="/user/sign-in"
                  prefetch={false}
                >
                  Sign-in
                </Link></>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;



