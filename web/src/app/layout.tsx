import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AppProvider } from "@/context/AppContext";
import Toast from "@/components/Toast";

export const metadata: Metadata = {
  title: "XConv - Sistema de Gestão de Convênios",
  description: "Plataforma para gestão de parcerias e convênios",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProvider>
          <div className="app-shell">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
