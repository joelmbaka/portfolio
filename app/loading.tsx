export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page content"
      className="site-container pb-16 pt-28"
    >
      <span className="sr-only">Loading page content…</span>
      <div aria-hidden="true" className="animate-pulse space-y-6 motion-reduce:animate-none">
        <div className="h-3 w-32 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="max-w-3xl space-y-4">
          <div className="h-10 w-11/12 rounded-lg bg-gray-200 dark:bg-gray-800 sm:h-12 sm:w-3/4" />
          <div className="h-10 w-7/12 rounded-lg bg-gray-200 dark:bg-gray-800 sm:h-12" />
        </div>
        <div className="max-w-3xl space-y-3 pt-3">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="grid gap-5 pt-8 sm:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="space-y-5 rounded-3xl border border-gray-200 p-7 dark:border-gray-800"
            >
              <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
