import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "CostView — Construction Cost Intelligence Platform",
  description: "Unified system of record for budget, procurement, site progress, and project margins. Neo-brutalist Navy edition.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream-100 text-navy-800 antialiased min-h-screen font-sans selection:bg-mustard-400 selection:text-navy-800">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
