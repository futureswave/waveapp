import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wave App — The AI Generation Platform",
  description:
    "Every modern AI video and image model. Director-quality motion presets. Identity-locked characters. One credit balance, one workspace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
