import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/pharmatrace/Dashboard";
import { Login } from "@/components/pharmatrace/Login";
import { ManufacturerConsole } from "@/components/pharmatrace/ManufacturerConsole";
import { Scanner } from "@/components/pharmatrace/Scanner";
import { Disclaimer, Hero, Shell, tabsForRole, type TabKey } from "@/components/pharmatrace/Shell";
import { ShopVerify } from "@/components/pharmatrace/ShopVerify";
import { PharmatraceProvider, usePharmatrace } from "@/lib/pharmatrace/store";

const title = "Pharmatrace — Pack-level medicine authentication";
const description =
  "Manufacturers issue a unique QR for every pack; consumers scan it with their camera to verify medicine against the full supply-chain ledger.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PharmatraceProvider>
      <App />
    </PharmatraceProvider>
  );
}

function App() {
  const { session } = usePharmatrace();
  const [tab, setTab] = useState<TabKey>("shops");

  useEffect(() => {
    if (!session) return;
    const allowed = tabsForRole(session.role).map((t) => t.key);
    if (!allowed.includes(tab)) setTab(allowed[0] as TabKey);
  }, [session, tab]);

  if (!session) return <Login />;

  return (
    <Shell tab={tab} onTabChange={setTab}>
      <div className="space-y-6">
        <Hero />
        {tab === "shops" && <ShopVerify />}
        {tab === "scanner" && <Scanner />}
        {tab === "issue" && <ManufacturerConsole />}
        {tab === "dashboard" && <Dashboard />}
        <Disclaimer />
      </div>
    </Shell>
  );
}
