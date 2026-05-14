"use client";
import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { buildMenuTree } from "../../lib/api/hooks/useMenus";
import type { Menu } from "@/types";

const IC: Record<string, string> = {
  dashboard:
    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  groups:
    '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  devices:
    '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/>',
  policies: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  pauses:
    '<circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/>',
  detections:
    '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  users:
    '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  licenses:
    '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  notifications:
    '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
  account:
    '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  components:
    '<rect x="3" y="3" width="7" height="4" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="3" y="11" width="7" height="10" rx="1"/><rect x="14" y="11" width="7" height="4" rx="1"/><rect x="14" y="19" width="7" height="4" rx="1"/>',
};

interface SvgIconProps {
  paths: string;
}

function SvgIcon({ paths }: SvgIconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { menus } = useAuth();

  const handleNavigate = (path: string) => {
    router.push(path);
    onMobileClose?.();
  };

  const menuTree = useMemo(() => buildMenuTree(menus), [menus]);

  return (
    <div
      className={`sb${collapsed ? " collapsed" : ""}${mobileOpen ? " mobile-open" : ""}`}
    >
      <div
        className="sb-h"
        onClick={() => handleNavigate("/")}
        style={{ cursor: "pointer" }}
      >
        <div className="sb-logo-row">
          <div className="sb-logo-icon">
            <img
              src="/logo.png"
              alt="Meercatch"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: 6,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div className="sb-logo-text">MeerCat.ch Manager</div>
        </div>
      </div>

      <nav className="sb-nav">
        {menuTree.map((section: Menu) => (
          <div key={section.id}>
            <div className="ns">{section.title}</div>
            {section.children?.map((menu: Menu) => {
              const iconKey = menu.icon || "dashboard";
              const iconPaths = IC[iconKey] || IC["dashboard"];
              const isActive =
                menu.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(menu.path);
              return (
                <div
                  key={menu.id}
                  className={`ni${isActive ? " a" : ""}`}
                  onClick={() => handleNavigate(menu.path)}
                >
                  <span className="ic">
                    <SvgIcon paths={iconPaths} />
                  </span>
                  <span className="ni-txt">{menu.title}</span>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sb-collapse-btn">
        <button className="sb-toggle" onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? "▶" : "◀"}
        </button>
      </div>
    </div>
  );
}
