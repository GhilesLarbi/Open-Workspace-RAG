"use client";

import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("access_token");
    router.push("/login");
  };

  return (
    <SidebarMenuButton 
      onClick={handleLogout}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <LogOut />
      <span>Logout</span>
    </SidebarMenuButton>
  );
}