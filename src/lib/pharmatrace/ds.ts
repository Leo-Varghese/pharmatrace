export type PackStatus =
  | "MANUFACTURED"
  | "IN_TRANSIT"
  | "IN_STOCK"
  | "SOLD"
  | "EXPIRED"
  | "RECALLED"
  | "MISSING"
  | "STOLEN"
  | "QUARANTINED"
  | "UNDER_REVIEW";

export type Manufacturer = { id: string; name: string; city: string; license: string };

export type Pharmacy = {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  googleRating: number;
  googleReviews: number;
  trustScore: number; // PharmaTrace trust score — separate from Google rating
  verifications: number;
  license: string;
};

export type Batch = {
  id: string;
  batchNo: string;
  productName: string;
  manufacturerId: string;
  manufacturedAt: string;
  expiresAt: string;
};

export type Pack = {
  serial: string;
  batchId: string;
  status: PackStatus;
  holderId: string; // manufacturer or pharmacy id
  note?: string;
};

export type Shipment = {
  id: string;
  fromId: string;
  toId: string;
  serials: string[];
  dispatchedAt: string;
  receivedAt?: string;
  status: "IN_TRANSIT" | "RECEIVED";
};

export type Transfer = {
  id: string;
  fromId: string;
  toId: string;
  serials: string[];
  initiatedAt: string;
  confirmedAt?: string;
  status: "PENDING" | "CONFIRMED";
};

export type Sale = {
  id: string;
  serial: string;
  pharmacyId: string;
  soldAt: string;
  voided?: boolean;
  voidReason?: string;
};

export type Recall = { id: string; batchId: string; reason: string; issuedAt: string };

export type Alert = {
  id: string;
  serial: string;
  type: string;
  severity: "High" | "Medium" | "Low";
  pharmacyId?: string;
  city: string;
  medicine: string;
  raisedAt: string;
  status: "Flagged" | "Under review" | "Resolved";
};

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  entity: string;
  details: string;
};

export type ScanLog = { day: string; scans: number; counterfeits: number };

export type Database = {
  manufacturers: Manufacturer[];
  pharmacies: Pharmacy[];
  batches: Batch[];
  packs: Pack[];
  shipments: Shipment[];
  transfers: Transfer[];
  sales: Sale[];
  recalls: Recall[];
  alerts: Alert[];
  audit: AuditEntry[];
  scanTrend: ScanLog[];
  serviceOnline: boolean;
};

const T = (d: string) => `2026-0${d}`;

