import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import type { PageQuery } from "../services/reportingService";

export const inputClass =
  "mt-1 block min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-red-600";
export const buttonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45";
export const primaryClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-45";

interface FilterProps<T extends PageQuery> {
  draft: T;
  setDraft: (draft: T) => void;
  onApply: () => void;
  onReset: () => void;
  searchPlaceholder: string;
  children?: ReactNode;
}

export function ReportingFilters<T extends PageQuery>({
  draft, setDraft, onApply, onReset, searchPlaceholder, children,
}: FilterProps<T>) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply();
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium lg:col-span-2">
          Search
          <input className={inputClass} type="search" maxLength={150} placeholder={searchPlaceholder}
            value={draft.search} onChange={(event) => setDraft({ ...draft, search: event.target.value })} />
        </label>
        <label className="text-sm font-medium">
          From date
          <input className={inputClass} type="date" min="1000-01-01" max="9999-12-31"
            value={draft.from} onChange={(event) => setDraft({ ...draft, from: event.target.value })} />
        </label>
        <label className="text-sm font-medium">
          Before date
          <input className={inputClass} type="date" min="1000-01-01" max="9999-12-31"
            value={draft.to} onChange={(event) => setDraft({ ...draft, to: event.target.value })} />
        </label>
        {children}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className={primaryClass} type="submit"><Search size={16} aria-hidden="true" />Apply filters</button>
        <button className={buttonClass} type="button" onClick={onReset}>Reset</button>
      </div>
    </form>
  );
}

export function Pagination({ page, hasMore, onPage }: {
  page: number; hasMore: boolean; onPage: (page: number) => void;
}) {
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3">
      <span className="text-sm text-slate-600">Page {page}</span>
      <div className="flex gap-2">
        <button className={buttonClass} type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={16} aria-hidden="true" />Previous
        </button>
        <button className={buttonClass} type="button" disabled={!hasMore} onClick={() => onPage(page + 1)}>
          Next<ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
