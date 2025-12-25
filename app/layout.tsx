import "./globals.css";
import Navbar from "./components/navbar";

// Configure the font
import { Noto_Sans_JP } from "next/font/google";

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-jp",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add the variables to the body class
    <html lang="en" className={`${notoJp.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
