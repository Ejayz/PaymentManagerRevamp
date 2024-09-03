"use client";

import { Toaster } from "react-hot-toast";

export default function BuilderPage({
  children,
  cssStyle,
}: Readonly<{
  children: React.ReactNode;
  cssStyle: string;
}>) {
  return (
    <main
      data-theme="light"
      className={`${cssStyle} flex min-h-screen  items-center justify-between bg-[url('/SVGS/bg.svg')] bg-cover bg-center`}
    >
      <Toaster position="bottom-right" toastOptions={{
          duration: 5000,
        }} reverseOrder={false} />
      {children}
    </main>
  );
}
