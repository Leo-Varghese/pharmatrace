import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { NOW, seedDatabase, type AuditEntry, type Database, type PackStatus } from "./db";
import { verifyPack, type ScanInput, type VerificationResult } from "./verify";

export type Role = "manufacturer" | "consumer";
export type Session = { role: Role; name: string; manufacturerId?: string | undefined };

export type IssueInput = {
  productName: string;
  batchNo: string;
  manufacturerId: string;
  expiresAt: string;
  quantity: number;
};

type Ctx = {
  db: Database;
  session: Session | null;
  signIn: (s: Session) => void;
  signOut: () => void;
  issuePacks: (input: IssueInput) => string[];
  selectedPharmacyId?: string | undefined;
  setSelectedPharmacyId: (id?: string) => void;
  scan: (input: ScanInput) => VerificationResult;
  resetDemo: () => void;
  reportPack: (serial: string, status: Extract<PackStatus, "MISSING" | "STOLEN">) => void;
  confirmTransfer: (id: string) => void;
  receiveShipment: (id: string) => void;
  recallBatch: (batchId: string, reason: string) => void;
};

const DB_KEY = "pharmatrace.db.v1";
const SESSION_KEY = "pharmatrace.session.v1";

function loadDb(): Database {
  if (typeof window === "undefined") return seedDatabase();
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (raw) return { ...seedDatabase(), ...(JSON.parse(raw) as Database) };
  } catch {
    /* ignore corrupted storage */
  }
  return seedDatabase();
}

function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

// Keep a single context instance across hot-module reloads, otherwise the
// provider and the consumers can end up holding two different contexts.
const g = globalThis as typeof globalThis & { __pharmatraceCtx?: React.Context<Ctx | null> };
const PharmatraceContext: React.Context<Ctx | null> =
  g.__pharmatraceCtx ?? (g.__pharmatraceCtx = createContext<Ctx | null>(null));

let auditSeq = 0;
const entry = (e: Omit<AuditEntry, "id" | "at"> & { at?: string }): AuditEntry => ({
  id: `AUD-LIVE-${++auditSeq}`,
  at: e.at ?? NOW,
  actor: e.actor,
  action: e.action,
  entity: e.entity,
  details: e.details,
});

export function PharmatraceProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database>(() => seedDatabase());
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | undefined>("PH-01");

  // Hydrate the demo database + session after mount (keeps SSR markup stable).
  useEffect(() => {
    setDb(loadDb());
    setSession(loadSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      /* storage full or blocked */
    }
  }, [db, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  }, [session, hydrated]);

  const value = useMemo<Ctx>(
    () => ({
      db,
      session,
      signIn: (s) => setSession(s),
      signOut: () => setSession(null),
      issuePacks: ({ productName, batchNo, manufacturerId, expiresAt, quantity }) => {
        const stamp = Date.now().toString(36).toUpperCase().slice(-4);
        const serials = Array.from(
          { length: quantity },
          (_, i) => `PT-${stamp}-${String(db.packs.length + i + 1).padStart(4, "0")}`,
        );
        setDb((prev) => {
          const existing = prev.batches.find((b) => b.batchNo === batchNo);
          const batchId = existing?.id ?? `B-${prev.batches.length + 1}-${stamp}`;
          if (prev.packs.some((p) => p.serial === serials[0])) return prev;
          return {
            ...prev,
            batches: existing
              ? prev.batches
              : [
                  ...prev.batches,
                  {
                    id: batchId,
                    batchNo,
                    productName,
                    manufacturerId,
                    manufacturedAt: NOW,
                    expiresAt: `${expiresAt}T00:00:00Z`,
                  },
                ],
            packs: [
              ...prev.packs,
              ...serials.map((serial) => ({
                serial,
                batchId,
                status: "MANUFACTURED" as PackStatus,
                holderId: manufacturerId,
              })),
            ],
            audit: [
              entry({
                actor: manufacturerId,
                action: "PACKS_SERIALISED",
                entity: batchNo,
                details: `${quantity} pack(s) of ${productName} serialised and QR issued`,
              }),
              ...prev.audit,
            ],
          };
        });
        return serials;
      },
      selectedPharmacyId,
      setSelectedPharmacyId,
      // Consumer scans are strictly read-only.
      scan: (input) => verifyPack(db, input),
      resetDemo: () => setDb(seedDatabase()),
      reportPack: (serial, status) =>
        setDb((prev) => ({
          ...prev,
          packs: prev.packs.map((p) => (p.serial === serial ? { ...p, status } : p)),
          audit: [
            entry({
              actor: prev.packs.find((p) => p.serial === serial)?.holderId ?? "PH-01",
              action: status === "MISSING" ? "PACK_REPORTED_MISSING" : "PACK_REPORTED_STOLEN",
              entity: serial,
              details: `Pack reported ${status.toLowerCase()} by pharmacy staff`,
            }),
            ...prev.audit,
          ],
        })),
      confirmTransfer: (id) =>
        setDb((prev) => {
          const t = prev.transfers.find((x) => x.id === id);
          if (!t || t.status === "CONFIRMED") return prev;
          return {
            ...prev,
            transfers: prev.transfers.map((x) =>
              x.id === id ? { ...x, status: "CONFIRMED", confirmedAt: NOW } : x,
            ),
            packs: prev.packs.map((p) =>
              t.serials.includes(p.serial) ? { ...p, holderId: t.toId, status: "IN_STOCK" } : p,
            ),
            audit: [
              entry({
                actor: t.toId,
                action: "TRANSFER_CONFIRMED",
                entity: t.id,
                details: `Receipt confirmed for ${t.serials.join(", ")}`,
              }),
              ...prev.audit,
            ],
          };
        }),
      receiveShipment: (id) =>
        setDb((prev) => {
          const s = prev.shipments.find((x) => x.id === id);
          if (!s || s.status === "RECEIVED") return prev;
          return {
            ...prev,
            shipments: prev.shipments.map((x) =>
              x.id === id ? { ...x, status: "RECEIVED", receivedAt: NOW } : x,
            ),
            packs: prev.packs.map((p) =>
              s.serials.includes(p.serial) ? { ...p, holderId: s.toId, status: "IN_STOCK" } : p,
            ),
            audit: [
              entry({
                actor: s.toId,
                action: "SHIPMENT_RECEIVED",
                entity: s.id,
                details: `${s.serials.length} pack(s) received from ${s.fromId}`,
              }),
              ...prev.audit,
            ],
          };
        }),
      recallBatch: (batchId, reason) =>
        setDb((prev) => {
          if (prev.recalls.some((r) => r.batchId === batchId)) return prev;
          const batch = prev.batches.find((b) => b.id === batchId);
          return {
            ...prev,
            recalls: [...prev.recalls, { id: `RCL-${prev.recalls.length + 40}`, batchId, reason, issuedAt: NOW }],
            packs: prev.packs.map((p) => (p.batchId === batchId ? { ...p, status: "RECALLED" } : p)),
            audit: [
              entry({
                actor: batch?.manufacturerId ?? "MFR-01",
                action: "RECALL_ISSUED",
                entity: batchId,
                details: `Batch ${batch?.batchNo ?? batchId} recalled — ${reason}`,
              }),
              ...prev.audit,
            ],
          };
        }),
    }),
    [db, session, selectedPharmacyId],
  );

  return <PharmatraceContext.Provider value={value}>{children}</PharmatraceContext.Provider>;
}

export function usePharmatrace() {
  const ctx = useContext(PharmatraceContext);
  if (!ctx) throw new Error("usePharmatrace must be used inside PharmatraceProvider");
  return ctx;
}
