import React from "react";
import { NavLink } from "react-router-dom";
import { MdLogout } from "react-icons/md";

const Navbar = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4">
        <nav>
          <div className="container mx-auto flex justify-between items-center">
            {/* Pojok Kiri: Logo + Text */}
            <div className="mb-0 flex items-center">
              <img
                src={process.env.PUBLIC_URL + "/assets/Logo.png"}
                alt="Logo"
                className="w-10 h-10"
              />
              <h1 className="text-medium font-bold ml-2 text-black">
                SIMS PPOB
              </h1>
            </div>

            {/* Pojok Kanan: Menu */}
            <ul className="flex items-center space-x-8">
              <li>
                <NavLink
                  to="/top-Up"
                  className={({ isActive }) =>
                    `flex items-center ${
                      isActive
                        ? "text-red-500 font-semibold"
                        : "text-black hover:text-red-300"
                    }`
                  }
                >
                  Top Up
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/transactions"
                  className={({ isActive }) =>
                    `flex items-center ${
                      isActive
                        ? "text-red-500 font-semibold"
                        : "text-black hover:text-red-300"
                    }`
                  }
                >
                  Transaction
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `flex items-center ${
                      isActive
                        ? "text-red-500 font-semibold"
                        : "text-black hover:text-red-300"
                    }`
                  }
                >
                  Akun
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <div className="flex-1 overflow-y-auto bg-neutral-30 p-8">{children}</div>
    </div>
  );
};

export default Navbar;
