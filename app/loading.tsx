export default function Loading() {
  return (
    <main role="status" aria-live="polite" aria-label="Loading page" className="flex min-h-[65vh] items-center justify-center px-4 pt-20">
      <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-palm-green/20 border-t-palm-green motion-reduce:animate-none" aria-hidden="true" />
        Loading page…
      </div>
    </main>
  );
}
