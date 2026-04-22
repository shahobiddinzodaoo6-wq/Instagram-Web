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
    <div className="flex h-screen flex-col border-r border-[#dbdbdb] bg-white transition-all duration-300 w-[72px] xl:w-[244px] p-3 pt-6 pb-5 fixed left-0 top-0 z-50">
      {/* Logo */}
      <Link href="/" className="mb-10 px-3 flex items-center h-12">
        <InstagramIcon className="h-6 w-6 block xl:hidden" />
        <h1 className="hidden xl:block text-2xl font-bold italic" style={{fontFamily: 'serif'}}>Instagram</h1>
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:bg-[#fafafa] group ${isActive ? "font-bold text-black" : "font-normal text-[#262626]"
                }`}
            >
              <div className="relative transform transition-transform group-hover:scale-110">
                <Icon className={`h-6 w-6 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
                {item.hasBadge && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF3040] border-2 border-white">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                )}
              </div>
              <span className="hidden xl:block text-base tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="mt-auto space-y-1">
        <button className="flex w-full items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:bg-[#fafafa] group text-[#262626]">
          <LayoutGrid className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="hidden xl:block text-base tracking-tight">Threads</span>
        </button>
        <button className="flex w-full items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:bg-[#fafafa] group text-[#262626]">
          <Menu className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="hidden xl:block text-base font-bold tracking-tight">More</span>
        </button>
      </div>
    </div>
  );
};

