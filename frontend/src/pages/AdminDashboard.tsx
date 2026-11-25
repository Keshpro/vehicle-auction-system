import { BadgeCheck, ClipboardList, FileBarChart, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const adminPages = [
  {
    path: "/admin/users",
    title: "User Management",
    description: "View accounts, roles, and account status.",
    buttonLabel: "View Users",
    Icon: UsersRound,
  },
  {
    path: "/admin/bidders",
    title: "Bidder Approval",
    description: "Review and approve pending bidders.",
    buttonLabel: "Review Bidders",
    Icon: BadgeCheck,
  },
  {
    path: "/admin/reports",
    title: "Reports Dashboard",
    description: "Track auction results, bidding activity, and sales.",
    buttonLabel: "View Reports",
    Icon: FileBarChart,
  },
  {
    path: "/admin/audit-logs",
    title: "Audit Logs",
    description: "Search and filter recorded auction system activity.",
    buttonLabel: "View Audit Logs",
    Icon: ClipboardList,
  },
];

export default function AdminDashboard() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
        Admin Dashboard
      </h1>

      <div className="grid gap-5 md:grid-cols-2">
        {adminPages.map(({ path, title, description, buttonLabel, Icon }) => (
          <article
            key={path}
            className="flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <Icon aria-hidden="true" className="mb-4 h-9 w-9 text-red-600" />
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="mb-5 mt-2 text-slate-600">{description}</p>
            <Link
              to={path}
              className="mt-auto inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              {buttonLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
