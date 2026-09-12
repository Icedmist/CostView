import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "CostView — Construction Cost Intelligence",
  description: "Unified system of record for budget, procurement, site progress, and project margins.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F5] text-slate-900 antialiased min-h-screen font-sans selection:bg-[#0A2540] selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
