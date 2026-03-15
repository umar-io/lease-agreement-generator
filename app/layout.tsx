import { Plus_Jakarta_Sans, Nunito_Sans } from 'next/font/google';
import './globals.css';
import Navbar from './_components/navbar'
import { AuthProvider } from './hooks/auth-context';
import fs from "fs";
import path from "path";
import { ToastContainer } from 'react-toastify'

// Configure the fonts
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800', '900'],
  variable: '--font-nunito-sans',
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
    <html lang="en" className={`${jakarta.variable} ${nunitoSans.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <div
            aria-hidden
            style={{ display: "none" }}
            dangerouslySetInnerHTML={{ __html: sprite }}
          />
          <Navbar />
          <ToastContainer />
          <main className="flex-1 w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
