import { Banknote, BarChart3, Car, CheckCircle2, FileBarChart, Gavel, Percent } from "lucide-react";
import { useState } from "react";
import {
  buttonClass, inputClass, Pagination, primaryClass, ReportingFilters,
} from "../components/ReportingControls";
import { formatDatabaseDate } from "../formatReportingDate";
import { generateReport, getReports, type AuctionReport, type ReportQuery } from "../services/reportingService";
import { useReportingPage } from "../services/useReportingPage";

const initialQuery: ReportQuery = { page: 1, pageSize: 10, search: "", from: "", to: "", minBids: 0 };
const whole = new Intl.NumberFormat("en-LK");
const money = new Intl.NumberFormat("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percentage = new Intl.NumberFormat("en-LK", { style: "percent", maximumFractionDigits: 1 });
const panel = "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm";

function AuctionCharts({ items }: { items: AuctionReport[] }) {
  const maxRevenue = Math.max(0, ...items.map((item) => item.salesTotal));
  return (
    <section className={`${panel} p-4 sm:p-5`} aria-labelledby="revenue-heading">
      <h2 id="revenue-heading" className="font-bold">Sales revenue by auction</h2>
      <p className="mt-1 text-sm text-slate-600">Auctions on this page</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
        {items.map((item) => (
          <li key={item.auctionId} className="min-w-0">
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="min-w-0 truncate" title={item.title}>{item.title}</span>
              <span className="shrink-0 font-semibold tabular-nums">{money.format(item.salesTotal)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
              <div className="h-full rounded-full bg-red-700"
                style={{ width: `${maxRevenue ? item.salesTotal / maxRevenue * 100 : 0}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ReportsDashboard() {
  const [draft, setDraft] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [generation, setGeneration] = useState<{ status: "pending" | "success" | "error"; message: string }>();
  const { data, error, loading, retry } = useReportingPage(query, getReports);
  const summary = data?.summary;
  const cards = summary ? [
    { label: "Auctions", value: whole.format(summary.auctionCount), Icon: Gavel },
    { label: "Vehicle lots", value: whole.format(summary.lotCount), Icon: Car },
    { label: "Sold lots", value: whole.format(summary.soldLotCount), Icon: CheckCircle2 },
    { label: "Total bids", value: whole.format(summary.bidCount), Icon: BarChart3 },
    { label: "Sales revenue", value: money.format(summary.salesTotal), Icon: Banknote },
    { label: "Sale rate", value: summary.lotCount ? percentage.format(summary.soldLotCount / summary.lotCount) : "—", Icon: Percent },
  ] : [];

  async function generate() {
    if (!data || generation?.status === "pending") return;
    setGeneration({ status: "pending", message: "" });
    try {
      const report = await generateReport({ ...query, from: data.from, to: data.to });
      const count = report.summary.auctionCount;
      setGeneration({ status: "success", message: `Report generated for ${whole.format(count)} ${count === 1 ? "auction" : "auctions"}. Activity recorded in Audit Logs.` });
      retry();
    } catch (error) {
      setGeneration({ status: "error", message: error instanceof TypeError
        ? "Could not reach the reporting service." : error instanceof Error ? error.message : "Could not generate the report." });
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-5 py-8 text-slate-900 md:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Reports Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Auction performance, bidding activity, and sales.</p>
        </div>
        <button type="button" className={primaryClass}
          disabled={!data || generation?.status === "pending"} onClick={() => void generate()}>
          <FileBarChart size={17} aria-hidden="true" />
          {generation?.status === "pending" ? "Generating…" : "Generate Report"}
        </button>
      </header>

      <ReportingFilters draft={draft} setDraft={setDraft} searchPlaceholder="Auction title"
        onApply={() => { setQuery({ ...draft, page: 1 }); }}
        onReset={() => { setDraft(initialQuery); setQuery({ ...initialQuery }); }}>
        <label className="text-sm font-medium">
          Minimum bids
          <input className={inputClass} type="number" min={0} max={2147483647} step={1}
            value={draft.minBids} onChange={(event) => setDraft({ ...draft, minBids: Number(event.target.value) })} />
        </label>
      </ReportingFilters>

      {generation?.message && (
        <p role={generation.status === "error" ? "alert" : "status"}
          className={`rounded-lg border p-3 text-sm ${generation.status === "error" ? "border-red-200 bg-red-50 text-red-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>
          {generation.message}
        </p>
      )}
      {loading && <p role="status" className={`${panel} p-5`}>Loading reports…</p>}
      {error && (
        <div role="alert" className={`${panel} flex flex-wrap items-center justify-between gap-3 p-4`}>
          <p className="text-sm text-red-900">{error}</p>
          <button type="button" className={buttonClass} onClick={retry}>Retry</button>
        </div>
      )}

      {data && (
        <>
          <p className="text-sm text-slate-600">Reporting period {data.from} to before {data.to}</p>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {cards.map(({ label, value, Icon }) => (
              <div key={label} className={`${panel} p-3 sm:p-4`}>
                <Icon aria-hidden="true" size={19} className="mb-3 text-red-700" />
                <dt className="text-xs font-semibold text-slate-600 sm:text-sm">{label}</dt>
                <dd className="mt-1 break-words font-bold tabular-nums sm:text-lg">{value}</dd>
              </div>
            ))}
          </dl>
          {data.items.length > 0 && <AuctionCharts items={data.items} />}
          <section className={panel} aria-labelledby="auction-results-heading">
            <h2 id="auction-results-heading" className="p-4 font-bold">Auction results</h2>
            {data.items.length === 0 ? <p className="px-4 pb-4 text-sm text-slate-600">No auctions match this page and its filters.</p> : (
              <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Auction results table">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>{["Auction", "Start date", "Status", "Lots", "Sold", "Bids", "Sales revenue", "Avg. bid", "Sale rate"].map((header) => (
                      <th key={header} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">{header}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.items.map((item) => (
                      <tr key={item.auctionId} className="hover:bg-slate-50">
                        <th scope="row" className="px-4 py-3 text-left font-semibold">{item.title}</th>
                        <td className="whitespace-nowrap px-4 py-3">{formatDatabaseDate(item.startsAt)}</td>
                        <td className="px-4 py-3">{item.status}</td>
                        <td className="px-4 py-3">{whole.format(item.lotCount)}</td>
                        <td className="px-4 py-3">{whole.format(item.soldLotCount)}</td>
                        <td className="px-4 py-3">{whole.format(item.bidCount)}</td>
                        <td className="px-4 py-3 tabular-nums">{money.format(item.salesTotal)}</td>
                        <td className="px-4 py-3 tabular-nums">{item.averageBid === null ? "—" : money.format(item.averageBid)}</td>
                        <td className="px-4 py-3 tabular-nums">{item.saleRatePct === null ? "—" : percentage.format(item.saleRatePct / 100)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={data.page} hasMore={data.hasMore} onPage={(page) => setQuery({ ...query, page })} />
          </section>
        </>
      )}
    </section>
  );
}