export function seedDatabase(): Database {
  const manufacturers: Manufacturer[] = [
    { id: "MFR-01", name: "Aurora Pharma Labs", city: "Ahmedabad", license: "MFG/GJ/2019/8841" },
    { id: "MFR-02", name: "Nimbus Biotech", city: "Hyderabad", license: "MFG/TS/2021/1177" },
  ];

  const pharmacies: Pharmacy[] = [
    {
      id: "PH-01",
      name: "Sanjeevani Medical Store",
      address: "12 Tonk Road, Lalkothi, Jaipur",
      city: "Jaipur",
      lat: 26.8955,
      lng: 75.8012,
      googleRating: 4.6,
      googleReviews: 412,
      trustScore: 94,
      verifications: 1284,
      license: "RJ-RTL-2020-0431",
    },
    {
      id: "PH-02",
      name: "MediPoint Pharmacy",
      address: "C-Scheme, Ashok Marg, Jaipur",
      city: "Jaipur",
      lat: 26.9146,
      lng: 75.7999,
      googleRating: 4.2,
      googleReviews: 233,
      trustScore: 81,
      verifications: 742,
      license: "RJ-RTL-2018-0912",
    },
    {
      id: "PH-03",
      name: "Shree Ram Chemists",
      address: "Malviya Nagar Sector 4, Jaipur",
      city: "Jaipur",
      lat: 26.8505,
      lng: 75.8054,
      googleRating: 3.4,
      googleReviews: 96,
      trustScore: 38,
      verifications: 118,
      license: "RJ-RTL-2022-1180",
    },
    {
      id: "PH-04",
      name: "CityCare Drug House",
      address: "Vaishali Nagar Amrapali Circle, Jaipur",
      city: "Jaipur",
      lat: 26.9124,
      lng: 75.7373,
      googleRating: 4.8,
      googleReviews: 601,
      trustScore: 47,
      verifications: 305,
      license: "RJ-RTL-2017-0233",
    },
    {
      id: "PH-05",
      name: "Rajdhani Medicos",
      address: "Bapu Bazaar, Pink City, Jaipur",
      city: "Jaipur",
      lat: 26.9182,
      lng: 75.8226,
      googleRating: 4.1,
      googleReviews: 187,
      trustScore: 88,
      verifications: 566,
      license: "RJ-RTL-2019-0774",
    },
    {
      id: "PH-06",
      name: "Nirogi Pharmacy Hub",
      address: "Mansarovar Madhyam Marg, Jaipur",
      city: "Jaipur",
      lat: 26.8489,
      lng: 75.7669,
      googleRating: 3.8,
      googleReviews: 64,
      trustScore: 52,
      verifications: 91,
      license: "RJ-RTL-2023-1502",
    },
  ];

  const batches: Batch[] = [
    {
      id: "B-1",
      batchNo: "AUR-AMX-2451",
      productName: "Amoxicillin 500mg",
      manufacturerId: "MFR-01",
      manufacturedAt: T("2-04T09:12:00Z"),
      expiresAt: "2028-01-31T00:00:00Z",
    },
    {
      id: "B-2",
      batchNo: "NIM-PAR-8830",
      productName: "Paracetamol 650mg",
      manufacturerId: "MFR-02",
      manufacturedAt: T("1-18T11:40:00Z"),
      expiresAt: "2026-04-30T00:00:00Z",
    },
    {
      id: "B-3",
      batchNo: "AUR-CFX-3390",
      productName: "Cefixime 200mg",
      manufacturerId: "MFR-01",
      manufacturedAt: T("3-02T08:05:00Z"),
      expiresAt: "2027-11-30T00:00:00Z",
    },
    {
      id: "B-4",
      batchNo: "NIM-INS-1120",
      productName: "Insulin Glargine 100IU",
      manufacturerId: "MFR-02",
      manufacturedAt: T("2-21T14:22:00Z"),
      expiresAt: "2027-02-28T00:00:00Z",
    },
  ];

  const packs: Pack[] = [
    { serial: "PT-8842-0001", batchId: "B-1", status: "SOLD", holderId: "PH-01" },
    { serial: "PT-8842-0002", batchId: "B-1", status: "SOLD", holderId: "PH-02" },
    { serial: "PT-8830-0007", batchId: "B-2", status: "SOLD", holderId: "PH-05" },
    { serial: "PT-3390-0011", batchId: "B-3", status: "RECALLED", holderId: "PH-01" },
    { serial: "PT-3390-0012", batchId: "B-3", status: "MISSING", holderId: "PH-03" },
    { serial: "PT-1120-0004", batchId: "B-4", status: "STOLEN", holderId: "PH-06" },
    { serial: "PT-1120-0005", batchId: "B-4", status: "UNDER_REVIEW", holderId: "PH-04" },
    { serial: "PT-8842-0009", batchId: "B-1", status: "SOLD", holderId: "PH-05" },
    { serial: "PT-8842-0021", batchId: "B-1", status: "SOLD", holderId: "PH-01" },
    { serial: "PT-8842-0022", batchId: "B-1", status: "IN_STOCK", holderId: "PH-02" },
    { serial: "PT-3390-0030", batchId: "B-3", status: "IN_TRANSIT", holderId: "MFR-01" },
    { serial: "PT-8830-0044", batchId: "B-2", status: "QUARANTINED", holderId: "PH-02", note: "Customer return" },
  ];

  const shipments: Shipment[] = [
    {
      id: "SHP-1001",
      fromId: "MFR-01",
      toId: "PH-01",
      serials: ["PT-8842-0001", "PT-8842-0021", "PT-3390-0011"],
      dispatchedAt: T("2-06T06:30:00Z"),
      receivedAt: T("2-08T10:15:00Z"),
      status: "RECEIVED",
    },
    {
      id: "SHP-1002",
      fromId: "MFR-01",
      toId: "PH-02",
      serials: ["PT-8842-0002"],
      dispatchedAt: T("2-06T06:30:00Z"),
      receivedAt: T("2-09T09:02:00Z"),
      status: "RECEIVED",
    },
    {
      id: "SHP-1003",
      fromId: "MFR-02",
      toId: "PH-05",
      serials: ["PT-8830-0007", "PT-8842-0009"],
      dispatchedAt: T("1-22T07:00:00Z"),
      receivedAt: T("1-24T12:45:00Z"),
      status: "RECEIVED",
    },
    {
      id: "SHP-1004",
      fromId: "MFR-01",
      toId: "PH-03",
      serials: ["PT-3390-0012"],
      dispatchedAt: T("3-04T05:50:00Z"),
      receivedAt: T("3-06T11:20:00Z"),
      status: "RECEIVED",
    },
    {
      id: "SHP-1005",
      fromId: "MFR-02",
      toId: "PH-06",
      serials: ["PT-1120-0004"],
      dispatchedAt: T("2-25T06:10:00Z"),
      receivedAt: T("2-27T08:40:00Z"),
      status: "RECEIVED",
    },
    {
      id: "SHP-1006",
      fromId: "MFR-02",
      toId: "PH-04",
      serials: ["PT-1120-0005"],
      dispatchedAt: T("3-01T06:10:00Z"),
      receivedAt: T("3-03T09:30:00Z"),
      status: "RECEIVED",
    },
    {
      id: "SHP-1007",
      fromId: "MFR-01",
      toId: "PH-05",
      serials: ["PT-3390-0030"],
      dispatchedAt: T("3-09T05:20:00Z"),
      status: "IN_TRANSIT",
    },
  ];

  const transfers: Transfer[] = [
    {
      id: "TRF-501",
      fromId: "PH-01",
      toId: "PH-05",
      serials: ["PT-8842-0009"],
      initiatedAt: T("2-14T10:00:00Z"),
      confirmedAt: T("2-14T15:30:00Z"),
      status: "CONFIRMED",
    },
    {
      id: "TRF-502",
      fromId: "PH-02",
      toId: "PH-01",
      serials: ["PT-8842-0022"],
      initiatedAt: T("3-10T09:15:00Z"),
      status: "PENDING",
    },
  ];

  const sales: Sale[] = [
    { id: "SAL-9001", serial: "PT-8842-0001", pharmacyId: "PH-01", soldAt: T("2-12T16:04:00Z") },
    // Copied serial: same serial recorded sold twice at two different pharmacies
    { id: "SAL-9002", serial: "PT-8842-0002", pharmacyId: "PH-02", soldAt: T("2-13T11:20:00Z") },
    { id: "SAL-9003", serial: "PT-8842-0002", pharmacyId: "PH-03", soldAt: T("2-13T18:55:00Z") },
    // Expired batch pack sold before expiry, scanned after
    { id: "SAL-9004", serial: "PT-8830-0007", pharmacyId: "PH-05", soldAt: T("2-02T13:10:00Z") },
    // Store mismatch scenario: sold at PH-05 but consumer selects another store
    { id: "SAL-9005", serial: "PT-8842-0009", pharmacyId: "PH-05", soldAt: T("3-05T12:00:00Z") },
    // Billing correction: original sale voided, corrected sale re-recorded
    {
      id: "SAL-9006",
      serial: "PT-8842-0021",
      pharmacyId: "PH-01",
      soldAt: T("3-11T10:05:00Z"),
      voided: true,
      voidReason: "Billing correction — wrong counter operator",
    },
    { id: "SAL-9007", serial: "PT-8842-0021", pharmacyId: "PH-01", soldAt: T("3-11T10:26:00Z") },
  ];

  const recalls: Recall[] = [
    {
      id: "RCL-31",
      batchId: "B-3",
      reason: "Dissolution test failure detected in retained samples",
      issuedAt: T("3-08T07:00:00Z"),
    },
  ];

  const alerts: Alert[] = [
    {
      id: "ALR-01",
      serial: "PT-8842-0002",
      type: "Duplicate sale — cloned serial",
      severity: "High",
      pharmacyId: "PH-03",
      city: "Jaipur",
      medicine: "Amoxicillin 500mg",
      raisedAt: T("2-13T19:02:00Z"),
      status: "Flagged",
    },
    {
      id: "ALR-02",
      serial: "PT-3390-0012",
      type: "Pack reported missing from stock",
      severity: "High",
      pharmacyId: "PH-03",
      city: "Jaipur",
      medicine: "Cefixime 200mg",
      raisedAt: T("3-07T08:30:00Z"),
      status: "Flagged",
    },
    {
      id: "ALR-03",
      serial: "PT-1120-0004",
      type: "Theft reported in transit storage",
      severity: "High",
      pharmacyId: "PH-06",
      city: "Jaipur",
      medicine: "Insulin Glargine 100IU",
      raisedAt: T("3-02T21:12:00Z"),
      status: "Under review",
    },
    {
      id: "ALR-04",
      serial: "PT-1120-0005",
      type: "Cold-chain deviation — pack quarantined for review",
      severity: "Medium",
      pharmacyId: "PH-04",
      city: "Jaipur",
      medicine: "Insulin Glargine 100IU",
      raisedAt: T("3-04T14:44:00Z"),
      status: "Under review",
    },
  ];

  const audit: AuditEntry[] = [
    ...shipments.map((s, i) => ({
      id: `AUD-S${i}`,
      at: s.dispatchedAt,
      actor: s.fromId,
      action: "SHIPMENT_DISPATCHED",
      entity: s.id,
      details: `${s.serials.length} pack(s) dispatched to ${s.toId}`,
    })),
    ...shipments
      .filter((s) => s.receivedAt)
      .map((s, i) => ({
        id: `AUD-R${i}`,
        at: s.receivedAt!,
        actor: s.toId,
        action: "SHIPMENT_RECEIVED",
        entity: s.id,
        details: `${s.serials.length} pack(s) received from ${s.fromId}`,
      })),
    ...transfers.map((t, i) => ({
      id: `AUD-T${i}`,
      at: t.initiatedAt,
      actor: t.fromId,
      action: "TRANSFER_INITIATED",
      entity: t.id,
      details: `${t.serials.join(", ")} → ${t.toId}`,
    })),
    ...transfers
      .filter((t) => t.confirmedAt)
      .map((t, i) => ({
        id: `AUD-TC${i}`,
        at: t.confirmedAt!,
        actor: t.toId,
        action: "TRANSFER_CONFIRMED",
        entity: t.id,
        details: `Receipt confirmed for ${t.serials.join(", ")}`,
      })),
    ...sales.map((s, i) => ({
      id: `AUD-SL${i}`,
      at: s.soldAt,
      actor: s.pharmacyId,
      action: s.voided ? "SALE_VOIDED" : "SALE_RECORDED",
      entity: s.id,
      details: s.voided ? `${s.serial} — ${s.voidReason}` : `${s.serial} sold to patient`,
    })),
    {
      id: "AUD-COR1",
      at: T("3-11T10:24:00Z"),
      actor: "PH-01",
      action: "SALE_CORRECTED",
      entity: "SAL-9006",
      details: "Reversal recorded; pack PT-8842-0021 re-billed as SAL-9007. Original record preserved.",
    },
    {
      id: "AUD-RCL1",
      at: T("3-08T07:00:00Z"),
      actor: "MFR-01",
      action: "RECALL_ISSUED",
      entity: "RCL-31",
      details: "Batch AUR-CFX-3390 recalled — dissolution test failure",
    },
    {
      id: "AUD-MIS1",
      at: T("3-07T08:30:00Z"),
      actor: "PH-03",
      action: "PACK_REPORTED_MISSING",
      entity: "PT-3390-0012",
      details: "Stock audit mismatch reported by pharmacy",
    },
    {
      id: "AUD-THF1",
      at: T("3-02T21:12:00Z"),
      actor: "PH-06",
      action: "PACK_REPORTED_STOLEN",
      entity: "PT-1120-0004",
      details: "Break-in reported; police FIR JPR/2026/2211",
    },
    {
      id: "AUD-QAR1",
      at: T("3-06T17:00:00Z"),
      actor: "PH-02",
      action: "RETURN_QUARANTINED",
      entity: "PT-8830-0044",
      details: "Customer return placed in quarantine — not returned to sellable stock",
    },
  ].sort((a, b) => (a.at < b.at ? 1 : -1));

  const scanTrend: ScanLog[] = [
    { day: "Mon", scans: 412, counterfeits: 6 },
    { day: "Tue", scans: 488, counterfeits: 9 },
    { day: "Wed", scans: 531, counterfeits: 5 },
    { day: "Thu", scans: 604, counterfeits: 14 },
    { day: "Fri", scans: 712, counterfeits: 11 },
    { day: "Sat", scans: 845, counterfeits: 18 },
    { day: "Sun", scans: 623, counterfeits: 7 },
  ];

  return {
    manufacturers,
    pharmacies,
    batches,
    packs,
    shipments,
    transfers,
    sales,
    recalls,
    alerts,
    audit,
    scanTrend,
    serviceOnline: true,
  };
}

export const NOW = "2026-03-12T10:00:00Z";
