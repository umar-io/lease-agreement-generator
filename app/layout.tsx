import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar'

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
  return (
    // Add the variables to the body class
    <html lang="en" className={`${jakarta.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
