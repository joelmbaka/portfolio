export default async function TaskDetailPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24">
      <h1 className="text-2xl font-semibold mb-2">Task: {taskId}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Detail page stub for future assignments.</p>
    </main>
  )
}
