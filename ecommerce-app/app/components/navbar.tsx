import Link from "next/link";

const Navbar = () => {
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
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
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
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
