import Link from "next/link";

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
];

export default function PonderingsPage() {
  return (
    <div className="min-h-full bg-parchment-50">
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
