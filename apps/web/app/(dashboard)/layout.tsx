import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
      }}
    >
      <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "34px",
            background:
              "radial-gradient(circle at top right, rgba(59,130,246,0.10), transparent 32%), #020617",
          }}
        >
          {children}
        </main>
    </div>
  );
}