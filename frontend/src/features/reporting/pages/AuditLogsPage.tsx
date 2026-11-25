import { useState } from "react";
import { buttonClass, inputClass, Pagination, ReportingFilters } from "../components/ReportingControls";
import { formatDatabaseDate } from "../formatReportingDate";
import { getAuditLogs, type AuditQuery } from "../services/reportingService";
import { useReportingPage } from "../services/useReportingPage";

const initialQuery: AuditQuery = {
  page: 1, pageSize: 10, from: "", to: "", search: "", action: "", entityType: "",
};

export default function AuditLogsPage() {
  const [draft, setDraft] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const { data, error, loading, retry } = useReportingPage(query, getAuditLogs);

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-5 py-8 text-slate-900 md:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-600">Activity recorded by the auction system.</p>
      </header>

      <ReportingFilters draft={draft} setDraft={setDraft} searchPlaceholder="Actor, action, or entity"
        onApply={() => setQuery({ ...draft, page: 1 })}
        onReset={() => { setDraft(initialQuery); setQuery({ ...initialQuery }); }}>
        <label className="text-sm font-medium">
          Action
          <input className={inputClass} maxLength={100} list="reporting-audit-actions"
            placeholder="All actions" value={draft.action}
            onChange={(event) => setDraft({ ...draft, action: event.target.value })} />
          <datalist id="reporting-audit-actions">
            <option value="GENERATE_AUCTION_REPORT" />
            <option value="PUBLISH_AUCTION" />
            <option value="ACCOUNT_CREATED" />
          </datalist>
        </label>
        <label className="text-sm font-medium">
          Entity type
          <input className={inputClass} maxLength={50} placeholder="All entity types" value={draft.entityType}
            onChange={(event) => setDraft({ ...draft, entityType: event.target.value })} />
        </label>
      </ReportingFilters>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="audit-results-heading">
        <h2 id="audit-results-heading" className="p-4 font-bold">Activity history</h2>
        {loading && <p role="status" className="px-4 pb-4 text-sm text-slate-600">Loading audit logs…</p>}
        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4">
            <p className="text-sm text-red-900">{error}</p>
            <button type="button" className={buttonClass} onClick={retry}>Retry</button>
          </div>
        )}
        {data && (
          <>
            {data.items.length === 0 ? <p className="px-4 pb-4 text-sm text-slate-600">No audit entries match this page and its filters.</p> : (
              <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Audit activity table">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>{["Action", "Actor", "Entity", "Date"].map((header) => (
                      <th key={header} scope="col" className="px-4 py-3 font-semibold">{header}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.items.map((item) => (
                      <tr key={item.auditLogId} className="hover:bg-slate-50">
                        <th scope="row" className="px-4 py-3">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">{item.action}</span>
                        </th>
                        <td className="px-4 py-3">{item.actorName ?? (item.actorUserId === null ? "System" : `User #${item.actorUserId}`)}</td>
                        <td className="px-4 py-3">{item.entityType}{item.entityId === null ? "" : ` #${item.entityId}`}</td>
                        <td className="whitespace-nowrap px-4 py-3">{formatDatabaseDate(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination page={data.page} hasMore={data.hasMore} onPage={(page) => setQuery({ ...query, page })} />
          </>
        )}
      </section>
    </section>
  );
}
