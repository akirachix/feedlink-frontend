"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiBox,
  FiTrash2,
  FiShoppingCart,
  FiLogOut,
} from "react-icons/fi";

const sidebarMenu = [
  { id: "1", label: "Dashboard", href: "/dashboard", icon: FiGrid },
  { id: "2", label: "Inventory", href: "/inventory", icon: FiBox },
  { id: "3", label: "Waste Claims", href: "/waste-claims", icon: FiTrash2 },
  { id: "4", label: "Orders", href: "/orders", icon: FiShoppingCart },
];

export default function Sidebar() {
  const pathname = usePathname() || "/";

  return (
    <aside
      className="w-72 min-h-screen relative flex flex-col"
      style={{
        backgroundImage: 'url("/images/sidebar.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
        color: 'white',
      }}
    >
      <div className="absolute top-16 left-8 flex flex-col items-start gap-2 select-none ml-3">
        <img
          src="/images/logo.svg"
          alt="FeedLink Logo"
          width={400}
          height={70}
          className="object-contain"
        />
      </div>

      <nav className="flex flex-col gap-3 px-6 pt-40 pb-6 flex-grow ml-7 mt-2">
        {sidebarMenu.map(({ id, label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={id}
              href={href}
              className={`flex items-center gap-3 rounded-md px-4 py-2 cursor-pointer transition-colors duration-200
                ${isActive
                  ? "bg-white text-[var(--secondary-color)] font-semibold"
                  : "text-white hover:bg-white hover:text-[var(--secondary-color)]"
                }`}
            >
              <Icon size={20} />
              <span className="text-lg">{label}</span>
            </Link>
          );
        })}

        <div className="mt-auto" />

        <Link
          href="/logout"
          className="flex items-center gap-3 rounded-md px-4 py-2 text-white hover:bg-white hover:text-[var(--secondary-color)] transition-colors duration-200 mb-20 ml-2"
        >
          <FiLogOut size={20} />
          <span className="text-lg">Log Out</span>
        </Link>
      </nav>
    </aside>
  );
}