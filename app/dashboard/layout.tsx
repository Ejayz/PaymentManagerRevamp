import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={inter.className} data-theme="light">
      <body>{children}</body>
    </html>
  );
}
