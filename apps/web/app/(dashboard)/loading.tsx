function LoadingBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={[
        "animate-pulse rounded-xl bg-slate-800",
        className,
      ].join(" ")}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Carregando conteúdo"
      className="space-y-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <LoadingBlock className="h-4 w-28" />
          <LoadingBlock className="h-9 w-56" />
          <LoadingBlock className="h-5 w-80 max-w-full" />
        </div>

        <LoadingBlock className="h-11 w-40" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center justify-between">
              <LoadingBlock className="h-4 w-28" />
              <LoadingBlock className="size-10" />
            </div>

            <LoadingBlock className="mt-6 h-10 w-20" />
            <LoadingBlock className="mt-4 h-4 w-full" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <LoadingBlock className="h-6 w-52" />
          <LoadingBlock className="mt-3 h-4 w-72 max-w-full" />
          <LoadingBlock className="mt-8 h-72 w-full" />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <LoadingBlock className="h-6 w-44" />
          <LoadingBlock className="mt-3 h-4 w-64 max-w-full" />

          <div className="mt-8 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3"
              >
                <LoadingBlock className="size-10 shrink-0" />

                <div className="flex-1 space-y-2">
                  <LoadingBlock className="h-4 w-4/5" />
                  <LoadingBlock className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-6">
          <LoadingBlock className="h-6 w-48" />
          <LoadingBlock className="mt-3 h-4 w-80 max-w-full" />
        </div>

        <div className="space-y-4 p-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-4 border-b border-slate-800 pb-4 md:grid-cols-3"
            >
              <LoadingBlock className="h-5 w-32" />
              <LoadingBlock className="h-5 w-20" />
              <LoadingBlock className="h-5 w-full" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Carregando...</span>
    </div>
  );
}