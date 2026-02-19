"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  Home,
  Mail,
  Image,
  Youtube,
  Video,
  Calendar,
} from "lucide-react";

import { signOut } from "next-auth/react";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/blogs", label: "Blogs", icon: BookOpen },
  { href: "/admin/dashboard/content", label: "Content", icon: FileText },
  {
    href: "/admin/dashboard/programs",
    label: "Today's Program",
    icon: Calendar,
  },
  { href: "/admin/dashboard/inquiries", label: "Inquiries", icon: Mail },
  { href: "/admin/dashboard/gallery", label: "Gallery", icon: Image },
  {
    href: "/admin/dashboard/video-gallery",
    label: "Video Gallery",
    icon: Video,
  },

  { href: "/admin/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="font-bold text-sm">R</span>
            </div>
            <span className="font-bold">Admin Panel</span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-96px)]">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === link.href
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            View Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col  overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 lg:px-8 flex-shrink-0">
          <button
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            Campaign CMS Dashboard
          </h1>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
