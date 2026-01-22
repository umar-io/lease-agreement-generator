import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from './_components/navbar'
import { AuthProvider } from './hooks/auth-context';
import fs from "fs";
import path from "path";

// Configure the font
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta', // This matches the CSS variable above
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const sprite = fs.readFileSync(
    path.join(process.cwd(), "public/sprite.svg"),
    "utf8"
  );

  return (
    // Add the variables to the body class
    <html lang="en" className={`${jakarta.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <div
            aria-hidden
            style={{ display: "none" }}
            dangerouslySetInnerHTML={{ __html: sprite }}
          />
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
