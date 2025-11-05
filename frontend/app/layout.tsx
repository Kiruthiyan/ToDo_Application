import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ToDo Authentication",
  description: "User authentication with JWT in Next.js + Spring Boot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
