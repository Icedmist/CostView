import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "CostView 360 — Construction Cost Intelligence Platform",
  description: "Unified system of record for budget, procurement, site progress, and project margins.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
