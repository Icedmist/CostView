import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "CostView — Construction Cost Intelligence",
  description: "Unified system of record for budget, procurement, site progress, and project margins.",
  icons: {
    icon: [
      { url: "/icon.svg?v=20260925", type: "image/svg+xml" },
      { url: "/favicon.ico?v=20260925" },
      { url: "/favicon-32x32.png?v=20260925", sizes: "32x32", type: "image/png" },
      { url: "/icon.png?v=20260925", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=20260925", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var pref = localStorage.getItem('costview_theme');
                  var isDark = false;
                  if (pref === 'dark') {
                    isDark = true;
                  } else if (pref === 'light') {
                    isDark = false;
                  } else {
                    var h = new Date().getHours();
                    isDark = (h < 6 || h >= 19);
                  }
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#FAF9F5] dark:bg-[#071324] text-slate-900 dark:text-slate-100 antialiased min-h-screen font-sans selection:bg-[#0A2540] selection:text-white dark:selection:bg-[#FFD23F] dark:selection:text-[#0A1931] transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
