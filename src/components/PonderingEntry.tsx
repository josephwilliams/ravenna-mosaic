interface PonderingEntryProps {
  commit: string;
  title: string;
  body: string;
  index: number;
}

export function PonderingEntry({ commit, title, body, index }: PonderingEntryProps) {
  return (
    <article
      className="animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-[10px] font-body font-semibold uppercase tracking-[0.12em] text-parchment-400">
          {commit}
        </span>
        <div className="h-px flex-1 bg-parchment-200" />
      </div>

      <h2 className="font-display text-lg font-semibold text-parchment-800 mb-2">
        {title}
      </h2>

      <p className="font-body text-sm text-parchment-600 leading-relaxed">
        {body}
      </p>
    </article>
  );
}
