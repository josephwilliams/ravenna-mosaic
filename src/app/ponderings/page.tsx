import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { backLinkClass } from "@/lib/styles";
import { PonderingEntry } from "@/components/PonderingEntry";

interface Entry {
  commit: string;
  title: string;
  body: string;
}

const entries: Entry[] = [
  {
    commit: "Commit 2",
    title: "The Database",
    body: "Went with Neon Postgres for the database. Good fit for Vercel deploy and the demo. Used to Supabase in recent projects and wanted to try something new. Prisma's ORM syntax is clean and expressive.",
  },
  {
    commit: "Commit 4",
    title: "The Parchment",
    body: "First pass at the UI was dark gunmetal. Looked like every generic dashboard ever made. Scrapped it. The project was originally called Mosaic, after Ravenna's Byzantine mosaics. Leaned into that: warm parchment palette, Cormorant Garamond for display type, soft warm shadows. Built a proper design system with reusable Surface and Tile primitives so the aesthetic stays consistent as we grow. Currently watching Knight of the Seven Kingdoms, so the seed data became a Small Council kanban board. Sometimes the vibe finds you.",
  },
  {
    commit: "Commit 7",
    title: "Comments",
    body: "Was thinking about adding mock characters as comment authors (Rhaenyra, Otto Hightower) but no auth means no author. Less friction. Hard delete on comments. Normally I'd soft delete since comments might have likes or replies, but simplicity wins for a demo.",
  },
  {
    commit: "Commit 8",
    title: "Drag & Drop",
    body: "Optimistic state updates. Card snaps instantly, API persists in the background. Pondered whether optimistic is right here. For likes, sure. For reordering? If the API fails, the board is silently out of sync. Probably optimistic + rollback on error, not pessimistic.",
  },
  {
    commit: "Commit 10",
    title: "Filters",
    body: "Debated whether to build a separate /api/cards endpoint with filters or just add query params to the existing board GET. Went with the latter. The board endpoint already returns nested columns and cards, so ?priority=HIGH&tagId=abc at the Prisma level was natural.",
  },
  {
    commit: "Commit 11",
    title: "The Checklist",
    body: "Re-read the original requirements and realized we're missing tests and keyboard accessibility. Time to stop shipping features and shore up the foundation.",
  },
  {
    commit: "Commit 12",
    title: "Grouping",
    body: "Went with 'group by urgency'. Sorts cards within each column by priority. Most obvious grouping mechanic. Grouping by tag could also work, or chronological sort by creation date. Another optimistic state change: UI reorders instantly, batch PATCH persists per column in the background.",
  },
  {
    commit: "Commit 13",
    title: "Logging",
    body: "Wanted a decorator pattern. withLogging wrapping each route handler, reusable for Sentry, PostHog, whatever analytics. Ended up using Next.js middleware instead since it's one file for all routes. The decorator idea still holds for per-handler concerns. Worth noting: Vercel swallows console.log in prod, so this would need a real transport (PostHog, Sentry, Axiom) to be useful beyond local dev.",
  },
  {
    commit: "Commit 15",
    title: "Pagination",
    body: "Went with offset/limit (skip/take) pagination on column cards. Columns load 5 cards initially with a 'show more' button to fetch the next 5. Considered cursor-based pagination but it's overkill here. No infinite scroll, no virtual lists. The board is a kanban, not a feed. If a column has 50 cards you have bigger problems than pagination strategy.",
  },
];

export default function PonderingsPage() {
  return (
    <div className="h-full overflow-y-auto bg-parchment-50">
      <div className="max-w-2xl mx-auto px-8 py-16">
        <header className="mb-12 animate-fade-in">
          <Link href="/" className={backLinkClass}>
            <ArrowLeft size={13} strokeWidth={1.5} />
            Back to the board
          </Link>

          <h1 className="font-display text-3xl font-semibold text-parchment-800 mt-6">
            Ponderings
          </h1>
          <p className="font-body text-sm text-parchment-500 mt-2 leading-relaxed">
            Notes on building The Small Council.
          </p>
          <div className="h-px mt-6 bg-gradient-to-r from-parchment-300 to-transparent" />
        </header>

        <div className="space-y-10">
          {entries.map((entry, i) => (
            <PonderingEntry key={entry.commit} {...entry} index={i} />
          ))}
        </div>

        <footer className="mt-16 pt-6 border-t border-parchment-200">
          <p className="font-body text-xs text-parchment-400 italic">
            More to come as the build continues.
          </p>
        </footer>
      </div>
    </div>
  );
}
