"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="w-full px-10 py-5 shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-transparent hover:cursor-pointer thick text-[40px] bg-clip-text bg-gradient-to-r from-[#5f14ec] to-[#7ebaff] font-extrabold px-3 py-2 rounded-3xl">
          Waste Collection
        </div>

        <div className="flex justify-evenly w-6/12 mx-auto">
          <div
            className={`text-lg font-semibold cursor-pointer ${
              pathname === "/" ? "text-[#5f14ec]" : "text-gray-400 hover:text-[#5f14ec]"
            }`}
          >
            <Link href="/">Dashboard</Link>
          </div>
          <div
            className={`text-lg font-semibold cursor-pointer ${
              pathname === "/usecases" ? "text-[#5f14ec]" : "text-gray-400 hover:text-[#5f14ec]"
            }`}
          >
            <Link href="/usecases">More Usecases</Link>
          </div>
          <div
            className={`text-lg font-semibold cursor-pointer ${
              pathname === "/demand_pickup" ? "text-[#5f14ec]" : "text-gray-400 hover:text-[#5f14ec]"
            }`}
          >
            <Link href="/demand_pickup">Demand Pickup</Link>
          </div>
          <div
            className={`text-lg font-semibold cursor-pointer ${
              pathname === "/reports" ? "text-[#5f14ec]" : "text-gray-400 hover:text-[#5f14ec]"
            }`}
          >
            <Link href="/reports">Reports</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
