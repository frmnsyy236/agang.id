import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingWhatsAppFAB } from "@/components/common/FloatingWhatsAppFAB";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsAppFAB />
    </div>
  );
};
