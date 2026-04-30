import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Entry {
  commit: string;
  title: string;
  body: string;
}

const entries: Entry[] = [
  {
    commit: "Commit 1",
    title: "Scaffold",
    body: "Stood up the Next.js app with TypeScript and Tailwind. Nothing to look at yet — just the foundation stones.",
  },
  {
    commit: "Commit 2",
    title: "The Database",
    body: "Originally planned SQLite for simplicity, but switched to Neon Postgres midway — better story for Vercel deploy and the demo. Hit an ESM bug with Prisma 7 on Node 22, so pinned to v6. Also discovered Prisma CLI ignores .env.local, so added dotenv-cli to bridge the gap. Small tax for a cleaner setup.",
  },
  {
    commit: "Commit 3",
    title: "CRUD & First Life",
    body: "Built out the full REST API — boards, columns, cards. Realized immediately that an empty board is a terrible demo. Added a seed script so there's something to look at from the first page load. This was the moment the app started feeling real.",
  },
  {
    commit: "Commit 4",
    title: "The Parchment",
    body: "First pass at the UI was dark gunmetal — looked like every generic dashboard ever made. Scrapped it. The project is called Mosaic, named after Ravenna's Byzantine mosaics. Leaned into that: warm parchment palette, Cormorant Garamond for display type, soft warm shadows. Built a proper design system with reusable Surface and Tile primitives so the aesthetic stays consistent as we grow. Currently watching Knight of the Seven Kingdoms, so the seed data became a Small Council kanban board. Sometimes the vibe finds you.",
  },
  {
    commit: "Commit 5",
    title: "The Small Council",
    body: "Themed the seed data — Petitions, In Council, Awaiting the Crown, Decreed. Cards about dragon sightings, missing Masters of Coin, and the eternal Bracken-Blackwood dispute. Tags for Defense, Diplomacy, Coin, Smallfolk, Infrastructure. Comments from Grand Maester Orwyle and Lord Larys Strong. The demo has personality now.",
  },
  {
    commit: "Commit 6",
    title: "Card Editing & Archive",
    body: "Cards needed a way to be edited and soft-deleted. Gear icon on each card opens an edit modal — title, description, priority, archive. Two-step confirm on archive so you don't lose things by accident. Archive page at /archive lists everything that's been shelved, with a restore button. Modals use a portal to escape column stacking contexts.",
  },
  {
    commit: "Commit 7",
    title: "Comments",
    body: "Full comments vertical — card detail page at /cards/[id], comment list, post form, hard delete. Considered adding mock authors (Rhaenyra, Otto Hightower) but no auth = no author. Less friction. Cmd+Enter submits. Hard delete on comments — normally I'd soft delete since comments might have likes or replies, but simplicity wins for a demo.",
  },
  {
    commit: "Commit 8",
    title: "Drag & Drop",
    body: "Cards move between columns now. Used @hello-pangea/dnd with optimistic state updates — card snaps instantly, API persists in the background. Pondered whether optimistic is right here. For likes, sure. For reordering? If the API fails, the board is silently out of sync. The right answer is probably optimistic + rollback on error, not pessimistic. Portaled the dragged card to document.body so it floats above column stacking contexts.",
  },
  {
    commit: "Commit 9",
    title: "Tags",
    body: "Tag management modal — create with color picker, delete with a guard. API returns 409 if you try to delete a tag that's in use. Disabled trash icon + tooltip on the frontend too. Both create and edit card modals now have a tag picker — toggle pills on and off. Tags sync via a PUT that replaces all assignments in a transaction.",
  },
  {
    commit: "Commit 10",
    title: "Filters",
    body: "Filter by priority and tag — toggle pills in a bar below the nav. Debated whether to build a separate /api/cards endpoint with filters or just add query params to the existing board-by-id GET that already includes cards. Went with the latter — the board endpoint already returns nested columns and cards, so adding ?priority=HIGH&tagId=abc filters at the Prisma level was natural. No new endpoint, no new data shape. Client-side filtering stays for instant toggling; the API filters exist for external consumers and to satisfy the 'listing with filters' requirement.",
  },
];

export default function PonderingsPage() {
  return (
    <div className="h-full overflow-y-auto bg-parchment-50">
      <div className="max-w-2xl mx-auto px-8 py-16">
        <header className="mb-12 animate-fade-in">
          <Link
            href="/"
            className="text-xs font-body font-medium text-parchment-400 hover:text-terracotta transition-colors"
          >
            &larr; Back to the board
          </Link>

          <h1 className="font-display text-3xl font-semibold text-parchment-800 mt-6">
            Ponderings
          </h1>
          <p className="font-body text-sm text-parchment-500 mt-2 leading-relaxed">
            Notes on building Mosaic — the decisions, the dead ends, and the
            small satisfactions of getting something right.
          </p>
          <div className="h-px mt-6 bg-gradient-to-r from-parchment-300 to-transparent" />
        </header>

        <div className="space-y-10">
          {entries.map((entry, i) => (
            <article
              key={entry.commit}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[10px] font-body font-semibold uppercase tracking-[0.12em] text-parchment-400">
                  {entry.commit}
                </span>
                <div className="h-px flex-1 bg-parchment-200" />
              </div>

              <h2 className="font-display text-lg font-semibold text-parchment-800 mb-2">
                {entry.title}
              </h2>

              <p className="font-body text-sm text-parchment-600 leading-relaxed">
                {entry.body}
              </p>
            </article>
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
