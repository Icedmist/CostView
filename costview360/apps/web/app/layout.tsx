import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "CostView — Construction Cost Intelligence",
  description: "Unified system of record for budget, procurement, site progress, and project margins.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
