import Link from 'next/link'

export interface ChallengeCardProps {
  title: string
  description?: string
  href: string
}

export function ChallengeCard({ title, description, href }: ChallengeCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-zinc-300 dark:border-zinc-800 p-4 hover:border-blue-500 hover:shadow-sm transition"
    >
      <h3 className="text-base font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </Link>
  )
}

export default ChallengeCard
