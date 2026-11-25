export interface PageQuery {
  page: number;
  pageSize: number;
  search: string;
  from: string;
  to: string;
}

export interface ReportQuery extends PageQuery {
  minBids: number;
}

export interface AuditQuery extends PageQuery {
  action: string;
  entityType: string;
}

export interface AuctionReport {
  auctionId: number;
  title: string;
  startsAt: string;
  status: string;
  lotCount: number;
  soldLotCount: number;
  bidCount: number;
  salesTotal: number;
  averageBid: number | null;
  saleRatePct: number | null;
}

export interface AuditEntry {
  auditLogId: number;
  actorUserId: number | null;
  actorName: string | null;
  action: string;
  entityType: string;
  entityId: number | null;
  createdAt: string;
}

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ReportPage extends Page<AuctionReport> {
  from: string;
  to: string;
  summary: {
    auctionCount: number;
    lotCount: number;
    soldLotCount: number;
    bidCount: number;
    salesTotal: number;
  };
}

const api = "http://localhost:5000/api/admin";

function cleanQuery(query: PageQuery) {
  return Object.fromEntries(
    Object.entries(query)
      .map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
      .filter(([, value]) => value !== ""),
  );
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${api}/${path}`, { ...options, credentials: "include" });
  if (response.status === 401) throw new Error("Your session expired. Sign in again.");
  if (response.status === 403) throw new Error("This page requires an admin account.");
  if (response.status === 400) {
    const problem = await response.json().catch(() => null);
    const errors = problem?.errors as Record<string, string[]> | undefined;
    throw new Error(errors ? Object.values(errors).flat().join(" ") : "Check the filters and try again.");
  }
  if (!response.ok) throw new Error("The reporting service is unavailable. Try again.");
  return response.json();
}

export function getReports(query: ReportQuery, signal: AbortSignal) {
  return request<ReportPage>(`reports?${new URLSearchParams(cleanQuery(query))}`, { signal });
}

export function getAuditLogs(query: AuditQuery, signal: AbortSignal) {
  return request<Page<AuditEntry>>(`audit-logs?${new URLSearchParams(cleanQuery(query))}`, { signal });
}

export function generateReport(query: ReportQuery) {
  return request<ReportPage>("reports/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cleanQuery(query)),
  });
}
