"use client";
import {
  Home,
  Search,
  Film,
  Send,
  Heart,
  PlusSquare,
  CircleUser,
  Menu,
  LayoutGrid
} from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Главная", href: "/" },
  { icon: Film, label: "Reels", href: "/reels" },
  { icon: Send, label: "Сообщения", href: "/direct" },
  { icon: Search, label: "Поисковый запрос", href: "/explore" },
  { icon: Heart, label: "Уведомления", href: "/notifications", hasBadge: true },
  { icon: PlusSquare, label: "Создать", href: "/create" },
  { icon: CircleUser, label: "Профиль", href: "/profile" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 w-[72px] xl:w-[244px] p-3 pt-4 pb-5">
      {/* Logo */}
      <Link href="/" className="mb-10 px-3 py-4 flex items-center">
        <InstagramIcon className="h-7 w-7" />
        <span className="hidden xl:block ml-4 text-xl font-bold tracking-tight">Instagram</span>
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100 ${isActive ? "font-bold" : "font-normal"
                }`}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
                {item.hasBadge && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 border-2 border-white">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
              <span className="hidden xl:block text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="mt-auto space-y-2">
        <button className="flex w-full items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100">
          <LayoutGrid className="h-6 w-6" />
          <span className="hidden xl:block text-base">Другие продукты ...</span>
        </button>
        <button className="flex w-full items-center gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100">
          <Menu className="h-6 w-6" />
          <span className="hidden xl:block text-base font-bold">Ещё</span>
        </button>
      </div>
    </div>
  );
};
