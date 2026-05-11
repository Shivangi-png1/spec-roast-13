import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spec Roast — AI PRD Stress-Tester",
  description:
    "Paste your product spec. Get back exactly what your engineers, designers, and skeptical VP will say — before the meeting.",
  openGraph: {
    title: "Spec Roast 🔥",
    description: "Stress-test your PRD before your engineers do.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen antialiased">{children}</body>
    </html>
  );
}
