import { NOW, type Database, type Pack } from "./db";

export type Outcome =
  | "Supply Chain Verified"
  | "Suspicious"
  | "Expired"
  | "Recalled"
  | "Under Review"
  | "Unable to Verify"
  | "Service Unavailable"
  | "Package Unreadable";

export type TimelineStep = {
  label: string;
  actor: string;
  location: string;
  at: string;
  tone: "ok" | "warn" | "bad";
};

export type VerificationResult = {
  outcome: Outcome;
  headline: string;
  reasons: string[];
  serial?: string | undefined;
  medicine?: string | undefined;
  batchNo?: string | undefined;
  expiresAt?: string | undefined;
  manufacturer?: string | undefined;
  sellingPharmacy?: string | undefined;
  selectedPharmacy?: string | undefined;
  status?: Pack["status"] | undefined;
  timeline: TimelineStep[];
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

export type ScanInput = {
  serial: string;
  selectedPharmacyId?: string | undefined;
  simulate?: "service-failure" | "unreadable" | undefined;
};

/**
 * Read-only verification. Never mutates the database.
 */
export function verifyPack(db: Database, input: ScanInput): VerificationResult {
  const { serial, selectedPharmacyId } = input;

  if (input.simulate === "unreadable") {
    return {
      outcome: "Package Unreadable",
      headline: "CODE UNREADABLE",
      reasons: [
        "The data matrix could not be decoded — damaged, smudged or partially covered label.",
        "Clean the pack surface and rescan, or enter the serial printed under the code manually.",
      ],
      timeline: [],
    };
  }

  if (input.simulate === "service-failure" || !db.serviceOnline) {
    return {
      outcome: "Service Unavailable",
      headline: "VERIFICATION SERVICE UNAVAILABLE",
      reasons: [
        "The PharmaTrace ledger could not be reached. No verification decision was made.",
        "An unavailable service is not proof of authenticity — do not treat this as verified.",
      ],
      timeline: [],
    };
  }

  const pack = db.packs.find((p) => p.serial.toUpperCase() === serial.trim().toUpperCase());
  if (!pack) {
    return {
      outcome: "Unable to Verify",
      headline: "SERIAL NOT FOUND IN LEDGER",
      reasons: [
        `No manufacturer record exists for serial ${serial.trim()}.`,
        "An unknown serial usually means copied packaging or an unregistered pack.",
      ],
      serial: serial.trim(),
      timeline: [],
    };
  }

  const batch = db.batches.find((b) => b.id === pack.batchId)!;
  const manufacturer = db.manufacturers.find((m) => m.id === batch.manufacturerId)!;
  const shipment = db.shipments.find((s) => s.serials.includes(pack.serial));
  const transfer = db.transfers.find((t) => t.serials.includes(pack.serial) && t.status === "CONFIRMED");
  const packSales = db.sales.filter((s) => s.serial === pack.serial);
  const activeSales = packSales.filter((s) => !s.voided);
  const sale = activeSales[activeSales.length - 1];
  const sellingPharmacy = sale ? db.pharmacies.find((p) => p.id === sale.pharmacyId) : undefined;
  const selectedPharmacy = selectedPharmacyId
    ? db.pharmacies.find((p) => p.id === selectedPharmacyId)
    : undefined;
  const recall = db.recalls.find((r) => r.batchId === batch.id);
  const expired = new Date(batch.expiresAt).getTime() < new Date(NOW).getTime();

  const timeline: TimelineStep[] = [];
  timeline.push({
    label: "Manufactured",
    actor: `${manufacturer.name} · Batch ${batch.batchNo}`,
    location: manufacturer.city,
    at: fmt(batch.manufacturedAt),
    tone: "ok",
  });
  if (shipment) {
    const to = db.pharmacies.find((p) => p.id === shipment.toId);
    timeline.push({
      label: "Shipped",
      actor: `Shipment ${shipment.id} → ${to?.name ?? shipment.toId}`,
      location: to?.city ?? "—",
      at: fmt(shipment.dispatchedAt),
      tone: "ok",
    });
    if (shipment.receivedAt) {
      timeline.push({
        label: "Received by pharmacy",
        actor: to?.name ?? shipment.toId,
        location: to?.address ?? "—",
        at: fmt(shipment.receivedAt),
        tone: "ok",
      });
    }
  }
  if (transfer) {
    const to = db.pharmacies.find((p) => p.id === transfer.toId);
    timeline.push({
      label: "Transferred between pharmacies",
      actor: `${transfer.id} → ${to?.name ?? transfer.toId}`,
      location: to?.city ?? "—",
      at: fmt(transfer.confirmedAt!),
      tone: "ok",
    });
  }
  for (const s of packSales) {
    const ph = db.pharmacies.find((p) => p.id === s.pharmacyId);
    timeline.push({
      label: s.voided ? "Sale voided (correction)" : "Sold to patient",
      actor: `${ph?.name ?? s.pharmacyId}${s.voided ? ` — ${s.voidReason}` : ""}`,
      location: ph?.address ?? "—",
      at: fmt(s.soldAt),
      tone: s.voided ? "warn" : "ok",
    });
  }

  const base = {
    serial: pack.serial,
    medicine: batch.productName,
    batchNo: batch.batchNo,
    expiresAt: batch.expiresAt,
    manufacturer: manufacturer.name,
    sellingPharmacy: sellingPharmacy?.name,
    selectedPharmacy: selectedPharmacy?.name,
    status: pack.status,
    timeline,
  };

  // Blocking checks, highest severity first
  if (recall || pack.status === "RECALLED") {
    return {
      ...base,
      outcome: "Recalled",
      headline: "RECALLED BATCH — DO NOT CONSUME",
      reasons: [
        `Batch ${batch.batchNo} was recalled on ${fmt(recall?.issuedAt ?? NOW)}.`,
        recall?.reason ?? "Recall issued by the manufacturer.",
        "Return this pack to the pharmacy. Sale of recalled packs is blocked in the ledger.",
      ],
    };
  }

  if (pack.status === "STOLEN" || pack.status === "MISSING") {
    return {
      ...base,
      outcome: "Suspicious",
      headline: pack.status === "STOLEN" ? "STOLEN PACK IN CIRCULATION" : "PACK REPORTED MISSING",
      reasons: [
        `Pack ${pack.serial} was reported ${pack.status.toLowerCase()} by ${
          db.pharmacies.find((p) => p.id === pack.holderId)?.name ?? pack.holderId
        }.`,
        "It left the legitimate chain of custody, so no valid sale record can exist.",
        "Do not purchase. Report the seller through the shop verification screen.",
      ],
    };
  }

  if (activeSales.length > 1) {
    const where = activeSales
      .map((s) => db.pharmacies.find((p) => p.id === s.pharmacyId)?.name ?? s.pharmacyId)
      .join(" · ");
    return {
      ...base,
      outcome: "Suspicious",
      headline: "CLONED SERIAL — DUPLICATE SALES DETECTED",
      reasons: [
        `Serial ${pack.serial} has ${activeSales.length} independent sale records: ${where}.`,
        "A physical pack can only be sold once. At least one of these packs is counterfeit.",
        "The later sale has been flagged to the manufacturer for investigation.",
      ],
    };
  }

  if (expired || pack.status === "EXPIRED") {
    return {
      ...base,
      outcome: "Expired",
      headline: "EXPIRED MEDICINE — SALE BLOCKED",
      reasons: [
        `Batch ${batch.batchNo} expired on ${fmt(batch.expiresAt)}.`,
        "The supply-chain record is genuine, but this pack must not be dispensed or consumed.",
      ],
    };
  }

  if (pack.status === "UNDER_REVIEW" || pack.status === "QUARANTINED") {
    return {
      ...base,
      outcome: "Under Review",
      headline: "PACK HELD FOR REVIEW",
      reasons: [
        pack.status === "QUARANTINED"
          ? "This pack was returned by a customer and is quarantined — it is not sellable stock."
          : "An open investigation is attached to this pack (cold-chain or handling deviation).",
        "No verified outcome can be issued until the review is closed.",
      ],
    };
  }

  if (!sale) {
    return {
      ...base,
      outcome: "Under Review",
      headline: "NO SALE RECORDED YET",
      reasons: [
        `Pack ${pack.serial} is currently ${pack.status.replace("_", " ").toLowerCase()} at ${
          db.pharmacies.find((p) => p.id === pack.holderId)?.name ??
          db.manufacturers.find((m) => m.id === pack.holderId)?.name ??
          pack.holderId
        }.`,
        "If you have already paid for this pack, the pharmacy has not recorded the sale — ask for a billed sale entry.",
      ],
    };
  }

  if (selectedPharmacy && sale.pharmacyId !== selectedPharmacy.id) {
    return {
      ...base,
      outcome: "Suspicious",
      headline: "STORE MISMATCH — SOLD ELSEWHERE",
      reasons: [
        `You selected ${selectedPharmacy.name}, but this pack's sale was recorded by ${sellingPharmacy?.name}.`,
        "Either the pack was diverted after sale, or the packaging has been copied.",
        "Ask the shop for a PharmaTrace sale receipt before purchasing.",
      ],
    };
  }

  return {
    ...base,
    outcome: "Supply Chain Verified",
    headline: "MEDICINE VERIFIED & SAFE",
    reasons: [
      `Serial ${pack.serial} traced end to end: ${manufacturer.name} → ${
        sellingPharmacy?.name ?? "pharmacy"
      } → patient.`,
      "Exactly one valid sale record exists, recorded by the pharmacy you selected.",
      packSales.some((s) => s.voided)
        ? "A previous billing correction on this pack is preserved in the audit trail."
        : "No duplicate scans, recalls or theft reports on this serial.",
    ],
  };
}

export type DemoScenario = {
  key: string;
  label: string;
  hint: string;
  input: ScanInput;
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  { key: "genuine", label: "Genuine pack", hint: "PT-8842-0001 @ Sanjeevani", input: { serial: "PT-8842-0001", selectedPharmacyId: "PH-01" } },
  { key: "copied", label: "Copied serial", hint: "Duplicate sale records", input: { serial: "PT-8842-0002", selectedPharmacyId: "PH-02" } },
  { key: "expired", label: "Expired pack", hint: "Batch NIM-PAR-8830", input: { serial: "PT-8830-0007", selectedPharmacyId: "PH-05" } },
  { key: "recalled", label: "Recalled pack", hint: "Batch AUR-CFX-3390", input: { serial: "PT-3390-0011", selectedPharmacyId: "PH-01" } },
  { key: "unknown", label: "Unknown serial", hint: "Not in ledger", input: { serial: "PT-0000-9999" } },
  { key: "missing", label: "Missing pack", hint: "Stock audit mismatch", input: { serial: "PT-3390-0012", selectedPharmacyId: "PH-03" } },
  { key: "stolen", label: "Stolen pack", hint: "FIR filed", input: { serial: "PT-1120-0004", selectedPharmacyId: "PH-06" } },
  { key: "mismatch", label: "Store mismatch", hint: "Sold at a different shop", input: { serial: "PT-8842-0009", selectedPharmacyId: "PH-01" } },
  { key: "review", label: "Under review", hint: "Cold-chain deviation", input: { serial: "PT-1120-0005", selectedPharmacyId: "PH-04" } },
  { key: "outage", label: "Service failure", hint: "Ledger unreachable", input: { serial: "PT-8842-0001", simulate: "service-failure" } },
  { key: "unreadable", label: "Package unreadable", hint: "Damaged code", input: { serial: "??", simulate: "unreadable" } },
  { key: "correction", label: "Billing correction", hint: "Voided then re-sold", input: { serial: "PT-8842-0021", selectedPharmacyId: "PH-01" } },
];
