import { Navbar } from "@/components/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-14">{children}</main>
    </div>
  );
}
