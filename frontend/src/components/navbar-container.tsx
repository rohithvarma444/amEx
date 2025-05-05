'use client';

import { usePathname } from "next/navigation";
import Navbar from "./main-nav";
import AuthDashboard from "./auth-dashbaord";

export default function NavbarContainer() {
  const pathname = usePathname();
  const showPublicNavbar = ["/", "/sign-in", "/sign-up"].includes(pathname);

  return showPublicNavbar ? <Navbar /> : <AuthDashboard />;
}