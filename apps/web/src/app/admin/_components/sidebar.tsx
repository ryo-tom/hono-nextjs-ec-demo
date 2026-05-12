"use client";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  LayoutDashboard,
  Package,
  Settings,
  Tag
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "ダッシュボード", href: "/admin", icon: LayoutDashboard },
  { label: "商品管理", href: "/admin/products", icon: Package },
  { label: "カテゴリ管理", href: "/admin/categories", icon: Tag },
];

const bottomItems = [
  { label: "設定", href: "/admin/settings", icon: Settings },
];

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

function NavLink({ href, icon: Icon, label, active }: NavLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            active
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon size={16} className="shrink-0" />
          <span className="hidden lg:block">{label}</span>
        </Link>
      </TooltipTrigger>
      {/* lg未満のときだけTooltipを表示 */}
      <TooltipContent side="right" className="lg:hidden">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="flex h-screen w-14 flex-col border-r bg-card lg:w-60">
        {/* ロゴ */}
        <div className="flex h-14 items-center justify-center px-3 lg:justify-start lg:px-5">
          <span className="text-sm font-semibold tracking-wide text-foreground hidden lg:block">
            ShopDemo
          </span>
          <span className="hidden lg:inline-block ml-1.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            Admin
          </span>
          {/* モバイル時はイニシャルロゴ */}
          <span className="block lg:hidden text-sm font-bold">S</span>
        </div>

        <Separator />

        {/* メインナビ */}
        <nav className="flex flex-1 flex-col gap-1 p-2 lg:p-3">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={active}
              />
            );
          })}
        </nav>

        <Separator />

        {/* ボトムナビ */}
        <div className="flex flex-col gap-1 p-2 lg:p-3">
          {bottomItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
            />
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ExternalLink size={16} className="shrink-0" />
                <span className="hidden lg:block">サイトを表示</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="lg:hidden">
              サイトを表示
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
