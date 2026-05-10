import { Sidebar } from "./_components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
