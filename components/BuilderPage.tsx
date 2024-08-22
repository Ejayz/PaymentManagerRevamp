"use client";

export default function BuilderPage({
  children,
  cssStyle,
}: Readonly<{
  children: React.ReactNode;
  cssStyle: string;
}>) {
  return (
    <main
      className={`${cssStyle} flex min-h-screen  items-center justify-between `}
    >
      {children}
    </main>
  );
}